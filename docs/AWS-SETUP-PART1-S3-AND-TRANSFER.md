# Part 1: S3 bucket + transfer Render uploads to S3

Do this first. When done you’ll have an S3 bucket with all Strapi media from Render, ready for App Runner + RDS later.

---

## Section A – Create the S3 bucket

### A.1 Open S3

1. Log in to **AWS Console**.
2. Search for **S3** in the top search bar and open **S3**.
3. Click **Create bucket**.

### A.2 Bucket settings

| Field | Value |
|-------|--------|
| **Bucket name** | e.g. `adaptive-strapi` or `adaptive-intelligence-strapi-uploads-prod` (must be globally unique). |
| **AWS Region** | Same as your RDS, e.g. **US East (N. Virginia)** `us-east-1`. |
| **Object Ownership** | Leave **ACLs disabled** (recommended) or **ACLs enabled** if you need the legacy `public-read` ACL. |

### A.3 Block Public Access (for public media URLs)

So the frontend can load images from S3 (or via Strapi):

1. Under **Block Public Access settings for this bucket**:
2. **Uncheck** “Block all public access”.
3. Check the acknowledgment box (“I acknowledge that the current settings might result in this bucket and the objects within being made public”).
4. Leave other options as default.

### A.4 Create

1. Scroll down and click **Create bucket**.
2. Note your **bucket name** and **region** (e.g. `us-east-1`); you’ll use them in the transfer script and later in Strapi.

---

## Section B – Allow public read for bucket objects

So image URLs like `https://bucket-name.s3.region.amazonaws.com/uploads/...` work.

### B.1 Bucket policy

1. In S3, click your new bucket name.
2. Open the **Permissions** tab.
3. In **Bucket policy**, click **Edit**.
4. Paste the policy below and replace **BUCKET_NAME** with your actual bucket name (e.g. `adaptive-intelligence-strapi-uploads-prod`):

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

5. Click **Save changes**.

---

## Section C – IAM user for the transfer script (and later Strapi)

The script (and later App Runner/Strapi) needs AWS credentials that can read/write this bucket.

### C.1 Create IAM user

1. In AWS Console search for **IAM** → open **IAM**.
2. Left menu: **Users** → **Create user**.
3. **User name**: e.g. `strapi-uploads-migration`.
4. Click **Next**.

### C.2 Attach policy

1. Choose **Attach policies directly**.
2. Click **Create policy** (opens a new tab).
3. **Service**: **S3**.
4. **Actions**: under “Read” check **GetObject**; under “Write” check **PutObject**, **DeleteObject** (optional, for Strapi delete).
5. **Resources**:
   - **Bucket**: choose **Specific** → select your bucket ARN.
   - **Object**: choose **Specific** → add `arn:aws:s3:::BUCKET_NAME/*` (replace BUCKET_NAME).
6. Click **Next** → **Policy name**: e.g. `StrapiUploadsS3Policy` → **Create policy**.
7. Go back to the **Create user** tab; refresh the policy list and select **StrapiUploadsS3Policy**.
8. Click **Next** → **Create user**.

### C.3 Create access key

1. Open the user **strapi-uploads-migration** (or the name you used).
2. **Security credentials** tab → **Access keys** → **Create access key**.
3. Use case: **Application running outside AWS** (or “Command Line Interface”).
4. **Next** → **Create access key**.
5. Copy **Access key ID** and **Secret access key** and store them somewhere safe (you’ll put them in `.env.upload-migration`). You won’t see the secret again.

---

## Section D – Transfer files from Render to S3

The script reads file URLs from your **RDS** Strapi database, downloads each file from **Render**, and uploads it to your **S3** bucket. Render Strapi must still be running so those URLs work.

### D.1 Prerequisites

- RDS with Strapi DB already migrated (you have this).
- Your machine can reach RDS (security group allows your IP on port 5432).
- Render Strapi is up at `https://adaptive-intelligence-website-1.onrender.com`.

### D.2 Install dependencies

From your project root:

```bash
cd backend-new
yarn install
```

### D.3 Create the env file

1. In the **backend-new** folder, create a file named **`.env.upload-migration`** (no space, starts with a dot).
2. Put this in it and replace the placeholders:

```bash
# Render Strapi base URL (no trailing slash)
RENDER_STRAPI_URL=https://adaptive-intelligence-website-1.onrender.com

# RDS – your migrated Strapi Postgres (same DB you restored)
DATABASE_URL=postgres://YOUR_RDS_USER:YOUR_RDS_PASSWORD@YOUR_RDS_ENDPOINT:5432/YOUR_DATABASE_NAME?sslmode=require

# S3 – bucket and region from Section A; credentials from Section C
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
AWS_BUCKET=adaptive-strapi
```

- **YOUR_RDS_ENDPOINT**: from RDS console, e.g. `mydb.xxxxx.us-east-1.rds.amazonaws.com`.
- **YOUR_RDS_USER** / **YOUR_RDS_PASSWORD** / **YOUR_DATABASE_NAME**: the DB you restored into.
- **AWS_BUCKET**: exact bucket name from Section A.
- **AWS_REGION**: e.g. `us-east-1`.

3. Save the file. **Do not commit it** (it’s in `.gitignore` as `.env.upload-migration`).

### D.4 Run the script

Still in **backend-new**:

```bash
node scripts/render-uploads-to-s3.mjs
```

You should see:

- “Connected to RDS. Fetching file URLs from table "files"...”
- “Found N file URL(s)…”
- “Uploaded 1 / N”, etc.
- “Done. Uploaded: N, failed/skipped: 0” (or a small number if a few Render URLs failed).

### D.5 If you see “relation \"files\" does not exist”

Your Strapi DB might use a different table name. Run this against your RDS database (e.g. in a SQL client or `psql`):

```sql
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE '%file%';
```

If you see e.g. `upload_files`, run:

```bash
UPLOAD_TABLE_NAME=upload_files node scripts/render-uploads-to-s3.mjs
```

### D.6 If RDS connection fails

- In **RDS** → your DB → **VPC security group** → **Edit inbound rules**.
- Add rule: **Type** = Custom TCP, **Port** = 5432, **Source** = My IP (or the IP of the machine running the script). Save.

---

## Section E – Verify in S3

1. In **S3** → your bucket → **Objects** tab.
2. You should see an **uploads/** prefix and many objects under it (images, etc.).
3. Click one object → **Open** or copy **Object URL** and open in a browser; the image should load.

---

## Done with Part 1

You now have:

- An S3 bucket with the same paths as Render (`uploads/...`).
- RDS still has `url` values like `/uploads/...`; Strapi on AWS (App Runner) will use the S3 plugin and this bucket, so those URLs will resolve to S3.

Next part: **App Runner + RDS** (Strapi app deployment and env vars, including the same `AWS_BUCKET` and `AWS_REGION`).
