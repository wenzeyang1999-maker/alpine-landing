/**
 * Seeds the portal_documents table + Supabase Storage with Ridgeline demo files.
 * Each file is uploaded under demo-ridgeline-token/ with a name that matches
 * the DOC_TYPE_KEYWORDS in the portal page so the checklist ticks green.
 *
 * Run: node scripts/seed-portal-docs.mjs
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

// Parse .env.local
const envRaw = readFileSync(join(ROOT, ".env.local"), "utf8");
const env = {};
for (const line of envRaw.split("\n")) {
  const m = line.match(/^([^#=\s][^=]*)=(.*)$/);
  if (m) env[m[1].trim()] = m[2].trim();
}

const SUPABASE_URL = env.SUPABASE_URL;
const SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false },
});

const DEMO_DOCS_DIR = join(ROOT, "public", "demo-docs");
const BUCKET = "portal-uploads";

const SEED_DATA = [
  {
    token: "demo-ridgeline-token",
    files: [
      { src: "ridgeline_ddq_2026.pdf",          dest: "RCP_DDQ_2026.pdf" },
      { src: "ridgeline_compliance_manual.pdf",  dest: "Compliance_Manual_2025.pdf" },
      { src: "ridgeline_form_adv_2a.pdf",        dest: "Form_ADV_Part2A_March2025.pdf" },
      { src: "ridgeline_financials_fy2024.pdf",  dest: "Audited_Financials_FY2024.pdf" },
      { src: "ridgeline_valuation_policy.pdf",   dest: "Valuation_Policy_2026.pdf" },
      { src: "ridgeline_bcp.pdf",                dest: "BCP_Test_Results_Dec2025.pdf" },
      { src: "ridgeline_org_chart.pdf",          dest: "Org_Chart_Nov2025.pdf" },
      { src: "ridgeline_conflict_policy.pdf",    dest: "Expert_Network_Policy.pdf" },
      { src: "ridgeline_ic_charter.pdf",         dest: "IC_Charter_Jan2026.pdf" },
      { src: "ridgeline_ppm.pdf",                dest: "Private_Placement_Memo.pdf" },
      { src: "ridgeline_sec_exam_response.pdf",  dest: "Pen_Test_Summary_Jan2026.pdf" },
      { src: "ridgeline_bcp.pdf",                dest: "Incident_Response_Plan_2026.pdf" },
      { src: "ridgeline_annual_report_2024.pdf", dest: "IC_Meeting_Minutes_Q4_2025.pdf" },
      { src: "ridgeline_admin_engagement.pdf",   dest: "CompliySci_Configuration.pdf" },
    ],
  },
  {
    token: "demo-trellis-token",
    files: [
      { src: "Trellis-Capital-IV-ILPA-DDQ-2.0.pdf",             dest: "Trellis-Capital-IV-ILPA-DDQ-2.0.pdf" },
      { src: "Trellis-Capital-Management-Form-ADV-ERA-2026.pdf", dest: "Trellis-Capital-Management-Form-ADV-ERA-2026.pdf" },
      { src: "Trellis-Capital-IV-LPA.pdf",                      dest: "Trellis-Capital-IV-LPA.pdf" },
      { src: "Trellis-Capital-IV-PPM.pdf",                      dest: "Trellis-Capital-IV-PPM.pdf" },
      { src: "trellis_subscription_agreement.pdf",              dest: "trellis_subscription_agreement.pdf" },
      { src: "Trellis-Capital-III-Audited-FS-FY2024.pdf",       dest: "Trellis-Capital-III-Audited-FS-FY2024.pdf" },
      { src: "Trellis-Capital-III-Audited-FS-FY2023.pdf",       dest: "Trellis-Capital-III-Audited-FS-FY2023.pdf" },
      { src: "Trellis-Capital-Valuation-Policy.pdf",            dest: "Trellis-Capital-Valuation-Policy.pdf" },
      { src: "Trellis-Capital-Compliance-Binder-2025.pdf",      dest: "Trellis-Capital-Compliance-Binder-2025.pdf" },
      { src: "Trellis-Capital-Apex-Service-Description-Fund-III.pdf", dest: "Trellis-Capital-Apex-Service-Description-Fund-III.pdf" },
    ],
  },
];

async function seedToken({ token, files }) {
  const { error: delErr } = await supabase
    .from("portal_documents")
    .delete()
    .eq("token", token);
  if (delErr) console.warn(`  ⚠ Could not clear rows for ${token}:`, delErr.message);

  console.log(`\nSeeding ${files.length} files for token "${token}"...`);
  let ok = 0;

  for (const { src, dest } of files) {
    const storagePath = `${token}/${dest}`;
    const content = readFileSync(join(DEMO_DOCS_DIR, src));

    const { error: stErr } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, content, { contentType: "application/pdf", upsert: true });

    if (stErr) { console.error(`  ✗  ${dest}  →  Storage: ${stErr.message}`); continue; }

    const { error: dbErr } = await supabase.from("portal_documents").insert({
      token, filename: dest, file_size: content.length, storage_path: storagePath,
    });

    if (dbErr) { console.error(`  ✗  ${dest}  →  DB: ${dbErr.message}`); }
    else { console.log(`  ✓  ${dest}`); ok++; }
  }

  console.log(`  Done: ${ok} / ${files.length} seeded.`);
}

async function main() {
  for (const entry of SEED_DATA) await seedToken(entry);
  console.log("\nAll tokens seeded.");
}

main().catch((e) => { console.error(e); process.exit(1); });
