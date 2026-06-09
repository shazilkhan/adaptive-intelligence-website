/**
 * GET /api/health/strapi
 *
 * Verifies the Strapi backend is reachable and key content types respond.
 */

import { getStrapiApiUrl } from '@/utils/strapi';
import { headCheck, fetchPage } from '@/utils/monitor/crawler';
import { authorizeDashboard } from '@/utils/monitor/auth';
import { monitorConfig } from '@/config/monitor.config';

const CONTENT_TYPES = ['setting', 'case-studies', 'newsletters'];

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (!authorizeDashboard(req)) {
    return res.status(401).json({ ok: false, error: 'unauthorized' });
  }
  const base = getStrapiApiUrl();

  if (!base) {
    return res.status(500).json({
      ok: false,
      error: 'no_strapi_url_configured',
      timestamp: new Date().toISOString(),
    });
  }

  const checks = [];
  for (const ct of CONTENT_TYPES) {
    const url = `${base}/api/${ct}`;
    const r = await headCheck(url, monitorConfig.timeouts.strapi);
    checks.push({
      contentType: ct,
      url,
      ok: r.ok,
      status: r.status,
      durationMs: r.durationMs,
      error: r.ok ? null : (r.error || `http_${r.status}`),
    });
  }

  const allOk = checks.every((c) => c.ok);
  return res.status(200).json({
    ok: allOk,
    base,
    timestamp: new Date().toISOString(),
    checks,
  });
}
