import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { portalDocuments } from "@/lib/db/schema";
import { ensureContainer, uploadObject } from "@/lib/storage";
import { getAppAdminEmail } from "@/lib/app-portal/auth-session";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const adminEmail = await getAppAdminEmail(req);
  if (!adminEmail) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const token = formData.get("token") as string | null;

    if (!token) return NextResponse.json({ error: "missing token" }, { status: 400 });
    if (!file) return NextResponse.json({ error: "missing file" }, { status: 400 });
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      return NextResponse.json({ error: "Only PDF files are supported" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const safeFilename = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const storagePath = `${token}/${Date.now()}-${safeFilename}`;

    await ensureContainer("portal-uploads");
    try {
      await uploadObject("portal-uploads", storagePath, buffer, "application/pdf", { upsert: false });
    } catch (storageError) {
      console.error("[portal/upload] Storage error:", storageError);
      return NextResponse.json({ error: (storageError as Error).message }, { status: 500 });
    }

    try {
      const [row] = await db
        .insert(portalDocuments)
        .values({
          token,
          filename: file.name,
          fileSize: file.size,
          storagePath,
        })
        .returning({
          id: portalDocuments.id,
          token: portalDocuments.token,
          filename: portalDocuments.filename,
          fileSize: portalDocuments.fileSize,
          storagePath: portalDocuments.storagePath,
          uploadedAt: portalDocuments.uploadedAt,
        });

      return NextResponse.json({
        id: row.id,
        token: row.token,
        filename: row.filename,
        file_size: row.fileSize,
        storage_path: row.storagePath,
        uploaded_at: row.uploadedAt,
      });
    } catch (dbError) {
      console.error("[portal/upload] DB error:", dbError);
      return NextResponse.json({ error: (dbError as Error).message }, { status: 500 });
    }
  } catch (e) {
    console.error("[portal/upload] Caught error:", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
