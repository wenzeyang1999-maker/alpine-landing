-- Controls whether a real user can access the demo interface (/portfolio2).
-- Default FALSE — flip to TRUE manually in Supabase for approved users.
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS demo_access BOOLEAN NOT NULL DEFAULT FALSE;

-- Seed the hardcoded demo account with demo access.
-- Run this after applying the column addition above.
INSERT INTO users (email, full_name, role, is_active, demo_access)
VALUES ('demo@alpinedd.com', 'Demo User', 'analyst', TRUE, TRUE)
ON CONFLICT (email) DO UPDATE SET demo_access = TRUE;

-- To grant demo access to any real user:
-- UPDATE users SET demo_access = TRUE WHERE email = 'someone@example.com';
