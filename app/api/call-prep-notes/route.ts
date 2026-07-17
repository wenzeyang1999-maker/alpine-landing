import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-guard";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { callPrepNotes } from "@/lib/db/schema";
import { isBlockedSlug, blockedResponse } from "@/lib/slug-guard";

export async function GET(req: NextRequest) {
  const __denied = await requireAdmin(req); if (__denied) return __denied;
  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "missing slug" }, { status: 400 });
  if (isBlockedSlug(slug)) return blockedResponse();

  const rows = await db
    .select({ noteKey: callPrepNotes.noteKey, content: callPrepNotes.content })
    .from(callPrepNotes)
    .where(eq(callPrepNotes.reviewSlug, slug));

  return NextResponse.json(rows.map((r) => ({ note_key: r.noteKey, content: r.content })));
}

export async function PUT(req: NextRequest) {
  const __denied = await requireAdmin(req); if (__denied) return __denied;
  const body = await req.json();
  const { review_slug, note_key, content } = body;

  if (!review_slug || !note_key) {
    return NextResponse.json({ error: "missing review_slug or note_key" }, { status: 400 });
  }
  if (isBlockedSlug(review_slug)) return blockedResponse();

  try {
    await db
      .insert(callPrepNotes)
      .values({ reviewSlug: review_slug, noteKey: note_key, content: content ?? "", updatedAt: new Date().toISOString() })
      .onConflictDoUpdate({
        target: [callPrepNotes.reviewSlug, callPrepNotes.noteKey],
        set: { content: content ?? "", updatedAt: new Date().toISOString() },
      });
  } catch (e) {
    console.error("[call-prep-notes] upsert error:", e);
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
