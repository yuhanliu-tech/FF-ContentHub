# FF Content Hub – Deployment Guide

Deploy **backend (Strapi)** on **Railway** and **frontend (Next.js)** on **Netlify**. Follow the order below.

**To collect info from the client:** use [CLIENT-DEPLOYMENT-CHECKLIST.md](./CLIENT-DEPLOYMENT-CHECKLIST.md) (one-pager you can send or use on a call).

---

## Start from zero (only Netlify + Railway accounts, nothing deployed yet)

If you only have the two accounts and no site/service yet, do this in order:

| Step | Where | What |
|------|--------|------|
| **1** | On your machine | Run `node scripts/generate-strapi-secrets.js` and save the output. |
| **2** | **Railway** | New Project → Empty Project → add **PostgreSQL** → add **one more service** for the backend (see [Part 2](#part-2-deploy-backend-strapi-on-railway) for “no GitHub” option: deploy the `backend` folder via CLI or connect a repo and set root to `backend`). Add all Variables from Part 2, then **Generate domain** and note the Strapi URL. |
| **3** | **Netlify** | Add new site → **Deploy manually** → upload a **zip of the `frontend` folder contents** (so the zip root has `package.json` and `netlify.toml`). Add env var `NEXT_PUBLIC_STRAPI_URL` = your Railway Strapi URL. Note your Netlify site URL. |
| **4** | **Railway** | In the Strapi service Variables, add `FRONTEND_URL` = your Netlify site URL. Redeploy if needed. |
| **5** | **Discord + Strapi Admin** | Add redirect in Discord; in Strapi Admin set Discord provider and frontend redirect URL (see [Part 4](#part-4-discord-login-production)). |

**No GitHub yet?** You can deploy the **backend** with the [Railway CLI](https://docs.railway.app/develop/cli) from your local `backend` folder, and deploy the **frontend** by zipping the `frontend` folder and using Netlify’s “Deploy manually” (drag-and-drop). Details are in Parts 2 and 3 below.

---

## Part 0: What to get from the client

Before or during deployment, collect the following. Use the checklist when you talk to the client.

| Item | Who provides | Notes |
|------|----------------|------|
| **Discord Application** | Client (or you create and hand over) | They need a [Discord Developer](https://discord.com/developers/applications) app. You need **Client ID** and **Client Secret** from OAuth2. Client must add the production redirect URL (you’ll give them the exact URL after Strapi is deployed). |
| **Calendly URL** (optional) | Client | If they use the booking form with “Pick your session time”, e.g. `https://calendly.com/their-team/60min`. |
| **Custom domain** (optional) | Client | If they want a custom domain for the site (Netlify) or Strapi (Railway), they provide the domain; you configure it in Netlify/Railway. |
| **Strapi admin user** | You / client | Created the first time someone opens `https://YOUR_STRAPI_URL/admin` after deploy. No need from client in advance. |
| **Content** | Client / you | Tiles, experts, documents, etc. Either re-enter in production Strapi Admin or plan a one-time migration/export from local. |

**Minimum to start:** Discord app with Client ID and Client Secret (and agreement to add the Strapi callback URL you’ll send them). Everything else can be added after go-live.

---

## Part 1: Generate Strapi secrets (do this once)

You need random values for Strapi. **Use different values per environment (e.g. production).**

**Option A – script (easiest):** From the **repo root** (the folder that contains `backend`, `frontend`, and `scripts`) run:

```bash
node scripts/generate-strapi-secrets.js
```

(Do not run this from inside the `backend` folder – the script lives in the repo root.)

Copy the printed lines into Railway’s Variables (or into a production `.env`). Do not commit these values.

**Option B – manual:** Run this once per secret and assign each result to the corresponding variable:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

You need values for: `APP_KEYS` (two comma-separated), `API_TOKEN_SALT`, `ADMIN_JWT_SECRET`, `TRANSFER_TOKEN_SALT`, `JWT_SECRET`, `ENCRYPTION_KEY`.

Example (replace with your own generated values for production):

- `APP_KEYS` → two random strings, comma-separated, e.g. `key1,key2`
- `API_TOKEN_SALT` → one random string  
- `ADMIN_JWT_SECRET` → one random string  
- `TRANSFER_TOKEN_SALT` → one random string  
- `JWT_SECRET` → one random string  
- `ENCRYPTION_KEY` → one random string  

---

## Part 2: Deploy backend (Strapi) on Railway

Do this **first** so you have the Strapi URL for the frontend and Discord.

### 2.1 Create project and database

1. Log in at [railway.app](https://railway.app).
2. **New Project** → **Deploy from GitHub repo** (if the repo is connected) or **Empty Project** to deploy manually later.
3. In the project: **+ New** → **Database** → **PostgreSQL**. Wait until it’s running.
4. Open the Postgres service → **Variables** (or **Connect**). Copy **`DATABASE_URL`** (Railway sets this automatically).

### 2.2 Deploy the backend service

**Option A – You have GitHub (or a fork) connected to Railway**

1. In the same project: **+ New** → **GitHub Repo** → select this repo.
2. After the service is created, open it → **Settings**.
3. Set **Root Directory**: `backend`.
4. Set **Build Command**: `npm ci && npm run build`.
5. Set **Start Command**: `npm run start`.
6. Add Variables (see 2.3), then **Generate domain** under Networking. Note the Strapi URL.

**Option B – No GitHub yet: deploy from your machine with Railway CLI**

1. In the same project: **+ New** → **Empty Service**. Name it e.g. “Strapi” or “backend”.
2. Open that service → **Settings**. Set **Build Command**: `npm ci && npm run build`, **Start Command**: `npm run start`. (No root directory – you’ll deploy the `backend` folder so its `package.json` is the root.)
3. Add all **Variables** (see 2.3) now, including **Reference** to the Postgres `DATABASE_URL`.
4. On your machine (Node installed): install CLI: `npm install -g @railway/cli` (or `corepack enable` then `pnpm add -g @railway/cli`).
5. In a terminal: `railway login` (browser opens), then `railway link` and select your project and the **Strapi/backend service** (not Postgres).
6. From the **repo root**: run `railway up ./backend` (or `cd backend` then `railway up`). This uploads and deploys the backend. Wait for the build to finish.
7. In Railway → your Strapi service → **Settings** → **Networking** → **Generate domain**. Note the URL (e.g. `https://xxx.up.railway.app`).

**Option C – CLI keeps failing (Railpack / “npm: not found”): deploy from GitHub instead**

If `railway up` always uses Railpack and fails with `npm: not found`, the most reliable fix is to deploy from a Git repo so Railway gets a proper build context and can use the Dockerfile or Nixpacks correctly.

1. **Create a fork** of this repo on GitHub (or use the main repo if you have push access), and push your latest code (including `backend/Dockerfile`, `backend/railway.json`, `backend/nixpacks.toml`).
2. In Railway → your project → **+ New** → **GitHub Repo** (or use the existing Strapi BE service).
3. If adding a new service: connect the repo. Then open the service → **Settings**.
4. Set **Root Directory** to **`backend`** (so the build root is the backend folder where `Dockerfile` and `package.json` live).
5. **Do not set** a custom Build Command or Start Command in the dashboard (leave them empty). The `backend/Dockerfile` will be used automatically when Root Directory is `backend`.
6. Ensure all **Variables** from 2.3 are set (you can copy them from the existing Strapi BE service if you already configured it).
7. Trigger a deploy (push a commit, or use **Redeploy** in Railway). Railway will build from the `backend` directory and should detect and use the Dockerfile.
8. **Generate domain** under **Networking** if you haven’t already.

Your existing Postgres and variables stay the same; you’re only changing how the code is deployed (from GitHub instead of `railway up`).

**Option D – No GitHub and Railway CLI keeps failing: deploy backend on Fly.io instead**

You can run the backend on **Fly.io** from your machine with the same Dockerfile—no GitHub needed. Use your **existing Railway Postgres** (same `DATABASE_URL`); only the app runs on Fly.

1. Sign up at [fly.io](https://fly.io) and install the CLI: `powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"` (Windows) or see [fly.io/docs/hands-on/install-flyctl](https://fly.io/docs/hands-on/install-flyctl).
2. From your machine: `cd backend`, then `fly launch --no-deploy`. When prompted: choose an app name, region; say **no** to adding a Postgres (you already have it on Railway).
3. Open the generated `fly.toml` and set `[env]` or use `fly secrets set` for: `NODE_ENV=production`, `DATABASE_CLIENT=postgres`, `DATABASE_URL=<your Railway Postgres URL>`, `HOST=0.0.0.0`, `PORT=1337`, plus all Strapi secrets (APP_KEYS, API_TOKEN_SALT, etc.) and `FRONTEND_URL=https://comforting-liger-51a2a4.netlify.app`. Use `fly secrets set KEY=value` for secrets so they aren’t in the file.
4. Run `fly deploy`. Fly will build with your `Dockerfile` and deploy. Note the app URL (e.g. `https://your-app.fly.dev`).
5. Use that URL as your Strapi URL: set `NEXT_PUBLIC_STRAPI_URL` in Netlify, add the Discord redirect and Strapi Admin Discord redirect to that URL, and set `FRONTEND_URL` in Fly secrets if you use it.

Your **database stays on Railway**; only the Strapi app runs on Fly.

### 2.3 Backend environment variables (Railway)

Open the **Strapi service** (not the Postgres one) → **Variables** and add:

| Variable | Value | Notes |
|----------|--------|------|
| `NODE_ENV` | `production` | So Strapi runs in production mode. |
| `DATABASE_CLIENT` | `postgres` | Required for PostgreSQL. |
| `DATABASE_URL` | *(from Postgres service)* | In Railway you can reference the Postgres service variable; or copy the full URL from Postgres → Variables. |
| `HOST` | `0.0.0.0` | So the server listens on all interfaces. |
| `PORT` | `1337` | Or leave unset if Railway sets `PORT` automatically (some hosts do). |
| `APP_KEYS` | *(from Part 1)* | Two comma-separated keys. |
| `API_TOKEN_SALT` | *(from Part 1)* | |
| `ADMIN_JWT_SECRET` | *(from Part 1)* | |
| `TRANSFER_TOKEN_SALT` | *(from Part 1)* | |
| `JWT_SECRET` | *(from Part 1)* | |
| `ENCRYPTION_KEY` | *(from Part 1)* | |
| `FRONTEND_URL` | *(set after Netlify deploy)* | Your Netlify site URL, e.g. `https://your-site.netlify.app`. Add after Part 3. |

**Linking Postgres on Railway:** In the Strapi service, **Variables** → **Add variable** → **Reference** and choose the Postgres service’s `DATABASE_URL`, or paste the URL manually.

Deploy the service. When it’s running, open the **public URL** (e.g. from **Settings** → **Networking** → **Generate domain**). You’ll get something like `https://your-app.up.railway.app`. This is your **Strapi URL** – note it for the next parts.

### 2.4 First run and admin user

1. Open `https://YOUR_STRAPI_URL/admin` in a browser.
2. Create the first admin user (email + password). The client can do this or you; they’ll use this to manage content and configure Discord later.

---

## Part 3: Deploy frontend on Netlify

### 3.1 Deploy the frontend

**Option A – No GitHub yet: deploy by drag-and-drop (recommended when you only have an account)**  

1. On your machine: create a **zip of the contents** of the **`frontend`** folder (not the folder itself).  
   - Open the **`frontend`** folder. Inside it you should see `package.json`, **`netlify.toml`** (there is a copy in `frontend/` for this case), `src`, `lib`, etc.  
   - Select **all** of those (the contents of `frontend`), then zip them so that the **root of the zip** has `package.json` and `netlify.toml` at the top level.  
   - Do **not** zip the `frontend` folder as a single item – then the zip would contain only `frontend/` and Netlify wouldn’t see `netlify.toml` or `package.json` at the root.  
   - Windows: open `frontend`, Ctrl+A to select all, right‑click → “Compress to ZIP” (or Send to → Compressed folder).  
   - Mac: open `frontend`, select all, right‑click → Compress.  
2. Log in at [app.netlify.com](https://app.netlify.com).  
3. **Add new site** → **Deploy manually** (or **Sites** → **Add new site** → **Deploy manually**).  
4. Drag your zip into the drop zone (or click to upload). Netlify will use the `netlify.toml` at the root of the zip (the one from `frontend/netlify.toml`).  
5. Wait for the build. Your site will get a URL like `https://random-name-123.netlify.app`. Note it – you need it for `FRONTEND_URL` and Discord.

**Option B – Deploy from GitHub (once you have repo access)**  

1. **Add new site** → **Import an existing project** → connect GitHub and select this repo.  
2. Netlify will use the **root** `netlify.toml`: set **Base directory** to `frontend` if not auto-detected. Build command and publish directory are in that file.  
3. After the first deploy, note the site URL.

### 3.2 Frontend environment variables (Netlify)

**Site configuration** → **Environment variables** → **Add variable** (or **Add from .env**). Add:

| Variable | Value | Required |
|----------|--------|----------|
| `NEXT_PUBLIC_STRAPI_URL` | Your Railway Strapi URL (e.g. `https://your-app.up.railway.app`) | Yes |
| `NEXT_PUBLIC_CALENDLY_EXPERT_SESSION_URL` | Client’s Calendly URL (if they use the booking step) | No |
| `NEXT_PUBLIC_BYPASS_AUTH` | Do **not** set in production (or set to `false`) | No |

Trigger a new deploy after changing env vars so the frontend gets the correct Strapi URL.

Note the Netlify site URL (e.g. `https://your-site.netlify.app`). You need it for Discord and for Railway’s `FRONTEND_URL`.

### 3.3 Tell the backend the frontend URL

Back in **Railway** → Strapi service → **Variables**: set **`FRONTEND_URL`** to your Netlify URL (e.g. `https://your-site.netlify.app`). Redeploy the Strapi service if needed so CORS allows the frontend.

---

## Part 4: Discord login (production)

Without this, “Continue with Discord” won’t work in production. Use this and/or the detailed [DISCORD-AUTH-SETUP.md](./DISCORD-AUTH-SETUP.md).

### 4.1 Redirect URL in Discord

1. [Discord Developer Portal](https://discord.com/developers/applications) → your application.  
2. **OAuth2** → **Redirects** → add:  
   `https://YOUR_STRAPI_URL/api/connect/discord/callback`  
   (use the real Railway Strapi URL, no trailing slash.)  
3. Save. Copy **Client ID** and **Client Secret**.

### 4.2 Discord provider in Strapi Admin

1. Open `https://YOUR_STRAPI_URL/admin` and log in.  
2. **Settings** → **Users & Permissions** → **Providers** → **Discord**.  
3. **Enable**: ON.  
4. **Client ID**: from Discord.  
5. **Client Secret**: from Discord.  
6. **Redirect URL to your front-end**: `https://YOUR_NETLIFY_SITE/connect/discord/redirect` (your real Netlify URL).  
7. Save.

After this, users can log in with Discord on the live site.

---

## Part 5: After go-live

### 5.1 Strapi permissions (fix 403)

If the frontend shows "Error fetching content" and the Network tab shows **403** on `tiles`, `logo`, `homepage-hero`, or similar, the production Strapi **Public** and **Authenticated** roles need read access.

1. Open **production** Strapi Admin: `https://YOUR_STRAPI_URL/admin`.
2. Go to **Settings** → **Users & Permissions plugin** → **Roles**.
3. **Public** role: Enable **find** and **findOne** for:
   - **Tile**
   - **Logo**
   - **Homepage-hero**
   - **Document**
   - **Expert-bio**
   - **Expert-net**
4. **Authenticated** role: Enable **find** and **findOne** for the same list above, and for **Appointment** enable **find** and **create** (for "My appointments").
5. Save. No redeploy needed; 403s should stop immediately.

**If you see 404 instead of 403** (e.g. `api/logos` or `api/homepage-heroes` not found): the frontend tries both singular and plural API paths (`api/logo` and `api/logos`, etc.). Ensure (1) the Strapi backend is running (e.g. `npm run develop` in the `backend` folder for local dev), (2) the **Logo** and **Homepage-hero** single-type entries exist and are **published** in Content Manager, and (3) **find** is enabled for those types under Settings → Users & Permissions → Roles → Public (and Authenticated if users are logged in).

### 5.2 Content in production

Production Strapi starts with an empty database. Either:

- **Option A (simplest):** In Strapi Admin, create and publish: Tiles (with cover, list items, docs), Logo (global logo asset), Homepage-hero (with cover), Expert-net single type and Expert-bios, Documents.
- **Option B:** Use Strapi’s built-in export/import. **→ For a full step-by-step migration from local to production, see [MIGRATE-LOCAL-TO-PRODUCTION.md](./MIGRATE-LOCAL-TO-PRODUCTION.md).** Details and alternatives are below.

#### Option B: Strapi export/import (step-by-step)

Strapi 5’s CLI can export and import all content, schemas, and uploads in one go. **Caveats:** Import **replaces** all data on the target (back up production first). Admin users and API tokens are **not** included. Source and target must use the **same** Strapi version and content-type schemas. If you use a cloud media provider (S3, Cloudinary), those files are not in the export; use local provider (as in this project) so uploads are included.

**1. Export from local**

From your machine, in the **backend** folder, with local Strapi using your local database (and Strapi not running, or run export in a separate terminal):

```bash
cd backend
npm run strapi -- export --file content-export --key "YourSecretKey123"
```

Use a strong value for `--key` and keep it safe; you’ll need it for import. This creates `content-export.tar.gz.enc` in `backend/` (or the path you set with `--file`). Add `--no-encrypt` if you want a plain `.tar.gz` (no `.enc`), but then omit `--key` on import.

**2. Import into production**

You must run `strapi import` against the **production** database. Two ways:

- **A) Run import locally, pointed at production DB**  
  - Back up the production database first (e.g. Railway Postgres backup / snapshot).  
  - In `backend`, temporarily set `.env` (or env) so `DATABASE_URL` is the **production** Postgres URL.  
  - Run:  
    `npm run strapi -- import -f content-export.tar.gz.enc -k "YourSecretKey123"`  
  - Confirm the prompt (this **deletes** existing data on that DB and restores from the export).  
  - Restore your local `.env` to use the local database again.

- **B) Run import on Railway**  
  - Upload `content-export.tar.gz.enc` to a place the Railway service can read (e.g. run a one-off that downloads it from a URL, or use a volume).  
  - In Railway, run a one-off command with the same Node/Strapi version as your backend, e.g.  
    `npx strapi import -f ./content-export.tar.gz.enc -k "YourSecretKey123" --force`  
  - This replaces production DB content with the export.

After import, set [Strapi permissions (5.1)](#51-strapi-permissions-fix-403) in production Admin if you haven’t already. Media are stored in the DB and in the uploads folder; on Railway, the filesystem is ephemeral unless you use a volume, so for persistent uploads after import you may need to configure a file storage plugin (e.g. S3) for production and re-upload, or accept that uploads are in the DB but files might need to be re-added via Admin.

**Alternative: database copy**

You can export the **local Postgres** database (e.g. `pg_dump`) and import it into the **production Postgres** (e.g. Railway). That copies everything (including admin users and tokens) but is environment-specific and can break if env vars or Strapi versions differ. Prefer the Strapi export/import flow unless you are comfortable with DB tools and backups.

### 5.3 Other

- **Custom domains / subdomains:** See [SUBDOMAIN-SETUP.md](./SUBDOMAIN-SETUP.md) for how to prepare Netlify and Railway and what to do during and after the call.  
- **Monitoring:** Optionally set up Netlify and Railway notifications for deploy failures.

---

## Quick reference

| Platform | Purpose | Key env / config |
|----------|----------|-------------------|
| **Railway** | Strapi + Postgres | `DATABASE_CLIENT=postgres`, `DATABASE_URL`, Strapi secrets, `FRONTEND_URL` |
| **Netlify** | Next.js frontend | `NEXT_PUBLIC_STRAPI_URL` = Strapi URL |
| **Discord** | Login | Redirect = `https://STRAPI_URL/api/connect/discord/callback` |
| **Strapi Admin** | Discord provider | Redirect = `https://NETLIFY_SITE/connect/discord/redirect` |

If something fails, check:  
- Railway Strapi logs (build + runtime).  
- Netlify build logs and that env vars are set.  
- Browser console and Network tab when clicking “Continue with Discord” (CORS, 404, or wrong redirect URL).
