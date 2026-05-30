-- ============================================================
-- Alpine Manager Portal — Per-question review status
-- Migration 030 · 2026-05-29
--
-- Adds review_status to manager_responses.
-- Values: NULL = unreviewed, 'flagged', 'reviewed'
-- Idempotent.
-- ============================================================

ALTER TABLE public.manager_responses
  ADD COLUMN IF NOT EXISTS review_status TEXT
  CHECK (review_status IN ('flagged', 'reviewed'));
