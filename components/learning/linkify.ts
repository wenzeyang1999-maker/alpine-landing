/**
 * Inline glossary cross-linking. Turns plain prose into React nodes, wrapping
 * the first occurrence of each linkable glossary term in an anchor to its card.
 *
 * Plain .ts (uses React.createElement, no JSX) so it imports cleanly in vitest
 * and renders on both server and client.
 *
 * TWO-PASS matcher (a single JS regex can't mix case-sensitivity — the `i` flag
 * is all-or-nothing):
 *   - Pass 1: ALL-CAPS acronym surface forms, case-SENSITIVE  ("SEC" links, "second" never does)
 *   - Pass 2: Capitalized phrase surface forms, case-INSENSITIVE ("european waterfall" links)
 * Both use custom lookaround boundaries (NOT \b, which misfires on digit-led /
 * spaced / slashed forms like "2FA" and "SOC 1"), match longest-form-first, and
 * share one per-call "seen" set so only the first occurrence of each term links.
 */
import { createElement, type ReactNode } from "react";
import { GLOSSARY, INLINE_LINKABLE_IDS, type GlossaryTerm } from "@/lib/glossary";

const VIOLET = "#7B2CBF";

function surfaceForms(t: GlossaryTerm): string[] {
  // Aliased terms (e.g. "2FA / MFA") use their aliases as the real prose forms.
  return t.aliases && t.aliases.length > 0 ? t.aliases : [t.term];
}

const isAcronym = (form: string) => !/[a-z]/.test(form); // no lowercase ⇒ acronym

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

interface Built {
  re: RegExp;
  map: Map<string, string>; // key (exact for acronyms, lowercased for phrases) → term id
}

function buildPass(forms: Array<{ form: string; id: string }>, caseInsensitive: boolean): Built | null {
  if (forms.length === 0) return null;
  const sorted = [...forms].sort((a, b) => b.form.length - a.form.length); // longest-first
  const map = new Map<string, string>();
  for (const { form, id } of sorted) {
    const key = caseInsensitive ? form.toLowerCase() : form;
    if (!map.has(key)) map.set(key, id);
  }
  const alternation = sorted.map((f) => escapeRe(f.form)).join("|");
  const flags = caseInsensitive ? "gi" : "g";
  // lookarounds: a match can't be flanked by alphanumerics (avoids "SEC" in "second")
  const re = new RegExp(`(?<![A-Za-z0-9])(?:${alternation})(?![A-Za-z0-9])`, flags);
  return { re, map };
}

// Precompute the two matchers once, from the allowlisted terms.
const _acronymForms: Array<{ form: string; id: string }> = [];
const _phraseForms: Array<{ form: string; id: string }> = [];
for (const t of GLOSSARY) {
  if (!INLINE_LINKABLE_IDS.has(t.id)) continue;
  for (const form of surfaceForms(t)) {
    (isAcronym(form) ? _acronymForms : _phraseForms).push({ form, id: t.id });
  }
}
const ACRONYM_PASS = buildPass(_acronymForms, false);
const PHRASE_PASS = buildPass(_phraseForms, true);

interface Match { start: number; end: number; id: string; len: number; }

function collect(text: string, pass: Built | null, caseInsensitive: boolean, out: Match[]): void {
  if (!pass) return;
  pass.re.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = pass.re.exec(text)) !== null) {
    const matched = m[0];
    const key = caseInsensitive ? matched.toLowerCase() : matched;
    const id = pass.map.get(key);
    if (id) out.push({ start: m.index, end: m.index + matched.length, id, len: matched.length });
    if (m.index === pass.re.lastIndex) pass.re.lastIndex++; // guard against zero-width
  }
}

/**
 * Render `text` with the first occurrence of each linkable term wrapped in an
 * anchor. `excludeId` skips self-links (a term's own card never links to itself).
 */
export function linkify(text: string, excludeId?: string): ReactNode {
  if (!text) return text;
  const matches: Match[] = [];
  collect(text, ACRONYM_PASS, false, matches);
  collect(text, PHRASE_PASS, true, matches);
  if (matches.length === 0) return text;

  // earliest start first; on a tie, the longer match wins
  matches.sort((a, b) => (a.start - b.start) || (b.len - a.len));

  const nodes: ReactNode[] = [];
  const seen = new Set<string>();
  if (excludeId) seen.add(excludeId);
  let cursor = 0;
  let key = 0;
  for (const mt of matches) {
    if (mt.start < cursor || seen.has(mt.id)) continue; // overlap or already linked
    if (mt.start > cursor) nodes.push(text.slice(cursor, mt.start));
    nodes.push(
      createElement(
        "a",
        {
          key: key++,
          href: `#${mt.id}`,
          "data-term-link": mt.id,
          style: { color: VIOLET, textDecoration: "none", borderBottom: `1px dotted ${VIOLET}66` },
        },
        text.slice(mt.start, mt.end),
      ),
    );
    seen.add(mt.id);
    cursor = mt.end;
  }
  if (cursor < text.length) nodes.push(text.slice(cursor));
  return nodes;
}
