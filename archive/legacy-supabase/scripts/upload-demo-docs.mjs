/**
 * Uploads all files in /public/demo-docs/ to Supabase Storage bucket "demo-docs".
 * Run: node scripts/upload-demo-docs.mjs
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

// Parse .env.local manually
const envRaw = readFileSync(join(ROOT, ".env.local"), "utf8");
const env = {};
for (const line of envRaw.split("\n")) {
  const m = line.match(/^([^#=\s][^=]*)=(.*)$/);
  if (m) env[m[1].trim()] = m[2].trim();
}

const SUPABASE_URL = env.SUPABASE_URL;
const SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = "demo-docs";

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false },
});

const DEMO_DOCS_DIR = join(ROOT, "public", "demo-docs");

const MIME = {
  ".pdf": "application/pdf",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".doc": "application/msword",
};

async function main() {
  const files = readdirSync(DEMO_DOCS_DIR);
  console.log(`Found ${files.length} files — uploading to bucket "${BUCKET}"...\n`);

  let ok = 0;
  let fail = 0;

  for (const filename of files) {
    const ext = "." + filename.split(".").pop().toLowerCase();
    const contentType = MIME[ext] ?? "application/octet-stream";
    const content = readFileSync(join(DEMO_DOCS_DIR, filename));

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(filename, content, { contentType, upsert: true });

    if (error) {
      console.error(`  ✗  ${filename}\n     ${error.message}`);
      fail++;
    } else {
      console.log(`  ✓  ${filename}`);
      ok++;
    }
  }

  console.log(`\nDone: ${ok} uploaded, ${fail} failed.`);
  if (ok > 0) {
    console.log(`\nPublic URL pattern:`);
    console.log(`  ${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/<filename>`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
