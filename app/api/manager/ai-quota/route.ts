import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { getCurrentManager } from "@/lib/manager/access";

// Backed by public.manager_ai_quota + increment_ai_quota() (migration 034,
// applied to Azure). Raw SQL is kept for the atomic SECURITY DEFINER function
// call; GET still defaults to 0/20 if a firm has no row yet.

export async function GET() {
  const user = await getCurrentManager();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const firmId = user.firm_id;

  let runsUsed = 0;
  let maxRuns = 20;
  try {
    const rows = (await db.execute(
      sql`SELECT runs_used, max_runs FROM manager_ai_quota WHERE firm_id = ${firmId}`
    )) as unknown as { runs_used: number; max_runs: number }[];
    if (rows[0]) {
      runsUsed = rows[0].runs_used ?? 0;
      maxRuns = rows[0].max_runs ?? 20;
    }
  } catch {
    // table absent — fall through to defaults
  }

  return NextResponse.json({ runsUsed, maxRuns, remaining: maxRuns - runsUsed });
}

export async function POST() {
  const user = await getCurrentManager();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let data: number;
  try {
    const rows = (await db.execute(
      sql`SELECT increment_ai_quota(${user.firm_id}) AS v`
    )) as unknown as { v: number }[];
    data = rows[0]?.v;
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }

  if (data === -1) {
    return NextResponse.json(
      { error: "quota_exceeded", message: "You've used all 20 AI draft runs. Contact us at team@alpinedd.com to reset your quota." },
      { status: 429 }
    );
  }

  return NextResponse.json({ ok: true, runsUsed: data, maxRuns: 20, remaining: 20 - data });
}
