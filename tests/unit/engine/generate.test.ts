import { describe, it, expect } from "vitest";
import { buildGenerationPrompt, generateChapterNarrative, extractRefMarkers, ChapterFacts } from "@/lib/engine/generate";
import { createMockClient } from "@/lib/engine/anthropic";
import { SourceRef } from "@/lib/engine/contract";
import { StyleExemplar } from "@/lib/engine/style";

const src = (id: string, doc: string): SourceRef => ({ id, kind: "manager_upload", docName: doc, quote: "q" });

const FACTS: ChapterFacts = {
  chapterNum: 1,
  chapterTitle: "Manager, Ownership & Governance",
  strategy: "vc",
  rating: "green",
  ratingRationaleHint: "No material control gaps at the management company level.",
  facts: [
    { prompt: "Headcount", value: "seven employees", source: src("src_a", "DDQ.pdf") },
    { prompt: "Ownership", value: "50/50 between two founders", source: src("src_b", "PPM.pdf") },
  ],
};

const EXEMPLARS: StyleExemplar[] = [
  { reportId: "r1", chapterNum: 1, strategy: "vc", rating: "green", narrative: "The Manager represented that it has eight staff. This supports our Green rating for Manager." },
];

describe("Stage-2 prompt assembly", () => {
  it("embeds house style, grounded facts (with [[REF]]), exemplars, and the close sentence", () => {
    const { system, user } = buildGenerationPrompt(FACTS, EXEMPLARS);
    expect(system).toContain("Alpine");
    expect(system).toContain("BANNED");
    expect(system).toContain("Castle Hall"); // appears in the banned list
    expect(user).toContain("[[REF:src_a]]");
    expect(user).toContain("seven employees");
    expect(user).toContain("EXEMPLAR 1");
    expect(user).toContain("Green rating for Manager, Ownership & Governance");
  });

  it("extractRefMarkers pulls ids in order", () => {
    expect(extractRefMarkers("a [[REF:x]] b [[REF:y]]")).toEqual(["x", "y"]);
  });
});

describe("Stage-2 generation (mock client) — grounded, cited, house voice, clean", () => {
  it("produces a narrative that cites every grounded fact and trips no guards", async () => {
    const res = await generateChapterNarrative(createMockClient(), FACTS, EXEMPLARS);
    expect(res.violations).toEqual([]); // no banned terms
    expect(res.ungroundedMarkers).toEqual([]); // every [[REF]] resolves to a fact source
    expect(res.narrative.citations.map((c) => c.id).sort()).toEqual(["src_a", "src_b"]);
    expect(res.narrative.html).toContain("The Manager represented"); // house voice
    expect(res.narrative.html).toContain("Green rating for"); // closes on the rating sentence
  });

  it("flags an ungrounded citation if the model invents a ref id", async () => {
    const lyingClient = { async complete() { return "<p>Fabricated [[REF:does_not_exist]].</p>"; } };
    const res = await generateChapterNarrative(lyingClient, FACTS, EXEMPLARS);
    expect(res.ungroundedMarkers).toContain("does_not_exist");
    expect(res.narrative.citations).toEqual([]);
  });

  it("flags a banned term if it slips into output (defense in depth)", async () => {
    const sloppyClient = { async complete() { return "<p>Per Castle Hall's review, controls are adequate.</p>"; } };
    const res = await generateChapterNarrative(sloppyClient, FACTS, EXEMPLARS);
    expect(res.violations).toContain("Castle Hall");
  });
});
