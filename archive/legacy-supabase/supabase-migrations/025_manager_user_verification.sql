-- ============================================================
-- Alpine Manager Portal — Owner verification + invitee job titles
-- Migration 025 · 2026-05-24
--
-- Adds columns supporting the two-tier access model:
--   * Owners (self-signup)   → is_verified=FALSE until Alpine reviews.
--   * Invitees (via invite)  → auto-verified at acceptance time.
--
-- All invitees record their job_title so the workspace can show roles
-- alongside names.
--
-- Prerequisite: 018 (manager schema) + 024 (password columns).
-- Idempotent.
-- ============================================================

ALTER TABLE manager.users
  ADD COLUMN IF NOT EXISTS is_verified  BOOLEAN     NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS verified_at  TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS verified_by  TEXT,
  ADD COLUMN IF NOT EXISTS job_title    TEXT;

-- Sparse index so the admin "pending review" query is cheap even at scale.
CREATE INDEX IF NOT EXISTS idx_manager_users_pending_verification
  ON manager.users (created_at DESC)
  WHERE is_verified = FALSE;
