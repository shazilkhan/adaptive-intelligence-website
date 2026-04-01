// pages/api/health.js
// Public health check endpoint for uptime monitoring services.
// Returns 200 when the site is up, along with basic status info.

export default async function handler(req, res) {
  const checks = { site: true, strapi: false };

  // Optionally verify Strapi is reachable
  try {
    const { getStrapiApiUrl } = await import('@/utils/strapi');
    const strapiBase = getStrapiApiUrl();
    if (strapiBase) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      const strapiRes = await fetch(`${strapiBase}/api/setting`, {
        signal: controller.signal,
      });
      clearTimeout(timeout);
      checks.strapi = strapiRes.ok;
    }
  } catch {
    checks.strapi = false;
  }

  return res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    checks,
  });
}
