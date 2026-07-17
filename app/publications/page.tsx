import Link from "next/link";
import SubpageLayout from "@/components/SubpageLayout";
import { INK, MUTED, SUBTLE, BORDER, BG_CARD, VIOLET } from "@/lib/constants";

export const metadata = {
  title: "Publications — Alpine Due Diligence",
  description: "Whitepapers, case studies, and research from Alpine's operational due diligence team.",
};

// Ordered newest first. Case studies are numbered by publication order
// (earliest published = 1), independent of display order.
const PUBLICATIONS = [
  {
    category: "Case Study 4",
    date: "2026 Jul 16 · 9 AM",
    title: "The Credit Suisse Greensill Case: When the Story Was More Confident Than the Records",
    description:
      "How Credit Suisse's Greensill-linked supply-chain-finance funds — about USD 10 billion of client exposure — failed once the assets could not be verified at the claim level. A structured analysis of asset verification, originator risk, insurance diligence, and governance, and the ODD that surfaces it before the forensic review.",
    href: "/case-study/greensill",
    cta: "Read case study →",
    available: true,
    external: false,
  },
  {
    category: "Case Study 3",
    date: "2026 Jul 02 · 9 AM",
    title: "The Abraaj Case: Where Did the Money Go?",
    description:
      "How Abraaj Group, a USD 13 billion impact private equity firm backed by the Gates Foundation, OPIC, and IFC, collapsed once investors could no longer verify where fund cash had gone. A structured analysis of commingling, governance concentration, valuation oversight, and key person control, and the ODD that surfaces it before the forensic review.",
    href: "/case-study/abraaj",
    cta: "Read case study →",
    available: true,
    external: false,
  },
  {
    category: "Case Study 2",
    date: "2026 Jun 18 · 9 AM",
    title: "The Woodford Equity Income Fund Case: When Liquidity Became the Risk",
    description:
      "The fund had a label, a governance structure, a published NAV, and a famous manager. None of those things created liquidity when investors needed cash — a study in what structured fund review is designed to catch before the gate comes down.",
    href: "/case-study/woodford",
    cta: "Read case study →",
    available: true,
    external: false,
  },
  {
    category: "Case Study 1",
    date: "2026 Jun 04 · 9 AM",
    title: "The Carvana Case: Why Operational Due Diligence Matters Before the Fraud Becomes Obvious",
    description:
      "A structured analysis of how governance conflicts, related-party opacity, and reporting quality concerns at Carvana would have been surfaced by a proper ODD review — before Hindenburg's report made them headlines.",
    href: "/case-study/carvana",
    cta: "Read case study →",
    available: true,
    external: false,
  },
  {
    category: "Whitepaper",
    date: "2026 May 21 · 9 AM",
    title: "The Operational Due Diligence Imperative",
    description:
      "A comprehensive framework for evaluating operational risk in alternative investment managers — covering governance, compliance, technology, valuation, and LP communications.",
    href: "/whitepaper",
    cta: "Read whitepaper →",
    available: true,
    external: false,
  },
];

export default function PublicationsPage() {
  return (
    <SubpageLayout>
      <div className="flex-1 w-full">
        <div className="mx-auto max-w-4xl px-6 py-16">
          {/* Header */}
          <div className="mb-12">
            <p
              className="font-mono text-[11px] uppercase mb-3"
              style={{ color: VIOLET, fontWeight: 700, letterSpacing: "0.1em" }}
            >
              Alpine Space · Publications
            </p>
            <h1
              className="font-heading mb-4"
              style={{ fontSize: "2.25rem", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.03em", color: INK }}
            >
              Research & Publications
            </h1>
            <p className="font-body max-w-xl" style={{ fontSize: "1.0625rem", lineHeight: 1.65, color: MUTED }}>
              Whitepapers, case studies, and institutional research from Alpine&apos;s operational due diligence team.
            </p>
          </div>

          {/* Publication cards */}
          <div className="flex flex-col gap-5">
            {PUBLICATIONS.map((pub) => (
              <div
                key={pub.title}
                className="rounded-panel p-6 flex flex-col sm:flex-row sm:items-start gap-5"
                style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className="inline-block font-mono text-[10px] uppercase px-2 py-1 rounded-full"
                      style={{ background: `${VIOLET}15`, color: VIOLET, fontWeight: 700, letterSpacing: "0.08em" }}
                    >
                      {pub.category}
                    </span>
                    <span className="font-mono text-[10px] uppercase" style={{ color: SUBTLE, letterSpacing: "0.08em" }}>
                      {pub.date}
                    </span>
                  </div>
                  <h2
                    className="font-heading mb-2"
                    style={{ fontSize: "1.125rem", fontWeight: 700, color: INK, letterSpacing: "-0.02em" }}
                  >
                    {pub.title}
                  </h2>
                  <p className="font-body text-[14px]" style={{ color: MUTED, lineHeight: 1.6 }}>
                    {pub.description}
                  </p>
                </div>
                <div className="shrink-0 sm:pt-1">
                  {pub.available ? (
                    pub.external ? (
                      <a
                        href={pub.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center rounded-btn px-4 py-2.5 font-body text-[13px] hover:opacity-90 transition-opacity"
                        style={{ background: INK, color: "#fff", fontWeight: 600 }}
                      >
                        {pub.cta}
                      </a>
                    ) : (
                    <Link
                      href={pub.href}
                      className="inline-flex items-center rounded-btn px-4 py-2.5 font-body text-[13px] hover:opacity-90 transition-opacity"
                      style={{ background: INK, color: "#fff", fontWeight: 600 }}
                    >
                      {pub.cta}
                    </Link>
                    )
                  ) : (
                    <span
                      className="inline-flex items-center rounded-btn px-4 py-2.5 font-body text-[13px]"
                      style={{ border: `1px solid ${BORDER}`, color: SUBTLE, fontWeight: 500, cursor: "default" }}
                    >
                      {pub.cta}
                    </span>
                  )
                  }
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SubpageLayout>
  );
}
