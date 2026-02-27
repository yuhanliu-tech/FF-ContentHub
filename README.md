# FF-ContentHub

Website Design Link: [Figma](https://www.figma.com/design/8f632doPqtWWNU2xMnS2n3/FeedForward-Content-Hub?node-id=8-3770&t=dS2sJ7v1TSIF5uqz-1)

## Project Stack

-   **Backend:** Strapi\
-   **Frontend:** Next.js\
-   **Database:** PostgreSQL\
-   **Auth:** Discord OAuth\
-   **Repo:** GitHub

## To Run Locally

| Component | Required Action |
|-----------|-----------------|
| Repo | Clone normally |
| Backend | Install deps + create `.env` |
| Frontend | Install deps + create `.env.local` |
| Database | Create local Postgres DB |
| Content | Import DB dump if needed |
| Auth | Ensure Discord OAuth config |
| Run | Start both apps |

## Podcasts (tile + episodes)

**Upload episodes in Strapi**

1. In Strapi go to **Content Manager → Documents**.
2. Create a new entry for each episode: set **Title**, optional **Description** (shown when the episode is expanded), and upload an **audio file** in **File** (e.g. MP3). Publish.

Only documents whose file has an audio MIME type (e.g. `audio/mpeg`) appear on the Podcasts page.

**Add a Podcast tile on the homepage**

1. **Content Manager → Tiles** → Create (or use an existing tile).
2. Set **slug** to `podcasts`, **title** e.g. "Podcasts", **category** e.g. "tool" or "dashboard", **cover** image.
3. Set **link_to_single_type** to **TRUE** so the app routes to `/podcasts` when the tile is clicked.
4. Save and Publish.

Clicking the tile will open the Podcasts page: accordion list, expand an episode to read the description and use Play / Pause / Stop.

## Expert-Net (experts)

**Adding a new expert so they show on the site**

1. **Content Manager → Expert-Bio** → Create a new entry (name, slug, title, photo, bio, etc.) and **Publish**.
2. **Content Manager → Expert-Net** (single type) → Open the one Expert-Net entry.
3. In **expert_bios**, click “Add to relation” and select the new expert. **Save** and **Publish**.
4. Ensure **Settings → Users & Permissions → Roles → Public** has **Expert-Net** and **Expert-Bio** → **find** enabled so the frontend can load them.