/**
 * Internal uptime monitor configuration.
 *
 * Pages, assets, forms, and integrations to verify on each monitor run.
 * The runner reads this file and walks each section.
 */

export const monitorConfig = {
  // Base URL the monitor crawls. Falls back to NEXT_PUBLIC_SITE_URL or localhost.
  baseUrl:
    process.env.MONITOR_BASE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    'http://localhost:3000',

  // Static pages the monitor must always be able to render. Mirrors sitemap.xml.js.
  staticPages: [
    '/',
    '/about',
    '/adaptive-and-ai',
    '/ai',
    '/case-studies',
    '/contact',
    '/cookie-policy',
    '/creatives',
    '/download',
    '/eco',
    '/privacy-policy',
    '/services',
    '/team',
    '/terms-and-conditions',
    '/terms-of-use',
  ],

  // Critical static assets that must resolve. Add hero images, logos, OG images here.
  criticalAssets: [
    '/favicon.ico',
    '/robots.txt',
  ],

  // Form endpoints checked in heartbeat mode (?healthcheck=1).
  forms: [
    { name: 'contact', endpoint: '/api/submit-contact-form', method: 'POST' },
    { name: 'lets-talk', endpoint: '/api/submit-lets-talk', method: 'POST' },
    { name: 'newsletter', endpoint: '/api/subscribe-newsletter', method: 'POST' },
    { name: 'download', endpoint: '/api/track-download', method: 'POST' },
  ],

  // Required env vars per form. Missing = misconfiguration alert.
  requiredEnvVars: {
    contact: ['APOLLO_API_KEY'],
    'lets-talk': ['APOLLO_API_KEY'],
    newsletter: ['APOLLO_API_KEY'],
    download: ['APOLLO_API_KEY'],
    slack: ['SLACK_WEBHOOK_URL'],
    turnstile: ['TURNSTILE_SECRET_KEY', 'NEXT_PUBLIC_TURNSTILE_SITE_KEY'],
  },

  // Per-check timeouts (ms).
  timeouts: {
    page: 15000,
    asset: 8000,
    strapi: 10000,
    form: 8000,
  },

  // Re-alert dedupe window: don't ping Slack about the same failure within this many ms.
  dedupeWindowMs: 30 * 60 * 1000, // 30 min

  // Max log entries kept on disk before rotation.
  logRetention: {
    maxRuns: 500,
    maxIncidents: 200,
  },

  // Slack alerter behaviour.
  slack: {
    enabled: true,
    onlyOnStateChange: true, // up→down or down→up; not every run
    mentionOnDown: process.env.MONITOR_SLACK_MENTION || '', // e.g. "<!channel>" or "<@U123>"
  },

  // Dashboard auth. If MONITOR_DASHBOARD_TOKEN is set, /admin/status requires ?token=...
  dashboardToken: process.env.MONITOR_DASHBOARD_TOKEN || '',
};

export default monitorConfig;
