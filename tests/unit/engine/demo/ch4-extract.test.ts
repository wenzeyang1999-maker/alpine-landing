/**
 * Ch4 (Fund Structure, Terms & Alignment) extraction over a REAL cached filing.
 * Proves the chapter-agnostic pipeline (retrieve → extract → quote-gate) runs on the
 * actual ARCC 10-K and that every "answered" quote is verbatim-present in the source.
 * Skips automatically when the gitignored corpus isn't on disk (e.g. CI).
 */
import { describe, it, expect } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { CH4_QUESTIONS } from "../../../../lib/engine/demo/ch4-questions";
import { extractChapter, createMockExtractClient } from "../../../../lib/engine/demo/extract-llm";

const ARCC_TENK = join(
  process.cwd(),
  "lib/engine/.data/stage1/funds/0001287750/tenk.norm.txt",
);

const hasCorpus = existsSync(ARCC_TENK);

describe.skipIf(!hasCorpus)("Ch4 extraction on cached ARCC 10-K", () => {
  it("retrieves, extracts, and gate-verifies every answered quote", async () => {
    const text = readFileSync(ARCC_TENK, "utf8");
    const client = createMockExtractClient();
    const answers = await extractChapter(client, CH4_QUESTIONS, text, "ARCC 10-K");

    expect(answers.length).toBe(CH4_QUESTIONS.length);

    // THE invariant: any answered quote must exist verbatim in the filing.
    for (const a of answers) {
      if (a.status === "answered") {
        expect(a.quote).toBeTruthy();
        expect(text.indexOf(a.quote as string)).toBeGreaterThanOrEqual(0);
      }
    }

    // No "unsupported" should survive the mock (it echoes a verbatim span).
    expect(answers.some((a) => a.status === "unsupported")).toBe(false);

    // Sanity: the filing-answerable structural fields should retrieve *something*.
    const answered = answers.filter((a) => a.status === "answered").length;
    expect(answered).toBeGreaterThan(0);
  });
});
