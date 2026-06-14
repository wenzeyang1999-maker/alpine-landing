-- Add profile fields collected during signup
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS organization TEXT,
  ADD COLUMN IF NOT EXISTS user_type    TEXT,   -- asset_allocator | investment_manager | other
  ADD COLUMN IF NOT EXISTS job_title    TEXT,   -- filled when user_type = 'other'
  ADD COLUMN IF NOT EXISTS aum          TEXT;   -- Assets Under Management / Expected Capital Commitment
