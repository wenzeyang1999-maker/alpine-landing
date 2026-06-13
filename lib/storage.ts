/**
 * Azure Blob Storage helper — replaces Supabase Storage.
 * Node runtime ONLY (uses @azure/storage-blob + connection string with account key).
 *
 * Container ↔ old Supabase bucket mapping is 1:1 (same names, same storage_path
 * values), so existing DB paths need no rewrite.
 */

import { BlobServiceClient, BlobSASPermissions } from "@azure/storage-blob";

export type Container = "manager-docs" | "portal-uploads" | "demo-docs";

let _svc: BlobServiceClient | null = null;
function svc(): BlobServiceClient {
  if (_svc) return _svc;
  const conn = process.env.AZURE_STORAGE_CONNECTION_STRING;
  if (!conn) throw new Error("Missing AZURE_STORAGE_CONNECTION_STRING in environment");
  _svc = BlobServiceClient.fromConnectionString(conn);
  return _svc;
}

/** createIfNotExists — replaces the old listBuckets()/createBucket() pattern. */
export async function ensureContainer(container: Container): Promise<void> {
  await svc().getContainerClient(container).createIfNotExists();
}

/**
 * Upload a blob. With `upsert: false` (default, matching Supabase), throws if the
 * blob already exists.
 */
export async function uploadObject(
  container: Container,
  path: string,
  data: Buffer | ArrayBuffer | Uint8Array,
  contentType: string,
  opts: { upsert?: boolean } = {},
): Promise<void> {
  const blob = svc().getContainerClient(container).getBlockBlobClient(path);
  if (!opts.upsert && (await blob.exists())) {
    throw new Error(`Blob already exists at ${container}/${path}`);
  }
  const buf = Buffer.isBuffer(data) ? data : Buffer.from(data as ArrayBuffer);
  await blob.uploadData(buf, { blobHTTPHeaders: { blobContentType: contentType } });
}

/** Download a blob into a Buffer. Throws if not found. */
export async function downloadObject(container: Container, path: string): Promise<Buffer> {
  return svc().getContainerClient(container).getBlockBlobClient(path).downloadToBuffer();
}

/** Best-effort delete — no error if the blob is already gone. */
export async function removeObject(container: Container, path: string): Promise<void> {
  await svc().getContainerClient(container).getBlockBlobClient(path).deleteIfExists();
}

/** Generate a read-only, time-limited SAS URL (replaces createSignedUrl). */
export async function signedUrl(container: Container, path: string, expirySeconds: number): Promise<string> {
  const blob = svc().getContainerClient(container).getBlockBlobClient(path);
  return blob.generateSasUrl({
    permissions: BlobSASPermissions.parse("r"),
    expiresOn: new Date(Date.now() + expirySeconds * 1000),
    startsOn: new Date(Date.now() - 60 * 1000), // small clock-skew cushion
  });
}

/** Public URL for the demo-docs container (public blob read). */
export function publicUrl(container: Container, path: string): string {
  const base = process.env.NEXT_PUBLIC_BLOB_BASE_URL;
  if (!base) throw new Error("Missing NEXT_PUBLIC_BLOB_BASE_URL in environment");
  return `${base}/${container}/${path}`;
}
