import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "missing slug" }, { status: 400 });

  const { data, error } = await supabase
    .from("report_draft_edits")
    .select("content")
    .eq("review_slug", slug)
    .maybeSingle();

  if (error) {
    console.error("[report-draft] DB error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ content: data?.content ?? null });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { review_slug, content } = body;

  if (!review_slug) {
    return NextResponse.json({ error: "missing review_slug" }, { status: 400 });
  }

  const { error } = await supabase.from("report_draft_edits").upsert(
    { review_slug, content: content ?? "", updated_at: new Date().toISOString() },
    { onConflict: "review_slug" }
  );

  if (error) {
    console.error("[report-draft] upsert error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "missing slug" }, { status: 400 });

  const { error } = await supabase
    .from("report_draft_edits")
    .delete()
    .eq("review_slug", slug);

  if (error) {
    console.error("[report-draft] delete error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
