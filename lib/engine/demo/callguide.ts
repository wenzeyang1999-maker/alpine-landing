/**
 * assembleCh4 — the call-guide status engine (T5).
 *
 * Takes a fund profile + filing-extraction results and resolves EVERY one of the 164
 * Chapter-4 questions into exactly one status, so the UI can render the full guide
 * honestly and the counts always reconcile to 164:
 *
 *   answered        grounded from the filing (quote-gate passed) — shows value + citation
 *   routed          filing-answerable but not found → manager call
 *   call_only       never filing-answerable → manager call / DDQ by design
 *   conditional     dependsOn parent unmet → "applies if <parent>" (don't overstate)
 *   not_applicable  pruned by strategy/scope → collapsed group, with a reason
 *
 * Applicability reuses the framework's tested evalCondition engine; nothing is invented.
 */
import {
  CHAPTERS, evalCondition, Condition, ManagerProfile, Question,
} from "../../manager/framework-full";
import { CH4_QUESTIONS } from "./ch4-questions";
import type { ChapterAnswer } from "./extract-llm";

export type CallGuideStatus =
  | "answered" | "routed" | "call_only" | "conditional" | "not_applicable";

export type CallGuideRow = {
  id: string;
  prompt: string;
  subsectionId: string;
  status: CallGuideStatus;
  value?: string | null;
  quote?: string | null;
  sourceLabel?: string;
  confidence?: "high" | "medium" | "low";
  /** For conditional/not_applicable: a short human reason ("applies if …", "Closed-ended only"). */
  reason?: string;
};

export type CallGuideSection = {
  id: string;
  title: string;
  rows: CallGuideRow[]; // visible rows (everything except not_applicable)
  answered: number;
  applicable: number; // visible rows that aren't conditional
};

export type AssembledCh4 = {
  sections: CallGuideSection[];
  notApplicable: CallGuideRow[];
  counts: {
    total: number;
    answered: number;
    routed: number;
    callOnly: number;
    conditional: number;
    notApplicable: number;
  };
  reconciledTo164: boolean;
};

const SCOPE_REASON: Record<string, string> = {
  closed_ended: "Closed-ended funds only",
  open_ended: "Open-ended funds only",
  offshore_fund: "Offshore-listed funds only",
  fund_of_funds: "Fund-of-funds only",
  master_feeder: "Master-feeder funds only",
  pre_launch: "Pre-launch funds only",
  american_waterfall: "American-waterfall funds only",
  internal_affiliated: "Affiliated-fund investments only",
  hf: "Hedge funds only",
  lp_llc_fund: "LP / LLC funds only",
  small_manager: "Small managers only",
};

/** First scope tag in a condition that fails for this profile, for a human reason. */
function failingScopeReason(
  cond: Condition | undefined,
  profile: ManagerProfile,
  answers: Record<string, string>,
): string | undefined {
  if (!cond) return undefined;
  if (cond.kind === "scope" && !profile.scopes.has(cond.tag)) {
    return SCOPE_REASON[cond.tag] ?? `${cond.tag} funds only`;
  }
  if (cond.kind === "all" || cond.kind === "any") {
    for (const c of cond.of) {
      if (!evalCondition(c, profile, answers)) {
        const r = failingScopeReason(c, profile, answers);
        if (r) return r;
      }
    }
  }
  return undefined;
}

export function assembleCh4(opts: {
  profile: ManagerProfile;
  answers?: Record<string, string>;
  extraction?: Record<string, ChapterAnswer>;
}): AssembledCh4 {
  const { profile } = opts;
  const answers = opts.answers ?? {};
  const extraction = opts.extraction ?? {};
  const ch4 = CHAPTERS.find((c) => c.num === 4)!;
  const answerableIds = new Set(CH4_QUESTIONS.map((q) => q.frameworkId as string));
  const promptById = new Map(CH4_QUESTIONS.map((q) => [q.frameworkId as string, q]));

  const sections: CallGuideSection[] = [];
  const notApplicable: CallGuideRow[] = [];
  const counts = { total: 0, answered: 0, routed: 0, callOnly: 0, conditional: 0, notApplicable: 0 };

  for (const ss of ch4.subsections) {
    const rows: CallGuideRow[] = [];
    const ssApplies = evalCondition(ss.appliesWhen, profile, answers);

    for (const q of ss.questions) {
      counts.total++;
      const base: CallGuideRow = { id: q.id, prompt: q.prompt, subsectionId: ss.id, status: "call_only" };

      // 1. scope/strategy pruning (sub-section or question level)
      const qApplies = evalCondition(q.appliesWhen, profile, answers);
      if (!ssApplies || !qApplies) {
        counts.notApplicable++;
        notApplicable.push({
          ...base, status: "not_applicable",
          reason: failingScopeReason(ss.appliesWhen, profile, answers)
            ?? failingScopeReason(q.appliesWhen, profile, answers)
            ?? "Not applicable to this fund type",
        });
        continue;
      }

      // 2. trigger (dependsOn) not satisfied → conditional ("applies if …")
      if (q.dependsOn && !evalCondition(
        { kind: "answer", questionId: q.dependsOn.questionId, predicate: q.dependsOn.predicate },
        profile, answers,
      )) {
        const parent = findQuestion(ch4.subsections, q.dependsOn.questionId);
        counts.conditional++;
        rows.push({ ...base, status: "conditional", reason: parent ? `Applies if: ${parent.prompt}` : "Conditional follow-up" });
        continue;
      }

      // 3. applicable → answered (filing+gate) / routed (filing-answerable, not found) / call_only
      if (answerableIds.has(q.id)) {
        const ex = extraction[q.id];
        if (ex && ex.status === "answered") {
          counts.answered++;
          rows.push({ ...base, status: "answered", value: ex.value, quote: ex.quote, sourceLabel: ex.sourceLabel, confidence: ex.confidence });
        } else {
          counts.routed++;
          rows.push({ ...base, status: "routed", reason: ex?.gap ?? "Confirmed on the analyst call." });
        }
      } else {
        counts.callOnly++;
        rows.push({ ...base, status: "call_only", reason: "Manager call / DDQ" });
      }
    }

    if (rows.length > 0) {
      sections.push({
        id: ss.id, title: ss.title, rows,
        answered: rows.filter((r) => r.status === "answered").length,
        applicable: rows.filter((r) => r.status !== "conditional").length,
      });
    }
  }

  const summed = counts.answered + counts.routed + counts.callOnly + counts.conditional + counts.notApplicable;
  return { sections, notApplicable, counts, reconciledTo164: summed === 164 && counts.total === 164 };
}

function findQuestion(subsections: { questions: Question[] }[], id: string): Question | undefined {
  for (const s of subsections) {
    const q = s.questions.find((x) => x.id === id);
    if (q) return q;
  }
  return undefined;
}
