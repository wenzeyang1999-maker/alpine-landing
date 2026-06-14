-- Hardening for newsletter_subscribers: RLS, double opt-in, unsubscribe tokens, consent metadata.

ALTER TABLE newsletter_subscribers
  ADD COLUMN IF NOT EXISTS confirmed_at       TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS confirm_token      TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS confirm_token_sent_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS unsubscribe_token  TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS consent_ip_hash    TEXT,
  ADD COLUMN IF NOT EXISTS consent_user_agent TEXT;

-- Restrict source values to a known set (existing rows pass since defaults are 'landing').
ALTER TABLE newsletter_subscribers
  DROP CONSTRAINT IF EXISTS source_check;
ALTER TABLE newsletter_subscribers
  ADD CONSTRAINT source_check CHECK (source IN ('landing','navbar','contact','footer','signup','early-access','demo'));

-- Defense-in-depth: enable RLS. With no policies, only the service-role bypass key can read/write.
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Useful indexes for token lookups.
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_confirm_token   ON newsletter_subscribers (confirm_token)   WHERE confirm_token IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_unsubscribe_token ON newsletter_subscribers (unsubscribe_token) WHERE unsubscribe_token IS NOT NULL;
