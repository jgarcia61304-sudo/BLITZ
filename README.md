# BLITZ

Initial scaffold: Vite, React 18, TypeScript, Tailwind CSS, and Supabase.

## Local development

Use Node 22.12 or newer (`nvm use`), then run:

```sh
npm ci
npm run dev
```

Fill `.env.local` with the project's Supabase URL and browser-safe anon key:

```dotenv
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

This file is ignored by git. `.env.example` contains the same empty entries for new checkouts. Restart Vite after changing environment variables. Never put a service-role or secret key in a `VITE_` variable.

## Supabase

Run `supabase/migrations/20260919000000_create_businesses.sql` in the project's SQL Editor. It creates the single `businesses` table and enables owner-only select, insert, update, and delete policies.

Enable email/password authentication. To go directly from sign-up to `/admin`, turn off **Confirm email** in the email provider settings. If confirmation stays enabled, the app displays a confirmation message and handles the return link.

Set the Auth Site URL to the deployed app URL. Add that origin's `/admin` URL and `http://localhost:5173/admin` to the allowed redirect URLs.

## Cloudflare Pages

Create a Pages project using **Connect to Git** and select this GitHub repository. Use these build settings:

| Setting | Value |
| --- | --- |
| Production branch | `main` |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | Repository root |
| `NODE_VERSION` | `22` |

Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as Cloudflare build environment variables before deploying. Vite embeds these values at build time. Pushes to `main` then deploy automatically. `public/_redirects` provides the SPA fallback for direct links and refreshes on `/login`, `/admin`, and `/portal`.

For a manual upload, populate `.env.local`, run `npm run build`, and upload the contents of `dist`. To retain the requested automatic GitHub deployments, create the Pages project with Git integration first: a Direct Upload project cannot later be switched to Git integration.

## Verification

```sh
npm run build
```

After configuring Supabase and deploying:

1. Visit `/admin` and `/portal` while signed out; both redirect to `/login`.
2. Sign up. With email confirmation disabled, the app opens the empty `/admin` page.
3. Refresh `/admin`; the session and page persist.
4. Visit `/portal`; it contains only its heading inside the BLITZ shell.

BLITZ's design tokens are scoped to `.blitz-app`. Future client storefronts must render outside that scope and use their own design system.

Setup references: [Supabase auth](https://supabase.com/docs/guides/auth/quickstarts/react), [Cloudflare Pages Git integration](https://developers.cloudflare.com/pages/get-started/git-integration/).
