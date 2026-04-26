"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { alpineDemoBrand } from "@/lib/demo-brands/alpine-demo";
import { TOPIC_DATA as RIDGELINE_TOPIC_DATA, RIDGELINE_MOCK, VAULT_DATA as RIDGELINE_VAULT_DATA, FOLLOW_UP_MOCK as RIDGELINE_FOLLOW_UP_MOCK } from "@/lib/ridgeline-data";
import { TRELLIS_TOPIC_DATA, TRELLIS_MOCK, TRELLIS_VAULT_DATA, TRELLIS_FOLLOW_UP_MOCK } from "@/lib/trellis-data";
import { DocumentCollectionView } from "@/components/review/FollowUpSection";
import { VerificationTab } from "@/components/review/VerificationTab";
import { ReportWithMemo } from "@/components/review/ReportWithMemo";
import { PlaceholderTab } from "@/components/review/PlaceholderTab";
import OverviewSection from "@/components/shell/OverviewSection";
import { TopicPage } from "@/components/review/TopicPage";

// ── Design tokens (from blackrock static demo styles.css) ─────────────────────

const D = {
  bg: "#07111d",
  panel: "#0d1727",
  surface: "#111d30",
  surface2: "#14233a",
  card: "#102038",
  cardHover: "#162742",
  border: "rgba(148,163,184,0.14)",
  text: "#eff4fb",
  muted: "#98a7bb",
  faint: "#6b7c95",
  green: "#18b97e",
  amber: "#f2a93b",
  red: "#ef5b5b",
  violet: "#8c7cff",
};

const DL = {
  bg: "#F0F4F8", panel: "#FFFFFF", surface: "#F8FAFC", surface2: "#F1F5F9", card: "#FFFFFF", cardHover: "#F8FAFC",
  border: "rgba(15,23,42,0.10)", text: "#0F172A", muted: "#475569", faint: "#94A3B8",
  green: "#059669", amber: "#D97706", red: "#DC2626", violet: "#6D28D9",
};

// ── Per-review data context ────────────────────────────────────────────────────

interface ReviewCtxValue {
  topicData: Record<number, any>;
  mock: typeof RIDGELINE_MOCK;
  vaultData: typeof RIDGELINE_VAULT_DATA;
  followUpMock: typeof RIDGELINE_FOLLOW_UP_MOCK;
  slug: string;
  topicRatingOverrides: Record<number, string>;
  riskObsOverrides: Record<string, RiskObsEdit>;
  onRiskObsSaved: (id: string, edit: RiskObsEdit) => void;
}
const ReviewCtx = React.createContext<ReviewCtxValue>({
  topicData: RIDGELINE_TOPIC_DATA,
  mock: RIDGELINE_MOCK as any,
  vaultData: RIDGELINE_VAULT_DATA,
  followUpMock: RIDGELINE_FOLLOW_UP_MOCK,
  slug: "",
  topicRatingOverrides: {},
  riskObsOverrides: {},
  onRiskObsSaved: () => {},
});

// ── Nav items ──────────────────────────────────────────────────────────────────

const REVIEW_NAV = [
  // ── ODD Review workflow ──
  { id: "overview", label: "Overview", section: "ODD Review",
    icon: <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="2" y="2" width="5" height="5" rx="1"/><rect x="9" y="2" width="5" height="5" rx="1"/><rect x="2" y="9" width="5" height="5" rx="1"/><rect x="9" y="9" width="5" height="5" rx="1"/></svg> },
  { id: "collection", label: "Collection", section: "ODD Review", badge: "14 docs",
    icon: <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M2 4l6 4 6-4"/><rect x="1" y="3" width="14" height="10" rx="1.5"/></svg> },
  { id: "reg-verification", label: "Verification", section: "ODD Review", badge: "Ready",
    icon: <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M8 2l5 3v4c0 3-2.5 4.5-5 5.5-2.5-1-5-2.5-5-5.5V5L8 2z"/><path d="M6 8l1.5 1.5L10 7"/></svg> },
  { id: "analysis", label: "Analysis", section: "ODD Review", badge: "Complete",
    icon: <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M4 13V7M8 13V4M12 13V9"/></svg> },
  { id: "call-prep", label: "Analyst Call", section: "ODD Review", badge: "Pending",
    icon: <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M4 4a1 1 0 011-1h2l1 3-1.5 1a8 8 0 004.5 4.5L12.5 10l3 1v2a1 1 0 01-1 1A13 13 0 013 5"/></svg> },
  { id: "report-gen", label: "Report", section: "ODD Review", badge: "Pending",
    icon: <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M4 2h8a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1z"/><path d="M6 5h4M6 7.5h4M6 10h2"/></svg> },
  { id: "doc-vault", label: "Documents", section: "ODD Review", badge: "14 docs",
    icon: <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M14 13H2V6l2-3h8l2 3v7z"/><path d="M2 6h12"/><path d="M6 9h4"/></svg> },
  // ── Intelligence ──
  { id: "monitoring", label: "Monitoring", section: "Intelligence",
    icon: <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="8" cy="8" r="5.5"/><path d="M8 5v3l2 2"/></svg> },
];

// ── Helpers ────────────────────────────────────────────────────────────────────

function ratingBadge(rating: string, d: typeof D) {
  const r = (rating || "").toUpperCase();
  if (r === "ACCEPT" || r === "GREEN")
    return { color: "#91f0c7", bg: "rgba(24,185,126,0.12)" };
  if (r === "WATCHLIST" || r === "YELLOW")
    return { color: "#ffd48c", bg: "rgba(242,169,59,0.12)" };
  if (r === "FLAG" || r === "RED")
    return { color: "#ffb3b3", bg: "rgba(239,91,91,0.12)" };
  return { color: d.muted, bg: d.surface2 };
}

function topicDotColor(r: string, d: typeof D) {
  const u = (r || "GREEN").toUpperCase();
  if (u === "GREEN") return d.green;
  if (u === "YELLOW" || u === "AMBER") return d.amber;
  if (u === "RED") return d.red;
  return d.green;
}

function topicScore(r: string): number {
  const u = (r || "GREEN").toUpperCase();
  if (u === "GREEN") return 85;
  if (u === "YELLOW") return 55;
  if (u === "RED") return 28;
  return 85;
}

// ── Styled primitives (inline-style) ──────────────────────────────────────────

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: "var(--r2-card)", border: "1px solid var(--r2-border)", borderRadius: 20, padding: 20, ...style }}>
      {children}
    </div>
  );
}

function SevBadge({ sev }: { sev: string }) {
  const isHigh = (sev || "").toUpperCase() === "HIGH";
  const isMed = (sev || "").toUpperCase() === "MEDIUM";
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", borderRadius: 999, padding: "4px 10px",
      fontSize: 11, fontWeight: 600, whiteSpace: "nowrap",
      color: isHigh ? "#ffb3b3" : isMed ? "#ffd48c" : "#91f0c7",
      background: isHigh ? "rgba(239,91,91,0.12)" : isMed ? "rgba(242,169,59,0.12)" : "rgba(24,185,126,0.12)",
      border: `1px solid ${isHigh ? "rgba(239,91,91,0.22)" : isMed ? "rgba(242,169,59,0.22)" : "rgba(24,185,126,0.22)"}`,
    }}>
      {sev}
    </span>
  );
}

function VerifyBadge({ status }: { status: string }) {
  const isPassed = ["passed", "pass", "confirmed"].includes((status || "").toLowerCase());
  const isException = ["exception", "partial"].includes((status || "").toLowerCase());
  const color = isPassed ? "#91f0c7" : isException ? "#ffd48c" : "#ffb3b3";
  const bg = isPassed ? "rgba(24,185,126,0.12)" : isException ? "rgba(242,169,59,0.12)" : "rgba(239,91,91,0.12)";
  const border = isPassed ? "rgba(24,185,126,0.20)" : isException ? "rgba(242,169,59,0.20)" : "rgba(239,91,91,0.20)";
  const label = isPassed ? "✓ Pass" : isException ? "⚠ Exception" : "✗ Fail";
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, borderRadius: 999, padding: "5px 12px", fontSize: 11, fontWeight: 600, color, background: bg, border: `1px solid ${border}` }}>
      {label}
    </span>
  );
}

// ── Stepper ────────────────────────────────────────────────────────────────────

const STEPPER_STEPS = [
  { label: "Collection",   sub: "14 docs",  tabId: "collection",       completed: true },
  { label: "Verification", sub: "Ready",     tabId: "reg-verification", completed: true },
  { label: "Analysis",     sub: "Complete",  tabId: "analysis",         completed: true },
  { label: "Analyst Call",    sub: "Ready",     tabId: "call-prep",        completed: true },
  { label: "Report",       sub: "Pending",   tabId: "report-gen",       completed: false },
];

function WorkflowStepper({ activeTab, onNavigate, isDark }: { activeTab: string; onNavigate: (id: string) => void; isDark: boolean }) {
  const activeIdx = STEPPER_STEPS.findIndex((s) => s.tabId === activeTab);
  const green  = isDark ? "#18b97e" : "#059669";
  const violet = isDark ? "#8c7cff" : "#7c3aed";

  return (
    <Card style={{ padding: "16px 24px", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
        {STEPPER_STEPS.map((step, i) => {
          const isSelected = activeIdx === i;
          // Completed steps always show green, even when selected.
          // Pending (not completed) steps show violet when selected.
          const showGreen  = step.completed;
          const showViolet = isSelected && !step.completed;
          const labelColor = showGreen ? green : showViolet ? violet : "var(--r2-muted)";
          return (
            <React.Fragment key={step.label}>
              <button
                onClick={() => onNavigate(step.tabId)}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                  whiteSpace: "nowrap", background: "none", border: "none", cursor: "pointer",
                  padding: 0, flex: 1,
                }}
              >
                {/* Circle */}
                <div style={{
                  width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  border: showGreen ? `2px solid ${green}` : showViolet ? "none" : `2px solid var(--r2-border)`,
                  background: showGreen ? "transparent" : showViolet ? violet : "transparent",
                  color: showGreen ? green : showViolet ? "#fff" : "var(--r2-faint)",
                }}>
                  {showGreen ? (
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke={green} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2.5 6.5l3 3 5-5" />
                    </svg>
                  ) : (
                    <span style={{ fontSize: 12, fontWeight: 700 }}>{i + 1}</span>
                  )}
                </div>
                {/* Label + sub */}
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: 13, fontWeight: isSelected ? 700 : 500, color: labelColor, lineHeight: 1.2 }}>
                    {step.label}
                  </div>
                  <div style={{ fontSize: 11, color: labelColor, opacity: 0.8, lineHeight: 1 }}>
                    {step.sub}
                  </div>
                </div>
              </button>
              {i < STEPPER_STEPS.length - 1 && (
                <div style={{
                  height: 1, width: 40, flexShrink: 0,
                  background: step.completed ? `${green}55` : "var(--r2-border)",
                }} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </Card>
  );
}

// ── Sidebar ────────────────────────────────────────────────────────────────────

function ReviewSidebar({ active, onNavigate, docCount }: { active: string; onNavigate: (id: string) => void; docCount?: number }) {
  const [detailOpen, setDetailOpen] = React.useState(false);
  const visibleSections = ["ODD Review", "Intelligence"];
  if (detailOpen) visibleSections.push("Detail");
  // Live override for badges that reflect data counts.
  const liveBadge: Record<string, string | undefined> = {
    collection: docCount != null ? `${docCount} docs` : undefined,
    "doc-vault": docCount != null ? `${docCount} docs` : undefined,
  };

  return (
    <aside style={{
      padding: "14px 10px", position: "sticky", top: 16, height: "fit-content",
      maxHeight: "calc(100vh - 100px)", overflowY: "auto",
      background: "var(--r2-card)", border: "1px solid var(--r2-border)", borderRadius: 20,
    }}>
      {visibleSections.map((section, si) => {
        const items = REVIEW_NAV.filter((n) => n.section === section);
        if (items.length === 0) return null;
        return (
          <div key={section} style={{ marginTop: si > 0 ? 4 : 0 }}>
            <div style={{
              fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase",
              color: "var(--r2-faint)", padding: si > 0 ? "12px 8px 4px" : "0 8px 4px",
              marginTop: si > 0 ? 0 : 0,
              borderTop: si > 0 ? "1px solid var(--r2-border)" : "none",
            }}>
              {section}
            </div>
            {items.map((item) => {
              const isActive = active === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 10,
                    color: isActive ? "var(--r2-text)" : "var(--r2-muted)",
                    fontWeight: isActive ? 600 : 400,
                    background: isActive ? "rgba(239,244,251,0.08)" : "transparent",
                    border: `1px solid ${isActive ? "rgba(239,244,251,0.12)" : "transparent"}`,
                    marginBottom: 1, fontSize: 13, cursor: "pointer", width: "100%", textAlign: "left",
                    transition: "background 0.12s, color 0.12s",
                  }}
                  onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.background = "var(--r2-surface2)"; e.currentTarget.style.color = "var(--r2-text)"; } }}
                  onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--r2-muted)"; } }}
                >
                  <span style={{ opacity: isActive ? 1 : 0.6, flexShrink: 0 }}>{item.icon}</span>
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {(() => {
                    const badge = liveBadge[item.id] ?? (item as any).badge;
                    return badge ? (
                      <span style={{
                        fontSize: 10, color: "var(--r2-faint)",
                        background: "var(--r2-surface2)", borderRadius: 6,
                        padding: "1px 6px", whiteSpace: "nowrap", flexShrink: 0,
                      }}>
                        {badge}
                      </span>
                    ) : null;
                  })()}
                </button>
              );
            })}
          </div>
        );
      })}

    </aside>
  );
}

// ── TAB: Overview — replaced by OverviewSection import above ──────────────────
// (kept stub to avoid breaking other references if any)
function OverviewTab({ reviewData: _r }: { reviewData: any }) { return null; }
function _OverviewTabUnused({ reviewData, isTrellis }: { reviewData: any; isTrellis?: boolean }) {
  const rating = (reviewData?.rating || "WATCHLIST").toUpperCase();
  const score = reviewData?.overall_score || reviewData?.score || 68;
  const ratingLabel = rating === "ACCEPT" ? "ACCEPT" : rating === "FLAG" ? "FLAG" : "WATCHLIST";
  const rBadge = ratingBadge(rating, D);
  const topicRatings = reviewData?.topic_ratings || {};

  const topicDots = Object.values(RIDGELINE_TOPIC_DATA).map((td, i) => {
    const key = Object.keys(RIDGELINE_TOPIC_DATA)[i];
    const r = (topicRatings[key] || topicRatings[(td as any).name] || (td as any).rating || "YELLOW").toUpperCase();
    return r;
  });

  const greenCount = topicDots.filter((r) => r === "GREEN").length;
  const amberCount = topicDots.filter((r) => r === "YELLOW" || r === "AMBER").length;
  const redCount = topicDots.filter((r) => r === "RED").length;

  const scoreColor = score >= 75 ? D.green : score >= 55 ? D.amber : D.red;

  return (
    <div style={{ display: "grid", gap: 16 }}>
      {/* Review grid: recommendation banner + fund snapshot */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
        {/* Recommendation banner */}
        <Card>
          <div style={{ fontSize: 12, color: "var(--r2-muted)" }}>Investment recommendation</div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "10px 0 12px" }}>
            <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.03em", color: "var(--r2-text)" }}>
              {ratingLabel}
            </div>
            <span style={{ ...rBadge, padding: "5px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600 }}>
              {rating === "ACCEPT" ? "Full Approval" : rating === "FLAG" ? "Do Not Invest" : "Conditional Approval"}
            </span>
          </div>
          <p style={{ color: "var(--r2-muted)", lineHeight: 1.75, fontSize: 14 }}>
            {reviewData?.executive_summary?.summary ||
              `Alpine's operational due diligence review of ${reviewData?.name || "this fund"} recommends a ` +
              `<strong>${ratingLabel.toLowerCase()}</strong> rating. Investment performance and service provider quality are strong, ` +
              `but compliance infrastructure and governance gaps preclude full accept status at this time.`}
          </p>
          <div style={{ borderLeft: "3px solid var(--r2-amber)", paddingLeft: 14, margin: "14px 0", color: "#f0d29c", fontSize: 14, lineHeight: 1.6 }}>
            {reviewData?.conditions_summary ||
              "Four conditions to upgrade to Accept: (1) hire a dedicated CCO, (2) implement pre-trade compliance monitoring, (3) formalize and test a succession plan, (4) establish an independent valuation committee."}
          </div>
          <div style={{ fontSize: 12, color: "var(--r2-muted)", marginTop: 14, marginBottom: 6 }}>12-topic status strip</div>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {Object.values(RIDGELINE_TOPIC_DATA).map((td, i) => {
              const r = (td as any).rating;
              const color = topicDotColor(r, D);
              return (
                <div key={i} title={(td as any).name} style={{ width: 10, height: 10, borderRadius: 3, background: color }} />
              );
            })}
          </div>
          <div style={{ fontSize: 12, color: "var(--r2-faint)", marginTop: 6 }}>
            ● Green: {greenCount} · ● Amber: {amberCount} · ● Red: {redCount}
          </div>
        </Card>

        {/* Fund snapshot */}
        <Card>
          <div style={{ fontSize: 12, color: "var(--r2-muted)" }}>Fund snapshot</div>
          <div style={{ display: "flex", alignItems: "center", gap: 18, margin: "14px 0" }}>
            <div style={{
              width: 110, height: 110, borderRadius: "50%", flexShrink: 0,
              border: `6px solid ${scoreColor}`,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            }}>
              <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.04em", color: scoreColor }}>{score}</div>
              <div style={{ fontSize: 11, color: "var(--r2-faint)", marginTop: 1 }}>/ 100</div>
            </div>
            <div>
              <div style={{ fontSize: 13, color: "var(--r2-muted)" }}>ODD Score</div>
              <div style={{ fontSize: 11, color: "var(--r2-faint)", marginTop: 4 }}>
                Percentile: {reviewData?.percentile || "34th"}
              </div>
            </div>
          </div>
          <div style={{ display: "grid", gap: 8, fontSize: 13, color: "var(--r2-muted)" }}>
            {(isTrellis ? [
              { label: "Fund Size", value: "$274M commitments · $280.3M net assets" },
              { label: "SEC Filing", value: "ERA (VC Exemption) · Since March 2019" },
              { label: "Founded", value: "August 2018 · San Francisco, CA" },
              { label: "Strategy", value: "Venture Capital — Pre-Seed & Seed" },
              { label: "Staff", value: "7 full-time (6 investment + 1 ops)" },
              { label: "Principals", value: "Arjun Mehta · Priya Sharma (50/50)" },
              { label: "Disclosures", value: "0 (clean record)", color: D.green },
            ] : [
              { label: "Fund AUM", value: reviewData?.aum || RIDGELINE_MOCK.fund.aum },
              { label: "CRD / SEC#", value: reviewData?.crd || "298741 / 801-112847" },
              { label: "Registered since", value: reviewData?.registered_since || "April 2018" },
              { label: "Strategy", value: reviewData?.strategy || RIDGELINE_MOCK.fund.strategy },
              { label: "Employees", value: reviewData?.employees || "34 total · 12 advisory" },
              { label: "Investor accounts", value: reviewData?.investor_count ? `${reviewData.investor_count}` : "412" },
              { label: "Disclosures", value: reviewData?.disclosures || "0 (clean record)", color: D.green },
            ]).map(({ label, value, color }) => (
              <div key={label}>
                <span style={{ color: "var(--r2-faint)" }}>{label}: </span>
                <strong style={{ color: color || "var(--r2-text)" }}>{value}</strong>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Strengths + Conditions split */}
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 16 }}>
        <Card>
          <div style={{ fontSize: 16, fontWeight: 600, color: "var(--r2-text)", marginBottom: 14 }}>Key Strengths</div>
          <div style={{ display: "grid", gap: 8 }}>
            {RIDGELINE_MOCK.strengths.map((s, i) => (
              <div key={i} style={{ padding: "12px 14px", borderRadius: 12, background: "rgba(255,255,255,0.03)", border: "1px solid var(--r2-border)", borderLeft: `3px solid ${D.green}` }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--r2-text)", marginBottom: 3 }}>{s.title}</div>
                <div style={{ fontSize: 12, color: "var(--r2-muted)", lineHeight: 1.5 }}>{s.detail}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div style={{ fontSize: 16, fontWeight: 600, color: "var(--r2-text)", marginBottom: 14 }}>Conditions for Accept</div>
          <div style={{ display: "grid", gap: 8 }}>
            {[
              { text: "Hire a dedicated Chief Compliance Officer", detail: "Current interim CCO (COO) lacks separation of duties · target: within 6 months", color: D.red },
              { text: "Implement pre-trade compliance monitoring", detail: "No automated system in place · target: within 90 days", color: D.red },
              { text: "Formalize and test succession plan", detail: "No interim CIO arrangement documented · Board approval required", color: D.red },
              { text: "Establish independent valuation committee", detail: "Investment personnel currently on valuation committee · must be separated", color: D.amber },
            ].map((c, i) => (
              <div key={i} style={{ padding: "12px 14px", borderRadius: 12, background: "rgba(255,255,255,0.03)", border: "1px solid var(--r2-border)", borderLeft: `3px solid ${c.color}` }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--r2-text)", marginBottom: 3 }}>{c.text}</div>
                <div style={{ fontSize: 12, color: "var(--r2-muted)", lineHeight: 1.5 }}>{c.detail}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ── TAB: ODD Summary ───────────────────────────────────────────────────────────

function OddSummaryTab({ reviewData }: { reviewData: any }) {
  const { topicData: TOPIC_DATA } = React.useContext(ReviewCtx);
  const score = reviewData?.overall_score || 68;
  const scoreColor = score >= 75 ? D.green : score >= 55 ? D.amber : D.red;
  const topicRatings = reviewData?.topic_ratings || {};
  const topicCount = Object.keys(TOPIC_DATA).length;

  const topics = Object.entries(TOPIC_DATA).map(([num, td]) => {
    const r = (topicRatings[td.name] || td.rating || "YELLOW").toUpperCase();
    const sc = topicScore(r);
    const color = topicDotColor(r, D);
    return { num, name: td.name, rating: r, score: sc, color };
  });

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 16 }}>
      <Card>
        <div style={{ fontSize: 16, fontWeight: 600, color: "var(--r2-text)", marginBottom: 16 }}>{topicCount}-Topic ODD Assessment</div>
        <div style={{ display: "grid", gap: 10 }}>
          {topics.map(({ num, name, score: sc, color, rating }) => (
            <div key={num} style={{ display: "grid", gridTemplateColumns: "130px 1fr 46px", gap: 10, alignItems: "center", fontSize: 13 }}>
              <div style={{ color: "var(--r2-muted)", fontSize: 12 }}>{Number(num)}. {name.split(" ").slice(0, 2).join(" ")}</div>
              <div style={{ height: 7, borderRadius: 999, background: "rgba(255,255,255,0.07)", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${sc}%`, background: color, borderRadius: 999, transition: "width 0.7s ease" }} />
              </div>
              <div style={{ fontSize: 12, color, textAlign: "right" }}>{sc}</div>
            </div>
          ))}
        </div>
      </Card>

      <div style={{ display: "grid", gap: 16 }}>
        <Card style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{
            width: 110, height: 110, borderRadius: "50%", border: `6px solid ${scoreColor}`, flexShrink: 0,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          }}>
            <div style={{ fontSize: 32, fontWeight: 800, color: scoreColor, letterSpacing: "-0.04em" }}>{score}</div>
            <div style={{ fontSize: 11, color: "var(--r2-faint)" }}>/ 100</div>
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "var(--r2-text)" }}>
              {score >= 75 ? "ACCEPT" : score >= 55 ? "WATCHLIST" : "FLAG"}
            </div>
            <div style={{ fontSize: 12, color: "var(--r2-muted)", marginTop: 4 }}>
              {score >= 75 ? "Full Approval" : score >= 55 ? "Conditional Approval" : "Do Not Invest"}
            </div>
            <div style={{ fontSize: 12, color: "var(--r2-faint)", marginTop: 8 }}>
              {topics.filter((t) => t.rating === "GREEN").length} green · {topics.filter((t) => t.rating === "YELLOW").length} amber · {topics.filter((t) => t.rating === "RED").length} red
            </div>
            <div style={{ fontSize: 12, color: "var(--r2-faint)" }}>Percentile rank: 34th</div>
          </div>
        </Card>

        <Card>
          <div style={{ fontSize: 14, fontWeight: 600, color: "var(--r2-text)", marginBottom: 12 }}>Institutional Fit Checklist</div>
          <div style={{ display: "grid", gap: 8 }}>
            {[
              { label: "SEC-registered adviser", status: "passed" },
              { label: "Independent administrator", status: "passed" },
              { label: "Big 4 auditor", status: "passed" },
              { label: "Dedicated CCO", status: "failed" },
              { label: "Pre-trade compliance system", status: "failed" },
              { label: "Documented succession plan", status: "failed" },
              { label: "BCP tested annually", status: "exception" },
            ].map(({ label, status }) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13, padding: "8px 10px", borderRadius: 8, background: "var(--r2-surface2)" }}>
                <span style={{ color: "var(--r2-muted)" }}>{label}</span>
                <VerifyBadge status={status} />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ── TAB: Risk Observations ─────────────────────────────────────────────────────

type RiskObs = { id: string; severity: string; topic: string; title: string; detail: string; remediation: string };
type RiskObsEdit = { severity: string; title: string; detail: string; remediation: string };

function RiskObsRow({ obs, slug, override, onSaved }: { obs: RiskObs; slug: string; override?: RiskObsEdit; onSaved?: (id: string, edit: RiskObsEdit) => void }) {
  const merged = override ? { ...obs, ...override } : obs;
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState<RiskObsEdit>({ severity: merged.severity, title: merged.title, detail: merged.detail, remediation: merged.remediation });
  const [saving, setSaving] = React.useState(false);

  function startEdit() {
    setDraft({ severity: merged.severity, title: merged.title, detail: merged.detail, remediation: merged.remediation });
    setEditing(true);
  }

  async function save() {
    setSaving(true);
    try {
      await fetch("/api/risk-obs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: obs.id, review_slug: slug, ...draft }),
      });
      onSaved?.(obs.id, draft);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", background: "var(--r2-surface2)", border: "1px solid var(--r2-border)",
    borderRadius: 6, padding: "6px 10px", color: "var(--r2-text)", fontSize: 13,
    outline: "none", fontFamily: "inherit",
  };

  if (editing) {
    return (
      <div style={{ padding: "14px 16px", background: "var(--r2-card)", display: "grid", gap: 10 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: 10, color: "var(--r2-faint)", fontWeight: 600 }}>{obs.id}</span>
          <select value={draft.severity} onChange={(e) => setDraft((p) => ({ ...p, severity: e.target.value }))}
            style={{ ...inputStyle, width: 110 }}>
            <option>HIGH</option>
            <option>MEDIUM</option>
            <option>LOW</option>
          </select>
        </div>
        <input value={draft.title} onChange={(e) => setDraft((p) => ({ ...p, title: e.target.value }))}
          placeholder="Title" style={inputStyle} />
        <textarea value={draft.detail} onChange={(e) => setDraft((p) => ({ ...p, detail: e.target.value }))}
          placeholder="Detail" rows={3}
          style={{ ...inputStyle, resize: "vertical", lineHeight: 1.55 }} />
        <textarea value={draft.remediation} onChange={(e) => setDraft((p) => ({ ...p, remediation: e.target.value }))}
          placeholder="Remediation (optional)" rows={2}
          style={{ ...inputStyle, resize: "vertical", lineHeight: 1.55 }} />
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={save} disabled={saving}
            style={{ padding: "6px 16px", borderRadius: 6, background: D.green, color: "#fff", border: "none", fontSize: 12, fontWeight: 600, cursor: saving ? "default" : "pointer", opacity: saving ? 0.6 : 1 }}>
            {saving ? "Saving…" : "Save"}
          </button>
          <button onClick={() => setEditing(false)}
            style={{ padding: "6px 14px", borderRadius: 6, background: "transparent", color: "var(--r2-muted)", border: "1px solid var(--r2-border)", fontSize: 12, cursor: "pointer" }}>
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "12px 16px", background: "var(--r2-card)", display: "grid", gap: 6 }}
      className="risk-obs-row">
      {/* Row 1: ID · badge · edit button */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 10, fontFamily: "monospace", color: "var(--r2-faint)", fontWeight: 600 }}>{merged.id}</span>
          <SevBadge sev={merged.severity} />
        </div>
        <button onClick={startEdit} title="Edit"
          style={{ padding: "2px 7px", borderRadius: 5, background: "transparent", border: "1px solid var(--r2-border)", color: "var(--r2-faint)", cursor: "pointer", fontSize: 11, lineHeight: 1.4, flexShrink: 0 }}>
          ✎
        </button>
      </div>
      {/* Row 2: title */}
      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--r2-text)", lineHeight: 1.4 }}>{merged.title}</div>
      {/* Row 3: detail */}
      <div style={{ fontSize: 12, color: "var(--r2-muted)", lineHeight: 1.65 }}>{merged.detail}</div>
      {/* Row 4: remediation */}
      {merged.remediation && (
        <div style={{ fontSize: 12, color: D.amber, paddingLeft: 10, borderLeft: `3px solid ${D.amber}`, marginTop: 2 }}>
          <strong style={{ color: "var(--r2-text)" }}>Remediation: </strong>{merged.remediation}
        </div>
      )}
    </div>
  );
}

function RiskObsTab() {
  const { mock, slug, riskObsOverrides, onRiskObsSaved } = React.useContext(ReviewCtx);
  const staticObs = mock.risk_observations as RiskObs[];
  const overrides = riskObsOverrides;

  const obs = staticObs.map((o) => overrides[o.id] ? { ...o, ...overrides[o.id] } : o);
  const highCount = obs.filter((o) => o.severity === "HIGH").length;
  const medCount = obs.filter((o) => o.severity === "MEDIUM").length;

  const grouped: Record<string, RiskObs[]> = {};
  staticObs.forEach((o) => {
    const key = o.topic || "Other";
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(o);
  });

  return (
    <Card>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 600, color: "var(--r2-text)" }}>Risk Observations</div>
          <div style={{ fontSize: 12, color: "var(--r2-muted)", marginTop: 2 }}>{obs.length} observations · {highCount} High · {medCount} Medium</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <SevBadge sev={`${highCount} High`} />
          <SevBadge sev={`${medCount} Medium`} />
        </div>
      </div>

      <div style={{ display: "grid", gap: 16 }}>
        {Object.entries(grouped).map(([topic, items]) => (
          <div key={topic} style={{ borderRadius: 14, border: "1px solid var(--r2-border)", overflow: "hidden" }}>
            <div style={{
              padding: "10px 16px", background: "var(--r2-surface2)", borderBottom: "1px solid var(--r2-border)",
              fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase",
              color: "var(--r2-faint)", display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <span>{topic}</span>
              <span style={{ fontWeight: 500, letterSpacing: 0, textTransform: "none", fontSize: 11 }}>
                {items.length} observation{items.length !== 1 ? "s" : ""}
              </span>
            </div>
            {items.map((o, i) => (
              <div key={o.id} style={{ borderTop: i > 0 ? "1px solid var(--r2-border)" : undefined }}>
                <RiskObsRow obs={o} slug={slug} override={overrides[o.id]} onSaved={onRiskObsSaved} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── TAB: Fund Profile ──────────────────────────────────────────────────────────

function FundProfileTab({ reviewData, isTrellis }: { reviewData: any; isTrellis?: boolean }) {
  const { mock } = React.useContext(ReviewCtx);
  const perf = mock.fund_performance;

  const firmRows = isTrellis ? [
    ["Legal Name", "Trellis Capital Management, LLC"],
    ["Fund", "Trellis Capital IV, L.P. (GP: Trellis Capital GP IV, LLC)"],
    ["Headquarters", "San Francisco, California"],
    ["Year Founded", "August 2018"],
    ["SEC Filing", "Exempt Reporting Adviser (ERA) · VC Exemption · Since March 2019"],
    ["Fund Size", "$274M total commitments · $280.3M net assets · $113.7M uncalled"],
    ["Fund Structure", "Delaware LP + Delaware GP LLC"],
    ["Strategy", "Venture Capital — Pre-Seed & Seed Stage Technology"],
    ["Principals", "Arjun Mehta 50% · Priya Sharma 50% (confirmed Form ADV Sch. A/B)"],
    ["Staff", "7 full-time (6 investment professionals + 1 operations)"],
    ["LP Accounts", "Institutional LPs across Funds I–IV"],
    ["Management Fee", "2.5% (commitment period) · 1.5% (invested capital thereafter)"],
    ["Carried Interest", "20% (American waterfall · no preferred return)"],
    ["Commitment Period", "5 years from first close · Recycling up to 120% of commitments"],
  ] : [
    ["Legal Name", reviewData?.legal_name || "Ridgeline Capital Partners, LLC"],
    ["Headquarters", reviewData?.headquarters || "Greenwich, Connecticut"],
    ["Year Founded", reviewData?.year_founded || "2018"],
    ["SEC Registration", reviewData?.sec_registration || "Registered April 2018 · CRD #298741"],
    ["Fund AUM", reviewData?.aum || "$2.31B (as of Mar 31, 2026)"],
    ["Fund Structure", "Delaware LP + Cayman Islands Feeder"],
    ["Strategy", reviewData?.strategy || RIDGELINE_MOCK.fund.strategy],
    ["Employees", reviewData?.employees || "34 total · 12 advisory"],
    ["Investor Accounts", "412 accounts"],
    ["Management Fee", perf.fees.management_fee],
    ["Performance Fee", `${perf.fees.performance_fee} with high-water mark`],
    ["Redemption Terms", `${perf.liquidity.redemption_frequency} · ${perf.liquidity.redemption_notice} notice`],
  ];

  const teamMembers = isTrellis ? [
    { name: "Arjun Mehta", role: "Co-Founder · Managing Partner", exp: "Investment lead · 50% ownership · prev. Sequoia Capital" },
    { name: "Priya Sharma", role: "Co-Founder · Managing Partner · CCO (⚠ investment professional)", exp: "Compliance oversight · 50% ownership · prev. a16z" },
    { name: "Sarah Collins", role: "Head of Operations", exp: "Sole operations professional · Fractional CFO (Raj Patel) joining Summer 2026" },
  ] : [
    { name: "David Chen, CFA", role: "CIO & Founder · PM (sole)", exp: "23 years experience · prev. Goldman Sachs" },
    { name: "Sarah Martinez", role: "COO · Interim CCO", exp: "12 years experience · prev. AQR Capital" },
    { name: "James Park, CFA", role: "Head of Research", exp: "15 years experience · prev. Citadel" },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 16 }}>
      <Card>
        <div style={{ fontSize: 16, fontWeight: 600, color: "var(--r2-text)", marginBottom: 16 }}>Firm Overview</div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <tbody>
            {firmRows.map(([label, value]) => (
              <tr key={label as string}>
                <td style={{ padding: "8px 0", color: "var(--r2-faint)", width: 160, verticalAlign: "top" }}>{label}</td>
                <td style={{ padding: "8px 0", color: "var(--r2-text)", fontWeight: 500 }}>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <div style={{ display: "grid", gap: 16 }}>
        <Card>
          <div style={{ fontSize: 14, fontWeight: 600, color: "var(--r2-text)", marginBottom: 12 }}>Investment Team</div>
          <div style={{ display: "grid", gap: 8 }}>
            {teamMembers.map((p) => (
              <div key={p.name} style={{ padding: 12, borderRadius: 12, background: "var(--r2-surface2)" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--r2-text)" }}>{p.name}</div>
                <div style={{ fontSize: 12, color: "var(--r2-muted)", marginTop: 2 }}>{p.role}</div>
                <div style={{ fontSize: 11, color: "var(--r2-faint)", marginTop: 1 }}>{p.exp}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div style={{ fontSize: 14, fontWeight: 600, color: "var(--r2-text)", marginBottom: 12 }}>Service Providers</div>
          <div style={{ display: "grid", gap: 8, fontSize: 13 }}>
            {isTrellis ? (
              <>
                {[
                  { label: "Administrator", value: "Apex Fund Services, LLC (Xero + FundPanel)", color: D.text },
                  { label: "Auditor", value: "Baker Thompson & Co.", color: D.text },
                  { label: "Legal Counsel", value: "Morrison Cole Ashworth", color: D.text },
                  { label: "Banking", value: "Pacific Commerce → JP Morgan (transition)", color: D.text },
                  { label: "Prime Broker", value: "N/A — Venture Capital strategy", color: D.text },
                ].map(({ label, value, color }) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--r2-faint)" }}>{label}</span>
                    <span style={{ color, fontWeight: 500, textAlign: "right", maxWidth: 200 }}>{value}</span>
                  </div>
                ))}
              </>
            ) : (
              <>
                {[
                  { label: "Prime Broker", value: "Goldman Sachs, Morgan Stanley", color: D.text },
                  { label: "Administrator", value: "Citco Fund Services", color: D.text },
                  { label: "Auditor", value: "Ernst & Young LLP", color: D.text },
                  { label: "Legal Counsel", value: "Schulte Roth & Zabel LLP", color: D.text },
                  { label: "IT / MSP", value: "Eze Castle Integration", color: D.text },
                  { label: "Compliance", value: "In-house interim (gap)", color: D.amber },
                ].map(({ label, value, color }) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--r2-faint)" }}>{label}</span>
                    <strong style={{ color }}>{value}</strong>
                  </div>
                ))}
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ── TAB: Peer Comparison ───────────────────────────────────────────────────────

function PeerCompareTab({ reviewData }: { reviewData: any }) {
  const fundName = reviewData?.name || "Ridgeline Capital Partners";
  const score = reviewData?.overall_score || 68;

  return (
    <Card>
      <div style={{ fontSize: 16, fontWeight: 600, color: "var(--r2-text)", marginBottom: 16 }}>
        Peer Comparison — Equity Hedge Funds ($1B–$3B AUM)
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "var(--r2-surface2)" }}>
              {["Fund", "ODD Score", "Rating", "AUM", "Governance", "Compliance", "BCP", "IT/Cyber", "Service Prov."].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "10px 14px", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--r2-faint)", borderBottom: "1px solid var(--r2-border)", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr style={{ background: "rgba(140,124,255,0.05)" }}>
              <td style={{ padding: "12px 14px", borderBottom: "1px solid var(--r2-border)", color: "var(--r2-text)", fontWeight: 600 }}>
                {fundName} <span style={{ fontSize: 10, color: D.violet }}>▶ you</span>
              </td>
              <td style={{ padding: "12px 14px", borderBottom: "1px solid var(--r2-border)" }}><strong style={{ color: D.amber }}>{score}</strong></td>
              <td style={{ padding: "12px 14px", borderBottom: "1px solid var(--r2-border)" }}>
                <span style={{ ...ratingBadge("WATCHLIST", D), padding: "5px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600 }}>Watchlist</span>
              </td>
              <td style={{ padding: "12px 14px", borderBottom: "1px solid var(--r2-border)", color: "var(--r2-muted)" }}>$2.31B</td>
              {[55, 82, 34, 52, 94].map((v, i) => {
                const c = v >= 75 ? D.green : v >= 50 ? D.amber : D.red;
                return <td key={i} style={{ padding: "12px 14px", borderBottom: "1px solid var(--r2-border)", color: "var(--r2-muted)" }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: c, display: "inline-block", marginRight: 4 }} />{v}
                </td>;
              })}
            </tr>
            {[
              { name: "Harborview Long/Short Fund", score: 84, rating: "ACCEPT", aum: "$1.50B", vals: [88, 91, 85, 82, 92] },
              { name: "Pacific Rim Opportunities", score: 44, rating: "FLAG", aum: "$1.10B", vals: [32, 55, 28, 36, 60] },
              { name: "Lakeview Volatility Fund", score: 79, rating: "ACCEPT", aum: "$0.55B", vals: [80, 88, 72, 78, 90] },
              { name: "Peer Group Average", score: 77, rating: "", aum: "$1.37B", vals: [75, 83, 72, 74, 84] },
            ].map((peer, pi) => (
              <tr key={pi} style={{ background: "transparent" }}
                onMouseEnter={(e) => e.currentTarget.style.background = "var(--r2-surface2)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
              >
                <td style={{ padding: "12px 14px", borderBottom: "1px solid var(--r2-border)", color: "var(--r2-muted)" }}>{peer.name}</td>
                <td style={{ padding: "12px 14px", borderBottom: "1px solid var(--r2-border)" }}>
                  <strong style={{ color: peer.score >= 75 ? D.green : peer.score >= 55 ? D.amber : D.red }}>{peer.score}</strong>
                </td>
                <td style={{ padding: "12px 14px", borderBottom: "1px solid var(--r2-border)" }}>
                  {peer.rating && <span style={{ ...ratingBadge(peer.rating, D), padding: "5px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600 }}>{peer.rating === "ACCEPT" ? "Accept" : peer.rating === "FLAG" ? "Flag" : ""}</span>}
                  {!peer.rating && <span style={{ color: "var(--r2-faint)" }}>—</span>}
                </td>
                <td style={{ padding: "12px 14px", borderBottom: "1px solid var(--r2-border)", color: "var(--r2-muted)" }}>{peer.aum}</td>
                {peer.vals.map((v, i) => {
                  const c = v >= 75 ? D.green : v >= 50 ? D.amber : D.red;
                  return <td key={i} style={{ padding: "12px 14px", borderBottom: "1px solid var(--r2-border)", color: "var(--r2-muted)" }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: c, display: "inline-block", marginRight: 4 }} />{v}
                  </td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ borderLeft: "3px solid var(--r2-amber)", paddingLeft: 14, marginTop: 16, color: "#f0d29c", fontSize: 14, lineHeight: 1.6 }}>
        {fundName} trails peers significantly on Governance (55 vs avg 75) and BCP (34 vs avg 72), but outperforms on Service Provider quality (94 vs avg 84). These gaps drive the Watchlist rating.
      </div>
    </Card>
  );
}

// ── TAB: Document Vault ────────────────────────────────────────────────────────

function DocVaultTab() {
  const { vaultData } = React.useContext(ReviewCtx);
  const docs = vaultData.documents;
  return (
    <Card>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 18 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 600, color: "var(--r2-text)" }}>Document Vault</div>
          <div style={{ fontSize: 12, color: "var(--r2-muted)", marginTop: 2 }}>{docs.length} documents · {docs.filter((d) => d.status === "flagged").length} flagged</div>
        </div>
        <button style={{ padding: "9px 16px", fontSize: 13, borderRadius: 12, border: "1px solid var(--r2-border)", background: "rgba(255,255,255,0.04)", color: "var(--r2-muted)", cursor: "pointer" }}>
          + Request Document
        </button>
      </div>
      <div style={{ display: "grid", gap: 6 }}>
        {docs.map((doc) => (
          <div key={doc.id} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center", gap: 14,
            padding: "12px 14px", borderRadius: 12, border: "1px solid var(--r2-border)",
            background: doc.status === "flagged" ? "rgba(239,91,91,0.04)" : "var(--r2-card)",
            cursor: "pointer", transition: "background 0.1s",
          }}
            onMouseEnter={(e) => e.currentTarget.style.background = "var(--r2-cardHover)"}
            onMouseLeave={(e) => e.currentTarget.style.background = doc.status === "flagged" ? "rgba(239,91,91,0.04)" : "var(--r2-card)"}
          >
            <div>
              <div style={{ fontSize: 13, color: "var(--r2-text)", fontWeight: 500 }}>{doc.name}</div>
              <div style={{ fontSize: 11, color: "var(--r2-faint)", marginTop: 2 }}>
                {doc.category} · {doc.pages} pages · {(doc.size_kb / 1024).toFixed(1)} MB · {doc.date}
                {doc.risk_flags?.length > 0 && <span style={{ color: D.amber }}> · {doc.risk_flags.length} risk flag{doc.risk_flags.length > 1 ? "s" : ""}</span>}
              </div>
            </div>
            <span style={{ fontSize: 10, fontWeight: 600, padding: "4px 8px", borderRadius: 999, background: "var(--r2-surface2)", color: "var(--r2-faint)", textTransform: "uppercase", letterSpacing: "0.08em", flexShrink: 0 }}>
              {doc.category.split(" ")[0]}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── TAB: IC Memo ───────────────────────────────────────────────────────────────

function ICMemoTab({ reviewData }: { reviewData: any }) {
  const fundName = reviewData?.name || "Ridgeline Capital Partners";
  const score = reviewData?.overall_score || 68;
  const rating = score >= 75 ? "ACCEPT" : score >= 55 ? "WATCHLIST" : "FLAG";

  const sections = [
    {
      id: "§1", title: "Executive Summary",
      content: `${fundName} recommends a WATCHLIST — Conditional Approval rating. The firm is a Greenwich, CT-based SEC-registered investment adviser (CRD #298741) founded in April 2018, managing approximately $2.31 billion in AUM across a Delaware LP and Cayman Islands feeder fund structure serving 412 investor accounts. The fund's investment performance and operational history are strong. Alpine's review identified no regulatory disclosures, confirmed administrator independence through direct verification with Citco Fund Services, and validated clean audit history (Ernst & Young, unqualified opinion). However, three high-severity operational gaps — absence of a dedicated CCO, no pre-trade compliance system, and lack of a formalized succession plan — preclude an Accept rating without remediation.`,
    },
    {
      id: "§2", title: "Investment Strategy",
      content: `${fundName} employs a fundamental, research-driven global long/short equity strategy covering 10–15 countries. The portfolio consists of 100–150 long positions and 60–100 short positions with average gross exposure of 180% and net exposure ranging from 40% to 80% net long. David Chen, CFA (CIO & Founder) leads portfolio construction. Performance history: +14.2% annualized net-of-fees since inception vs. MSCI World +9.8%.`,
    },
    {
      id: "§3", title: "Operational Assessment",
      content: `Governance (55/100 — Yellow): Board oversight limited to David Chen as managing member. No succession planning despite material key person concentration risk. Service Providers (94/100 — Green): Citco Fund Services provides daily NAV, full GL, investor services. Ernst & Young as auditor — unqualified opinions for 7 consecutive years. Compliance (82/100 — Green): Comprehensive written policies covering insider trading, personal account dealing, and gifts. Weakness: interim CCO structure.`,
    },
    {
      id: "§4", title: "Risk Factors",
      risks: [
        { sev: "HIGH", text: "No dedicated CCO — compliance oversight is a secondary responsibility for the COO", color: D.red },
        { sev: "HIGH", text: "No pre-trade compliance monitoring system — manual checks only", color: D.red },
        { sev: "HIGH", text: "Founder key person dependency with no documented succession plan", color: D.red },
        { sev: "MEDIUM", text: "BCP last tested 2021, predates office relocation, no documented RTOs", color: D.amber },
        { sev: "MEDIUM", text: "Valuation committee includes investment personnel without independent oversight", color: D.amber },
        { sev: "MEDIUM", text: "No penetration testing; cybersecurity relies on MSP defaults", color: D.amber },
      ],
    },
    {
      id: "§5", title: "Recommendation & Conditions",
      isRecommendation: true, rating,
    },
  ];

  return (
    <Card>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 600, color: "var(--r2-text)" }}>Investment Committee Memo</div>
          <div style={{ fontSize: 12, color: "var(--r2-muted)", marginTop: 2 }}>{fundName} · Version 2.1 · Draft for IC</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={{ padding: "9px 14px", fontSize: 13, borderRadius: 12, border: "1px solid var(--r2-border)", background: "rgba(255,255,255,0.04)", color: "var(--r2-muted)", cursor: "pointer" }}>Edit</button>
          <button style={{ padding: "9px 14px", fontSize: 13, borderRadius: 12, border: "1px solid transparent", background: "linear-gradient(135deg, #16b77c, #22c38a)", color: "#fff", cursor: "pointer", fontWeight: 600 }}>⬇ Export</button>
        </div>
      </div>

      <div style={{ display: "grid", gap: 16 }}>
        {sections.map((sec) => (
          <div key={sec.id} style={{
            padding: 18, borderRadius: 14,
            border: sec.isRecommendation ? `1px solid rgba(242,169,59,0.25)` : "1px solid var(--r2-border)",
            background: sec.isRecommendation ? "rgba(242,169,59,0.05)" : "var(--r2-card)",
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: sec.isRecommendation ? D.amber : "var(--r2-faint)", marginBottom: 10 }}>
              {sec.id} {sec.title}
            </div>
            {sec.content && <p style={{ color: "var(--r2-muted)", lineHeight: 1.75, fontSize: 14, margin: 0 }}>{sec.content}</p>}
            {sec.risks && (
              <div style={{ display: "grid", gap: 8 }}>
                {sec.risks.map((r, i) => (
                  <div key={i} style={{ padding: "10px 12px", borderRadius: 10, background: "rgba(255,255,255,0.02)", borderLeft: `3px solid ${r.color}`, fontSize: 13 }}>
                    <span style={{ fontWeight: 600, fontSize: 12, color: "var(--r2-text)" }}>{r.sev}: </span>
                    <span style={{ color: "var(--r2-muted)" }}>{r.text}</span>
                  </div>
                ))}
              </div>
            )}
            {sec.isRecommendation && (
              <>
                <div style={{ fontSize: 18, fontWeight: 800, color: "var(--r2-text)", marginBottom: 10 }}>
                  {rating} — {rating === "ACCEPT" ? "Full Approval" : rating === "FLAG" ? "Do Not Invest" : "Conditional Approval"}
                </div>
                <p style={{ color: "var(--r2-muted)", lineHeight: 1.75, fontSize: 14, marginBottom: 14 }}>
                  Alpine recommends approval of an initial allocation subject to completion of the following conditions within 6 months.
                </p>
                <div style={{ display: "grid", gap: 8 }}>
                  {[
                    { text: "Hire a dedicated Chief Compliance Officer (target: 6 months)", color: D.red },
                    { text: "Implement automated pre-trade compliance system (target: 90 days)", color: D.red },
                    { text: "Document and board-approve a CIO succession plan (target: 90 days)", color: D.red },
                    { text: "Establish independent valuation committee (target: 6 months)", color: D.amber },
                    { text: "Complete BCP annual test with documented RTOs (target: 3 months)", color: D.amber },
                    { text: "Engage vendor for annual penetration testing (target: 6 months)", color: D.amber },
                  ].map((c, i) => (
                    <div key={i} style={{ padding: "10px 12px", borderRadius: 10, background: "rgba(255,255,255,0.02)", borderLeft: `3px solid ${c.color}`, fontSize: 13, color: "var(--r2-muted)" }}>
                      {c.text}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── TAB: Verification ──────────────────────────────────────────────────────────

function VerificationTab2({ reviewData, isTrellis }: { reviewData: any; isTrellis?: boolean }) {
  const checks = isTrellis ? [
    { title: "SEC ERA Filing — Confirmed", status: "passed", detail: "Trellis Capital Management, LLC filed as an Exempt Reporting Adviser (ERA) under the venture capital adviser exemption (Section 203(l) of the Advisers Act) since March 9, 2019. Current Form ADV dated March 22, 2026 reviewed. No discrepancies found.", source: "SEC IARD / EDGAR · ERA Form ADV · March 22, 2026" },
    { title: "SEC Disciplinary Disclosures — None Found", status: "passed", detail: "Form ADV Section 11 all answered No. No disciplinary actions, regulatory inquiries, or sanctions on DRP pages. No BrokerCheck reportable events for either principal (Arjun Mehta or Priya Sharma). Clean regulatory history since 2019.", source: "Form ADV Part 1A Section 11 · FINRA BrokerCheck · March 2026" },
    { title: "Administrator — Apex Fund Services Confirmed", status: "passed", detail: "Apex Fund Services, LLC confirmed as expected administrator for Fund IV, continuing from prior funds. Apex uses Xero for accounting and FundPanel for LP reporting. Engagement letter for Fund IV expected before first capital call — Alpine confirmed expected engagement via conference call April 3, 2026.", source: "Direct administrator verification · Apr 3, 2026" },
    { title: "Form ADV Year-over-Year Comparison", status: "passed", detail: "Firm net assets grew from $212.4M (2024) to $280.3M (2025) plus $113.7M uncalled capital. Staff count stable at 7 full-time. No material changes to ownership structure (Mehta 50%, Sharma 50%). No new disciplinary items.", source: "Year-over-year ADV comparison · March 2026" },
    { title: "Dedicated CCO — Investment Professional (RED)", status: "failed", detail: "Priya Sharma (Co-Founder, Managing Partner) is responsible for compliance oversight in addition to full investment responsibilities. Alpine is strongly opposed to an investment professional holding compliance responsibilities and requires this be transferred to a non-investment professional (e.g., Sarah Collins, Head of Operations). This is a required action before close.", source: "Form ADV Part 1A · DDQ §4.2 · Alpine Compliance Standard" },
    { title: "Cybersecurity & BCP — Not Documented", status: "exception", detail: "No formal cybersecurity policy or incident response plan documented. No penetration testing completed. No written BCP exists. No third-party cybersecurity framework adopted. Endpoints lack formal DLP controls. Required remediation before ACCEPT designation.", source: "DDQ §9.1–9.5 · CyberSec Assessment · Feb 2026" },
  ] : [
    { title: "SEC Form ADV — Registration Confirmed", status: "passed", detail: `${reviewData?.name || "The fund"} is registered with the SEC as an investment adviser (CRD #298741). Form ADV filed March 28, 2025. AUM reported: $2.31B. No discrepancies found.`, source: "SEC EDGAR / IAPD · Updated: Feb 10, 2026" },
    { title: "SEC Disciplinary Disclosures — None Found", status: "passed", detail: "No disciplinary actions, customer complaints, or regulatory events found. SEC examination completed October 2023 — no deficiency letter or findings. Clean regulatory history since registration.", source: "Items 11A-K all answered No · 0 disclosures" },
    { title: "Administrator — Citco Fund Services Confirmed", status: "passed", detail: "Citco Fund Services confirmed as independent administrator performing NAV calculations. AUM of $2.31B and 412 investor accounts confirmed. Monthly reconciliation process verified.", source: "Direct administrator verification · Feb 14, 2026" },
    { title: "Form ADV Year-over-Year Comparison", status: "passed", detail: "AUM grew from $2.05B (2024) to $2.31B (2025). Employee count stable at 34. No material changes to ownership structure. No new material disciplinary items.", source: "Year-over-year comparison · Feb 10, 2026" },
    { title: "Dedicated CCO — Not Confirmed", status: "failed", detail: "Form ADV and DDQ confirm COO Sarah Martinez serves as interim CCO in a dual-hatted capacity. No dedicated CCO has been appointed. This is an open HIGH-severity condition for the ACCEPT upgrade.", source: "DDQ §4.2 · Form ADV Part 2A" },
    { title: "BCP Annual Test — Exception", status: "exception", detail: "BCP provided but last formal test documented October 2023. Fund states testing occurred in 2024 but no formal documentation provided. Minor exception — not a blocking issue.", source: "BCP doc · Oct 2023 · DDQ §9.5" },
  ];

  const passCount = checks.filter((c) => c.status === "passed").length;
  const excCount = checks.filter((c) => c.status === "exception").length;

  return (
    <Card>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 18 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 600, color: "var(--r2-text)" }}>Regulatory Verification</div>
          <div style={{ fontSize: 12, color: "var(--r2-muted)", marginTop: 2 }}>{checks.length} checks completed · {passCount} Pass · {excCount} Exception</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <VerifyBadge status="passed" />
          <VerifyBadge status="exception" />
        </div>
      </div>

      <div style={{ display: "grid", gap: 10 }}>
        {checks.map((check) => {
          const isPassed = check.status === "passed";
          const isException = check.status === "exception";
          const borderColor = isPassed ? "rgba(24,185,126,0.22)" : isException ? "rgba(242,169,59,0.22)" : "rgba(239,91,91,0.22)";
          const bgColor = isPassed ? "rgba(24,185,126,0.04)" : isException ? "rgba(242,169,59,0.04)" : "rgba(239,91,91,0.04)";
          return (
            <div key={check.title} style={{ padding: 16, borderRadius: 14, border: `1px solid ${borderColor}`, background: bgColor }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 10 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--r2-text)" }}>{check.title}</div>
                <VerifyBadge status={check.status} />
              </div>
              <p style={{ color: "var(--r2-muted)", lineHeight: 1.7, fontSize: 13, margin: "0 0 8px" }}>{check.detail}</p>
              <div style={{ fontSize: 11, color: "var(--r2-faint)" }}>Source: {check.source}</div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// ── TAB: Monitoring ────────────────────────────────────────────────────────────

const MONITORING_ITEMS = [
  { id: 4,  priority: "Med", target: "2027",        action: "Monitor progress", issue: "Hire full-time Head of Finance" },
  { id: 5,  priority: "Med", target: "TBD",         action: "Monitor progress", issue: "Implement compliance attestation and annual training" },
  { id: 6,  priority: "Med", target: "TBD",         action: "Monitor progress", issue: "Form valuation committee with non-investment representation" },
  { id: 7,  priority: "Med", target: "TBD",         action: "Monitor progress", issue: "Implement internal investor-level accounting records" },
  { id: 8,  priority: "Med", target: "TBD",         action: "Monitor progress", issue: "Prepare written business continuity plan" },
  { id: 9,  priority: "Low", target: "Conditional", action: "Request formation", issue: "Form LPAC" },
  { id: 10, priority: "Low", target: "TBD",         action: "Monitor",          issue: "Monitor Pacific Commerce / JP Morgan banking transition" },
  { id: 11, priority: "Low", target: "TBD",         action: "Monitor",          issue: "Engage third-party background check provider" },
];

function MonitoringTab() {
  const SCAN_INTERVAL = 120; // seconds
  const [countdown, setCountdown] = React.useState(SCAN_INTERVAL);
  const [scanning, setScanning] = React.useState(false);
  const [scanDots, setScanDots] = React.useState(0);

  React.useEffect(() => {
    const tick = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          setScanning(true);
          setTimeout(() => setScanning(false), 3000);
          return SCAN_INTERVAL;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(tick);
  }, []);

  React.useEffect(() => {
    if (!scanning) { setScanDots(0); return; }
    const d = setInterval(() => setScanDots(p => (p + 1) % 4), 400);
    return () => clearInterval(d);
  }, [scanning]);

  const mins = Math.floor(countdown / 60);
  const secs = countdown % 60;
  const pct = ((SCAN_INTERVAL - countdown) / SCAN_INTERVAL) * 100;

  const priorityColor = (p: string) => p === "Med" ? "#F59E0B" : "#6b7280";
  const priorityBg   = (p: string) => p === "Med" ? "rgba(245,158,11,0.10)" : "rgba(107,114,128,0.10)";

  return (
    <Card>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 18, gap: 16 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 600, color: "var(--r2-text)", marginBottom: 4 }}>Post-Close Monitoring</div>
          <div style={{ fontSize: 12, color: "var(--r2-muted)" }}>{MONITORING_ITEMS.length} open conditions · Trellis Capital IV</div>
        </div>
        {/* Scan widget */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 14px", borderRadius: 10, border: "1px solid var(--r2-border)", background: "var(--r2-surface2)", minWidth: 190 }}>
          {scanning ? (
            <>
              <div style={{ position: "relative", width: 20, height: 20, flexShrink: 0 }}>
                <svg width="20" height="20" viewBox="0 0 20 20" style={{ animation: "spin 1s linear infinite" }}>
                  <circle cx="10" cy="10" r="8" fill="none" stroke="var(--r2-border)" strokeWidth="2" />
                  <path d="M10 2 A8 8 0 0 1 18 10" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <span style={{ fontSize: 11, color: "#6366f1", fontWeight: 600 }}>
                Scanning web{"·".repeat(scanDots)}
              </span>
            </>
          ) : (
            <>
              <div style={{ position: "relative", width: 20, height: 20, flexShrink: 0 }}>
                <svg width="20" height="20" viewBox="0 0 20 20">
                  <circle cx="10" cy="10" r="8" fill="none" stroke="var(--r2-border)" strokeWidth="2" />
                  <path
                    d={`M10 2 A8 8 0 ${pct > 50 ? 1 : 0} 1 ${10 + 8 * Math.sin((pct / 100) * 2 * Math.PI)} ${10 - 8 * Math.cos((pct / 100) * 2 * Math.PI)}`}
                    fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round"
                  />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: 10, color: "var(--r2-faint)", lineHeight: 1.3 }}>Next web scan</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "var(--r2-text)", fontVariantNumeric: "tabular-nums" }}>
                  {mins}:{secs.toString().padStart(2, "0")}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Table header */}
      <div style={{ display: "grid", gridTemplateColumns: "36px 1fr 60px 100px 130px", gap: "0 12px", padding: "6px 12px", marginBottom: 6 }}>
        {["#", "Issue", "Priority", "Target", "Action"].map(h => (
          <div key={h} style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--r2-faint)" }}>{h}</div>
        ))}
      </div>

      <div style={{ display: "grid", gap: 6 }}>
        {MONITORING_ITEMS.map(item => (
          <div key={item.id} style={{ display: "grid", gridTemplateColumns: "36px 1fr 60px 100px 130px", gap: "0 12px", alignItems: "center", padding: "12px 12px", borderRadius: 10, border: "1px solid var(--r2-border)", background: "var(--r2-card)" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--r2-faint)" }}>{item.id}</div>
            <div style={{ fontSize: 13, color: "var(--r2-text)", lineHeight: 1.5 }}>{item.issue}</div>
            <div>
              <span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 999, background: priorityBg(item.priority), color: priorityColor(item.priority), fontWeight: 600 }}>
                {item.priority}
              </span>
            </div>
            <div style={{ fontSize: 12, color: "var(--r2-muted)" }}>{item.target}</div>
            <div style={{ fontSize: 12, color: "var(--r2-muted)", fontStyle: "italic" }}>{item.action}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── TAB: Full Report ───────────────────────────────────────────────────────────

function FullReportTab({ reviewData }: { reviewData: any }) {
  const score = reviewData?.overall_score || 68;
  const rating = score >= 75 ? "ACCEPT" : score >= 55 ? "WATCHLIST" : "FLAG";
  const fundName = reviewData?.name || "Ridgeline Capital Partners";

  return (
    <Card>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 600, color: "var(--r2-text)" }}>Full ODD Report</div>
          <div style={{ fontSize: 12, color: "var(--r2-muted)", marginTop: 2 }}>{fundName} · Final Draft</div>
        </div>
        <button style={{ padding: "9px 18px", fontSize: 13, borderRadius: 12, border: "1px solid transparent", background: "linear-gradient(135deg, #16b77c, #22c38a)", color: "#fff", cursor: "pointer", fontWeight: 600 }}>
          ⬇ Export Report
        </button>
      </div>
      <div style={{
        padding: 24, borderRadius: 14, border: "1px solid var(--r2-border)", background: "var(--r2-surface2)",
        fontSize: 14, color: "var(--r2-muted)", lineHeight: 1.8,
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--r2-faint)", marginBottom: 8 }}>
          Alpine Operational Due Diligence — Final Report
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, color: "var(--r2-text)", letterSpacing: "-0.03em", marginBottom: 4 }}>{fundName}</div>
        <div style={{ fontSize: 13, color: "var(--r2-faint)", marginBottom: 20 }}>Report Date: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} · Version 2.1</div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 20 }}>
          {[
            { label: "ODD Rating", value: rating, color: score >= 75 ? D.green : score >= 55 ? D.amber : D.red },
            { label: "ODD Score", value: `${score}/100`, color: score >= 75 ? D.green : score >= 55 ? D.amber : D.red },
            { label: "Open Conditions", value: "3 HIGH · 3 MEDIUM", color: D.amber },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ padding: "14px 16px", borderRadius: 12, background: "var(--r2-card)", border: "1px solid var(--r2-border)" }}>
              <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--r2-faint)", marginBottom: 6 }}>{label}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color, letterSpacing: "-0.02em" }}>{value}</div>
            </div>
          ))}
        </div>

        <p>This report presents Alpine's operational due diligence findings for {fundName}. The review was conducted over 8 weeks using documentary analysis, direct verification, and manager interviews. The fund is assigned a <strong style={{ color: score >= 75 ? D.green : D.amber }}>{rating}</strong> rating with {score}/100 ODD score.</p>
        <p style={{ marginTop: 12 }}>Key findings: strong service provider infrastructure (Citco administrator, E&Y auditor), clean regulatory record (0 disclosures since 2018), and institutional-quality reporting. Material gaps: no dedicated CCO, no pre-trade compliance system, no succession plan. Recommend initial allocation subject to remediation of HIGH-severity conditions within 90–180 days.</p>
      </div>
    </Card>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────

// ── TAB: Analyst Call ─────────────────────────────────────────────────────────────

const CALL_PREP_SECTIONS = [
  {
    label: "P1 — Critical", color: "red" as const, topic: "Compliance Program",
    riskTag: "RED RISK", categoryTag: "Compliance",
    questions: [
      "CCO hiring timeline — candidate profile and target hire date?",
      "Pre-clearance system implementation plan and budget?",
      "Expert network chaperoning policy — current controls?",
    ],
  },
  {
    label: "P1 — Critical", color: "red" as const, topic: "Governance & Succession",
    riskTag: "RED RISK", categoryTag: "Key Person",
    questions: [
      "Written succession plan — when will it be board-approved?",
      "Key person insurance — coverage amount and current status?",
      "Board composition changes planned for 2026?",
    ],
  },
  {
    label: "P2 — Important", color: "amber" as const, topic: "Valuation Committee",
    riskTag: "YELLOW RISK", categoryTag: "Valuation",
    questions: [
      "Timeline for adding independent members?",
      "Current mark dispute resolution process?",
      "Level 3 asset classification methodology?",
    ],
  },
  {
    label: "P2 — Important", color: "amber" as const, topic: "Technology & Cybersecurity",
    riskTag: "YELLOW RISK", categoryTag: "Cybersecurity",
    questions: [
      "Cybersecurity insurance coverage details?",
      "Penetration testing frequency and last test date?",
      "Incident response plan — last tabletop exercise?",
    ],
  },
];

// Pre-filled sample answers for ~half the questions (keys = "sectionIdx-questionIdx")
const CALL_PREP_SAMPLE_NOTES: Record<string, string> = {
  "0-0": "Arjun confirmed CCO search is actively underway via Caldwell Partners. Target profile: 5–7 yrs compliance experience in venture or growth equity. One finalist currently in final-round interviews. Manager is targeting Q3 2026 hire, ahead of final fund close. Committed to sending written candidate brief and timeline by end of week. ACTION: Follow up in 5 business days if not received.",
  "0-2": "No formal written chaperoning policy in place. Priya stated all expert network calls are routed exclusively through GLG, and investment staff are verbally instructed to notify counsel before participating. No chaperone is present on calls. Manager acknowledged gap and agreed to draft a written policy by close. ACTION: Request draft policy as condition of close.",
  "1-0": "No written succession plan exists today. Arjun and Priya confirmed they will document interim management responsibilities and GP governance provisions by Q4 2026. Both noted the LPA key person trigger requires simultaneous unavailability of both partners, which they view as adequate. Alpine disagrees — single-partner incapacity scenario is unaddressed. Manager agreed to deliver written plan within 90 days. ACTION: Calendar 90-day follow-up.",
  "2-1": "Disputes escalated to the Valuation Committee per LPA. LP Advisory Board retains right to request independent valuation if they disagree with the Committee's conclusion. Priya noted zero mark disputes across Funds I–III since inception. No formal SLA for resolution timeline. Raj Patel (fractional CFO, joining Summer 2026) will formalize written dispute resolution protocol. Manager expects to have documented process in place before LP Advisory Board first meeting in Fund IV.",
  "3-0": "Active cyber liability policy through Chubb. $2M coverage limit; policy renews October 2026. Does not include social engineering rider. No prior claims. Alpine view: coverage limit is light relative to AUM and LP data held — recommend increasing to $5M minimum at next renewal. Manager agreed to review at renewal. ACTION: Confirm in writing that renewal will be at higher limit.",
  "3-1": "No independent penetration test has been conducted on manager systems to date. Manager relies on SOC 2 Type I from Apex (fund administrator) for infrastructure-level assurance. Internal IT for email, file storage, and LP portal is managed by Sarah Collins with no dedicated IT resource. Manager agreed this is a gap and committed to commissioning an external pen test by Q2 2026. ACTION ITEM — require completion prior to or shortly after final close.",
};

function CallPrepTab() {
  const { slug } = React.useContext(ReviewCtx);
  // key = "sectionIdx-questionIdx", value = note text
  const [notes, setNotes] = useState<Record<string, string>>(CALL_PREP_SAMPLE_NOTES);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/call-prep-notes?slug=${encodeURIComponent(slug)}`)
      .then((r) => r.json())
      .then((rows: Array<{ note_key: string; content: string }>) => {
        if (rows.length > 0) {
          const map: Record<string, string> = {};
          rows.forEach((row) => { map[row.note_key] = row.content; });
          // DB wins; keys not in DB fall back to sample notes
          setNotes((prev) => ({ ...prev, ...map }));
        }
      })
      .catch(() => {});
  }, [slug]);

  function toggle(key: string) {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  async function saveNote(key: string) {
    if (!slug) { toggle(key); return; }
    setSaving((prev) => ({ ...prev, [key]: true }));
    try {
      await fetch("/api/call-prep-notes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ review_slug: slug, note_key: key, content: notes[key] ?? "" }),
      });
    } finally {
      setSaving((prev) => ({ ...prev, [key]: false }));
      toggle(key);
    }
  }

  return (
    <div style={{ maxWidth: 960 }}>
      <Card style={{ padding: "28px 32px" }}>
        {/* Header */}
        <div style={{ paddingBottom: 20, borderBottom: "1px solid var(--r2-border)", marginBottom: 20 }}>
          <div style={{ fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase", color: "#7c3aed", fontWeight: 700, marginBottom: 6 }}>
            Alpine Due Diligence
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: "var(--r2-text)", marginBottom: 4 }}>Management Analyst Call</div>
          <div style={{ fontSize: 13, color: "var(--r2-muted)" }}>Ridgeline Capital Partners, LLC</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 16 }}>
            <span style={{ borderRadius: 999, border: "1px solid #fcd34d", background: "#fffbeb", padding: "5px 14px", fontSize: 13, fontWeight: 600, color: "#b45309" }}>6 risk observations</span>
            <span style={{ borderRadius: 999, border: "1px solid #fca5a5", background: "#fef2f2", padding: "5px 14px", fontSize: 13, fontWeight: 600, color: "#b91c1c" }}>3 HIGH severity blockers</span>
            <span style={{ borderRadius: 999, border: "1px solid var(--r2-border)", background: "var(--r2-surface2)", padding: "5px 14px", fontSize: 13, fontWeight: 600, color: "var(--r2-muted)" }}>4 discussion modules</span>
          </div>
        </div>

        {/* Call objective */}
        <div style={{ borderRadius: 14, border: "1px solid #fcd34d", background: "linear-gradient(135deg, rgba(255,251,235,0.95), #fff)", padding: "16px 20px", marginBottom: 24, display: "flex", gap: 14, alignItems: "flex-start" }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: "#fef3c7", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b45309" strokeWidth="2" strokeLinecap="round">
              <path d="M12 2v6M12 22v-6M4.93 4.93l4.24 4.24M14.83 14.83l4.24 4.24M2 12h6M22 12h-6M4.93 19.07l4.24-4.24M14.83 9.17l4.24-4.24" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700, color: "#b45309", marginBottom: 4 }}>Call Objective</div>
            <div style={{ fontSize: 13, lineHeight: 1.7, color: "#78350f" }}>
              Obtain management responses to 6 risk observations. Focus on remediation timelines for the 3 HIGH-severity findings preventing ACCEPT.
            </div>
          </div>
        </div>

        {/* Sections */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {CALL_PREP_SECTIONS.map((s, i) => {
            const isRed = s.color === "red";
            return (
              <div key={i} style={{ borderTop: "1px solid var(--r2-border)", paddingTop: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", paddingBottom: 10, borderBottom: "1px solid var(--r2-border)", marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700, color: "var(--r2-muted)", marginBottom: 4 }}>{s.label}</div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: "var(--r2-text)" }}>{s.topic}</div>
                  </div>
                  <span style={{ width: 30, height: 30, borderRadius: "50%", border: "1px solid var(--r2-border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "var(--r2-muted)", flexShrink: 0, marginTop: 2 }}>
                    {s.questions.length}
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {s.questions.map((q, j) => {
                    const key = `${i}-${j}`;
                    const isOpen = !!expanded[key];
                    const hasNote = !!(notes[key]?.trim());
                    return (
                      <div key={j} style={{ border: `1px solid ${isOpen ? "rgba(124,58,237,0.25)" : "var(--r2-border)"}`, borderRadius: 10, background: "var(--r2-surface)", overflow: "hidden", transition: "border-color 0.15s" }}>
                        {/* Question row */}
                        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "10px 14px" }}>
                          <span style={{ width: 22, height: 22, borderRadius: "50%", border: "1px solid var(--r2-border)", background: "var(--r2-surface2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "var(--r2-muted)", flexShrink: 0, marginTop: 1 }}>{j + 1}</span>
                          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, flex: 1 }}>
                            <span style={{ fontSize: 13, color: "var(--r2-text)", lineHeight: 1.5 }}>{q}</span>
                            <span style={{ fontSize: 10, fontWeight: 600, borderRadius: 999, padding: "2px 8px", background: isRed ? "#fef2f2" : "#fffbeb", color: isRed ? "#b91c1c" : "#b45309", border: `1px solid ${isRed ? "#fca5a5" : "#fcd34d"}` }}>{s.riskTag}</span>
                            <span style={{ fontSize: 10, fontWeight: 600, borderRadius: 999, padding: "2px 8px", background: "var(--r2-surface2)", color: "var(--r2-muted)", border: "1px solid var(--r2-border)" }}>{s.categoryTag}</span>
                            {hasNote && !isOpen && (
                              <span style={{ fontSize: 10, fontWeight: 600, borderRadius: 999, padding: "2px 8px", background: "rgba(124,58,237,0.08)", color: "#7c3aed", border: "1px solid rgba(124,58,237,0.2)" }}>Note saved</span>
                            )}
                          </div>
                          {/* Expand toggle */}
                          <button
                            onClick={() => toggle(key)}
                            title={isOpen ? "Collapse" : "Add call note"}
                            style={{
                              flexShrink: 0, background: "none", border: "none",
                              padding: "4px", cursor: "pointer",
                              color: "var(--r2-faint)",
                              display: "flex", alignItems: "center", justifyContent: "center",
                            }}
                          >
                            <svg width="13" height="13" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                              style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}>
                              <path d="M2 4l4 4 4-4" />
                            </svg>
                          </button>
                        </div>

                        {/* Notes panel */}
                        {isOpen && (
                          <div style={{ borderTop: "1px solid var(--r2-border)", padding: "12px 14px", background: "var(--r2-card)" }}>
                            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#7c3aed", marginBottom: 6 }}>
                              Call Notes
                            </div>
                            <textarea
                              autoFocus
                              placeholder="Record manager response, commitments, follow-up actions…"
                              value={notes[key] || ""}
                              onChange={(e) => setNotes((prev) => ({ ...prev, [key]: e.target.value }))}
                              style={{
                                width: "100%", minHeight: 88, resize: "vertical",
                                background: "var(--r2-surface)",
                                border: "1px solid var(--r2-border)",
                                borderRadius: 8, padding: "10px 12px",
                                fontSize: 13, color: "var(--r2-text)",
                                lineHeight: 1.6, outline: "none",
                                fontFamily: "inherit",
                              }}
                              onFocus={(e) => (e.target.style.borderColor = "rgba(124,58,237,0.4)")}
                              onBlur={(e) => (e.target.style.borderColor = "var(--r2-border)")}
                            />
                            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
                              <button
                                onClick={() => saveNote(key)}
                                disabled={saving[key]}
                                style={{
                                  padding: "5px 14px", fontSize: 12, fontWeight: 600,
                                  borderRadius: 7, border: "none",
                                  background: "#7c3aed", color: "#fff",
                                  cursor: saving[key] ? "default" : "pointer",
                                  opacity: saving[key] ? 0.65 : 1,
                                }}
                              >
                                {saving[key] ? "Saving…" : "Save & Close"}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

// ── TAB: Report Pending ────────────────────────────────────────────────────────

// ── TAB: Analysis (12-topic) ───────────────────────────────────────────────────

function AnalysisTopicsTab({ reviewData, onNavigate }: { reviewData: any; onNavigate: (id: string) => void }) {
  const { topicData, topicRatingOverrides } = React.useContext(ReviewCtx);
  const ratingMap: Record<number, { rating: string; name: string }> = {};
  for (const [num, td] of Object.entries(topicData)) {
    const n = parseInt(num);
    ratingMap[n] = { rating: topicRatingOverrides[n] || (td as any).rating, name: (td as any).name };
  }
  const oddTopics = reviewData?.odd_summary?.topics;
  if (oddTopics) {
    const nameToNum: Record<string, number> = {};
    for (const [num, td] of Object.entries(topicData)) {
      nameToNum[(td as any).name.toLowerCase().replace(/[^a-z]/g, "_").replace(/_+/g, "_")] = parseInt(num);
    }
    for (const [key, val] of Object.entries(oddTopics)) {
      const n = nameToNum[key.toLowerCase().replace(/[^a-z]/g, "_").replace(/_+/g, "_")];
      if (n && val) ratingMap[n] = { rating: ((val as any).rating || "").toUpperCase(), name: ratingMap[n]?.name || key };
    }
  }

  const topicNums = Object.keys(topicData).map(Number).sort((a, b) => a - b);

  return (
    <Card style={{ padding: 0, overflow: "hidden" }}>
      <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--r2-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--r2-text)" }}>{topicNums.length}-Topic ODD Assessment</span>
        <span style={{ fontSize: 11, color: "var(--r2-faint)" }}>Peer Comparison →</span>
      </div>
      {topicNums.map((num) => {
        const td = ratingMap[num];
        if (!td) return null;
        const r = td.rating;
        const dotColor = r === "GREEN" ? D.green : r === "RED" ? D.red : D.amber;
        const textColor = r === "GREEN" ? D.green : r === "RED" ? D.red : D.amber;
        return (
          <button key={num}
            onClick={() => onNavigate(`analysis-topic-${num}`)}
            style={{
              width: "100%", padding: "18px 18px", display: "flex", alignItems: "center",
              justifyContent: "space-between", borderBottom: "1px solid var(--r2-border)",
              cursor: "pointer", transition: "background 0.1s", background: "none",
              border: "none", borderBottomWidth: 1, borderBottomStyle: "solid", borderBottomColor: "var(--r2-border)",
              textAlign: "left",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--r2-surface2)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: dotColor, flexShrink: 0, display: "inline-block" }} />
              <span style={{ fontSize: 13, color: "var(--r2-text)" }}>{num}. {td.name}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: textColor, letterSpacing: "0.06em" }}>{r}</span>
              <svg width="12" height="12" viewBox="0 0 10 10" fill="none" stroke="var(--r2-faint)" strokeWidth="1.5" strokeLinecap="round"><path d="M4 2l3 3-3 3" /></svg>
            </div>
          </button>
        );
      })}
    </Card>
  );
}

// ── Overview2Tab ──────────────────────────────────────────────────────────────


function OvHealthRing({ size = 118, showCenterLegend = true }: { size?: number; showCenterLegend?: boolean }) {
  const { topicData, topicRatingOverrides } = React.useContext(ReviewCtx);
  const [animated, setAnimated] = React.useState(false);
  React.useEffect(() => { const t = setTimeout(() => setAnimated(true), 120); return () => clearTimeout(t); }, []);
  let green = 0, yellow = 0, red = 0;
  for (const [num, td] of Object.entries(topicData)) {
    const r = (topicRatingOverrides[parseInt(num)] || (td as any).rating || "").toUpperCase();
    if (r === "GREEN") green++; else if (r === "YELLOW") yellow++; else if (r === "RED") red++;
  }
  const total = Object.keys(topicData).length;
  const strokeW = 9;
  const radius = (size - strokeW) / 2;
  const circ = 2 * Math.PI * radius;
  const gap = 4;
  const segments = [
    { count: green,  color: "#10B981" },
    { count: yellow, color: "#F59E0B" },
    { count: red,    color: "#EF4444" },
  ].filter(s => s.count > 0);
  const usableCirc = circ - segments.length * gap;
  let off = 0;
  const arcs = segments.map(s => {
    const len = (s.count / total) * usableCirc;
    const arc = { ...s, dasharray: `${len} ${circ - len}`, dashoffset: -off };
    off += len + gap;
    return arc;
  });
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="var(--r2-border)" strokeWidth={strokeW} />
        {arcs.map((seg, i) => (
          <circle key={i} cx={size/2} cy={size/2} r={radius} fill="none"
            stroke={seg.color} strokeWidth={strokeW} strokeLinecap="round"
            strokeDasharray={animated ? seg.dasharray : `0 ${circ}`}
            strokeDashoffset={seg.dashoffset}
            style={{ transition: `stroke-dasharray 0.9s ease-out ${i * 0.12}s` }}
          />
        ))}
      </svg>
      {showCenterLegend && (
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4 }}>
          <div style={{ display: "flex", gap: 6 }}>
            <span style={{ fontSize: 10, color: "#10B981", fontWeight: 700 }}>{green}G</span>
            <span style={{ fontSize: 10, color: "#F59E0B", fontWeight: 700 }}>{yellow}Y</span>
            <span style={{ fontSize: 10, color: "#EF4444", fontWeight: 700 }}>{red}R</span>
          </div>
          <span style={{ fontSize: 9, color: "var(--r2-faint)" }}>{total} topics</span>
        </div>
      )}
    </div>
  );
}

function Overview2Tab({ reviewData, onNavigate }: { reviewData: any; onNavigate: (id: string) => void }) {
  const { topicData, mock, slug, riskObsOverrides, onRiskObsSaved } = React.useContext(ReviewCtx);
  const staticObs = mock.risk_observations as RiskObs[];
  const riskObs = staticObs.map((o) => riskObsOverrides[o.id] ? { ...o, ...riskObsOverrides[o.id] } : o);
  const topicNums = Object.keys(topicData).map(Number).sort((a, b) => a - b);
  const ovActs = topicNums.length <= 8
    ? [
        { label: "Act I: The Manager", topics: topicNums.slice(0, 4) },
        { label: "Act II: The Fund", topics: topicNums.slice(4, 8) },
      ]
    : [
        { label: "Act I: The Manager", topics: topicNums.slice(0, 4) },
        { label: "Act II: The Fund", topics: topicNums.slice(4, 8) },
        { label: "Act III: The Numbers", topics: topicNums.slice(8, 12) },
      ];

  return (
    <div style={{ display: "grid", gap: 14 }}>

      {/* ── Hero card ── */}
      <Card style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "24px 28px 20px", borderBottom: "1px solid var(--r2-border)" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
            {/* Left */}
            <div style={{ flex: "1 1 340px" }}>
              <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--r2-faint)", marginBottom: 10 }}>
                Investment Recommendation
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", marginBottom: 14 }}>
                <span style={{ fontSize: 36, fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1, color: "var(--r2-text)" }}>
                  WATCHLIST
                </span>
                <span style={{ fontSize: 11, fontWeight: 600, padding: "5px 14px", borderRadius: 999, border: "1px solid var(--r2-border)", background: "var(--r2-surface2)", color: "var(--r2-muted)" }}>
                  Conditional Approval
                </span>
              </div>
              <p style={{ fontSize: 13, color: "var(--r2-muted)", lineHeight: 1.7, maxWidth: 540 }}>
                Alpine&rsquo;s operational due diligence review of{" "}
                <strong style={{ color: "var(--r2-text)" }}>{reviewData?.name || "Ridgeline Capital Partners"}</strong>{" "}
                recommends a <strong style={{ color: "var(--r2-text)" }}>watchlist</strong> rating.
                Investment performance and service provider quality are strong, but compliance infrastructure and governance gaps preclude full accept status at this time.
              </p>
              <div style={{ marginTop: 14, borderLeft: "3px solid var(--r2-border)", paddingLeft: 12, fontSize: 12, color: "var(--r2-faint)", lineHeight: 1.65 }}>
                Conditions to upgrade: hire a dedicated CCO, implement pre-trade compliance monitoring, formalize succession plan, establish independent valuation committee.
              </div>
            </div>
            {/* Right: score + fund facts */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14, minWidth: 200 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                <div style={{ position: "relative", width: 108, height: 108, flexShrink: 0 }}>
                  <OvHealthRing size={108} showCenterLegend={false} />
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
                    <span style={{ fontSize: 36, fontWeight: 900, lineHeight: 1, color: "var(--r2-text)" }}>68</span>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "var(--r2-text)" }}>ODD Score</div>
                  <div style={{ fontSize: 11, color: "var(--r2-faint)" }}>/100</div>
                  <div style={{ fontSize: 11, color: "var(--r2-faint)" }}>Percentile: 34th</div>
                </div>
              </div>
              {[
                ["AUM", reviewData?.aum || "$2.31B"],
                ["Strategy", "Global L/S Equity"],
                ["Domicile", "Delaware LP + Cayman"],
                ["Fund NAV", "$1.84B"],
              ].map(([label, value]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: 12 }}>
                  <span style={{ color: "var(--r2-faint)" }}>{label}</span>
                  <span style={{ color: "var(--r2-text)", fontWeight: 500, textAlign: "right" }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Topic dot strip */}
        <div style={{ padding: "12px 28px", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--r2-faint)", marginRight: 4 }}>{topicNums.length}-topic status</span>
          {topicNums.map(num => {
            const r = ((topicData[num] as any)?.rating || "").toUpperCase();
            const bg = r === "GREEN" ? "#10B981" : r === "YELLOW" ? "#F59E0B" : r === "RED" ? "#EF4444" : "var(--r2-border)";
            return (
              <button key={num} onClick={() => onNavigate(`analysis-topic-${num}`)}
                title={(topicData[num] as any)?.name || `Topic ${num}`}
                style={{ width: 18, height: 18, borderRadius: 4, background: bg, border: "none", cursor: "pointer", flexShrink: 0, transition: "opacity 0.15s" }}
                onMouseEnter={e => (e.currentTarget.style.opacity = "0.65")}
                onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
              />
            );
          })}
        </div>
      </Card>

      {/* ── Act cards ── */}
      {ovActs.map(act => (
        <div key={act.label}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--r2-faint)" }}>{act.label}</span>
            <div style={{ flex: 1, height: 1, background: "var(--r2-border)" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 10 }}>
            {act.topics.map(num => {
              const td = topicData[num] as any;
              if (!td) return null;
              const r = (td.rating || "").toUpperCase();
              const dotBg = r === "GREEN" ? "#10B981" : r === "YELLOW" ? "#F59E0B" : r === "RED" ? "#EF4444" : "var(--r2-border)";
              const tagBg = r === "GREEN" ? "rgba(16,185,129,0.10)" : r === "YELLOW" ? "rgba(245,158,11,0.10)" : r === "RED" ? "rgba(239,68,68,0.10)" : "var(--r2-surface2)";
              const tagCol = r === "GREEN" ? "#10B981" : r === "YELLOW" ? "#F59E0B" : r === "RED" ? "#EF4444" : "var(--r2-faint)";
              return (
                <button key={num} onClick={() => onNavigate(`analysis-topic-${num}`)}
                  style={{ background: "var(--r2-card)", border: "1px solid var(--r2-border)", borderRadius: 14, padding: "14px 16px", textAlign: "left", cursor: "pointer", transition: "border-color 0.15s", width: "100%" }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--r2-muted)")}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--r2-border)")}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ width: 7, height: 7, borderRadius: "50%", background: dotBg, flexShrink: 0, display: "inline-block" }} />
                      <span style={{ fontSize: 12, fontWeight: 600, color: "var(--r2-text)" }}>{td.name}</span>
                    </div>
                    <span style={{ fontSize: 9, fontWeight: 700, padding: "3px 8px", borderRadius: 999, background: tagBg, color: tagCol, letterSpacing: "0.06em", textTransform: "uppercase" }}>{r}</span>
                  </div>
                  <p style={{ fontSize: 11, color: "var(--r2-faint)", lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {td.summary || "Analysis pending"}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* ── Risk Observations ── */}
      {riskObs.length > 0 && (() => {
        const grouped: Record<string, any[]> = {};
        riskObs.forEach((ro: any) => {
          const key = ro.topic || "Other";
          if (!grouped[key]) grouped[key] = [];
          grouped[key].push(ro);
        });
        return (
          <div style={{ display: "grid", gap: 0 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--r2-faint)" }}>Risk Observations</span>
              <span style={{ fontSize: 10, color: "var(--r2-faint)" }}>
                <span style={{ color: "#EF4444", fontWeight: 700 }}>{riskObs.filter((r: any) => r.severity === "HIGH").length}</span> high &nbsp;·&nbsp;
                <span style={{ color: "#F59E0B", fontWeight: 700 }}>{riskObs.filter((r: any) => r.severity === "MEDIUM").length}</span> medium
              </span>
            </div>
            <div style={{ display: "grid", gap: 10 }}>
              {Object.entries(grouped).map(([topic, items]) => (
                <Card key={topic} style={{ padding: 0, overflow: "hidden" }}>
                  <div style={{ padding: "8px 16px", background: "var(--r2-surface2)", borderBottom: "1px solid var(--r2-border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--r2-faint)" }}>{topic}</span>
                    <span style={{ fontSize: 10, color: "var(--r2-faint)" }}>{items.length} observation{items.length !== 1 ? "s" : ""}</span>
                  </div>
                  {items.map((ro: any, i: number) => (
                    <div key={ro.id} style={{ borderTop: i > 0 ? "1px solid var(--r2-border)" : undefined }}>
                      <RiskObsRow obs={ro} slug={slug} override={riskObsOverrides[ro.id]} onSaved={onRiskObsSaved} />
                    </div>
                  ))}
                </Card>
              ))}
            </div>
          </div>
        );
      })()}
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function Review2Page() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = params?.slug as string;
  const fromContext = searchParams?.get("from") ?? null;

  const [activeTab, setActiveTab] = useState("overview");
  const [reviewData, setReviewData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<"dark" | "light">("light");
  const [topicRatingOverrides, setTopicRatingOverrides] = useState<Record<number, string>>({});
  const [riskObsOverrides, setRiskObsOverrides] = useState<Record<string, RiskObsEdit>>({});

  const handleRiskObsSaved = useCallback((id: string, edit: RiskObsEdit) => {
    setRiskObsOverrides((prev) => ({ ...prev, [id]: edit }));
  }, []);

  // Apply CSS custom properties
  useEffect(() => {
    const root = document.documentElement;
    const applyVars = (d: typeof D) => {
      root.style.setProperty("--r2-bg", d.bg);
      root.style.setProperty("--r2-panel", d.panel);
      root.style.setProperty("--r2-surface", d.surface);
      root.style.setProperty("--r2-surface2", d.surface2);
      root.style.setProperty("--r2-card", d.card);
      root.style.setProperty("--r2-cardHover", d.cardHover);
      root.style.setProperty("--r2-border", d.border);
      root.style.setProperty("--r2-text", d.text);
      root.style.setProperty("--r2-muted", d.muted);
      root.style.setProperty("--r2-faint", d.faint);
      root.style.setProperty("--r2-green", d.green);
      root.style.setProperty("--r2-amber", d.amber);
      root.style.setProperty("--r2-red", d.red);
      root.style.setProperty("--r2-violet", d.violet);
    };

    const prevBrand = root.getAttribute("data-brand");
    const prevTheme = root.getAttribute("data-theme");
    root.setAttribute("data-theme", "light");
    root.setAttribute("data-brand", "blackrock");
    applyVars(DL);

    return () => {
      if (prevBrand) root.setAttribute("data-brand", prevBrand);
      else root.removeAttribute("data-brand");
      if (prevTheme) root.setAttribute("data-theme", prevTheme);
      else root.removeAttribute("data-theme");
      // Remove r2 vars
      Object.keys(D).forEach((k) => root.style.removeProperty(`--r2-${k}`));
    };
  }, []);

  const toggleTheme = useCallback(() => {
    const root = document.documentElement;
    const next: "dark" | "light" = theme === "dark" ? "light" : "dark";
    const vars = next === "dark" ? D : DL;
    Object.entries(vars).forEach(([k, v]) => root.style.setProperty(`--r2-${k}`, v));
    setTheme(next);
  }, [theme]);

  // Fetch data
  useEffect(() => {
    if (!slug) return;
    alpineDemoBrand.api.getReview(slug)
      .then((d: any) => { setReviewData(d?.review || d); setLoading(false); })
      .catch(() => { setReviewData(null); setLoading(false); });
    fetch(`/api/topic-rating?slug=${encodeURIComponent(slug)}`)
      .then((r) => r.json())
      .then((rows: Array<{ topic_number: number; rating: string }>) => {
        const map: Record<number, string> = {};
        rows.forEach((row) => { map[row.topic_number] = row.rating; });
        setTopicRatingOverrides(map);
      })
      .catch(() => {});
    fetch(`/api/risk-obs?slug=${encodeURIComponent(slug)}`)
      .then((r) => r.json())
      .then((rows: Array<{ id: string; severity: string; title: string; detail: string; remediation: string }>) => {
        const map: Record<string, RiskObsEdit> = {};
        rows.forEach((row) => { map[row.id] = { severity: row.severity, title: row.title, detail: row.detail, remediation: row.remediation }; });
        setRiskObsOverrides(map);
      })
      .catch(() => {});
  }, [slug]);

  const fundName = reviewData?.name || (slug ? slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "Fund Review");
  const isDark = theme === "dark";
  const isTrellis = slug === "trellis-capital-iv";
  const reviewCtxValue: ReviewCtxValue = {
    topicData: isTrellis ? TRELLIS_TOPIC_DATA : RIDGELINE_TOPIC_DATA,
    mock: (isTrellis ? TRELLIS_MOCK : RIDGELINE_MOCK) as any,
    vaultData: isTrellis ? TRELLIS_VAULT_DATA : RIDGELINE_VAULT_DATA,
    followUpMock: (isTrellis ? TRELLIS_FOLLOW_UP_MOCK : RIDGELINE_FOLLOW_UP_MOCK) as typeof RIDGELINE_FOLLOW_UP_MOCK,
    slug,
    topicRatingOverrides,
    riskObsOverrides,
    onRiskObsSaved: handleRiskObsSaved,
  };

  function renderTabContent() {
    if (loading) return (
      <div style={{ display: "flex", justifyContent: "center", padding: 80 }}>
        <div style={{ width: 32, height: 32, borderRadius: "50%", border: `3px solid ${D.text}`, borderTopColor: "transparent", animation: "spin 0.8s linear infinite" }} />
      </div>
    );

    switch (activeTab) {
      // ── Workflow tabs (use original components) ──
      case "collection":
        return <DocumentCollectionView mock={reviewCtxValue.followUpMock} onNavigate={setActiveTab} brandName="Alpine ODD" slug={slug} />;
      case "reg-verification":
        return reviewData?.id
          ? <VerificationTab reviewId={reviewData.id} api={alpineDemoBrand.api} slug={slug} />
          : <PlaceholderTab label="Verification" detail="Registry and verification data loads with a linked review." />;
      case "analysis":
        return <AnalysisTopicsTab reviewData={reviewData} onNavigate={setActiveTab} />;
      default:
        if (activeTab.startsWith("analysis-topic-")) {
          const topicNum = parseInt(activeTab.replace("analysis-topic-", ""));
          return (
            <TopicPage
              topicNumber={topicNum}
              onNavigate={(id) => {
                if (id === "analysis") setActiveTab("analysis");
                else if (id.startsWith("analysis-topic-")) setActiveTab(id);
                else setActiveTab(id);
              }}
              alpineReviewId={null}
              topicDataOverride={isTrellis ? TRELLIS_TOPIC_DATA : undefined}
              mockOverride={isTrellis ? TRELLIS_MOCK as any : undefined}
              vaultDataOverride={isTrellis ? TRELLIS_VAULT_DATA : undefined}
              slug={slug}
              initialRating={topicRatingOverrides[topicNum]}
              onRatingChange={(num, rating) => setTopicRatingOverrides((prev) => ({ ...prev, [num]: rating }))}
              initialRiskOverrides={riskObsOverrides}
              onRiskObsSaved={handleRiskObsSaved}
            />
          );
        }
        return <div style={{ padding: 40, textAlign: "center", color: "var(--r2-faint)" }}>Coming soon</div>;
      case "call-prep":
        return <CallPrepTab />;
      case "report-gen":
        return (
          <div className="report-hide-callprep">
            <style>{`
              .report-hide-callprep .flex.items-center.gap-1.border-b button:nth-child(4) { display: none !important; }
            `}</style>
            <ReportWithMemo alpineReviewId={null} brReviewId={reviewData?.id} finalReportPending={!isTrellis} isTrellis={isTrellis} topicRatingOverrides={topicRatingOverrides} onRatingChange={(num, rating) => setTopicRatingOverrides((prev) => ({ ...prev, [num]: rating }))} slug={slug} />
          </div>
        );
      // ── Detail tabs (Review2Page custom components) ──
      case "overview": return (
        <Overview2Tab
          reviewData={reviewData}
          onNavigate={(id) => {
            if (id.startsWith("analysis-topic-")) setActiveTab(id);
            else if (REVIEW_NAV.find((n) => n.id === id)) setActiveTab(id);
            else setActiveTab("analysis");
          }}
        />
      );
      case "odd-summary": return <OddSummaryTab reviewData={reviewData} />;
      case "risk-obs": return <RiskObsTab />;
      case "fund-profile": return <FundProfileTab reviewData={reviewData} isTrellis={isTrellis} />;
      case "peer-compare": return <PeerCompareTab reviewData={reviewData} />;
      case "doc-vault": return <DocVaultTab />;
      case "ic-memo": return <ICMemoTab reviewData={reviewData} />;
      case "verification": return <VerificationTab2 reviewData={reviewData} isTrellis={isTrellis} />;
      case "monitoring": return <MonitoringTab />;
      case "full-report": return <FullReportTab reviewData={reviewData} />;
    }
  }

  return (
    <ReviewCtx.Provider value={reviewCtxValue}>
    <>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ background: "var(--r2-bg)", minHeight: "100vh", color: "var(--r2-text)", fontFamily: "ui-sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
        <div style={{ width: "min(1440px, calc(100% - 80px))", margin: "24px auto" }}>

          {/* ── Topbar ── */}
          <header style={{
            display: "flex", justifyContent: "space-between", alignItems: "center", gap: 18,
            padding: "14px 20px", border: "1px solid var(--r2-border)", borderRadius: 18,
            background: isDark ? "rgba(8,17,29,0.88)" : "rgba(255,255,255,0.92)",
            backdropFilter: "blur(16px)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <a href="/portfolio2" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
                <div style={{
                  width: 26, height: 26, borderRadius: 6, flexShrink: 0,
                  background: "linear-gradient(135deg, #10B981 0%, #F59E0B 50%, #7B2CBF 100%)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#F5F0E8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 18L12 6L20 18" /></svg>
                </div>
              </a>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--r2-text)" }}>{fundName}</div>
                <div style={{ fontSize: 12, color: "var(--r2-muted)" }}>Portfolio / Review / ODD Workspace</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <button onClick={toggleTheme} style={{ padding: "10px 16px", fontSize: 13, borderRadius: 999, border: "1px solid var(--r2-border)", background: "transparent", color: "var(--r2-muted)", cursor: "pointer" }}>
                {theme === "dark" ? "☀ Light" : "☾ Dark"}
              </button>
              <button
                onClick={() => {
                  const tab = fromContext === "active-reviews" ? "active-reviews" : fromContext === "fund-universe" ? "fund-universe" : null;
                  router.push(tab ? `/portfolio2?tab=${tab}` : "/portfolio2");
                }}
                style={{ padding: "10px 16px", fontSize: 13, borderRadius: 16, border: "1px solid var(--r2-border)", background: "transparent", color: "var(--r2-muted)", cursor: "pointer" }}
              >
                ← {fromContext === "active-reviews" ? "Active Reviews" : fromContext === "fund-universe" ? "Fund Universe" : "Portfolio"}
              </button>
              <button
                onClick={() => {
                  const d = new Date();
                  const stamp = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
                  const file = isTrellis ? "/demo-docs/sample_vc_fund_iv_alt.pdf" : "/demo-docs/ridgeline_ddq_2026.pdf";
                  const baseName = (fundName || "ODD_Report").replace(/[^A-Za-z0-9]+/g, "_").replace(/^_|_$/g, "");
                  const a = document.createElement("a");
                  a.href = file;
                  a.download = `${stamp}-${baseName}_ODD_Report.pdf`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                }}
                style={{ padding: "10px 18px", fontSize: 13, borderRadius: 16, border: "1px solid var(--r2-border)", background: isDark ? "rgba(239,244,251,0.08)" : "rgba(15,23,42,0.06)", color: "var(--r2-text)", cursor: "pointer", fontWeight: 600 }}
              >
                ⬇ Export Report
              </button>
            </div>
          </header>

          {/* ── Workspace ── */}
          <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 16, marginTop: 14, alignItems: "start" }}>
            <ReviewSidebar active={activeTab} onNavigate={setActiveTab} docCount={(isTrellis ? TRELLIS_VAULT_DATA : RIDGELINE_VAULT_DATA).documents.length} />
            <div style={{ display: "grid", gap: 16 }}>
              <main style={{ display: "grid", gap: 16, paddingBottom: 48 }}>
                {renderTabContent()}
              </main>
            </div>
          </div>
        </div>
      </div>
    </>
    </ReviewCtx.Provider>
  );
}
