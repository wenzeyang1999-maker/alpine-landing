-- Manager document uploads
CREATE TABLE IF NOT EXISTS manager.documents (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id       UUID NOT NULL REFERENCES manager.firms(id) ON DELETE CASCADE,
  uploaded_by   UUID NOT NULL REFERENCES manager.users(id),
  filename      TEXT NOT NULL,
  storage_path  TEXT NOT NULL UNIQUE,
  file_size     BIGINT,
  mime_type     TEXT,
  uploaded_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS manager_documents_firm_date
  ON manager.documents(firm_id, uploaded_at DESC);
