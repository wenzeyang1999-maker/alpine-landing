import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { reportPublications } from "@/lib/db/schema";
import { getAppAdminEmail } from "@/lib/app-portal/auth-session";
import { logAudit } from "@/lib/app-portal/audit-log";
import { allReportEntries, getReportEntry, isValidReportSlug } from "@/lib/investor/report-registry";

export const runtime = "nodejs";

// GET — every report in the registry with its publication status.
export async function GET(req: NextRequest) {
  const admin = await getAppAdminEmail(req);
  if (!admin) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  let pubs: { reportSlug: string; publishedAt: string }[];
  try {
    pubs = await db
      .select({ reportSlug: reportPublications.reportSlug, publishedAt: reportPublications.publishedAt })
      .from(reportPublications);
  } catch (error) {
    console.error("[investor-admin/reports] list error:", error);
    return NextResponse.json({ error: "Couldn't load reports." }, { status: 500 });
  }

  const pubMap = new Map(pubs.map((p) => [p.reportSlug, p]));
  const reports = allReportEntries().map((e) => ({
    slug: e.slug,
    fundName: e.fundName,
    manager: e.manager,
    rating: e.rating,
    oddScore: e.oddScore,
    topicCount: e.topicCount,
    published: pubMap.has(e.slug),
    publishedAt: pubMap.get(e.slug)?.publishedAt ?? null,
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

  try {
    if (publish) {
      await db
        .insert(reportPublications)
        .values({ reportSlug: slug, fundName: entry.fundName, publishedBy: admin })
        .onConflictDoNothing({ target: reportPublications.reportSlug });
      await logAudit({ actor: admin, action: "investor.report.publish", target: slug });
    } else {
      await db.delete(reportPublications).where(eq(reportPublications.reportSlug, slug));
      await logAudit({ actor: admin, action: "investor.report.unpublish", target: slug });
    }
  } catch (error) {
    console.error("[investor-admin/reports] publish toggle error:", error);
    return NextResponse.json({ error: "Couldn't update the report." }, { status: 500 });
  }

  return NextResponse.json({ ok: true, slug, published: publish });
}
