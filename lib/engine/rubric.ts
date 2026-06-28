/**
 * Alpine ODD rubric (P0-T2) — ratings & flags computed by CODE, not the model.
 *
 * Calibrated from 15 real reports. The central finding (see contract.ts): the
 * overall rating is ANALYST JUDGMENT — the engine PROPOSES, it does not force.
 * Functions return proposals + rationale + `mustConfirm`, never a final verdict.
 *
 * Pipeline use: the model proposes candidate findings/flags; this module classifies
 * severity/timing and rolls chapter + overall ratings; the model writes only the
 * rationale prose (in house style — see style.ts).
 */

import { RAG, ASSET_SAFETY_CHAPTERS, FlagSeverity, FlagTiming } from "./contract";

// ─────────────────────────────────────────────────────────────────────────────
// Per-data-point status (the dots). Seeded lookup keyed by framework questionId.
// Default: unknown field => neutral (and raises a gap upstream).
// ─────────────────────────────────────────────────────────────────────────────

type StatusRule = { green?: string[]; yellow?: string[]; red?: string[] };

/** Field-level status rules (extend during P0-T2 calibration from the 15 reports). */
export const FIELD_STATUS: Record<string, StatusRule> = {
  "03.04.25": { green: ["Yes"], red: ["No"] }, // follows a cyber framework
  "03-mfa": { green: ["Yes, all systems"], yellow: ["Some systems only"], red: ["No"] },
  "03-security-frameworks": { green: ["SOC 2 Type II", "ISO 27001"], yellow: ["NIST CSF"], red: ["None"] },
  "02-cco-type": { green: ["Yes, dedicated CCO"], yellow: ["Shared / part-time CCO"], red: ["No dedicated CCO"] },
  "01-departures": { green: ["No departures"], yellow: ["One departure"], red: ["Two or more departures"] },
};

export function dataPointStatus(questionId: string, value: string | null, abstained = false): RAG | "neutral" {
  if (abstained || value == null || value === "") return "neutral"; // R8: abstained never counts green
  const rule = FIELD_STATUS[questionId];
  if (!rule) return "neutral";
  if (rule.red && rule.red.indexOf(value) >= 0) return "red";
  if (rule.yellow && rule.yellow.indexOf(value) >= 0) return "yellow";
  if (rule.green && rule.green.indexOf(value) >= 0) return "green";
  return "neutral";
}

// ─────────────────────────────────────────────────────────────────────────────
// Flag classification — impact × likelihood matrix (R10), calibrated to the real
// Risk-bullet categories ("Weakness in valuation controls", "Key person risk", ...).
// ─────────────────────────────────────────────────────────────────────────────

export type Impact = "high" | "medium" | "low";
export type Likelihood = "high" | "medium" | "low";

/** Flag categories observed across the 15 reports, mapped to inherent impact. */
export const CATEGORY_IMPACT: Record<string, Impact> = {
  valuation_controls: "high", // asset existence / independent pricing — the Reject driver
  asset_safety: "high", // single-signature transfers, segregation of duties
  administrator_oversight: "high", // admin doesn't oversee asset existence / valuation
  financial_viability: "high", // operating below breakeven
  regulatory: "high", // sanctions / undisclosed actions
  compliance_controls: "medium",
  cybersecurity: "medium",
  key_person: "medium",
  delayed_financials: "medium",
  investment_allocation: "medium",
  external_business_interests: "low",
  office_sharing: "low",
};

/** Categories whose flags must be resolved before close (asset safety / valuation / regulatory). */
const REQUIRED_BEFORE_CLOSE_CATEGORIES = [
  "valuation_controls",
  "asset_safety",
  "administrator_oversight",
  "financial_viability",
  "regulatory",
];

const SEVERITY_MATRIX: Record<Impact, Record<Likelihood, FlagSeverity>> = {
  high: { high: "high", medium: "high", low: "medium" },
  medium: { high: "high", medium: "medium", low: "low" },
  low: { high: "medium", medium: "low", low: "low" },
};

export type FlagInput = {
  category: string; // key of CATEGORY_IMPACT
  /** absent/contradicted control => high likelihood of impact; present-but-weak => medium. */
  evidenceStrength: "absent" | "contradicted" | "weak";
};

export type FlagClassification = {
  severity: FlagSeverity;
  timing: FlagTiming;
  rag: RAG;
  impact: Impact;
  likelihood: Likelihood;
};

export function classifyFlag(input: FlagInput): FlagClassification {
  const impact = CATEGORY_IMPACT[input.category] ?? "medium";
  const likelihood: Likelihood = input.evidenceStrength === "weak" ? "medium" : "high";
  const severity = SEVERITY_MATRIX[impact][likelihood];
  const timing: FlagTiming =
    REQUIRED_BEFORE_CLOSE_CATEGORIES.indexOf(input.category) >= 0 ? "required_before_close" : "post_close";
  const rag: RAG = severity === "high" ? "red" : severity === "medium" ? "yellow" : "yellow";
  return { severity, timing, rag, impact, likelihood };
}

// ─────────────────────────────────────────────────────────────────────────────
// Chapter rating proposal — worst-of with the GREEN floor (R8).
// ─────────────────────────────────────────────────────────────────────────────

const RANK: Record<RAG, number> = { green: 0, yellow: 1, red: 2 };

export type ChapterRatingInput = {
  dataPoints: (RAG | "neutral")[];
  flagSeverities: FlagSeverity[];
  /** any required field abstained/self-reported-only => can't be GREEN (caps at yellow). */
  hasUnverifiedRequired: boolean;
  criticalControlAbsent?: boolean;
};

export type RatingProposal = { rating: RAG; rationale: string };

export function proposeChapterRating(input: ChapterRatingInput): RatingProposal {
  if (input.criticalControlAbsent) {
    return { rating: "red", rationale: "A designated critical control is absent." };
  }
  const hasHigh = input.flagSeverities.indexOf("high") >= 0;
  if (hasHigh) return { rating: "red", rationale: "Material control gap (high-severity flag) in this area." };

  const hasMedium = input.flagSeverities.indexOf("medium") >= 0;
  const amberDot = input.dataPoints.indexOf("yellow") >= 0;
  const redDot = input.dataPoints.indexOf("red") >= 0;
  if (redDot) return { rating: "red", rationale: "A material data point is rated red." };
  if (hasMedium || amberDot || input.hasUnverifiedRequired) {
    return {
      rating: "yellow",
      rationale: input.hasUnverifiedRequired
        ? "Adequate, but one or more required items are unverified or self-reported."
        : "Adequate with watch-items that warrant monitoring or remediation.",
    };
  }
  return { rating: "green", rationale: "Controls in this area meet institutional expectations with no material gaps." };
}

// ─────────────────────────────────────────────────────────────────────────────
// Overall rating PROPOSAL (never forced — the N=15 finding). The analyst confirms.
// ─────────────────────────────────────────────────────────────────────────────

export type OverallProposal = {
  rating: RAG; // green=Accept, yellow=WatchList, red=Reject (renderer maps to words)
  confidence: "high" | "low";
  mustConfirm: boolean; // analyst must confirm whenever any red chapter exists
  rationale: string;
};

export function proposeOverall(chapters: { num: number; rating: RAG }[]): OverallProposal {
  const reds = chapters.filter((c) => c.rating === "red");
  const assetSafetyRed = reds.some((c) => ASSET_SAFETY_CHAPTERS.indexOf(c.num) >= 0);

  if (reds.length === 0) {
    const anyYellow = chapters.some((c) => c.rating === "yellow");
    return {
      rating: anyYellow ? "yellow" : "green",
      confidence: "high",
      mustConfirm: false,
      rationale: anyYellow
        ? "No red chapters; watch-items present — proposed WatchList."
        : "No material control gaps across the eight chapters — proposed Accept.",
    };
  }

  if (assetSafetyRed) {
    // The one combination that historically escalates to Reject (Veridian). Propose
    // WatchList but force analyst confirmation — could be Reject depending on
    // remediability / external validation of asset existence.
    return {
      rating: "yellow",
      confidence: "low",
      mustConfirm: true,
      rationale:
        "Red rating in valuation / asset existence — historically a Reject driver. Analyst must confirm overall.",
    };
  }

  // Non-asset-safety reds: Accept is the MODAL outcome even with one or two reds
  // (Northbridge, Oakridge[2 reds], Pinnacle, Summit = Accept; only Trellis[2],
  // Calder[1] = WatchList). Count does not determine it. So propose Accept and
  // ALWAYS require analyst confirmation — the WatchList cases are caught there.
  return {
    rating: "green",
    confidence: "low",
    mustConfirm: true,
    rationale:
      reds.length +
      " red chapter(s) (none asset-safety) — Accept is the modal outcome historically; analyst to confirm or escalate to WatchList.",
  };
}
