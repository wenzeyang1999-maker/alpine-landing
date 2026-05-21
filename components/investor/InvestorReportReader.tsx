"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { RefDot } from "@/components/app-portal/review/RefDot";
import DocumentsPanel from "@/components/investor/DocumentsPanel";
import {
  getReportContent,
  getReferencedDocs,
  getReportPdfUrl,
  topicNumbers,
} from "@/lib/investor/report-content";
import type { TopicInfo } from "@/lib/app-portal/ridgeline-data";
import {
  INK,
  SECONDARY,
  MUTED,
  SUBTLE,
  BORDER,
  BG_CARD,
  BG_ALT,
  VIOLET,
  GREEN,
  AMBER,
  GREEN_TEXT,
  AMBER_TEXT,
} from "@/lib/constants";

/* eslint-disable @typescript-eslint/no-explicit-any */

type ViewMode = "report" | "data";

// ── Rating helpers ───────────────────────────────────────────────────────────

const RED = "#EF4444";
const RED_TEXT = "#B91C1C";
const CARD_SHADOW = "0 1px 3px rgba(15,15,16,0.04)";

const RATING_COLOR: Record<string, string> = { GREEN, YELLOW: AMBER, RED };
const RATING_TEXT: Record<string, string> = { GREEN: GREEN_TEXT, YELLOW: AMBER_TEXT, RED: RED_TEXT };

const RECO_WORD: Record<string, string> = { GREEN: "ACCEPT", YELLOW: "WATCHLIST", RED: "FLAG" };
const APPROVAL_LABEL: Record<string, string> = {
  GREEN: "Full Approval",
  YELLOW: "Conditional Approval",
  RED: "Flagged — IC Review",
};

const ACT_LABELS = ["Act I — The Manager", "Act II — The Fund", "Act III — The Controls"];

/** Split topic numbers into the three acts (Manager / Fund / Controls). */
function getActs(nums: number[]): Array<{ label: string; topics: number[] }> {
  const n = nums.length;
  let split: number[][];
  if (n === 8) split = [nums.slice(0, 3), nums.slice(3, 5), nums.slice(5, 8)];
  else if (n === 12) split = [nums.slice(0, 4), nums.slice(4, 8), nums.slice(8, 12)];
  else {
    const third = Math.ceil(n / 3);
    split = [nums.slice(0, third), nums.slice(third, third * 2), nums.slice(third * 2)];
  }
  return ACT_LABELS.map((label, i) => ({ label, topics: split[i] ?? [] })).filter(
    (a) => a.topics.length > 0,
  );
}

type RefColor = "blue" | "emerald" | "amber" | "purple";

function sourceColor(source: string): RefColor {
  const s = (source || "").toLowerCase();
  if (s.includes("edgar") || s.includes("iapd") || s.includes("iard") || s.includes("sec") || s.includes("sos") || s.includes("register"))
    return "blue";
  if (s.includes("admin") || s.includes("verification") || s.includes("meridian") || s.includes("apex") || s.includes("pentest"))
    return "emerald";
  if (s.includes("manager") || s.includes("call") || s.includes("interview") || s.includes("response"))
    return "amber";
  if (s.includes("alpine") || s.includes("analysis")) return "purple";
  return "blue";
}

function stripHtml(s: string): string {
  return (s || "").replace(/<\/?[^>]+>/g, "").trim();
}

function flagColor(flag?: string): string | null {
  if (flag === "green") return GREEN;
  if (flag === "yellow") return AMBER;
  if (flag === "red") return RED;
  return null;
}

/** Render the `###`-delimited findings prose into headings / paragraphs / bullets. */
function renderFindings(text: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  let para: string[] = [];
  let bullets: string[] = [];
  let key = 0;

  const flushPara = () => {
    if (para.length) {
      out.push(
        <p key={`p${key++}`} className="font-body text-sm leading-relaxed" style={{ color: SECONDARY }}>
          {para.join(" ")}
        </p>,
      );
      para = [];
    }
  };
  const flushBullets = () => {
    if (bullets.length) {
      out.push(
        <ul key={`u${key++}`} className="space-y-1.5">
          {bullets.map((b, i) => (
            <li key={i} className="font-body text-sm leading-relaxed flex gap-2" style={{ color: SECONDARY }}>
              <span style={{ color: VIOLET }} aria-hidden>
                •
              </span>
              <span>{b}</span>
            </li>
          ))}
        </ul>,
      );
      bullets = [];
    }
  };

  for (const raw of (text || "").split("\n")) {
    const line = raw.trim();
    if (line === "") {
      flushPara();
      flushBullets();
    } else if (line.startsWith("### ")) {
      flushPara();
      flushBullets();
      out.push(
        <h4 key={`h${key++}`} className="font-heading font-emphasis text-sm mt-2" style={{ color: INK }}>
          {line.slice(4)}
        </h4>,
      );
    } else if (line.startsWith("•") || line.startsWith("- ")) {
      flushPara();
      bullets.push(line.replace(/^[•-]\s*/, ""));
    } else {
      flushBullets();
      para.push(line);
    }
  }
  flushPara();
  flushBullets();
  return out;
}

// ── Shared chapter header ────────────────────────────────────────────────────

function ChapterHeader({
  num,
  index,
  topic,
  kicker,
  summary,
}: {
  num: number;
  index: number;
  topic: TopicInfo;
  kicker: string;
  summary?: string;
}) {
  const rating = (topic.rating || "").toUpperCase();
  const dot = RATING_COLOR[rating] ?? MUTED;
  const text = RATING_TEXT[rating] ?? MUTED;
  return (
    <div className="px-5 py-4" style={{ borderBottom: `1px solid ${BORDER}` }}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: SUBTLE }}>
            {kicker}
          </p>
          <h3
            id={`chapter-${num}-heading`}
            className="font-heading font-emphasis text-lg mt-0.5"
            style={{ color: INK }}
          >
            {topic.name}
          </h3>
        </div>
        <span
          className="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-card font-mono text-[11px] font-bold uppercase"
          style={{ background: `${dot}1A`, color: text }}
        >
          <span className="inline-block w-2 h-2 rounded-full" style={{ background: dot }} aria-hidden />
          {rating || "—"}
        </span>
      </div>
      {summary && (
        <p className="font-body text-sm leading-relaxed mt-3" style={{ color: SECONDARY }}>
          {summary}
        </p>
      )}
    </div>
  );
}

// ── Score donut ──────────────────────────────────────────────────────────────

function ScoreDonut({ score, color }: { score: number; color: string }) {
  const size = 84;
  const stroke = 7;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, score)) / 100;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={BG_ALT} strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circ * pct} ${circ}`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-heading font-emphasis text-2xl leading-none tabular-nums" style={{ color: INK }}>
          {score}
        </span>
        <span className="font-mono text-[8px] mt-0.5" style={{ color: SUBTLE }}>
          / 100
        </span>
      </div>
    </div>
  );
}

// ── Overview (Report mode) ───────────────────────────────────────────────────

function TopicSummaryCard({
  num,
  topic,
  onNavigate,
}: {
  num: number;
  topic: TopicInfo | undefined;
  onNavigate: (id: string) => void;
}) {
  if (!topic) return null;
  const rating = (topic.rating || "").toUpperCase();
  const dot = RATING_COLOR[rating] ?? MUTED;
  const text = RATING_TEXT[rating] ?? MUTED;
  const summary = (topic.summary || "").replace(/^(GREEN|YELLOW|RED):\s*/i, "");
  return (
    <button
      type="button"
      onClick={() => onNavigate(`chapter-${num}`)}
      className="text-left rounded-panel border p-3.5 transition-shadow hover:shadow-sm"
      style={{ background: BG_CARD, borderColor: BORDER }}
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: dot }} aria-hidden />
          <span className="font-heading font-emphasis text-[13px] leading-snug" style={{ color: INK }}>
            {topic.name}
          </span>
        </div>
        <span
          className="shrink-0 font-mono text-[9px] font-bold uppercase px-1.5 py-0.5 rounded"
          style={{ background: `${dot}1A`, color: text }}
        >
          {rating || "—"}
        </span>
      </div>
      <p className="font-body text-[12px] leading-relaxed line-clamp-2" style={{ color: MUTED }}>
        {summary}
      </p>
    </button>
  );
}

function RiskRow({ ro }: { ro: any }) {
  const sev = (ro.severity || "").toUpperCase();
  const dot = sev === "HIGH" ? RED : sev === "MEDIUM" ? AMBER : "#9CA3AF";
  const text = sev === "HIGH" ? RED_TEXT : sev === "MEDIUM" ? AMBER_TEXT : MUTED;
  return (
    <div className="py-3" style={{ borderTop: `1px solid ${BG_ALT}` }}>
      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
        {ro.id && (
          <span className="font-mono text-[10px]" style={{ color: SUBTLE }}>
            {ro.id}
          </span>
        )}
        <span
          className="font-mono text-[9px] font-bold uppercase px-1.5 py-0.5 rounded"
          style={{ background: `${dot}1A`, color: text }}
        >
          {sev}
        </span>
        {ro.topic && (
          <span className="font-mono text-[10px] uppercase tracking-wide" style={{ color: SUBTLE }}>
            {ro.topic}
          </span>
        )}
      </div>
      <p className="font-body text-[13px] font-emphasis" style={{ color: INK }}>
        {ro.title}
      </p>
      {ro.detail && (
        <p className="font-body text-[12px] mt-0.5 leading-relaxed" style={{ color: MUTED }}>
          {ro.detail}
        </p>
      )}
    </div>
  );
}

function Overview({
  entry,
  topicData,
  mock,
  nums,
  onNavigate,
}: {
  entry: { fundName: string; manager: string; strategy: string; rating: string; oddScore: number };
  topicData: Record<number, TopicInfo>;
  mock: any;
  nums: number[];
  onNavigate: (id: string) => void;
}) {
  const fund = mock?.fund ?? {};
  const ratingColor = RATING_COLOR[entry.rating] ?? MUTED;
  const ratingText = RATING_TEXT[entry.rating] ?? MUTED;
  const recoWord = RECO_WORD[entry.rating] ?? "WATCHLIST";
  const approval = APPROVAL_LABEL[entry.rating] ?? "Conditional Approval";

  const recSummary = stripHtml(fund.recommendation_summary ?? "");
  const recPara = recSummary
    ? `Alpine's operational due diligence review of ${fund.name ?? entry.fundName} ${recSummary}`
    : `Alpine has completed its operational due diligence review of ${entry.fundName}.`;
  const conditions = stripHtml(fund.conditions_summary ?? "");

  const acts = getActs(nums);
  const ros: any[] = Array.isArray(mock?.risk_observations) ? mock.risk_observations : [];
  const highCount = ros.filter((r) => (r.severity || "").toUpperCase() === "HIGH").length;
  const medCount = ros.filter((r) => (r.severity || "").toUpperCase() === "MEDIUM").length;
  const lowCount = ros.filter((r) => (r.severity || "").toUpperCase() === "LOW").length;
  const strengths: any[] = Array.isArray(mock?.strengths) ? mock.strengths : [];

  const snapshotRows: Array<[string, string | undefined]> = [
    ["AUM", fund.aum],
    ["Strategy", fund.strategy ?? entry.strategy],
    ["Domicile", fund.domicile],
    ["Fund NAV", fund.fund_nav],
    ["Manager", fund.manager ?? entry.manager],
  ];

  return (
    <section id="overview" className="scroll-mt-[170px] md:scroll-mt-[116px]">
      <h2 className="font-heading font-emphasis text-lg mb-3" style={{ color: INK }}>
        Overview
      </h2>

      <div className="space-y-5">
        {/* Recommendation + Fund snapshot */}
        <div className="grid lg:grid-cols-[1fr_296px] gap-4">
          <div className="rounded-panel border p-5" style={{ background: BG_CARD, borderColor: BORDER }}>
            <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: SUBTLE }}>
              Investment Recommendation
            </p>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <span className="font-heading font-emphasis text-2xl leading-none" style={{ color: ratingText }}>
                {recoWord}
              </span>
              <span
                className="font-body text-[11px] font-emphasis px-2.5 py-1 rounded-full"
                style={{ background: `${ratingColor}1A`, color: ratingText }}
              >
                {approval}
              </span>
            </div>
            <p className="font-body text-sm leading-relaxed mt-3" style={{ color: SECONDARY }}>
              {recPara}
            </p>
            {conditions && (
              <div className="mt-3 pl-3" style={{ borderLeft: `3px solid ${AMBER}` }}>
                <p className="font-body text-[13px] leading-relaxed" style={{ color: AMBER_TEXT }}>
                  {conditions}
                </p>
              </div>
            )}
            <div className="mt-4">
              <p className="font-mono text-[10px] uppercase tracking-widest mb-1.5" style={{ color: SUBTLE }}>
                {nums.length}-Chapter Status
              </p>
              <div className="flex gap-1.5 flex-wrap">
                {nums.map((n) => {
                  const r = (topicData[n]?.rating || "").toUpperCase();
                  const c = RATING_COLOR[r] ?? BORDER;
                  return (
                    <button
                      key={n}
                      type="button"
                      onClick={() => onNavigate(`chapter-${n}`)}
                      title={topicData[n]?.name}
                      aria-label={topicData[n]?.name}
                      className="w-3 h-3 rounded-[3px] transition-opacity hover:opacity-70"
                      style={{ background: c }}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          <div className="rounded-panel border p-5" style={{ background: BG_CARD, borderColor: BORDER }}>
            <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: SUBTLE }}>
              Fund Snapshot
            </p>
            <div className="flex items-center gap-4 mt-3">
              <ScoreDonut score={entry.oddScore} color={ratingColor} />
              <div>
                <p className="font-body text-[13px] font-emphasis" style={{ color: INK }}>
                  ODD Score
                </p>
                {fund.odd_percentile && (
                  <p className="font-body text-xs mt-0.5" style={{ color: SUBTLE }}>
                    Percentile: {fund.odd_percentile}
                  </p>
                )}
              </div>
            </div>
            <dl className="mt-4 space-y-1.5">
              {snapshotRows
                .filter(([, v]) => v)
                .map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-3 text-[12px]">
                    <dt className="shrink-0" style={{ color: MUTED }}>
                      {k}
                    </dt>
                    <dd className="text-right font-emphasis" style={{ color: INK }}>
                      {v}
                    </dd>
                  </div>
                ))}
            </dl>
          </div>
        </div>

        {/* Three acts */}
        {acts.map((act) => (
          <div key={act.label}>
            <div className="flex items-center gap-3 mb-2.5">
              <span
                className="font-mono text-[10px] font-bold uppercase tracking-widest shrink-0"
                style={{ color: VIOLET }}
              >
                {act.label}
              </span>
              <div className="flex-1 h-px" style={{ background: BORDER }} />
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {act.topics.map((n) => (
                <TopicSummaryCard key={n} num={n} topic={topicData[n]} onNavigate={onNavigate} />
              ))}
            </div>
          </div>
        ))}

        {/* Key strengths */}
        {strengths.length > 0 && (
          <div className="rounded-panel border p-5" style={{ background: BG_CARD, borderColor: BORDER }}>
            <h3 className="font-heading font-emphasis text-base mb-3" style={{ color: INK }}>
              Key Strengths
            </h3>
            <ul className="space-y-2.5">
              {strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <svg
                    width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={GREEN_TEXT}
                    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                    className="shrink-0 mt-0.5" aria-hidden
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <p className="font-body text-[13px] leading-relaxed" style={{ color: SECONDARY }}>
                    <span className="font-emphasis" style={{ color: INK }}>
                      {s.title}
                    </span>
                    {s.detail ? ` — ${s.detail}` : ""}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Risk observations */}
        {ros.length > 0 && (
          <div className="rounded-panel border p-5" style={{ background: BG_CARD, borderColor: BORDER }}>
            <div className="flex items-center justify-between gap-3 mb-1">
              <h3 className="font-heading font-emphasis text-base" style={{ color: INK }}>
                Risk Observations
              </h3>
              <span className="font-mono text-[11px]" style={{ color: SUBTLE }}>
                <span style={{ color: RED_TEXT, fontWeight: 700 }}>{highCount}</span> high
                {" · "}
                <span style={{ color: AMBER_TEXT, fontWeight: 700 }}>{medCount}</span> medium
                {lowCount > 0 ? ` · ${lowCount} low` : ""}
              </span>
            </div>
            <div>
              {ros.map((ro, i) => (
                <RiskRow key={ro.id ?? i} ro={ro} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ── Report chapter (narrative findings) ──────────────────────────────────────

function ReportChapter({ num, index, topic }: { num: number; index: number; topic: TopicInfo }) {
  const summary = (topic.summary || "").replace(/^(GREEN|YELLOW|RED):\s*/i, "");
  return (
    <section
      id={`chapter-${num}`}
      className="scroll-mt-[170px] md:scroll-mt-[116px]"
      aria-labelledby={`chapter-${num}-heading`}
    >
      <div className="rounded-panel border overflow-hidden" style={{ background: BG_CARD, borderColor: BORDER }}>
        <ChapterHeader num={num} index={index} topic={topic} kicker={`Chapter ${index}`} summary={summary} />
        {topic.findings && (
          <div className="px-5 py-4 space-y-2.5">{renderFindings(topic.findings)}</div>
        )}
      </div>
    </section>
  );
}

// ── Data chapter (evidence tables) ───────────────────────────────────────────

function DataChapter({
  num,
  index,
  topic,
  slug,
}: {
  num: number;
  index: number;
  topic: TopicInfo;
  slug: string;
}) {
  const groups = topic.dataPoints ?? [];
  return (
    <section
      id={`chapter-${num}`}
      className="scroll-mt-[170px] md:scroll-mt-[116px]"
      aria-labelledby={`chapter-${num}-heading`}
    >
      <div className="rounded-panel border overflow-hidden" style={{ background: BG_CARD, borderColor: BORDER }}>
        <ChapterHeader num={num} index={index} topic={topic} kicker={`Chapter ${index} · Evidence`} />
        {groups.length > 0 ? (
          <div className="px-5 py-4 space-y-4">
            {groups.map((group, gi) => (
              <div key={gi}>
                <h4 className="font-heading font-emphasis text-[13px] mb-1" style={{ color: INK }}>
                  {group.group}
                </h4>
                <div>
                  {group.items.map((item, ii) => {
                    const fc = flagColor(item.flag);
                    return (
                      <div
                        key={ii}
                        className="flex items-start justify-between gap-4 py-2"
                        style={{ borderBottom: `1px solid ${BG_ALT}` }}
                      >
                        <span className="font-body text-[13px] shrink-0 max-w-[42%]" style={{ color: MUTED }}>
                          {item.label}
                        </span>
                        <span
                          className="font-body text-[13px] text-right flex items-start gap-1.5 justify-end flex-wrap"
                          style={{ color: INK }}
                        >
                          {fc && (
                            <span
                              className="inline-block w-2 h-2 rounded-full mt-1.5 shrink-0"
                              style={{ background: fc }}
                              aria-hidden
                            />
                          )}
                          <span>{item.value}</span>
                          {item.source && (
                            <span className="shrink-0">
                              <RefDot
                                source={item.source}
                                quote={item.value}
                                color={sourceColor(item.source)}
                                slug={slug}
                              />
                            </span>
                          )}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-5 py-4">
            <p className="font-body text-sm" style={{ color: MUTED }}>
              No structured data points recorded for this chapter.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

// ── View toggle ──────────────────────────────────────────────────────────────

function ViewToggle({ mode, onChange }: { mode: ViewMode; onChange: (m: ViewMode) => void }) {
  return (
    <div
      className="inline-flex rounded-btn p-0.5"
      style={{ background: BG_ALT, border: `1px solid ${BORDER}` }}
      role="tablist"
      aria-label="Report or data view"
    >
      {(["report", "data"] as ViewMode[]).map((m) => {
        const active = mode === m;
        return (
          <button
            key={m}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(m)}
            className="px-3.5 py-1.5 rounded-[5px] font-body text-[13px] transition-colors"
            style={{
              background: active ? BG_CARD : "transparent",
              color: active ? INK : MUTED,
              fontWeight: active ? 600 : 500,
              boxShadow: active ? CARD_SHADOW : "none",
            }}
          >
            {m === "report" ? "Alpine Report" : "Alpine Data"}
          </button>
        );
      })}
    </div>
  );
}

// ── Main reader ──────────────────────────────────────────────────────────────

export default function InvestorReportReader({ slug }: { slug: string }) {
  const content = useMemo(() => getReportContent(slug), [slug]);
  const referencedDocs = useMemo(() => getReferencedDocs(slug), [slug]);
  const pdfUrl = useMemo(() => getReportPdfUrl(slug), [slug]);
  const [viewMode, setViewMode] = useState<ViewMode>("report");
  const [activeSection, setActiveSection] = useState("overview");

  const sections = useMemo(() => {
    if (!content) return [] as Array<{ id: string; label: string }>;
    const ns = topicNumbers(content.topicData);
    const chapters = ns.map((n, i) => ({
      id: `chapter-${n}`,
      label: `${i + 1}. ${content.topicData[n].name}`,
    }));
    if (viewMode === "data") return chapters;
    return [
      { id: "overview", label: "Overview" },
      ...chapters,
      { id: "documents", label: "Documents" },
    ];
  }, [content, viewMode]);

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveSection(id);
    }
  }, []);

  const handleModeChange = useCallback(
    (m: ViewMode) => {
      if (m === viewMode) return;
      setViewMode(m);
      setActiveSection(m === "report" ? "overview" : "");
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [viewMode],
  );

  // Scroll-spy — highlight the TOC entry nearest the top of the viewport.
  useEffect(() => {
    if (sections.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActiveSection(e.target.id);
        }
      },
      { rootMargin: "-25% 0px -70% 0px", threshold: 0 },
    );
    for (const s of sections) {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [sections]);

  if (!content) return null; // server already guarded; defensive

  const { entry, topicData, mock } = content;
  const nums = topicNumbers(topicData);
  const ratingColor = RATING_COLOR[entry.rating] ?? MUTED;
  const ratingText = RATING_TEXT[entry.rating] ?? MUTED;

  return (
    <main id="main-content" className="flex-1 w-full">
      {/* Report header */}
      <div className="sticky top-0 z-20" style={{ background: BG_CARD, borderBottom: `1px solid ${BORDER}` }}>
        <div className="mx-auto max-w-6xl px-6 pt-3 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <Link
              href="/reports"
              className="font-body text-xs hover:opacity-70 transition-opacity"
              style={{ color: MUTED }}
            >
              ← All reports
            </Link>
            <h1 className="font-heading font-emphasis text-base md:text-lg truncate" style={{ color: INK }}>
              {entry.fundName}
            </h1>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            {pdfUrl && (
              <a
                href={pdfUrl}
                download={`${entry.fundName} — Alpine ODD Report.pdf`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-body text-[13px] font-emphasis px-3 py-1.5 rounded-btn min-h-[36px] transition-opacity hover:opacity-90"
                style={{ background: INK, color: "#fff" }}
              >
                <svg
                  width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                <span className="hidden sm:inline">Download PDF</span>
                <span className="sm:hidden">PDF</span>
              </a>
            )}
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-card font-mono text-[11px] font-bold uppercase"
              style={{ background: `${ratingColor}1A`, color: ratingText }}
            >
              <span className="inline-block w-2 h-2 rounded-full" style={{ background: ratingColor }} aria-hidden />
              {entry.rating}
            </span>
          </div>
        </div>
        <div className="mx-auto max-w-6xl px-6 py-2.5">
          <ViewToggle mode={viewMode} onChange={handleModeChange} />
        </div>
        {/* Mobile section picker */}
        <div className="md:hidden px-6 pb-3">
          <label htmlFor="section-picker" className="sr-only">
            Jump to section
          </label>
          <select
            id="section-picker"
            value={activeSection}
            onChange={(e) => scrollToSection(e.target.value)}
            className="w-full rounded-card px-3 py-2.5 text-sm font-body min-h-[44px]"
            style={{ border: `1px solid ${BORDER}`, background: BG_ALT, color: INK }}
          >
            {sections.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid md:grid-cols-[220px_1fr] gap-8">
          {/* Floating TOC sidebar — desktop / tablet */}
          <nav aria-label="Report sections" className="hidden md:block">
            <div
              className="sticky top-[124px] rounded-panel border p-3"
              style={{ background: BG_CARD, borderColor: BORDER, boxShadow: CARD_SHADOW }}
            >
              <p className="font-mono text-[10px] uppercase tracking-widest mb-2 px-1.5" style={{ color: SUBTLE }}>
                {viewMode === "report" ? "Report Contents" : "Data Contents"}
              </p>
              <ul className="space-y-0.5">
                {sections.map((s) => {
                  const active = activeSection === s.id;
                  return (
                    <li key={s.id}>
                      <button
                        type="button"
                        onClick={() => scrollToSection(s.id)}
                        className="w-full text-left px-2.5 py-1.5 rounded-btn font-body text-[13px] leading-snug transition-colors"
                        style={{
                          background: active ? `${VIOLET}12` : "transparent",
                          color: active ? VIOLET : MUTED,
                          fontWeight: active ? 600 : 400,
                        }}
                        aria-current={active ? "true" : undefined}
                      >
                        {s.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </nav>

          {/* Report body */}
          <div className="min-w-0 space-y-8">
            {viewMode === "report" ? (
              <>
                <Overview
                  entry={entry}
                  topicData={topicData}
                  mock={mock}
                  nums={nums}
                  onNavigate={scrollToSection}
                />
                {nums.map((n, i) => (
                  <ReportChapter key={n} num={n} index={i + 1} topic={topicData[n]} />
                ))}
                <section id="documents" className="scroll-mt-[170px] md:scroll-mt-[116px]">
                  <DocumentsPanel slug={slug} referencedDocs={referencedDocs} />
                </section>
              </>
            ) : (
              <>
                <div>
                  <h2 className="font-heading font-emphasis text-lg" style={{ color: INK }}>
                    Alpine Data
                  </h2>
                  <p className="font-body text-sm mt-1" style={{ color: MUTED }}>
                    The evidence base behind the report — the verified data points Alpine
                    collected for each chapter, with citations to their source documents.
                  </p>
                </div>
                {nums.map((n, i) => (
                  <DataChapter key={n} num={n} index={i + 1} topic={topicData[n]} slug={slug} />
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
