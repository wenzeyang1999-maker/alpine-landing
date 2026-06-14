-- ============================================================
-- Alpine Manager Portal — Team invite links (public schema)
-- Migration 028 · 2026-05-29
--
-- Replaces manager.team_invites (026) which had PostgREST
-- schema-cache issues. Public schema is stable.
-- Idempotent.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.manager_team_invites (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id     UUID        NOT NULL,
  token_hash  TEXT        NOT NULL UNIQUE,
  created_by  TEXT        NOT NULL,
  label       TEXT,
  revoked_at  TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_manager_team_invites_firm
  ON public.manager_team_invites (firm_id, created_at DESC);
