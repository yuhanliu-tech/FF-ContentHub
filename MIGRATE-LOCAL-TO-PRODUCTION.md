# Migrate local Strapi data to production

Use this guide to copy all content from your **local** Strapi (and database) into **production** so the live site shows the same data. The recommended way is Strapi’s built-in **export** (local) and **import** (into production DB).

---

## Before you start

- Production Strapi is already deployed (e.g. on Railway) and you have the **production `DATABASE_URL`** (from Railway → your Postgres service → Variables).
- You have a **backup** of the production database (Railway: Postgres → Backups, or your own `pg_dump`). Import **replaces** all data on the target.
- Local and production use the **same** Strapi version (this project uses Strapi 5.x).

---

## Step 1: Export from your local Strapi

1. Open a terminal and go to the **backend** folder of this repo:
   ```bash
   cd backend
   ```

2. **Stop** the local Strapi server if it’s running (Ctrl+C in the terminal where `npm run develop` is running). The export works with the process stopped.

3. Run the export. Pick a **secret key** (e.g. a long random string) and use it for both export and import:
   ```bash
   npm run strapi -- export --file content-export --key "PUT_YOUR_SECRET_KEY_HERE"
   ```
   Replace `PUT_YOUR_SECRET_KEY_HERE` with a strong value and **remember it** for Step 3.

4. You should see a file created: **`content-export.tar.gz.enc`** in the `backend` folder. This contains:
   - All content (tiles, logo, homepage-hero, experts, documents, etc.)
   - Relations between content
   - Uploaded files (images, PDFs, etc.) from your local `public/uploads`

---

## Step 2: Back up production database

Do **not** skip this. The import in Step 3 will **replace** all data in the production database. If something goes wrong, you need a backup to restore.

Railway does not always show a one-click “Backup” button for PostgreSQL (it depends on your plan and region). The reliable way is to create a backup from your own machine using **pg_dump** and the production database URL.

### 2.1 Get your production database URL from Railway

1. Go to [railway.app](https://railway.app) and open your project.
2. Click your **PostgreSQL** service (the database, not the Strapi backend).
3. Open the **Variables** or **Connect** tab. You should see **`DATABASE_URL`** (or **`PGHOST`**, **`PGUSER`**, **`PGPASSWORD`**, **`PGPORT`**, **`PGDATABASE`**).
4. Copy the **full `DATABASE_URL`**. It looks like:
   - `postgresql://postgres:XXXXX@containers-us-west-XXX.railway.app:XXXXX/railway`
   - Or `postgres://...` — both work with `pg_dump`.
5. If Railway only shows separate variables, build the URL yourself:
   - `postgresql://PGUSER:PGPASSWORD@PGHOST:PGPORT/PGDATABASE`
   - Replace any special characters in the password with URL encoding (e.g. `#` → `%23`).

Use the **direct** connection URL (the one for the database itself), not a pooled URL if you have both.

### 2.2 Install PostgreSQL tools (if needed)

You need **pg_dump** on your machine. It comes with the PostgreSQL client:

- **Windows (ohne Chocolatey):**
  1. Gehe zu [PostgreSQL Windows Download](https://www.postgresql.org/download/windows/) und lade den **EDB Installer** (z. B. PostgreSQL 16) herunter.
  2. Führe den Installer aus. Wähle nur **“Command Line Tools”** (und ggf. “Stack Builder” abwählen). Du musst **keinen** PostgreSQL-Server installieren.
  3. Standard-Pfad nach der Installation: `C:\Program Files\PostgreSQL\16\bin` (16 = Version). Schließe PowerShell und öffne sie neu, oder füge diesen Ordner manuell zur **PATH**-Umgebungsvariable hinzu (Systemsteuerung → System → Erweiterte Systemeinstellungen → Umgebungsvariablen → “Path” bearbeiten → “Neu” → obigen Pfad einfügen).
  4. In einer **neuen** PowerShell prüfen: `pg_dump --version`
- **Windows (mit Chocolatey):** `choco install postgresql`, dann neue PowerShell öffnen.
- **Mac:** `brew install libpq` then run `pg_dump` via full path, or install full Postgres: `brew install postgresql`.
- **Linux:** `sudo apt install postgresql-client` (Debian/Ubuntu) or equivalent.

Check that it works:

```bash
pg_dump --version
```

### 2.3 Run the backup

**Ohne pg_dump installiert (nur wenn Docker installiert ist):** Siehe [Option: Backup mit Docker](#option-backup-mit-docker-windows) weiter unten.

1. Open a terminal (PowerShell, CMD, or Mac/Linux terminal).
2. Choose a folder to save the backup (e.g. your project root or `backend/`). You’ll create a file like `production-backup-2025-02-27.dump`.
3. Run **one** of these, replacing `YOUR_DATABASE_URL` with the URL you copied (in quotes if it contains special characters):

   **Custom format (recommended – easy to restore later):**
   ```bash
   pg_dump "YOUR_DATABASE_URL" -F c -f production-backup.dump
   ```

   **Plain SQL (human-readable, larger file):**
   ```bash
   pg_dump "YOUR_DATABASE_URL" -f production-backup.sql
   ```

   **Windows (PowerShell):** If the URL has `&` or other special characters, set it as an env var first:
   ```powershell
   $env:DATABASE_URL = "postgresql://user:pass@host:5432/railway"
   pg_dump $env:DATABASE_URL -F c -f production-backup.dump
   ```

4. Enter the database password when prompted (unless it’s in the URL). The command may take a few seconds.
5. Confirm the file was created (e.g. `production-backup.dump` or `production-backup.sql`). Keep it somewhere safe until after you’ve run the import and checked production.

### 2.4 If you need to restore this backup later

- **Custom format (`.dump`):**  
  `pg_restore -d "YOUR_DATABASE_URL" --clean --if-exists production-backup.dump`
- **Plain SQL (`.sql`):**  
  `psql "YOUR_DATABASE_URL" -f production-backup.sql`

### Option: Backup mit Docker (Windows)

Wenn du **Docker Desktop** installiert hast und **kein** PostgreSQL/pg_dump installieren willst, kannst du das Backup mit einem Postgres-Container erstellen:

1. Öffne PowerShell und wechsle in einen Ordner, in dem die Backup-Datei liegen soll (z. B. dein Projekt):
   ```powershell
   cd C:\Users\ameli\Documents\git\FF-ContentHub\backend
   ```

2. Ersetze `DEINE_DATABASE_URL` durch die echte URL aus Railway (in Anführungszeichen). Dann:
   ```powershell
   docker run --rm -v "${PWD}:/out" postgres:16 pg_dump "DEINE_DATABASE_URL" -F c -f /out/production-backup.dump
   ```
   Die Datei `production-backup.dump` liegt danach im aktuellen Ordner (`backend/`).

3. Falls das Passwort Sonderzeichen enthält und Fehler verursacht: URL encoden (z. B. `#` → `%23`, `@` im Passwort → `%40`) oder die URL in eine Umgebungsvariable legen:
   ```powershell
   $env:PGPASSWORD = "dein_passwort"
   docker run --rm -v "${PWD}:/out" -e PGPASSWORD postgres:16 pg_dump -h DEIN_HOST -p 5432 -U postgres -d railway -F c -f /out/production-backup.dump
   ```
   (Host, Port, User, DB-Namen aus der Railway-URL einsetzen.)

Nach dem Backup mit Docker weiter mit **Step 3: Import into production**.

---

After you have the backup file, continue with **Step 3: Import into production**.

---

## Step 3: Import into production (run on your machine, target = production DB)

You will run the Strapi **import** command on your machine, but connected to the **production** database. That way the production DB gets all the content. (Uploaded files are stored in the export; when we run import, they are restored—see “About media” below.)

1. In the **backend** folder, **copy** your current `.env` to a safe place (e.g. `.env.local.backup`) so you can restore it:
   ```bash
   cd backend
   copy .env .env.local.backup
   ```
   (On Mac/Linux use `cp .env .env.local.backup`.)

2. **Edit** `backend/.env` and set the database to **production** only for this step:
   - Set `DATABASE_URL` to your **production** Postgres URL (from Railway → Postgres → Variables → `DATABASE_URL`).
   - Keep the rest of the file as-is (or ensure `NODE_ENV` is not `production` if you prefer; the import only needs the correct `DATABASE_URL`).

3. Run the import (use the **same key** as in Step 1):
   ```bash
   npm run strapi -- import -f content-export.tar.gz.enc -k "PUT_YOUR_SECRET_KEY_HERE"
   ```
   When prompted, confirm that you want to replace the data. The command will restore content and uploads into the production database.

4. **Restore** your local `.env` so you use your local database again:
   ```bash
   copy .env.local.backup .env
   ```
   (Or manually change `DATABASE_URL` back to your local Postgres URL.)

### Optional: Step 3b – Run import on Railway (so media files exist on the server)

If you want images and PDFs to work on production without re-uploading, run the import **on** Railway so the export’s files are extracted there:

1. Upload `content-export.tar.gz.enc` somewhere the Railway service can reach it (e.g. a private GitHub Gist, S3, or your own server). Or use [Railway volumes](https://docs.railway.app/reference/volumes): attach a volume to the backend service, copy the file into it from your machine (e.g. with `railway run` and a small script), then run import from that path.
2. In Railway → your **Strapi/backend** service → **Settings** → add a **Volume** and mount it at e.g. `./data` so uploads persist across deploys. Then configure Strapi to use that path for uploads if needed (or leave default and accept that uploads may be lost on redeploy unless you use a volume for `public/uploads`).
3. Run a one-off shell in the backend service (e.g. **Railway CLI**: `railway run bash`), then inside the container copy the export file into the app directory and run:
   ```bash
   npx strapi import -f ./content-export.tar.gz.enc -k "PUT_YOUR_SECRET_KEY_HERE" --force
   ```
   After this, the production DB and the container’s filesystem both have the data. If you did not add a volume, a redeploy will remove the uploaded files; add a volume for `public/uploads` if you need them to persist.

---

## Step 4: Set permissions in production Strapi Admin

So the frontend can read the data (and you don’t get 403):

1. Open **production** Strapi Admin: `https://YOUR_STRAPI_URL/admin` (your Railway Strapi URL).
2. Log in (create an admin user if this is the first time).
3. Go to **Settings** → **Users & Permissions plugin** → **Roles**.
4. **Public** role: enable **find** and **findOne** for: **Tile**, **Logo**, **Homepage-hero**, **Document**, **Expert-bio**, **Expert-net**.
5. **Authenticated** role: same as above, and for **Appointment** enable **find** and **create**.
6. Save.

Details are in [DEPLOYMENT.md](./DEPLOYMENT.md#51-strapi-permissions-fix-403).

---

## Step 5: Check the frontend

1. Open your **production** frontend (e.g. Netlify URL).
2. Log in if the app requires it.
3. You should see tiles, hero, experts, etc. If you still see “Error fetching content”, check the browser Network tab for 403 and re-check Step 4.

---

## About media (images, PDFs, etc.)

- When you run **import** on your machine with production `DATABASE_URL`, Strapi writes all **content and relations** into the production database, and it restores the **upload records** and file metadata there too. The actual **files** from the export are written to your **local** `backend/public/uploads` (or the path your local Strapi uses).
- **Production Strapi** (on Railway) will serve media from **its own** filesystem. So:
  - If you run import **only** locally (pointed at prod DB), production has the content but **not** the files on disk—media URLs may 404 until you either re-upload them in Admin or set up cloud storage (e.g. S3) and sync.
  - To have media on production **without** S3, you need the import to run **on** Railway so files are extracted there. That requires getting `content-export.tar.gz.enc` onto the Railway service and running `strapi import` there (e.g. one-off run). Railway’s filesystem is **ephemeral**: a new deploy can remove those files. For persistent media on Railway you’d add a [volume](https://docs.railway.app/reference/volumes) for the uploads directory.

**Practical suggestion:** Run Steps 1–5 as above. If images/PDFs don’t show on production, either re-upload the main assets in production Strapi Admin or use the optional **Step 3b** below to run the import on Railway so files are extracted there (and add a [Railway volume](https://docs.railway.app/reference/volumes) for `public/uploads` so they survive redeploys).

---

## Quick checklist

| Step | Action |
|------|--------|
| 1 | Export: `cd backend` → `npm run strapi -- export --file content-export --key "YOUR_KEY"` |
| 2 | Back up production DB (Railway or pg_dump) |
| 3 | Point `backend/.env` at production `DATABASE_URL`, run `npm run strapi -- import -f content-export.tar.gz.enc -k "YOUR_KEY"`, then restore `.env` |
| 4 | In production Admin: set Public + Authenticated permissions (find/findOne) for Tile, Logo, Homepage-hero, Document, Expert-bio, Expert-net; Appointment for Authenticated |
| 5 | Open production frontend and confirm content appears |

For more options (e.g. running import on Railway, or raw DB copy), see [DEPLOYMENT.md](./DEPLOYMENT.md#52-content-in-production).
