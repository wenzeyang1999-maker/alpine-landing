-- Migration 001: early_access_requests
-- Persist /early-access form submissions so admin can see and triage a request pipeline.
-- Idempotent: safe to run multiple times.

create table if not exists public.early_access_requests (
  id            uuid primary key default gen_random_uuid(),
  full_name     text not null,
  email         text not null,
  organization  text,
  phone         text,
  message       text,
  source        text,                                      -- e.g. "early-access", "form/early-access", "contact"
  status        text not null default 'new',               -- new / contacted / converted / declined
  user_agent    text,
  created_at    timestamptz not null default now(),
  contacted_at  timestamptz,
  notes         text                                       -- internal Alpine notes (admin-only)
);

-- Common access patterns
create index if not exists early_access_requests_created_at_idx on public.early_access_requests (created_at desc);
create index if not exists early_access_requests_status_idx     on public.early_access_requests (status);
create index if not exists early_access_requests_email_idx      on public.early_access_requests (email);

-- Lock down (service_role bypasses RLS; this keeps anon/client out)
alter table public.early_access_requests enable row level security;

-- No policies defined → only service_role (used server-side) can read/write. Public anon cannot.
