/**
 * AI-suggested prefill for UNGROUNDED call-guide questions (Lane B, D3).
 *
 * POST { profile, questions: [{id, prompt}] } → { suggestions: Record<id, string> }.
 * With ANTHROPIC_API_KEY the model proposes a reasonable, plainly-labeled analyst answer for
 * each ungrounded question; the UI walls these off (amber, "AI-suggested · confirm on call")
 * and never renders them like a grounded filing answer. Without a key returns {} (D3: no
 * placeholder floor). Gated. These are NEVER facts — they are editable call-prep fills.
 */
import { isGatedRequestOk } from "@/lib/engine/demo/gate";
import { createAnthropicClient, MODELS } from "@/lib/engine/anthropic";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const MAX_QUESTIONS = 40; // bound the batch / cost

type AskedQuestion = { id: string; prompt: string };

function parseQuestions(raw: unknown): AskedQuestion[] {
  if (!Array.isArray(raw)) return [];
  const out: AskedQuestion[] = [];
  for (let i = 0; i < raw.length && out.length < MAX_QUESTIONS; i++) {
    const q = raw[i] as { id?: unknown; prompt?: unknown };
    if (q && typeof q.id === "string" && typeof q.prompt === "string" && q.prompt.trim()) {
      out.push({ id: q.id, prompt: q.prompt });
    }
  }
  return out;
}

function parseJson(s: string): Record<string, unknown> | null {
  const a = s.indexOf("{");
  const b = s.lastIndexOf("}");
  if (a < 0 || b <= a) return null;
  try {
    return JSON.parse(s.slice(a, b + 1)) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  if (!(await isGatedRequestOk(req))) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { profile?: unknown; questions?: unknown };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return Response.json({ error: "Bad request" }, { status: 400 });
  }

  const questions = parseQuestions(body.questions);
  // No key → no suggestions (D3: amber fields stay empty). Not an error.
  if (!process.env.ANTHROPIC_API_KEY || questions.length === 0) {
    return Response.json({ suggestions: {} }, { headers: { "Cache-Control": "no-store" } });
  }

  const strategy =
    body.profile && typeof body.profile === "object" && typeof (body.profile as { strategy?: unknown }).strategy === "string"
      ? String((body.profile as { strategy: string }).strategy)
      : "credit";

  const client = createAnthropicClient({ defaultModel: MODELS.synthesis });
  const system = [
    "You are an Alpine operational due diligence analyst preparing for a manager call.",
    "For each question below, propose a SHORT, reasonable answer that a typical fund of this type would give,",
    "phrased as a tentative analyst expectation to be confirmed on the call (NOT a fact, NOT a quotation).",
    "Keep each answer to one sentence. Never invent specific numbers, names, dates, or providers.",
    "Never use em dashes or en dashes.",
    "Respond with ONLY a JSON object mapping each question id to its suggested answer string.",
  ].join("\n");
  const user = [
    "Fund strategy: " + strategy + ".",
    "",
    "QUESTIONS:",
    ...questions.map((q) => q.id + ": " + q.prompt),
    "",
    'Return JSON exactly: { "<id>": "<suggested answer>", ... } for every id above.',
  ].join("\n");

  let suggestions: Record<string, string> = {};
  try {
    const raw = await client.complete({ system, messages: [{ role: "user", content: user }], temperature: 0.3, maxTokens: 1500 });
    const j = parseJson(raw);
    if (j) {
      const allowed = new Set(questions.map((q) => q.id));
      for (const id of Object.keys(j)) {
        if (allowed.has(id) && typeof j[id] === "string" && (j[id] as string).trim()) {
          suggestions[id] = (j[id] as string).trim();
        }
      }
    }
  } catch {
    suggestions = {}; // model/transport failure → no suggestions, never a 500
  }

  return Response.json({ suggestions }, { headers: { "Cache-Control": "no-store" } });
}
