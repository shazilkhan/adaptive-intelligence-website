/**
 * Operational alert dispatcher.
 *
 * Routes alerts to Slack and Email channels based on severity. Used by form
 * handlers (real-time failure alerts) and, later, by the scheduled detector
 * Lambda via the same interface.
 *
 * Phase 1 design notes:
 * - In-memory throttle (per-process). Adequate for Amplify SSR where the
 *   process is long-lived enough to dedupe most repeat failures during an
 *   incident. Will be upgraded to a DynamoDB-backed store in Phase 3 so
 *   dedupe survives across processes and Lambda invocations.
 * - Email adapter targets Resend (single HTTPS POST, no SDK). Swap to SES
 *   later by replacing only the sendEmail() function.
 * - Every dispatch is fire-and-forget at the call site. This module never
 *   throws to its caller — alerting failures must not break user requests.
 *
 * See docs/DOWNTIME-DETECTOR-DESIGN.md for the broader architecture.
 */

const DEFAULT_COOLDOWN_SEC = 300; // 5 min between identical alerts
const DEFAULT_CHANNELS_BY_SEVERITY = {
  CRITICAL: ['slack', 'email'],
  HIGH: ['slack', 'email'],
  MEDIUM: ['slack'],
  LOW: [], // logged only
};

const SEVERITY_EMOJI = {
  CRITICAL: ':rotating_light:',
  HIGH: ':warning:',
  MEDIUM: ':large_yellow_circle:',
  LOW: ':information_source:',
};

// In-memory throttle store: { [dedupeKey]: lastSentAtMs }
const lastSentAt = new Map();

function shouldThrottle(dedupeKey, cooldownSec) {
  if (!dedupeKey) return false;
  const now = Date.now();
  const previous = lastSentAt.get(dedupeKey);
  if (previous && now - previous < cooldownSec * 1000) return true;
  lastSentAt.set(dedupeKey, now);
  // Best-effort GC so the map doesn't grow unbounded.
  if (lastSentAt.size > 500) {
    const cutoff = now - 24 * 60 * 60 * 1000;
    for (const [k, v] of lastSentAt) if (v < cutoff) lastSentAt.delete(k);
  }
  return false;
}

function formatContext(context) {
  if (!context || typeof context !== 'object') return '';
  return Object.entries(context)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => {
      const printable = typeof v === 'string' ? v : safeStringify(v);
      return `*${k}:* ${printable}`;
    })
    .join('\n');
}

function safeStringify(value) {
  try {
    const str = JSON.stringify(value);
    return str.length > 800 ? str.slice(0, 797) + '...' : str;
  } catch {
    return String(value);
  }
}

async function sendSlack({ severity, checkKey, title, body, context }) {
  const url = process.env.SLACK_WEBHOOK_URL_ALERTS;
  if (!url) return { skipped: 'no-webhook' };

  const emoji = SEVERITY_EMOJI[severity] || '';
  const contextText = formatContext(context);
  const runbook = process.env.RUNBOOK_BASE_URL
    ? `\n<${process.env.RUNBOOK_BASE_URL}#${checkKey.replace(/\./g, '')}|Runbook>`
    : '';

  const payload = {
    text: `${emoji} [${severity}] ${checkKey} — ${title}`, // notification fallback
    blocks: [
      {
        type: 'header',
        text: { type: 'plain_text', text: `${emoji} [${severity}] ${checkKey}`, emoji: true },
      },
      { type: 'section', text: { type: 'mrkdwn', text: `*${title}*\n${body || ''}` } },
      ...(contextText
        ? [{ type: 'section', text: { type: 'mrkdwn', text: contextText } }]
        : []),
      {
        type: 'context',
        elements: [
          { type: 'mrkdwn', text: `at ${new Date().toISOString()}${runbook}` },
        ],
      },
    ],
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return { ok: res.ok, status: res.status };
}

async function sendEmail({ severity, checkKey, title, body, context }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.ALERT_EMAIL_FROM;
  const toRaw = process.env.ALERT_EMAIL_TO;
  if (!apiKey || !from || !toRaw) return { skipped: 'not-configured' };

  const to = toRaw.split(',').map((s) => s.trim()).filter(Boolean);
  if (to.length === 0) return { skipped: 'no-recipients' };

  const contextLines = context
    ? Object.entries(context)
        .filter(([, v]) => v !== undefined && v !== null && v !== '')
        .map(([k, v]) => `${k}: ${typeof v === 'string' ? v : safeStringify(v)}`)
        .join('\n')
    : '';

  const subject = `[${severity}] ${checkKey} — ${title}`;
  const text = [body || '', contextLines && '\n---\n' + contextLines, `\nat ${new Date().toISOString()}`]
    .filter(Boolean)
    .join('\n');

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ from, to, subject, text }),
  });
  return { ok: res.ok, status: res.status };
}

/**
 * Fire an operational alert. Safe to call without await (recommended for
 * request handlers): the function catches all errors internally.
 *
 * @param {object} params
 * @param {string} params.checkKey  Unique identifier, e.g. 'forms.contact.apollo'.
 *                                  Used for dedupe and as a stable key in alerts.
 * @param {'CRITICAL'|'HIGH'|'MEDIUM'|'LOW'} params.severity
 * @param {string} params.title     Short headline.
 * @param {string} [params.body]    Longer message body.
 * @param {object} [params.context] Key/value pairs included in the alert body.
 * @param {string[]} [params.channels]  Override default channel mapping.
 * @param {number} [params.cooldownSec] Override default 5-min cooldown.
 * @param {string} [params.dedupeKey]   Defaults to checkKey. Set explicitly if
 *                                      a single checkKey can have meaningfully
 *                                      distinct alerts that shouldn't dedupe.
 */
export async function dispatchAlert(params) {
  try {
    const {
      checkKey,
      severity = 'HIGH',
      title,
      body = '',
      context,
      channels = DEFAULT_CHANNELS_BY_SEVERITY[severity] || ['slack'],
      cooldownSec = DEFAULT_COOLDOWN_SEC,
      dedupeKey,
    } = params || {};

    if (!checkKey || !title) {
      console.warn('[alerts] dispatchAlert called without checkKey/title', params);
      return;
    }

    const key = dedupeKey || checkKey;
    if (shouldThrottle(key, cooldownSec)) return;

    // Always log — even when throttled-this-process or no channels configured,
    // CloudWatch picks up the structured line. Useful for forensics.
    console.error(
      `[alert] ${severity} ${checkKey} :: ${title} :: ${body || ''} :: ${
        context ? safeStringify(context) : ''
      }`
    );

    const tasks = [];
    if (channels.includes('slack')) {
      tasks.push(
        sendSlack({ severity, checkKey, title, body, context }).catch((err) => {
          console.error('[alerts] slack send failed:', err?.message || err);
        })
      );
    }
    if (channels.includes('email')) {
      tasks.push(
        sendEmail({ severity, checkKey, title, body, context }).catch((err) => {
          console.error('[alerts] email send failed:', err?.message || err);
        })
      );
    }
    await Promise.all(tasks);
  } catch (err) {
    console.error('[alerts] dispatchAlert crashed:', err?.message || err);
  }
}

/**
 * Test helper — resets the in-memory throttle. Not exported for prod use.
 * @internal
 */
export function __resetAlertsThrottle() {
  lastSentAt.clear();
}
