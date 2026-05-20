import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  BG, BG_CARD, INK, SECONDARY, MUTED, VIOLET, GREEN, AMBER, BORDER,
  LS_BODY, LS_H1, LS_H3,
} from "@/lib/constants";

const CHAPTERS = [
  { num: "01", title: "Manager, Ownership & Governance", act: "Manager" },
  { num: "02", title: "Legal, Regulatory & Compliance", act: "Manager" },
  { num: "03", title: "Technology, Cybersecurity & Resilience", act: "Manager" },
  { num: "04", title: "Fund Structure, Terms & Alignment", act: "Fund" },
  { num: "05", title: "Service Providers & Oversight", act: "Fund" },
  { num: "06", title: "Investment Operations & Portfolio Controls", act: "Controls" },
  { num: "07", title: "Valuation, Asset Existence & Reporting", act: "Controls" },
  { num: "08", title: "Manager Transparency & LP Communications", act: "Controls" },
];

const ACT_COLOR: Record<string, string> = {
  Manager: VIOLET,
  Fund: GREEN,
  Controls: AMBER,
};

const STEPS = [
  {
    num: "01",
    title: "Get invited",
    desc: "An allocator running an Alpine review on your fund sends you a one-click invite. No signup form, no password.",
  },
  {
    num: "02",
    title: "Build your Living DDQ",
    desc: "Respond once across Alpine's 8-chapter institutional framework. Auto-saves as you go. Upload supporting docs per chapter.",
  },
  {
    num: "03",
    title: "Share with allocators",
    desc: "Generate revocable share links for any LP. They see your DDQ pre-formatted to the framework they trust. You update once. Allocators see audit-grade snapshots.",
  },
];

const VALUES = [
  {
    metric: "2–5×",
    title: "Faster allocator diligence",
    desc: "Allocators reading Alpine-formatted DDQs often complete review in days instead of months.",
  },
  {
    metric: "1",
    title: "Source of truth across allocators",
    desc: "Update once. Every active share link reflects the change for new viewers. No more reformatting per LP.",
  },
  {
    metric: "~1,000",
    title: "Strategy-specific questions",
    desc: "The same institutional framework Alpine uses to rate funds. ~1,000 questions across 8 chapters, verified against 54 regulators.",
  },
];

export default function ManagerLanding() {
  return (
    <main style={{ background: BG, color: INK }} className="min-h-screen">
      {/* Nav */}
      <nav className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/alpine-logo-dark.svg?v=5"
            alt="Alpine Due Diligence"
            style={{ height: 36, width: "auto" }}
          />
          <span
            className="font-mono text-[10px] uppercase pl-3"
            style={{
              color: MUTED,
              fontWeight: 700,
              letterSpacing: "0.1em",
              borderLeft: `1px solid ${BORDER}`,
            }}
          >
            For Managers
          </span>
        </Link>
        <Link
          href="#cta"
          className="rounded-btn px-4 py-2 font-body text-[13px] inline-flex items-center gap-1.5 hover:opacity-90 transition-opacity"
          style={{ background: INK, color: "#fff", fontWeight: 600 }}
        >
          Request invite <ArrowRight size={13} />
        </Link>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-24">
        <p
          className="font-mono text-[11px] uppercase mb-5"
          style={{ color: VIOLET, fontWeight: 700, letterSpacing: "0.1em" }}
        >
          Alpine for Managers
        </p>
        <h1
          className="font-heading mb-6"
          style={{
            fontSize: "3rem",
            fontWeight: 700,
            lineHeight: 1.04,
            letterSpacing: LS_H1,
            color: INK,
          }}
        >
          Answer the DDQ once.
          <br />
          Use it forever.
        </h1>
        <p
          className="font-body max-w-2xl mb-8"
          style={{
            fontSize: "1.125rem",
            lineHeight: 1.6,
            color: SECONDARY,
            letterSpacing: LS_BODY,
          }}
        >
          Stop reformatting your due diligence questionnaire (DDQ) for every
          allocator. Respond once to Alpine&rsquo;s institutional framework.
          Share with any LP that uses Alpine.
        </p>
        <div className="flex items-center gap-5">
          <Link
            href="#cta"
            className="rounded-btn px-5 py-3 font-body text-[14px] inline-flex items-center gap-1.5 hover:opacity-90 transition-opacity"
            style={{ background: INK, color: "#fff", fontWeight: 600 }}
          >
            Request invite <ArrowRight size={14} />
          </Link>
          <Link
            href="#how"
            className="font-body text-[14px] hover:underline"
            style={{ color: INK, fontWeight: 500 }}
          >
            See how it works →
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section id="how" style={{ background: BG_CARD, borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>
        <div className="max-w-5xl mx-auto px-6 py-20">
          <p
            className="font-mono text-[11px] uppercase mb-3"
            style={{ color: VIOLET, fontWeight: 700, letterSpacing: "0.1em" }}
          >
            How it works
          </p>
          <h2
            className="font-heading mb-12"
            style={{ fontSize: "2rem", fontWeight: 700, lineHeight: 1.08, letterSpacing: "-0.038em", color: INK }}
          >
            Three steps. No reformatting.
          </h2>
          {/* Horizontal numbered flow — single connecting line below the row of step numbers */}
          <div className="relative">
            {/* Connecting line — visible on md+ */}
            <div
              className="hidden md:block absolute left-[3%] right-[3%] top-[18px] h-px"
              style={{ background: BORDER }}
              aria-hidden
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-12 md:gap-x-12 relative">
              {STEPS.map((s) => (
                <div key={s.num} className="flex flex-col items-start">
                  <span
                    className="font-mono text-[13px] inline-flex items-center justify-center mb-5"
                    style={{
                      color: VIOLET,
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      background: BG_CARD,
                      border: `1px solid ${VIOLET}`,
                      borderRadius: 999,
                      width: 38,
                      height: 38,
                      position: "relative",
                      zIndex: 1,
                    }}
                  >
                    {s.num}
                  </span>
                  <h3
                    className="font-heading mb-2"
                    style={{ fontSize: "1.125rem", fontWeight: 700, color: INK, letterSpacing: LS_H3 }}
                  >
                    {s.title}
                  </h3>
                  <p
                    className="font-body"
                    style={{ fontSize: "0.9375rem", lineHeight: 1.6, color: SECONDARY, letterSpacing: LS_BODY }}
                  >
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Framework reference */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <p
          className="font-mono text-[11px] uppercase mb-3"
          style={{ color: VIOLET, fontWeight: 700, letterSpacing: "0.1em" }}
        >
          The Framework
        </p>
        <h2
          className="font-heading mb-3"
          style={{ fontSize: "2rem", fontWeight: 700, lineHeight: 1.08, letterSpacing: "-0.038em", color: INK }}
        >
          The same framework allocators use to evaluate you.
        </h2>
        <p
          className="font-body max-w-2xl mb-6"
          style={{ fontSize: "1.0625rem", lineHeight: 1.65, color: SECONDARY, letterSpacing: LS_BODY }}
        >
          ~1,000 strategy-specific questions across 8 chapters. Three acts.
          Verified against 54 regulators.
        </p>
        {/* Act legend */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 mb-8">
          {[
            { label: "The Manager (1–3)", color: VIOLET },
            { label: "The Fund (4–5)", color: GREEN },
            { label: "The Controls (6–8)", color: AMBER },
          ].map((a) => (
            <div key={a.label} className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: a.color }}
                aria-hidden
              />
              <span
                className="font-mono text-[11px] uppercase"
                style={{ color: SECONDARY, fontWeight: 600, letterSpacing: "0.08em" }}
              >
                {a.label}
              </span>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {CHAPTERS.map((ch) => (
            <div
              key={ch.num}
              className="rounded-card p-4 flex flex-col"
              style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: ACT_COLOR[ch.act] }}
                  aria-hidden
                />
                <span
                  className="font-mono text-[10px]"
                  style={{ color: ACT_COLOR[ch.act], fontWeight: 700, letterSpacing: "0.08em" }}
                >
                  {ch.num}
                </span>
              </div>
              <p
                className="font-body"
                style={{ fontSize: "0.8125rem", lineHeight: 1.4, color: INK, fontWeight: 500 }}
              >
                {ch.title}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Why managers use Alpine */}
      <section style={{ background: BG_CARD, borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>
        <div className="max-w-5xl mx-auto px-6 py-20">
          <p
            className="font-mono text-[11px] uppercase mb-3"
            style={{ color: VIOLET, fontWeight: 700, letterSpacing: "0.1em" }}
          >
            Why managers use Alpine
          </p>
          <h2
            className="font-heading mb-12"
            style={{ fontSize: "2rem", fontWeight: 700, lineHeight: 1.08, letterSpacing: "-0.038em", color: INK }}
          >
            What you get on day one.
          </h2>
          <div className="space-y-6">
            {VALUES.map((v) => (
              <div key={v.title} className="flex items-baseline gap-6 pb-6" style={{ borderBottom: `1px solid ${BORDER}` }}>
                <span
                  className="font-heading shrink-0 min-w-[100px]"
                  style={{ fontSize: "1.75rem", fontWeight: 700, color: VIOLET, letterSpacing: "-0.03em" }}
                >
                  {v.metric}
                </span>
                <div className="flex-1">
                  <h3
                    className="font-heading mb-1"
                    style={{ fontSize: "1.0625rem", fontWeight: 700, color: INK, letterSpacing: LS_H3 }}
                  >
                    {v.title}
                  </h3>
                  <p
                    className="font-body"
                    style={{ fontSize: "0.9375rem", lineHeight: 1.6, color: SECONDARY, letterSpacing: LS_BODY }}
                  >
                    {v.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial — illustrative until real ones land */}
      <section className="max-w-3xl mx-auto px-6 py-24">
        <blockquote>
          <p
            className="font-heading mb-6"
            style={{ fontSize: "1.5rem", fontWeight: 500, lineHeight: 1.4, color: INK, letterSpacing: "-0.02em" }}
          >
            &ldquo;Alpine cut our LP onboarding from months to days. We answered
            their framework once and it accelerated four separate diligences in
            the same quarter.&rdquo;
          </p>
          <footer
            className="font-body text-[14px]"
            style={{ color: MUTED, letterSpacing: LS_BODY }}
          >
            <span style={{ color: SECONDARY, fontWeight: 600 }}>Illustrative example</span>
            {" — "}composite of feedback from emerging-manager design partners.
          </footer>
        </blockquote>
      </section>

      {/* CTA */}
      <section id="cta" style={{ background: BG_CARD, borderTop: `1px solid ${BORDER}` }}>
        <div className="max-w-3xl mx-auto px-6 py-20 text-center">
          <h2
            className="font-heading mb-4"
            style={{ fontSize: "2rem", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.038em", color: INK }}
          >
            See if you qualify for early access.
          </h2>
          <p
            className="font-body mb-8 max-w-xl mx-auto"
            style={{ fontSize: "1rem", lineHeight: 1.6, color: SECONDARY, letterSpacing: LS_BODY }}
          >
            Alpine for Managers is invite-only during early access. Tell us your
            firm and your typical LP audience and we&rsquo;ll be in touch within
            one business day.
          </p>
          <form
            method="post"
            action="/api/manager/request-invite"
            className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto"
          >
            <input
              type="email"
              name="email"
              required
              placeholder="you@firm.com"
              aria-label="Work email"
              className="flex-1 rounded-btn px-4 py-3 font-body text-[14px]"
              style={{ background: BG, border: `1px solid ${BORDER}`, color: INK }}
            />
            <button
              type="submit"
              className="rounded-btn px-5 py-3 font-body text-[14px] inline-flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity"
              style={{ background: INK, color: "#fff", fontWeight: 600 }}
            >
              Request invite <ArrowRight size={14} />
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p
          className="font-mono text-[11px] uppercase"
          style={{ color: MUTED, letterSpacing: "0.1em" }}
        >
          Part of Alpine Due Diligence
        </p>
        <div className="flex items-center gap-6 font-body text-[13px]" style={{ color: MUTED }}>
          <Link href="https://alpinedd.com" className="hover:underline">For allocators →</Link>
          <Link href="/privacy" className="hover:underline">Privacy</Link>
          <Link href="/terms" className="hover:underline">Terms</Link>
        </div>
      </footer>
    </main>
  );
}
