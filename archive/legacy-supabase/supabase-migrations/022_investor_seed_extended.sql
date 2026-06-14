-- ============================================================
-- Investor Portal — extended seed
-- Publishes Granite VII (Credit) + Cordova JV III (Real Estate) and
-- assigns both to the demo investor (demo@alpinedd.com).
-- Idempotent: safe to run multiple times.
-- ============================================================

INSERT INTO report_publications (report_slug, fund_name, published_by)
VALUES
  ('granite-vii-credit', 'Granite VII Credit Partners, L.P.',         'seed'),
  ('cordova-jv-iii',     'Cordova JV Real Estate Fund III, L.P.',     'seed')
ON CONFLICT (report_slug) DO NOTHING;

INSERT INTO investor_reports (investor_id, report_slug, assigned_by)
SELECT a.id, s.slug, 'seed'
FROM investors a
CROSS JOIN (VALUES ('granite-vii-credit'), ('cordova-jv-iii')) AS s(slug)
WHERE a.email = 'demo@alpinedd.com'
ON CONFLICT (investor_id, report_slug) DO NOTHING;
