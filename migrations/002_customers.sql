-- Migration 002: customers
-- A persistent record of every customer/fund Alpine has onboarded, regardless of whether
-- they have uploaded documents yet. portal_token is the link to portal_documents.
-- Idempotent.

create table if not exists public.customers (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,                            -- customer or contact name
  email           text,
  organization    text,
  portal_token    text unique,                              -- maps to portal_documents.token
  fund_name       text,
  plan            text not null default 'starter',          -- starter / pro / enterprise / custom
  status          text not null default 'active',           -- active / paused / churned
  notes           text,                                     -- internal Alpine notes
  onboarded_by    text,                                     -- email of admin who created this customer
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists customers_portal_token_idx on public.customers (portal_token);
create index if not exists customers_status_idx       on public.customers (status);
create index if not exists customers_email_idx        on public.customers (email);
create index if not exists customers_created_at_idx   on public.customers (created_at desc);

-- Keep updated_at fresh on UPDATE
create or replace function public.customers_set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists customers_set_updated_at on public.customers;
create trigger customers_set_updated_at
  before update on public.customers
  for each row execute function public.customers_set_updated_at();

alter table public.customers enable row level security;
-- No policies → service_role only.
