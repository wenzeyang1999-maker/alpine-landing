import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-guard";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { flagDraftEdits } from "@/lib/db/schema";
import { isBlockedSlug, blockedResponse } from "@/lib/slug-guard";

export async function GET(req: NextRequest) {
  const __denied = await requireAdmin(req); if (__denied) return __denied;
  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "missing slug" }, { status: 400 });
  if (isBlockedSlug(slug)) return blockedResponse();

  const [row] = await db
    .select({ flags: flagDraftEdits.flags })
    .from(flagDraftEdits)
    .where(eq(flagDraftEdits.reviewSlug, slug))
    .limit(1);

  return NextResponse.json({ flags: row?.flags ?? null });
}

export async function PUT(req: NextRequest) {
  const __denied = await requireAdmin(req); if (__denied) return __denied;
  const body = await req.json();
  const { review_slug, flags } = body;

  if (!review_slug || !Array.isArray(flags)) {
    return NextResponse.json({ error: "missing review_slug or flags" }, { status: 400 });
  }
  if (isBlockedSlug(review_slug)) return blockedResponse();

  try {
    await db
      .insert(flagDraftEdits)
      .values({ reviewSlug: review_slug, flags, updatedAt: new Date().toISOString() })
      .onConflictDoUpdate({
        target: flagDraftEdits.reviewSlug,
        set: { flags, updatedAt: new Date().toISOString() },
      });
  } catch (e) {
    console.error("[flag-draft] upsert error:", e);
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
