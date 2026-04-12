import Image from "next/image";
import { BG_CARD, BG_AMBER, INK, SECONDARY, MUTED, VIOLET, AMBER, BORDER, LS_BODY } from "@/lib/constants";

const MEMBERS = [
  {
    name: "Allen Zhang",
    role: "Founder & CEO",
    bio: "Three years as an operational due diligence analyst at Castle Hall Diligence, covering hedge funds, private equity, and real assets for institutional allocators globally. Founded Alpine to bring that methodology into software.",
    credentials: ["Castle Hall Diligence — ODD Analyst", "Concordia University — Finance"],
    photo: "/allen-zhang-headshot.jpeg",
    linkedin: "https://www.linkedin.com/in/kaishen-allen-zhang/",
  },
];

export default function Team() {
  return (
    <section id="team" className="py-24 px-6" style={{ background: BG_CARD }}>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="max-w-2xl mb-14">
          <p className="font-sans text-[11px] uppercase mb-3" style={{ color: VIOLET, fontWeight: 600, letterSpacing: "0.1em" }}>
            Our Team
          </p>
          <h2 className="font-heading mb-4" style={{ fontSize: "2rem", fontWeight: 700, lineHeight: 1.08, letterSpacing: "-0.038em", color: INK }}>
            Built by practitioners.
          </h2>
          <p className="font-body" style={{ fontSize: "1.0625rem", lineHeight: 1.65, letterSpacing: LS_BODY, color: SECONDARY }}>
            Alpine is built by someone who has done institutional operational due diligence firsthand and understands where the process slows down, fragments, and loses rigor.
          </p>
        </div>

        {/* Founder card */}
        {MEMBERS.map((member) => (
          <div
            key={member.name}
            className="rounded-panel p-8 mb-4 flex flex-col md:flex-row gap-8"
            style={{ background: BG_AMBER, border: `1px solid ${BORDER}` }}
          >
            {/* Photo */}
            <div className="shrink-0">
              <Image
                src={member.photo}
                alt={member.name}
                width={120}
                height={120}
                className="rounded-full object-cover"
                style={{ width: 120, height: 120 }}
              />
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <p className="font-sans text-[11px] uppercase mb-1" style={{ color: MUTED, fontWeight: 600, letterSpacing: "0.1em" }}>
                    {member.role}
                  </p>
                  <h3 className="font-heading" style={{ fontSize: "1.375rem", fontWeight: 700, letterSpacing: "-0.03em", color: INK }}>
                    {member.name}
                  </h3>
                </div>
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-[12px] font-sans hover:opacity-70 transition-opacity"
                  style={{ color: VIOLET, fontWeight: 500 }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" />
                  </svg>
                  LinkedIn
                </a>
              </div>

              <p className="font-body mt-4 mb-5" style={{ fontSize: "0.9375rem", lineHeight: 1.7, color: SECONDARY, letterSpacing: LS_BODY }}>
                {member.bio}
              </p>

              <div className="flex flex-wrap gap-2">
                {member.credentials.map((c) => (
                  <span
                    key={c}
                    className="font-body text-[12px] px-3 py-1 rounded-full"
                    style={{ background: `${AMBER}20`, color: MUTED, border: `1px solid ${AMBER}40`, fontWeight: 500 }}
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}

      </div>
    </section>
  );
}
