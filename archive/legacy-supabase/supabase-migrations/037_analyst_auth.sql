-- ============================================================
-- Analyst/admin self-hosted auth — move public.users off Supabase Auth.
-- Adds password + email-verification columns (mirrors manager.users), so the
-- analyst/admin login + signup can use scrypt + self-issued tokens instead of
-- Supabase Auth (GoTrue). Idempotent.
-- ============================================================

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS password_hash        TEXT,
  ADD COLUMN IF NOT EXISTS password_set_at      TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS is_verified          BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS verified_at          TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS verification_token   TEXT,
  ADD COLUMN IF NOT EXISTS verification_sent_at TIMESTAMPTZ;

-- One-time token (email verification on signup, or set-password on reset).
CREATE UNIQUE INDEX IF NOT EXISTS users_verification_token_key
  ON public.users (verification_token) WHERE verification_token IS NOT NULL;
