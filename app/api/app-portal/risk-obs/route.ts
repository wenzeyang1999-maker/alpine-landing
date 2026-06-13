import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { riskObservationEdits } from "@/lib/db/schema";
import { isBlockedSlug, blockedResponse } from "@/lib/app-portal/slug-guard";
import { getAppAdminEmail } from "@/lib/app-portal/auth-session";

export async function GET(req: NextRequest) {
  const adminEmail = await getAppAdminEmail(req);
  if (!adminEmail) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "missing slug" }, { status: 400 });
  if (isBlockedSlug(slug)) return blockedResponse();

  const rows = await db
    .select({
      id: riskObservationEdits.id,
      severity: riskObservationEdits.severity,
      title: riskObservationEdits.title,
      detail: riskObservationEdits.detail,
      remediation: riskObservationEdits.remediation,
    })
    .from(riskObservationEdits)
    .where(eq(riskObservationEdits.reviewSlug, slug));

  return NextResponse.json(rows);
}

export async function PUT(req: NextRequest) {
  const adminEmail = await getAppAdminEmail(req);
  if (!adminEmail) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json();
  const { id, review_slug, severity, title, detail, remediation } = body;

  if (!id || !review_slug) {
    return NextResponse.json({ error: "missing id or review_slug" }, { status: 400 });
  }

  try {
    await db
      .insert(riskObservationEdits)
      .values({ id, reviewSlug: review_slug, severity, title, detail: detail ?? "", remediation: remediation ?? "", updatedAt: new Date().toISOString() })
      .onConflictDoUpdate({
        target: [riskObservationEdits.id, riskObservationEdits.reviewSlug],
        set: { severity, title, detail: detail ?? "", remediation: remediation ?? "", updatedAt: new Date().toISOString() },
      });
  } catch (e) {
    console.error("[risk-obs] upsert error:", e);
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
