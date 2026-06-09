/**
 * /admin/status
 *
 * Internal-only uptime monitor dashboard. Reads /api/monitor/status and renders
 * a live view of:
 *   - Overall status pill (ok / degraded / down)
 *   - 24h + 7d uptime
 *   - Per-type check breakdown from the latest run
 *   - Open incidents
 *   - Recent run history sparkline
 *
 * Auth: append `?token=<MONITOR_DASHBOARD_TOKEN>` if configured. A server-side
 * gate (getServerSideProps below) 404s the page in production when the token is
 * missing/wrong; the token is also forwarded to the API, which re-checks it.
 */

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

const REFRESH_MS = 30000;

function StatusPill({ status }) {
  const map = {
    ok: { bg: '#d1fae5', fg: '#065f46', label: 'All Systems Operational' },
    degraded: { bg: '#fef3c7', fg: '#92400e', label: 'Degraded' },
    down: { bg: '#fee2e2', fg: '#991b1b', label: 'Outage Detected' },
    unknown: { bg: '#e5e7eb', fg: '#374151', label: 'No Data Yet' },
  };
  const s = map[status] || map.unknown;
  return (
    <span style={{
      background: s.bg, color: s.fg, padding: '6px 14px',
      borderRadius: 999, fontWeight: 600, fontSize: 14,
    }}>
      {s.label}
    </span>
  );
}

function Stat({ label, value, sub }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: 16 }}>
      <div style={{ fontSize: 12, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, marginTop: 4, color: '#111' }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

function Sparkline({ runs }) {
  if (!runs || runs.length === 0) return null;
  const w = 480, h = 60, pad = 4;
  const data = runs.slice(-50);
  const max = Math.max(...data.map((r) => r.summary?.failed || 0), 1);
  const step = (w - pad * 2) / Math.max(data.length - 1, 1);
  const points = data.map((r, i) => {
    const failed = r.summary?.failed || 0;
    const y = h - pad - (failed / max) * (h - pad * 2);
    return `${pad + i * step},${y}`;
  }).join(' ');
  return (
    <svg width={w} height={h} style={{ background: '#f9fafb', borderRadius: 6 }}>
      <polyline fill="none" stroke="#dc2626" strokeWidth="2" points={points} />
      <line x1={pad} y1={h - pad} x2={w - pad} y2={h - pad} stroke="#e5e7eb" />
    </svg>
  );
}

function CheckRow({ check }) {
  const ok = check.ok;
  return (
    <tr>
      <td style={{ padding: '6px 8px', fontSize: 12, fontFamily: 'monospace' }}>
        <span style={{
          display: 'inline-block', width: 8, height: 8, borderRadius: '50%',
          background: ok ? '#10b981' : '#ef4444', marginRight: 8,
        }} />
        {check.id}
      </td>
      <td style={{ padding: '6px 8px', fontSize: 12, color: '#6b7280' }}>{check.type}</td>
      <td style={{ padding: '6px 8px', fontSize: 12 }}>
        {check.status || (ok ? 'OK' : 'ERR')}
      </td>
      <td style={{ padding: '6px 8px', fontSize: 12, color: '#6b7280' }}>{check.durationMs}ms</td>
      <td style={{ padding: '6px 8px', fontSize: 12, color: ok ? '#6b7280' : '#dc2626' }}>
        {check.error || '—'}
      </td>
    </tr>
  );
}

export default function StatusDashboard() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [filter, setFilter] = useState('failed'); // 'failed' | 'all'
  const tokenRef = useRef(null);

  async function load() {
    try {
      const token = router.query?.token || '';
      tokenRef.current = token;
      const url = token ? `/api/monitor/status?token=${encodeURIComponent(token)}` : '/api/monitor/status';
      const r = await fetch(url);
      if (!r.ok) {
        const j = await r.json().catch(() => ({}));
        throw new Error(j.error || `HTTP ${r.status}`);
      }
      const j = await r.json();
      setData(j);
      setError(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function triggerRun() {
    setRunning(true);
    try {
      const secret = router.query?.runSecret || '';
      const url = secret ? `/api/monitor/run?secret=${encodeURIComponent(secret)}` : '/api/monitor/run';
      await fetch(url);
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setRunning(false);
    }
  }

  useEffect(() => {
    if (!router.isReady) return;
    load();
    const id = setInterval(load, REFRESH_MS);
    return () => clearInterval(id);
  }, [router.isReady, router.query?.token]);

  if (loading) {
    return <div style={{ padding: 40, fontFamily: 'system-ui' }}>Loading…</div>;
  }
  if (error) {
    return (
      <div style={{ padding: 40, fontFamily: 'system-ui' }}>
        <h1>Monitor Dashboard</h1>
        <p style={{ color: '#dc2626' }}>{error}</p>
        <p style={{ fontSize: 13, color: '#6b7280' }}>
          If a token is required, append <code>?token=YOUR_TOKEN</code> to the URL.
        </p>
      </div>
    );
  }

  const { lastRun, uptime24h, uptime7d, openIncidents, recentRuns, checksByType, baseUrl, recentlyClosed } = data;
  const overallStatus = (() => {
    if (!lastRun) return 'unknown';
    const failed = lastRun.summary?.failed || 0;
    const total = lastRun.summary?.total || 1;
    if (failed === 0) return 'ok';
    if (failed < total * 0.2) return 'degraded';
    return 'down';
  })();

  const renderChecks = (checks) =>
    (checks || [])
      .filter((c) => filter === 'all' || !c.ok)
      .sort((a, b) => Number(a.ok) - Number(b.ok))
      .map((c) => <CheckRow key={c.id} check={c} />);

  return (
    <>
      <Head>
        <title>Site Status · Adaptive Intelligence</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <div style={{
        fontFamily: 'system-ui, -apple-system, sans-serif',
        background: '#f3f4f6', minHeight: '100vh', padding: '24px 32px',
        color: '#111',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <div>
              <h1 style={{ margin: 0, fontSize: 28 }}>Site Status</h1>
              <div style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>
                Monitoring <code>{baseUrl}</code>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <StatusPill status={overallStatus} />
              <button
                onClick={triggerRun}
                disabled={running}
                style={{
                  padding: '8px 14px', borderRadius: 6, border: '1px solid #d1d5db',
                  background: running ? '#e5e7eb' : '#fff', cursor: running ? 'wait' : 'pointer',
                  fontSize: 13, fontWeight: 500,
                }}
              >
                {running ? 'Running…' : 'Run Now'}
              </button>
            </div>
          </header>

          <section style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
            <Stat
              label="Last Run"
              value={lastRun ? `${lastRun.summary?.passed || 0}/${lastRun.summary?.total || 0}` : '—'}
              sub={lastRun ? `${new Date(lastRun.ts).toLocaleString()} · ${lastRun.durationMs}ms` : 'No runs yet'}
            />
            <Stat
              label="Open Incidents"
              value={openIncidents?.length || 0}
              sub={openIncidents?.length === 0 ? 'All clear' : 'See below'}
            />
            <Stat
              label="Uptime · 24h"
              value={uptime24h ? `${uptime24h.uptimePct.toFixed(2)}%` : '—'}
              sub={uptime24h ? `${uptime24h.runs} runs` : 'Insufficient data'}
            />
            <Stat
              label="Uptime · 7d"
              value={uptime7d ? `${uptime7d.uptimePct.toFixed(2)}%` : '—'}
              sub={uptime7d ? `${uptime7d.runs} runs` : 'Insufficient data'}
            />
          </section>

          <section style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: 16, marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h2 style={{ margin: 0, fontSize: 16 }}>Failures over last {recentRuns.length} runs</h2>
            </div>
            <Sparkline runs={recentRuns} />
          </section>

          <section style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: 16, marginBottom: 24 }}>
            <h2 style={{ margin: '0 0 12px', fontSize: 16 }}>Open Incidents ({openIncidents?.length || 0})</h2>
            {(!openIncidents || openIncidents.length === 0) ? (
              <p style={{ color: '#6b7280', fontSize: 13, margin: 0 }}>No open incidents.</p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f9fafb', textAlign: 'left' }}>
                    <th style={{ padding: '8px', fontSize: 12 }}>Target</th>
                    <th style={{ padding: '8px', fontSize: 12 }}>Type</th>
                    <th style={{ padding: '8px', fontSize: 12 }}>Opened</th>
                    <th style={{ padding: '8px', fontSize: 12 }}>Last Seen</th>
                    <th style={{ padding: '8px', fontSize: 12 }}>Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {openIncidents.map((i) => (
                    <tr key={i.id}>
                      <td style={{ padding: '6px 8px', fontFamily: 'monospace', fontSize: 12 }}>{i.target}</td>
                      <td style={{ padding: '6px 8px', fontSize: 12 }}>{i.type}</td>
                      <td style={{ padding: '6px 8px', fontSize: 12 }}>{new Date(i.openedAt).toLocaleString()}</td>
                      <td style={{ padding: '6px 8px', fontSize: 12 }}>{new Date(i.lastSeenAt).toLocaleString()}</td>
                      <td style={{ padding: '6px 8px', fontSize: 12, color: '#dc2626' }}>{i.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>

          <section style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: 16, marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h2 style={{ margin: 0, fontSize: 16 }}>Latest Run · Per-Check Detail</h2>
              <div>
                <button
                  onClick={() => setFilter('failed')}
                  style={{
                    fontSize: 12, padding: '4px 10px', marginRight: 4,
                    background: filter === 'failed' ? '#111' : '#fff', color: filter === 'failed' ? '#fff' : '#111',
                    border: '1px solid #d1d5db', borderRadius: 4, cursor: 'pointer',
                  }}
                >
                  Failed Only
                </button>
                <button
                  onClick={() => setFilter('all')}
                  style={{
                    fontSize: 12, padding: '4px 10px',
                    background: filter === 'all' ? '#111' : '#fff', color: filter === 'all' ? '#fff' : '#111',
                    border: '1px solid #d1d5db', borderRadius: 4, cursor: 'pointer',
                  }}
                >
                  All Checks
                </button>
              </div>
            </div>

            {Object.keys(checksByType || {}).length === 0 && (
              <p style={{ color: '#6b7280', fontSize: 13, margin: 0 }}>No run data yet. Click <em>Run Now</em>.</p>
            )}
            {Object.entries(checksByType || {}).map(([type, checks]) => {
              const visible = checks.filter((c) => filter === 'all' || !c.ok);
              if (visible.length === 0 && filter === 'failed') return null;
              return (
                <div key={type} style={{ marginBottom: 16 }}>
                  <h3 style={{ fontSize: 13, color: '#374151', margin: '8px 0', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    {type} ({checks.filter((c) => c.ok).length}/{checks.length} passing)
                  </h3>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <tbody>{renderChecks(checks)}</tbody>
                  </table>
                </div>
              );
            })}
          </section>

          {recentlyClosed?.length > 0 && (
            <section style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: 16, marginBottom: 24 }}>
              <h2 style={{ margin: '0 0 12px', fontSize: 16 }}>Recently Resolved</h2>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f9fafb', textAlign: 'left' }}>
                    <th style={{ padding: '8px', fontSize: 12 }}>Target</th>
                    <th style={{ padding: '8px', fontSize: 12 }}>Opened</th>
                    <th style={{ padding: '8px', fontSize: 12 }}>Closed</th>
                    <th style={{ padding: '8px', fontSize: 12 }}>Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {recentlyClosed.map((i) => {
                    const dur = new Date(i.closedAt) - new Date(i.openedAt);
                    const mins = Math.round(dur / 60000);
                    return (
                      <tr key={`${i.id}-${i.openedAt}`}>
                        <td style={{ padding: '6px 8px', fontFamily: 'monospace', fontSize: 12 }}>{i.target}</td>
                        <td style={{ padding: '6px 8px', fontSize: 12 }}>{new Date(i.openedAt).toLocaleString()}</td>
                        <td style={{ padding: '6px 8px', fontSize: 12 }}>{new Date(i.closedAt).toLocaleString()}</td>
                        <td style={{ padding: '6px 8px', fontSize: 12 }}>{mins} min</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </section>
          )}

          <footer style={{ fontSize: 12, color: '#9ca3af', textAlign: 'center', padding: '16px 0' }}>
            Auto-refresh every {REFRESH_MS / 1000}s · {data.timestamp}
          </footer>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps({ query }) {
  const expected = process.env.MONITOR_DASHBOARD_TOKEN || '';
  const isProd =
    process.env.VERCEL_ENV === 'production' ||
    (process.env.NODE_ENV === 'production' && process.env.VERCEL_ENV !== 'preview');
  // Fail-closed in production: require a matching ?token. The backing API
  // enforces the same token for the data itself.
  const authed = expected ? (query?.token || '') === expected : !isProd;
  if (!authed) return { notFound: true };
  return { props: {} };
}
