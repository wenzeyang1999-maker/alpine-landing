import { NextRequest, NextResponse } from "next/server";
import { and, eq, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { investorDocuments } from "@/lib/db/schema";
import { uploadObject, removeObject } from "@/lib/storage";
import { getCurrentInvestor, canAccessReport } from "@/lib/investor/access";
import { isValidReportSlug } from "@/lib/investor/report-registry";

export const runtime = "nodejs";

// Investor-uploaded PDFs live in the existing storage bucket under an
// investor+report-scoped path prefix.
const STORAGE_BUCKET = "portal-uploads";
const MAX_BYTES = 50 * 1024 * 1024; // 50 MB — enforced server-side, never trust the client.

function isPdf(buffer: Buffer): boolean {
  // Real PDF magic number — `%PDF` (0x25 0x50 0x44 0x46). Do not trust the
  // .pdf extension or the client-supplied MIME type.
  return buffer.length >= 4 && buffer.subarray(0, 4).toString("latin1") === "%PDF";
}

// ── GET — list this investor's uploads for a report ─────────────────────────
export async function GET(req: NextRequest) {
  const investor = await getCurrentInvestor();
  if (!investor) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const slug = req.nextUrl.searchParams.get("slug") ?? "";
  if (!isValidReportSlug(slug)) {
    return NextResponse.json({ error: "unknown report" }, { status: 404 });
  }
  if (!(await canAccessReport(investor.id, slug))) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  try {
    const rows = await db
      .select({
        id: investorDocuments.id,
        filename: investorDocuments.filename,
        fileSize: investorDocuments.fileSize,
        status: investorDocuments.status,
        uploadedAt: investorDocuments.uploadedAt,
        processedAt: investorDocuments.processedAt,
      })
      .from(investorDocuments)
      .where(and(eq(investorDocuments.investorId, investor.id), eq(investorDocuments.reportSlug, slug)))
      .orderBy(desc(investorDocuments.uploadedAt));

    return NextResponse.json(
      rows.map((r) => ({
        id: r.id,
        filename: r.filename,
        file_size: r.fileSize,
        status: r.status,
        uploaded_at: r.uploadedAt,
        processed_at: r.processedAt,
      })),
    );
  } catch (error) {
    console.error("[investor/documents] list error:", error);
    return NextResponse.json({ error: "Couldn't load documents." }, { status: 500 });
  }
}

// ── POST — upload a PDF against a report ─────────────────────────────────────
export async function POST(req: NextRequest) {
  const investor = await getCurrentInvestor();
  if (!investor) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const slug = (formData.get("slug") as string | null) ?? "";

    if (!isValidReportSlug(slug)) {
      return NextResponse.json({ error: "unknown report" }, { status: 404 });
    }
    if (!(await canAccessReport(investor.id, slug))) {
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "That file is too large — the limit is 50 MB." },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    if (buffer.length > MAX_BYTES) {
      return NextResponse.json(
        { error: "That file is too large — the limit is 50 MB." },
        { status: 400 },
      );
    }
    if (!isPdf(buffer)) {
      return NextResponse.json(
        { error: "That file isn't a PDF. Please upload a PDF document." },
        { status: 400 },
      );
    }

    const safeName = (file.name || "document.pdf").replace(/[^a-zA-Z0-9._-]/g, "_");
    const storagePath = `investor/${investor.id}/${slug}/${Date.now()}-${safeName}`;

    try {
      await uploadObject(STORAGE_BUCKET, storagePath, buffer, "application/pdf", { upsert: false });
    } catch (storageError) {
      console.error("[investor/documents] storage error:", storageError);
      return NextResponse.json({ error: "Upload failed — please try again." }, { status: 500 });
    }

    try {
      const [row] = await db
        .insert(investorDocuments)
        .values({
          investorId: investor.id,
          reportSlug: slug,
          filename: file.name || safeName,
          fileSize: buffer.length,
          storagePath,
          status: "pending",
        })
        .returning({
          id: investorDocuments.id,
          filename: investorDocuments.filename,
          fileSize: investorDocuments.fileSize,
          status: investorDocuments.status,
          uploadedAt: investorDocuments.uploadedAt,
          processedAt: investorDocuments.processedAt,
        });

      return NextResponse.json({
        id: row.id,
        filename: row.filename,
        file_size: row.fileSize,
        status: row.status,
        uploaded_at: row.uploadedAt,
        processed_at: row.processedAt,
      });
    } catch (dbError) {
      console.error("[investor/documents] db error:", dbError);
      // Roll back the orphaned storage object — best effort.
      await removeObject(STORAGE_BUCKET, storagePath);
      return NextResponse.json({ error: "Upload failed — please try again." }, { status: 500 });
    }
  } catch (err) {
    console.error("[investor/documents] upload error:", err);
    return NextResponse.json({ error: "Upload failed — please try again." }, { status: 500 });
  }
}

// ── DELETE — remove one of this investor's uploads ──────────────────────────
export async function DELETE(req: NextRequest) {
  const investor = await getCurrentInvestor();
  if (!investor) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const id = req.nextUrl.searchParams.get("id") ?? "";
  if (!id) return NextResponse.json({ error: "missing id" }, { status: 400 });

  // Authorize by (investor_id, report_slug, doc_id) together — never id alone.
  const [doc] = await db
    .select({
      id: investorDocuments.id,
      investorId: investorDocuments.investorId,
      reportSlug: investorDocuments.reportSlug,
      storagePath: investorDocuments.storagePath,
    })
    .from(investorDocuments)
    .where(eq(investorDocuments.id, id))
    .limit(1);

  if (!doc || doc.investorId !== investor.id) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  if (!(await canAccessReport(investor.id, doc.reportSlug))) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  if (doc.storagePath) {
    await removeObject(STORAGE_BUCKET, doc.storagePath);
  }
  try {
    await db
      .delete(investorDocuments)
      .where(and(eq(investorDocuments.id, id), eq(investorDocuments.investorId, investor.id)));
  } catch (error) {
    console.error("[investor/documents] delete error:", error);
    return NextResponse.json({ error: "Couldn't delete the document." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
