create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references public.businesses (id) not null,
  client_id uuid references public.clients (id) not null,
  created_at timestamptz default now(),
  -- Matches a services[].id in businesses.storefront_config.
  service_id text not null,
  -- Snapshots keep a past appointment's name, price and duration
  -- as booked, even after the service menu changes.
  service_name_snapshot text not null,
  price_cents_snapshot integer not null,
  duration_minutes_snapshot integer not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status text not null default 'scheduled'
    check (status in ('scheduled', 'completed', 'cancelled', 'late_cancelled', 'no_show')),
  location_address text,
  client_notes text,
  internal_notes text,
  stripe_payment_intent_id text
);

create index appointments_business_id_starts_at_idx
  on public.appointments (business_id, starts_at);
create index appointments_client_id_idx on public.appointments (client_id);

alter table public.appointments enable row level security;

create policy "Owners can select their appointments"
  on public.appointments
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.businesses b
      where b.id = appointments.business_id
        and b.owner_id = (select auth.uid())
    )
  );

create policy "Owners can insert their appointments"
  on public.appointments
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.businesses b
      where b.id = appointments.business_id
        and b.owner_id = (select auth.uid())
    )
    and exists (
      select 1
      from public.clients c
      where c.id = appointments.client_id
        and c.business_id = appointments.business_id
    )
  );

create policy "Owners can update their appointments"
  on public.appointments
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.businesses b
      where b.id = appointments.business_id
        and b.owner_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1
      from public.businesses b
      where b.id = appointments.business_id
        and b.owner_id = (select auth.uid())
    )
    and exists (
      select 1
      from public.clients c
      where c.id = appointments.client_id
        and c.business_id = appointments.business_id
    )
  );

create policy "Owners can delete their appointments"
  on public.appointments
  for delete
  to authenticated
  using (
    exists (
      select 1
      from public.businesses b
      where b.id = appointments.business_id
        and b.owner_id = (select auth.uid())
    )
  );

revoke all on table public.appointments from anon, authenticated;
grant select, insert, update, delete on table public.appointments to authenticated;
