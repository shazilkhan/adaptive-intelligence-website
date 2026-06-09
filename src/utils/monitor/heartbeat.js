/**
 * Form healthcheck heartbeat helper.
 *
 * The monitor calls form endpoints with `?healthcheck=1` (and X-Healthcheck: 1
 * header). The handler should call `handleHeartbeat(req, res, requiredEnv)` at
 * the top — if it's a heartbeat, the helper validates env config and short-
 * circuits with `{ healthcheck: 'ok' }`. Returns `true` when handled.
 *
 * This lets the monitor verify the endpoint is alive AND that its required env
 * vars are wired up, without ever touching Apollo, Slack, or Strapi.
 */

export function isHeartbeat(req) {
  if (req.headers['x-healthcheck'] === '1') return true;
  if (req.query?.healthcheck === '1') return true;
  if (req.body && req.body.healthcheck === true) return true;
  return false;
}

export function handleHeartbeat(req, res, requiredEnv = []) {
  if (!isHeartbeat(req)) return false;
  const missing = requiredEnv.filter((v) => !process.env[v]);
  if (missing.length > 0) {
    res.status(500).json({
      healthcheck: 'fail',
      message: `Missing env: ${missing.join(', ')}`,
    });
    return true;
  }
  res.status(200).json({ healthcheck: 'ok' });
  return true;
}
