-- ============================================================
-- Alpine Demo — Portal Documents
-- Idempotent: safe to run multiple times
-- ============================================================

CREATE TABLE IF NOT EXISTS portal_documents (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  token        TEXT        NOT NULL,
  filename     TEXT        NOT NULL,
  file_size    BIGINT,
  storage_path TEXT,
  uploaded_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_portal_documents_token
  ON portal_documents (token, uploaded_at DESC);
