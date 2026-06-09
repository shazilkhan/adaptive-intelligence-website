/**
 * GET /api/health
 *
 * Master health endpoint. Aggregates the latest run from the monitor store
 * and exposes a simple ok/degraded/down summary. Designed to be cheap — does
 * NOT trigger a fresh crawl. Use /api/monitor/run for that.
 */

import { readStore, computeUptime } from '@/utils/monitor/store';
import { monitorConfig } from '@/config/monitor.config';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  const store = await readStore();
  const lastRun = store.runs[store.runs.length - 1] || null;
  const openIncidents = store.incidents.filter((i) => !i.closedAt);
  const uptime = computeUptime(store);

  let status = 'unknown';
  if (lastRun) {
    const failed = lastRun.summary?.failed || 0;
    if (failed === 0) status = 'ok';
    else if (failed < (lastRun.summary?.total || 1) * 0.2) status = 'degraded';
    else status = 'down';
  }

  return res.status(200).json({
    status,
    timestamp: new Date().toISOString(),
    baseUrl: monitorConfig.baseUrl,
    lastRun: lastRun
      ? {
          ts: lastRun.ts,
          durationMs: lastRun.durationMs,
          summary: lastRun.summary,
        }
      : null,
    openIncidents: openIncidents.length,
    uptime,
  });
}
