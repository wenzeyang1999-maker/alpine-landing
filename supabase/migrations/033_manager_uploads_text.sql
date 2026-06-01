-- ============================================================
-- Alpine Manager Portal — PDF text content cache
-- Migration 033 · 2026-05-31
--
-- Stores extracted plain text from uploaded PDFs so the
-- match API can search without re-downloading on every call.
-- NULL means not yet extracted (lazy: extracted on first match).
-- ============================================================

ALTER TABLE public.manager_uploads
  ADD COLUMN IF NOT EXISTS text_content TEXT,
  ADD COLUMN IF NOT EXISTS text_extracted_at TIMESTAMPTZ;
