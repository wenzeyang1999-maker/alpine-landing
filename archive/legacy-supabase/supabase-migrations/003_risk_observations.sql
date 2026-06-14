-- ============================================================
-- Alpine Demo — Editable Risk Observation Overrides
-- Idempotent: safe to run multiple times
-- ============================================================

CREATE TABLE IF NOT EXISTS risk_observation_edits (
  id           TEXT        NOT NULL,
  review_slug  TEXT        NOT NULL,
  severity     TEXT        NOT NULL,
  title        TEXT        NOT NULL,
  detail       TEXT        NOT NULL DEFAULT '',
  remediation  TEXT        NOT NULL DEFAULT '',
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id, review_slug)
);

CREATE INDEX IF NOT EXISTS idx_risk_obs_edits_slug
  ON risk_observation_edits (review_slug);
