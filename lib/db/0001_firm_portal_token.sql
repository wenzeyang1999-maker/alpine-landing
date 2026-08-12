-- Phase 3 portal linkage: a manager firm can claim its secure-upload-portal
-- token, making portal documents visible firm-wide (all team members), not
-- just to the user whose email matches customers.email.
-- Idempotent; safe to re-run.

ALTER TABLE manager.firms ADD COLUMN IF NOT EXISTS portal_token text;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'firms_portal_token_key'
  ) THEN
    ALTER TABLE manager.firms
      ADD CONSTRAINT firms_portal_token_key UNIQUE (portal_token);
  END IF;
END $$;
