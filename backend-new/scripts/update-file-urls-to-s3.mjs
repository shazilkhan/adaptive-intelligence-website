#!/usr/bin/env node
/**
 * One-time script: update existing file URLs in Strapi DB to full S3 URLs.
 * - Main url column: /uploads/... → https://bucket.s3.../uploads/...
 * - formats JSON (thumbnails, small, medium, large): same rewrite so admin thumbnails load from S3.
 *
 * Prereqs: Files are already in S3. Bucket is public-read.
 *
 * Env: .env.upload-migration or .env (DATABASE_URL or DATABASE_*, S3_BASE_URL).
 * Run from backend-new: node scripts/update-file-urls-to-s3.mjs
 */

import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) return;
  const content = readFileSync(filePath, 'utf8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
    if (!process.env[key]) process.env[key] = value;
  }
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
loadEnvFile(path.join(root, '.env.upload-migration'));
loadEnvFile(path.join(root, '.env'));

const TABLE_NAME = process.env.UPLOAD_TABLE_NAME || 'files';
const S3_BASE = (process.env.S3_BASE_URL || process.env.CDN_URL || 'https://adaptive-strapi.s3.us-east-1.amazonaws.com').replace(/\/$/, '');

let connectionString = process.env.DATABASE_URL;
if (!connectionString && process.env.DATABASE_HOST) {
  const enc = encodeURIComponent;
  const pass = process.env.DATABASE_PASSWORD || '';
  connectionString = `postgres://${enc(process.env.DATABASE_USERNAME || 'postgres')}:${enc(pass)}@${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT || 5432}/${process.env.DATABASE_NAME || 'postgres'}`;
}

if (!connectionString) {
  console.error('Set DATABASE_URL or DATABASE_HOST, DATABASE_USERNAME, DATABASE_PASSWORD, DATABASE_NAME, DATABASE_PORT');
  process.exit(1);
}

// Strip sslmode from URL so our ssl config is used (avoids RDS self-signed cert error)
let pgConnectionString = connectionString;
if (connectionString.includes('?')) {
  const [base, qs] = connectionString.split('?');
  const params = new URLSearchParams(qs);
  params.delete('sslmode');
  const newQs = params.toString();
  pgConnectionString = base + (newQs ? '?' + newQs : '');
}

// RDS requires SSL; use it when host looks like RDS or DATABASE_SSL is set
const useSsl = process.env.DATABASE_SSL === 'true' || /\.rds\.|amazonaws\.com/.test(pgConnectionString);
const pg = await import('pg');
const client = new pg.default.Client({
  connectionString: pgConnectionString,
  ssl: useSsl ? { rejectUnauthorized: false } : false,
});

function rewriteFormatsUrls(formats, s3Base) {
  if (!formats || typeof formats !== 'object') return formats;
  const out = {};
  for (const [key, val] of Object.entries(formats)) {
    if (val && typeof val === 'object' && typeof val.url === 'string') {
      const u = val.url.trim();
      out[key] = { ...val, url: u.startsWith('http') ? u : s3Base + (u.startsWith('/') ? u : '/' + u) };
    } else {
      out[key] = val;
    }
  }
  return out;
}

async function main() {
  await client.connect();
  console.log('Table: %s, S3 base: %s', TABLE_NAME, S3_BASE);

  const urlRes = await client.query(
    `UPDATE ${TABLE_NAME}
     SET url = $1 || url
     WHERE url IS NOT NULL AND url <> '' AND url LIKE '/%' AND url NOT LIKE 'http%'
     RETURNING id, url`,
    [S3_BASE]
  );
  console.log('Updated %d row(s) (main url).', urlRes.rowCount ?? 0);

  const formatsRes = await client.query(
    `SELECT id, formats FROM ${TABLE_NAME} WHERE formats IS NOT NULL`
  );
  let formatsUpdated = 0;
  for (const row of formatsRes.rows) {
    const raw = row.formats;
    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
    const rewritten = rewriteFormatsUrls(parsed, S3_BASE);
    if (JSON.stringify(rewritten) === JSON.stringify(parsed)) continue;
    await client.query(
      `UPDATE ${TABLE_NAME} SET formats = $1::jsonb WHERE id = $2`,
      [JSON.stringify(rewritten), row.id]
    );
    formatsUpdated++;
  }
  console.log('Updated %d row(s) (formats/thumbnails).', formatsUpdated);

  await client.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
