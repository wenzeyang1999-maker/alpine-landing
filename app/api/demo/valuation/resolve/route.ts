/**
 * Ticker resolution (codex #5). GET ?ticker=ARCC → the latest 10-K document URL + provenance,
 * so the UI can show "found: <name> 10-K filed <date>" and then hand the URL to /extract. A
 * ticker only maps to a CIK; this route walks CIK → latest 10-K primary document on EDGAR.
 * Gated. Public SEC data only.
 */
import { isGatedRequestOk } from "@/lib/engine/demo/gate";
import { resolveTicker } from "@/lib/engine/demo/ingest";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!(await isGatedRequestOk(req))) return Response.json({ error: "Unauthorized" }, { status: 401 });
  let ticker = "";
  try {
    ticker = String(((await req.json()) as { ticker?: unknown }).ticker ?? "").trim();
  } catch {
    return Response.json({ error: "Bad request" }, { status: 400 });
  }
  if (!ticker) return Response.json({ error: "Enter a stock ticker, for example ARCC." }, { status: 400 });
  try {
    const resolved = await resolveTicker(ticker);
    return Response.json(resolved, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : "Could not resolve that ticker." }, { status: 400 });
  }
}
