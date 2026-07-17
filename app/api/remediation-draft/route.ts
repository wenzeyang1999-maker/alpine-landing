import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-guard";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { remediationDraftEdits } from "@/lib/db/schema";
import { isBlockedSlug, blockedResponse } from "@/lib/slug-guard";

export async function GET(req: NextRequest) {
  const __denied = await requireAdmin(req); if (__denied) return __denied;
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
  const __denied = await requireAdmin(req); if (__denied) return __denied;
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
