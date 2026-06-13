import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { remediationDraftEdits } from "@/lib/db/schema";
import { isBlockedSlug, blockedResponse } from "@/lib/app-portal/slug-guard";
import { getAppAdminEmail } from "@/lib/app-portal/auth-session";

export async function GET(req: NextRequest) {
  const adminEmail = await getAppAdminEmail(req);
  if (!adminEmail) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "missing slug" }, { status: 400 });
  if (isBlockedSlug(slug)) return blockedResponse();

  const [row] = await db
    .select({ beforeClose: remediationDraftEdits.beforeClose, postClose: remediationDraftEdits.postClose })
    .from(remediationDraftEdits)
    .where(eq(remediationDraftEdits.reviewSlug, slug))
    .limit(1);

  return NextResponse.json(row ? { before_close: row.beforeClose, post_close: row.postClose } : null);
}

export async function PUT(req: NextRequest) {
  const adminEmail = await getAppAdminEmail(req);
  if (!adminEmail) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json();
  const { review_slug, before_close, post_close } = body;

  if (!review_slug) {
    return NextResponse.json({ error: "missing review_slug" }, { status: 400 });
  }

  try {
    await db
      .insert(remediationDraftEdits)
      .values({
        reviewSlug: review_slug,
        beforeClose: before_close ?? [],
        postClose: post_close ?? [],
        updatedAt: new Date().toISOString(),
      })
      .onConflictDoUpdate({
        target: remediationDraftEdits.reviewSlug,
        set: { beforeClose: before_close ?? [], postClose: post_close ?? [], updatedAt: new Date().toISOString() },
      });
  } catch (e) {
    console.error("[remediation-draft] upsert error:", e);
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
