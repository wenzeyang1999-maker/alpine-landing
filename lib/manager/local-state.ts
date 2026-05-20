// Manager Portal — client-side state (V1 preview only)
//
// V1 ships visual + interaction prototypes without backend persistence.
// State lives in localStorage so a manager can click through the invite →
// firm setup → workspace → DDQ flow end-to-end. Real persistence lands
// when /api/manager/* endpoints + Supabase manager schema go live.
//
// All data is namespaced under "alpine-manager:" and intentionally local
// to the browser — no network, no cookies, no third-party.

"use client";

const NS = "alpine-manager:";

export type Firm = {
  name: string;
  domicile?: string;
  founded?: string;
  aum?: string;
  strategy?: string;
  contactEmail?: string;
  createdAt: string; // ISO
};

export type Response = {
  questionId: string;
  chapterNum: number;
  answerText?: string;
  answerChoice?: string;
  answerMulti?: string[];
  uploadedFilename?: string;
  updatedAt: string; // ISO
};

const FIRM_KEY = NS + "firm";
const RESPONSES_KEY = NS + "responses";

function safeWindow(): Window | null {
  return typeof window !== "undefined" ? window : null;
}

export function getFirm(): Firm | null {
  const w = safeWindow();
  if (!w) return null;
  const raw = w.localStorage.getItem(FIRM_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Firm;
  } catch {
    return null;
  }
}

export function saveFirm(firm: Firm): void {
  const w = safeWindow();
  if (!w) return;
  w.localStorage.setItem(FIRM_KEY, JSON.stringify(firm));
}

export function clearFirm(): void {
  const w = safeWindow();
  if (!w) return;
  w.localStorage.removeItem(FIRM_KEY);
  w.localStorage.removeItem(RESPONSES_KEY);
}

export function getResponses(): Record<string, Response> {
  const w = safeWindow();
  if (!w) return {};
  const raw = w.localStorage.getItem(RESPONSES_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw) as Record<string, Response>;
  } catch {
    return {};
  }
}

export function saveResponse(r: Response): void {
  const w = safeWindow();
  if (!w) return;
  const all = getResponses();
  all[r.questionId] = r;
  w.localStorage.setItem(RESPONSES_KEY, JSON.stringify(all));
}

export function getResponsesForChapter(chapterNum: number): Record<string, Response> {
  const all = getResponses();
  return Object.fromEntries(
    Object.entries(all).filter(([_, r]) => r.chapterNum === chapterNum),
  );
}

export function chapterCompletionPct(
  chapterNum: number,
  totalQuestionsInChapter: number,
): number {
  if (totalQuestionsInChapter === 0) return 0;
  const responses = getResponsesForChapter(chapterNum);
  const answered = Object.values(responses).filter(hasAnswer).length;
  return Math.round((answered / totalQuestionsInChapter) * 100);
}

export function hasAnswer(r: Response): boolean {
  return Boolean(
    (r.answerText && r.answerText.trim()) ||
      r.answerChoice ||
      (r.answerMulti && r.answerMulti.length > 0) ||
      r.uploadedFilename,
  );
}

export function lastSavedRelative(): string | null {
  const all = getResponses();
  const ts = Object.values(all)
    .map((r) => r.updatedAt)
    .sort()
    .reverse()[0];
  if (!ts) return null;
  const diff = Date.now() - new Date(ts).getTime();
  if (diff < 5_000) return "just now";
  if (diff < 60_000) return `${Math.floor(diff / 1000)}s ago`;
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return new Date(ts).toLocaleDateString();
}
