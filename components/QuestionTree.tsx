"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronRight } from "lucide-react";
import { useInView } from "framer-motion";
import { BG_CARD, BG_VIOLET, INK, SECONDARY, MUTED, VIOLET, BORDER, BORDER_SUBTLE, LS_BODY } from "@/lib/constants";

function CountUp({ target, duration = 1.6, delay = 0 }: { target: number; duration?: number; delay?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let raf: number;
    const startTime = performance.now() + delay * 1000;

    const update = (now: number) => {
      if (now < startTime) { raf = requestAnimationFrame(update); return; }
      const elapsed = (now - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCount(Math.round(eased * target));
      if (progress < 1) raf = requestAnimationFrame(update);
    };

    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, [isInView, target, duration, delay]);

  return <span ref={ref}>{count}</span>;
}

type FundType = { code: string; label: string; strategies: string[] };

const STRUCTURES = [
  { id: "OE",        label: "Open-End",   desc: "NAV-based, redemptions, liquidity" },
  { id: "CE",        label: "Closed-End", desc: "Capital calls, waterfall, clawback" },
  { id: "Evergreen", label: "Evergreen",  desc: "Perpetual, periodic windows" },
];

const FUND_TYPES: Record<string, FundType[]> = {
  OE: [
    { code: "HF",  label: "Hedge Fund",    strategies: ["Long/Short Equity", "Global Macro", "Event-Driven", "Relative Value", "Quantitative", "Multi-Strategy", "Crypto/Digital", "Managed Futures"] },
    { code: "CR",  label: "Credit",        strategies: ["Investment Grade", "High Yield", "ABS/Structured"] },
    { code: "RE",  label: "Real Estate",   strategies: ["Core/Core+", "Listed REIT"] },
    { code: "FOF", label: "Fund of Funds", strategies: ["HF Fund of Funds"] },
  ],
  CE: [
    { code: "PE",  label: "Private Equity",  strategies: ["Buyout", "Growth Equity", "Direct Lending", "Secondaries", "Co-Investment", "Infrastructure", "Distressed"] },
    { code: "VC",  label: "Venture Capital", strategies: ["Early Stage", "Growth Stage", "Sector-Focused"] },
    { code: "RE",  label: "Real Estate",     strategies: ["Opportunistic", "Value-Add", "RE Debt"] },
    { code: "CR",  label: "Credit",          strategies: ["Direct Lending", "CLO/Structured", "Distressed Credit", "Mezzanine"] },
    { code: "FOF", label: "Fund of Funds",   strategies: ["PE FOF", "HF FOF", "VC FOF"] },
  ],
  Evergreen: [
    { code: "PE",    label: "Private Equity", strategies: ["Perpetual PE"] },
    { code: "CR",    label: "Credit",         strategies: ["Evergreen Lending / BDC"] },
    { code: "RE",    label: "Real Estate",    strategies: ["Non-Traded REIT"] },
    { code: "INFRA", label: "Infrastructure", strategies: ["Perpetual Infrastructure"] },
  ],
};

const STATS = [
  { value: "472", label: "Due diligence questions" },
  { value: "36",  label: "Strategy profiles" },
  { value: "12",  label: "ODD topics" },
];

export default function QuestionTree() {
  const [active, setActive] = useState("OE");

  return (
    <section id="engine" className="py-24 px-6" style={{ background: BG_VIOLET }}>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="max-w-2xl mb-14">
          <p className="font-sans text-[11px] uppercase mb-3" style={{ color: VIOLET, fontWeight: 600, letterSpacing: "0.1em" }}>
            The Engine
          </p>
          <h2 className="font-heading mb-4" style={{ fontSize: "2rem", fontWeight: 700, lineHeight: 1.08, letterSpacing: "-0.038em", color: INK }}>
            Every fund type. Every strategy.
          </h2>
          <p className="font-body" style={{ fontSize: "1.0625rem", lineHeight: 1.65, letterSpacing: LS_BODY, color: SECONDARY }}>
            Alpine routes the right questions based on fund structure, type, and strategy.
            No irrelevant questions. No gaps.
          </p>
        </div>

        {/* Structure tabs */}
        <div className="flex gap-2 mb-8 p-1 rounded-card mx-auto w-fit" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
          {STRUCTURES.map((s) => (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              className="rounded-btn px-4 py-2 text-left transition-all"
              style={{
                background: active === s.id ? "#EEF4FF" : "transparent",
                boxShadow: active === s.id ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
              }}
            >
              <span className="font-body text-[13px] block" style={{ color: active === s.id ? INK : MUTED, fontWeight: 500, letterSpacing: "-0.01em" }}>
                {s.label}
              </span>
              <span className="font-mono text-[10px] block mt-1 hidden sm:block" style={{ color: MUTED }}>
                {s.desc}
              </span>
            </button>
          ))}
        </div>

        {/* Fund type cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {(FUND_TYPES[active] ?? []).map((ft) => (
            <div
              key={ft.code}
              className="rounded-card p-5"
              style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="font-mono text-[11px] px-1.5 py-0.5 rounded-micro" style={{ background: BORDER_SUBTLE, color: MUTED, fontWeight: 600, letterSpacing: "0.04em" }}>
                  {ft.code}
                </span>
                <span className="font-body text-[13px]" style={{ color: INK, fontWeight: 600, letterSpacing: "-0.01em" }}>
                  {ft.label}
                </span>
                <span className="font-mono text-[11px] ml-auto" style={{ color: MUTED }}>
                  {ft.strategies.length}
                </span>
              </div>
              <div className="space-y-0.5">
                {ft.strategies.map((s) => (
                  <div key={s} className="flex items-center gap-2 py-0.5">
                    <ChevronRight size={9} style={{ color: MUTED, flexShrink: 0 }} />
                    <span className="font-body text-[12px]" style={{ color: SECONDARY, letterSpacing: LS_BODY }}>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Stats — count-up, centered */}
        <div className="mt-16 pt-12" style={{ borderTop: `1px solid ${BORDER}` }}>
          <div className="grid grid-cols-1 gap-8 text-center sm:grid-cols-3">
            {STATS.map(({ value, label }, i) => (
              <div key={label}>
                <div
                  className="font-heading"
                  style={{ fontSize: "clamp(3rem, 6vw, 4.5rem)", fontWeight: 800, letterSpacing: "-0.045em", lineHeight: 1, color: INK, opacity: 0.55 }}
                >
                  <CountUp target={parseInt(value)} duration={1.6} delay={i * 0.15} />
                </div>
                <div
                  className="metric-label mt-3"
                  style={{ fontSize: "0.8125rem", fontWeight: 500, color: MUTED, letterSpacing: "0.04em", textTransform: "uppercase" }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
