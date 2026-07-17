import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-guard";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { reportDraftEdits } from "@/lib/db/schema";
import { isBlockedSlug, blockedResponse } from "@/lib/slug-guard";

export async function GET(req: NextRequest) {
  const __denied = await requireAdmin(req); if (__denied) return __denied;
  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "missing slug" }, { status: 400 });
  if (isBlockedSlug(slug)) return blockedResponse();

  const [row] = await db
    .select({ content: reportDraftEdits.content })
    .from(reportDraftEdits)
    .where(eq(reportDraftEdits.reviewSlug, slug))
    .limit(1);

  return NextResponse.json({ content: row?.content ?? null });
}

export async function PUT(req: NextRequest) {
  const __denied = await requireAdmin(req); if (__denied) return __denied;
  const body = await req.json();
  const { review_slug, content } = body;

  if (!review_slug) {
    return NextResponse.json({ error: "missing review_slug" }, { status: 400 });
  }

  try {
    await db
      .insert(reportDraftEdits)
      .values({ reviewSlug: review_slug, content: content ?? "", updatedAt: new Date().toISOString() })
      .onConflictDoUpdate({
        target: reportDraftEdits.reviewSlug,
        set: { content: content ?? "", updatedAt: new Date().toISOString() },
      });
  } catch (e) {
    console.error("[report-draft] upsert error:", e);
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const __denied = await requireAdmin(req); if (__denied) return __denied;
  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "missing slug" }, { status: 400 });
  if (isBlockedSlug(slug)) return blockedResponse();

  try {
    await db.delete(reportDraftEdits).where(eq(reportDraftEdits.reviewSlug, slug));
  } catch (e) {
    console.error("[report-draft] delete error:", e);
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
