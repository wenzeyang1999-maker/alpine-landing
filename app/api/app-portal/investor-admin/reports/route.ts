import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/app-portal/supabase";
import { getAppAdminEmail } from "@/lib/app-portal/auth-session";
import { logAudit } from "@/lib/app-portal/audit-log";
import { allReportEntries, getReportEntry, isValidReportSlug } from "@/lib/investor/report-registry";

export const runtime = "nodejs";

// GET — every report in the registry with its publication status.
export async function GET(req: NextRequest) {
  const admin = await getAppAdminEmail(req);
  if (!admin) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { data: pubs, error } = await supabase
    .from("report_publications")
    .select("report_slug, published_at, published_by");
  if (error) {
    console.error("[investor-admin/reports] list error:", error);
    return NextResponse.json({ error: "Couldn't load reports." }, { status: 500 });
  }

  const pubMap = new Map((pubs ?? []).map((p) => [p.report_slug as string, p]));
  const reports = allReportEntries().map((e) => ({
    slug: e.slug,
    fundName: e.fundName,
    manager: e.manager,
    rating: e.rating,
    oddScore: e.oddScore,
    topicCount: e.topicCount,
    published: pubMap.has(e.slug),
    publishedAt: pubMap.get(e.slug)?.published_at ?? null,
  }));
  return NextResponse.json(reports);
}

// POST — publish or unpublish a report. { slug, publish: boolean }
export async function POST(req: NextRequest) {
  const admin = await getAppAdminEmail(req);
  if (!admin) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = (await req.json().catch(() => null)) as { slug?: string; publish?: boolean } | null;
  const slug = body?.slug ?? "";
  const publish = body?.publish === true;

  // Validate the slug against the code registry — reports have no DB FK.
  if (!isValidReportSlug(slug)) {
    return NextResponse.json({ error: "Unknown report." }, { status: 400 });
  }
  const entry = getReportEntry(slug)!;

  if (publish) {
    const { error } = await supabase
      .from("report_publications")
      .upsert(
        { report_slug: slug, fund_name: entry.fundName, published_by: admin },
        { onConflict: "report_slug", ignoreDuplicates: true },
      );
    if (error) {
      console.error("[investor-admin/reports] publish error:", error);
      return NextResponse.json({ error: "Couldn't publish the report." }, { status: 500 });
    }
    await logAudit({ actor: admin, action: "investor.report.publish", target: slug });
  } else {
    const { error } = await supabase.from("report_publications").delete().eq("report_slug", slug);
    if (error) {
      console.error("[investor-admin/reports] unpublish error:", error);
      return NextResponse.json({ error: "Couldn't unpublish the report." }, { status: 500 });
    }
    await logAudit({ actor: admin, action: "investor.report.unpublish", target: slug });
  }

  return NextResponse.json({ ok: true, slug, published: publish });
}
