"use client";

import Image from "next/image";
import { useState } from "react";
import { BG_CARD, BG_AMBER, INK, SECONDARY, MUTED, VIOLET, BORDER, BORDER_SUBTLE, LS_BODY, LS_H3 } from "@/lib/constants";

type Founder = {
  name: string;
  role: string;
  experience: string[];
  photo?: string;
  initials: string;
  linkedin?: string;
  email?: string;
};

const FOUNDERS: Founder[] = [
  {
    name: "Allen Zhang",
    role: "Co-Founder · CEO",
    experience: [
      "~3 yrs Operational Due Diligence",
      "2 yrs Cross-border Investment & Research",
    ],
    photo: "/allen-zhang-headshot.jpeg",
    initials: "AZ",
    linkedin: "https://www.linkedin.com/in/kaishen-allen-zhang/",
    email: "azhang@alpinedd.com",
  },
  {
    name: "Eva Yang",
    role: "Co-Founder · Managing Partner",
    experience: [
      "1+ yrs Operational Due Diligence",
      "~4 yrs Alternative Investments",
    ],
    photo: "/eva-yang-headshot.jpeg",
    initials: "EY",
    linkedin: "https://www.linkedin.com/in/evaayang/",
    email: "eva.yang@alpinedd.com",
  },
];

const OTHER_TEAM = [
  { role: "Founding Engineer",    detail: "5+ yrs" },
  { role: "ODD Analyst",          detail: "5+ yrs" },
];

const ADVISORY_BOARD = [
  "ODD Expert(s)",
  "Alternative Investments Professional(s)",
  "Compliance & Regulatory Expert(s)",
];


const LinkedInIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" />
  </svg>
);

const COMBINED_EXPERIENCE = [
  "Operational Due Diligence — hands-on fund manager reviews across hedge funds and private markets",
  "Alternative Investments — LP-side fund evaluation and portfolio management",
  "Cross-border Investment & Research — deal origination, manager selection, and market analysis",
];

function FounderPhoto({ f }: { f: Founder }) {
  const [imgErr, setImgErr] = useState(false);
  const showPhoto = f.photo && !imgErr;
  return (
    <div className="flex items-center gap-3">
      {showPhoto ? (
        <Image
          src={f.photo!}
          alt={f.name}
          width={72}
          height={72}
          className="rounded-full object-cover shrink-0"
          style={{ width: 72, height: 72 }}
          onError={() => setImgErr(true)}
        />
      ) : (
        <div
          className="rounded-full flex items-center justify-center shrink-0"
          style={{
            width: 72, height: 72,
            background: BG_CARD,
            border: `1px solid ${BORDER}`,
            color: VIOLET, fontWeight: 700, fontSize: "1.5rem", letterSpacing: "-0.04em",
          }}
          aria-label={f.name}
        >
          {f.initials}
        </div>
      )}
      <div className="min-w-0">
        <p className="font-mono text-[10px] uppercase mb-0.5" style={{ color: MUTED, fontWeight: 700, letterSpacing: "0.1em" }}>
          {f.role}
        </p>
        <h3 className="font-heading" style={{ fontSize: "1.125rem", fontWeight: 700, letterSpacing: "-0.03em", color: INK, lineHeight: 1.2 }}>
          {f.name}
        </h3>
      </div>
    </div>
  );
}

function FoundersCard() {
  return (
    <div
      className="rounded-panel overflow-hidden"
      style={{ background: BG_AMBER, border: `1px solid ${BORDER}` }}
    >
      {/* Top header */}
      <div
        className="px-6 py-3"
        style={{ borderBottom: `1px solid ${BORDER_SUBTLE}` }}
      >
        <p className="font-mono text-[10px] uppercase" style={{ color: MUTED, fontWeight: 700, letterSpacing: "0.1em" }}>
          Founding Team
        </p>
      </div>

      {/* Two founders side by side */}
      <div className="grid grid-cols-1 sm:grid-cols-2 px-6 pt-5 pb-4 gap-4 sm:gap-8">
        <FounderPhoto f={FOUNDERS[0]} />
        <FounderPhoto f={FOUNDERS[1]} />
      </div>

      {/* Combined experience bullets */}
      <div
        className="px-6 py-4 flex flex-col gap-2"
        style={{ borderTop: `1px solid ${BORDER_SUBTLE}` }}
      >
        {COMBINED_EXPERIENCE.map((e) => (
          <div key={e} className="flex items-start gap-2.5 font-body text-[13px]" style={{ color: SECONDARY, letterSpacing: LS_BODY, lineHeight: 1.5 }}>
            <span className="w-1.5 h-1.5 rounded-full shrink-0 mt-[5px]" style={{ background: VIOLET }} />
            {e}
          </div>
        ))}
      </div>

      {/* ~7 years stat */}
      <div
        className="px-6 py-3 flex items-center gap-3"
        style={{ borderTop: `1px solid ${BORDER_SUBTLE}` }}
      >
        <span className="font-body text-[13.5px]" style={{ color: SECONDARY, letterSpacing: LS_BODY }}>
          <span style={{ color: INK, fontWeight: 700 }}>~7 years</span> in alternative investments
        </span>
      </div>

      {/* Links — one row, each founder's email + linkedin */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 px-6 py-3 gap-3"
        style={{ borderTop: `1px solid ${BORDER_SUBTLE}` }}
      >
        {FOUNDERS.map((f) => (
          <div key={f.name} className="flex items-center gap-4">
            {f.email && (
              <a
                href={`mailto:${f.email}`}
                className="font-mono text-[11px] hover:opacity-70 transition-opacity truncate"
                style={{ color: VIOLET, letterSpacing: "0.04em" }}
              >
                {f.email}
              </a>
            )}
            {f.linkedin && (
              <a
                href={f.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto flex items-center gap-1.5 text-[12px] font-sans hover:opacity-70 transition-opacity shrink-0"
                style={{ color: VIOLET, fontWeight: 500 }}
                aria-label={`${f.name} on LinkedIn`}
              >
                <LinkedInIcon />
                LinkedIn
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Team() {
  return (
    <section id="team" className="py-24 px-6" style={{ background: BG_CARD }}>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="max-w-2xl mb-12">
          <p className="font-mono text-[11px] uppercase mb-3" style={{ color: VIOLET, fontWeight: 700, letterSpacing: "0.1em" }}>
            Our Team
          </p>
          <h2 className="font-heading mb-4" style={{ fontSize: "2rem", fontWeight: 700, lineHeight: 1.08, letterSpacing: "-0.038em", color: INK }}>
            Built by practitioners.
          </h2>
          <p className="font-body" style={{ fontSize: "1.0625rem", lineHeight: 1.65, letterSpacing: LS_BODY, color: SECONDARY }}>
            Two founders with hands-on operational due diligence experience, building Alpine alongside an
            advisory board of ODD veterans, alternative investments professionals, and compliance experts.
          </p>
        </div>

        {/* Founders + sidebar grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8 items-stretch">
          <div className="lg:col-span-2 flex flex-col">
            <FoundersCard />
          </div>

          {/* Sidebar — Other team + Advisory board */}
          <div className="flex flex-col gap-4 h-full">
            {/* Other team */}
            <div className="rounded-panel p-5 flex-1 flex flex-col" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
              <div className="flex items-baseline justify-between mb-3">
                <h3 className="font-heading" style={{ fontSize: "0.9375rem", fontWeight: 700, color: INK, letterSpacing: LS_H3 }}>
                  Other Team Members
                </h3>
                <span className="font-mono text-[10px] uppercase" style={{ color: MUTED, fontWeight: 700, letterSpacing: "0.08em" }}>
                  2 hires
                </span>
              </div>
              <ul className="space-y-2">
                {OTHER_TEAM.map((t) => (
                  <li key={t.role} className="flex items-center justify-between font-body text-[13px]" style={{ color: SECONDARY, letterSpacing: LS_BODY }}>
                    <span>{t.role}</span>
                    <span className="font-mono text-[11px]" style={{ color: MUTED }}>{t.detail}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Advisory board */}
            <div className="rounded-panel p-5 flex-1 flex flex-col" style={{ background: `${VIOLET}08`, border: `1px solid ${BORDER}` }}>
              <div className="flex items-baseline justify-between mb-3 gap-2 flex-wrap">
                <h3 className="font-heading" style={{ fontSize: "0.9375rem", fontWeight: 700, color: INK, letterSpacing: LS_H3 }}>
                  Advisory Board
                </h3>
                <div className="flex items-center gap-2">
                  <span
                    className="font-mono text-[9px] uppercase px-1.5 py-0.5 rounded-full"
                    style={{ background: "#FEF8E7", color: "#7C2D12", fontWeight: 700, letterSpacing: "0.08em" }}
                  >
                    In formation
                  </span>
                  <span className="font-mono text-[10px] uppercase" style={{ color: MUTED, fontWeight: 700, letterSpacing: "0.08em" }}>
                    3–5 seats
                  </span>
                </div>
              </div>
              <ul className="space-y-2">
                {ADVISORY_BOARD.map((a) => (
                  <li key={a} className="flex items-center gap-2 font-body text-[13px]" style={{ color: SECONDARY, letterSpacing: LS_BODY }}>
                    <span className="w-1 h-1 rounded-full shrink-0" style={{ background: VIOLET }} />
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
