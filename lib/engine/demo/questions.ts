/**
 * Shared question shape for the demo extractor. A DemoQuestion is one call-guide
 * line item the Stage-1 extractor tries to ground in a filing (or honestly abstain).
 * Chapter sets (ch4-questions, ch7-questions) are concrete instances of this type so
 * the ingest → extract → gate → generate pipeline is chapter-agnostic.
 */
export type DemoQuestion = {
  id: string;
  /**
   * The REAL call-guide question id this extraction targets (e.g. "04.18.116").
   * The demo bank is kept separate from the framework (parallel bank, D5); this field
   * is the edge mapping back to the canonical question. A test asserts every frameworkId
   * exists in the framework so the two banks cannot silently drift. Optional only
   * because Ch7 (not yet transcribed into the framework) predates this mapping; the
   * active Ch4 bank sets it on every entry and a test enforces that.
   */
  frameworkId?: string;
  chapterNum: number;
  subsection: string; // report-facing sub-section label
  label: string; // short question label
  /** What the LLM must extract (the instruction). Always require a verbatim quote or abstain. */
  ask: string;
  /** Terms used to retrieve candidate passages from the filing. */
  retrievalTerms: string[];
  /** Preferred source document for this field. */
  docPref: "tenk" | "prospectus";
  /** True if a filing typically answers this; false = expected to abstain → call/DDQ. */
  filingAnswerable: boolean;
};

/** The few curated funds we pre-run for an instant, polished first impression. */
export const CURATED_FUNDS = [
  { cik: "0001287750", ticker: "ARCC", name: "Ares Capital Corporation" },
  { cik: "0001736035", ticker: "BXSL", name: "Blackstone Secured Lending Fund" },
  { cik: "0001655888", ticker: "OBDC", name: "Blue Owl Capital Corporation" },
];

/** Demo chapter registry → report title + question set, resolved at runtime. */
export const DEMO_CHAPTERS: Record<number, { title: string }> = {
  4: { title: "Fund Structure, Terms & Alignment" },
  7: { title: "Valuation, Asset Existence & Investor Reporting" },
};
