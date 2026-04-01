This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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

## Client portal (`/app`) and Supabase

The marketing site and **`/app` client portal** share this Next.js app. The portal uses Supabase Auth (email + password), cookie sessions via `@supabase/ssr`, and Postgres RLS for tenant data.

### Environment variables

Copy [`.env.example`](./.env.example) to `.env.local` and set:

- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (from Supabase **Project Settings → API**)
- `NEXT_PUBLIC_SITE_URL`: production site URL (optional locally)

Never put the **service role** key in client env vars.

For **`/admin`** (client provisioning), set **`SUPABASE_SERVICE_ROLE_KEY`** and **`ADMIN_EMAILS`** (comma-separated). Your staff user must sign in at `/admin/login` with an email in that list.

### Supabase Auth URLs

In the Supabase dashboard, add redirect URLs such as:

- `http://localhost:3000/app/auth/callback`
- `https://YOUR_DOMAIN/app/auth/callback`

Schema, RLS, and seed notes: [`../../supabase/README.md`](../../supabase/README.md).

### Vercel checklist

1. Set the same env vars as above for the Production (and Preview) environment.
2. For **`/admin`**: set **`SUPABASE_SERVICE_ROLE_KEY`** and **`ADMIN_EMAILS`** (server env only, never exposed).
3. Confirm **middleware** runs on `/app` and `/admin` (default for Next on Vercel).
4. Add your production `/app/auth/callback` URL to Supabase allowlist.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
