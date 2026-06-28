/**
 * Deterministic Ch4 summary (T9, DD8). Proves the headline counts + key terms are a pure
 * roll-up of the assembled guide + extraction (no LLM, can't hallucinate).
 */
import { describe, it, expect } from "vitest";
import { assembleCh4 } from "../../../../lib/engine/demo/callguide";
import { summarizeCh4 } from "../../../../lib/engine/demo/summary";
import { ManagerProfile, ScopeTag } from "../../../../lib/manager/framework-full";
import { ChapterAnswer } from "../../../../lib/engine/demo/extract-llm";

const bdc: ManagerProfile = { strategy: "credit", scopes: new Set<ScopeTag>(["closed_ended"]) };

const mk = (id: string, label: string, value: string): ChapterAnswer => ({
  questionId: id, label, subsection: "", status: "answered", value, quote: value,
  confidence: "high", sourceLabel: "ARCC 10-K", filingAnswerable: true,
});

const extraction: Record<string, ChapterAnswer> = {
  "04.18.116": mk("04.18.116", "Mgmt fee", "1.5% of total assets"),
  "04.18.117": mk("04.18.117", "Incentive", "17.5%"),
  "04.06.26": mk("04.06.26", "Fund type", "closed-end BDC"),
};

describe("summarizeCh4", () => {
  it("counts answered of the filing-answerable set", () => {
    const a = assembleCh4({ profile: bdc, extraction });
    const s = summarizeCh4(a, extraction);
    expect(s.answered).toBe(3);
    expect(s.answerable).toBeGreaterThanOrEqual(11); // ~12 filing-answerable in the demo bank
    expect(s.answered).toBeLessThanOrEqual(s.answerable);
  });

  it("surfaces grounded headline terms in display order, omitting unanswered ones", () => {
    const a = assembleCh4({ profile: bdc, extraction });
    const s = summarizeCh4(a, extraction);
    const labels = s.keyTerms.map((t) => t.label);
    expect(labels).toContain("Mgmt fee");
    expect(labels).toContain("Incentive");
    expect(labels).not.toContain("Hurdle"); // not in extraction → omitted, not faked
    expect(s.keyTerms.find((t) => t.label === "Mgmt fee")?.value).toContain("1.5%");
  });

  it("tallies reconcile with the assembled guide", () => {
    const a = assembleCh4({ profile: bdc, extraction });
    const s = summarizeCh4(a, extraction);
    const sum = s.tallies.answered + s.tallies.routed + s.tallies.callOnly + s.tallies.conditional + s.tallies.notApplicable;
    expect(sum).toBe(164);
  });
});
