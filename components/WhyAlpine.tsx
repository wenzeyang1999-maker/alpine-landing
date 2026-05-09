"use client";

import { motion } from "framer-motion";
import { Users, Shield, Zap, DollarSign, Layers, Search } from "lucide-react";
import {
  BG_CARD, BG_AMBER, INK, SECONDARY, MUTED, VIOLET, GREEN, AMBER, BORDER, BORDER_SUBTLE, LS_BODY, LS_H3,
} from "@/lib/constants";

type Differentiator = {
  icon: React.ReactNode;
  title: string;
  desc: string;
  statValue: string;
  statLabel: string;
  accent: string;
};

const ITEMS: Differentiator[] = [
  {
    icon: <Users size={18} />,
    title: "Practitioner-built",
    desc: "By ODD professionals who've produced reports for global top asset managers — not engineers without domain knowledge.",
    statValue: "80+",
    statLabel: "Reports produced",
    accent: VIOLET,
  },
  {
    icon: <Shield size={18} />,
    title: "Compliant & Secure",
    desc: "Commercial API · DPA · ZDR · TLS 1.3 · SOC 2 in progress. Security-first from day one.",
    statValue: "Enterprise",
    statLabel: "Grade",
    accent: GREEN,
  },
  {
    icon: <Zap size={18} />,
    title: "Speed",
    desc: "Drafted in days, not weeks. Time saved goes to human judgment and faster capital deployment.",
    statValue: "3–5 days",
    statLabel: "vs. 2–4 weeks traditional",
    accent: GREEN,
  },
  {
    icon: <DollarSign size={18} />,
    title: "Affordability",
    desc: "Accessible to managers and allocators traditional ODD prices out entirely.",
    statValue: "<$5K",
    statLabel: "per review · vs. $15K+ traditional",
    accent: VIOLET,
  },
  {
    // Card #5 — replaces deck slide 7's "AI-powered Analysis" with "Engineered for ODD" per locked decision.
    icon: <Layers size={18} />,
    title: "Engineered for ODD",
    desc: "Built for the eight-chapter institutional framework, not retrofitted from a generic LLM tool. Consistency and comparability across funds.",
    statValue: "Built-in",
    statLabel: "Not a wrapper",
    accent: AMBER,
  },
  {
    icon: <Search size={18} />,
    title: "Transparency & Defensibility",
    desc: "Every finding traceable to source. Every citation auditable. The IC question Alpine answers before it's asked.",
    statValue: "Citation",
    statLabel: "Linked",
    accent: AMBER,
  },
];

export default function WhyAlpine() {
  return (
    <section id="why-alpine" className="py-24 px-6" style={{ background: BG_AMBER }}>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="max-w-2xl mb-12">
          <p className="font-mono text-[11px] uppercase mb-3" style={{ color: VIOLET, fontWeight: 700, letterSpacing: "0.1em" }}>
            Why Alpine
          </p>
          <h2 className="font-heading mb-4" style={{ fontSize: "2rem", fontWeight: 700, lineHeight: 1.08, letterSpacing: "-0.038em", color: INK }}>
            What makes Alpine different.
          </h2>
          <p className="font-body" style={{ fontSize: "1.0625rem", lineHeight: 1.65, letterSpacing: LS_BODY, color: SECONDARY }}>
            Six things you don't get from a generic platform or a junior consultant. Built by ODD practitioners,
            engineered for the eight-chapter institutional framework, accessible at a price that doesn't lock out emerging managers.
          </p>
        </div>

        {/* Six differentiator cards */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
          className="rounded-panel overflow-hidden"
          style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}
        >
          {ITEMS.map((d, i) => (
            <motion.div
              key={d.title}
              variants={{ hidden: { opacity: 0, y: 6 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.3 }}
              className="flex items-start sm:items-center gap-4 sm:gap-6 p-5 sm:p-6"
              style={{ borderTop: i > 0 ? `1px solid ${BORDER_SUBTLE}` : "none" }}
            >
              {/* Icon */}
              <div
                className="shrink-0 w-9 h-9 rounded-card flex items-center justify-center"
                style={{ background: `${d.accent}12`, color: d.accent }}
                aria-hidden
              >
                {d.icon}
              </div>

              {/* Title + desc */}
              <div className="flex-1 min-w-0">
                <h3
                  className="font-heading"
                  style={{ fontSize: "1.0625rem", fontWeight: 700, color: INK, letterSpacing: "-0.02em", lineHeight: 1.25 }}
                >
                  {d.title}
                </h3>
                <p className="font-body mt-1" style={{ fontSize: "0.875rem", lineHeight: 1.55, color: SECONDARY, letterSpacing: LS_BODY }}>
                  {d.desc}
                </p>
              </div>

              {/* Stat */}
              <div className="hidden sm:block text-right shrink-0 min-w-[140px]">
                <div
                  className="font-heading"
                  style={{ fontSize: "1.25rem", fontWeight: 700, color: d.accent, letterSpacing: "-0.03em", lineHeight: 1 }}
                >
                  {d.statValue}
                </div>
                <div
                  className="font-mono text-[10px] uppercase mt-1"
                  style={{ color: MUTED, fontWeight: 600, letterSpacing: "0.06em" }}
                >
                  {d.statLabel}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
