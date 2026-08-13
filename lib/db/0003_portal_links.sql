-- Explicit, auditable association between a manager firm and the customer
-- record that owns a secure upload portal.
--
-- Replaces inferring portal ownership from a manager's login email matching
-- customers.email. Email matches now create a `pending` suggestion that grants
-- no access; an Alpine admin approves it, and revocation is a first-class
-- state rather than an absent concept.
--
-- Idempotent; safe to re-run.

CREATE TABLE IF NOT EXISTS public.portal_links (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id       uuid NOT NULL,
  customer_id   uuid NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  status        text NOT NULL DEFAULT 'pending',
  suggested_by  text,
  approved_by   text,
  approved_at   timestamptz,
  revoked_by    text,
  revoked_at    timestamptz,
  created_at    timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT portal_links_status_check CHECK (status IN ('pending', 'approved', 'revoked'))
);

-- One live suggestion or approval per (firm, customer) pair; revoked rows are
-- kept as history and deliberately excluded from the constraint.
CREATE UNIQUE INDEX IF NOT EXISTS portal_links_firm_customer_live_key
  ON public.portal_links (firm_id, customer_id)
  WHERE status <> 'revoked';

-- A customer's portal may be approved to at most one firm at a time.
CREATE UNIQUE INDEX IF NOT EXISTS portal_links_customer_approved_key
  ON public.portal_links (customer_id)
  WHERE status = 'approved';

CREATE INDEX IF NOT EXISTS portal_links_firm_status_idx
  ON public.portal_links (firm_id, status);

CREATE INDEX IF NOT EXISTS portal_links_status_idx
  ON public.portal_links (status);

-- Backfill: every firm that already carries a portal_token got it from the
-- old inference path. Grandfather those as approved so live linkages keep
-- working, attributed so the provenance is visible in the audit trail.
INSERT INTO public.portal_links (firm_id, customer_id, status, approved_by, approved_at)
SELECT f.id, c.id, 'approved', 'migration-0003-backfill', now()
FROM manager.firms f
JOIN public.customers c ON c.portal_token = f.portal_token
WHERE f.portal_token IS NOT NULL
ON CONFLICT DO NOTHING;
