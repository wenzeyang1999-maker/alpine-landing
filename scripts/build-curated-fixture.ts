/**
 * Regenerate a curated Ch4 fixture from a fund's cached (or live) SEC filing.
 *
 *   ANTHROPIC_API_KEY=… npx tsx scripts/build-curated-fixture.ts <CIK> [edgarUrl]
 *
 * Reads the cached normalized 10-K at lib/engine/.data/stage1/funds/<CIK>/tenk.norm.txt
 * (or fetches edgarUrl), runs the REAL profile + Ch4 extraction (quote-gated), and prints a
 * CuratedFixture-shaped JSON to stdout for pasting into fixtures/curated-ch4.ts. Every
 * "answered" value is gate-verified, so a regenerated fixture is grounded by construction.
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { ingestFromUrl } from "../lib/engine/demo/ingest";
import { inferProfile } from "../lib/engine/demo/profile";
import { extractChapter } from "../lib/engine/demo/extract-llm";
import { CH4_QUESTIONS } from "../lib/engine/demo/ch4-questions";
import { createAnthropicClient, MODELS } from "../lib/engine/anthropic";

async function main() {
  const cik = process.argv[2];
  const url = process.argv[3];
  if (!cik) { console.error("usage: build-curated-fixture.ts <CIK> [edgarUrl]"); process.exit(1); }

  let text = "", sourceLabel = `CIK ${cik} 10-K`;
  const cached = join(process.cwd(), "lib/engine/.data/stage1/funds", cik, "tenk.norm.txt");
  if (existsSync(cached)) {
    text = readFileSync(cached, "utf8");
    sourceLabel = `${cik} 10-K (cached)`;
  } else if (url) {
    const ing = await ingestFromUrl(url);
    text = ing.text; sourceLabel = ing.sourceLabel;
  } else {
    console.error(`No cached filing for ${cik} and no edgarUrl given.`); process.exit(1);
  }

  const client = createAnthropicClient({ defaultModel: MODELS.extraction });
  const inf = await inferProfile(client, text, sourceLabel, { model: MODELS.extraction });
  const answers = await extractChapter(client, CH4_QUESTIONS, text, sourceLabel, { model: MODELS.extraction, concurrency: 4 });

  const extraction: Record<string, unknown> = {};
  for (const a of answers) extraction[a.questionId] = a;

  const fixture = {
    cik,
    sourceLabel,
    profile: { strategy: inf.profile.strategy, scopes: Array.from(inf.profile.scopes) },
    provenance: {
      model: MODELS.extraction,
      promptVersion: "ch4-extract-v1",
      codeVersion: "demo-engine-v1",
      schemaVersion: "ch4.demo.v1",
      generatedAt: new Date().toISOString(),
    },
    extraction,
  };
  const answered = answers.filter((a) => a.status === "answered").length;
  console.error(`[regen] ${cik}: ${answered}/${answers.length} answered (gate-verified) · profile ${inf.profile.strategy}`);
  console.log(JSON.stringify(fixture, null, 2));
}

main().catch((e) => { console.error(e); process.exit(1); });
