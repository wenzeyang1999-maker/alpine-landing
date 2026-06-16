/**
 * Create (or reset) an investor account and assign every sample report, so the
 * investor portal + dynamic PDF download can be exercised end-to-end.
 *
 * Idempotent: re-running updates the password and re-asserts the assignments.
 * Password hashing matches lib/investor/password.ts exactly (scrypt → saltHex:hashHex).
 *
 * Usage:
 *   DATABASE_URL=... node scripts/create-investor.mjs <email> <password> ["Full Name"] ["Org"]
 *
 * The DATABASE_URL lives only in your shell — never paste it into a shared log.
 */
import postgres from "postgres";
import { scryptSync, randomBytes } from "crypto";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("Missing DATABASE_URL");
  process.exit(1);
}

const [email, password, fullName = "Demo Investor", organization = "Alpine Demo"] = process.argv.slice(2);
if (!email || !password) {
  console.error("Usage: DATABASE_URL=... node scripts/create-investor.mjs <email> <password> [name] [org]");
  process.exit(1);
}
// The admin UI enforces >= 8; this seed script allows shorter demo passwords
// (e.g. the standard demo123) since login verification itself has no length rule.
if (password.length < 4) {
  console.error("Password must be at least 4 characters.");
  process.exit(1);
}

// Must stay in lockstep with lib/investor/password.ts
const SCRYPT_OPTS = { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };
const salt = randomBytes(16);
const hash = scryptSync(password, salt, 64, SCRYPT_OPTS);
const passwordHash = `${salt.toString("hex")}:${hash.toString("hex")}`;

// The eight sample reports (report-registry dataKeys → slugs).
const SLUGS = [
  "aurora-capital-iv",
  "trellis-capital-iv",
  "ridgeline-capital-partners",
  "granite-vii-credit",
  "cordova-jv-iii",
  "blackpine-credit-iv",
  "havencrest-industrial-v",
  "ridgeline-resort-iii",
];

const sql = postgres(url, { prepare: false, ssl: "require" });
try {
  const e = email.trim().toLowerCase();
  const [row] = await sql`
    INSERT INTO public.investors (email, password_hash, full_name, organization, is_active)
    VALUES (${e}, ${passwordHash}, ${fullName}, ${organization}, true)
    ON CONFLICT (email) DO UPDATE
      SET password_hash = EXCLUDED.password_hash, is_active = true
    RETURNING id, email
  `;
  let assigned = 0;
  for (const slug of SLUGS) {
    const res = await sql`
      INSERT INTO public.investor_reports (investor_id, report_slug, assigned_by)
      VALUES (${row.id}, ${slug}, 'create-investor.mjs')
      ON CONFLICT (investor_id, report_slug) DO NOTHING
    `;
    assigned += res.count;
  }
  console.log(`✓ Investor ready: ${row.email} (id ${row.id})`);
  console.log(`  reports assigned this run: ${assigned} (of ${SLUGS.length})`);
  console.log(`  log in: https://alpinedd.com/login`);
} finally {
  await sql.end();
}
