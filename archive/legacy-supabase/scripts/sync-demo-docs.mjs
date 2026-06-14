/**
 * Syncs all PDFs from local public/demo-docs/*\/ to the Supabase Storage `demo-docs` bucket.
 *
 * Usage:  node --env-file=.env.local scripts/sync-demo-docs.mjs
 *   (or export SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in your shell)
 *
 * Uses upsert:true so reruns overwrite without erroring. Safe to run any time
 * after adding new PDFs locally.
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync, readdirSync, statSync } from "fs";
import { join, relative } from "path";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = "demo-docs";
const LOCAL_ROOT = "./public/demo-docs";

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

/** Recursively collect all .pdf paths under a directory. */
function collectPdfs(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      out.push(...collectPdfs(full));
    } else if (st.isFile() && entry.toLowerCase().endsWith(".pdf")) {
      out.push(full);
    }
  }
  return out;
}

async function main() {
  const localFiles = collectPdfs(LOCAL_ROOT);
  console.log(`Found ${localFiles.length} local PDFs to sync to ${BUCKET}/\n`);

  let uploaded = 0;
  let failed = 0;

  for (const localPath of localFiles) {
    // Remote path is the path relative to public/demo-docs/, e.g.
    // public/demo-docs/granite/sample_credit_granite_vii.pdf
    //   → granite/sample_credit_granite_vii.pdf
    const remotePath = relative(LOCAL_ROOT, localPath);

    process.stdout.write(`  ${remotePath.padEnd(60)} ... `);

    try {
      const file = readFileSync(localPath);
      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(remotePath, file, {
          contentType: "application/pdf",
          upsert: true,
        });

      if (error) {
        console.log(`FAILED: ${error.message}`);
        failed++;
      } else {
        console.log("OK");
        uploaded++;
      }
    } catch (err) {
      console.log(`FAILED: ${err.message}`);
      failed++;
    }
  }

  console.log(`\nDone — uploaded: ${uploaded}, failed: ${failed}`);
  if (failed > 0) process.exit(1);
}

main();
