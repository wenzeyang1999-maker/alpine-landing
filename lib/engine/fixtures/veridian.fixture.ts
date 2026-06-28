/**
 * Veridian Alpha Fund — the REJECT in the corpus. Encoded from the real report.
 *
 * Manager: Veridian Capital Management Pty Ltd ("Veridian"), AUD263.5M AUM, 6 staff,
 * Sydney. Australian small-cap / pre-IPO + listed emerging companies (<AUD200M cap).
 * Overall: Reject. Stated chapter ratings: Manager/Reg/IT GREEN, Valuation Controls
 * RED. The Reject is driven by the valuation/asset-existence RED — ~95% of NAV in
 * unlisted positions priced internally with no external validation. This exercises
 * the contract + rubric at the asset-safety / Reject extreme.
 *
 * Chapters not explicitly rated in the source default to green here (fixture).
 */
import { Flag } from "../contract";
import { buildFixtureReport } from "./_helpers";

const RUN_ID = "run_veridian_fixture";

const FLAGS: Flag[] = [
  {
    id: "F1",
    chapterNum: 7, // Valuation and Investor Reporting (asset existence)
    title: "No external validation of internally-priced unlisted positions",
    severity: "high",
    timing: "required_before_close",
    provenance: "evidence",
    finding:
      "Unlisted assets represented 94.94% of the portfolio and are priced at fair value internally, with no third-party valuation agent appointed and no external validation aside from the annual audit.",
    evidence: [
      {
        id: "src_veridian_val",
        kind: "manager_answer",
        docName: "Veridian DDQ response",
        quote: "No external valuation agent has been appointed; pricing is performed internally.",
      },
    ],
    investorAction:
      "Require appointment of an independent third-party valuation agent to validate fair-value positions before close.",
    rag: "red",
  },
  {
    id: "F2",
    chapterNum: 7,
    title: "Valuation committee lacks majority of non-investment professionals",
    severity: "medium",
    timing: "post_close",
    provenance: "evidence",
    finding:
      "The valuation committee is not composed of a majority of non-investment professionals, creating an appearance of conflict over the committee's role in pricing.",
    evidence: [
      {
        id: "src_veridian_valcom",
        kind: "manager_answer",
        docName: "Veridian DDQ response",
        quote: "The valuation committee is composed of investment professionals.",
      },
    ],
    investorAction:
      "Recommend reconstituting the valuation committee with a majority of independent / non-investment members.",
    rag: "yellow",
  },
];

export const VERIDIAN_REPORT = buildFixtureReport({
  runId: RUN_ID,
  sku: "full",
  firm: {
    id: "veridian-alpha-fund",
    name: "Veridian Alpha Fund",
    strategy: "Australian small-cap / pre-IPO equity",
    domicile: "Australia",
    aum: "AUD263.5M",
  },
  overall: "red", // Reject — analyst escalation driven by the valuation red
  ratings: { 1: "green", 2: "green", 3: "green", 7: "red" },
  flags: FLAGS,
});
