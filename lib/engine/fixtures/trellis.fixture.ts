/**
 * Trellis Capital IV, L.P. — first ODDReport fixture, encoded from the real
 * hand-authored final report (20260616_Trellis Capital IV, L.P.).
 *
 * Purpose: validate the canonical contract against a REAL report (P0-T1), and
 * seed the OUTPUT half of the eval golden set (E2). This is a faithful structural
 * encoding — real firm identity, real per-chapter RAG ratings, a representative
 * subset of the 19 flags — with placeholder narrative prose (the schema test does
 * not need full prose; the remaining flags/narratives are transcribed during the
 * eval-seeding task).
 *
 * Trellis facts: pre-seed VC, Delaware LP, manager Trellis Capital Management LLC,
 * 7 FTEs, founders Arjun Mehta & Priya Sharma (50/50). Overall YELLOW.
 * Chapter RAG: 1 YELLOW · 2 RED · 3 RED · 4 GREEN · 5 GREEN · 6 YELLOW · 7 YELLOW · 8 GREEN.
 * NOTE: Ch2 (gating) is RED but overall is YELLOW — see lintODDReport / plan §4.3.
 */

import {
  ODDReport,
  ChapterReport,
  Flag,
  RAG,
  CHAPTER_MAP,
  Grounding,
  RatedNarrative,
} from "../contract";

const RUN_ID = "run_trellis_fixture";

const grounding = (verifier: Grounding["verifier"] = "verified"): Grounding => ({
  runId: RUN_ID,
  sources: [],
  confidence: "high",
  abstained: false,
  verifier,
});

const narrative = (html: string): RatedNarrative => ({ html, citations: [] });

// Per-chapter RAG from the real report, indexed by chapter number.
const RATINGS: Record<number, RAG> = {
  1: "yellow",
  2: "red",
  3: "red",
  4: "green",
  5: "green",
  6: "yellow",
  7: "yellow",
  8: "green",
};

// Representative flags (3 of 19). TODO(eval-seeding): transcribe the remaining 16.
const FLAGS: Flag[] = [
  {
    id: "F1",
    chapterNum: 2,
    title: "No dedicated Chief Compliance Officer",
    severity: "high",
    timing: "required_before_close",
    provenance: "evidence",
    finding:
      "The firm operates without a dedicated CCO; compliance is handled part-time by a founding partner.",
    evidence: [
      {
        id: "src_trellis_ppm_cco",
        kind: "manager_upload",
        docName: "Trellis Capital IV PPM.pdf",
        page: 22,
        quote: "The firm does not currently employ a dedicated Chief Compliance Officer.",
      },
    ],
    investorAction:
      "Obtain a committed timeline for appointing or outsourcing a dedicated CCO before close.",
    rag: "red",
  },
  {
    id: "F2",
    chapterNum: 3,
    title: "No formal business continuity / disaster recovery plan",
    severity: "high",
    timing: "required_before_close",
    provenance: "absence",
    finding:
      "No written BCP/DR plan was provided; the firm relies on ad hoc cloud backups with no tested recovery procedure.",
    evidence: [
      {
        id: "src_trellis_ddq_bcp",
        kind: "manager_answer",
        docName: "Trellis DDQ response",
        quote: "No formal BCP document exists at this time.",
      },
    ],
    investorAction: "Require a documented, tested BCP/DR plan as a condition of close.",
    rag: "red",
  },
  {
    id: "F3",
    chapterNum: 6,
    title: "Single authorized signatory on wire transfers",
    severity: "medium",
    timing: "post_close",
    provenance: "evidence",
    finding:
      "Wire transfers can be initiated and approved by a single founding partner; no dual-control policy is in place.",
    evidence: [
      {
        id: "src_trellis_ddq_wires",
        kind: "manager_answer",
        docName: "Trellis DDQ response",
        quote: "Wire approvals are performed by the managing partner.",
      },
    ],
    investorAction:
      "Recommend adoption of a contractual dual-signature policy for all external transfers.",
    rag: "yellow",
  },
];

const flagsByChapter = (n: number): string[] => FLAGS.filter((f) => f.chapterNum === n).map((f) => f.id);

const chapter = (num: number): ChapterReport => {
  const meta = CHAPTER_MAP[num - 1];
  const rating = RATINGS[num];
  return {
    num,
    title: meta.title,
    act: meta.act,
    rating,
    ratingRationale:
      rating === "green"
        ? "Controls in this area meet institutional expectations with no material gaps."
        : rating === "yellow"
          ? "Adequate but with watch-items that warrant monitoring or remediation."
          : "Material control gaps requiring remediation before close.",
    narrative: narrative("<p>[Trellis chapter " + num + " narrative — placeholder for fixture]</p>"),
    dataPoints: [],
    flagIds: flagsByChapter(num),
    grounding: grounding(),
  };
};

export const TRELLIS_REPORT: ODDReport = {
  schemaVersion: "odd.v1",
  runId: RUN_ID,
  sku: "full",
  firm: {
    id: "trellis-capital-iv",
    name: "Trellis Capital IV, L.P.",
    strategy: "Pre-seed Venture Capital",
    domicile: "Delaware, USA",
    aum: "$42M target",
  },
  overall: {
    rating: "yellow",
    preLaunchNote:
      "Pre-launch fund: several flagged items are expected to be resolved as the firm builds out its operational infrastructure ahead of first close.",
  },
  overview: narrative("<p>[Trellis overview — placeholder]</p>"),
  assessment: narrative("<p>[Trellis assessment memo — placeholder]</p>"),
  scopeVerification: [
    { item: "Manager regulatory registration", method: "SEC IAPD lookup", status: "neutral" },
    { item: "Fund administrator appointment", method: "Administrator confirmation", status: "green" },
  ],
  chapters: [1, 2, 3, 4, 5, 6, 7, 8].map(chapter),
  flags: FLAGS,
  remediation: FLAGS.map((f) => ({
    flagId: f.id,
    requirement: f.title,
    priority: f.severity,
    phase: f.timing,
    investorAction: f.investorAction,
  })),
  referenceData: [
    {
      title: "Manager Snapshot",
      rows: [
        { field: "Management Company", value: "Trellis Capital Management LLC", status: "neutral" },
        { field: "Headcount", value: "7 FTEs", status: "neutral" },
        { field: "Ownership", value: "Arjun Mehta 50% / Priya Sharma 50%", status: "neutral" },
      ],
    },
  ],
  sources: [],
  meta: {
    generatedAt: "2026-06-16T00:00:00Z",
    engineVersion: "fixture",
    frameworkVersion: "v3.2026.06",
    modelId: "hand-authored",
  },
};
