-- Newsletter subscribers — source of truth on Supabase, optionally synced to Resend Audience.
-- Used by /api/subscribe (POST) from the landing page Subscribe band, navbar, and contact page.

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  email           TEXT PRIMARY KEY,
  source          TEXT NOT NULL DEFAULT 'landing',  -- 'landing' | 'navbar' | 'contact' | 'footer'
  resend_contact_id TEXT,                           -- populated when sync to Resend succeeds
  resend_synced_at  TIMESTAMPTZ,
  unsubscribed_at TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_created_at
  ON newsletter_subscribers (created_at DESC);
