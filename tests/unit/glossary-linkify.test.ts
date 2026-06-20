import { describe, it, expect } from "vitest";
import type { ReactNode } from "react";
import { linkify } from "@/components/learning/linkify";

// Walk linkify output and collect { text, id } for each <a> produced.
// linkify returns React nodes (plain objects here, no DOM render needed).
function links(node: ReactNode): Array<{ text: string; id: string }> {
  if (typeof node === "string") return [];
  const arr = Array.isArray(node) ? node : [node];
  const out: Array<{ text: string; id: string }> = [];
  for (const n of arr) {
    if (n && typeof n === "object" && "props" in n) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const p = (n as any).props;
      if (p && p["data-term-link"]) out.push({ text: String(p.children), id: p["data-term-link"] });
    }
  }
  return out;
}
const ids = (node: ReactNode) => links(node).map((l) => l.id);

describe("linkify two-pass matcher", () => {
  it("links an ALL-CAPS acronym (case-sensitive)", () => {
    expect(ids(linkify("The SEC reviews Form ADV."))).toContain("sec");
  });

  it("does NOT link an acronym hiding inside a lowercase word or lowercased", () => {
    expect(ids(linkify("Reviewed in the second quarter."))).not.toContain("sec");
    expect(ids(linkify("the sec filing"))).not.toContain("sec");
  });

  it("links a multi-word phrase as a whole (longest-first), not its sub-word", () => {
    const l = links(linkify("A European Waterfall structure."));
    expect(l.map((x) => x.id)).toContain("european-waterfall");
    expect(l.find((x) => x.id === "european-waterfall")?.text).toBe("European Waterfall");
  });

  it("links phrases case-insensitively", () => {
    expect(ids(linkify("compare european waterfall vs american waterfall")))
      .toEqual(expect.arrayContaining(["european-waterfall", "american-waterfall"]));
  });

  it("links only the first occurrence of a term per call", () => {
    expect(ids(linkify("NAV is the NAV figure")).filter((x) => x === "nav")).toHaveLength(1);
  });

  it("skips terms excluded from the allowlist", () => {
    const got = ids(linkify("IC approval and PB custody"));
    expect(got).not.toContain("ic");
    expect(got).not.toContain("pb");
  });

  it("links punctuated forms (SOC 1, MFA)", () => {
    expect(ids(linkify("The SOC 1 report"))).toContain("soc-1");
    expect(ids(linkify("MFA is enforced"))).toContain("mfa");
  });

  it("does not self-link a term to its own card", () => {
    expect(ids(linkify("AIFMD relates to AIF", "aifmd"))).toEqual(["aif"]);
  });

  it("returns the raw string when nothing matches", () => {
    expect(linkify("nothing notable here")).toBe("nothing notable here");
  });
});
