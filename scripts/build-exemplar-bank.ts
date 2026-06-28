/**
 * Generate the few-shot exemplar bank from the report corpus.
 *
 *   npx tsx scripts/build-exemplar-bank.ts "<corpus-dir>" [out.json]
 *
 * Default corpus dir + output are below. The output is gitignored (proprietary
 * corpus prose). Re-run whenever the corpus changes.
 */
import { loadExemplarBankFromDir, writeBank } from "../lib/engine/bank-loader";

const DEFAULT_DIR =
  "/Users/azhang/Documents/SME Digital Operations Studio & Implementation Analyst Platform/output/Trellis Styled Reports/Markdown";
const DEFAULT_OUT = "lib/engine/.data/exemplar-bank.json";

const dir = process.argv[2] || DEFAULT_DIR;
const out = process.argv[3] || DEFAULT_OUT;

const bank = loadExemplarBankFromDir(dir);
writeBank(out, bank);

const byChapter: Record<number, number> = {};
const byStrategy: Record<string, number> = {};
for (const e of bank) {
  byChapter[e.chapterNum] = (byChapter[e.chapterNum] || 0) + 1;
  byStrategy[e.strategy] = (byStrategy[e.strategy] || 0) + 1;
}
console.log("Exemplar bank written: " + out);
console.log("  total exemplars: " + bank.length);
console.log("  by chapter: " + JSON.stringify(byChapter));
console.log("  by strategy: " + JSON.stringify(byStrategy));
