-- Cache extracted PDF text for secure-portal documents so passage matching
-- parses each file once instead of on every source-dot click (the in-memory
-- cache died on every container restart). Mirrors manager_uploads.text_content.
-- Idempotent; safe to re-run.

ALTER TABLE public.portal_documents ADD COLUMN IF NOT EXISTS text_content text;
ALTER TABLE public.portal_documents ADD COLUMN IF NOT EXISTS text_extracted_at timestamptz;
