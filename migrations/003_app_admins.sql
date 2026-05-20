-- Migration 003: app_admins
-- DB-tracked record of who has admin access to app.alpinedd.com.
-- NOTE: the runtime auth gate in middleware.ts ALSO has a hardcoded allowlist for safety
-- (middleware runs at Edge and cannot query Supabase synchronously). This table is the
-- source of truth for tracking + the admin UI; middleware's hardcoded list is the
-- enforcement layer. Keep them in sync when adding/removing admins.
-- Idempotent.

create table if not exists public.app_admins (
  email      text primary key,
  added_at   timestamptz not null default now(),
  added_by   text,                            -- email of admin who added them ('system' for seed)
  note       text                              -- e.g. "Founding admin", "On-call analyst"
);

create index if not exists app_admins_added_at_idx on public.app_admins (added_at desc);

-- Seed: current hardcoded allowlist members
insert into public.app_admins (email, added_by, note) values
  ('awen@alpinedd.com',   'system', 'Founding admin'),
  ('azhang@alpinedd.com', 'system', 'Founding admin'),
  ('zkaishen@gmail.com',  'system', 'Founding admin')
on conflict (email) do nothing;

alter table public.app_admins enable row level security;
-- No policies → service_role only.
