import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const VALID_TOKEN = process.env.NOTES_TOKEN;

function unauthorized() {
  return NextResponse.json({ error: "unauthorized" }, { status: 401 });
}

function checkToken(req: NextRequest): boolean {
  const token = req.headers.get("x-notes-token") ?? req.nextUrl.searchParams.get("token");
  return !!VALID_TOKEN && token === VALID_TOKEN;
}

// GET /api/notes?slug=trellis-capital-iv&user=demo@alpinedd.com
export async function GET(req: NextRequest) {
  if (!checkToken(req)) return unauthorized();

  const slug = req.nextUrl.searchParams.get("slug");
  const userEmail = req.nextUrl.searchParams.get("user");
  if (!slug || !userEmail) return NextResponse.json({}, { status: 400 });

  const { data, error } = await supabase
    .from("followup_notes")
    .select("question_key, checked, note")
    .eq("user_email", userEmail)
    .eq("review_slug", slug);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Convert rows → { [question_key]: { checked, note } }
  const state: Record<string, { checked: boolean; note: string }> = {};
  for (const row of data ?? []) {
    state[row.question_key] = { checked: row.checked, note: row.note };
  }
  return NextResponse.json(state);
}

// POST /api/notes  body: { slug, user, state }
export async function POST(req: NextRequest) {
  if (!checkToken(req)) return unauthorized();

  try {
    const { slug, user: userEmail, state } = await req.json();
    if (!slug || !userEmail || !state) {
      return NextResponse.json({ error: "missing slug, user, or state" }, { status: 400 });
    }

    // Ensure user row exists (upsert)
    await supabase
      .from("users")
      .upsert({ email: userEmail }, { onConflict: "email", ignoreDuplicates: true });

    // Upsert each sub-item row
    const rows = Object.entries(state as Record<string, { checked: boolean; note: string }>).map(
      ([question_key, { checked, note }]) => ({
        user_email: userEmail,
        review_slug: slug,
        question_key,
        checked,
        note,
      })
    );

    const { error } = await supabase
      .from("followup_notes")
      .upsert(rows, { onConflict: "user_email,review_slug,question_key" });

    if (error) {
      console.error("[notes POST] Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[notes POST] Caught error:", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
