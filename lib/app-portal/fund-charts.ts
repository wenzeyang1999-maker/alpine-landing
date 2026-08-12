/**
 * Synthetic entity + organizational charts for the demo ODD reports.
 *
 * These power two source-backed diagrams the allocator report renders above the
 * relevant chapter narrative:
 *   - EntityChart — legal/fund structure (manager / GP / fund / feeders / SPVs /
 *     service providers). Rendered on the "Fund Structure" topic.
 *   - OrgChart   — management org chart with reporting lines and risk flags.
 *     Rendered on the "Manager, Ownership & Governance" topic.
 *
 * Every node may carry a `ref` ({ source, quote }) that renders as a RefDot —
 * the same click-to-verify citation used in the narrative. This is the
 * differentiator over static competitor charts: the boxes are sourced.
 *
 * Data is keyed by the report-registry `dataKey` (aurora, trellis, granite, …).
 */

export type Flag = "green" | "yellow" | "red";

/** A click-to-verify citation on a chart node — maps to <RefDot source quote />. */
export interface ChartRef {
  source: string; // must be a key in the fund's *_SOURCE_META
  quote: string;
}

// ── Entity (legal structure) ─────────────────────────────────────────────────

export type EntityKind =
  | "investors"
  | "manager"
  | "gp"
  | "fund"
  | "master"
  | "feeder"
  | "vehicle"
  | "provider";

export interface EntityNode {
  label: string;
  sublabel?: string; // jurisdiction, formation date, AUM, etc.
  kind: EntityKind;
  flag?: Flag;
  status?: string; // e.g. "Confirmed", "Expected" (service providers)
  ref?: ChartRef;
}

export interface EntityChartData {
  /** Optional headline above the diagram. */
  caption?: string;
  /** Top tier — the LP / investor base (label only is fine). */
  investors?: EntityNode;
  /** Management company (left of the fund). */
  manager: EntityNode;
  /** General partner (right of the fund). Omit for non-LP structures. */
  gp?: EntityNode;
  /** The subject fund (center). */
  fund: EntityNode;
  /** Master fund, for master-feeder structures. */
  master?: EntityNode;
  /** Feeder vehicles (onshore / offshore) flowing into the master or fund. */
  feeders?: EntityNode[];
  /** Sibling vehicles: prior funds, co-investment SPVs, separately managed accounts. */
  vehicles?: EntityNode[];
  /** Service-provider rail attached to the fund (admin, auditor, bank, counsel). */
  providers?: EntityNode[];
  /** Footnote under the diagram. */
  note?: string;
}

// ── Organizational chart ─────────────────────────────────────────────────────

export interface OrgPerson {
  name: string;
  title: string;
  flag?: Flag;
  /** Short status, e.g. "departing Summer 2026", "joined Q2 2025". */
  note?: string;
  ref?: ChartRef;
}

export interface OrgGroup {
  label: string; // "Investment Team", "Compliance", "Finance & Operations", …
  people: OrgPerson[];
}

export interface OrgChartData {
  caption?: string;
  /** Top tier — founders / managing partners, rendered side by side. */
  leadership: OrgPerson[];
  /** Functional groups reporting to leadership. */
  groups: OrgGroup[];
  /** Dotted-line advisors / outsourced roles (fractional CFO, deal counsel, etc.). */
  advisors?: OrgPerson[];
  note?: string;
}

// ── Per-fund registry ────────────────────────────────────────────────────────

export interface FundCharts {
  /** Topic number whose chapter shows the entity chart (Fund Structure). */
  entityTopic: number;
  /** Topic number whose chapter shows the org chart (Manager / Governance). */
  orgTopic: number;
  entity: EntityChartData;
  org: OrgChartData;
}

export const FUND_CHARTS: Record<string, FundCharts> = {
  trellis: {
    entityTopic: 4,
    orgTopic: 1,
    entity: {
      caption: "Fund IV legal structure",
      investors: { label: "Limited Partners", sublabel: "~$125M initial close · $200M hard cap", kind: "investors", ref: { source: "LPA", quote: "Fund IV initial close ~$125 million, $200 million hard cap" } },
      manager: { label: "Trellis Capital Management, LLC", sublabel: "Investment manager · San Francisco", kind: "manager", ref: { source: "Form ADV", quote: "Trellis Capital Management, LLC, manager, San Francisco" } },
      gp: { label: "Trellis Capital GP IV, LLC", sublabel: "Delaware LLC · General Partner", kind: "gp", ref: { source: "Delaware Register", quote: "Trellis Capital GP IV, LLC confirmed on the Delaware register" } },
      fund: { label: "Trellis Capital IV, L.P.", sublabel: "Delaware LP · formed Mar 28, 2026", kind: "fund", ref: { source: "Delaware Register", quote: "Trellis Capital IV, L.P., Delaware limited partnership, formed March 28, 2026" } },
      vehicles: [
        { label: "Co-investment SPVs", sublabel: "$24.7M (12/31/25)", kind: "vehicle", ref: { source: "DDQ", quote: "co-investment SPVs total $24.7 million" } },
        { label: "Funds I–III", sublabel: "$47M · $78M · $150M (prior vintages)", kind: "vehicle", ref: { source: "DDQ", quote: "four funds, Fund I through Fund IV" } },
      ],
      providers: [
        { label: "Apex Fund Services", sublabel: "Administrator", kind: "provider", status: "Engaged since Fund I", flag: "green", ref: { source: "Apex Verification Call", quote: "Apex administrator since Fund I, uses Xero and FundPanel" } },
        { label: "Baker Thompson & Co", sublabel: "Auditor", kind: "provider", status: "Prior funds", flag: "yellow", ref: { source: "DDQ", quote: "Baker Thompson & Co audits prior funds and certain SPVs" } },
        { label: "Pacific Commerce → JP Morgan", sublabel: "Banking", kind: "provider", status: "Transitioning", flag: "yellow", ref: { source: "Apex Verification Call", quote: "banking transition from Pacific Commerce to JP Morgan" } },
        { label: "Morrison Cole Ashworth", sublabel: "Legal counsel", kind: "provider", status: "Engaged", flag: "green", ref: { source: "DDQ", quote: "legal counsel Morrison Cole Ashworth" } },
      ],
      note: "Single Delaware LP (no master-feeder). GP commits ~1% pari passu with LPs.",
    },
    org: {
      caption: "Management organization · 7 FTEs",
      leadership: [
        { name: "Arjun Mehta", title: "Co-Founder, Managing Partner", ref: { source: "Form ADV", quote: "Arjun Mehta, Co-Founder, Managing Partner, 50% owner" } },
        { name: "Priya Sharma", title: "Co-Founder, Managing Partner", flag: "red", note: "also holds compliance oversight", ref: { source: "Form ADV", quote: "Priya Sharma responsible for compliance oversight, an investment professional" } },
      ],
      groups: [
        {
          label: "Investment Team",
          people: [
            { name: "Kevin Chen", title: "Principal", note: "joined Q2 2025", ref: { source: "DDQ", quote: "Kevin Chen, Principal, joined Q2 2025" } },
            { name: "Rachel Winters", title: "Associate", ref: { source: "DDQ", quote: "Rachel Winters, Associate" } },
            { name: "Ryan Mitchell", title: "Analyst", ref: { source: "DDQ", quote: "Ryan Mitchell, Analyst" } },
            { name: "Vikram Nair", title: "Chief Portfolio Officer", flag: "yellow", note: "departing Summer 2026", ref: { source: "DDQ", quote: "Vikram Nair, Chief Portfolio Officer, departure planned Summer 2026" } },
          ],
        },
        {
          label: "Operations",
          people: [
            { name: "Sarah Collins", title: "Head of Operations", flag: "yellow", note: "executive-assistant focus, not back office", ref: { source: "DDQ", quote: "Sarah Collins, Head of Operations, executive-assistant focus" } },
          ],
        },
      ],
      advisors: [
        { name: "Raj Patel", title: "Fractional CFO", note: "expected Summer 2026 · Apex oversight", ref: { source: "DDQ", quote: "Raj Patel, fractional CFO, expected Summer 2026" } },
        { name: "James Crawford", title: "Independent Deal Counsel", note: "engaged ad hoc per transaction", ref: { source: "DDQ", quote: "James Crawford, independent deal counsel, engaged ad hoc" } },
      ],
      note: "50/50 ownership (Mehta / Sharma). No formal succession plan; key-person insurance not maintained.",
    },
  },
  "aurora": {
    entityTopic: 4,
    orgTopic: 1,
    entity: {
      caption: "Fund IV legal structure",
      investors: { label: "Limited Partners", sublabel: "$135M raised · $300M target · final close end-2026", kind: "investors", ref: { source: "DDQ", quote: "raised 135 million, 300 million target, final close end of 2026" } },
      manager: { label: "Aurora Capital Management, LLC", sublabel: "Manager · Los Angeles · fully remote", kind: "manager", ref: { source: "Form ADV", quote: "Aurora Capital Management, LLC, Manager, Los Angeles" } },
      gp: { label: "Aurora Ventures GP IV, LLC", sublabel: "Delaware LLC · General Partner", kind: "gp", ref: { source: "LPA", quote: "Aurora Ventures GP IV, LLC serves as the general partner" } },
      fund: { label: "Aurora Ventures IV, L.P.", sublabel: "Delaware LP · formed Jun 26, 2025", kind: "fund", ref: { source: "Delaware Register", quote: "Aurora Ventures IV, L.P., Delaware LP, formed June 26, 2025" } },
      vehicles: [
        { label: "Aurora Ventures I–III", sublabel: "Flagship; Funds I, II fully invested; III active", kind: "vehicle", ref: { source: "DDQ", quote: "flagship strategy, three prior vintages, Fund III active" } },
        { label: "Aurora AI Fund / Chain Fund", sublabel: "$304.66M AI · $42M blockchain", kind: "vehicle", ref: { source: "DDQ", quote: "AI Fund 304.66 million, Chain Fund 42 million" } },
        { label: "Co-investment SPVs", sublabel: "$11.36M · three SPVs (prior vintages)", kind: "vehicle", ref: { source: "DDQ", quote: "three co-investment SPVs combined 11.36 million" } },
        { label: "Horizon Ventures (2012)", sublabel: "$120.56M legacy · no new investments since 2016", kind: "vehicle", ref: { source: "DDQ", quote: "Horizon legacy positions, no new investments since 2016" } },
      ],
      providers: [
        { label: "Meridian Fund Services, LLC", sublabel: "Administrator · Thousand Oaks, CA", kind: "provider", status: "Engaged since prior vintages", flag: "green", ref: { source: "Meridian Verification Call", quote: "Meridian confirmed engagement as Administrator, April 9" } },
        { label: "Grant Baker LLP", sublabel: "Auditor", kind: "provider", status: "Expected — letter not signed", flag: "yellow", ref: { source: "DDQ", quote: "Grant Baker expected auditor, engagement letter not yet signed" } },
        { label: "Pacific Tech Bank / Continental Commercial Bank", sublabel: "Banking", kind: "provider", status: "Engaged · main + backup", flag: "green", ref: { source: "Meridian Verification Call", quote: "Meridian confirmed PTB and CCB as corporate bankers" } },
        { label: "Brennan Kincaid LLP", sublabel: "Legal counsel · AML/KYC", kind: "provider", status: "Engaged", flag: "green", ref: { source: "DDQ", quote: "Brennan Kincaid LLP legal counsel and AML KYC" } },
      ],
      note: "Standalone Delaware LP (no master-feeder). GP commits at least $9M (~3%), partially cashless.",
    },
    org: {
      caption: "Management organization · 9 FTEs (6 investment, 3 back office)",
      leadership: [
        { name: "Marcus Reeves", title: "Co-Founder, General Partner", flag: "yellow", note: "actor / film producer — headline risk", ref: { source: "Form ADV", quote: "Marcus Reeves, Co-Founder, General Partner, 40% ownership" } },
        { name: "Daniel Brenner", title: "Co-Founder, General Partner", flag: "red", note: "talent manager; Mythic / LunarPay inquiry", ref: { source: "Form ADV", quote: "Daniel Brenner, 40% ownership, subject of Mythic LunarPay inquiry" } },
        { name: "Rebecca Stern", title: "General Partner", note: "leads day-to-day management; 20% owner", ref: { source: "Form ADV", quote: "Rebecca Stern leads day-to-day management, 20% ownership" } },
      ],
      groups: [
        {
          label: "Investment Team",
          people: [
            { name: "Austin Knight", title: "Principal", note: "joined January 2023", ref: { source: "DDQ", quote: "Austin Knight, Principal, joined January 2023" } },
            { name: "Sofia Marchetti", title: "Senior Associate", note: "joined October 2025", ref: { source: "DDQ", quote: "Sofia Marchetti, Senior Associate, joined October 2025" } },
            { name: "Connor Lyle", title: "Analyst", note: "joined September 2025", ref: { source: "DDQ", quote: "Connor Lyle, Analyst, joined September 2025" } },
          ],
        },
        {
          label: "Finance, Operations & Compliance",
          people: [
            { name: "Kevin Park", title: "VP, Finance and Operations", flag: "red", note: "sole back office; also holds compliance — no dedicated CCO", ref: { source: "DDQ", quote: "Kevin Park sole back office, handles compliance, no dedicated CCO" } },
            { name: "Elena Ruiz", title: "Operating Partner", note: "capital formation; covers Kevin if out", ref: { source: "DDQ", quote: "Elena Ruiz, Operating Partner, joined March 2025" } },
          ],
        },
      ],
      advisors: [
        { name: "Apex Compliance Advisors", title: "External Compliance Consultant", note: "engaged Q3 2025 to formalize program", ref: { source: "DDQ", quote: "Apex Compliance Advisors engaged Q3 2025 to formalize compliance" } },
        { name: "Vantage Tech Partners, LLC", title: "Outsourced IT / Cybersecurity", note: "Kevin Park internal liaison", ref: { source: "DDQ", quote: "IT functions outsourced to Vantage Tech Partners" } },
      ],
      note: "40/40/20 ownership (Reeves / Brenner / Stern). No formal succession plan; no key person insurance.",
    },
  },
  "granite": {
    entityTopic: 4,
    orgTopic: 1,
    entity: {
      caption: "Granite VII legal & fund structure",
      investors: { label: "Limited Partners", sublabel: "$1.5B target · $1.8B hard cap · $940M first close (12/2025)", kind: "investors", ref: { source: "LPA", quote: "1.5 billion target, 1.8 billion hard cap" } },
      manager: { label: "Granite Capital Management, LLC", sublabel: "Investment manager · New York (HQ), Charlotte, Chicago", kind: "manager", ref: { source: "Form ADV", quote: "Granite Capital Management, LLC, manager, New York" } },
      gp: { label: "Granite VII GP", sublabel: "General Partner · 3% cash commitment (~$45M)", kind: "gp", ref: { source: "LPA", quote: "General Partner committed 3% in cash, ~45 million" } },
      fund: { label: "Granite VII Credit Partners, L.P.", sublabel: "Delaware LP · senior direct lending", kind: "fund", ref: { source: "LPA", quote: "Granite VII Credit Partners, L.P., a Delaware limited partnership" } },
      feeders: [
        { label: "Granite VII Credit Partners (Cayman), Ltd.", sublabel: "Cayman feeder · non-US & US tax-exempt", kind: "feeder", ref: { source: "LPA", quote: "parallel Cayman feeder for non-US and tax-exempt investors" } },
      ],
      vehicles: [
        { label: "Managed Account Vehicles (x2)", sublabel: "part of $4.21B firmwide platform", kind: "vehicle", ref: { source: "Form ADV", quote: "two managed account vehicles and one CLO" } },
        { label: "Granite CLO", sublabel: "one collateralized loan obligation", kind: "vehicle", ref: { source: "Form ADV", quote: "two managed account vehicles and one CLO" } },
        { label: "$400M Subscription Facility", sublabel: "JPMorgan · secured by uncalled commitments · $185M drawn (19.7% of commitments)", kind: "vehicle", flag: "yellow", ref: { source: "DDQ", quote: "400 million subscription credit facility with JPMorgan" } },
      ],
      providers: [
        { label: "State Street Alt. Investment Services", sublabel: "Administrator", kind: "provider", status: "Since 2014", flag: "green", ref: { source: "Admin Agreement", quote: "State Street fund administrator since 2014" } },
        { label: "PricewaterhouseCoopers LLP", sublabel: "Auditor", kind: "provider", status: "Since 2010 (fund inception)", flag: "green", ref: { source: "Audit Letter", quote: "PricewaterhouseCoopers auditor since inception in 2010" } },
        { label: "JPMorgan Chase, N.A.", sublabel: "Prime / agent bank", kind: "provider", status: "Agent bank + NAV facility", flag: "green", ref: { source: "DDQ", quote: "JPMorgan Chase, N.A. principal banking and agent bank" } },
        { label: "Schulte Roth & Zabel LLP", sublabel: "Fund counsel", kind: "provider", status: "Primary fund & compliance counsel", flag: "green", ref: { source: "DDQ", quote: "Schulte Roth & Zabel primary fund counsel" } },
      ],
      note: "Delaware LP with parallel Cayman feeder. GP commits 3% in cash, funded pari passu with no fee offset.",
    },
    org: {
      caption: "Granite Capital Management · 47 FTEs",
      leadership: [
        { name: "Stephen Halloway", title: "Chief Executive Officer, Co-Founder", ref: { source: "DDQ", quote: "Stephen Halloway, CEO, co-founder, former GE Capital" } },
        { name: "Margaret Liu", title: "Chief Investment Officer, Co-Founder", note: "designated successor to CEO; chairs Valuation Committee", ref: { source: "DDQ", quote: "Margaret Liu, CIO, co-founder, immediate successor to Halloway" } },
      ],
      groups: [
        {
          label: "Investment & Origination",
          people: [
            { name: "Daniel Ortiz", title: "Head of Originations", note: "joined 2023 from Antares; designated CIO successor", ref: { source: "DDQ", quote: "Daniel Ortiz, Head of Originations, joined 2023 from Antares Capital" } },
            { name: "Robert Yates", title: "Head of Portfolio Management", ref: { source: "DDQ", quote: "Robert Yates, Head of Portfolio Management" } },
            { name: "Sarah Henderson", title: "Head of Workout", note: "joined 2020 from CarVal", ref: { source: "DDQ", quote: "Sarah Henderson, workout team, joined 2020 from CarVal" } },
          ],
        },
        {
          label: "Credit Risk",
          people: [
            { name: "Priya Walsh", title: "Head of Credit Risk", note: "joined 2024 from Golub; veto on all new investments", ref: { source: "DDQ", quote: "Priya Walsh, Head of Credit Risk, veto on new investments" } },
          ],
        },
        {
          label: "Operations & Finance",
          people: [
            { name: "Caroline McKenzie", title: "Head of Fund Operations", note: "annual on-site of State Street", ref: { source: "DDQ", quote: "Caroline McKenzie, Head of Fund Operations" } },
            { name: "Robert Sokolov", title: "Director of Information Technology", note: "reports to COO; oversees cybersecurity", ref: { source: "DDQ", quote: "Robert Sokolov, Director of Information Technology" } },
          ],
        },
        {
          label: "Compliance & Legal",
          people: [
            { name: "Wei Chen", title: "Chief Compliance Officer", note: "joined 2025 from Sixth Street; no investment role", ref: { source: "DDQ", quote: "Wei Chen, CCO, joined 2025 from Sixth Street, no investment role" } },
          ],
        },
      ],
      advisors: [
        { name: "Schulte Roth & Zabel LLP", title: "Outside Compliance Counsel", note: "annual mock SEC exam each fall", ref: { source: "DDQ", quote: "Schulte Roth & Zabel outside compliance counsel, annual mock exam" } },
        { name: "Houlihan Lokey", title: "Independent Valuation Reviewer", note: "semi-annual on 100% of portfolio", ref: { source: "DDQ", quote: "Houlihan Lokey independent valuation review semi-annual" } },
      ],
      note: "Employees own 78% (across 17 partners); Laurentide Pension Partners holds 22% passive minority with no voting rights. Formal succession plan; $25M key-person insurance on each Executive Committee member.",
    },
  },
  "cordova": {
    entityTopic: 4,
    orgTopic: 1,
    entity: {
      caption: "Fund III legal structure",
      investors: { label: "Limited Partners", sublabel: "$750M target · $850M hard cap · $520M raised (12/2025)", kind: "investors", ref: { source: "DDQ", quote: "$750M target / $850M hard cap; $520M raised through 12/2025" } },
      manager: { label: "Cordova Capital Partners, LLC", sublabel: "Investment manager · Dallas, TX · ERA", kind: "manager", ref: { source: "Form ADV", quote: "Cordova Capital Partners, LLC, manager, Dallas TX" } },
      gp: { label: "Cordova JV III GP", sublabel: "General Partner · 2% cash commitment", kind: "gp", ref: { source: "LPA", quote: "GP committed 2% of total commitments in cash, pari passu" } },
      fund: { label: "Cordova JV Real Estate Fund III, L.P.", sublabel: "Delaware LP · value-add multifamily", kind: "fund", ref: { source: "LPA", quote: "Cordova JV Real Estate Fund III, L.P. (Delaware LP)" } },
      feeders: [
        { label: "Cordova JV III (Cayman), Ltd.", sublabel: "Cayman feeder · non-US / US tax-exempt", kind: "feeder", ref: { source: "LPA", quote: "Cayman feeder for non-US and US tax-exempt investors" } },
      ],
      vehicles: [
        { label: "Property SPVs", sublabel: "One LLC per asset · non-recourse debt 60–70% LTV", kind: "vehicle", ref: { source: "DDQ", quote: "property-level bank accounts, one per asset SPV" } },
        { label: "JV I–II", sublabel: "$185M (realized) · $410M (~70% realized)", kind: "vehicle", ref: { source: "DDQ", quote: "Cordova JV I (2016, $185M) and Cordova JV II (2019, $410M)" } },
      ],
      providers: [
        { label: "SS&C ALPS Alternative Fund Services", sublabel: "Administrator", kind: "provider", status: "Since 2018", flag: "green", ref: { source: "Admin Agreement", quote: "SS&C ALPS Alternative Fund Services, administrator since 2018" } },
        { label: "KPMG LLP", sublabel: "Auditor", kind: "provider", status: "Since 2018", flag: "green", ref: { source: "Audit Letter", quote: "KPMG LLP audits the fund since 2018" } },
        { label: "Wells Fargo, N.A.", sublabel: "Primary bank", kind: "provider", status: "Fund level", flag: "green", ref: { source: "DDQ", quote: "Wells Fargo, N.A. serves as primary banking relationship" } },
        { label: "Goodwin Procter LLP", sublabel: "Fund counsel", kind: "provider", status: "Engaged", flag: "green", ref: { source: "DDQ", quote: "Goodwin Procter LLP serves as primary fund counsel" } },
        { label: "Cushman & Wakefield", sublabel: "Independent appraiser", kind: "provider", status: "Annual cadence", flag: "yellow", ref: { source: "DDQ", quote: "Cushman & Wakefield provides independent annual appraisals" } },
      ],
      note: "Delaware LP with parallel Cayman feeder. JV equity invested through per-asset SPVs run with regional operating partners. GP commits 2% in cash, pari passu, no fee offset.",
    },
    org: {
      caption: "Management organization · 18 FTEs",
      leadership: [
        { name: "Carlos Mendoza", title: "Managing Principal & CIO", flag: "red", note: "60% owner; concentration risk, no formal succession plan", ref: { source: "Form ADV", quote: "Carlos Mendoza, Managing Principal and CIO, 60% ownership" } },
        { name: "Stephanie Vance", title: "Co-Founder, Head of Asset Management", note: "25% owner", ref: { source: "Form ADV", quote: "Stephanie Vance, Head of Asset Management, 25% ownership" } },
        { name: "Daniel Park", title: "CFO & CCO", flag: "red", note: "combined CFO/CCO — segregation of duties concern", ref: { source: "DDQ", quote: "Daniel Park (CFO) serves as Chief Compliance Officer" } },
      ],
      groups: [
        {
          label: "Acquisitions",
          people: [
            { name: "Acquisitions team", title: "7 professionals", ref: { source: "DDQ", quote: "18 full-time professionals: 7 acquisitions" } },
          ],
        },
        {
          label: "Asset Management",
          people: [
            { name: "Stephanie Vance", title: "Head of Asset Management", ref: { source: "DDQ", quote: "5 asset management professionals tracking 14 KPIs per property" } },
          ],
        },
        {
          label: "Finance & Operations",
          people: [
            { name: "Daniel Park", title: "CFO", note: "joined 2017; former JLL Capital Markets", ref: { source: "Form ADV", quote: "Daniel Park, CFO, joined 2017, former JLL Capital Markets" } },
            { name: "Finance/Ops team", title: "3 professionals", ref: { source: "DDQ", quote: "3 finance/operations professionals" } },
          ],
        },
        {
          label: "Investor Relations",
          people: [
            { name: "IR team", title: "2 professionals", ref: { source: "DDQ", quote: "2 investor relations professionals" } },
          ],
        },
      ],
      advisors: [
        { name: "Apex Compliance Advisors LLC", title: "Outside Compliance Consultant", note: "engaged Q1 2022; annual review", ref: { source: "DDQ", quote: "Apex Compliance Advisors LLC, outside compliance consultant since Q1 2022" } },
        { name: "Vantage Tech LLC", title: "Outsourced IT & Cybersecurity", note: "since March 2023; no DLP tier", ref: { source: "DDQ", quote: "Vantage Tech LLC, outsourced IT and cybersecurity since March 2023" } },
      ],
      note: "Ownership Mendoza 60% / Vance 25% / Park 15%. Carry restricted to the three principals. Key person insurance ($10M) on Carlos Mendoza only.",
    },
  },
  "blackpine": {
    entityTopic: 4,
    orgTopic: 1,
    entity: {
      caption: "Fund IV legal structure · Delaware LP with Cayman master-feeder",
      investors: { label: "Limited Partners", sublabel: "$400M target · $260M raised through 12/2025", kind: "investors", ref: { source: "DDQ", quote: "$400M target; $260M raised through December 2025" } },
      manager: { label: "Blackpine Asset Management, LLC", sublabel: "Investment manager · New York (London research outpost)", kind: "manager", ref: { source: "Form ADV", quote: "Blackpine Asset Management, LLC, manager, New York" } },
      gp: { label: "Blackpine GP IV", sublabel: "General Partner · 2% cash commitment (~$8M)", kind: "gp", ref: { source: "LPA", quote: "GP committed 2% of commitments in cash, pari passu" } },
      fund: { label: "Blackpine Credit Plus IV, L.P.", sublabel: "Delaware LP · opportunistic / stressed credit", kind: "fund", ref: { source: "LPA", quote: "Blackpine Credit Plus IV, L.P., Delaware limited partnership" } },
      master: { label: "Blackpine Credit Plus IV (Cayman), Ltd.", sublabel: "Cayman master-feeder vehicle", kind: "master", ref: { source: "LPA", quote: "Cayman master-feeder structure for non-US investors" } },
      feeders: [
        { label: "US taxable feeder (Delaware LP)", sublabel: "Onshore investors", kind: "feeder", ref: { source: "PPM", quote: "Delaware limited partnership for onshore investors" } },
        { label: "Cayman feeder", sublabel: "Non-US and US tax-exempt investors", kind: "feeder", ref: { source: "LPA", quote: "Cayman feeder for non-US and US tax-exempt investors" } },
      ],
      vehicles: [
        { label: "Separate accounts", sublabel: "$175M combined · two institutional clients", kind: "vehicle", ref: { source: "Form ADV", quote: "two separate accounts, $175 million combined" } },
        { label: "Funds I–III", sublabel: "$90M · $185M · $310M (prior vintages)", kind: "vehicle", ref: { source: "DDQ", quote: "four funds in the Blackpine Credit Plus series" } },
      ],
      providers: [
        { label: "SS&C Technologies", sublabel: "Administrator", kind: "provider", status: "Since inception 2018", flag: "green", ref: { source: "Admin Agreement", quote: "SS&C administrator across all four funds since inception" } },
        { label: "Ernst & Young LLP", sublabel: "Auditor", kind: "provider", status: "Since inception", flag: "green", ref: { source: "Audit Letter", quote: "Ernst & Young auditor since inception, no restatements" } },
        { label: "Citi Prime Finance", sublabel: "Prime broker · $150M committed repo", kind: "provider", status: "Primary financing", flag: "yellow", ref: { source: "DDQ", quote: "Citi Prime Finance, $150 million committed financing line" } },
        { label: "JPMorgan Chase", sublabel: "Secondary prime / custodian", kind: "provider", status: "Diversification", flag: "green", ref: { source: "DDQ", quote: "JPMorgan Chase secondary prime and custodian" } },
        { label: "Houlihan Lokey Valuation Advisors", sublabel: "Independent valuation agent (Level 3)", kind: "provider", status: "Agent of record", flag: "green", ref: { source: "Valuation Policy", quote: "Houlihan Lokey independently marks Level 3 positions quarterly" } },
        { label: "Schulte Roth & Zabel LLP", sublabel: "Fund counsel", kind: "provider", status: "Engaged", flag: "green", ref: { source: "DDQ", quote: "Schulte Roth & Zabel primary fund counsel" } },
      ],
      note: "Delaware LP with Cayman master-feeder. GP commits 2% in cash, pari passu, no fee offset.",
    },
    org: {
      caption: "Management organization · 18 FTEs",
      leadership: [
        { name: "Martin Lin", title: "Founder, CIO & sole Portfolio Manager", flag: "red", note: "72% owner; key-person concentration", ref: { source: "Form ADV", quote: "Martin Lin, Founder, CIO, sole portfolio manager, 72% owner" } },
      ],
      groups: [
        {
          label: "Investment & Research",
          people: [
            { name: "Alexandra Reyes", title: "Head of Research", note: "15% owner; joined 2018", ref: { source: "Form ADV", quote: "Alexandra Reyes, Head of Research, 15% owner, joined 2018" } },
            { name: "Investment team", title: "8 research analysts & traders", note: "avg 11 yrs credit experience", ref: { source: "DDQ", quote: "8 investment professionals, research analysts and traders" } },
          ],
        },
        {
          label: "Operations & Compliance",
          people: [
            { name: "Daniel Foster", title: "COO & Chief Compliance Officer", flag: "yellow", note: "dual-hatted; 8% owner", ref: { source: "DDQ", quote: "Daniel Foster serves as COO and Chief Compliance Officer" } },
          ],
        },
        {
          label: "Capital Formation & IR",
          people: [
            { name: "Sarah Klein", title: "Head of Capital Formation", note: "joined 2020; carry-eligible", ref: { source: "DDQ", quote: "Sarah Klein heads Capital Formation, former Sixth Street IR" } },
          ],
        },
      ],
      advisors: [
        { name: "Apex Compliance Advisors LLC", title: "Outside compliance consultant", note: "since 2017; annual review", ref: { source: "DDQ", quote: "Apex Compliance Advisors outside consultant since inception" } },
      ],
      note: "Concentrated ownership (Lin 72%, Reyes 15%, Foster 8%, 5% reserved). Sole-PM structure; no formal written succession plan; $15M key-person insurance on Lin only.",
    },
  },
  "havencrest": {
    entityTopic: 4,
    orgTopic: 1,
    entity: {
      caption: "Trust V legal structure",
      investors: { label: "Limited Partners", sublabel: "$1.2B target · $1.5B hard cap · $980M raised (12/2025)", kind: "investors", ref: { source: "DDQ", quote: "1.2 billion target, 1.5 billion hard cap, 980 million raised" } },
      manager: { label: "Havencrest Real Estate Advisors, LLC", sublabel: "Investment manager · Chicago · SEC RIA since 2014", kind: "manager", ref: { source: "Form ADV", quote: "Havencrest Real Estate Advisors, LLC, registered investment adviser since 2014" } },
      gp: { label: "General Partner (3% GP cash commit)", sublabel: "~$45M at hard cap · pari passu, no fee offset", kind: "gp", ref: { source: "LPA", quote: "General Partner committed 3 percent in cash, pari passu" } },
      fund: { label: "Havencrest Industrial Trust V, L.P.", sublabel: "Delaware LP · investing via Delaware REIT", kind: "fund", ref: { source: "LPA", quote: "Delaware limited partnership investing through a Delaware REIT vehicle" } },
      master: { label: "Delaware REIT vehicle", sublabel: "IRC §§ 856–860 · REIT election", kind: "master", ref: { source: "PPM", quote: "fund vehicles structured as REITs under IRC 856 to 860" } },
      feeders: [
        { label: "Havencrest Industrial Trust V, L.P.", sublabel: "Onshore Delaware LP feeder", kind: "feeder", ref: { source: "LPA", quote: "Havencrest Industrial Trust V, L.P., Delaware limited partnership" } },
        { label: "Havencrest Industrial Trust V (Cayman), Ltd.", sublabel: "Cayman feeder · non-US / US tax-exempt", kind: "feeder", ref: { source: "LPA", quote: "Cayman feeder accommodates non-US and US tax-exempt investors" } },
      ],
      vehicles: [
        { label: "Trust I–IV (prior vintages)", sublabel: "$385M · $625M · $980M · $1.45B", kind: "vehicle", ref: { source: "DDQ", quote: "five funds, Trust I through Trust V" } },
      ],
      providers: [
        { label: "SS&C Technologies", sublabel: "Administrator · since 2010", kind: "provider", status: "Engaged 15 yrs", flag: "green", ref: { source: "Admin Agreement", quote: "SS&C Technologies serves as fund administrator since 2010" } },
        { label: "PricewaterhouseCoopers LLP", sublabel: "Auditor · since 2010", kind: "provider", status: "Engaged 15 yrs", flag: "green", ref: { source: "Audit Letter", quote: "PwC audits the fund since 2010, no restatements" } },
        { label: "Cushman & Wakefield", sublabel: "Primary appraiser · quarterly on 100%", kind: "provider", status: "Valuation agent of record", flag: "green", ref: { source: "Valuation Policy", quote: "Cushman & Wakefield primary valuation agent of record" } },
        { label: "JPMorgan Chase, N.A.", sublabel: "Primary bank · fund + property SPV", kind: "provider", status: "Engaged", flag: "green", ref: { source: "DDQ", quote: "JPMorgan Chase primary banking relationship at fund and property level" } },
        { label: "Goodwin Procter LLP", sublabel: "Fund counsel", kind: "provider", status: "Engaged", flag: "green", ref: { source: "DDQ", quote: "Goodwin Procter serves as primary fund counsel" } },
      ],
      note: "Delaware LP (onshore) plus Cayman feeder investing through a Delaware REIT (IRC §§ 856–860). GP commits 3% in cash, pari passu with no fee offset.",
    },
    org: {
      caption: "Management organization · 42 FTEs · founded 2008",
      leadership: [
        { name: "Patricia Vega", title: "Chief Executive Officer, Co-Founder", ref: { source: "DDQ", quote: "Patricia Vega, CEO, co-founder, former Senior VP Prologis" } },
        { name: "Mark Donovan", title: "Chief Investment Officer, Co-Founder", note: "designated successor CEO", ref: { source: "DDQ", quote: "Mark Donovan, CIO, co-founder, designated successor CEO" } },
      ],
      groups: [
        {
          label: "Acquisitions",
          people: [
            { name: "Lauren Foster", title: "Head of Acquisitions", note: "designated successor CIO · joined 2014", ref: { source: "DDQ", quote: "Lauren Foster, Head of Acquisitions, designated successor CIO" } },
          ],
        },
        {
          label: "Asset Management",
          people: [
            { name: "Robert Kim", title: "Head of Asset Management", note: "joined 2015", ref: { source: "DDQ", quote: "Robert Kim, Head of Asset Management, joined 2015" } },
          ],
        },
        {
          label: "Finance & Operations",
          people: [
            { name: "Sandra Chen", title: "Chief Financial Officer", note: "CPA · joined 2016", ref: { source: "DDQ", quote: "Sandra Chen, CFO, CPA, joined 2016" } },
            { name: "James Patel", title: "Director of Information Technology", note: "reports to CFO", ref: { source: "DDQ", quote: "Director of Information Technology James Patel reporting to the CFO" } },
          ],
        },
        {
          label: "Compliance",
          people: [
            { name: "Maria Santos", title: "Chief Compliance Officer", note: "no investment role · joined 2018", flag: "green", ref: { source: "DDQ", quote: "Maria Santos, CCO, dedicated, no investment responsibilities" } },
          ],
        },
      ],
      advisors: [
        { name: "Independent IC Member", title: "Independent Investment Committee Member", note: "former senior Prologis executive on retainer", flag: "green", ref: { source: "DDQ", quote: "former senior Prologis executive on retainer, independent IC member" } },
        { name: "Schulte Roth & Zabel LLP", title: "Outside Compliance Counsel", note: "annual mock SEC exam", ref: { source: "DDQ", quote: "Schulte Roth & Zabel as outside compliance counsel, annual mock exam" } },
      ],
      note: "Employees own 82% (23 senior professionals); Greenhill Pension Trust holds 18% passive. Four-person Executive Committee with formal succession plan; $20M key person insurance each; 5-year deferred carry vesting.",
    },
  },
  "ridgelineResort": {
    entityTopic: 4,
    orgTopic: 1,
    entity: {
      caption: "Fund III legal structure",
      investors: { label: "Limited Partners", sublabel: "$750M target · $850M hard cap · $470M raised (12/2025)", kind: "investors", ref: { source: "LPA", quote: "Fund III $750M target, $850M hard cap" } },
      manager: { label: "Ridgeline Resort Capital, LLC", sublabel: "Investment manager · Miami, FL", kind: "manager", ref: { source: "Form ADV", quote: "Ridgeline Resort Capital, LLC, manager, Miami" } },
      gp: { label: "Ridgeline Resort GP III, LLC", sublabel: "General Partner · 2% cash commitment", kind: "gp", ref: { source: "LPA", quote: "General Partner committed 2% in cash" } },
      fund: { label: "Ridgeline Resort Holdings III, L.P.", sublabel: "Delaware LP · opportunistic hospitality RE", kind: "fund", ref: { source: "LPA", quote: "Ridgeline Resort Holdings III, L.P., a Delaware limited partnership" } },
      feeders: [
        { label: "Ridgeline Resort Holdings III (Cayman), Ltd.", sublabel: "Cayman feeder · non-US / US tax-exempt", kind: "feeder", ref: { source: "LPA", quote: "Cayman feeder for non-US and US tax-exempt investors" } },
      ],
      vehicles: [
        { label: "Ridgeline Resort I (2016)", sublabel: "$185M · fully realized", kind: "vehicle", ref: { source: "DDQ", quote: "Ridgeline Resort I, 2016, $185M, fully realized" } },
        { label: "Ridgeline Resort II (2020)", sublabel: "$385M · ~58% realized", kind: "vehicle", ref: { source: "DDQ", quote: "Ridgeline Resort II, 2020, $385M, 58% realized" } },
      ],
      providers: [
        { label: "SS&C ALPS Alternative Fund Services", sublabel: "Administrator", kind: "provider", status: "Since 2018", flag: "green", ref: { source: "Admin Agreement", quote: "SS&C ALPS fund administrator since 2018" } },
        { label: "KPMG LLP", sublabel: "Auditor", kind: "provider", status: "Since 2018", flag: "green", ref: { source: "Audit Letter", quote: "KPMG LLP audits the fund since 2018" } },
        { label: "Wells Fargo, N.A.", sublabel: "Primary bank", kind: "provider", status: "Engaged", flag: "green", ref: { source: "DDQ", quote: "Wells Fargo, N.A. serves as primary banking relationship" } },
        { label: "Goodwin Procter LLP", sublabel: "Fund counsel", kind: "provider", status: "Engaged", flag: "green", ref: { source: "DDQ", quote: "Goodwin Procter LLP serves as primary fund counsel" } },
        { label: "Marriott · Hyatt · Hilton", sublabel: "Hotel operators (17 of 24 properties)", kind: "provider", status: "Management agreements", flag: "green", ref: { source: "DDQ", quote: "Marriott 8, Hyatt 5, Hilton 4 properties under management agreement" } },
        { label: "Two Roads · Auberge Resorts", sublabel: "Boutique luxury operators", kind: "provider", status: "Independent operators", flag: "green", ref: { source: "DDQ", quote: "Two Roads Hospitality and Auberge Resorts at boutique luxury positions" } },
      ],
      note: "Delaware LP with parallel Cayman feeder. GP commits 2% in cash (~$17M at hard cap), pari passu. Properties day-to-day managed by third-party hotel operators.",
    },
    org: {
      caption: "Management organization · 22 FTEs · founded 2015",
      leadership: [
        { name: "Jonathan Reid", title: "Managing Partner, CIO", flag: "yellow", note: "60% owner · ex-Starwood · sole final acquisition decision-maker", ref: { source: "Form ADV", quote: "Jonathan Reid, Managing Partner, CIO, 60% owner, former Starwood" } },
        { name: "Catherine Walsh", title: "Co-Founder, COO", note: "40% owner · ex-Starwood", ref: { source: "Form ADV", quote: "Catherine Walsh, Co-Founder, COO, 40% owner, former Starwood" } },
      ],
      groups: [
        {
          label: "Acquisitions",
          people: [
            { name: "Ryan Thompson", title: "Head of Acquisitions", note: "joined 2017 · ex-Brookfield Hotels", ref: { source: "DDQ", quote: "Ryan Thompson, Head of Acquisitions, joined 2017, former Brookfield Hotels" } },
          ],
        },
        {
          label: "Revenue Management",
          people: [
            { name: "Anita Krishnan", title: "Head of Revenue Management", flag: "green", note: "joined 2019 · ex-Marriott corporate RM · 3-person team", ref: { source: "DDQ", quote: "Anita Krishnan, Head of Revenue Management, former Marriott corporate RM" } },
          ],
        },
        {
          label: "Finance & Operations",
          people: [
            { name: "David Park", title: "Chief Financial Officer", note: "joined 2018 · CPA · ex-Hersha Hospitality", ref: { source: "DDQ", quote: "David Park, CFO, CPA, former Hersha Hospitality" } },
          ],
        },
        {
          label: "Compliance",
          people: [
            { name: "Susan Mitchell", title: "Chief Compliance Officer", flag: "yellow", note: "sole in-house compliance FTE · joined 2020", ref: { source: "DDQ", quote: "Susan Mitchell, Chief Compliance Officer, sole in-house compliance" } },
          ],
        },
        {
          label: "Asset Management",
          people: [
            { name: "Marcus Davenport", title: "Senior Asset Manager", flag: "yellow", note: "departed July 2025 to Hyatt Capital", ref: { source: "DDQ", quote: "Marcus Davenport, Senior Asset Manager, departed July 2025 to Hyatt Capital" } },
          ],
        },
      ],
      advisors: [
        { name: "Cipperman Compliance Services", title: "Outsourced Compliance Consultant", note: "since inception · annual review", ref: { source: "DDQ", quote: "Cipperman Compliance Services as outside compliance consultant since inception" } },
        { name: "Vantage Tech LLC", title: "Outsourced IT / Cybersecurity", note: "since 2022", ref: { source: "DDQ", quote: "Vantage Tech LLC outsourced IT and cybersecurity provider since 2022" } },
      ],
      note: "Two-founder ownership (Reid 60% / Walsh 40%); no third senior partner. No formal succession plan. Key person insurance on Reid only.",
    },
  },
};

export function getFundCharts(dataKey?: string): FundCharts | undefined {
  if (!dataKey) return undefined;
  return FUND_CHARTS[dataKey];
}
