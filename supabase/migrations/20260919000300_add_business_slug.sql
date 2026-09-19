-- Public URL segment for the storefront: /s/:slug
alter table public.businesses add column if not exists slug text;

-- Backfill existing rows before the not null constraint goes on.
update public.businesses
set slug = 'biz-' || left(replace(id::text, '-', ''), 10)
where slug is null;

alter table public.businesses alter column slug set not null;

create unique index if not exists businesses_slug_key on public.businesses (slug);

-- Public projection for /s/:slug.
--
-- businesses holds sales CRM data — owner_name, phone, email, notes — so an
-- anonymous visitor must never read that table. This view exposes only the two
-- storefront columns, and only for rows that actually carry a config. It runs
-- with the view owner's privileges, so no anon policy has to be added to
-- businesses and the owner-only policies there stay exactly as they are.
create or replace view public.storefronts as
select slug, storefront_config
from public.businesses
where storefront_config is not null;

revoke all on table public.storefronts from anon, authenticated;
grant select on table public.storefronts to anon, authenticated;
