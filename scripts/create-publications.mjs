/**
 * Create the `publications` table on Azure Postgres and seed the existing
 * hand-authored publications (idempotent — safe to re-run).
 *
 * Usage: node scripts/create-publications.mjs
 * Reads DATABASE_URL from .env.local.
 */

import postgres from "postgres";
import { readFileSync } from "fs";

// ── load DATABASE_URL from .env.local (no dotenv dependency) ──
function loadEnv() {
  try {
    const raw = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) {
        process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
      }
    }
  } catch { /* rely on ambient env */ }
}
loadEnv();

const url = process.env.DATABASE_URL;
if (!url) { console.error("Missing DATABASE_URL"); process.exit(1); }

const sql = postgres(url, { prepare: false, ssl: "require" });

// Existing publications (mirror of the old hardcoded lib/publications.ts array).
// href is the unique key → ON CONFLICT (href) DO NOTHING keeps re-runs idempotent.
const SEED = [
  { category: "Case Study 5", dateLabel: "2026 Jul 30 · 9 AM", publishedAt: "2026-07-30T09:00:00-04:00",
    title: "The Chatham Asset Management Case: How Internal Bond Trades Raised Prices, Fund Values, and Fees",
    description: "How internal bond trades in an illiquid issue that Chatham's own funds dominated raised prices, fund NAVs, and advisory fees, per a settled SEC order. A structured analysis of conflicted trading, NAV integrity, and fee diligence, and the record a review pulls to trace where a price actually came from.",
    href: "/case-study/chatham", cta: "Read case study →" },
  { category: "Case Study 4", dateLabel: "2026 Jul 16 · 9 AM", publishedAt: "2026-07-16T09:00:00-04:00",
    title: "The Credit Suisse Greensill Case: When the Story Was More Confident Than the Records",
    description: "How Credit Suisse's Greensill-linked supply-chain-finance funds — about USD 10 billion of client exposure — failed once the assets could not be verified at the claim level. A structured analysis of asset verification, originator risk, insurance diligence, and governance, and the ODD that surfaces it before the forensic review.",
    href: "/case-study/greensill", cta: "Read case study →" },
  { category: "Case Study 3", dateLabel: "2026 Jul 02 · 9 AM", publishedAt: "2026-07-02T09:00:00-04:00",
    title: "The Abraaj Case: Where Did the Money Go?",
    description: "How Abraaj Group, a USD 13 billion impact private equity firm backed by the Gates Foundation, OPIC, and IFC, collapsed once investors could no longer verify where fund cash had gone. A structured analysis of commingling, governance concentration, valuation oversight, and key person control, and the ODD that surfaces it before the forensic review.",
    href: "/case-study/abraaj", cta: "Read case study →" },
  { category: "Case Study 2", dateLabel: "2026 Jun 18 · 9 AM", publishedAt: "2026-06-18T09:00:00-04:00",
    title: "The Woodford Equity Income Fund Case: When Liquidity Became the Risk",
    description: "The fund had a label, a governance structure, a published NAV, and a famous manager. None of those things created liquidity when investors needed cash — a study in what structured fund review is designed to catch before the gate comes down.",
    href: "/case-study/woodford", cta: "Read case study →" },
  { category: "Case Study 1", dateLabel: "2026 Jun 04 · 9 AM", publishedAt: "2026-06-04T09:00:00-04:00",
    title: "The Carvana Case: Why Operational Due Diligence Matters Before the Fraud Becomes Obvious",
    description: "A structured analysis of how governance conflicts, related-party opacity, and reporting quality concerns at Carvana would have been surfaced by a proper ODD review — before Hindenburg's report made them headlines.",
    href: "/case-study/carvana", cta: "Read case study →" },
  { category: "Whitepaper", dateLabel: "2026 May 21 · 9 AM", publishedAt: "2026-05-21T09:00:00-04:00",
    title: "The Operational Due Diligence Imperative",
    description: "A comprehensive framework for evaluating operational risk in alternative investment managers — covering governance, compliance, technology, valuation, and LP communications.",
    href: "/whitepaper", cta: "Read whitepaper →" },
];

try {
  await sql`
    CREATE TABLE IF NOT EXISTS publications (
      id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      category     text NOT NULL,
      title        text NOT NULL,
      description  text NOT NULL,
      href         text NOT NULL,
      cta          text NOT NULL DEFAULT 'Read →',
      date_label   text NOT NULL,
      is_external  boolean NOT NULL DEFAULT false,
      available    boolean NOT NULL DEFAULT true,
      is_visible   boolean NOT NULL DEFAULT true,
      pdf_path     text,
      published_at timestamptz NOT NULL DEFAULT now(),
      created_at   timestamptz NOT NULL DEFAULT now()
    )`;
  await sql`
    CREATE UNIQUE INDEX IF NOT EXISTS publications_href_key ON publications (href)`;
  await sql`
    CREATE INDEX IF NOT EXISTS idx_publications_visible_published
      ON publications (is_visible, published_at DESC)`;
  console.log("✓ table + indexes ready");

  for (const p of SEED) {
    await sql`
      INSERT INTO publications (category, title, description, href, cta, date_label, is_external, available, is_visible, published_at)
      VALUES (${p.category}, ${p.title}, ${p.description}, ${p.href}, ${p.cta}, ${p.dateLabel}, false, true, true, ${p.publishedAt})
      ON CONFLICT (href) DO NOTHING`;
  }
  const [{ count }] = await sql`SELECT count(*)::int AS count FROM publications`;
  console.log(`✓ seeded — ${count} publication rows total`);
} catch (e) {
  console.error("✗ failed:", e.message);
  process.exitCode = 1;
} finally {
  await sql.end();
}
