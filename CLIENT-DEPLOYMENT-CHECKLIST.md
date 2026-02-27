# What we need from you for a smooth deployment

Use this with the client so nothing is missing on deploy day.

---

## Required

### Discord app (for login)

- [ ] **Discord Application**  
  You need an app in the [Discord Developer Portal](https://discord.com/developers/applications).  
  - If you already have one: we need **Client ID** and **Client Secret** (OAuth2 section).  
  - We will send you **one redirect URL** to add in the Discord app (after the backend is deployed). You add it under OAuth2 → Redirects.

- [ ] **Client ID** received: _______________  
- [ ] **Client Secret** received: _______________

---

## Optional (can be added later)

- [ ] **Calendly link**  
  If you use the “Pick your session time” step in the booking form: your Calendly event URL (e.g. `https://calendly.com/your-team/60min`).

- [ ] **Custom domain**  
  If you want the site on your own domain (e.g. `hub.yourcompany.com`), tell us the domain; we’ll configure it in Netlify.

- [ ] **Content**  
  Tiles, experts, documents, etc. can be re-entered in the production admin after deploy, or we can plan a one-time import.

---

## After deploy (we’ll do together or we’ll send instructions)

- [ ] **First admin user**  
  The first time the Strapi admin is opened, an admin account is created (email + password). You can do this yourself or we can do it and hand over the credentials securely.

- [ ] **Add Discord redirect URL**  
  We’ll send you the exact URL to add in your Discord app (e.g. `https://your-backend.up.railway.app/api/connect/discord/callback`).

---

**Minimum to start:** Discord app with Client ID and Client Secret, and agreement to add the redirect URL we’ll send. The rest can follow after go-live.
