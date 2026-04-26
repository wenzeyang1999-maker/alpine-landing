CREATE TABLE IF NOT EXISTS flag_draft_edits (
  review_slug TEXT NOT NULL,
  flags       JSONB NOT NULL DEFAULT '[]',
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (review_slug)
);
