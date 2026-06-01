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
import Tour from "@/components/manager/Tour";
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
  const [quota, setQuota] = useState<{ runsUsed: number; maxRuns: number; remaining: number } | null>(null);
  const [quotaError, setQuotaError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/manager/me").then((r) => (r.ok ? r.json() : null)),
      fetch("/api/manager/responses").then((r) => (r.ok ? r.json() : null)),
      fetch("/api/manager/ai-quota").then((r) => (r.ok ? r.json() : null)),
    ])
      .then(([me, resp, q]) => {
        if (!me) { router.replace("/manager/login"); return; }
        setMe(me);
        setResponses((resp?.responses ?? {}) as Record<string, Response>);
        if (q) setQuota(q);
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
    <>
    <Tour email={me.email} />
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
        data-tour="hero-card"
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
            data-tour="continue-btn"
            href={`/manager/workspace/chapter/${answered === 0 ? 1 : nextIncomplete(responses)}`}
            className="rounded-btn px-5 py-3 font-body text-[14px] inline-flex items-center gap-1.5 hover:opacity-90 transition-opacity"
            style={{ background: INK, color: "#fff", fontWeight: 600 }}
          >
            {answered === 0 ? "Start Chapter 01" : "Continue"} <ArrowRight size={14} />
          </Link>
          {/* AI Draft button with quota */}
          {quota && quota.remaining <= 0 ? (
            <div className="flex flex-col gap-1">
              <p className="font-body text-[12px]" style={{ color: "#dc2626" }}>
                AI draft quota used ({quota.runsUsed}/{quota.maxRuns}). Contact us to reset.
              </p>
              <a
                href="mailto:team@alpinedd.com?subject=AI Draft Quota Reset Request"
                className="font-body text-[12px] hover:underline"
                style={{ color: VIOLET }}
              >
                team@alpinedd.com →
              </a>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              <button
                data-tour="ai-draft-btn"
                type="button"
                disabled={seeding}
                onClick={async () => {
                  setSeeding(true);
                  setQuotaError(null);
                  try {
                    // Quota check — non-blocking: if API unavailable, still run seed
                    try {
                      const qRes = await fetch("/api/manager/ai-quota", { method: "POST" });
                      const qData = await qRes.json();
                      if (!qRes.ok) {
                        if (qRes.status === 429 && qData.error === "quota_exceeded") {
                          setQuota((prev) => prev ? { ...prev, remaining: 0 } : { runsUsed: 20, maxRuns: 20, remaining: 0 });
                          setQuotaError(qData.message ?? "Quota exhausted.");
                          return; // Only block on true quota exhaustion
                        }
                        // Other errors: log but don't block
                      } else {
                        setQuota({ runsUsed: qData.runsUsed, maxRuns: qData.maxRuns, remaining: qData.remaining });
                      }
                    } catch {
                      // Quota API unreachable — proceed anyway
                    }
                    const res = await fetch("/api/manager/seed-chapter1", { method: "POST" });
                    const data = await res.json();
                    if (res.ok) {
                      window.location.reload();
                    } else {
                      alert(data.error ?? "Seed failed");
                    }
                  } finally {
                    setSeeding(false);
                  }
                }}
                className="rounded-btn px-4 py-3 font-body text-[13px] inline-flex items-center gap-2 hover:opacity-80 transition-opacity disabled:opacity-50"
                style={{ border: `1px solid ${BORDER}`, color: MUTED, fontWeight: 500 }}
              >
                {seeding ? <Loader2 size={13} className="animate-spin" /> : null}
                {seeding ? "Generating AI answers…" : "Load All AI Draft Answers"}
                {!seeding && quota && (
                  <span
                    className="font-mono text-[10px]"
                    style={{
                      background: BORDER,
                      color: MUTED,
                      borderRadius: 99,
                      padding: "1px 7px",
                      fontWeight: 600,
                      letterSpacing: "0.04em",
                    }}
                  >
                    {quota.runsUsed}/{quota.maxRuns} used
                  </span>
                )}
              </button>
              {quotaError && (
                <p className="font-body text-[11px] mt-1" style={{ color: "#dc2626" }}>{quotaError}</p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Chapters grid */}
      <div data-tour="chapters-grid" className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
    </>
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
      <div data-tour="progress-panel">
        <Stat label="Overall progress" value={`${overallPct}%`} sub={`${answered}/${total} questions`} />
      </div>
      <div data-tour="review-panel">
        <ReviewStat flagged={flagged} reviewed={reviewed} unreviewed={unreviewed} unanswered={total - answered} total={total} />
      </div>
      <div data-tour="documents-panel">
        <DocumentsPanel />
      </div>
      <div data-tour="invite-panel">
        <InvitePanel />
      </div>
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
