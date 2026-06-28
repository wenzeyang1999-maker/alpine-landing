/**
 * Citation context (for the "see the original document + exact sentence" popover).
 * GET ?ticker=ARCC&q=<verbatim quote> → the surrounding sentence(s) from the fund's cached
 * filing, with the quote located inside, plus the EDGAR source link. Gated server-side.
 *
 * Reads the same normalized filing the quote-gate checked against, so the context shown is
 * the real document text. Falls back to the quote alone if the corpus isn't on disk.
 */
import { NextResponse } from "next/server";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { isGatedRequestOk } from "@/lib/engine/demo/gate";
import { CURATED_FUNDS } from "@/lib/engine/demo/questions";
import { getCuratedCh4 } from "@/lib/engine/demo/fixtures/curated-ch4";

export const runtime = "nodejs";

/** Expand to sentence boundaries around [start,end) within text. */
function sentenceWindow(text: string, start: number, end: number): string {
  const left = Math.max(0, start - 400);
  const right = Math.min(text.length, end + 400);
  const before = text.slice(left, start);
  const after = text.slice(end, right);
  // snap left to the start of the sentence (after the previous ". ")
  const bMatch = before.lastIndexOf(". ");
  const lead = bMatch >= 0 ? before.slice(bMatch + 2) : before.replace(/^\S*\s/, "");
  // snap right to the end of the sentence (the next ". ")
  const aMatch = after.indexOf(". ");
  const trail = aMatch >= 0 ? after.slice(0, aMatch + 1) : after.replace(/\s\S*$/, "");
  return (lead + text.slice(start, end) + trail).trim();
}

export async function GET(req: Request) {
  if (!(await isGatedRequestOk(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const url = new URL(req.url);
  const ticker = (url.searchParams.get("ticker") ?? "").toUpperCase();
  const q = url.searchParams.get("q") ?? "";
  const fund = CURATED_FUNDS.find((f) => f.ticker === ticker);
  const fixture = getCuratedCh4(ticker);
  const sourceLabel = fixture?.sourceLabel ?? `${ticker} filing`;
  const sourceUrl = fixture?.provenance.sourceUrl ?? "";

  // The enclosing 10-K "Item N." is not reliably locatable in the normalized stream
  // (the same markers appear in the TOC, cross-references and exhibit lists), and a wrong
  // section heading would undermine the grounded-not-invented story. The panel labels the
  // card with the call-guide topic the passage answers instead, which we know for certain.
  let context = q;
  if (fund && q) {
    for (const doc of ["tenk", "prospectus"]) {
      const p = join(process.cwd(), "lib/engine/.data/stage1/funds", fund.cik, `${doc}.norm.txt`);
      if (!existsSync(p)) continue;
      const text = readFileSync(p, "utf8");
      const i = text.indexOf(q);
      if (i >= 0) { context = sentenceWindow(text, i, i + q.length); break; }
    }
  }
  return NextResponse.json(
    {
      context, quote: q, ticker,
      sourceLabel, sourceUrl,
      filingDate: fixture?.provenance.filingDate ?? "",
      docType: "Form 10-K",
      name: fixture?.name ?? ticker,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
