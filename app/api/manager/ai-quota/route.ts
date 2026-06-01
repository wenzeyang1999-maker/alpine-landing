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

export async function GET() {
  const user = await getCurrentManager();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const firmId = user.firm_id;

  const { data } = await db()
    .from("manager_ai_quota")
    .select("runs_used, max_runs")
    .eq("firm_id", firmId)
    .maybeSingle();

  const runsUsed = data?.runs_used ?? 0;
  const maxRuns = data?.max_runs ?? 20;

  return NextResponse.json({ runsUsed, maxRuns, remaining: maxRuns - runsUsed });
}

export async function POST() {
  const user = await getCurrentManager();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await db().rpc("increment_ai_quota", { p_firm_id: user.firm_id });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (data === -1) {
    return NextResponse.json(
      { error: "quota_exceeded", message: "You've used all 20 AI draft runs. Contact us at team@alpinedd.com to reset your quota." },
      { status: 429 }
    );
  }

  return NextResponse.json({ ok: true, runsUsed: data, maxRuns: 20, remaining: 20 - data });
}
