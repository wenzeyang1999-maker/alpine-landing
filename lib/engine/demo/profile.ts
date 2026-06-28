/**
 * inferProfile — classify a fund's strategy + scope tags from its filing (T3, DD2).
 *
 * D2 chose LLM inference; this keeps it honest the same way extraction does:
 *  - the model must return a VERBATIM quote supporting the classification, gate-checked
 *    against the filing (a classification with an ungrounded quote is demoted, not trusted)
 *  - anything short of a high-confidence, gated result is marked `provisional`, so the UI
 *    shows the detected profile as an editable, correct-me chip row rather than a silent guess
 *  - unknown/garbled output falls back to a conservative default (credit / closed-ended BDC,
 *    the demo's fund class) rather than throwing.
 */
import { GenerationClient } from "../generate";
import { ManagerProfile, StrategyCode, ScopeTag } from "../../manager/framework-full";
import { retrievePassages } from "./ingest";

const STRATEGIES: StrategyCode[] = ["vc", "pe", "hf", "credit", "real_estate", "real_assets", "secondaries", "fof"];
// The scope tags a public filing can plausibly establish (others are call/DDQ-only).
const INFERABLE_SCOPES: ScopeTag[] = ["closed_ended", "open_ended", "offshore_fund", "master_feeder", "fund_of_funds"];

const CLASSIFY_TERMS = [
  "business development company", "closed-end", "open-end", "non-diversified",
  "externally managed", "master-feeder", "feeder fund", "fund of funds",
  "specialty finance", "direct lending", "private equity", "hedge", "we are a",
];

export type ProfileInference = {
  profile: ManagerProfile;
  evidence: { quote: string; sourceLabel: string } | null;
  confidence: "high" | "medium" | "low";
  provisional: boolean; // true → UI must show editable chips and ask the user to confirm
};

function parseJson(s: string): Record<string, unknown> | null {
  const a = s.indexOf("{");
  const b = s.lastIndexOf("}");
  if (a < 0 || b <= a) return null;
  try { return JSON.parse(s.slice(a, b + 1)); } catch { return null; }
}

/** The conservative fallback when inference fails: the demo's fund class, flagged provisional. */
function fallback(): ProfileInference {
  return {
    profile: { strategy: "credit", scopes: new Set<ScopeTag>(["closed_ended"]) },
    evidence: null,
    confidence: "low",
    provisional: true,
  };
}

export async function inferProfile(
  client: GenerationClient,
  text: string,
  sourceLabel: string,
  opts?: { model?: string },
): Promise<ProfileInference> {
  const passages = retrievePassages(text, CLASSIFY_TERMS, 4);
  if (passages.length === 0) return fallback();

  const system =
    "You are an Alpine analyst classifying a fund from its SEC filing. Use ONLY the passages. " +
    "Respond with ONLY a JSON object, no prose.";
  const user = [
    "Classify this fund.",
    "",
    "PASSAGES (from " + sourceLabel + "):",
    ...passages.map((p, i) => "[" + (i + 1) + "] " + p.text),
    "",
    'Return JSON exactly: {"strategy": one of ["vc","pe","hf","credit","real_estate","real_assets","secondaries","fof"], ' +
      '"scopes": array from ["closed_ended","open_ended","offshore_fund","master_feeder","fund_of_funds"], ' +
      '"quote": a VERBATIM span copied from one passage that supports the classification, ' +
      '"confidence": "high"|"medium"|"low"}',
  ].join("\n");

  let raw = "";
  try {
    raw = await client.complete({ system, messages: [{ role: "user", content: user }], model: opts?.model, temperature: 0, maxTokens: 300 });
  } catch {
    return fallback();
  }
  const j = parseJson(raw);
  if (!j) return fallback();

  const strategy = STRATEGIES.includes(j.strategy as StrategyCode) ? (j.strategy as StrategyCode) : null;
  const scopes = new Set<ScopeTag>(
    Array.isArray(j.scopes) ? (j.scopes as unknown[]).filter((s): s is ScopeTag => INFERABLE_SCOPES.includes(s as ScopeTag)) : [],
  );
  const quote = typeof j.quote === "string" ? j.quote : "";
  const declared = (["high", "medium", "low"].indexOf(String(j.confidence)) >= 0 ? j.confidence : "low") as ProfileInference["confidence"];

  // THE GATE: the supporting quote must exist verbatim in the filing.
  const gated = quote.length > 0 && text.indexOf(quote) >= 0;

  if (!strategy || !gated) {
    // Keep whatever we could read, but flag provisional and never claim high confidence.
    return {
      profile: { strategy: strategy ?? "credit", scopes: scopes.size ? scopes : new Set<ScopeTag>(["closed_ended"]) },
      evidence: gated ? { quote, sourceLabel } : null,
      confidence: "low",
      provisional: true,
    };
  }

  return {
    profile: { strategy, scopes: scopes.size ? scopes : new Set<ScopeTag>(["closed_ended"]) },
    evidence: { quote, sourceLabel },
    confidence: declared,
    provisional: declared !== "high",
  };
}
