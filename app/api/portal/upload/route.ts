import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { portalDocuments, customers } from "@/lib/db/schema";
import { ensureContainer, uploadObject } from "@/lib/storage";
import { isDemoPortalToken } from "@/lib/portal-demo";

export const runtime = "nodejs";

const MAX_BYTES = 50 * 1024 * 1024; // 50 MB, matches the portal page copy

async function isKnownToken(token: string): Promise<boolean> {
  if (isDemoPortalToken(token)) return true;
  const [row] = await db
    .select({ id: customers.id, status: customers.status })
    .from(customers)
    .where(eq(customers.portalToken, token))
    .limit(1);
  return !!row && row.status === "active";
}

// POST /api/portal/upload  (multipart: file, token)
// Public, token-scoped: managers upload due-diligence PDFs into their portal.
// The token must resolve to a demo portal or an active onboarded customer, so
// arbitrary tokens cannot create rows or store files.
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const token = ((formData.get("token") as string | null) ?? "").trim();

    if (!token) return NextResponse.json({ error: "missing token" }, { status: 400 });
    if (!file) return NextResponse.json({ error: "missing file" }, { status: 400 });
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      return NextResponse.json({ error: "Only PDF files are supported" }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "File exceeds the 50 MB limit" }, { status: 400 });
    }

    if (!(await isKnownToken(token))) {
      return NextResponse.json({ error: "This portal link is not valid" }, { status: 403 });
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
      return NextResponse.json({ error: "Upload failed, please try again" }, { status: 500 });
    }

    try {
      const [row] = await db
        .insert(portalDocuments)
        .values({ token, filename: file.name, fileSize: file.size, storagePath })
        .returning({
          id: portalDocuments.id,
          filename: portalDocuments.filename,
          fileSize: portalDocuments.fileSize,
          uploadedAt: portalDocuments.uploadedAt,
        });

      return NextResponse.json({
        id: row.id,
        filename: row.filename,
        file_size: row.fileSize,
        uploaded_at: row.uploadedAt,
      });
    } catch (dbError) {
      console.error("[portal/upload] DB error:", dbError);
      return NextResponse.json({ error: "Upload failed, please try again" }, { status: 500 });
    }
  } catch (e) {
    console.error("[portal/upload] Caught error:", e);
    return NextResponse.json({ error: "Upload failed, please try again" }, { status: 500 });
  }
}
