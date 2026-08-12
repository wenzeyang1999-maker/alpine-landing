/**
 * Creates (or updates) the verified demo manager account.
 *
 * Print the SQL only:       node scripts/seed-manager-demo.mjs
 * Apply directly to the DB: DATABASE_URL=... node scripts/seed-manager-demo.mjs --apply
 *   (--apply runs the seed and then prints the firm/user rows to confirm)
 */

import { scryptSync, randomBytes } from "crypto";

const DEMO_EMAIL    = "demo@alpinedd.com";
const DEMO_PASSWORD = "Alpine2026!";
// Trellis Capital is the demo fund across the whole story: the analyst-side
// Document Request, the /portal/trellis upload portal, and this workspace all
// belong to the same firm. Slug must stay "trellis" — the manager Documents
// panel maps it to the demo portal token (lib/portal-demo.ts).
const DEMO_NAME     = "Arjun Mehta";
const FIRM_NAME     = "Trellis Capital";
const FIRM_SLUG     = "trellis";

// Must match lib/manager/password.ts constants
const SCRYPT_KEYLEN = 64;
const SCRYPT_OPTS   = { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };

const salt = randomBytes(16);
const hash = scryptSync(DEMO_PASSWORD, salt, SCRYPT_KEYLEN, SCRYPT_OPTS);
const passwordHash = `${salt.toString("hex")}:${hash.toString("hex")}`;

const sql = `
-- ── Demo manager account seed (Trellis Capital) ───────────────
-- Run against the Azure Postgres database.
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
    firm_id         = EXCLUDED.firm_id,
    full_name       = EXCLUDED.full_name,
    password_hash   = EXCLUDED.password_hash,
    password_set_at = EXCLUDED.password_set_at,
    is_verified     = TRUE,
    verified_at     = NOW(),
    verified_by     = 'seed-script';

  RAISE NOTICE 'Done. Login: ${DEMO_EMAIL} / ${DEMO_PASSWORD}';
END $$;
`;

if (process.argv.includes("--apply")) {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("Missing DATABASE_URL (copy it from the App Service's environment variables).");
    process.exit(1);
  }
  const postgres = (await import("postgres")).default;
  const client = postgres(url, { prepare: false, ssl: "require" });
  try {
    await client.unsafe(sql);
    const rows = await client`
      SELECT f.name AS firm, f.slug, u.email, u.full_name, u.is_verified
      FROM manager.users u JOIN manager.firms f ON f.id = u.firm_id
      WHERE u.email = ${DEMO_EMAIL}
    `;
    console.log("Applied. Current demo account:");
    console.table(rows);
    console.log(`Login: ${DEMO_EMAIL} / ${DEMO_PASSWORD}`);
  } finally {
    await client.end();
  }
} else {
  console.log(sql);
}
