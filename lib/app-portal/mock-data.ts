/**
 * Static mock data for Alpine Demo — mirrors the backend seed.py structure.
 * When connecting a real backend, replace usages of this with API calls.
 */

export interface Fund {
  id: string;
  slug: string;
  name: string;
  description: string;
  strategy: string;
  founded: number;
  hq: string;
  aum: number;
  ytd_return: number;
  inception_return: number;
  volatility: number;
  odd_rating: string;
  odd_score: number;
  last_review_date: string;
  next_review_date: string;
  review_type: string;
  manager_name: string;
  employees: number;
  administrator: string;
  auditor: string;
  prime_broker: string;
  status: string;
  topic_ratings: Record<string, string>;
  recent_activity: { action: string; detail: string; time: string; type: string }[];
  notes: string;
  has_review: boolean;
  review_slug: string | null;
}

export const FUNDS: Fund[] = [
  // ── Equity Hedge ──────────────────────────────────────────────────────────
  {
    id: "fund-001", slug: "ridgeline-capital",
    name: "Ridgeline Capital Partners", description: "Global long/short equity, 100-150 longs, 60-100 shorts across 10-15 countries",
    strategy: "equity_hedge", founded: 2018, hq: "Greenwich, CT",
    aum: 2310000000, ytd_return: 14.2, inception_return: 15.8, volatility: 9.8,
    odd_rating: "WATCHLIST", odd_score: 68, status: "watchlist",
    last_review_date: "2026-01-15", next_review_date: "2027-01-15", review_type: "Annual",
    manager_name: "David Chen", employees: 34,
    administrator: "Citco Fund Services", auditor: "Ernst & Young LLP", prime_broker: "Goldman Sachs / Morgan Stanley",
    topic_ratings: { GOV: "YELLOW", TERMS: "GREEN", REG: "RED", SVCP: "GREEN", INV: "GREEN", TRADE: "GREEN", VAL: "YELLOW", TECH: "GREEN", FIN: "GREEN", ASSET: "GREEN", LEGAL: "YELLOW", RPT: "YELLOW" },
    recent_activity: [
      { action: "ODD Review Completed", detail: "WATCHLIST rating — 4 conditions for ACCEPT upgrade", time: "2 months ago", type: "milestone" },
      { action: "Condition Tracking", detail: "CCO hiring deadline approaching (April 2026)", time: "1 week ago", type: "alert" },
    ],
    notes: "Under active review. WATCHLIST due to compliance gaps (no dedicated CCO, no pre-trade compliance) and governance concerns (founder key person risk).",
    has_review: true, review_slug: "ridgeline-capital",
  },
  {
    id: "fund-002", slug: "harborview-ls",
    name: "Harborview Long/Short Fund", description: "US-focused long/short equity with sector rotation overlay",
    strategy: "equity_hedge", founded: 2012, hq: "Boston, MA",
    aum: 1500000000, ytd_return: 11.8, inception_return: 13.2, volatility: 8.4,
    odd_rating: "ACCEPT", odd_score: 84, status: "accept",
    last_review_date: "2025-09-20", next_review_date: "2026-09-20", review_type: "Annual",
    manager_name: "Rebecca Torres", employees: 28,
    administrator: "SS&C GlobeOp", auditor: "PricewaterhouseCoopers", prime_broker: "J.P. Morgan",
    topic_ratings: { GOV: "GREEN", TERMS: "GREEN", REG: "GREEN", SVCP: "GREEN", INV: "GREEN", TRADE: "GREEN", VAL: "GREEN", TECH: "GREEN", FIN: "GREEN", ASSET: "GREEN", LEGAL: "GREEN", RPT: "GREEN" },
    recent_activity: [
      { action: "Annual Review", detail: "ACCEPT confirmed — no material changes from prior year", time: "6 months ago", type: "milestone" },
      { action: "SOC 2 Certification", detail: "SOC 2 Type II report received — clean opinion", time: "2 months ago", type: "milestone" },
    ],
    notes: "Well-run operation with dedicated CCO, SOC 2 Type II certification, and strong governance. Consistently ACCEPT-rated for 3 consecutive annual reviews.",
    has_review: false, review_slug: null,
  },
  {
    id: "fund-003", slug: "falcon-point-equity",
    name: "Falcon Point Equity Fund", description: "Technology-focused long/short equity with activist overlay",
    strategy: "equity_hedge", founded: 2015, hq: "San Francisco, CA",
    aum: 960000000, ytd_return: 18.6, inception_return: 16.1, volatility: 14.2,
    odd_rating: "WATCHLIST", odd_score: 62, status: "watchlist",
    last_review_date: "2025-11-10", next_review_date: "2026-05-10", review_type: "Event-Driven",
    manager_name: "Kevin Nakamura", employees: 18,
    administrator: "NAV Consulting", auditor: "Deloitte LLP", prime_broker: "Bank of America Merrill Lynch",
    topic_ratings: { GOV: "YELLOW", TERMS: "GREEN", REG: "GREEN", SVCP: "YELLOW", INV: "GREEN", TRADE: "GREEN", VAL: "GREEN", TECH: "RED", FIN: "YELLOW", ASSET: "GREEN", LEGAL: "GREEN", RPT: "YELLOW" },
    recent_activity: [
      { action: "CFO Departure", detail: "CFO resigned in October 2025 — replacement onboarded in December", time: "3 months ago", type: "alert" },
      { action: "Event-Driven Review", detail: "WATCHLIST maintained pending 6-month stability assessment.", time: "4 months ago", type: "milestone" },
    ],
    notes: "WATCHLIST triggered by CFO departure. New CFO (ex-Bridgewater) onboarded December 2025.",
    has_review: false, review_slug: null,
  },
  {
    id: "fund-004", slug: "meridian-global",
    name: "Meridian Global Opportunities", description: "Global multi-cap long/short with macro overlay",
    strategy: "equity_hedge", founded: 2009, hq: "New York, NY",
    aum: 3200000000, ytd_return: 9.4, inception_return: 12.6, volatility: 11.1,
    odd_rating: "ACCEPT", odd_score: 79, status: "accept",
    last_review_date: "2025-06-01", next_review_date: "2026-06-01", review_type: "Annual",
    manager_name: "Sarah Mitchell", employees: 52,
    administrator: "BNY Mellon", auditor: "KPMG LLP", prime_broker: "Goldman Sachs",
    topic_ratings: { GOV: "GREEN", TERMS: "GREEN", REG: "GREEN", SVCP: "GREEN", INV: "YELLOW", TRADE: "GREEN", VAL: "GREEN", TECH: "GREEN", FIN: "GREEN", ASSET: "GREEN", LEGAL: "GREEN", RPT: "GREEN" },
    recent_activity: [
      { action: "Annual Review", detail: "ACCEPT with one monitoring condition on portfolio concentration", time: "10 months ago", type: "milestone" },
    ],
    notes: "Established manager with institutional-grade infrastructure. Minor watchlist note on portfolio concentration limits.",
    has_review: false, review_slug: null,
  },

  // ── Credit & Fixed Income ─────────────────────────────────────────────────
  {
    id: "fund-005", slug: "cascadia-credit",
    name: "Cascadia Credit Opportunities", description: "Distressed credit and special situations across the capital structure",
    strategy: "credit", founded: 2011, hq: "Chicago, IL",
    aum: 1800000000, ytd_return: 10.2, inception_return: 11.8, volatility: 7.4,
    odd_rating: "ACCEPT", odd_score: 82, status: "accept",
    last_review_date: "2025-10-05", next_review_date: "2026-10-05", review_type: "Annual",
    manager_name: "Michael Walsh", employees: 41,
    administrator: "State Street", auditor: "Ernst & Young LLP", prime_broker: "Deutsche Bank",
    topic_ratings: { GOV: "GREEN", TERMS: "GREEN", REG: "GREEN", SVCP: "GREEN", INV: "GREEN", TRADE: "GREEN", VAL: "GREEN", TECH: "GREEN", FIN: "GREEN", ASSET: "GREEN", LEGAL: "GREEN", RPT: "YELLOW" },
    recent_activity: [
      { action: "Annual Review", detail: "ACCEPT maintained. Clean regulatory record confirmed.", time: "5 months ago", type: "milestone" },
    ],
    notes: "Strong credit manager with institutional infrastructure. Minor reporting lag noted.",
    has_review: false, review_slug: null,
  },
  {
    id: "fund-006", slug: "ironwood-credit",
    name: "Ironwood Credit Partners", description: "Senior secured lending and CLO equity across North America",
    strategy: "credit", founded: 2016, hq: "Dallas, TX",
    aum: 920000000, ytd_return: 8.7, inception_return: 9.4, volatility: 5.8,
    odd_rating: "WATCHLIST", odd_score: 65, status: "watchlist",
    last_review_date: "2025-08-20", next_review_date: "2026-02-20", review_type: "Semi-Annual",
    manager_name: "Patricia Lee", employees: 22,
    administrator: "Maples Fund Services", auditor: "Grant Thornton", prime_broker: "Wells Fargo",
    topic_ratings: { GOV: "YELLOW", TERMS: "GREEN", REG: "YELLOW", SVCP: "GREEN", INV: "GREEN", TRADE: "GREEN", VAL: "RED", TECH: "YELLOW", FIN: "GREEN", ASSET: "GREEN", LEGAL: "GREEN", RPT: "YELLOW" },
    recent_activity: [
      { action: "Semi-Annual Review", detail: "Valuation process gaps identified for CLO equity positions", time: "5 months ago", type: "alert" },
    ],
    notes: "WATCHLIST: valuation methodology for illiquid CLO equity positions lacks independent price verification.",
    has_review: false, review_slug: null,
  },
  {
    id: "fund-007", slug: "bluestone-fixed-income",
    name: "Bluestone Fixed Income Fund", description: "Investment-grade corporate bonds with duration management overlay",
    strategy: "credit", founded: 2007, hq: "Minneapolis, MN",
    aum: 4100000000, ytd_return: 5.3, inception_return: 6.8, volatility: 3.2,
    odd_rating: "ACCEPT", odd_score: 91, status: "accept",
    last_review_date: "2025-04-15", next_review_date: "2026-04-15", review_type: "Annual",
    manager_name: "James Park", employees: 67,
    administrator: "Northern Trust", auditor: "PricewaterhouseCoopers", prime_broker: "Barclays",
    topic_ratings: { GOV: "GREEN", TERMS: "GREEN", REG: "GREEN", SVCP: "GREEN", INV: "GREEN", TRADE: "GREEN", VAL: "GREEN", TECH: "GREEN", FIN: "GREEN", ASSET: "GREEN", LEGAL: "GREEN", RPT: "GREEN" },
    recent_activity: [
      { action: "Annual Review", detail: "ACCEPT — exemplary governance and compliance framework", time: "11 months ago", type: "milestone" },
    ],
    notes: "Flagship credit manager. Institutional infrastructure with dedicated legal, compliance, and risk teams.",
    has_review: false, review_slug: null,
  },
  {
    id: "fund-008", slug: "summit-high-yield",
    name: "Summit High Yield Strategy", description: "US and European high yield bonds with credit selection overlay",
    strategy: "credit", founded: 2013, hq: "New York, NY",
    aum: 1350000000, ytd_return: 9.1, inception_return: 10.3, volatility: 8.9,
    odd_rating: "FLAG", odd_score: 48, status: "flag",
    last_review_date: "2025-12-01", next_review_date: "2026-03-01", review_type: "Quarterly",
    manager_name: "Carlos Rivera", employees: 19,
    administrator: "Apex Fund Services", auditor: "BDO USA", prime_broker: "Jefferies",
    topic_ratings: { GOV: "RED", TERMS: "YELLOW", REG: "RED", SVCP: "YELLOW", INV: "GREEN", TRADE: "GREEN", VAL: "YELLOW", TECH: "RED", FIN: "RED", ASSET: "GREEN", LEGAL: "RED", RPT: "RED" },
    recent_activity: [
      { action: "FLAG Issued", detail: "SEC inquiry opened — undisclosed conflicts of interest", time: "4 months ago", type: "alert" },
      { action: "Quarterly Review", detail: "6 conditions set. Engagement with SEC underway.", time: "4 months ago", type: "milestone" },
    ],
    notes: "FLAG: SEC investigation into undisclosed conflicts. Multiple governance, regulatory, and financial controls deficiencies identified. Under enhanced monitoring.",
    has_review: false, review_slug: null,
  },

  // ── Global Macro ──────────────────────────────────────────────────────────
  {
    id: "fund-009", slug: "titan-macro",
    name: "Titan Macro Fund", description: "Discretionary global macro across rates, FX, commodities, and equities",
    strategy: "macro", founded: 2004, hq: "London, UK",
    aum: 8500000000, ytd_return: 16.4, inception_return: 14.9, volatility: 13.7,
    odd_rating: "ACCEPT", odd_score: 88, status: "accept",
    last_review_date: "2025-07-10", next_review_date: "2026-07-10", review_type: "Annual",
    manager_name: "Alistair Pemberton", employees: 89,
    administrator: "Northern Trust", auditor: "Deloitte LLP", prime_broker: "Goldman Sachs / Deutsche Bank",
    topic_ratings: { GOV: "GREEN", TERMS: "GREEN", REG: "GREEN", SVCP: "GREEN", INV: "GREEN", TRADE: "GREEN", VAL: "GREEN", TECH: "GREEN", FIN: "GREEN", ASSET: "GREEN", LEGAL: "GREEN", RPT: "GREEN" },
    recent_activity: [
      { action: "Annual Review", detail: "ACCEPT — best-in-class operational infrastructure", time: "8 months ago", type: "milestone" },
    ],
    notes: "Tier 1 manager. Institutional-grade infrastructure with dedicated CCO, CRO, COO, and legal counsel.",
    has_review: false, review_slug: null,
  },
  {
    id: "fund-010", slug: "atlas-systematic",
    name: "Atlas Systematic Macro", description: "Systematic trend-following and carry strategies across 80+ markets",
    strategy: "macro", founded: 2017, hq: "Chicago, IL",
    aum: 2200000000, ytd_return: 7.8, inception_return: 9.1, volatility: 10.4,
    odd_rating: "ACCEPT", odd_score: 76, status: "accept",
    last_review_date: "2025-11-20", next_review_date: "2026-11-20", review_type: "Annual",
    manager_name: "Jennifer Wei", employees: 31,
    administrator: "SS&C GlobeOp", auditor: "Ernst & Young LLP", prime_broker: "Morgan Stanley",
    topic_ratings: { GOV: "GREEN", TERMS: "GREEN", REG: "GREEN", SVCP: "GREEN", INV: "GREEN", TRADE: "GREEN", VAL: "GREEN", TECH: "GREEN", FIN: "YELLOW", ASSET: "GREEN", LEGAL: "GREEN", RPT: "GREEN" },
    recent_activity: [
      { action: "Annual Review", detail: "ACCEPT with minor note on financial controls documentation", time: "4 months ago", type: "milestone" },
    ],
    notes: "Well-run systematic manager. Minor gap in financial controls documentation flagged for follow-up.",
    has_review: false, review_slug: null,
  },
  {
    id: "fund-011", slug: "vertex-global-macro",
    name: "Vertex Global Macro Fund", description: "Emerging markets macro with rates and currency focus",
    strategy: "macro", founded: 2014, hq: "Singapore",
    aum: 1100000000, ytd_return: 12.1, inception_return: 10.7, volatility: 15.3,
    odd_rating: "WATCHLIST", odd_score: 61, status: "watchlist",
    last_review_date: "2026-02-01", next_review_date: "2026-08-01", review_type: "Semi-Annual",
    manager_name: "Raj Krishnamurthy", employees: 24,
    administrator: "Citco Fund Services", auditor: "Grant Thornton", prime_broker: "Citi",
    topic_ratings: { GOV: "YELLOW", TERMS: "GREEN", REG: "YELLOW", SVCP: "GREEN", INV: "GREEN", TRADE: "GREEN", VAL: "GREEN", TECH: "YELLOW", FIN: "GREEN", ASSET: "GREEN", LEGAL: "YELLOW", RPT: "GREEN" },
    recent_activity: [
      { action: "Semi-Annual Review", detail: "WATCHLIST: regulatory compliance gaps across 3 jurisdictions", time: "2 months ago", type: "alert" },
    ],
    notes: "WATCHLIST: Regulatory complexity across SG/UK/US jurisdictions. CCO bandwidth stretched. Technology infrastructure below institutional standard.",
    has_review: false, review_slug: null,
  },

  // ── Private Equity ────────────────────────────────────────────────────────
  {
    id: "fund-012", slug: "crestwood-pe",
    name: "Crestwood Private Equity Fund IV", description: "Lower middle market buyouts in healthcare and industrials",
    strategy: "private_equity", founded: 2008, hq: "Atlanta, GA",
    aum: 3400000000, ytd_return: 21.3, inception_return: 18.7, volatility: 18.4,
    odd_rating: "ACCEPT", odd_score: 83, status: "accept",
    last_review_date: "2025-08-01", next_review_date: "2026-08-01", review_type: "Annual",
    manager_name: "Thomas Bradley", employees: 58,
    administrator: "Citco Fund Services", auditor: "KPMG LLP", prime_broker: "N/A",
    topic_ratings: { GOV: "GREEN", TERMS: "GREEN", REG: "GREEN", SVCP: "GREEN", INV: "GREEN", TRADE: "GREEN", VAL: "YELLOW", TECH: "GREEN", FIN: "GREEN", ASSET: "GREEN", LEGAL: "GREEN", RPT: "GREEN" },
    recent_activity: [
      { action: "Annual Review", detail: "ACCEPT — minor note on NAV valuation committee independence", time: "8 months ago", type: "milestone" },
    ],
    notes: "Established PE manager with institutional LP base. Minor valuation committee independence flag.",
    has_review: false, review_slug: null,
  },
  {
    id: "fund-013", slug: "lighthouse-growth",
    name: "Lighthouse Growth Equity", description: "Growth equity investments in B2B software and fintech",
    strategy: "private_equity", founded: 2019, hq: "Austin, TX",
    aum: 780000000, ytd_return: 28.4, inception_return: 24.1, volatility: 22.7,
    odd_rating: "WATCHLIST", odd_score: 58, status: "watchlist",
    last_review_date: "2025-12-15", next_review_date: "2026-06-15", review_type: "Semi-Annual",
    manager_name: "Amanda Foster", employees: 15,
    administrator: "Apex Fund Services", auditor: "BDO USA", prime_broker: "N/A",
    topic_ratings: { GOV: "YELLOW", TERMS: "YELLOW", REG: "GREEN", SVCP: "YELLOW", INV: "GREEN", TRADE: "GREEN", VAL: "RED", TECH: "YELLOW", FIN: "YELLOW", ASSET: "GREEN", LEGAL: "GREEN", RPT: "YELLOW" },
    recent_activity: [
      { action: "Semi-Annual Review", detail: "WATCHLIST: immature governance for AUM scale", time: "4 months ago", type: "alert" },
    ],
    notes: "Emerging manager growing rapidly. Governance infrastructure not keeping pace with AUM growth.",
    has_review: false, review_slug: null,
  },
  {
    id: "fund-014", slug: "pinnacle-buyout",
    name: "Pinnacle Buyout Partners VI", description: "Large-cap buyouts in consumer and business services",
    strategy: "private_equity", founded: 2001, hq: "New York, NY",
    aum: 12000000000, ytd_return: 17.8, inception_return: 16.4, volatility: 20.1,
    odd_rating: "ACCEPT", odd_score: 90, status: "accept",
    last_review_date: "2025-03-01", next_review_date: "2026-03-01", review_type: "Annual",
    manager_name: "Robert Donovan", employees: 142,
    administrator: "State Street", auditor: "Deloitte LLP", prime_broker: "N/A",
    topic_ratings: { GOV: "GREEN", TERMS: "GREEN", REG: "GREEN", SVCP: "GREEN", INV: "GREEN", TRADE: "GREEN", VAL: "GREEN", TECH: "GREEN", FIN: "GREEN", ASSET: "GREEN", LEGAL: "GREEN", RPT: "GREEN" },
    recent_activity: [
      { action: "Annual Review", detail: "ACCEPT — top-quartile operational infrastructure", time: "13 months ago", type: "milestone" },
    ],
    notes: "Best-in-class large-cap PE manager. Clean regulatory record, dedicated legal/compliance/risk teams.",
    has_review: false, review_slug: null,
  },

  // ── Real Assets ───────────────────────────────────────────────────────────
  {
    id: "fund-015", slug: "stonebridge-infra",
    name: "Stonebridge Infrastructure Fund III", description: "Core/core-plus infrastructure across North America and Europe",
    strategy: "real_assets", founded: 2010, hq: "Denver, CO",
    aum: 5600000000, ytd_return: 9.2, inception_return: 10.1, volatility: 6.8,
    odd_rating: "ACCEPT", odd_score: 86, status: "accept",
    last_review_date: "2025-05-20", next_review_date: "2026-05-20", review_type: "Annual",
    manager_name: "Linda Chow", employees: 74,
    administrator: "BNY Mellon", auditor: "PricewaterhouseCoopers", prime_broker: "N/A",
    topic_ratings: { GOV: "GREEN", TERMS: "GREEN", REG: "GREEN", SVCP: "GREEN", INV: "GREEN", TRADE: "GREEN", VAL: "GREEN", TECH: "GREEN", FIN: "GREEN", ASSET: "GREEN", LEGAL: "GREEN", RPT: "GREEN" },
    recent_activity: [
      { action: "Annual Review", detail: "ACCEPT — mature infrastructure manager, no material findings", time: "10 months ago", type: "milestone" },
    ],
    notes: "Institutional infrastructure manager with 15-year track record and deep regulatory expertise.",
    has_review: false, review_slug: null,
  },
  {
    id: "fund-016", slug: "redrock-real-estate",
    name: "Redrock Real Estate Partners", description: "Value-add real estate across commercial, multifamily, and industrial",
    strategy: "real_assets", founded: 2006, hq: "Phoenix, AZ",
    aum: 2800000000, ytd_return: 11.7, inception_return: 13.2, volatility: 12.3,
    odd_rating: "WATCHLIST", odd_score: 63, status: "watchlist",
    last_review_date: "2025-09-10", next_review_date: "2026-03-10", review_type: "Semi-Annual",
    manager_name: "Steven Hart", employees: 48,
    administrator: "Maples Fund Services", auditor: "Grant Thornton", prime_broker: "N/A",
    topic_ratings: { GOV: "GREEN", TERMS: "YELLOW", REG: "GREEN", SVCP: "GREEN", INV: "GREEN", TRADE: "GREEN", VAL: "YELLOW", TECH: "YELLOW", FIN: "YELLOW", ASSET: "YELLOW", LEGAL: "GREEN", RPT: "GREEN" },
    recent_activity: [
      { action: "Semi-Annual Review", detail: "WATCHLIST: asset verification process inadequate for illiquid holdings", time: "7 months ago", type: "alert" },
    ],
    notes: "WATCHLIST: Asset verification and valuation processes need improvement for complex illiquid real estate positions.",
    has_review: false, review_slug: null,
  },
  {
    id: "fund-017", slug: "pacific-timber",
    name: "Pacific Timber & Natural Resources", description: "Sustainable forestry and natural resource investments in North America",
    strategy: "real_assets", founded: 2003, hq: "Seattle, WA",
    aum: 1900000000, ytd_return: 7.4, inception_return: 8.9, volatility: 8.1,
    odd_rating: "ACCEPT", odd_score: 77, status: "accept",
    last_review_date: "2025-07-15", next_review_date: "2026-07-15", review_type: "Annual",
    manager_name: "Margaret Olson", employees: 36,
    administrator: "Citco Fund Services", auditor: "KPMG LLP", prime_broker: "N/A",
    topic_ratings: { GOV: "GREEN", TERMS: "GREEN", REG: "GREEN", SVCP: "GREEN", INV: "GREEN", TRADE: "GREEN", VAL: "YELLOW", TECH: "GREEN", FIN: "GREEN", ASSET: "GREEN", LEGAL: "GREEN", RPT: "GREEN" },
    recent_activity: [
      { action: "Annual Review", detail: "ACCEPT — minor note on timber valuation methodology", time: "8 months ago", type: "milestone" },
    ],
    notes: "Established natural resources manager. Minor note on timber valuation methodology for unique assets.",
    has_review: false, review_slug: null,
  },
  {
    id: "fund-018", slug: "summit-energy-transition",
    name: "Summit Energy Transition Fund", description: "Renewable energy infrastructure and energy transition assets globally",
    strategy: "real_assets", founded: 2021, hq: "Houston, TX",
    aum: 650000000, ytd_return: 14.8, inception_return: 12.3, volatility: 16.4,
    odd_rating: "WATCHLIST", odd_score: 55, status: "watchlist",
    last_review_date: "2026-01-05", next_review_date: "2026-07-05", review_type: "Semi-Annual",
    manager_name: "Andrew Kim", employees: 12,
    administrator: "Apex Fund Services", auditor: "BDO USA", prime_broker: "N/A",
    topic_ratings: { GOV: "YELLOW", TERMS: "YELLOW", REG: "YELLOW", SVCP: "YELLOW", INV: "GREEN", TRADE: "GREEN", VAL: "YELLOW", TECH: "YELLOW", FIN: "YELLOW", ASSET: "GREEN", LEGAL: "YELLOW", RPT: "YELLOW" },
    recent_activity: [
      { action: "Initial Review", detail: "WATCHLIST: emerging manager, infrastructure build-out underway", time: "3 months ago", type: "alert" },
    ],
    notes: "Emerging manager (founded 2021). Multiple operational gaps expected given stage. Under enhanced monitoring with 6-month follow-up.",
    has_review: false, review_slug: null,
  },

  // ── Venture Capital ───────────────────────────────────────────────────────
  {
    id: "fund-019", slug: "trellis-capital-iv",
    name: "Trellis Capital IV, L.P.", description: "Pre-seed venture capital targeting 40–50 technology companies at $1–3M per investment",
    strategy: "venture_capital", founded: 2018, hq: "San Francisco, CA",
    aum: 280300000, ytd_return: 0, inception_return: 0, volatility: 0,
    odd_rating: "WATCHLIST", odd_score: 0, status: "watchlist",
    last_review_date: "2026-04-03", next_review_date: "2026-10-03", review_type: "Initial (Pre-Launch)",
    manager_name: "Arjun Mehta / Priya Sharma", employees: 7,
    administrator: "Apex Fund Services (expected)", auditor: "Baker Thompson & Co. LLP (expected)", prime_broker: "N/A",
    topic_ratings: { GOV: "YELLOW", TERMS: "GREEN", REG: "RED", SVCP: "GREEN", INV: "YELLOW", TRADE: "GREEN", VAL: "YELLOW", TECH: "RED", FIN: "GREEN", ASSET: "GREEN", LEGAL: "GREEN", RPT: "GREEN" },
    recent_activity: [
      { action: "Initial ODD Review", detail: "YELLOW: 2 RED chapters (Legal/Compliance, Technology/Cybersecurity), 3 required actions before close", time: "18 days ago", type: "alert" },
      { action: "Administrator Call", detail: "Apex Fund Services confirmed expected engagement for Fund IV", time: "18 days ago", type: "milestone" },
    ],
    notes: "YELLOW: IT/cybersecurity substantially underdeveloped. Investment professional responsible for compliance (required action). Limited back-office staffing. Fractional CFO (Raj Patel) joining Summer 2026.",
    has_review: true, review_slug: "trellis-capital-iv",
  },
];

export const PORTFOLIO_STATS = {
  total_funds: 19,
  accept: 10,
  watchlist: 8,
  flag: 1,
  avg_score: 74.3,
  rating_counts: { green: 10, yellow: 7, red: 1 },
  total_aum: FUNDS.reduce((s, f) => s + f.aum, 0),
  strategies: [
    { id: "equity_hedge", name: "Equity Hedge", count: 4 },
    { id: "credit", name: "Credit & FI", count: 4 },
    { id: "macro", name: "Global Macro", count: 3 },
    { id: "private_equity", name: "Private Equity", count: 3 },
    { id: "real_assets", name: "Real Assets", count: 4 },
    { id: "venture_capital", name: "Venture Capital", count: 1 },
  ],
};

export const PIPELINE_TARGETS = [
  { id: "pipe-001", name: "Cerberus Capital Management", strategy: "private_equity", aum: 5600000000, stage: "screening", passed: false, pass_reason: null, added_date: "2026-01-20" },
  { id: "pipe-002", name: "Two Sigma Investments", strategy: "macro", aum: 60000000000, stage: "under_review", passed: false, pass_reason: null, added_date: "2025-12-10" },
  { id: "pipe-003", name: "Bridgewater Associates", strategy: "macro", aum: 150000000000, stage: "ic_ready", passed: false, pass_reason: null, added_date: "2025-11-01" },
  { id: "pipe-004", name: "Elliott Management", strategy: "credit", aum: 65000000000, stage: "screening", passed: false, pass_reason: null, added_date: "2026-02-05" },
  { id: "pipe-005", name: "Ares Capital Corp", strategy: "credit", aum: 21000000000, stage: "under_review", passed: false, pass_reason: null, added_date: "2026-01-08" },
  { id: "pipe-006", name: "KKR Credit Advisors", strategy: "private_equity", aum: 31000000000, stage: "screening", passed: false, pass_reason: null, added_date: "2026-03-01" },
  { id: "pipe-007", name: "Varde Partners", strategy: "credit", aum: 14000000000, stage: "ic_ready", passed: false, pass_reason: null, added_date: "2025-10-15" },
  { id: "pipe-008", name: "Highfields Capital", strategy: "equity_hedge", aum: 3200000000, stage: "under_review", passed: false, pass_reason: null, added_date: "2026-02-20" },
];

export const TOPIC_MATRIX = (() => {
  const result: Record<string, Record<string, string>> = {};
  for (const fund of FUNDS) {
    result[fund.slug] = fund.topic_ratings;
  }
  return result;
})();

export const KPI_DATA = {
  portfolio_kpis: {
    total_aum: FUNDS.reduce((s, f) => s + f.aum, 0),
    avg_odd_score: 74.3,
    accept_rate: 55.6,
    watchlist_rate: 33.3,
    flag_rate: 5.6,
    reviews_completed_ytd: 12,
    avg_review_time_days: 18,
    upcoming_reviews_30d: 3,
  },
  kpi_alerts: [
    { id: "a1", fund_slug: "ridgeline-capital", fund_name: "Ridgeline Capital Partners", alert_type: "condition_deadline", severity: "high", message: "CCO hiring condition deadline in 30 days", created_at: new Date(Date.now() - 2 * 86400000).toISOString() },
    { id: "a2", fund_slug: "summit-high-yield", fund_name: "Summit High Yield Strategy", alert_type: "regulatory", severity: "critical", message: "SEC inquiry — response due within 14 days", created_at: new Date(Date.now() - 1 * 86400000).toISOString() },
    { id: "a3", fund_slug: "vertex-global-macro", fund_name: "Vertex Global Macro Fund", alert_type: "review_due", severity: "medium", message: "Semi-annual review scheduled for next month", created_at: new Date(Date.now() - 5 * 86400000).toISOString() },
  ],
};

export const ACTIVITY_FEED = [
  { id: "act-001", event_type: "review_completed", actor: "Alpine ODD Engine", target: "Ridgeline Capital Partners", detail: "Annual ODD review completed — WATCHLIST rating assigned", created_at: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: "act-002", event_type: "condition_alert", actor: "System", target: "Ridgeline Capital Partners", detail: "CCO hiring deadline approaching — 30 days remaining", created_at: new Date(Date.now() - 1 * 86400000).toISOString() },
  { id: "act-003", event_type: "review_started", actor: "Alpine ODD Engine", target: "Vertex Global Macro Fund", detail: "Semi-annual review initiated", created_at: new Date(Date.now() - 3 * 86400000).toISOString() },
  { id: "act-004", event_type: "flag_issued", actor: "Alpine ODD Engine", target: "Summit High Yield Strategy", detail: "FLAG rating issued — SEC inquiry identified", created_at: new Date(Date.now() - 4 * 86400000).toISOString() },
  { id: "act-005", event_type: "report_generated", actor: "Alpine ODD Engine", target: "Harborview Long/Short Fund", detail: "Annual ODD report generated — ACCEPT confirmed", created_at: new Date(Date.now() - 7 * 86400000).toISOString() },
];
