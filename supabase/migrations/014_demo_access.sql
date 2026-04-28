-- Controls whether a real user can access the demo interface (/portfolio2).
-- Default FALSE — flip to TRUE manually in Supabase for approved users.
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS demo_access BOOLEAN NOT NULL DEFAULT FALSE;
