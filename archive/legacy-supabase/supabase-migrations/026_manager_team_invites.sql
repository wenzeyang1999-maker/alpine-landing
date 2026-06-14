-- ============================================================
-- Alpine Manager Portal — Team invite links (manager → teammate)
-- Migration 026 · 2026-05-24
--
-- Separate from manager.invites (allocator → manager).
-- These are bookmark-style links with no per-use expiry:
--   * Owner generates a link for their team.
--   * Anyone with the link enters name + email + role to join.
--   * Invitees are auto-verified (is_verified=TRUE) on acceptance.
--
-- Prerequisite: 018 (manager schema).
-- Idempotent.
-- ============================================================

CREATE TABLE IF NOT EXISTS manager.team_invites (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id     UUID        NOT NULL REFERENCES manager.firms(id) ON DELETE CASCADE,
  token_hash  TEXT        NOT NULL UNIQUE,
  created_by  TEXT        NOT NULL,   -- email of the owner who generated it
  label       TEXT,                   -- optional e.g. "IR team"
  revoked_at  TIMESTAMPTZ,            -- null = active
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_team_invites_firm
  ON manager.team_invites (firm_id, created_at DESC);
