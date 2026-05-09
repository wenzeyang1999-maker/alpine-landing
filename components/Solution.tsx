"use client";

import { motion, useReducedMotion } from "framer-motion";
import { FileText, CheckCircle, Brain, Users } from "lucide-react";
import SectionHeader from "./SectionHeader";
import {
  BG,
  BG_CARD,
  INK,
  SECONDARY,
  MUTED,
  VIOLET,
  GREEN,
  AMBER,
  BORDER,
  BORDER_SUBTLE,
  LS_BODY,
} from "@/lib/constants";

type Row = {
  icon: React.ReactNode;
  title: string;
  desc: string;
  statValue: string;
  statLabel: string;
  accent: string;
};

const ITEMS: Row[] = [
  {
    icon: <FileText size={18} />,
    accent: VIOLET,
    title: "Documents in",
    desc: "14+ document types auto-classified into the eight-chapter framework.",
    statValue: "<60s",
    statLabel: "to classify",
  },
  {
    icon: <CheckCircle size={18} />,
    accent: GREEN,
    title: "Cross-verified",
    desc: "54 regulators across 3 tiers — automated and kept current.",
    statValue: "54",
    statLabel: "regulators",
  },
  {
    icon: <Brain size={18} />,
    accent: AMBER,
    title: "Eight-chapter analysis",
    desc: "901 strategy-specific questions. RATED · RISKS FLAGGED · REMEDIATED.",
    statValue: "901",
    statLabel: "questions",
  },
  {
    icon: <Users size={18} />,
    accent: VIOLET,
    title: "Human-owned review",
    desc: "A senior ODD analyst owns the final report. Defensible in front of your IC.",
    statValue: "3-5 days",
    statLabel: "to draft",
  },
];

export default function Solution() {
  const prefersReducedMotion = useReducedMotion();

  const containerVariants = prefersReducedMotion
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } };

  const itemVariants = prefersReducedMotion
    ? { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0 } }
    : { hidden: { opacity: 0, y: 6 }, visible: { opacity: 1, y: 0 } };

  return (
    <section id="solution" className="py-24 px-6" style={{ background: BG }}>
      <div className="max-w-5xl mx-auto">
        <SectionHeader
          eyebrow="OPERATING MODEL"
          title={
            <>
              How Alpine <span style={{ color: VIOLET }}>actually works</span>.
            </>
          }
          sub="Documents in. Eight chapters analyzed. Verified against 54 regulators. A senior ODD analyst owns the final review. Drafted in 3-5 days."
        />

        {/* Four horizontal rows — identical chrome to WhyAlpine */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={containerVariants}
          className="rounded-panel overflow-hidden"
          style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}
        >
          {ITEMS.map((d, i) => (
            <motion.div
              key={d.title}
              variants={itemVariants}
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
                  style={{
                    fontSize: "1.0625rem",
                    fontWeight: 700,
                    color: INK,
                    letterSpacing: "-0.02em",
                    lineHeight: 1.25,
                  }}
                >
                  {d.title}
                </h3>
                <p
                  className="font-body mt-1"
                  style={{
                    fontSize: "0.875rem",
                    lineHeight: 1.55,
                    color: SECONDARY,
                    letterSpacing: LS_BODY,
                  }}
                >
                  {d.desc}
                </p>
              </div>

              {/* Stat */}
              <div className="hidden sm:block text-right shrink-0 min-w-[140px]">
                <div
                  className="font-heading"
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: 700,
                    color: d.accent,
                    letterSpacing: "-0.03em",
                    lineHeight: 1,
                  }}
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
