import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { isBlockedSlug, blockedResponse } from "@/lib/slug-guard";

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "missing slug" }, { status: 400 });
  if (isBlockedSlug(slug)) return blockedResponse();

  const { data, error } = await supabase
    .from("reference_data_draft")
    .select("values")
    .eq("review_slug", slug)
    .maybeSingle();

  if (error) {
    console.error("[reference-data-draft] DB error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ values: data?.values ?? null });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { review_slug, values } = body;

  if (!review_slug || typeof values !== "object") {
    return NextResponse.json({ error: "missing review_slug or values" }, { status: 400 });
  }

  const { error } = await supabase.from("reference_data_draft").upsert(
    { review_slug, values, updated_at: new Date().toISOString() },
    { onConflict: "review_slug" }
  );

  if (error) {
    console.error("[reference-data-draft] upsert error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "missing slug" }, { status: 400 });
  if (isBlockedSlug(slug)) return blockedResponse();

  const { error } = await supabase
    .from("reference_data_draft")
    .delete()
    .eq("review_slug", slug);

  if (error) {
    console.error("[reference-data-draft] delete error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
