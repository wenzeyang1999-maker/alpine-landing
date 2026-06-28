/**
 * Flag predicates (deliverable a) — wire the Ch4 flag library's triggers to deterministic
 * functions over the call-guide answers. Stage-2 generation runs evaluateCh4Flags() to
 * decide WHICH standardized flag paragraphs appear; the model never writes the risk text.
 *
 * Answers are a flat map of framework question id → answer string (the call-guide responses).
 * Predicates are intentionally conservative: a flag fires only on a clear signal, so a missing
 * answer never invents a flag (it routes to the manager call instead).
 */
import { CH4_FLAGS } from "./ch4-flag-library";

type Answers = Record<string, string>;

const yes = (v?: string) => !!v && /^\s*(yes|y|true)\b/i.test(v);
const no = (v?: string) => !!v && /^\s*(no|n|false|none|not\b)/i.test(v);
const num = (v?: string) => {
  const m = v?.match(/-?\d+(\.\d+)?/);
  return m ? parseFloat(m[0]) : NaN;
};
const has = (v?: string) => !!v && v.trim().length > 0 && !no(v);

/** flagId → predicate(answers) => fired. Only flags with a determinable trigger are listed. */
const PREDICATES: Record<string, (a: Answers) => boolean> = {
  // structure
  "subsidiaries": (a) => yes(a["04.06.32"]) || /subsidiar|spv|clo|blocker/i.test(a["04.06.32"] ?? ""),
  "segregated-cell": (a) => yes(a["04.08.40"]) || yes(a["04.08.41"]),
  // launch / aum
  "pre-launch": (a) => yes(a["04.01.04"]) || /pre-?launch|yet to commence/i.test(a["04.13.77"] ?? ""),
  "aum-below-100m": (a) => { const n = num(a["04.09.45"]); return Number.isFinite(n) && n < 100; },
  "aum-up-25": (a) => { const n = num(a["04.09.44"]); return Number.isFinite(n) && n >= 25; },
  "investor-concentration": (a) => { const n = num(a["04.09.47"]); return Number.isFinite(n) && n > 25; },
  // liquidity / redemptions (open-ended)
  "gating": (a) => yes(a["04.14.89"]),
  "gate-no-sunset": (a) => yes(a["04.14.89"]) && no(a["04.14.93"]),
  "holdback-over-5": (a) => { const n = num(a["04.14.97"]); return yes(a["04.14.96"]) && (n > 5 || yes(a["04.14.97"])); },
  "liquidating-trust": (a) => yes(a["04.14.100"]),
  "no-key-person": (a) => no(a["04.14.79"]),
  "classes-diff-liquidity": (a) => yes(a["04.11.60"]),
  "redemption-fee": (a) => yes(a["04.14.86"]),
  // side pockets
  "side-pocket": (a) => yes(a["04.16.109"]),
  "side-pocket-no-optout": (a) => yes(a["04.16.109"]) && no(a["04.16.113"]),
  "side-pocket-no-cap": (a) => yes(a["04.16.109"]) && no(a["04.16.112"]),
  // fees & carry
  "mgmt-fee-over-2": (a) => { const n = num(a["04.18.116"]); return Number.isFinite(n) && n > 2; },
  "incentive-over-20": (a) => { const n = num(a["04.18.117"]); return Number.isFinite(n) && n > 20; },
  "modified-hwm": (a) => has(a["04.18.119"]) && /modif|50%|catch|adjust/i.test(a["04.18.119"] ?? ""),
  "incentive-intra-year": (a) => /month|intra|semi/i.test(a["04.18.118"] ?? ""),
  "american-waterfall": (a) => /american|deal-?by-?deal/i.test(a["04.19.128"] ?? ""),
  "no-preferred-return": (a) => no(a["04.19.126"]) && has(a["04.19.127"]),
  "no-clawback": (a) => no(a["04.15.106"]),
  "no-mgmt-fee-offset": (a) => no(a["04.20.157"]),
  // expense pass-throughs (answer typically "charged" vs "absorbed")
  "exp-research-data": (a) => /charg/i.test(a["04.20.136"] ?? ""),
  "exp-research-travel": (a) => /charg/i.test(a["04.20.137"] ?? ""),
  "exp-systems": (a) => /charg/i.test(a["04.20.139"] ?? ""),
  "exp-compliance": (a) => /charg/i.test(a["04.20.140"] ?? ""),
  "exp-overhead": (a) => /charg/i.test(a["04.20.142"] ?? ""),
  // side letters & affiliated
  "side-letter-fees": (a) => yes(a["04.17.114"]) && /fee|reduc|preferential/i.test(a["04.17.114"] ?? ""),
  "affiliated-allocation": (a) => yes(a["04.21.163"]) || yes(a["04.22.164"]),
};

export type FiredFlag = { id: string; title: string; severity: string; text: string };

/** Evaluate all Ch4 flags against the answers; returns the fired flags (with their text). */
export function evaluateCh4Flags(answers: Answers): FiredFlag[] {
  const byId = new Map(CH4_FLAGS.map((f) => [f.id, f]));
  const fired: FiredFlag[] = [];
  for (const id of Object.keys(PREDICATES)) {
    if (PREDICATES[id](answers)) {
      const f = byId.get(id);
      if (f) fired.push({ id: f.id, title: f.title, severity: f.severity, text: f.text });
    }
  }
  return fired;
}

/** The flag ids that currently have an automated predicate (the rest need analyst input). */
export const PREDICATED_FLAG_IDS = Object.keys(PREDICATES);
