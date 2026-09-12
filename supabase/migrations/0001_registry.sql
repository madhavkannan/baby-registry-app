-- Baby Registry — shared checklist table.
-- Two-person app: no auth, RLS left open to the anon key on purpose
-- (unlisted deployment; nothing beyond registry items lives here). Same
-- pattern as the pregnancy-app's schema, added as new tables to that same
-- Supabase project.

create table registry_item (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  notes text,
  priority boolean not null default false,
  checked boolean not null default false,
  checked_at timestamptz,
  created_at timestamptz not null default now()
);

create table registry_meta (
  id int primary key default 1 check (id = 1), -- exactly one row
  title text not null default 'Baby Registry'
);

alter table registry_item enable row level security;
alter table registry_meta enable row level security;

create policy anon_all on registry_item for all using (true) with check (true);
create policy anon_all on registry_meta for all using (true) with check (true);
