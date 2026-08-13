import { NextResponse } from "next/server";
import { and, eq, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { managerUploads, portalDocuments } from "@/lib/db/schema";
import { signedUrl, removeObject } from "@/lib/storage";
import { getCurrentManager } from "@/lib/manager/access";
import { DEMO_MOCK_DOCS } from "@/lib/portal-demo";
import { portalTokenForManager } from "@/lib/manager/portal-link";

const BUCKET = "manager-docs";
const PORTAL_BUCKET = "portal-uploads";
const SIGNED_URL_EXPIRY = 3600;

interface PortalDocOut {
  id: string;
  filename: string;
  file_size: number | null;
  uploaded_at: string;
  url: string | null;
  source: "portal";
}

// Documents received through the firm's secure upload portal, shown read-only
// alongside the manager's own workspace uploads. Demo tokens fall back to the
// same seeded list the portal page shows when the DB has no rows.
async function portalDocsForManager(firmId: string, email: string): Promise<PortalDocOut[]> {
  const token = await portalTokenForManager(firmId, email);
  if (!token) return [];

  let rows: { id: string; filename: string; fileSize: number | null; uploadedAt: string; storagePath: string | null }[] = [];
  try {
    rows = await db
      .select({
        id: portalDocuments.id,
        filename: portalDocuments.filename,
        fileSize: portalDocuments.fileSize,
        uploadedAt: portalDocuments.uploadedAt,
        storagePath: portalDocuments.storagePath,
      })
      .from(portalDocuments)
      .where(eq(portalDocuments.token, token))
      .orderBy(desc(portalDocuments.uploadedAt));
  } catch {
    rows = [];
  }

  if (rows.length === 0 && DEMO_MOCK_DOCS[token]) {
    return DEMO_MOCK_DOCS[token].map((d) => ({
      id: d.id,
      filename: d.filename,
      file_size: d.file_size,
      uploaded_at: d.uploaded_at,
      url: null,
      source: "portal" as const,
    }));
  }

  return Promise.all(
    rows.map(async (doc) => {
      let url: string | null = null;
      if (doc.storagePath) {
        try {
          url = await signedUrl(PORTAL_BUCKET, doc.storagePath, SIGNED_URL_EXPIRY);
        } catch {
          url = null;
        }
      }
      return {
        id: doc.id,
        filename: doc.filename,
        file_size: doc.fileSize,
        uploaded_at: doc.uploadedAt,
        url,
        source: "portal" as const,
      };
    })
  );
}

export async function GET() {
  const user = await getCurrentManager();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // Signup mints a session before Alpine verifies the firm, and portal-token
  // resolution can match on email alone — so unverified accounts must not
  // reach documents. Same gate as app/api/manager/invite/send.
  if (!user.is_verified) return NextResponse.json({ error: "Account not verified" }, { status: 403 });

  let rows: { id: string; filename: string; storagePath: string; fileSize: number | null; uploadedAt: string }[];
  try {
    rows = await db
      .select({
        id: managerUploads.id,
        filename: managerUploads.filename,
        storagePath: managerUploads.storagePath,
        fileSize: managerUploads.fileSize,
        uploadedAt: managerUploads.uploadedAt,
      })
      .from(managerUploads)
      .where(eq(managerUploads.userEmail, user.email))
      .orderBy(desc(managerUploads.uploadedAt));
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }

  const docs = await Promise.all(
    rows.map(async (doc) => {
      let url: string | null = null;
      try {
        url = await signedUrl(BUCKET, doc.storagePath, SIGNED_URL_EXPIRY);
      } catch {
        url = null;
      }
      return {
        id: doc.id,
        filename: doc.filename,
        storage_path: doc.storagePath,
        file_size: doc.fileSize,
        uploaded_at: doc.uploadedAt,
        url,
        source: "workspace" as const,
      };
    })
  );

  const portalDocs = await portalDocsForManager(user.firm_id, user.email);

  return NextResponse.json({ docs: [...portalDocs, ...docs] });
}

export async function DELETE(req: Request) {
  const user = await getCurrentManager();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // Signup mints a session before Alpine verifies the firm, and portal-token
  // resolution can match on email alone — so unverified accounts must not
  // reach documents. Same gate as app/api/manager/invite/send.
  if (!user.is_verified) return NextResponse.json({ error: "Account not verified" }, { status: 403 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const [doc] = await db
    .select({ id: managerUploads.id, storagePath: managerUploads.storagePath })
    .from(managerUploads)
    .where(and(eq(managerUploads.id, id), eq(managerUploads.userEmail, user.email)))
    .limit(1);

  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await removeObject(BUCKET, doc.storagePath);
  await db.delete(managerUploads).where(eq(managerUploads.id, id));

  return NextResponse.json({ ok: true });
}
