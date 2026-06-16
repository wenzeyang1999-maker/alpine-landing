/**
 * Print-mode citations: turn inline [[REF:KEY:"quote"]] tokens into numbered
 * footnote markers, collecting an ordered footnote list for a Sources appendix.
 *
 * The interactive RefDot is for the web; a PDF can't pop a panel, so every
 * sourced sentence gets a superscript number and the appendix maps it back to
 * the source document + the supporting quote. Same token grammar as
 * lib/app-portal/cited-text.ts.
 */
import { createElement, Fragment, type ReactNode } from "react";

const REF_RE = /\[\[REF:([^\]:"]+):"([^"]+)"\]\]/g;

export interface Footnote {
  n: number;
  source: string;
  quote: string;
}

export interface PrintCiter {
  /** Render text, replacing tokens with superscript footnote markers. */
  render: (text: string) => ReactNode;
  /** Ordered footnotes accumulated so far. */
  footnotes: Footnote[];
}

export function makePrintCiter(): PrintCiter {
  const footnotes: Footnote[] = [];
  let key = 0;

  function render(text: string): ReactNode {
    if (!text) return text;
    const out: ReactNode[] = [];
    let last = 0;
    let m: RegExpExecArray | null;
    REF_RE.lastIndex = 0;
    while ((m = REF_RE.exec(text)) !== null) {
      const [full, source, quote] = m;
      if (m.index > last) out.push(text.slice(last, m.index));
      const n = footnotes.length + 1;
      footnotes.push({ n, source, quote });
      out.push(
        createElement(
          "sup",
          { key: `fn${key++}`, style: { fontSize: "0.66em", color: "#4f46e5", fontWeight: 700, padding: "0 0.5px", verticalAlign: "super" } },
          String(n),
        ),
      );
      last = m.index + full.length;
    }
    if (last < text.length) out.push(text.slice(last));
    if (out.length === 0) return text;
    return createElement(Fragment, null, ...out);
  }

  return { render, footnotes };
}
