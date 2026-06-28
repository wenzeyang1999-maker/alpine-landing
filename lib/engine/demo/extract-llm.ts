/**
 * Stage-1 LLM extraction for the demo. For each call-guide question:
 * retrieve passages → ask the model to extract a grounded answer + a VERBATIM quote
 * (or abstain) → run the quote-gate (quote must be a literal substring of the filing).
 * Ungrounded answers are demoted to "unsupported" and never shown as facts.
 *
 * This is the AI extract step kept honest by deterministic code — the demo's whole point.
 * Chapter-agnostic: pass any DemoQuestion[] (Ch4 fund terms, Ch7 valuation, …).
 */
import { GenerationClient } from "../generate";
import { DemoQuestion } from "./questions";
import { CH7_QUESTIONS } from "./ch7-questions";
import { retrievePassages } from "./ingest";

export type AnswerStatus = "answered" | "abstained" | "unsupported";

export type ChapterAnswer = {
  questionId: string;
  label: string;
  subsection: string;
  status: AnswerStatus;
  value: string | null;
  quote: string | null;
  confidence: "high" | "medium" | "low";
  sourceLabel: string;
  filingAnswerable: boolean;
  gap?: string; // why it abstained / where it routes
};

// Back-compat aliases (Ch7 was the original demo chapter).
export type Ch7Status = AnswerStatus;
export type Ch7Answer = ChapterAnswer;

function parseJson(s: string): Record<string, unknown> | null {
  const a = s.indexOf("{");
  const b = s.lastIndexOf("}");
  if (a < 0 || b <= a) return null;
  try { return JSON.parse(s.slice(a, b + 1)); } catch { return null; }
}

async function extractOne(
  client: GenerationClient,
  q: DemoQuestion,
  text: string,
  sourceLabel: string,
  model?: string,
): Promise<ChapterAnswer> {
  const base: ChapterAnswer = {
    questionId: q.id, label: q.label, subsection: q.subsection,
    status: "abstained", value: null, quote: null, confidence: "low",
    sourceLabel, filingAnswerable: q.filingAnswerable,
  };
  const passages = retrievePassages(text, q.retrievalTerms, 4);
  if (passages.length === 0) {
    return { ...base, gap: q.filingAnswerable ? "Not located in the filing — would be confirmed on the analyst call." : "Not disclosed in filings — confirmed on the analyst call / DDQ." };
  }
  const system =
    "You are an Alpine operational due diligence analyst extracting ONE fact from a fund's SEC filing. " +
    "Use ONLY the provided passages — never outside knowledge. If the passages do not clearly answer the question, abstain. " +
    "Respond with ONLY a JSON object, no prose.";
  const user = [
    "QUESTION: " + q.ask,
    "",
    "PASSAGES (from " + sourceLabel + "):",
    ...passages.map((p, i) => "[" + (i + 1) + "] " + p.text),
    "",
    'Return JSON exactly: {"abstained": boolean, "value": string|null, "quote": string|null, "confidence": "high"|"medium"|"low"}',
    "- value: the concise answer, or null if abstained.",
    "- quote: a span copied VERBATIM (character-for-character) from one passage that supports the value, or null.",
    "- Abstain (abstained=true) if the passages do not clearly and directly answer the question. Do not guess.",
  ].join("\n");

  let raw = "";
  try {
    raw = await client.complete({ system, messages: [{ role: "user", content: user }], model, temperature: 0, maxTokens: 500 });
  } catch {
    return { ...base, gap: "Extraction unavailable — analyst review required." };
  }
  const j = parseJson(raw);
  if (!j || j.abstained === true || !j.value || !j.quote) {
    return { ...base, gap: q.filingAnswerable ? "The filing did not clearly answer this — confirmed on the analyst call." : "Not disclosed in filings — confirmed on the analyst call / DDQ." };
  }
  const value = String(j.value);
  const quote = String(j.quote);
  const confidence = (["high", "medium", "low"].indexOf(String(j.confidence)) >= 0 ? j.confidence : "medium") as ChapterAnswer["confidence"];

  // THE GATE: the quote must exist verbatim in the filing text.
  if (text.indexOf(quote) < 0) {
    return { ...base, status: "unsupported", value, quote, confidence: "low", gap: "Model's quote was not found verbatim in the filing — rejected as ungrounded (analyst review)." };
  }
  return { ...base, status: "answered", value, quote, confidence };
}

/** Extract all answers for a chapter's question set from a filing. Sequential to respect rate limits. */
/**
 * Extract a chapter's answers from a filing. Runs through a bounded-concurrency pool
 * (T7/D7): independent calls so a small pool (default 4) cuts live-upload wall-clock
 * several-fold while staying well under rate limits. Results preserve question order.
 * Set concurrency=1 for strictly sequential (e.g. a throttled environment).
 */
export async function extractChapter(
  client: GenerationClient,
  questions: DemoQuestion[],
  text: string,
  sourceLabel: string,
  opts?: { model?: string; concurrency?: number; onResult?: (a: ChapterAnswer, i: number) => void },
): Promise<ChapterAnswer[]> {
  const cap = Math.max(1, Math.min(opts?.concurrency ?? 4, 8));
  const out: ChapterAnswer[] = new Array(questions.length);
  let next = 0;
  async function worker() {
    while (true) {
      const i = next++;
      if (i >= questions.length) return;
      out[i] = await extractOne(client, questions[i], text, sourceLabel, opts?.model);
      opts?.onResult?.(out[i], i); // lets the route stream each fill to the client (DD2)
    }
  }
  await Promise.all(Array.from({ length: Math.min(cap, questions.length) }, worker));
  return out;
}

/** Convenience wrapper for the original Chapter-7 set. */
export async function extractCh7(
  client: GenerationClient,
  text: string,
  sourceLabel: string,
  opts?: { model?: string },
): Promise<ChapterAnswer[]> {
  return extractChapter(client, CH7_QUESTIONS, text, sourceLabel, opts);
}

/**
 * Key-free mock for local testing of the FULL flow (retrieval → extract → gate):
 * echoes a verbatim span from the first retrieved passage so the gate passes.
 */
export function createMockExtractClient(): GenerationClient {
  return {
    async complete(req) {
      const user = req.messages.map((m) => m.content).join("\n");
      const m = /\[1\]\s+([\s\S]*?)(?:\n\[2\]|\nReturn JSON)/.exec(user);
      const passage = (m ? m[1] : "").trim();
      if (!passage) return JSON.stringify({ abstained: true, value: null, quote: null, confidence: "low" });
      const quote = passage.split(/(?<=[.;])\s/)[0].slice(0, 160); // first sentence-ish, verbatim
      return JSON.stringify({ abstained: false, value: "[mock] " + quote.slice(0, 60), quote, confidence: "medium" });
    },
  };
}
