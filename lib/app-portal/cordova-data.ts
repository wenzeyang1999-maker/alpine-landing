/**
 * Cordova JV Real Estate Fund III, L.P. — static demo data for the Investor Portal report reader.
 *
 * ODD review of Cordova JV Real Estate Fund III, L.P. (Joint Venture Real Estate — Value-Add Multifamily)
 * Manager: Cordova Capital Partners, LLC
 * Overall rating: YELLOW (24 flags, 0 RED chapters, 4 YELLOW chapters)
 */

import type { TopicInfo, TopicDataGroup } from "./ridgeline-data";

export type { TopicInfo, TopicDataGroup };

// ── 8-Topic ODD assessment data (Cordova JV III) ──────────────────────────────

export const CORDOVA_TOPIC_DATA: Record<number, TopicInfo> = {
  1: {
    name: "Manager, Ownership & Governance", rating: "YELLOW",
    summary: "Mid-sized RE platform founded 2014, third JV vintage. 18 FTEs concentrated in acquisitions and asset management. Single Managing Principal (Carlos Mendoza) holds 60% ownership and CIO role — concentration risk. No formal succession plan. GP commits 2% pari passu. Investment professional acts as compliance officer.",
    findings: `### Management Company and Affiliates

Cordova Capital Partners, LLC ("Cordova" or the "Manager") was founded in 2014 by Carlos Mendoza (Managing Principal and Chief Investment Officer), formerly Director of Acquisitions at TruAmerica Multifamily and prior to that Senior Associate at Lone Star Funds. Cordova is headquartered in Dallas, Texas with a secondary office in Phoenix. The firm operates as a value-add multifamily real estate sponsor focused on Sun Belt markets (Texas, Arizona, North Carolina, Florida, Tennessee).

### Strategy & Fund Series

Cordova employs a joint-venture sponsor model: Cordova partners with experienced regional operating partners (typically property management companies with deep market expertise) to acquire and renovate underperforming Class B and C multifamily assets. Cordova provides equity capital, oversight, and strategic direction; operating partners handle day-to-day property management and on-site renovation execution. This model is common in mid-sized RE strategies but introduces dependence on operating partner quality and alignment.

The firm has raised three JV funds: Cordova JV I (2016, $185M, fully realized), Cordova JV II (2019, $410M, ~70% realized), and Cordova JV III (2024, $750M target / $850M hard cap, $520M raised through December 2025).

### Assets under Management

Cordova reported firmwide net assets of $1.10 billion as of December 31, 2025, plus $370 million in uncalled capital. The firm has acquired 47 multifamily properties (totaling 14,200 units) across the three vintages.

### Ownership & Succession

Carlos Mendoza owns 60% of Cordova, with Stephanie Vance (Head of Asset Management, Co-Founder) holding 25%, and Daniel Park (CFO, joined 2017) holding 15%. Alpine notes the high concentration of ownership in Carlos Mendoza. No formal written succession plan exists; succession discussions have been informal between the three principals. The LPA includes a key person provision triggered if Carlos Mendoza ceases to dedicate substantially all of his time to Cordova. Key person life insurance of $10 million is in place on Carlos only — Stephanie Vance and Daniel Park are not covered.

### Human Resources

Cordova employs 18 full-time professionals: 7 acquisitions, 5 asset management, 3 finance/operations, 2 investor relations, and 1 administrative. Background checks are performed by Carlos Mendoza personally on initial hire (no external vendor). Annual refresh checks are not performed. Staff are compensated with base salary and discretionary bonus; only the three principals participate in carried interest.

### Chapter Summary

The chapter is rated YELLOW due to: (1) concentrated ownership in Carlos Mendoza with no formal succession plan, (2) key person insurance limited to a single principal, and (3) background checks performed internally rather than by a third-party vendor. The Manager has institutional acquisitions and asset management capabilities for its size but exhibits emerging-manager governance characteristics.`,
    docCategories: ["Governance"], riskObsIds: ["CO-001", "CO-002", "CO-003"],
    verificationCategory: "governance",
    dataPoints: [
      { group: "Management Company", items: [
        { label: "Manager Name", value: "Cordova Capital Partners, LLC", source: "Form ADV" },
        { label: "Date of Formation", value: "June 11, 2014", source: "Texas SoS" },
        { label: "Primary Location", value: "Dallas, TX (HQ); Phoenix, AZ (secondary)", source: "Form ADV" },
        { label: "Total Headcount", value: "18 FTEs (7 acquisitions, 5 asset mgmt, 3 finance, 2 IR, 1 admin)", source: "DDQ" },
        { label: "AUM (Net Assets, 12/31/2025)", value: "$1.10 billion", source: "Form ADV" },
        { label: "Uncalled Capital", value: "$370 million", source: "DDQ" },
        { label: "Total Properties / Units", value: "47 properties / 14,200 units across three vintages", source: "DDQ" },
      ]},
      { group: "Principals", items: [
        { label: "Managing Principal / CIO", value: "Carlos Mendoza — 60% ownership; former TruAmerica, Lone Star", flag: "yellow", source: "Form ADV" },
        { label: "Co-Founder / Head of Asset Mgmt", value: "Stephanie Vance — 25% ownership; former Camden Property Trust", source: "Form ADV" },
        { label: "CFO", value: "Daniel Park — 15% ownership; joined 2017; former JLL Capital Markets", source: "Form ADV" },
      ]},
      { group: "Governance & Ownership", items: [
        { label: "Ownership", value: "Mendoza 60%, Vance 25%, Park 15%", flag: "yellow", source: "Form ADV" },
        { label: "GP Commitment (Fund III)", value: "2.0% in cash (~$17M at $850M hard cap); pari passu, no fee offset", flag: "green", source: "LPA" },
        { label: "Succession Plan", value: "Not formalized in writing", flag: "yellow", source: "DDQ" },
        { label: "Key Person Insurance", value: "$10M on Carlos Mendoza only — Vance and Park not covered", flag: "yellow", source: "DDQ" },
        { label: "Background Checks", value: "Internal by Managing Principal — no external vendor or refresh", flag: "yellow", source: "DDQ" },
        { label: "Deferred Compensation", value: "Carry restricted to 3 principals only; no deferred element", flag: "yellow", source: "DDQ" },
      ]},
      { group: "Fund Series Track Record", items: [
        { label: "Cordova JV I (2016)", value: "$185M — fully realized; 18.4% gross IRR / 1.92x MOIC", source: "DDQ" },
        { label: "Cordova JV II (2019)", value: "$410M — ~70% realized; 16.1% gross IRR (interim)", source: "DDQ" },
        { label: "Cordova JV III (current)", value: "$750M target / $850M hard cap; $520M raised through 12/2025", source: "DDQ" },
      ]},
    ],
  },
  2: {
    name: "Legal, Regulatory & Compliance", rating: "YELLOW",
    summary: "SEC Exempt Reporting Adviser (ERA) status. Daniel Park (CFO) acts as Chief Compliance Officer — segregation of duties concern. Compliance program established in 2022; engaged Apex Compliance Advisors as outside consultant. Personal trading policy adequate but no minimum holding period. No regulatory actions.",
    findings: `### Regulatory Status

Cordova Capital Partners, LLC is a U.S. Securities and Exchange Commission ("SEC") Exempt Reporting Adviser ("ERA") under Section 203(m) of the Investment Advisers Act, filed since 2016. The firm has not yet crossed the $150 million private fund adviser threshold for full RIA registration, although its current AUM exceeds this level and Alpine notes that Cordova will need to transition to full RIA registration prior to or alongside the closing of Fund III. The Manager indicated that the transition is planned for Q3 2026.

### Compliance Program

Daniel Park (CFO) serves as Chief Compliance Officer in addition to his finance responsibilities. While Daniel has acquired meaningful compliance experience over his tenure, Alpine notes that combining CFO and CCO roles creates segregation of duties concerns — the same individual is responsible for financial controls and for testing the effectiveness of those controls. As Cordova approaches full RIA registration, Alpine strongly recommends appointment of a dedicated CCO independent of finance and investment functions.

Cordova engaged Apex Compliance Advisors LLC as outside compliance consultant in Q1 2022. Apex performs an annual compliance review and supports Daniel Park with regulatory filings, code of ethics enforcement, and policy updates. The current compliance manual is dated October 2024 — a 2026 revision is in progress.

### Code of Ethics & Personal Trading

The Code of Ethics requires pre-clearance only for securities on Cordova's restricted list (currently empty, as the firm does not invest in public securities). Quarterly personal trading reports are submitted by all employees through Apex's portal. Brokerage statements are collected via employee self-reporting. There is no minimum holding period and no formal prohibition on trading securities held by the funds — gaps that Alpine recommends closing.

### Regulatory History & Litigation

Cordova has had no SEC examinations or regulatory actions. The firm has not been a party to any material litigation, although Alpine notes that one Cordova JV II asset (a 320-unit property in Houston) is currently in a residential tenant class action alleging deferred-maintenance habitability issues. The litigation is against the property's special-purpose owner LLC and the operating partner — Cordova itself is not named — but Alpine notes the indirect reputational exposure.

### Chapter Summary

The chapter is rated YELLOW due to: (1) CFO/CCO role combination; (2) gaps in personal trading policy (no minimum holding period, no fund-securities prohibition); (3) brokerage statement collection through employee self-reporting; and (4) the pending requirement to transition to full RIA registration as AUM scales.`,
    docCategories: ["Compliance"], riskObsIds: ["CO-004", "CO-005", "CO-006"],
    verificationCategory: "compliance",
    dataPoints: [
      { group: "Regulatory Status", items: [
        { label: "SEC Status", value: "Exempt Reporting Adviser (ERA) — full RIA transition planned Q3 2026", flag: "yellow", source: "SEC_EDGAR" },
        { label: "Form ADV Last Filing", value: "ERA annual filing March 2026", source: "Form ADV" },
      ]},
      { group: "Compliance Team", items: [
        { label: "Chief Compliance Officer", value: "Daniel Park (CFO) — also responsible for finance/controls", flag: "yellow", source: "DDQ" },
        { label: "Outside Compliance Consultant", value: "Apex Compliance Advisors LLC (since Q1 2022)", flag: "green", source: "DDQ" },
        { label: "Annual Compliance Review", value: "Performed by Apex; most recent November 2025", flag: "green", source: "DDQ" },
        { label: "Compliance Manual Currency", value: "Dated October 2024 — 2026 revision in progress", flag: "yellow", source: "DDQ" },
      ]},
      { group: "Personal Trading Controls", items: [
        { label: "Pre-Clearance Scope", value: "Restricted list only (currently empty)", flag: "yellow", source: "Code of Ethics" },
        { label: "Quarterly Personal Trading Reports", value: "Submitted via Apex portal", flag: "green", source: "DDQ" },
        { label: "Brokerage Statements", value: "Employee self-reported (not custodian-direct)", flag: "yellow", source: "DDQ" },
        { label: "Minimum Holding Period", value: "None", flag: "yellow", source: "Code of Ethics" },
      ]},
      { group: "Regulatory History", items: [
        { label: "SEC Examinations", value: "None", flag: "green", source: "SEC_EDGAR" },
        { label: "Direct Litigation Against Cordova", value: "None material", flag: "green", source: "DDQ" },
        { label: "Indirect Exposure", value: "JV II Houston property — tenant habitability class action against SPV/operator", flag: "yellow", source: "DDQ" },
      ]},
    ],
  },
  3: {
    name: "Technology, Cybersecurity & Business Resilience", rating: "YELLOW",
    summary: "Microsoft 365 cloud-based stack with MFA enforced. Engaged Vantage Tech in 2023 for managed IT services. No SOC 2 audit. Penetration testing performed once (2024) — annual cadence not yet established. Basic phishing program. Endpoint protection without DLP. BCP and IRP exist but not tested.",
    findings: `### Infrastructure

Cordova operates on Microsoft 365 (Exchange, SharePoint, Teams) supplemented by Yardi Voyager for property accounting and asset management, and Juniper Square for investor reporting and capital activity. Single sign-on through Microsoft Entra ID with mandatory MFA enforced for all employees. Microsoft Defender provides endpoint antivirus protection.

### Cybersecurity Program

Cordova engaged Vantage Tech LLC in March 2023 as outsourced IT and cybersecurity provider. Vantage performs ongoing patch management, endpoint monitoring, identity management, and incident response support. Vantage is the same provider used by Aurora and several other small/mid alternative managers — Alpine views the engagement positively but notes that Vantage's service tier for Cordova does not include data loss prevention (DLP) or advanced threat detection.

Cordova has not commissioned a SOC 2 audit. A first external penetration test was performed by Bishop Fox in November 2024 (3 medium-severity findings, all remediated within 60 days). Cordova has indicated that annual penetration testing will be established as a recurring practice — this is appropriate but not yet evidenced by a second test cycle.

Phishing simulations are conducted quarterly through Vantage's KnowBe4 license. The rolling 4-quarter click rate is 4.8%, above the financial services benchmark of 3.2%, indicating room for improvement in employee awareness.

### Resilience

Cordova maintains a Written Information Security Program (WISP), Incident Response Plan (IRP), and Business Continuity Plan (BCP). The most recent reviews were conducted in mid-2024. Alpine notes that the BCP has not been formally tested via a tabletop exercise — Cordova has indicated that an exercise is planned for Q3 2026.

### Insurance

Cyber liability insurance limit is $5 million per occurrence and $5 million aggregate. Alpine views this as modest given Cordova's $1.1 billion AUM; institutional benchmarks typically range from $10M–$25M for managers at this scale.

### Chapter Summary

The chapter is rated YELLOW due to: (1) no SOC 2 audit; (2) penetration testing not yet established as recurring annual practice; (3) phishing click rate above industry benchmark; (4) BCP not yet tabletop-tested; and (5) cyber liability insurance below institutional benchmark for AUM size.`,
    docCategories: ["Technology"], riskObsIds: ["CO-007", "CO-008"],
    verificationCategory: "cybersecurity",
    dataPoints: [
      { group: "Infrastructure", items: [
        { label: "Productivity Platform", value: "Microsoft 365 (Exchange, SharePoint, Teams)", source: "DDQ" },
        { label: "Property / Asset Systems", value: "Yardi Voyager (accounting + asset mgmt), Juniper Square (investor reporting)", source: "DDQ" },
        { label: "Identity & Access", value: "Microsoft Entra ID SSO + mandatory MFA", flag: "green", source: "DDQ" },
        { label: "Endpoint Protection", value: "Microsoft Defender (no DLP)", flag: "yellow", source: "DDQ" },
      ]},
      { group: "Cybersecurity Program", items: [
        { label: "Outsourced IT/Cyber", value: "Vantage Tech LLC (since March 2023)", flag: "green", source: "DDQ" },
        { label: "SOC 2 Audit", value: "Not commissioned", flag: "yellow", source: "DDQ" },
        { label: "Penetration Testing", value: "First test November 2024 (Bishop Fox) — annual cadence planned but not yet evidenced", flag: "yellow", source: "DDQ" },
        { label: "Phishing Click Rate", value: "4.8% (rolling 4 quarters; vs. 3.2% industry benchmark)", flag: "yellow", source: "DDQ" },
      ]},
      { group: "Resilience & Insurance", items: [
        { label: "WISP / IRP / BCP", value: "Maintained; reviewed mid-2024", flag: "yellow", source: "WISP" },
        { label: "Tabletop Exercise", value: "Not yet performed; planned Q3 2026", flag: "yellow", source: "DDQ" },
        { label: "Cyber Liability Insurance", value: "$5M per occurrence / $5M aggregate (below institutional benchmark)", flag: "yellow", source: "Insurance Cert" },
      ]},
    ],
  },
  4: {
    name: "Fund Structure, Terms & Investor Alignment", rating: "GREEN",
    summary: "Delaware LP with Cayman feeder. 1.5% management fee on invested capital. 20% carry over 8% preferred return with 50/50 catch-up. 8-year term + two 1-yr extensions. Deal-by-deal carry with full clawback. Strong LP protections including for-cause and no-fault GP removal. GP 2% cash commitment.",
    findings: `### Fund Structure

Cordova JV Real Estate Fund III, L.P. is structured as a Delaware limited partnership with a Cayman feeder for non-US and US tax-exempt investors. The fund invests across joint venture equity positions in value-add multifamily acquisitions in Sun Belt markets (Texas, Arizona, North Carolina, Florida, Tennessee). Maximum single-asset concentration is 8% of total commitments; maximum single-market concentration is 35%.

### Fees & Carried Interest

The management fee is 1.50% per annum on invested capital during the investment period (years 1–4) and on NAV (excluding realized assets) thereafter. Carried interest is 20% over an 8% preferred return with a 50/50 catch-up. Carry is calculated on a deal-by-deal basis with a full European-style clawback at fund-end — Alpine notes that while deal-by-deal carry is less LP-favorable than whole-of-fund, the European clawback substantially mitigates exposure to early-distribution risk.

### Term & Investment Period

The fund has an 8-year term comprising a 4-year investment period and 4-year harvesting period, with up to two one-year extensions subject to LPAC approval. This is consistent with peer JV value-add multifamily funds.

### GP Commitment

The General Partner has committed 2% of total commitments in cash, equating to approximately $17 million at the $850 million hard cap. The commitment is funded pari passu with LPs with no fee offset.

### LP Protections

LP protections include: most-favored-nation rights for commitments over $25 million; a 7-seat LPAC; for-cause GP removal at 50% LP vote; no-fault GP removal at 75% LP vote; and a key person clause triggered if Carlos Mendoza ceases substantially full-time involvement. The LPA was negotiated through ILPA-aligned outside counsel.

### Chapter Summary

The chapter is rated GREEN. Fund terms are well-aligned with institutional LP standards in the value-add multifamily strategy. Deal-by-deal carry is offset by European-style clawback. GP commitment is fully cash-funded.`,
    docCategories: ["Fund Structure"], riskObsIds: [],
    verificationCategory: "fund_structure",
    dataPoints: [
      { group: "Fund Structure", items: [
        { label: "Fund Vehicle", value: "Cordova JV Real Estate Fund III, L.P. (Delaware LP)", source: "LPA" },
        { label: "Parallel Feeder", value: "Cordova JV III (Cayman), Ltd.", source: "LPA" },
        { label: "Strategy", value: "Value-add multifamily — Sun Belt markets", source: "PPM" },
        { label: "Single-Asset Concentration Cap", value: "8% of total commitments", flag: "green", source: "LPA" },
        { label: "Single-Market Concentration Cap", value: "35% of total commitments", flag: "green", source: "LPA" },
      ]},
      { group: "Fees & Carry", items: [
        { label: "Management Fee", value: "1.50% on invested capital (years 1–4), on NAV thereafter", flag: "green", source: "LPA" },
        { label: "Carried Interest", value: "20% over 8% preferred return; 50/50 catch-up", source: "LPA" },
        { label: "Carry Calculation", value: "Deal-by-deal", flag: "yellow", source: "LPA" },
        { label: "Clawback", value: "European-style full clawback at fund-end", flag: "green", source: "LPA" },
      ]},
      { group: "Term & GP Commitment", items: [
        { label: "Total Term", value: "8 years + 2 one-year extensions (LPAC approval)", source: "LPA" },
        { label: "Investment Period", value: "4 years", source: "LPA" },
        { label: "GP Commitment", value: "2.0% in cash (~$17M at $850M hard cap); pari passu, no fee offset", flag: "green", source: "LPA" },
      ]},
      { group: "LP Protections", items: [
        { label: "Most-Favored-Nation", value: "Available to commitments ≥ $25M", source: "LPA" },
        { label: "LPAC Seats", value: "7", source: "LPA" },
        { label: "GP Removal — For Cause", value: "50% LP vote threshold", flag: "green", source: "LPA" },
        { label: "GP Removal — No Fault", value: "75% LP vote threshold", flag: "green", source: "LPA" },
        { label: "Key Person Clause", value: "Triggered if Carlos Mendoza ceases substantially full-time involvement", source: "LPA" },
      ]},
    ],
  },
  5: {
    name: "Service Providers, Delegation & Oversight", rating: "GREEN",
    summary: "Strong service provider lineup: SS&C as administrator, KPMG as auditor, Wells Fargo as primary bank, Goodwin Procter as fund counsel. Vendor SOC reports reviewed annually. JV operating partners subject to a structured due diligence and ongoing monitoring program — the most material 'service provider' relationship in the strategy.",
    findings: `### Administrator

SS&C ALPS Alternative Fund Services has served as Cordova's fund administrator since 2018 (initially engaged for Cordova JV II). SS&C provides full middle- and back-office services including NAV calculation, investor capital activity, AML/KYC, regulatory reporting, and FATCA/CRS compliance. Daniel Park (CFO) reviews SS&C's annual SOC 1 Type II report and conducts an annual call with the relationship manager.

### Auditor

KPMG LLP audits the fund and has served as Cordova's auditor since 2018 (replacing a regional firm used for Cordova JV I). KPMG's annual audit opinion is delivered within 100 days of fiscal year-end. The audit fee for FY2024 was $310,000. No restatements, material weaknesses, or significant deficiencies have been reported.

### Primary Banking

Wells Fargo, N.A. serves as Cordova's primary banking relationship at the fund level. Property-level bank accounts (one per asset SPV) are held at regional banks selected by the relevant operating partner — typically Bank of America, Truist, or regional institutions. Cordova has signing authority on all property-level accounts. Wire transfers from fund-level accounts require dual approval (Daniel Park plus one principal).

### Legal Counsel

Goodwin Procter LLP serves as primary fund counsel and outside legal counsel for new investments. The Goodwin engagement is well-established and provides relevant real-estate-specific expertise.

### Operating Partner Diligence (Material to Strategy)

Because Cordova invests as a JV equity partner with regional operators handling day-to-day property management, the operating partner diligence process is effectively the most critical "service provider" workflow. Cordova maintains a written Operating Partner Diligence Policy requiring: (1) financial statement review; (2) reference checks across at least 5 prior LPs and 3 lenders; (3) site visits to existing managed properties; (4) review of property management operating systems; (5) background checks on operating partner principals through First Advantage. Each operating partner undergoes annual re-certification. Cordova currently has active joint ventures with 6 operating partners across the three fund vintages.

### Chapter Summary

The chapter is rated GREEN. Service providers are institutional-quality with long-standing relationships. The Operating Partner Diligence framework is robust and well-documented — appropriate for the strategy.`,
    docCategories: ["Service Providers"], riskObsIds: [],
    verificationCategory: "service_providers",
    dataPoints: [
      { group: "Service Providers", items: [
        { label: "Administrator", value: "SS&C ALPS Alternative Fund Services (since 2018)", flag: "green", source: "Admin Agreement" },
        { label: "Auditor", value: "KPMG LLP (since 2018)", flag: "green", source: "Audit Letter" },
        { label: "Primary Bank", value: "Wells Fargo, N.A.", source: "DDQ" },
        { label: "Fund Counsel", value: "Goodwin Procter LLP", source: "DDQ" },
      ]},
      { group: "Operating Partner Diligence Program", items: [
        { label: "Diligence Policy", value: "Written; mandatory before any new JV", flag: "green", source: "DDQ" },
        { label: "Required Diligence Components", value: "Financial review, 5 LP refs, 3 lender refs, site visits, background checks (First Advantage)", flag: "green", source: "DDQ" },
        { label: "Annual Re-Certification", value: "Required of all active operating partners", flag: "green", source: "DDQ" },
        { label: "Active Operating Partners", value: "6 across three fund vintages", source: "DDQ" },
      ]},
      { group: "Audit & Bank Oversight", items: [
        { label: "Audit Fee (FY2024)", value: "$310,000", source: "DDQ" },
        { label: "Audit History", value: "No restatements, material weaknesses, or significant deficiencies since 2018", flag: "green", source: "Audit Letter" },
        { label: "Wire Transfer Controls", value: "Dual approval (CFO + one principal)", flag: "green", source: "DDQ" },
        { label: "Property-Level Accounts", value: "Signed by Cordova on all SPV bank accounts", flag: "green", source: "DDQ" },
      ]},
    ],
  },
  6: {
    name: "Investment Operations & Portfolio Controls", rating: "YELLOW",
    summary: "3-person Investment Committee with majority vote approval. Strong acquisition diligence including QofE and Phase I/II environmental. Asset-level financing 60–70% LTV — within strategy norms but moderate. Quarterly portfolio reviews. Operating partner KPIs tracked but reporting cadence varies by partner. Concentration in two Texas metros (Dallas, Houston) at 41% of NAV.",
    findings: `### Investment Committee & Approval

The Investment Committee has three voting members: Carlos Mendoza (CIO), Stephanie Vance (Head of Asset Management), and Daniel Park (CFO). Approval requires majority (2 of 3) consent. Alpine notes that with a 3-person committee, two members must agree — and one of those two would invariably be Carlos given his ownership stake, making the effective threshold a "Carlos plus one" approval. This is acceptable for a firm of Cordova's size but limits the diversity of perspective on investment decisions.

### Acquisition Diligence

Cordova's acquisition process includes: site visits by acquisitions and asset management teams, Phase I environmental site assessment (with Phase II as needed), property condition assessment, third-party appraisal, market study, and tenant-base analysis. Quality of Earnings reports are commissioned for any asset over $50 million in gross purchase price. For acquisitions below this threshold, the financial diligence is performed by Cordova's acquisitions team using the seller's historical financial statements verified against the operating partner's market knowledge.

### Asset-Level Financing

Each acquisition is financed with asset-level non-recourse debt at 60–70% loan-to-value, sourced primarily from agency lenders (Fannie Mae, Freddie Mac) for stabilized assets and bridge lenders for value-add transitions. Aggregate fund-level leverage as of December 31, 2025 (across deployed capital) is 64% LTV. Bridge debt is refinanced to agency debt upon stabilization (typically 18–30 months post-acquisition). Alpine notes that the bridge-to-agency refinancing model introduces refinancing risk if credit conditions tighten — this risk is partially mitigated by Cordova's strong agency lender relationships.

### Concentration

As of December 31, 2025, the portfolio shows geographic concentration in Texas (41% of NAV across Dallas and Houston metros combined). The single-market cap is 35%; Cordova represents this is measured at MSA level and Dallas (~24%) and Houston (~17%) are separate MSAs. Alpine notes the concentration is within contractual limits but warrants monitoring.

### Operating Partner Oversight

Operating partners report property-level performance to Cordova monthly via Yardi or proprietary systems, supplemented by quarterly in-person property management meetings. Cordova's asset management team tracks 14 KPIs per property (occupancy, rent roll, renewals, capex spend vs. budget, NOI vs. proforma, etc.). Reporting cadence and format vary by operating partner — Cordova has indicated standardization is in progress for Fund III.

### Chapter Summary

The chapter is rated YELLOW due to: (1) IC vote dynamics ("Carlos plus one"); (2) bridge-to-agency refinancing risk in the value-add model; (3) Texas/Dallas-Houston geographic concentration approaching contractual limits; and (4) operating partner reporting cadence not yet standardized.`,
    docCategories: ["Investment Ops"], riskObsIds: ["CO-009", "CO-010", "CO-011"],
    verificationCategory: "investment_ops",
    dataPoints: [
      { group: "Investment Committee", items: [
        { label: "Voting Members", value: "3 (Mendoza CIO, Vance, Park)", source: "DDQ" },
        { label: "Approval Threshold", value: "Majority (2 of 3)", flag: "yellow", source: "DDQ" },
        { label: "Meeting Cadence", value: "Weekly for active opportunities; ad-hoc for time-sensitive deals", source: "DDQ" },
      ]},
      { group: "Acquisition Diligence", items: [
        { label: "Site Visits", value: "Required by both acquisitions and asset management teams", flag: "green", source: "DDQ" },
        { label: "Environmental", value: "Phase I mandatory; Phase II as flagged", flag: "green", source: "DDQ" },
        { label: "Quality of Earnings", value: "Mandatory for acquisitions > $50M gross PP", flag: "yellow", source: "DDQ" },
        { label: "Third-Party Appraisal", value: "Required for all acquisitions", flag: "green", source: "DDQ" },
      ]},
      { group: "Asset-Level Financing", items: [
        { label: "LTV Range", value: "60–70% per asset; aggregate fund LTV 64% (12/31/2025)", flag: "yellow", source: "DDQ" },
        { label: "Lender Mix", value: "Agency (Fannie/Freddie) for stabilized; bridge for value-add transition", source: "DDQ" },
        { label: "Refinance Window", value: "Bridge typically refinanced to agency 18–30 months post-acquisition", flag: "yellow", source: "DDQ" },
      ]},
      { group: "Concentration & Monitoring", items: [
        { label: "Texas Concentration", value: "41% of NAV (Dallas 24% + Houston 17% — separate MSAs)", flag: "yellow", source: "DDQ" },
        { label: "Single-Market Cap", value: "35% (measured at MSA level per LPA)", source: "LPA" },
        { label: "KPI Tracking", value: "14 KPIs per property; reviewed quarterly", flag: "green", source: "DDQ" },
        { label: "Operating Partner Reporting Standardization", value: "In progress for Fund III", flag: "yellow", source: "DDQ" },
      ]},
    ],
  },
  7: {
    name: "Valuation, Asset Existence & Investor Reporting", rating: "YELLOW",
    summary: "Quarterly internal valuations using DCF, sales comparable, and replacement cost approaches. Independent annual third-party appraisal by Cushman & Wakefield. Valuation Committee includes 2 non-investment members. Quarterly investor reports timely. Concern: third-party appraisal annual rather than semi-annual on a value-add strategy with active renovations.",
    findings: `### Valuation Process

Cordova values its multifamily portfolio quarterly under ASC 820 fair-value framework. Each asset is valued using three approaches: (1) discounted cash flow with strategy-specific projection assumptions, (2) sales comparable approach using recent transaction data, and (3) replacement cost. The DCF approach typically receives 60–70% weighting. Cordova's asset management team prepares draft valuations which are reviewed and finalized by the Valuation Committee.

### Valuation Committee

The Valuation Committee comprises five members: Stephanie Vance (Head of Asset Management, Chair), Carlos Mendoza (CIO), Daniel Park (CFO), and two non-investment members — Apex Compliance Advisors representative and SS&C senior representative. Non-investment members hold 2 of 5 seats — below the 50%+ Alpine prefers but a meaningful improvement over all-investment composition.

### Third-Party Valuation

Cushman & Wakefield provides independent annual appraisals on all properties. Alpine notes that for a value-add strategy with active renovation programs and rapidly changing property NOI, semi-annual or quarterly appraisals would provide stronger independent oversight. Cordova has indicated semi-annual cadence is under consideration for Fund III. Stabilized assets typically have less valuation volatility, so the annual cadence is more defensible for those positions.

### Investor Reporting

Quarterly investor reports are delivered within 60 days of quarter-end. Reports include portfolio-level NAV summary, asset-level NOI commentary, debt summary, capex spend vs. budget, and capital activity. Audited annual financials are delivered within 100 days of fiscal year-end. Reporting is generated through Juniper Square.

### Waterfall

Carry waterfall is calculated by SS&C through their proprietary system, reviewed by Daniel Park. This is a strength relative to peer funds that maintain waterfall calculations in Excel.

### Chapter Summary

The chapter is rated YELLOW due to: (1) annual rather than semi-annual third-party appraisal cadence on a value-add strategy; (2) Valuation Committee composition with non-investment members at 2 of 5 (below 50%); and (3) Cordova serving as primary valuation agent of record with C&W providing annual review.`,
    docCategories: ["Valuation"], riskObsIds: ["CO-012", "CO-013"],
    verificationCategory: "valuation",
    dataPoints: [
      { group: "Valuation Process", items: [
        { label: "Framework", value: "Quarterly ASC 820 fair-value; DCF / sales comp / replacement cost methods", source: "Valuation Policy" },
        { label: "Valuation Committee Composition", value: "5 members; 2 non-investment (Apex + SS&C)", flag: "yellow", source: "Valuation Policy" },
        { label: "Approval Threshold", value: "Majority vote of Valuation Committee", source: "Valuation Policy" },
        { label: "Valuation Agent of Record", value: "Cordova Capital Partners (in-house)", flag: "yellow", source: "Valuation Policy" },
      ]},
      { group: "Third-Party Review", items: [
        { label: "Independent Appraiser", value: "Cushman & Wakefield", flag: "green", source: "DDQ" },
        { label: "Appraisal Cadence", value: "Annual — semi-annual under consideration for Fund III", flag: "yellow", source: "DDQ" },
      ]},
      { group: "Investor Reporting", items: [
        { label: "Quarterly Reports", value: "Delivered within 60 days of quarter-end via Juniper Square", flag: "green", source: "DDQ" },
        { label: "Audited Financial Statements", value: "Delivered within 100 days of fiscal year-end", flag: "green", source: "DDQ" },
        { label: "Asset-Level NOI Commentary", value: "Included in quarterly reports", flag: "green", source: "DDQ" },
      ]},
      { group: "Waterfall & Cash", items: [
        { label: "Waterfall Calculation", value: "SS&C proprietary system (not Excel-based)", flag: "green", source: "DDQ" },
        { label: "Waterfall Review", value: "Daniel Park (CFO)", source: "DDQ" },
      ]},
    ],
  },
  8: {
    name: "Manager Transparency & LP Communications", rating: "GREEN",
    summary: "Open diligence posture with prompt responses and thorough documentation. Quarterly investor letters with asset-level commentary. Annual investor day in Dallas. Disclosed Houston litigation proactively. LPAC standing quorum strong. Side letter scope reasonable. No material LP complaints.",
    findings: `### Diligence Engagement

Cordova's response to Alpine's diligence requests was prompt, thorough, and supported by a structured data room organized by chapter. The Manager voluntarily disclosed the Houston tenant class action against the SPV/operator (Cordova not named as a defendant) at the outset of diligence without prompting. All three principals were made available for interviews, plus the asset management team lead and operating partner contacts.

### Investor Communications

Cordova produces quarterly investor letters within 60 days of each quarter-end. Letters are approximately 16–20 pages including asset-level NOI commentary on all properties, debt summary, capex spend tracking against business plan, and a market outlook. Reports are signed by Carlos Mendoza (CIO).

The firm hosts an annual investor day each spring in Dallas. The 2025 investor day was attended by approximately 60% of LPs by capital and included property tours of three Cordova-owned assets in the Dallas metro area. Operating partner principals from two of Cordova's largest JV partnerships presented at the event.

### LPAC

The LPAC has 7 seats. Meetings are held twice annually in person (typically June and December). Standing LPAC quorum across the past three years has been 87% — strong, though below Granite's 90%+ benchmark. The LPAC reviews quarterly valuation summaries, leverage utilization, concentration metrics, and conflicts requiring LPAC consent.

### Side Letters

Side letter scope is reasonable: most letters address regulatory disclosures, ERISA/UBTI exclusions, fee step-downs for commitments above $25M, and MFN rights. SS&C administers MFN with all eligible LPs notified of new side letter terms.

### Chapter Summary

The chapter is rated GREEN. Cordova's transparency posture is constructive with proactive disclosure of the Houston litigation, structured investor reporting, and an established annual investor day. No material LP complaints have been raised.`,
    docCategories: ["Transparency"], riskObsIds: [],
    verificationCategory: "transparency",
    dataPoints: [
      { group: "Diligence Engagement", items: [
        { label: "Document Availability", value: "Structured data room; all requested materials provided", flag: "green", source: "DDQ" },
        { label: "Executive Access", value: "All 3 principals + asset mgmt lead + operating partner contacts", flag: "green", source: "DDQ" },
        { label: "Voluntary Disclosures", value: "Self-disclosed Houston tenant class action against SPV/operator", flag: "green", source: "DDQ" },
      ]},
      { group: "Investor Reporting", items: [
        { label: "Quarterly Letter", value: "Within 60 days; 16–20 pages with asset-level NOI commentary", flag: "green", source: "Q4 2025 Letter" },
        { label: "Annual Investor Day", value: "Each spring in Dallas; ~60% LP attendance by capital", flag: "green", source: "DDQ" },
        { label: "Property Tours", value: "Included in 2025 investor day", source: "DDQ" },
      ]},
      { group: "LPAC", items: [
        { label: "Composition", value: "7 seats", source: "LPA" },
        { label: "Meeting Cadence", value: "Twice annually in person (June + December)", source: "LPA" },
        { label: "Standing Quorum (3 yrs)", value: "87%", flag: "green", source: "DDQ" },
      ]},
    ],
  },
};

// ── Source metadata for the document panel ────────────────────────────────────

export const CORDOVA_SOURCE_META: Record<string, { label: string; type: string; filename?: string; size?: string }> = {
  "sample_re_cordova_jv.pdf": { label: "Cordova JV III — ODD Report (April 2026)", type: "ODD Report", filename: "sample_re_cordova_jv.pdf", size: "1.0 MB" },
  "DDQ": { label: "Due Diligence Questionnaire (2026)", type: "Fund Document", filename: "cordova_ddq_2026.pdf" },
  "Form ADV": { label: "Form ADV (ERA) — March 2026", type: "Regulatory Filing" },
  "LPA": { label: "Limited Partnership Agreement — Fund III", type: "Fund Document" },
  "PPM": { label: "Private Placement Memorandum — Fund III", type: "Fund Document" },
  "Valuation Policy": { label: "Valuation Policy (October 2024)", type: "Operations Document" },
  "Code of Ethics": { label: "Code of Ethics (October 2024)", type: "Compliance Document" },
  "WISP": { label: "Written Information Security Program (2024)", type: "Compliance Document" },
  "Admin Agreement": { label: "Administration Agreement — SS&C ALPS", type: "Service Provider Agreement" },
  "Audit Letter": { label: "KPMG — Audit Confirmation", type: "Third-Party Confirmation" },
  "Insurance Cert": { label: "Cyber Liability Insurance Certificate", type: "Insurance" },
  "Q4 2025 Letter": { label: "Q4 2025 Investor Letter", type: "Investor Communication" },
  "SEC_EDGAR": { label: "SEC EDGAR — ERA Filing Search", type: "SEC Verification" },
  "Texas SoS": { label: "Texas Secretary of State Registry", type: "SEC Verification" },
};

// ── Mock fund-level data ──────────────────────────────────────────────────────

export const CORDOVA_MOCK = {
  fund: {
    name: "Cordova JV Real Estate Fund III, L.P.",
    manager: "Cordova Capital Partners, LLC",
    strategy: "Value-Add Multifamily — Sun Belt JV Equity",
    aum: "$1.10B firmwide (excl. $370M uncalled)",
    overall_rating: "YELLOW",
    odd_score: 70,
    odd_percentile: "54th",
    domicile: "Delaware LP (Cayman feeder)",
    fund_nav: "$520M raised; ~28% deployed",
    recommendation_summary: "recommends a <b>watchlist</b> rating. Cordova has produced strong realized returns across two prior vintages and operates a thoughtful JV sponsor model in the Sun Belt multifamily strategy. Four YELLOW chapters reflect emerging-manager governance characteristics (concentrated ownership, CFO/CCO role combination, cyber program maturity, valuation cadence).",
    conditions_summary: "Post-close monitoring: confirm Q3 2026 RIA transition; track operating partner reporting standardization; monitor Texas geographic concentration vs. 35% MSA cap.",
  },
  risk_observations: [
    { id: "CO-001", severity: "MEDIUM", topic: "Manager, Ownership & Governance", title: "Concentrated ownership in single principal with no formal succession plan",
      detail: "Carlos Mendoza owns 60% of Cordova and holds the Managing Principal and CIO roles. No formal written succession plan exists. Key person insurance is limited to Carlos at $10M.",
      remediation: "Formalize written succession plan; consider extending key person insurance to Stephanie Vance and Daniel Park." },
    { id: "CO-002", severity: "LOW", topic: "Manager, Ownership & Governance", title: "Background checks performed internally",
      detail: "Background checks on new hires are performed by Carlos Mendoza personally rather than by a third-party vendor. No refresh checks are performed.",
      remediation: "Engage an external background check vendor (e.g., First Advantage) for initial and periodic refresh checks." },
    { id: "CO-003", severity: "LOW", topic: "Manager, Ownership & Governance", title: "Carry restricted to three principals",
      detail: "Carried interest is shared only among the three principals (Mendoza, Vance, Park). Other senior staff in acquisitions and asset management do not participate in carry.",
      remediation: "Consider expanding carry participation to senior staff in Fund IV to support retention and alignment." },
    { id: "CO-004", severity: "MEDIUM", topic: "Legal, Regulatory & Compliance", title: "CFO and CCO roles combined in single individual",
      detail: "Daniel Park serves as both Chief Financial Officer and Chief Compliance Officer. This combination creates segregation of duties concerns as Cordova approaches the threshold for full RIA registration.",
      remediation: "Appoint a dedicated Chief Compliance Officer independent of finance and investment functions prior to full RIA registration." },
    { id: "CO-005", severity: "MEDIUM", topic: "Legal, Regulatory & Compliance", title: "Personal trading policy gaps",
      detail: "Pre-clearance is limited to securities on a (currently empty) restricted list. No minimum holding period applies. Brokerage statements are collected via employee self-reporting rather than custodian-direct.",
      remediation: "Expand pre-clearance scope to all reportable securities, implement a minimum holding period (30+ days), and transition to custodian-direct statement collection." },
    { id: "CO-006", severity: "MEDIUM", topic: "Legal, Regulatory & Compliance", title: "Indirect litigation exposure — Houston JV II property",
      detail: "A Cordova JV II asset in Houston is subject to a residential tenant class action alleging deferred-maintenance habitability issues. The litigation names the asset-level SPV and operating partner but not Cordova directly. Alpine notes the reputational exposure.",
      remediation: "Monitor litigation developments; require quarterly LPAC update on the matter; reaffirm operating partner property management standards." },
    { id: "CO-007", severity: "MEDIUM", topic: "Technology, Cybersecurity & Business Resilience", title: "No SOC 2 audit",
      detail: "Cordova has not commissioned a SOC 2 Type II audit. Annual external penetration testing has been performed only once (November 2024); annual cadence is not yet evidenced.",
      remediation: "Commission a SOC 2 Type II audit by end of 2026; establish recurring annual penetration testing schedule." },
    { id: "CO-008", severity: "LOW", topic: "Technology, Cybersecurity & Business Resilience", title: "Cyber liability insurance below institutional benchmark",
      detail: "Cyber liability insurance limit is $5M per occurrence / $5M aggregate. Institutional benchmarks for managers at Cordova's $1.1B AUM scale typically range from $10M to $25M.",
      remediation: "Increase cyber liability insurance limit to at least $10M per occurrence by next renewal." },
    { id: "CO-009", severity: "MEDIUM", topic: "Investment Operations & Portfolio Controls", title: "Investment Committee approval threshold concentrates power in Managing Principal",
      detail: "The 3-person IC requires majority (2 of 3) approval. Given Carlos Mendoza's 60% ownership and dual Managing Principal / CIO role, the effective approval threshold is 'Carlos plus one'.",
      remediation: "Consider expanding Investment Committee to 5 members with majority (3 of 5) approval threshold." },
    { id: "CO-010", severity: "MEDIUM", topic: "Investment Operations & Portfolio Controls", title: "Bridge-to-agency refinancing risk in value-add model",
      detail: "Cordova's value-add multifamily strategy relies on bridge financing during the renovation/stabilization period (typically 18–30 months), with refinancing to agency debt upon stabilization. Tightening credit conditions could disrupt the refinancing pipeline.",
      remediation: "Maintain conservative LTV at acquisition; build cushion for extended bridge tenor; monitor agency lender capacity quarterly." },
    { id: "CO-011", severity: "MEDIUM", topic: "Investment Operations & Portfolio Controls", title: "Texas geographic concentration approaching contractual limits",
      detail: "Dallas and Houston metros combined represent 41% of NAV. The LPA's 35% single-market cap is measured at MSA level (Dallas 24% + Houston 17% are separate MSAs), but the combined Texas exposure warrants monitoring.",
      remediation: "Consider voluntarily capping aggregate Texas exposure at 50% even if MSAs are technically separate." },
    { id: "CO-012", severity: "MEDIUM", topic: "Valuation, Asset Existence & Investor Reporting", title: "Annual third-party appraisal cadence on value-add strategy",
      detail: "Cushman & Wakefield provides annual independent appraisals. For a value-add strategy with active renovation programs and rapidly changing NOI, semi-annual or quarterly appraisals would provide stronger independent oversight, particularly during the early hold period.",
      remediation: "Move to semi-annual third-party appraisals for assets in active renovation periods; retain annual cadence for stabilized assets." },
    { id: "CO-013", severity: "LOW", topic: "Valuation, Asset Existence & Investor Reporting", title: "Valuation Committee non-investment majority not achieved",
      detail: "The 5-person Valuation Committee includes only 2 non-investment members (Apex and SS&C representatives) — below the 3+ non-investment composition Alpine prefers.",
      remediation: "Add a third non-investment member to the Valuation Committee — could be an external real estate consultant." },
  ],
  strengths: [
    { title: "Strong realized track record in Sun Belt multifamily",
      detail: "Cordova JV I delivered an 18.4% gross IRR and 1.92x MOIC across 14 fully realized investments. Cordova JV II is tracking 16.1% gross IRR on a 70%-realized basis. Realized returns place Cordova in the top quartile of value-add multifamily peers per Cliffwater RE Index data." },
    { title: "Robust Operating Partner Diligence framework",
      detail: "Cordova's written Operating Partner Diligence Policy requires financial review, 5 LP references, 3 lender references, site visits, property management system review, and First Advantage background checks. Annual re-certification is required of all active operating partners — a thoughtful framework for the JV sponsor model." },
    { title: "Conservative asset-level leverage and dual-approval wire controls",
      detail: "Aggregate fund-level leverage of 64% LTV is in the conservative range for value-add multifamily. Wire transfers require dual approval (CFO + one principal), and Cordova maintains signing authority on all property-level SPV bank accounts." },
    { title: "Proactive diligence disclosure",
      detail: "Cordova voluntarily disclosed the Houston tenant class action against the JV II SPV/operator (Cordova not named) at the outset of diligence, before being asked. This reflects constructively on management transparency culture." },
  ],
};

// ── Collection / source documents (used by getReferencedDocs) ────────────────

export const CORDOVA_COLLECTION_DOCS: Array<{ name: string; type: string; filename: string }> = [
  { name: "Cordova JV III — ODD Report (April 2026)",     type: "ODD Report",            filename: "sample_re_cordova_jv.pdf" },
  { name: "Form ADV (ERA) — March 2026",                   type: "Regulatory Filing",     filename: "cordova_form_adv.pdf" },
  { name: "Joint Venture Agreement template — Fund III",   type: "Fund Document",         filename: "cordova_jv_agreement.pdf" },
  { name: "Private Placement Memorandum — Fund III",       type: "Fund Document",         filename: "cordova_ppm.pdf" },
  { name: "Due Diligence Questionnaire (2026)",            type: "Fund Document",         filename: "cordova_ddq_2026.pdf" },
  { name: "Valuation Policy (October 2024)",               type: "Operations Document",   filename: "cordova_valuation_policy.pdf" },
  { name: "Compliance Manual (October 2024)",              type: "Compliance Document",   filename: "cordova_compliance_manual.pdf" },
  { name: "Audited Financial Statements FY2024",           type: "Financial Document",    filename: "cordova_audited_fs_fy2024.pdf" },
];
