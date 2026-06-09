/**
 * GET /api/health/images
 *
 * Crawls every page, extracts <img src> URLs (including srcset), and probes each.
 * Returns the list of broken images grouped by the page they appear on.
 */

import { monitorConfig } from '@/config/monitor.config';
import { checkPage, checkImagesOnPage } from '@/utils/monitor/checks';
import { authorizeDashboard } from '@/utils/monitor/auth';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (!authorizeDashboard(req)) {
    return res.status(401).json({ ok: false, error: 'unauthorized' });
  }
  const baseUrl = monitorConfig.baseUrl;
  const paths = monitorConfig.staticPages;

  const broken = [];
  const seen = new Set();

  for (const path of paths) {
    const page = await checkPage(baseUrl, path);
    if (!page.ok) continue;
    const failures = await checkImagesOnPage(page);
    for (const f of failures) {
      // Dedup the same broken image when it appears on multiple pages.
      if (seen.has(f.target)) continue;
      seen.add(f.target);
      broken.push({
        url: f.target,
        status: f.status,
        error: f.error,
        firstSeenOn: f.meta?.foundOn,
      });
    }
  }

  return res.status(200).json({
    timestamp: new Date().toISOString(),
    baseUrl,
    pagesScanned: paths.length,
    brokenCount: broken.length,
    broken,
  });
}
