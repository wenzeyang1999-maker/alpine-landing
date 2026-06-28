/**
 * assembleCh4 status engine (T5). Proves every one of the 164 Ch4 questions resolves to
 * exactly one status, the counts ALWAYS reconcile to 164 (the CRITICAL invariant), and
 * each status branch (answered / routed / call_only / conditional / not_applicable) fires.
 */
import { describe, it, expect } from "vitest";
import { assembleCh4 } from "../../../../lib/engine/demo/callguide";
import { ManagerProfile, ScopeTag } from "../../../../lib/manager/framework-full";
import { ChapterAnswer } from "../../../../lib/engine/demo/extract-llm";

const bdc: ManagerProfile = { strategy: "credit", scopes: new Set<ScopeTag>(["closed_ended"]) };

const answeredFee: Record<string, ChapterAnswer> = {
  "04.18.116": {
    questionId: "04.18.116", label: "Base management fee", subsection: "Management & Incentive Fee",
    status: "answered", value: "1.5% of total assets", quote: "base management fee at an annual rate of 1.5%",
    confidence: "high", sourceLabel: "ARCC 10-K", filingAnswerable: true,
  },
};

describe("assembleCh4", () => {
  it("CRITICAL: every profile reconciles to exactly 164", () => {
    for (const profile of [
      bdc,
      { strategy: "hf", scopes: new Set<ScopeTag>(["open_ended"]) } as ManagerProfile,
      { strategy: "pe", scopes: new Set<ScopeTag>(["closed_ended", "american_waterfall"]) } as ManagerProfile,
      { strategy: "fof", scopes: new Set<ScopeTag>(["fund_of_funds", "open_ended"]) } as ManagerProfile,
    ]) {
      const a = assembleCh4({ profile });
      const c = a.counts;
      expect(c.total).toBe(164);
      expect(c.answered + c.routed + c.callOnly + c.conditional + c.notApplicable).toBe(164);
      expect(a.reconciledTo164).toBe(true);
    }
  });

  it("marks an extracted, gate-verified answer as answered with its value + citation", () => {
    const a = assembleCh4({ profile: bdc, extraction: answeredFee });
    const row = a.sections.flatMap((s) => s.rows).find((r) => r.id === "04.18.116")!;
    expect(row.status).toBe("answered");
    expect(row.value).toContain("1.5%");
    expect(row.sourceLabel).toBe("ARCC 10-K");
  });

  it("routes a filing-answerable question with no extraction to the manager call", () => {
    const a = assembleCh4({ profile: bdc, extraction: {} });
    const row = a.sections.flatMap((s) => s.rows).find((r) => r.id === "04.18.117")!;
    expect(row.status).toBe("routed"); // incentive fee is filing-answerable but unextracted here
  });

  it("marks a never-filing-answerable question as call_only", () => {
    const a = assembleCh4({ profile: bdc });
    const row = a.sections.flatMap((s) => s.rows).find((r) => r.id === "04.04.14")!;
    expect(row.status).toBe("call_only"); // GP commitment funding — not in a filing
  });

  it("puts scope-pruned questions in the not_applicable group with a reason", () => {
    const a = assembleCh4({ profile: bdc });
    const na = a.notApplicable.find((r) => r.id === "04.14.79")!; // open-ended only
    expect(na.status).toBe("not_applicable");
    expect(na.reason).toMatch(/open-ended/i);
    // not_applicable rows never leak into visible sections
    expect(a.sections.flatMap((s) => s.rows).some((r) => r.status === "not_applicable")).toBe(false);
  });

  it("marks an unmet dependsOn follow-up as conditional with an 'applies if' reason", () => {
    const a = assembleCh4({ profile: bdc });
    const row = a.sections.flatMap((s) => s.rows).find((r) => r.id === "04.09.48")!;
    expect(row.status).toBe("conditional");
    expect(row.reason).toMatch(/^Applies if:/);
  });

  it("resolves the dependsOn follow-up once the parent answer triggers it", () => {
    const a = assembleCh4({ profile: bdc, answers: { "04.09.47": "30" } });
    const row = a.sections.flatMap((s) => s.rows).find((r) => r.id === "04.09.48")!;
    expect(row.status).not.toBe("conditional"); // 47 > 25 → now a real (call_only) question
  });
});
