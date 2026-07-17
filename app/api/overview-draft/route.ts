import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-guard";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { overviewDraftEdits } from "@/lib/db/schema";
import { isBlockedSlug, blockedResponse } from "@/lib/slug-guard";

export async function GET(req: NextRequest) {
  const __denied = await requireAdmin(req); if (__denied) return __denied;
  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "missing slug" }, { status: 400 });
  if (isBlockedSlug(slug)) return blockedResponse();

  const [row] = await db
    .select({ fields: overviewDraftEdits.fields })
    .from(overviewDraftEdits)
    .where(eq(overviewDraftEdits.reviewSlug, slug))
    .limit(1);

  return NextResponse.json({ fields: row?.fields ?? null });
}

export async function PUT(req: NextRequest) {
  const __denied = await requireAdmin(req); if (__denied) return __denied;
  const body = await req.json();
  const { review_slug, fields } = body;

  if (!review_slug || !fields) {
    return NextResponse.json({ error: "missing review_slug or fields" }, { status: 400 });
  }

  try {
    await db
      .insert(overviewDraftEdits)
      .values({ reviewSlug: review_slug, fields, updatedAt: new Date().toISOString() })
      .onConflictDoUpdate({
        target: overviewDraftEdits.reviewSlug,
        set: { fields, updatedAt: new Date().toISOString() },
      });
  } catch (e) {
    console.error("[overview-draft] upsert error:", e);
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
