/**
 * Monitor log store.
 *
 * Pluggable persistence so state survives across serverless invocations:
 *   - Durable backend (Upstash Redis / Vercel KV) when KV_REST_API_URL +
 *     KV_REST_API_TOKEN (or UPSTASH_REDIS_REST_*) are set. The whole store is
 *     kept under a single JSON key. This is what production uses.
 *   - Local JSON file (<cwd>/data/monitor-log.json) as a dev fallback when no
 *     KV env is configured. NOTE: the file falls back to /tmp on read-only
 *     filesystems, which is ephemeral on Vercel — hence the KV backend above.
 *
 * readStore()/writeStore()/recordRun() are async (KV is network-backed). The
 * pure in-memory mutators (openIncident, updateState, …) stay synchronous and
 * operate on a store object you've already loaded.
 *
 * Schema:
 * {
 *   runs: [{ id, ts, durationMs, ok, summary: { total, passed, failed }, checks: [{...}] }],
 *   incidents: [{ id, target, type, openedAt, closedAt|null, lastSeenAt, message }],
 *   state: { [checkId]: { lastStatus, lastChangedAt, lastAlertedAt } }
 * }
 */

import fs from 'fs';
import path from 'path';
import { Redis } from '@upstash/redis';
import { monitorConfig } from '@/config/monitor.config';

const KV_KEY = 'monitor:log';
const PRIMARY_PATH = path.join(process.cwd(), 'data', 'monitor-log.json');
const FALLBACK_PATH = path.join('/tmp', 'monitor-log.json');

let _redis = null;
let _redisResolved = false;
function getRedis() {
  if (_redisResolved) return _redis;
  _redisResolved = true;
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token =
    process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) {
    _redis = new Redis({ url, token });
  }
  return _redis;
}

export function isDurable() {
  return getRedis() !== null;
}

function emptyStore() {
  return { runs: [], incidents: [], state: {} };
}

function normalize(parsed) {
  if (!parsed || typeof parsed !== 'object') return emptyStore();
  return {
    runs: Array.isArray(parsed.runs) ? parsed.runs : [],
    incidents: Array.isArray(parsed.incidents) ? parsed.incidents : [],
    state: parsed.state && typeof parsed.state === 'object' ? parsed.state : {},
  };
}

function trim(store) {
  const { maxRuns, maxIncidents } = monitorConfig.logRetention;
  return {
    runs: (store.runs || []).slice(-maxRuns),
    incidents: (store.incidents || []).slice(-maxIncidents),
    state: store.state || {},
  };
}

// ---- File backend (dev fallback) ----

function resolveLogPath() {
  try {
    const dir = path.dirname(PRIMARY_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.accessSync(dir, fs.constants.W_OK);
    return PRIMARY_PATH;
  } catch {
    return FALLBACK_PATH;
  }
}

function readStoreFromFile() {
  const p = resolveLogPath();
  try {
    if (!fs.existsSync(p)) return emptyStore();
    const raw = fs.readFileSync(p, 'utf8');
    if (!raw) return emptyStore();
    return normalize(JSON.parse(raw));
  } catch {
    return emptyStore();
  }
}

function writeStoreToFile(trimmed) {
  const p = resolveLogPath();
  try {
    fs.writeFileSync(p, JSON.stringify(trimmed, null, 2), 'utf8');
    return true;
  } catch {
    return false;
  }
}

// ---- Public async API ----

export async function readStore() {
  const redis = getRedis();
  if (redis) {
    try {
      // @upstash/redis auto-deserializes JSON values stored via set().
      const data = await redis.get(KV_KEY);
      return data ? normalize(data) : emptyStore();
    } catch {
      return emptyStore();
    }
  }
  return readStoreFromFile();
}

export async function writeStore(store) {
  const trimmed = trim(store);
  const redis = getRedis();
  if (redis) {
    try {
      await redis.set(KV_KEY, trimmed);
      return true;
    } catch {
      return false;
    }
  }
  return writeStoreToFile(trimmed);
}

export async function recordRun(runResult) {
  const store = await readStore();
  store.runs.push(runResult);
  await writeStore(store);
  return store;
}

// ---- In-memory mutators (operate on an already-loaded store) ----

export function openIncident(store, { id, target, type, message }) {
  const existing = store.incidents.find((i) => i.id === id && !i.closedAt);
  const now = new Date().toISOString();
  if (existing) {
    existing.lastSeenAt = now;
    existing.message = message;
    return existing;
  }
  const incident = {
    id,
    target,
    type,
    openedAt: now,
    closedAt: null,
    lastSeenAt: now,
    message,
  };
  store.incidents.push(incident);
  return incident;
}

export function closeIncident(store, id) {
  const open = store.incidents.find((i) => i.id === id && !i.closedAt);
  if (open) open.closedAt = new Date().toISOString();
  return open;
}

export function updateState(store, checkId, status) {
  const now = new Date().toISOString();
  const prev = store.state[checkId];
  if (!prev) {
    store.state[checkId] = {
      lastStatus: status,
      lastChangedAt: now,
      lastAlertedAt: null,
    };
    return { changed: true, prev: null };
  }
  // Capture the OLD status before mutating so callers can detect down→up.
  const previousStatus = prev.lastStatus;
  if (previousStatus !== status) {
    prev.lastStatus = status;
    prev.lastChangedAt = now;
    return { changed: true, prev: previousStatus };
  }
  return { changed: false, prev: previousStatus };
}

export function markAlerted(store, checkId) {
  if (store.state[checkId]) {
    store.state[checkId].lastAlertedAt = new Date().toISOString();
  }
}

export function shouldDedupe(store, checkId) {
  const s = store.state[checkId];
  if (!s || !s.lastAlertedAt) return false;
  const last = new Date(s.lastAlertedAt).getTime();
  return Date.now() - last < monitorConfig.dedupeWindowMs;
}

export function computeUptime(store, windowMs = 24 * 60 * 60 * 1000) {
  const cutoff = Date.now() - windowMs;
  const recent = store.runs.filter((r) => new Date(r.ts).getTime() >= cutoff);
  if (recent.length === 0) return null;
  const totalChecks = recent.reduce((acc, r) => acc + (r.summary?.total || 0), 0);
  const passedChecks = recent.reduce((acc, r) => acc + (r.summary?.passed || 0), 0);
  if (totalChecks === 0) return null;
  return {
    windowMs,
    runs: recent.length,
    totalChecks,
    passedChecks,
    uptimePct: (passedChecks / totalChecks) * 100,
  };
}
