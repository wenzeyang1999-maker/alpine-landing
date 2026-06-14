CREATE TABLE IF NOT EXISTS report_draft_edits (
  review_slug TEXT NOT NULL,
  content     TEXT NOT NULL DEFAULT '',
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (review_slug)
);
