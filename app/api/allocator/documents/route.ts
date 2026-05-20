import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getCurrentAllocator, canAccessReport } from "@/lib/allocator/access";
import { isValidReportSlug } from "@/lib/allocator/report-registry";

export const runtime = "nodejs";

// Allocator-uploaded PDFs live in the existing storage bucket under an
// allocator+report-scoped path prefix.
const STORAGE_BUCKET = "portal-uploads";
const MAX_BYTES = 50 * 1024 * 1024; // 50 MB — enforced server-side, never trust the client.

function isPdf(buffer: Buffer): boolean {
  // Real PDF magic number — `%PDF` (0x25 0x50 0x44 0x46). Do not trust the
  // .pdf extension or the client-supplied MIME type.
  return buffer.length >= 4 && buffer.subarray(0, 4).toString("latin1") === "%PDF";
}

// ── GET — list this allocator's uploads for a report ─────────────────────────
export async function GET(req: NextRequest) {
  const allocator = await getCurrentAllocator();
  if (!allocator) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const slug = req.nextUrl.searchParams.get("slug") ?? "";
  if (!isValidReportSlug(slug)) {
    return NextResponse.json({ error: "unknown report" }, { status: 404 });
  }
  if (!(await canAccessReport(allocator.id, slug))) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  const { data, error } = await supabase
    .from("allocator_documents")
    .select("id, filename, file_size, status, uploaded_at, processed_at")
    .eq("allocator_id", allocator.id)
    .eq("report_slug", slug)
    .order("uploaded_at", { ascending: false });

  if (error) {
    console.error("[allocator/documents] list error:", error);
    return NextResponse.json({ error: "Couldn't load documents." }, { status: 500 });
  }
  return NextResponse.json(data ?? []);
}

// ── POST — upload a PDF against a report ─────────────────────────────────────
export async function POST(req: NextRequest) {
  const allocator = await getCurrentAllocator();
  if (!allocator) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const slug = (formData.get("slug") as string | null) ?? "";

    if (!isValidReportSlug(slug)) {
      return NextResponse.json({ error: "unknown report" }, { status: 404 });
    }
    if (!(await canAccessReport(allocator.id, slug))) {
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
    const storagePath = `allocator/${allocator.id}/${slug}/${Date.now()}-${safeName}`;

    const { error: storageError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(storagePath, buffer, { contentType: "application/pdf", upsert: false });

    if (storageError) {
      console.error("[allocator/documents] storage error:", storageError);
      return NextResponse.json({ error: "Upload failed — please try again." }, { status: 500 });
    }

    const { data: row, error: dbError } = await supabase
      .from("allocator_documents")
      .insert({
        allocator_id: allocator.id,
        report_slug: slug,
        filename: file.name || safeName,
        file_size: buffer.length,
        storage_path: storagePath,
        status: "pending",
      })
      .select("id, filename, file_size, status, uploaded_at, processed_at")
      .single();

    if (dbError || !row) {
      console.error("[allocator/documents] db error:", dbError);
      // Roll back the orphaned storage object — best effort.
      await supabase.storage.from(STORAGE_BUCKET).remove([storagePath]);
      return NextResponse.json({ error: "Upload failed — please try again." }, { status: 500 });
    }

    return NextResponse.json(row);
  } catch (err) {
    console.error("[allocator/documents] upload error:", err);
    return NextResponse.json({ error: "Upload failed — please try again." }, { status: 500 });
  }
}

// ── DELETE — remove one of this allocator's uploads ──────────────────────────
export async function DELETE(req: NextRequest) {
  const allocator = await getCurrentAllocator();
  if (!allocator) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const id = req.nextUrl.searchParams.get("id") ?? "";
  if (!id) return NextResponse.json({ error: "missing id" }, { status: 400 });

  // Authorize by (allocator_id, report_slug, doc_id) together — never id alone.
  const { data: doc } = await supabase
    .from("allocator_documents")
    .select("id, allocator_id, report_slug, storage_path")
    .eq("id", id)
    .maybeSingle();

  if (!doc || doc.allocator_id !== allocator.id) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  if (!(await canAccessReport(allocator.id, doc.report_slug))) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  if (doc.storage_path) {
    await supabase.storage.from(STORAGE_BUCKET).remove([doc.storage_path]);
  }
  const { error } = await supabase
    .from("allocator_documents")
    .delete()
    .eq("id", id)
    .eq("allocator_id", allocator.id);

  if (error) {
    console.error("[allocator/documents] delete error:", error);
    return NextResponse.json({ error: "Couldn't delete the document." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
