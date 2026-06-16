/**
 * Inline citation rendering — single source of truth for the [[REF]] token format.
 *
 * A citation token looks like:  [[REF:SOURCE_KEY:"quote"]]
 *   - SOURCE_KEY matches a key in a fund's *_SOURCE_META (e.g. "Form ADV", "DDQ").
 *   - quote is the supporting snippet (must not contain a double-quote).
 *
 * renderCitations turns tokens in a string into inline <RefDot> markers.
 *
 * ── Adjacent-token merge ────────────────────────────────────────────────────
 * A run of DIRECTLY adjacent tokens (no characters between them) collapses into
 * ONE dot carrying every source. This is how a sentence that cites several
 * documents shows a single marker whose popover lists each source — without any
 * fragile sentence-boundary detection. Whitespace or prose between two tokens
 * keeps them as separate dots.
 *
 *   "...pari passu[[REF:LPA:"x"]][[REF:DDQ:"y"]]."  ->  "...pari passu" + dot(LPA,DDQ) + "."
 *   "...formed[[REF:LPA:"z"]] in 2026."             ->  "...formed" + dot(LPA) + " in 2026."
 *
 * Authored with React.createElement (no JSX) so the module is a plain .ts file —
 * it imports cleanly in the Node-based unit test runner, which does not transform
 * JSX (the app's tsconfig uses jsx: "preserve").
 */
import { createElement, Fragment, type ReactNode } from "react";
import { RefDot } from "@/components/app-portal/review/RefDot";

export type RefColor = "blue" | "emerald" | "amber" | "purple";
export type CitationSource = { source: string; quote: string };

export interface RenderCitationsOptions {
  /** Fund slug, threaded to RefDot so the preview resolves the right fund's docs. */
  slug?: string;
  /** "prose" = muted inline dot; "table" = source-colored. */
  variant?: "prose" | "table";
  /** Maps a source key to a dot color (used by the table variant). */
  color?: (source: string) => RefColor;
  /** Renders a non-token text segment (e.g. markdown inline formatting). Defaults to identity. */
  renderText?: (text: string, key: string) => ReactNode;
}

// Single source of truth for the token grammar. Mirrors the legacy regex in
// ExecutiveBriefViewer so the two never drift.
const REF_RE = /\[\[REF:([^\]:"]+):"([^"]+)"\]\]/g;
const STRIP_RE = /\[\[REF:[^\]]*\]\]/g;

/** True if the string contains at least one citation token. */
export function hasRefs(text: string): boolean {
  REF_RE.lastIndex = 0;
  return REF_RE.test(text || "");
}

/** Remove every citation token and collapse the whitespace it leaves behind. */
export function stripRefs(text: string): string {
  return (text || "").replace(STRIP_RE, "").replace(/\s{2,}/g, " ").trim();
}

export function renderCitations(text: string, opts: RenderCitationsOptions = {}): ReactNode {
  const { slug, variant = "table", color = () => "blue" as RefColor, renderText } = opts;
  if (!text) return text;
  const emitText = renderText ?? ((t: string) => t);

  const out: ReactNode[] = [];
  let key = 0;
  let lastIndex = 0;
  let run: CitationSource[] = []; // current run of directly-adjacent tokens
  let runEnd = -1; // string index just past the last token in `run`

  const flushRun = () => {
    if (run.length === 0) return;
    const sources = run;
    out.push(
      createElement(RefDot, {
        key: `c${key++}`,
        source: sources[0].source,
        quote: sources[0].quote,
        sources,
        color: color(sources[0].source),
        variant,
        slug,
      }),
    );
    run = [];
    runEnd = -1;
  };

  REF_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = REF_RE.exec(text)) !== null) {
    const [full, source, quote] = m;
    const between = text.slice(lastIndex, m.index);
    if (run.length > 0 && m.index === runEnd && between === "") {
      // Directly adjacent to the previous token → same dot.
      run.push({ source, quote });
    } else {
      // Text separates this token from the previous run: close the run, emit
      // the intervening text, then start a fresh run.
      flushRun();
      if (between) out.push(emitText(between, `t${key++}`));
      run = [{ source, quote }];
    }
    runEnd = m.index + full.length;
    lastIndex = runEnd;
  }
  flushRun();
  const tail = text.slice(lastIndex);
  if (tail) out.push(emitText(tail, `t${key++}`));

  if (out.length === 0) return text;
  if (out.length === 1) return out[0];
  return createElement(Fragment, null, ...out);
}
