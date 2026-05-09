"use client";

import Link from "next/link";
import SectionHeader from "./SectionHeader";
import {
  BG,
  BG_CARD,
  BG_GREEN,
  INK,
  SECONDARY,
  MUTED,
  VIOLET,
  GREEN,
  AMBER,
  GREEN_TEXT,
  BORDER,
  LS_BODY,
} from "@/lib/constants";

export default function SampleOutput() {
  return (
    <section id="sample-output" className="py-24 px-6" style={{ background: BG_GREEN }}>
      <div className="max-w-5xl mx-auto">
        <SectionHeader
          eyebrow="SAMPLE OUTPUT"
          title={
            <>
              What you actually <span style={{ color: VIOLET }}>receive</span>.
            </>
          }
          sub="A real chapter from a recent Trellis Capital IV review. Citations linked. Risks flagged. Remediation paired."
        />

        {/* Browser-chrome mockup — copied from Hero */}
        <div
          className="rounded-panel overflow-hidden"
          style={{
            background: BG_CARD,
            border: `1px solid ${BORDER}`,
            boxShadow: "0 4px 24px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)",
          }}
        >
          {/* Browser chrome */}
          <div
            className="flex items-center gap-2 px-4 py-3"
            style={{ background: BG, borderBottom: `1px solid ${BORDER}` }}
          >
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: AMBER }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: GREEN }} />
            </div>
            <div className="flex-1 mx-4">
              <div
                className="rounded px-3 py-1 text-[11px] font-sans max-w-xs mx-auto text-center"
                style={{
                  background: BG_CARD,
                  color: MUTED,
                  border: `1px solid ${BORDER}`,
                  letterSpacing: "0.01em",
                }}
              >
                alpinedd.com/review/trellis-capital-iv
              </div>
            </div>
          </div>

          {/* Finding card */}
          <div className="p-6 sm:p-8">
            {/* Header row */}
            <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
              <span
                className="font-mono text-[11px] uppercase"
                style={{ color: MUTED, fontWeight: 600, letterSpacing: "0.08em" }}
              >
                CHAPTER 06 · INVESTMENT OPERATIONS &amp; PORTFOLIO CONTROLS
              </span>
              <span
                className="font-mono text-[10px] uppercase px-2 py-0.5 rounded-full"
                style={{
                  background: `${GREEN}15`,
                  color: GREEN_TEXT,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                }}
              >
                RATED
              </span>
            </div>

            {/* Finding title */}
            <h3
              className="font-heading mb-3"
              style={{
                fontSize: "1rem",
                fontWeight: 700,
                color: INK,
                letterSpacing: "-0.02em",
                lineHeight: 1.35,
              }}
            >
              Cash movement controls — single-signatory weakness flagged
            </h3>

            {/* Citation chip */}
            <div className="mb-4">
              <span
                className="font-mono inline-block uppercase px-2 py-0.5 rounded text-[10px]"
                style={{
                  background: `${VIOLET}15`,
                  color: VIOLET,
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                }}
              >
                [Compliance Manual §4.2.1]
              </span>
            </div>

            {/* Evidence quote */}
            <blockquote
              className="font-body italic mb-4 pl-4"
              style={{
                fontSize: "14px",
                lineHeight: 1.6,
                color: SECONDARY,
                letterSpacing: LS_BODY,
                borderLeft: `2px solid ${VIOLET}`,
              }}
            >
              &ldquo;Wires above $250K require sole approval from the COO with no secondary review or compliance check, per the policy reviewed on 2025-08-14.&rdquo;
            </blockquote>

            {/* Remediation */}
            <p
              className="font-body"
              style={{
                fontSize: "14px",
                lineHeight: 1.6,
                color: SECONDARY,
                letterSpacing: LS_BODY,
              }}
            >
              <span
                className="font-mono uppercase mr-2 text-[10px]"
                style={{ color: MUTED, fontWeight: 700, letterSpacing: "0.08em" }}
              >
                Remediation
              </span>
              Recommend dual-signatory threshold for wires over $100K + monthly compliance audit log review. Industry standard: Level III control.
            </p>
          </div>
        </div>

        {/* Ghost link */}
        <div className="mt-6">
          <Link
            href="/demo"
            className="font-mono text-[11px] uppercase"
            style={{
              color: VIOLET,
              fontWeight: 700,
              letterSpacing: "0.08em",
            }}
          >
            See the full sample report &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
