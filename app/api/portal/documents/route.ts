import { NextRequest, NextResponse } from "next/server";
import { eq, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { portalDocuments, customers } from "@/lib/db/schema";
import { isDemoPortalToken } from "@/lib/portal-demo";

export const runtime = "nodejs";

async function isKnownToken(token: string): Promise<boolean> {
  if (isDemoPortalToken(token)) return true;
  const [row] = await db
    .select({ id: customers.id })
    .from(customers)
    .where(eq(customers.portalToken, token))
    .limit(1);
  return !!row;
}

// GET /api/portal/documents?token=...
// Public, token-scoped: lists the documents uploaded under a portal token so
// the manager sees their own submission state. Read-only (no DELETE here; the
// admin-gated twin at /api/app-portal/portal/documents handles deletion) and
// storage paths are not exposed.
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token") ?? "";
  if (!token) return NextResponse.json({ error: "missing token" }, { status: 400 });

  try {
    if (!(await isKnownToken(token))) {
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }

    const rows = await db
      .select({
        id: portalDocuments.id,
        filename: portalDocuments.filename,
        fileSize: portalDocuments.fileSize,
        uploadedAt: portalDocuments.uploadedAt,
      })
      .from(portalDocuments)
      .where(eq(portalDocuments.token, token))
      .orderBy(desc(portalDocuments.uploadedAt));

    return NextResponse.json(
      rows.map((r) => ({
        id: r.id,
        filename: r.filename,
        file_size: r.fileSize,
        page_count: null,
        uploaded_at: r.uploadedAt,
      })),
    );
  } catch (e) {
    console.error("[portal/documents] DB error:", e);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
