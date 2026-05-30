"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Check, ChevronDown, ChevronUp, Clock, Flag, Loader2, Upload as UploadIcon } from "lucide-react";
import {
  BG, BG_CARD, INK, SECONDARY, MUTED, VIOLET, GREEN, GREEN_TEXT, AMBER, BORDER, LS_BODY,
} from "@/lib/constants";
import { chapterByNum, CHAPTERS, ACT_COLOR, type Question } from "@/lib/manager/framework";
import { hasAnswer, type Response } from "@/lib/manager/local-state";
import { WorkspaceShell } from "../../../_components/WorkspaceShell";

export default function ChapterPage() {
  const router = useRouter();
  const params = useParams<{ n: string }>();
  const searchParams = useSearchParams();
  const chapterNum = Number(params.n);
  const chapter = chapterByNum(chapterNum);

  const [firmName, setFirmName] = useState<string | null>(null);
  const [responses, setResponses] = useState<Record<string, Response>>({});
  const [hydrated, setHydrated] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const saveQueue = useRef<Promise<void>>(Promise.resolve());

  useEffect(() => {
    Promise.all([
      fetch("/api/manager/me").then((r) => (r.ok ? r.json() : null)),
      fetch("/api/manager/responses").then((r) => (r.ok ? r.json() : null)),
    ])
      .then(([me, resp]) => {
        if (!me) { router.replace("/manager/login"); return; }
        setFirmName(me.firm_name ?? me.email);
        setResponses((resp?.responses ?? {}) as Record<string, Response>);
        setHydrated(true);
      })
      .catch(() => router.replace("/manager/login"));
  }, [router]);

  const handleReviewUpdate = (questionId: string, chapterNum: number, status: "flagged" | "reviewed" | null) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        questionId,
        chapterNum,
        reviewStatus: status ?? undefined,
        updatedAt: prev[questionId]?.updatedAt ?? new Date().toISOString(),
      },
    }));
    fetch("/api/manager/responses/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionId, chapterNum, status }),
    });
  };

  const handleResponseUpdate = (next: Response) => {
    setResponses((prev) => ({ ...prev, [next.questionId]: next }));
    saveQueue.current = saveQueue.current.then(async () => {
      await fetch("/api/manager/responses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: next.questionId,
          chapterNum: next.chapterNum,
          answerText: next.answerText,
          answerChoice: next.answerChoice,
          answerMulti: next.answerMulti,
          uploadedFilename: next.uploadedFilename,
        }),
      });
      setLastSavedAt(new Date());
    });
  };

  if (!chapter) {
    return (
      <div style={{ background: BG, padding: 40 }}>
        <p style={{ color: INK }}>Chapter {chapterNum} not found.</p>
        <Link href="/manager/workspace" style={{ color: VIOLET }}>← Back to overview</Link>
      </div>
    );
  }
  if (!hydrated || !firmName) return null;

  const chapterResponses = Object.values(responses).filter((r) => r.chapterNum === chapterNum);
  const answeredCount = chapterResponses.filter(hasAnswer).length;
  const pct = chapter.questions.length === 0
    ? 0
    : Math.round((answeredCount / chapter.questions.length) * 100);

  const nextChapter = CHAPTERS.find((c) => c.num === chapterNum + 1);
  const prevChapter = CHAPTERS.find((c) => c.num === chapterNum - 1);

  // Subtopic pagination
  const subtopics = Array.from(new Set(chapter.questions.map((q) => q.subtopic).filter(Boolean))) as string[];
  const hasSections = subtopics.length > 0;
  const sectionIdx = hasSections ? Math.min(Math.max(Number(searchParams.get("s") ?? "0"), 0), subtopics.length - 1) : 0;
  const currentSubtopic = hasSections ? subtopics[sectionIdx] : null;
  const visibleQuestions = hasSections
    ? chapter.questions.filter((q) => q.subtopic === currentSubtopic)
    : chapter.questions;

  const isLastSection = !hasSections || sectionIdx === subtopics.length - 1;
  const isFirstSection = !hasSections || sectionIdx === 0;

  const prevHref = !isFirstSection
    ? `/manager/workspace/chapter/${chapterNum}?s=${sectionIdx - 1}`
    : prevChapter ? `/manager/workspace/chapter/${prevChapter.num}` : null;

  const nextHref = !isLastSection
    ? `/manager/workspace/chapter/${chapterNum}?s=${sectionIdx + 1}`
    : nextChapter ? `/manager/workspace/chapter/${nextChapter.num}` : "/manager/workspace";

  const nextLabel = !isLastSection
    ? `Next: ${subtopics[sectionIdx + 1]}`
    : nextChapter ? `Continue to ${nextChapter.numLabel}` : "Done — back to overview";

  const prevLabel = !isFirstSection
    ? subtopics[sectionIdx - 1]
    : prevChapter ? `${prevChapter.numLabel} ${prevChapter.title}` : null;

  return (
    <WorkspaceShell
      firm={{ name: firmName }}
      rightPanel={
        <RightPanel
          chapterNum={chapterNum}
          pct={pct}
          answeredCount={answeredCount}
          total={chapter.questions.length}
          actColor={ACT_COLOR[chapter.act]}
          lastSavedAt={lastSavedAt}
        />
      }
    >
      {/* Chapter header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span
            className="font-mono text-[11px] px-2 py-1 rounded-full"
            style={{
              background: `${ACT_COLOR[chapter.act]}15`,
              color: ACT_COLOR[chapter.act],
              fontWeight: 700,
              letterSpacing: "0.08em",
            }}
          >
            {chapter.numLabel} · Act {actRoman(chapter.act)}
          </span>
          <span
            className="font-mono text-[10px] uppercase"
            style={{ color: MUTED, letterSpacing: "0.1em", fontWeight: 600 }}
          >
            {chapter.act}
          </span>
        </div>
        <h1
          className="font-heading mb-1"
          style={{ fontSize: "1.875rem", fontWeight: 700, lineHeight: 1.15, letterSpacing: "-0.03em", color: INK }}
        >
          {currentSubtopic ?? chapter.title}
        </h1>
        {currentSubtopic && (
          <p className="font-body text-[13px] mb-1" style={{ color: MUTED, letterSpacing: LS_BODY }}>
            {chapter.title}
          </p>
        )}
        <p
          className="font-body max-w-2xl mt-2"
          style={{ fontSize: "0.9375rem", lineHeight: 1.6, color: SECONDARY, letterSpacing: LS_BODY }}
        >
          {chapter.description}
        </p>
      </div>

      {/* Questions */}
      <div className="flex flex-col gap-5">
        {visibleQuestions.map((q, idx) => (
          <QuestionCard
            key={q.id}
            q={q}
            index={idx + 1}
            response={responses[q.id]}
            onUpdate={(partial) =>
              handleResponseUpdate({
                ...responses[q.id],
                ...partial,
                questionId: q.id,
                chapterNum,
                updatedAt: new Date().toISOString(),
              })
            }
            onReview={(status) => handleReviewUpdate(q.id, chapterNum, status)}
          />
        ))}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-10 pt-6" style={{ borderTop: `1px solid ${BORDER}` }}>
        {prevHref && prevLabel ? (
          <Link
            href={prevHref}
            className="rounded-btn px-4 py-2.5 font-body text-[13px] inline-flex items-center gap-1.5"
            style={{ border: `1px solid ${BORDER}`, color: SECONDARY, fontWeight: 500 }}
          >
            ← {prevLabel}
          </Link>
        ) : <span />}
        <Link
          href={nextHref}
          className="rounded-btn px-4 py-2.5 font-body text-[13px] inline-flex items-center gap-1.5"
          style={{ background: INK, color: "#fff", fontWeight: 600 }}
        >
          {nextLabel} <ArrowRight size={13} />
        </Link>
      </div>
    </WorkspaceShell>
  );
}

const REVIEW_FLAG_COLOR = "#ef4444";
const REVIEW_OK_COLOR = "#22c55e";

function QuestionCard({
  q, index, response, onUpdate, onReview,
}: {
  q: Question;
  index: number;
  response?: Response;
  onUpdate: (partial: Partial<Response>) => void;
  onReview: (status: "flagged" | "reviewed" | null) => void;
}) {
  const filled = response ? hasAnswer(response) : false;
  const reviewStatus = response?.reviewStatus;

  const cardBorder = reviewStatus === "flagged"
    ? `1px solid ${REVIEW_FLAG_COLOR}55`
    : reviewStatus === "reviewed"
    ? `1px solid ${REVIEW_OK_COLOR}55`
    : `1px solid ${BORDER}`;

  const cardBg = reviewStatus === "flagged"
    ? `${REVIEW_FLAG_COLOR}04`
    : reviewStatus === "reviewed"
    ? `${REVIEW_OK_COLOR}04`
    : BG_CARD;

  return (
    <div
      className="rounded-panel p-5 sm:p-6"
      style={{ background: cardBg, border: cardBorder, transition: "border-color 150ms, background 150ms" }}
    >
      <div className="flex items-start gap-3 mb-3">
        <span
          className="font-mono text-[11px] inline-flex items-center justify-center shrink-0 mt-0.5"
          style={{
            background: filled ? `${GREEN}15` : `${BORDER}40`,
            color: filled ? GREEN_TEXT : MUTED,
            fontWeight: 700,
            width: 26, height: 26, borderRadius: 999,
            letterSpacing: "0.04em",
          }}
        >
          {filled ? <Check size={13} /> : `Q${index}`}
        </span>
        <div className="flex-1">
          <h3
            className="font-body"
            style={{ fontSize: "0.9375rem", fontWeight: 600, color: INK, lineHeight: 1.45, letterSpacing: LS_BODY }}
          >
            {q.prompt}
            {q.required && <span style={{ color: AMBER }}> *</span>}
          </h3>
          {q.helper && (
            <p className="font-body text-[12.5px] mt-1" style={{ color: MUTED, lineHeight: 1.5, letterSpacing: LS_BODY }}>
              {q.helper}
            </p>
          )}
        </div>
      </div>

      <div className="ml-[38px]">
        <QuestionInput q={q} response={response} onUpdate={onUpdate} />

        {/* Review + history row */}
        <div className="flex items-center justify-between mt-3 pt-2.5" style={{ borderTop: `1px solid ${BORDER}` }}>
          <HistoryPanel questionId={q.id} />
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onReview(reviewStatus === "flagged" ? null : "flagged")}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-btn font-mono text-[10px] uppercase transition-all hover:opacity-90"
              style={{
                fontWeight: 700,
                letterSpacing: "0.07em",
                background: reviewStatus === "flagged" ? `${REVIEW_FLAG_COLOR}15` : "transparent",
                border: `1px solid ${reviewStatus === "flagged" ? REVIEW_FLAG_COLOR : BORDER}`,
                color: reviewStatus === "flagged" ? REVIEW_FLAG_COLOR : MUTED,
              }}
            >
              <Flag size={10} />
              Flag
            </button>
            <button
              type="button"
              onClick={() => onReview(reviewStatus === "reviewed" ? null : "reviewed")}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-btn font-mono text-[10px] uppercase transition-all hover:opacity-90"
              style={{
                fontWeight: 700,
                letterSpacing: "0.07em",
                background: reviewStatus === "reviewed" ? `${REVIEW_OK_COLOR}15` : "transparent",
                border: `1px solid ${reviewStatus === "reviewed" ? REVIEW_OK_COLOR : BORDER}`,
                color: reviewStatus === "reviewed" ? REVIEW_OK_COLOR : MUTED,
              }}
            >
              <Check size={10} />
              Reviewed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuestionInput({
  q, response, onUpdate,
}: {
  q: Question;
  response?: Response;
  onUpdate: (partial: Partial<Response>) => void;
}) {
  const inputStyle = {
    background: BG,
    border: `1px solid ${BORDER}`,
    color: INK,
  } as const;

  if (q.kind === "text") {
    return (
      <input
        type="text"
        defaultValue={response?.answerText ?? ""}
        onBlur={(e) => onUpdate({ answerText: e.target.value })}
        placeholder="Your answer…"
        className="w-full rounded-btn px-4 py-3 font-body text-[14px]"
        style={inputStyle}
      />
    );
  }

  if (q.kind === "textarea") {
    return (
      <textarea
        ref={(el) => {
          if (el) { el.style.height = "auto"; el.style.height = `${el.scrollHeight}px`; }
        }}
        defaultValue={response?.answerText ?? ""}
        onInput={(e) => {
          const el = e.currentTarget;
          el.style.height = "auto";
          el.style.height = `${el.scrollHeight}px`;
        }}
        onBlur={(e) => onUpdate({ answerText: e.target.value })}
        placeholder="Your answer…"
        rows={1}
        className="w-full rounded-btn px-4 py-3 font-body text-[14px] resize-none overflow-hidden"
        style={inputStyle}
      />
    );
  }

  if (q.kind === "choice") {
    return (
      <div className="flex flex-col gap-2">
        {q.choices?.map((c) => {
          const selected = response?.answerChoice === c;
          return (
            <button
              key={c}
              type="button"
              onClick={() => onUpdate({ answerChoice: c })}
              className="rounded-btn px-4 py-3 font-body text-[14px] text-left transition-colors"
              style={{
                background: selected ? `${VIOLET}10` : BG,
                border: `1px solid ${selected ? VIOLET : BORDER}`,
                color: selected ? VIOLET : INK,
                fontWeight: selected ? 600 : 400,
              }}
            >
              {c}
            </button>
          );
        })}
      </div>
    );
  }

  if (q.kind === "multi_choice") {
    const selected = new Set(response?.answerMulti ?? []);
    return (
      <div className="flex flex-col gap-2">
        {q.choices?.map((c) => {
          const isOn = selected.has(c);
          return (
            <button
              key={c}
              type="button"
              onClick={() => {
                const next = new Set(selected);
                if (isOn) next.delete(c); else next.add(c);
                onUpdate({ answerMulti: Array.from(next) });
              }}
              className="rounded-btn px-4 py-3 font-body text-[14px] text-left flex items-center gap-3 transition-colors"
              style={{
                background: isOn ? `${VIOLET}10` : BG,
                border: `1px solid ${isOn ? VIOLET : BORDER}`,
                color: isOn ? VIOLET : INK,
                fontWeight: isOn ? 600 : 400,
              }}
            >
              <span
                className="inline-flex items-center justify-center"
                style={{
                  width: 16, height: 16,
                  background: isOn ? VIOLET : "transparent",
                  border: `1.5px solid ${isOn ? VIOLET : MUTED}`,
                  borderRadius: 3,
                  color: "#fff",
                }}
              >
                {isOn && <Check size={11} />}
              </span>
              {c}
            </button>
          );
        })}
      </div>
    );
  }

  if (q.kind === "upload") {
    const file = response?.uploadedFilename;
    return (
      <label
        className="rounded-btn px-4 py-6 font-body text-[13px] flex flex-col items-center justify-center gap-2 cursor-pointer hover:opacity-90 transition-opacity"
        style={{
          background: file ? `${GREEN}10` : BG,
          border: `1px dashed ${file ? GREEN : BORDER}`,
          color: file ? GREEN_TEXT : MUTED,
        }}
      >
        <UploadIcon size={18} />
        <span>{file ? `Uploaded: ${file}` : "Drag a PDF here or click to browse"}</span>
        <input
          type="file"
          className="hidden"
          accept=".pdf"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onUpdate({ uploadedFilename: f.name });
          }}
        />
      </label>
    );
  }

  return null;
}

function RightPanel({
  chapterNum, pct, answeredCount, total, actColor, lastSavedAt,
}: {
  chapterNum: number;
  pct: number;
  answeredCount: number;
  total: number;
  actColor: string;
  lastSavedAt: Date | null;
}) {
  const [, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 30_000);
    return () => clearInterval(id);
  }, []);

  const lastSavedLabel = useMemo(() => {
    if (!lastSavedAt) return null;
    const secs = Math.floor((Date.now() - lastSavedAt.getTime()) / 1000);
    if (secs < 10) return "just now";
    if (secs < 60) return `${secs}s ago`;
    return `${Math.floor(secs / 60)}m ago`;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastSavedAt]);

  return (
    <div className="flex flex-col gap-4 sticky top-24">
      <div className="rounded-panel p-4" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
        <p className="font-mono text-[10px] uppercase" style={{ color: MUTED, fontWeight: 700, letterSpacing: "0.1em" }}>
          Chapter {String(chapterNum).padStart(2, "0")} progress
        </p>
        <p className="font-heading mt-1" style={{ fontSize: "1.5rem", fontWeight: 700, color: INK, letterSpacing: "-0.02em", lineHeight: 1 }}>
          {pct}%
        </p>
        <div className="h-1 rounded-full overflow-hidden mt-3 mb-1.5" style={{ background: BORDER }}>
          <div className="h-full" style={{ width: `${pct}%`, background: actColor, transition: "width 200ms ease" }} />
        </div>
        <p className="font-mono text-[11px]" style={{ color: MUTED, letterSpacing: "0.04em" }}>
          {answeredCount}/{total} answered
        </p>
      </div>

      <div className="rounded-panel p-4" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
        <p className="font-mono text-[10px] uppercase" style={{ color: MUTED, fontWeight: 700, letterSpacing: "0.1em" }}>
          Last saved
        </p>
        <p className="font-body mt-1" style={{ fontSize: "0.875rem", color: lastSavedLabel ? GREEN_TEXT : MUTED, fontWeight: 500 }}>
          {lastSavedLabel ? `✓ ${lastSavedLabel}` : "—"}
        </p>
        <p className="font-mono text-[10px] mt-1.5" style={{ color: MUTED, letterSpacing: "0.04em" }}>
          Saved to cloud on blur
        </p>
      </div>
    </div>
  );
}

type HistoryEntry = {
  id: string;
  answer_text: string | null;
  answer_choice: string | null;
  answer_multi: string[] | null;
  uploaded_filename: string | null;
  changed_by_email: string;
  changed_by_name: string | null;
  changed_at: string;
};

function formatHistoryAnswer(entry: HistoryEntry): string {
  if (entry.answer_choice) return entry.answer_choice;
  if (entry.answer_multi?.length) return entry.answer_multi.join(", ");
  if (entry.answer_text) return entry.answer_text;
  if (entry.uploaded_filename) return `📎 ${entry.uploaded_filename}`;
  return "(cleared)";
}

function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (hrs < 24) return `${hrs}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}


function HistoryPanel({ questionId }: { questionId: string }) {
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || history !== null) return;
    setLoading(true);
    fetch(`/api/manager/responses/history?questionId=${encodeURIComponent(questionId)}`)
      .then((r) => r.json())
      .then((d) => setHistory(d.history ?? []))
      .catch(() => setHistory([]))
      .finally(() => setLoading(false));
  }, [open, questionId, history]);

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase hover:opacity-80 transition-opacity"
        style={{ color: MUTED, fontWeight: 700, letterSpacing: "0.08em", background: "none", border: "none", cursor: "pointer", padding: "4px 0" }}
      >
        <Clock size={11} />
        History
        {open ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
      </button>

      {open && (
        <div
          className="mt-2 rounded-btn overflow-hidden"
          style={{ border: `1px solid ${BORDER}` }}
        >
          {loading && (
            <div className="flex items-center gap-2 px-4 py-3" style={{ color: MUTED }}>
              <Loader2 size={12} className="animate-spin" />
              <span className="font-mono text-[11px]">Loading…</span>
            </div>
          )}
          {!loading && history?.length === 0 && (
            <p className="px-4 py-3 font-mono text-[11px]" style={{ color: MUTED }}>No changes recorded yet.</p>
          )}
          {!loading && history && history.length > 0 && (
            <div className="flex flex-col px-4 py-3 gap-4">
              {history.map((entry, i) => {
                const name = entry.changed_by_name ?? entry.changed_by_email.split("@")[0];
                const answer = formatHistoryAnswer(entry);
                const ts = new Date(entry.changed_at).toLocaleString("en-CA", {
                  year: "numeric", month: "2-digit", day: "2-digit",
                  hour: "2-digit", minute: "2-digit", second: "2-digit",
                  hour12: false,
                }).replace(",", "");
                const isLatest = i === 0;
                return (
                  <div key={entry.id}>
                    <p
                      className="font-mono text-[11px] mb-1.5 select-none"
                      style={{ color: isLatest ? VIOLET : MUTED, fontWeight: 600, letterSpacing: "0.04em" }}
                    >
                      ——— {name}&nbsp;&nbsp;{ts}
                    </p>
                    <p
                      className="font-body text-[13px]"
                      style={{ color: isLatest ? INK : SECONDARY, lineHeight: 1.6, letterSpacing: LS_BODY, whiteSpace: "pre-wrap", wordBreak: "break-word" }}
                    >
                      {answer}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function actRoman(act: "Manager" | "Fund" | "Controls"): string {
  return act === "Manager" ? "I" : act === "Fund" ? "II" : "III";
}
