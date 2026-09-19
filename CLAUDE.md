# BLITZ

## Stack

- Vite + React 18 + TypeScript
- Tailwind CSS
- Supabase for auth and database
- Cloudflare Pages, connected to GitHub, auto-deploy on push to main

## Rules

- Every business is one row in the businesses table. Admin and portal are two
  views of the same record, filtered by status.
- Every component reads from tokens.css. No hardcoded hex values anywhere in
  the app.
- tokens.css is BLITZ's design system only. Client storefronts get a separate
  scoped system and must never inherit from it.
- Add only what the current prompt specifies. Do not bundle in extra changes.
- BLITZ admin and portal views are desktop-first, designed at 1440px. Data
  density over whitespace — these are working tools.
- Client storefronts are mobile-first, designed at 390px.
- Ask before adding a dependency.

## Commands

Requires Node 22 (`.nvmrc`). Node is not on the default shell PATH — run
`nvm use` first.

| Command | Does |
| --- | --- |
| `npm run dev` | Vite dev server on :5173 |
| `npm run build` | `tsc -b && vite build` — typecheck then build to `dist/` |
| `npm run typecheck` | Typecheck only |
| `npm run preview` | Serve the built `dist/` |

## Layout

```
src/styles/tokens.css   design tokens — the only file with hex values
src/styles/index.css    Tailwind entry, token-to-utility mapping, component classes
src/auth/               AuthContext (current user), ProtectedRoute
src/pages/              Login, Admin, Portal
src/lib/supabase.ts     Supabase client
src/App.tsx             route table
supabase/migrations/    schema and RLS policies
public/_redirects       SPA fallback for Cloudflare Pages
```

## How this codebase works

- **Routing is hand-rolled** on `window.location.pathname` in `src/App.tsx`.
  There is no router dependency, so every redirect is a full page load. Adding
  a router is a dependency decision — ask first.
- **Tokens are scoped to `.blitz-app`**, not `:root`. This is what keeps client
  storefronts from inheriting BLITZ's design system. Render storefronts outside
  that class.
- **Tailwind v4.** The default color palette is disabled (`--color-*: initial`
  in `index.css`), so the only color utilities that exist are the ones mapped
  from tokens. A `bg-*` class that isn't token-backed will silently do nothing.
- **`VITE_` env vars are inlined at build time**, not read at runtime. They must
  be set as Cloudflare Pages build environment variables, or the deploy ships a
  client that cannot reach Supabase.
- **`supabase` is `null` when env vars are missing** rather than throwing at
  import. Guard before use.

## Database

One table, `businesses`, defined in `supabase/migrations/`. RLS is on and every
policy is `owner_id = auth.uid()` — a user only ever sees their own rows. The
`status` column (`prospect` / `pitched` / `client` / `live`) is what separates
the admin view from the portal view.
