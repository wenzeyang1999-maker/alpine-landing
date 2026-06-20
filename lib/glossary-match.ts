/**
 * Shared glossary term matcher. Used by both the Learning Center inline links
 * (components/learning/linkify.ts → React nodes) and the report viewer tooltips
 * (DemoReportViewer inlineFormat → HTML string). Keeping the match logic in one
 * place means "what counts as a linkable term" is defined once.
 *
 * TWO-PASS (a single JS regex can't mix case-sensitivity — the `i` flag is
 * all-or-nothing):
 *   - Pass 1: ALL-CAPS acronym forms, case-SENSITIVE ("SEC" matches, "second" never does)
 *   - Pass 2: Capitalized phrase forms, case-INSENSITIVE ("european waterfall" matches)
 * Both use custom lookaround boundaries (NOT \b — it misfires on digit-led /
 * spaced / slashed forms like "2FA" and "SOC 1"), match longest-form-first, and
 * dedup so only the first occurrence of each term id survives.
 */
import { GLOSSARY, INLINE_LINKABLE_IDS, type GlossaryTerm } from "@/lib/glossary";

export interface GlossaryMatch {
  start: number;
  end: number;
  id: string;
  text: string;
}

function surfaceForms(t: GlossaryTerm): string[] {
  return t.aliases && t.aliases.length > 0 ? t.aliases : [t.term];
}
const isAcronym = (form: string) => !/[a-z]/.test(form);
const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

interface Pass { re: RegExp; map: Map<string, string>; }

function buildPass(forms: Array<{ form: string; id: string }>, caseInsensitive: boolean): Pass | null {
  if (forms.length === 0) return null;
  const sorted = [...forms].sort((a, b) => b.form.length - a.form.length);
  const map = new Map<string, string>();
  for (const { form, id } of sorted) {
    const key = caseInsensitive ? form.toLowerCase() : form;
    if (!map.has(key)) map.set(key, id);
  }
  const alternation = sorted.map((f) => escapeRe(f.form)).join("|");
  const re = new RegExp(`(?<![A-Za-z0-9])(?:${alternation})(?![A-Za-z0-9])`, caseInsensitive ? "gi" : "g");
  return { re, map };
}

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

function collect(text: string, pass: Pass | null, caseInsensitive: boolean, out: GlossaryMatch[]): void {
  if (!pass) return;
  pass.re.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = pass.re.exec(text)) !== null) {
    const matched = m[0];
    const key = caseInsensitive ? matched.toLowerCase() : matched;
    const id = pass.map.get(key);
    if (id) out.push({ start: m.index, end: m.index + matched.length, id, text: matched });
    if (m.index === pass.re.lastIndex) pass.re.lastIndex++;
  }
}

/**
 * Final, ordered, non-overlapping matches for `text`. Only the FIRST occurrence
 * of each term id links — `opts.seen` carries that state across calls (pass one
 * shared Set per paragraph when linking several text chunks). `opts.exclude`
 * suppresses specific ids (e.g. a glossary card never self-links).
 */
export function findGlossaryMatches(text: string, opts?: { seen?: Set<string>; exclude?: Set<string> }): GlossaryMatch[] {
  if (!text) return [];
  const raw: GlossaryMatch[] = [];
  collect(text, ACRONYM_PASS, false, raw);
  collect(text, PHRASE_PASS, true, raw);
  if (raw.length === 0) return [];

  raw.sort((a, b) => (a.start - b.start) || (b.text.length - a.text.length));
  const seen = opts?.seen ?? new Set<string>();
  const exclude = opts?.exclude;
  const out: GlossaryMatch[] = [];
  let cursor = 0;
  for (const m of raw) {
    if (m.start < cursor) continue;          // overlaps a kept match
    if (exclude?.has(m.id) || seen.has(m.id)) continue; // excluded or already linked
    out.push(m);
    seen.add(m.id);
    cursor = m.end;
  }
  return out;
}
