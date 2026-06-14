-- ============================================================
-- Alpine Manager Portal — Schema, RLS, Grants
-- Migration 018 · 2026-05-19
-- Idempotent: safe to run multiple times (IF NOT EXISTS / OR REPLACE)
-- ============================================================

CREATE SCHEMA IF NOT EXISTS manager;

-- ── manager.firms ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS manager.firms (
  id              UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            TEXT         NOT NULL UNIQUE,
  name            TEXT         NOT NULL,
  hq              TEXT,
  founded         INT,
  aum_value       NUMERIC(20, 2),
  aum_currency    TEXT         NOT NULL DEFAULT 'USD',
  aum_as_of       DATE,
  aum_qualifier   TEXT,
  strategy        TEXT,
  domicile        TEXT,
  created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ── manager.users ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS manager.users (
  id              UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id         UUID         NOT NULL REFERENCES manager.firms(id) ON DELETE CASCADE,
  email           TEXT         NOT NULL UNIQUE,
  full_name       TEXT,
  role            TEXT         NOT NULL DEFAULT 'member',
  invited_by      TEXT,
  created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  last_login_at   TIMESTAMPTZ
);

-- ── manager.invites ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS manager.invites (
  id                UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  token_hash        TEXT         NOT NULL UNIQUE,
  email             TEXT         NOT NULL,
  firm_name_hint    TEXT,
  invited_by        TEXT         NOT NULL,
  invited_by_role   TEXT         NOT NULL DEFAULT 'allocator',
  allocator_ref     TEXT,
  status            TEXT         NOT NULL DEFAULT 'pending',
  expires_at        TIMESTAMPTZ  NOT NULL,
  accepted_at       TIMESTAMPTZ,
  accepted_firm_id  UUID         REFERENCES manager.firms(id),
  created_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ── manager.magic_links ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS manager.magic_links (
  id            UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT         NOT NULL,
  token_hash    TEXT         NOT NULL UNIQUE,
  expires_at    TIMESTAMPTZ  NOT NULL,
  consumed_at   TIMESTAMPTZ,
  ip_address    INET,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_magic_links_email ON manager.magic_links (email, created_at DESC);

-- ── manager.ddq_responses ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS manager.ddq_responses (
  id                 UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id            UUID         NOT NULL REFERENCES manager.firms(id) ON DELETE CASCADE,
  framework_version  TEXT         NOT NULL DEFAULT 'v1.2026.05',
  chapter_num        SMALLINT     NOT NULL CHECK (chapter_num BETWEEN 1 AND 8),
  question_id        TEXT         NOT NULL,
  answer_kind        TEXT         NOT NULL DEFAULT 'text',
  answer_text        TEXT,
  answer_choice      TEXT,
  answer_json        JSONB,
  not_applicable     BOOLEAN      NOT NULL DEFAULT FALSE,
  na_explanation     TEXT,
  status             TEXT         NOT NULL DEFAULT 'draft',
  updated_at         TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_by         UUID         REFERENCES manager.users(id),
  UNIQUE (firm_id, framework_version, question_id)
);
CREATE INDEX IF NOT EXISTS idx_ddq_responses_firm_chapter
  ON manager.ddq_responses (firm_id, chapter_num);

-- ── manager.documents ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS manager.documents (
  id            UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id       UUID         NOT NULL REFERENCES manager.firms(id) ON DELETE CASCADE,
  chapter_num   SMALLINT     CHECK (chapter_num BETWEEN 1 AND 8),
  filename      TEXT         NOT NULL,
  file_size     BIGINT,
  storage_path  TEXT         NOT NULL,
  uploaded_by   UUID         REFERENCES manager.users(id),
  uploaded_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  deleted_at    TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_documents_firm_chapter
  ON manager.documents (firm_id, chapter_num)
  WHERE deleted_at IS NULL;

-- ── manager.ddq_snapshots ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS manager.ddq_snapshots (
  id                  UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id             UUID         NOT NULL REFERENCES manager.firms(id) ON DELETE CASCADE,
  taken_at            TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  framework_version   TEXT         NOT NULL,
  responses_jsonb     JSONB        NOT NULL,
  documents_manifest  JSONB        NOT NULL
);

-- ── manager.share_links ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS manager.share_links (
  id                  UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id             UUID         NOT NULL REFERENCES manager.firms(id) ON DELETE CASCADE,
  token_hash          TEXT         NOT NULL UNIQUE,
  created_by          UUID         NOT NULL REFERENCES manager.users(id),
  recipient_email     TEXT,
  label               TEXT,
  expires_at          TIMESTAMPTZ  NOT NULL DEFAULT (NOW() + INTERVAL '90 days'),
  revoked_at          TIMESTAMPTZ,
  pinned_snapshot_id  UUID         REFERENCES manager.ddq_snapshots(id),
  view_count          INT          NOT NULL DEFAULT 0,
  last_viewed_at      TIMESTAMPTZ,
  created_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_share_links_firm ON manager.share_links (firm_id, created_at DESC);

-- ── manager.share_link_views ──────────────────────────────────
CREATE TABLE IF NOT EXISTS manager.share_link_views (
  id          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id     UUID         NOT NULL REFERENCES manager.share_links(id) ON DELETE CASCADE,
  ip_hash     TEXT,
  user_agent  TEXT,
  viewed_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_share_link_views_link
  ON manager.share_link_views (link_id, viewed_at DESC);

-- ── Triggers ──────────────────────────────────────────────────
DROP TRIGGER IF EXISTS manager_firms_updated_at ON manager.firms;
CREATE TRIGGER manager_firms_updated_at BEFORE UPDATE ON manager.firms
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS manager_ddq_responses_updated_at ON manager.ddq_responses;
CREATE TRIGGER manager_ddq_responses_updated_at BEFORE UPDATE ON manager.ddq_responses
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ── RLS ───────────────────────────────────────────────────────
ALTER TABLE manager.firms              ENABLE ROW LEVEL SECURITY;
ALTER TABLE manager.users              ENABLE ROW LEVEL SECURITY;
ALTER TABLE manager.invites            ENABLE ROW LEVEL SECURITY;
ALTER TABLE manager.magic_links        ENABLE ROW LEVEL SECURITY;
ALTER TABLE manager.ddq_responses      ENABLE ROW LEVEL SECURITY;
ALTER TABLE manager.documents          ENABLE ROW LEVEL SECURITY;
ALTER TABLE manager.ddq_snapshots      ENABLE ROW LEVEL SECURITY;
ALTER TABLE manager.share_links        ENABLE ROW LEVEL SECURITY;
ALTER TABLE manager.share_link_views   ENABLE ROW LEVEL SECURITY;

-- Helper: return firm_id from session (set by route handler via SET LOCAL)
CREATE OR REPLACE FUNCTION manager.current_firm_id() RETURNS UUID AS $$
  SELECT NULLIF(current_setting('app.firm_id', true), '')::uuid;
$$ LANGUAGE SQL STABLE;

-- Policies: firm-scoped read/write
DROP POLICY IF EXISTS firm_isolation ON manager.firms;
CREATE POLICY firm_isolation ON manager.firms
  USING (id = manager.current_firm_id());

DROP POLICY IF EXISTS firm_isolation ON manager.users;
CREATE POLICY firm_isolation ON manager.users
  USING (firm_id = manager.current_firm_id());

DROP POLICY IF EXISTS firm_isolation ON manager.ddq_responses;
CREATE POLICY firm_isolation ON manager.ddq_responses
  USING (firm_id = manager.current_firm_id());

DROP POLICY IF EXISTS firm_isolation ON manager.documents;
CREATE POLICY firm_isolation ON manager.documents
  USING (firm_id = manager.current_firm_id());

DROP POLICY IF EXISTS firm_isolation ON manager.ddq_snapshots;
CREATE POLICY firm_isolation ON manager.ddq_snapshots
  USING (firm_id = manager.current_firm_id());

DROP POLICY IF EXISTS firm_isolation ON manager.share_links;
CREATE POLICY firm_isolation ON manager.share_links
  USING (firm_id = manager.current_firm_id());

DROP POLICY IF EXISTS firm_isolation ON manager.share_link_views;
CREATE POLICY firm_isolation ON manager.share_link_views
  USING (link_id IN (
    SELECT id FROM manager.share_links
    WHERE firm_id = manager.current_firm_id()
  ));

-- magic_links and invites have no firm_id scope (pre-firm); access only via
-- service-role queries in route handlers.

-- ── Grants ────────────────────────────────────────────────────
REVOKE ALL ON SCHEMA manager FROM PUBLIC;
GRANT USAGE ON SCHEMA manager TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA manager TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA manager TO authenticated;

-- Future tables in this schema get the same grant by default
ALTER DEFAULT PRIVILEGES IN SCHEMA manager
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA manager
  GRANT USAGE ON SEQUENCES TO authenticated;
