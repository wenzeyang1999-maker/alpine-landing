"use client";

import { useEffect, useState, useCallback } from "react";
import { br2GetVerificationSummary } from "@/lib/br2-api";

/* eslint-disable @typescript-eslint/no-explicit-any */

// ── Topic metadata (matches review page TOPIC_DATA keys) ─────────────────────

const TOPIC_ABBREVS: Record<number, string> = {
  1: "GOV", 2: "REG", 3: "LEGAL", 4: "TECH", 5: "TERMS",
  6: "SVCP", 7: "INV", 8: "TRADE", 9: "VAL", 10: "FIN", 11: "ASSET", 12: "RPT",
};

const TOPIC_NAMES: Record<number, string> = {
  1: "Organization & Governance", 2: "Regulatory & Compliance", 3: "Legal & Conflicts",
  4: "Technology & Cybersecurity", 5: "Fund Terms & Structure", 6: "Service Providers",
  7: "Investment Process", 8: "Trading & Execution", 9: "Valuation Controls",
  10: "Financial Controls", 11: "Asset Verification", 12: "Reporting & Transparency",
};

const ACTS = [
  { label: "Act I: The Manager", topics: [1, 2, 3, 4] },
  { label: "Act II: The Fund", topics: [5, 6, 7, 8] },
  { label: "Act III: The Numbers", topics: [9, 10, 11, 12] },
];

// ── Topic Health Ring — segmented donut showing GREEN/YELLOW/RED distribution ─

function TopicHealthRing({
  topicData,
  overallRating,
  size = 130,
}: {
  topicData?: Record<number, any>;
  overallRating: string;
  size?: number;
}) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Count ratings
  let green = 0, yellow = 0, red = 0, pending = 0;
  for (let i = 1; i <= 12; i++) {
    const r = (topicData?.[i]?.rating || "").toUpperCase();
    if (r === "GREEN") green++;
    else if (r === "YELLOW") yellow++;
    else if (r === "RED") red++;
    else pending++;
  }
  const total = green + yellow + red + pending;

  const strokeW = 10;
  const r = (size - strokeW) / 2;
  const circ = 2 * Math.PI * r;
  const gap = 4; // px gap between segments

  // Build segments: green → yellow → red → pending
  const segments = [
    { count: green, color: "#10B981" },
    { count: yellow, color: "#F59E0B" },
    { count: red, color: "#EF4444" },
    { count: pending, color: "#334155" },
  ].filter((s) => s.count > 0);

  const totalGaps = segments.length * gap;
  const usableCirc = circ - totalGaps;

  let offset = 0;
  const segmentArcs = segments.map((s) => {
    const len = (s.count / total) * usableCirc;
    const arc = { ...s, dasharray: `${len} ${circ - len}`, dashoffset: -offset };
    offset += len + gap;
    return arc;
  });

  // Rating display
  const ratingUpper = (overallRating || "").toUpperCase();
  const ratingTextColor = ratingUpper === "ACCEPT" ? "text-emerald-400"
    : ratingUpper === "FLAG" ? "text-red-400"
    : "text-amber-400";

  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background track */}
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" className="text-br-surface" strokeWidth={strokeW} />
        {/* Animated segments */}
        {segmentArcs.map((seg, i) => (
          <circle
            key={i}
            cx={size / 2} cy={size / 2} r={r} fill="none"
            stroke={seg.color} strokeWidth={strokeW} strokeLinecap="round"
            strokeDasharray={animated ? seg.dasharray : `0 ${circ}`}
            strokeDashoffset={seg.dashoffset}
            style={{ transition: `stroke-dasharray 0.8s ease-out ${i * 0.1}s` }}
          />
        ))}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-[15px] font-heading font-bold tracking-tight ${ratingTextColor}`}>
          {ratingUpper}
        </span>
        <div className="flex items-center gap-1.5 mt-1">
          <span className="flex items-center gap-0.5 text-[10px] font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /><span className="text-emerald-400">{green}</span>
          </span>
          <span className="flex items-center gap-0.5 text-[10px] font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /><span className="text-amber-400">{yellow}</span>
          </span>
          <span className="flex items-center gap-0.5 text-[10px] font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400" /><span className="text-red-400">{red}</span>
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Rating helpers ───────────────────────────────────────────────────────────

function ratingColor(rating: string): string {
  const r = (rating || "").toUpperCase();
  if (r === "GREEN" || r === "ACCEPT") return "text-emerald-400";
  if (r === "YELLOW" || r === "WATCHLIST") return "text-amber-400";
  if (r === "RED" || r === "FLAG") return "text-red-400";
  return "text-br-text-muted";
}

function ratingBg(rating: string): string {
  const r = (rating || "").toUpperCase();
  if (r === "GREEN" || r === "ACCEPT") return "bg-emerald-400/10";
  if (r === "YELLOW" || r === "WATCHLIST") return "bg-amber-400/10";
  if (r === "RED" || r === "FLAG") return "bg-red-400/10";
  return "bg-br-card";
}

function ratingDot(rating: string): string {
  const r = (rating || "").toUpperCase();
  if (r === "GREEN" || r === "ACCEPT") return "bg-emerald-400";
  if (r === "YELLOW" || r === "WATCHLIST") return "bg-amber-400";
  if (r === "RED" || r === "FLAG") return "bg-red-400";
  return "bg-br-text-muted/40";
}

// ── Overview Section Component ───────────────────────────────────────────────

interface OverviewSectionProps {
  reviewData: any;
  brReviewId: string | null;
  onNavigate: (id: string) => void;
  topicData?: Record<number, any>;
  riskObservations?: any[];
}

export default function OverviewSection({
  reviewData, brReviewId, onNavigate, topicData, riskObservations,
}: OverviewSectionProps) {
  const [verificationSummary, setVerificationSummary] = useState<any>(null);

  // Fetch verification summary
  useEffect(() => {
    if (!brReviewId) return;
    br2GetVerificationSummary(brReviewId)
      .then(setVerificationSummary)
      .catch(() => {});
  }, [brReviewId]);

  const oddSummary = reviewData?.odd_summary;
  const overallScore = oddSummary?.overall_score || 0;
  const overallRating = oddSummary?.overall_rating || reviewData?.overall_rating || "WATCHLIST";

  // Topic entries for the score strip
  const topicEntries = oddSummary?.topic_scores
    ? oddSummary.topic_scores
    : oddSummary?.topics
      ? Object.entries(oddSummary.topics).map(([key, val]: [string, any]) => ({
          topic: key.replace(/_/g, " "),
          score: val.score,
          rating: val.rating,
        }))
      : [];

  const ratingStyle = overallRating?.toUpperCase() === "ACCEPT"
    ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/30"
    : overallRating?.toUpperCase() === "FLAG"
      ? "text-red-500 bg-red-500/10 border-red-500/30"
      : "text-amber-500 bg-amber-500/10 border-amber-500/30";

  return (
    <div className="space-y-4">
      {/* ── Recommendation Banner + Fund Snapshot ───────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-3">

        {/* Left: Recommendation */}
        <div className="bg-br-card border border-br rounded-xl p-5">
          <p className="text-[10px] text-br-text-muted uppercase tracking-[0.18em] mb-3">Investment Recommendation</p>
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <span className={`text-[22px] font-extrabold tracking-[-0.03em] leading-none ${
              overallRating?.toUpperCase() === "ACCEPT" ? "text-emerald-400"
              : overallRating?.toUpperCase() === "FLAG" ? "text-red-400"
              : "text-amber-400"
            }`}>
              {(overallRating || "WATCHLIST").toUpperCase()}
            </span>
            <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${ratingStyle}`}>
              {overallRating?.toUpperCase() === "ACCEPT" ? "Full Approval"
               : overallRating?.toUpperCase() === "FLAG" ? "Flagged — IC Review"
               : "Conditional Approval"}
            </span>
          </div>
          <p className="text-[13px] text-br-text-secondary leading-relaxed">
            Alpine&apos;s operational due diligence review of{" "}
            <strong className="text-br-text-primary">{reviewData?.name || "Ridgeline Capital Partners"}</strong>{" "}
            recommends a <strong className="text-br-text-primary">{(overallRating || "watchlist").toLowerCase()}</strong> rating.
            {oddSummary?.executive_summary
              ? ` ${oddSummary.executive_summary}`
              : " Investment performance and service provider quality are strong, but compliance infrastructure and governance gaps preclude full accept status at this time."}
          </p>
          {/* Callout */}
          {overallRating?.toUpperCase() !== "ACCEPT" && (
            <div className="mt-3 border-l-[3px] border-amber-500/50 pl-3 text-[12px] text-amber-300/80 leading-relaxed">
              {oddSummary?.conditions_summary
                ? oddSummary.conditions_summary
                : "Conditions to upgrade: hire a dedicated CCO, implement pre-trade compliance monitoring, formalize succession plan, establish independent valuation committee."}
            </div>
          )}
          {/* Topic dot strip */}
          {topicData && (
            <div className="mt-4">
              <p className="text-[9px] text-br-text-muted uppercase tracking-[0.14em] mb-1.5">12-topic status</p>
              <div className="flex gap-1 flex-wrap">
                {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => {
                  const r = (topicData?.[num]?.rating || "").toUpperCase();
                  const bg = r === "GREEN" ? "bg-emerald-400" : r === "YELLOW" ? "bg-amber-400" : r === "RED" ? "bg-red-400" : "bg-br-text-muted/30";
                  return (
                    <button
                      key={num}
                      onClick={() => onNavigate(`analysis-topic-${num}`)}
                      title={TOPIC_NAMES[num]}
                      className={`w-2.5 h-2.5 rounded-[3px] ${bg} hover:opacity-70 transition-opacity`}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right: Fund Snapshot */}
        <div className="bg-br-card border border-br rounded-xl p-5">
          <p className="text-[10px] text-br-text-muted uppercase tracking-[0.18em] mb-3">Fund Snapshot</p>
          {/* Score circle */}
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-[90px] h-[90px] rounded-full flex flex-col items-center justify-center flex-shrink-0 ${ratingStyle}`}
              style={{ border: "5px solid", borderColor: overallRating?.toUpperCase() === "ACCEPT" ? "#10b981" : overallRating?.toUpperCase() === "FLAG" ? "#ef4444" : "#f59e0b" }}>
              <span className={`text-[30px] font-extrabold leading-none tracking-tight tabular-nums ${
                overallRating?.toUpperCase() === "ACCEPT" ? "text-emerald-400" : overallRating?.toUpperCase() === "FLAG" ? "text-red-400" : "text-amber-400"
              }`}>{overallScore > 0 ? overallScore : "—"}</span>
              <span className="text-[9px] text-br-text-muted mt-0.5">/ 100</span>
            </div>
            <div>
              <p className="text-[12px] text-br-text-secondary">ODD Score</p>
              <p className="text-[10px] text-br-text-muted mt-0.5">
                {overallRating?.toUpperCase() === "ACCEPT" ? "Top quartile" : overallRating?.toUpperCase() === "FLAG" ? "Below threshold" : "Percentile: 34th"}
              </p>
            </div>
          </div>
          {/* Key facts */}
          <div className="space-y-1.5 text-[12px]">
            {[
              ["Fund AUM", reviewData?.aum || "$2.31B"],
              ["Strategy", reviewData?.strategy || "Global Long/Short Equity"],
              ["Domicile", reviewData?.domicile || "Delaware LP + Cayman Feeder"],
              ["Fund NAV", reviewData?.fund_nav || "$1.84B"],
              ["Manager", reviewData?.name || "Ridgeline Capital Partners, LLC"],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between gap-2">
                <span className="text-br-text-muted shrink-0">{label}</span>
                <span className="text-br-text-primary font-medium text-right truncate">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Topic Health Ring + Topic Strip ─────────────────────────────── */}
      <div className="bg-br-card border border-br rounded-xl p-5">
        <div className="flex items-center gap-8">
          <TopicHealthRing topicData={topicData} overallRating={overallRating} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-[10px] font-heading font-semibold text-br-text-muted uppercase tracking-[0.16em]">Topic Ratings</h3>
              <span className="text-[9px] text-br-text-muted opacity-60">12 topics · 3 acts</span>
            </div>
            <div className="grid grid-cols-12 gap-1">
              {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => {
                const td = topicData?.[num];
                const rating = td?.rating || "";
                return (
                  <button
                    key={num}
                    onClick={() => onNavigate(`analysis-topic-${num}`)}
                    className={`rounded-md px-1 py-1.5 text-center hover:opacity-80 transition-opacity ${ratingBg(rating)}`}
                    title={TOPIC_NAMES[num]}
                  >
                    <span className={`text-[9px] font-mono font-medium block ${ratingColor(rating)}`}>
                      {TOPIC_ABBREVS[num]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Topic Summary Cards ───────────────────────────────────────────── */}
      {ACTS.map((act) => (
        <div key={act.label}>
          <div className="flex items-center gap-2 mb-2.5">
            <span className="text-[9px] font-heading font-bold text-alpine-violet uppercase tracking-[0.18em] shrink-0">{act.label}</span>
            <div className="flex-1 h-px bg-br-card-hover" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {act.topics.map((num) => {
              const td = topicData?.[num];
              if (!td) return null;
              return (
                <button
                  key={num}
                  onClick={() => onNavigate(`analysis-topic-${num}`)}
                  className="bg-br-card border border-br rounded-xl p-3 text-left hover:border-alpine-violet/30 transition-colors group"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${ratingDot(td.rating)}`} />
                      <span className="text-[12px] font-heading font-semibold text-br-text-primary">{td.name}</span>
                    </div>
                    <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded uppercase tracking-[0.08em] ${ratingBg(td.rating)} ${ratingColor(td.rating)}`}>
                      {td.rating}
                    </span>
                  </div>
                  <p className="text-[11px] text-br-text-muted leading-relaxed line-clamp-2">
                    {td.summary || "Analysis pending"}
                  </p>
                  <span className="text-[10px] text-alpine-violet mt-1.5 block opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                    View Details →
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* ── Risk Observations ─────────────────────────────────────────────── */}
      {riskObservations && riskObservations.length > 0 && (
        <div className="bg-br-card border border-br rounded-xl overflow-hidden">
          <div className="px-4 py-2.5 border-b border-br flex items-center justify-between">
            <h3 className="text-[10px] font-heading font-bold text-br-text-muted uppercase tracking-[0.16em] flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M8 2l6 10H2L8 2z" /><path d="M8 6.5v2.5M8 11h.01" /></svg>
              Risk Observations
            </h3>
            <span className="text-[10px] font-mono text-br-text-muted tabular-nums">
              <span className="text-red-400 font-semibold">{riskObservations.filter((r: any) => r.severity === "HIGH").length}</span> high
              &nbsp;·&nbsp;
              <span className="text-amber-400 font-semibold">{riskObservations.filter((r: any) => r.severity === "MEDIUM").length}</span> medium
            </span>
          </div>
          <div className="divide-y divide-br/50">
            {riskObservations.map((ro: any) => (
              <div key={ro.id} className="px-4 py-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[9px] font-mono text-br-text-muted tracking-wide">{ro.id}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-semibold uppercase tracking-[0.08em] ${
                    ro.severity === "HIGH"
                      ? "text-red-400 bg-red-500/10 border border-red-500/20"
                      : ro.severity === "MEDIUM"
                      ? "text-amber-400 bg-amber-500/10 border border-amber-500/20"
                      : "text-slate-400 bg-slate-400/10 border border-slate-400/20"
                  }`}>{ro.severity}</span>
                  <span className="text-[9px] text-br-text-muted uppercase tracking-[0.08em]">{ro.topic}</span>
                </div>
                <p className="text-[12px] font-semibold text-br-text-primary leading-snug">{ro.title}</p>
                <p className="text-[11px] text-br-text-muted mt-0.5 leading-relaxed">{ro.detail}</p>
                {ro.benchmark && (
                  <div className={`mt-2 px-3 py-2 rounded-lg bg-br-card border border-br ${ro.benchmark.is_outlier ? "border-l-[2px] border-l-alpine-violet" : "border-l-[2px] border-l-br-text-muted"}`}>
                    <div className="flex items-center gap-1.5 mb-1">
                      <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-alpine-violet-light"><circle cx="8" cy="8" r="6" /><path d="M8 5v3h3" /></svg>
                      <span className="text-[9px] font-mono font-bold uppercase tracking-[0.14em] text-alpine-violet-light">Portfolio Context</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[13px] font-mono font-bold text-br-text-primary tabular-nums">{ro.benchmark.portfolio_pct}%</span>
                      <span className="text-[10px] text-br-text-muted">{ro.benchmark.portfolio_label}</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[11px] font-mono text-br-text-muted tabular-nums">{ro.benchmark.industry_pct}%</span>
                      <span className="text-[10px] text-br-text-muted">{ro.benchmark.industry_label}</span>
                    </div>
                    {ro.benchmark.is_outlier && (
                      <div className="flex items-center gap-1 mt-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-alpine-violet-light" />
                        <span className="text-[9px] font-semibold text-alpine-violet-light">Ridgeline is an outlier in your portfolio</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Verification Summary ──────────────────────────────────────────── */}
      <div className="bg-br-card border border-br rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[10px] font-heading font-bold text-br-text-muted uppercase tracking-[0.16em] flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 2l5 3v4c0 3-2.5 4.5-5 5.5-2.5-1-5-2.5-5-5.5V5L8 2z" /><path d="M6 8l1.5 1.5L10 7" />
            </svg>
            Verification Status
          </h3>
          <button
            onClick={() => onNavigate("verification")}
            className="text-[10px] font-medium text-alpine-violet hover:text-alpine-violet-light transition-colors tracking-wide"
          >
            View Details →
          </button>
        </div>
        {verificationSummary ? (
          <div className="flex items-center gap-6">
            <div>
              <p className="text-[8px] text-br-text-muted uppercase tracking-[0.14em] mb-0.5">Total</p>
              <span className="text-[20px] font-heading font-bold tabular-nums tracking-tight text-br-text-primary">{verificationSummary.total || "—"}</span>
            </div>
            <div>
              <p className="text-[8px] text-br-text-muted uppercase tracking-[0.14em] mb-0.5">Verified</p>
              <span className="text-[20px] font-heading font-bold tabular-nums tracking-tight text-emerald-400">{verificationSummary.verified || verificationSummary.total_verified || "—"}</span>
            </div>
            <div>
              <p className="text-[8px] text-br-text-muted uppercase tracking-[0.14em] mb-0.5">Flagged</p>
              <span className="text-[20px] font-heading font-bold tabular-nums tracking-tight text-amber-400">{verificationSummary.flagged || verificationSummary.total_flagged || 0}</span>
            </div>
          </div>
        ) : brReviewId ? (
          <p className="text-[11px] text-br-text-muted">Loading verification data...</p>
        ) : (
          <p className="text-[11px] text-br-text-muted">No review linked — verification not started.</p>
        )}
      </div>
    </div>
  );
}
