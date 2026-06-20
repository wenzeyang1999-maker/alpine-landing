/**
 * Wrap glossary terms in an already-rendered HTML string, for the report viewer.
 * Operates on TEXT BETWEEN TAGS only (skips tag interiors) so it never matches
 * inside — or corrupts — the [[REF]] citation spans or their attributes. Plain
 * .ts so it is unit-testable (DemoReportViewer.tsx itself is JSX, not importable
 * under the test runner's config).
 */
import { findGlossaryMatches } from "@/lib/glossary-match";
import { GLOSSARY_BY_ID } from "@/lib/glossary";

export const escAttr = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/**
 * Link glossary terms found in the visible text of `html`. `seen` carries
 * first-occurrence state (pass one Set per paragraph). Returns HTML with each
 * first-occurrence term wrapped in `<a class="gloss-term" …>`.
 */
export function linkifyGlossaryHtml(html: string, seen: Set<string>): string {
  const parts = html.split(/(<[^>]*>)/); // even indices = text, odd = tags
  for (let i = 0; i < parts.length; i += 2) {
    const chunk = parts[i];
    if (!chunk) continue;
    const matches = findGlossaryMatches(chunk, { seen });
    if (matches.length === 0) continue;
    let out = "";
    let cursor = 0;
    for (const m of matches) {
      const t = GLOSSARY_BY_ID[m.id];
      out += chunk.slice(cursor, m.start);
      out += `<a class="gloss-term" href="/learning-center#${m.id}" target="_blank" rel="noopener" aria-label="${escAttr(t.term)} — open in glossary" data-gloss-term="${escAttr(t.term)}" data-gloss-def="${escAttr(t.meaning)}" style="color:#7B2CBF;text-decoration:none;border-bottom:1px dotted #7B2CBF66;cursor:help;">${m.text}</a>`;
      cursor = m.end;
    }
    out += chunk.slice(cursor);
    parts[i] = out;
  }
  return parts.join("");
}
