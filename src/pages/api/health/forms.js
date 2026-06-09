/**
 * GET /api/health/forms
 *
 * Verifies form endpoints respond to a healthcheck heartbeat AND that all
 * required env vars are configured.
 */

import { monitorConfig } from '@/config/monitor.config';
import { checkFormHeartbeat, checkRequiredEnvVars } from '@/utils/monitor/checks';
import { authorizeDashboard } from '@/utils/monitor/auth';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (!authorizeDashboard(req)) {
    return res.status(401).json({ ok: false, error: 'unauthorized' });
  }
  const baseUrl = monitorConfig.baseUrl;

  const envChecks = checkRequiredEnvVars();
  const formChecks = await Promise.all(
    monitorConfig.forms.map((f) => checkFormHeartbeat(baseUrl, f))
  );

  const allOk =
    envChecks.every((c) => c.ok) && formChecks.every((c) => c.ok);

  return res.status(200).json({
    ok: allOk,
    baseUrl,
    timestamp: new Date().toISOString(),
    forms: formChecks,
    env: envChecks,
  });
}
