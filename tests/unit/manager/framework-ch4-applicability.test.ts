/**
 * Ch4 applicability for a BDC profile (T2). Proves the engine prunes the call guide
 * to what actually applies: a listed credit BDC is closed-ended, so open-ended
 * redemption terms, offshore listing, and FoF questions drop out — while closed-ended
 * terms stay. Also proves dependsOn triggers stay hidden until their parent is answered.
 */
import { describe, it, expect } from "vitest";
import { applicableQuestions, ManagerProfile, ScopeTag } from "../../../lib/manager/framework-full";

const ids = (answers?: Record<string, string>) =>
  applicableQuestions(bdc, answers).map((q) => q.id);
const bdc: ManagerProfile = { strategy: "credit", scopes: new Set<ScopeTag>(["closed_ended"]) };

describe("Ch4 applicability — credit BDC (closed-ended)", () => {
  it("excludes open-ended-only, offshore, and FoF sub-sections", () => {
    const arr = ids();
    expect(arr.some((id) => id.startsWith("04.14."))).toBe(false); // Redemptions (open-ended only)
    expect(arr.includes("04.07.36")).toBe(false);                  // offshore listing
    expect(arr.includes("04.22.164")).toBe(false);                 // FoF portfolios
    expect(arr.includes("04.13.77")).toBe(false);                  // pre-launch only
    expect(arr.includes("04.20.144")).toBe(false);                 // american waterfall only
  });

  it("includes closed-ended terms and always-on fee questions", () => {
    const arr = ids();
    expect(arr.includes("04.12.62")).toBe(true);  // closed-ended initial close
    expect(arr.includes("04.18.116")).toBe(true); // management fee %
    expect(arr.includes("04.06.25")).toBe(true);  // fund domicile
  });

  it("hides dependsOn follow-ups until the parent answer triggers them", () => {
    expect(ids().includes("04.09.48")).toBe(false);                       // "if >25%" — no answer yet
    expect(ids({ "04.09.47": "30" }).includes("04.09.48")).toBe(true);    // 47 > 25 → follow-up appears
  });

  it("master-feeder questions stay out for a non-master-feeder BDC", () => {
    const arr = ids();
    expect(arr.includes("04.09.53")).toBe(false);
    expect(arr.includes("04.11.58")).toBe(false);
  });
});
