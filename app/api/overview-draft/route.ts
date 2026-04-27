import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { isBlockedSlug, blockedResponse } from "@/lib/slug-guard";

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "missing slug" }, { status: 400 });
  if (isBlockedSlug(slug)) return blockedResponse();

  const { data, error } = await supabase
    .from("overview_draft_edits")
    .select("fields")
    .eq("review_slug", slug)
    .maybeSingle();

  if (error) {
    console.error("[overview-draft] DB error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ fields: data?.fields ?? null });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { review_slug, fields } = body;

  if (!review_slug || !fields) {
    return NextResponse.json({ error: "missing review_slug or fields" }, { status: 400 });
  }

  const { error } = await supabase.from("overview_draft_edits").upsert(
    { review_slug, fields, updated_at: new Date().toISOString() },
    { onConflict: "review_slug" }
  );

  if (error) {
    console.error("[overview-draft] upsert error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
