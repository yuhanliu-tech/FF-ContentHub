# Subdomain setup – before, during & after the call

Use this **after** you already have a live site on Netlify and a live Strapi service on Railway (see [DEPLOYMENT.md](./DEPLOYMENT.md) to get there from zero). Everything in the app is driven by env vars, so once you have the final URLs you only update config (no code changes).

---

## Before the call (prepare these)

### 1. Current live URLs (so you know what will change)

Fill these in if you already have a deploy:

| Role | Current URL | Will become (after call) |
|------|-------------|---------------------------|
| **Frontend (Netlify)** | e.g. `https://xxx.netlify.app` | ________________ |
| **Backend (Railway)** | e.g. `https://xxx.up.railway.app` | ________________ |

### 2. Decide what you’re setting up

- [ ] **Frontend only** on a subdomain (e.g. `hub.client.com`) → most common.
- [ ] **Frontend + backend** on subdomains (e.g. `hub.client.com` + `api.client.com`) → ask if they want a “pretty” API URL.

### 3. Have these ready to share or note

- **Netlify:** You’ll add the domain in Netlify and get **DNS instructions** (usually a CNAME or A record). Someone (you or client) must add that in the place where their domain’s DNS is managed.
- **Railway:** If you add a custom domain for Strapi, Railway will show a **CNAME target**. Same idea – that record goes in their DNS.
- **SSL:** Netlify and Railway both issue HTTPS automatically for custom domains; no extra step.

### 4. One place that must stay in sync

After the subdomain is live, these must use the **final** URLs:

| Where | What to set |
|-------|-------------|
| **Netlify** env | `NEXT_PUBLIC_STRAPI_URL` = backend URL (Railway default or custom, e.g. `https://api.client.com`) |
| **Railway** env | `FRONTEND_URL` = frontend URL (Netlify default or custom, e.g. `https://hub.client.com`) |
| **Discord app** | Redirect = `https://BACKEND_URL/api/connect/discord/callback` |
| **Strapi Admin** → Discord provider | Redirect = `https://FRONTEND_URL/connect/discord/redirect` |

So once you know the subdomain names, you have a clear list of what to update.

---

## Prepare Netlify and Railway (do this now)

Do these steps **before** or **during** the call so both platforms are ready. You only need the exact subdomain name(s) from the client to finish.

### Netlify (frontend)

1. Log in at [app.netlify.com](https://app.netlify.com).
2. Open your **site** (the FF Content Hub frontend).
3. In the left sidebar: **Domain management** (or **Site configuration** → **Domain management**).
4. Click **Add a domain** / **Add custom domain** (or **Options** → **Add custom domain** on an existing domain).
5. You can either:
   - **Add the subdomain now:** Type the full hostname (e.g. `hub.client.com`). Netlify will show **DNS instructions** (e.g. add a CNAME record). Copy or screenshot these to send to whoever manages DNS.  
   - **Or add it after the call:** Just note that you’ll go to **Domain management** → **Add custom domain** and enter the agreed subdomain; then you’ll get the DNS instructions.
6. **If the client will use Netlify DNS:** In Domain management, next to the domain, use **Set up Netlify DNS** (or **Options** → **Set up Netlify DNS**). Netlify will show the **nameservers** the client must set at their registrar. (If they have other records like MX for email, copy those into Netlify DNS first.)
7. **SSL:** Netlify will issue a certificate automatically once DNS is correct; no extra step.

**What to have after this:** Either the DNS instructions (CNAME or A record) or the Netlify nameservers, ready to send to the client or their IT.

### Railway (backend)

1. Log in at [railway.app](https://railway.app) and open your **project**.
2. Open the **Strapi service** (the backend, not the Postgres database).
3. Go to the **Settings** tab for that service.
4. Find the **Networking** section (or **Public Networking** / **Domains**).
5. You should see the **default Railway domain** (e.g. `xxx.up.railway.app`). Note it; the app already uses it.
6. To **add a custom subdomain** (e.g. `api.client.com`):
   - Click **Add custom domain** / **Custom domain** (or **Generate domain** if you haven’t got one yet, then add custom).
   - Enter the full hostname (e.g. `api.client.com`).
   - Railway will show the **CNAME target** (e.g. `xxx.up.railway.app` or a gateway hostname). Copy it.
   - The client (or you) adds a **CNAME record** at their DNS: subdomain → that target.
7. **SSL:** Railway provisions HTTPS for the custom domain once DNS is pointing correctly.
8. **Plan note:** Trial = 1 custom domain; Hobby = 2 per service. If you only use the default Railway URL, you don’t need a custom domain here.

**What to have after this:** If you’re adding a backend subdomain, the CNAME target from Railway, ready for the person who manages DNS.

### Quick checklist

- [ ] Netlify: Opened **Domain management** and know where **Add custom domain** is.
- [ ] Netlify: Either added the subdomain (and have DNS instructions) or ready to add it as soon as the client gives the name.
- [ ] Railway: Opened Strapi service **Settings** → **Networking** and noted the default domain.
- [ ] Railway: If using a custom backend domain, added it and have the **CNAME target** for DNS.

---

## During the call – questions to ask

1. **Exact subdomain name(s)**  
   - Frontend: e.g. `hub.theircompany.com` or `content.theircompany.com`?  
   - Backend: do they want one too (e.g. `api.theircompany.com`), or is the default Railway URL fine?

2. **Who manages DNS?**  
   - Client’s IT / registrar (GoDaddy, Namecheap, Cloudflare, etc.)?  
   - Or will they point the domain to Netlify (Netlify DNS) so you manage it?

3. **Where is the domain registered?**  
   - So you know where the CNAME/A records will be added (and who gets the exact instructions).

4. **When to switch?**  
   - Same day vs “we’ll add the records and tell you when it’s done.”

---

## After the call – checklist

### Frontend subdomain (Netlify)

1. Netlify → **Site** → **Domain management** → **Add custom domain** / **Add subdomain**.
2. Enter the agreed name (e.g. `hub.client.com`).
3. Netlify shows **DNS instructions** (e.g. CNAME `hub` → `xxx.netlify.app`, or A record to Netlify’s load balancer). Send these to whoever manages DNS.
4. After DNS propagates, Netlify will issue SSL. Test `https://hub.client.com`.

### Backend subdomain (Railway, optional)

1. Railway → **Strapi service** → **Settings** → **Networking** / **Custom domain**.
2. Add the agreed hostname (e.g. `api.client.com`).
3. Railway shows the **CNAME target**. Whoever manages DNS adds: `api` (or subdomain) → CNAME → that target.
4. After propagation, test `https://api.client.com/admin`.

### Update config (use the table in “One place that must stay in sync”)

1. **Netlify** → Environment variables: set `NEXT_PUBLIC_STRAPI_URL` to the **final** backend URL (custom or Railway default). Redeploy if needed.
2. **Railway** → Strapi service → Variables: set `FRONTEND_URL` to the **final** frontend URL (custom or Netlify default). Redeploy if needed.
3. **Discord Developer Portal** → OAuth2 → Redirects: add `https://FINAL_BACKEND_URL/api/connect/discord/callback` (and remove the old one if you’re fully switching).
4. **Strapi Admin** → Settings → Users & Permissions → Providers → Discord: set “Redirect URL to your front-end” to `https://FINAL_FRONTEND_URL/connect/discord/redirect`.

### Verify

- Open the frontend at the new URL → log in with Discord → confirm redirect and session work.
- Open Strapi Admin at the backend URL and check content loads.

---

## Quick reference

| If they want… | You do |
|---------------|--------|
| Frontend on `hub.client.com` | Add domain in Netlify, get CNAME/A, client (or you) adds DNS; then set `FRONTEND_URL` in Railway and Discord redirect in Strapi to `https://hub.client.com/...`. |
| Backend on `api.client.com` | Add custom domain in Railway, get CNAME; add DNS; then set `NEXT_PUBLIC_STRAPI_URL` in Netlify and Discord redirect to `https://api.client.com/api/connect/discord/callback`. |
| Both | Do both rows above and update all four places in the “One place that must stay in sync” table. |

No code changes are required; only env vars and Discord/Strapi redirect URLs.
