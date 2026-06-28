/**
 * Shared builder for ODDReport fixtures — encodes a real report from a compact
 * spec (firm + per-chapter ratings + flags) so each fixture stays DRY and the
 * structural plumbing lives in one place. Narrative is placeholder; fixtures
 * validate the contract + rubric, not prose.
 */
import {
  ODDReport,
  ChapterReport,
  Flag,
  FirmIdentity,
  Sku,
  RAG,
  Grounding,
  RatedNarrative,
  CHAPTER_MAP,
} from "../contract";

export type FixtureSpec = {
  runId: string;
  firm: FirmIdentity;
  sku: Sku;
  overall: RAG;
  preLaunchNote?: string;
  ratings: Record<number, RAG>; // chapter num -> rating
  flags?: Flag[];
};

const narrative = (html: string): RatedNarrative => ({ html, citations: [] });

export function buildFixtureReport(spec: FixtureSpec): ODDReport {
  const flags = spec.flags ?? [];
  const grounding = (): Grounding => ({
    runId: spec.runId,
    sources: [],
    confidence: "high",
    abstained: false,
    verifier: "verified",
  });

  const chapters: ChapterReport[] = [1, 2, 3, 4, 5, 6, 7, 8].map((num) => {
    const meta = CHAPTER_MAP[num - 1];
    const rating = spec.ratings[num] ?? "green";
    return {
      num,
      title: meta.title,
      act: meta.act,
      rating,
      ratingRationale:
        rating === "green"
          ? "Controls in this area meet institutional expectations with no material gaps."
          : rating === "yellow"
            ? "Adequate with watch-items that warrant monitoring or remediation."
            : "Material control gaps requiring remediation.",
      narrative: narrative("<p>[" + spec.firm.name + " ch" + num + " narrative — fixture placeholder]</p>"),
      dataPoints: [],
      flagIds: flags.filter((f) => f.chapterNum === num).map((f) => f.id),
      grounding: grounding(),
    };
  });

  const report: ODDReport = {
    schemaVersion: "odd.v1",
    runId: spec.runId,
    sku: spec.sku,
    firm: spec.firm,
    overall: spec.preLaunchNote
      ? { rating: spec.overall, preLaunchNote: spec.preLaunchNote }
      : { rating: spec.overall },
    overview: narrative("<p>[" + spec.firm.name + " overview — fixture placeholder]</p>"),
    scopeVerification: [],
    chapters,
    flags,
    remediation: flags.map((f) => ({
      flagId: f.id,
      requirement: f.title,
      priority: f.severity,
      phase: f.timing,
      investorAction: f.investorAction,
    })),
    referenceData: [],
    sources: [],
    meta: {
      generatedAt: "2023-10-01T00:00:00Z",
      engineVersion: "fixture",
      frameworkVersion: "v3.2026.06",
      modelId: "hand-authored",
    },
  };
  if (spec.sku === "full") {
    report.assessment = narrative("<p>[" + spec.firm.name + " assessment — fixture placeholder]</p>");
  }
  return report;
}
