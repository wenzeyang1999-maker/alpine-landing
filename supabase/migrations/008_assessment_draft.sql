CREATE TABLE IF NOT EXISTS assessment_draft_edits (
  review_slug TEXT NOT NULL,
  intro1      TEXT NOT NULL DEFAULT '',
  intro2      TEXT NOT NULL DEFAULT '',
  notes       TEXT NOT NULL DEFAULT '',
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (review_slug)
);
