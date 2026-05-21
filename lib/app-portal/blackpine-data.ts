/**
 * Blackpine Credit Plus IV, L.P. — static demo data for the Investor Portal report reader.
 *
 * ODD review of Blackpine Credit Plus IV, L.P. (Opportunistic / Stressed Corporate Credit)
 * Manager: Blackpine Asset Management, LLC
 * Overall rating: YELLOW (28 flags, 1 RED chapter, 3 YELLOW chapters)
 */

import type { TopicInfo, TopicDataGroup } from "./ridgeline-data";

export type { TopicInfo, TopicDataGroup };

// ── 8-Topic ODD assessment data (Blackpine Credit Plus IV) ────────────────────

export const BLACKPINE_TOPIC_DATA: Record<number, TopicInfo> = {
  1: {
    name: "Manager, Ownership & Governance", rating: "YELLOW",
    summary: "Boutique opportunistic credit manager founded in 2017. 18 FTEs centered around founder/CIO Martin Lin. Concentrated ownership (Lin holds 72%). Single portfolio manager structure — Lin makes all final investment decisions. No formal succession plan. GP 2% commitment funded in cash.",
    findings: `### Management Company and Affiliates

Blackpine Asset Management, LLC ("Blackpine" or the "Manager") was founded in 2017 by Martin Lin (Founder, Chief Investment Officer, and Portfolio Manager), formerly Co-Head of Special Situations at Goldwater Credit Partners and prior to that Vice President at Apollo Global Management's Distressed Credit group. Blackpine is headquartered in New York with a small research outpost in London. The firm focuses on opportunistic and stressed/distressed corporate credit, primarily in North American and European leveraged loan and high-yield markets.

### Strategy & Fund Series

Blackpine's strategy spans the full opportunistic credit spectrum: stressed loans and bonds trading at discounts to par due to fundamental or technical pressures, true distressed (Chapter 11 / restructuring) positions, and selective rescue financings. The firm has raised four funds in the Blackpine Credit Plus series: Fund I (2018, $90M, fully realized), Fund II (2020, $185M, fully invested, 70% realized), Fund III (2022, $310M, ~85% deployed), and Fund IV (current, $400M target, $260M raised through December 2025).

### Assets under Management

Blackpine reported firmwide net assets of $850 million as of December 31, 2025, with $215 million in uncalled capital. The firm also manages two separate accounts ($175 million combined) on similar strategies for two large institutional clients.

### Ownership & Succession

Martin Lin owns 72% of Blackpine. Alexandra Reyes (Head of Research, joined 2018) holds 15%, Daniel Foster (Chief Operating Officer, joined 2019) holds 8%, and the remaining 5% is reserved for future grant. Alpine notes the high concentration of ownership in Lin. The firm has no formal written succession plan; the LPA's key person provision is triggered if Martin Lin ceases to dedicate substantially all of his time to Blackpine. Key person life insurance of $15 million is in place on Lin only.

### Human Resources

Blackpine employs 18 full-time professionals: 8 investment (research analysts and traders), 1 portfolio manager (Lin), 4 operations and finance, 2 compliance and legal, 2 investor relations and capital formation, and 1 administrative. The investment team has averaged 11 years of credit experience. Recent senior departures: Robert Chen (Senior Analyst) left in March 2025 to launch his own credit fund; David Marshall (Senior Analyst) left in October 2025 to join a strategic.

Background checks are performed by HireRight on initial hire; no recurring refresh. Staff are compensated with base salary and discretionary bonus; carried interest is shared among the four senior professionals (Lin, Reyes, Foster, and Sarah Klein who heads Capital Formation).

### Chapter Summary

The chapter is rated YELLOW due to: (1) concentrated ownership in single founder (72% Lin); (2) no formal succession plan; (3) two senior departures within nine months in 2025; and (4) carry restricted to four professionals only.`,
    docCategories: ["Governance"], riskObsIds: ["BO-001", "BO-002", "BO-003"],
    verificationCategory: "governance",
    dataPoints: [
      { group: "Management Company", items: [
        { label: "Manager Name", value: "Blackpine Asset Management, LLC", source: "Form ADV" },
        { label: "Date of Formation", value: "September 8, 2017", source: "Delaware Register" },
        { label: "Primary Location", value: "New York, NY (HQ); London (research outpost)", source: "Form ADV" },
        { label: "Total Headcount", value: "18 FTEs (8 research/trading, 1 PM, 4 ops, 2 compliance, 2 IR, 1 admin)", source: "DDQ" },
        { label: "AUM (Net Assets, 12/31/2025)", value: "$850M (Blackpine funds) + $175M (separate accounts) = $1.025B total", source: "Form ADV" },
        { label: "Uncalled Capital", value: "$215 million", source: "DDQ" },
      ]},
      { group: "Senior Personnel", items: [
        { label: "Founder / CIO / Portfolio Manager", value: "Martin Lin — 72% owner; former Goldwater Co-Head Special Situations, ex-Apollo Distressed", flag: "yellow", source: "Form ADV" },
        { label: "Head of Research", value: "Alexandra Reyes — 15% owner; joined 2018; former Director, Centerbridge", source: "Form ADV" },
        { label: "Chief Operating Officer", value: "Daniel Foster — 8% owner; joined 2019; former Anchorage Capital", source: "Form ADV" },
        { label: "Head of Capital Formation", value: "Sarah Klein — joined 2020; former Sixth Street IR", source: "DDQ" },
      ]},
      { group: "Governance & Ownership", items: [
        { label: "Ownership", value: "Lin 72%, Reyes 15%, Foster 8%, Reserved 5%", flag: "yellow", source: "Form ADV" },
        { label: "GP Commitment (Fund IV)", value: "2.0% in cash (~$8M at target); pari passu", flag: "green", source: "LPA" },
        { label: "Succession Plan", value: "Not formalized in writing", flag: "yellow", source: "DDQ" },
        { label: "Key Person Insurance", value: "$15M on Martin Lin only", flag: "yellow", source: "DDQ" },
        { label: "Background Checks", value: "External (HireRight) on initial hire; no recurring refresh", flag: "yellow", source: "DDQ" },
      ]},
      { group: "Recent Turnover", items: [
        { label: "Robert Chen", value: "Senior Analyst — departed March 2025 to launch own credit fund (amicable)", flag: "yellow", source: "DDQ" },
        { label: "David Marshall", value: "Senior Analyst — departed October 2025 to join strategic", flag: "yellow", source: "DDQ" },
      ]},
      { group: "Fund Series Track Record", items: [
        { label: "Blackpine Credit Plus I (2018)", value: "$90M — fully realized; 19.3% gross IRR / 1.74x MOIC", source: "DDQ" },
        { label: "Blackpine Credit Plus II (2020)", value: "$185M — fully invested; ~70% realized; 17.8% gross IRR (interim)", source: "DDQ" },
        { label: "Blackpine Credit Plus III (2022)", value: "$310M — ~85% deployed; 14.6% gross IRR (interim)", source: "DDQ" },
        { label: "Blackpine Credit Plus IV (current)", value: "$400M target; $260M raised through 12/2025", source: "DDQ" },
      ]},
    ],
  },
  2: {
    name: "Legal, Regulatory & Compliance", rating: "YELLOW",
    summary: "SEC-registered investment adviser since 2019. Daniel Foster (COO) also serves as Chief Compliance Officer — segregation of duties concern. Engaged Apex Compliance Advisors as outside consultant since inception. Robust personal trading controls. Most recent SEC exam (Q1 2024) closed with deficiency letter on books-and-records retention.",
    findings: `### Regulatory Status

Blackpine Asset Management, LLC is a U.S. Securities and Exchange Commission ("SEC") registered investment adviser (IARD/CRD 304882) since 2019, having registered as AUM crossed the RIA threshold. The firm is also subject to UK FCA regulation via its London research outpost. The firm maintains a Form PF filing obligation as a large hedge fund adviser.

### Compliance Program

Daniel Foster (COO) serves as Chief Compliance Officer in addition to his operational responsibilities. Alpine notes that this combined role is a meaningful segregation of duties concern given Blackpine's strategy involves continuous valuation of illiquid positions, where compliance independence from operations is especially important. The firm has engaged Apex Compliance Advisors LLC as outside compliance consultant since inception, which provides some independent oversight.

Apex performs an annual compliance review and supports Daniel with regulatory filings, code of ethics enforcement, and policy updates. The compliance manual was last revised in February 2026.

### Code of Ethics & Personal Trading

The Code of Ethics requires pre-clearance for all securities transactions other than open-end mutual funds, US Treasuries, and certain ETFs. Brokerage statements are collected directly from custodians by Apex. A 30-day minimum holding period applies to all preclearable securities. Annual attestations are completed by all employees.

Personal trading controls are robust — meaningfully stronger than the firm's compliance staffing alone would suggest, owing largely to Apex's role.

### Regulatory History

The most recent SEC examination was conducted in Q1 2024 and closed with a deficiency letter citing books-and-records retention deficiencies — specifically, certain email communications were not retained in compliance with Rule 204-2 retention periods. Blackpine remediated the deficiency by implementing Smarsh email archiving across all employees and producing evidence of remediation; the SEC closed the matter in Q3 2024 without enforcement action.

The firm has no other regulatory actions, customer complaints, or material litigation.

### Chapter Summary

The chapter is rated YELLOW due to: (1) the COO/CCO combined role; (2) the 2024 SEC deficiency letter (now remediated but reflects a control gap that existed in the regulatory record); and (3) the absence of a dedicated, full-time compliance professional given the strategy's illiquid valuation complexity.`,
    docCategories: ["Compliance"], riskObsIds: ["BO-004", "BO-005"],
    verificationCategory: "compliance",
    dataPoints: [
      { group: "Regulatory Status", items: [
        { label: "SEC Registration", value: "RIA since 2019 (IARD/CRD 304882)", flag: "green", source: "SEC_EDGAR" },
        { label: "UK Regulatory Status", value: "FCA-registered London entity for research outpost", source: "DDQ" },
        { label: "Form PF Filer", value: "Yes (large hedge fund adviser)", source: "DDQ" },
      ]},
      { group: "Compliance Team", items: [
        { label: "Chief Compliance Officer", value: "Daniel Foster (COO) — combined role", flag: "yellow", source: "DDQ" },
        { label: "Dedicated Compliance FTE", value: "None — supported by Apex consultant + 1 in-house junior", flag: "yellow", source: "DDQ" },
        { label: "Outside Compliance Consultant", value: "Apex Compliance Advisors LLC (since 2017)", flag: "green", source: "DDQ" },
        { label: "Annual Compliance Review", value: "Performed by Apex; most recent December 2025", flag: "green", source: "DDQ" },
        { label: "Compliance Manual Currency", value: "Revised February 2026", flag: "green", source: "DDQ" },
      ]},
      { group: "Personal Trading Controls", items: [
        { label: "Pre-Clearance", value: "All preclearable securities", flag: "green", source: "Code of Ethics" },
        { label: "Brokerage Statements", value: "Custodian-direct collection via Apex", flag: "green", source: "DDQ" },
        { label: "Minimum Holding Period", value: "30 days", flag: "green", source: "Code of Ethics" },
        { label: "Annual Attestation", value: "Required of all employees", flag: "green", source: "DDQ" },
      ]},
      { group: "Regulatory History", items: [
        { label: "SEC Examination — Q1 2024", value: "Deficiency letter (books-and-records retention); remediated; closed Q3 2024", flag: "yellow", source: "SEC Letter" },
        { label: "Remediation", value: "Smarsh email archiving deployed firmwide; evidence provided", flag: "green", source: "DDQ" },
        { label: "Material Litigation", value: "None", flag: "green", source: "DDQ" },
        { label: "Customer Complaints", value: "None", flag: "green", source: "Form ADV" },
      ]},
    ],
  },
  3: {
    name: "Technology, Cybersecurity & Business Resilience", rating: "YELLOW",
    summary: "Microsoft 365 + Bloomberg Terminal for research. Engaged Vantage Tech as outsourced IT in 2020. No SOC 2 audit. Annual penetration testing established (Mandiant since 2023). Smarsh email archiving (deployed post-SEC remediation). BCP tested annually via tabletop. Cyber insurance $10M.",
    findings: `### Infrastructure

Blackpine operates on a Microsoft 365 productivity stack with Bloomberg Terminal as the primary research and trading platform. Trading and position management uses Eze Castle Software, with TraderEx as the order management system. Single sign-on through Microsoft Entra ID with mandatory MFA. CrowdStrike Falcon provides endpoint protection across all devices.

### Cybersecurity Program

Vantage Tech LLC has served as Blackpine's outsourced IT and cybersecurity provider since 2020. Vantage provides patch management, endpoint monitoring, identity management, and incident response support.

Blackpine has not commissioned a SOC 2 audit. The firm has indicated this is on the 2026 roadmap. Annual penetration testing has been conducted by Mandiant since 2023; the most recent test (October 2025) identified 4 medium-severity findings — all remediated within 60 days, confirmed by Mandiant retest.

Smarsh email archiving and supervision was deployed firmwide in 2024 as part of the SEC remediation, covering email, instant messaging, and chat. KnowBe4 phishing simulations run monthly through Vantage; rolling 12-month click rate is 2.9%, in line with the 3.2% financial services benchmark.

### Resilience

Blackpine maintains a Written Information Security Program (WISP), Incident Response Plan (IRP), and Business Continuity Plan (BCP). The BCP is tested annually via tabletop exercise (most recent: September 2025). The firm has not experienced any material cybersecurity incidents or data breaches.

### Insurance

Cyber liability insurance limit is $10 million per occurrence / $10 million aggregate — adequate for the firm's size.

### Chapter Summary

The chapter is rated YELLOW solely due to the absence of a SOC 2 audit — the firm's other technology and resilience controls are reasonable for its scale. Alpine recommends commissioning SOC 2 Type II by end of 2026.`,
    docCategories: ["Technology"], riskObsIds: ["BO-006"],
    verificationCategory: "cybersecurity",
    dataPoints: [
      { group: "Infrastructure", items: [
        { label: "Productivity Platform", value: "Microsoft 365", source: "DDQ" },
        { label: "Research Platform", value: "Bloomberg Terminal", source: "DDQ" },
        { label: "Trading / OMS", value: "Eze Castle Software + TraderEx", source: "DDQ" },
        { label: "Identity & Access", value: "Microsoft Entra ID SSO + mandatory MFA", flag: "green", source: "DDQ" },
        { label: "Endpoint Protection", value: "CrowdStrike Falcon", flag: "green", source: "DDQ" },
      ]},
      { group: "Cybersecurity Program", items: [
        { label: "Outsourced IT/Cyber", value: "Vantage Tech LLC (since 2020)", flag: "green", source: "DDQ" },
        { label: "SOC 2 Audit", value: "Not yet commissioned; planned 2026", flag: "yellow", source: "DDQ" },
        { label: "External Penetration Testing", value: "Annual by Mandiant since 2023; 2025 — 4 medium findings, all remediated", flag: "green", source: "DDQ" },
        { label: "Communication Archiving", value: "Smarsh firmwide (deployed 2024)", flag: "green", source: "DDQ" },
        { label: "Phishing Simulation", value: "Monthly via KnowBe4; rolling 12-mo click rate 2.9%", flag: "green", source: "DDQ" },
      ]},
      { group: "Resilience & Insurance", items: [
        { label: "WISP / IRP / BCP", value: "Maintained, reviewed annually", flag: "green", source: "WISP" },
        { label: "Annual Tabletop Exercise", value: "September 2025", flag: "green", source: "DDQ" },
        { label: "Incidents in Past 5 Years", value: "None material", flag: "green", source: "DDQ" },
        { label: "Cyber Liability Insurance", value: "$10M per occurrence / $10M aggregate", flag: "green", source: "Insurance Cert" },
      ]},
    ],
  },
  4: {
    name: "Fund Structure, Terms & Investor Alignment", rating: "GREEN",
    summary: "Delaware LP + Cayman feeder. 1.75% management fee on commitments (investment period), then 1.50% on NAV. 20% carry over 8% preferred return with 50/50 catch-up. 6-year term + two 1-yr extensions. Whole-of-fund carry. Standard LP protections. GP 2% cash commitment.",
    findings: `### Fund Structure

Blackpine Credit Plus IV, L.P. is structured as a Delaware limited partnership with a Cayman master-feeder structure for non-US and US tax-exempt investors. The fund invests across stressed corporate credit, distressed debt, and selective rescue financings in North America and Europe. Maximum single-position concentration is 8% of total commitments.

### Fees & Carried Interest

The management fee is 1.75% per annum on total commitments during the investment period (years 1–3), stepping down to 1.50% on NAV thereafter (years 4–8). Carried interest is 20% over an 8% preferred return with a 50/50 catch-up. Carry is calculated on a whole-of-fund basis with a clawback provision through the end of the fund term; the GP's clawback obligation is backed by an escrow of 30% of distributed carry.

The whole-of-fund carry structure with material escrow is well-aligned with LP interests.

### Term & Investment Period

The fund has a 6-year term (3-year investment + 3-year harvest) with up to two one-year extensions subject to LPAC approval. The shorter-than-typical 6-year base term reflects the strategy's faster realization cycle relative to direct lending or RE.

### GP Commitment

The General Partner has committed 2% of total commitments in cash, equating to $8 million at the $400 million target.

### LP Protections

LP protections include: most-favored-nation rights for commitments over $25 million; a 5-seat LPAC (smaller given the fund size); for-cause GP removal at 50% LP vote; no-fault GP removal at 75% LP vote; and a key person clause triggered if Martin Lin ceases substantially full-time involvement.

### Chapter Summary

The chapter is rated GREEN. Fund terms are well-aligned with institutional LP standards in the opportunistic credit strategy. Whole-of-fund carry with material escrow is favorable for LPs.`,
    docCategories: ["Fund Structure"], riskObsIds: [],
    verificationCategory: "fund_structure",
    dataPoints: [
      { group: "Fund Structure", items: [
        { label: "Fund Vehicle", value: "Blackpine Credit Plus IV, L.P. (Delaware LP)", source: "LPA" },
        { label: "Parallel Feeder", value: "Blackpine Credit Plus IV (Cayman), Ltd. (master-feeder)", source: "LPA" },
        { label: "Strategy", value: "Stressed/distressed corporate credit + rescue financings (N. America & Europe)", source: "PPM" },
        { label: "Single-Position Concentration Cap", value: "8% of total commitments", source: "LPA" },
      ]},
      { group: "Fees & Carry", items: [
        { label: "Management Fee", value: "1.75% on commitments (yrs 1–3), 1.50% on NAV thereafter", source: "LPA" },
        { label: "Carried Interest", value: "20% over 8% preferred return; 50/50 catch-up", source: "LPA" },
        { label: "Carry Calculation", value: "Whole-of-fund", flag: "green", source: "LPA" },
        { label: "Clawback Escrow", value: "30% of distributed carry held in escrow", flag: "green", source: "LPA" },
      ]},
      { group: "Term & GP Commitment", items: [
        { label: "Total Term", value: "6 years (3 investment + 3 harvest) + 2 one-year extensions", source: "LPA" },
        { label: "GP Commitment", value: "2.0% in cash (~$8M at $400M target); pari passu, no fee offset", flag: "green", source: "LPA" },
      ]},
      { group: "LP Protections", items: [
        { label: "Most-Favored-Nation", value: "Commitments ≥ $25M", source: "LPA" },
        { label: "LPAC Seats", value: "5", source: "LPA" },
        { label: "GP Removal — For Cause", value: "50% LP vote", flag: "green", source: "LPA" },
        { label: "GP Removal — No Fault", value: "75% LP vote", flag: "green", source: "LPA" },
        { label: "Key Person Clause", value: "Triggered if Martin Lin ceases substantially full-time involvement", source: "LPA" },
      ]},
    ],
  },
  5: {
    name: "Service Providers, Delegation & Oversight", rating: "GREEN",
    summary: "SS&C as administrator, EY as auditor, Citi as prime broker, Schulte Roth as fund counsel. Strong vendor lineup. Annual SOC 1 review of administrator. Independent valuation agent (Houlihan Lokey) is critical given strategy. Dual-approval wire process.",
    findings: `### Administrator

SS&C Technologies serves as Blackpine's fund administrator across all four funds (since inception in 2018). SS&C provides full middle- and back-office services including NAV calculation, investor capital activity, AML/KYC, FATCA/CRS, and regulatory reporting. Daniel Foster (COO) reviews SS&C's annual SOC 1 Type II report and conducts a quarterly call with the relationship manager.

### Auditor

Ernst & Young LLP audits the fund and has served as Blackpine's auditor since inception. EY's annual opinion is delivered within 90 days of fiscal year-end. Audit fee for FY2024 was $295,000. No restatements, material weaknesses, or significant deficiencies have been reported.

### Prime Broker / Trading Counterparty

Citi Prime Finance serves as Blackpine's primary prime broker, providing trade execution, custody, and a $150 million committed financing line (repurchase facility against eligible positions). JPMorgan Chase serves as secondary prime/custodian for diversification. The firm has not experienced any margin calls outside of contractual terms across the four fund vintages.

### Fund Counsel

Schulte Roth & Zabel LLP serves as primary fund counsel. Akin Gump serves as transaction counsel for restructuring and distressed positions where specialized expertise is required.

### Independent Valuation Agent

Houlihan Lokey Valuation Advisors serves as independent valuation agent on all illiquid (Level 3) positions, providing quarterly valuations. This is a meaningful strength given the strategy's exposure to illiquid stressed/distressed positions — see Chapter 7.

### Chapter Summary

The chapter is rated GREEN. Service providers are institutional-quality with long-standing relationships and clean third-party audit history.`,
    docCategories: ["Service Providers"], riskObsIds: [],
    verificationCategory: "service_providers",
    dataPoints: [
      { group: "Service Providers", items: [
        { label: "Administrator", value: "SS&C Technologies (since inception 2018)", flag: "green", source: "Admin Agreement" },
        { label: "Auditor", value: "Ernst & Young LLP (since inception)", flag: "green", source: "Audit Letter" },
        { label: "Primary Prime Broker", value: "Citi Prime Finance ($150M committed financing)", flag: "green", source: "DDQ" },
        { label: "Secondary Prime / Custodian", value: "JPMorgan Chase", source: "DDQ" },
        { label: "Fund Counsel", value: "Schulte Roth & Zabel LLP", source: "DDQ" },
        { label: "Restructuring Counsel", value: "Akin Gump (specialized engagements)", source: "DDQ" },
        { label: "Independent Valuation Agent", value: "Houlihan Lokey Valuation Advisors (Level 3 positions)", flag: "green", source: "Valuation Policy" },
      ]},
      { group: "Administrator Oversight", items: [
        { label: "Quarterly Relationship Calls", value: "Daniel Foster (COO) with SS&C relationship manager", flag: "green", source: "DDQ" },
        { label: "SOC 1 Type II Review", value: "Annual review of SS&C's SOC 1 report", flag: "green", source: "DDQ" },
        { label: "NAV Frequency", value: "Quarterly NAV statements to investors", source: "DDQ" },
      ]},
      { group: "Audit History", items: [
        { label: "Audit Tenure", value: "Since inception in 2018 (EY)", source: "Audit Letter" },
        { label: "Annual Audit Fee (FY2024)", value: "$295,000", source: "DDQ" },
        { label: "Restatements / Material Weaknesses", value: "None across firm history", flag: "green", source: "Audit Letter" },
      ]},
    ],
  },
  6: {
    name: "Investment Operations & Portfolio Controls", rating: "RED",
    summary: "Martin Lin is sole portfolio manager — RED rating driver. 5-person Investment Committee provides advisory input but Lin has unilateral final decision authority. Robust trade-blotter controls and Citi prime broker custody. Position concentration limit 8% tested with one position at 7.4%. Use of repo financing introduces moderate fund-level leverage.",
    findings: `### Sole Portfolio Manager — Key Risk

Martin Lin serves as sole Portfolio Manager with unilateral final investment authority across the Blackpine Credit Plus series. The 5-person Investment Committee (Lin, Reyes, Foster, plus two senior analysts) provides advisory input through formal IC presentations on each new position, but the IC's role is consultative rather than decisional. Alpine considers this a material structural risk: a single individual is solely responsible for all investment decisions across $850M+ in committed capital.

The risk is partially mitigated by (1) the formal IC presentation process, (2) Alexandra Reyes' senior research role and ability to challenge thesis, and (3) the strategy's relatively short holding periods (typically 18–30 months) which limit single-position downside exposure. However, Alpine notes that no structural check exists on a Lin investment decision once he has made it.

### Investment Committee Process

The Investment Committee meets weekly and reviews all new positions exceeding 2% of fund commitments. Smaller positions can be initiated by Lin without IC review provided they fit within written investment guidelines. IC meetings are recorded and minutes are maintained for SEC examination purposes.

### Position Concentration & Leverage

The fund's single-position concentration cap is 8.0% of total commitments. As of December 31, 2025, the largest single position (LMC Holdings 8.875% Senior Notes) is at 7.4% of commitments. Top 10 positions represent 51% of NAV — moderately concentrated.

Blackpine VI utilizes a $150 million committed repo facility with Citi as primary financing source, plus additional repo lines with two secondary banks. As of December 31, 2025, gross repo borrowings are $185M (representing 30% of NAV) — meaningfully leveraged for an opportunistic credit strategy. Net leverage (after offsetting cash positions) is 22%.

### Trade Controls

All trades are executed through Citi or JPMorgan prime brokers and recorded in Eze Castle. Trade tickets are time-stamped, sequentially numbered, and reconciled daily to broker confirmations by Blackpine operations. Daniel Foster reviews all trade allocations across the funds and separate accounts.

### Workout & Restructuring Capability

For positions entering restructuring, Blackpine leverages Akin Gump for legal advice and engages with company management and other creditors directly. Lin personally manages most active restructuring positions, supplemented by Reyes and senior analysts.

### Chapter Summary

The chapter is rated RED primarily due to the sole portfolio manager structure. The structural risk is partially offset by the IC process and strong trade controls, but the absence of a structural check on Lin's investment authority is the chapter's defining feature. Repo leverage at 22% net adds modest additional risk.`,
    docCategories: ["Investment Ops"], riskObsIds: ["BO-007", "BO-008", "BO-009"],
    verificationCategory: "investment_ops",
    dataPoints: [
      { group: "Portfolio Manager Structure", items: [
        { label: "Portfolio Manager", value: "Martin Lin — sole PM with unilateral final authority", flag: "red", source: "DDQ" },
        { label: "Investment Committee Role", value: "Advisory only — formal IC presentations on positions >2% of commitments", flag: "red", source: "DDQ" },
        { label: "IC Composition", value: "5 members (Lin + Reyes + Foster + 2 senior analysts)", source: "DDQ" },
        { label: "IC Meeting Cadence", value: "Weekly + ad-hoc", source: "DDQ" },
      ]},
      { group: "Position Concentration", items: [
        { label: "Single-Position Cap", value: "8.0% of total commitments", source: "LPA" },
        { label: "Largest Position", value: "LMC Holdings 8.875% Senior Notes — 7.4% (near cap)", flag: "yellow", source: "DDQ" },
        { label: "Top 10 Positions", value: "51% of NAV", flag: "yellow", source: "DDQ" },
      ]},
      { group: "Leverage", items: [
        { label: "Repo Facility — Primary", value: "Citi — $150M committed", source: "DDQ" },
        { label: "Repo Facility — Secondary", value: "Two additional bank lines", source: "DDQ" },
        { label: "Gross Repo Borrowings", value: "$185M = 30% of NAV", flag: "yellow", source: "DDQ" },
        { label: "Net Leverage (post-cash)", value: "22% of NAV", flag: "yellow", source: "DDQ" },
      ]},
      { group: "Trade Controls", items: [
        { label: "OMS / Recordkeeping", value: "Eze Castle — time-stamped, sequentially numbered trades", flag: "green", source: "DDQ" },
        { label: "Daily Reconciliation", value: "Operations reconciles trade blotter to broker confirmations", flag: "green", source: "DDQ" },
        { label: "Allocation Review", value: "Daniel Foster (COO) reviews all allocations", flag: "green", source: "DDQ" },
      ]},
    ],
  },
  7: {
    name: "Valuation, Asset Existence & Investor Reporting", rating: "GREEN",
    summary: "Independent valuation agent Houlihan Lokey marks all Level 3 illiquid positions quarterly. Liquid Level 1/2 positions marked-to-market via Bloomberg + broker quotes. Valuation Committee 3 non-investment of 5 members. Asset existence confirmed via prime broker statements. Quarterly investor reports timely.",
    findings: `### Valuation Process

Blackpine's portfolio falls into three valuation tiers under ASC 820 fair-value framework:

**Level 1 (mark-to-market)**: Publicly traded debt and equity securities marked daily via Bloomberg composite pricing. Approximately 35% of NAV as of December 31, 2025.

**Level 2 (broker-quoted)**: Less-liquid loans and high-yield bonds marked via three broker quotes (Citi, JPMorgan, plus rotating third) with median price used. Approximately 40% of NAV.

**Level 3 (illiquid, model-based)**: Distressed positions in restructuring, non-traded bank loans, and rescue financings. All Level 3 positions are independently valued quarterly by Houlihan Lokey Valuation Advisors. Approximately 25% of NAV.

### Independent Valuation Agent

Houlihan Lokey is the primary valuation agent of record for all Level 3 positions — Blackpine does not produce its own marks on these positions, only providing market color and trading observations. This is a notable strength for an opportunistic credit manager and is responsible for the chapter's GREEN rating despite the strategy's inherent valuation complexity.

### Valuation Committee

The Valuation Committee comprises five members: Daniel Foster (COO/CCO, Chair), an Apex Compliance Advisors representative, an SS&C senior representative, Alexandra Reyes (Head of Research), and Martin Lin (CIO). Non-investment members hold 3 of 5 seats. The committee meets quarterly to review Houlihan's marks on Level 3 positions and challenge inputs where appropriate. Lin's role is advisory — he cannot override Houlihan's marks unilaterally.

### Asset Existence & Investor Reporting

Asset existence is verified by SS&C through direct reconciliation to prime broker (Citi, JPMorgan) statements monthly. Custody is held in segregated accounts at Citi and JPMorgan.

Quarterly investor reports are delivered within 45 days of quarter-end and include performance attribution by asset class, top 10 positions, leverage attribution, capital activity, and Level 1/2/3 distribution. Audited annual financials are delivered within 90 days of fiscal year-end.

### Chapter Summary

The chapter is rated GREEN despite the strategy's illiquid valuation complexity, because Blackpine has structured the valuation function appropriately: independent agent of record on Level 3 positions, non-investment Valuation Committee majority, and timely investor reporting.`,
    docCategories: ["Valuation"], riskObsIds: [],
    verificationCategory: "valuation",
    dataPoints: [
      { group: "Valuation Framework", items: [
        { label: "Level 1 (Mark-to-Market)", value: "~35% of NAV — Bloomberg composite", flag: "green", source: "Valuation Policy" },
        { label: "Level 2 (Broker-Quoted)", value: "~40% of NAV — 3-broker median (Citi, JPM, rotating)", flag: "green", source: "Valuation Policy" },
        { label: "Level 3 (Illiquid)", value: "~25% of NAV — independently marked by Houlihan Lokey", flag: "green", source: "Valuation Policy" },
      ]},
      { group: "Independent Valuation Agent", items: [
        { label: "Agent of Record (Level 3)", value: "Houlihan Lokey Valuation Advisors", flag: "green", source: "DDQ" },
        { label: "Marking Cadence", value: "Quarterly on 100% of Level 3 positions", flag: "green", source: "DDQ" },
        { label: "Manager Role", value: "Market color only — Blackpine does NOT mark Level 3 positions", flag: "green", source: "DDQ" },
      ]},
      { group: "Valuation Committee", items: [
        { label: "Composition", value: "5 members; 3 non-investment (COO/CCO, Apex, SS&C)", flag: "green", source: "Valuation Policy" },
        { label: "Approval Threshold", value: "Majority vote", source: "Valuation Policy" },
        { label: "Meeting Cadence", value: "Quarterly", source: "Valuation Policy" },
      ]},
      { group: "Asset Existence & Reporting", items: [
        { label: "Asset Existence Verification", value: "SS&C reconciles to Citi/JPM prime broker statements monthly", flag: "green", source: "DDQ" },
        { label: "Custody", value: "Segregated accounts at Citi and JPMorgan", flag: "green", source: "DDQ" },
        { label: "Quarterly Reports", value: "Within 45 days of quarter-end", flag: "green", source: "DDQ" },
        { label: "Audited Financials", value: "Within 90 days of fiscal year-end", flag: "green", source: "DDQ" },
      ]},
    ],
  },
  8: {
    name: "Manager Transparency & LP Communications", rating: "GREEN",
    summary: "Cooperative diligence posture with prompt responses. Disclosed 2024 SEC deficiency letter at outset of diligence. Quarterly investor letters with position-level commentary. Annual investor day. LPAC standing quorum strong. No material LP complaints.",
    findings: `### Diligence Engagement

Blackpine's response to Alpine's diligence requests was prompt and thorough. The Manager voluntarily disclosed the 2024 SEC books-and-records deficiency letter and full remediation at the outset of diligence. Martin Lin, Alexandra Reyes, and Daniel Foster were all made available for direct interviews; the IR team coordinated all document requests through a structured data room.

### Investor Communications

Blackpine produces quarterly investor letters within 45 days of each quarter-end. Letters are approximately 14–18 pages and include performance attribution by asset class, named-position commentary on top 10 holdings, restructuring updates, leverage attribution, and a market outlook. Lin personally writes the market commentary section; Reyes writes the position-level updates.

The firm hosts an annual investor day each May in New York attended by approximately 70% of LPs by capital. The agenda includes market positioning, deep-dive on selected restructuring situations, and Q&A with Lin and Reyes.

### LPAC

The LPAC has 5 seats (smaller given fund size). Meetings are held semi-annually in person plus ad-hoc by video. Standing LPAC quorum across the past three years has been over 95%.

### Side Letters

Side letter scope is contained: most letters address regulatory disclosures, ERISA/UBTI exclusions, fee step-downs for commitments above $25M, and MFN rights.

### Chapter Summary

The chapter is rated GREEN. Blackpine's transparency posture during diligence was constructive and proactive, particularly in self-disclosing the SEC remediation history.`,
    docCategories: ["Transparency"], riskObsIds: [],
    verificationCategory: "transparency",
    dataPoints: [
      { group: "Diligence Engagement", items: [
        { label: "Document Availability", value: "Structured data room; all requested materials provided", flag: "green", source: "DDQ" },
        { label: "Voluntary Disclosures", value: "Self-disclosed 2024 SEC deficiency at outset of diligence", flag: "green", source: "DDQ" },
      ]},
      { group: "Investor Reporting", items: [
        { label: "Quarterly Letter", value: "Within 45 days; 14–18 pages; named-position commentary on top 10", flag: "green", source: "Q4 2025 Letter" },
        { label: "Annual Investor Day", value: "Each May in NYC; ~70% LP attendance by capital", flag: "green", source: "DDQ" },
        { label: "Restructuring Updates", value: "Included in quarterly letter", flag: "green", source: "DDQ" },
      ]},
      { group: "LPAC", items: [
        { label: "Composition", value: "5 seats", source: "LPA" },
        { label: "Meeting Cadence", value: "Semi-annual in person + ad-hoc video", source: "LPA" },
        { label: "Standing Quorum (3 yrs)", value: ">95%", flag: "green", source: "DDQ" },
      ]},
    ],
  },
};

// ── Source metadata ───────────────────────────────────────────────────────────

export const BLACKPINE_SOURCE_META: Record<string, { label: string; type: string; filename?: string; size?: string }> = {
  "sample_credit_blackpine_plus.pdf": { label: "Blackpine Credit Plus IV — ODD Report (April 2026)", type: "ODD Report", filename: "sample_credit_blackpine_plus.pdf", size: "1.4 MB" },
  "DDQ": { label: "Due Diligence Questionnaire (2026)", type: "Fund Document", filename: "blackpine_ddq_2026.pdf" },
  "Form ADV": { label: "Form ADV — March 2026", type: "Regulatory Filing" },
  "LPA": { label: "Limited Partnership Agreement — Fund IV", type: "Fund Document" },
  "PPM": { label: "Private Placement Memorandum — Fund IV", type: "Fund Document" },
  "Valuation Policy": { label: "Valuation Policy (Feb 2026)", type: "Operations Document" },
  "Code of Ethics": { label: "Code of Ethics (Feb 2026)", type: "Compliance Document" },
  "WISP": { label: "Written Information Security Program (2026)", type: "Compliance Document" },
  "Admin Agreement": { label: "Administration Agreement — SS&C", type: "Service Provider Agreement" },
  "Audit Letter": { label: "EY — Audit Confirmation", type: "Third-Party Confirmation" },
  "SEC Letter": { label: "SEC Examination Closing Letter (Q3 2024)", type: "Regulatory Filing" },
  "Insurance Cert": { label: "Cyber Liability Insurance Certificate", type: "Insurance" },
  "Q4 2025 Letter": { label: "Q4 2025 Investor Letter", type: "Investor Communication" },
  "SEC_EDGAR": { label: "SEC EDGAR — IARD Registered Adviser Search", type: "SEC Verification" },
  "Delaware Register": { label: "Delaware Division of Corporations — Direct Check", type: "SEC Verification" },
};

// ── Mock fund-level data ──────────────────────────────────────────────────────

export const BLACKPINE_MOCK = {
  fund: {
    name: "Blackpine Credit Plus IV, L.P.",
    manager: "Blackpine Asset Management, LLC",
    strategy: "Opportunistic / Stressed Corporate Credit",
    aum: "$850M firmwide (excl. $215M uncalled); $1.025B incl. separate accounts",
    overall_rating: "YELLOW",
    odd_score: 67,
    odd_percentile: "48th",
    domicile: "Delaware LP (Cayman master-feeder)",
    fund_nav: "$260M raised; pre-deployment",
    recommendation_summary: "recommends a <b>watchlist</b> rating. Blackpine has produced strong realized returns across three prior vintages and has institutional-grade service providers and an independent valuation agent. The RED rating in Investment Operations (sole portfolio manager structure) and YELLOW ratings in Governance, Compliance, and Technology reflect emerging-manager characteristics that warrant active monitoring.",
    conditions_summary: "Post-close monitoring: track Investment Committee discipline and Lin's investment authority delegation; confirm SOC 2 audit completion by end-2026; monitor repo leverage utilization quarterly; track senior personnel retention given 2025 departures.",
  },
  risk_observations: [
    { id: "BO-001", severity: "HIGH", topic: "Manager, Ownership & Governance", title: "Concentrated ownership in single founder; no formal succession plan",
      detail: "Martin Lin owns 72% of Blackpine and holds the Founder, CIO, and sole Portfolio Manager roles. No formal written succession plan exists. Key person life insurance is limited to Lin at $15M.",
      remediation: "Formalize written succession plan identifying interim responsibility if Lin becomes unavailable; consider increasing key person insurance limit." },
    { id: "BO-002", severity: "MEDIUM", topic: "Manager, Ownership & Governance", title: "Two senior analyst departures in 2025",
      detail: "Robert Chen (Senior Analyst, March 2025) and David Marshall (Senior Analyst, October 2025) departed within nine months. Both departures were amicable but represent meaningful turnover in a small (8-person) research team.",
      remediation: "Monitor research team stability through next vintage; encourage broader carry participation to support retention." },
    { id: "BO-003", severity: "LOW", topic: "Manager, Ownership & Governance", title: "Background-check refresh not performed",
      detail: "External background checks are performed on initial hire only; no periodic refresh.",
      remediation: "Implement 3-year refresh background checks for carry-eligible employees." },
    { id: "BO-004", severity: "MEDIUM", topic: "Legal, Regulatory & Compliance", title: "COO and CCO roles combined",
      detail: "Daniel Foster serves as both Chief Operating Officer and Chief Compliance Officer. This combination is a meaningful segregation of duties concern given the strategy's illiquid valuation complexity.",
      remediation: "Appoint dedicated Chief Compliance Officer independent of operations as AUM scales." },
    { id: "BO-005", severity: "MEDIUM", topic: "Legal, Regulatory & Compliance", title: "Q1 2024 SEC examination deficiency letter — remediated",
      detail: "The most recent SEC examination (Q1 2024) closed with a deficiency letter citing books-and-records retention deficiencies. Blackpine remediated by deploying Smarsh email archiving firmwide; SEC closed the matter in Q3 2024 without enforcement.",
      remediation: "No further action required; monitor going forward to ensure no recurrence in next SEC exam cycle." },
    { id: "BO-006", severity: "MEDIUM", topic: "Technology, Cybersecurity & Business Resilience", title: "No SOC 2 audit",
      detail: "Blackpine has not commissioned a SOC 2 Type II audit. The firm has indicated this is on the 2026 roadmap.",
      remediation: "Commission SOC 2 Type II audit by end of 2026." },
    { id: "BO-007", severity: "HIGH", topic: "Investment Operations & Portfolio Controls", title: "Martin Lin is sole portfolio manager with unilateral investment authority",
      detail: "Lin serves as sole Portfolio Manager across the Blackpine Credit Plus series with unilateral final investment authority. The 5-person Investment Committee is advisory only. No structural check exists on a Lin investment decision once made.",
      remediation: "Consider structural reform: either elevate Alexandra Reyes to co-PM with majority vote on positions, or require IC supermajority on positions exceeding 5% of fund commitments.",
      benchmark: { portfolio_pct: 22, portfolio_label: "of portfolio credit funds have sole-PM structure at $500M+ AUM", industry_pct: 28, industry_label: "industry benchmark (institutional credit managers)", is_outlier: false } },
    { id: "BO-008", severity: "MEDIUM", topic: "Investment Operations & Portfolio Controls", title: "Largest single position near concentration cap",
      detail: "As of December 31, 2025, the largest position (LMC Holdings 8.875% Senior Notes) is at 7.4% of commitments against an 8.0% contractual cap. Top 10 positions represent 51% of NAV.",
      remediation: "Monitor concentration disclosure quarterly; LPAC affirmation of cap at each annual review." },
    { id: "BO-009", severity: "MEDIUM", topic: "Investment Operations & Portfolio Controls", title: "Moderate repo leverage at 22% net of NAV",
      detail: "Blackpine uses repo financing through Citi and two secondary banks, with gross borrowings of $185M (30% of NAV) and net leverage of 22% as of December 31, 2025. Moderate leverage is consistent with opportunistic credit strategies but introduces tail risk in credit market stress.",
      remediation: "Monitor repo utilization quarterly; confirm LPAC understanding of leverage policy at each annual review." },
  ],
  strengths: [
    { title: "Strong realized track record across three completed vintages",
      detail: "Blackpine Credit Plus I delivered a 19.3% gross IRR and 1.74x MOIC. Funds II and III are tracking 17.8% and 14.6% gross IRR respectively at interim. Realized performance places Blackpine in the top quartile of opportunistic credit peers per Cliffwater data." },
    { title: "Independent valuation agent of record on Level 3 positions",
      detail: "Houlihan Lokey serves as primary valuation agent of record on all illiquid (Level 3) positions, marking quarterly. Blackpine does not produce its own marks on Level 3 positions, only providing market color. This is a meaningful institutional best practice that mitigates the strategy's inherent valuation complexity." },
    { title: "Institutional-grade service providers and clean audit history",
      detail: "SS&C as administrator since inception, EY as auditor since inception, Citi as primary prime. No restatements, material weaknesses, or significant deficiencies in audit history." },
    { title: "Proactive regulatory remediation",
      detail: "The 2024 SEC deficiency letter was remediated promptly via firmwide Smarsh deployment and closed without enforcement action in Q3 2024. The Manager voluntarily disclosed both the deficiency and the remediation at the outset of diligence." },
  ],
};

// ── Collection / source documents ─────────────────────────────────────────────

export const BLACKPINE_COLLECTION_DOCS: Array<{ name: string; type: string; filename: string }> = [
  { name: "Blackpine Credit Plus IV — ODD Report (April 2026)", type: "ODD Report",            filename: "sample_credit_blackpine_plus.pdf" },
  { name: "Form ADV — March 2026",                                type: "Regulatory Filing",     filename: "blackpine_form_adv.pdf" },
  { name: "Limited Partnership Agreement — Fund IV",              type: "Fund Document",         filename: "blackpine_lpa.pdf" },
  { name: "Private Placement Memorandum — Fund IV",               type: "Fund Document",         filename: "blackpine_ppm.pdf" },
  { name: "Due Diligence Questionnaire (2026)",                   type: "Fund Document",         filename: "blackpine_ddq_2026.pdf" },
  { name: "Valuation Policy (February 2026)",                     type: "Operations Document",   filename: "blackpine_valuation_policy.pdf" },
  { name: "Compliance Manual (February 2026)",                    type: "Compliance Document",   filename: "blackpine_compliance_manual.pdf" },
  { name: "Audited Financial Statements FY2024",                  type: "Financial Document",    filename: "blackpine_audited_fs_fy2024.pdf" },
];
