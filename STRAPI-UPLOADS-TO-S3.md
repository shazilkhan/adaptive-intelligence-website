# Step-by-step: Transfer Render uploads to AWS S3

You’ve already migrated the database (Render → RDS). This guide moves **only the media files** (images, videos, etc.) from Render to S3 so Strapi on AWS can serve them.

---

## What you need before starting

- [ ] **RDS** with the Strapi DB restored (you have this).
- [ ] **S3 bucket** for Strapi uploads (e.g. `your-app-strapi-uploads-prod`).
- [ ] **IAM user** (or credentials) with `s3:PutObject`, `s3:GetObject` on that bucket.
- [ ] **Render Strapi** still running and serving files at  
  `https://adaptive-intelligence-website-1.onrender.com` (so we can download from it).

---

## Step 1 – Create the S3 bucket (if you haven’t)

1. In **AWS Console** → **S3** → **Create bucket**.
2. **Name**: e.g. `adaptive-intelligence-strapi-uploads-prod`.
3. **Region**: same as RDS (e.g. `us-east-1`).
4. **Block Public Access**:  
   - If you want public read for media: turn **off** “Block all public access” and confirm.  
   - Then add a **bucket policy** so objects are readable (see Step 2).
5. Create the bucket.

---

## Step 2 – Make bucket objects publicly readable (optional)

Only if you want URLs like `https://bucket.s3.region.amazonaws.com/uploads/...` to work without signed URLs.

1. Bucket → **Permissions** → **Bucket policy**.
2. Example (replace `BUCKET_NAME` and optionally restrict by prefix):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::BUCKET_NAME/*"
    }
  ]
}
```

Save. If you use CloudFront later, you can lock this down to the CloudFront OAI and keep the bucket private.

---

## Step 3 – Get RDS connection details

You need a Postgres connection string to the **migrated** Strapi DB on RDS.

- **Option A – Connection string**  
  `postgres://USER:PASSWORD@RDS_ENDPOINT:5432/DATABASE_NAME?sslmode=require`

- **Option B – Separate vars**  
  Host, port `5432`, database name, username, password.  
  (The script below uses `DATABASE_URL` or `RDS_*` vars.)

Ensure your IP (or the machine that will run the script) is allowed in the RDS **security group** (inbound rule for port 5432).

---

## Step 4 – Install and run the migration script

A script in this repo reads file URLs from your RDS `files` table, downloads each file from Render, and uploads it to S3 with the same path (e.g. `uploads/image_abc.jpg`).

### 4.1 Where the script lives

- **Path**: `backend-new/scripts/render-uploads-to-s3.mjs`  
- It uses only Node built-ins + `pg` and `@aws-sdk/client-s3`. No Strapi app boot.

### 4.2 One-time setup

From the repo root:

```bash
cd backend-new
yarn install
```

(`pg` and `@aws-sdk/client-s3` are already in `package.json` for this script.)

### 4.3 Environment variables

Create a `.env.upload-migration` (or export these in your shell). **Do not commit this file.**

```bash
# Render – base URL of your Strapi on Render (no trailing slash)
RENDER_STRAPI_URL=https://adaptive-intelligence-website-1.onrender.com

# RDS (your migrated Strapi database)
DATABASE_URL=postgres://USER:PASSWORD@RDS_ENDPOINT:5432/strapi?sslmode=require

# S3
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
AWS_BUCKET=your-app-strapi-uploads-prod
```

- Use the **same** `AWS_BUCKET` and `AWS_REGION` you will use for Strapi on AWS (so Strapi’s S3 plugin and this migration share one bucket).

### 4.4 Run the script

```bash
cd backend-new
node scripts/render-uploads-to-s3.mjs
```

- It will:
  1. Connect to RDS and run `SELECT url FROM files`.
  2. For each `url` (e.g. `/uploads/xyz.jpg`):
     - Download from `RENDER_STRAPI_URL + url`.
     - Upload to S3 with key = `url` without leading slash (e.g. `uploads/xyz.jpg`).
- If Render is slow or you have many files, the script may take a few minutes. You can run it again; it will skip or overwrite (same key = same file).

### 4.5 If the script fails

- **“relation \"files\" does not exist”**  
  Your Strapi version might use a different table name. Check in the DB, e.g.:

  ```sql
  SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE '%file%';
  ```

  If the table is e.g. `upload_files`, edit the script and replace `FROM files` with `FROM upload_files`.

- **Connection refused / timeout to RDS**  
  Check security group: allow inbound 5432 from your IP (or the machine running the script).  
  Check that `DATABASE_URL` uses the correct host, port, user, password, and database name.

- **403 from Render**  
  Render Strapi must still be up and serving `/uploads/...`. If the service is paused, start it once to run the script.

---

## Step 5 – Verify in S3

1. In **S3** → your bucket → **Objects**.
2. You should see an `uploads/` prefix and files under it (e.g. `uploads/image_abc123.jpg`).
3. Open one object’s **Object URL** in a browser; the image (or file) should load if the bucket is public, or use “Open” in the console.

---

## Step 6 – What’s next

- **Strapi on AWS** should be configured with the **same** S3 bucket and region (see `STRAPI-AWS-MIGRATION.md` Phase 2: `AWS_BUCKET`, `AWS_REGION`, etc.).  
- The database on RDS already has `files` rows with `url` like `/uploads/...`.  
- Once Strapi on AWS uses the S3 provider and the same bucket, it will serve these same paths from S3 (either via Strapi’s URL or, if you set it, a CDN in front of S3).  
- Your frontend uses `NEXT_PUBLIC_STRAPI_API_URL` + `url` for media; after you point that to Strapi on AWS, image URLs will resolve to Strapi (and then S3). No need to change existing `url` values in the DB for this migration.

After uploads are in S3 and Strapi on AWS is deployed and pointing to that bucket, you can proceed with the rest of the migration (CORS, frontend env, Render cleanup) as in the main migration doc.
