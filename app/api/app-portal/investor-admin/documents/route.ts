import { NextRequest, NextResponse } from "next/server";
import { and, eq, desc, inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import { investorDocuments, investors } from "@/lib/db/schema";
import { getAppAdminEmail } from "@/lib/app-portal/auth-session";
import { logAudit } from "@/lib/app-portal/audit-log";
import { isValidReportSlug } from "@/lib/investor/report-registry";

export const runtime = "nodejs";

// GET — investor-uploaded documents for a report (across all investors). ?slug=
export async function GET(req: NextRequest) {
  const admin = await getAppAdminEmail(req);
  if (!admin) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const slug = req.nextUrl.searchParams.get("slug") ?? "";
  if (!isValidReportSlug(slug)) {
    return NextResponse.json({ error: "Unknown report." }, { status: 400 });
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
        processedBy: investorDocuments.processedBy,
        investorId: investorDocuments.investorId,
        invEmail: investors.email,
        invFullName: investors.fullName,
        invOrg: investors.organization,
      })
      .from(investorDocuments)
      .leftJoin(investors, eq(investorDocuments.investorId, investors.id))
      .where(eq(investorDocuments.reportSlug, slug))
      .orderBy(desc(investorDocuments.uploadedAt));

    const out = rows.map((r) => ({
      id: r.id,
      filename: r.filename,
      file_size: r.fileSize,
      status: r.status,
      uploaded_at: r.uploadedAt,
      processed_at: r.processedAt,
      processed_by: r.processedBy,
      investor_id: r.investorId,
      investors: { email: r.invEmail, full_name: r.invFullName, organization: r.invOrg },
    }));
    return NextResponse.json(out);
  } catch (error) {
    console.error("[investor-admin/documents] list error:", error);
    return NextResponse.json({ error: "Couldn't load documents." }, { status: 500 });
  }
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

  let incorporated = 0;
  try {
    const updated = await db
      .update(investorDocuments)
      .set({ status: "processed", processedAt: new Date().toISOString(), processedBy: admin })
      .where(and(inArray(investorDocuments.id, ids), eq(investorDocuments.status, "pending")))
      .returning({ id: investorDocuments.id });
    incorporated = updated.length;
  } catch (error) {
    console.error("[investor-admin/documents] incorporate error:", error);
    return NextResponse.json({ error: "Couldn't incorporate the documents." }, { status: 500 });
  }

  await logAudit({
    actor: admin,
    action: "investor.document.incorporate",
    meta: { count: incorporated, ids },
  });
  return NextResponse.json({ ok: true, incorporated });
}
