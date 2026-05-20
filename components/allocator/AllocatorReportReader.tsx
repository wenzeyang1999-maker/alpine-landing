"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import OverviewSection from "@/components/app-portal/shell/OverviewSection";
import ExecutiveBriefViewer, {
  type ExecutiveBriefData,
} from "@/components/app-portal/shell/ExecutiveBriefViewer";
import { RefDot } from "@/components/app-portal/review/RefDot";
import DocumentsPanel from "@/components/allocator/DocumentsPanel";
import { getReportContent, topicNumbers } from "@/lib/allocator/report-content";
import type { TopicInfo } from "@/lib/app-portal/ridgeline-data";
import { INK, SECONDARY, MUTED, SUBTLE, BORDER, BG_CARD, BG_ALT, VIOLET, GREEN, AMBER } from "@/lib/constants";

/* eslint-disable @typescript-eslint/no-explicit-any */

// ── Helpers ──────────────────────────────────────────────────────────────────

const RED = "#EF4444";

const RATING_COLOR: Record<string, string> = { GREEN, YELLOW: AMBER, RED };

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

/** Build the ExecutiveBriefViewer's data shape from a fund's mock data. */
function buildExecutiveBrief(mock: any, fundName: string, rating: string): ExecutiveBriefData {
  const fund = mock?.fund ?? {};
  const ratingMap: Record<string, ExecutiveBriefData["overall_rating"]> = {
    GREEN: "ACCEPT",
    YELLOW: "WATCHLIST",
    RED: "FLAG",
  };
  const rec = stripHtml(fund.recommendation_summary ?? "");
  const exec_summary = rec
    ? `Alpine's operational due diligence review of ${fund.name ?? fundName} ${rec}`
    : `Alpine has completed its operational due diligence review of ${fundName}.`;

  const ros: any[] = Array.isArray(mock?.risk_observations) ? mock.risk_observations : [];
  const concerns = ros
    .filter((r) => r.severity === "HIGH" || r.severity === "MEDIUM")
    .sort((a, b) => (a.severity === "HIGH" ? 0 : 1) - (b.severity === "HIGH" ? 0 : 1))
    .slice(0, 6)
    .map((r) => ({ finding: r.title as string, severity: r.severity as "HIGH" | "MEDIUM", topic: r.topic as string }));

  const strengths: any[] = Array.isArray(mock?.strengths) ? mock.strengths : [];
  const key_strengths = strengths.slice(0, 6).map((s) => ({
    strength: s.detail ? `${s.title} — ${s.detail}` : s.title,
    topic: "",
  }));

  const conditions = fund.conditions_summary ? [stripHtml(fund.conditions_summary)] : [];
  const administrator = mock?.fund_performance?.fund_terms?.administrator as string | undefined;

  return {
    overall_rating: ratingMap[rating] ?? "WATCHLIST",
    exec_summary,
    top_concerns: concerns,
    key_strengths,
    conditions,
    verification_status: {
      sec_registration: "Reviewed against SEC EDGAR / IARD during diligence.",
      administrator: administrator
        ? `Independent administrator confirmed: ${administrator}.`
        : "Service-provider independence reviewed during diligence.",
      form_adv: "Current Form ADV reviewed and cross-referenced.",
    },
  };
}

// ── Topic chapter ────────────────────────────────────────────────────────────

function TopicChapter({
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
  const rating = (topic.rating || "").toUpperCase();
  const color = RATING_COLOR[rating] ?? MUTED;
  const summary = (topic.summary || "").replace(/^(GREEN|YELLOW|RED):\s*/i, "");

  return (
    <section
      id={`chapter-${num}`}
      className="scroll-mt-[136px] lg:scroll-mt-[92px]"
      aria-labelledby={`chapter-${num}-heading`}
    >
      <div
        className="rounded-panel border overflow-hidden"
        style={{ background: BG_CARD, borderColor: BORDER }}
      >
        <div className="px-5 py-4" style={{ borderBottom: `1px solid ${BORDER}` }}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: SUBTLE }}>
                Chapter {index}
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
              style={{ background: `${color}1A`, color }}
            >
              <span className="inline-block w-2 h-2 rounded-full" style={{ background: color }} aria-hidden />
              {rating || "—"}
            </span>
          </div>
          {summary && (
            <p className="font-body text-sm leading-relaxed mt-3" style={{ color: SECONDARY }}>
              {summary}
            </p>
          )}
        </div>

        {topic.findings && (
          <div className="px-5 py-4 space-y-2.5" style={{ borderBottom: `1px solid ${BORDER}` }}>
            {renderFindings(topic.findings)}
          </div>
        )}

        {topic.dataPoints && topic.dataPoints.length > 0 && (
          <div className="px-5 py-4 space-y-4">
            <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: SUBTLE }}>
              Evidence & Data Points
            </p>
            {topic.dataPoints.map((group, gi) => (
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
        )}
      </div>
    </section>
  );
}

// ── Main reader ──────────────────────────────────────────────────────────────

export default function AllocatorReportReader({ slug }: { slug: string }) {
  const content = useMemo(() => getReportContent(slug), [slug]);
  const [activeSection, setActiveSection] = useState("overview");

  const sections = useMemo(() => {
    if (!content) return [] as Array<{ id: string; label: string }>;
    const nums = topicNumbers(content.topicData);
    return [
      { id: "overview", label: "Overview" },
      { id: "exec-brief", label: "Executive Brief" },
      ...nums.map((n, i) => ({
        id: `chapter-${n}`,
        label: `${i + 1}. ${content.topicData[n].name}`,
      })),
      { id: "documents", label: "Documents" },
    ];
  }, [content]);

  const scrollToSection = useCallback((id: string) => {
    let target = id;
    const m = id.match(/^analysis-topic-(\d+)$/);
    if (m) target = `chapter-${m[1]}`;
    const el = document.getElementById(target);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveSection(target);
    }
  }, []);

  // Scroll-spy — highlight the TOC entry for the section nearest the top.
  useEffect(() => {
    if (sections.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActiveSection(e.target.id);
        }
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 },
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

  const reviewData = {
    name: mock?.fund?.name ?? entry.fundName,
    aum: mock?.fund?.aum,
    strategy: mock?.fund?.strategy ?? entry.strategy,
    domicile: mock?.fund?.domicile,
    fund_nav: mock?.fund?.fund_nav,
    overall_rating: entry.rating,
    odd_summary: {
      overall_score: entry.oddScore,
      overall_rating: entry.rating,
      executive_summary: stripHtml(mock?.fund?.recommendation_summary ?? "").replace(
        /^recommends? an? [^.]*\.\s*/i,
        "",
      ),
      conditions_summary: stripHtml(mock?.fund?.conditions_summary ?? ""),
    },
  };
  const brief = buildExecutiveBrief(mock, entry.fundName, entry.rating);

  return (
    <main id="main-content" className="flex-1 w-full">
      {/* Report header — fund · rating · ODD score */}
      <div
        className="sticky top-0 z-20"
        style={{ background: BG_CARD, borderBottom: `1px solid ${BORDER}` }}
      >
        <div className="mx-auto max-w-6xl px-6 py-3 flex items-center justify-between gap-4">
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
          <div className="flex items-center gap-3 shrink-0">
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-card font-mono text-[11px] font-bold uppercase"
              style={{ background: `${ratingColor}1A`, color: ratingColor }}
            >
              <span className="inline-block w-2 h-2 rounded-full" style={{ background: ratingColor }} aria-hidden />
              {entry.rating}
            </span>
            <span
              className="font-heading font-emphasis text-base tabular-nums"
              style={{ color: ratingColor }}
              title="ODD score out of 100"
            >
              {entry.oddScore}
              <span className="font-mono text-[10px] font-normal" style={{ color: SUBTLE }}>
                {" "}
                / 100
              </span>
            </span>
          </div>
        </div>
        {/* Mobile section picker */}
        <div className="lg:hidden px-6 pb-3">
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
        <div className="grid lg:grid-cols-[228px_1fr] gap-8">
          {/* TOC rail — desktop */}
          <nav aria-label="Report sections" className="hidden lg:block">
            <div className="sticky top-[84px]">
              <p className="font-mono text-[10px] uppercase tracking-widest mb-2" style={{ color: SUBTLE }}>
                Contents
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
            <section id="overview" className="scroll-mt-[136px] lg:scroll-mt-[92px]">
              <h2 className="font-heading font-emphasis text-lg mb-3" style={{ color: INK }}>
                Overview
              </h2>
              <OverviewSection
                reviewData={reviewData}
                brReviewId={slug}
                onNavigate={scrollToSection}
                topicData={topicData}
                riskObservations={mock?.risk_observations ?? []}
              />
            </section>

            <section id="exec-brief" className="scroll-mt-[136px] lg:scroll-mt-[92px]">
              <ExecutiveBriefViewer data={brief} />
            </section>

            {nums.map((n, i) => (
              <TopicChapter key={n} num={n} index={i + 1} topic={topicData[n]} slug={slug} />
            ))}

            <section id="documents" className="scroll-mt-[136px] lg:scroll-mt-[92px]">
              <DocumentsPanel slug={slug} />
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
