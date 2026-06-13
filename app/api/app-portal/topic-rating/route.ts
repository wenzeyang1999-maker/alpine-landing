import { NextRequest, NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { db } from "@/lib/db";
import { topicRatingEdits } from "@/lib/db/schema";
import { isBlockedSlug, blockedResponse } from "@/lib/app-portal/slug-guard";
import { getAppAdminEmail } from "@/lib/app-portal/auth-session";

export async function GET(req: NextRequest) {
  const adminEmail = await getAppAdminEmail(req);
  if (!adminEmail) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "missing slug" }, { status: 400 });
  if (isBlockedSlug(slug)) return blockedResponse();

  const rows = await db
    .select({ topicNumber: topicRatingEdits.topicNumber, rating: topicRatingEdits.rating, rationale: topicRatingEdits.rationale })
    .from(topicRatingEdits)
    .where(eq(topicRatingEdits.reviewSlug, slug));

  return NextResponse.json(rows.map((r) => ({ topic_number: r.topicNumber, rating: r.rating, rationale: r.rationale })));
}

export async function PUT(req: NextRequest) {
  const adminEmail = await getAppAdminEmail(req);
  if (!adminEmail) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json();
  const { review_slug, topic_number, rating } = body;

  if (!review_slug || topic_number == null) {
    return NextResponse.json({ error: "missing review_slug or topic_number" }, { status: 400 });
  }

  // If rationale is not included in the request, preserve whatever is already in the DB.
  let rationale: string;
  if ("rationale" in body) {
    rationale = body.rationale ?? "";
  } else {
    const [existing] = await db
      .select({ rationale: topicRatingEdits.rationale })
      .from(topicRatingEdits)
      .where(and(eq(topicRatingEdits.reviewSlug, review_slug), eq(topicRatingEdits.topicNumber, topic_number)))
      .limit(1);
    rationale = existing?.rationale ?? "";
  }

  try {
    await db
      .insert(topicRatingEdits)
      .values({ reviewSlug: review_slug, topicNumber: topic_number, rating, rationale, updatedAt: new Date().toISOString() })
      .onConflictDoUpdate({
        target: [topicRatingEdits.reviewSlug, topicRatingEdits.topicNumber],
        set: { rating, rationale, updatedAt: new Date().toISOString() },
      });
  } catch (e) {
    console.error("[topic-rating] upsert error:", e);
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
