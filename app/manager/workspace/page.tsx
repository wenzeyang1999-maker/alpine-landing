"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import {
  BG_CARD, INK, SECONDARY, MUTED, VIOLET, GREEN, GREEN_TEXT, AMBER, BORDER, LS_BODY, LS_H3,
} from "@/lib/constants";
import { CHAPTERS, ACT_COLOR, totalQuestions } from "@/lib/manager/framework";
import { type Response } from "@/lib/manager/local-state";
import { WorkspaceShell } from "../_components/WorkspaceShell";
import InvitePanel from "@/components/manager/InvitePanel";
import DocumentsPanel from "@/components/manager/DocumentsPanel";

type MeData = { firm_name: string | null; full_name: string | null; email: string };

function hasAnswer(r: Response): boolean {
  return !!(
    (r.answerText && r.answerText.trim()) ||
    r.answerChoice ||
    (r.answerMulti && r.answerMulti.length > 0) ||
    r.uploadedFilename
  );
}

export default function WorkspaceOverviewPage() {
  const router = useRouter();
  const [me, setMe] = useState<MeData | null>(null);
  const [responses, setResponses] = useState<Record<string, Response>>({});
  const [hydrated, setHydrated] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [seeded, setSeeded] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/manager/me").then((r) => (r.ok ? r.json() : null)),
      fetch("/api/manager/responses").then((r) => (r.ok ? r.json() : null)),
    ])
      .then(([me, resp]) => {
        if (!me) { router.replace("/manager/login"); return; }
        setMe(me);
        setResponses((resp?.responses ?? {}) as Record<string, Response>);
        setHydrated(true);
      })
      .catch(() => router.replace("/manager/login"));
  }, [router]);

  if (!hydrated || !me) return null;

  const firmName = me.firm_name ?? me.email;
  const firstName = (me.full_name ?? me.email).split(/[\s,]/)[0];
  const total = totalQuestions();
  const allResponses = Object.values(responses);
  const answered = allResponses.filter(hasAnswer).length;
  const overallPct = Math.round((answered / total) * 100);
  const flagged = allResponses.filter((r) => r.reviewStatus === "flagged").length;
  const reviewed = allResponses.filter((r) => r.reviewStatus === "reviewed").length;
  const unreviewed = answered - flagged - reviewed;

  return (
    <WorkspaceShell
      firm={{ name: firmName }}
      rightPanel={
        <RightPanel
          overallPct={overallPct} answered={answered} total={total}
          flagged={flagged} reviewed={reviewed} unreviewed={unreviewed}
        />
      }
    >
      {/* Hero card */}
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
        <p
          className="font-body mb-1"
          style={{ fontSize: "1.25rem", color: MUTED, fontWeight: 500 }}
        >
          Hello, {firstName}.
        </p>
        <h1
          className="font-heading mb-3"
          style={{ fontSize: "1.75rem", fontWeight: 700, lineHeight: 1.15, letterSpacing: "-0.03em", color: INK }}
        >
          {answered === 0
            ? "Let's build your Living DDQ."
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
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={`/manager/workspace/chapter/${answered === 0 ? 1 : nextIncomplete(responses)}`}
            className="rounded-btn px-5 py-3 font-body text-[14px] inline-flex items-center gap-1.5 hover:opacity-90 transition-opacity"
            style={{ background: INK, color: "#fff", fontWeight: 600 }}
          >
            {answered === 0 ? "Start Chapter 01" : "Continue"} <ArrowRight size={14} />
          </Link>
          {!seeded && (
            <button
              type="button"
              disabled={seeding}
              onClick={async () => {
                setSeeding(true);
                try {
                  const res = await fetch("/api/manager/seed-chapter1", { method: "POST" });
                  const data = await res.json();
                  if (res.ok) {
                    setSeeded(true);
                    window.location.reload();
                  } else {
                    alert(data.error ?? "Seed failed");
                  }
                } finally {
                  setSeeding(false);
                }
              }}
              className="rounded-btn px-4 py-3 font-body text-[13px] inline-flex items-center gap-1.5 hover:opacity-80 transition-opacity disabled:opacity-50"
              style={{ border: `1px solid ${BORDER}`, color: MUTED, fontWeight: 500 }}
            >
              {seeding ? <Loader2 size={13} className="animate-spin" /> : null}
              {seeding ? "Loading answers…" : "Load all demo answers"}
            </button>
          )}
        </div>
      </section>

      {/* Chapters grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {CHAPTERS.map((ch) => {
          const chResponses = Object.values(responses).filter((r) => r.chapterNum === ch.num);
          const answeredInChapter = chResponses.filter(hasAnswer).length;
          const pct = ch.questions.length === 0 ? 0 : Math.round((answeredInChapter / ch.questions.length) * 100);
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
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: ACT_COLOR[ch.act] }} aria-hidden />
                  <span className="font-mono text-[11px]" style={{ color: ACT_COLOR[ch.act], fontWeight: 700, letterSpacing: "0.08em" }}>
                    {ch.numLabel}
                  </span>
                </div>
                {complete ? (
                  <span className="font-mono text-[10px] uppercase inline-flex items-center gap-1" style={{ color: GREEN_TEXT, fontWeight: 700, letterSpacing: "0.08em" }}>
                    <Check size={11} /> Complete
                  </span>
                ) : (
                  <span className="font-mono text-[10px]" style={{ color: MUTED, fontWeight: 600, letterSpacing: "0.04em" }}>
                    {pct}%
                  </span>
                )}
              </div>
              <h3 className="font-heading mb-1" style={{ fontSize: "0.9375rem", fontWeight: 700, color: INK, letterSpacing: LS_H3, lineHeight: 1.3 }}>
                {ch.title}
              </h3>
              <p className="font-body text-[12.5px] mb-3" style={{ color: SECONDARY, lineHeight: 1.45, letterSpacing: LS_BODY }}>
                {ch.description}
              </p>
              <div className="h-1 rounded-full overflow-hidden mt-auto" style={{ background: BORDER }}>
                <div className="h-full" style={{ width: `${pct}%`, background: complete ? GREEN : ACT_COLOR[ch.act], transition: "width 200ms ease" }} />
              </div>
              <p className="font-mono text-[10px] mt-2" style={{ color: MUTED, letterSpacing: "0.04em" }}>
                {answeredInChapter}/{ch.questions.length} answered
              </p>
            </Link>
          );
        })}
      </div>
    </WorkspaceShell>
  );
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

function RightPanel({ overallPct, answered, total, flagged, reviewed, unreviewed }: {
  overallPct: number; answered: number; total: number;
  flagged: number; reviewed: number; unreviewed: number;
}) {
  return (
    <div className="flex flex-col gap-4 sticky top-24">
      <Stat label="Overall progress" value={`${overallPct}%`} sub={`${answered}/${total} questions`} />
      <ReviewStat flagged={flagged} reviewed={reviewed} unreviewed={unreviewed} unanswered={total - answered} total={total} />
      <DocumentsPanel />
      <InvitePanel />
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-panel p-4" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
      <p className="font-mono text-[10px] uppercase" style={{ color: MUTED, fontWeight: 700, letterSpacing: "0.1em" }}>{label}</p>
      <p className="font-heading mt-1" style={{ fontSize: "1.5rem", fontWeight: 700, color: INK, letterSpacing: "-0.02em", lineHeight: 1 }}>{value}</p>
      <p className="font-mono text-[11px] mt-1.5" style={{ color: MUTED, letterSpacing: "0.04em" }}>{sub}</p>
    </div>
  );
}

function ReviewStat({ flagged, reviewed, unreviewed, unanswered, total }: { flagged: number; reviewed: number; unreviewed: number; unanswered: number; total: number }) {
  const rows = [
    { label: "Unanswered", count: unanswered, color: AMBER },
    { label: "Unreviewed", count: unreviewed, color: MUTED },
    { label: "Flagged", count: flagged, color: "#ef4444" },
    { label: "Reviewed", count: reviewed, color: "#22c55e" },
  ];
  return (
    <div className="rounded-panel p-4" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
      <p className="font-mono text-[10px] uppercase mb-3" style={{ color: MUTED, fontWeight: 700, letterSpacing: "0.1em" }}>Review status</p>
      <div className="flex flex-col gap-2">
        {rows.map(({ label, count, color }) => (
          <div key={label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
              <span className="font-body text-[12px]" style={{ color: SECONDARY }}>{label}</span>
            </div>
            <span className="font-mono text-[12px]" style={{ color, fontWeight: 700 }}>
              {count}<span style={{ color: MUTED, fontWeight: 400 }}>/{total}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
