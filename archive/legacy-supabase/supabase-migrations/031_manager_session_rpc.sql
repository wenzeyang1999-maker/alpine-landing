-- ============================================================
-- Alpine Manager Portal — get_manager_session RPC
-- Migration 031 · 2026-05-31
--
-- Provides a single function callable by the service-role client
-- that bypasses PostgREST's cached schema view of manager.users.
--
-- Used by:
--   app/api/manager/auth/login/route.ts
--   lib/manager/access.ts
--
-- Prerequisite: 018 (manager schema), 024 (password columns),
--   025 (is_verified / job_title), 026 (team invites → role).
-- Idempotent: CREATE OR REPLACE.
-- ============================================================

CREATE OR REPLACE FUNCTION public.get_manager_session(p_email TEXT)
RETURNS TABLE (
  id            UUID,
  email         TEXT,
  password_hash TEXT,
  is_verified   BOOLEAN,
  firm_id       UUID,
  full_name     TEXT,
  role          TEXT,
  job_title     TEXT,
  firm_name     TEXT
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = manager, public
AS $$
  SELECT
    u.id,
    u.email,
    u.password_hash,
    u.is_verified,
    u.firm_id,
    u.full_name,
    u.role,
    u.job_title,
    f.name AS firm_name
  FROM manager.users u
  JOIN manager.firms f ON f.id = u.firm_id
  WHERE u.email = LOWER(TRIM(p_email))
  LIMIT 1;
$$;

-- Allow the service-role (used by the API) to call this function.
GRANT EXECUTE ON FUNCTION public.get_manager_session(TEXT) TO service_role;
