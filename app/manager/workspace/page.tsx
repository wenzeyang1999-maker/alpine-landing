"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, Link2, Plus } from "lucide-react";
import {
  BG_CARD, INK, SECONDARY, MUTED, VIOLET, GREEN, GREEN_TEXT, BORDER, LS_BODY, LS_H3,
} from "@/lib/constants";
import { CHAPTERS, ACT_COLOR, totalQuestions } from "@/lib/manager/framework";
import {
  getFirm, getResponses, chapterCompletionPct, lastSavedRelative, type Firm, type Response,
} from "@/lib/manager/local-state";
import { WorkspaceShell } from "../_components/WorkspaceShell";

export default function WorkspaceOverviewPage() {
  const router = useRouter();
  const [firm, setFirm] = useState<Firm | null>(null);
  const [responses, setResponses] = useState<Record<string, Response>>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const f = getFirm();
    if (!f) {
      router.push("/manager/login");
      return;
    }
    setFirm(f);
    setResponses(getResponses());
    setHydrated(true);
  }, [router]);

  if (!hydrated || !firm) return null;

  const total = totalQuestions();
  const answered = Object.values(responses).filter(
    (r) =>
      (r.answerText && r.answerText.trim()) ||
      r.answerChoice ||
      (r.answerMulti && r.answerMulti.length > 0) ||
      r.uploadedFilename,
  ).length;
  const overallPct = Math.round((answered / total) * 100);
  const lastSaved = lastSavedRelative();

  return (
    <WorkspaceShell
      firm={firm}
      rightPanel={
        <RightPanel overallPct={overallPct} answered={answered} total={total} lastSaved={lastSaved} />
      }
    >
      {/* Hero card — first-visit empty state vs returning */}
      <section
        className="rounded-panel p-7 sm:p-8 mb-6"
        style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}
      >
        <p
          className="font-mono text-[11px] uppercase mb-3"
          style={{ color: VIOLET, fontWeight: 700, letterSpacing: "0.1em" }}
        >
          {answered === 0 ? "Welcome" : "Your Living DDQ"}
        </p>
        <h1
          className="font-heading mb-3"
          style={{ fontSize: "1.75rem", fontWeight: 700, lineHeight: 1.15, letterSpacing: "-0.03em", color: INK }}
        >
          {answered === 0
            ? `Welcome to Alpine, ${firm.name.split(/[\s,]/)[0]}.`
            : `${overallPct}% complete.`}
        </h1>
        <p
          className="font-body max-w-2xl mb-6"
          style={{ fontSize: "1rem", lineHeight: 1.6, color: SECONDARY, letterSpacing: LS_BODY }}
        >
          {answered === 0
            ? "Let's build your Living DDQ. The same 8-chapter institutional framework allocators use to evaluate you — respond once, share with any LP. Start anywhere; auto-saves as you go."
            : `${answered} of ${total} questions answered. Pick up where you left off, or jump to any chapter.`}
        </p>
        <Link
          href={`/manager/workspace/chapter/${answered === 0 ? 1 : nextIncomplete(responses)}`}
          className="rounded-btn px-5 py-3 font-body text-[14px] inline-flex items-center gap-1.5 hover:opacity-90 transition-opacity"
          style={{ background: INK, color: "#fff", fontWeight: 600 }}
        >
          {answered === 0 ? "Start Chapter 01" : "Continue"} <ArrowRight size={14} />
        </Link>
      </section>

      {/* Chapters grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {CHAPTERS.map((ch) => {
          const pct = chapterCompletionPct(ch.num, ch.questions.length);
          const complete = pct === 100;
          return (
            <Link
              key={ch.num}
              href={`/manager/workspace/chapter/${ch.num}`}
              className="rounded-card p-5 flex flex-col hover:shadow-sm transition-shadow"
              style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}
            >
              <div className="flex items-baseline justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: ACT_COLOR[ch.act] }}
                    aria-hidden
                  />
                  <span
                    className="font-mono text-[11px]"
                    style={{ color: ACT_COLOR[ch.act], fontWeight: 700, letterSpacing: "0.08em" }}
                  >
                    {ch.numLabel}
                  </span>
                </div>
                {complete ? (
                  <span
                    className="font-mono text-[10px] uppercase inline-flex items-center gap-1"
                    style={{ color: GREEN_TEXT, fontWeight: 700, letterSpacing: "0.08em" }}
                  >
                    <Check size={11} /> Complete
                  </span>
                ) : (
                  <span
                    className="font-mono text-[10px]"
                    style={{ color: MUTED, fontWeight: 600, letterSpacing: "0.04em" }}
                  >
                    {pct}%
                  </span>
                )}
              </div>
              <h3
                className="font-heading mb-1"
                style={{ fontSize: "0.9375rem", fontWeight: 700, color: INK, letterSpacing: LS_H3, lineHeight: 1.3 }}
              >
                {ch.title}
              </h3>
              <p
                className="font-body text-[12.5px] mb-3"
                style={{ color: SECONDARY, lineHeight: 1.45, letterSpacing: LS_BODY }}
              >
                {ch.description}
              </p>
              {/* Progress bar */}
              <div
                className="h-1 rounded-full overflow-hidden mt-auto"
                style={{ background: `${BORDER}` }}
              >
                <div
                  className="h-full"
                  style={{
                    width: `${pct}%`,
                    background: complete ? GREEN : ACT_COLOR[ch.act],
                    transition: "width 200ms ease",
                  }}
                />
              </div>
              <p
                className="font-mono text-[10px] mt-2"
                style={{ color: MUTED, letterSpacing: "0.04em" }}
              >
                {Object.keys(getResponsesForChapterLocal(ch.num)).length}/{ch.questions.length} answered
              </p>
            </Link>
          );
        })}
      </div>
    </WorkspaceShell>
  );
}

function getResponsesForChapterLocal(chapterNum: number): Record<string, Response> {
  if (typeof window === "undefined") return {};
  const all = getResponses();
  return Object.fromEntries(Object.entries(all).filter(([_, r]) => r.chapterNum === chapterNum));
}

function nextIncomplete(responses: Record<string, Response>): number {
  for (const ch of CHAPTERS) {
    const ans = Object.values(responses).filter(
      (r) => r.chapterNum === ch.num && (
        (r.answerText && r.answerText.trim()) ||
        r.answerChoice ||
        (r.answerMulti && r.answerMulti.length > 0) ||
        r.uploadedFilename
      ),
    ).length;
    if (ans < ch.questions.length) return ch.num;
  }
  return 1;
}

function RightPanel({
  overallPct, answered, total, lastSaved,
}: {
  overallPct: number;
  answered: number;
  total: number;
  lastSaved: string | null;
}) {
  return (
    <div className="flex flex-col gap-4 sticky top-24">
      <Stat label="Overall progress" value={`${overallPct}%`} sub={`${answered}/${total} questions`} />
      <Stat label="Last saved" value={lastSaved ?? "—"} sub="Auto-saves on blur" />

      <div
        className="rounded-panel p-4 flex flex-col gap-2"
        style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}
      >
        <p
          className="font-mono text-[10px] uppercase"
          style={{ color: MUTED, fontWeight: 700, letterSpacing: "0.1em" }}
        >
          Share with allocators
        </p>
        <p
          className="font-body text-[12px]"
          style={{ color: SECONDARY, lineHeight: 1.5, letterSpacing: LS_BODY }}
        >
          Generate a revocable link any LP can view. Expires in 90 days by default.
        </p>
        <button
          className="rounded-btn px-3 py-2 font-body text-[12px] inline-flex items-center justify-center gap-1.5 mt-2"
          style={{ border: `1px solid ${BORDER}`, color: INK, fontWeight: 500 }}
          disabled
          title="Available once your first chapter is complete"
        >
          <Plus size={12} /> Generate share link
        </button>
      </div>
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div
      className="rounded-panel p-4"
      style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}
    >
      <p
        className="font-mono text-[10px] uppercase"
        style={{ color: MUTED, fontWeight: 700, letterSpacing: "0.1em" }}
      >
        {label}
      </p>
      <p
        className="font-heading mt-1"
        style={{ fontSize: "1.5rem", fontWeight: 700, color: INK, letterSpacing: "-0.02em", lineHeight: 1 }}
      >
        {value}
      </p>
      <p
        className="font-mono text-[11px] mt-1.5"
        style={{ color: MUTED, letterSpacing: "0.04em" }}
      >
        {sub}
      </p>
    </div>
  );
}
