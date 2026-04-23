"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { formatCurrency, relativeTime } from "@/lib/demo-utils";
import { alpineDemoBrand } from "@/lib/demo-brands/alpine-demo";

/* eslint-disable @typescript-eslint/no-explicit-any */

// ── Constants ──────────────────────────────────────────────────────────────────

const TOPIC_KEYS = ["GOV", "REG", "TERMS", "SVCP", "INV", "TRADE", "VAL", "TECH", "FIN", "ASSET", "LEGAL", "RPT"] as const;
const TOPIC_LABELS: Record<string, string> = {
  GOV: "Governance", TERMS: "Terms & Structure", REG: "Regulatory",
  SVCP: "Service Providers", INV: "Investment Process", TRADE: "Trading & Execution",
  VAL: "Valuation", TECH: "Technology & Ops", FIN: "Financial Controls",
  ASSET: "Asset Verification", LEGAL: "Legal & Insurance", RPT: "Reporting",
};
const STRATEGY_LABELS: Record<string, string> = {
  equity_hedge: "Equity Hedge",
  credit: "Credit & FI",
  macro: "Global Macro",
  private_equity: "Private Equity",
  real_assets: "Real Assets",
};

// ── Nav Items ──────────────────────────────────────────────────────────────────

interface NavItem { id: string; label: string; icon: React.ReactNode; section: string; }

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

// ── Helpers ────────────────────────────────────────────────────────────────────

function ratingLabel(r: string) {
  const u = (r || "").toUpperCase();
  if (u === "ACCEPT" || u === "GREEN") return "Accept";
  if (u === "WATCHLIST" || u === "YELLOW") return "Watchlist";
  if (u === "FLAG" || u === "RED") return "Flag";
  return r || "—";
}

function ratingStyle(r: string): React.CSSProperties {
  const u = (r || "").toUpperCase();
  if (u === "ACCEPT" || u === "GREEN")
    return { color: "#91f0c7", background: "rgba(24,185,126,0.12)", border: "1px solid rgba(24,185,126,0.2)" };
  if (u === "WATCHLIST" || u === "YELLOW")
    return { color: "#fbbf24", background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.2)" };
  if (u === "FLAG" || u === "RED")
    return { color: "#f87171", background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.2)" };
  return { color: "#98a7bb", background: "rgba(148,163,184,0.08)", border: "1px solid rgba(148,163,184,0.14)" };
}

function topicDot(r: string): string {
  const u = (r || "GREEN").toUpperCase();
  if (u === "GREEN") return "#18b97e";
  if (u === "YELLOW") return "#f59e0b";
  if (u === "RED") return "#ef4444";
  return "#18b97e";
}

function canOpenFundReview(slug?: string): boolean {
  return slug === "ridgeline-capital" || slug === "trellis-capital-iv";
}

// ── Rating Ring SVG ─────────────────────────────────────────────────────────

function RatingRing({ green, yellow, red, size = 112 }: { green: number; yellow: number; red: number; size?: number }) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 120);
    return () => clearTimeout(timer);
  }, []);

  const total = green + yellow + red || 1;
  const cx = size / 2, cy = size / 2;
  const stroke = Math.max(8, Math.round(size * 0.07));
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const gPct = green / total, yPct = yellow / total, rPct = red / total;
  const gDash = gPct * circ, yDash = yPct * circ, rDash = rPct * circ;
  const gOffset = 0, yOffset = -(gPct * circ), rOffset = -((gPct + yPct) * circ);
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(148,163,184,0.08)" strokeWidth={stroke} />
      {green > 0 && <circle cx={cx} cy={cy} r={r} fill="none" stroke="#18b97e" strokeWidth={stroke} strokeDasharray={animated ? `${gDash} ${circ - gDash}` : `0 ${circ}`} strokeDashoffset={gOffset} strokeLinecap="butt" style={{ transition: "stroke-dasharray 0.85s ease-out 0.05s" }} />}
      {yellow > 0 && <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f59e0b" strokeWidth={stroke} strokeDasharray={animated ? `${yDash} ${circ - yDash}` : `0 ${circ}`} strokeDashoffset={yOffset} strokeLinecap="butt" style={{ transition: "stroke-dasharray 0.85s ease-out 0.16s" }} />}
      {red > 0 && <circle cx={cx} cy={cy} r={r} fill="none" stroke="#ef4444" strokeWidth={stroke} strokeDasharray={animated ? `${rDash} ${circ - rDash}` : `0 ${circ}`} strokeDashoffset={rOffset} strokeLinecap="butt" style={{ transition: "stroke-dasharray 0.85s ease-out 0.27s" }} />}
    </svg>
  );
}

// ── Sidebar ────────────────────────────────────────────────────────────────────

function Sidebar({
  activeTab, onNavigate, collapsed, onToggle,
}: {
  activeTab: string;
  onNavigate: (id: string) => void;
  collapsed: boolean;
  onToggle: () => void;
}) {
  const sections = ["Portfolio", "Analytics"];
  return (
    <aside
      style={{
        width: collapsed ? 56 : 220,
        minHeight: "100vh",
        background: "var(--br-bg-sidebar, #08111e)",
        borderRight: "1px solid var(--br-border, rgba(148,163,184,0.14))",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        transition: "width 0.2s",
        position: "sticky",
        top: 0,
        alignSelf: "flex-start",
        height: "100vh",
      }}
    >
      {/* Logo / header */}
      <div
        style={{
          padding: collapsed ? "16px 0" : "14px 16px",
          borderBottom: "1px solid var(--br-border, rgba(148,163,184,0.14))",
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          gap: 8,
        }}
      >
        {!collapsed && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
            <div
              style={{
                width: 26, height: 26, borderRadius: 6, flexShrink: 0,
                background: "linear-gradient(135deg, #10B981 0%, #F59E0B 50%, #7B2CBF 100%)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#F5F0E8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 18L12 6L20 18" />
              </svg>
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--br-text-primary, #eff4fb)", lineHeight: 1.2, fontFamily: "var(--font-heading, sans-serif)" }}>Alpine ODD</div>
              <div style={{ fontSize: 10, color: "var(--br-text-muted, #6b7c95)", lineHeight: 1.3 }}>Powered by Alpine</div>
            </div>
          </div>
        )}
        {collapsed && (
          <div
            style={{
              width: 28, height: 28, borderRadius: 6,
              background: "linear-gradient(135deg, #10B981 0%, #F59E0B 50%, #7B2CBF 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#F5F0E8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 18L12 6L20 18" />
            </svg>
          </div>
        )}
        <button
          onClick={onToggle}
          style={{
            width: 26, height: 26, borderRadius: 6,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "transparent", border: "none", cursor: "pointer",
            color: "var(--br-text-muted, #6b7c95)",
          }}
          title={collapsed ? "Expand" : "Collapse"}
        >
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            {collapsed ? <path d="M5 3l4 4-4 4" /> : <path d="M9 3l-4 4 4 4" />}
          </svg>
        </button>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "12px 8px", display: "flex", flexDirection: "column", gap: 16, overflowY: "auto" }}>
        {sections.map((section) => {
          const items = NAV_ITEMS.filter((n) => n.section === section);
          return (
            <div key={section}>
              {!collapsed && (
                <div style={{
                  fontSize: 10, fontWeight: 600, letterSpacing: "0.16em",
                  textTransform: "uppercase", color: "var(--br-text-muted, #6b7c95)",
                  padding: "0 8px 4px", marginBottom: 2,
                }}>
                  {section}
                </div>
              )}
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {items.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onNavigate(item.id)}
                      title={collapsed ? item.label : undefined}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 9,
                        padding: collapsed ? "11px 0" : "9px 10px",
                        justifyContent: collapsed ? "center" : "flex-start",
                        borderRadius: 8,
                        border: "none",
                        cursor: "pointer",
                        fontSize: 13,
                        fontWeight: isActive ? 600 : 400,
                        transition: "background 0.15s, color 0.15s",
                        background: isActive ? "rgba(239,244,251,0.07)" : "transparent",
                        color: isActive
                          ? "var(--br-text-primary, #eff4fb)"
                          : "var(--br-text-secondary, #98a7bb)",
                        width: "100%",
                        textAlign: "left",
                      }}
                    >
                      <span style={{ flexShrink: 0, opacity: isActive ? 1 : 0.7 }}>{item.icon}</span>
                      {!collapsed && <span style={{ overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{item.label}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

// ── Fund Universe Table ────────────────────────────────────────────────────────

function FundUniverseTable({ funds, onNavigate }: { funds: any[]; onNavigate: (slug: string) => void }) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<string>("name");
  const [sortDir, setSortDir] = useState<1 | -1>(1);

  const filtered = funds.filter((f) =>
    !search || f.name?.toLowerCase().includes(search.toLowerCase()) ||
    f.manager_name?.toLowerCase().includes(search.toLowerCase()) ||
    f.strategy?.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    let va = a[sortKey], vb = b[sortKey];
    if (sortKey === "aum") { va = parseFloat(String(va).replace(/[^0-9.]/g, "")) || 0; vb = parseFloat(String(vb).replace(/[^0-9.]/g, "")) || 0; }
    if (sortKey === "annual_return") { va = parseFloat(String(va)) || 0; vb = parseFloat(String(vb)) || 0; }
    if (typeof va === "string") va = va.toLowerCase();
    if (typeof vb === "string") vb = vb.toLowerCase();
    return va < vb ? -sortDir : va > vb ? sortDir : 0;
  });

  function toggle(key: string) {
    if (sortKey === key) setSortDir((d) => (d === 1 ? -1 : 1));
    else { setSortKey(key); setSortDir(1); }
  }

  const ColHead = ({ k, label }: { k: string; label: string }) => (
    <th
      onClick={() => toggle(k)}
      style={{
        padding: "9px 12px", fontSize: 11, fontWeight: 600,
        letterSpacing: "0.18em", textTransform: "uppercase",
        color: sortKey === k ? "var(--br-text-primary, #eff4fb)" : "var(--br-text-muted, #6b7c95)",
        textAlign: "left", cursor: "pointer", whiteSpace: "nowrap",
        background: "transparent", borderBottom: "1px solid var(--br-border, rgba(148,163,184,0.14))",
        userSelect: "none",
      }}
    >
      {label} {sortKey === k ? (sortDir === 1 ? " ↑" : " ↓") : ""}
    </th>
  );

  return (
    <div>
      {/* Search */}
      <div style={{ display: "flex", gap: 10, marginBottom: 14, alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1, maxWidth: 320 }}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="var(--br-text-muted, #6b7c95)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
            style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }}>
            <circle cx="6.5" cy="6.5" r="4" /><path d="M14 14l-3.5-3.5" />
          </svg>
          <input
            type="text"
            placeholder="Search funds..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%", padding: "7px 10px 7px 32px",
              background: "var(--br-bg-card, #102038)",
              border: "1px solid var(--br-border, rgba(148,163,184,0.14))",
              borderRadius: 8, fontSize: 13,
              color: "var(--br-text-primary, #eff4fb)",
              outline: "none",
            }}
          />
        </div>
        <div style={{ fontSize: 12, color: "var(--br-text-muted, #6b7c95)" }}>
          {filtered.length} funds
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto", borderRadius: 12, border: "1px solid var(--br-border, rgba(148,163,184,0.14))" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "var(--br-bg-surface, #0d1727)" }}>
              <ColHead k="name" label="Fund Name" />
              <ColHead k="strategy" label="Strategy" />
              <ColHead k="aum" label="AUM" />
              <ColHead k="annual_return" label="1Y Return" />
              <ColHead k="rating" label="Rating" />
              <th style={{ padding: "9px 12px", fontSize: 11, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--br-text-muted, #6b7c95)", textAlign: "left", background: "transparent", borderBottom: "1px solid var(--br-border, rgba(148,163,184,0.14))" }}>12-Topic Coverage</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((fund, idx) => {
              const isLast = idx === sorted.length - 1;
              const rowBorder = isLast ? "none" : "1px solid var(--br-border, rgba(148,163,184,0.07))";
              const isClickable = canOpenFundReview(fund.slug);
              const aumStr = typeof fund.aum === "number" ? formatCurrency(fund.aum) : (fund.aum || "—");
              const retStr = typeof fund.annual_return === "number"
                ? `${fund.annual_return > 0 ? "+" : ""}${fund.annual_return.toFixed(1)}%`
                : (fund.annual_return || "—");
              const retColor = typeof fund.annual_return === "number"
                ? fund.annual_return > 0 ? "#18b97e" : "#ef4444"
                : "var(--br-text-secondary)";
              return (
                <tr
                  key={fund.slug || idx}
                  onClick={() => isClickable && fund.slug && onNavigate(fund.slug)}
                  style={{
                    background: "transparent",
                    cursor: isClickable ? "pointer" : "default",
                    transition: "background 0.12s",
                  }}
                  onMouseEnter={(e) => { if (isClickable) e.currentTarget.style.background = "var(--br-bg-card-hover, #162742)"; }}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <td style={{ padding: "12px 12px", borderBottom: rowBorder }}>
                    <div style={{ fontWeight: 600, color: "var(--br-text-primary, #eff4fb)", fontSize: 13.5, letterSpacing: "-0.01em" }}>{fund.name || "—"}</div>
                    {fund.manager_name && (
                      <div style={{ fontSize: 11.5, color: "var(--br-text-muted, #6b7c95)", marginTop: 2 }}>{fund.manager_name}</div>
                    )}
                  </td>
                  <td style={{ padding: "12px 12px", borderBottom: rowBorder, color: "var(--br-text-secondary, #98a7bb)", whiteSpace: "nowrap", fontSize: 13.5 }}>
                    {STRATEGY_LABELS[fund.strategy] || fund.strategy || "—"}
                  </td>
                  <td style={{ padding: "12px 12px", borderBottom: rowBorder, color: "var(--br-text-secondary, #98a7bb)", fontFamily: "var(--font-mono, monospace)", whiteSpace: "nowrap", fontSize: 13.5 }}>
                    {aumStr}
                  </td>
                  <td style={{ padding: "12px 12px", borderBottom: rowBorder, fontFamily: "var(--font-mono, monospace)", fontWeight: 600, color: retColor, whiteSpace: "nowrap", fontSize: 13.5 }}>
                    {retStr}
                  </td>
                  <td style={{ padding: "12px 12px", borderBottom: rowBorder }}>
                    <span style={{ ...ratingStyle(fund.rating), fontSize: 11.5, fontWeight: 600, padding: "4px 10px", borderRadius: 20, display: "inline-block", whiteSpace: "nowrap" }}>
                      {ratingLabel(fund.rating)}
                    </span>
                  </td>
                  <td style={{ padding: "12px 12px", borderBottom: rowBorder }}>
                    <div style={{ display: "flex", gap: 4 }}>
                      {TOPIC_KEYS.map((key) => {
                        const r = fund.topic_ratings?.[key] || "GREEN";
                        const color = topicDot(r);
                        return (
                          <div
                            key={key}
                            title={`${TOPIC_LABELS[key]}: ${r}`}
                            style={{
                              width: 14,
                              height: 14,
                              borderRadius: 3,
                              background: color + "B8",
                              boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.18)",
                            }}
                          />
                        );
                      })}
                    </div>
                  </td>
                </tr>
              );
            })}
            {sorted.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: "32px 12px", textAlign: "center", color: "var(--br-text-muted, #6b7c95)", fontSize: 13 }}>
                  No funds match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Active Reviews Mock Data ───────────────────────────────────────────────────

const IN_PROGRESS_REVIEWS = [
  {
    slug: "ridgeline-capital",
    name: "Ridgeline Capital Partners, LLC",
    analyst: "Samantha Kim",
    started: "2026-01-10",
    rating: "WATCHLIST",
    stageBadge: "IC Review",
    stageBadgeColor: "#91f0c7",
    stageBadgeBg: "rgba(24,185,126,0.12)",
    dotColor: "#f59e0b",
    subtext: "4 conditions pending for ACCEPT upgrade",
    subtextColor: "#18b97e",
  },
  {
    slug: "trellis-capital-iv",
    name: "Trellis Capital IV, L.P.",
    analyst: "Priya Sharma",
    started: "2026-02-03",
    rating: "WATCHLIST",
    stageBadge: "IC Review",
    stageBadgeColor: "#ffd48c",
    stageBadgeBg: "rgba(242,169,59,0.12)",
    dotColor: "#f59e0b",
    subtext: "2 RED topics flagged · Governance & Regulatory",
    subtextColor: "#f59e0b",
  },
];

const PIPELINE_COLUMNS = [
  {
    id: "screening",
    label: "Screening",
    dotColor: "#98a7bb",
    count: 3,
    funds: [
      { name: "Cerberus Capital Management", strategy: "private_equity" },
      { name: "Elliott Management", strategy: "credit" },
      { name: "KKR Credit Advisors", strategy: "private_equity" },
    ],
  },
  {
    id: "under_review",
    label: "Under Review",
    dotColor: "#8c7cff",
    count: 3,
    funds: [
      { name: "Two Sigma Investments", strategy: "macro" },
      { name: "Ares Capital Corp", strategy: "credit" },
      { name: "Highfields Capital", strategy: "equity_hedge" },
    ],
  },
  {
    id: "ic_ready",
    label: "IC Ready",
    dotColor: "#eff4fb",
    count: 2,
    funds: [
      { name: "Bridgewater Associates", strategy: "macro" },
      { name: "Varde Partners", strategy: "credit" },
    ],
  },
];

const UPCOMING_REVIEWS = [
  { name: "Timberline Natural Resources", tag: "Event-Driven", date: "March 2026" },
  { name: "Gladstone Capital Partners", tag: "Credit", date: "March 2026" },
  { name: "Archegos Macro Fund", tag: "Global Macro", date: "April 2026" },
  { name: "Saba Capital Management", tag: "Credit & FI", date: "April 2026" },
];

// ── Active Reviews Content ─────────────────────────────────────────────────────

function ActiveReviewsList({ reviews, onNavigate, V }: { reviews: any[]; onNavigate: (slug: string) => void; V: Record<string, string> }) {
  // Compute stats
  const activeCount = IN_PROGRESS_REVIEWS.length;
  const flagCount = IN_PROGRESS_REVIEWS.filter((r) => r.rating === "FLAG").length;
  const pipelineCount = PIPELINE_COLUMNS.reduce((s, c) => s + c.count, 0);
  const upcomingCount = UPCOMING_REVIEWS.length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      {/* ── Stats Row ── */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12,
      }}>
        {[
          { value: activeCount, label: "Active", color: "#8c7cff" },
          { value: flagCount, label: "FLAG", color: "#f59e0b" },
          { value: pipelineCount, label: "Pipeline", color: "#8c7cff" },
          { value: upcomingCount, label: "Upcoming", color: V.sub },
        ].map(({ value, label, color }) => (
          <div
            key={label}
            style={{
              background: V.card,
              border: `1px solid ${V.border}`,
              borderRadius: 12,
              padding: "16px 20px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 28, fontWeight: 800, color, letterSpacing: "-0.04em", fontFamily: "IBM Plex Mono, monospace", lineHeight: 1 }}>
              {value}
            </div>
            <div style={{ fontSize: 11, color: V.muted, marginTop: 5, fontWeight: 500, letterSpacing: "0.05em" }}>
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* ── In Progress ── */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: V.muted, marginBottom: 10 }}>
          In Progress
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {IN_PROGRESS_REVIEWS.map((rev) => {
            const fromApi = reviews.find((r: any) => r.slug === rev.slug);
            const isClickable = canOpenFundReview(rev.slug);
            return (
              <div
                key={rev.slug}
                onClick={() => isClickable && onNavigate(rev.slug)}
                style={{
                  background: V.card,
                  border: `1px solid ${V.border}`,
                  borderRadius: 12,
                  padding: "14px 18px",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  cursor: isClickable ? "pointer" : "default",
                  transition: "background 0.12s, border-color 0.12s",
                }}
                onMouseEnter={(e) => {
                  if (!isClickable) return;
                  (e.currentTarget as HTMLDivElement).style.background = V.cardHover;
                  (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(24,185,126,0.25)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.background = V.card;
                  (e.currentTarget as HTMLDivElement).style.borderColor = V.border;
                }}
              >
                {/* Status dot */}
                <div style={{
                  width: 10, height: 10, borderRadius: "50%", flexShrink: 0,
                  background: rev.dotColor,
                  boxShadow: `0 0 0 3px ${rev.dotColor}22`,
                }} />

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: V.text }}>{rev.name}</div>
                  <div style={{ fontSize: 11, color: V.muted, marginTop: 2 }}>
                    {rev.analyst} · Started {rev.started}
                    {fromApi?.updated_at && ` · Updated ${relativeTime(fromApi.updated_at)}`}
                  </div>
                  {rev.subtext && (
                    <div style={{ fontSize: 11, color: rev.subtextColor, marginTop: 4, fontWeight: 500 }}>
                      {rev.subtext}
                    </div>
                  )}
                </div>

                {/* Badges */}
                <div style={{ display: "flex", gap: 6, flexShrink: 0, alignItems: "center" }}>
                  <span style={{
                    ...ratingStyle(rev.rating),
                    fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20,
                  }}>
                    {ratingLabel(rev.rating)}
                  </span>
                  <span style={{
                    background: rev.stageBadgeBg,
                    color: rev.stageBadgeColor,
                    border: `1px solid ${rev.stageBadgeColor}33`,
                    fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20,
                  }}>
                    {rev.stageBadge}
                  </span>
                </div>

                {isClickable && (
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke={V.muted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 12l4-4-4-4" />
                  </svg>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Pipeline Kanban ── */}
      <div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {PIPELINE_COLUMNS.map((col) => (
            <div
              key={col.id}
              style={{
                background: V.surface,
                border: `1px solid ${V.border}`,
                borderRadius: 12,
                overflow: "hidden",
              }}
            >
              {/* Column header */}
              <div style={{
                padding: "10px 14px",
                borderBottom: `1px solid ${V.border}`,
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: col.dotColor }} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: V.text }}>{col.label}</span>
                </div>
                <span style={{
                  fontSize: 10, fontWeight: 700,
                  color: V.muted,
                  background: V.card,
                  border: `1px solid ${V.border}`,
                  borderRadius: 10, padding: "1px 7px",
                }}>
                  {col.count}
                </span>
              </div>

              {/* Fund cards */}
              <div style={{ padding: "8px 10px", display: "flex", flexDirection: "column", gap: 6 }}>
                {col.funds.map((fund) => (
                  <div
                    key={fund.name}
                    style={{
                      background: V.card,
                      border: `1px solid ${V.border}`,
                      borderRadius: 8,
                      padding: "9px 11px",
                      cursor: "default",
                    }}
                  >
                    <div style={{ fontSize: 12, fontWeight: 500, color: V.text, marginBottom: 4 }}>{fund.name}</div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 10, color: V.muted }}>
                        {STRATEGY_LABELS[fund.strategy] || fund.strategy}
                      </span>
                      <span style={{ fontSize: 10, color: V.faint || V.muted, fontFamily: "monospace" }}>0d</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Upcoming Reviews ── */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: V.muted, marginBottom: 10 }}>
          Upcoming Reviews
        </div>
        <div style={{
          background: V.card,
          border: `1px solid ${V.border}`,
          borderRadius: 12,
          overflow: "hidden",
        }}>
          {UPCOMING_REVIEWS.map((item, idx) => (
            <div
              key={item.name}
              style={{
                padding: "12px 18px",
                display: "flex",
                alignItems: "center",
                gap: 12,
                borderBottom: idx < UPCOMING_REVIEWS.length - 1 ? `1px solid ${V.border}` : "none",
              }}
            >
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: V.muted, flexShrink: 0 }} />
              <div style={{ flex: 1, fontSize: 13, fontWeight: 500, color: V.text }}>{item.name}</div>
              <span style={{
                fontSize: 10, color: V.sub,
                background: "rgba(148,163,184,0.08)",
                border: `1px solid ${V.border}`,
                borderRadius: 8, padding: "2px 8px",
              }}>
                {item.tag}
              </span>
              <span style={{ fontSize: 11, color: V.muted, fontFamily: "monospace", whiteSpace: "nowrap" }}>{item.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Risk Heatmap (mini) ────────────────────────────────────────────────────────

function RiskHeatmapView({ funds }: { funds: any[] }) {
  if (funds.length === 0) return <div style={{ textAlign: "center", padding: 48, color: "var(--br-text-muted)" }}>Loading...</div>;

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
        <thead>
          <tr style={{ background: "var(--br-bg-surface, #0d1727)" }}>
            <th style={{ padding: "8px 12px", textAlign: "left", fontSize: 10, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--br-text-muted)", borderBottom: "1px solid var(--br-border)", whiteSpace: "nowrap" }}>Fund</th>
            {TOPIC_KEYS.map((key) => (
              <th key={key} style={{ padding: "6px 4px", fontSize: 9, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--br-text-muted)", borderBottom: "1px solid var(--br-border)", textAlign: "center", minWidth: 36 }} title={TOPIC_LABELS[key]}>{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {funds.map((fund, idx) => (
            <tr key={fund.slug || idx}>
              <td style={{ padding: "8px 12px", borderBottom: "1px solid var(--br-border, rgba(148,163,184,0.07))", color: "var(--br-text-secondary)", fontWeight: 500, whiteSpace: "nowrap", fontSize: 12 }}>{fund.name}</td>
              {TOPIC_KEYS.map((key) => {
                const r = (fund.topic_ratings?.[key] || "GREEN").toUpperCase();
                const bg = r === "GREEN" ? "rgba(24,185,126,0.18)" : r === "YELLOW" ? "rgba(245,158,11,0.18)" : "rgba(239,68,68,0.18)";
                const color = r === "GREEN" ? "#18b97e" : r === "YELLOW" ? "#f59e0b" : "#ef4444";
                return (
                  <td key={key} title={`${TOPIC_LABELS[key]}: ${r}`} style={{ padding: "6px 4px", textAlign: "center", borderBottom: "1px solid var(--br-border, rgba(148,163,184,0.07))" }}>
                    <div style={{ width: 28, height: 20, borderRadius: 4, background: bg, color, fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }}>
                      {r.charAt(0)}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Peer Comparison (mini) ─────────────────────────────────────────────────────

function PeerComparisonView({ funds }: { funds: any[] }) {
  const topicStats = TOPIC_KEYS.map((key) => {
    const total = funds.length || 1;
    const green = funds.filter((f) => (f.topic_ratings?.[key] || "GREEN") === "GREEN").length;
    const yellow = funds.filter((f) => (f.topic_ratings?.[key] || "GREEN") === "YELLOW").length;
    const red = funds.filter((f) => (f.topic_ratings?.[key] || "GREEN") === "RED").length;
    return { key, green, yellow, red, pct: Math.round((green / total) * 100) };
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {topicStats.sort((a, b) => a.pct - b.pct).map((t) => (
        <div key={t.key} style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 48, fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", color: "var(--br-text-muted)", textTransform: "uppercase" }}>{t.key}</div>
          <div style={{ flex: 1, height: 8, borderRadius: 4, background: "var(--br-bg-card, #102038)", overflow: "hidden", display: "flex" }}>
            <div style={{ width: `${(t.green / (funds.length || 1)) * 100}%`, background: "#18b97e", transition: "width 0.3s" }} />
            <div style={{ width: `${(t.yellow / (funds.length || 1)) * 100}%`, background: "#f59e0b", transition: "width 0.3s" }} />
            <div style={{ width: `${(t.red / (funds.length || 1)) * 100}%`, background: "#ef4444", transition: "width 0.3s" }} />
          </div>
          <div style={{ fontSize: 11, fontWeight: 600, fontFamily: "monospace", color: t.pct >= 75 ? "#18b97e" : t.pct >= 50 ? "#f59e0b" : "#ef4444", width: 36, textAlign: "right" }}>{t.pct}%</div>
          <div style={{ fontSize: 11, color: "var(--br-text-muted)", width: 80, whiteSpace: "nowrap" }}>{TOPIC_LABELS[t.key]}</div>
        </div>
      ))}
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function Portfolio2Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(() => searchParams?.get("tab") ?? "portfolio-overview");
  const [contentTab, setContentTab] = useState("fund-universe");
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("light");

  const [funds, setFunds] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [kpis, setKpis] = useState<any>(null);
  const [alerts, setAlerts] = useState<any[]>([]);

  // Force dark blackrock theme while on this page
  useEffect(() => {
    const html = document.documentElement;
    const prevTheme = html.getAttribute("data-theme");
    const prevBrand = html.getAttribute("data-brand");
    html.setAttribute("data-theme", "light");
    html.setAttribute("data-brand", "blackrock");
    setTheme("light");
    return () => {
      if (prevTheme) html.setAttribute("data-theme", prevTheme);
      else html.removeAttribute("data-theme");
      if (prevBrand) html.setAttribute("data-brand", prevBrand);
      else html.removeAttribute("data-brand");
    };
  }, []);

  // Fetch data
  useEffect(() => {
    const api = alpineDemoBrand.api;
    Promise.all([
      api.listFunds().catch(() => ({ funds: [] })),
      api.listReviews().catch(() => ({ reviews: [] })),
      api.getPortfolioKPIs().catch(() => null),
      api.getKPIAlerts().catch(() => ({ alerts: [] })),
    ]).then(([fn, rv, kp, al]) => {
      setFunds((fn as any)?.funds || fn || []);
      setReviews((rv as any)?.reviews || rv || []);
      setKpis(kp);
      setAlerts((al as any)?.alerts || al || []);
      setLoading(false);
    });
  }, []);

  const toggleTheme = useCallback(() => {
    const html = document.documentElement;
    const next: "dark" | "light" = theme === "dark" ? "light" : "dark";
    html.setAttribute("data-theme", next);
    setTheme(next);
  }, [theme]);

  function navigateToFund(slug: string, from?: string) {
    const qs = from ? `?from=${from}` : "";
    router.push(`/review2/${slug}${qs}`);
  }

  // Computed stats
  const fundCount = funds.length || (kpis?.fund_count ?? 18);
  const totalAum = kpis?.total_aum || "$34.7B";
  const avgReturn = kpis?.avg_return || "10.8%";
  const acceptCount = funds.filter((f: any) => (f.rating || "").toUpperCase() === "ACCEPT").length ||
    (kpis?.rating_distribution?.ACCEPT ?? 11);
  const watchlistCount = funds.filter((f: any) => (f.rating || "").toUpperCase() === "WATCHLIST").length ||
    (kpis?.rating_distribution?.WATCHLIST ?? 5);
  const flagCount = funds.filter((f: any) => (f.rating || "").toUpperCase() === "FLAG").length ||
    (kpis?.rating_distribution?.FLAG ?? 2);
  const strategies = new Set(funds.map((f: any) => f.strategy).filter(Boolean));
  const strategyCount = strategies.size || 5;
  const activeReviewCount = reviews.filter((r: any) =>
    r.status === "in_progress" || r.stage === "analysis" || r.stage === "verification"
  ).length || 4;

  // ODD score
  const primaryReview = reviews.find((r: any) => r.slug === "ridgeline-capital") || reviews[0];
  const oddScore = primaryReview?.overall_score || primaryReview?.score || 68;

  const V = {
    bg: "#07111d",
    surface: "#0d1727",
    card: "#102038",
    cardHover: "#162742",
    sidebar: "#08111e",
    border: "rgba(148,163,184,0.14)",
    borderSubtle: "rgba(148,163,184,0.07)",
    text: "#eff4fb",
    sub: "#98a7bb",
    muted: "#6b7c95",
    faint: "#4a5568",
    green: "#18b97e",
    amber: "#f59e0b",
    red: "#ef4444",
  };

  const isDark = theme === "dark";

  if (!isDark) {
    // Light theme overrides
    V.bg = "#F8FAFC"; V.surface = "#FFFFFF"; V.card = "#FFFFFF"; V.cardHover = "#F1F5F9";
    V.sidebar = "#F1F5F9"; V.border = "#E2E8F0"; V.borderSubtle = "#F1F5F9";
    V.text = "#1A1A2E"; V.sub = "#475569"; V.muted = "#64748B";
  }

  // ── Render ──
  return (
    <div
      style={{
        minHeight: "100vh",
        background: V.bg,
        display: "flex",
        flexDirection: "column",
        fontFamily: "DM Sans, sans-serif",
      }}
    >
      <style>{`
        @keyframes portfolioRingIn {
          0% { opacity: 0; transform: translateY(10px) scale(0.94); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes portfolioRingLabelIn {
          0% { opacity: 0; transform: scale(0.92); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
      {/* ── Top Bar ── */}
      <header
        style={{
          height: 52,
          background: V.surface,
          borderBottom: `1px solid ${V.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px",
          position: "sticky",
          top: 0,
          zIndex: 40,
          flexShrink: 0,
        }}
      >
        {/* Left: logo + breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <div
              style={{
                width: 24, height: 24, borderRadius: 5,
                background: "linear-gradient(135deg, #10B981 0%, #F59E0B 50%, #7B2CBF 100%)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#F5F0E8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 18L12 6L20 18" />
              </svg>
            </div>
            <span style={{ fontSize: 13, fontWeight: 700, color: V.text, letterSpacing: "-0.01em" }}>Alpine ODD</span>
          </a>
          <span style={{ color: V.muted, fontSize: 13 }}>/</span>
          <span style={{ fontSize: 12, color: V.muted }}>
            Portfolio
            {activeTab !== "portfolio-overview" && (
              <>
                <span style={{ margin: "0 4px" }}>·</span>
                <span style={{ color: V.sub }}>
                  {NAV_ITEMS.find((n) => n.id === activeTab)?.label}
                </span>
              </>
            )}
          </span>
        </div>

        {/* Right: alerts + theme toggle + sign out */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {alerts.length > 0 && (
            <div
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "4px 10px", borderRadius: 20,
                background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.18)",
                fontSize: 11, color: "#f87171", fontWeight: 600,
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ef4444", display: "inline-block" }} />
              {alerts.length} Alert{alerts.length !== 1 ? "s" : ""}
            </div>
          )}
          <button
            onClick={toggleTheme}
            style={{
              padding: "5px 12px", borderRadius: 8,
              background: "transparent", border: `1px solid ${V.border}`,
              fontSize: 11, color: V.muted, cursor: "pointer",
            }}
          >
            {isDark ? "☀ Light" : "☾ Dark"}
          </button>
          <button
            onClick={() => {
              localStorage.removeItem(alpineDemoBrand.userStorageKey);
              router.push("/");
            }}
            style={{
              padding: "5px 12px", borderRadius: 8,
              background: "transparent", border: `1px solid ${V.border}`,
              fontSize: 11, color: V.muted, cursor: "pointer",
            }}
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* ── Body ── */}
      <div style={{ display: "flex", flex: 1 }}>
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onNavigate={setActiveTab}
          collapsed={collapsed}
          onToggle={() => setCollapsed((c) => !c)}
        />

        {/* Main content */}
        <main
          style={{
            flex: 1,
            padding: "24px 28px",
            overflowY: "auto",
            minWidth: 0,
            background: V.bg,
          }}
        >
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[1, 2, 3].map((i) => (
                <div key={i} style={{ height: i === 1 ? 140 : 80, borderRadius: 12, background: V.card, opacity: 0.6 }} />
              ))}
            </div>
          ) : activeTab === "portfolio-overview" ? (
            <PortfolioOverviewContent
              fundCount={fundCount} strategyCount={strategyCount} totalAum={totalAum} avgReturn={avgReturn}
              acceptCount={acceptCount} watchlistCount={watchlistCount} flagCount={flagCount}
              oddScore={oddScore} activeReviewCount={activeReviewCount}
              funds={funds} reviews={reviews} contentTab={contentTab}
              setContentTab={setContentTab} onNavigate={navigateToFund} V={V}
            />
          ) : activeTab === "active-reviews" ? (
            <div>
              <div style={{ marginBottom: 20 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: V.text, letterSpacing: "-0.02em", marginBottom: 4 }}>Active Reviews</h2>
                <p style={{ fontSize: 12, color: V.muted }}>In-progress reviews, pipeline, and upcoming schedule</p>
              </div>
              <ActiveReviewsList reviews={reviews} onNavigate={(s) => navigateToFund(s, "active-reviews")} V={V} />
            </div>
          ) : activeTab === "fund-universe" ? (
            <div>
              <div style={{ marginBottom: 20 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: V.text, letterSpacing: "-0.02em", marginBottom: 4 }}>Fund Universe</h2>
                <p style={{ fontSize: 12, color: V.muted }}>{fundCount} monitored funds across {strategyCount} strategies</p>
              </div>
              <FundUniverseTable funds={funds} onNavigate={(s) => navigateToFund(s, "fund-universe")} />
            </div>
          ) : activeTab === "peer-comparison" ? (
            <div>
              <div style={{ marginBottom: 20 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: V.text, letterSpacing: "-0.02em", marginBottom: 4 }}>Peer Comparison</h2>
                <p style={{ fontSize: 12, color: V.muted }}>ODD topic health across portfolio</p>
              </div>
              <PeerComparisonView funds={funds} />
            </div>
          ) : activeTab === "risk-heatmap" ? (
            <div>
              <div style={{ marginBottom: 20 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: V.text, letterSpacing: "-0.02em", marginBottom: 4 }}>Risk Heatmap</h2>
                <p style={{ fontSize: 12, color: V.muted }}>Topic-level risk across {fundCount} funds</p>
              </div>
              <RiskHeatmapView funds={funds} />
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: 64, color: V.muted, fontSize: 14 }}>Coming soon</div>
          )}
        </main>
      </div>
    </div>
  );
}

// ── Portfolio Overview Content ─────────────────────────────────────────────────

function PortfolioOverviewContent({
  fundCount, strategyCount, totalAum, avgReturn,
  acceptCount, watchlistCount, flagCount, oddScore, activeReviewCount,
  funds, reviews, contentTab, setContentTab, onNavigate, V,
}: {
  fundCount: number; strategyCount: number; totalAum: string | number; avgReturn: string | number;
  acceptCount: number; watchlistCount: number; flagCount: number; oddScore: number; activeReviewCount: number;
  funds: any[]; reviews: any[]; contentTab: string;
  setContentTab: (t: string) => void; onNavigate: (slug: string, from?: string) => void;
  V: Record<string, string>;
}) {
  const aumStr = typeof totalAum === "number" ? formatCurrency(totalAum) : totalAum;
  const retStr = typeof avgReturn === "number" ? `${avgReturn > 0 ? "+" : ""}${avgReturn.toFixed(1)}%` : avgReturn;

  // Topic health %
  const topicHealthPcts = TOPIC_KEYS.map((key) => {
    if (funds.length === 0) return { key, pct: 100 };
    const greenCount = funds.filter((f: any) => (f.topic_ratings?.[key] || "GREEN") === "GREEN").length;
    return { key, pct: Math.round((greenCount / funds.length) * 100) };
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* ── Hero Card ── */}
      <div
        style={{
          background: V.card,
          border: `1px solid ${V.border}`,
          borderRadius: 14,
          padding: "18px 22px",
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) 184px",
          gap: 20,
          alignItems: "stretch",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 14, minWidth: 0 }}>
          <div>
            <div style={{
              fontSize: 10, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase",
              color: V.muted, marginBottom: 8,
            }}>
              Alpine ODD Platform · Portfolio Monitor
            </div>
            <h1 style={{
              fontSize: 24, fontWeight: 800, color: V.text,
              letterSpacing: "-0.04em", lineHeight: 1.08, marginBottom: 12,
            }}>
              {fundCount} funds · {strategyCount} strategies · {aumStr} AUM
            </h1>
            <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <div style={{ width: 9, height: 9, borderRadius: "50%", background: V.green }} />
                <span style={{ fontSize: 12, color: V.sub, fontWeight: 500 }}>{acceptCount} Accept</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <div style={{ width: 9, height: 9, borderRadius: "50%", background: V.amber }} />
                <span style={{ fontSize: 12, color: V.sub, fontWeight: 500 }}>{watchlistCount} Watchlist</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <div style={{ width: 9, height: 9, borderRadius: "50%", background: V.red }} />
                <span style={{ fontSize: 12, color: V.sub, fontWeight: 500 }}>{flagCount} Flag</span>
              </div>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0, auto))",
              gap: 16,
              alignItems: "end",
            }}
          >
            {[
              { label: "Avg Return", value: retStr, color: V.green },
              { label: "Active Reviews", value: String(activeReviewCount), color: V.text },
              { label: "Flagged", value: String(flagCount), color: flagCount > 0 ? V.red : V.green },
              { label: "Portfolio Score", value: String(oddScore), color: V.text },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ minWidth: 84 }}>
                <div style={{
                  fontSize: 9, fontWeight: 600, letterSpacing: "0.14em",
                  textTransform: "uppercase", color: V.muted, marginBottom: 5,
                }}>
                  {label}
                </div>
                <div style={{
                  fontSize: 20, fontWeight: 700, color,
                  letterSpacing: "-0.03em", lineHeight: 1.05, fontFamily: "IBM Plex Mono, monospace",
                }}>
                  {value}
                </div>
              </div>
            ))}
          </div>

          <div>
          <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: V.muted, marginBottom: 8 }}>
            Portfolio Topic Health
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {topicHealthPcts.map(({ key, pct }) => {
              const color = pct >= 80 ? V.green : pct >= 55 ? V.amber : V.red;
              return (
                <div
                  key={key}
                  title={`${TOPIC_LABELS[key]}: ${pct}% pass`}
                  style={{
                    minWidth: 56,
                    padding: "6px 8px",
                    borderRadius: 9,
                    background: color + "14",
                    border: `1px solid ${color}28`,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <span style={{ fontSize: 9, fontWeight: 700, color, fontFamily: "monospace" }}>{key}</span>
                  <span style={{ fontSize: 9, color, fontFamily: "monospace" }}>{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100%",
            borderLeft: `1px solid ${V.border}`,
            paddingLeft: 16,
          }}
        >
          <div
            style={{
              position: "relative",
              width: 144,
              minHeight: 164,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              animation: "portfolioRingIn 0.7s cubic-bezier(0.2, 0.8, 0.2, 1)",
            }}
          >
            <div style={{ position: "relative", width: 144, height: 144, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <RatingRing green={acceptCount} yellow={watchlistCount} red={flagCount} size={144} />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  animation: "portfolioRingLabelIn 0.8s ease-out",
                }}
              >
                <span style={{ fontSize: 40, fontWeight: 800, color: V.text, letterSpacing: "-0.05em", lineHeight: 1 }}>
                  {oddScore}
                </span>
                <span style={{ fontSize: 11, color: V.muted, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase" }}>
                  ODD
                </span>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, textAlign: "center" }}>
              <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: V.muted }}>
                Portfolio Score
              </span>
              <span style={{ fontSize: 10, color: V.sub, lineHeight: 1.35 }}>
                Weighted from manager ratings, open reviews, and flagged exceptions
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── KPI Metric Cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
        {[
          {
            label: "Portfolio ODD Score",
            value: String(oddScore),
            sub: "Ridgeline Capital (primary)",
            color: V.amber,
          },
          {
            label: "Flagged Funds",
            value: String(flagCount),
            sub: `${flagCount > 0 ? "Requires immediate review" : "All clear"}`,
            color: flagCount > 0 ? V.red : V.green,
          },
          {
            label: "Active Reviews",
            value: String(activeReviewCount),
            sub: "Currently in progress",
            color: V.text,
          },
          {
            label: "Total AUM",
            value: aumStr as string,
            sub: `${fundCount} funds · ${strategyCount} strategies`,
            color: V.text,
          },
        ].map(({ label, value, sub, color }) => (
          <div
            key={label}
            style={{
              background: V.card,
              border: `1px solid ${V.border}`,
              borderRadius: 12,
              padding: "16px 18px",
            }}
          >
            <div style={{
              fontSize: 10, fontWeight: 600, letterSpacing: "0.18em",
              textTransform: "uppercase", color: V.muted, marginBottom: 8,
            }}>
              {label}
            </div>
            <div style={{
              fontSize: 26, fontWeight: 700, color,
              letterSpacing: "-0.03em", lineHeight: 1.1, fontFamily: "IBM Plex Mono, monospace",
              marginBottom: 4,
            }}>
              {value}
            </div>
            <div style={{ fontSize: 11, color: V.muted, marginTop: 4 }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* ── Content Tab Bar ── */}
      <div>
        <div style={{ display: "flex", gap: 4, padding: 4, background: V.surface, borderRadius: 10, border: `1px solid ${V.border}`, width: "fit-content", marginBottom: 16 }}>
          {[
            { id: "fund-universe", label: "Fund Universe" },
            { id: "active-reviews", label: "Active Reviews" },
          ].map(({ id, label }) => {
            const isActive = contentTab === id;
            return (
              <button
                key={id}
                onClick={() => setContentTab(id)}
                style={{
                  padding: "6px 16px",
                  borderRadius: 7,
                  border: "none",
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: isActive ? 600 : 400,
                  background: isActive ? V.card : "transparent",
                  color: isActive ? V.text : V.muted,
                  transition: "all 0.15s",
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        {contentTab === "fund-universe" ? (
          <FundUniverseTable funds={funds} onNavigate={(s) => onNavigate(s, "fund-universe")} />
        ) : (
          <ActiveReviewsList reviews={reviews} onNavigate={(s) => onNavigate(s, "active-reviews")} V={V} />
        )}
      </div>
    </div>
  );
}
