-- ============================================================
-- Alpine Manager Portal — Add password authentication support
-- Migration 024 · 2026-05-24
--
-- The login page supports two flows:
--   1. Magic link  → uses manager.magic_links (created in 018)
--   2. Password    → uses these new columns on manager.users
--
-- Prerequisite: migration 018 must be applied first (creates manager schema).
-- Idempotent: safe to run multiple times.
-- ============================================================

ALTER TABLE manager.users
  ADD COLUMN IF NOT EXISTS password_hash       TEXT,
  ADD COLUMN IF NOT EXISTS password_set_at     TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS password_reset_token TEXT,
  ADD COLUMN IF NOT EXISTS password_reset_sent_at TIMESTAMPTZ;

-- Allow looking up users by password_reset_token (sparse index — only when set)
CREATE INDEX IF NOT EXISTS idx_manager_users_password_reset_token
  ON manager.users (password_reset_token)
  WHERE password_reset_token IS NOT NULL;
