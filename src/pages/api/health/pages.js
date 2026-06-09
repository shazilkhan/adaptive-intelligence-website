/**
 * GET /api/health/pages
 *
 * Crawls every static page (and case study slugs from Strapi sitemap) and reports
 * which respond 200 with valid HTML. Slower than /api/health — use sparingly.
 */

import { monitorConfig } from '@/config/monitor.config';
import { checkPage } from '@/utils/monitor/checks';
import { authorizeDashboard } from '@/utils/monitor/auth';
import { getStrapiApiUrl } from '@/utils/strapi';

async function getCaseStudySlugs() {
  try {
    const base = getStrapiApiUrl();
    if (!base) return [];
    const r = await fetch(`${base}/api/case-studies?pagination[limit]=-1`);
    if (!r.ok) return [];
    const j = await r.json();
    const items = j.data || [];
    return items
      .map((s) => s.slug || s.attributes?.slug)
      .filter(Boolean)
      .map((slug) => `/case-studies/${slug}`);
  } catch {
    return [];
  }
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (!authorizeDashboard(req)) {
    return res.status(401).json({ ok: false, error: 'unauthorized' });
  }
  const baseUrl = monitorConfig.baseUrl;

  const dynamicPaths = await getCaseStudySlugs();
  const allPaths = [...monitorConfig.staticPages, ...dynamicPaths];

  // Run with limited concurrency to be polite to the host.
  const concurrency = 5;
  const results = [];
  let i = 0;
  async function worker() {
    while (i < allPaths.length) {
      const idx = i++;
      const path = allPaths[idx];
      // Strip the html field from the result before returning — it's huge.
      const r = await checkPage(baseUrl, path);
      results.push({ ...r, meta: { ...(r.meta || {}), html: undefined } });
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, allPaths.length) }, worker));

  const failed = results.filter((r) => !r.ok);
  return res.status(200).json({
    timestamp: new Date().toISOString(),
    baseUrl,
    total: results.length,
    passed: results.length - failed.length,
    failed: failed.length,
    results,
  });
}
