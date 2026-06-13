import { NextRequest, NextResponse } from "next/server";
import { eq, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { portalDocuments } from "@/lib/db/schema";
import { removeObject } from "@/lib/storage";
import { getAppAdminEmail } from "@/lib/app-portal/auth-session";

export async function GET(req: NextRequest) {
  const adminEmail = await getAppAdminEmail(req);
  if (!adminEmail) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const token = req.nextUrl.searchParams.get("token");
  if (!token) return NextResponse.json({ error: "missing token" }, { status: 400 });

  try {
    const rows = await db
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

    return NextResponse.json(
      rows.map((r) => ({
        id: r.id,
        filename: r.filename,
        file_size: r.fileSize,
        uploaded_at: r.uploadedAt,
        storage_path: r.storagePath,
      })),
    );
  } catch (error) {
    console.error("[portal/documents] DB error:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const adminEmail = await getAppAdminEmail(req);
  if (!adminEmail) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "missing id" }, { status: 400 });

  const [doc] = await db
    .select({ storagePath: portalDocuments.storagePath })
    .from(portalDocuments)
    .where(eq(portalDocuments.id, id))
    .limit(1);

  if (doc?.storagePath) {
    await removeObject("portal-uploads", doc.storagePath);
  }

  try {
    await db.delete(portalDocuments).where(eq(portalDocuments.id, id));
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
