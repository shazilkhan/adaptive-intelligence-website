/**
 * Lambda-side alert dispatcher. Mirrors the contract of
 * src/utils/alerts.js in the Next.js app so reasoning is identical, but
 * runs in the Lambda environment with its own env vars.
 *
 * Dedupe is handled upstream by state.js (state machine + cooldown),
 * so this module is "send and forget" — no in-memory throttle here.
 */

const SEVERITY_EMOJI = {
  CRITICAL: ':rotating_light:',
  HIGH: ':warning:',
  MEDIUM: ':large_yellow_circle:',
  LOW: ':white_check_mark:',
};

const DEFAULT_CHANNELS_BY_SEVERITY = {
  CRITICAL: ['slack', 'email'],
  HIGH: ['slack', 'email'],
  MEDIUM: ['slack'],
  LOW: ['slack'],
};

export async function dispatchAlert({ checkKey, severity = 'HIGH', title, body = '', context, channels }) {
  if (!checkKey || !title) {
    console.warn(JSON.stringify({ msg: 'alerts.invalid', checkKey, title }));
    return;
  }
  const ch = channels || DEFAULT_CHANNELS_BY_SEVERITY[severity] || ['slack'];

  // Structured log line is always emitted so CloudWatch is a complete audit
  // trail even when external channels fail.
  console.log(
    JSON.stringify({
      msg: 'alerts.dispatch',
      severity,
      checkKey,
      title,
      body,
      context,
      channels: ch,
    })
  );

  const tasks = [];
  if (ch.includes('slack')) tasks.push(sendSlack({ severity, checkKey, title, body, context }).catch(logErr('slack')));
  if (ch.includes('email')) tasks.push(sendEmail({ severity, checkKey, title, body, context }).catch(logErr('email')));
  await Promise.all(tasks);
}

function logErr(channel) {
  return (err) => console.error(JSON.stringify({ msg: 'alerts.channel.error', channel, err: err?.message || String(err) }));
}

function safeStringify(v) {
  try {
    const s = JSON.stringify(v);
    return s.length > 600 ? s.slice(0, 597) + '...' : s;
  } catch {
    return String(v);
  }
}

function formatContext(context) {
  if (!context) return '';
  return Object.entries(context)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `*${k}:* ${typeof v === 'string' ? v : safeStringify(v)}`)
    .join('\n');
}

async function sendSlack({ severity, checkKey, title, body, context }) {
  const url = process.env.SLACK_WEBHOOK_URL_ALERTS;
  if (!url) return { skipped: 'no-webhook' };

  const emoji = SEVERITY_EMOJI[severity] || '';
  const ctx = formatContext(context);
  const runbookFooter = process.env.RUNBOOK_BASE_URL
    ? ` · <${process.env.RUNBOOK_BASE_URL}#${checkKey.replace(/\./g, '')}|Runbook>`
    : '';

  const payload = {
    text: `${emoji} [${severity}] ${checkKey} — ${title}`,
    blocks: [
      {
        type: 'header',
        text: { type: 'plain_text', text: `${emoji} [${severity}] ${checkKey}`, emoji: true },
      },
      { type: 'section', text: { type: 'mrkdwn', text: `*${title}*${body ? `\n${body}` : ''}` } },
      ...(ctx ? [{ type: 'section', text: { type: 'mrkdwn', text: ctx } }] : []),
      {
        type: 'context',
        elements: [{ type: 'mrkdwn', text: `at ${new Date().toISOString()}${runbookFooter}` }],
      },
    ],
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Slack webhook returned ${res.status}`);
  return { ok: true };
}

async function sendEmail({ severity, checkKey, title, body, context }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.ALERT_EMAIL_FROM;
  const toRaw = process.env.ALERT_EMAIL_TO;
  if (!apiKey || !from || !toRaw) return { skipped: 'not-configured' };

  const to = toRaw.split(',').map((s) => s.trim()).filter(Boolean);
  if (to.length === 0) return { skipped: 'no-recipients' };

  const contextText = context
    ? Object.entries(context)
        .filter(([, v]) => v !== undefined && v !== null && v !== '')
        .map(([k, v]) => `${k}: ${typeof v === 'string' ? v : safeStringify(v)}`)
        .join('\n')
    : '';

  const subject = `[${severity}] ${checkKey} — ${title}`;
  const text = [body, contextText && '\n---\n' + contextText, `\nat ${new Date().toISOString()}`]
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
  if (!res.ok) {
    const errBody = await res.text().catch(() => '');
    throw new Error(`Resend returned ${res.status}: ${errBody.slice(0, 200)}`);
  }
  return { ok: true };
}
