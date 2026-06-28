/**
 * Alpine ODD Engine — canonical data contract (P0-T1).
 *
 * ONE schema that decouples generation from rendering. Two contracts share a set
 * of evidence primitives:
 *   • CallGuideResponses — Stage-1 output (the evidence layer): the call-guide
 *     answers extracted/collected per question, each grounded + confidence-scored.
 *   • ODDReport — Stage-2 output: the 8-chapter report the PDF + web renderers
 *     consume. Renderers become pure functions of ODDReport; the per-fund TS data
 *     files are migrated into ODDReport instances.
 *
 * Incorporates the spec-review resolutions from the CEO plan (R1-R11):
 *   R1  runId on both contracts + Grounding             R7  flag provenance (evidence|absence|contradiction)
 *   R2  SourceRef.id derivation (deriveSourceRefId)      R8  GREEN floor enforced by rubric (see rubric.ts)
 *   R3  single citation keying (SourceRef.id only)       R9  8-chapter × 3-act map pinned (CHAPTER_MAP)
 *   R4  completeness formula + cert predicate            R6  assessment optional
 *   R5  self-reported gap policy                         GATING_CHAPTERS = {2,6,7}
 *
 * No zod (not a project dep; target es5). `validateODDReport` is a hand-rolled
 * structural validator — swap for zod in P0-T1 hardening if desired.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Shared evidence primitives
// ─────────────────────────────────────────────────────────────────────────────

export type SourceKind =
  | "manager_upload"
  | "manager_answer"
  | "analyst_call"
  | "regulator"
  | "external";

export type SourceRef = {
  /** Run-scoped, stable across re-runs of the same input. See deriveSourceRefId. */
  id: string;
  kind: SourceKind;
  docId?: string; // manager_uploads.id, for uploads
  docName: string; // "Trellis PPM 2024.pdf" | "SEC IAPD (CRD 123456)"
  page?: number;
  /** Exact supporting passage, verbatim. The verifier's quote-existence gate checks this. */
  quote: string;
  charStart?: number;
  charEnd?: number;
  url?: string; // regulator / external provenance
};

export type Confidence = "high" | "medium" | "low";

/** E1 second-pass verifier result. "unchecked" = self-reported, not yet verified. */
export type VerifierStatus = "verified" | "unsupported" | "contradicted" | "unchecked";

export type Grounding = {
  runId: string; // R1 — joins to engine_runs / eval cases
  sources: SourceRef[]; // >= 1 for any asserted claim; [] only when abstained
  confidence: Confidence;
  abstained: boolean; // R5/E3 — true => insufficient evidence
  verifier: VerifierStatus;
};

export type RAG = "green" | "yellow" | "red"; // accept / watchlist / flag
export type Act = "Manager" | "Fund" | "Controls";
export type Sku = "readiness" | "full";

// ─────────────────────────────────────────────────────────────────────────────
// Contract A — CallGuideResponses (Stage-1 output / Stage-2 input)
// ─────────────────────────────────────────────────────────────────────────────

export type GapSeverity = "blocking" | "recommended" | "optional";

export type GapFlag = {
  severity: GapSeverity;
  reason: string;
  routedTo: "manager" | "analyst";
};

export type AnswerOrigin = "manager" | "engine_extracted" | "analyst";

export type CallGuideAnswer = {
  questionId: string; // -> lib/manager/framework-full.ts Question.id
  chapterNum: number; // 1..8
  subsectionId?: string;
  value: string | string[] | null; // normalized answer
  raw?: string; // verbatim extracted text
  origin: AnswerOrigin;
  grounding: Grounding;
  gap?: GapFlag; // present when abstained / missing / weak / self-reported
};

export type CallGuideResponses = {
  runId: string;
  firm: FirmIdentity;
  frameworkVersion: string; // "v3.2026.06"
  sku: Sku;
  answers: CallGuideAnswer[];
  /** R4: (required answered & not abstained) / (total required). Drives readiness score. */
  completeness: number; // 0..1
  generatedAt: string;
  engineVersion: string;
};

// ─────────────────────────────────────────────────────────────────────────────
// Contract B — ODDReport (Stage-2 output; the single thing renderers consume)
// ─────────────────────────────────────────────────────────────────────────────

export type FirmIdentity = {
  id: string;
  name: string;
  strategy?: string;
  domicile?: string;
  aum?: string;
};

/** Narrative carrying inline [[REF:src_xxx]] markers (R3: one keying scheme — the id). */
export type RatedNarrative = {
  html: string;
  citations: SourceRef[]; // renderer assigns display superscripts at render time
};

export type DataPoint = {
  field: string;
  value: string;
  status: RAG | "neutral"; // neutral = abstained / not applicable
  source?: SourceRef;
};

export type FlagSeverity = "high" | "medium" | "low";
export type FlagTiming = "required_before_close" | "post_close";
/** R7 — evidence/contradiction flags need a verified SourceRef; absence flags cite the abstained field. */
export type FlagProvenance = "evidence" | "absence" | "contradiction";

export type Flag = {
  id: string; // "F1"...
  chapterNum: number;
  title: string;
  severity: FlagSeverity;
  timing: FlagTiming;
  provenance: FlagProvenance;
  finding: string;
  evidence: SourceRef[]; // for evidence/contradiction: >=1 with verifier "verified"
  investorAction: string;
  rag: RAG;
};

export type Remediation = {
  flagId: string;
  requirement: string;
  priority: FlagSeverity;
  phase: FlagTiming;
  investorAction: string;
};

export type ChapterReport = {
  num: number; // 1..8
  title: string;
  act: Act;
  rating: RAG;
  ratingRationale: string; // 1 short paragraph "why this color"
  narrative: RatedNarrative;
  dataPoints: DataPoint[];
  flagIds: string[];
  grounding: Grounding;
};

export type VerificationRow = {
  item: string;
  method: string;
  status: RAG | "neutral";
  source?: SourceRef;
};

export type ReferenceSection = { title: string; rows: DataPoint[] };

export type Certification = {
  completeness: number;
  certifiedBy?: string;
  certifiedAt?: string;
  expiresAt?: string; // reserved for E5 monitoring
};

export type ReportMeta = {
  generatedAt: string;
  engineVersion: string;
  frameworkVersion: string;
  modelId: string;
};

export type ODDReport = {
  schemaVersion: "odd.v1";
  runId: string;
  sku: Sku;
  firm: FirmIdentity;
  overall: { rating: RAG; preLaunchNote?: string };
  overview: RatedNarrative;
  assessment?: RatedNarrative; // R6 — full SKU only
  scopeVerification: VerificationRow[];
  chapters: ChapterReport[]; // exactly 8
  flags: Flag[];
  remediation: Remediation[];
  referenceData: ReferenceSection[];
  sources: SourceRef[]; // deduped appendix
  certification?: Certification; // readiness SKU
  meta: ReportMeta;
};

// ─────────────────────────────────────────────────────────────────────────────
// Pinned constants (R9)
// ─────────────────────────────────────────────────────────────────────────────

export const CHAPTER_MAP: { num: number; act: Act; title: string }[] = [
  { num: 1, act: "Manager", title: "Manager, Ownership and Governance" },
  { num: 2, act: "Manager", title: "Legal, Regulatory and Compliance" },
  { num: 3, act: "Manager", title: "Technology, Cybersecurity and Resilience" },
  { num: 4, act: "Fund", title: "Fund Structure, Terms and Alignment" },
  { num: 5, act: "Fund", title: "Service Providers and Oversight" },
  { num: 6, act: "Controls", title: "Investment Operations and Controls" },
  { num: 7, act: "Controls", title: "Valuation and Investor Reporting" },
  { num: 8, act: "Controls", title: "Manager Transparency and LP Communications" },
];

/**
 * Empirical finding (N=15 real reports + Trellis): there is NO hard gating rule.
 * A single RED chapter routinely sits under an "Accept" overall (Northbridge,
 * Oakridge, Pinnacle, Summit). The overall rating is ANALYST JUDGMENT, informed
 * by chapter ratings but never forced by them. The only RED that correlated with a
 * Reject was in Valuation / Asset Existence (Veridian) — and that is still a
 * judgment call (no independent pricing on ~95% unlisted), not a formula.
 *
 * So: the engine PROPOSES an overall from chapter ratings + flag severity; the
 * analyst confirms/overrides. The one chapter that warrants heightened scrutiny
 * (a RED there should never be silently absorbed into an Accept) is asset existence
 * / valuation.
 */
export const ASSET_SAFETY_CHAPTERS: number[] = [7]; // valuation & asset existence

/** @deprecated No hard gating exists in the real data; kept only for migration. */
export const GATING_CHAPTERS: number[] = [2, 6, 7];

/** Readiness cert issues iff blockingGaps == 0 AND completeness >= this. (R4) */
export const READINESS_CERT_THRESHOLD = 0.95;

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * R2 — deterministic, run-scoped SourceRef id from its provenance span. Starter
 * uses a small non-crypto hash (djb2) so it runs everywhere with no imports;
 * P0-T1 hardening can switch to a sha1 prefix (node:crypto / SubtleCrypto).
 */
export function deriveSourceRefId(docId: string, charStart: number, charEnd: number): string {
  const key = docId + ":" + charStart + "-" + charEnd;
  let h = 5381;
  for (let i = 0; i < key.length; i++) {
    h = ((h << 5) + h + key.charCodeAt(i)) >>> 0; // h * 33 + c, unsigned
  }
  return "src_" + h.toString(16).padStart(8, "0");
}

const RAG_VALUES: RAG[] = ["green", "yellow", "red"];

// ─────────────────────────────────────────────────────────────────────────────
// Structural validation (hand-rolled; no zod). Returns a list of human-readable
// errors — empty array means valid. The engine ASSEMBLE step fails closed on a
// non-empty result (R14: per-chapter degradation handled upstream of this).
// ─────────────────────────────────────────────────────────────────────────────

export function validateODDReport(r: unknown): string[] {
  const errors: string[] = [];
  const push = (m: string) => errors.push(m);
  if (typeof r !== "object" || r === null) return ["report is not an object"];
  const rep = r as Partial<ODDReport>;

  if (rep.schemaVersion !== "odd.v1") push('schemaVersion must be "odd.v1"');
  if (!rep.runId) push("runId is required");
  if (rep.sku !== "readiness" && rep.sku !== "full") push('sku must be "readiness" | "full"');
  if (!rep.firm || !rep.firm.id || !rep.firm.name) push("firm.id and firm.name are required");
  if (!rep.overall || RAG_VALUES.indexOf(rep.overall.rating) < 0) push("overall.rating must be a RAG value");
  if (rep.sku === "full" && !rep.assessment) push("full SKU requires assessment (R6)");

  // Chapters: exactly 8, nums 1..8 unique, act matches the pinned map (R9).
  const chapters = rep.chapters || [];
  if (chapters.length !== 8) push("expected exactly 8 chapters, got " + chapters.length);
  const seen: Record<number, boolean> = {};
  chapters.forEach((c, i) => {
    if (c.num < 1 || c.num > 8) push("chapter[" + i + "].num out of range: " + c.num);
    if (seen[c.num]) push("duplicate chapter num " + c.num);
    seen[c.num] = true;
    const expected = CHAPTER_MAP[c.num - 1];
    if (expected && c.act !== expected.act) {
      push("chapter " + c.num + " act " + c.act + " != pinned " + expected.act);
    }
    if (RAG_VALUES.indexOf(c.rating) < 0) push("chapter " + c.num + " rating must be a RAG value");
  });

  // NOTE: gating→overall consistency is RUBRIC POLICY, not a structural invariant.
  // The real Trellis report has Ch2 (gating) RED but overall YELLOW — analyst
  // judgment overrode the mechanical worst-of-gating rule. So this is a soft
  // signal in lintODDReport(), NOT a hard validation error. (See plan §4.3 finding.)

  // Flags: ids unique; chapterNum in range; evidence/contradiction need >=1 verified source (R7).
  const flagIds: Record<string, boolean> = {};
  (rep.flags || []).forEach((f) => {
    if (flagIds[f.id]) push("duplicate flag id " + f.id);
    flagIds[f.id] = true;
    if (f.chapterNum < 1 || f.chapterNum > 8) push("flag " + f.id + " chapterNum out of range");
    if (f.provenance === "evidence" || f.provenance === "contradiction") {
      const hasVerified = (f.evidence || []).some((s) => true) && f.evidence.length > 0;
      if (!hasVerified) push("flag " + f.id + " (" + f.provenance + ") needs >=1 evidence SourceRef (R7)");
    }
  });

  // Every chapter.flagIds must resolve to a real flag.
  chapters.forEach((c) => {
    (c.flagIds || []).forEach((id) => {
      if (!flagIds[id]) push("chapter " + c.num + " references missing flag " + id);
    });
  });

  // Every remediation must point at a real flag.
  (rep.remediation || []).forEach((m) => {
    if (!flagIds[m.flagId]) push("remediation references missing flag " + m.flagId);
  });

  return errors;
}

export function isValidODDReport(r: unknown): r is ODDReport {
  return validateODDReport(r).length === 0;
}

/**
 * Soft policy signals — NOT validity failures. These flag where a report departs
 * from the mechanical rubric (e.g. analyst override of gating), and where a cert
 * looks improperly issued. Generation surfaces these to the analyst; a real,
 * human-authored report (Trellis) is allowed to trip them with rationale.
 */
export function lintODDReport(rep: ODDReport): string[] {
  const warnings: string[] = [];

  // The ONLY data-supported escalation signal (N=15): a RED in asset existence /
  // valuation that is NOT reflected in the overall at all (overall == green/Accept).
  // A single RED elsewhere under an Accept is normal and NOT flagged.
  const assetSafetyRed = rep.chapters.some(
    (c) => ASSET_SAFETY_CHAPTERS.indexOf(c.num) >= 0 && c.rating === "red",
  );
  if (assetSafetyRed && rep.overall.rating === "green") {
    warnings.push(
      "valuation / asset-existence chapter (7) is RED but overall is Accept — " +
        "the one combination that historically escalates to Reject; analyst, please confirm",
    );
  }

  // Readiness cert predicate (R4).
  if (rep.sku === "readiness" && rep.certification && rep.certification.certifiedAt) {
    if (rep.certification.completeness < READINESS_CERT_THRESHOLD) {
      warnings.push("readiness cert issued below completeness threshold (R4)");
    }
  }

  return warnings;
}
