/**
 * Curated Ch4 result (T11, D4). GET ?ticker=ARCC → the pre-computed, offline-proof guide.
 * Gated server-side; instant (no API call). Reconciles to 164 every time.
 */
import { NextResponse } from "next/server";
import { isGatedRequestOk } from "@/lib/engine/demo/gate";
import { getCuratedCh4 } from "@/lib/engine/demo/fixtures/curated-ch4";
import { getCh4Report } from "@/lib/engine/demo/fixtures/ch4-report";

export const runtime = "nodejs";

/** Returns the raw extraction + profile + the Stage-2 Ch4 report (prefilled call guide + narrative). */
export async function GET(req: Request) {
  if (!(await isGatedRequestOk(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const ticker = new URL(req.url).searchParams.get("ticker") ?? "";
  const fixture = getCuratedCh4(ticker);
  if (!fixture) return NextResponse.json({ error: "Unknown curated fund" }, { status: 404 });
  const report = getCh4Report(ticker);

  return NextResponse.json(
    {
      fund: { ticker: fixture.ticker, name: fixture.name },
      sourceLabel: fixture.sourceLabel,
      sourceUrl: fixture.provenance.sourceUrl,
      profile: { strategy: fixture.profile.strategy, scopes: fixture.profile.scopes, provisional: false, evidence: null },
      extraction: fixture.extraction,
      report, // { rating, ratingLabel, flagsFired, fields, narrative } | null
      curated: true,
      // Capability flag (codex #10): the UI gates the bring-your-own input on this. Live
      // analysis is LLM-driven, so it requires a server key; absent it, only curated funds run.
      liveEnabled: !!process.env.ANTHROPIC_API_KEY,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
