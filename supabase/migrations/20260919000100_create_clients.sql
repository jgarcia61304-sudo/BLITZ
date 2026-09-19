create table public.clients (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references public.businesses (id) not null,
  created_at timestamptz default now(),
  full_name text not null,
  phone text,
  email text,
  address_line1 text,
  address_line2 text,
  city text,
  state text,
  postal_code text,
  stripe_customer_id text,
  notes text,
  last_visit_at timestamptz
);

create index clients_business_id_idx on public.clients (business_id);

alter table public.clients enable row level security;

create policy "Owners can select their clients"
  on public.clients
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.businesses b
      where b.id = clients.business_id
        and b.owner_id = (select auth.uid())
    )
  );

create policy "Owners can insert their clients"
  on public.clients
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.businesses b
      where b.id = clients.business_id
        and b.owner_id = (select auth.uid())
    )
  );

create policy "Owners can update their clients"
  on public.clients
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.businesses b
      where b.id = clients.business_id
        and b.owner_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1
      from public.businesses b
      where b.id = clients.business_id
        and b.owner_id = (select auth.uid())
    )
  );

create policy "Owners can delete their clients"
  on public.clients
  for delete
  to authenticated
  using (
    exists (
      select 1
      from public.businesses b
      where b.id = clients.business_id
        and b.owner_id = (select auth.uid())
    )
  );

revoke all on table public.clients from anon, authenticated;
grant select, insert, update, delete on table public.clients to authenticated;
