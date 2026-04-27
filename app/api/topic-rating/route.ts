import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { isBlockedSlug, blockedResponse } from "@/lib/slug-guard";

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "missing slug" }, { status: 400 });
  if (isBlockedSlug(slug)) return blockedResponse();

  const { data, error } = await supabase
    .from("topic_rating_edits")
    .select("topic_number, rating, rationale")
    .eq("review_slug", slug);

  if (error) {
    console.error("[topic-rating] DB error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}

export async function PUT(req: NextRequest) {
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
    const { data } = await supabase
      .from("topic_rating_edits")
      .select("rationale")
      .eq("review_slug", review_slug)
      .eq("topic_number", topic_number)
      .maybeSingle();
    rationale = data?.rationale ?? "";
  }

  const { error } = await supabase.from("topic_rating_edits").upsert(
    { review_slug, topic_number, rating, rationale, updated_at: new Date().toISOString() },
    { onConflict: "review_slug,topic_number" }
  );

  if (error) {
    console.error("[topic-rating] upsert error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
