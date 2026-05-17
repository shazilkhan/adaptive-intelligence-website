/**
 * Publishes an aggregated status JSON to S3 after each detector run.
 *
 * The JSON includes EVERY known check (not just the ones run this minute),
 * pulled from DynamoDB. This way the public status endpoint always shows
 * a complete picture, regardless of when the last invocation happened to
 * touch a particular check.
 *
 * Cache-Control: max-age=20 lets CloudFront/browsers cache for ~20s
 * (less than the fastest check cadence of 1 min) so a popular status page
 * doesn't hammer S3, while still updating well within the alerting SLA.
 */

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, BatchGetCommand } from '@aws-sdk/lib-dynamodb';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { CHECK_BUCKETS } from './checks.js';

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const s3 = new S3Client({});

const ALL_CHECK_KEYS = [
  ...CHECK_BUCKETS.every1min,
  ...CHECK_BUCKETS.every5min,
  ...CHECK_BUCKETS.every15min,
  ...CHECK_BUCKETS.daily0600UTC,
];

export async function publishStatus(lastRunResults, nowDate) {
  const bucket = process.env.MONITOR_STATUS_BUCKET;
  const key = process.env.MONITOR_STATUS_KEY || 'status.json';
  const table = process.env.MONITOR_STATE_TABLE;
  if (!bucket || !table) {
    console.warn(JSON.stringify({ msg: 'publishStatus.skipped', reason: 'env not set' }));
    return;
  }

  const states = await readAllStates(table);
  const resultsByKey = Object.fromEntries(lastRunResults.map((r) => [r.checkKey, r]));

  const checks = {};
  let downCount = 0;
  let pendingCount = 0;
  for (const k of ALL_CHECK_KEYS) {
    const state = states[k];
    const lastRun = resultsByKey[k];
    if (!state && !lastRun) {
      checks[k] = { state: 'PENDING', lastChecked: null };
      pendingCount += 1;
      continue;
    }
    checks[k] = {
      state: state?.currentState || 'OK',
      consecutiveFailures: state?.consecutiveFailures || 0,
      lastTransitionAt: state?.lastTransitionAt || null,
      lastError: state?.lastError || null,
      lastSuccessAt: state?.lastSuccessAt || null,
      // From this minute's run (only present if the check was due):
      lastChecked: lastRun ? nowDate.toISOString() : state?.lastTransitionAt || null,
      lastLatencyMs: lastRun?.latencyMs ?? null,
    };
    if (checks[k].state === 'DOWN') downCount += 1;
  }

  const overall = downCount > 0 ? 'down' : pendingCount === ALL_CHECK_KEYS.length ? 'unknown' : 'ok';
  const body = JSON.stringify(
    {
      timestamp: nowDate.toISOString(),
      overall,
      downCount,
      checks,
    },
    null,
    2
  );

  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: 'application/json',
      CacheControl: 'public, max-age=20',
    })
  );
}

async function readAllStates(table) {
  // BatchGet is capped at 100 keys; we have <100 so a single call is fine.
  const { Responses } = await ddb.send(
    new BatchGetCommand({
      RequestItems: {
        [table]: {
          Keys: ALL_CHECK_KEYS.map((checkKey) => ({ checkKey })),
        },
      },
    })
  );
  const rows = Responses?.[table] || [];
  return Object.fromEntries(rows.map((r) => [r.checkKey, r]));
}
