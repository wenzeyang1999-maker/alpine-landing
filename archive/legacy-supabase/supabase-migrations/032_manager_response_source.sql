-- ============================================================
-- Alpine Manager Portal — Answer source references
-- Migration 032 · 2026-05-31
--
-- Lets managers link each DDQ answer to an uploaded document
-- (from manager_uploads) and optionally paste a quote/excerpt.
--
-- Idempotent: ADD COLUMN IF NOT EXISTS.
-- ============================================================

ALTER TABLE public.manager_responses
  ADD COLUMN IF NOT EXISTS source_document_id UUID,
  ADD COLUMN IF NOT EXISTS source_quote        TEXT;
