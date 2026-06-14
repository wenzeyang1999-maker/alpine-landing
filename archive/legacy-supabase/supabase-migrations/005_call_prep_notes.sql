-- ============================================================
-- Alpine Demo — Call Prep Notes
-- Idempotent: safe to run multiple times
-- ============================================================

CREATE TABLE IF NOT EXISTS call_prep_notes (
  review_slug   TEXT        NOT NULL,
  note_key      TEXT        NOT NULL,
  content       TEXT        NOT NULL DEFAULT '',
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (review_slug, note_key)
);

CREATE INDEX IF NOT EXISTS idx_call_prep_notes_slug
  ON call_prep_notes (review_slug);
