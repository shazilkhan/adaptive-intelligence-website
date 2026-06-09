/**
 * Lightweight HTML crawler for monitoring.
 *
 * No external deps — uses fetch + regex. Good enough to find <img>, <link>, <script>
 * tags and verify each URL responds 2xx. Skips data: URIs, mailto:, tel:.
 */

import { monitorConfig } from '@/config/monitor.config';

function withTimeout(promise, ms) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  return [ctrl.signal, () => clearTimeout(t)];
}

export async function fetchPage(url, timeoutMs = monitorConfig.timeouts.page) {
  const [signal, clear] = withTimeout(null, timeoutMs);
  const start = Date.now();
  try {
    const res = await fetch(url, {
      signal,
      redirect: 'follow',
      headers: { 'User-Agent': 'AdaptiveIntelligence-UptimeMonitor/1.0' },
    });
    const html = await res.text();
    return {
      ok: res.ok,
      status: res.status,
      durationMs: Date.now() - start,
      html,
      contentType: res.headers.get('content-type') || '',
    };
  } catch (err) {
    return {
      ok: false,
      status: 0,
      durationMs: Date.now() - start,
      html: '',
      error: err?.name === 'AbortError' ? 'timeout' : err?.message || 'fetch_failed',
    };
  } finally {
    clear();
  }
}

export async function headCheck(url, timeoutMs = monitorConfig.timeouts.asset) {
  const [signal, clear] = withTimeout(null, timeoutMs);
  const start = Date.now();
  try {
    let res = await fetch(url, {
      method: 'HEAD',
      signal,
      redirect: 'follow',
      headers: { 'User-Agent': 'AdaptiveIntelligence-UptimeMonitor/1.0' },
    });
    // Some hosts don't support HEAD properly — fall back to GET when we get 405/501.
    if (res.status === 405 || res.status === 501) {
      const [s2, c2] = withTimeout(null, timeoutMs);
      try {
        res = await fetch(url, { method: 'GET', signal: s2, redirect: 'follow' });
      } finally {
        c2();
      }
    }
    return { ok: res.ok, status: res.status, durationMs: Date.now() - start };
  } catch (err) {
    return {
      ok: false,
      status: 0,
      durationMs: Date.now() - start,
      error: err?.name === 'AbortError' ? 'timeout' : err?.message || 'fetch_failed',
    };
  } finally {
    clear();
  }
}

const SRC_PATTERNS = [
  // <img src="..."> and srcset
  /<img\b[^>]*\bsrc\s*=\s*["']([^"']+)["']/gi,
  // <source src="..."> (video/audio/picture)
  /<source\b[^>]*\bsrc\s*=\s*["']([^"']+)["']/gi,
  // <link rel="stylesheet|icon|preload" href="...">
  /<link\b[^>]*\bhref\s*=\s*["']([^"']+)["'][^>]*>/gi,
  // <script src="...">
  /<script\b[^>]*\bsrc\s*=\s*["']([^"']+)["']/gi,
];

const SRCSET_PATTERN = /<img\b[^>]*\bsrcset\s*=\s*["']([^"']+)["']/gi;
const CSS_URL_PATTERN = /url\(\s*['"]?([^)'"]+)['"]?\s*\)/gi;

function isMonitorable(url) {
  if (!url) return false;
  const u = url.trim();
  if (!u) return false;
  if (u.startsWith('data:')) return false;
  if (u.startsWith('mailto:')) return false;
  if (u.startsWith('tel:')) return false;
  if (u.startsWith('javascript:')) return false;
  if (u.startsWith('#')) return false;
  return true;
}

function resolveUrl(href, base) {
  try {
    return new URL(href, base).toString();
  } catch {
    return null;
  }
}

/**
 * Extract every external resource referenced by the HTML — img, source, link, script,
 * srcset entries, and url(...) values inside inline <style>. Returns absolute URLs.
 */
export function extractAssetUrls(html, baseUrl) {
  if (!html) return [];
  const found = new Set();

  for (const pattern of SRC_PATTERNS) {
    pattern.lastIndex = 0;
    let m;
    while ((m = pattern.exec(html)) !== null) {
      const raw = m[1];
      if (!isMonitorable(raw)) continue;
      const abs = resolveUrl(raw, baseUrl);
      if (abs) found.add(abs);
    }
  }

  // srcset: "url 1x, url2 2x"
  SRCSET_PATTERN.lastIndex = 0;
  let m;
  while ((m = SRCSET_PATTERN.exec(html)) !== null) {
    const entries = m[1].split(',');
    for (const entry of entries) {
      const url = entry.trim().split(/\s+/)[0];
      if (!isMonitorable(url)) continue;
      const abs = resolveUrl(url, baseUrl);
      if (abs) found.add(abs);
    }
  }

  CSS_URL_PATTERN.lastIndex = 0;
  while ((m = CSS_URL_PATTERN.exec(html)) !== null) {
    const raw = m[1];
    if (!isMonitorable(raw)) continue;
    const abs = resolveUrl(raw, baseUrl);
    if (abs) found.add(abs);
  }

  return Array.from(found);
}

/**
 * Extract just <img> URLs — used for the "missing image" check.
 */
export function extractImageUrls(html, baseUrl) {
  if (!html) return [];
  const found = new Set();
  const pattern = /<img\b[^>]*\bsrc\s*=\s*["']([^"']+)["']/gi;
  let m;
  while ((m = pattern.exec(html)) !== null) {
    const raw = m[1];
    if (!isMonitorable(raw)) continue;
    const abs = resolveUrl(raw, baseUrl);
    if (abs) found.add(abs);
  }
  return Array.from(found);
}

/**
 * Probe a list of URLs concurrently, capping concurrency to avoid hammering hosts.
 */
export async function probeUrls(urls, { concurrency = 8 } = {}) {
  const results = [];
  let i = 0;
  async function worker() {
    while (i < urls.length) {
      const idx = i++;
      const url = urls[idx];
      const r = await headCheck(url);
      results.push({ url, ...r });
    }
  }
  const workers = Array.from({ length: Math.min(concurrency, urls.length) }, worker);
  await Promise.all(workers);
  return results;
}
