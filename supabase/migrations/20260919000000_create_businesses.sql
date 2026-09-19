create table public.businesses (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users (id) not null,
  created_at timestamptz default now(),
  status text not null default 'prospect'
    check (status in ('prospect', 'pitched', 'client', 'live')),
  industry text,
  sub_vertical text,
  business_name text not null,
  owner_name text,
  instagram_handle text,
  phone text,
  email text,
  current_website text,
  storefront_config jsonb,
  storefront_url text,
  notes text
);

alter table public.businesses enable row level security;

create policy "Owners can select their businesses"
  on public.businesses
  for select
  to authenticated
  using (owner_id = (select auth.uid()));

create policy "Owners can insert their businesses"
  on public.businesses
  for insert
  to authenticated
  with check (owner_id = (select auth.uid()));

create policy "Owners can update their businesses"
  on public.businesses
  for update
  to authenticated
  using (owner_id = (select auth.uid()))
  with check (owner_id = (select auth.uid()));

create policy "Owners can delete their businesses"
  on public.businesses
  for delete
  to authenticated
  using (owner_id = (select auth.uid()));

revoke all on table public.businesses from anon, authenticated;
grant select, insert, update, delete on table public.businesses to authenticated;
