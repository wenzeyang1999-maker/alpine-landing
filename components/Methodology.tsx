import { BG_CARD, BG_AMBER, INK, SECONDARY, MUTED, VIOLET, GREEN, BORDER, LS_BODY } from "@/lib/constants";

const CREDENTIALS = [
  { stat: "80+", label: "ODD reports authored", accent: VIOLET },
  { stat: "100%", label: "Analyst-reviewed", accent: GREEN },
  { stat: "65", label: "Verification checkpoints", accent: VIOLET },
];

const TRUST_LABELS = [
  "Commercial AI under DPA",
  "Zero Data Retention",
  "SOC 2 program in progress",
  "TLS 1.3",
];

export default function Methodology() {
  return (
    <section className="py-20 px-6" style={{ background: BG_AMBER }}>
      <div className="max-w-5xl mx-auto">

        {/* Header + stat strip combined */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
          <div className="max-w-lg">
            <p className="font-sans text-[11px] uppercase mb-2" style={{ color: VIOLET, fontWeight: 600, letterSpacing: "0.1em" }}>
              Methodology
            </p>
            <h2 className="font-heading" style={{ fontSize: "2rem", fontWeight: 700, lineHeight: 1.08, letterSpacing: "-0.038em", color: INK }}>
              Built on real-world ODD expertise.
            </h2>
            <p className="font-body mt-3 text-[15px]" style={{ color: SECONDARY, fontWeight: 500, lineHeight: 1.6, letterSpacing: LS_BODY }}>
              The speed changes. The review standard does not.
            </p>
          </div>

          {/* Horizontal stat strip — NOT a 3-col card grid */}
          <div className="flex items-center gap-0 rounded-card overflow-x-auto" style={{ border: `1px solid ${BORDER}`, background: BG_CARD }}>
            {CREDENTIALS.map(({ stat, label, accent }, i) => (
              <div
                key={label}
                className="flex flex-col items-center px-5 sm:px-6 py-4 text-center shrink-0"
                style={{
                  background: BG_CARD,
                  borderLeft: i > 0 ? `1px solid ${BORDER}` : "none",
                  minWidth: "120px",
                  flex: 1,
                }}
              >
                <span
                  className="font-heading"
                  style={{ fontSize: "1.5rem", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1, color: accent }}
                >
                  {stat}
                </span>
                <span
                  className="font-mono text-[10px] uppercase mt-2"
                  style={{ color: SECONDARY, fontWeight: 600, letterSpacing: "0.06em" }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Trust labels — horizontal */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t pt-5" style={{ borderColor: BORDER }}>
          {TRUST_LABELS.map((l, i) => (
            <span key={l} className="flex items-center gap-2 font-mono text-[12px]" style={{ color: SECONDARY, letterSpacing: LS_BODY }}>
              {i > 0 && <span style={{ color: BORDER }}>·</span>}
              {l}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
