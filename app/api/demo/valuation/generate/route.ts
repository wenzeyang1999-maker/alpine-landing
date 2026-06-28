/**
 * Stage-2 Chapter-4 draft (Lane B, D1 hybrid).
 *
 * POST { profile, answers, edits?, ticker?, name? } → Ch4Report (the SAME type the curated
 * funds render). The deterministic spine owns every fact; with ANTHROPIC_API_KEY present the
 * connective prose is polished by the model (facts frozen — see ch4-generate.polish). Without
 * a key the deterministic draft is returned, so this never 500s for a missing key. Gated.
 */
import { isGatedRequestOk } from "@/lib/engine/demo/gate";
import { verifyAnswer } from "@/lib/engine/demo/answer-sign";
import { assembleReport, polish } from "@/lib/engine/demo/ch4-generate";
import type { ChapterAnswer } from "@/lib/engine/demo/extract-llm";
import type { ManagerProfile, StrategyCode, ScopeTag } from "@/lib/manager/framework-full";
import { createAnthropicClient, MODELS } from "@/lib/engine/anthropic";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const STRATEGIES: StrategyCode[] = ["vc", "pe", "hf", "credit", "real_estate", "real_assets", "secondaries", "fof"];

/** Coerce the wire profile ({strategy, scopes:[]}) into a ManagerProfile (Set). */
function toProfile(raw: unknown): ManagerProfile | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as { strategy?: unknown; scopes?: unknown };
  const strategy = STRATEGIES.indexOf(r.strategy as StrategyCode) >= 0 ? (r.strategy as StrategyCode) : "credit";
  const scopeArr = Array.isArray(r.scopes) ? (r.scopes as unknown[]).filter((s): s is ScopeTag => typeof s === "string") : [];
  return { strategy, scopes: new Set<ScopeTag>(scopeArr) };
}

export async function POST(req: Request) {
  if (!(await isGatedRequestOk(req))) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { profile?: unknown; answers?: unknown; sigs?: unknown; edits?: unknown; ticker?: unknown; name?: unknown };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return Response.json({ error: "Bad request" }, { status: 400 });
  }

  const profile = toProfile(body.profile);
  if (!profile) {
    return Response.json({ error: "A fund profile is required." }, { status: 400 });
  }
  if (!body.answers || typeof body.answers !== "object") {
    return Response.json({ error: "Extraction answers are required." }, { status: 400 });
  }

  const answers = body.answers as Record<string, ChapterAnswer>;
  const sigs = (body.sigs && typeof body.sigs === "object" ? body.sigs : {}) as Record<string, string>;
  const edits = (body.edits && typeof body.edits === "object" ? body.edits : {}) as Record<string, string>;

  // D5: only answers the server actually signed may render as grounded (filing). A forged or
  // tampered "answered" answer fails verification and is dropped, so it cannot wear the green
  // quote-gated badge. Abstained answers carry no grounded claim and pass through unchanged.
  const verified: Record<string, ChapterAnswer> = {};
  const ansIds = Object.keys(answers);
  for (let i = 0; i < ansIds.length; i++) {
    const id = ansIds[i];
    const a = answers[id];
    if (!a) continue;
    if (a.status === "answered") {
      if (await verifyAnswer(a, sigs[id])) verified[id] = a;
    } else {
      verified[id] = a;
    }
  }

  const draft = assembleReport({
    profile,
    answers: verified,
    edits,
    ticker: typeof body.ticker === "string" ? body.ticker : undefined,
    name: typeof body.name === "string" ? body.name : undefined,
  });

  // Deterministic when no key; polish connective prose when a key is present.
  const client = process.env.ANTHROPIC_API_KEY ? createAnthropicClient({ defaultModel: MODELS.synthesis }) : null;
  const report = await polish(client, draft);

  return Response.json(report, { headers: { "Cache-Control": "no-store" } });
}
