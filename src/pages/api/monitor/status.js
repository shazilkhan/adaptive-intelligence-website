/**
 * GET /api/monitor/status
 *
 * Returns the recent run history, open incidents, per-check state, and uptime
 * stats for the dashboard. Optional ?token= guard via MONITOR_DASHBOARD_TOKEN.
 */

import { readStore, computeUptime } from '@/utils/monitor/store';
import { authorizeDashboard } from '@/utils/monitor/auth';
import { monitorConfig } from '@/config/monitor.config';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (!authorizeDashboard(req)) {
    return res.status(401).json({ ok: false, error: 'unauthorized' });
  }

  const store = await readStore();
  const lastRun = store.runs[store.runs.length - 1] || null;
  const recentRuns = store.runs.slice(-50).map((r) => ({
    id: r.id,
    ts: r.ts,
    durationMs: r.durationMs,
    summary: r.summary,
  }));

  const uptime24h = computeUptime(store, 24 * 60 * 60 * 1000);
  const uptime7d = computeUptime(store, 7 * 24 * 60 * 60 * 1000);

  const openIncidents = store.incidents
    .filter((i) => !i.closedAt)
    .map((i) => ({ ...i }));

  const recentlyClosed = store.incidents
    .filter((i) => i.closedAt)
    .sort((a, b) => new Date(b.closedAt) - new Date(a.closedAt))
    .slice(0, 20);

  // Group last-run check details by type for the dashboard.
  const checksByType = {};
  if (lastRun) {
    for (const c of lastRun.checks) {
      checksByType[c.type] = checksByType[c.type] || [];
      checksByType[c.type].push(c);
    }
  }

  return res.status(200).json({
    timestamp: new Date().toISOString(),
    baseUrl: monitorConfig.baseUrl,
    lastRun,
    recentRuns,
    uptime24h,
    uptime7d,
    openIncidents,
    recentlyClosed,
    checksByType,
    state: store.state,
    config: {
      pages: monitorConfig.staticPages.length,
      forms: monitorConfig.forms.length,
      criticalAssets: monitorConfig.criticalAssets.length,
      dedupeWindowMs: monitorConfig.dedupeWindowMs,
    },
  });
}
