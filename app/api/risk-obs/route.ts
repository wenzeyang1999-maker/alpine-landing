import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { isBlockedSlug, blockedResponse } from "@/lib/slug-guard";

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "missing slug" }, { status: 400 });
  if (isBlockedSlug(slug)) return blockedResponse();

  const { data, error } = await supabase
    .from("risk_observation_edits")
    .select("id, severity, title, detail, remediation")
    .eq("review_slug", slug);

  if (error) {
    console.error("[risk-obs] DB error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, review_slug, severity, title, detail, remediation } = body;

  if (!id || !review_slug) {
    return NextResponse.json({ error: "missing id or review_slug" }, { status: 400 });
  }

  const { error } = await supabase.from("risk_observation_edits").upsert(
    { id, review_slug, severity, title, detail: detail ?? "", remediation: remediation ?? "", updated_at: new Date().toISOString() },
    { onConflict: "id,review_slug" }
  );

  if (error) {
    console.error("[risk-obs] upsert error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
