/**
 * Slack webhook notification helper.
 *
 * Requires SLACK_WEBHOOK_URL env var.
 * Sends a formatted message to a Slack channel when a form is submitted.
 */

export async function sendSlackNotification({ formType, fields }) {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) return; // Slack not configured — skip silently

  const fieldLines = Object.entries(fields)
    .filter(([, v]) => v) // skip empty values
    .map(([label, value]) => `*${label}:* ${value}`)
    .join('\n');

  const payload = {
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: `New ${formType} Submission`,
          emoji: true,
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: fieldLines,
        },
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: `Submitted at ${new Date().toISOString()}`,
          },
        ],
      },
    ],
  };

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    // Slack failure should never block form submission
  }
}
