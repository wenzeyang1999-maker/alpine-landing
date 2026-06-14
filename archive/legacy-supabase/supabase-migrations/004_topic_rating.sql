-- ============================================================
-- Alpine Demo — Editable Topic Rating & Rationale
-- Idempotent: safe to run multiple times
-- ============================================================

CREATE TABLE IF NOT EXISTS topic_rating_edits (
  review_slug   TEXT        NOT NULL,
  topic_number  INT         NOT NULL,
  rating        TEXT        NOT NULL,
  rationale     TEXT        NOT NULL DEFAULT '',
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (review_slug, topic_number)
);

CREATE INDEX IF NOT EXISTS idx_topic_rating_slug
  ON topic_rating_edits (review_slug);
