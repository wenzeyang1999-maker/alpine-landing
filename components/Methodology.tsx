import { BG_CARD, BG_AMBER, INK, MUTED, VIOLET, BORDER, LS_BODY } from "@/lib/constants";

const CREDENTIALS = [
  { stat: "80+", label: "Institutional ODD reports authored", detail: "Hedge fund, PE, and VC mandates" },
  { stat: "Analyst-reviewed", label: "Every report reviewed before delivery", detail: "No draft goes out unchecked" },
  { stat: "65", label: "Verification checkpoints", detail: "Regulatory, operational, and document-based" },
];

const TRUST_LABELS = [
  "Anthropic Commercial API",
  "DPA + Zero Data Retention",
  "SOC 2 Readiness",
  "TLS 1.3",
];

export default function Methodology() {
  return (
    <section className="py-16 px-6" style={{ background: BG_AMBER }}>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="max-w-3xl mb-8">
          <p className="font-sans text-[11px] uppercase mb-2" style={{ color: VIOLET, fontWeight: 600, letterSpacing: "0.1em" }}>
            Methodology
          </p>
          <h2 className="font-heading" style={{ fontSize: "1.75rem", fontWeight: 700, lineHeight: 1.08, letterSpacing: "-0.038em", color: INK }}>
            Built on real-world ODD expertise.
          </h2>
          <p className="font-body mt-3 max-w-2xl text-[15px]" style={{ color: MUTED, fontWeight: 500, lineHeight: 1.6, letterSpacing: LS_BODY }}>
            The speed changes. The review standard does not.
          </p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {CREDENTIALS.map(({ stat, label, detail }) => (
            <div key={label} className="rounded-card p-5" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
              <p
                className="font-heading mb-2"
                style={{
                  fontSize: stat === "Analyst-reviewed" ? "1.375rem" : "1.875rem",
                  fontWeight: 700,
                  lineHeight: 1.05,
                  letterSpacing: stat === "Analyst-reviewed" ? "-0.04em" : "-0.03em",
                  color: VIOLET,
                }}
              >
                {stat}
              </p>
              <p className="font-heading text-[13px]" style={{ fontWeight: 600, color: INK, letterSpacing: "-0.01em" }}>
                {label}
              </p>
              <p className="font-body text-[12px] mt-1" style={{ color: MUTED, letterSpacing: LS_BODY }}>
                {detail}
              </p>
            </div>
          ))}
        </div>

        {/* Trust labels */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t pt-5" style={{ borderColor: BORDER }}>
          {TRUST_LABELS.map((l, i) => (
            <span key={l} className="flex items-center gap-2 font-mono text-[12px]" style={{ color: MUTED, letterSpacing: LS_BODY }}>
              {i > 0 && <span style={{ color: BORDER }}>·</span>}
              {l}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
