/**
 * House-style hard rules for generated narrative.
 *
 * RULE: no em or en dashes (and related long-dash glyphs) in any generated output. These
 * are the connector dashes the house style forbids; hyphens inside compound words
 * (closed-end, non-diversified) are standard English and are kept. scrubDashes() is the
 * enforcement backstop run over assembled narrative; hasBannedDash() powers the lint test.
 */

// em, en, figure dash, horizontal bar, minus sign
export const BANNED_DASH = /[—–‒―−]/;
const BANNED_DASH_G = /[—–‒―−]/g;

/** Replace any banned dash with house-style punctuation and clean the artifacts. */
export function scrubDashes(text: string): string {
  return text
    .replace(/\s*[—–‒―−]\s*/g, ", ") // connector dash -> comma
    .replace(/,\s*,/g, ",")          // collapse double commas
    .replace(/\s+,/g, ",")           // no space before comma
    .replace(/,\s*([.;:)])/g, "$1")  // comma swallowed by following punctuation
    .replace(/\(\s*,\s*/g, "(")      // "( , " artifact
    .replace(/ {2,}/g, " ");
}

/** True if any banned dash remains. */
export function hasBannedDash(text: string): boolean {
  return BANNED_DASH_G.test(text);
}
