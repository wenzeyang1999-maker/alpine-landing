import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { isBlockedSlug, blockedResponse } from "@/lib/slug-guard";

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "missing slug" }, { status: 400 });
  if (isBlockedSlug(slug)) return blockedResponse();

  const { data, error } = await supabase
    .from("remediation_draft_edits")
    .select("before_close, post_close")
    .eq("review_slug", slug)
    .maybeSingle();

  if (error) {
    console.error("[remediation-draft] DB error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? null);
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { review_slug, before_close, post_close } = body;

  if (!review_slug) {
    return NextResponse.json({ error: "missing review_slug" }, { status: 400 });
  }

  const { error } = await supabase.from("remediation_draft_edits").upsert(
    {
      review_slug,
      before_close: before_close ?? [],
      post_close: post_close ?? [],
      updated_at: new Date().toISOString(),
    },
    { onConflict: "review_slug" }
  );

  if (error) {
    console.error("[remediation-draft] upsert error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
