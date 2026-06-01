-- ============================================================
-- Alpine Manager Portal — AI draft run quota
-- Migration 034 · 2026-05-31
--
-- Tracks how many times a firm has triggered AI draft generation.
-- Shared across all team members of the same firm.
-- Idempotent.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.manager_ai_quota (
  firm_id    TEXT        PRIMARY KEY,
  runs_used  INT         NOT NULL DEFAULT 0,
  max_runs   INT         NOT NULL DEFAULT 20,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Atomic increment function — returns new runs_used, or -1 if limit reached
CREATE OR REPLACE FUNCTION public.increment_ai_quota(p_firm_id TEXT)
RETURNS INT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_used INT;
  v_max  INT;
BEGIN
  -- Upsert row for firm
  INSERT INTO public.manager_ai_quota (firm_id, runs_used, max_runs, updated_at)
  VALUES (p_firm_id, 0, 20, NOW())
  ON CONFLICT (firm_id) DO NOTHING;

  -- Read current
  SELECT runs_used, max_runs INTO v_used, v_max
  FROM public.manager_ai_quota
  WHERE firm_id = p_firm_id
  FOR UPDATE;

  IF v_used >= v_max THEN
    RETURN -1;
  END IF;

  -- Increment
  UPDATE public.manager_ai_quota
  SET runs_used = runs_used + 1, updated_at = NOW()
  WHERE firm_id = p_firm_id;

  RETURN v_used + 1;
END;
$$;

GRANT EXECUTE ON FUNCTION public.increment_ai_quota(TEXT) TO service_role;
