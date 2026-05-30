import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getCurrentManager } from "@/lib/manager/access";

function db() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

export async function POST(req: Request) {
  const user = await getCurrentManager();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!user.firm_id) return NextResponse.json({ error: "No firm" }, { status: 400 });

  const { questionId, chapterNum, status } = await req.json();
  if (!questionId || !chapterNum) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  if (status !== null && status !== "flagged" && status !== "reviewed") {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const { error } = await db()
    .from("manager_responses")
    .upsert(
      {
        firm_id: user.firm_id,
        question_id: questionId,
        chapter_num: chapterNum,
        review_status: status ?? null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "firm_id,question_id" }
    );

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
