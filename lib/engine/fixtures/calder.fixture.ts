/**
 * Calder Global Emerging Markets Fund — the WatchList in the corpus.
 *
 * Overall: WatchList. Stated chapter ratings: Manager / Fund / IT / Asset Controls /
 * Trading Controls / Valuation Controls GREEN, Manager Transparency (Ch8) RED. A
 * single NON-asset-safety red sitting under a WatchList overall — exercises the
 * "engine proposes Accept, analyst escalated to WatchList" path (mustConfirm).
 *
 * Chapters not explicitly rated in the source default to green here (fixture).
 */
import { Flag } from "../contract";
import { buildFixtureReport } from "./_helpers";

const RUN_ID = "run_calder_fixture";

const FLAGS: Flag[] = [
  {
    id: "F1",
    chapterNum: 8, // Manager Transparency and LP Communications
    title: "Limited manager transparency / LP communications",
    severity: "high",
    timing: "post_close",
    provenance: "evidence",
    finding:
      "Weaknesses in manager transparency and LP communications drive the red rating for this chapter.",
    evidence: [
      {
        id: "src_calder_transparency",
        kind: "manager_answer",
        docName: "Calder DDQ response",
        quote: "[fixture: transparency finding excerpt]",
      },
    ],
    investorAction: "Investors are encouraged to monitor developments in manager transparency.",
    rag: "red",
  },
];

export const CALDER_REPORT = buildFixtureReport({
  runId: RUN_ID,
  sku: "full",
  firm: {
    id: "calder-global-em-fund",
    name: "Calder Global Emerging Markets Fund",
    strategy: "Global Emerging Markets Equity",
  },
  overall: "yellow", // WatchList — analyst escalation from the Ch8 red
  ratings: { 8: "red" },
  flags: FLAGS,
});
