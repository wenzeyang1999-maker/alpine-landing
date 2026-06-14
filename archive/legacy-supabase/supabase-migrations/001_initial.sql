-- ============================================================
-- Alpine Demo — Initial Schema
-- Idempotent: safe to run multiple times (IF NOT EXISTS / OR REPLACE)
-- ============================================================

-- ── Users ────────────────────────────────────────────────────
-- Mirrors the demo login (email + name).
-- user_email is the primary identifier (matches localStorage alpine_demo_user).
CREATE TABLE IF NOT EXISTS users (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  email       TEXT        NOT NULL UNIQUE,
  full_name   TEXT,
  role        TEXT        NOT NULL DEFAULT 'analyst',
  is_active   BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_login  TIMESTAMPTZ
);

-- ── Follow-up Notes ──────────────────────────────────────────
-- Stores interactive Round 2 state per user + review + sub-item.
-- key format: "{questionId}-{subItemIndex}"  e.g. "tfu-q6-0"
CREATE TABLE IF NOT EXISTS followup_notes (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email   TEXT        NOT NULL REFERENCES users(email) ON DELETE CASCADE,
  review_slug  TEXT        NOT NULL,
  question_key TEXT        NOT NULL,
  checked      BOOLEAN     NOT NULL DEFAULT FALSE,
  note         TEXT        NOT NULL DEFAULT '',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (user_email, review_slug, question_key)
);

-- Auto-update updated_at on any row change
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS followup_notes_updated_at ON followup_notes;
CREATE TRIGGER followup_notes_updated_at
  BEFORE UPDATE ON followup_notes
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── Indexes ──────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_followup_notes_user_slug
  ON followup_notes (user_email, review_slug);
