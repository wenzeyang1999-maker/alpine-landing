import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { isBlockedSlug, blockedResponse } from "@/lib/slug-guard";

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "missing slug" }, { status: 400 });
  if (isBlockedSlug(slug)) return blockedResponse();

  const { data, error } = await supabase
    .from("reference_data_sources")
    .select("sources")
    .eq("review_slug", slug)
    .maybeSingle();

  if (error) {
    console.error("[reference-sources] DB error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ sources: data?.sources ?? null });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { review_slug, sources } = body;

  if (!review_slug || typeof sources !== "object") {
    return NextResponse.json({ error: "missing review_slug or sources" }, { status: 400 });
  }

  const { error } = await supabase.from("reference_data_sources").upsert(
    { review_slug, sources, updated_at: new Date().toISOString() },
    { onConflict: "review_slug" }
  );

  if (error) {
    console.error("[reference-sources] upsert error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
