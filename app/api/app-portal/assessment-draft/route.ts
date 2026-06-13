import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { assessmentDraftEdits } from "@/lib/db/schema";
import { isBlockedSlug, blockedResponse } from "@/lib/app-portal/slug-guard";
import { getAppAdminEmail } from "@/lib/app-portal/auth-session";

export async function GET(req: NextRequest) {
  const adminEmail = await getAppAdminEmail(req);
  if (!adminEmail) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

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
  const adminEmail = await getAppAdminEmail(req);
  if (!adminEmail) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

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
