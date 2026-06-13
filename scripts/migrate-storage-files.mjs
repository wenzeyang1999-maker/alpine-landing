/**
 * One-off: copy all objects from Supabase Storage buckets to Azure Blob.
 * Reads Supabase via the Storage REST API (service_role, read-only); writes to
 * Azure via @azure/storage-blob. Same bucket name + object path → DB storage_path
 * values stay valid. Re-runnable (overwrites).
 *
 * Env required:
 *   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, AZURE_STORAGE_CONNECTION_STRING
 */
import { BlobServiceClient } from "@azure/storage-blob";

const SUPA = process.env.SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const AZ = process.env.AZURE_STORAGE_CONNECTION_STRING;
if (!SUPA || !KEY || !AZ) {
  console.error("Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY / AZURE_STORAGE_CONNECTION_STRING");
  process.exit(1);
}

const BUCKETS = ["manager-docs", "portal-uploads", "demo-docs"];
const headers = { apikey: KEY, Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" };

async function listFolder(bucket, prefix) {
  const res = await fetch(`${SUPA}/storage/v1/object/list/${bucket}`, {
    method: "POST",
    headers,
    body: JSON.stringify({ prefix, limit: 1000, offset: 0, sortBy: { column: "name", order: "asc" } }),
  });
  if (!res.ok) throw new Error(`list ${bucket}/${prefix}: ${res.status} ${await res.text()}`);
  return res.json();
}

async function listAll(bucket, prefix = "") {
  const items = await listFolder(bucket, prefix);
  const files = [];
  for (const it of items) {
    const path = prefix + it.name;
    // Folders come back with id === null and no metadata.
    if (it.id === null && it.metadata == null) {
      files.push(...(await listAll(bucket, path + "/")));
    } else {
      files.push(path);
    }
  }
  return files;
}

async function download(bucket, path) {
  const res = await fetch(`${SUPA}/storage/v1/object/${bucket}/${encodeURI(path)}`, { headers });
  if (!res.ok) throw new Error(`download ${bucket}/${path}: ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

const CONTENT_TYPES = {
  pdf: "application/pdf",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  doc: "application/msword",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  csv: "text/csv",
  txt: "text/plain",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
};
function contentTypeFor(path) {
  const ext = path.split(".").pop()?.toLowerCase() ?? "";
  return CONTENT_TYPES[ext] ?? "application/octet-stream";
}

const blobSvc = BlobServiceClient.fromConnectionString(AZ);

let total = 0, copied = 0, failed = 0;
for (const bucket of BUCKETS) {
  let files = [];
  try {
    files = await listAll(bucket);
  } catch (e) {
    console.log(`[${bucket}] list failed (bucket may not exist): ${e.message}`);
    continue;
  }
  console.log(`[${bucket}] ${files.length} objects`);
  const container = blobSvc.getContainerClient(bucket);
  await container.createIfNotExists();
  for (const path of files) {
    total++;
    try {
      const buf = await download(bucket, path);
      await container.getBlockBlobClient(path).uploadData(buf, {
        blobHTTPHeaders: { blobContentType: contentTypeFor(path) },
      });
      copied++;
      console.log(`  ✓ ${path} (${buf.length} B)`);
    } catch (e) {
      failed++;
      console.log(`  ✗ ${path}: ${e.message}`);
    }
  }
}
console.log(`\nDone. ${copied}/${total} copied, ${failed} failed.`);
process.exit(failed > 0 ? 1 : 0);
