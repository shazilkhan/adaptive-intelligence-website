# Strapi Migration: Render → AWS

This guide walks through moving your Strapi backend from **Render** to **AWS**, so it runs alongside your Next.js frontend on Amplify.

## Current setup (summary)

| Component | Before | After (this migration) |
|-----------|--------|-------------------------|
| Frontend | Vercel | **AWS Amplify** ✓ |
| Repo | GitHub | **Bitbucket** ✓ |
| Strapi | Render (`adaptive-intelligence-website-1.onrender.com`) | **AWS** (this doc) |

- **Active Strapi app**: `backend-new/` (Strapi 5.25, Node 18–22).
- **Database**: PostgreSQL on Render (likely `DATABASE_URL`).
- **Uploads**: Local disk on Render (`/data/public` via `start.sh`).
- **Secrets**: `APP_KEYS`, `ADMIN_JWT_SECRET`, `API_TOKEN_SALT`, `TRANSFER_TOKEN_SALT`, `ENCRYPTION_KEY`.

---

## AWS architecture options

| Option | Pros | Cons |
|--------|------|------|
| **A) ECS Fargate + ALB + RDS + S3** | Full control, scalable, production-grade | More setup (VPC, ECS, ALB, RDS) |
| **B) AWS App Runner + RDS + S3** | Simpler than ECS, auto-scaling, managed | Less control than ECS |
| **C) Elastic Beanstalk + RDS + S3** | Familiar, easy rollbacks | Older model, more manual tuning |

**Recommended**: **App Runner** (fastest path) or **ECS Fargate** (more control). Both use the same Strapi Docker image and env vars.

---

## Phase 1: AWS resources (one-time)

### 1.1 Database – Amazon RDS (PostgreSQL)

1. In **AWS RDS**, create a **PostgreSQL** instance (e.g. 15.x).
2. Choose a template (e.g. Dev/Test or Production), instance size, and storage.
3. Set **master username** and **password**; note the **endpoint** and **port** (5432).
4. **Security group**: allow inbound **5432** from your Strapi compute (e.g. App Runner VPC or ECS security group). For App Runner, use a **VPC connector** so the app can reach RDS in a private subnet.
5. After creation, build the connection string:
   - `postgres://USER:PASSWORD@ENDPOINT:5432/strapi?sslmode=require`
   - Or set: `DATABASE_CLIENT=postgres`, `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_NAME`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`, and `DATABASE_SSL=true` (and any `DATABASE_SSL_*` if needed).

### 1.2 Uploads – Amazon S3

1. Create an **S3 bucket** (e.g. `your-app-strapi-uploads-prod`).
2. **Block public access** can be off if you want public read for media; otherwise use **bucket policy** or **CloudFront** + signed URLs later.
3. For public read: Bucket policy to allow `GetObject` for `*` (or restrict to CloudFront OAI).
4. Note: **Bucket name**, **Region**. Create an **IAM user** (or use IR for ECS/App Runner) with `s3:PutObject`, `s3:GetObject`, `s3:DeleteObject` on this bucket.
5. Store **Access Key ID** and **Secret Access Key** (or use IAM roles for ECS/App Runner).

### 1.3 Strapi compute – App Runner (recommended) or ECS

- **App Runner**: Create a **Web service**, source = **Container registry** (ECR). Use the image built from `backend-new/Dockerfile`. Set env vars (see Phase 2). Use a **VPC connector** if RDS is in a private subnet. Assign a URL (e.g. `https://xxxxx.us-east-1.awsapprunner.com`).
- **ECS**: Create a **Fargate** service behind an **Application Load Balancer**, task definition using the same image, env vars, and secrets. Put RDS and ECS in the same VPC/subnets so the task can reach the DB.

---

## Phase 2: Strapi configuration for AWS

### 2.1 Environment variables (production)

Set these in App Runner / ECS (or Parameter Store / Secrets Manager and map into the task):

```bash
# Server
HOST=0.0.0.0
PORT=1337
NODE_ENV=production

# App (required – generate new for production)
APP_KEYS=key1,key2,key3,key4
ADMIN_JWT_SECRET=<long-random-string>
API_TOKEN_SALT=<random-string>
TRANSFER_TOKEN_SALT=<random-string>
ENCRYPTION_KEY=<random-string>

# Database (RDS)
DATABASE_CLIENT=postgres
DATABASE_HOST=<rds-endpoint>
DATABASE_PORT=5432
DATABASE_NAME=strapi
DATABASE_USERNAME=<master-user>
DATABASE_PASSWORD=<master-password>
DATABASE_SSL=true

# Uploads – S3 (see backend-new/config/plugins.ts)
AWS_ACCESS_KEY_ID=<key>
AWS_ACCESS_SECRET=<secret>
AWS_REGION=us-east-1
AWS_BUCKET=your-app-strapi-uploads-prod
AWS_ACL=public-read
# Optional CDN: CDN_URL=https://d123.cloudfront.net
```

- **Render-specific**: On Render you may have used `DATABASE_URL`; on AWS you can keep using that single URL **or** the separate `DATABASE_*` vars (both are supported by `backend-new/config/database.ts`).
- **Public URL**: After deploy, set `STRAPI_PUBLIC_URL` (or your frontend’s `NEXT_PUBLIC_STRAPI_API_URL`) to the Strapi base URL (e.g. App Runner URL).

### 2.2 CORS (frontend domain)

Strapi’s default `strapi::cors` often allows all origins in development. For production, restrict to your frontend:

- In `config/middlewares.ts` you can add a custom CORS config (see [Strapi CORS docs](https://docs.strapi.io/dev-docs/configurations/middlewares#cors)) with `origin: ['https://main.xxxxx.amplifyapp.com', 'https://yourdomain.com']`.
- Or keep the default if you’re okay with any origin for the API (less secure).

---

## Phase 3: Data migration (Render → AWS)

### 3.1 Database

1. **Export from Render Postgres**  
   From your Render dashboard or a one-off shell, run:
   ```bash
   pg_dump $DATABASE_URL -F c -f strapi_backup.dump
   ```
   Or use Render’s backup if available.

2. **Import into RDS**  
   - Create the target database: `strapi` (or the name you use in `DATABASE_NAME`).  
   - Restore:
     ```bash
     pg_restore -h <rds-endpoint> -U <user> -d strapi -F c strapi_backup.dump
     ```
   - Fix ownership/permissions if needed.

### 3.2 Uploads (media files)

- **Current**: Files live under Render’s persistent disk (`/data/public/uploads`).
- **Target**: S3 (new uploads go there via the S3 provider; existing files must be copied once).

**Option A – One-time copy to S3**

1. From Render (or a machine with access to Render’s disk/backup), sync uploads to S3:
   ```bash
   aws s3 sync /path/to/render/public/uploads s3://your-app-strapi-uploads-prod/uploads
   ```
2. In Strapi’s DB, `upload_file` (and related) entries reference paths like `/uploads/...`. With the S3 provider and same path layout, existing URLs can keep working if your Strapi base URL + S3 base URL match how the frontend builds URLs (e.g. `NEXT_PUBLIC_STRAPI_API_URL` + path, or a CDN in front of S3).

**Option B – Re-upload**

- If the dataset is small, you can re-upload critical assets via Strapi admin after cutover and fix references if needed.

---

## Phase 4: Deploy Strapi to AWS

1. **Build and push Docker image** (from repo root or `backend-new`):
   ```bash
   cd backend-new
   docker build -t strapi-adaptive .
   docker tag strapi-adaptive:latest <account>.dkr.ecr.<region>.amazonaws.com/strapi-adaptive:latest
   docker push <account>.dkr.ecr.<region>.amazonaws.com/strapi-adaptive:latest
   ```
2. **Create/update** App Runner service or ECS task to use this image and all env vars from Phase 2.
3. **Health check**: Use `GET /_health` or `GET /admin` (redirect is fine). Configure health check path in App Runner/ALB.
4. **Smoke test**: Open `https://<your-strapi-url>/admin`, log in, and check one API route (e.g. `GET /api/setting`).

---

## Phase 5: Point frontend (Amplify) to AWS Strapi

1. In **Amplify Console** → **Environment variables**, set:
   ```bash
   NEXT_PUBLIC_STRAPI_API_URL=https://<your-app-runner-or-ecs-url>
   ```
   No trailing slash.

2. Ensure **amplify.yml** (or your build spec) still writes this into `.env.production` for SSR (you already have this for other vars; include `NEXT_PUBLIC_STRAPI_API_URL` in the grep or list).

3. **Redeploy** the Amplify app so all pages and API routes use the new Strapi URL.

4. **Revalidate / clear caches** if you use ISR or any caching (e.g. revalidation API).

---

## Phase 6: Render cleanup

- After you’ve verified the site and Strapi on AWS for a few days:
  - Turn off or delete the Strapi service on Render.
  - Keep a final DB backup and uploads backup until you’re sure you don’t need them.

---

## Troubleshooting

### "Knex: Timeout acquiring a connection" on App Runner

App Runner runs in AWS’s managed VPC and reaches the internet (and your RDS) via dynamic egress IPs. If RDS is **publicly accessible**, its **security group** must allow inbound TCP **5432** from anywhere so App Runner can connect:

1. **RDS** → your instance → **VPC security group** → **Edit inbound rules**.
2. Add rule: **Type** = PostgreSQL, **Port** = 5432, **Source** = `0.0.0.0/0` (or a specific CIDR if you use a fixed egress).
3. Save and redeploy/restart the App Runner service.

If RDS is **not** publicly accessible, use an **App Runner VPC connector** so the service runs in your VPC and can reach RDS by private IP (then allow the connector’s security group in RDS).

The repo also increases DB connection timeouts and pool settings in `config/database.ts` and adds `DATABASE_CONNECTION_TIMEOUT=90000` in `.env.apprunner` so slow or cold RDS has more time to respond.

### SSL warning (pg / libpq)

The warning about `sslmode` semantics is from the Postgres driver. It’s safe to ignore for now. To prepare for future driver versions you can set in the connection URL: `sslmode=verify-full` or `uselibpqcompat=true&sslmode=require` (see the warning link in the logs).

---

## Checklist

- [ ] RDS PostgreSQL created; Strapi can connect (VPC/security groups).
- [ ] S3 bucket created; IAM credentials or role for Strapi; S3 provider configured in `backend-new`.
- [ ] App Runner (or ECS) service created; env vars and secrets set.
- [ ] DB migrated (pg_dump / pg_restore or equivalent).
- [ ] Uploads synced to S3 (if using Option A).
- [ ] Strapi container runs; admin and API respond.
- [ ] CORS updated for Amplify URL(s).
- [ ] `NEXT_PUBLIC_STRAPI_API_URL` updated in Amplify and redeployed.
- [ ] Smoke test: homepage, about, contact, case studies, and form submissions.
- [ ] Render Strapi retired after verification.

---

## Repo changes included for AWS

- **backend-new/Dockerfile** – production Node image, build and run Strapi.
- **backend-new/env.example** – list of env vars for AWS (and local reference).
- **backend-new/config/plugins.ts** – S3 upload provider when `AWS_BUCKET` is set; otherwise local.
- **backend-new/config/middlewares.ts** – `STRAPI_PUBLIC_PATH` for public file path (default `./public`). **On Render**, set `STRAPI_PUBLIC_PATH=/data/public` in the service env so `start.sh` and existing disk layout keep working until you migrate.
- **backend-new/package.json** – dependency `@strapi/provider-upload-aws-s3` added.

Use this doc as the single source of truth for “shift Strapi to AWS”; adjust resource names and URLs to match your AWS account and domain.
