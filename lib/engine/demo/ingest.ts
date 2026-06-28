/**
 * Ingestion + retrieval for the valuation demo. Node runtime only.
 *  - fetch a filing from an SEC EDGAR URL, or accept uploaded HTML / PDF bytes
 *  - normalize to clean text (the citation substrate the quote-gate checks against)
 *  - retrieve candidate passages per question (term-windowed, ranked)
 */

const SEC_UA = "AlpineDD-Research admin@alpinedd.com";

// ── HTML entity decode (numeric + common named) ──────────────────────────────
const NAMED: Record<string, string> = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ",
  ldquo: "“", rdquo: "”", lsquo: "‘", rsquo: "’",
  mdash: "—", ndash: "–", hellip: "…",
};
function decodeEntities(s: string): string {
  return s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => safeChar(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => safeChar(parseInt(d, 10)))
    .replace(/&([a-z]+);/gi, (m, n) => (NAMED[n.toLowerCase()] !== undefined ? NAMED[n.toLowerCase()] : m));
}
function safeChar(code: number): string {
  try { return String.fromCodePoint(code); } catch { return " "; }
}

/** Strip tags + decode entities + collapse whitespace. Mirrors the python harness. */
export function normalizeFilingText(raw: string): string {
  let t = raw
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ");
  t = decodeEntities(t).replace(/​/g, "").replace(/ /g, " ");
  return t.replace(/\s+/g, " ").trim();
}

/** Extract text from an uploaded PDF (reuses pdfjs-dist legacy build, Node). */
export async function extractPdfText(bytes: Uint8Array): Promise<string> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pdfjs: any = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const doc = await pdfjs.getDocument({ data: bytes, isEvalSupported: false, useSystemFonts: false }).promise;
  const out: string[] = [];
  for (let p = 1; p <= doc.numPages; p++) {
    const page = await doc.getPage(p);
    const content = await page.getTextContent();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    out.push(content.items.map((it: any) => (typeof it.str === "string" ? it.str : "")).join(" "));
  }
  return out.join(" ").replace(/\s+/g, " ").trim();
}

export type IngestResult = { text: string; sourceLabel: string };

/** Fetch + normalize a filing from an SEC EDGAR document URL. */
export async function ingestFromUrl(url: string): Promise<IngestResult> {
  if (!/^https?:\/\/(www\.|efts\.)?sec\.gov\//i.test(url)) {
    throw new Error("Only SEC EDGAR (sec.gov) document URLs are supported for the live demo.");
  }
  const res = await fetch(url, { headers: { "user-agent": SEC_UA } });
  if (!res.ok) throw new Error("Could not fetch filing (" + res.status + ").");
  const raw = await res.text();
  return { text: normalizeFilingText(raw), sourceLabel: url.split("/").pop() || "SEC filing" };
}

/** Normalize an uploaded file (HTML or PDF). */
export async function ingestFromUpload(bytes: Uint8Array, filename: string): Promise<IngestResult> {
  const isPdf = /\.pdf$/i.test(filename) || (bytes.length > 4 && bytes[0] === 0x25 && bytes[1] === 0x50);
  const text = isPdf ? await extractPdfText(bytes) : normalizeFilingText(new TextDecoder().decode(bytes));
  return { text, sourceLabel: filename };
}

// ── Ticker resolution (codex #5) ─────────────────────────────────────────────
// A ticker resolves to a CIK, not a filing. So: ticker → CIK (company_tickers.json)
// → latest 10-K accession + primary doc (submissions API) → the document URL the
// extract route ingests. Keeps "type a ticker" working end to end.

export type ResolvedFiling = { url: string; name: string; cik: string; form: string; filingDate: string };

export async function resolveTicker(ticker: string): Promise<ResolvedFiling> {
  const t = ticker.trim().toUpperCase();
  if (!/^[A-Z][A-Z.\-]{0,9}$/.test(t)) throw new Error("Enter a stock ticker, for example ARCC.");

  // 1) ticker → CIK
  const tickRes = await fetch("https://www.sec.gov/files/company_tickers.json", { headers: { "user-agent": SEC_UA } });
  if (!tickRes.ok) throw new Error("Could not reach the SEC ticker directory (" + tickRes.status + ").");
  const map = (await tickRes.json()) as Record<string, { cik_str: number; ticker: string; title: string }>;
  let hit: { cik_str: number; ticker: string; title: string } | null = null;
  for (const k of Object.keys(map)) {
    if (map[k] && map[k].ticker === t) { hit = map[k]; break; }
  }
  if (!hit) throw new Error("Ticker " + t + " was not found in the SEC directory.");
  const cik10 = String(hit.cik_str).padStart(10, "0");

  // 2) CIK → latest 10-K
  const subRes = await fetch("https://data.sec.gov/submissions/CIK" + cik10 + ".json", { headers: { "user-agent": SEC_UA } });
  if (!subRes.ok) throw new Error("Could not reach SEC filings for " + t + " (" + subRes.status + ").");
  const sub = (await subRes.json()) as {
    name?: string;
    filings?: { recent?: { form?: string[]; accessionNumber?: string[]; primaryDocument?: string[]; filingDate?: string[] } };
  };
  const recent = sub.filings && sub.filings.recent;
  if (!recent || !recent.form) throw new Error("No filings found for " + t + ".");
  let idx = -1;
  for (let i = 0; i < recent.form.length; i++) {
    if (recent.form[i] === "10-K") { idx = i; break; }
  }
  if (idx < 0) throw new Error(t + " has no 10-K on file. This demo targets 10-K filers such as listed BDCs.");
  const accession = ((recent.accessionNumber && recent.accessionNumber[idx]) || "").replace(/-/g, "");
  const primary = (recent.primaryDocument && recent.primaryDocument[idx]) || "";
  if (!accession || !primary) throw new Error("Could not locate the 10-K document for " + t + ".");

  return {
    url: "https://www.sec.gov/Archives/edgar/data/" + hit.cik_str + "/" + accession + "/" + primary,
    name: sub.name || hit.title,
    cik: cik10,
    form: "10-K",
    filingDate: (recent.filingDate && recent.filingDate[idx]) || "",
  };
}

// ── Retrieval ────────────────────────────────────────────────────────────────

export type Passage = { text: string; start: number; end: number };

/**
 * Retrieve up to k candidate passages for a set of terms. Windows around each
 * match are ranked by how many distinct terms co-occur (denser context first),
 * then de-overlapped. The window text is a verbatim substring of `text`, so the
 * downstream quote-gate can verify any quote the LLM returns.
 */
export function retrievePassages(text: string, terms: string[], k = 4, win = 700): Passage[] {
  const found: Passage[] = [];
  for (const term of terms) {
    const re = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
    let m: RegExpExecArray | null;
    let count = 0;
    while ((m = re.exec(text)) !== null && count < 6) {
      const start = Math.max(0, m.index - Math.floor(win / 3));
      const end = Math.min(text.length, m.index + Math.floor((win * 2) / 3));
      found.push({ text: text.slice(start, end), start, end });
      count++;
    }
  }
  // rank by term density
  const lowerTerms = terms.map((t) => t.toLowerCase());
  const scored = found.map((p) => {
    const lc = p.text.toLowerCase();
    let score = 0;
    for (const t of lowerTerms) if (lc.indexOf(t) >= 0) score++;
    return { p, score };
  });
  scored.sort((a, b) => b.score - a.score || a.p.start - b.p.start);
  // de-overlap
  const picked: Passage[] = [];
  for (const { p } of scored) {
    if (picked.length >= k) break;
    if (picked.some((q) => p.start < q.end && p.end > q.start)) continue;
    picked.push(p);
  }
  return picked;
}
