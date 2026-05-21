-- ============================================================
-- Investor Portal — full seed (3 remaining funds)
-- Publishes Blackpine (Credit), Havencrest (Industrial RE), Ridgeline Resort III (Hospitality RE)
-- and assigns all three to the demo investor (demo@alpinedd.com).
-- Idempotent: safe to run multiple times.
-- ============================================================

INSERT INTO report_publications (report_slug, fund_name, published_by)
VALUES
  ('blackpine-credit-iv',      'Blackpine Credit Plus IV, L.P.',          'seed'),
  ('havencrest-industrial-v',  'Havencrest Industrial Trust V, L.P.',     'seed'),
  ('ridgeline-resort-iii',     'Ridgeline Resort Holdings III, L.P.',     'seed')
ON CONFLICT (report_slug) DO NOTHING;

INSERT INTO investor_reports (investor_id, report_slug, assigned_by)
SELECT a.id, s.slug, 'seed'
FROM investors a
CROSS JOIN (VALUES
  ('blackpine-credit-iv'),
  ('havencrest-industrial-v'),
  ('ridgeline-resort-iii')
) AS s(slug)
WHERE a.email = 'demo@alpinedd.com'
ON CONFLICT (investor_id, report_slug) DO NOTHING;
