/**
 * Detector Lambda entry point.
 *
 * Invoked every minute by EventBridge Scheduler. Uses UTC minute-of-hour
 * modulo arithmetic to decide which check buckets are due, runs them in
 * parallel, reconciles each result against DynamoDB state, dispatches alerts
 * on state transitions, and publishes an aggregated status JSON to S3.
 *
 * Design notes:
 *  - Failure isolation: per-check try/catch. One broken check must not
 *    prevent the others from running or the status snapshot from publishing.
 *  - Concurrency: all due checks fan out via Promise.allSettled. Per-check
 *    timeouts (AbortSignal) keep slow checks from blocking the rest.
 *  - Idempotence: state writes are last-write-wins on DynamoDB. The detector
 *    runs at most once per minute, so concurrent writes aren't expected.
 */

import { runCheck, CHECK_BUCKETS, SEVERITY_BY_CHECK } from './checks.js';
import { readState, writeState, decideTransition } from './state.js';
import { dispatchAlert } from './alerts.js';
import { publishStatus } from './status.js';

const ALWAYS_BUCKET = CHECK_BUCKETS.every1min;
const FIVE_MIN_BUCKET = CHECK_BUCKETS.every5min;
const FIFTEEN_MIN_BUCKET = CHECK_BUCKETS.every15min;
const DAILY_BUCKET = CHECK_BUCKETS.daily0600UTC;

// 06:00 UTC = off-hours in most time zones the team works in, so a
// failed end-to-end test doesn't masquerade as a real lead arriving during
// business hours. Change in lockstep with the CHECK_BUCKETS key name.
const DAILY_RUN_HOUR_UTC = 6;
const DAILY_RUN_MINUTE_UTC = 0;

export async function handler(event) {
  const now = new Date();
  const minute = now.getUTCMinutes();
  const hour = now.getUTCHours();

  const isDailyTick = hour === DAILY_RUN_HOUR_UTC && minute === DAILY_RUN_MINUTE_UTC;

  const due = [
    ...ALWAYS_BUCKET,
    ...(minute % 5 === 0 ? FIVE_MIN_BUCKET : []),
    ...(minute % 15 === 0 ? FIFTEEN_MIN_BUCKET : []),
    ...(isDailyTick ? DAILY_BUCKET : []),
  ];

  console.log(JSON.stringify({ msg: 'detector.tick', hour, minute, due }));

  const results = await Promise.allSettled(
    due.map(async (checkKey) => {
      const result = await runCheck(checkKey);
      try {
        await reconcileAndAlert(checkKey, result, now);
      } catch (err) {
        console.error(JSON.stringify({ msg: 'detector.reconcile.error', checkKey, err: err?.message }));
      }
      return { checkKey, ...result };
    })
  );

  const summary = results.map((r) =>
    r.status === 'fulfilled' ? r.value : { checkKey: 'unknown', ok: false, error: r.reason?.message || 'rejected' }
  );

  try {
    await publishStatus(summary, now);
  } catch (err) {
    console.error(JSON.stringify({ msg: 'detector.publishStatus.error', err: err?.message }));
  }

  return {
    ok: true,
    minute,
    ran: summary.length,
    failed: summary.filter((s) => !s.ok).length,
  };
}

async function reconcileAndAlert(checkKey, result, now) {
  const severity = SEVERITY_BY_CHECK[checkKey] || 'MEDIUM';
  const prev = await readState(checkKey);
  const { newState, alertReason } = decideTransition(prev, result, now);
  await writeState(checkKey, newState);

  if (!alertReason) return;

  // Recovery alerts always go out at LOW severity; new failures use the
  // check's configured severity. "Still down" uses the configured severity
  // too — it's a reminder, not a downgrade.
  const alertSeverity = alertReason === 'recovered' ? 'LOW' : severity;
  const title =
    alertReason === 'recovered'
      ? `${checkKey} recovered`
      : alertReason === 'down'
        ? `${checkKey} is DOWN`
        : `${checkKey} still DOWN (${newState.consecutiveFailures} consecutive failures)`;

  await dispatchAlert({
    checkKey,
    severity: alertSeverity,
    title,
    body: result.error || (alertReason === 'recovered' ? 'Check succeeded after prior failure.' : ''),
    context: {
      consecutiveFailures: newState.consecutiveFailures,
      latencyMs: result.latencyMs,
      lastError: newState.lastError,
    },
  });
}
