"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowRight, Check, Upload as UploadIcon } from "lucide-react";
import {
  BG, BG_CARD, INK, SECONDARY, MUTED, VIOLET, GREEN, GREEN_TEXT, AMBER, BORDER, LS_BODY, LS_H3,
} from "@/lib/constants";
import { chapterByNum, CHAPTERS, ACT_COLOR, type Question } from "@/lib/manager/framework";
import {
  getFirm, getResponses, saveResponse, hasAnswer, lastSavedRelative,
  type Firm, type Response,
} from "@/lib/manager/local-state";
import { WorkspaceShell } from "../../../_components/WorkspaceShell";

export default function ChapterPage() {
  const router = useRouter();
  const params = useParams<{ n: string }>();
  const chapterNum = Number(params.n);
  const chapter = chapterByNum(chapterNum);

  const [firm, setFirm] = useState<Firm | null>(null);
  const [responses, setResponses] = useState<Record<string, Response>>({});
  const [hydrated, setHydrated] = useState(false);
  const [lastSavedTick, setLastSavedTick] = useState(0); // forces re-render after save

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

  const handleResponseUpdate = (next: Response) => {
    saveResponse(next);
    setResponses((prev) => ({ ...prev, [next.questionId]: next }));
    setLastSavedTick((t) => t + 1);
  };

  if (!chapter) {
    return (
      <div style={{ background: BG, padding: 40 }}>
        <p style={{ color: INK }}>Chapter {chapterNum} not found.</p>
        <Link href="/manager/workspace" style={{ color: VIOLET }}>← Back to overview</Link>
      </div>
    );
  }
  if (!hydrated || !firm) return null;

  const chapterResponses = Object.values(responses).filter((r) => r.chapterNum === chapterNum);
  const answeredCount = chapterResponses.filter(hasAnswer).length;
  const pct = chapter.questions.length === 0
    ? 0
    : Math.round((answeredCount / chapter.questions.length) * 100);

  const nextChapter = CHAPTERS.find((c) => c.num === chapterNum + 1);
  const prevChapter = CHAPTERS.find((c) => c.num === chapterNum - 1);

  return (
    <WorkspaceShell
      firm={firm}
      rightPanel={
        <RightPanel
          chapterNum={chapterNum}
          pct={pct}
          answeredCount={answeredCount}
          total={chapter.questions.length}
          actColor={ACT_COLOR[chapter.act]}
          tick={lastSavedTick}
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
          className="font-heading mb-2"
          style={{ fontSize: "1.875rem", fontWeight: 700, lineHeight: 1.15, letterSpacing: "-0.03em", color: INK }}
        >
          {chapter.title}
        </h1>
        <p
          className="font-body max-w-2xl"
          style={{ fontSize: "0.9375rem", lineHeight: 1.6, color: SECONDARY, letterSpacing: LS_BODY }}
        >
          {chapter.description}
        </p>
      </div>

      {/* Questions */}
      <div className="flex flex-col gap-5">
        {chapter.questions.map((q, idx) => (
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
                chapterNum: chapterNum,
                updatedAt: new Date().toISOString(),
              })
            }
          />
        ))}
      </div>

      {/* Chapter navigation */}
      <div className="flex items-center justify-between mt-10 pt-6" style={{ borderTop: `1px solid ${BORDER}` }}>
        {prevChapter ? (
          <Link
            href={`/manager/workspace/chapter/${prevChapter.num}`}
            className="rounded-btn px-4 py-2.5 font-body text-[13px] inline-flex items-center gap-1.5"
            style={{ border: `1px solid ${BORDER}`, color: SECONDARY, fontWeight: 500 }}
          >
            ← {prevChapter.numLabel} {prevChapter.title}
          </Link>
        ) : <span />}
        {nextChapter ? (
          <Link
            href={`/manager/workspace/chapter/${nextChapter.num}`}
            className="rounded-btn px-4 py-2.5 font-body text-[13px] inline-flex items-center gap-1.5"
            style={{ background: INK, color: "#fff", fontWeight: 600 }}
          >
            Save & continue to {nextChapter.numLabel} <ArrowRight size={13} />
          </Link>
        ) : (
          <Link
            href="/manager/workspace"
            className="rounded-btn px-4 py-2.5 font-body text-[13px] inline-flex items-center gap-1.5"
            style={{ background: INK, color: "#fff", fontWeight: 600 }}
          >
            Done — back to overview <ArrowRight size={13} />
          </Link>
        )}
      </div>
    </WorkspaceShell>
  );
}

function QuestionCard({
  q, index, response, onUpdate,
}: {
  q: Question;
  index: number;
  response?: Response;
  onUpdate: (partial: Partial<Response>) => void;
}) {
  const filled = response ? hasAnswer(response) : false;
  return (
    <div
      className="rounded-panel p-5 sm:p-6"
      style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}
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
            <p
              className="font-body text-[12.5px] mt-1"
              style={{ color: MUTED, lineHeight: 1.5, letterSpacing: LS_BODY }}
            >
              {q.helper}
            </p>
          )}
        </div>
      </div>
      <div className="ml-[38px]">
        <QuestionInput q={q} response={response} onUpdate={onUpdate} />
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
        defaultValue={response?.answerText ?? ""}
        onBlur={(e) => onUpdate({ answerText: e.target.value })}
        placeholder="Your answer…"
        rows={4}
        className="w-full rounded-btn px-4 py-3 font-body text-[14px] resize-y"
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
                if (isOn) next.delete(c);
                else next.add(c);
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
  chapterNum, pct, answeredCount, total, actColor, tick,
}: {
  chapterNum: number;
  pct: number;
  answeredCount: number;
  total: number;
  actColor: string;
  tick: number;
}) {
  // re-compute lastSaved whenever a save happens (tick) or on mount
  const lastSaved = useMemo(() => lastSavedRelative(), [tick]);

  return (
    <div className="flex flex-col gap-4 sticky top-24">
      <div
        className="rounded-panel p-4"
        style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}
      >
        <p
          className="font-mono text-[10px] uppercase"
          style={{ color: MUTED, fontWeight: 700, letterSpacing: "0.1em" }}
        >
          Chapter {String(chapterNum).padStart(2, "0")} progress
        </p>
        <p
          className="font-heading mt-1"
          style={{ fontSize: "1.5rem", fontWeight: 700, color: INK, letterSpacing: "-0.02em", lineHeight: 1 }}
        >
          {pct}%
        </p>
        <div
          className="h-1 rounded-full overflow-hidden mt-3 mb-1.5"
          style={{ background: BORDER }}
        >
          <div
            className="h-full"
            style={{ width: `${pct}%`, background: actColor, transition: "width 200ms ease" }}
          />
        </div>
        <p
          className="font-mono text-[11px]"
          style={{ color: MUTED, letterSpacing: "0.04em" }}
        >
          {answeredCount}/{total} answered
        </p>
      </div>

      <div
        className="rounded-panel p-4"
        style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}
      >
        <p
          className="font-mono text-[10px] uppercase"
          style={{ color: MUTED, fontWeight: 700, letterSpacing: "0.1em" }}
        >
          Last saved
        </p>
        <p
          className="font-body mt-1"
          style={{ fontSize: "0.875rem", color: lastSaved ? GREEN_TEXT : MUTED, fontWeight: 500 }}
        >
          {lastSaved ? `✓ ${lastSaved}` : "—"}
        </p>
        <p
          className="font-mono text-[10px] mt-1.5"
          style={{ color: MUTED, letterSpacing: "0.04em" }}
        >
          Auto-saves on blur
        </p>
      </div>
    </div>
  );
}

function actRoman(act: "Manager" | "Fund" | "Controls"): string {
  return act === "Manager" ? "I" : act === "Fund" ? "II" : "III";
}
