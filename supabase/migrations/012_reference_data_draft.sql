CREATE TABLE IF NOT EXISTS reference_data_draft (
  review_slug TEXT NOT NULL,
  values      JSONB NOT NULL DEFAULT '{}',
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (review_slug)
);
