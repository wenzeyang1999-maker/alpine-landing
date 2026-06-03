import { describe, it, expect, vi } from "vitest";

// Mock RefDot so importing the helper doesn't pull the heavy component tree, and
// so citation markers are trivial to identify in the returned React element tree
// (any element with a `sources` prop is a citation dot).
vi.mock("@/components/app-portal/review/RefDot", () => ({
  RefDot: function RefDotMock() {
    return null;
  },
}));

import { renderCitations, stripRefs, hasRefs } from "@/lib/app-portal/cited-text";

/* eslint-disable @typescript-eslint/no-explicit-any */

// Flatten a renderCitations result into an ordered array of child nodes.
function nodes(result: any): any[] {
  if (result == null) return [];
  if (typeof result === "string") return [result];
  if (Array.isArray(result)) return result;
  if (result.props && "children" in result.props) {
    const c = result.props.children;
    return Array.isArray(c) ? c : [c];
  }
  return [result];
}
const dots = (r: any) => nodes(r).filter((n) => n && typeof n === "object" && n.props && n.props.sources);
const texts = (r: any) => nodes(r).filter((n) => typeof n === "string");

describe("renderCitations — parsing", () => {
  it("returns the original string unchanged when there are no tokens", () => {
    const r = renderCitations("plain prose, no tokens");
    expect(r).toBe("plain prose, no tokens");
  });

  it("renders one dot for a single token, with the surrounding text intact", () => {
    const r = renderCitations('Net assets were $280.3M.[[REF:Form ADV:"net assets 280.3M"]] Next.');
    expect(dots(r)).toHaveLength(1);
    expect(dots(r)[0].props.sources).toEqual([{ source: "Form ADV", quote: "net assets 280.3M" }]);
    expect(texts(r)).toEqual(["Net assets were $280.3M.", " Next."]);
  });

  it("merges two directly-adjacent tokens into one dot with two sources, order preserved", () => {
    const r = renderCitations('Pari passu.[[REF:LPA:"a"]][[REF:DDQ:"b"]] Tail.');
    expect(dots(r)).toHaveLength(1);
    expect(dots(r)[0].props.sources).toEqual([
      { source: "LPA", quote: "a" },
      { source: "DDQ", quote: "b" },
    ]);
  });

  it("merges three adjacent tokens into one dot with three sources", () => {
    const r = renderCitations('X.[[REF:LPA:"a"]][[REF:DDQ:"b"]][[REF:PPM:"c"]]');
    expect(dots(r)).toHaveLength(1);
    expect(dots(r)[0].props.sources.map((s: any) => s.source)).toEqual(["LPA", "DDQ", "PPM"]);
  });

  it("keeps tokens separated by whitespace as distinct dots", () => {
    const r = renderCitations('[[REF:LPA:"a"]] [[REF:DDQ:"b"]]');
    expect(dots(r)).toHaveLength(2);
  });

  it("handles a token at the very start and at the very end", () => {
    const start = renderCitations('[[REF:LPA:"a"]] rest');
    expect(nodes(start)[0].props.sources).toBeTruthy();
    const end = renderCitations('end.[[REF:LPA:"a"]]');
    const ns = nodes(end);
    expect(ns[0]).toBe("end.");
    expect(ns[ns.length - 1].props.sources).toBeTruthy();
  });

  it("accepts source keys with spaces and quotes with commas", () => {
    const r = renderCitations('q.[[REF:Apex Verification Call:"confirmed admin, auditor, and bank"]]');
    expect(dots(r)[0].props.sources[0]).toEqual({
      source: "Apex Verification Call",
      quote: "confirmed admin, auditor, and bank",
    });
  });

  it("leaves malformed tokens (no closing ]] / no quotes) as literal text — no throw", () => {
    expect(renderCitations('text [[REF:LPA:"a"] more')).toBe('text [[REF:LPA:"a"] more');
    expect(renderCitations("[[REF:LPA:bareword]]")).toBe("[[REF:LPA:bareword]]");
  });

  it("passes slug and variant through to the dot", () => {
    const r = renderCitations('q.[[REF:DDQ:"x"]]', { slug: "trellis-capital-iv", variant: "prose" });
    expect(dots(r)[0].props.slug).toBe("trellis-capital-iv");
    expect(dots(r)[0].props.variant).toBe("prose");
  });

  it("runs the text segments through renderText (e.g. inline formatting)", () => {
    const r = renderCitations('a[[REF:DDQ:"x"]]b', { renderText: (t) => `<${t}>` });
    expect(texts(r)).toEqual(["<a>", "<b>"]);
  });
});

describe("stripRefs / hasRefs", () => {
  it("removes tokens and collapses the whitespace they leave", () => {
    const out = stripRefs('Net assets were $280.3M.[[REF:Form ADV:"x"]]  Next.');
    expect(out).toBe("Net assets were $280.3M. Next.");
    expect(out).not.toContain("[[REF");
  });
  it("hasRefs detects presence/absence", () => {
    expect(hasRefs('a.[[REF:DDQ:"x"]]')).toBe(true);
    expect(hasRefs("no tokens here")).toBe(false);
  });
});
