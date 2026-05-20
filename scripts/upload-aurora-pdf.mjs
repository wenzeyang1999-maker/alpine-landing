// Run with:  node --env-file=.env.local scripts/upload-aurora-pdf.mjs
//   (or export SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in your shell)
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = "demo-docs";
const LOCAL_PATH = "./public/demo-docs/aurora/sample_vc_aurora_iv.pdf";
const REMOTE_PATH = "aurora/sample_vc_aurora_iv.pdf";

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function main() {
  console.log(`Uploading ${LOCAL_PATH} → ${BUCKET}/${REMOTE_PATH} ...`);
  const file = readFileSync(LOCAL_PATH);
  const { error } = await supabase.storage.from(BUCKET).upload(REMOTE_PATH, file, {
    contentType: "application/pdf",
    upsert: true,
  });
  if (error) {
    console.error("Failed:", error.message);
    process.exit(1);
  }
  console.log("Done.");
}

main();
