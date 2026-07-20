// Single source of truth for the Publications list. Used by the public
// /publications page and by the admin "Announce a publication" broadcast tool.

export interface Publication {
  category: string;
  date: string;
  title: string;
  description: string;
  href: string;
  cta: string;
  available: boolean;
  external: boolean;
}

// Ordered newest first. Case studies are numbered by publication order
// (earliest published = 1), independent of display order.
export const PUBLICATIONS: Publication[] = [
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

/** Absolute URL for a publication (for emails / external links). */
export function publicationUrl(href: string): string {
  if (href.startsWith("http")) return href;
  return `https://alpinedd.com${href}`;
}
