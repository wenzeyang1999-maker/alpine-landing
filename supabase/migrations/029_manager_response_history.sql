-- ============================================================
-- Alpine Manager Portal — Response audit history
-- Migration 029 · 2026-05-29
--
-- Records every change to a DDQ answer: who, when, what.
-- Only written when the value actually changes (checked in API).
-- Idempotent.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.manager_response_history (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id           UUID        NOT NULL,
  question_id       TEXT        NOT NULL,
  chapter_num       INT         NOT NULL,
  answer_text       TEXT,
  answer_choice     TEXT,
  answer_multi      TEXT[],
  uploaded_filename TEXT,
  changed_by_email  TEXT        NOT NULL,
  changed_by_name   TEXT,
  changed_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mrh_question
  ON public.manager_response_history (firm_id, question_id, changed_at DESC);
