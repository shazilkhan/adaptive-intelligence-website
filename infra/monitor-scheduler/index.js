/**
 * adaptive-monitor-poke — EventBridge-scheduled Lambda.
 *
 * Every 5 minutes, POSTs to the site's /api/monitor/run endpoint with the
 * shared secret so the uptime monitor performs its sweep. (Production runs on
 * AWS Amplify, which has no built-in cron — this Lambda is the trigger.)
 *
 * Dead-man's switch: the regular down/up alerts come from the monitor app
 * itself, but if the WHOLE site is down the endpoint is unreachable and the
 * in-app alerter can't run. This Lambda detects that (non-2xx / timeout /
 * network error) and posts to Slack directly, so a total outage is still caught.
 *
 * Env:
 *   MONITOR_URL         - full URL of /api/monitor/run (required)
 *   MONITOR_RUN_SECRET  - sent as `Authorization: Bearer <secret>` (required in prod)
 *   ALERT_WEBHOOK_URL   - Slack incoming webhook for dead-man's-switch alerts (optional)
 *
 * Runtime: nodejs20.x (global fetch + AbortController, no dependencies).
 */

const MONITOR_URL = process.env.MONITOR_URL;
const SECRET = process.env.MONITOR_RUN_SECRET || '';
const ALERT_WEBHOOK = process.env.ALERT_WEBHOOK_URL || '';
// The monitor sweep can take up to ~60s (run.js maxDuration), so wait longer
// than that before treating it as unreachable — otherwise a slow-but-working
// run would false-alarm the dead-man's switch.
const FETCH_TIMEOUT_MS = 60000;

async function notifySlack(text) {
  if (!ALERT_WEBHOOK) return;
  try {
    await fetch(ALERT_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
  } catch {
    // Best effort — don't throw from the alert path.
  }
}

exports.handler = async () => {
  if (!MONITOR_URL) {
    throw new Error('MONITOR_URL env var is not set');
  }

  const started = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const res = await fetch(MONITOR_URL, {
      method: 'POST',
      headers: SECRET ? { Authorization: `Bearer ${SECRET}` } : {},
      signal: controller.signal,
    });
    const body = await res.text();

    if (!res.ok) {
      await notifySlack(
        `:rotating_light: *Monitor trigger failed.* \`POST ${MONITOR_URL}\` returned HTTP ${res.status}. ` +
          `The uptime monitor may not be running. Response: ${body.slice(0, 300)}`
      );
      return { ok: false, statusCode: res.status };
    }

    return { ok: true, statusCode: 200, durationMs: Date.now() - started };
  } catch (err) {
    const reason = err && err.name === 'AbortError' ? `timeout after ${FETCH_TIMEOUT_MS}ms` : String(err && err.message || err);
    await notifySlack(
      `:rotating_light: *Monitor trigger errored.* Could not reach \`${MONITOR_URL}\` (${reason}). ` +
        `The site or the monitor endpoint is unreachable — the uptime monitor is NOT running.`
    );
    return { ok: false, error: reason };
  } finally {
    clearTimeout(timer);
  }
};
