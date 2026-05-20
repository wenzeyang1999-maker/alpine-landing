-- Migration 004: audit_log
-- Records every admin action (login, logout, broadcast send, onboard, admin
-- add/remove, request status change, subscriber confirm/unsubscribe) so the
-- team has a tamper-resistant trail for compliance and troubleshooting.
-- Idempotent.

create table if not exists public.audit_log (
  id          uuid primary key default gen_random_uuid(),
  actor_email text not null,                       -- admin who performed the action
  action      text not null,                       -- e.g. 'login', 'broadcast.send', 'admin.add'
  target      text,                                -- entity touched (token, email, request id…)
  meta        jsonb,                               -- arbitrary structured context (sent count, audience, etc.)
  created_at  timestamptz not null default now()
);

create index if not exists audit_log_created_at_idx on public.audit_log (created_at desc);
create index if not exists audit_log_actor_idx      on public.audit_log (actor_email);
create index if not exists audit_log_action_idx     on public.audit_log (action);

alter table public.audit_log enable row level security;
-- No policies → service_role only.
