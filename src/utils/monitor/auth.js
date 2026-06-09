/**
 * Shared auth helpers for the monitor + admin endpoints.
 *
 * Two distinct secrets:
 *   - Run secret  → gates /api/monitor/run (the cron + manual sweep trigger).
 *                   Vercel Cron sends Authorization: Bearer <CRON_SECRET>, so we
 *                   accept CRON_SECRET as well as an explicit MONITOR_RUN_SECRET.
 *   - Dashboard token → gates /api/monitor/status, /api/health/* crawls,
 *                   /api/admin/* and the /admin/* pages (via MONITOR_DASHBOARD_TOKEN).
 *
 * Fail-closed in production: if the relevant secret/token is NOT configured,
 * access is DENIED in production (and allowed in dev for convenience). This
 * flips the old default-open behaviour so a missing env var can never silently
 * expose internal data or a public crawl trigger.
 */

import crypto from 'crypto';

export function isProd() {
  return (
    process.env.VERCEL_ENV === 'production' ||
    (process.env.NODE_ENV === 'production' && process.env.VERCEL_ENV !== 'preview')
  );
}

/** Constant-time string compare; safe against length/type mismatches. */
export function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

/**
 * Decide whether a provided dashboard token is acceptable.
 * - token configured → must match.
 * - token not configured → open in dev, denied in prod.
 */
export function checkDashboardToken(provided) {
  const expected = process.env.MONITOR_DASHBOARD_TOKEN || '';
  if (expected) return safeEqual(provided || '', expected);
  return !isProd();
}

/** Express/Next API-route guard for dashboard-grade endpoints. */
export function authorizeDashboard(req) {
  const provided =
    (req.query && req.query.token) || req.headers['x-dashboard-token'] || '';
  return checkDashboardToken(provided);
}

/** Express/Next API-route guard for the monitor run/sweep trigger. */
export function authorizeRun(req) {
  const cronSecret = process.env.CRON_SECRET || '';
  const runSecret = process.env.MONITOR_RUN_SECRET || '';
  const auth = req.headers['authorization'] || '';

  // Vercel Cron injects Authorization: Bearer <CRON_SECRET>.
  if (cronSecret && safeEqual(auth, `Bearer ${cronSecret}`)) return true;

  // Manual trigger via the run secret (header preferred; query kept for the
  // dashboard "Run Now" button but it leaks into logs — use sparingly).
  if (runSecret) {
    if (safeEqual(auth, `Bearer ${runSecret}`)) return true;
    if (safeEqual(req.headers['x-monitor-secret'] || '', runSecret)) return true;
    if (req.query && safeEqual(req.query.secret || '', runSecret)) return true;
  }

  // Nothing configured: open in dev only, never in production.
  if (!cronSecret && !runSecret) return !isProd();
  return false;
}
