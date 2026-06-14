CREATE TABLE IF NOT EXISTS reference_data_sources (
  review_slug TEXT NOT NULL,
  sources     JSONB NOT NULL DEFAULT '{}',
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (review_slug)
);
