/**
 * Ridgeline Capital Partners — static demo data for the Review page.
 *
 * All data is specific to the Ridgeline Capital Partners ODD review demo.
 * Import from here instead of embedding inline in ReviewPage.tsx.
 */

// ── Shared interfaces ──────────────────────────────────────────────────────

export interface MemoSection {
  id: string;
  section_id: string;
  title: string;
  current_version: number;
  versions: Array<{
    id: string;
    version_num: number;
    content: string;
    change_summary: string;
    created_at: string;
  }>;
}

export interface VerificationPoint {
  id: string;
  point_id: string;
  category: string;
  title: string;
  description: string;
  status: string;
  override_status: string | null;
  override_note: string | null;
}

export interface MonitoringTask {
  id: string;
  task_id: string;
  category: string;
  title: string;
  description: string;
  frequency: string;
  status: string;
  override_status: string | null;
  override_note: string | null;
  due_date: string | null;
}

// ── Topic data types ────────────────────────────────────────────────────────

export type TopicDataPoint = { label: string; value: string; flag?: "green" | "yellow" | "red"; source?: string };
export type TopicDataGroup = { group: string; items: TopicDataPoint[] };
export type TopicInfo = {
  name: string;
  rating: string;
  summary: string;
  findings?: string;
  docCategories: string[];
  riskObsIds: string[];
  verificationCategory?: string;
  dataPoints: TopicDataGroup[];
};

// ── 12-Topic ODD assessment data (Ridgeline) ────────────────────────────────

export const TOPIC_DATA: Record<number, TopicInfo> = {
  1: {
    name: "Organization & Governance", rating: "YELLOW",
    summary: "Key person concentration risk. CIO David Chen (85% ownership) has sole investment discretion on positions >$50M. No succession plan or key person insurance. Advisory board lacks independent director.",
    findings: `### Entity & Structure

Ridgeline Capital Partners, LLC was formed as a Delaware limited liability company in 2017 by David Chen, CFA, as confirmed in the Form ADV. The firm's sole business is investment advisory services provided through the Ridgeline Global Opportunities Fund. The management company does not operate other fund products, separately managed accounts, or sub-advisory mandates, which simplifies the operational environment and eliminates cross-product allocation conflicts.

### Ownership & Capital

David Chen holds 85% economic ownership of the management company, with COO Sarah Martinez holding 10% and the remaining 5% distributed among senior staff. The firm is fully self-funded with no external capital or institutional backing of the management company itself. This ownership concentration creates meaningful key person risk, as departure or incapacitation of the founder would fundamentally affect firm continuity.

### Key Personnel

The firm employs 34 full-time professionals. The investment team consists of eight professionals (CIO, Head of Research, and six research analysts); the operations team of five (COO plus four operations staff); and the technology team of three (CTO plus two engineers). The compliance function is performed by the COO in a dual-hatted capacity, which Alpine flags as a material deficiency.

### Succession & Continuity

No formal written succession plan has been adopted. No key person insurance is in place. No deputy CIO has been designated. In the event of David Chen's unavailability, the DDQ indicates the COO would assume interim management responsibilities, but no documented procedure exists for investment decision-making continuity.

### Governance

The advisory board comprises three members, none of whom qualifies as independent under Alpine's assessment criteria. Board meetings occur quarterly. The lack of independent oversight is a contributing factor in the WATCHLIST rating for this topic.`,
    docCategories: ["Governance"], riskObsIds: ["RO-003"], verificationCategory: "governance",
    dataPoints: [
      { group: "Management Company & Affiliates", items: [
        { label: "Management Company", value: "Ridgeline Capital Partners, LLC", source: "Form ADV" },
        { label: "Jurisdiction", value: "Delaware LLC (formed March 2017)", source: "Form ADV" },
        { label: "Manager Affiliates", value: "None identified", source: "DDQ" },
        { label: "Offices", value: "1 — New York, NY (midtown, ~8,200 sq ft)", source: "DDQ" },
      ]},
      { group: "Personnel", items: [
        { label: "Total Employees", value: "34 full-time professionals", source: "DDQ" },
        { label: "Front Office", value: "8 (CIO, Head of Research, 6 Analysts)", source: "Org Chart" },
        { label: "Middle Office", value: "5 (COO + 4 operations staff)", source: "Org Chart" },
        { label: "Back Office / Admin", value: "3 (Tech) + 18 (Compliance, IR, BD, Admin)", source: "Org Chart" },
      ]},
      { group: "Key Persons", items: [
        { label: "Organization", value: "David Chen, CFA — Founder, CIO (85% ownership)", source: "Form ADV" },
        { label: "Strategy", value: "David Chen — sole discretion on positions >$50M", source: "DDQ" },
        { label: "Compliance", value: "Sarah Martinez, COO (acting CCO since inception)", flag: "red", source: "Form ADV" },
        { label: "Technology", value: "James Park, CTO (3 IT professionals)", source: "Org Chart" },
      ]},
      { group: "Governance & Ownership", items: [
        { label: "Board / Advisory", value: "3-member advisory board — no independent director", flag: "yellow", source: "DDQ" },
        { label: "Ownership", value: "David Chen 85%, Sarah Martinez 10%, Other 5%", source: "Form ADV" },
        { label: "External Capital", value: "None — fully self-funded management company", source: "DDQ" },
        { label: "Investor Concentration", value: "Top 5 clients = 28% of revenue. No single >8%.", source: "DDQ" },
      ]},
      { group: "Continuity & History", items: [
        { label: "Founded", value: "2017 — David Chen left Millennium Management", source: "Form ADV" },
        { label: "Succession Plan", value: "None documented", flag: "red", source: "DDQ" },
        { label: "Key Person Insurance", value: "None. No deputy CIO designated.", flag: "red", source: "DDQ" },
        { label: "Recent Turnover", value: "2 analysts departed 2024; replaced within 60 days", source: "DDQ" },
        { label: "Conflicts", value: "CIO personal account trades same universe; pre-clearance required", source: "Code of Ethics" },
      ]},
    ],
  },
  5: {
    name: "Fund Terms & Structure", rating: "GREEN",
    summary: "Standard institutional terms. 2/20 with 6% hurdle and HWM. Quarterly redemptions with 90-day notice. Delaware LP + Cayman feeder structure. MFN side letters available above $25M.",
    findings: `### Fund Structure

The fund operates a standard master-feeder structure with a Delaware LP (onshore) and Cayman Ltd (offshore) feeding into Ridgeline Master Fund, LP. No SPVs, co-investment vehicles, or related-party entities were identified, which simplifies the operational structure and reduces conflicts of interest.

### Fee Terms & Liquidity

Management fee of 2.0% and incentive fee of 20%, subject to a 6% preferred return hurdle rate and a standard high-water mark. Quarterly redemptions are available with 90-day written notice. These terms are within market norms for a long/short equity hedge fund of this size and strategy.

### Side Letters & MFN

Side letters are available for investors committing $25 million or more, with standard MFN (most favored nation) provisions. Alpine reviewed the side letter summary and identified no material preferential terms that would disadvantage smaller investors.`,
    docCategories: ["Legal"], riskObsIds: [],
    dataPoints: [
      { group: "Fund & Affiliates", items: [
        { label: "Onshore Fund", value: "Ridgeline Global Opportunities Fund, LP (Delaware)", source: "PPM" },
        { label: "Offshore Fund", value: "Ridgeline Global Opportunities Fund Ltd (Cayman)", source: "PPM" },
        { label: "Master Fund", value: "Ridgeline Master Fund, LP", source: "PPM" },
        { label: "Structure", value: "Master-feeder (onshore LP + offshore Ltd)", source: "PPM" },
        { label: "Fund SPVs", value: "None identified", source: "DDQ" },
        { label: "Co-Investment Vehicles", value: "None identified", source: "DDQ" },
        { label: "Related-Party Entities", value: "None identified", source: "DDQ" },
      ]},
      { group: "Fund Board of Directors (Offshore)", items: [
        { label: "Board Size", value: "2 directors (expected: 3 for fund of this AUM)", flag: "yellow", source: "PPM" },
        { label: "Director 1", value: "David Chen (CIO, Ridgeline) — Fund Principal, non-independent", source: "PPM" },
        { label: "Director 2", value: "Robert Sinclair — Independent. Former partner, Maples & Calder (20 yrs). Serves on 14 other fund boards.", flag: "yellow", source: "DDQ" },
        { label: "Independence", value: "1 of 2 independent (50%) — meets minimum but no majority", flag: "yellow", source: "DDQ" },
        { label: "Same Organization", value: "No majority from same firm — OK", source: "DDQ" },
        { label: "Meeting Frequency", value: "Quarterly — Cayman (2x in person), virtual (2x)", source: "DDQ" },
        { label: "Scope of Duties", value: "NAV approval, valuation oversight, conflicts review, service provider appointments, AML/KYC compliance oversight", source: "PPM" },
        { label: "Capacity Concern", value: "R. Sinclair serves on 14 boards — capacity risk for oversight quality", flag: "yellow", source: "DDQ" },
      ]},
      { group: "Fees", items: [
        { label: "Management Fee", value: "2% p.a. on NAV, quarterly in advance", source: "PPM" },
        { label: "Performance Fee", value: "20% above 6% hurdle, subject to HWM", source: "PPM" },
        { label: "High Water Mark", value: "Yes — loss carryforward, no reset", source: "LPA" },
        { label: "Clawback", value: "Yes — annual crystallization", source: "LPA" },
      ]},
      { group: "Fund Expenses & Pass-Throughs", items: [
        { label: "Total Expense Ratio", value: "2.8% (mgmt fee 2.0% + operating 0.8%)", source: "AFS" },
        { label: "Operating Expenses", value: "~0.8% of NAV — admin, audit, legal, custody, insurance", source: "AFS" },
        { label: "Organizational Costs", value: "Fully amortized (fund launched 2017)", source: "AFS" },
        { label: "Consulting Fees", value: "PPM permits pass-through. Manager confirms: not charged in practice.", flag: "green", source: "PPM" },
        { label: "Marketing / Cap Intro", value: "PPM permits pass-through. Manager confirms: not charged in practice.", flag: "green", source: "PPM" },
        { label: "Travel & Entertainment", value: "PPM permits pass-through for deal-related travel. Manager confirms: charged only for due diligence site visits (~$45K in FY2024).", flag: "yellow", source: "Manager Response" },
        { label: "Non-Deal Travel", value: "Not charged — borne by management company", flag: "green", source: "Manager Response" },
        { label: "Technology / Systems", value: "Bloomberg terminal, OMS/EMS, risk systems — PPM permits. Manager confirms: not charged in practice.", flag: "green", source: "PPM" },
        { label: "Accounting Software", value: "Citco admin fees are fund expenses ($180K/yr). Internal accounting software borne by management company.", flag: "green", source: "Manager Response" },
        { label: "Research Costs", value: "Soft dollar / CSA arrangement with Goldman. ~$400K in FY2024. Disclosed to investors.", flag: "yellow", source: "AFS" },
        { label: "Legal (Non-Fund)", value: "Manager-level legal costs borne by management company. Fund-level legal (regulatory, structuring) charged to fund.", flag: "green", source: "PPM" },
        { label: "Broken Deal Costs", value: "PPM permits. Manager confirms: N/A — fund does not pursue private transactions", source: "Manager Response" },
      ]},
      { group: "Liquidity Terms", items: [
        { label: "Subscription", value: "Monthly, 10 biz days notice, $1M min", source: "PPM" },
        { label: "Redemption", value: "Quarterly, 90-day notice", source: "PPM" },
        { label: "Lock-Up", value: "1-year soft lock (2% early fee)", source: "LPA" },
        { label: "Gate", value: "25% of NAV per quarter (fund level)", source: "LPA" },
        { label: "Side Pocket", value: "Up to 15% of NAV for illiquid positions", source: "LPA" },
        { label: "Sunset Provision", value: "Side pockets liquidated within 36 months or investor vote", source: "LPA" },
      ]},
      { group: "Side Letters", items: [
        { label: "Active Side Letters", value: "12 side letters across 9 investors", source: "DDQ" },
        { label: "MFN Threshold", value: "$25M+ commitment — 8 investors qualify", source: "Side Letter Summary" },
        { label: "MFN Rights", value: "Most favored nation clause. Investors ≥$25M receive best terms granted to any LP of equal or smaller size.", source: "LPA" },
        { label: "Fee Discounts", value: "3 LPs at 1.5/15 (top tier). 5 LPs at 1.75/17.5 (mid tier). Remaining at standard 2/20.", source: "Side Letter Summary" },
        { label: "Preferential Liquidity", value: "2 LPs have monthly redemption (vs. quarterly standard). 1 LP has 45-day notice (vs. 90-day standard).", flag: "yellow", source: "Side Letter Summary" },
        { label: "Lock-Up Waiver", value: "1 LP has no lock-up (founding investor). All others subject to 1-year soft lock.", source: "Side Letter Summary" },
        { label: "Preferential Reporting", value: "4 LPs receive weekly estimated NAV. 2 LPs receive position-level transparency (top 20 holdings).", flag: "yellow", source: "Side Letter Summary" },
        { label: "Key Person Trigger", value: "3 side letters include key person clause — David Chen departure triggers 60-day redemption right.", source: "Side Letter Summary" },
        { label: "Capacity Rights", value: "2 LPs have co-investment rights at no fee/carry on deals >$20M.", source: "Side Letter Summary" },
        { label: "Disclosure to Other LPs", value: "MFN disclosure made annually. Last disclosure: January 2026.", source: "Manager Response" },
      ]},
    ],
  },
  2: {
    name: "Regulatory & Compliance", rating: "RED",
    // Bug fix: findings correctly state COO (not CIO) is dual-hatted
    summary: "Material compliance gaps. No dedicated CCO — COO dual-hatting since inception. No pre-trade compliance system. No expert network oversight policy. Highest-risk topic.",
    findings: `### Registration & Regulatory Standing

Ridgeline Capital Partners is registered as an investment adviser with the SEC under CRD #298741 since April 2018. The offshore fund is registered as a Regulated Mutual Fund under the Cayman Islands Monetary Authority (CIMA). The firm claims exempt status from NFA/CFTC registration as a commodity pool operator and commodity trading adviser. Alpine verified SEC registration status through IAPD — current, no pending actions.

### Compliance Program & Chief Compliance Officer

The firm does not employ a dedicated Chief Compliance Officer. COO Sarah Martinez has served as acting CCO since the firm's inception in 2017, a dual-hatted arrangement that Alpine considers a material deficiency for a firm managing over $2.3 billion in assets. The compliance manual was last updated in January 2025 and covers standard areas (insider trading, code of ethics, gift policy, political contributions), but the absence of a dedicated compliance function raises concerns about independent oversight.

### Personal Trading & Pre-Clearance

The Code of Ethics requires pre-clearance for personal securities transactions by access persons. However, Alpine identified that no automated pre-clearance system is in place — the process is manual, paper-based, and reviewed by the acting CCO (who is also the COO). This creates both a control gap and a conflict of interest in oversight. The CIO trades the same universe as the fund in his personal account, making robust pre-clearance controls critical.

### Expert Network Usage

The firm utilizes expert network consultants for research purposes but has no formal expert network oversight policy, no chaperoning requirement for expert calls, and no compliance review of expert interactions. Given recent SEC enforcement actions in this area, this represents a material compliance gap.`,
    docCategories: ["Regulatory", "Compliance"], riskObsIds: ["RO-001", "RO-002"], verificationCategory: "regulatory",
    dataPoints: [
      { group: "Registrations", items: [
        { label: "SEC (US)", value: "RIA — CRD #298741 (since April 2018)", source: "Form ADV" },
        { label: "CIMA (Cayman)", value: "Regulated Mutual Fund under CIMA", source: "DDQ" },
        { label: "NFA / CFTC", value: "Exempt CPO / CTA — no NFA membership", source: "Form ADV" },
      ]},
      { group: "Regulatory History", items: [
        { label: "Disciplinary", value: "None — zero disclosures on IAPD", source: "SEC EDGAR" },
        { label: "Actions / Sanctions", value: "None", source: "SEC EDGAR" },
        { label: "Customer Complaints", value: "None", source: "Form ADV" },
      ]},
      { group: "SEC Examination", items: [
        { label: "Last Exam", value: "Oct 2–27, 2023", flag: "green", source: "Manager Response" },
        { label: "Findings", value: "Clean — no deficiencies, no recommendations", source: "Manager Response" },
      ]},
      { group: "Compliance Function", items: [
        { label: "Dedicated CCO", value: "No — Sarah Martinez (COO) as interim CCO", flag: "red", source: "Form ADV" },
        { label: "Deputy CCO", value: "None designated", flag: "red", source: "DDQ" },
        { label: "CCO Bio", value: "15 yrs ops (Goldman, Citadel). No compliance certification.", source: "Form ADV" },
        // Bug fix: pre-trade compliance is absent — changed from contradictory "Pre-clearance + auto-feed" to accurate state
        { label: "Pre-Trade Compliance", value: "None — post-trade monitoring only (ComplySci pending deployment)", flag: "red", source: "Compliance Manual" },
      ]},
      { group: "Compliance Committee", items: [
        { label: "Chair", value: "Sarah Martinez (COO / interim CCO)", source: "DDQ" },
        { label: "Members", value: "David Chen (CIO), James Park (CTO)", source: "DDQ" },
        { label: "External Advisor", value: "ACA Group (quarterly review engagement, Q1 2026)", source: "Manager Response" },
        { label: "Frequency", value: "Monthly — first Tuesday. Board observer since Q4 2025.", source: "DDQ" },
        { label: "Independence", value: "No independent member — CIO on committee", flag: "red", source: "DDQ" },
      ]},
      { group: "Policies & Controls", items: [
        { label: "Expert Networks", value: "Guidepoint; no chaperone, no call recording", flag: "yellow", source: "DDQ" },
        // Bug fix: personal trading pre-clearance is manual at time of review, not automated
        { label: "Personal Trading", value: "Manual pre-clearance only — no automated system in place at review date", flag: "yellow", source: "Compliance Manual" },
        { label: "Compliance Manual", value: "Annual employee certification (last: Jan 2026)", source: "Compliance Manual" },
      ]},
    ],
  },
  6: {
    name: "Service Providers", rating: "GREEN",
    summary: "Institutional-grade service providers. Administrator: Citco Fund Services. Auditor: Ernst & Young LLP. Prime Brokers: Goldman Sachs / Morgan Stanley. Legal: Schulte Roth & Zabel.",
    findings: `### Prime Brokerage & Custody

Goldman Sachs and Morgan Stanley serve as dual prime brokers, providing custody, margin financing, and securities lending. Assets are held in segregated accounts at both primes, with daily reconciliation performed by the operations team.

### Audit & Tax

Ernst & Young LLP has served as the fund's independent auditor since inception. Clean, unqualified audit opinions confirmed for FY2023 and FY2024. Tax services provided by KPMG LLP.

### Fund Administration

Citco Fund Services (Cayman) provides NAV calculation, investor reporting, and transfer agency services. NAV is calculated monthly with a 15-business-day turnaround, independently of the manager for pricing.

### Legal Counsel

Schulte Roth & Zabel LLP (US) and Maples & Calder (Cayman). Both are recognized fund formation firms with deep hedge fund experience.`,
    docCategories: ["Operations"], riskObsIds: ["RO-008"], verificationCategory: "administrator",
    dataPoints: [
      { group: "Core Service Providers", items: [
        { label: "Administrator", value: "Citco Fund Services (Cayman) Ltd", source: "DDQ" },
        { label: "Auditor", value: "Ernst & Young LLP (New York)", source: "DDQ" },
        { label: "Prime Broker (Primary)", value: "Goldman Sachs & Co. LLC", source: "DDQ" },
        { label: "Prime Broker (Secondary)", value: "Morgan Stanley & Co. LLC", source: "DDQ" },
        { label: "ISDA Counterparties", value: "Goldman, Morgan Stanley, JPMorgan", source: "DDQ" },
      ]},
      { group: "ISDA & Counterparty Risk", items: [
        { label: "ISDA Counterparties", value: "Goldman Sachs, Morgan Stanley, JPMorgan Chase", source: "DDQ" },
        { label: "ISDA Type", value: "2002 ISDA Master Agreement with Credit Support Annex (CSA)", source: "Manager Response" },
        { label: "Threshold (GS)", value: "$25M unsecured; above threshold daily margining required", source: "Manager Response" },
        { label: "Threshold (MS)", value: "$20M unsecured; above threshold daily margining", source: "Manager Response" },
        { label: "Threshold (JPM)", value: "$15M unsecured; above threshold daily margining", source: "Manager Response" },
        { label: "Eligible Collateral", value: "Cash (USD, EUR) and US Treasuries only", source: "Manager Response" },
        { label: "Early Termination", value: "Full two-way payment. NAV decline >25% triggers ATE.", flag: "yellow", source: "Manager Response" },
        { label: "Cross-Default", value: "Yes — default on any ISDA triggers cross-default on all", source: "Manager Response" },
        { label: "Benchmark vs Peers", value: "Thresholds in line with mid-size HF peers ($15-30M range)", source: "Alpine Analysis" },
      ]},
      { group: "Legal", items: [
        { label: "Onshore Counsel", value: "Schulte Roth & Zabel LLP (New York)", source: "DDQ" },
        { label: "Offshore Counsel", value: "Walkers (Cayman Islands)", source: "DDQ" },
      ]},
      { group: "Consultants & Outsourced", items: [
        { label: "IT / Cyber Consultant", value: "Kroll Cyber (annual pen test)", source: "DDQ" },
        { label: "Compliance Consultant", value: "None — internal only", flag: "yellow", source: "DDQ" },
        { label: "HR / Background Check", value: "Sterling (pre-employment)", source: "DDQ" },
        { label: "Middle/Back Office", value: "None — fully in-house (5 ops staff)", source: "DDQ" },
        { label: "Backup Administrator", value: "SS&C GlobeOp — expired Q2 2025", flag: "yellow", source: "DDQ" },
        { label: "Insurance Broker", value: "Marsh McLennan (E&O, D&O, Cyber)", source: "Insurance Summary" },
        { label: "Credit Facility", value: "None currently in place", source: "DDQ" },
      ]},
    ],
  },
  7: {
    name: "Investment Process", rating: "YELLOW",
    summary: "Strong performance but governance gaps. No formal Investment Committee charter. No non-investment representation on IC. CIO has final discretion on all positions >$50M.",
    docCategories: [], riskObsIds: [],
    dataPoints: [
      { group: "Strategy & Restrictions", items: [
        { label: "Strategy", value: "Global L/S equity — fundamental, bottom-up", source: "PPM" },
        { label: "Restrictions", value: "Max 10% position; 25% sector; 30% non-USD", source: "PPM" },
        { label: "Gross Exposure", value: "150–200% (target 175%)", source: "DDQ" },
        { label: "Net Exposure", value: "40–80% (target 60%)", source: "DDQ" },
      ]},
      { group: "Investment Committee", items: [
        { label: "Chair", value: "David Chen (CIO, Founder)", source: "DDQ" },
        { label: "Members", value: "Michael Torres (Head of Research), Kevin Zhao (Sr Analyst — Asia), Rachel Kim (Sr Analyst — Tech)", flag: "yellow", source: "DDQ" },
        { label: "Non-Investment Rep", value: "None — no ops or compliance representation", flag: "yellow", source: "DDQ" },
        { label: "Meeting Frequency", value: "Weekly (Mon). No formal minutes.", flag: "yellow", source: "Manager Response" },
        { label: "Minutes Available", value: "No — internal Slack summaries only", flag: "yellow", source: "Manager Response" },
        { label: "Charter", value: "No formal charter. Verbal terms of reference.", flag: "yellow", source: "Manager Response" },
        { label: "Final Authority", value: "CIO — sole discretion on positions >$50M", flag: "yellow", source: "DDQ" },
      ]},
      { group: "Risk Management", items: [
        { label: "Position Sizing", value: "1–5% at initiation; max 10% via appreciation", source: "DDQ" },
        { label: "Stop-Loss", value: "Soft -15% from cost; hard review at -20%", source: "DDQ" },
      ]},
    ],
  },
  8: {
    name: "Trading & Execution", rating: "GREEN",
    summary: "Robust trading infrastructure. Dual prime broker setup with Goldman Sachs and Morgan Stanley. Automated best-execution monitoring. Pro-rata allocation methodology.",
    docCategories: ["Compliance"], riskObsIds: [],
    dataPoints: [
      { group: "Systems", items: [
        { label: "OMS / EMS", value: "Bloomberg EMSX + Eze OMS", source: "DDQ" },
        { label: "Settlement", value: "DTCC CTM — automated matching", source: "DDQ" },
        { label: "Reconciliation", value: "Citco Reconciliation Hub — automated daily", source: "DDQ" },
        { label: "Allocation", value: "Eze OMS — pro-rata by AUM", source: "DDQ" },
      ]},
      { group: "Reconciliation Cycles", items: [
        { label: "Cash", value: "Daily (T+1) — admin vs. custodian", source: "DDQ" },
        { label: "Positions", value: "Daily (T+1) — admin vs. prime broker", source: "DDQ" },
        { label: "Trades", value: "T+3 — internal vs. broker confirms", flag: "yellow", source: "DDQ" },
      ]},
      { group: "Trade Oversight", items: [
        { label: "Allocation Oversight", value: "Sarah Martinez (COO) — reviews all allocations daily", source: "DDQ" },
        { label: "Best Execution Review", value: "Kevin Zhao (Sr Analyst) — quarterly TCA report to IC", source: "DDQ" },
        { label: "Segregation", value: "Front office cannot modify allocations post-execution", source: "DDQ" },
      ]},
      { group: "Policies", items: [
        { label: "Trade Allocation", value: "Pro-rata by AUM. Documented, attested annually.", source: "DDQ" },
        { label: "Best Execution", value: "Quarterly TCA. Multi-broker comparison. CSA.", source: "DDQ" },
        { label: "Accounting", value: "External — Citco provides full GL + investor accounting", source: "DDQ" },
      ]},
    ],
  },
  9: {
    name: "Valuation Controls", rating: "YELLOW",
    summary: "Valuation committee includes investment personnel — independence concern for Level 3 assets (8% of NAV). Third-party pricing from Bloomberg and ICE Data Services for Level 1/2.",
    docCategories: ["Compliance"], riskObsIds: ["RO-004"],
    dataPoints: [
      { group: "Valuation Committee", items: [
        { label: "Chair", value: "Lisa Wang (CFO)", source: "Valuation Policy" },
        { label: "Members", value: "David Chen (CIO), Sarah Martinez (COO), Mark Thompson (Head of Operations)", source: "Valuation Policy" },
        { label: "Independence", value: "CIO on committee — conflict for Level 3 assets", flag: "yellow", source: "Valuation Policy" },
        { label: "Majority Mid/Back?", value: "No — 2 investment (CIO, COO), 2 operations (CFO, HoO)", flag: "yellow", source: "Valuation Policy" },
        { label: "Frequency", value: "Monthly — last Thursday of each month", source: "Valuation Policy" },
        { label: "Minutes Available", value: "Yes — formal minutes maintained by CFO", source: "Manager Response" },
      ]},
      { group: "Asset Classification", items: [
        { label: "Level 1 (72% NAV)", value: "Exchange-traded equities — Bloomberg pricing", source: "AFS" },
        { label: "Level 2 (20% NAV)", value: "OTC derivatives, bonds — ICE Data Services", source: "AFS" },
        { label: "Level 3 (8% NAV)", value: "Illiquid/private — single appraiser", flag: "yellow", source: "AFS" },
        { label: "Pricing Sources", value: "Bloomberg (L1), ICE (L2), Duff & Phelps (L3)", source: "Valuation Policy" },
      ]},
      { group: "Controls", items: [
        { label: "Reconciliation", value: "Monthly — admin vs. internal. Tolerance: 50bps.", source: "Valuation Policy" },
        { label: "Override Policy", value: "Documented. Requires VC majority approval.", source: "Valuation Policy" },
      ]},
    ],
  },
  4: {
    name: "Technology & Cybersecurity", rating: "YELLOW",
    summary: "No formal incident response plan. No SOC 2 or ISO 27001 certification. Cybersecurity policy not updated since 2023. Cloud-based failover (AWS us-east-1).",
    docCategories: [], riskObsIds: ["RO-002"],
    dataPoints: [
      { group: "Team & Consultants", items: [
        { label: "IT Staff", value: "3 (CTO + 2 infrastructure engineers)", source: "Org Chart" },
        { label: "Cyber Staff", value: "0 dedicated — CTO oversees", flag: "yellow", source: "DDQ" },
        { label: "IT Consultant", value: "Kroll Cyber — annual pen testing", source: "DDQ" },
      ]},
      { group: "Business Continuity", items: [
        { label: "BCP / DR Plan", value: "Yes — Oct 2025. AWS us-east-1 failover.", source: "BCP/DR Plan" },
        { label: "BCP Test", value: "Nov 2025 — successful failover test", source: "BCP/DR Plan" },
      ]},
      { group: "Cybersecurity", items: [
        { label: "Framework", value: "None adopted (no NIST, SOC 2, ISO 27001)", flag: "yellow", source: "DDQ" },
        { label: "Pen Test Frequency", value: "Annual — last Sep 2025 by Kroll", source: "DDQ" },
        { label: "Phishing Test", value: "Quarterly — KnowBe4 platform", source: "DDQ" },
        { label: "Incident Response", value: "No formal plan documented", flag: "red", source: "DDQ" },
      ]},
      { group: "Endpoint & Access", items: [
        { label: "Endpoint DLP", value: "CrowdStrike Falcon with DLP module", source: "DDQ" },
        { label: "Dataroom Monitoring", value: "Not implemented", flag: "yellow", source: "DDQ" },
        { label: "USB Ports", value: "Disabled via group policy", source: "DDQ" },
        { label: "MFA / 2FA", value: "Enforced — Okta SSO + hardware keys", source: "DDQ" },
        { label: "Email Security", value: "MS Defender + Abnormal Security", source: "DDQ" },
      ]},
    ],
  },
  10: {
    name: "Financial Controls", rating: "YELLOW",
    summary: "Strong audit and NAV controls but bank signature card not provided — unable to verify authorized wire signatories. Operating expense wires bypass administrator entirely. Daily cash reconciliation and zero NAV errors offset partial weakness.",
    docCategories: ["Financial"], riskObsIds: ["RO-005", "RO-009"],
    dataPoints: [
      { group: "Audit & Reporting", items: [
        { label: "Framework", value: "US GAAP — audited financial statements", source: "AFS" },
        { label: "Last Audit", value: "Apr 30, 2025 (FY2024 — unqualified)", source: "AFS" },
        { label: "Auditor", value: "EY — 7 consecutive clean opinions", source: "AFS" },
        { label: "NAV Reporting", value: "Monthly — within 15 business days", source: "DDQ" },
        { label: "Audit Timeline", value: "Within 120 days of fiscal year-end", source: "DDQ" },
      ]},
      { group: "NAV & Cash Controls", items: [
        { label: "Cash Reconciliation", value: "Daily — Citco vs. Goldman Sachs", source: "DDQ" },
        { label: "NAV Errors (24 mo)", value: "Zero — no errors or restatements", source: "Manager Response" },
      ]},
      { group: "1. Investment Asset Transfers", items: [
        { label: "Initiation", value: "Trader submits wire request via Bloomberg terminal", source: "DDQ" },
        { label: "Review", value: "COO (Sarah Martinez) reviews — verifies counterparty, amount, settlement instructions", source: "DDQ" },
        { label: "Approval", value: "COO approves in banking portal. CFO (Lisa Wang) second approval for wires >$5M", source: "Manager Response" },
        { label: "Confirmation", value: "Administrator (Citco) independently confirms receipt/delivery with counterparty", source: "DDQ" },
        { label: "Min People", value: "3 (Trader → COO → Admin). 4 for wires >$5M (+ CFO)", source: "DDQ" },
        { label: "Standing Instructions", value: "Pre-approved for Goldman Sachs and Morgan Stanley PB accounts only", source: "Manager Response" },
      ]},
      { group: "2. Investor Capital Flows (Subs/Redemptions)", items: [
        { label: "Initiation", value: "Citco (Administrator) initiates based on subscription/redemption notices", source: "DDQ" },
        { label: "Review", value: "Citco performs AML/KYC check on incoming investors. COO verifies notice terms.", source: "DDQ" },
        { label: "Approval", value: "COO approves subscription acceptance. Citco executes wire.", source: "DDQ" },
        { label: "Redemption Processing", value: "Citco calculates NAV → COO reviews → Citco wires redemption proceeds", source: "DDQ" },
        { label: "Min People", value: "2 (Admin + COO). Admin controls the wire execution.", source: "DDQ" },
        { label: "Admin Control", value: "Full — Citco has sole access to sub/redemption bank accounts", source: "Manager Response" },
      ]},
      { group: "3. Operating Expense Flows", items: [
        { label: "Initiation", value: "COO (Sarah Martinez) initiates all operating expense payments", source: "DDQ" },
        { label: "Review", value: "CFO (Lisa Wang) reviews invoices and supporting documentation", source: "DDQ" },
        { label: "Approval", value: "CFO approves. COO executes wire. No administrator involvement.", flag: "yellow", source: "DDQ" },
        { label: "Min People", value: "2 (COO + CFO). But admin NOT involved — weaker control.", flag: "yellow", source: "DDQ" },
        { label: "Admin Involvement", value: "None — Citco does not review or approve OpEx wires", flag: "yellow", source: "Manager Response" },
        { label: "Threshold", value: "OpEx >$10K requires dual approval (COO + CFO). <$10K COO only.", source: "DDQ" },
        { label: "Concern", value: "OpEx wires bypass administrator entirely. No independent verification of payees.", flag: "yellow", source: "Alpine Analysis" },
      ]},
      { group: "Bank Signature Card", items: [
        { label: "Provided", value: "No — not provided during document collection", flag: "red", source: "Not Provided" },
        { label: "Authorized Signatories", value: "Unable to verify independently", flag: "red", source: "Not Provided" },
        { label: "Impact", value: "Cannot confirm who can initiate/approve fund-level wire transfers", flag: "yellow", source: "Not Provided" },
        { label: "Follow-Up Status", value: "Requested in Round 1. Manager cited bank confidentiality policy.", flag: "yellow", source: "Manager Response" },
      ]},
    ],
  },
  11: {
    name: "Asset Verification", rating: "GREEN",
    summary: "Comprehensive asset verification. Admin Transparency Report confirms AUM within 0.2% of manager-reported figures. 412 investor accounts verified. Segregated custody at Goldman Sachs and Morgan Stanley. All subscription/redemption flows independently processed by administrator.",
    docCategories: [], riskObsIds: [], verificationCategory: "administrator",
    dataPoints: [
      { group: "Admin Transparency Report Verification", items: [
        { label: "Report Provider", value: "Citco Fund Services — independent administrator", source: "Admin Transparency Report" },
        { label: "Report Date", value: "December 31, 2025 (most recent)", source: "Admin Transparency Report" },
        { label: "AUM Confirmation", value: "Manager-reported: $2.31B. Admin-confirmed: $2.306B. Variance: 0.17%", source: "Admin Transparency Report" },
        { label: "NAV Accuracy", value: "Monthly NAV calculated independently by Citco. Zero discrepancies in 24 months.", source: "Admin Transparency Report" },
        { label: "Investor Count", value: "412 accounts verified (318 onshore LP + 94 offshore Ltd)", source: "Admin Transparency Report" },
        { label: "Sub/Redemp Processing", value: "All 47 subscriptions and 12 redemptions in FY2025 processed per fund terms", source: "Admin Transparency Report" },
        { label: "Fee Verification", value: "Management fees and performance fees calculated independently by Citco", source: "Admin Transparency Report" },
        { label: "Cash Reconciliation", value: "Daily reconciliation — admin vs. custodian. No material breaks in FY2025.", source: "Admin Transparency Report" },
      ]},
      { group: "Custody & Segregation", items: [
        { label: "Custodian", value: "Goldman Sachs (US) / Morgan Stanley (international)", source: "DDQ" },
        { label: "Segregation", value: "Client assets held in segregated accounts at each PB", source: "DDQ" },
        { label: "PB Statements", value: "Monthly statements reconciled with admin — no breaks in FY2025", source: "Admin Transparency Report" },
      ]},
      { group: "Insurance Coverage", items: [
        { label: "E&O", value: "$10M / $20M aggregate — Chubb", source: "Insurance Summary" },
        { label: "D&O", value: "$5M / $10M aggregate — AIG", source: "Insurance Summary" },
        { label: "Cyber", value: "$5M per occurrence — Coalition", source: "Insurance Summary" },
        { label: "Fidelity Bond", value: "$2M — Travelers", source: "Insurance Summary" },
      ]},
    ],
  },
  3: {
    name: "Legal & Conflicts", rating: "GREEN",
    summary: "Adequate conflict management. Annual conflict attestation required. Code of ethics with personal trading pre-clearance. No related-party transactions above materiality threshold.",
    docCategories: ["Legal"], riskObsIds: ["RO-007"],
    dataPoints: [
      { group: "Litigation", items: [
        { label: "Active", value: "None", source: "DDQ" },
        { label: "Historical", value: "None in fund history", source: "DDQ" },
      ]},
      { group: "Conflicts & Related Parties", items: [
        { label: "Conflicts of Interest", value: "CIO trades same universe — pre-clearance + 30-day hold", source: "Code of Ethics" },
        { label: "Related-Party Txn", value: "Office lease from Chen Family Trust at market rate", flag: "yellow", source: "DDQ" },
        { label: "Soft Dollar / CSA", value: "CSA with Goldman. Bloomberg costs partially offset.", source: "DDQ" },
        { label: "Public Boards", value: "None — CIO has no public board seats", source: "Form ADV" },
      ]},
      { group: "Ethics & Controls", items: [
        { label: "Code of Ethics", value: "Annual attestation. Gifts ($100), outside activities.", source: "Code of Ethics" },
        { label: "Personal Trading", value: "Pre-clearance for all access persons. Auto-feed.", source: "Compliance Manual" },
        { label: "Side Letters", value: "12 active. MFN above $25M. Fee + liquidity terms.", source: "Side Letter Summary" },
      ]},
    ],
  },
  12: {
    name: "Reporting & Transparency", rating: "GREEN",
    summary: "GIPS-compliant performance presentation. Monthly investor statements within 15 business days. Annual report with detailed performance attribution. Comprehensive investor communication.",
    docCategories: ["Financial"], riskObsIds: ["RO-006"],
    dataPoints: [
      { group: "Investor Reporting", items: [
        { label: "Statements", value: "Monthly — within 15 business days", source: "DDQ" },
        { label: "Investor Letters", value: "Monthly — performance + market outlook", source: "DDQ" },
        { label: "Quarterly Report", value: "Attribution, exposure breakdown, risk metrics", source: "DDQ" },
        { label: "Annual Report", value: "Audited financials + attribution + commentary", source: "DDQ" },
      ]},
      { group: "Transparency & Gaps", items: [
        { label: "Admin Transparency", value: "Available on request — not proactive", flag: "yellow", source: "Manager Response" },
        { label: "Attribution in Letters", value: "No — returns only, no factor attribution", flag: "yellow", source: "DDQ" },
        { label: "GIPS Compliance", value: "Claimed — verified by ACA Compliance Group", source: "DDQ" },
        { label: "Docs Not Provided", value: "IC minutes (none exist); compliance test results (summary only)", flag: "yellow", source: "Manager Response" },
      ]},
    ],
  },
};

// ── Source metadata for RefDot citations ────────────────────────────────────

export const SOURCE_META: Record<string, { label: string; type: string; filename?: string; size?: string }> = {
  "ridgeline_ppm.pdf": { label: "Private Placement Memorandum", type: "Fund Document", filename: "ridgeline_ppm.pdf", size: "2.4 MB" },
  "ridgeline_ddq_2025.pdf": { label: "Due Diligence Questionnaire (2025)", type: "Fund Document", filename: "ridgeline_ddq_2026.pdf", size: "1.8 MB" },
  "ridgeline_ddq_2026.pdf": { label: "Due Diligence Questionnaire (2026)", type: "Fund Document", filename: "ridgeline_ddq_2026.pdf", size: "1.8 MB" },
  "ridgeline_form_adv_excerpt.pdf": { label: "Form ADV — Annual Filing", type: "Regulatory Filing", filename: "ridgeline_form_adv_2a.pdf", size: "890 KB" },
  "ridgeline_form_adv_2a.pdf": { label: "Form ADV Part 2A", type: "Regulatory Filing", filename: "ridgeline_form_adv_2a.pdf", size: "890 KB" },
  "ridgeline_lpa.pdf": { label: "Limited Partnership Agreement", type: "Fund Document", filename: "ridgeline_lpa.pdf", size: "3.1 MB" },
  "ridgeline_compliance_manual.pdf": { label: "Compliance Manual", type: "Compliance Document", filename: "ridgeline_compliance_manual.pdf", size: "780 KB" },
  "ridgeline_financials_fy2024.pdf": { label: "Audited Financial Statements FY2024", type: "Financial Document", filename: "ridgeline_financials_fy2024.pdf", size: "1.5 MB" },
  "SEC_EDGAR": { label: "SEC EDGAR — IAPD", type: "SEC Verification", filename: "iapd_record", size: undefined },
  "ALPINE_ANALYSIS": { label: "Alpine Cross-Reference Analysis", type: "Alpine Analysis", filename: "alpine_analysis_record", size: undefined },
  "MANAGER_CALL": { label: "Manager Due Diligence Call", type: "Manager Interview", filename: "manager_call_record", size: undefined },
  "ADMIN_VERIFICATION": { label: "Administrator Verification", type: "Third-Party Confirmation", filename: "admin_verification_record", size: undefined },
  "DDQ": { label: "Due Diligence Questionnaire (2025)", type: "Fund Document", filename: "ridgeline_ddq_2026.pdf", size: "1.8 MB" },
  "Form ADV": { label: "Form ADV Part 2A — Annual Filing", type: "Regulatory Filing", filename: "ridgeline_form_adv_2a.pdf", size: "890 KB" },
  "PPM": { label: "Private Placement Memorandum", type: "Fund Document", filename: "ridgeline_ppm.pdf", size: "2.4 MB" },
  "LPA": { label: "Limited Partnership Agreement", type: "Fund Document", filename: "ridgeline_lpa.pdf", size: "3.1 MB" },
  "Org Chart": { label: "Organization Chart (Nov 2025)", type: "Fund Document", filename: "ridgeline_org_chart.pdf", size: "420 KB" },
  "AFS": { label: "Audited Financial Statements FY2024", type: "Financial Document", filename: "ridgeline_financials_fy2024.pdf", size: "1.5 MB" },
  "Compliance Manual": { label: "Compliance Manual (2025)", type: "Compliance Document", filename: "ridgeline_compliance_manual.pdf", size: "780 KB" },
  "Code of Ethics": { label: "Code of Ethics & Personal Trading Policy", type: "Compliance Document", filename: "ridgeline_code_of_ethics.pdf", size: "340 KB" },
  "Valuation Policy": { label: "Valuation Policy (2026)", type: "Operations Document", filename: "ridgeline_valuation_policy.pdf", size: "290 KB" },
  "ridgeline_valuation_policy.pdf": { label: "Valuation Policy (2026)", type: "Operations Document", filename: "ridgeline_valuation_policy.pdf", size: "290 KB" },
  "IC Charter": { label: "Investment Committee Charter (Jan 2026)", type: "Governance Document", filename: "ridgeline_ic_charter.pdf", size: "180 KB" },
  "Insurance Summary": { label: "Insurance Coverage Summary", type: "Insurance Document", filename: "ridgeline_insurance.pdf", size: "520 KB" },
  "BCP/DR Plan": { label: "Business Continuity Plan / DR Plan", type: "Operations Document", filename: "ridgeline_bcp.pdf", size: "650 KB" },
  "Manager Response": { label: "Manager Direct Response", type: "Follow-Up Response", filename: "manager_call_record", size: undefined },
  "Alpine Analysis": { label: "Alpine Cross-Reference Analysis", type: "Alpine Analysis", filename: "alpine_analysis_record", size: undefined },
  "Admin Transparency Report": { label: "Citco Administrator Transparency Report", type: "Third-Party Verification", filename: "ridgeline_admin_engagement.pdf", size: "1.2 MB" },
  "SEC EDGAR": { label: "SEC EDGAR — IAPD", type: "SEC Verification", filename: "iapd_record", size: undefined },
  "Pen_Test_Summary_Jan2026.pdf": { label: "Penetration Test Summary — Jan 2026", type: "Cybersecurity Document", filename: "pentest_jan2026_record", size: undefined },
  "BCP_Test_Results_Dec2025.pdf": { label: "BCP Test Results — Dec 2025", type: "Operations Document", filename: "ridgeline_bcp.pdf", size: "650 KB" },
  "IC_Charter_Jan2026.pdf": { label: "Investment Committee Charter (Jan 2026)", type: "Governance Document", filename: "ridgeline_ic_charter.pdf", size: "180 KB" },
  "Audited_Financials_FY2024.pdf": { label: "Audited Financial Statements — FY2024", type: "Financial Document", filename: "ridgeline_financials_fy2024.pdf", size: "1.5 MB" },
  "Not Provided": { label: "Document Not Provided", type: "Information Gap", filename: undefined, size: undefined },
  "Side Letter Summary": { label: "Side Letter Summary (Redacted)", type: "Fund Document", filename: "ridgeline_side_letters.pdf", size: "210 KB" },
  "Follow-Up R1": { label: "Follow-Up Response — Round 1", type: "Follow-Up Response", filename: undefined, size: undefined },
  "Follow-Up R2": { label: "Follow-Up Response — Round 2", type: "Follow-Up Response", filename: undefined, size: undefined },
  "Q1 Follow-Up": { label: "Q1 2026 Follow-Up Response", type: "Follow-Up Response", filename: undefined, size: undefined },
  "Manager Upload": { label: "Manager Direct Upload", type: "Manager Submission", filename: undefined, size: undefined },
  // ── Trellis Capital IV documents ──────────────────────────────────────────
  "trellis_form_adv.pdf":                             { label: "Form ADV ERA — Annual Filing (2026)",           type: "Regulatory Filing",    filename: "trellis_form_adv.pdf",                             size: "1.1 MB" },
  "trellis_lpa.pdf":                                  { label: "Limited Partnership Agreement",                 type: "Fund Document",        filename: "trellis_lpa.pdf",                                  size: "2.8 MB" },
  "trellis_ppm.pdf":                                  { label: "Private Placement Memorandum",                  type: "Fund Document",        filename: "trellis_ppm.pdf",                                  size: "1.9 MB" },
  "Trellis-Capital-IV-ILPA-DDQ-2.0.pdf":             { label: "ILPA DDQ 2.0 — Trellis Capital IV",            type: "Fund Document",        filename: "Trellis-Capital-IV-ILPA-DDQ-2.0.pdf",             size: "1.4 MB" },
  "Trellis-Capital-Compliance-Binder-2025.pdf":       { label: "Compliance Binder (2025)",                      type: "Compliance Document",  filename: "Trellis-Capital-Compliance-Binder-2025.pdf",       size: "920 KB" },
  "Trellis-Capital-Valuation-Policy.pdf":             { label: "Valuation Policy",                              type: "Operations Document",  filename: "Trellis-Capital-Valuation-Policy.pdf",             size: "310 KB" },
  "Trellis-Capital-III-Audited-FS-FY2024.pdf":        { label: "Audited Financial Statements FY2024",           type: "Financial Document",   filename: "Trellis-Capital-III-Audited-FS-FY2024.pdf",        size: "1.8 MB" },
  "Trellis-Capital-Apex-Service-Description-Fund-III.pdf": { label: "Apex Service Description — Fund III",     type: "Third-Party Confirmation", filename: "Trellis-Capital-Apex-Service-Description-Fund-III.pdf", size: "680 KB" },
};

// ── Risk observations & strengths ────────────────────────────────────────────

export const RIDGELINE_MOCK = {
  fund: { name: "Ridgeline Capital Partners, LLC", strategy: "Global L/S Equity", aum: "$2.31B" },
  risk_observations: [
    // Bug fix: was "dual-hatted CIO/CCO" — the CCO role is held by the COO (Sarah Martinez), not the CIO
    { id: "RO-001", severity: "HIGH", topic: "Regulatory Compliance", title: "No dedicated CCO — dual-hatted COO/CCO", detail: "Single point of failure for compliance oversight. CCO function absorbed by COO (Sarah Martinez) alongside full operational responsibilities creates inherent conflict of interest.", remediation: "Require hiring of dedicated CCO within 90 days as condition of ACCEPT upgrade.", benchmark: { portfolio_pct: 78, portfolio_label: "of portfolio funds have dedicated CCO", industry_pct: 85, industry_label: "industry benchmark (funds >$1B AUM)", is_outlier: true } },
    { id: "RO-002", severity: "HIGH", topic: "Technology & Cybersecurity", title: "Cybersecurity policy not updated since 2023", detail: "Policy predates current threat landscape. No evidence of annual review or penetration testing.", remediation: "Commission independent cybersecurity audit; update policy to 2025 standards.", benchmark: { portfolio_pct: 61, portfolio_label: "of portfolio funds have current cyber policy (<12mo)", industry_pct: 72, industry_label: "industry benchmark", is_outlier: true } },
    { id: "RO-003", severity: "HIGH", topic: "Organization & Governance", title: "Key person risk — founder controls 78% of strategy decisions", detail: "Investment process heavily dependent on single individual with no documented succession plan.", remediation: "Require documented succession plan and deputy PM designation within 120 days.", benchmark: { portfolio_pct: 67, portfolio_label: "of portfolio funds have documented succession plan", industry_pct: 74, industry_label: "industry benchmark", is_outlier: true } },
    { id: "RO-004", severity: "MEDIUM", topic: "Valuation Controls", title: "Side pocket valuations rely on single external appraiser", detail: "Illiquid positions (12% of NAV) valued by one firm with no independent verification process.", remediation: "Implement dual-appraiser requirement for positions >5% of NAV.", benchmark: { portfolio_pct: 44, portfolio_label: "of portfolio funds use dual-appraiser for illiquid", industry_pct: 58, industry_label: "industry benchmark (funds with >5% Level 3)", is_outlier: false } },
    { id: "RO-005", severity: "MEDIUM", topic: "Financial Controls", title: "Trade reconciliation completed T+3 rather than industry standard T+1", detail: "Delayed reconciliation increases risk of undetected trade errors and NAV misstatements.", remediation: "Upgrade to T+1 reconciliation; confirm timeline with administrator.", benchmark: { portfolio_pct: 83, portfolio_label: "of portfolio funds reconcile at T+1 or better", industry_pct: 91, industry_label: "industry benchmark", is_outlier: true } },
    { id: "RO-006", severity: "MEDIUM", topic: "Reporting", title: "Investor letters lack attribution analysis", detail: "Monthly letters provide returns but no performance attribution, limiting investor transparency.", remediation: "Add factor attribution section to monthly investor reporting.", benchmark: { portfolio_pct: 56, portfolio_label: "of portfolio funds include attribution in letters", industry_pct: 48, industry_label: "industry benchmark", is_outlier: false } },
    { id: "RO-007", severity: "MEDIUM", topic: "Legal & Conflicts", title: "Related-party transaction policy has no materiality threshold", detail: "All related-party transactions require board approval regardless of size, creating governance bottleneck.", remediation: "Establish de minimis threshold and expedited review for transactions below materiality." },
    { id: "RO-008", severity: "LOW", topic: "Service Providers", title: "Backup administrator agreement expired", detail: "Contingency administrator agreement lapsed in Q2 2025. No material risk given Citco relationship.", remediation: "Renew backup administrator agreement; low urgency." },
    { id: "RO-009", severity: "HIGH", topic: "Asset Verification", title: "Bank signature card not provided — unable to verify authorized signatories", detail: "Fund manager declined to provide bank signature card citing bank confidentiality policy. Without this document, Alpine cannot independently verify who is authorized to initiate and approve wire transfers from fund accounts. This is a critical control for asset protection.", remediation: "Require bank signature card or equivalent bank authorization letter as condition of ACCEPT. If confidentiality concerns persist, accept a redacted version showing signatory names and authorization levels without account numbers.", benchmark: { portfolio_pct: 89, portfolio_label: "of portfolio funds provided bank signature card", industry_pct: 94, industry_label: "industry benchmark (P1 verification item)", is_outlier: true } },
  ],
  strengths: [
    { title: "Best-in-class administrator relationship", detail: "Citco Fund Services provides daily NAV, full GL, investor services. 8-year relationship with zero material errors." },
    { title: "Strong audit track record", detail: "Ernst & Young LLP — unqualified opinions for 7 consecutive years. No restatements, no material weaknesses." },
    { title: "Institutional-grade reporting infrastructure", detail: "Monthly investor letters within 15 business days. Quarterly attribution reports. Annual audited financials within 60 days." },
    { title: "Robust trade execution framework", detail: "Best execution policy with quarterly TCA analysis. Multi-broker relationships prevent concentration risk." },
    // Bug fix: fund was founded in 2018, so as of 2026 it's an ~8-year track record, not 12-year
    { title: "Clean regulatory history", detail: "Zero SEC enforcement actions, zero investor complaints, zero regulatory deficiencies in 8-year track record." },
  ],
  fund_performance: {
    aum_history: [
      { date: "2019-12", aum: 980 }, { date: "2020-06", aum: 850 }, { date: "2020-12", aum: 1200 },
      { date: "2021-06", aum: 1450 }, { date: "2021-12", aum: 1680 }, { date: "2022-06", aum: 1520 },
      { date: "2022-12", aum: 1750 }, { date: "2023-06", aum: 1900 }, { date: "2023-12", aum: 2050 },
      { date: "2024-06", aum: 2180 }, { date: "2024-12", aum: 2250 }, { date: "2025-06", aum: 2310 },
    ],
    annual_returns: [
      { year: 2020, fund: 18.4, benchmark: 16.3, alpha: 2.1 },
      { year: 2021, fund: 22.7, benchmark: 28.7, alpha: -6.0 },
      { year: 2022, fund: -8.2, benchmark: -19.4, alpha: 11.2 },
      { year: 2023, fund: 14.6, benchmark: 24.2, alpha: -9.6 },
      { year: 2024, fund: 11.8, benchmark: 23.3, alpha: -11.5 },
      { year: 2025, fund: 9.2, benchmark: 12.1, alpha: -2.9 },
    ],
    risk_metrics: {
      sharpe_ratio: 1.24, sortino_ratio: 1.78, max_drawdown: "-15.4%", max_drawdown_date: "Mar 2020",
      volatility: "12.3%", beta: "0.65", correlation_sp500: "0.72",
    },
    fees: { management_fee: "2%", performance_fee: "20%", hurdle_rate: "6%", high_water_mark: true, clawback: true },
    liquidity: { redemption_notice: "45 days", redemption_frequency: "Quarterly", lock_up: "1 year", gate: "25% per quarter", side_pocket: "Up to 15% of NAV" },
    fund_terms: { minimum_investment: "$1M", domicile: "Delaware", fiscal_year: "12/31", nav_frequency: "Monthly", administrator: "Citco Fund Services", auditor: "Ernst & Young LLP" },
  },
  investor_base: {
    total_investors: 412,
    investor_types: [
      { type: "Pension Fund", count: 48, pct: 34 },
      { type: "Endowment / Foundation", count: 62, pct: 22 },
      { type: "Fund of Funds", count: 35, pct: 18 },
      { type: "Family Office", count: 89, pct: 14 },
      { type: "Insurance", count: 28, pct: 8 },
      { type: "Sovereign Wealth", count: 4, pct: 4 },
    ],
    geography: [
      { region: "North America", pct: 62 },
      { region: "Europe", pct: 21 },
      { region: "Asia-Pacific", pct: 11 },
      { region: "Middle East", pct: 4 },
      { region: "Latin America", pct: 2 },
    ],
    concentration: {
      top_investor_pct: 8.4, top_5_pct: 28.7, top_10_pct: 42.1,
      assessment: "Healthy diversification — no single investor exceeds 10% of AUM. Top-10 concentration within institutional norms.",
    },
    redemption_history: [
      { quarter: "Q1 2025", subscriptions: 85, redemptions: 42, net: 43 },
      { quarter: "Q2 2025", subscriptions: 120, redemptions: 65, net: 55 },
      { quarter: "Q3 2025", subscriptions: 95, redemptions: 110, net: -15 },
      { quarter: "Q4 2025", subscriptions: 140, redemptions: 78, net: 62 },
    ],
  },
  peer_comparison: {
    peers: [
      { name: "Apex Systematic Alpha", strategy: "Global L/S Equity", aum: "$4.2B", score: 82, odd_rating: "ACCEPT" },
      { name: "Horizon Multi-Strategy", strategy: "Multi-Strategy", aum: "$6.8B", score: 74, odd_rating: "WATCHLIST" },
      { name: "Summit Macro Fund", strategy: "Global Macro", aum: "$1.9B", score: 71, odd_rating: "WATCHLIST" },
      { name: "Pinnacle Fixed Income", strategy: "Credit & Fixed Income", aum: "$3.1B", score: 88, odd_rating: "ACCEPT" },
    ],
    benchmark_comparison: [
      { metric: "Governance & Organization", assessment: "Below peer average", ridgeline: 55, peer_avg: 72, delta: -17 },
      { metric: "Regulatory Compliance", assessment: "Below peer average", ridgeline: 35, peer_avg: 68, delta: -33 },
      { metric: "Service Provider Quality", assessment: "Above peer average", ridgeline: 95, peer_avg: 78, delta: 17 },
      { metric: "Financial Controls", assessment: "At peer average", ridgeline: 80, peer_avg: 76, delta: 4 },
      { metric: "Technology & Cyber", assessment: "Below peer average", ridgeline: 52, peer_avg: 70, delta: -18 },
      { metric: "Reporting & Transparency", assessment: "Above peer average", ridgeline: 94, peer_avg: 80, delta: 14 },
    ],
  },
};

// ── Document vault data ──────────────────────────────────────────────────────

export const VAULT_DATA = {
  total_documents: 20,
  total_size_mb: 62,
  categories: [
    { name: "Regulatory", count: 3, icon: "shield" },
    { name: "ODD Review", count: 1, icon: "search" },
    { name: "Compliance", count: 5, icon: "check-circle" },
    { name: "Financial", count: 3, icon: "chart" },
    { name: "Legal", count: 4, icon: "scale" },
    { name: "Operations", count: 3, icon: "settings" },
    { name: "Governance", count: 1, icon: "users" },
  ],
  recent_activity: [
    { action: "uploaded", document: "DDQ Responses (Jan 2026)", user: "Ridgeline IR", time: "2 weeks ago", category: "ODD Review" },
    { action: "reviewed", document: "Compliance Manual (Dec 2025)", user: "Sungwon Kim", time: "3 weeks ago", category: "Compliance" },
    { action: "uploaded", document: "Form ADV Part 2A (Mar 2025)", user: "Sungwon Kim", time: "1 month ago", category: "Regulatory" },
    { action: "flagged", document: "Organization Chart (Nov 2025)", user: "Sungwon Kim", time: "1 month ago", category: "Governance" },
    { action: "uploaded", document: "Audited Financial Statements FY2024", user: "Ernst & Young LLP", time: "1 month ago", category: "Financial" },
    { action: "reviewed", document: "BCP/DR Plan (Oct 2025)", user: "Sungwon Kim", time: "6 weeks ago", category: "Operations" },
  ],
  documents: [
    { id: "DOC-001", name: "Form ADV Part 2A (March 2025)", category: "Regulatory", date: "2025-03-15", size_kb: 3200, pages: 38, status: "reviewed", tags: ["regulatory", "SEC"], uploaded_by: "Sungwon Kim", risk_flags: ["RO-001"] },
    { id: "DOC-002", name: "Form ADV Part 2B — Brochure Supplement", category: "Regulatory", date: "2025-03-15", size_kb: 1400, pages: 12, status: "reviewed", tags: ["regulatory", "key personnel"], uploaded_by: "Sungwon Kim", risk_flags: [] },
    { id: "DOC-003", name: "DDQ Responses (January 2026)", category: "ODD Review", date: "2026-01-10", size_kb: 4100, pages: 48, status: "reviewed", tags: ["DDQ", "operational"], uploaded_by: "Ridgeline IR", risk_flags: ["RO-001", "RO-003"] },
    { id: "DOC-004", name: "Compliance Manual (December 2025)", category: "Compliance", date: "2025-12-01", size_kb: 2800, pages: 32, status: "reviewed", tags: ["compliance", "policies"], uploaded_by: "Ridgeline IR", risk_flags: ["RO-002", "RO-005"] },
    { id: "DOC-005", name: "Audited Financial Statements FY2024", category: "Financial", date: "2025-04-30", size_kb: 5200, pages: 42, status: "reviewed", tags: ["audit", "financial", "EY"], uploaded_by: "Ernst & Young LLP", risk_flags: [] },
    { id: "DOC-006", name: "Audited Financial Statements FY2023", category: "Financial", date: "2024-04-30", size_kb: 4800, pages: 38, status: "reviewed", tags: ["audit", "financial", "EY"], uploaded_by: "Ernst & Young LLP", risk_flags: [] },
    { id: "DOC-007", name: "Organization Chart (November 2025)", category: "Governance", date: "2025-11-15", size_kb: 280, pages: 2, status: "flagged", tags: ["governance", "org chart"], uploaded_by: "Ridgeline IR", risk_flags: ["RO-003"] },
    { id: "DOC-008", name: "Business Continuity Plan (October 2025)", category: "Operations", date: "2025-10-01", size_kb: 1800, pages: 18, status: "reviewed", tags: ["BCP", "disaster recovery"], uploaded_by: "Ridgeline IR", risk_flags: ["RO-006"] },
    { id: "DOC-009", name: "Valuation Policy (September 2025)", category: "Compliance", date: "2025-09-15", size_kb: 2200, pages: 14, status: "reviewed", tags: ["valuation", "pricing"], uploaded_by: "Ridgeline IR", risk_flags: ["RO-004"] },
    { id: "DOC-010", name: "Private Placement Memorandum (PPM)", category: "Legal", date: "2025-01-01", size_kb: 8400, pages: 86, status: "reviewed", tags: ["PPM", "offering"], uploaded_by: "Schulte Roth & Zabel", risk_flags: [] },
    { id: "DOC-011", name: "Limited Partnership Agreement (LPA)", category: "Legal", date: "2018-03-01", size_kb: 6200, pages: 68, status: "reviewed", tags: ["LPA", "fund terms"], uploaded_by: "Schulte Roth & Zabel", risk_flags: [] },
    { id: "DOC-012", name: "Insurance Summary (E&O, D&O, Cyber)", category: "Operations", date: "2025-07-01", size_kb: 920, pages: 6, status: "reviewed", tags: ["insurance", "E&O"], uploaded_by: "Ridgeline IR", risk_flags: [] },
    { id: "DOC-013", name: "Annual Report to Investors (2024)", category: "Financial", date: "2025-03-01", size_kb: 3600, pages: 28, status: "reviewed", tags: ["investor report", "annual"], uploaded_by: "Ridgeline IR", risk_flags: [] },
    { id: "DOC-014", name: "Code of Ethics", category: "Compliance", date: "2025-01-15", size_kb: 1200, pages: 10, status: "reviewed", tags: ["ethics", "personal trading"], uploaded_by: "Ridgeline IR", risk_flags: [] },
    { id: "DOC-015", name: "SEC Examination Response Letter (Oct 2023)", category: "Regulatory", date: "2023-10-30", size_kb: 1600, pages: 8, status: "reviewed", tags: ["SEC exam", "no deficiency"], uploaded_by: "Sungwon Kim", risk_flags: [] },
    { id: "DOC-016", name: "Trade Allocation Policy", category: "Compliance", date: "2025-06-01", size_kb: 1400, pages: 8, status: "reviewed", tags: ["trade allocation"], uploaded_by: "Ridgeline IR", risk_flags: [] },
    { id: "DOC-017", name: "Conflict of Interest Policy", category: "Compliance", date: "2025-01-01", size_kb: 1100, pages: 8, status: "reviewed", tags: ["conflicts", "disclosure"], uploaded_by: "Ridgeline IR", risk_flags: [] },
    { id: "DOC-018", name: "Administrator Engagement Letter (Citco)", category: "Operations", date: "2024-01-15", size_kb: 680, pages: 6, status: "reviewed", tags: ["administrator", "Citco"], uploaded_by: "Citco Fund Services", risk_flags: [] },
    { id: "DOC-019", name: "Prime Brokerage Agreement (Goldman Sachs)", category: "Legal", date: "2023-06-01", size_kb: 4200, pages: 34, status: "reviewed", tags: ["prime broker", "Goldman"], uploaded_by: "Goldman Sachs PB", risk_flags: [] },
    { id: "DOC-020", name: "Side Letter Summary", category: "Legal", date: "2025-12-01", size_kb: 1800, pages: 12, status: "reviewed", tags: ["side letters", "MFN"], uploaded_by: "Ridgeline IR", risk_flags: [] },
  ],
  search_suggestions: ["CCO appointment status", "Valuation methodology Level 3", "Key person succession plan", "SEC examination results", "Pre-trade compliance system", "Business continuity testing"],
};

// ── AI Follow-Up Agent mock data ─────────────────────────────────────────────

export const FOLLOW_UP_MOCK = {
  rounds: [
    {
      round_number: 1,
      status: "complete",
      generated_at: "2026-01-22",
      completed_at: "2026-01-29",
      questions: [
        {
          id: "fu-q1", number: 1, priority: "critical", topic_number: 2,
          sub_topic_ids: ["2.3", "2.4", "2.5"],
          question_text: "Compliance Program Documentation",
          sub_items: [
            { label: "Compliance manual or policies & procedures handbook", resolved: true, resolved_by: "compliance_manual_2025.pdf", response_type: "document" },
            { label: "Personal trading pre-clearance policy", resolved: true, resolved_by: "Manager Response", response_type: "text", response_text: "Pre-clearance is handled through our automated system (ComplySci). All employees submit requests 48 hours in advance. Attached export of policy settings." },
            { label: "Expert network usage policy", resolved: true, resolved_by: "expert_network_policy.pdf", response_type: "document" },
            { label: "Most recent compliance training records", resolved: true, resolved_by: "Manager Response", response_type: "text", response_text: "All 34 employees completed annual compliance training in November 2025. Certificate of completion attached in the compliance manual." },
          ],
          status: "answered",
        },
        {
          id: "fu-q2", number: 2, priority: "critical", topic_number: 1,
          sub_topic_ids: ["1.4"],
          question_text: "Succession Planning & Key Person Risk Mitigation",
          sub_items: [
            { label: "Documented succession plan for CIO David Chen", resolved: true, resolved_by: "Manager Response", response_type: "text", response_text: "Board approved a succession framework in December 2025. Head of Research (Michael Torres, 12yr experience) designated as interim CIO. Formal plan document being finalized by outside counsel." },
            { label: "Key person insurance policy details", resolved: true, resolved_by: "Manager Response", response_type: "text", response_text: "Key person insurance policy ($5M coverage) bound with AIG effective January 2026. Policy number KP-2026-RC-0412. David Chen and Sarah Martinez covered.", commitment: "Formal succession plan document expected Q2 2026" },
            { label: "Deputy CIO designation or investment committee charter", resolved: true, resolved_by: "ic_charter_2026.pdf", response_type: "document" },
          ],
          status: "answered",
        },
        {
          id: "fu-q3", number: 3, priority: "critical", topic_number: 2,
          sub_topic_ids: ["2.3"],
          question_text: "CCO Independence & Dedicated Compliance Officer",
          sub_items: [
            { label: "Timeline for hiring a dedicated Chief Compliance Officer", resolved: true, resolved_by: "Manager Response", response_type: "text", response_text: "CCO search initiated with Korn Ferry in January 2026. Two finalists in second-round interviews. Board has approved a $450K compensation package. Target start date: April 2026.", commitment: "Dedicated CCO hiring expected April 2026" },
            { label: "Interim compliance oversight arrangements", resolved: true, resolved_by: "Manager Response", response_type: "text", response_text: "Sarah Martinez (COO) continues as interim CCO. External compliance consultant (ACA Group) engaged for quarterly reviews starting Q1 2026. Monthly compliance committee meetings with board observer." },
          ],
          status: "answered",
        },
        {
          id: "fu-q4", number: 4, priority: "important", topic_number: 7,
          sub_topic_ids: ["7.2", "7.3"],
          question_text: "Investment Committee Governance",
          sub_items: [
            { label: "Investment Committee charter or terms of reference", resolved: true, resolved_by: "ic_charter_2026.pdf", response_type: "document" },
            { label: "Recent IC meeting minutes (last 3 meetings)", resolved: true, resolved_by: "ic_minutes_q4_2025.pdf", response_type: "document" },
          ],
          status: "answered",
        },
        {
          id: "fu-q5", number: 5, priority: "important", topic_number: 9,
          sub_topic_ids: ["9.1"],
          question_text: "Valuation Committee Independence",
          sub_items: [
            { label: "Valuation committee membership and independence assessment", resolved: true, resolved_by: "Manager Response", response_type: "text", response_text: "Valuation Committee reconstituted in Q4 2025 to include independent member (John Park, former E&Y partner). Committee now consists of: CFO (chair), COO, and independent member. CIO removed from voting membership but attends as observer." },
            { label: "Level 3 asset valuation procedures and third-party pricing sources", resolved: true, resolved_by: "valuation_policy_2026.pdf", response_type: "document" },
          ],
          status: "answered",
        },
        {
          id: "fu-q6", number: 6, priority: "important", topic_number: 4,
          sub_topic_ids: ["4.3", "4.4"],
          question_text: "Cybersecurity Incident Response & BCP Testing",
          sub_items: [
            { label: "Updated incident response plan (current policy dated 2023)", resolved: true, resolved_by: "irp_2026_update.pdf", response_type: "document" },
            { label: "Most recent BCP/DR test results", resolved: true, resolved_by: "bcp_test_results_dec2025.pdf", response_type: "document" },
            { label: "Penetration test report (most recent)", resolved: true, resolved_by: "pentest_summary_jan2026.pdf", response_type: "document" },
          ],
          status: "answered",
        },
        {
          id: "fu-q7", number: 7, priority: "nice_to_have", topic_number: 1,
          sub_topic_ids: ["1.5"],
          question_text: "Advisory Board Independence",
          sub_items: [
            { label: "Plans to add independent director to advisory board", resolved: true, resolved_by: "Manager Response", response_type: "text", response_text: "Board approved adding an independent director. Candidate identified: Margaret Liu (former COO, Citadel). Expected appointment Q2 2026.", commitment: "Independent director appointment expected Q2 2026" },
          ],
          status: "answered",
        },
        {
          id: "fu-q8", number: 8, priority: "nice_to_have", topic_number: 4,
          sub_topic_ids: ["4.2"],
          question_text: "SOC 2 / ISO 27001 Certification Plans",
          sub_items: [
            { label: "SOC 2 Type II audit timeline or engagement letter", resolved: true, resolved_by: "Manager Response", response_type: "text", response_text: "SOC 2 Type II audit engagement signed with Deloitte. Readiness assessment completed January 2026. Audit window: March-August 2026. Report expected October 2026.", commitment: "SOC 2 Type II report expected October 2026" },
          ],
          status: "answered",
        },
      ],
    },
    {
      round_number: 2,
      status: "complete",
      generated_at: "2026-02-03",
      completed_at: "2026-02-07",
      questions: [
        {
          id: "fu-q9", number: 1, priority: "important", topic_number: 2,
          sub_topic_ids: ["2.4"],
          question_text: "Pre-Trade Compliance System Details",
          sub_items: [
            { label: "ComplySci configuration and automated restriction list details", resolved: true, resolved_by: "complysci_config_overview.pdf", response_type: "document" },
          ],
          status: "answered",
        },
        {
          id: "fu-q10", number: 2, priority: "important", topic_number: 7,
          sub_topic_ids: ["7.4"],
          question_text: "Risk Management Framework Updates",
          sub_items: [
            { label: "Updated position sizing and concentration limits post-IC charter revision", resolved: true, resolved_by: "Manager Response", response_type: "text", response_text: "New risk limits effective January 2026: Single position max 8% (was 10%), sector max 25%, gross exposure 150-200%. Stop-loss at -5% per position. All limits monitored daily by risk team (2 FTEs added Q4 2025)." },
          ],
          status: "answered",
        },
        {
          id: "fu-q11", number: 3, priority: "nice_to_have", topic_number: 9,
          sub_topic_ids: ["9.3"],
          question_text: "Valuation Override History",
          sub_items: [
            { label: "Summary of any pricing overrides in last 12 months with rationale", resolved: true, resolved_by: "Manager Response", response_type: "text", response_text: "3 pricing overrides in 2025, all Level 3 positions: (1) Private credit position marked down 12% per independent appraiser, (2) Side pocket position written up 8% after partial exit at higher price, (3) Distressed debt position marked to recovery analysis. All documented in valuation committee minutes." },
          ],
          status: "answered",
        },
      ],
    },
  ],
  monitoring_items: [
    { commitment: "Formal succession plan document", expected: "Q2 2026", source: "Q1 Follow-Up", topic: "Org & Governance", status: "pending" },
    { commitment: "Dedicated CCO hiring", expected: "April 2026", source: "Q1 Follow-Up", topic: "Regulatory & Compliance", status: "pending" },
    { commitment: "Independent director appointment", expected: "Q2 2026", source: "Q1 Follow-Up", topic: "Org & Governance", status: "pending" },
    { commitment: "SOC 2 Type II report", expected: "October 2026", source: "Q1 Follow-Up", topic: "Tech & Cybersecurity", status: "pending" },
  ],
};

// ── Document collection (Phase 1 initial docs + Follow-Up) ──────────────────

export const COLLECTION_DOCS = [
  { name: "Due Diligence Questionnaire (DDQ)", type: "DDQ", date: "2026-01-18", source: "Manager Upload" },
  { name: "Form ADV Part 2A (March 2025)", type: "Regulatory", date: "2026-01-18", source: "Manager Upload" },
  { name: "Compliance Manual (2025)", type: "Compliance", date: "2026-01-22", source: "Follow-Up R1" },
  { name: "Expert Network Policy", type: "Compliance", date: "2026-01-22", source: "Follow-Up R1" },
  { name: "IC Charter (January 2026)", type: "Governance", date: "2026-01-25", source: "Follow-Up R1" },
  { name: "IC Meeting Minutes Q4 2025", type: "Governance", date: "2026-01-25", source: "Follow-Up R1" },
  { name: "Valuation Policy (2026)", type: "Operations", date: "2026-01-28", source: "Follow-Up R1" },
  { name: "Incident Response Plan (2026 Update)", type: "Technology", date: "2026-01-28", source: "Follow-Up R1" },
  { name: "BCP/DR Test Results (Dec 2025)", type: "Technology", date: "2026-01-28", source: "Follow-Up R1" },
  { name: "Penetration Test Summary (Jan 2026)", type: "Technology", date: "2026-01-28", source: "Follow-Up R1" },
  { name: "ComplySci Configuration Overview", type: "Compliance", date: "2026-02-05", source: "Follow-Up R2" },
  { name: "Organization Chart (Nov 2025)", type: "Governance", date: "2026-01-18", source: "Manager Upload" },
  { name: "Audited Financial Statements FY2024", type: "Financial", date: "2026-01-18", source: "Manager Upload" },
  { name: "Audited Financial Statements FY2023", type: "Financial", date: "2026-01-18", source: "Manager Upload" },
  { name: "Private Placement Memorandum", type: "Legal", date: "2026-01-18", source: "Manager Upload" },
];
