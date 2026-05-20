-- ============================================================
-- Investor Portal — demo seed
-- Demo investor demo@alpinedd.com / demo123 (weak — demo only),
-- with the Aurora + Trellis reports published and assigned.
-- Note: this email also exists as the analyst demo account, but the two
-- credential stores are fully separate (investors table + investor_session
-- on the apex host vs the analyst allowlist + alpine_session on app.*).
-- Idempotent: safe to run multiple times.
--
-- The password_hash below is scrypt(demo123) computed with the params in
-- lib/investor/password.ts (N=16384, r=8, p=1, keylen=64, 16-byte salt).
-- ============================================================

INSERT INTO investors (email, password_hash, full_name, organization)
VALUES (
  'demo@alpinedd.com',
  '381db5c4e2f757cab0077293efc7f5e7:e1e294db070da7f6dd87642bd87aea772acf221ced73b00cc38530c906a5021e7f8e91015fff63f795686ae0b4939abffd70fa60e7e7d697e9ba5fec1dc5e091',
  'Demo Investor',
  'Demo Capital Partners'
)
ON CONFLICT (email) DO NOTHING;

INSERT INTO report_publications (report_slug, fund_name, published_by)
VALUES
  ('aurora-capital-iv',  'Aurora Ventures IV, L.P.',  'seed'),
  ('trellis-capital-iv', 'Trellis Capital IV, L.P.',  'seed')
ON CONFLICT (report_slug) DO NOTHING;

INSERT INTO investor_reports (investor_id, report_slug, assigned_by)
SELECT a.id, s.slug, 'seed'
FROM investors a
CROSS JOIN (VALUES ('aurora-capital-iv'), ('trellis-capital-iv')) AS s(slug)
WHERE a.email = 'demo@alpinedd.com'
ON CONFLICT (investor_id, report_slug) DO NOTHING;
