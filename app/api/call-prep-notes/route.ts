import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { isBlockedSlug, blockedResponse } from "@/lib/slug-guard";

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "missing slug" }, { status: 400 });
  if (isBlockedSlug(slug)) return blockedResponse();

  const { data, error } = await supabase
    .from("call_prep_notes")
    .select("note_key, content")
    .eq("review_slug", slug);

  if (error) {
    console.error("[call-prep-notes] DB error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { review_slug, note_key, content } = body;

  if (!review_slug || !note_key) {
    return NextResponse.json({ error: "missing review_slug or note_key" }, { status: 400 });
  }
  if (isBlockedSlug(review_slug)) return blockedResponse();

  const { error } = await supabase.from("call_prep_notes").upsert(
    { review_slug, note_key, content: content ?? "", updated_at: new Date().toISOString() },
    { onConflict: "review_slug,note_key" }
  );

  if (error) {
    console.error("[call-prep-notes] upsert error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
