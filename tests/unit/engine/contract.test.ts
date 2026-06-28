import { describe, it, expect } from "vitest";
import {
  validateODDReport,
  lintODDReport,
  isValidODDReport,
  deriveSourceRefId,
  CHAPTER_MAP,
  GATING_CHAPTERS,
  ASSET_SAFETY_CHAPTERS,
  ODDReport,
} from "@/lib/engine/contract";
import { TRELLIS_REPORT } from "@/lib/engine/fixtures/trellis.fixture";

describe("ODD contract — validated against the real Trellis report", () => {
  it("the real report passes structural validation (the contract holds reality)", () => {
    expect(validateODDReport(TRELLIS_REPORT)).toEqual([]);
    expect(isValidODDReport(TRELLIS_REPORT)).toBe(true);
  });

  it("treats a single chapter RED under a non-green overall as NORMAL (N=15 finding)", () => {
    // Trellis: Ch2/Ch3 RED, overall YELLOW. The 15 real reports show this is the
    // norm, not an anomaly — so it produces NO lint warning and is fully valid.
    expect(lintODDReport(TRELLIS_REPORT)).toEqual([]);
    expect(validateODDReport(TRELLIS_REPORT)).toEqual([]);
  });

  it("lints the one data-supported escalation: asset-existence RED under an Accept", () => {
    // Synthetic: Ch7 (valuation/asset existence) RED but overall green (Accept).
    // This is the Veridian pattern that historically escalates to Reject.
    const risky: ODDReport = {
      ...TRELLIS_REPORT,
      overall: { rating: "green" },
      chapters: TRELLIS_REPORT.chapters.map((c) =>
        c.num === 7 ? { ...c, rating: "red" as const } : c,
      ),
    };
    const warnings = lintODDReport(risky);
    expect(warnings.some((w) => w.includes("asset-existence"))).toBe(true);
    expect(validateODDReport(risky)).toEqual([]); // still structurally valid — it's a judgment flag
  });

  it("rejects a wrong chapter count", () => {
    const bad = { ...TRELLIS_REPORT, chapters: TRELLIS_REPORT.chapters.slice(0, 7) };
    expect(validateODDReport(bad)).toContain("expected exactly 8 chapters, got 7");
  });

  it("rejects an act that contradicts the pinned chapter map", () => {
    const bad = {
      ...TRELLIS_REPORT,
      chapters: TRELLIS_REPORT.chapters.map((c) =>
        c.num === 6 ? { ...c, act: "Manager" as const } : c,
      ),
    };
    expect(validateODDReport(bad).some((e) => e.includes("chapter 6 act"))).toBe(true);
  });

  it("rejects a chapter referencing a missing flag", () => {
    const bad = {
      ...TRELLIS_REPORT,
      chapters: TRELLIS_REPORT.chapters.map((c) =>
        c.num === 1 ? { ...c, flagIds: ["F999"] } : c,
      ),
    };
    expect(validateODDReport(bad).some((e) => e.includes("missing flag F999"))).toBe(true);
  });

  it("rejects an evidence flag with no evidence sources (R7)", () => {
    const bad = {
      ...TRELLIS_REPORT,
      flags: TRELLIS_REPORT.flags.map((f) => (f.id === "F1" ? { ...f, evidence: [] } : f)),
    };
    expect(validateODDReport(bad).some((e) => e.includes("F1") && e.includes("R7"))).toBe(true);
  });

  it("requires assessment for the full SKU (R6)", () => {
    const bad = { ...TRELLIS_REPORT, assessment: undefined };
    expect(validateODDReport(bad)).toContain("full SKU requires assessment (R6)");
  });

  it("deriveSourceRefId is deterministic and run-scoped", () => {
    const a = deriveSourceRefId("doc1", 100, 240);
    const b = deriveSourceRefId("doc1", 100, 240);
    const c = deriveSourceRefId("doc1", 100, 241);
    expect(a).toBe(b);
    expect(a).not.toBe(c);
    expect(a.startsWith("src_")).toBe(true);
  });

  it("pinned constants match the framework + the data-corrected gating model", () => {
    expect(CHAPTER_MAP).toHaveLength(8);
    expect(GATING_CHAPTERS).toEqual([2, 6, 7]); // deprecated, kept for migration
    expect(ASSET_SAFETY_CHAPTERS).toEqual([7]); // the only heightened-scrutiny chapter (N=15)
  });
});
