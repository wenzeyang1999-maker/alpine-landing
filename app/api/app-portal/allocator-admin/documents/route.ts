import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/app-portal/supabase";
import { getAppAdminEmail } from "@/lib/app-portal/auth-session";
import { logAudit } from "@/lib/app-portal/audit-log";
import { isValidReportSlug } from "@/lib/allocator/report-registry";

export const runtime = "nodejs";

// GET — allocator-uploaded documents for a report (across all allocators). ?slug=
export async function GET(req: NextRequest) {
  const admin = await getAppAdminEmail(req);
  if (!admin) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const slug = req.nextUrl.searchParams.get("slug") ?? "";
  if (!isValidReportSlug(slug)) {
    return NextResponse.json({ error: "Unknown report." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("allocator_documents")
    .select(
      "id, filename, file_size, status, uploaded_at, processed_at, processed_by, allocator_id, allocators(email, full_name, organization)",
    )
    .eq("report_slug", slug)
    .order("uploaded_at", { ascending: false });

  if (error) {
    console.error("[allocator-admin/documents] list error:", error);
    return NextResponse.json({ error: "Couldn't load documents." }, { status: 500 });
  }
  return NextResponse.json(data ?? []);
}

// POST — incorporate documents (flip status pending -> processed). { ids: string[] }
export async function POST(req: NextRequest) {
  const admin = await getAppAdminEmail(req);
  if (!admin) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = (await req.json().catch(() => null)) as { ids?: unknown } | null;
  const ids = Array.isArray(body?.ids)
    ? (body!.ids as unknown[]).filter((v): v is string => typeof v === "string")
    : [];
  if (ids.length === 0) {
    return NextResponse.json({ error: "No documents selected." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("allocator_documents")
    .update({
      status: "processed",
      processed_at: new Date().toISOString(),
      processed_by: admin,
    })
    .in("id", ids)
    .eq("status", "pending")
    .select("id");

  if (error) {
    console.error("[allocator-admin/documents] incorporate error:", error);
    return NextResponse.json({ error: "Couldn't incorporate the documents." }, { status: 500 });
  }

  const incorporated = (data ?? []).length;
  await logAudit({
    actor: admin,
    action: "allocator.document.incorporate",
    meta: { count: incorporated, ids },
  });
  return NextResponse.json({ ok: true, incorporated });
}
