"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GREEN, AMBER, VIOLET, BORDER as NAV_BORDER } from "@/lib/constants";

const SESSION_KEY = "alpine_demo_user";

// ─── Design tokens matching the PDF ───────────────────────────────────────────
const NAVY   = "#0f1f3d";
const CREAM  = "#f5f0e8";
const GOLD   = "#c8923a";
const PASS_C = "#2d6a4f";
const STALL_C= "#b8730a";
const FAIL_C = "#b5361c";
const BODY   = "#1a2744";
const MUTED  = "#4a5568";
const BORDER = "#ddd8cf";

function SectionHero({ num, title }: { num: string; title: string }) {
  return (
    <div className="relative overflow-hidden" style={{ background: NAVY, padding: "48px 48px 40px" }}>
      <div
        className="absolute right-8 top-1/2 -translate-y-1/2 font-bold select-none pointer-events-none"
        style={{ fontSize: 160, color: "rgba(255,255,255,0.06)", lineHeight: 1, letterSpacing: "-0.05em" }}
      >
        {num}
      </div>
      <p style={{ fontSize: 11, fontWeight: 700, color: GOLD, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 12 }}>
        Section {num}
      </p>
      <h2 style={{ fontSize: 40, fontWeight: 700, color: "#fff", lineHeight: 1.15, letterSpacing: "-0.02em", margin: 0, maxWidth: 560 }}>
        {title}
      </h2>
    </div>
  );
}

function RatingBadge({ rating }: { rating: "PASS" | "STALL" | "FAIL" }) {
  const color = rating === "PASS" ? PASS_C : rating === "STALL" ? STALL_C : FAIL_C;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 10px", borderRadius: 4, border: `1px solid ${color}40`,
      background: `${color}12`, color, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: color, display: "inline-block" }} />
      {rating}
    </span>
  );
}

function Tag({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <span style={{
      fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
      padding: "2px 7px", borderRadius: 3, background: `${color}18`, color,
    }}>
      {children}
    </span>
  );
}

function Divider() {
  return <div style={{ borderTop: `1px solid ${BORDER}`, margin: "40px 0" }} />;
}

function PullQuote({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: NAVY, borderRadius: 8, padding: "28px 36px", margin: "36px 0" }}>
      <p style={{ fontSize: 17, fontStyle: "italic", color: "#e8e0d0", lineHeight: 1.7, margin: 0 }}>
        {children}
      </p>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: GOLD, marginBottom: 8, marginTop: 0 }}>
      {children}
    </p>
  );
}

export default function WhitepaperPage() {
  const router = useRouter();
  const [demoAccess, setDemoAccess] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) { router.replace("/login?redirect=/whitepaper"); return; }
    try {
      const user = JSON.parse(raw);
      setDemoAccess(!!user.demo_access);
    } catch {
      router.replace("/login?redirect=/whitepaper");
    }
  }, [router]);

  useEffect(() => {
    const prevent = (e: Event) => e.preventDefault();
    const blockKeys = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (["c", "a", "x", "u", "s"].includes(e.key.toLowerCase())) e.preventDefault();
      }
    };
    document.addEventListener("copy", prevent);
    document.addEventListener("cut", prevent);
    document.addEventListener("contextmenu", prevent);
    document.addEventListener("selectstart", prevent);
    document.addEventListener("keydown", blockKeys);
    return () => {
      document.removeEventListener("copy", prevent);
      document.removeEventListener("cut", prevent);
      document.removeEventListener("contextmenu", prevent);
      document.removeEventListener("selectstart", prevent);
      document.removeEventListener("keydown", blockKeys);
    };
  }, []);

  const headerBg  = darkMode ? "#111111" : "#ffffff";
  const headerBdr = darkMode ? "rgba(255,255,255,0.1)" : NAV_BORDER;

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: darkMode ? "#1a1a1a" : "#ebebeb", transition: "background 0.2s" }}>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header>
        <div style={{ height: 2, background: `linear-gradient(90deg, ${GREEN}, ${AMBER}, ${VIOLET})` }} />
        <div style={{ borderBottom: `1px solid ${headerBdr}`, background: headerBg, transition: "background 0.2s, border-color 0.2s" }}>
          <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Link href="/">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={darkMode ? "/alpine-logo-white.svg" : "/alpine-logo-dark.svg?v=5"} alt="Alpine Due Diligence" style={{ height: 40, width: "auto" }} />
            </Link>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {demoAccess && (
                <Link href="/portfolio2" style={{
                  fontSize: 13, fontWeight: 600, textDecoration: "none", padding: "6px 16px", borderRadius: 6,
                  background: darkMode ? "#7c3aed" : "#0f1f3d", color: "#fff", transition: "background 0.2s",
                }}>
                  Open Demo →
                </Link>
              )}
              <button
                onClick={() => setDarkMode(d => !d)}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  background: darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)",
                  border: darkMode ? "1px solid rgba(255,255,255,0.15)" : "1px solid rgba(0,0,0,0.12)",
                  color: darkMode ? "rgba(255,255,255,0.65)" : "rgba(0,0,0,0.5)",
                  borderRadius: 6, padding: "6px 12px", fontSize: 12, fontWeight: 600,
                  letterSpacing: "0.06em", cursor: "pointer", transition: "all 0.2s",
                }}
              >
                {darkMode ? "☀ Light" : "☾ Dark"}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Content ────────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, userSelect: "none", padding: "0 16px 64px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", background: CREAM, boxShadow: darkMode ? "0 8px 40px rgba(0,0,0,0.4)" : "0 4px 24px rgba(0,0,0,0.12)", borderRadius: 2 }}>

        {/* ── COVER ───────────────────────────────────────────────────────── */}
        <div style={{ background: NAVY, padding: "0 0 0 0" }}>
          {/* Top bar */}
          <div style={{ padding: "20px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid rgba(255,255,255,0.1)` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "rgba(255,255,255,0.7)" }}>ALPINE × ACEPHALT</span>
              <span style={{ color: "rgba(255,255,255,0.2)" }}>|</span>
              <span style={{ fontSize: 11, letterSpacing: "0.12em", color: "rgba(255,255,255,0.4)" }}>CONFIDENTIAL</span>
            </div>
          </div>

          {/* Hero */}
          <div style={{ padding: "80px 48px 64px", maxWidth: 960, margin: "0 auto" }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", color: GOLD, textTransform: "uppercase", marginBottom: 32 }}>
              Venture Capital Due Diligence White Paper
            </p>
            <h1 style={{ fontSize: 72, fontWeight: 800, color: "#fff", lineHeight: 1.05, letterSpacing: "-0.03em", margin: "0 0 8px" }}>
              The LP<br />Readiness
            </h1>
            <h1 style={{ fontSize: 72, fontWeight: 800, color: GOLD, lineHeight: 1.05, letterSpacing: "-0.03em", margin: "0 0 36px" }}>
              Gap
            </h1>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, maxWidth: 560, margin: "0 0 48px" }}>
              Institutional ODD scorecards are useful tools. But the variable allocation committees need to read is not current state — it is readiness trajectory. This paper explains why the distinction matters, and what to do about it.
            </p>
            <div style={{ borderTop: `1px solid rgba(255,255,255,0.12)`, paddingTop: 24, display: "flex", gap: 32, flexWrap: "wrap" }}>
              {["Eight-Chapter ODD Framework", "Structural vs Fixable Analysis"].map(t => (
                <div key={t} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: GOLD, display: "inline-block" }} />
                  <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", color: "rgba(255,255,255,0.5)", textTransform: "uppercase" }}>{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Logos */}
          <div style={{ borderTop: `1px solid rgba(255,255,255,0.1)`, padding: "20px 48px", display: "flex", alignItems: "center", gap: 32 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="Alpine" style={{ height: 32, width: 32, objectFit: "contain", borderRadius: 6 }} />
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#fff", margin: "0 0 2px" }}>Alpine Due Diligence</p>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", margin: 0 }}>alpinedd.com</p>
              </div>
            </div>
            <div style={{ width: 1, height: 32, background: "rgba(255,255,255,0.15)" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/acephalt-logo-transparent.png" alt="Acephalt" style={{ height: 32, width: 32, objectFit: "contain" }} />
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#fff", margin: "0 0 2px" }}>Acephalt</p>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", margin: 0 }}>acephalt.com</p>
              </div>
            </div>
            <div style={{ marginLeft: "auto" }}>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.15)", padding: "4px 10px", borderRadius: 4 }}>CONFIDENTIAL</span>
            </div>
          </div>
        </div>

        {/* ── EXECUTIVE SUMMARY ────────────────────────────────────────────── */}
        <div style={{ background: NAVY, padding: "48px 48px 40px", marginTop: 2 }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>Executive Summary</p>
          <p style={{ fontSize: 26, fontStyle: "italic", color: "#e8e0d0", lineHeight: 1.5, margin: "12px 0 0", maxWidth: 640 }}>
            Institutional ODD scorecards are useful, but readiness trajectory is what allocation committees need to read.
          </p>
        </div>

        <div style={{ maxWidth: 960, margin: "0 auto", padding: "48px 48px 0" }}>
          <p style={{ fontSize: 15, color: BODY, lineHeight: 1.75, margin: "0 0 36px" }}>
            Emerging VC managers rarely fail institutional operational due diligence randomly. Their scorecards tend to follow a predictable profile: clean fund terms, acceptable service providers, and cooperative transparency; yellow governance, operations, and valuation infrastructure; and red compliance or cybersecurity gaps.
          </p>

          {/* Stats */}
          <div style={{ border: `1px solid ${BORDER}`, borderRadius: 8, padding: "28px 32px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24, marginBottom: 32 }}>
            {[
              { stat: "$29T", label: "Projected global alternatives AUM by 2029 — the constraint is not finding managers, it is processing them" },
              { stat: "2",    label: "Chapters most likely to fail — Compliance and Cybersecurity — require only attention, not scale", color: FAIL_C },
              { stat: "1",    label: "Diligence cycle is often enough to close the fixable column entirely, if the right items are started first", color: PASS_C },
            ].map(({ stat, label, color }) => (
              <div key={stat}>
                <p style={{ fontSize: 40, fontWeight: 800, color: color ?? BODY, margin: "0 0 8px", letterSpacing: "-0.03em" }}>{stat}</p>
                <p style={{ fontSize: 12, color: MUTED, lineHeight: 1.6, margin: 0 }}>{label}</p>
              </div>
            ))}
          </div>

          {/* Core Claim */}
          <div style={{ borderLeft: `3px solid ${GOLD}`, background: "#faf7f2", borderRadius: "0 8px 8px 0", padding: "20px 24px", marginBottom: 32 }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", color: GOLD, textTransform: "uppercase", margin: "0 0 10px" }}>Core Claim</p>
            <p style={{ fontSize: 15, fontStyle: "italic", color: BODY, lineHeight: 1.65, margin: 0 }}>
              Structural findings resolve with scale. Fixable findings resolve with attention. Institutional readiness begins when a manager can tell the difference and act on it.
            </p>
          </div>

          <p style={{ fontSize: 15, color: BODY, lineHeight: 1.75, margin: "0 0 32px" }}>
            The scorecard is a snapshot of state. It does not, by itself, show whether a manager is moving toward institutional readiness. The strongest signal is trajectory — a manager that closes the fixable column before the next diligence cycle looks materially different from one that carries the same findings forward.
          </p>

          {/* Concept table */}
          <div style={{ border: `1px solid ${BORDER}`, borderRadius: 8, overflow: "hidden", marginBottom: 48 }}>
            <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", background: NAVY, padding: "10px 20px" }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", margin: 0 }}>Concept</p>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", margin: 0 }}>What It Means</p>
            </div>
            {[
              { concept: "Structural findings", desc: "Reflect fund size, age, headcount, or capital — and usually resolve as the firm scales." },
              { concept: "Fixable findings",    desc: "Reflect documentation gaps, vendor engagement, or role reassignment — and can often be closed with attention and a modest budget." },
              { concept: "Trajectory",          desc: "The strongest signal — a manager that closes the fixable column before the next diligence cycle looks materially different from one that carries the same findings forward." },
            ].map(({ concept, desc }, i) => (
              <div key={concept} style={{ display: "grid", gridTemplateColumns: "200px 1fr", padding: "14px 20px", borderTop: `1px solid ${BORDER}`, background: i % 2 === 1 ? "#faf7f2" : "#fff" }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: BODY, margin: 0 }}>{concept}</p>
                <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.6, margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── TABLE OF CONTENTS ────────────────────────────────────────────── */}
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 48px 48px" }}>
          <Divider />
          <SectionLabel>Contents</SectionLabel>
          <h2 style={{ fontSize: 32, fontWeight: 700, color: BODY, margin: "0 0 32px", letterSpacing: "-0.02em" }}>Table of Contents</h2>
          <div style={{ borderTop: `1px solid ${BORDER}` }}>
            {[
              { num: "01", title: "The Emerging VC Readiness Pattern",                    page: "01" },
              { num: "02", title: "Findings That Signal Trajectory, Findings That Don't", page: "05" },
              { num: "03", title: "Structural vs Fixable",                                page: "06" },
              { num: "04", title: "Closing the Fixable Column",                           page: "08" },
              { num: "05", title: "Where Readiness Compounds",                            page: "09" },
              { num: "06", title: "About the Authors",                                    page: "11" },
              { num: "A",  title: "Readiness Summary by ODD Chapter",                     page: "12", appendix: true },
            ].map(({ num, title, page, appendix }) => (
              <div key={num} style={{ display: "flex", alignItems: "baseline", padding: "16px 0", borderBottom: `1px solid ${BORDER}`, gap: 16 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: GOLD, whiteSpace: "nowrap", minWidth: 80 }}>
                  {appendix ? `Appendix ${num}` : `Section ${num}`}
                </span>
                <span style={{ fontSize: 15, color: BODY, flex: 1 }}>{title}</span>
                <span style={{ fontSize: 13, color: MUTED, minWidth: 24, textAlign: "right" }}>{page}</span>
              </div>
            ))}
          </div>

          {/* Rating legend */}
          <div style={{ margin: "40px 0 32px" }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", color: MUTED, textTransform: "uppercase", marginBottom: 16 }}>ODD Chapter Rating Legend</p>
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
              {([["PASS", PASS_C, "Chapter meets institutional threshold"], ["STALL", STALL_C, "Constrained by emerging-manager scale"], ["FAIL", FAIL_C, "Non-revenue infrastructure deferred"]] as const).map(([r, , d]) => (
                <div key={r} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <RatingBadge rating={r} />
                  <span style={{ fontSize: 12, color: MUTED }}>{d}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pattern at a glance */}
          <div style={{ background: "#faf7f2", border: `1px solid ${BORDER}`, borderRadius: 8, padding: "24px 28px" }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", color: MUTED, textTransform: "uppercase", marginBottom: 16 }}>The Emerging VC Pattern at a Glance</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {[
                { ch: "Fund Structure & Terms",   r: "PASS"  },
                { ch: "Service Providers",         r: "PASS"  },
                { ch: "LP Communications",         r: "PASS"  },
                { ch: "Governance",                r: "STALL" },
                { ch: "Investment Ops",            r: "STALL" },
                { ch: "Valuation",                 r: "STALL" },
                { ch: "Compliance",                r: "FAIL"  },
                { ch: "Cybersecurity",             r: "FAIL"  },
              ].map(({ ch, r }) => {
                const c = r === "PASS" ? PASS_C : r === "STALL" ? STALL_C : FAIL_C;
                return (
                  <div key={ch} style={{ border: `1px solid ${c}40`, background: `${c}0d`, borderRadius: 6, padding: "8px 14px", display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 13, color: BODY }}>{ch}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: c, letterSpacing: "0.08em" }}>{r}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── SECTION 01 ───────────────────────────────────────────────────── */}
        <SectionHero num="01" title="The Emerging VC Readiness Pattern" />
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "48px 48px 0" }}>
          <p style={{ fontSize: 17, fontStyle: "italic", color: BODY, lineHeight: 1.65, margin: "0 0 32px" }}>
            Emerging venture capital managers fail institutional operational due diligence in remarkably consistent ways. The failures are not random, not idiosyncratic, and not primarily a function of individual care or carelessness. They follow a pattern legible to anyone who has read enough reports.
          </p>
          <Divider />
          <h3 style={{ fontSize: 20, fontWeight: 700, color: BODY, margin: "0 0 16px" }}>The Pattern</h3>
          <p style={{ fontSize: 15, color: BODY, lineHeight: 1.75, margin: "0 0 16px" }}>
            The pattern usually begins with areas that come back clean. Fund terms are often acceptable — the LPA drafted by a reputable law firm, the fee structure within market norms, the waterfall mechanics standard, and clawback language in place. Service provider arrangements are also usually acceptable. The administrator is a known name, the auditor has a recognizable bench, and the banker is institutional. The diligence experience itself is often cooperative.
          </p>
          <p style={{ fontSize: 15, color: BODY, lineHeight: 1.75, margin: "0 0 24px" }}>
            Then the scorecard darkens in a familiar sequence. Governance comes back yellow because the only internal operations role is thin and primarily administrative, and because a two-partner firm has no real succession depth. Investment operations come back yellow because the accounting books are maintained almost entirely by the administrator, with limited internal shadowing, and because the portfolio is still tracked in Excel. Valuation comes back yellow because there is no formal valuation committee and the front office approves its own marks.
          </p>
          <PullQuote>
            "Two chapters then tend to come back red — Compliance and Cybersecurity. Their remedies require only attention and modest budget, not scale."
          </PullQuote>
          <p style={{ fontSize: 15, color: BODY, lineHeight: 1.75, margin: "0 0 40px" }}>
            This is not a description of one manager. It is a composite of the emerging manager profile. The specifics vary, but the shape is stable enough that a seasoned ODD analyst can often predict the broad scorecard before opening the binder — based on little more than fund size, team headcount, and vintage.
          </p>

          <Divider />
          <h3 style={{ fontSize: 20, fontWeight: 700, color: BODY, margin: "0 0 12px" }}>The Three-Band Profile</h3>
          <p style={{ fontSize: 15, color: BODY, lineHeight: 1.75, margin: "0 0 28px" }}>
            Mapped against the eight-chapter ODD framework, the emerging manager profile resolves into three distinct bands — each with a different underlying cause.
          </p>

          {[
            {
              rating: "PASS" as const,
              subtitle: "Structure is imported from the market rather than built from scratch. Legal counsel, administrators, auditors, and standard fund formation practices do much of the work.",
              chapters: ["Ch. 4 — Fund Structure, Terms & Investor Alignment", "Ch. 5 — Service Providers, Delegation & Oversight", "Ch. 8 — Manager Transparency & LP Communications"],
            },
            {
              rating: "STALL" as const,
              subtitle: "Fund size forces real trade-offs. Yellows here are the visible consequences of operating below the AUM threshold at which full back-office functions become affordable.",
              chapters: ["Ch. 1 — Manager, Ownership & Governance", "Ch. 6 — Investment Operations & Portfolio Controls", "Ch. 7 — Valuation, Asset Existence & Investor Reporting"],
            },
            {
              rating: "FAIL" as const,
              subtitle: "These chapters require deliberate investment in non-revenue infrastructure. Neither program generates returns. Neither appears in the pitch deck. Both require budget and attention that emerging managers often allocate elsewhere.",
              chapters: ["Ch. 2 — Legal, Regulatory & Compliance", "Ch. 3 — Technology, Cybersecurity & Business Resilience"],
            },
          ].map(({ rating, subtitle, chapters }) => {
            const c = rating === "PASS" ? PASS_C : rating === "STALL" ? STALL_C : FAIL_C;
            return (
              <div key={rating} style={{ display: "grid", gridTemplateColumns: "80px 1fr", border: `1px solid ${BORDER}`, borderRadius: 8, overflow: "hidden", marginBottom: 12 }}>
                <div style={{ background: `${c}18`, borderRight: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <RatingBadge rating={rating} />
                </div>
                <div style={{ padding: "20px 24px" }}>
                  <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.6, margin: "0 0 14px", fontStyle: "italic" }}>{subtitle}</p>
                  {chapters.map(ch => (
                    <p key={ch} style={{ fontSize: 14, fontWeight: 600, color: BODY, margin: "0 0 4px" }}>{ch}</p>
                  ))}
                </div>
              </div>
            );
          })}

          <PullQuote>
            Institutional readiness is judged at two levels. The manager-level scorecard is where diligence stalls are most common. But readiness compounds through the portfolio as well — a fund that passes its own ODD can still be held back at the next raise if its portfolio companies cannot withstand follow-on diligence.
          </PullQuote>
        </div>

        {/* ── FIGURE 1 ─────────────────────────────────────────────────────── */}
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 48px 0" }}>
          <Divider />
          <SectionLabel>Figure 1</SectionLabel>
          <h3 style={{ fontSize: 22, fontWeight: 700, color: BODY, margin: "0 0 8px" }}>A Typical Emerging VC ODD Profile</h3>
          <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.6, margin: "0 0 24px", borderLeft: `3px solid ${BORDER}`, paddingLeft: 16 }}>
            Composite across the eight-chapter institutional ODD framework. The typical emerging VC profile resolves into three bands: chapters that usually pass, chapters that stall at emerging-manager scale, and chapters that fail because non-revenue infrastructure has been deferred.
          </p>
          <div style={{ border: `1px solid ${BORDER}`, borderRadius: 8, overflow: "hidden", marginBottom: 48 }}>
            <div style={{ display: "grid", gridTemplateColumns: "48px 280px 120px 1fr", background: NAVY, padding: "10px 20px", gap: 16 }}>
              {["Ch.", "Chapter", "Rating", "Typical Findings"].map(h => (
                <p key={h} style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", margin: 0 }}>{h}</p>
              ))}
            </div>
            {[
              { n: "1", ch: "Manager, Ownership & Governance",          r: "STALL" as const, findings: "Single back-office role; no formal succession plan; employee background checks completed internally." },
              { n: "2", ch: "Legal, Regulatory & Compliance",           r: "FAIL"  as const, findings: "Investment professional acting as compliance officer; no attestation or annual training program; written policy set at ERA minimums only." },
              { n: "3", ch: "Technology, Cybersecurity & Business Resilience", r: "FAIL" as const, findings: "No formal cyber policy; no incident response plan; no written business continuity plan; no endpoint controls or training program." },
              { n: "4", ch: "Fund Structure, Terms & Investor Alignment",r: "PASS"  as const, findings: "Market-standard terms; reasonable fee structure; clawback and key person provisions in place." },
              { n: "5", ch: "Service Providers, Delegation & Oversight", r: "PASS"  as const, findings: "Established administrator, auditor, and banker; continuation of prior-fund arrangements." },
              { n: "6", ch: "Investment Operations & Portfolio Controls", r: "STALL" as const, findings: "No internal accounting or cash tracking; Excel-based portfolio management; reliance on admin for books and records." },
              { n: "7", ch: "Valuation, Asset Existence & Investor Reporting", r: "STALL" as const, findings: "No formal valuation committee; front office approves its own marks; waterfall maintained in Excel." },
              { n: "8", ch: "Manager Transparency & LP Communications",  r: "PASS"  as const, findings: "Cooperative diligence posture; proactive disclosure of weaknesses; responsive to follow-up." },
            ].map(({ n, ch, r, findings }, i) => (
              <div key={n} style={{ display: "grid", gridTemplateColumns: "48px 280px 120px 1fr", padding: "14px 20px", borderTop: `1px solid ${BORDER}`, background: i % 2 === 1 ? "#faf7f2" : "#fff", gap: 16, alignItems: "start" }}>
                <p style={{ fontSize: 12, color: MUTED, margin: 0 }}>{n}</p>
                <p style={{ fontSize: 14, fontWeight: 500, color: BODY, margin: 0 }}>{ch}</p>
                <div><RatingBadge rating={r} /></div>
                <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.6, margin: 0 }}>{findings}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── SECTION 02 ───────────────────────────────────────────────────── */}
        <SectionHero num="02" title={"Findings That Signal Trajectory, Findings That Don't"} />
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "48px 48px 0" }}>
          <p style={{ fontSize: 17, fontStyle: "italic", color: BODY, lineHeight: 1.65, margin: "0 0 32px" }}>
            The archetype establishes which findings tend to appear on an emerging manager's scorecard. It does not establish which of those findings tend to move.
          </p>
          <p style={{ fontSize: 15, color: BODY, lineHeight: 1.75, margin: "0 0 32px" }}>
            Over a two-to-three-year window between diligence cycles, some findings resolve reliably. Others do not. The division between the two is not well correlated with the severity of the finding at the moment of review. A red in Compliance and a yellow in Governance can sit on the same scorecard — and the red will often clear before the yellow. This is counterintuitive if the scorecard is read as a ranking, but it is consistent with how emerging firms actually evolve.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 40 }}>
            {[
              {
                label: "Findings That Resolve",
                sub: "Addressable without prior growth",
                color: PASS_C,
                items: [
                  "Reassigning compliance officer from investment professional to head of operations",
                  "Engaging a compliance consultant for attestations, training, and expanded policy set",
                  "Engaging a cybersecurity vendor for policy, IRP, endpoint controls, and training",
                  "Writing a formal business continuity plan",
                ],
              },
              {
                label: "Findings That Persist",
                sub: "Tied to scale constraints",
                color: STALL_C,
                items: [
                  "Single operations professional without back-office depth — resolves only when AUM supports a full-time head of finance",
                  "Absence of formal succession plan — resolves only when the partnership expands beyond two principals",
                  "LPAC formation — arrives only when fund scale and LP composition make it relevant",
                  "External valuation agent — resolves only when portfolio size makes the cost proportionate",
                ],
              },
            ].map(({ label, sub, color, items }) => (
              <div key={label} style={{ border: `1px solid ${BORDER}`, borderRadius: 8, padding: "24px", background: "#fff" }}>
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color, margin: "0 0 8px" }}>{label}</p>
                <p style={{ fontSize: 16, fontWeight: 700, color: BODY, margin: "0 0 20px" }}>{sub}</p>
                <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                  {items.map(it => (
                    <li key={it} style={{ display: "flex", gap: 12, marginBottom: 12, alignItems: "flex-start" }}>
                      <span style={{ color, marginTop: 2, fontSize: 16, lineHeight: 1, flexShrink: 0 }}>—</span>
                      <span style={{ fontSize: 13, color: MUTED, lineHeight: 1.6 }}>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* ── SECTION 03 ───────────────────────────────────────────────────── */}
        <SectionHero num="03" title="Structural vs Fixable" />
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "48px 48px 0" }}>
          <p style={{ fontSize: 17, fontStyle: "italic", color: BODY, lineHeight: 1.65, margin: "0 0 32px" }}>
            The observational cut in Section 2 maps onto an operational distinction that emerging managers can use directly. Findings on an ODD scorecard are either structural or fixable — and in most cases, the distinction follows from what the finding is tied to.
          </p>
          <SectionLabel>Figure 2</SectionLabel>
          <h3 style={{ fontSize: 22, fontWeight: 700, color: BODY, margin: "0 0 8px" }}>Structural vs Fixable</h3>
          <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.6, margin: "0 0 24px", borderLeft: `3px solid ${BORDER}`, paddingLeft: 16 }}>
            Which findings describe scale, and which findings signal readiness trajectory. Findings that persist across diligence cycles are not always the findings that matter most.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", border: `1px solid ${BORDER}`, borderRadius: 8, overflow: "hidden", marginBottom: 48 }}>
            {[
              {
                type: "Structural",
                icon: "+",
                sub: "Tied to fund size, age, headcount, or capital",
                desc: "These findings resolve when the underlying variable changes — and not before.",
                note: "Usually defensible when acknowledged clearly, contextualized against scale, and paired with a size-triggered remediation plan.",
                noteColor: MUTED,
                items: ["Single internal operations role without back-office depth", "No formal succession plan at a two-partner firm", "LPAC formation deferred until fund scale warrants", "No internal accounting shadow of administrator", "Limited back-office oversight capacity"],
                color: STALL_C,
              },
              {
                type: "Fixable",
                icon: "✓",
                sub: "Tied to documentation, vendors, or role reassignment",
                desc: "These findings can often be resolved within a quarter with intent and a modest budget — regardless of fund size.",
                note: "More difficult to defend when left unresolved — these findings signal whether the manager has chosen to operate as an institutional firm.",
                noteColor: FAIL_C,
                items: ["Investment professional acting as compliance officer", "No attestation or annual training program", "No written cybersecurity policy", "No incident response plan or endpoint controls", "No written business continuity plan", "No formal valuation committee charter", "Background checks completed internally"],
                color: PASS_C,
              },
            ].map(({ type, sub, desc, note, noteColor, items, color }, i) => (
              <div key={type} style={{ padding: "28px 28px", borderRight: i === 0 ? `1px solid ${BORDER}` : "none", background: i === 1 ? "#faf7f2" : "#fff" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <span style={{ width: 28, height: 28, borderRadius: "50%", border: `1px solid ${color}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color, background: `${color}10` }}>
                    {i === 0 ? "+" : "✓"}
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color }}>{type}</span>
                </div>
                <p style={{ fontSize: 18, fontWeight: 700, color: BODY, margin: "0 0 8px", lineHeight: 1.3 }}>{sub}</p>
                <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.6, margin: "0 0 20px" }}>{desc}</p>
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: MUTED, margin: "0 0 12px" }}>Typical Examples</p>
                <ul style={{ margin: "0 0 20px", padding: 0, listStyle: "none" }}>
                  {items.map(it => (
                    <li key={it} style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "flex-start" }}>
                      <span style={{ color, marginTop: 4, fontSize: 8, flexShrink: 0 }}>●</span>
                      <span style={{ fontSize: 13, color: MUTED, lineHeight: 1.6 }}>{it}</span>
                    </li>
                  ))}
                </ul>
                <div style={{ borderLeft: `3px solid ${noteColor}40`, paddingLeft: 14 }}>
                  <p style={{ fontSize: 12, fontStyle: "italic", color: noteColor, lineHeight: 1.6, margin: 0 }}>{note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── SECTION 04 ───────────────────────────────────────────────────── */}
        <SectionHero num="04" title="Closing the Fixable Column" />
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "48px 48px 0" }}>
          <p style={{ fontSize: 17, fontStyle: "italic", color: BODY, lineHeight: 1.65, margin: "0 0 24px" }}>
            The practical question for an emerging manager preparing for institutional diligence is not whether to address the fixable column — but in what order.
          </p>
          <p style={{ fontSize: 15, color: BODY, lineHeight: 1.75, margin: "0 0 32px" }}>
            A manager who starts with the slowest items and works inward will arrive at the next diligence cycle with most of the column still open. A manager who works the list in the right order will arrive with most of it closed. For most emerging managers, the fixable column closes in roughly this sequence:
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 48 }}>
            {[
              { n: "01", area: "Governance", urgency: "Immediate",          title: "Reassign Compliance Oversight",       critical: false, desc: "Move the compliance officer role from an investment professional to the head of operations. This is a governance decision and formal role reassignment — it costs nothing and can be done today." },
              { n: "02", area: "Compliance", urgency: "Critical Path",      title: "Engage a Compliance Consultant",      critical: true,  desc: "Design and implement attestations, annual training, and an expanded policy set beyond ERA minimums." },
              { n: "03", area: "Cybersecurity", urgency: "Longest Lead Time",title: "Engage a Cybersecurity Vendor",      critical: true,  desc: "Produce a formal policy, incident response plan, training regime, and associated technical controls. Typically the longest item on the calendar." },
              { n: "04", area: "Resilience", urgency: "Depends on Step 03", title: "Write a Formal Business Continuity Plan", critical: false, desc: "Once the cybersecurity vendor can inform the technical provisions, the BCP can be drafted and executed. Sequenced behind item 3." },
              { n: "05", area: "Valuation",  urgency: "Documentation",      title: "Form a Valuation Committee on Paper", critical: false, desc: "Establish a formal charter, approval workflow, and meeting cadence. Can be done without an external agent at early fund sizes." },
            ].map(({ n, area, urgency, title, critical, desc }) => (
              <div key={n} style={{ display: "flex", gap: 20, border: `1px solid ${BORDER}`, borderRadius: 8, overflow: "hidden" }}>
                <div style={{ background: NAVY, minWidth: 56, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{n}</span>
                </div>
                <div style={{ padding: "20px 20px 20px 0" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: MUTED, letterSpacing: "0.06em" }}>{area}</span>
                    <span style={{ fontSize: 9, color: MUTED }}>·</span>
                    <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", color: MUTED, textTransform: "uppercase" }}>{urgency}</span>
                    {critical && <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: FAIL_C, border: `1px solid ${FAIL_C}40`, padding: "1px 7px", borderRadius: 3 }}>On the Critical Path</span>}
                  </div>
                  <p style={{ fontSize: 16, fontWeight: 700, color: BODY, margin: "0 0 8px" }}>{title}</p>
                  <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.6, margin: 0 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── SECTION 05 ───────────────────────────────────────────────────── */}
        <SectionHero num="05" title="Where Readiness Compounds" />
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "48px 48px 0" }}>
          <p style={{ fontSize: 17, fontStyle: "italic", color: BODY, lineHeight: 1.65, margin: "0 0 32px" }}>
            Fund-side readiness is necessary, but it is not sufficient. The same diligence logic applies one level down — at the portfolio level — and one level inward, at the operational structure that every diligence finding ultimately tests.
          </p>
          <div style={{ display: "flex", border: `1px solid ${BORDER}`, borderRadius: 8, overflow: "hidden", marginBottom: 36 }}>
            {[
              { num: "I",   title: "Manager-Level Readiness",  desc: "Fund terms, governance structure, compliance program, cybersecurity posture, operational controls" },
              { num: "II",  title: "Portfolio-Level Readiness", desc: "Cap table cleanliness, IP assignment, contract execution, data room discipline, security posture" },
              { num: "III", title: "Track Record & Next Raise", desc: "Portfolio diligence outcomes flow back through the track record to the manager's next institutional cycle" },
            ].map(({ num, title, desc }, i) => (
              <div key={num} style={{ flex: 1, padding: "28px 24px", borderRight: i < 2 ? `1px solid ${BORDER}` : "none", background: i % 2 === 1 ? "#faf7f2" : "#fff", position: "relative" }}>
                <p style={{ fontSize: 28, fontStyle: "italic", fontWeight: 700, color: `${BODY}20`, margin: "0 0 12px" }}>{num}</p>
                <p style={{ fontSize: 15, fontWeight: 700, color: GOLD, margin: "0 0 8px" }}>{title}</p>
                <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.6, margin: "0 0 12px" }}>{desc}</p>
                {i < 2 && <p style={{ fontSize: 18, color: MUTED, margin: 0, textAlign: "right" }}>→</p>}
              </div>
            ))}
          </div>
          <h3 style={{ fontSize: 20, fontWeight: 700, color: BODY, margin: "0 0 16px" }}>Readiness Compounds Through the Portfolio</h3>
          <p style={{ fontSize: 15, color: BODY, lineHeight: 1.75, margin: "0 0 16px" }}>
            An emerging VC manager that passes its own ODD can still face the same readiness gap at the next raise if its underlying portfolio companies cannot withstand diligence conducted by others. Follow-on leads, co-investors, lenders, strategic partners, and eventual acquirers all run their own versions of deal-side diligence. A portfolio that enters those processes with unresolved findings can produce delay, markdown, renegotiation, or walk-away — each of which flows back to the fund's track record.
          </p>
          <p style={{ fontSize: 15, color: BODY, lineHeight: 1.75, margin: "0 0 32px" }}>
            At the seed and early stages, portfolio company readiness tends to cluster around a recognizable set of findings. Cap tables may not have been cleaned up after founder departures or early angel rounds. Customer contracts may have been agreed informally. IP assignments may not have been completed when contractors left. Data rooms may exist as shared drives rather than structured diligence artifacts.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 48 }}>
            {[
              { label: "Structural at Seed Stage", color: STALL_C, text: "A seed-stage company cannot reasonably be expected to operate a finance function that would pass a strategic acquirer's quality-of-earnings review." },
              { label: "Fixable at Seed Stage",    color: PASS_C,  text: "A seed-stage company can reasonably be expected to maintain clean IP assignments, executed customer contracts, a current cap table, and a data room producible on request." },
            ].map(({ label, color, text }) => (
              <div key={label} style={{ border: `1px solid ${color}30`, background: `${color}08`, borderRadius: 8, padding: "20px 24px" }}>
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color, margin: "0 0 12px" }}>{label}</p>
                <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.65, margin: 0 }}>{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── SECTION 06 ───────────────────────────────────────────────────── */}
        <SectionHero num="06" title="About the Authors" />
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "48px 48px 0" }}>
          <Divider />
          {[
            {
              name: "Alpine Due Diligence Inc.",
              tag: "Operational Due Diligence · alpinedd.com",
              contact: "azhang@alpinedd.com · alpinedd.com",
              desc: "Alpine Due Diligence Inc. is an operational due diligence firm serving institutional allocators, family offices, and venture capital managers. Alpine produces institutional ODD reports through a structured eight-chapter framework, supported by verification against SEC EDGAR and other regulatory registers, media screening, and source-based citation trails. The firm is built by practitioners with direct institutional ODD experience and reflects the diligence workflows LPs actually use.",
            },
            {
              name: "Acephalt Inc.",
              tag: "Due Diligence Platform · acephalt.com",
              contact: "winnicent.zuo@acephalt.com · acephalt.com",
              desc: "Acephalt Inc. is a due diligence platform that helps venture capital investors build confidence in the companies they invest in. By evaluating a company in minutes instead of months, Acephalt gives venture capital firms their own AI analyst that can work continuously across company data rooms. The platform helps forecast company performance, review market dynamics, and draft investment memos for stakeholders.",
            },
          ].map(({ name, tag, contact, desc }) => (
            <div key={name} style={{ display: "grid", gridTemplateColumns: "80px 1fr", gap: 24, paddingBottom: 32, marginBottom: 32, borderBottom: `1px solid ${BORDER}` }}>
              <div style={{ width: 64, height: 64, background: NAVY, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 20, fontWeight: 700, color: GOLD }}>A</span>
              </div>
              <div>
                <p style={{ fontSize: 18, fontWeight: 700, color: BODY, margin: "0 0 4px" }}>{name}</p>
                <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: MUTED, margin: "0 0 16px" }}>{tag}</p>
                <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.7, margin: "0 0 12px" }}>{desc}</p>
                <p style={{ fontSize: 13, color: GOLD, margin: 0 }}>{contact}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── APPENDIX A ───────────────────────────────────────────────────── */}
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 48px 0" }}>
          <Divider />
          <SectionLabel>Appendix A</SectionLabel>
          <h2 style={{ fontSize: 32, fontWeight: 700, color: BODY, margin: "0 0 8px", letterSpacing: "-0.02em" }}>Readiness Summary<br />by ODD Chapter</h2>
          <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.6, margin: "0 0 28px" }}>
            A reference view of the eight ODD chapters with representative structural and fixable findings. Intended as a diagnostic map rather than a ranking of severity or a prescriptive remediation order.
          </p>
          <div style={{ border: `1px solid ${BORDER}`, borderRadius: 8, overflow: "hidden", marginBottom: 48 }}>
            <div style={{ display: "grid", gridTemplateColumns: "48px 220px 100px 1fr", background: NAVY, padding: "10px 20px", gap: 16 }}>
              {["Ch.", "Chapter", "Status", "Representative Findings"].map(h => (
                <p key={h} style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", margin: 0 }}>{h}</p>
              ))}
            </div>
            {[
              { n: "01", ch: "Manager, Ownership & Governance",          r: "STALL" as const, findings: [{ t: "STRUCTURAL", f: "Single internal operations role; no formal succession plan." }, { t: "FIXABLE", f: "Background checks completed internally." }] },
              { n: "02", ch: "Legal, Regulatory & Compliance",           r: "FAIL"  as const, findings: [{ t: "FIXABLE", f: "Investment professional acting as compliance officer; no attestation cycle; no annual compliance training." }] },
              { n: "03", ch: "Technology, Cybersecurity & Business Resilience", r: "FAIL" as const, findings: [{ t: "FIXABLE", f: "No cybersecurity policy; no incident response plan or endpoint controls; no written BCP." }] },
              { n: "04", ch: "Fund Structure, Terms & Investor Alignment",r: "PASS"  as const, findings: [{ t: "STRUCTURAL", f: "Terms consistent with market norms; LPAC deferred until fund scale warrants." }] },
              { n: "05", ch: "Service Providers, Delegation & Oversight", r: "PASS"  as const, findings: [{ t: "STRUCTURAL", f: "Institutional administrator, auditor, and banker." }, { t: "FIXABLE", f: "Engagement letters executed prior to first close." }] },
              { n: "06", ch: "Investment Operations & Portfolio Controls", r: "STALL" as const, findings: [{ t: "STRUCTURAL", f: "No internal accounting records; no back-office oversight of administrator." }, { t: "FIXABLE", f: "No formal allocation policy." }] },
              { n: "07", ch: "Valuation, Asset Existence & Investor Reporting", r: "STALL" as const, findings: [{ t: "FIXABLE", f: "No formal valuation committee." }, { t: "STRUCTURAL", f: "Front office approves marks; waterfall maintained in Excel." }] },
              { n: "08", ch: "Manager Transparency & LP Communications",  r: "PASS"  as const, findings: [{ t: "STRUCTURAL", f: "Cooperative diligence posture; proactive disclosure; no restrictions on review scope." }] },
            ].map(({ n, ch, r, findings }, i) => (
              <div key={n} style={{ display: "grid", gridTemplateColumns: "48px 220px 100px 1fr", padding: "16px 20px", borderTop: `1px solid ${BORDER}`, background: i % 2 === 1 ? "#faf7f2" : "#fff", gap: 16, alignItems: "start" }}>
                <p style={{ fontSize: 12, color: MUTED, margin: 0 }}>{n}</p>
                <p style={{ fontSize: 14, fontWeight: 500, color: BODY, margin: 0 }}>{ch}</p>
                <div><RatingBadge rating={r} /></div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {findings.map(({ t, f }) => {
                    const tc = t === "STRUCTURAL" ? STALL_C : PASS_C;
                    return (
                      <div key={t} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                        <Tag color={tc}>{t}</Tag>
                        <span style={{ fontSize: 13, color: MUTED, lineHeight: 1.6 }}>{f}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── FOOTER ───────────────────────────────────────────────────────── */}
        <div style={{ background: NAVY, padding: "32px 48px", marginTop: 0 }}>
          <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", alignItems: "center", gap: 32, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="Alpine" style={{ height: 30, width: 30, objectFit: "contain", borderRadius: 6 }} />
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: "#fff", margin: "0 0 2px" }}>Alpine Due Diligence</p>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", margin: 0 }}>alpinedd.com</p>
              </div>
            </div>
            <div style={{ width: 1, height: 28, background: "rgba(255,255,255,0.15)" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/acephalt-logo-transparent.png" alt="Acephalt" style={{ height: 30, width: 30, objectFit: "contain" }} />
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: "#fff", margin: "0 0 2px" }}>Acephalt</p>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", margin: 0 }}>acephalt.com</p>
              </div>
            </div>
            <p style={{ marginLeft: "auto", fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em" }}>
              ALPINE × ACEPHALT · CONFIDENTIAL
            </p>
          </div>
        </div>

      </div>
      </div>
    </div>
  );
}
