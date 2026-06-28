/**
 * GenerationClient implementations.
 *
 *  • createAnthropicClient — thin fetch client for the Anthropic Messages API. No
 *    SDK dependency (full header control for the ZDR/DPA account posture). Node
 *    runtime only. Activate by setting ANTHROPIC_API_KEY.
 *  • createMockClient — deterministic, key-free generator that exercises the full
 *    Stage-2 path (grounding, citations, house voice) for tests + local dev.
 *
 * ZDR (zero data retention) is an ACCOUNT/DPA-level setting on the commercial API,
 * not a per-request header. No raw document content is logged here.
 */
import { GenerationClient } from "./generate";

// Model tiering (plan §5): haiku for extraction/verify, opus for synthesis/flags.
export const MODELS = {
  synthesis: "claude-opus-4-8",
  extraction: "claude-haiku-4-5-20251001",
} as const;

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const ANTHROPIC_VERSION = "2023-06-01";

export function createAnthropicClient(opts?: { apiKey?: string; defaultModel?: string; timeoutMs?: number }): GenerationClient {
  const apiKey = opts?.apiKey ?? process.env.ANTHROPIC_API_KEY;
  const defaultModel = opts?.defaultModel ?? MODELS.synthesis;
  const timeoutMs = opts?.timeoutMs ?? 60_000;

  return {
    async complete(req) {
      if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not set");
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      try {
        const res = await fetch(ANTHROPIC_URL, {
          method: "POST",
          signal: controller.signal,
          headers: {
            "content-type": "application/json",
            "x-api-key": apiKey,
            "anthropic-version": ANTHROPIC_VERSION,
          },
          body: JSON.stringify({
            model: req.model ?? defaultModel,
            max_tokens: req.maxTokens ?? 1500,
            temperature: req.temperature ?? 0.3,
            system: req.system,
            messages: req.messages,
          }),
        });
        if (!res.ok) {
          const detail = await res.text().catch(() => "");
          throw new Error("Anthropic API " + res.status + ": " + detail.slice(0, 500));
        }
        const data: unknown = await res.json();
        return extractText(data);
      } finally {
        clearTimeout(timer);
      }
    },
  };
}

function extractText(data: unknown): string {
  const d = data as { content?: { type?: string; text?: string }[] };
  if (!d || !Array.isArray(d.content)) throw new Error("Anthropic response missing content");
  const parts = d.content.filter((c) => c.type === "text" && typeof c.text === "string").map((c) => c.text as string);
  if (parts.length === 0) throw new Error("Anthropic response had no text content");
  return parts.join("");
}

/**
 * Deterministic mock — no API key. Reads the grounded [[REF:id]] markers and the
 * "Close with:" sentence out of the assembled user prompt and emits a clean,
 * house-voice paragraph that cites every fact. Lets the Stage-2 path run + be
 * tested end-to-end before the real key is wired.
 */
export function createMockClient(): GenerationClient {
  return {
    async complete(req) {
      const user = req.messages.map((m) => m.content).join("\n");
      const markers: string[] = [];
      const re = /\[\[REF:[^\]]+\]\]/g;
      let m: RegExpExecArray | null;
      while ((m = re.exec(user)) !== null) markers.push(m[0]);
      const closeMatch = /Close with:\s*(.+)\s*$/m.exec(user);
      const close = closeMatch ? closeMatch[1].trim() : "This supports our rating for this chapter.";
      const cited = markers.length ? " " + markers.join(" ") : "";
      return (
        "<p>The Manager represented that the relevant controls operate as described." +
        cited +
        " We note that the arrangements are consistent with institutional expectations for a fund of this type.</p>" +
        "<p>" +
        close +
        "</p>"
      );
    },
  };
}
