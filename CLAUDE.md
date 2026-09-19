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
- Card numbers are never stored. Stripe holds payment methods; we store
  stripe_customer_id and stripe_payment_intent_id only.
- All money is integer cents.
- Client addresses are personal data. Every query is scoped by business_id
  under RLS.
- Appointments snapshot service name, price and duration at booking time.

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
src/styles/tokens.css      BLITZ design tokens — BLITZ's only hex values
src/styles/index.css       Tailwind entry, token-to-utility mapping, component classes
src/styles/storefront.css  storefront design system, scoped to .storefront
src/auth/                  AuthContext (current user), ProtectedRoute
src/pages/                 Login, Admin, Portal
src/storefront/            the storefront renderer and its sections
src/data/                  placeholder storefront config
src/lib/supabase.ts        Supabase client
src/types/                 shared types, incl. the storefront_config shape
src/App.tsx                route table
supabase/migrations/       schema and RLS policies
supabase/seeds/            demo data
public/_redirects          SPA fallback for Cloudflare Pages
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

## Libraries

- `motion`, `lenis` and `embla-carousel-react` are installed but not imported
  anywhere yet, so they cost nothing in the bundle until something uses them.
- shadcn/ui is configured: `components.json`, the `@/*` alias pointing at
  `src/`, and components generated into `src/components/ui/`.
- **shadcn's base layer is scoped to `.blitz-app` and must stay that way.** As
  shadcn ships it, the layer targets `*`, `body` and `html`, which reaches into
  the storefront tree and overrides tokens.css — against two rules at once. Only
  the `border-border outline-ring/50` default its components need is kept, under
  `.blitz-app`.
- shadcn's semantic tokens sit on `:root` and are **not** BLITZ's. `bg-primary`
  is shadcn's near-black, not the `--accent` purple. `--accent` and `--border`
  exist in both systems; inside `.blitz-app` tokens.css wins, so a shadcn
  `bg-accent` renders solid purple rather than the subtle hover grey it expects.
  Map shadcn's tokens onto BLITZ's before leaning on its components.

## Storefronts

`/s/:slug` is public and renders a client storefront from one `StorefrontConfig`.
A single renderer serves every client; there is no per-client code.

- It renders **outside** `.blitz-app` and outside the BLITZ shell, so it cannot
  inherit a token from tokens.css.
- `storefront.css` is scoped to `.storefront` and holds no color literals. The
  four `config.brand.colors` values are injected as custom properties on the
  root at render time, and every other color is `color-mix`ed down from them —
  so a config fully determines how its storefront looks, and two configs give
  two unrelated-looking businesses.
- Readable foregrounds for the brand primary and accent are picked in
  TypeScript (`readableOn` in `src/storefront/format.ts`), because CSS cannot
  choose a contrasting color on its own.
- `config.brand.fonts` holds family names only. No webfont is ever fetched, and
  the gallery uses inline data URIs, so a storefront makes no third-party
  request.
- Every section returns `null` when its slice of config is empty. An empty
  config renders an empty page — never a heading with nothing under it.
- The page reads the `storefronts` view, never the `businesses` table, so no
  CRM column is reachable from an unauthenticated page.

A new section means a component under `src/storefront/sections/` carrying its
own emptiness guard, rendered from `Storefront.tsx`.

## Storefront config

`businesses.storefront_config` is jsonb. `src/types/storefront.ts` defines its
shape and is the source of truth; this table is the map.

| Key | Holds |
| --- | --- |
| `brand` | name, tagline, logo, colors, fonts |
| `contact` | phone, email, instagram, booking email |
| `services` | the menu — id, name, description, price, duration, active |
| `gallery` | images with caption, alt text, order |
| `booking` | payment mode, deposit, cancellation window, fees, travel |
| `availability` | timezone, weekly hours, blackout dates, notice, buffer |
| `service_area` | mobile flag, description, base address, radius |
| `policies` | cancellation and late text, plus extra sections |
| `faq` | questions with order |
| `seo` | title, description, og image |

Conventions across the whole config:

- Money is integer cents — never floats, never strings.
- Times of day are 24h `'HH:MM'`, dates are `'YYYY-MM-DD'`, timezone is an IANA
  name. Timestamps in Postgres are timestamptz.
- `services[].id` is what `appointments.service_id` points at. It has to stay
  stable — changing it orphans the link from every past appointment.
- Only four fields are nullable: `booking.deposit_cents` (null unless
  payment_mode is `deposit`), `booking.travel_fee_cents` (null when travel is
  included), `service_area.base_address` and `service_area.radius_miles`.
  Everything else is required, so an unconfigured storefront is
  `storefront_config = null` on the column, not a half-filled object.

## Database

Three tables, migrations in `supabase/migrations/` applied in filename order.

- `businesses` — one row per business, the spine of the app.
- `clients` — belongs to a business.
- `appointments` — belongs to a business and a client.

RLS is on for all three and there is no cross-business access. `businesses` is
scoped by `owner_id = auth.uid()`. `clients` and `appointments` are scoped by an
`exists` check against the owning `businesses` row. Appointment writes also
require the client to belong to the same business, so no row can straddle two
businesses.

`businesses.status` (prospect / pitched / client / live) is what separates the
admin view from the portal view. `appointments.status` is a separate pipeline
(scheduled / completed / cancelled / late_cancelled / no_show).

Indexes: `clients (business_id)`, `appointments (business_id, starts_at)`,
`appointments (client_id)`.

`businesses.slug` is the public storefront URL segment and is unique and not
null. The `storefronts` view is the only public projection over `businesses`: it
exposes `slug` and `storefront_config` for rows that carry a config, and nothing
else. It runs with the view owner's privileges, which is what keeps the
owner-only policies on `businesses` untouched.

## Autonomous working rules

Work through the whole task before reporting back. Do not stop to ask permission for
routine steps.

Before saying a task is done:
1. Run `npm run typecheck` and fix every error. A task with type errors is not done.
2. For any UI or page change, start the dev server and open the page with the Playwright
   tools. Confirm it renders, then click through the flow that was changed. Fix what breaks.
3. For any database change, apply it through the Supabase tools and confirm the table
   afterwards. Do not hand back SQL for the user to paste.
4. Commit working checkpoints with git as you go, so a bad change can be undone.

If something fails three times in a row, stop and explain what is blocking, in plain
language, without jargon. The user is non-technical.

Report back with what changed and what to look at, not a list of steps taken.
