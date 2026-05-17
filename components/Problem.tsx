"use client";

import { motion, useReducedMotion } from "framer-motion";
import SectionHeader from "./SectionHeader";
import {
  BG_CARD,
  BG_AMBER,
  SECONDARY,
  MUTED,
  VIOLET,
  AMBER_TEXT,
  BORDER,
  LS_BODY,
} from "@/lib/constants";

type Stat = {
  value: string;
  label: string;
  desc: string;
};

const STATS: Stat[] = [
  {
    value: "80%",
    label: "of analyst time lost",
    desc: "to document parsing",
  },
  {
    value: "$15K+",
    label: "and 2-4 weeks",
    desc: "for traditional ODD",
  },
  {
    value: "0",
    label: "options for early",
    desc: "institutional allocators and managers",
  },
];

export default function Problem() {
  const prefersReducedMotion = useReducedMotion();

  const containerVariants = prefersReducedMotion
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };

  const itemVariants = prefersReducedMotion
    ? { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0 } }
    : { hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } };

  return (
    <section id="problem" className="py-24 px-6" style={{ background: BG_AMBER }}>
      <div className="max-w-5xl mx-auto">
        <SectionHeader
          eyebrow="THE PROBLEM"
          title={
            <>
              ODD is broken at <span style={{ color: VIOLET }}>both ends</span>.
            </>
          }
          sub="Allocators wait weeks for reports that don't scale. Emerging managers can't access institutional ODD at all."
        />

        {/* Stat band — mirrors Framework outcomes-band chrome */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={containerVariants}
          className="rounded-panel p-6 sm:p-7"
          style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}
        >
          <p
            className="font-mono text-[10px] uppercase mb-4"
            style={{ color: MUTED, fontWeight: 700, letterSpacing: "0.1em" }}
          >
            Three numbers that define the gap
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {STATS.map((s) => (
              <motion.div
                key={s.value}
                variants={itemVariants}
                transition={{ duration: 0.35 }}
                className="flex flex-col gap-2"
              >
                <div
                  className="font-heading"
                  style={{
                    fontSize: "2rem",
                    fontWeight: 700,
                    color: AMBER_TEXT,
                    letterSpacing: "-0.038em",
                    lineHeight: 1,
                  }}
                >
                  {s.value}
                </div>
                <div
                  className="font-mono text-[10px] uppercase"
                  style={{ color: MUTED, fontWeight: 700, letterSpacing: "0.08em" }}
                >
                  {s.label}
                </div>
                <p
                  className="font-body"
                  style={{
                    fontSize: "0.8125rem",
                    lineHeight: 1.55,
                    color: SECONDARY,
                    letterSpacing: LS_BODY,
                  }}
                >
                  {s.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
