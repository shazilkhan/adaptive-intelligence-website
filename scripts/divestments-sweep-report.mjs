#!/usr/bin/env node
/**
 * Divestments monthly sweep report.
 *
 * Pulls every company card on the Divestments page from Strapi, checks when
 * each score was last updated, and prints a Markdown checklist the team works
 * through for the month's "fresh sweep". Run by
 * .github/workflows/divestments-monthly-sweep.yml on the 1st of each month
 * (it opens a GitHub issue with this output), or manually:
 *
 *   node scripts/divestments-sweep-report.mjs
 *
 * Env:
 *   STRAPI_API_URL     Strapi origin (default: production)
 *   STALE_AFTER_DAYS   Cards older than this are flagged (default: 31)
 *   SLACK_WEBHOOK_URL  Optional — also posts a summary to Slack
 *   REPORT_FILE        Optional — also writes the Markdown to this path
 */

import { writeFileSync } from 'node:fs';

const STRAPI_API_URL = (process.env.STRAPI_API_URL || 'https://admin.adaptiveintelligence.online').replace(/\/$/, '');
const STALE_AFTER_DAYS = Number(process.env.STALE_AFTER_DAYS || 31);
const PAGE_URL = 'https://adaptiveintelligence.online/divestments';
const ADMIN_URL = `${STRAPI_API_URL}/admin/content-manager/single-types/api::non-compliant-page.non-compliant-page`;

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const today = new Date();
const monthLabel = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });

const daysSince = (dateStr) => {
  if (!dateStr) return null;
  const d = new Date(String(dateStr).slice(0, 10));
  if (Number.isNaN(d.getTime())) return null;
  return Math.floor((today - d) / MS_PER_DAY);
};

const res = await fetch(`${STRAPI_API_URL}/api/non-compliant-page?populate=*`);
if (!res.ok) {
  console.error(`Strapi returned ${res.status} for non-compliant-page`);
  process.exit(1);
}
const page = (await res.json()).data || {};

const industries = [1, 2, 3].map((n) => ({
  title: page[`industry${n}Title`] || `Industry #${n}`,
  companies: Array.isArray(page[`industry${n}Companies`]) ? page[`industry${n}Companies`] : [],
}));

const rows = industries.flatMap((ind) =>
  ind.companies.map((c) => {
    const age = daysSince(c.scoreLastUpdated);
    return {
      industry: ind.title,
      name: c.name || '(unnamed card)',
      lastUpdated: c.scoreLastUpdated ? String(c.scoreLastUpdated).slice(0, 10) : null,
      age,
      stale: age === null || age > STALE_AFTER_DAYS,
      adaptiveScore: c.adaptiveScore ?? null,
      esgRiskScore: c.esgRiskScore ?? null,
      esgUrl: c.esgScoreUrl || null,
    };
  })
);

const staleCount = rows.filter((r) => r.stale).length;
const pageSweepAge = daysSince(page.lastSweepDate);

const fmtAge = (r) => (r.age === null ? 'never' : r.age === 0 ? 'today' : `${r.age}d ago`);

const lines = [];
lines.push(`## Divestments sweep — ${monthLabel}`);
lines.push('');
lines.push(`**${rows.length} cards** across ${industries.filter((i) => i.companies.length).length} industries · **${staleCount} need a refresh** (no update in the last ${STALE_AFTER_DAYS} days).`);
lines.push(
  page.lastSweepDate
    ? `Page-level \`lastSweepDate\` is **${String(page.lastSweepDate).slice(0, 10)}** (${pageSweepAge}d ago).`
    : 'Page-level `lastSweepDate` is **not set** — set it when this sweep is done so the page shows "Last reviewed".'
);
lines.push('');
lines.push(`Edit in Strapi: ${ADMIN_URL}`);
lines.push(`Live page: ${PAGE_URL}`);
lines.push('');
lines.push('### Checklist');
lines.push('');
lines.push('For each company: re-check recent news/enforcement actions, refresh the four criteria scores, update `esgRiskScore` from the linked rating page, and set `scoreLastUpdated` to today.');
lines.push('');

for (const ind of industries) {
  const list = rows.filter((r) => r.industry === ind.title);
  if (list.length === 0) continue;
  lines.push(`#### ${ind.title}`);
  for (const r of list) {
    const flag = r.stale ? '⚠️ ' : '';
    const scores = [
      r.adaptiveScore !== null ? `Adaptive ${r.adaptiveScore}/5` : 'Adaptive —',
      r.esgRiskScore !== null ? `ESG risk ${r.esgRiskScore}` : 'ESG risk —',
    ].join(', ');
    const link = r.esgUrl ? ` · [rating page](${r.esgUrl})` : ' · no rating link';
    lines.push(`- [ ] ${flag}**${r.name}** — last updated ${fmtAge(r)}${r.lastUpdated ? ` (${r.lastUpdated})` : ''} · ${scores}${link}`);
  }
  lines.push('');
}

lines.push('### Wrap-up');
lines.push('');
lines.push('- [ ] Consider any companies to add or remove this month');
lines.push('- [ ] Set `lastSweepDate` on the Divestments page to today');
lines.push('- [ ] Publish the page in Strapi');
lines.push('');
lines.push(`_Generated ${today.toISOString().slice(0, 10)} by \`scripts/divestments-sweep-report.mjs\`._`);

const markdown = lines.join('\n');
console.log(markdown);

if (process.env.REPORT_FILE) {
  writeFileSync(process.env.REPORT_FILE, markdown, 'utf8');
}

if (process.env.SLACK_WEBHOOK_URL) {
  const staleNames = rows.filter((r) => r.stale).map((r) => r.name);
  const text = [
    `*Divestments sweep — ${monthLabel}*`,
    `${rows.length} cards · ${staleCount} need a refresh${staleNames.length ? `: ${staleNames.slice(0, 12).join(', ')}${staleNames.length > 12 ? '…' : ''}` : ''}`,
    `Strapi: ${ADMIN_URL}`,
  ].join('\n');
  try {
    const slackRes = await fetch(process.env.SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    if (!slackRes.ok) console.error(`Slack webhook returned ${slackRes.status}`);
  } catch (err) {
    console.error('Slack webhook failed:', err.message);
  }
}
