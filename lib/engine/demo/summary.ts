/**
 * summarizeCh4 — the deterministic summary panel (T9, DD8).
 *
 * Pure derivation from the assembled call guide + extraction. NO LLM: it cannot
 * hallucinate, it just rolls up the headline ("11 of 12 answered"), the key extracted
 * terms (fees, structure), and the status tallies. This is what turns a 164-row list
 * into an at-a-glance "here is what we learned" without pulling PR2's writing engine forward.
 */
import type { AssembledCh4 } from "./callguide";
import { CH4_QUESTIONS } from "./ch4-questions";
import type { ChapterAnswer } from "./extract-llm";

export type KeyTerm = { label: string; value: string; frameworkId: string };

export type Ch4Summary = {
  /** Headline: how many of the filing-answerable questions were grounded. */
  answered: number;
  answerable: number;
  /** Marquee extracted facts, in display order (only the ones actually answered). */
  keyTerms: KeyTerm[];
  tallies: {
    answered: number;
    routed: number;
    callOnly: number;
    conditional: number;
    notApplicable: number;
  };
};

/** Which extracted facts to surface as headline stats, in order. */
const HEADLINE: { frameworkId: string; label: string }[] = [
  { frameworkId: "04.06.26", label: "Fund type" },
  { frameworkId: "04.18.116", label: "Mgmt fee" },
  { frameworkId: "04.18.117", label: "Incentive" },
  { frameworkId: "04.19.126", label: "Hurdle" },
  { frameworkId: "04.20.159", label: "Expense ratio" },
];

export function summarizeCh4(
  assembled: AssembledCh4,
  extraction: Record<string, ChapterAnswer> = {},
): Ch4Summary {
  const answerableIds = CH4_QUESTIONS.filter((q) => q.filingAnswerable).map((q) => q.frameworkId as string);
  const answerable = answerableIds.length;
  const answered = answerableIds.filter((id) => extraction[id]?.status === "answered").length;

  const keyTerms: KeyTerm[] = [];
  for (const h of HEADLINE) {
    const ex = extraction[h.frameworkId];
    if (ex && ex.status === "answered" && ex.value) {
      keyTerms.push({ label: h.label, value: ex.value, frameworkId: h.frameworkId });
    }
  }

  const { answered: a, routed, callOnly, conditional, notApplicable } = assembled.counts;
  return {
    answered, answerable, keyTerms,
    tallies: { answered: a, routed, callOnly, conditional, notApplicable },
  };
}
