/**
 * Stage-2 report assembler — the capstone that ties the path together:
 * per-chapter facts + rubric ratings → retrieve exemplars → generate house-voice
 * grounded narrative → assemble a validated ODDReport.
 *
 * Flags are an INPUT here (candidate-finding + classification is a distinct pipeline
 * step, plan §5 step 4 / rubric.classifyFlag). The overall rating is PROPOSED
 * (rubric.proposeOverall) and surfaced for analyst confirmation — never forced.
 */
import {
  ODDReport,
  Flag,
  FirmIdentity,
  Sku,
  RAG,
  SourceRef,
  RatedNarrative,
  Grounding,
  CHAPTER_MAP,
  validateODDReport,
} from "./contract";
import { GenerationClient, ChapterFacts, GroundedFact, generateChapterNarrative } from "./generate";
import { StyleExemplar, selectExemplars } from "./style";
import { proposeOverall, OverallProposal } from "./rubric";

export type ChapterDraftInput = {
  num: number; // 1..8
  rating: RAG; // from rubric
  ratingRationale: string; // from rubric
  facts: GroundedFact[];
};

export type DraftInput = {
  runId: string;
  firm: FirmIdentity;
  strategy: string;
  sku: Sku;
  chapters: ChapterDraftInput[]; // 8
  flags: Flag[];
};

export type DraftResult = {
  report: ODDReport;
  overallProposal: OverallProposal;
  issues: string[]; // validation errors + per-chapter generation guard hits
};

const emptyNarrative = (): RatedNarrative => ({ html: "", citations: [] });

export async function draftReport(
  input: DraftInput,
  client: GenerationClient,
  bank: StyleExemplar[],
): Promise<DraftResult> {
  const issues: string[] = [];
  const chapters = [];

  for (let i = 0; i < CHAPTER_MAP.length; i++) {
    const meta = CHAPTER_MAP[i];
    const ci = findChapter(input.chapters, meta.num);
    const rating: RAG = ci ? ci.rating : "green";
    const grounding: Grounding = {
      runId: input.runId,
      sources: [],
      confidence: "high",
      abstained: false,
      verifier: "verified",
    };

    let narrative = emptyNarrative();
    if (ci) {
      const exemplars = selectExemplars(bank, {
        chapterNum: meta.num,
        strategy: input.strategy,
        rating,
        excludeReportId: input.firm.id, // leave-one-out (also excludes the fund itself)
      });
      const facts: ChapterFacts = {
        chapterNum: meta.num,
        chapterTitle: meta.title,
        strategy: input.strategy,
        rating,
        ratingRationaleHint: ci.ratingRationale,
        facts: ci.facts,
      };
      const gen = await generateChapterNarrative(client, facts, exemplars);
      narrative = gen.narrative;
      if (gen.violations.length) issues.push("ch" + meta.num + " style violation: " + gen.violations.join(","));
      if (gen.ungroundedMarkers.length)
        issues.push("ch" + meta.num + " ungrounded citation(s): " + gen.ungroundedMarkers.join(","));
    }

    chapters.push({
      num: meta.num,
      title: meta.title,
      act: meta.act,
      rating,
      ratingRationale: ci ? ci.ratingRationale : "",
      narrative,
      dataPoints: [] as { field: string; value: string; status: RAG | "neutral"; source?: SourceRef }[],
      flagIds: input.flags.filter((f) => f.chapterNum === meta.num).map((f) => f.id),
      grounding,
    });
  }

  const overallProposal = proposeOverall(chapters.map((c) => ({ num: c.num, rating: c.rating })));

  const report: ODDReport = {
    schemaVersion: "odd.v1",
    runId: input.runId,
    sku: input.sku,
    firm: input.firm,
    overall: { rating: overallProposal.rating },
    overview: emptyNarrative(), // synthesized in a later step (plan §5 step 7)
    scopeVerification: [],
    chapters,
    flags: input.flags,
    remediation: input.flags.map((f) => ({
      flagId: f.id,
      requirement: f.title,
      priority: f.severity,
      phase: f.timing,
      investorAction: f.investorAction,
    })),
    referenceData: [],
    sources: dedupeSources(chapters),
    meta: {
      generatedAt: input.runId, // caller stamps a real timestamp post-run
      engineVersion: "stage2-draft",
      frameworkVersion: "v3.2026.06",
      modelId: "draft",
    },
  };
  if (input.sku === "full") report.assessment = emptyNarrative();

  const errs = validateODDReport(report);
  for (let i = 0; i < errs.length; i++) issues.push("contract: " + errs[i]);

  return { report, overallProposal, issues };
}

function findChapter(chs: ChapterDraftInput[], num: number): ChapterDraftInput | undefined {
  for (let i = 0; i < chs.length; i++) if (chs[i].num === num) return chs[i];
  return undefined;
}

function dedupeSources(chapters: { narrative: RatedNarrative }[]): SourceRef[] {
  const seen: Record<string, boolean> = {};
  const out: SourceRef[] = [];
  for (let i = 0; i < chapters.length; i++) {
    const cites = chapters[i].narrative.citations;
    for (let j = 0; j < cites.length; j++) {
      if (!seen[cites[j].id]) {
        seen[cites[j].id] = true;
        out.push(cites[j]);
      }
    }
  }
  return out;
}
