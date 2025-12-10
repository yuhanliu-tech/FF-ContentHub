This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Environment Setup

Before running the project, copy the environment file:

```bash
cp .env.example .env.local
```

Make sure to update `NEXT_PUBLIC_STRAPI_URL` in `.env.local` to point to your Strapi backend (default: `http://localhost:1337`).

## Authentication

This app uses Discord OAuth for authentication through Strapi. Users must login with Discord before accessing the content.

### Authentication Flow:
1. User visits the homepage and gets redirected to `/auth/login`
2. User clicks "Continue with Discord" 
3. User is redirected to Strapi's Discord OAuth endpoint
4. After Discord authentication, user is redirected back to `/connect/discord/redirect`
5. The app exchanges the auth code for a JWT token and stores it locally
6. User is redirected to the homepage with authenticated access

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
