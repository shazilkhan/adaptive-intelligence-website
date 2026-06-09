/**
 * Individual check primitives. Each returns:
 *   { id, type, target, ok, status, durationMs, error?, meta? }
 *
 * id = stable identifier used for dedupe + state tracking
 * type = 'page' | 'image' | 'asset' | 'strapi' | 'form-config' | 'form-heartbeat' | 'env'
 */

import { monitorConfig } from '@/config/monitor.config';
import { fetchPage, headCheck, extractImageUrls, extractAssetUrls, probeUrls } from './crawler';
import { getStrapiApiUrl } from '@/utils/strapi';

function joinUrl(base, path) {
  const b = base.replace(/\/$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${b}${p}`;
}

export async function checkPage(baseUrl, pagePath) {
  const url = joinUrl(baseUrl, pagePath);
  const result = await fetchPage(url);
  // Heuristic: a Next.js error page returns 200 with the word "Application error" — flag it.
  let bodyError = null;
  if (result.ok && result.html) {
    const lc = result.html.toLowerCase();
    if (
      lc.includes('application error') ||
      lc.includes('500 - internal server error') ||
      lc.includes('this page could not be found')
    ) {
      bodyError = 'error_page_detected';
    }
  }
  return {
    id: `page:${pagePath}`,
    type: 'page',
    target: url,
    ok: result.ok && !bodyError,
    status: result.status,
    durationMs: result.durationMs,
    error: bodyError || result.error,
    meta: { html: result.ok ? result.html : null }, // pass html through for image scan
  };
}

/**
 * Given page-fetch results that already include HTML, scan for broken images.
 * Returns one check per missing image (so each shows up individually in alerts).
 */
export async function checkImagesOnPage(pageResult) {
  if (!pageResult.ok || !pageResult.meta?.html) return [];
  const urls = extractImageUrls(pageResult.meta.html, pageResult.target);
  if (urls.length === 0) return [];
  const probes = await probeUrls(urls, { concurrency: 8 });
  const checks = [];
  for (const p of probes) {
    if (!p.ok) {
      checks.push({
        id: `image:${p.url}`,
        type: 'image',
        target: p.url,
        ok: false,
        status: p.status,
        durationMs: p.durationMs,
        error: p.error || `http_${p.status}`,
        meta: { foundOn: pageResult.target },
      });
    }
  }
  return checks;
}

/**
 * Scan all <link>, <script>, <source>, and CSS url(...) references on a page.
 * Surfaces broken stylesheets/JS bundles which would silently break the page.
 */
export async function checkAssetsOnPage(pageResult) {
  if (!pageResult.ok || !pageResult.meta?.html) return [];
  const urls = extractAssetUrls(pageResult.meta.html, pageResult.target);
  // extractAssetUrls includes images — skip those, they're handled separately.
  const nonImage = urls.filter((u) => !/\.(png|jpe?g|gif|webp|svg|avif|ico)(\?|$)/i.test(u));
  if (nonImage.length === 0) return [];
  const probes = await probeUrls(nonImage, { concurrency: 8 });
  const checks = [];
  for (const p of probes) {
    if (!p.ok) {
      checks.push({
        id: `asset:${p.url}`,
        type: 'asset',
        target: p.url,
        ok: false,
        status: p.status,
        durationMs: p.durationMs,
        error: p.error || `http_${p.status}`,
        meta: { foundOn: pageResult.target },
      });
    }
  }
  return checks;
}

export async function checkCriticalAsset(baseUrl, assetPath) {
  const url = joinUrl(baseUrl, assetPath);
  const r = await headCheck(url);
  return {
    id: `critical-asset:${assetPath}`,
    type: 'asset',
    target: url,
    ok: r.ok,
    status: r.status,
    durationMs: r.durationMs,
    error: r.ok ? null : (r.error || `http_${r.status}`),
  };
}

export async function checkStrapi() {
  const base = getStrapiApiUrl();
  if (!base) {
    return {
      id: 'strapi:base',
      type: 'strapi',
      target: '(unconfigured)',
      ok: false,
      status: 0,
      durationMs: 0,
      error: 'no_strapi_url_configured',
    };
  }
  const url = `${base}/api/setting`;
  const r = await headCheck(url, monitorConfig.timeouts.strapi);
  return {
    id: `strapi:setting`,
    type: 'strapi',
    target: url,
    ok: r.ok,
    status: r.status,
    durationMs: r.durationMs,
    error: r.ok ? null : (r.error || `http_${r.status}`),
  };
}

export function checkRequiredEnvVars() {
  const checks = [];
  for (const [group, vars] of Object.entries(monitorConfig.requiredEnvVars)) {
    const missing = vars.filter((v) => !process.env[v]);
    checks.push({
      id: `env:${group}`,
      type: 'env',
      target: `env:${group}`,
      ok: missing.length === 0,
      status: missing.length === 0 ? 200 : 0,
      durationMs: 0,
      error: missing.length === 0 ? null : `missing: ${missing.join(', ')}`,
      meta: { group, vars, missing },
    });
  }
  return checks;
}

/**
 * Form heartbeat: posts a known dry-run payload to each form endpoint with
 * ?healthcheck=1. The form handler short-circuits, runs validation, and returns
 * { healthcheck: 'ok' } without writing to Apollo / Strapi / Slack.
 *
 * We expect 200 + body.healthcheck === 'ok'. Anything else = form is broken.
 */
export async function checkFormHeartbeat(baseUrl, form) {
  const url = `${joinUrl(baseUrl, form.endpoint)}?healthcheck=1`;
  const start = Date.now();
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), monitorConfig.timeouts.form);
  try {
    const res = await fetch(url, {
      method: form.method || 'POST',
      signal: ctrl.signal,
      headers: {
        'Content-Type': 'application/json',
        'X-Healthcheck': '1',
        'User-Agent': 'AdaptiveIntelligence-UptimeMonitor/1.0',
      },
      body: JSON.stringify({ healthcheck: true }),
    });
    const text = await res.text();
    let body = null;
    try { body = JSON.parse(text); } catch { body = { raw: text }; }
    const ok = res.ok && body && body.healthcheck === 'ok';
    return {
      id: `form:${form.name}`,
      type: 'form-heartbeat',
      target: url,
      ok,
      status: res.status,
      durationMs: Date.now() - start,
      error: ok ? null : (body?.message || `unexpected_response_${res.status}`),
      meta: { form: form.name },
    };
  } catch (err) {
    return {
      id: `form:${form.name}`,
      type: 'form-heartbeat',
      target: url,
      ok: false,
      status: 0,
      durationMs: Date.now() - start,
      error: err?.name === 'AbortError' ? 'timeout' : err?.message || 'fetch_failed',
      meta: { form: form.name },
    };
  } finally {
    clearTimeout(t);
  }
}
