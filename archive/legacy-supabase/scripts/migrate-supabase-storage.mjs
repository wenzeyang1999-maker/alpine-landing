/**
 * Reorganizes /demo-docs Supabase Storage bucket from flat structure to subfolders.
 *
 * Before: demo-docs/ridgeline_ppm.pdf
 * After:  demo-docs/ridgeline/ridgeline_ppm.pdf
 *
 * Run: node --env-file=.env.local scripts/migrate-supabase-storage.mjs
 *   (requires Node 20.6+; or export SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY)
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = "demo-docs";

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

/** Decide which subfolder a flat filename belongs to */
function getSubfolder(filename) {
  if (filename.startsWith("ridgeline_")) return "ridgeline";
  if (filename.startsWith("Trellis-") || filename.startsWith("trellis_")) return "trellis";
  if (filename === "sample_vc_fund_iv_alt.pdf") return "trellis";
  if (filename === "sample_vc_aurora_iv.pdf") return "aurora";
  // shared: ILPA, 285601, anything else
  return "shared";
}

async function main() {
  console.log("Listing files in demo-docs bucket root...\n");

  // List root-level files only (no subfolders)
  const { data: files, error } = await supabase.storage.from(BUCKET).list("", {
    limit: 200,
    sortBy: { column: "name", order: "asc" },
  });

  if (error) {
    console.error("Failed to list files:", error.message);
    process.exit(1);
  }

  // Filter to actual files (not folders — folders have no id or size = 0 with no metadata)
  const flatFiles = files.filter((f) => f.id !== null && !f.name.includes("/"));
  console.log(`Found ${flatFiles.length} flat files to migrate:\n`);

  let moved = 0;
  let skipped = 0;
  let failed = 0;

  for (const file of flatFiles) {
    const subfolder = getSubfolder(file.name);
    const from = file.name;
    const to = `${subfolder}/${file.name}`;

    process.stdout.write(`  ${from.padEnd(60)} → ${to} ... `);

    const { error: moveErr } = await supabase.storage.from(BUCKET).move(from, to);

    if (moveErr) {
      // If destination already exists, Supabase returns an error — skip
      if (moveErr.message?.includes("already exists") || moveErr.message?.includes("Duplicate")) {
        console.log("already exists, skipping");
        skipped++;
      } else {
        console.log(`FAILED: ${moveErr.message}`);
        failed++;
      }
    } else {
      console.log("OK");
      moved++;
    }
  }

  console.log(`\nDone — moved: ${moved}, skipped: ${skipped}, failed: ${failed}`);
}

main();
