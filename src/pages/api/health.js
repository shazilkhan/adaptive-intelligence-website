// pages/api/health.js
// Public health check endpoint for uptime monitoring services.
// Returns 200 only when both the site and Strapi are reachable, 503 otherwise,
// so external monitors that key off HTTP status codes can detect failures.

export default async function handler(req, res) {
  const checks = { site: true, strapi: false };
  let strapiError = null;

  try {
    const { getStrapiApiUrl } = await import('@/utils/strapi');
    const strapiBase = getStrapiApiUrl();
    if (!strapiBase) {
      strapiError = 'Strapi base URL not configured';
    } else {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      try {
        const strapiRes = await fetch(`${strapiBase}/api/setting`, {
          signal: controller.signal,
        });
        checks.strapi = strapiRes.ok;
        if (!strapiRes.ok) strapiError = `Strapi returned ${strapiRes.status}`;
      } finally {
        clearTimeout(timeout);
      }
    }
  } catch (err) {
    checks.strapi = false;
    strapiError = err?.name === 'AbortError' ? 'Strapi timeout (>5s)' : (err?.message || 'Strapi unreachable');
  }

  const allOk = checks.site && checks.strapi;
  res.setHeader('Cache-Control', 'no-store');
  return res.status(allOk ? 200 : 503).json({
    status: allOk ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    checks,
    ...(strapiError ? { error: strapiError } : {}),
  });
}
