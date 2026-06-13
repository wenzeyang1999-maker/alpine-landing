import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { getCurrentManager } from "@/lib/manager/access";

// NOTE: manager_ai_quota table + increment_ai_quota() function are not part of
// the migrated schema (migration 034 was never applied to the source DB), so
// these queries degrade gracefully via raw SQL + try/catch, preserving the
// prior production behavior (GET → 0/20 default, POST → error if absent).

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
