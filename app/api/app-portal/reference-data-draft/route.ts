import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { referenceDataDraft } from "@/lib/db/schema";
import { isBlockedSlug, blockedResponse } from "@/lib/app-portal/slug-guard";
import { getAppAdminEmail } from "@/lib/app-portal/auth-session";

export async function GET(req: NextRequest) {
  const adminEmail = await getAppAdminEmail(req);
  if (!adminEmail) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "missing slug" }, { status: 400 });
  if (isBlockedSlug(slug)) return blockedResponse();

  const [row] = await db
    .select({ values: referenceDataDraft.values })
    .from(referenceDataDraft)
    .where(eq(referenceDataDraft.reviewSlug, slug))
    .limit(1);

  return NextResponse.json({ values: row?.values ?? null });
}

export async function PUT(req: NextRequest) {
  const adminEmail = await getAppAdminEmail(req);
  if (!adminEmail) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json();
  const { review_slug, values } = body;

  if (!review_slug || typeof values !== "object") {
    return NextResponse.json({ error: "missing review_slug or values" }, { status: 400 });
  }

  try {
    await db
      .insert(referenceDataDraft)
      .values({ reviewSlug: review_slug, values, updatedAt: new Date().toISOString() })
      .onConflictDoUpdate({
        target: referenceDataDraft.reviewSlug,
        set: { values, updatedAt: new Date().toISOString() },
      });
  } catch (e) {
    console.error("[reference-data-draft] upsert error:", e);
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const adminEmail = await getAppAdminEmail(req);
  if (!adminEmail) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "missing slug" }, { status: 400 });
  if (isBlockedSlug(slug)) return blockedResponse();

  try {
    await db.delete(referenceDataDraft).where(eq(referenceDataDraft.reviewSlug, slug));
  } catch (e) {
    console.error("[reference-data-draft] delete error:", e);
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
