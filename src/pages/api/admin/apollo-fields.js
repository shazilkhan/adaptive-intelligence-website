/**
 * GET /api/admin/apollo-fields
 *
 * Lists every typed custom field configured on your Apollo account along with
 * its internal ID. Use these IDs in `typed_custom_fields[i].id` when posting
 * contacts — Apollo rejects payloads that use human-readable strings here.
 *
 * Auth: gated by MONITOR_DASHBOARD_TOKEN (same token guarding /admin/status).
 *       Pass via ?token=... or X-Dashboard-Token header. If the token isn't
 *       set, the route is open (dev mode).
 *
 * APOLLO_API_KEY must be set server-side. Never echoed back to the client.
 */

import { authorizeDashboard } from '@/utils/monitor/auth';

const APOLLO_ENDPOINT = 'https://api.apollo.io/v1/typed_custom_fields';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (!authorizeDashboard(req)) {
    return res.status(401).json({ ok: false, error: 'unauthorized' });
  }

  const apiKey = process.env.APOLLO_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      ok: false,
      error: 'APOLLO_API_KEY missing on server',
    });
  }

  // Apollo's typed_custom_fields endpoint is GET-only. Send the api_key both as
  // query param (legacy) and X-Api-Key header (current) for maximum compatibility.
  let upstream;
  try {
    const url = `${APOLLO_ENDPOINT}?api_key=${encodeURIComponent(apiKey)}`;
    upstream = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-Api-Key': apiKey,
        'Cache-Control': 'no-cache',
      },
    });
  } catch (err) {
    return res.status(502).json({
      ok: false,
      error: 'apollo_unreachable',
      details: err?.message || String(err),
    });
  }

  const text = await upstream.text();
  let body = null;
  try { body = text ? JSON.parse(text) : null; } catch { body = { raw: text }; }

  if (!upstream.ok) {
    return res.status(upstream.status || 502).json({
      ok: false,
      error: 'apollo_rejected',
      status: upstream.status,
      details: body,
    });
  }

  // Apollo's response shape: { typed_custom_fields: [{ id, name, field_type, ... }, ...] }
  const fields = Array.isArray(body?.typed_custom_fields)
    ? body.typed_custom_fields
    : [];

  // Slim the payload — only what's useful for the UI. Drop anything that might
  // leak account internals. Apollo separates fields by `modality` (contact vs
  // account); we surface that so the UI can group/filter.
  const safe = fields.map((f) => ({
    id: f.id || f._id || null,
    name: f.name || f.label || '(unnamed)',
    type: f.field_type || f.type || 'unknown',
    modality: f.modality || null,
    options: Array.isArray(f.picklist_options) && f.picklist_options.length > 0
      ? f.picklist_options
      : undefined,
  }));

  return res.status(200).json({
    ok: true,
    count: safe.length,
    fields: safe,
    timestamp: new Date().toISOString(),
  });
}
