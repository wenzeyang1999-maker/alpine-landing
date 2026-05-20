import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/app-portal/supabase";
import { getAppAdminEmail } from "@/lib/app-portal/auth-session";
import { logAudit } from "@/lib/app-portal/audit-log";
import { isValidReportSlug } from "@/lib/allocator/report-registry";

export const runtime = "nodejs";

// GET — all allocator↔report assignments.
export async function GET(req: NextRequest) {
  const admin = await getAppAdminEmail(req);
  if (!admin) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("allocator_reports")
    .select("allocator_id, report_slug, assigned_at");
  if (error) {
    console.error("[allocator-admin/assignments] list error:", error);
    return NextResponse.json({ error: "Couldn't load assignments." }, { status: 500 });
  }
  return NextResponse.json(data ?? []);
}

// POST — assign a report to an allocator. { slug, allocatorId }
export async function POST(req: NextRequest) {
  const admin = await getAppAdminEmail(req);
  if (!admin) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = (await req.json().catch(() => null)) as
    | { slug?: string; allocatorId?: string }
    | null;
  const slug = body?.slug ?? "";
  const allocatorId = body?.allocatorId ?? "";

  if (!isValidReportSlug(slug)) {
    return NextResponse.json({ error: "Unknown report." }, { status: 400 });
  }
  if (!allocatorId) {
    return NextResponse.json({ error: "allocatorId is required." }, { status: 400 });
  }

  const { error } = await supabase
    .from("allocator_reports")
    .upsert(
      { allocator_id: allocatorId, report_slug: slug, assigned_by: admin },
      { onConflict: "allocator_id,report_slug", ignoreDuplicates: true },
    );
  if (error) {
    console.error("[allocator-admin/assignments] assign error:", error);
    return NextResponse.json({ error: "Couldn't assign the report." }, { status: 500 });
  }

  await logAudit({
    actor: admin,
    action: "allocator.report.assign",
    target: slug,
    meta: { allocatorId },
  });
  return NextResponse.json({ ok: true });
}

// DELETE — unassign a report from an allocator. ?slug=&allocatorId=
export async function DELETE(req: NextRequest) {
  const admin = await getAppAdminEmail(req);
  if (!admin) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const slug = req.nextUrl.searchParams.get("slug") ?? "";
  const allocatorId = req.nextUrl.searchParams.get("allocatorId") ?? "";
  if (!slug || !allocatorId) {
    return NextResponse.json({ error: "slug and allocatorId are required." }, { status: 400 });
  }

  const { error } = await supabase
    .from("allocator_reports")
    .delete()
    .eq("report_slug", slug)
    .eq("allocator_id", allocatorId);
  if (error) {
    console.error("[allocator-admin/assignments] unassign error:", error);
    return NextResponse.json({ error: "Couldn't unassign the report." }, { status: 500 });
  }

  await logAudit({
    actor: admin,
    action: "allocator.report.unassign",
    target: slug,
    meta: { allocatorId },
  });
  return NextResponse.json({ ok: true });
}
