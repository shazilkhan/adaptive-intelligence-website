/**
 * Per-check state persistence in DynamoDB.
 *
 * State machine:
 *   - Single transient failure does NOT trigger an alert. Two consecutive
 *     failures flip the check to DOWN and dispatch the first alert.
 *   - While DOWN, re-alerts fire at REALERT_COOLDOWN_MS intervals so the
 *     team isn't reminded once a minute, but isn't silently abandoned
 *     either if the original alert was missed.
 *   - First success after DOWN dispatches a recovery alert.
 *
 * Schema (table: monitor-state, PK = checkKey):
 *   currentState        'OK' | 'DOWN'
 *   consecutiveFailures number
 *   lastTransitionAt    ISO8601 string
 *   lastAlertAt         ISO8601 string | null
 *   lastError           string | null
 *   lastSuccessAt       ISO8601 string | null
 */

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';

const REALERT_COOLDOWN_MS = 30 * 60 * 1000; // 30 min between repeat DOWN alerts
const FAILURES_BEFORE_DOWN = 2;

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

const DEFAULT_STATE = {
  currentState: 'OK',
  consecutiveFailures: 0,
  lastTransitionAt: null,
  lastAlertAt: null,
  lastError: null,
  lastSuccessAt: null,
};

export async function readState(checkKey) {
  const table = requireTable();
  const { Item } = await ddb.send(new GetCommand({ TableName: table, Key: { checkKey } }));
  if (!Item) return { ...DEFAULT_STATE };
  return {
    currentState: Item.currentState || 'OK',
    consecutiveFailures: Item.consecutiveFailures || 0,
    lastTransitionAt: Item.lastTransitionAt || null,
    lastAlertAt: Item.lastAlertAt || null,
    lastError: Item.lastError || null,
    lastSuccessAt: Item.lastSuccessAt || null,
  };
}

export async function writeState(checkKey, state) {
  const table = requireTable();
  await ddb.send(
    new PutCommand({
      TableName: table,
      Item: { checkKey, ...state },
    })
  );
}

/**
 * Pure: given previous state + current result, returns the new state and
 * an alertReason (if any).
 *
 * alertReason values:
 *   - 'down'       — first time entering DOWN
 *   - 'still_down' — periodic reminder while still DOWN
 *   - 'recovered'  — transitioned back to OK
 *   - null         — no alert
 */
export function decideTransition(prev, result, nowDate) {
  const now = nowDate.toISOString();
  const nowMs = nowDate.getTime();

  if (result.ok) {
    if (prev.currentState === 'DOWN') {
      return {
        newState: {
          currentState: 'OK',
          consecutiveFailures: 0,
          lastTransitionAt: now,
          lastAlertAt: now,
          lastError: null,
          lastSuccessAt: now,
        },
        alertReason: 'recovered',
      };
    }
    return {
      newState: {
        ...prev,
        currentState: 'OK',
        consecutiveFailures: 0,
        lastError: null,
        lastSuccessAt: now,
      },
      alertReason: null,
    };
  }

  // Result failed.
  const failures = (prev.consecutiveFailures || 0) + 1;
  const lastErr = result.error || 'unknown error';

  if (prev.currentState === 'OK') {
    if (failures >= FAILURES_BEFORE_DOWN) {
      return {
        newState: {
          currentState: 'DOWN',
          consecutiveFailures: failures,
          lastTransitionAt: now,
          lastAlertAt: now,
          lastError: lastErr,
          lastSuccessAt: prev.lastSuccessAt,
        },
        alertReason: 'down',
      };
    }
    // First failure — no alert yet, just record.
    return {
      newState: {
        ...prev,
        consecutiveFailures: failures,
        lastError: lastErr,
      },
      alertReason: null,
    };
  }

  // Already DOWN. Re-alert if cooldown elapsed.
  const lastAlertMs = prev.lastAlertAt ? Date.parse(prev.lastAlertAt) : 0;
  const shouldRealert = nowMs - lastAlertMs >= REALERT_COOLDOWN_MS;
  return {
    newState: {
      ...prev,
      consecutiveFailures: failures,
      lastError: lastErr,
      lastAlertAt: shouldRealert ? now : prev.lastAlertAt,
    },
    alertReason: shouldRealert ? 'still_down' : null,
  };
}

function requireTable() {
  const table = process.env.MONITOR_STATE_TABLE;
  if (!table) throw new Error('MONITOR_STATE_TABLE env var not set');
  return table;
}
