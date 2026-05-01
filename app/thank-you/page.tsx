"use client";

import Link from "next/link";
import SubpageLayout from "@/components/SubpageLayout";
import { INK, SECONDARY, MUTED, SUBTLE, BORDER, BORDER_SUBTLE, VIOLET, GREEN, AMBER, BG_CARD, BG_ALT } from "@/lib/constants";

const CHAPTERS = [
  { n: "01", title: "Manager, Ownership & Governance",          rating: "STALL", color: AMBER  },
  { n: "02", title: "Legal, Regulatory & Compliance",           rating: "FAIL",  color: "#EF4444" },
  { n: "03", title: "Technology, Cybersecurity & Resilience",   rating: "FAIL",  color: "#EF4444" },
  { n: "04", title: "Fund Structure, Terms & Alignment",        rating: "PASS",  color: GREEN  },
  { n: "05", title: "Service Providers & Oversight",            rating: "PASS",  color: GREEN  },
  { n: "06", title: "Investment Operations & Portfolio Controls",rating: "STALL", color: AMBER  },
  { n: "07", title: "Valuation, Asset Existence & Reporting",   rating: "STALL", color: AMBER  },
  { n: "08", title: "Manager Transparency & LP Communications", rating: "PASS",  color: GREEN  },
];

function RatingBadge({ rating, color }: { rating: string; color: string }) {
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-widest"
      style={{ background: `${color}18`, color }}
    >
      {rating}
    </span>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-mono font-bold uppercase tracking-[0.15em] mb-3" style={{ color: VIOLET }}>
      {children}
    </p>
  );
}

function Divider() {
  return <div className="my-10" style={{ borderTop: `1px solid ${BORDER}` }} />;
}

function PullQuote({ children }: { children: React.ReactNode }) {
  return (
    <blockquote
      className="my-8 pl-5 py-1"
      style={{ borderLeft: `3px solid ${VIOLET}` }}
    >
      <p className="text-[17px] font-body leading-relaxed italic" style={{ color: SECONDARY }}>
        {children}
      </p>
    </blockquote>
  );
}

export default function WhitePaperPage() {
  return (
    <SubpageLayout>
      <div className="w-full" style={{ background: BG_ALT }}>

        {/* Hero header */}
        <div className="w-full py-14 px-6" style={{ background: INK }}>
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-[10px] font-mono font-bold tracking-[0.18em] uppercase px-2.5 py-1 rounded" style={{ background: `${VIOLET}33`, color: "#c4a0f0" }}>
                White Paper
              </span>
              <span className="text-[10px] font-mono tracking-widest uppercase" style={{ color: "#ffffff55" }}>
                Alpine × Acephalt · Confidential
              </span>
            </div>

            <h1 className="font-heading font-emphasis text-3xl md:text-4xl leading-tight mb-4" style={{ color: "#F5F0E8", letterSpacing: "-0.03em" }}>
              The LP Readiness Gap
            </h1>

            <p className="text-[15px] font-body leading-relaxed" style={{ color: "#94a3b8" }}>
              Institutional ODD scorecards are useful tools. But the variable allocation committees need to
              read is not current state — it is readiness trajectory. This paper explains why the distinction
              matters, and what to do about it.
            </p>

            <div className="mt-8 flex flex-wrap gap-6">
              {[
                { stat: "$29T",    label: "Projected global alternatives AUM by 2029" },
                { stat: "2",       label: "Chapters most likely to fail: Compliance & Cybersecurity" },
                { stat: "1 cycle", label: "Often enough to close the fixable column entirely" },
              ].map(({ stat, label }) => (
                <div key={stat} className="flex-1 min-w-[140px]">
                  <div className="text-2xl font-heading font-bold mb-1" style={{ color: "#F5F0E8" }}>{stat}</div>
                  <div className="text-[11px] font-mono leading-relaxed" style={{ color: "#64748b" }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="max-w-2xl mx-auto px-6 py-14">

          {/* Executive summary */}
          <SectionLabel>Executive Summary</SectionLabel>
          <h2 className="text-xl font-heading font-emphasis mb-4" style={{ color: INK }}>
            Core Claim
          </h2>
          <p className="text-[15px] font-body leading-relaxed mb-4" style={{ color: SECONDARY }}>
            Emerging VC managers rarely fail institutional operational due diligence randomly. Their scorecards
            follow a predictable profile: clean fund terms, acceptable service providers, and cooperative transparency;
            yellow governance, operations, and valuation infrastructure; and red compliance or cybersecurity gaps.
          </p>
          <p className="text-[15px] font-body leading-relaxed" style={{ color: SECONDARY }}>
            <strong style={{ color: INK }}>Structural findings</strong> resolve with scale.{" "}
            <strong style={{ color: INK }}>Fixable findings</strong> resolve with attention. Institutional readiness
            begins when a manager can tell the difference and act on it.
          </p>

          <Divider />

          {/* Chapter scorecard */}
          <SectionLabel>Eight-Chapter ODD Framework</SectionLabel>
          <h2 className="text-xl font-heading font-emphasis mb-6" style={{ color: INK }}>
            A Typical Emerging VC Profile
          </h2>

          <div className="rounded-xl overflow-hidden border" style={{ borderColor: BORDER }}>
            {CHAPTERS.map(({ n, title, rating, color }, i) => (
              <div
                key={n}
                className="flex items-center justify-between px-5 py-3.5"
                style={{
                  background: i % 2 === 0 ? BG_CARD : BG_ALT,
                  borderBottom: i < CHAPTERS.length - 1 ? `1px solid ${BORDER_SUBTLE}` : "none",
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-mono" style={{ color: SUBTLE }}>{n}</span>
                  <span className="text-[13px] font-body" style={{ color: SECONDARY }}>{title}</span>
                </div>
                <RatingBadge rating={rating} color={color} />
              </div>
            ))}
          </div>

          <Divider />

          {/* Section 01 */}
          <SectionLabel>Section 01</SectionLabel>
          <h2 className="text-xl font-heading font-emphasis mb-4" style={{ color: INK }}>
            The Emerging VC Readiness Pattern
          </h2>
          <p className="text-[15px] font-body leading-relaxed mb-4" style={{ color: SECONDARY }}>
            Emerging venture capital managers fail institutional ODD in remarkably consistent ways. The failures
            are not random, not idiosyncratic, and not primarily a function of individual care or carelessness.
            They follow a pattern legible to anyone who has read enough reports.
          </p>
          <p className="text-[15px] font-body leading-relaxed mb-4" style={{ color: SECONDARY }}>
            Fund terms are often acceptable — the LPA drafted by reputable counsel, fee structure within market
            norms, clawback language in place. Service providers are also usually acceptable. Then the scorecard
            darkens: governance yellow because the only internal operations role is thin, investment ops yellow
            because the portfolio lives in Excel, valuation yellow because the front office approves its own marks.
          </p>

          <PullQuote>
            "Two chapters then tend to come back red — Compliance and Cybersecurity. Their remedies require
            only attention and modest budget, not scale."
          </PullQuote>

          <p className="text-[15px] font-body leading-relaxed" style={{ color: SECONDARY }}>
            This is not a description of one manager. It is a composite of the emerging manager profile. A seasoned
            ODD analyst can often predict the broad scorecard before opening the binder — based on little more
            than fund size, team headcount, and vintage.
          </p>

          <Divider />

          {/* Section 02 */}
          <SectionLabel>Section 02</SectionLabel>
          <h2 className="text-xl font-heading font-emphasis mb-4" style={{ color: INK }}>
            Findings That Signal Trajectory, Findings That Don&apos;t
          </h2>
          <p className="text-[15px] font-body leading-relaxed mb-6" style={{ color: SECONDARY }}>
            Over a two-to-three-year window between diligence cycles, some findings resolve reliably. Others do
            not. A red in Compliance and a yellow in Governance can sit on the same scorecard — and the red will
            often clear before the yellow. This is counterintuitive if the scorecard is read as a ranking, but it is
            consistent with how emerging firms actually evolve.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                title: "Findings That Resolve",
                color: GREEN,
                items: [
                  "Reassigning compliance officer from investment professional to head of operations",
                  "Engaging a compliance consultant for attestations, training, and expanded policy",
                  "Engaging a cybersecurity vendor for policy, IRP, endpoint controls, and training",
                  "Writing a formal business continuity plan",
                ],
              },
              {
                title: "Findings That Persist",
                color: AMBER,
                items: [
                  "Single operations professional without back-office depth — resolves only when AUM supports a full-time head of finance",
                  "Absence of formal succession plan — resolves only when partnership expands beyond two principals",
                  "LPAC formation — arrives only when fund scale and LP composition make it relevant",
                ],
              },
            ].map(({ title, color, items }) => (
              <div key={title} className="rounded-xl border p-5" style={{ borderColor: BORDER, background: BG_CARD }}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider" style={{ color }}>{title}</span>
                </div>
                <ul className="space-y-2.5">
                  {items.map((item, i) => (
                    <li key={i} className="flex gap-2 text-[13px] font-body leading-relaxed" style={{ color: SECONDARY }}>
                      <span style={{ color: SUBTLE, marginTop: 2 }}>—</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <Divider />

          {/* Section 03 */}
          <SectionLabel>Section 03</SectionLabel>
          <h2 className="text-xl font-heading font-emphasis mb-4" style={{ color: INK }}>
            Structural vs Fixable
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {[
              {
                type: "Structural",
                desc: "Tied to fund size, age, headcount, or capital. Resolve when the underlying variable changes — and not before.",
                note: "Usually defensible when acknowledged clearly and paired with a size-triggered remediation plan.",
                color: AMBER,
                examples: [
                  "Single internal operations role without back-office depth",
                  "No formal succession plan at a two-partner firm",
                  "LPAC formation deferred until fund scale warrants",
                  "No internal accounting shadow of administrator",
                ],
              },
              {
                type: "Fixable",
                desc: "Tied to documentation, vendors, or role reassignment. Can often be resolved within a quarter with intent and a modest budget.",
                note: "More difficult to defend when left unresolved — these findings signal whether the manager has chosen to operate as an institutional firm.",
                color: VIOLET,
                examples: [
                  "Investment professional acting as compliance officer",
                  "No attestation or annual training program",
                  "No written cybersecurity policy or incident response plan",
                  "No formal valuation committee charter",
                ],
              },
            ].map(({ type, desc, note, color, examples }) => (
              <div key={type} className="rounded-xl border p-5 flex flex-col gap-4" style={{ borderColor: BORDER, background: BG_CARD }}>
                <div>
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider" style={{ color }}>{type}</span>
                  <p className="mt-2 text-[13px] font-body leading-relaxed" style={{ color: SECONDARY }}>{desc}</p>
                </div>
                <ul className="space-y-1.5 flex-1">
                  {examples.map((ex, i) => (
                    <li key={i} className="flex gap-2 text-[12px] font-body leading-relaxed" style={{ color: MUTED }}>
                      <span style={{ color: SUBTLE }}>·</span>{ex}
                    </li>
                  ))}
                </ul>
                <p className="text-[11px] font-mono leading-relaxed pt-3" style={{ color: SUBTLE, borderTop: `1px solid ${BORDER_SUBTLE}` }}>
                  {note}
                </p>
              </div>
            ))}
          </div>

          <Divider />

          {/* Section 04 */}
          <SectionLabel>Section 04</SectionLabel>
          <h2 className="text-xl font-heading font-emphasis mb-4" style={{ color: INK }}>
            Closing the Fixable Column
          </h2>
          <p className="text-[15px] font-body leading-relaxed mb-6" style={{ color: SECONDARY }}>
            The practical question for an emerging manager preparing for institutional diligence is not whether
            to address the fixable column — but in what order. A manager who starts with the slowest items and
            works inward will arrive at the next diligence cycle with most of the column still open.
          </p>

          <div className="space-y-3">
            {[
              { n: "01", area: "Governance",    urgency: "Immediate",         action: "Reassign Compliance Oversight", detail: "Move the compliance officer role from an investment professional to the head of operations. A governance decision — costs nothing and can be done today." },
              { n: "02", area: "Compliance",    urgency: "Critical Path",     action: "Engage a Compliance Consultant", detail: "Design and implement attestations, annual training, and an expanded policy set beyond ERA minimums." },
              { n: "03", area: "Cybersecurity", urgency: "Longest Lead Time", action: "Engage a Cybersecurity Vendor", detail: "Produce a formal policy, incident response plan, training regime, and associated technical controls. Typically the longest item on the calendar." },
              { n: "04", area: "Resilience",    urgency: "Depends on Step 03",action: "Write a Business Continuity Plan", detail: "Once the cybersecurity vendor can inform the technical provisions, the BCP can be drafted and executed." },
              { n: "05", area: "Valuation",     urgency: "Documentation",     action: "Form a Valuation Committee on Paper", detail: "Establish a formal charter, approval workflow, and meeting cadence. Can be done without an external agent at early fund sizes." },
            ].map(({ n, area, urgency, action, detail }) => (
              <div key={n} className="flex gap-4 rounded-xl border p-5" style={{ borderColor: BORDER, background: BG_CARD }}>
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-mono font-bold" style={{ background: `${INK}10`, color: INK }}>
                  {n}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-mono font-semibold" style={{ color: SECONDARY }}>{area}</span>
                    <span className="text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded" style={{ background: `${VIOLET}15`, color: VIOLET }}>{urgency}</span>
                  </div>
                  <p className="text-[14px] font-body font-semibold mb-1" style={{ color: INK }}>{action}</p>
                  <p className="text-[13px] font-body leading-relaxed" style={{ color: MUTED }}>{detail}</p>
                </div>
              </div>
            ))}
          </div>

          <Divider />

          {/* Section 05 */}
          <SectionLabel>Section 05</SectionLabel>
          <h2 className="text-xl font-heading font-emphasis mb-4" style={{ color: INK }}>
            Where Readiness Compounds
          </h2>
          <p className="text-[15px] font-body leading-relaxed mb-6" style={{ color: SECONDARY }}>
            Fund-side readiness is necessary, but it is not sufficient. The same diligence logic applies one level
            down — at the portfolio level — and one level inward, at the operational structure that every diligence
            finding ultimately tests.
          </p>

          <div className="flex flex-col sm:flex-row gap-0 rounded-xl overflow-hidden border" style={{ borderColor: BORDER }}>
            {[
              { label: "Manager-Level Readiness",   desc: "Fund terms, governance structure, compliance program, cybersecurity posture, operational controls" },
              { label: "Portfolio-Level Readiness",  desc: "Cap table cleanliness, IP assignment, contract execution, data room discipline, security posture" },
              { label: "Track Record & Next Raise",  desc: "Portfolio diligence outcomes flow back through the track record to the manager's next institutional cycle" },
            ].map(({ label, desc }, i, arr) => (
              <div
                key={label}
                className="flex-1 p-5"
                style={{
                  background: i % 2 === 0 ? BG_CARD : BG_ALT,
                  borderRight: i < arr.length - 1 ? `1px solid ${BORDER}` : "none",
                }}
              >
                <p className="text-[11px] font-mono font-bold uppercase tracking-wider mb-2" style={{ color: VIOLET }}>{label}</p>
                <p className="text-[13px] font-body leading-relaxed" style={{ color: SECONDARY }}>{desc}</p>
                {i < arr.length - 1 && (
                  <p className="mt-3 text-right text-[16px]" style={{ color: SUBTLE }}>→</p>
                )}
              </div>
            ))}
          </div>

          <PullQuote>
            "An emerging VC manager that passes its own ODD can still face the same readiness gap at the next
            raise if its underlying portfolio companies cannot withstand diligence conducted by others."
          </PullQuote>

          <Divider />

          {/* About */}
          <SectionLabel>About the Authors</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { name: "Alpine Due Diligence", url: "alpinedd.com", desc: "Alpine is a technology-enabled ODD platform for institutional allocators. Alpine's AI engine processes 472 questions across 38 fund strategies, with every finding reviewed by a senior analyst before delivery." },
              { name: "Acephalt",             url: "acephalt.com", desc: "Acephalt advises emerging venture capital managers on fund formation, LP communications, and institutional readiness — helping managers build the operational infrastructure that allocation committees expect." },
            ].map(({ name, url, desc }) => (
              <div key={name} className="rounded-xl border p-5" style={{ borderColor: BORDER, background: BG_CARD }}>
                <p className="text-[13px] font-heading font-bold mb-0.5" style={{ color: INK }}>{name}</p>
                <p className="text-[11px] font-mono mb-3" style={{ color: VIOLET }}>{url}</p>
                <p className="text-[13px] font-body leading-relaxed" style={{ color: MUTED }}>{desc}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-12 text-center">
            <p className="text-sm font-body mb-4" style={{ color: MUTED }}>
              Ready to see where your fund stands?
            </p>
            <Link
              href="/early-access"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-btn text-white font-body font-emphasis text-sm hover:opacity-90 transition-opacity"
              style={{ background: INK }}
            >
              Request a Demo
            </Link>
          </div>

          <p className="mt-8 text-center text-[11px] font-mono" style={{ color: SUBTLE }}>
            Alpine × Acephalt · Confidential · Not for distribution
          </p>
        </div>
      </div>
    </SubpageLayout>
  );
}
