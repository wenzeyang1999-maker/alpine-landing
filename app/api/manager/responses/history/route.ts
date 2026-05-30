import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getCurrentManager } from "@/lib/manager/access";

function db() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

type HistoryRow = {
  id: string;
  answer_text: string | null;
  answer_choice: string | null;
  answer_multi: string[] | null;
  uploaded_filename: string | null;
  changed_by_email: string;
  changed_by_name: string | null;
  changed_at: string;
};

export async function GET(req: NextRequest) {
  const user = await getCurrentManager();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const questionId = req.nextUrl.searchParams.get("questionId");
  if (!questionId) return NextResponse.json({ error: "Missing questionId" }, { status: 400 });

  const { data, error } = await db()
    .from("manager_response_history")
    .select("id, answer_text, answer_choice, answer_multi, uploaded_filename, changed_by_email, changed_by_name, changed_at")
    .eq("firm_id", user.firm_id)
    .eq("question_id", questionId)
    .order("changed_at", { ascending: false })
    .limit(50) as { data: HistoryRow[] | null; error: unknown };

  if (error) return NextResponse.json({ error: "Failed to load history" }, { status: 500 });

  return NextResponse.json({ history: data ?? [] });
}
