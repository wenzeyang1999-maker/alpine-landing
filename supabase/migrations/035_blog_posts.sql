-- Blog posts — managed via /blog-admin, displayed on landing page.
-- Replaces the hardcoded POSTS array in components/Blog.tsx.

CREATE TABLE IF NOT EXISTS blog_posts (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  url           TEXT        NOT NULL UNIQUE,
  title         TEXT        NOT NULL,
  excerpt       TEXT        NOT NULL,
  source        TEXT        NOT NULL DEFAULT 'Founder Activity',
  og_image      TEXT,
  is_featured   BOOLEAN     NOT NULL DEFAULT FALSE,
  is_visible    BOOLEAN     NOT NULL DEFAULT TRUE,
  published_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_blog_posts_visible_published
  ON blog_posts (is_visible, published_at DESC);

-- Seed with existing hardcoded posts
INSERT INTO blog_posts (url, title, excerpt, source, og_image, is_featured, published_at) VALUES
(
  'https://www.linkedin.com/feed/update/urn:li:activity:7450574333204135936/',
  'Emerging managers lose LP mandates not because of weak performance — but because their operations don''t hold up',
  'Acephalt powers deal intelligence for VC funds. Alpine powers LP readiness through institutional-grade operational due diligence. Together, we cover the full diligence stack for VCs — from sourcing to institutional close. Co-publishing: The LP Readiness Gap: Why Emerging VCs Stall at the Diligence Stage.',
  'Partnership Announcement',
  '/blog-acephalt.jpg',
  TRUE,
  now() - interval '14 days'
),
(
  'https://www.linkedin.com/posts/kaishen-allen-zhang_operationalduediligence-institutionalinvesting-activity-7448450921853837312-iTKB',
  'What recent ODD failures reveal about allocator blind spots',
  'Allen''s recent activity focuses on how operational failures can compound into multi-billion-dollar investor and counterparty losses, and why allocators need to treat ODD as loss prevention rather than box-checking.',
  'Founder Activity',
  NULL,
  FALSE,
  now() - interval '21 days'
),
(
  'https://www.linkedin.com/posts/kaishen-allen-zhang_duediligence-operationalduediligence-odd-activity-7447280645858353154-gssz',
  'In ODD, who sent the document is not the same as who authored it',
  'A recent post digs into chain-of-custody and source-of-truth questions, making the case that operational diligence should distinguish between distribution channels and true document ownership.',
  'Founder Activity',
  NULL,
  FALSE,
  now() - interval '28 days'
)
ON CONFLICT (url) DO NOTHING;

-- Eva Yang — Carta Toronto Tech Week post
INSERT INTO blog_posts (url, title, excerpt, source, og_image, is_featured, published_at) VALUES
(
  'https://www.linkedin.com/posts/evaayang_spent-thursday-evening-at-cartas-new-toronto-ugcPost-7466943503160225793-oVEk/',
  'Spent Thursday evening at Carta''s new Toronto office for Toronto Tech Week engineering talks',
  'As someone building an AI-native ODD engine, two talks stood out: Carta''s Customer Data Warehouse — centralizing multi-product data with agentic AI — and their session on transforming unstructured documents into production-grade data products. The gap between what an LLM can read and what can support an investment decision is where most of the hard work happens.',
  'Founder Activity',
  'https://media.licdn.com/dms/image/v2/D4E22AQFQB_iZ2djKcw/feedshare-shrink_800/B4EZ5_pisfJ0Ag-/0/1780258057251?e=2147483647&v=beta&t=LlQXOR-dB_u_8eQ8KfRVc3YpWrze1g7LPqPkuidELfQ',
  FALSE,
  now() - interval '7 days'
)
ON CONFLICT (url) DO NOTHING;
