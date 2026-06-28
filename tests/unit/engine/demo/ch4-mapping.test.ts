/**
 * Drift guard (T6, D5): the demo extraction bank is kept SEPARATE from the framework,
 * mapped at the edge by frameworkId. These tests assert the two banks can't silently
 * drift — every demo question targets a real Ch4 question, and the targeted question
 * still exists. A framework renumber or a dropped question fails here.
 */
import { describe, it, expect } from "vitest";
import { CHAPTERS } from "../../../../lib/manager/framework-full";
import { CH4_QUESTIONS } from "../../../../lib/engine/demo/ch4-questions";

const ch4Ids = new Set(
  CHAPTERS.find((c) => c.num === 4)!.subsections.flatMap((s) => s.questions).map((q) => q.id),
);

describe("Ch4 demo bank ↔ framework mapping", () => {
  it("every demo question declares a frameworkId", () => {
    for (const q of CH4_QUESTIONS) {
      expect(q.frameworkId, `${q.label} missing frameworkId`).toBeTruthy();
    }
  });

  it("every frameworkId points at a real Ch4 question (forward: no orphan)", () => {
    for (const q of CH4_QUESTIONS) {
      expect(ch4Ids.has(q.frameworkId as string), `${q.frameworkId} not in framework Ch4`).toBe(true);
    }
  });

  it("frameworkIds are unique across the demo bank", () => {
    const mapped = CH4_QUESTIONS.map((q) => q.frameworkId);
    expect(new Set(mapped).size).toBe(CH4_QUESTIONS.length);
  });

  it("all demo questions are Chapter 4", () => {
    for (const q of CH4_QUESTIONS) expect(q.chapterNum).toBe(4);
  });

  it("the filing-answerable fee anchors are present (reverse: coverage)", () => {
    const mapped = new Set(CH4_QUESTIONS.map((q) => q.frameworkId));
    expect(mapped.has("04.18.116")).toBe(true); // management fee
    expect(mapped.has("04.18.117")).toBe(true); // incentive fee
    expect(mapped.has("04.06.26")).toBe(true);  // corporate form / BDC status
  });
});
