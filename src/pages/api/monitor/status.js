// pages/api/monitor/status.js
// Public detector status. Fetches the JSON snapshot published by the
// detector Lambda to S3 every minute. Falls back to a placeholder shape
// when the snapshot isn't reachable so callers can still distinguish
// "detector not deployed yet" from "site down."
//
// Set MONITOR_STATUS_URL in Amplify env to the S3 URL returned by the SAM
// stack's StatusJsonUrl output.

const FETCH_TIMEOUT_MS = 2500;

const PLACEHOLDER_KEYS = [
  'site.frontend',
  'strapi.api',
  'strapi.images',
  'forms.synthetic.contact',
  'forms.synthetic.letstalk',
  'forms.synthetic.newsletter',
  'forms.synthetic.download',
  'forms.end_to_end',
  'dep.apollo',
  'dep.turnstile',
];

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'public, max-age=15');

  const url = process.env.MONITOR_STATUS_URL;
  if (!url) return res.status(200).json(placeholder('MONITOR_STATUS_URL not configured'));

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    let snapshot;
    try {
      const upstream = await fetch(url, { signal: controller.signal, cache: 'no-store' });
      if (!upstream.ok) {
        return res.status(200).json(placeholder(`status JSON upstream returned ${upstream.status}`));
      }
      snapshot = await upstream.json();
    } finally {
      clearTimeout(timeout);
    }

    // Stamp the response with the time it was served so clients can detect
    // stale snapshots (e.g., detector hasn't published in N minutes).
    snapshot.servedAt = new Date().toISOString();
    return res.status(200).json(snapshot);
  } catch (err) {
    return res
      .status(200)
      .json(placeholder(err?.name === 'AbortError' ? 'status JSON fetch timed out' : err?.message || 'unknown error'));
  }
}

function placeholder(note) {
  const checks = Object.fromEntries(PLACEHOLDER_KEYS.map((k) => [k, { state: 'PENDING', lastChecked: null }]));
  return {
    timestamp: new Date().toISOString(),
    overall: 'unknown',
    note,
    checks,
  };
}
