/**
 * Monitoring helpers used by API route handlers.
 *
 * Synthetic-mode contract:
 *   The scheduled detector Lambda POSTs to form endpoints with the same
 *   shape as a real submission, plus:
 *     - header  x-monitor-secret: <MONITOR_SECRET>
 *     - body    synthetic: true
 *   When both checks pass, the handler validates and constructs payloads as
 *   normal but SKIPS Turnstile verification, Apollo, Slack, and Strapi
 *   side-effects. This catches handler regressions (validation logic,
 *   field mapping, missing env vars) without polluting third-party services.
 *
 *   When MONITOR_SECRET is unset, synthetic mode is disabled entirely —
 *   every request is treated as real. This is the safe default: a missing
 *   env var should fail closed, not open a side-effect-free bypass.
 *
 * Real-user requests should never carry the secret header in production, so
 * a constant-time-ish comparison is used to avoid leaking length info via
 * timing. Returns false fast for the common (non-synthetic) path.
 */

export function isSyntheticRequest(req) {
  const expected = process.env.MONITOR_SECRET;
  if (!expected) return false;

  const provided = req?.headers?.['x-monitor-secret'];
  if (typeof provided !== 'string' || provided.length !== expected.length) return false;

  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ provided.charCodeAt(i);
  }
  if (diff !== 0) return false;

  const body = (req?.body && (req.body.data || req.body)) || {};
  return body.synthetic === true || body.synthetic === 'true';
}

/**
 * Standard success response shape for a synthetic check. Lambda uses the
 * `synthetic: true` field to confirm it really hit the dry-run path and
 * not, e.g., a cached real response.
 */
export function syntheticOkResponse(extras = {}) {
  return {
    success: true,
    synthetic: true,
    message: 'Synthetic dry-run completed',
    ...extras,
  };
}
