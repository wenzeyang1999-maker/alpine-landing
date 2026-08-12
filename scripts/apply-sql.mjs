/**
 * Apply a SQL file to the database. Companion to the lib/db/*.sql migration
 * files (which are written to be idempotent).
 *
 * Usage: DATABASE_URL=... node scripts/apply-sql.mjs lib/db/0001_firm_portal_token.sql
 */
import { readFileSync } from "fs";
import postgres from "postgres";

const url = process.env.DATABASE_URL;
const file = process.argv[2];
if (!url) {
  console.error("Missing DATABASE_URL");
  process.exit(1);
}
if (!file) {
  console.error("Usage: node scripts/apply-sql.mjs <path-to-sql-file>");
  process.exit(1);
}

const sql = postgres(url, { prepare: false, ssl: "require" });
try {
  await sql.unsafe(readFileSync(file, "utf8"));
  console.log(`Applied ${file}`);
} finally {
  await sql.end();
}
