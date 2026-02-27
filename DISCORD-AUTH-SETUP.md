# Discord login in production

Once you remove `NEXT_PUBLIC_BYPASS_AUTH` (or leave it unset), login uses Discord OAuth. For it to work with the frontend on Netlify and the backend (Strapi) on e.g. Railway/Render, do the following.

## 1. Deploy Strapi and get its URL

Example: `https://your-strapi.up.railway.app`

## 2. Set Strapi environment variables

On the host where Strapi runs (Railway, Render, etc.), add:

- **`FRONTEND_URL`** = your Netlify site URL, e.g. `https://your-site.netlify.app`  
  (Strapi uses this for CORS so the browser allows requests from your frontend.)
- **`PUBLIC_URL`** = your Strapi public URL, e.g. `https://your-strapi.up.railway.app`  
  (Required when Strapi is behind a proxy like Railway; fixes OAuth redirects and secure-cookie errors.)
- **`DISCORD_ALLOWED_GUILD_ID`** = your Feedforward Discord server ID (see [Guild restriction](#guild-restriction) below).  
  Only users who are members of this server can sign in. If unset, the guild check is skipped (not recommended in production).

## 3. Discord Developer Portal

1. Go to [Discord Developer Portal](https://discord.com/developers/applications) → your application (or create one).
2. **OAuth2** → **Redirects** → add this URL (use your real Strapi URL):
   ```text
   https://YOUR_STRAPI_URL/api/connect/discord/callback
   ```
   Example: `https://your-strapi.up.railway.app/api/connect/discord/callback`
3. Save. Copy the **Client ID** and **Client Secret** for the next step.

## 4. Strapi Admin – Discord provider

1. Open Strapi Admin: `https://YOUR_STRAPI_URL/admin`
2. **Settings** (left) → **Users & Permissions** → **Providers**.
3. Open **Discord**:
   - **Enable**: ON
   - **Client ID**: from Discord
   - **Client Secret**: from Discord
   - **Redirect URL to your front-end**: your Netlify URL + `/connect/discord/redirect`  
     Example: `https://your-site.netlify.app/connect/discord/redirect`
4. Save.

## 5. Guild restriction

Login is restricted to members of the **Feedforward Discord server**. The app requests the `guilds` OAuth scope so the backend can read the user’s server list and check membership.

- Set **`DISCORD_ALLOWED_GUILD_ID`** on the Strapi host to the Discord server (guild) ID.  
  To get the server ID: enable Developer Mode in Discord (User Settings → App Settings → Advanced), then right‑click the server name and choose “Copy Server ID”.
- If `DISCORD_ALLOWED_GUILD_ID` is not set, the backend skips the check and logs a warning; set it in production so only your server’s members can sign in.

## 6. Netlify – frontend env

In Netlify → **Site configuration** → **Environment variables**:

- **`NEXT_PUBLIC_STRAPI_URL`** = your Strapi URL (e.g. `https://your-strapi.up.railway.app`)
- Do **not** set `NEXT_PUBLIC_BYPASS_AUTH` in production (or set it to `false`).

Redeploy the frontend after changing env vars.

## Summary

| Where              | What to set |
|--------------------|-------------|
| Strapi (backend)   | `FRONTEND_URL` = Netlify site URL; `PUBLIC_URL` = Strapi URL; `DISCORD_ALLOWED_GUILD_ID` = Feedforward server ID |
| Discord Portal     | Redirect = `https://STRAPI_URL/api/connect/discord/callback` |
| Strapi Admin       | Discord Client ID, Secret; Redirect = `https://NETLIFY_SITE/connect/discord/redirect` |
| Netlify (frontend) | `NEXT_PUBLIC_STRAPI_URL` = Strapi URL; no bypass auth |

After this, “Continue with Discord” on the Netlify site will use Discord and Strapi in production, and you can safely remove the bypass.
