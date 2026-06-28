/**
 * Pre-computed curated Ch4 results (T8, D4) — committed so the curated path renders
 * instantly, offline, and identically every time (the marquee demo never depends on a
 * live API call). Quotes are VERBATIM from each fund's cached SEC 10-K; a guard test
 * asserts they're still literal substrings of the source, so a stale fixture fails CI.
 *
 * Regenerate with: tsx scripts/build-curated-fixture.ts <CIK>  (runs the real extractor).
 * v1 is hand-authored from the cached filings (real verbatim quotes) so it ships without
 * an API key; provenance is recorded per fund so a fixture is never an unexplained blob.
 */
import { StrategyCode, ScopeTag } from "../../../manager/framework-full";
import { ChapterAnswer } from "../extract-llm";

export type CuratedFixture = {
  ticker: string;
  name: string;
  cik: string;
  sourceLabel: string;
  profile: { strategy: StrategyCode; scopes: ScopeTag[] };
  provenance: {
    sourceUrl: string;   // the real EDGAR document URL (.htm) for "Open on EDGAR"
    filingDate: string;  // e.g. "2026-02-04"
    model: string;
    promptVersion: string;
    codeVersion: string;
    schemaVersion: string;
    generatedAt: string;
  };
  extraction: Record<string, ChapterAnswer>; // keyed by frameworkId
};

// The 12 demo-bank questions, with their report-facing labels/sub-sections.
const META: Record<string, { label: string; sub: string }> = {
  "04.06.26": { label: "Corporate form / fund type", sub: "Legal Structure" },
  "04.06.25": { label: "Fund domicile", sub: "Legal Structure" },
  "04.06.27": { label: "Incorporation / commencement", sub: "Legal Structure" },
  "04.06.30": { label: "Fund structure (managed / listed)", sub: "Fund Structure" },
  "04.06.32": { label: "Subsidiaries / SPVs", sub: "Legal Structure" },
  "04.09.45": { label: "Total assets / AUM", sub: "AUM & Concentration" },
  "04.10.54": { label: "Externally managed / no employees", sub: "Administrator" },
  "04.11.55": { label: "Share classes / interests", sub: "Share Classes" },
  "04.04.15": { label: "Insider / adviser alignment", sub: "Insider Investment & Alignment" },
  "04.18.116": { label: "Base management fee", sub: "Management & Incentive Fee" },
  "04.18.117": { label: "Incentive fee", sub: "Management & Incentive Fee" },
  "04.18.118": { label: "Incentive-fee crystallization", sub: "Management & Incentive Fee" },
  "04.19.126": { label: "Hurdle / preferred return", sub: "Management & Incentive Fee" },
  "04.20.147": { label: "Expense cap / waiver", sub: "Other Fees & Expenses" },
  "04.20.157": { label: "Management fee offset", sub: "Other Fees & Expenses" },
  "04.20.159": { label: "Expense ratio", sub: "Other Fees & Expenses" },
  "04.17.114": { label: "Side letters / preferential terms", sub: "Side Letters" },
};

const DEFAULT_GAP: Record<string, string> = {
  "04.06.27": "Incorporation / commencement date confirmed on the analyst call.",
  "04.06.32": "Subsidiary / SPV structure confirmed on the analyst call.",
  "04.09.45": "Total assets reconciled from the financial statements on the analyst call.",
  "04.10.54": "Management / administration arrangement confirmed on the analyst call.",
  "04.18.117": "Income/capital-gains incentive structure; headline rate confirmed on the analyst call.",
  "04.18.118": "Crystallization period confirmed on the analyst call.",
  "04.19.126": "Hurdle / preferred return confirmed on the analyst call.",
  "04.20.147": "No expense cap clearly disclosed in the filing; confirmed on the analyst call.",
  "04.20.157": "Fee-offset arrangements confirmed on the analyst call / DDQ.",
  "04.20.159": "Expense ratio reconciled from the financial statements on the analyst call.",
  "04.11.55": "Share-class detail confirmed on the analyst call.",
  "04.04.15": "Insider ownership is disclosed in the proxy (DEF 14A), not this filing; confirmed on the call.",
  "04.17.114": "Registered funds rarely disclose side letters; confirmed on the analyst call / DDQ.",
};

/** Build a full 12-question extraction map: `answered` entries are grounded; the rest route. */
function build(src: string, answered: Record<string, { value: string; quote: string }>): Record<string, ChapterAnswer> {
  const out: Record<string, ChapterAnswer> = {};
  for (const id of Object.keys(META)) {
    const m = META[id];
    const a = answered[id];
    out[id] = a
      ? { questionId: id, label: m.label, subsection: m.sub, status: "answered", value: a.value, quote: a.quote, confidence: "high", sourceLabel: src, filingAnswerable: true }
      : { questionId: id, label: m.label, subsection: m.sub, status: "abstained", value: null, quote: null, confidence: "low", sourceLabel: src, filingAnswerable: true, gap: DEFAULT_GAP[id] ?? "Confirmed on the analyst call." };
  }
  return out;
}

const arcc: CuratedFixture = {
  ticker: "ARCC", name: "Ares Capital Corporation", cik: "0001287750", sourceLabel: "ARCC 10-K",
  profile: { strategy: "credit", scopes: ["closed_ended"] },
  provenance: { sourceUrl: "https://www.sec.gov/Archives/edgar/data/1287750/000128775026000006/arcc-20251231.htm", filingDate: "2026-02-04", model: "hand-authored from cached 10-K (v1)", promptVersion: "ch4-extract-v1", codeVersion: "demo-engine-v1", schemaVersion: "ch4.demo.v1", generatedAt: "2026-06-26T00:00:00Z" },
  extraction: build("ARCC 10-K", {
    "04.06.26": { value: "Closed-end, non-diversified BDC (Maryland corporation)", quote: "specialty finance company that is a closed-end, non-diversified management investment company" },
    "04.06.25": { value: "Maryland", quote: "Maryland corporation" },
    "04.06.27": { value: "Founded Apr 16, 2004; IPO 2004", quote: "founded on April 16, 2004, were initially funded on June 23, 2004" },
    "04.06.30": { value: "Externally managed; NASDAQ-listed", quote: "Our common stock is traded on The NASDAQ" },
    "04.06.32": { value: "Yes (consolidated CLO/SPV subsidiaries)", quote: "consolidated subsidiary, Ares Direct Lending CLO 1 LLC" },
    "04.09.45": { value: "$31.2bn total assets", quote: "$31.2 billion of total assets" },
    "04.10.54": { value: "Externally managed; no employees", quote: "do not currently have any employees and do not expect to have any employees" },
    "04.18.116": { value: "1.5% of total assets", quote: "annual rate of 1.5% based on the average value of our total assets" },
    "04.18.118": { value: "Quarterly (in arrears)", quote: "payable quarterly in arrears" },
    "04.19.126": { value: "1.75% per quarter", quote: "hurdle rate of 1.75%" },
    "04.20.159": { value: "13.76% of net assets (gross)", quote: "Total annual expenses 13.76" },
  }),
};

const bxsl: CuratedFixture = {
  ticker: "BXSL", name: "Blackstone Secured Lending Fund", cik: "0001736035", sourceLabel: "BXSL 10-K",
  profile: { strategy: "credit", scopes: ["closed_ended"] },
  provenance: { sourceUrl: "https://www.sec.gov/Archives/edgar/data/1736035/000173603526000004/bxsl-20251231.htm", filingDate: "2026-02-25", model: "hand-authored from cached 10-K (v1)", promptVersion: "ch4-extract-v1", codeVersion: "demo-engine-v1", schemaVersion: "ch4.demo.v1", generatedAt: "2026-06-26T00:00:00Z" },
  extraction: build("BXSL 10-K", {
    "04.06.26": { value: "Closed-end BDC", quote: "closed-end management investment company that has elected to be regulated as a business development company" },
    "04.06.25": { value: "Delaware", quote: "Delaware statutory trust" },
    "04.06.27": { value: "Formed Mar 26, 2018", quote: "formed on March 26, 2018" },
    "04.06.30": { value: "Externally managed; NYSE-listed", quote: "traded on the NYSE under the symbol" },
    "04.06.32": { value: "Yes, wholly-owned consolidated SPV (formed 2019)", quote: "wholly-owned and consolidated subsidiary that was formed in 2019" },
    "04.10.54": { value: "Externally managed; no employees", quote: "do not currently have any employees" },
    "04.18.116": { value: "1.0% of gross assets", quote: "annual rate of 1.0% of the average value of our gross assets" },
    "04.18.117": { value: "17.5%", quote: "incentive fee of 17.5%" },
    "04.18.118": { value: "Quarterly (in arrears)", quote: "payable quarterly in arrears" },
  }),
};

const obdc: CuratedFixture = {
  ticker: "OBDC", name: "Blue Owl Capital Corporation", cik: "0001655888", sourceLabel: "OBDC 10-K",
  profile: { strategy: "credit", scopes: ["closed_ended"] },
  provenance: { sourceUrl: "https://www.sec.gov/Archives/edgar/data/1655888/000165588826000010/obdc-20251231.htm", filingDate: "2026-02-18", model: "hand-authored from cached 10-K (v1)", promptVersion: "ch4-extract-v1", codeVersion: "demo-engine-v1", schemaVersion: "ch4.demo.v1", generatedAt: "2026-06-26T00:00:00Z" },
  extraction: build("OBDC 10-K", {
    "04.06.26": { value: "BDC (regulated under the 1940 Act)", quote: "elected to be regulated as a business development company" },
    "04.06.25": { value: "Maryland", quote: "Maryland corporation" },
    "04.06.27": { value: "Formed Oct 15, 2015 (Maryland)", quote: "formed on October 15, 2015, as a corporation under the laws of the State of Maryland" },
    "04.06.30": { value: "Externally managed; NYSE-listed", quote: "listed on the NYSE under the symbol" },
    "04.06.32": { value: "Yes (wholly-owned subsidiaries)", quote: "wholly-owned subsidiary of the Company" },
    "04.09.45": { value: "$17.19bn total assets", quote: "$17.19 billion in total assets" },
    "04.10.54": { value: "Externally managed; no employees", quote: "do not currently have any employees" },
    "04.18.116": { value: "1.5% of gross assets", quote: "1.5% of our average gross assets" },
    "04.18.117": { value: "17.5%", quote: "incentive fee of 17.5%" },
    "04.18.118": { value: "Quarterly (in arrears)", quote: "payable quarterly in arrears" },
    "04.20.159": { value: "13.3% of net assets (gross)", quote: "Total Annual Expenses 13.3" },
  }),
};

export const CURATED_CH4: Record<string, CuratedFixture> = { ARCC: arcc, BXSL: bxsl, OBDC: obdc };

export function getCuratedCh4(ticker: string): CuratedFixture | null {
  return CURATED_CH4[ticker.toUpperCase()] ?? null;
}
