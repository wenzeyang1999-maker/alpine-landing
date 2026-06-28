/**
 * Stage-2 generation — turn grounded facts + rubric output + retrieved exemplars
 * into house-voice chapter prose. This is the assembler (the IP): deterministic
 * skeleton + distilled style guide + few-shot exemplars + grounded facts, with a
 * pluggable LLM client so it runs with a mock today and the real Anthropic adapter
 * when a key is set.
 *
 * Grounding contract: the model MUST weave only the provided facts and cite each
 * asserted fact with its source id via [[REF:<id>]]; post-generation we extract
 * those markers, resolve them to SourceRefs, and scrub banned terms.
 */
import { RAG, SourceRef, RatedNarrative } from "./contract";
import { StyleExemplar, REGISTER, PHRASEBOOK, BANNED, scrubViolations, ratingRationaleSentence } from "./style";

/** Minimal LLM interface — implemented by the Anthropic fetch client and the mock. */
export type GenerationClient = {
  complete(req: {
    system: string;
    messages: { role: "user" | "assistant"; content: string }[];
    model?: string;
    temperature?: number;
    maxTokens?: number;
  }): Promise<string>;
};

/** One grounded fact handed to the generator (a call-guide answer + its evidence). */
export type GroundedFact = { prompt: string; value: string; source?: SourceRef };

export type ChapterFacts = {
  chapterNum: number;
  chapterTitle: string; // the report-facing label, e.g. "Manager, Ownership & Governance"
  strategy: string;
  rating: RAG; // computed by rubric.ts
  ratingRationaleHint: string; // the rubric's one-line "why this color" (seed, not verbatim)
  facts: GroundedFact[];
};

// ─────────────────────────────────────────────────────────────────────────────
// Prompt assembly
// ─────────────────────────────────────────────────────────────────────────────

function styleGuideBlock(): string {
  const phrases = (Object.keys(PHRASEBOOK) as (keyof typeof PHRASEBOOK)[])
    .map((k) => "  - " + k + ": " + PHRASEBOOK[k].slice(0, 2).map((p) => '"' + p + '"').join(" / "))
    .join("\n");
  return [
    "HOUSE STYLE (Alpine institutional ODD voice):",
    "- Voice: " + REGISTER.person + ".",
    "- " + REGISTER.evidenceFraming + ".",
    "- " + REGISTER.hedging + ".",
    "- " + REGISTER.quantify + ".",
    "Connectors to prefer (use naturally, do not overuse):",
    phrases,
    "BANNED — never write any of: " + BANNED.join(", ") + ".",
  ].join("\n");
}

function colorWord(r: RAG): "Green" | "Amber" | "Red" {
  return r === "green" ? "Green" : r === "yellow" ? "Amber" : "Red";
}

export function buildGenerationPrompt(
  facts: ChapterFacts,
  exemplars: StyleExemplar[],
): { system: string; user: string } {
  const system = [
    "You are an Alpine operational due diligence analyst drafting one chapter of an institutional ODD report.",
    "Write a single, tightly-reasoned chapter narrative in Alpine's house voice.",
    "",
    styleGuideBlock(),
    "",
    "HARD RULES:",
    "1. Use ONLY the facts provided. Do not invent facts, names, figures, dates, or providers.",
    "2. Cite every asserted fact with its source id inline as [[REF:<id>]] immediately after the claim.",
    "3. Attribute manager-sourced statements explicitly (e.g. 'The Manager represented that ...').",
    "4. End the chapter with the rating-rationale sentence: '<This supports/drives> our <Color> rating for <Chapter>.'",
    "5. Output the chapter body only — no headings, no preamble, HTML <p> paragraphs.",
  ].join("\n");

  const exemplarBlock = exemplars
    .map(
      (e, i) =>
        "EXEMPLAR " + (i + 1) + " (chapter " + e.chapterNum + ", " + e.strategy + ", " + e.rating + "):\n" + e.narrative,
    )
    .join("\n\n");

  const factsBlock = facts.facts
    .map((f) => {
      const src = f.source ? " [[REF:" + f.source.id + "]] (source: " + f.source.docName + ')' : " (no source — attribute to the Manager or abstain)";
      return "- " + f.prompt + ": " + f.value + src;
    })
    .join("\n");

  const user = [
    "Draft Chapter " + facts.chapterNum + ": " + facts.chapterTitle + " for a " + facts.strategy + " fund.",
    "Target rating (computed by the rubric, do not re-decide): " + colorWord(facts.rating) + ".",
    "Rubric rationale to reflect: " + facts.ratingRationaleHint,
    "",
    "GROUNDED FACTS (use only these; reproduce each fact's source marker exactly where you assert it):",
    factsBlock,
    "",
    exemplars.length ? "Match the voice and structure of these real exemplars (do NOT copy their facts):\n\n" + exemplarBlock : "",
    "",
    "Close with: " + ratingRationaleSentence(colorWord(facts.rating), facts.chapterTitle),
  ].join("\n");

  return { system, user };
}

// ─────────────────────────────────────────────────────────────────────────────
// Orchestration
// ─────────────────────────────────────────────────────────────────────────────

const REF_MARKER = /\[\[REF:([^\]]+)\]\]/g;

export function extractRefMarkers(html: string): string[] {
  const ids: string[] = [];
  let m: RegExpExecArray | null;
  REF_MARKER.lastIndex = 0;
  while ((m = REF_MARKER.exec(html)) !== null) ids.push(m[1]);
  return ids;
}

export type GenerationResult = {
  narrative: RatedNarrative;
  violations: string[]; // banned-term hits (empty = clean)
  ungroundedMarkers: string[]; // [[REF:id]] ids with no matching source fact
};

/** Generate one chapter narrative, wire citations from the grounded facts, and check guards. */
export async function generateChapterNarrative(
  client: GenerationClient,
  facts: ChapterFacts,
  exemplars: StyleExemplar[],
  opts?: { model?: string; temperature?: number },
): Promise<GenerationResult> {
  const { system, user } = buildGenerationPrompt(facts, exemplars);
  const html = await client.complete({
    system,
    messages: [{ role: "user", content: user }],
    model: opts?.model,
    temperature: opts?.temperature ?? 0.3,
    maxTokens: 1500,
  });

  const violations = scrubViolations(html);

  const sourceById: Record<string, SourceRef> = {};
  for (let i = 0; i < facts.facts.length; i++) {
    const s = facts.facts[i].source;
    if (s) sourceById[s.id] = s;
  }
  const markerIds = extractRefMarkers(html);
  const citations: SourceRef[] = [];
  const ungroundedMarkers: string[] = [];
  const seen: Record<string, boolean> = {};
  for (let i = 0; i < markerIds.length; i++) {
    const id = markerIds[i];
    const src = sourceById[id];
    if (!src) {
      ungroundedMarkers.push(id);
    } else if (!seen[id]) {
      seen[id] = true;
      citations.push(src);
    }
  }

  return { narrative: { html, citations }, violations, ungroundedMarkers };
}
