import { NextResponse } from "next/server";
import { and, eq, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { managerUploads, portalDocuments, customers, firmsInManager } from "@/lib/db/schema";
import { signedUrl, removeObject } from "@/lib/storage";
import { getCurrentManager } from "@/lib/manager/access";
import { DEMO_SLUG_TO_TOKEN, DEMO_MOCK_DOCS } from "@/lib/portal-demo";

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

// Resolve which secure-portal token belongs to this manager's firm:
// demo firms map by slug; real customers map by the email that was onboarded
// (customers.portal_token). Returns null when the firm has no portal.
async function portalTokenForManager(firmId: string, email: string): Promise<string | null> {
  try {
    const [firm] = await db
      .select({ slug: firmsInManager.slug })
      .from(firmsInManager)
      .where(eq(firmsInManager.id, firmId))
      .limit(1);
    if (firm && DEMO_SLUG_TO_TOKEN[firm.slug]) return DEMO_SLUG_TO_TOKEN[firm.slug];

    const [customer] = await db
      .select({ portalToken: customers.portalToken })
      .from(customers)
      .where(eq(customers.email, email))
      .limit(1);
    return customer?.portalToken ?? null;
  } catch {
    return null;
  }
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
