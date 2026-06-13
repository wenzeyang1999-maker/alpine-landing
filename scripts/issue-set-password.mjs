/**
 * Cutover helper: issue set-password links for existing analyst/admin users
 * whose Supabase Auth passwords could not be carried over (bcrypt → scrypt).
 *
 * Sets a fresh verification_token (+ verification_sent_at = now) on each user and
 * prints the /set-password?token=... URL. It does NOT send email — copy the links
 * and send them manually, or wire Resend in once you're ready.
 *
 * Usage:
 *   DATABASE_URL=... node scripts/issue-set-password.mjs email1@x.com email2@y.com
 *   DATABASE_URL=... node scripts/issue-set-password.mjs --all      # every users row
 *
 * BASE_URL env overrides the link host (default https://alpinedd.com).
 */
import postgres from "postgres";
import { randomBytes } from "crypto";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("Missing DATABASE_URL");
  process.exit(1);
}
const BASE_URL = process.env.BASE_URL || "https://alpinedd.com";
const args = process.argv.slice(2);
const all = args.includes("--all");
const emails = args.filter((a) => !a.startsWith("--")).map((e) => e.trim().toLowerCase());

if (!all && emails.length === 0) {
  console.error("Pass one or more emails, or --all");
  process.exit(1);
}

const sql = postgres(url, { prepare: false, ssl: "require" });

try {
  const rows = all
    ? await sql`SELECT id, email FROM public.users ORDER BY created_at`
    : await sql`SELECT id, email FROM public.users WHERE lower(email) = ANY(${emails})`;

  if (rows.length === 0) {
    console.log("No matching users.");
  }

  for (const row of rows) {
    const token = randomBytes(32).toString("hex");
    await sql`
      UPDATE public.users
      SET verification_token = ${token}, verification_sent_at = now()
      WHERE id = ${row.id}
    `;
    console.log(`${row.email}\n  ${BASE_URL}/set-password?token=${token}\n`);
  }
} finally {
  await sql.end();
}
