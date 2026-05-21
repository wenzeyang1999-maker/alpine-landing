import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/app-portal/supabase";
import { getAppAdminEmail } from "@/lib/app-portal/auth-session";
import { logAudit } from "@/lib/app-portal/audit-log";
import { isValidReportSlug } from "@/lib/investor/report-registry";

export const runtime = "nodejs";

// GET — all investor↔report assignments.
export async function GET(req: NextRequest) {
  const admin = await getAppAdminEmail(req);
  if (!admin) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("investor_reports")
    .select("investor_id, report_slug, assigned_at");
  if (error) {
    console.error("[investor-admin/assignments] list error:", error);
    return NextResponse.json({ error: "Couldn't load assignments." }, { status: 500 });
  }
  return NextResponse.json(data ?? []);
}

// POST — assign a report to an investor. { slug, investorId }
export async function POST(req: NextRequest) {
  const admin = await getAppAdminEmail(req);
  if (!admin) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = (await req.json().catch(() => null)) as
    | { slug?: string; investorId?: string }
    | null;
  const slug = body?.slug ?? "";
  const investorId = body?.investorId ?? "";

  if (!isValidReportSlug(slug)) {
    return NextResponse.json({ error: "Unknown report." }, { status: 400 });
  }
  if (!investorId) {
    return NextResponse.json({ error: "investorId is required." }, { status: 400 });
  }

  const { error } = await supabase
    .from("investor_reports")
    .upsert(
      { investor_id: investorId, report_slug: slug, assigned_by: admin },
      { onConflict: "investor_id,report_slug", ignoreDuplicates: true },
    );
  if (error) {
    console.error("[investor-admin/assignments] assign error:", error);
    return NextResponse.json({ error: "Couldn't assign the report." }, { status: 500 });
  }

  await logAudit({
    actor: admin,
    action: "investor.report.assign",
    target: slug,
    meta: { investorId },
  });
  return NextResponse.json({ ok: true });
}

// DELETE — unassign a report from an investor. ?slug=&investorId=
export async function DELETE(req: NextRequest) {
  const admin = await getAppAdminEmail(req);
  if (!admin) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const slug = req.nextUrl.searchParams.get("slug") ?? "";
  const investorId = req.nextUrl.searchParams.get("investorId") ?? "";
  if (!slug || !investorId) {
    return NextResponse.json({ error: "slug and investorId are required." }, { status: 400 });
  }

  const { error } = await supabase
    .from("investor_reports")
    .delete()
    .eq("report_slug", slug)
    .eq("investor_id", investorId);
  if (error) {
    console.error("[investor-admin/assignments] unassign error:", error);
    return NextResponse.json({ error: "Couldn't unassign the report." }, { status: 500 });
  }

  await logAudit({
    actor: admin,
    action: "investor.report.unassign",
    target: slug,
    meta: { investorId },
  });
  return NextResponse.json({ ok: true });
}
