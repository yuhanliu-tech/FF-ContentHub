# Expert booking (appointments)

Simple intake flow: members request a session with an expert by choosing a preferred date, optional time of day, and a short message. Requests are stored in Strapi and can be reviewed/confirmed by admins.

## Flow

1. **Expert profile** (`/expert-net/[slug]`) – Logged-in users see a “Book a session” section with an intake form (preferred date, optional time, optional message). Guests see “Log in to request a session”.
2. **Submit** – POST to Strapi `api/appointments`; the backend sets the current user from the JWT.
3. **My appointments** (`/users/appointments`) – Logged-in users see a list of their requests with status (requested, confirmed, cancelled, completed). Navbar shows “My appointments” when authenticated.

## Strapi setup

After deploying the new **Appointment** content type:

1. **Settings → Users & Permissions → Roles → Authenticated**
2. Under **Appointment**, enable:
   - **create** (submit booking request)
   - **find** (list own appointments)
   - **findOne** (view single appointment; optional if you only use the list)

Only the authenticated user’s own appointments are returned; the controller filters by `user.id`.

## Content type (backend)

- **expert** – relation to Expert-Bio (required)
- **user** – relation to User (set by backend from JWT)
- **preferred_date** – date (required)
- **preferred_time** – string, optional (e.g. morning, afternoon, anytime)
- **message** – text, optional
- **status** – enum: requested | confirmed | cancelled | completed (default: requested)

Admin can change status in Strapi and, later, add email notifications or calendar integration.
