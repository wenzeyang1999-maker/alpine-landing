CREATE TABLE IF NOT EXISTS overview_draft_edits (
  review_slug TEXT NOT NULL,
  fields      JSONB NOT NULL DEFAULT '{}',
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (review_slug)
);
