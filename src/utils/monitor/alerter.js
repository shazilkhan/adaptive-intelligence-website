/**
 * Slack alerter for the uptime monitor.
 *
 * Posts rich Block Kit messages on:
 *   - state change (up→down) — fires immediately
 *   - recovery (down→up) — fires immediately, ":white_check_mark:"
 *
 * Channel: uses MONITOR_SLACK_WEBHOOK_URL if set (a dedicated #alerts channel),
 * otherwise falls back to SLACK_WEBHOOK_URL (the same webhook used for form
 * submission notifications).
 *
 * De-dupes repeated down alerts within monitorConfig.dedupeWindowMs so a flapping
 * resource doesn't drown the channel.
 */

import { monitorConfig } from '@/config/monitor.config';

const ICON_DOWN = ':rotating_light:';
const ICON_UP = ':white_check_mark:';
const ICON_WARN = ':warning:';

function alertWebhook() {
  return process.env.MONITOR_SLACK_WEBHOOK_URL || process.env.SLACK_WEBHOOK_URL;
}

function formatFailureBlocks(failures) {
  const lines = failures.slice(0, 25).map((f) => {
    const status = f.status ? `\`${f.status}\`` : '`ERR`';
    const dur = typeof f.durationMs === 'number' ? ` · ${f.durationMs}ms` : '';
    const reason = f.error ? ` — _${f.error}_` : '';
    return `${status} ${f.target}${dur}${reason}`;
  });
  if (failures.length > 25) {
    lines.push(`_…and ${failures.length - 25} more_`);
  }
  return lines.join('\n');
}

export async function sendDownAlert({ runId, failures, baseUrl, mention }) {
  const webhook = alertWebhook();
  if (!webhook || !monitorConfig.slack.enabled) return false;

  const headerText = `${ICON_DOWN} Site Health Alert · ${failures.length} failing check${failures.length === 1 ? '' : 's'}`;
  const mentionLine = mention || monitorConfig.slack.mentionOnDown;

  const blocks = [
    {
      type: 'header',
      text: { type: 'plain_text', text: headerText, emoji: true },
    },
  ];

  if (mentionLine) {
    blocks.push({
      type: 'section',
      text: { type: 'mrkdwn', text: mentionLine },
    });
  }

  blocks.push(
    {
      type: 'section',
      text: { type: 'mrkdwn', text: formatFailureBlocks(failures) },
    },
    { type: 'divider' },
    {
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: `Run \`${runId}\` · ${baseUrl} · ${new Date().toISOString()}`,
        },
      ],
    }
  );

  try {
    await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: headerText, blocks }),
    });
    return true;
  } catch {
    return false;
  }
}

export async function sendRecoveryAlert({ runId, recovered, baseUrl }) {
  const webhook = alertWebhook();
  if (!webhook || !monitorConfig.slack.enabled) return false;

  const headerText = `${ICON_UP} Site Health Recovered · ${recovered.length} check${recovered.length === 1 ? '' : 's'} back up`;
  const lines = recovered.slice(0, 25).map((r) => `• ${r.target}`);
  if (recovered.length > 25) lines.push(`_…and ${recovered.length - 25} more_`);

  const blocks = [
    {
      type: 'header',
      text: { type: 'plain_text', text: headerText, emoji: true },
    },
    {
      type: 'section',
      text: { type: 'mrkdwn', text: lines.join('\n') },
    },
    {
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: `Run \`${runId}\` · ${baseUrl} · ${new Date().toISOString()}`,
        },
      ],
    },
  ];

  try {
    await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: headerText, blocks }),
    });
    return true;
  } catch {
    return false;
  }
}

export async function sendConfigWarning({ message }) {
  const webhook = alertWebhook();
  if (!webhook || !monitorConfig.slack.enabled) return false;

  try {
    await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: `${ICON_WARN} Monitor configuration: ${message}`,
      }),
    });
    return true;
  } catch {
    return false;
  }
}
