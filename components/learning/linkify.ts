/**
 * Inline glossary cross-linking for the Learning Center page. Turns plain prose
 * into React nodes, wrapping the first occurrence of each linkable term in an
 * anchor to its card. Match logic lives in lib/glossary-match.ts (shared with
 * the report-viewer tooltips). Plain .ts (React.createElement, no JSX) so it
 * imports cleanly in vitest and renders on both server and client.
 */
import { createElement, type ReactNode } from "react";
import { findGlossaryMatches } from "@/lib/glossary-match";

const VIOLET = "#7B2CBF";

/**
 * Render `text` with the first occurrence of each linkable term wrapped in an
 * anchor. `excludeId` skips self-links (a term's own card never links to itself).
 */
export function linkify(text: string, excludeId?: string): ReactNode {
  if (!text) return text;
  const matches = findGlossaryMatches(text, { exclude: excludeId ? new Set([excludeId]) : undefined });
  if (matches.length === 0) return text;

  const nodes: ReactNode[] = [];
  let cursor = 0;
  let key = 0;
  for (const m of matches) {
    if (m.start > cursor) nodes.push(text.slice(cursor, m.start));
    nodes.push(
      createElement(
        "a",
        {
          key: key++,
          href: `#${m.id}`,
          "data-term-link": m.id,
          style: { color: VIOLET, textDecoration: "none", borderBottom: `1px dotted ${VIOLET}66` },
        },
        m.text,
      ),
    );
    cursor = m.end;
  }
  if (cursor < text.length) nodes.push(text.slice(cursor));
  return nodes;
}
