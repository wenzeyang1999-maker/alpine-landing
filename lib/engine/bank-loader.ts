/**
 * Corpus loader — reads the report markdown directory and produces the exemplar
 * bank using the pure parser. Node runtime only (fs). Keep the generated bank OUT
 * of git (the corpus is proprietary); see scripts/build-exemplar-bank.ts.
 */
import { readFileSync, readdirSync, writeFileSync } from "fs";
import { join, basename } from "path";
import { buildExemplarBank, STRATEGY_MANIFEST } from "./exemplars";
import { StyleExemplar } from "./style";

/** Filename -> manifest key: drop the suffix, collapse non-alphanumerics to "_". */
export function reportIdFromFilename(file: string): string {
  return basename(file)
    .replace(/_ODD_Report\.md$/i, "")
    .replace(/[^A-Za-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

export function loadExemplarBankFromDir(dir: string): StyleExemplar[] {
  const files = readdirSync(dir).filter((f) => /_ODD_Report\.md$/i.test(f));
  const inputs = files.map((file) => {
    const reportId = reportIdFromFilename(file);
    const meta = STRATEGY_MANIFEST[reportId];
    if (!meta) {
      // Loud, non-fatal: an untagged report still contributes exemplars (strategy
      // "unknown"), but few-shot retrieval by strategy won't match it.
      console.warn("[bank-loader] no STRATEGY_MANIFEST entry for '" + reportId + "' — tagging strategy=unknown");
    }
    return {
      markdown: readFileSync(join(dir, file), "utf8"),
      meta: { reportId, strategy: meta ? meta.strategy : "unknown", fundType: meta ? meta.fundType : undefined },
    };
  });
  return buildExemplarBank(inputs);
}

export function writeBank(path: string, bank: StyleExemplar[]): void {
  writeFileSync(path, JSON.stringify(bank, null, 2), "utf8");
}
