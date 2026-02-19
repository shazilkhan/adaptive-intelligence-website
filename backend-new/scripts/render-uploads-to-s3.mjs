#!/usr/bin/env node
/**
 * One-time migration: copy Strapi upload files from Render to S3.
 *
 * Prereqs:
 *   - RDS has the migrated Strapi DB (with `files` table).
 *   - Render Strapi is still up so we can download from RENDER_STRAPI_URL.
 *
 * Env (set in shell or .env.upload-migration):
 *   RENDER_STRAPI_URL  - e.g. https://adaptive-intelligence-website-1.onrender.com
 *   DATABASE_URL       - postgres://user:pass@host:5432/dbname?sslmode=require
 *   AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, AWS_BUCKET
 *
 * Run from backend-new: node scripts/render-uploads-to-s3.mjs
 */

import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

// Optional: load .env.upload-migration (simple KEY=VALUE, no quotes)
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
const envPath = path.join(__dirname, '..', '.env.upload-migration');
loadEnvFile(envPath);

const {
  RENDER_STRAPI_URL,
  DATABASE_URL,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_REGION,
  AWS_BUCKET,
} = process.env;

const TABLE_NAME = process.env.UPLOAD_TABLE_NAME || 'files';

if (!RENDER_STRAPI_URL || !DATABASE_URL || !AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY || !AWS_REGION || !AWS_BUCKET) {
  console.error('Required env: RENDER_STRAPI_URL, DATABASE_URL, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, AWS_BUCKET');
  process.exit(1);
}

const baseUrl = RENDER_STRAPI_URL.replace(/\/$/, '');

// Strip sslmode from URL so our ssl config is used (avoids self-signed cert error with RDS)
const dbUrl = new URL(DATABASE_URL);
dbUrl.searchParams.delete('sslmode');
const connectionString = dbUrl.toString().replace(/^postgres:\/\//, 'postgres://');

const pg = await import('pg');
const { S3Client, PutObjectCommand } = await import('@aws-sdk/client-s3');

const client = new pg.default.Client({
  connectionString,
  ssl: { rejectUnauthorized: false },
});
const s3 = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

async function main() {
  await client.connect();
  console.log('Connected to RDS. Fetching file URLs from table "%s"...', TABLE_NAME);

  let rows;
  try {
    const res = await client.query(`SELECT url FROM ${TABLE_NAME}`);
    rows = res.rows;
  } catch (e) {
    if (e.code === '42P01') {
      console.error('Table "%s" not found. If your Strapi uses a different table (e.g. upload_files), set UPLOAD_TABLE_NAME.', TABLE_NAME);
    } else {
      console.error('DB query failed:', e.message);
    }
    process.exit(1);
  }

  const urls = rows.map((r) => (r.url && r.url.trim())).filter(Boolean);
  const unique = [...new Set(urls)];
  console.log('Found %d file URL(s) (%d unique). Starting copy to S3...', rows.length, unique.length);

  let ok = 0;
  let err = 0;

  for (const url of unique) {
    const path = url.startsWith('/') ? url.slice(1) : url;
    const source = `${baseUrl}/${path}`;

    try {
      const res = await fetch(source, { redirect: 'follow' });
      if (!res.ok) {
        console.warn('Skip (HTTP %s): %s', res.status, source);
        err++;
        continue;
      }
      const body = await res.arrayBuffer();
      const contentType = res.headers.get('content-type') || 'application/octet-stream';

      await s3.send(
        new PutObjectCommand({
          Bucket: AWS_BUCKET,
          Key: path,
          Body: new Uint8Array(body),
          ContentType: contentType,
        })
      );
      ok++;
      if (ok % 10 === 0 || ok === unique.length) console.log('Uploaded %d / %d', ok, unique.length);
    } catch (e) {
      console.warn('Failed %s:', source, e.message);
      err++;
    }
  }

  await client.end();
  console.log('Done. Uploaded: %d, failed/skipped: %d', ok, err);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
