import { describe, it, expect } from "vitest";
import {
  dataPointStatus,
  classifyFlag,
  proposeChapterRating,
  proposeOverall,
} from "@/lib/engine/rubric";
import { RAG } from "@/lib/engine/contract";
import { scrubViolations, selectExemplars, StyleExemplar, defineEntity } from "@/lib/engine/style";

describe("rubric — data-point status", () => {
  it("maps known fields; abstained/unknown => neutral (R8)", () => {
    expect(dataPointStatus("03-mfa", "No")).toBe("red");
    expect(dataPointStatus("03-mfa", "Some systems only")).toBe("yellow");
    expect(dataPointStatus("02-cco-type", "Yes, dedicated CCO")).toBe("green");
    expect(dataPointStatus("03-mfa", null)).toBe("neutral");
    expect(dataPointStatus("03-mfa", "Yes, all systems", true)).toBe("neutral"); // abstained
    expect(dataPointStatus("unknown-field", "anything")).toBe("neutral");
  });
});

describe("rubric — flag classification (calibrated to real Risk categories)", () => {
  it("valuation/asset-existence absence => high severity, required before close, red", () => {
    const c = classifyFlag({ category: "valuation_controls", evidenceStrength: "absent" });
    expect(c.severity).toBe("high");
    expect(c.timing).toBe("required_before_close");
    expect(c.rag).toBe("red");
  });

  it("cybersecurity weakness => medium, post-close, yellow", () => {
    const c = classifyFlag({ category: "cybersecurity", evidenceStrength: "weak" });
    expect(c.severity).toBe("medium");
    expect(c.timing).toBe("post_close");
    expect(c.rag).toBe("yellow");
  });

  it("low-impact external business interests => low severity, post-close", () => {
    const c = classifyFlag({ category: "external_business_interests", evidenceStrength: "weak" });
    expect(c.severity).toBe("low");
    expect(c.timing).toBe("post_close");
  });
});

describe("rubric — chapter rating proposal (GREEN floor / R8)", () => {
  it("high-severity flag => red", () => {
    expect(
      proposeChapterRating({ dataPoints: ["green"], flagSeverities: ["high"], hasUnverifiedRequired: false }).rating,
    ).toBe("red");
  });
  it("unverified required field caps at yellow (never green)", () => {
    expect(
      proposeChapterRating({ dataPoints: ["green"], flagSeverities: [], hasUnverifiedRequired: true }).rating,
    ).toBe("yellow");
  });
  it("clean chapter => green", () => {
    expect(
      proposeChapterRating({ dataPoints: ["green", "green"], flagSeverities: [], hasUnverifiedRequired: false }).rating,
    ).toBe("green");
  });
  it("critical control absent => red", () => {
    expect(
      proposeChapterRating({ dataPoints: [], flagSeverities: [], hasUnverifiedRequired: false, criticalControlAbsent: true }).rating,
    ).toBe("red");
  });
});

describe("rubric — overall proposal reproduces the real N=15 verdicts", () => {
  // chapter rating arrays keyed by num — only the pattern matters for the proposal.
  const ch = (ratings: Record<number, RAG>) =>
    [1, 2, 3, 4, 5, 6, 7, 8].map((n) => ({ num: n, rating: ratings[n] || ("green" as RAG) }));

  it("no reds => Accept (green), no confirmation needed", () => {
    const p = proposeOverall(ch({}));
    expect(p.rating).toBe("green");
    expect(p.mustConfirm).toBe(false);
  });

  it("Summit/Northbridge pattern (single IT red) => proposes Accept, must confirm", () => {
    const p = proposeOverall(ch({ 3: "red" }));
    expect(p.rating).toBe("green"); // real: Accept
    expect(p.mustConfirm).toBe(true);
  });

  it("Oakridge pattern (two non-asset-safety reds) => still proposes Accept", () => {
    const p = proposeOverall(ch({ 4: "red", 5: "red" }));
    expect(p.rating).toBe("green"); // real: Accept (count does not force WatchList)
    expect(p.mustConfirm).toBe(true);
  });

  it("Veridian pattern (valuation/asset-existence red) => WatchList + must confirm (Reject candidate)", () => {
    const p = proposeOverall(ch({ 7: "red" }));
    expect(p.rating).toBe("yellow");
    expect(p.confidence).toBe("low");
    expect(p.mustConfirm).toBe(true);
  });

  it("watch-items only (a yellow, no reds) => WatchList", () => {
    expect(proposeOverall(ch({ 2: "yellow" })).rating).toBe("yellow");
  });
});

describe("style — house voice guards", () => {
  it("scrubs the originating firm's name (first-party voice)", () => {
    expect(scrubViolations("In response to Castle Hall's recommendation, the firm...")).toContain("Castle Hall");
    expect(scrubViolations("The Manager represented that controls are adequate.")).toEqual([]);
  });

  it("entity convention defines a short name on first mention", () => {
    expect(defineEntity("Carta Investor Services, Inc.", "Carta", "Administrator")).toBe(
      'Carta Investor Services, Inc. ("Carta", the "Administrator")',
    );
  });

  it("few-shot selection excludes self (leave-one-out) and prefers same strategy", () => {
    const bank: StyleExemplar[] = [
      { reportId: "self", chapterNum: 7, strategy: "hf", rating: "red", narrative: "A" },
      { reportId: "r2", chapterNum: 7, strategy: "hf", rating: "red", narrative: "B" },
      { reportId: "r3", chapterNum: 7, strategy: "credit", rating: "green", narrative: "C" },
      { reportId: "r4", chapterNum: 2, strategy: "hf", rating: "red", narrative: "D" }, // wrong chapter
    ];
    const picked = selectExemplars(bank, { chapterNum: 7, strategy: "hf", rating: "red", excludeReportId: "self" });
    expect(picked.map((e) => e.reportId)).not.toContain("self"); // leave-one-out
    expect(picked.map((e) => e.reportId)).not.toContain("r4"); // wrong chapter excluded
    expect(picked[0].reportId).toBe("r2"); // same strategy+rating ranks first
  });
});
