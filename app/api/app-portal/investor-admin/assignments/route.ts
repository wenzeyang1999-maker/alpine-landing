import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { investorReports } from "@/lib/db/schema";
import { getAppAdminEmail } from "@/lib/app-portal/auth-session";
import { logAudit } from "@/lib/app-portal/audit-log";
import { isValidReportSlug } from "@/lib/investor/report-registry";

export const runtime = "nodejs";

// GET — all investor↔report assignments.
export async function GET(req: NextRequest) {
  const admin = await getAppAdminEmail(req);
  if (!admin) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  try {
    const rows = await db
      .select({ investorId: investorReports.investorId, reportSlug: investorReports.reportSlug, assignedAt: investorReports.assignedAt })
      .from(investorReports);
    return NextResponse.json(rows.map((r) => ({ investor_id: r.investorId, report_slug: r.reportSlug, assigned_at: r.assignedAt })));
  } catch (error) {
    console.error("[investor-admin/assignments] list error:", error);
    return NextResponse.json({ error: "Couldn't load assignments." }, { status: 500 });
  }
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

  try {
    await db
      .insert(investorReports)
      .values({ investorId, reportSlug: slug, assignedBy: admin })
      .onConflictDoNothing({ target: [investorReports.investorId, investorReports.reportSlug] });
  } catch (error) {
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

  try {
    await db
      .delete(investorReports)
      .where(and(eq(investorReports.reportSlug, slug), eq(investorReports.investorId, investorId)));
  } catch (error) {
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
