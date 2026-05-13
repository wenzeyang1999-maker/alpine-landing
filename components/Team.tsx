"use client";

import Image from "next/image";
import { useState } from "react";
import { BG_CARD, BG_AMBER, INK, SECONDARY, MUTED, VIOLET, GREEN, AMBER, AMBER_TEXT, BORDER, BORDER_SUBTLE, LS_BODY, LS_H3 } from "@/lib/constants";

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
    role: "Founder · CEO",
    experience: [
      "~3 yrs Operational Due Diligence",
      "2 yrs Cross-border Investment & Research",
    ],
    photo: "/allen-zhang-headshot.jpeg",
    initials: "AZ",
    linkedin: "https://www.linkedin.com/in/kaishen-allen-zhang/",
    email: "azhang@alpinedd.com",
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


function FounderCard({ f }: { f: Founder }) {
  const [imgErr, setImgErr] = useState(false);
  const showPhoto = f.photo && !imgErr;

  return (
    <div
      className="rounded-panel p-6 flex flex-col gap-5"
      style={{ background: BG_AMBER, border: `1px solid ${BORDER}` }}
    >
      <div className="flex items-center gap-4">
        {showPhoto ? (
          <Image
            src={f.photo!}
            alt={f.name}
            width={88}
            height={88}
            className="rounded-full object-cover shrink-0"
            style={{ width: 88, height: 88 }}
            onError={() => setImgErr(true)}
          />
        ) : (
          <div
            className="rounded-full flex items-center justify-center shrink-0"
            style={{
              width: 88,
              height: 88,
              background: BG_CARD,
              border: `1px solid ${BORDER}`,
              color: VIOLET,
              fontWeight: 700,
              fontSize: "1.75rem",
              letterSpacing: "-0.04em",
            }}
            aria-label={f.name}
          >
            {f.initials}
          </div>
        )}
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase mb-1" style={{ color: MUTED, fontWeight: 700, letterSpacing: "0.1em" }}>
            {f.role}
          </p>
          <h3 className="font-heading" style={{ fontSize: "1.25rem", fontWeight: 700, letterSpacing: "-0.03em", color: INK }}>
            {f.name}
          </h3>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        {f.experience.map((e) => (
          <div key={e} className="flex items-center gap-2 font-body text-[13px]" style={{ color: SECONDARY, letterSpacing: LS_BODY }}>
            <span className="w-1 h-1 rounded-full shrink-0" style={{ background: VIOLET }} />
            {e}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4 mt-auto pt-2" style={{ borderTop: `1px solid ${BORDER_SUBTLE}` }}>
        {f.email && (
          <a
            href={`mailto:${f.email}`}
            className="font-mono text-[11px] hover:opacity-70 transition-opacity"
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
            className="ml-auto flex items-center gap-1.5 text-[12px] font-sans hover:opacity-70 transition-opacity"
            style={{ color: VIOLET, fontWeight: 500 }}
            aria-label={`${f.name} on LinkedIn`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
              <rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" />
            </svg>
            LinkedIn
          </a>
        )}
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
            Founder with hands-on operational due diligence experience, building Alpine alongside an
            advisory board of ODD veterans, alternative investments professionals, and compliance experts.
          </p>
        </div>

        {/* Founder + sidebar grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
          <div className="grid grid-cols-1 gap-4">
            {FOUNDERS.map((f) => <FounderCard key={f.name} f={f} />)}
          </div>

          {/* Sidebar — Other team + Advisory board */}
          <div className="flex flex-col gap-4">
            {/* Other team */}
            <div className="rounded-panel p-5" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
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
            <div className="rounded-panel p-5" style={{ background: `${VIOLET}08`, border: `1px solid ${BORDER}` }}>
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
