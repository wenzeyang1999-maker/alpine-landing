/**
 * Outputs ready-to-run SQL to create a verified demo manager account.
 * Paste the output into Supabase SQL Editor and run it there.
 *
 * Usage: node scripts/seed-manager-demo.mjs
 */

import { scryptSync, randomBytes } from "crypto";

const DEMO_EMAIL    = "demo@alpinedd.com";
const DEMO_PASSWORD = "Alpine2026!";
const DEMO_NAME     = "Alpine Demo";
const FIRM_NAME     = "Alpine Demo Firm";
const FIRM_SLUG     = "alpine-demo-firm";

// Must match lib/manager/password.ts constants
const SCRYPT_KEYLEN = 64;
const SCRYPT_OPTS   = { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };

const salt = randomBytes(16);
const hash = scryptSync(DEMO_PASSWORD, salt, SCRYPT_KEYLEN, SCRYPT_OPTS);
const passwordHash = `${salt.toString("hex")}:${hash.toString("hex")}`;

const sql = `
-- ── Demo manager account seed ─────────────────────────────────
-- Paste into Supabase SQL Editor and click Run.
-- Email: ${DEMO_EMAIL}  |  Password: ${DEMO_PASSWORD}

DO $$
DECLARE
  v_firm_id UUID;
BEGIN
  -- Upsert firm
  INSERT INTO manager.firms (name, slug)
  VALUES ('${FIRM_NAME}', '${FIRM_SLUG}')
  ON CONFLICT (slug) DO NOTHING;

  SELECT id INTO v_firm_id FROM manager.firms WHERE slug = '${FIRM_SLUG}';

  -- Upsert user
  INSERT INTO manager.users (
    firm_id, email, full_name, role,
    password_hash, password_set_at,
    is_verified, verified_at, verified_by
  )
  VALUES (
    v_firm_id,
    '${DEMO_EMAIL}',
    '${DEMO_NAME}',
    'owner',
    '${passwordHash}',
    NOW(),
    TRUE, NOW(), 'seed-script'
  )
  ON CONFLICT (email) DO UPDATE SET
    password_hash   = EXCLUDED.password_hash,
    password_set_at = EXCLUDED.password_set_at,
    is_verified     = TRUE,
    verified_at     = NOW(),
    verified_by     = 'seed-script';

  RAISE NOTICE 'Done. Login: ${DEMO_EMAIL} / ${DEMO_PASSWORD}';
END $$;
`;

console.log(sql);
