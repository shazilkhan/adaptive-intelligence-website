/**
 * Check definitions. Each check is `() => Promise<{ok, error?, latencyMs}>`.
 * Checks are pure: they don't read or write state. The index.js handler
 * decides what to do with results.
 *
 * Adding a check:
 *  1. Add a function to CHECKS
 *  2. Add a severity to SEVERITY_BY_CHECK
 *  3. Add the key to the appropriate CHECK_BUCKETS array
 */

const CHECK_TIMEOUT_MS = 15_000;

function abortAfter(ms) {
  // AbortSignal.timeout exists in Node 20 but using a manual AbortController
  // is a bit more portable and clearer at the call site.
  const c = new AbortController();
  const t = setTimeout(() => c.abort(), ms);
  return { signal: c.signal, cancel: () => clearTimeout(t) };
}

async function timedFetch(url, options = {}) {
  const { signal, cancel } = abortAfter(CHECK_TIMEOUT_MS);
  const start = Date.now();
  try {
    const res = await fetch(url, { ...options, signal });
    return { res, latencyMs: Date.now() - start };
  } finally {
    cancel();
  }
}

const CHECKS = {
  // ─── Site frontend ──────────────────────────────────────────────────────
  'site.frontend': async () => {
    const base = process.env.SITE_BASE_URL;
    if (!base) return { ok: false, error: 'SITE_BASE_URL not set', latencyMs: 0 };
    try {
      const { res, latencyMs } = await timedFetch(`${base}/api/health`);
      if (!res.ok) return { ok: false, error: `HTTP ${res.status}`, latencyMs };
      const json = await res.json().catch(() => null);
      if (!json || json.status !== 'ok') {
        return { ok: false, error: `unexpected body: ${JSON.stringify(json)?.slice(0, 200)}`, latencyMs };
      }
      return { ok: true, latencyMs };
    } catch (err) {
      return { ok: false, error: err?.name === 'AbortError' ? 'timeout' : err?.message || String(err), latencyMs: CHECK_TIMEOUT_MS };
    }
  },

  // ─── Strapi API ─────────────────────────────────────────────────────────
  'strapi.api': async () => {
    const base = process.env.STRAPI_BASE_URL;
    if (!base) return { ok: false, error: 'STRAPI_BASE_URL not set', latencyMs: 0 };
    try {
      const { res, latencyMs } = await timedFetch(`${base}/api/setting`);
      if (!res.ok) return { ok: false, error: `HTTP ${res.status}`, latencyMs };
      return { ok: true, latencyMs };
    } catch (err) {
      return { ok: false, error: err?.name === 'AbortError' ? 'timeout' : err?.message || String(err), latencyMs: CHECK_TIMEOUT_MS };
    }
  },

  // ─── Strapi image sample (S3/CDN) ───────────────────────────────────────
  'strapi.images': async () => {
    const base = process.env.STRAPI_BASE_URL;
    if (!base) return { ok: false, error: 'STRAPI_BASE_URL not set', latencyMs: 0 };
    const start = Date.now();
    try {
      const headers = process.env.STRAPI_API_TOKEN
        ? { Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}` }
        : {};
      const listUrl = `${base}/api/upload/files?sort=createdAt:desc&pagination[limit]=5`;
      const { res: listRes } = await timedFetch(listUrl, { headers });
      if (!listRes.ok) {
        return { ok: false, error: `upload/files HTTP ${listRes.status}`, latencyMs: Date.now() - start };
      }
      const files = await listRes.json();
      // Strapi 5 returns an array directly for /api/upload/files
      const list = Array.isArray(files) ? files : files?.data || [];
      const urls = list.map((f) => f.url || f?.attributes?.url).filter(Boolean);
      if (urls.length === 0) {
        // No images uploaded yet — not a failure, but worth reporting as a soft success.
        return { ok: true, latencyMs: Date.now() - start, note: 'no media uploaded yet' };
      }
      // Resolve any relative URLs against the Strapi base (if S3 provider is
      // off, urls are like "/uploads/foo.png"). When S3 is on, urls are
      // already absolute.
      const absUrls = urls.map((u) => (u.startsWith('http') ? u : `${base}${u.startsWith('/') ? '' : '/'}${u}`));
      const heads = await Promise.all(
        absUrls.map(async (u) => {
          try {
            const { res } = await timedFetch(u, { method: 'HEAD' });
            return { url: u, ok: res.ok, status: res.status };
          } catch (err) {
            return { url: u, ok: false, status: err?.name === 'AbortError' ? 'timeout' : err?.message };
          }
        })
      );
      const failed = heads.filter((h) => !h.ok);
      if (failed.length > 0) {
        return {
          ok: false,
          error: `${failed.length}/${heads.length} image HEAD failed: ${failed.map((f) => `${f.url}=${f.status}`).join('; ')}`.slice(0, 500),
          latencyMs: Date.now() - start,
        };
      }
      return { ok: true, latencyMs: Date.now() - start };
    } catch (err) {
      return { ok: false, error: err?.message || String(err), latencyMs: Date.now() - start };
    }
  },

  // ─── Synthetic form POSTs ───────────────────────────────────────────────
  'forms.synthetic.contact': () =>
    syntheticFormCheck('/api/submit-contact-form', {
      firstName: 'Monitor',
      lastName: 'Synthetic',
      email: 'monitor@adaptiveintelligence.online',
      phone: '+10000000000',
      companyName: 'Adaptive Intelligence',
      message: 'Synthetic monitoring check',
    }),

  'forms.synthetic.letstalk': () =>
    syntheticFormCheck('/api/submit-lets-talk', {
      firstName: 'Monitor',
      lastName: 'Synthetic',
      email: 'monitor@adaptiveintelligence.online',
      phone: '+10000000000',
      company: 'Adaptive Intelligence',
      message: 'Synthetic monitoring check',
    }),

  'forms.synthetic.newsletter': () =>
    syntheticFormCheck('/api/subscribe-newsletter', {
      email: 'monitor@adaptiveintelligence.online',
    }),

  'forms.synthetic.download': () =>
    syntheticFormCheck('/api/track-download', {
      email: 'monitor@adaptiveintelligence.online',
      slug: 'synthetic-monitor',
      title: 'Synthetic Monitor Check',
    }),

  // ─── External dependencies ──────────────────────────────────────────────
  // Apollo has no public /healthz. A HEAD on the root resolves DNS + TLS
  // and lets us distinguish "Apollo's API server is reachable" from "we
  // can't talk to Apollo at all." Most non-200 responses are still proof
  // of reachability; only a thrown fetch error means trouble.
  'dep.apollo': async () => {
    const start = Date.now();
    try {
      const { res, latencyMs } = await timedFetch('https://api.apollo.io/', { method: 'HEAD' });
      // Any HTTP response = reachable.
      return { ok: true, latencyMs, note: `status=${res.status}` };
    } catch (err) {
      return { ok: false, error: err?.message || String(err), latencyMs: Date.now() - start };
    }
  },

  'dep.turnstile': async () => {
    const start = Date.now();
    try {
      const { res, latencyMs } = await timedFetch(
        'https://challenges.cloudflare.com/turnstile/v0/api.js',
        { method: 'HEAD' }
      );
      if (!res.ok) return { ok: false, error: `HTTP ${res.status}`, latencyMs };
      return { ok: true, latencyMs };
    } catch (err) {
      return { ok: false, error: err?.message || String(err), latencyMs: Date.now() - start };
    }
  },

  // ─── End-to-end Apollo write ────────────────────────────────────────────
  // Real POST to api.apollo.io/v1/contacts with a dedicated MONITOR list ID.
  // Confirms Apollo accepts writes — distinct from `dep.apollo` (reachability)
  // and `forms.synthetic.*` (handler logic). This is the only check that
  // proves the lead-capture pipeline is actually functional end-to-end.
  //
  // Runs once a day at 06:00 UTC so a failed test doesn't masquerade as a
  // real lead during business hours. Creates one Apollo contact per day in
  // the MONITOR list; cleanup is operator's responsibility for now.
  'forms.end_to_end': async () => {
    const apiKey = process.env.APOLLO_API_KEY;
    const listId = process.env.APOLLO_LIST_ID_MONITOR;
    if (!apiKey) return { ok: false, error: 'APOLLO_API_KEY not set', latencyMs: 0 };
    if (!listId) return { ok: false, error: 'APOLLO_LIST_ID_MONITOR not set', latencyMs: 0 };

    const payload = {
      api_key: apiKey,
      first_name: 'Monitor',
      last_name: 'EndToEnd',
      // Plus-addressing keeps these distinguishable from real leads even if
      // someone forgets the MONITOR list filter when scanning Apollo.
      email: `monitor+e2e-${new Date().toISOString().slice(0, 10)}@adaptiveintelligence.online`,
      organization_name: 'Adaptive Intelligence Monitor',
      label_ids: [listId],
      source: 'detector_end_to_end',
    };

    const start = Date.now();
    try {
      const { res, latencyMs } = await timedFetch('https://api.apollo.io/v1/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.text().catch(() => '');
        return { ok: false, error: `HTTP ${res.status}: ${body.slice(0, 250)}`, latencyMs };
      }
      return { ok: true, latencyMs };
    } catch (err) {
      return { ok: false, error: err?.message || String(err), latencyMs: Date.now() - start };
    }
  },
};

async function syntheticFormCheck(path, basePayload) {
  const site = process.env.SITE_BASE_URL;
  const secret = process.env.MONITOR_SECRET;
  if (!site) return { ok: false, error: 'SITE_BASE_URL not set', latencyMs: 0 };
  if (!secret) return { ok: false, error: 'MONITOR_SECRET not set — synthetic disabled', latencyMs: 0 };
  try {
    const { res, latencyMs } = await timedFetch(`${site}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-monitor-secret': secret,
      },
      body: JSON.stringify({ ...basePayload, synthetic: true }),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      return { ok: false, error: `HTTP ${res.status}: ${body.slice(0, 250)}`, latencyMs };
    }
    const json = await res.json().catch(() => null);
    if (!json || json.synthetic !== true) {
      // The endpoint returned 200 but didn't acknowledge synthetic mode —
      // meaning either MONITOR_SECRET mismatched or the handler isn't on
      // the deployed code yet. Either way: not a healthy synthetic path.
      return {
        ok: false,
        error: 'response missing synthetic:true (secret mismatch or handler not deployed?)',
        latencyMs,
      };
    }
    return { ok: true, latencyMs };
  } catch (err) {
    return { ok: false, error: err?.name === 'AbortError' ? 'timeout' : err?.message || String(err), latencyMs: CHECK_TIMEOUT_MS };
  }
}

export async function runCheck(checkKey) {
  const fn = CHECKS[checkKey];
  if (!fn) return { ok: false, error: `unknown check: ${checkKey}`, latencyMs: 0 };
  return fn();
}

/**
 * Which checks run at which frequency. The handler picks buckets each minute
 * based on UTC-minute modulo. Putting a check in multiple buckets would run
 * it more often than needed — pick the strictest applicable cadence.
 */
export const CHECK_BUCKETS = {
  every1min: ['site.frontend', 'strapi.api'],
  every5min: [
    'forms.synthetic.contact',
    'forms.synthetic.letstalk',
    'forms.synthetic.newsletter',
    'forms.synthetic.download',
    'dep.apollo',
    'dep.turnstile',
  ],
  every15min: ['strapi.images'],
  // Daily checks. Handler matches on hour:minute equality, not modulo, so
  // adjust DAILY_RUN_HOUR_UTC in index.js if you want a different time.
  daily0600UTC: ['forms.end_to_end'],
};

export const SEVERITY_BY_CHECK = {
  'site.frontend': 'CRITICAL',
  'strapi.api': 'HIGH',
  'strapi.images': 'HIGH',
  'forms.synthetic.contact': 'CRITICAL',
  'forms.synthetic.letstalk': 'CRITICAL',
  'forms.synthetic.newsletter': 'CRITICAL',
  'forms.synthetic.download': 'HIGH',
  'forms.end_to_end': 'CRITICAL',
  'dep.apollo': 'MEDIUM',
  'dep.turnstile': 'MEDIUM',
};
