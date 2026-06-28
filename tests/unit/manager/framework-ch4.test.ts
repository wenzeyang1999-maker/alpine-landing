/**
 * Chapter 4 transcription + applicability integrity (T1/T2).
 * The checksum tests that prove all 164 questions are encoded, uniquely numbered,
 * correctly scoped, and that every dependsOn points at a real question. A drop, a
 * duplicate, or a typo'd trigger fails here, not in front of Mercer.
 */
import { describe, it, expect } from "vitest";
import { CHAPTERS } from "../../../lib/manager/framework-full";

const ch4 = CHAPTERS.find((c) => c.num === 4)!;
const questions = ch4.subsections.flatMap((s) => s.questions);
const ids = new Set(questions.map((q) => q.id));

const VALID_SCOPES = new Set([
  "small_manager", "offshore_fund", "lp_llc_fund", "hf", "closed_ended", "open_ended",
  "private_debt", "direct_lending", "equity_hedge", "real_estate", "eu_aifmd",
  "pre_launch", "master_feeder", "american_waterfall", "external_managers",
  "internal_affiliated", "fund_of_funds",
]);

describe("Ch4 — Fund Structure, Terms and Alignment", () => {
  it("declares 164 questions across 22 sub-sections", () => {
    expect(ch4.questionCount).toBe(164);
    expect(ch4.subsectionCount).toBe(22);
    expect(ch4.subsections.length).toBe(22);
  });

  it("encodes exactly 164 questions (the checksum)", () => {
    expect(questions.length).toBe(164);
  });

  it("has unique, non-empty question ids", () => {
    expect(ids.size).toBe(164);
    for (const q of questions) expect(q.id.length).toBeGreaterThan(0);
  });

  it("covers global question numbers 1–164 exactly once", () => {
    const nums = questions
      .map((q) => parseInt(q.id.split(".")[2], 10))
      .sort((a, b) => a - b);
    expect(nums).toEqual(Array.from({ length: 164 }, (_, i) => i + 1));
  });

  it("ids are well-formed 04.<ss>.<n> and self-consistent", () => {
    for (const q of questions) {
      expect(q.id).toMatch(/^04\.\d{2}\.\d{1,3}$/);
      expect(q.chapterNum).toBe(4);
      expect(q.id.startsWith(q.subsectionId + ".")).toBe(true);
      expect(q.subsectionId).toMatch(/^04\.\d{2}$/);
    }
  });

  it("has no orphan dependsOn — every trigger points at a real Ch4 question", () => {
    for (const q of questions) {
      if (q.dependsOn) expect(ids.has(q.dependsOn.questionId)).toBe(true);
    }
  });

  it("uses only valid scope tags in appliesWhen", () => {
    const check = (cond: unknown) => {
      if (!cond || typeof cond !== "object") return;
      const c = cond as { kind?: string; tag?: string; of?: unknown[] };
      if (c.kind === "scope" && c.tag) expect(VALID_SCOPES.has(c.tag)).toBe(true);
      if (Array.isArray(c.of)) c.of.forEach(check);
    };
    for (const s of ch4.subsections) {
      check(s.appliesWhen);
      for (const q of s.questions) check(q.appliesWhen);
    }
  });

  it("type-gated sub-sections carry their scope tag", () => {
    const tagOf = (sid: string) => {
      const s = ch4.subsections.find((x) => x.id === sid)!;
      const c = s.appliesWhen as { tag?: string } | undefined;
      return c?.tag;
    };
    expect(tagOf("04.07")).toBe("offshore_fund");   // Stock Exchange Listing (Offshore)
    expect(tagOf("04.12")).toBe("closed_ended");    // Closed-Ended Fund Terms
    expect(tagOf("04.14")).toBe("open_ended");      // Redemptions (Open-ended only)
    expect(tagOf("04.15")).toBe("closed_ended");    // Closed-Ended Redemption Terms
    expect(tagOf("04.19")).toBe("closed_ended");    // Waterfall (Closed-Ended)
    expect(tagOf("04.22")).toBe("fund_of_funds");   // Fund of Fund Portfolios
  });

  it("anchors the filing-answerable fee questions at their real ids", () => {
    expect(ids.has("04.18.116")).toBe(true); // management fee %
    expect(ids.has("04.18.117")).toBe(true); // incentive fee
    expect(ids.has("04.06.25")).toBe(true);  // fund domicile
    expect(ids.has("04.06.26")).toBe(true);  // corporate form
    expect(ids.has("04.19.126")).toBe(true); // hurdle / preferred return
  });
});
