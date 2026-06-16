import { describe, it, expect } from "vitest";
import { TRELLIS_TOPIC_DATA, TRELLIS_SOURCE_META } from "@/lib/app-portal/trellis-data";

/* eslint-disable @typescript-eslint/no-explicit-any */

// The exact grammar renderCitations parses. Keep in sync with lib/app-portal/cited-text.tsx.
const REF_RE = /\[\[REF:([^\]:"]+):"([^"]+)"\]\]/g;

const topics = Object.entries(TRELLIS_TOPIC_DATA) as [string, any][];
const validKeys = new Set(Object.keys(TRELLIS_SOURCE_META));

describe("Trellis narrative citations", () => {
  it("every topic's findings carries inline citations", () => {
    for (const [num, topic] of topics) {
      const text: string = topic.findings || "";
      REF_RE.lastIndex = 0;
      expect(REF_RE.test(text), `topic ${num} has no [[REF]] tokens`).toBe(true);
    }
  });

  it("every [[REF:KEY points at a real TRELLIS_SOURCE_META key (catches typos)", () => {
    const bad: { topic: string; key: string }[] = [];
    for (const [num, topic] of topics) {
      const text: string = topic.findings || "";
      let m: RegExpExecArray | null;
      REF_RE.lastIndex = 0;
      while ((m = REF_RE.exec(text)) !== null) {
        if (!validKeys.has(m[1])) bad.push({ topic: num, key: m[1] });
      }
    }
    expect(bad, `unknown citation keys: ${JSON.stringify(bad)}`).toEqual([]);
  });

  it("has no malformed tokens (every '[[REF:' is a complete, parseable token)", () => {
    for (const [num, topic] of topics) {
      const text: string = topic.findings || "";
      const opened = (text.match(/\[\[REF:/g) || []).length;
      const matched = (text.match(REF_RE) || []).length;
      expect(matched, `topic ${num}: ${opened} '[[REF:' opens but ${matched} parse cleanly`).toBe(opened);
    }
  });
});
