CREATE TABLE IF NOT EXISTS remediation_draft_edits (
  review_slug  TEXT NOT NULL,
  before_close JSONB NOT NULL DEFAULT '[]',
  post_close   JSONB NOT NULL DEFAULT '[]',
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (review_slug)
);
