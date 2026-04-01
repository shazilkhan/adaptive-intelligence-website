# Adaptive Intelligence – User Guide (Backend & Frontend)

> **Easier to read?** Open **`USER-GUIDE.html`** in this folder in your browser for a formatted version with clear headings, tables, and code blocks.

This guide is for **non-technical users** who need to make changes to the website (frontend) or the content management system (backend), or to deploy updates. Everything is explained step by step with all commands included.

---

## Table of contents

1. [Project overview](#1-project-overview)
2. [What you need installed](#2-what-you-need-installed)
3. [Getting the code](#3-getting-the-code)
4. [Frontend (website)](#4-frontend-website)
5. [Backend (Strapi CMS)](#5-backend-strapi-cms)
6. [Deploying changes](#6-deploying-changes)
7. [Environment variables reference](#7-environment-variables-reference)
8. [Useful commands quick reference](#8-useful-commands-quick-reference)
9. [Troubleshooting](#9-troubleshooting)
10. [Making frontend and backend code changes](#10-making-frontend-and-backend-code-changes)

---

## 1. Project overview

| Part | What it is | Where it runs | URL (example) |
|------|------------|---------------|----------------|
| **Frontend** | The public website (Next.js) | AWS Amplify | `https://adaptiveintelligence.online` (or your main domain) |
| **Backend** | Strapi CMS (content, media, forms) | AWS App Runner | `https://admin.adaptiveintelligence.online` |
| **Repository** | Code for both | GitHub | [github.com/Adaptive-Admin-User/adaptive-intelligence](https://github.com/Adaptive-Admin-User/adaptive-intelligence) |

- **Content changes** (text, images, pages) → Use **Strapi Admin** in the browser; no code needed.
- **Design / layout / new pages** → Change **frontend** code, then deploy.
- **New content types or CMS settings** → Change **backend** code or Strapi Admin, then deploy backend if needed.

---

## 2. What you need installed

To run the project on your computer and deploy backend changes, install the following. **Install in this order** (some tools depend on others).

To only **edit content** (text, images) you do **not** need any of this; use Strapi Admin in the browser.

---

### 2.1 Node.js (required – includes npm)

Node.js runs both the frontend and the backend. It also installs **npm** (Node Package Manager), which you use to install Yarn and other tools.

| What | Details |
|------|---------|
| **Download** | [https://nodejs.org](https://nodejs.org/) – choose your OS. |
| **Which version** | Choose the **LTS** version (Long Term Support), e.g. 20.x or 18.x. |
| **Windows** | Run the .msi installer, accept defaults. Restart your terminal (or PC) after install. |
| **Mac** | Download the .pkg (Apple Silicon = ARM64, Intel = x64). Run it, follow the steps. Restart Terminal after install. |
| **Check** | Open a terminal and run: `node --version` and `npm --version`. You should see version numbers. |

---

### 2.2 Yarn (required)

Yarn is the package manager this project uses to install dependencies and run scripts.

| What | Details |
|------|---------|
| **Install** | After Node.js is installed, open a terminal and run: `npm install -g yarn` |
| **Check** | Run: `yarn --version`. You should see a version number (e.g. 1.22.x). |

---

### 2.3 Git (required)

Git is used to clone the repo, pull updates, and push your changes to GitHub.

| What | Details |
|------|---------|
| **Download** | [https://git-scm.com/downloads](https://git-scm.com/downloads) – choose your operating system. |
| **Windows** | Download “Windows” and run the installer. Default options are fine. |
| **Mac** | Option A: download the macOS .dmg from the link above and run it. Option B: install Xcode Command Line Tools (includes Git): open Terminal and run `xcode-select --install`. |
| **Check** | Open a new terminal and run: `git --version`. You should see a version number. |

---

### 2.4 Docker Desktop (optional – only for deploying the backend)

You only need Docker if you will **build and push** the Strapi (backend) image to AWS yourself. If someone else deploys the backend, you can skip this.

| What | Details |
|------|---------|
| **Download** | [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop/) – choose your OS. |
| **Windows** | Run the installer. Enable WSL 2 if prompted. Restart if asked. |
| **Mac** | Download Docker Desktop for Mac (Apple Silicon or Intel). Open the .dmg, drag Docker to Applications, then open it. Restart Terminal if needed. |
| **Check** | Open a terminal and run: `docker --version`. You should see a version number. |

---

### 2.5 AWS CLI (optional – only for deploying the backend)

You only need the AWS CLI if you will **push the backend Docker image** to Amazon ECR and trigger App Runner deploys. If someone else does that, you can skip this.

| What | Details |
|------|---------|
| **Download** | [https://aws.amazon.com/cli/](https://aws.amazon.com/cli/) – “Download the AWS CLI” for your OS. |
| **Windows** | Download the 64-bit MSI installer, run it, follow the steps. Restart your terminal after install. Alternative: `msiexec.exe /i https://awscli.amazonaws.com/AWSCLIV2.msi` |
| **Mac** | Option A: download the macOS .pkg installer from the link above and run it. Option B: if you have Homebrew, run `brew install awscli`. Restart Terminal after install. |
| **Check** | Open a new terminal and run: `aws --version`. You should see a version line. |
| **Configure** | After install, run `aws configure` and enter your AWS Access Key ID, Secret Access Key, and region (e.g. `us-east-1`) when you’re ready to deploy. |

---

### Quick reference – what to download

| Tool | Required? | Download / install |
|------|-----------|--------------------|
| **Node.js** (includes npm) | Yes | [nodejs.org](https://nodejs.org/) – LTS version |
| **Yarn** | Yes | After Node: run `npm install -g yarn` in a terminal |
| **Git** | Yes | [git-scm.com/downloads](https://git-scm.com/downloads) |
| **Docker Desktop** | Only for backend deploy | [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop/) |
| **AWS CLI** | Only for backend deploy | [aws.amazon.com/cli](https://aws.amazon.com/cli/) |

---

## 3. Getting the code

### 3.1 Clone the repository (first time)

1. Open a terminal (Command Prompt, PowerShell, or Terminal app).
2. Go to the folder where you want the project, for example:
   ```bash
   cd Desktop
   ```
3. Clone the repo:
   ```bash
   git clone https://github.com/Adaptive-Admin-User/adaptive-intelligence.git "Adaptive Intelligence"
   cd "Adaptive Intelligence"
   ```
4. You should see folders like `src`, `backend-new`, `public`, `package.json`.

### 3.2 Get the latest code (already have the project)

Whenever you want to pull the latest changes from the team:

```bash
cd "C:\Users\YOUR_USERNAME\OneDrive\Desktop\Adaptive Intelligence"
git pull origin main
```

(Use your actual path and branch name if different, e.g. `main` or `master`.)

---

## 4. Frontend (website)

The frontend is the public site. Its code lives in the **root** of the project (not inside `backend-new`).

### 4.1 Folder structure (what to edit)

| Folder / file | What it’s for |
|---------------|----------------|
| `src/pages/` | One file per page: `index.js` (home), `about.js`, `contact.js`, `services.js`, `case-studies/`, etc. |
| `src/components/` | Reusable pieces: header, footer, forms, sections. |
| `src/styles/` | Global styles (e.g. `index.scss`). |
| `src/data/` | Static data (e.g. menu items). |
| `public/` | Static assets (images, favicon) that don’t go through the build. |
| `package.json` | Scripts and dependencies (usually you don’t edit this). |

To change a **page**, open the matching file under `src/pages/`. To change a **repeated block** (e.g. header, footer), look in `src/components/`.

### 4.2 Run the frontend locally

1. Open a terminal in the **project root** (where `package.json` and `src` are).
2. Install dependencies (first time only):
   ```bash
   yarn install
   ```
3. Start the dev server:
   ```bash
   yarn dev
   ```
4. Open a browser at: **http://localhost:3000**
5. To stop the server: press `Ctrl + C` in the terminal.

The site will use content from Strapi. To point it at your **local** Strapi or **production** Strapi, use a `.env.local` file (see [Environment variables](#7-environment-variables-reference)).

### 4.3 Build the frontend (test production build)

```bash
yarn build
yarn start
```

Then open **http://localhost:3000** again. This is the same as what runs on Amplify.

### 4.4 Frontend environment variables

For **local** development, create a file in the project root named **`.env.local`** (it is git-ignored). Example:

```env
NEXT_PUBLIC_STRAPI_API_URL=https://admin.adaptiveintelligence.online
```

- **Production** (Amplify): Variables are set in **Amplify Console → App settings → Environment variables**. The build uses `amplify.yml`, which writes some of them into `.env.production` (e.g. `NEXT_PUBLIC_STRAPI_API_URL`, `APOLLO_*`, `REVALIDATION_SECRET`). So the **live** site uses whatever you set in Amplify.

---

## 5. Backend (Strapi CMS)

The backend is Strapi. Its code lives in **`backend-new`**.

### 5.1 Folder structure (what to edit)

| Folder / file | What it’s for |
|---------------|----------------|
| `backend-new/src/api/` | Content types and API (e.g. homepage, about-page, case-study). |
| `backend-new/config/` | Database, plugins (e.g. S3 upload), server, middlewares. |
| `backend-new/src/admin/` | Admin panel branding (e.g. logo, theme in `app.tsx`). |
| `backend-new/scripts/` | One-off scripts (e.g. update file URLs to S3). |

Most **content** changes (text, images) are done in **Strapi Admin** in the browser, not in code.

### 5.2 Run the backend locally

1. Open a terminal and go into the backend folder:
   ```bash
   cd "C:\Users\YOUR_USERNAME\OneDrive\Desktop\Adaptive Intelligence\backend-new"
   ```
2. Install dependencies (first time only):
   ```bash
   yarn install
   ```
3. Copy the example env file and edit it (see below):
   ```bash
   copy env.example .env
   ```
   Then open `.env` and set at least:
   - For **local only**: you can use SQLite (default) and leave `DATABASE_*` as in the example.
   - To use **production DB** (RDS) locally: set `DATABASE_CLIENT=postgres` and the same `DATABASE_*` values as in production (get them from your team or from `backend-new/.env.apprunner` if you have it; **do not commit** real passwords to Git).
4. Start Strapi in development mode:
   ```bash
   yarn develop
   ```
5. Open: **http://localhost:1337/admin**
6. Create an admin user if it’s the first time; otherwise log in.
7. To stop: press `Ctrl + C` in the terminal.

### 5.3 Strapi Admin (content only, no code)

- **URL (production):** `https://admin.adaptiveintelligence.online/admin`
- **What you can do:** Edit homepage, about, services, case studies, team, settings, media library, forms, etc. No code or deployment needed for content-only changes; they are saved in the database and appear on the site after the frontend loads them.

---

## 6. Deploying changes

### 6.1 Deploy the frontend (website)

The frontend deploys automatically when you **push to the connected branch** (e.g. `main`) on GitHub, because Amplify is connected to the repo.

1. Save your code. In the project **root**:
   ```bash
   git add .
   git commit -m "Describe your change in a short line"
   git push origin main
   ```
2. In **AWS Console** go to **Amplify** → your app. A new build will start. Wait until the status is **Succeeded**.
3. The live site will update at your main domain (e.g. `https://adaptiveintelligence.online`).

**Changing frontend environment variables (e.g. Strapi URL):**

1. Amplify → your app → **Environment variables** (left menu).
2. Add or edit the variable (e.g. `NEXT_PUBLIC_STRAPI_API_URL` = `https://admin.adaptiveintelligence.online`).
3. **Redeploy** the app (e.g. “Redeploy this version” or push a small change) so the new value is used.

---

### 6.2 Deploy the backend (Strapi)

Backend runs on **AWS App Runner**. To deploy a new version (after you changed backend code or config), you must **build a Docker image**, **push it to ECR**, then **deploy** in App Runner.

#### Step 1: Log in to AWS container registry (ECR)

Open a terminal and run (use your AWS region and account if different):

```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 066123827652.dkr.ecr.us-east-1.amazonaws.com
```

You should see: `Login Succeeded`.

#### Step 2: Build the backend image

```bash
cd "C:\Users\YOUR_USERNAME\OneDrive\Desktop\Adaptive Intelligence\backend-new"
docker build -t adaptive-strapi .
```

Wait until the build finishes without errors.

#### Step 3: Tag the image for ECR

```bash
docker tag adaptive-strapi:latest 066123827652.dkr.ecr.us-east-1.amazonaws.com/adaptive-strapi:latest
```

(Use your actual ECR URL if different.)

#### Step 4: Push the image to ECR

```bash
docker push 066123827652.dkr.ecr.us-east-1.amazonaws.com/adaptive-strapi:latest
```

Wait until the push completes.

#### Step 5: Deploy in App Runner

1. In **AWS Console** go to **App Runner**.
2. Open your service (e.g. **strapi-adaptive**).
3. Click **Deploy** (or **Start deployment**). App Runner will pull the new image and restart the service.
4. Wait until the status is **Running**. The admin will be available at `https://admin.adaptiveintelligence.online`.

**Changing backend environment variables (e.g. API keys, DB, S3):**

1. App Runner → your service → **Configuration** tab.
2. Under **Service settings** click **Edit**.
3. Under **Runtime environment variables** add or edit variables (Name and Value).
4. Save and **deploy** when prompted.

---

### 6.3 One-off: Fix existing media URLs (S3) in the database

If you ever see **404 for existing images** in Strapi or on the site after moving to S3, you may need to run the script that rewrites file URLs in the database to point to S3.

1. Ensure you have the file **`backend-new/.env.upload-migration`** (or **`backend-new/.env`**) with the **same** database and S3 settings as production (see [Environment variables](#7-environment-variables-reference)). The script reads `DATABASE_URL` or `DATABASE_*` and `S3_BASE_URL` (or `CDN_URL`).
2. From the **backend-new** folder run:
   ```bash
   node scripts/update-file-urls-to-s3.mjs
   ```
3. You should see lines like: `Updated N row(s) (main url).` and `Updated N row(s) (formats/thumbnails).`
4. No need to redeploy; the live Strapi already uses that database. Refresh the admin or site to see images.

---

## 7. Environment variables reference

### 7.1 Environment setup for a new developer (local)

Follow these steps **after cloning the repo** so the frontend and backend run correctly on your machine. Use the exact file paths and examples below.

**Step 1: Frontend local env (project root)**

1. Open the **project root** folder (where `package.json` and `src` are – *not* inside `backend-new`).
2. Create a new file named **`.env.local`** (no name before the dot; the file can be hidden in some editors).
3. Paste one of the blocks below depending on whether you use **local Strapi** or **AWS Strapi**.

**Option A – Local Strapi (recommended for new devs):** Frontend will talk to Strapi at `http://localhost:1337`. Run the backend with `yarn develop` in `backend-new`.

```env
# Frontend – point to local Strapi
NEXT_PUBLIC_STRAPI_API_URL=http://localhost:1337

# Optional: forms / newsletter (get keys from your team or leave empty)
# APOLLO_API_KEY=
# APOLLO_LIST_ID_CONTACT_FORM=
# APOLLO_LIST_ID_LETS_TALK=
# APOLLO_LIST_ID_DOWNLOADS=
# APOLLO_LIST_ID_NEWSLETTER=
```

**Option B – AWS Strapi:** Frontend will use the live admin URL. No need to run Strapi locally.

```env
# Frontend – use AWS Strapi
NEXT_PUBLIC_STRAPI_API_URL=http://localhost:1337
NEXT_PUBLIC_STRAPI_USE_AWS=1
NEXT_PUBLIC_STRAPI_AWS_URL=https://admin.adaptiveintelligence.online

# Optional: media from S3
# NEXT_PUBLIC_STRAPI_MEDIA_URL=https://adaptive-strapi.s3.us-east-1.amazonaws.com
```

Save the file. It is git-ignored; never commit `.env.local`.

**Step 2: Backend local env (Strapi)**

1. Open the **`backend-new`** folder.
2. Copy the example env file: **Windows:** `copy env.example .env` | **Mac / Linux:** `cp env.example .env`
3. Open **`.env`** in a text editor.
4. For **local development only**, the default uses SQLite – leave `DATABASE_CLIENT=sqlite` and `DATABASE_FILENAME=.tmp/data.db` as-is.
5. You **must** set the Strapi secrets. Generate random values (e.g. run `openssl rand -base64 32` four times) and set `APP_KEYS`, `ADMIN_JWT_SECRET`, `API_TOKEN_SALT`, `TRANSFER_TOKEN_SALT`, `ENCRYPTION_KEY`. Replace placeholders with different 32+ character random strings. Never commit `.env`.
6. Save. Then from `backend-new` run `yarn develop` and open **http://localhost:1337/admin** to create your admin user.

**Using PostgreSQL locally (optional):** Uncomment and set the `DATABASE_*` or `DATABASE_URL` lines in `.env` and set `DATABASE_CLIENT=postgres`. Comment out the SQLite lines.

**Quick check:** Frontend: project root has `.env.local` with `NEXT_PUBLIC_STRAPI_API_URL=http://localhost:1337`. Backend: `backend-new` has `.env` with all secrets set and database configured. Then run `yarn develop` from `backend-new` in one terminal and `yarn dev` from the project root in another. Open http://localhost:3000 and http://localhost:1337/admin.

---

### 7.2 Frontend (Amplify / `.env.local`)

| Variable | Where | Purpose |
|----------|--------|--------|
| `NEXT_PUBLIC_STRAPI_API_URL` | Amplify + .env.local | Strapi base URL (no trailing slash), e.g. http://localhost:1337 or https://admin.adaptiveintelligence.online |
| `NEXT_PUBLIC_STRAPI_USE_AWS` | .env.local / Amplify | Set to 1 or true to use AWS Strapi URL |
| `NEXT_PUBLIC_STRAPI_AWS_URL` | .env.local / Amplify | When using AWS: https://admin.adaptiveintelligence.online |
| `NEXT_PUBLIC_STRAPI_MEDIA_URL` | .env.local / Amplify | Optional: base URL for media (e.g. S3) |
| `APOLLO_*` | Amplify (for form submissions) | Used by contact / Let’s talk forms. |
| `REVALIDATION_SECRET` | Amplify | Used by revalidation API if you use it. |

For **local** runs, put the same Strapi URL in **`.env.local`** at the project root.

### 7.3 Backend (App Runner / `backend-new/.env` or `.env.apprunner`)

All production values are set in **App Runner → Configuration → Runtime environment variables**. A reference list is in **`backend-new/.env.apprunner`** (git-ignored; do not commit real secrets).

Main variables:

| Variable | Purpose |
|----------|--------|
| `HOST` | `0.0.0.0` |
| `PORT` | `1337` |
| `NODE_ENV` | `production` |
| `APP_KEYS`, `ADMIN_JWT_SECRET`, `API_TOKEN_SALT`, `TRANSFER_TOKEN_SALT`, `ENCRYPTION_KEY` | Strapi security (from your team or existing .env). |
| `DATABASE_CLIENT` | `postgres` |
| `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_NAME`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`, `DATABASE_SSL` | RDS connection. |
| `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `AWS_BUCKET`, `AWS_ACL` | S3 uploads. |
| `CDN_URL` | Public base URL for media, e.g. `https://adaptive-strapi.s3.us-east-1.amazonaws.com`. |
| `NODE_TLS_REJECT_UNAUTHORIZED` | `0` (only if required for RDS TLS; keep in mind security). |

Never commit real passwords or keys to the repository.

---

## 8. Useful commands quick reference

**Frontend (run from project root):**

```bash
yarn install          # First time or after package changes
yarn dev              # Run site locally (http://localhost:3000)
yarn build            # Production build
yarn start            # Run production build locally
yarn lint             # Run lint
```

**Backend (run from `backend-new`):**

```bash
yarn install          # First time or after package changes
yarn develop          # Run Strapi locally (http://localhost:1337)
yarn build            # Build admin panel (e.g. before Docker build)
yarn start            # Run in production mode locally
```

**Git (from project root):**

```bash
git status            # See what changed
git add .             # Stage all changes
git commit -m "msg"   # Commit with a message
git push origin main  # Push to GitHub (triggers Amplify build)
git pull origin main # Get latest code
```

**Backend deploy (from `backend-new`):**

```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 066123827652.dkr.ecr.us-east-1.amazonaws.com
docker build -t adaptive-strapi .
docker tag adaptive-strapi:latest 066123827652.dkr.ecr.us-east-1.amazonaws.com/adaptive-strapi:latest
docker push 066123827652.dkr.ecr.us-east-1.amazonaws.com/adaptive-strapi:latest
```

Then in AWS: **App Runner** → your service → **Deploy**.

**Database script (from `backend-new`):**

```bash
node scripts/update-file-urls-to-s3.mjs
```

---

## 9. Troubleshooting

### Frontend

- **“APOLLO_API_KEY is missing” or forms don’t work on Amplify**  
  Ensure in Amplify → Environment variables you have the required vars (e.g. `APOLLO_*`, `NEXT_PUBLIC_STRAPI_API_URL`, `REVALIDATION_SECRET`) and that **amplify.yml** includes them in the `grep` so they are written to `.env.production`. Then redeploy.

- **Site shows old content**  
  Frontend fetches from Strapi. Confirm `NEXT_PUBLIC_STRAPI_API_URL` in Amplify points to the correct Strapi URL (e.g. `https://admin.adaptiveintelligence.online`) and redeploy.

- **Build fails on Amplify**  
  Check the build logs in Amplify. Often it’s a missing dependency or a typo; fix in code, commit, and push again.

### Backend (Strapi on App Runner)

- **Strapi won’t start / “Timeout acquiring a connection”**  
  Usually the app can’t reach the database. Check:  
  - RDS security group allows inbound **5432** from the internet (or from the right source) if the DB is public.  
  - App Runner env vars: `DATABASE_HOST`, `DATABASE_PASSWORD`, etc., and that `NODE_TLS_REJECT_UNAUTHORIZED=0` is set if your RDS needs it.

- **“Access Denied” or “PutObjectAcl” when uploading media**  
  The IAM user used by Strapi (e.g. `strapi-upload`) needs **s3:PutObjectAcl** (and s3:PutObject, GetObject, DeleteObject) on the S3 bucket. Add that permission in IAM.

- **Images or thumbnails 404 in admin**  
  1. Run **`node scripts/update-file-urls-to-s3.mjs`** from `backend-new` (with correct DB and S3 env) so existing file URLs in the DB point to S3.  
  2. Ensure the S3 bucket has a **bucket policy** allowing public **GetObject** and that “Block public access” allows that policy.  
  3. If the browser still blocks images (CSP), the project has CSP disabled for the admin in `config/middlewares.ts`; redeploy after any middleware change.

- **JSON parse error when uploading media**  
  The project includes a custom upload middleware to fix this. If it persists, ensure the latest code (with that middleware) is in the Docker image and that you’ve pushed and redeployed.

### Custom domain (admin.adaptiveintelligence.online)

- **“Pending certificate DNS validation”**  
  Add the **exact** CNAME records shown in App Runner (certificate validation + DNS target) in **Route 53** (or your DNS provider). Wait up to 24–48 hours; usually it’s faster.

- **Main website unaffected**  
  Linking **admin** as a subdomain only adds a new DNS record. It does **not** change the main domain or the frontend; the main site stays on Amplify.

---

## Where to find more

- **Strapi:** [docs.strapi.io](https://docs.strapi.io)
- **Next.js:** [nextjs.org/docs](https://nextjs.org/docs)
- **Amplify:** AWS Console → Amplify → your app → Help / documentation links
- **App Runner:** AWS Console → App Runner → your service → Help / documentation links

For project-specific migration and AWS setup, see also:

- **STRAPI-AWS-MIGRATION.md** (in the project root)
- **docs/AWS-SETUP-PART1-S3-AND-TRANSFER.md**

**Note:** This project is set up to use **GitHub** (not Bitbucket). Connect Amplify to your GitHub repo when setting up hosting.

---

## 10. Making frontend and backend code changes

This section shows how to make **actual code changes** so that content from Strapi (or new layout elements like paragraphs and buttons) appear on the website. We use the **About** page as the example.

### 10.1 Example page: About

| Where | What |
|-------|------|
| **Frontend (code)** | `src/pages/about.js` – the About page component and how it fetches data. |
| **Backend (content type)** | Strapi **Single Type** “About Page” – fields like hero title, paragraphs, images, buttons. |
| **API** | The frontend calls `GET /api/about-page?populate=*` to get all About page fields. |

**Flow in short:** Strapi stores the content → the frontend fetches it in `getStaticProps` → the page component receives `pageData` and renders it (paragraphs, images, buttons).

---

### 10.2 Adding a new paragraph (from Strapi)

**Option A: Use an existing Strapi field**

The About page already has fields like `whoWeAreParagraph1`, `whoWeAreParagraph2`. They are filled in **Strapi Admin** (Content-Manager → About Page). In the frontend they are used like this:

```jsx
<p className="fs-18">{pageData?.whoWeAreParagraph1}</p>
<p className="fs-18">{pageData?.whoWeAreParagraph2}</p>
```

So to “add” a new paragraph **without code**: use one of the existing paragraph fields in Strapi and make sure the frontend page has a line like the one above for that field. If the field exists in Strapi but not in the page file, add one line in the right place in `src/pages/about.js` (or the page you are editing).

**Option B: Add a new field in Strapi, then show it on the frontend**

1. **Strapi Admin** → Content-Type Builder → open **About Page** (Single Type) → Add another field, e.g. name `extraParagraph`, type **Text** (or **Rich text** if you prefer). Save and restart Strapi (`yarn develop` in `backend-new`).
2. **Strapi Admin** → Content-Manager → About Page → fill in **Extra Paragraph**. Save & Publish.
3. **Frontend:** In `src/pages/about.js`, in the section where you want the new paragraph to appear, add:

```jsx
{pageData?.extraParagraph && (
  <p className="fs-18">{pageData.extraParagraph}</p>
)}
```

The data is already loaded because `getStaticProps` fetches the whole About page with `populate=*`, so any new field on that single type is included.

---

### 10.3 Adding a button (text and link from Strapi)

The About page already has button fields, e.g. **Sustainability** section: `sustainabilityButtonText` and `sustainabilityButtonUrl`. In the frontend you render them like this:

```jsx
import Link from 'next/link';

// Inside your component, where pageData is available:
<Link
  href={pageData?.sustainabilityButtonUrl || '/eco'}
  className="btn btn-primary"
>
  {pageData?.sustainabilityButtonText || 'Learn more'}
</Link>
```

- **Content only:** Set **Sustainability Button Text** and **Sustainability Button URL** in Strapi Admin; no code change needed if this block already exists.
- **New button elsewhere:** Add two fields in Strapi (e.g. `ctaButtonText`, `ctaButtonUrl`), then in the page add a similar `<Link>` or `<a>` using `pageData?.ctaButtonText` and `pageData?.ctaButtonUrl`.

---

### 10.4 Adding an image from Strapi on the frontend

Images (and other media) from Strapi can be **relative** (e.g. `/uploads/photo.jpg`) or **full URLs** (e.g. S3). The project uses a helper so both work.

**Step 1 – Strapi:** Add a **Media** field to your content type (e.g. About Page → new field `sectionImage`, type **Media**, single image). In Content-Manager, upload the image and save.

**Step 2 – Frontend:** Use the **`getStrapiMediaUrl`** helper and the **Next.js `Image`** component:

```jsx
import Image from 'next/image';
import { getStrapiMediaUrl } from '@/utils/strapi';

// Inside the component (pageData comes from getStaticProps):
const sectionImageUrl = getStrapiMediaUrl(pageData?.sectionImage?.url);

{sectionImageUrl && (
  <Image
    src={sectionImageUrl}
    alt="Section image"
    width={800}
    height={500}
    style={{ width: '100%', height: 'auto' }}
  />
)}
```

- **Important:** Always use `getStrapiMediaUrl(...)` for any image (or video) URL that comes from Strapi. Do **not** concatenate the API base URL with the path yourself, or full S3 URLs will break.
- If the field is nested (e.g. v4 style), use: `pageData?.sectionImage?.data?.attributes?.url` or the flat `pageData?.sectionImage?.url` and pass that into `getStrapiMediaUrl(...)`.

---

### 10.5 Summary: Strapi field → frontend

| Goal | Strapi | Frontend (example) |
|------|--------|---------------------|
| **New paragraph** | Add a **Text** (or Rich text) field; fill it in Content-Manager. | `{pageData?.yourFieldName && <p>{pageData.yourFieldName}</p>}` |
| **New button** | Add two **Text** fields (e.g. button label + URL); fill in Content-Manager. | `<Link href={pageData?.yourButtonUrl}>{pageData?.yourButtonText}</Link>` |
| **New image** | Add a **Media** field; upload image in Content-Manager. | `getStrapiMediaUrl(pageData?.yourImage?.url)` and use it in `<Image src={...} />`. |

**Where to edit:**

- **Frontend:** `src/pages/about.js` for the About page; other pages under `src/pages/` (e.g. `services.js`, `contact.js`). Reusable blocks live in `src/components/`.
- **Backend:** Content types under `backend-new/src/api/` (e.g. `about-page/content-types/about-page/schema.json`). After changing the schema, restart Strapi. Content itself is edited in **Strapi Admin** only.

After changing code, run the site locally (`yarn dev` in the project root, Strapi at `http://localhost:1337`), then deploy (frontend: push to GitHub; backend: Docker build/push and App Runner deploy) when ready.
