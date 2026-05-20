-- ============================================================
-- Allocator Portal — schema
-- Institutional investors (allocators) log in at alpinedd.com/login and
-- read their finished ODD report. Fully separate from the analyst surface.
-- Idempotent: safe to run multiple times.
-- ============================================================

-- ── Allocators ───────────────────────────────────────────────
-- Allocator accounts. Distinct from the analyst `users` table — these
-- credentials never grant access to app.alpinedd.com.
CREATE TABLE IF NOT EXISTS allocators (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT        NOT NULL UNIQUE,
  password_hash TEXT        NOT NULL,
  full_name     TEXT,
  organization  TEXT,
  is_active     BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_login    TIMESTAMPTZ
);

-- ── Report publications ──────────────────────────────────────
-- Presence of a row = the report is published to the allocator surface.
-- `report_slug` has no FK: reports live in the code registry
-- (lib/allocator/report-registry.ts), not a DB table. Publish/assign
-- endpoints validate the slug against the registry before insert.
CREATE TABLE IF NOT EXISTS report_publications (
  report_slug  TEXT        PRIMARY KEY,
  fund_name    TEXT,
  published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  published_by TEXT
);

-- ── Allocator ↔ report assignments ───────────────────────────
-- Which allocators may read which reports. An allocator sees a report only
-- if it is BOTH published AND assigned to them.
CREATE TABLE IF NOT EXISTS allocator_reports (
  allocator_id UUID        NOT NULL REFERENCES allocators(id) ON DELETE CASCADE,
  report_slug  TEXT        NOT NULL,
  assigned_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  assigned_by  TEXT,
  PRIMARY KEY (allocator_id, report_slug)
);

-- ── Allocator-uploaded documents ─────────────────────────────
-- Documents an allocator uploads against a report. Analysts review these in
-- the admin panel and "incorporate" them (status pending -> processed).
CREATE TABLE IF NOT EXISTS allocator_documents (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  allocator_id UUID        NOT NULL REFERENCES allocators(id) ON DELETE CASCADE,
  report_slug  TEXT        NOT NULL,
  filename     TEXT        NOT NULL,
  file_size    BIGINT,
  storage_path TEXT,
  status       TEXT        NOT NULL DEFAULT 'pending'
                           CHECK (status IN ('pending', 'processed')),
  processed_at TIMESTAMPTZ,
  processed_by TEXT,
  uploaded_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_allocator_documents_allocator_slug
  ON allocator_documents (allocator_id, report_slug);
