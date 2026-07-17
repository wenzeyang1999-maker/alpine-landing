import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-guard";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { assessmentDraftEdits } from "@/lib/db/schema";
import { isBlockedSlug, blockedResponse } from "@/lib/slug-guard";

export async function GET(req: NextRequest) {
  const __denied = await requireAdmin(req); if (__denied) return __denied;
  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "missing slug" }, { status: 400 });
  if (isBlockedSlug(slug)) return blockedResponse();

  const [row] = await db
    .select({ intro1: assessmentDraftEdits.intro1, intro2: assessmentDraftEdits.intro2, notes: assessmentDraftEdits.notes })
    .from(assessmentDraftEdits)
    .where(eq(assessmentDraftEdits.reviewSlug, slug))
    .limit(1);

  return NextResponse.json(row ?? null);
}

export async function PUT(req: NextRequest) {
  const __denied = await requireAdmin(req); if (__denied) return __denied;
  const body = await req.json();
  const { review_slug, intro1, intro2, notes } = body;

  if (!review_slug) {
    return NextResponse.json({ error: "missing review_slug" }, { status: 400 });
  }
  if (isBlockedSlug(review_slug)) return blockedResponse();

  try {
    await db
      .insert(assessmentDraftEdits)
      .values({ reviewSlug: review_slug, intro1: intro1 ?? "", intro2: intro2 ?? "", notes: notes ?? "", updatedAt: new Date().toISOString() })
      .onConflictDoUpdate({
        target: assessmentDraftEdits.reviewSlug,
        set: { intro1: intro1 ?? "", intro2: intro2 ?? "", notes: notes ?? "", updatedAt: new Date().toISOString() },
      });
  } catch (e) {
    console.error("[assessment-draft] upsert error:", e);
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
