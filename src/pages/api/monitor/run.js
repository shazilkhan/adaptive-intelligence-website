/**
 * GET/POST /api/monitor/run
 *
 * Single full-sweep monitor run. Walks every page, image, asset, form, env var,
 * and the Strapi backend. Records the run to disk, opens/closes incidents on
 * state change, and posts a Slack alert when checks flip up→down or down→up.
 *
 * Auth (see utils/monitor/auth.js): Vercel Cron authenticates via
 * `Authorization: Bearer <CRON_SECRET>`; manual triggers use MONITOR_RUN_SECRET
 * (header `x-monitor-secret` preferred, `?secret=` accepted). Fail-closed in
 * production — if neither secret is configured, the endpoint is denied.
 *
 * Cron: wired via vercel.json. Manually triggerable for ad-hoc runs.
 */

import { monitorConfig } from '@/config/monitor.config';
import {
  checkPage,
  checkImagesOnPage,
  checkAssetsOnPage,
  checkCriticalAsset,
  checkStrapi,
  checkRequiredEnvVars,
  checkFormHeartbeat,
} from '@/utils/monitor/checks';
import {
  readStore,
  writeStore,
  openIncident,
  closeIncident,
  updateState,
  markAlerted,
  shouldDedupe,
} from '@/utils/monitor/store';
import { sendDownAlert, sendRecoveryAlert } from '@/utils/monitor/alerter';
import { authorizeRun } from '@/utils/monitor/auth';
import { getStrapiApiUrl } from '@/utils/strapi';

async function getCaseStudyPaths() {
  try {
    const base = getStrapiApiUrl();
    if (!base) return [];
    const r = await fetch(`${base}/api/case-studies?pagination[limit]=-1`);
    if (!r.ok) return [];
    const j = await r.json();
    return (j.data || [])
      .map((s) => s.slug || s.attributes?.slug)
      .filter(Boolean)
      .map((slug) => `/case-studies/${slug}`);
  } catch {
    return [];
  }
}

export default async function handler(req, res) {
  if (!authorizeRun(req)) {
    return res.status(401).json({ ok: false, error: 'unauthorized' });
  }

  res.setHeader('Cache-Control', 'no-store');
  const start = Date.now();
  const runId = `run_${start.toString(36)}`;
  const baseUrl = monitorConfig.baseUrl;
  const allChecks = [];

  // 1. Static + dynamic pages
  const dynamicPaths = await getCaseStudyPaths();
  const allPaths = [...monitorConfig.staticPages, ...dynamicPaths];
  const pageResults = [];
  const concurrency = 5;
  let i = 0;
  async function pageWorker() {
    while (i < allPaths.length) {
      const idx = i++;
      const path = allPaths[idx];
      const r = await checkPage(baseUrl, path);
      pageResults.push(r);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, allPaths.length) }, pageWorker));
  for (const p of pageResults) {
    allChecks.push({ ...p, meta: { ...(p.meta || {}), html: undefined } });
  }

  // 2. Images on each successfully-rendered page
  const imageSeen = new Set();
  for (const page of pageResults) {
    if (!page.ok) continue;
    const failures = await checkImagesOnPage(page);
    for (const f of failures) {
      if (imageSeen.has(f.id)) continue;
      imageSeen.add(f.id);
      allChecks.push(f);
    }
  }

  // 3. Other assets on each page (CSS, JS, fonts)
  const assetSeen = new Set();
  for (const page of pageResults) {
    if (!page.ok) continue;
    const failures = await checkAssetsOnPage(page);
    for (const f of failures) {
      if (assetSeen.has(f.id)) continue;
      assetSeen.add(f.id);
      allChecks.push(f);
    }
  }

  // 4. Critical assets (favicon, robots.txt, etc.)
  for (const path of monitorConfig.criticalAssets) {
    allChecks.push(await checkCriticalAsset(baseUrl, path));
  }

  // 5. Strapi
  allChecks.push(await checkStrapi());

  // 6. Env var configuration
  for (const c of checkRequiredEnvVars()) allChecks.push(c);

  // 7. Form heartbeats
  for (const form of monitorConfig.forms) {
    allChecks.push(await checkFormHeartbeat(baseUrl, form));
  }

  // ---- Persist + diff state ----
  const store = await readStore();
  const newlyDown = [];
  const recovered = [];

  for (const check of allChecks) {
    const status = check.ok ? 'up' : 'down';
    const { changed, prev } = updateState(store, check.id, status);

    if (changed && status === 'down') {
      openIncident(store, {
        id: check.id,
        target: check.target,
        type: check.type,
        message: check.error || `status_${check.status}`,
      });
      if (!shouldDedupe(store, check.id)) {
        newlyDown.push({
          id: check.id,
          target: check.target,
          status: check.status,
          durationMs: check.durationMs,
          error: check.error,
        });
      }
    } else if (changed && status === 'up' && prev === 'down') {
      closeIncident(store, check.id);
      recovered.push({ id: check.id, target: check.target });
    } else if (!changed && status === 'down') {
      // Still down — re-alert only if dedupe window has passed.
      if (!shouldDedupe(store, check.id)) {
        newlyDown.push({
          id: check.id,
          target: check.target,
          status: check.status,
          durationMs: check.durationMs,
          error: check.error,
        });
      }
    }
  }

  const summary = {
    total: allChecks.length,
    passed: allChecks.filter((c) => c.ok).length,
    failed: allChecks.filter((c) => !c.ok).length,
    byType: {},
  };
  for (const c of allChecks) {
    summary.byType[c.type] = summary.byType[c.type] || { total: 0, failed: 0 };
    summary.byType[c.type].total++;
    if (!c.ok) summary.byType[c.type].failed++;
  }

  const runRecord = {
    id: runId,
    ts: new Date().toISOString(),
    durationMs: Date.now() - start,
    ok: summary.failed === 0,
    summary,
    checks: allChecks.map((c) => ({
      id: c.id,
      type: c.type,
      target: c.target,
      ok: c.ok,
      status: c.status,
      durationMs: c.durationMs,
      error: c.error,
    })),
  };
  store.runs.push(runRecord);

  // ---- Slack alerts ----
  if (newlyDown.length > 0) {
    await sendDownAlert({
      runId,
      failures: newlyDown,
      baseUrl,
      mention: monitorConfig.slack.mentionOnDown,
    });
    for (const f of newlyDown) markAlerted(store, f.id);
  }
  if (recovered.length > 0) {
    await sendRecoveryAlert({ runId, recovered, baseUrl });
  }

  await writeStore(store);

  return res.status(200).json({
    ok: true,
    runId,
    durationMs: runRecord.durationMs,
    summary,
    newlyDown: newlyDown.length,
    recovered: recovered.length,
    openIncidents: store.incidents.filter((i) => !i.closedAt).length,
  });
}

// Allow longer execution time for the full sweep on Vercel.
export const config = {
  maxDuration: 60,
};
