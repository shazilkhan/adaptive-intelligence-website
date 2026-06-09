/**
 * /admin/apollo-fields
 *
 * Internal admin page that fetches every typed custom field from Apollo and
 * shows their IDs with a one-click copy. Use this to populate the
 * APOLLO_FIELD_ID_* env vars referenced by the form handlers.
 *
 * Auth: append `?token=<MONITOR_DASHBOARD_TOKEN>` if configured. A server-side
 * gate (getServerSideProps below) 404s the page in production when the token is
 * missing/wrong; the API re-checks it too.
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          /* ignore */
        }
      }}
      style={{
        fontSize: 11,
        padding: '4px 10px',
        border: '1px solid #d1d5db',
        background: copied ? '#10b981' : '#fff',
        color: copied ? '#fff' : '#111',
        borderRadius: 4,
        cursor: 'pointer',
        fontWeight: 500,
      }}
    >
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

function envVarHint(name) {
  // Heuristic: turn "Services Needed" → APOLLO_FIELD_ID_SERVICES_NEEDED
  const slug = name
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
  return `APOLLO_FIELD_ID_${slug}`;
}

export default function ApolloFieldsAdmin() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    if (!router.isReady) return;
    const token = router.query?.token || '';
    const url = token
      ? `/api/admin/apollo-fields?token=${encodeURIComponent(token)}`
      : '/api/admin/apollo-fields';

    (async () => {
      try {
        const r = await fetch(url);
        const j = await r.json();
        if (!r.ok) {
          throw new Error(j.error || `HTTP ${r.status}`);
        }
        setData(j);
        setError(null);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [router.isReady, router.query?.token]);

  const filtered = data?.fields?.filter(
    (f) =>
      !filter ||
      f.name.toLowerCase().includes(filter.toLowerCase()) ||
      (f.id || '').toLowerCase().includes(filter.toLowerCase())
  ) || [];

  const envBlock = filtered
    .filter((f) => f.id)
    .map((f) => `${envVarHint(f.name)}=${f.id}`)
    .join('\n');

  return (
    <>
      <Head>
        <title>Apollo Custom Fields · Admin</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <div style={{
        fontFamily: 'system-ui, -apple-system, sans-serif',
        background: '#f3f4f6', minHeight: '100vh', padding: '24px 32px',
        color: '#111',
      }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <header style={{ marginBottom: 24 }}>
            <h1 style={{ margin: 0, fontSize: 28 }}>Apollo Custom Fields</h1>
            <p style={{ fontSize: 13, color: '#6b7280', marginTop: 4, marginBottom: 0 }}>
              Use these IDs in <code>typed_custom_fields[i].id</code>. Apollo rejects
              payloads that use human-readable names.
            </p>
          </header>

          {loading && (
            <div style={{ background: '#fff', padding: 24, borderRadius: 8, border: '1px solid #e5e7eb' }}>
              Loading from Apollo…
            </div>
          )}

          {error && (
            <div style={{
              background: '#fef2f2', padding: 16, borderRadius: 8,
              border: '1px solid #fecaca', color: '#991b1b',
            }}>
              <strong>Failed to load:</strong> {error}
              <p style={{ fontSize: 13, marginTop: 8, marginBottom: 0, color: '#7f1d1d' }}>
                Check that <code>APOLLO_API_KEY</code> is set on the server. If the page is
                token-protected, append <code>?token=YOUR_TOKEN</code> to the URL.
              </p>
            </div>
          )}

          {data && (
            <>
              <section style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: 16, marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <div style={{ fontSize: 13, color: '#6b7280' }}>
                    {data.count} field{data.count === 1 ? '' : 's'} loaded ·{' '}
                    {new Date(data.timestamp).toLocaleString()}
                  </div>
                  <input
                    type="text"
                    placeholder="Filter by name or ID…"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    style={{
                      padding: '6px 10px', border: '1px solid #d1d5db',
                      borderRadius: 6, fontSize: 13, width: 240,
                    }}
                  />
                </div>

                {filtered.length === 0 ? (
                  <p style={{ color: '#6b7280', fontSize: 13, margin: 0 }}>
                    {data.count === 0
                      ? 'No custom fields configured in Apollo yet. Create them in Apollo Settings → Fields, then refresh.'
                      : 'No fields match your filter.'}
                  </p>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#f9fafb', textAlign: 'left' }}>
                        <th style={{ padding: '10px 8px', fontSize: 12, fontWeight: 600 }}>Name</th>
                        <th style={{ padding: '10px 8px', fontSize: 12, fontWeight: 600 }}>Type</th>
                        <th style={{ padding: '10px 8px', fontSize: 12, fontWeight: 600 }}>Apollo ID</th>
                        <th style={{ padding: '10px 8px', fontSize: 12, fontWeight: 600 }}>Suggested env var</th>
                        <th style={{ padding: '10px 8px', fontSize: 12, fontWeight: 600 }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((f) => (
                        <tr key={f.id || f.name} style={{ borderTop: '1px solid #f3f4f6' }}>
                          <td style={{ padding: '10px 8px', fontSize: 13, fontWeight: 500 }}>{f.name}</td>
                          <td style={{ padding: '10px 8px', fontSize: 12, color: '#6b7280' }}>{f.type}</td>
                          <td style={{ padding: '10px 8px', fontSize: 12, fontFamily: 'monospace' }}>
                            {f.id || <em style={{ color: '#9ca3af' }}>(no id)</em>}
                          </td>
                          <td style={{ padding: '10px 8px', fontSize: 12, fontFamily: 'monospace', color: '#374151' }}>
                            {envVarHint(f.name)}
                          </td>
                          <td style={{ padding: '10px 8px' }}>
                            {f.id && <CopyButton value={f.id} />}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </section>

              {envBlock && (
                <section style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: 16, marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <h2 style={{ margin: 0, fontSize: 14 }}>Drop into <code>.env.local</code></h2>
                    <CopyButton value={envBlock} />
                  </div>
                  <pre style={{
                    background: '#0f172a', color: '#e2e8f0', padding: 12, borderRadius: 6,
                    fontSize: 12, overflow: 'auto', margin: 0,
                  }}>
                    {envBlock}
                  </pre>
                  <p style={{ fontSize: 12, color: '#6b7280', marginTop: 8, marginBottom: 0 }}>
                    Names are auto-derived from each Apollo field. Adjust as needed —
                    the form handlers reference specific names like{' '}
                    <code>APOLLO_FIELD_ID_MESSAGE</code> and{' '}
                    <code>APOLLO_FIELD_ID_SERVICES_NEEDED</code>.
                  </p>
                </section>
              )}
            </>
          )}
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
