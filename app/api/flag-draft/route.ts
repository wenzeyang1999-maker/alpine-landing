import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { isBlockedSlug, blockedResponse } from "@/lib/slug-guard";

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "missing slug" }, { status: 400 });
  if (isBlockedSlug(slug)) return blockedResponse();

  const { data, error } = await supabase
    .from("flag_draft_edits")
    .select("flags")
    .eq("review_slug", slug)
    .maybeSingle();

  if (error) {
    console.error("[flag-draft] DB error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ flags: data?.flags ?? null });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { review_slug, flags } = body;

  if (!review_slug || !Array.isArray(flags)) {
    return NextResponse.json({ error: "missing review_slug or flags" }, { status: 400 });
  }
  if (isBlockedSlug(review_slug)) return blockedResponse();

  const { error } = await supabase.from("flag_draft_edits").upsert(
    { review_slug, flags, updated_at: new Date().toISOString() },
    { onConflict: "review_slug" }
  );

  if (error) {
    console.error("[flag-draft] upsert error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
