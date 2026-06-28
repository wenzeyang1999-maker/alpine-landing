/**
 * Bounded-concurrency extraction (T7, D7). Proves the pool preserves question order,
 * never exceeds the concurrency cap, and streams each result via onResult (the DD2
 * row-by-row fill-in).
 */
import { describe, it, expect } from "vitest";
import { extractChapter } from "../../../../lib/engine/demo/extract-llm";
import { DemoQuestion } from "../../../../lib/engine/demo/questions";
import { GenerationClient } from "../../../../lib/engine/generate";

const TEXT = "alpha bravo charlie delta echo foxtrot golf hotel india juliet kilo lima.";

const qs: DemoQuestion[] = Array.from({ length: 12 }, (_, i) => ({
  id: `04.99.${i}`, frameworkId: `04.99.${i}`, chapterNum: 4,
  subsection: "T", label: `q${i}`, ask: "x",
  retrievalTerms: ["alpha"], docPref: "tenk", filingAnswerable: true,
}));

describe("extractChapter — bounded concurrency", () => {
  it("never exceeds the cap and preserves order", async () => {
    let inFlight = 0;
    let peak = 0;
    const client: GenerationClient = {
      async complete() {
        inFlight++; peak = Math.max(peak, inFlight);
        await new Promise((r) => setTimeout(r, 5));
        inFlight--;
        return JSON.stringify({ abstained: false, value: "v", quote: "alpha", confidence: "low" });
      },
    };
    const seen: number[] = [];
    const out = await extractChapter(client, qs, TEXT, "src", {
      concurrency: 4,
      onResult: (_a, i) => seen.push(i),
    });
    expect(peak).toBeLessThanOrEqual(4);
    expect(peak).toBeGreaterThan(1); // actually ran in parallel
    expect(out.map((a) => a.questionId)).toEqual(qs.map((q) => q.id)); // order preserved
    expect(seen.length).toBe(12); // streamed every result
  });
});
