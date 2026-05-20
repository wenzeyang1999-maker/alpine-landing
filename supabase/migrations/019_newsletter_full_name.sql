-- Collect subscriber name for personalized confirmation emails and admin notifications.
ALTER TABLE newsletter_subscribers
  ADD COLUMN IF NOT EXISTS full_name TEXT;
