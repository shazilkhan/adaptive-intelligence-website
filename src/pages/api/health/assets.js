/**
 * GET /api/health/assets
 *
 * Verifies critical static assets (logos, favicons, OG images, robots.txt) plus
 * every <link>/<script> referenced by static pages. Catches broken JS bundles,
 * missing stylesheets, and 404'd CDN files.
 */

import { monitorConfig } from '@/config/monitor.config';
import { checkPage, checkCriticalAsset, checkAssetsOnPage } from '@/utils/monitor/checks';
import { authorizeDashboard } from '@/utils/monitor/auth';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (!authorizeDashboard(req)) {
    return res.status(401).json({ ok: false, error: 'unauthorized' });
  }
  const baseUrl = monitorConfig.baseUrl;

  const criticalResults = await Promise.all(
    monitorConfig.criticalAssets.map((p) => checkCriticalAsset(baseUrl, p))
  );

  const referencedFailures = [];
  const seen = new Set();
  for (const path of monitorConfig.staticPages) {
    const page = await checkPage(baseUrl, path);
    if (!page.ok) continue;
    const failures = await checkAssetsOnPage(page);
    for (const f of failures) {
      if (seen.has(f.target)) continue;
      seen.add(f.target);
      referencedFailures.push({
        url: f.target,
        status: f.status,
        error: f.error,
        firstSeenOn: f.meta?.foundOn,
      });
    }
  }

  const criticalFailed = criticalResults.filter((r) => !r.ok);
  return res.status(200).json({
    ok: criticalFailed.length === 0 && referencedFailures.length === 0,
    timestamp: new Date().toISOString(),
    baseUrl,
    critical: criticalResults,
    referencedAssetFailures: referencedFailures,
  });
}
