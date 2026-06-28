import { describe, it, expect } from "vitest";
import { draftReport, DraftInput } from "@/lib/engine/draft";
import { createMockClient } from "@/lib/engine/anthropic";
import { validateODDReport, SourceRef } from "@/lib/engine/contract";

const src = (id: string): SourceRef => ({ id, kind: "manager_upload", docName: "DDQ.pdf", quote: "q" });

function input(): DraftInput {
  return {
    runId: "run_draft_test",
    firm: { id: "newco-fund", name: "Newco Fund", strategy: "Hedge Fund" },
    strategy: "hf",
    sku: "full",
    chapters: [1, 2, 3, 4, 5, 6, 7, 8].map((n) => ({
      num: n,
      rating: n === 3 ? ("red" as const) : ("green" as const),
      ratingRationale: "Chapter " + n + " rationale.",
      facts: [{ prompt: "Control", value: "operates as described", source: src("src_" + n) }],
    })),
    flags: [],
  };
}

describe("Stage-2 draftReport (end-to-end, mock client)", () => {
  it("loops 8 chapters, generates grounded narratives, and assembles a VALID ODDReport", async () => {
    const res = await draftReport(input(), createMockClient(), []);
    expect(res.issues).toEqual([]); // no validation errors, no generation guard hits
    expect(validateODDReport(res.report)).toEqual([]);
    expect(res.report.chapters).toHaveLength(8);
    // every chapter got house-voice grounded prose with a resolved citation
    res.report.chapters.forEach((c) => {
      expect(c.narrative.html).toContain("The Manager represented");
      expect(c.narrative.citations.length).toBeGreaterThan(0);
    });
    // sources are deduped onto the report appendix
    expect(res.report.sources.length).toBe(8);
  });

  it("proposes the overall (not forces it) — single non-asset-safety red => Accept + mustConfirm", async () => {
    const res = await draftReport(input(), createMockClient(), []); // ch3 red only
    expect(res.overallProposal.rating).toBe("green"); // Accept is modal
    expect(res.overallProposal.mustConfirm).toBe(true);
    expect(res.report.overall.rating).toBe("green");
  });

  it("surfaces generation guard hits in issues (banned term)", async () => {
    const sloppy = { async complete() { return "<p>Per Castle Hall, fine. [[REF:src_1]]</p>"; } };
    const res = await draftReport(input(), sloppy, []);
    expect(res.issues.some((s) => s.indexOf("style violation") >= 0)).toBe(true);
  });
});
