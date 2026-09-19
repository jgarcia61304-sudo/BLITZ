# BLITZ

## Stack

- Vite + React 18 + TypeScript
- Tailwind CSS
- Supabase for auth and database
- Cloudflare Pages, connected to GitHub, auto-deploy on push to main

## Rules

- Every business is one row in the businesses table. Admin and portal are two views of the same record, filtered by status.
- Every component reads from tokens.css. No hardcoded hex values anywhere in the app.
- tokens.css is BLITZ's design system only. Client storefronts get a separate scoped system and must never inherit from it.
- Add only what the current prompt specifies. Do not bundle in extra changes.
- Mobile-first. Storefronts are designed at 390px.
- Ask before adding a dependency.
