"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { ReportRegistryEntry, ReportRating } from "@/lib/investor/report-registry";
import { INK, MUTED, SUBTLE, BORDER, BG_CARD, BG_ALT, GREEN, AMBER, VIOLET, GREEN_TEXT, AMBER_TEXT } from "@/lib/constants";

/* eslint-disable @typescript-eslint/no-explicit-any */

const RED = "#EF4444";
const RED_TEXT = "#B91C1C";

const RATING_COLOR: Record<string, string> = { GREEN, YELLOW: AMBER, RED };
const RATING_TEXT_COLOR: Record<string, string> = { GREEN: GREEN_TEXT, YELLOW: AMBER_TEXT, RED: RED_TEXT };

const RATING_LABEL: Record<ReportRating, string> = {
  GREEN: "Accept",
  YELLOW: "Watchlist",
  RED: "Flag",
};

const TOPIC_SHORT_CODES: Record<number, { key: string; label: string; short: string }> = {
  1: { key: "GOV",   label: "Manager, Ownership & Governance",                short: "Governance" },
  2: { key: "REG",   label: "Legal, Regulatory & Compliance",                 short: "Compliance" },
  3: { key: "TECH",  label: "Technology, Cybersecurity & Business Resilience", short: "Tech" },
  4: { key: "TERMS", label: "Fund Structure, Terms & Investor Alignment",     short: "Terms" },
  5: { key: "SVCP",  label: "Service Providers, Delegation & Oversight",      short: "Service Providers" },
  6: { key: "OPS",   label: "Investment Operations & Portfolio Controls",     short: "Operations" },
  7: { key: "VAL",   label: "Valuation, Asset Existence & Investor Reporting", short: "Valuation" },
  8: { key: "RPT",   label: "Manager Transparency & LP Communications",       short: "Reporting" },
};

const TOPIC_NUMS = [1, 2, 3, 4, 5, 6, 7, 8];

export interface EnrichedReport {
  entry: ReportRegistryEntry;
  aumMillions: number;
  aumDisplay: string | undefined;
  topicRatings: Record<number, "GREEN" | "YELLOW" | "RED">;
}

type ViewId = "portfolio-overview" | "active-reviews" | "fund-universe" | "peer-comparison" | "risk-heatmap";

interface NavItem {
  id: ViewId;
  label: string;
  section: "Portfolio" | "Analytics";
  icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: "portfolio-overview", label: "Portfolio Overview", section: "Portfolio",
    icon: <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="5" height="5" rx="1" /><rect x="9" y="2" width="5" height="5" rx="1" /><rect x="2" y="9" width="5" height="5" rx="1" /><rect x="9" y="9" width="5" height="5" rx="1" /></svg>,
  },
  {
    id: "active-reviews", label: "Active Reviews", section: "Portfolio",
    icon: <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 4h12M2 8h12M2 12h8" /></svg>,
  },
  {
    id: "fund-universe", label: "Fund Universe", section: "Portfolio",
    icon: <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="8" r="5.5" /><path d="M2.5 8h11M8 2.5c-2 2-2 9 0 11M8 2.5c2 2 2 9 0 11" /></svg>,
  },
  {
    id: "peer-comparison", label: "Peer Comparison", section: "Analytics",
    icon: <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 13V7M8 13V4M12 13V9" /></svg>,
  },
  {
    id: "risk-heatmap", label: "Risk Heatmap", section: "Analytics",
    icon: <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2l6 10H2L8 2z" /><path d="M8 6.5v2.5M8 11h.01" /></svg>,
  },
];

const VIEW_LABEL: Record<ViewId, string> = {
  "portfolio-overview": "Portfolio Overview",
  "active-reviews": "Active Reviews",
  "fund-universe": "Fund Universe",
  "peer-comparison": "Peer Comparison",
  "risk-heatmap": "Risk Heatmap",
};

// ── Helpers ────────────────────────────────────────────────────────────────

function formatAum(m: number): string {
  if (m <= 0) return "—";
  if (m >= 1000) return `$${(m / 1000).toFixed(1)}B`;
  return `$${Math.round(m)}M`;
}

function colorFromRating(r: string): string {
  return RATING_COLOR[r] ?? "#94A3B8";
}

// ── Score Donut ────────────────────────────────────────────────────────────

function ScoreDonut({ score, accept, watchlist, flag, size = 72 }: {
  score: number; accept: number; watchlist: number; flag: number; size?: number;
}) {
  const total = accept + watchlist + flag;
  const stroke = Math.max(4, Math.round(size * 0.10));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const scoreFontSize = Math.round(size * 0.42);
  const labelFontSize = Math.max(7, Math.round(size * 0.10));
  const segs = total > 0
    ? [
        { color: GREEN, frac: accept / total },
        { color: AMBER, frac: watchlist / total },
        { color: RED,   frac: flag / total },
      ]
    : [{ color: BORDER, frac: 1 }];
  let offset = 0;
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={BG_ALT} strokeWidth={stroke} />
        {segs.map((s, i) => {
          const dash = s.frac * c;
          const node = (
            <circle key={i} cx={size / 2} cy={size / 2} r={r} fill="none"
              stroke={s.color} strokeWidth={stroke}
              strokeDasharray={`${dash} ${c - dash}`} strokeDashoffset={-offset} strokeLinecap="butt" />
          );
          offset += dash;
          return node;
        })}
      </svg>
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
      }}>
        <span className="font-heading font-emphasis tabular-nums" style={{ fontSize: scoreFontSize, fontWeight: 800, color: INK, lineHeight: 1, letterSpacing: "-0.04em" }}>
          {score}
        </span>
        <span className="font-mono" style={{ fontSize: labelFontSize, color: MUTED, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", marginTop: Math.max(2, Math.round(size * 0.03)) }}>
          ODD
        </span>
      </div>
    </div>
  );
}

// ── Portfolio Stats (memoized for all views) ───────────────────────────────

function usePortfolioStats(reports: EnrichedReport[]) {
  return useMemo(() => {
    const fundCount = reports.length;
    const strategies = new Set(reports.map((r) => r.entry.strategy));
    const accept = reports.filter((r) => r.entry.rating === "GREEN").length;
    const watchlist = reports.filter((r) => r.entry.rating === "YELLOW").length;
    const flag = reports.filter((r) => r.entry.rating === "RED").length;
    const totalAumMillions = reports.reduce((sum, r) => sum + r.aumMillions, 0);
    const avgScore = fundCount > 0 ? Math.round(reports.reduce((s, r) => s + r.entry.oddScore, 0) / fundCount) : 0;

    const topicHealth = TOPIC_NUMS.map((n) => {
      const code = TOPIC_SHORT_CODES[n];
      const rated = reports.filter((r) => r.topicRatings[n]);
      const total = rated.length || 1;
      const green = rated.filter((r) => r.topicRatings[n] === "GREEN").length;
      const yellow = rated.filter((r) => r.topicRatings[n] === "YELLOW").length;
      const red = rated.filter((r) => r.topicRatings[n] === "RED").length;
      const pct = rated.length > 0 ? Math.round((green / total) * 100) : 0;
      return { topicNum: n, key: code.key, label: code.label, green, yellow, red, total: rated.length, pct };
    });

    return {
      fundCount, strategyCount: strategies.size,
      accept, watchlist, flag,
      totalAumMillions, avgScore, topicHealth,
    };
  }, [reports]);
}

// ── Reusable: fund row in table layout ─────────────────────────────────────

function FundTableRow({ r }: { r: EnrichedReport }) {
  const ratingColor = colorFromRating(r.entry.rating);
  const ratingText = RATING_TEXT_COLOR[r.entry.rating] ?? MUTED;
  return (
    <Link
      href={`/reports/${r.entry.slug}`}
      className="grid items-center transition-colors hover:bg-[--row-hover]"
      style={{
        gridTemplateColumns: "minmax(0, 1.6fr) minmax(0, 1.1fr) 90px 88px 1fr",
        padding: "14px 20px",
        borderBottom: `1px solid ${BORDER}`,
        // @ts-expect-error: CSS variable
        "--row-hover": BG_ALT,
      }}
    >
      <div className="min-w-0">
        <div className="font-heading font-emphasis text-[14px] truncate" style={{ color: INK }}>
          {r.entry.fundName}
        </div>
        <div className="font-body text-[12px] truncate" style={{ color: MUTED }}>
          {r.entry.manager}
        </div>
      </div>
      <div className="font-body text-[13px] truncate" style={{ color: MUTED }}>
        {r.entry.strategy}
      </div>
      <div className="font-mono tabular-nums text-[13px]" style={{ color: INK }}>
        {r.aumMillions > 0 ? formatAum(r.aumMillions) : "—"}
      </div>
      <div>
        <span
          className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded"
          style={{ background: `${ratingColor}1A`, color: ratingText }}
        >
          <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: ratingColor }} aria-hidden />
          {RATING_LABEL[r.entry.rating]}
        </span>
      </div>
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-1">
          {TOPIC_NUMS.map((n) => {
            const tr = r.topicRatings[n];
            const code = TOPIC_SHORT_CODES[n];
            const bg = tr ? `${colorFromRating(tr)}22` : BG_ALT;
            const txt = tr ? (RATING_TEXT_COLOR[tr] ?? MUTED) : SUBTLE;
            return (
              <span
                key={n}
                title={`${code.key} (${code.short}): ${tr ?? "Not rated"}`}
                className="inline-flex items-center justify-center font-mono tabular-nums"
                style={{ background: bg, color: txt, width: 18, height: 18, borderRadius: 3, fontSize: 10, fontWeight: 700, letterSpacing: "0.02em" }}
              >
                {tr ? tr.charAt(0) : "—"}
              </span>
            );
          })}
        </div>
        <span className="font-body text-[12px] font-emphasis shrink-0" style={{ color: VIOLET }}>
          Open →
        </span>
      </div>
    </Link>
  );
}

function FundMobileCard({ r }: { r: EnrichedReport }) {
  const ratingColor = colorFromRating(r.entry.rating);
  const ratingText = RATING_TEXT_COLOR[r.entry.rating] ?? MUTED;
  return (
    <Link
      href={`/reports/${r.entry.slug}`}
      className="block px-4 py-4"
      style={{ borderBottom: `1px solid ${BORDER}` }}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="min-w-0">
          <div className="font-heading font-emphasis text-[14px] leading-tight" style={{ color: INK }}>
            {r.entry.fundName}
          </div>
          <div className="font-body text-[12px] mt-0.5" style={{ color: MUTED }}>
            {r.entry.manager}
          </div>
        </div>
        <div
          className="shrink-0 flex flex-col items-center justify-center rounded-card px-2.5 py-1.5"
          style={{ background: `${ratingColor}1A`, border: `1px solid ${ratingColor}55` }}
        >
          <span className="font-heading font-emphasis text-base leading-none tabular-nums" style={{ color: ratingText }}>
            {r.entry.oddScore}
          </span>
          <span className="font-mono text-[9px] mt-0.5" style={{ color: SUBTLE }}>ODD</span>
        </div>
      </div>
      <div className="flex items-center gap-3 flex-wrap mb-2.5">
        <span className="font-body text-[12px]" style={{ color: MUTED }}>{r.entry.strategy}</span>
        {r.aumMillions > 0 && (
          <span className="font-mono tabular-nums text-[12px]" style={{ color: MUTED }}>· {formatAum(r.aumMillions)}</span>
        )}
      </div>
      <div className="flex items-center justify-between gap-3">
        <div className="flex gap-1">
          {TOPIC_NUMS.map((n) => {
            const tr = r.topicRatings[n];
            const code = TOPIC_SHORT_CODES[n];
            const bg = tr ? `${colorFromRating(tr)}22` : BG_ALT;
            const txt = tr ? (RATING_TEXT_COLOR[tr] ?? MUTED) : SUBTLE;
            return (
              <span
                key={n}
                title={`${code.key} (${code.short}): ${tr ?? "Not rated"}`}
                className="inline-flex items-center justify-center font-mono tabular-nums"
                style={{ background: bg, color: txt, width: 16, height: 16, borderRadius: 3, fontSize: 9, fontWeight: 700, letterSpacing: "0.02em" }}
              >
                {tr ? tr.charAt(0) : "—"}
              </span>
            );
          })}
        </div>
        <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded"
          style={{ background: `${ratingColor}1A`, color: ratingText }}>
          {RATING_LABEL[r.entry.rating]}
        </span>
      </div>
    </Link>
  );
}

function FundsTable({ reports }: { reports: EnrichedReport[] }) {
  return (
    <div className="rounded-panel overflow-hidden" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
      {/* Desktop / tablet table */}
      <div className="hidden md:block">
        <div className="grid items-center text-left" style={{
          gridTemplateColumns: "minmax(0, 1.6fr) minmax(0, 1.1fr) 90px 88px 1fr",
          padding: "10px 20px",
          background: BG_ALT,
          borderBottom: `1px solid ${BORDER}`,
        }}>
          {["Fund", "Strategy", "AUM", "Rating", "8-Topic Coverage"].map((h) => (
            <span key={h} className="font-mono text-[10px] uppercase" style={{ color: MUTED, fontWeight: 700, letterSpacing: "0.1em" }}>
              {h}
            </span>
          ))}
        </div>
        {reports.map((r) => <FundTableRow key={r.entry.slug} r={r} />)}
      </div>
      {/* Mobile cards */}
      <div className="md:hidden">
        {reports.map((r) => <FundMobileCard key={r.entry.slug} r={r} />)}
      </div>
      {/* Legend for the topic coverage chips */}
      <div
        className="flex items-center gap-x-4 gap-y-2 flex-wrap font-body text-[11px]"
        style={{ padding: "10px 20px", background: BG_ALT, color: SUBTLE, borderTop: `1px solid ${BORDER}` }}
      >
        <span className="font-mono uppercase shrink-0" style={{ fontSize: 10, color: MUTED, fontWeight: 700, letterSpacing: "0.1em" }}>
          Coverage
        </span>
        {[
          { letter: "G", label: "Accept", color: GREEN, text: GREEN_TEXT },
          { letter: "Y", label: "Watchlist", color: AMBER, text: AMBER_TEXT },
          { letter: "R", label: "Flag", color: RED, text: RED_TEXT },
          { letter: "—", label: "Not rated", color: BG_ALT, text: SUBTLE },
        ].map(({ letter, label, color, text }) => (
          <span key={label} className="inline-flex items-center gap-1.5 shrink-0">
            <span
              className="inline-flex items-center justify-center font-mono tabular-nums"
              style={{ background: letter === "—" ? BG_CARD : `${color}22`, color: text, width: 18, height: 18, borderRadius: 3, fontSize: 10, fontWeight: 700 }}
            >
              {letter}
            </span>
            {label}
          </span>
        ))}
        <span className="hidden md:inline-block shrink-0" style={{ width: 1, height: 14, background: BORDER, margin: "0 4px" }} aria-hidden />
        <span className="hidden md:inline-flex flex-wrap gap-x-3 gap-y-1" style={{ color: SUBTLE }}>
          {TOPIC_NUMS.map((n) => (
            <span key={n}>
              <span className="font-mono" style={{ color: MUTED, fontWeight: 700 }}>{TOPIC_SHORT_CODES[n].key}</span>
              {" "}{TOPIC_SHORT_CODES[n].short}
            </span>
          ))}
        </span>
      </div>
    </div>
  );
}

// ── View: Portfolio Overview ───────────────────────────────────────────────

function PortfolioOverviewView({ reports }: { reports: EnrichedReport[] }) {
  const stats = usePortfolioStats(reports);

  return (
    <div className="space-y-6">
      {/* Portfolio Monitor hero — rendered on page background, no card chrome */}
      <div style={{ padding: "4px 2px" }}>
        <div className="flex items-start justify-between gap-5 flex-wrap-reverse mb-5">
          <div className="min-w-0 flex-1">
            <p className="font-mono text-[10px] uppercase mb-2" style={{ color: MUTED, letterSpacing: "0.12em", fontWeight: 600 }}>
              Alpine ODD Platform · Portfolio Monitor
            </p>
            <h1 className="font-heading font-emphasis text-2xl sm:text-[28px]" style={{ color: INK, lineHeight: 1.1, letterSpacing: "-0.025em", marginBottom: 10 }}>
              {stats.fundCount} fund{stats.fundCount === 1 ? "" : "s"} · {stats.strategyCount} {stats.strategyCount === 1 ? "strategy" : "strategies"} · {formatAum(stats.totalAumMillions)} AUM
            </h1>
            <div className="flex items-center gap-4 flex-wrap">
              <span className="inline-flex items-center gap-2 font-mono text-[12px]" style={{ color: MUTED }}>
                <span className="inline-block w-2 h-2 rounded-full" style={{ background: GREEN }} />
                {stats.accept} Accept
              </span>
              <span className="inline-flex items-center gap-2 font-mono text-[12px]" style={{ color: MUTED }}>
                <span className="inline-block w-2 h-2 rounded-full" style={{ background: AMBER }} />
                {stats.watchlist} Watchlist
              </span>
              <span className="inline-flex items-center gap-2 font-mono text-[12px]" style={{ color: MUTED }}>
                <span className="inline-block w-2 h-2 rounded-full" style={{ background: RED }} />
                {stats.flag} Flag
              </span>
            </div>
          </div>
          <div className="shrink-0" title={`Portfolio score: ${stats.avgScore} · Average across ${stats.fundCount} report${stats.fundCount === 1 ? "" : "s"}`}>
            <ScoreDonut score={stats.avgScore} accept={stats.accept} watchlist={stats.watchlist} flag={stats.flag} size={72} />
          </div>
        </div>
        <div>
          <p className="font-mono text-[9px] uppercase mb-2" style={{ color: MUTED, letterSpacing: "0.12em", fontWeight: 600 }}>Portfolio Topic Health</p>
          <div className="flex gap-2 flex-wrap">
            {stats.topicHealth.map(({ key, label, pct }) => {
              const color = pct >= 80 ? GREEN : pct >= 55 ? AMBER : RED;
              const textColor = pct >= 80 ? GREEN_TEXT : pct >= 55 ? AMBER_TEXT : RED_TEXT;
              const short = TOPIC_SHORT_CODES[TOPIC_NUMS.find((n) => TOPIC_SHORT_CODES[n].key === key) ?? 1]?.short ?? "";
              return (
                <div key={key} title={`${label}: ${pct}% pass`} className="rounded-card"
                  style={{ background: `${color}0E`, padding: "6px 10px 5px", display: "flex", flexDirection: "column", alignItems: "center", gap: 1, minWidth: 64, borderBottom: `2px solid ${color}` }}>
                  <span className="font-mono" style={{ fontSize: 9, color: textColor, fontWeight: 700, letterSpacing: "0.04em" }}>{key}</span>
                  <span className="font-body" style={{ fontSize: 9, color: MUTED, lineHeight: 1.1 }}>{short}</span>
                  <span className="font-mono tabular-nums" style={{ fontSize: 11, color: textColor, fontWeight: 600, marginTop: 2 }}>{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <FundsTable reports={reports} />
    </div>
  );
}

// ── View: Active Reviews ───────────────────────────────────────────────────

function ActiveReviewsView({ reports }: { reports: EnrichedReport[] }) {
  return (
    <div className="space-y-4">
      <div className="rounded-panel" style={{ background: BG_CARD, border: `1px solid ${BORDER}`, padding: "20px" }}>
        <p className="font-mono text-[10px] uppercase mb-2" style={{ color: MUTED, letterSpacing: "0.12em", fontWeight: 600 }}>Status</p>
        <h2 className="font-heading font-emphasis text-xl" style={{ color: INK, marginBottom: 8 }}>
          {reports.length} finalized {reports.length === 1 ? "review" : "reviews"} ready to read
        </h2>
        <p className="font-body text-[13px]" style={{ color: MUTED, lineHeight: 1.6 }}>
          All operational due diligence reports in your portfolio are finalized and signed off by Alpine. When new reviews are commissioned by your Alpine analyst, they will appear here during preparation and move to your dashboard when complete.
        </p>
      </div>
      <FundsTable reports={reports} />
    </div>
  );
}

// ── View: Fund Universe ────────────────────────────────────────────────────

function FundUniverseView({ reports }: { reports: EnrichedReport[] }) {
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return reports;
    return reports.filter((r) =>
      r.entry.fundName.toLowerCase().includes(q) ||
      r.entry.manager.toLowerCase().includes(q) ||
      r.entry.strategy.toLowerCase().includes(q)
    );
  }, [reports, search]);

  return (
    <div className="space-y-4">
      <div className="rounded-card" style={{ background: BG_CARD, border: `1px solid ${BORDER}`, padding: "10px 14px", display: "flex", alignItems: "center", gap: 10 }}>
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke={MUTED} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="7" cy="7" r="4.5" /><path d="m11 11 3 3" /></svg>
        <input
          type="search"
          placeholder="Search funds, managers, strategies…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="font-body text-[14px] outline-none flex-1 bg-transparent"
          style={{ color: INK }}
          aria-label="Search funds"
        />
        <span className="font-mono text-[11px] shrink-0" style={{ color: MUTED }}>
          {filtered.length} fund{filtered.length === 1 ? "" : "s"}
        </span>
      </div>
      {filtered.length > 0 ? (
        <FundsTable reports={filtered} />
      ) : (
        <div className="rounded-panel p-8 text-center" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
          <p className="font-body text-sm" style={{ color: MUTED }}>No funds match your search.</p>
        </div>
      )}
    </div>
  );
}

// ── View: Peer Comparison ──────────────────────────────────────────────────

function PeerComparisonView({ reports }: { reports: EnrichedReport[] }) {
  const stats = usePortfolioStats(reports);
  const sorted = [...stats.topicHealth].sort((a, b) => a.pct - b.pct);

  return (
    <div className="rounded-panel" style={{ background: BG_CARD, border: `1px solid ${BORDER}`, padding: "24px" }}>
      <h2 className="font-heading font-emphasis text-base mb-1" style={{ color: INK }}>
        Topic-level comparison across your portfolio
      </h2>
      <p className="font-body text-[13px] mb-6" style={{ color: MUTED, lineHeight: 1.55 }}>
        How each ODD chapter rates across your {stats.fundCount} fund{stats.fundCount === 1 ? "" : "s"}. Chapters with the highest concentration of YELLOW or RED ratings appear at the top.
      </p>

      <div className="space-y-3">
        {sorted.map((t) => {
          const greenPct = (t.green / Math.max(t.total, 1)) * 100;
          const yellowPct = (t.yellow / Math.max(t.total, 1)) * 100;
          const redPct = (t.red / Math.max(t.total, 1)) * 100;
          const overallColor = t.pct >= 80 ? GREEN_TEXT : t.pct >= 55 ? AMBER_TEXT : RED_TEXT;
          return (
            <div key={t.key} className="grid items-center gap-3" style={{ gridTemplateColumns: "60px minmax(0, 1fr) 50px" }}>
              <div className="font-mono text-[11px] uppercase" style={{ color: MUTED, fontWeight: 700, letterSpacing: "0.1em" }} title={t.label}>
                {t.key}
              </div>
              <div className="flex items-center gap-2 min-w-0">
                <div className="flex-1 h-2.5 rounded-full overflow-hidden" style={{ background: BG_ALT }}>
                  <div className="h-full flex">
                    <div style={{ width: `${greenPct}%`, background: GREEN, transition: "width 0.3s" }} />
                    <div style={{ width: `${yellowPct}%`, background: AMBER, transition: "width 0.3s" }} />
                    <div style={{ width: `${redPct}%`, background: RED, transition: "width 0.3s" }} />
                  </div>
                </div>
                <span className="hidden md:inline font-body text-[11px] truncate shrink-0" style={{ color: SUBTLE, maxWidth: 220 }}>{t.label}</span>
              </div>
              <div className="font-mono tabular-nums text-right" style={{ color: overallColor, fontSize: 12, fontWeight: 700 }}>
                {t.pct}%
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 flex items-center gap-4 flex-wrap" style={{ borderTop: `1px solid ${BORDER}` }}>
        <span className="font-mono text-[10px] uppercase" style={{ color: MUTED, letterSpacing: "0.1em", fontWeight: 700 }}>Legend</span>
        {[
          { label: "Accept", color: GREEN, text: GREEN_TEXT },
          { label: "Watchlist", color: AMBER, text: AMBER_TEXT },
          { label: "Flag", color: RED, text: RED_TEXT },
        ].map(({ label, color, text }) => (
          <span key={label} className="inline-flex items-center gap-1.5 font-body text-[11px]" style={{ color: text }}>
            <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ background: color }} />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── View: Risk Heatmap ─────────────────────────────────────────────────────

function RiskHeatmapView({ reports }: { reports: EnrichedReport[] }) {
  return (
    <div className="rounded-panel" style={{ background: BG_CARD, border: `1px solid ${BORDER}`, padding: "20px" }}>
      <h2 className="font-heading font-emphasis text-base mb-1" style={{ color: INK }}>
        Risk heatmap by fund × topic
      </h2>
      <p className="font-body text-[13px] mb-5" style={{ color: MUTED, lineHeight: 1.55 }}>
        At-a-glance view of where risk concentrates across your portfolio. Click any fund to read the full report.
      </p>

      <div className="overflow-x-auto -mx-2 px-2">
        <table className="w-full font-body" style={{ borderCollapse: "collapse", minWidth: 720 }}>
          <thead>
            <tr style={{ background: BG_ALT }}>
              <th className="text-left font-mono" style={{ padding: "10px 14px", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: MUTED, borderBottom: `1px solid ${BORDER}`, whiteSpace: "nowrap" }}>
                Fund
              </th>
              {TOPIC_NUMS.map((n) => (
                <th key={n} title={TOPIC_SHORT_CODES[n].label}
                  className="text-center font-mono"
                  style={{ padding: "8px 6px", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: MUTED, borderBottom: `1px solid ${BORDER}`, minWidth: 48 }}>
                  {TOPIC_SHORT_CODES[n].key}
                </th>
              ))}
              <th className="text-center font-mono" style={{ padding: "8px 12px", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: MUTED, borderBottom: `1px solid ${BORDER}`, whiteSpace: "nowrap" }}>
                Overall
              </th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r) => (
              <tr key={r.entry.slug} className="transition-colors hover:bg-[--row-hover]"
                style={{
                  // @ts-expect-error: CSS variable
                  "--row-hover": BG_ALT,
                }}
              >
                <td style={{ padding: "10px 14px", borderBottom: `1px solid ${BORDER}`, whiteSpace: "nowrap" }}>
                  <Link href={`/reports/${r.entry.slug}`} className="block">
                    <div className="font-heading font-emphasis text-[13px]" style={{ color: INK }}>{r.entry.fundName}</div>
                    <div className="font-body text-[11px]" style={{ color: MUTED }}>{r.entry.manager}</div>
                  </Link>
                </td>
                {TOPIC_NUMS.map((n) => {
                  const tr = r.topicRatings[n];
                  const bg = tr ? `${colorFromRating(tr)}24` : BG_ALT;
                  const txt = tr ? (RATING_TEXT_COLOR[tr] ?? MUTED) : SUBTLE;
                  return (
                    <td key={n} title={`${TOPIC_SHORT_CODES[n].label}: ${tr ?? "—"}`}
                      style={{ padding: "8px 6px", textAlign: "center", borderBottom: `1px solid ${BORDER}` }}>
                      <div style={{ width: 32, height: 22, borderRadius: 4, background: bg, color: txt, fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto", letterSpacing: "0.04em" }}>
                        {tr ? tr.charAt(0) : "—"}
                      </div>
                    </td>
                  );
                })}
                <td style={{ padding: "8px 12px", textAlign: "center", borderBottom: `1px solid ${BORDER}` }}>
                  <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded"
                    style={{ background: `${colorFromRating(r.entry.rating)}1A`, color: RATING_TEXT_COLOR[r.entry.rating] ?? MUTED }}>
                    <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: colorFromRating(r.entry.rating) }} />
                    {RATING_LABEL[r.entry.rating]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 pt-3 flex items-center gap-3 flex-wrap" style={{ borderTop: `1px solid ${BORDER}` }}>
        <span className="font-mono text-[10px] uppercase" style={{ color: MUTED, letterSpacing: "0.1em", fontWeight: 700 }}>Legend</span>
        {[
          { letter: "G", label: "Accept", color: GREEN, text: GREEN_TEXT },
          { letter: "Y", label: "Watchlist", color: AMBER, text: AMBER_TEXT },
          { letter: "R", label: "Flag", color: RED, text: RED_TEXT },
        ].map(({ letter, label, color, text }) => (
          <span key={label} className="inline-flex items-center gap-1.5 font-body text-[11px]" style={{ color: text }}>
            <span style={{ width: 20, height: 16, borderRadius: 3, background: `${color}24`, color: text, fontSize: 9, fontWeight: 700, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
              {letter}
            </span>
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Sidebar ────────────────────────────────────────────────────────────────

function Sidebar({
  active, onChange, greetingName, greetingEmail, onSignOut, collapsed, onToggleCollapsed,
}: {
  active: ViewId;
  onChange: (id: ViewId) => void;
  greetingName: string | null;
  greetingEmail: string;
  onSignOut: () => void;
  collapsed: boolean;
  onToggleCollapsed: () => void;
}) {
  const portfolioItems = NAV_ITEMS.filter((n) => n.section === "Portfolio");
  const analyticsItems = NAV_ITEMS.filter((n) => n.section === "Analytics");
  const displayName = greetingName ?? greetingEmail;
  const initials = displayName
    .split(/[\s@.]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? "")
    .join("") || "?";

  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Close profile menu on outside click
  useEffect(() => {
    if (!profileMenuOpen) return;
    function onClick(e: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [profileMenuOpen]);

  return (
    <aside
      className="flex flex-col rounded-panel sticky top-6 self-start transition-[width] duration-200"
      style={{
        background: BG_CARD,
        border: `1px solid ${BORDER}`,
        width: collapsed ? 64 : 260,
        maxHeight: "calc(100vh - 48px)",
        overflow: "visible",
      }}
    >
      {/* Brand */}
      <div
        className="flex items-center gap-2.5"
        style={{ borderBottom: `1px solid ${BORDER}`, padding: collapsed ? "14px 12px" : "16px 14px", justifyContent: collapsed ? "center" : "flex-start" }}
      >
        <div
          className="rounded-card flex items-center justify-center shrink-0"
          style={{ width: 32, height: 32, background: VIOLET, color: "#fff" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M3 20 L12 4 L21 20" />
          </svg>
        </div>
        {!collapsed && (
          <>
            <div className="min-w-0 flex-1">
              <div className="font-heading font-emphasis text-[14px] leading-tight" style={{ color: INK }}>Alpine ODD</div>
              <div className="font-body text-[11px]" style={{ color: SUBTLE }}>Powered by Alpine</div>
            </div>
            <button
              type="button"
              onClick={onToggleCollapsed}
              className="rounded-btn p-1 transition-opacity hover:opacity-60"
              style={{ color: MUTED }}
              aria-label="Collapse sidebar"
              title="Collapse sidebar"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 4L6 8l4 4" />
              </svg>
            </button>
          </>
        )}
      </div>

      {collapsed && (
        <button
          type="button"
          onClick={onToggleCollapsed}
          className="mx-auto my-2 rounded-btn p-1.5 transition-opacity hover:opacity-60"
          style={{ color: MUTED, border: `1px solid ${BORDER}` }}
          aria-label="Expand sidebar"
          title="Expand sidebar"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 4l4 4-4 4" />
          </svg>
        </button>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3">
        {[{ section: "Portfolio", items: portfolioItems }, { section: "Analytics", items: analyticsItems }].map(({ section, items }) => (
          <div key={section} className="mb-2">
            {!collapsed && (
              <div className="px-4 py-1.5 font-mono text-[10px] uppercase" style={{ color: SUBTLE, letterSpacing: "0.14em", fontWeight: 700 }}>
                {section}
              </div>
            )}
            {items.map((item) => {
              const isActive = item.id === active;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onChange(item.id)}
                  title={collapsed ? item.label : undefined}
                  className="w-full text-left flex items-center gap-2.5 py-2 transition-colors"
                  style={{
                    background: isActive ? `${VIOLET}12` : "transparent",
                    color: isActive ? VIOLET : MUTED,
                    fontWeight: isActive ? 600 : 500,
                    borderLeft: isActive ? `2px solid ${VIOLET}` : "2px solid transparent",
                    padding: collapsed ? "8px 0" : "8px 16px",
                    justifyContent: collapsed ? "center" : "flex-start",
                  }}
                  aria-current={isActive ? "page" : undefined}
                  aria-label={collapsed ? item.label : undefined}
                >
                  <span className="shrink-0">{item.icon}</span>
                  {!collapsed && <span className="font-body text-[13.5px]">{item.label}</span>}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User */}
      <div ref={profileMenuRef} className="relative" style={{ borderTop: `1px solid ${BORDER}`, padding: collapsed ? "12px 8px" : "12px" }}>
        <div className="flex items-center gap-2.5" style={{ justifyContent: collapsed ? "center" : "flex-start" }}>
          <button
            type="button"
            onClick={() => setProfileMenuOpen((o) => !o)}
            className="rounded-full flex items-center justify-center shrink-0 font-heading font-emphasis transition-opacity hover:opacity-80"
            style={{ width: 32, height: 32, background: `linear-gradient(135deg, ${VIOLET} 0%, ${AMBER} 100%)`, color: "#fff", fontSize: 12 }}
            title={collapsed ? `${greetingName ?? "Investor"} — open menu` : undefined}
            aria-label="Open profile menu"
            aria-expanded={profileMenuOpen}
          >
            {initials}
          </button>
          {!collapsed && (
            <>
              <div className="min-w-0 flex-1">
                <div className="font-heading font-emphasis text-[13px] truncate" style={{ color: INK }}>
                  {greetingName ?? "Investor"}
                </div>
                <div className="font-body text-[11px] truncate" style={{ color: SUBTLE }}>
                  Profile settings
                </div>
              </div>
              <button
                type="button"
                onClick={() => setProfileMenuOpen((o) => !o)}
                className="rounded-btn p-1.5 transition-colors hover:bg-gray-100 shrink-0"
                style={{ color: MUTED }}
                aria-label="Open profile menu"
                aria-expanded={profileMenuOpen}
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                  <circle cx="3" cy="8" r="1.4" />
                  <circle cx="8" cy="8" r="1.4" />
                  <circle cx="13" cy="8" r="1.4" />
                </svg>
              </button>
            </>
          )}
        </div>
        {profileMenuOpen && (
          <div
            className="absolute bottom-full right-3 mb-2 rounded-card overflow-hidden z-10"
            style={{
              background: BG_CARD,
              border: `1px solid ${BORDER}`,
              boxShadow: "0 8px 24px rgba(15,15,16,0.12)",
              minWidth: 180,
            }}
            role="menu"
          >
            <div className="px-3 py-2.5" style={{ borderBottom: `1px solid ${BORDER}` }}>
              <div className="font-body text-[12px] truncate" style={{ color: SUBTLE }}>{greetingEmail}</div>
            </div>
            <button
              type="button"
              onClick={() => { setProfileMenuOpen(false); onSignOut(); }}
              className="w-full text-left px-3 py-2.5 font-body text-[13px] transition-colors hover:bg-gray-50"
              style={{ color: INK }}
              role="menuitem"
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}

// ── Mobile view picker (replaces sidebar < md) ────────────────────────────

function MobileViewPicker({
  active, onChange, greetingName, greetingEmail, onSignOut, signingOut,
}: {
  active: ViewId;
  onChange: (id: ViewId) => void;
  greetingName: string | null;
  greetingEmail: string;
  onSignOut: () => void;
  signingOut: boolean;
}) {
  return (
    <div className="md:hidden space-y-3 mb-4">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="font-heading font-emphasis text-[16px] truncate" style={{ color: INK }}>
            {greetingName ?? "Investor"}
          </div>
          <div className="font-body text-[11px] truncate" style={{ color: SUBTLE }}>{greetingEmail}</div>
        </div>
        <button
          type="button"
          onClick={onSignOut}
          disabled={signingOut}
          className="font-mono text-[10px] uppercase px-2.5 py-1.5 rounded-btn transition-opacity hover:opacity-70 disabled:opacity-50 shrink-0"
          style={{ color: MUTED, border: `1px solid ${BORDER}`, letterSpacing: "0.08em" }}
        >
          {signingOut ? "Signing out…" : "Sign out"}
        </button>
      </div>
      <select
        value={active}
        onChange={(e) => onChange(e.target.value as ViewId)}
        className="w-full rounded-card px-3 py-2.5 font-body text-sm min-h-[44px]"
        style={{ border: `1px solid ${BORDER}`, background: BG_CARD, color: INK }}
        aria-label="Select view"
      >
        {NAV_ITEMS.map((item) => (
          <option key={item.id} value={item.id}>{item.section} · {item.label}</option>
        ))}
      </select>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────

export default function InvestorPortfolioOverview({
  reports,
  greetingName,
  greetingEmail,
}: {
  reports: EnrichedReport[];
  greetingName: string | null;
  greetingEmail: string;
}) {
  const router = useRouter();
  const [view, setView] = useState<ViewId>("portfolio-overview");
  const [signingOut, setSigningOut] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  async function handleSignOut() {
    if (signingOut) return;
    setSigningOut(true);
    try {
      await fetch("/api/investor/auth/logout", { method: "POST" });
    } catch {
      // best-effort
    }
    router.push("/login");
  }

  const stats = usePortfolioStats(reports);

  let content: React.ReactNode = null;
  if (view === "portfolio-overview") content = <PortfolioOverviewView reports={reports} />;
  else if (view === "active-reviews") content = <ActiveReviewsView reports={reports} />;
  else if (view === "fund-universe") content = <FundUniverseView reports={reports} />;
  else if (view === "peer-comparison") content = <PeerComparisonView reports={reports} />;
  else if (view === "risk-heatmap") content = <RiskHeatmapView reports={reports} />;

  const viewSubtitle = (() => {
    const fundsLabel = `${stats.fundCount} monitored ${stats.fundCount === 1 ? "fund" : "funds"}`;
    const strategiesLabel = `${stats.strategyCount} ${stats.strategyCount === 1 ? "strategy" : "strategies"}`;
    switch (view) {
      case "portfolio-overview": return `${fundsLabel} across ${strategiesLabel}`;
      case "active-reviews":     return `${stats.fundCount} finalized review${stats.fundCount === 1 ? "" : "s"} ready to read`;
      case "fund-universe":      return `${fundsLabel} across ${strategiesLabel}`;
      case "peer-comparison":    return "How each chapter rates across your portfolio";
      case "risk-heatmap":       return "Concentration of risk by fund × topic";
    }
  })();

  return (
    <main id="main-content" className="flex-1 w-full" style={{ background: BG_ALT }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-8">

        {/* Mobile picker */}
        <MobileViewPicker
          active={view}
          onChange={setView}
          greetingName={greetingName}
          greetingEmail={greetingEmail}
          onSignOut={handleSignOut}
          signingOut={signingOut}
        />

        {/* Desktop layout: sidebar + content */}
        <div
          className="md:grid md:gap-6 transition-[grid-template-columns] duration-200"
          style={{ gridTemplateColumns: sidebarCollapsed ? "64px minmax(0, 1fr)" : "260px minmax(0, 1fr)" }}
        >
          <div className="hidden md:block">
            <Sidebar
              active={view}
              onChange={setView}
              greetingName={greetingName}
              greetingEmail={greetingEmail}
              onSignOut={handleSignOut}
              collapsed={sidebarCollapsed}
              onToggleCollapsed={() => setSidebarCollapsed((c) => !c)}
            />
          </div>
          <div className="min-w-0">
            {/* View title — skip on Portfolio Overview (its hero card already shows the title) */}
            {view !== "portfolio-overview" && (
              <div className="mb-5">
                <h1 className="font-heading font-emphasis text-2xl sm:text-[28px]" style={{ color: INK, lineHeight: 1.1, letterSpacing: "-0.025em" }}>
                  {VIEW_LABEL[view]}
                </h1>
                <p className="font-body text-[13px] mt-1.5" style={{ color: MUTED }}>
                  {viewSubtitle}
                </p>
              </div>
            )}
            {content}
          </div>
        </div>
      </div>
    </main>
  );
}
