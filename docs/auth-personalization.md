# Auth and personalization

## AppUser type

The app uses an `AppUser` type for personalization (see `frontend/lib/types.ts`):

- `id: string` – User id (string for Discord compatibility)
- `username: string` – Display name (e.g. Discord username)
- `avatarUrl?: string` – Optional avatar URL (for future use)

## getCurrentUser

- **Location:** `frontend/lib/auth.ts`
- **Behaviour:**
  - If the user is already logged in (Strapi JWT + user in `localStorage`), returns an `AppUser` built from that.
  - If `NEXT_PUBLIC_BYPASS_AUTH=true`, returns a mock user when no stored user exists.
  - Otherwise returns `null`.
- **Future (Discord):** Replace or extend the “no stored user” path to read from the real session (e.g. NextAuth session/JWT) and map Discord profile to `AppUser`.

## Login flow

- **Navbar:** “Log in” opens a modal; “Log out” clears auth and redirects to login page.
- **Login modal:** “Log in with Discord” redirects to `NEXT_PUBLIC_STRAPI_URL/api/connect/discord` when the backend is configured. In development, “Use test user (dev only)” calls `loginWithTestUser()` so you can test personalization without Discord.

## Env vars for Discord

When wiring up Discord OAuth (backend):

- Backend: Discord application Client ID and Client Secret; callback URL matching your app (e.g. `https://your-api/api/connect/discord/callback`).
- Frontend: `NEXT_PUBLIC_STRAPI_URL` (or equivalent) so the login modal can redirect to the backend Discord connect endpoint.

## Switching from mock to real Discord

1. Implement or enable the backend Discord OAuth flow (e.g. Strapi `api/connect/discord` or NextAuth with Discord provider).
2. Ensure the callback writes the user (id, username, optional avatar) and token into whatever the frontend expects (e.g. `setAuthData` with a user that has `id`, `username`, and optionally `avatarUrl`).
3. In `getCurrentUser`, keep using the same `AppUser` shape so UI code does not need to change.
