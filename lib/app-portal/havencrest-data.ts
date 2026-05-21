/**
 * Havencrest Industrial Trust V, L.P. — static demo data for the Investor Portal report reader.
 *
 * ODD review of Havencrest Industrial Trust V, L.P. (Core+ Industrial / Logistics Real Estate)
 * Manager: Havencrest Real Estate Advisors, LLC
 * Overall rating: GREEN (15 flags, 0 RED chapters, 1 YELLOW chapter)
 */

import type { TopicInfo, TopicDataGroup } from "./ridgeline-data";

export type { TopicInfo, TopicDataGroup };

// ── 8-Topic ODD assessment data (Havencrest Industrial Trust V) ──────────────

export const HAVENCREST_TOPIC_DATA: Record<number, TopicInfo> = {
  1: {
    name: "Manager, Ownership & Governance", rating: "GREEN",
    summary: "Institutional industrial REIT manager founded in 2008. Five consecutive vintages. 42 FTEs across acquisitions, asset management, capital markets, and operations. Four-person Executive Committee with formal succession protocol. Distributed employee ownership (82%). GP commits 3% in cash. 5-year deferred carry vesting.",
    findings: `### Management Company and Affiliates

Havencrest Real Estate Advisors, LLC ("Havencrest" or the "Manager") was founded in 2008 by Patricia Vega (Chief Executive Officer) and Mark Donovan (Chief Investment Officer), both previously senior real estate professionals at Prologis. Havencrest is headquartered in Chicago with regional offices in Atlanta, Dallas, and Los Angeles. The firm focuses exclusively on Core+ industrial and logistics real estate — modern distribution centers, last-mile fulfillment, and selective light industrial — in primary and growth-market U.S. logistics corridors.

### Strategy & Fund Series

Havencrest's strategy targets stabilized institutional-grade industrial properties with long-term creditworthy tenants. The firm raises closed-end fund vehicles every 3 years. Havencrest has raised five funds: Trust I (2010, $385M, fully realized), Trust II (2013, $625M, fully realized), Trust III (2016, $980M, fully invested), Trust IV (2020, $1.45B, ~92% deployed), and Trust V (current, $1.2B target / $1.5B hard cap, $980M raised through December 2025).

### Assets under Management

Havencrest reported firmwide net assets of $3.42 billion as of December 31, 2025 (excluding $785M in uncalled capital). The firm owns or has owned 248 industrial properties totaling 78 million square feet across the five vintages.

### Ownership & Succession

Havencrest is majority owned by employees (82%), with the remaining 18% held by Greenhill Pension Trust as a passive minority investor (acquired in 2017). Employee ownership is distributed across 23 senior-level professionals (4 Executive Committee + 19 partner-level). The firm maintains a formal written succession plan: Mark Donovan is designated successor CEO; Lauren Foster (Head of Acquisitions) is designated successor CIO. Key person life insurance of $20 million is in place on each of the four Executive Committee members.

### Human Resources

Havencrest employs 42 full-time professionals: 14 acquisitions, 11 asset management, 5 capital markets, 6 operations and finance, 4 investor relations, and 2 administrative. Investment professionals average 13 years of industrial real estate experience.

Background checks are conducted by HireRight on initial hire and refreshed every three years for partner-level employees. All employees with carry have a 5-year vesting schedule.

### Chapter Summary

The chapter is rated GREEN. Havencrest's governance infrastructure is well-developed: formal succession planning, distributed employee ownership, multi-year deferred carry vesting, adequate insurance coverage, and external background check vendor with refresh cadence.`,
    docCategories: ["Governance"], riskObsIds: [],
    verificationCategory: "governance",
    dataPoints: [
      { group: "Management Company", items: [
        { label: "Manager Name", value: "Havencrest Real Estate Advisors, LLC", source: "Form ADV" },
        { label: "Date of Formation", value: "April 22, 2008", source: "Delaware Register" },
        { label: "Primary Location", value: "Chicago, IL (HQ); Atlanta, Dallas, Los Angeles (regional)", source: "Form ADV" },
        { label: "Total Headcount", value: "42 FTEs (14 acquisitions, 11 asset mgmt, 5 capital markets, 6 ops, 4 IR, 2 admin)", source: "DDQ" },
        { label: "AUM (Net Assets, 12/31/2025)", value: "$3.42 billion", source: "Form ADV" },
        { label: "Uncalled Capital", value: "$785 million", source: "DDQ" },
        { label: "Total Properties / Square Feet", value: "248 properties / 78 million SF across five vintages", source: "DDQ" },
      ]},
      { group: "Senior Leadership", items: [
        { label: "Chief Executive Officer", value: "Patricia Vega — co-founder; former Senior VP, Prologis", source: "DDQ" },
        { label: "Chief Investment Officer", value: "Mark Donovan — co-founder; former VP Acquisitions, Prologis", source: "DDQ" },
        { label: "Head of Acquisitions", value: "Lauren Foster — joined 2014; former Director, Black Creek Industrial", source: "DDQ" },
        { label: "Head of Asset Management", value: "Robert Kim — joined 2015; former Senior Director, Duke Realty", source: "DDQ" },
        { label: "Chief Financial Officer", value: "Sandra Chen — joined 2016; CPA; former Hines Industrial", source: "DDQ" },
      ]},
      { group: "Governance & Ownership", items: [
        { label: "Ownership", value: "Employees 82% (23 senior professionals); Greenhill Pension Trust 18% (passive)", flag: "green", source: "Form ADV" },
        { label: "GP Commitment (Fund V)", value: "3.0% in cash (~$45M at $1.5B hard cap); pari passu, no fee offset", flag: "green", source: "LPA" },
        { label: "Succession Plan", value: "Formal written plan filed with regulator", flag: "green", source: "DDQ" },
        { label: "Key Person Insurance", value: "$20M on each of 4 Executive Committee members", flag: "green", source: "DDQ" },
        { label: "Deferred Compensation", value: "5-year carry vesting", flag: "green", source: "DDQ" },
        { label: "Background Checks", value: "External (HireRight) — initial + 3-yr refresh for partners", flag: "green", source: "DDQ" },
      ]},
      { group: "Fund Series Track Record", items: [
        { label: "Trust I (2010)",         value: "$385M — fully realized; 14.2% gross IRR / 1.82x MOIC", source: "DDQ" },
        { label: "Trust II (2013)",        value: "$625M — fully realized; 13.7% gross IRR / 1.76x MOIC", source: "DDQ" },
        { label: "Trust III (2016)",       value: "$980M — fully invested; 12.4% gross IRR (interim)", source: "DDQ" },
        { label: "Trust IV (2020)",        value: "$1.45B — ~92% deployed; 11.6% gross IRR (interim)", source: "DDQ" },
        { label: "Trust V (current)",      value: "$1.2B target / $1.5B hard cap; $980M raised (12/2025)", source: "DDQ" },
      ]},
    ],
  },
  2: {
    name: "Legal, Regulatory & Compliance", rating: "GREEN",
    summary: "SEC-registered investment adviser since 2014. Dedicated 3-person compliance team led by Maria Santos (CCO). Annual mock SEC exam via Schulte Roth. Comprehensive code of ethics with custodian-direct brokerage statements. REIT compliance program. No regulatory actions or material litigation.",
    findings: `### Regulatory Status

Havencrest Real Estate Advisors, LLC is a U.S. Securities and Exchange Commission ("SEC") registered investment adviser (IARD/CRD 158263) since 2014. The firm structures its funds as REITs and maintains a dedicated REIT compliance function in addition to its core investment adviser compliance program.

### Compliance Program

The compliance program is led by Maria Santos, who joined Havencrest as Chief Compliance Officer in 2018, bringing 12 years of real estate fund compliance experience (formerly CCO at Black Creek Industrial). Maria reports directly to the Executive Committee and has no investment responsibilities. The compliance team comprises three full-time professionals plus a part-time REIT tax specialist.

Havencrest engages Schulte Roth & Zabel LLP as outside compliance counsel and performs an annual mock SEC exam each fall. The most recent mock exam (October 2025) identified two minor process recommendations, both implemented prior to year-end. The compliance manual is reviewed and updated annually (most recent revision: January 2026).

### Code of Ethics & Personal Trading

The Code of Ethics requires pre-clearance for all personal securities transactions other than open-end mutual funds, government securities, and certain ETFs. Brokerage statements are collected directly from custodians (no employee self-reporting). A 30-day minimum holding period applies. Annual attestations are completed by all employees.

Given the firm's focus on private real estate, there is minimal overlap between employee personal trading and fund holdings, but the controls are nonetheless robust.

### REIT Compliance

Havencrest maintains a dedicated REIT compliance function to ensure each fund's REIT vehicle satisfies the requirements of IRC Sections 856–860. Quarterly income and asset tests are performed by SS&C with oversight from Havencrest tax. PwC reviews REIT compliance as part of the annual audit.

### Regulatory History

The firm has had no SEC examinations result in deficiency letters or enforcement actions. Havencrest has not been a party to any material litigation in its 17-year history. No material customer complaints have been filed.

### Chapter Summary

The chapter is rated GREEN. Compliance infrastructure is institutional-grade, REIT compliance is well-managed, and the firm has a clean regulatory and litigation history.`,
    docCategories: ["Compliance"], riskObsIds: [],
    verificationCategory: "compliance",
    dataPoints: [
      { group: "Regulatory Status", items: [
        { label: "SEC Registration", value: "RIA since 2014 (IARD/CRD 158263)", flag: "green", source: "SEC_EDGAR" },
        { label: "Form ADV Last Filing", value: "Annual amendment March 28, 2026", source: "Form ADV" },
        { label: "Fund Vehicle Type", value: "REITs (IRC §§ 856–860)", source: "PPM" },
      ]},
      { group: "Compliance Team", items: [
        { label: "Chief Compliance Officer", value: "Maria Santos — dedicated, no investment role; 12 yrs RE compliance", flag: "green", source: "DDQ" },
        { label: "Compliance Headcount", value: "3 dedicated FTEs + part-time REIT tax specialist", flag: "green", source: "DDQ" },
        { label: "Outside Compliance Counsel", value: "Schulte Roth & Zabel LLP", source: "DDQ" },
        { label: "Annual Mock SEC Exam", value: "Conducted each fall; most recent October 2025", flag: "green", source: "DDQ" },
      ]},
      { group: "Personal Trading Controls", items: [
        { label: "Pre-Clearance", value: "All preclearable securities", flag: "green", source: "Code of Ethics" },
        { label: "Brokerage Statements", value: "Custodian-direct collection", flag: "green", source: "DDQ" },
        { label: "Minimum Holding Period", value: "30 days", flag: "green", source: "Code of Ethics" },
        { label: "Annual Attestation", value: "Required of all employees", flag: "green", source: "DDQ" },
      ]},
      { group: "REIT Compliance", items: [
        { label: "Quarterly Income/Asset Tests", value: "Performed by SS&C; reviewed by Havencrest tax", flag: "green", source: "DDQ" },
        { label: "Annual REIT Compliance Review", value: "Included in PwC audit", flag: "green", source: "Audit Letter" },
      ]},
      { group: "Regulatory History", items: [
        { label: "SEC Examinations", value: "None resulting in deficiency or enforcement", flag: "green", source: "SEC_EDGAR" },
        { label: "Material Litigation", value: "None in 17-year history", flag: "green", source: "DDQ" },
        { label: "Customer Complaints", value: "None material on record", flag: "green", source: "Form ADV" },
      ]},
    ],
  },
  3: {
    name: "Technology, Cybersecurity & Business Resilience", rating: "GREEN",
    summary: "Microsoft 365 + Yardi Voyager + Argus Enterprise. SOC 2 Type II annual audit. Mandiant penetration testing. KnowBe4 phishing program. CrowdStrike endpoint protection + DLP. Annual BCP tabletop. No incidents in past 5 years. Cyber insurance $20M.",
    findings: `### Infrastructure

Havencrest operates on a cloud-based Microsoft 365 stack (Exchange, SharePoint, Teams) supplemented by industry-standard real estate software: Yardi Voyager (property accounting and asset management), Argus Enterprise (valuation and underwriting), and Salesforce (CRM and investor relations). Single sign-on through Microsoft Entra ID with mandatory MFA. CrowdStrike Falcon provides endpoint protection including DLP capabilities across all devices.

### Cybersecurity Program

The cybersecurity program is led by the Director of Information Technology, James Patel, reporting to the CFO. Havencrest has commissioned annual SOC 2 Type II audits since 2018; the most recent (FY2025, audited by Schneider Downs) resulted in an unqualified opinion. Mandiant conducts annual external penetration testing; the 2025 test identified two low-severity findings, both remediated within 30 days.

KnowBe4 administers monthly simulated phishing campaigns; rolling 12-month click rate is 1.7%, below the financial services benchmark of 3.2%. All employees complete mandatory annual cybersecurity training and quarterly refresher modules.

### Resilience

Havencrest maintains a WISP, IRP, and BCP, all reviewed annually by Mandiant. Annual tabletop exercises simulate both cyber incidents and physical disruptions to the Chicago headquarters. The 2025 exercise was conducted in November and included scenarios involving ransomware and a multi-day Chicago office outage.

The firm has not experienced any material cybersecurity incidents, data breaches, or business disruptions in the past five years.

### Insurance

Cyber liability insurance limit is $20 million per occurrence / $20 million aggregate — institutional-grade for the firm's $3.4B AUM scale.

### Chapter Summary

The chapter is rated GREEN. Technology and resilience controls are institutional-grade with strong external testing, clean five-year incident history, and adequate insurance.`,
    docCategories: ["Technology"], riskObsIds: [],
    verificationCategory: "cybersecurity",
    dataPoints: [
      { group: "Infrastructure", items: [
        { label: "Productivity Platform", value: "Microsoft 365 (Exchange, SharePoint, Teams)", source: "DDQ" },
        { label: "Property / Asset Systems", value: "Yardi Voyager (accounting + asset mgmt), Argus Enterprise (valuation)", source: "DDQ" },
        { label: "CRM / IR", value: "Salesforce", source: "DDQ" },
        { label: "Identity & Access", value: "Microsoft Entra ID SSO + mandatory MFA", flag: "green", source: "DDQ" },
        { label: "Endpoint Protection", value: "CrowdStrike Falcon (incl. DLP)", flag: "green", source: "DDQ" },
      ]},
      { group: "Cybersecurity Program", items: [
        { label: "SOC 2 Type II", value: "Annual since 2018; FY2025 unqualified (Schneider Downs)", flag: "green", source: "SOC 2 Report" },
        { label: "External Penetration Testing", value: "Annual via Mandiant; 2025 — 2 low findings, all remediated in 30 days", flag: "green", source: "DDQ" },
        { label: "Phishing Simulation", value: "Monthly via KnowBe4; rolling 12-mo click rate 1.7%", flag: "green", source: "DDQ" },
        { label: "Annual Cyber Training", value: "Mandatory; quarterly refresher modules", flag: "green", source: "DDQ" },
      ]},
      { group: "Resilience & Insurance", items: [
        { label: "WISP / IRP / BCP", value: "Maintained, reviewed annually by Mandiant", flag: "green", source: "WISP" },
        { label: "Annual Tabletop Exercise", value: "November 2025 — combined ransomware + Chicago outage scenario", flag: "green", source: "DDQ" },
        { label: "Incidents in Past 5 Years", value: "None", flag: "green", source: "DDQ" },
        { label: "Cyber Liability Insurance", value: "$20M per occurrence / $20M aggregate", flag: "green", source: "Insurance Cert" },
      ]},
    ],
  },
  4: {
    name: "Fund Structure, Terms & Investor Alignment", rating: "GREEN",
    summary: "Delaware LP investing through Delaware REIT vehicle. Cayman feeder. 1.25% management fee on commitments. 15% carry over 7% preferred return with 50/50 catch-up. 10-year term + two 1-yr extensions. Whole-of-fund carry with 25% escrow. Conservative 55% LTV cap. Strong LP protections. GP 3% cash commitment.",
    findings: `### Fund Structure

Havencrest Industrial Trust V, L.P. is structured as a Delaware limited partnership investing through a Delaware REIT vehicle (per IRC §§ 856–860). A Cayman feeder accommodates non-US and US tax-exempt investors. The fund invests across Core+ stabilized industrial properties in primary U.S. logistics markets. Maximum single-property concentration is 6% of total commitments; maximum single-market concentration is 25%; maximum single-tenant concentration is 12%.

### Fees & Carried Interest

The management fee is 1.25% per annum on total commitments during the 4-year investment period, stepping to 1.00% on invested capital thereafter. Carried interest is 15% over a 7% preferred return with a 50/50 catch-up. Carry is calculated on a whole-of-fund basis with a clawback through end of fund term, backed by a 25% escrow of distributed carry.

### Term & Investment Period

The fund has a 10-year term (4-year investment + 6-year harvest) with up to two one-year extensions subject to LPAC approval. The longer 10-year base term reflects the Core+ stabilized strategy's longer hold cycle compared to value-add or opportunistic strategies.

### Leverage Limits

The LPA imposes a 55% loan-to-value cap at the fund level — conservative for industrial real estate where 60–65% is more common. The Manager indicated this conservative cap is a deliberate choice to align with risk-conscious institutional LPs.

### GP Commitment

The General Partner has committed 3% of total commitments in cash, equating to approximately $45 million at the $1.5 billion hard cap. The commitment is funded pari passu with LPs with no fee offset.

### LP Protections

LP protections include: most-favored-nation rights for commitments over $50 million; a 9-seat LPAC (large given fund size, broad investor representation); for-cause GP removal at 50% LP vote; no-fault GP removal at 75% LP vote; and a key person clause triggered if any two of Patricia Vega, Mark Donovan, or Lauren Foster cease substantially full-time involvement.

### Chapter Summary

The chapter is rated GREEN. Fund terms are LP-favorable: lower-than-typical management fee for the strategy, conservative LTV cap, whole-of-fund carry with material escrow, and broad LP protections.`,
    docCategories: ["Fund Structure"], riskObsIds: [],
    verificationCategory: "fund_structure",
    dataPoints: [
      { group: "Fund Structure", items: [
        { label: "Fund Vehicle", value: "Havencrest Industrial Trust V, L.P. (Delaware LP investing via Delaware REIT)", source: "LPA" },
        { label: "Parallel Feeder", value: "Havencrest Industrial Trust V (Cayman), Ltd.", source: "LPA" },
        { label: "Strategy", value: "Core+ stabilized industrial / logistics — primary U.S. logistics markets", source: "PPM" },
        { label: "Single-Property Cap", value: "6% of total commitments", flag: "green", source: "LPA" },
        { label: "Single-Market Cap", value: "25% of total commitments", flag: "green", source: "LPA" },
        { label: "Single-Tenant Cap", value: "12% of total commitments", flag: "green", source: "LPA" },
      ]},
      { group: "Fees & Carry", items: [
        { label: "Management Fee", value: "1.25% on commitments (yrs 1–4), 1.00% on invested capital thereafter", flag: "green", source: "LPA" },
        { label: "Carried Interest", value: "15% over 7% preferred return; 50/50 catch-up", flag: "green", source: "LPA" },
        { label: "Carry Calculation", value: "Whole-of-fund", flag: "green", source: "LPA" },
        { label: "Clawback Escrow", value: "25% of distributed carry held in escrow", flag: "green", source: "LPA" },
      ]},
      { group: "Term & Leverage", items: [
        { label: "Total Term", value: "10 years (4 investment + 6 harvest) + 2 one-year extensions", source: "LPA" },
        { label: "Fund-Level LTV Cap", value: "55% (conservative for the strategy)", flag: "green", source: "LPA" },
        { label: "GP Commitment", value: "3.0% in cash (~$45M at $1.5B hard cap); pari passu", flag: "green", source: "LPA" },
      ]},
      { group: "LP Protections", items: [
        { label: "Most-Favored-Nation", value: "Available to commitments ≥ $50M", source: "LPA" },
        { label: "LPAC Seats", value: "9 (broad investor representation)", flag: "green", source: "LPA" },
        { label: "GP Removal — For Cause", value: "50% LP vote", flag: "green", source: "LPA" },
        { label: "GP Removal — No Fault", value: "75% LP vote", flag: "green", source: "LPA" },
        { label: "Key Person Clause", value: "Triggered if any 2 of Vega/Donovan/Foster cease substantially full-time involvement", flag: "green", source: "LPA" },
      ]},
    ],
  },
  5: {
    name: "Service Providers, Delegation & Oversight", rating: "GREEN",
    summary: "Top-tier service providers: SS&C as administrator, PwC as auditor (since 2010), JPMorgan Chase as primary bank, Goodwin Procter as fund counsel. Long-standing relationships across all major providers. Annual SOC 1 reviews. Detailed property-level vendor management.",
    findings: `### Administrator

SS&C Technologies serves as Havencrest's fund administrator across all five funds (since 2010). SS&C provides full middle- and back-office services including NAV calculation, investor capital activity, AML/KYC, FATCA/CRS, and REIT testing support. Sandra Chen (CFO) reviews SS&C's annual SOC 1 Type II report and conducts quarterly relationship calls.

### Auditor

PricewaterhouseCoopers LLP audits the fund and has served as Havencrest's auditor since 2010. PwC's annual opinion is delivered within 90 days of fiscal year-end. Audit fee for FY2024 was $580,000. PwC also reviews REIT compliance as part of the annual audit. No restatements, material weaknesses, or significant deficiencies have been reported across the 15-year audit history.

### Primary Banking

JPMorgan Chase, N.A. serves as Havencrest's primary banking relationship at both the fund and property-SPV level. Property-level mortgage debt is sourced from a panel of insurance company and bank lenders including MetLife, Pacific Life, Wells Fargo, and JPMorgan. All wire transfers require dual approval (CFO + member of Executive Committee).

### Independent Appraiser

Cushman & Wakefield serves as primary independent appraiser, providing quarterly external appraisals on all properties. CBRE serves as secondary appraiser, providing semi-annual appraisals on a rotating subset of properties to maintain independence and quality control.

### Property Management

Property management is outsourced to four primary regional management companies (Lincoln Industrial, JLL Industrial, Cushman & Wakefield Services, and Trammell Crow), each covering geographic regions. Each property management agreement includes detailed performance KPIs, monthly reporting requirements, and annual operational audits. Havencrest's asset management team oversees property managers and conducts annual property visits.

### Legal Counsel

Goodwin Procter LLP serves as primary fund counsel and outside transaction counsel. Sidley Austin serves as REIT tax counsel.

### Chapter Summary

The chapter is rated GREEN. Service providers are institutional-quality with long-standing relationships (15-year auditor tenure, 15-year administrator tenure). Independent appraisal cadence (quarterly + rotating secondary) provides robust valuation oversight.`,
    docCategories: ["Service Providers"], riskObsIds: [],
    verificationCategory: "service_providers",
    dataPoints: [
      { group: "Service Providers", items: [
        { label: "Administrator", value: "SS&C Technologies (since 2010)", flag: "green", source: "Admin Agreement" },
        { label: "Auditor", value: "PricewaterhouseCoopers LLP (since 2010)", flag: "green", source: "Audit Letter" },
        { label: "Primary Bank", value: "JPMorgan Chase, N.A.", source: "DDQ" },
        { label: "Property Mortgage Lenders", value: "MetLife, Pacific Life, Wells Fargo, JPMorgan (panel)", source: "DDQ" },
        { label: "Fund Counsel", value: "Goodwin Procter LLP", source: "DDQ" },
        { label: "REIT Tax Counsel", value: "Sidley Austin LLP", source: "DDQ" },
      ]},
      { group: "Independent Appraisal", items: [
        { label: "Primary Appraiser", value: "Cushman & Wakefield — quarterly on all properties", flag: "green", source: "DDQ" },
        { label: "Secondary Appraiser", value: "CBRE — semi-annual on rotating subset", flag: "green", source: "DDQ" },
      ]},
      { group: "Property Management", items: [
        { label: "Property Managers", value: "Lincoln Industrial, JLL Industrial, Cushman & Wakefield Services, Trammell Crow (4 regional)", flag: "green", source: "DDQ" },
        { label: "Performance KPI Oversight", value: "Monthly reporting + annual operational audits per agreement", flag: "green", source: "DDQ" },
        { label: "Annual Property Visits", value: "Conducted by Havencrest asset management team", flag: "green", source: "DDQ" },
      ]},
      { group: "Audit History", items: [
        { label: "Audit Tenure", value: "15 years (PwC since 2010)", source: "Audit Letter" },
        { label: "Annual Audit Fee (FY2024)", value: "$580,000", source: "DDQ" },
        { label: "Restatements / Material Weaknesses", value: "None across 15-year history", flag: "green", source: "Audit Letter" },
      ]},
    ],
  },
  6: {
    name: "Investment Operations & Portfolio Controls", rating: "YELLOW",
    summary: "Disciplined 6-person Investment Committee with majority approval. Robust acquisition diligence (QofE, Phase I/II, MEP inspection). Tenant concentration the principal concern — Amazon at 11.8% (near 12% cap), top 3 tenants combined 28% of NOI. Conservative 51% portfolio LTV vs. 55% cap. Asset-level non-recourse debt on stabilized assets.",
    findings: `### Investment Committee & Approval

The Investment Committee comprises six voting members: Patricia Vega (CEO), Mark Donovan (CIO), Lauren Foster (Head of Acquisitions), Robert Kim (Head of Asset Management), Sandra Chen (CFO), plus an independent industry consultant on retainer (a former senior Prologis executive). Approval requires majority (4 of 6) consent. The IC meets weekly with ad-hoc sessions for time-sensitive opportunities.

The independent IC member is a meaningful structural improvement over typical industry practice and provides additional perspective on acquisition decisions.

### Acquisition Diligence

Havencrest's acquisition process includes: site visits by acquisitions and asset management teams, Phase I environmental site assessment (Phase II as flagged), property condition assessment, mechanical/electrical/plumbing inspection, third-party appraisal, market study, and tenant credit analysis. Quality of Earnings reports are commissioned for all acquisitions above $50 million in gross purchase price; cash flow analysis by Havencrest's underwriting team is performed for smaller acquisitions.

### Tenant Concentration (Primary Concern)

Industrial real estate inherently carries tenant concentration risk in the e-commerce-driven warehouse strategy. As of December 31, 2025, the largest single tenant (Amazon) represents 11.8% of fund NOI, near the 12% LPA cap. The top 3 tenants combined (Amazon, FedEx, Walmart) represent 28% of fund NOI. Top 10 tenants represent 51% of fund NOI.

Havencrest mitigates this concentration through: (1) credit underwriting at the tenant level for all leases over 100,000 SF, (2) long-term lease durations (weighted-average remaining lease term across the portfolio is 8.4 years), (3) tenant credit quality skew — 82% of NOI from investment-grade rated tenants, and (4) geographic diversification across primary logistics corridors.

### Leverage

Asset-level financing is sourced from insurance company and bank lenders at 50–55% LTV per asset, with fixed-rate non-recourse debt on stabilized properties. Fund-level portfolio LTV as of December 31, 2025 is 51% — conservative relative to the 55% LPA cap.

### Operational Controls

Property-level performance is tracked through Yardi Voyager with monthly KPIs (occupancy, leasing pipeline, capex spend, NOI vs. budget). Quarterly portfolio reviews are conducted by the asset management team and presented to the IC.

### Chapter Summary

The chapter is rated YELLOW solely due to tenant concentration: Amazon at 11.8% (near the 12% cap) and top 3 tenants at 28% of NOI. The concentration is largely industry-inherent in modern industrial logistics — and is well-mitigated by credit quality (82% IG-rated NOI) and lease duration (8.4-year WALT) — but warrants monitoring. The chapter would otherwise be GREEN: IC structure is exemplary, diligence process is institutional-grade, leverage is conservative.`,
    docCategories: ["Investment Ops"], riskObsIds: ["HO-001", "HO-002"],
    verificationCategory: "investment_ops",
    dataPoints: [
      { group: "Investment Committee", items: [
        { label: "Voting Members", value: "6 (Vega CEO, Donovan CIO, Foster, Kim, Chen, + Independent Consultant)", flag: "green", source: "DDQ" },
        { label: "Independent IC Member", value: "Former senior Prologis executive on retainer", flag: "green", source: "DDQ" },
        { label: "Approval Threshold", value: "Majority (4 of 6)", flag: "green", source: "DDQ" },
        { label: "Meeting Cadence", value: "Weekly + ad-hoc", source: "DDQ" },
      ]},
      { group: "Acquisition Diligence", items: [
        { label: "Site Visits", value: "Required by both acquisitions and asset mgmt teams", flag: "green", source: "DDQ" },
        { label: "Environmental", value: "Phase I mandatory; Phase II as flagged", flag: "green", source: "DDQ" },
        { label: "MEP Inspection", value: "Mandatory mechanical/electrical/plumbing inspection", flag: "green", source: "DDQ" },
        { label: "Quality of Earnings", value: "Mandatory for acquisitions > $50M", flag: "green", source: "DDQ" },
        { label: "Tenant Credit Analysis", value: "Mandatory for leases > 100,000 SF", flag: "green", source: "DDQ" },
      ]},
      { group: "Tenant Concentration", items: [
        { label: "Single-Tenant Cap", value: "12% of total commitments (NOI basis)", source: "LPA" },
        { label: "Largest Tenant (Amazon)", value: "11.8% of fund NOI (near cap)", flag: "yellow", source: "DDQ" },
        { label: "Top 3 Tenants (Amazon, FedEx, Walmart)", value: "28% of fund NOI", flag: "yellow", source: "DDQ" },
        { label: "Top 10 Tenants", value: "51% of fund NOI", flag: "yellow", source: "DDQ" },
        { label: "Investment-Grade Rated NOI", value: "82% of fund NOI", flag: "green", source: "DDQ" },
        { label: "Weighted Average Remaining Lease Term", value: "8.4 years", flag: "green", source: "DDQ" },
      ]},
      { group: "Leverage & Operations", items: [
        { label: "Fund-Level LTV (12/31/2025)", value: "51% (vs. 55% LPA cap)", flag: "green", source: "DDQ" },
        { label: "Debt Structure", value: "Asset-level non-recourse, fixed-rate", flag: "green", source: "DDQ" },
        { label: "Property KPI Tracking", value: "Yardi Voyager — monthly KPIs", flag: "green", source: "DDQ" },
        { label: "Portfolio Reviews", value: "Quarterly to IC", flag: "green", source: "DDQ" },
      ]},
    ],
  },
  7: {
    name: "Valuation, Asset Existence & Investor Reporting", rating: "GREEN",
    summary: "Quarterly third-party appraisal by Cushman & Wakefield on 100% of portfolio. Secondary semi-annual appraisal by CBRE on rotating subset. Cushman serves as primary valuation agent of record. Valuation Committee 4 non-investment of 6 members. Quarterly investor reports timely. Audited annual financials within 90 days.",
    findings: `### Valuation Process

Havencrest values its industrial portfolio quarterly under ASC 820 fair-value framework. The valuation process is led by an independent third-party appraiser — Cushman & Wakefield — which provides quarterly appraisals on 100% of properties. Cushman serves as the primary valuation agent of record; Havencrest does not produce internal marks separate from the Cushman appraisals.

CBRE serves as a secondary appraiser providing semi-annual appraisals on a rotating subset of approximately one-third of the portfolio each cycle. This rotating secondary appraisal provides quality control on the Cushman primary appraisal and is meaningfully best-in-class for Core+ industrial RE.

### Valuation Committee

The Valuation Committee comprises six members: Sandra Chen (CFO, Chair), Maria Santos (CCO), an SS&C senior representative, an outside Cushman & Wakefield engagement leader, Robert Kim (Head of Asset Management), and Mark Donovan (CIO). Non-investment members hold 4 of 6 seats (CFO, CCO, SS&C, Cushman). The committee meets quarterly to review the Cushman appraisals and approve marks.

### Asset Existence

Property existence and ownership is verified by SS&C through annual review of title insurance policies and deeds. PwC verifies property existence as part of the annual audit.

### Investor Reporting

Quarterly investor reports are delivered within 45 days of quarter-end and include: portfolio-level NAV summary, property-level performance commentary (top 20 properties + new acquisitions and dispositions), tenant concentration metrics, debt summary, leasing activity, and market outlook. Audited annual financials are delivered within 90 days of fiscal year-end.

### Waterfall

Carry waterfall is calculated by SS&C through their proprietary system, reviewed by Sandra Chen and approved by Maria Santos.

### Chapter Summary

The chapter is rated GREEN. Independent quarterly appraisal by Cushman as primary valuation agent of record (not just reviewer), supplemented by rotating semi-annual CBRE appraisals, is exemplary practice. Valuation Committee composition with 4-of-6 non-investment majority is strong. Reporting cadence is timely.`,
    docCategories: ["Valuation"], riskObsIds: [],
    verificationCategory: "valuation",
    dataPoints: [
      { group: "Valuation Process", items: [
        { label: "Framework", value: "Quarterly ASC 820 fair-value", source: "Valuation Policy" },
        { label: "Valuation Agent of Record", value: "Cushman & Wakefield (independent third-party — not Havencrest)", flag: "green", source: "Valuation Policy" },
        { label: "Primary Appraisal Cadence", value: "Quarterly on 100% of properties", flag: "green", source: "DDQ" },
        { label: "Secondary Appraisal", value: "CBRE — semi-annual on rotating ~1/3 subset", flag: "green", source: "DDQ" },
      ]},
      { group: "Valuation Committee", items: [
        { label: "Composition", value: "6 members; 4 non-investment (CFO/Chair, CCO, SS&C, Cushman)", flag: "green", source: "Valuation Policy" },
        { label: "Approval Threshold", value: "Majority vote", source: "Valuation Policy" },
        { label: "Meeting Cadence", value: "Quarterly", source: "Valuation Policy" },
      ]},
      { group: "Asset Existence & Reporting", items: [
        { label: "Property Existence Verification", value: "SS&C annual title/deed review + PwC annual audit", flag: "green", source: "DDQ" },
        { label: "Quarterly Reports", value: "Within 45 days; property-level commentary on top 20", flag: "green", source: "DDQ" },
        { label: "Audited Financial Statements", value: "Within 90 days of fiscal year-end", flag: "green", source: "DDQ" },
      ]},
      { group: "Waterfall", items: [
        { label: "Waterfall Calculation", value: "SS&C proprietary system", flag: "green", source: "DDQ" },
        { label: "Review", value: "Sandra Chen (CFO); approved by Maria Santos (CCO)", flag: "green", source: "DDQ" },
      ]},
    ],
  },
  8: {
    name: "Manager Transparency & LP Communications", rating: "GREEN",
    summary: "Cooperative diligence posture, prompt thorough responses. Quarterly investor letters with property-level commentary. Annual investor day in Chicago with portfolio tours. Robust 9-seat LPAC. Side letter scope reasonable. No material LP complaints in 17-year history.",
    findings: `### Diligence Engagement

Havencrest's response to Alpine's diligence requests was prompt, thorough, and accompanied by full supporting documentation. All Executive Committee members were made available for interviews, plus the IR team coordinated all property-level documentation. The Manager provided full data room access including audit working papers (reviewed under non-disclosure).

### Investor Communications

Havencrest produces quarterly investor letters within 45 days of each quarter-end. Letters are approximately 22–28 pages and include: portfolio-level performance metrics, property-level commentary on top 20 properties, new acquisitions and dispositions, tenant concentration metrics, leasing activity by region, and market outlook. Letters are signed by Patricia Vega (CEO) and Mark Donovan (CIO).

The firm hosts an annual investor day each May in Chicago attended by approximately 78% of LPs by capital. The agenda includes market positioning, property tours of two Chicago-area assets, and Q&A with the Executive Committee. Periodic regional investor days in Atlanta or Los Angeles are held biennially.

### LPAC

The LPAC has 9 seats with broad geographic and investor-type representation. Meetings are held twice annually in person plus quarterly by video. Standing LPAC quorum across the past three years has been 94%.

### Side Letters

Side letter scope is reasonable: most letters address regulatory disclosures, ERISA/UBTI exclusions, fee step-downs for commitments above $50M, and MFN rights. SS&C administers MFN with all eligible LPs notified of new terms.

### Chapter Summary

The chapter is rated GREEN. Havencrest's transparency posture is institutional-grade with detailed quarterly reporting, robust LPAC engagement, and consistent annual investor days. No material LP complaints have been raised in 17-year firm history.`,
    docCategories: ["Transparency"], riskObsIds: [],
    verificationCategory: "transparency",
    dataPoints: [
      { group: "Diligence Engagement", items: [
        { label: "Document Availability", value: "Full data room access including audit working papers", flag: "green", source: "DDQ" },
        { label: "Executive Access", value: "All Executive Committee members made available for interviews", flag: "green", source: "DDQ" },
      ]},
      { group: "Investor Reporting", items: [
        { label: "Quarterly Letter", value: "Within 45 days; 22–28 pages with top-20 property commentary", flag: "green", source: "Q4 2025 Letter" },
        { label: "Annual Investor Day", value: "Each May in Chicago; ~78% LP attendance by capital", flag: "green", source: "DDQ" },
        { label: "Property Tours", value: "2 properties included in each annual investor day", flag: "green", source: "DDQ" },
        { label: "Regional Investor Days", value: "Biennial in Atlanta or Los Angeles", source: "DDQ" },
      ]},
      { group: "LPAC", items: [
        { label: "Composition", value: "9 seats — broad investor representation", flag: "green", source: "LPA" },
        { label: "Meeting Cadence", value: "Twice annually in person + quarterly video", flag: "green", source: "LPA" },
        { label: "Standing Quorum (3 yrs)", value: "94%", flag: "green", source: "DDQ" },
      ]},
    ],
  },
};

// ── Source metadata ───────────────────────────────────────────────────────────

export const HAVENCREST_SOURCE_META: Record<string, { label: string; type: string; filename?: string; size?: string }> = {
  "sample_re_havencrest_trust.pdf": { label: "Havencrest Industrial Trust V — ODD Report (April 2026)", type: "ODD Report", filename: "sample_re_havencrest_trust.pdf", size: "1.6 MB" },
  "DDQ": { label: "Due Diligence Questionnaire (2026)", type: "Fund Document", filename: "havencrest_ddq_2026.pdf" },
  "Form ADV": { label: "Form ADV — March 2026", type: "Regulatory Filing" },
  "LPA": { label: "Limited Partnership Agreement — Trust V", type: "Fund Document" },
  "PPM": { label: "Private Placement Memorandum — Trust V", type: "Fund Document" },
  "Valuation Policy": { label: "Valuation Policy (Jan 2026)", type: "Operations Document" },
  "Code of Ethics": { label: "Code of Ethics (Jan 2026)", type: "Compliance Document" },
  "WISP": { label: "Written Information Security Program (2026)", type: "Compliance Document" },
  "SOC 2 Report": { label: "SOC 2 Type II Report — FY2025 (Schneider Downs)", type: "Third-Party Audit" },
  "Admin Agreement": { label: "Administration Agreement — SS&C", type: "Service Provider Agreement" },
  "Audit Letter": { label: "PwC — Audit Confirmation", type: "Third-Party Confirmation" },
  "Insurance Cert": { label: "Cyber Liability Insurance Certificate", type: "Insurance" },
  "Q4 2025 Letter": { label: "Q4 2025 Investor Letter", type: "Investor Communication" },
  "SEC_EDGAR": { label: "SEC EDGAR — IARD Registered Adviser Search", type: "SEC Verification" },
  "Delaware Register": { label: "Delaware Division of Corporations — Direct Check", type: "SEC Verification" },
};

// ── Mock fund-level data ──────────────────────────────────────────────────────

export const HAVENCREST_MOCK = {
  fund: {
    name: "Havencrest Industrial Trust V, L.P.",
    manager: "Havencrest Real Estate Advisors, LLC",
    strategy: "Core+ Industrial / Logistics Real Estate",
    aum: "$3.42B firmwide (excl. $785M uncalled)",
    overall_rating: "GREEN",
    odd_score: 81,
    odd_percentile: "76th",
    domicile: "Delaware LP (Cayman feeder; via Delaware REIT)",
    fund_nav: "$980M raised; ~31% deployed",
    recommendation_summary: "recommends an <b>accept</b> rating. Havencrest operates an institutional-grade Core+ industrial RE platform with a deep team, distributed ownership, exemplary independent valuation practice, and conservative leverage. The single YELLOW chapter (Investment Operations) reflects industry-inherent tenant concentration in the e-commerce-driven industrial strategy, well-mitigated by tenant credit quality and lease duration.",
    conditions_summary: "Post-close monitoring: track Amazon and top-3 tenant concentration quarterly against contractual caps; monitor lease renewal dynamics for largest tenants.",
  },
  risk_observations: [
    { id: "HO-001", severity: "MEDIUM", topic: "Investment Operations & Portfolio Controls", title: "Amazon tenant concentration approaching contractual cap",
      detail: "As of December 31, 2025, Amazon represents 11.8% of fund NOI, near the 12% LPA cap. While well-mitigated by Amazon's investment-grade credit and long lease durations across multiple buildings, the proximity to the cap warrants monitoring.",
      remediation: "Investors should monitor Amazon's quarterly disclosure; LPAC should formally affirm understanding of the cap at each annual review." },
    { id: "HO-002", severity: "MEDIUM", topic: "Investment Operations & Portfolio Controls", title: "Top 3 tenants represent 28% of fund NOI",
      detail: "Amazon, FedEx, and Walmart combined represent 28% of fund NOI. While all three are investment-grade rated with long-term lease commitments, the concentration represents industry-inherent risk in e-commerce-driven industrial logistics strategies.",
      remediation: "Maintain tenant diversification through new acquisitions; monitor for credit deterioration in any of the top-3 tenants." },
  ],
  strengths: [
    { title: "Independent third-party appraiser as primary valuation agent of record",
      detail: "Cushman & Wakefield serves as primary valuation agent of record (not just reviewer), providing quarterly appraisals on 100% of properties. CBRE provides semi-annual rotating secondary appraisals on approximately one-third of the portfolio. Havencrest does not produce internal marks separate from Cushman appraisals. This is exemplary independent valuation practice — a meaningful institutional best practice." },
    { title: "Conservative fund-level leverage at 51% LTV (vs. 55% LPA cap)",
      detail: "Asset-level non-recourse fixed-rate financing on stabilized industrial properties. Fund-level portfolio LTV of 51% as of December 31, 2025 is below the 55% LPA cap, providing cushion against valuation movement. The 55% LTV cap is itself conservative for the industrial strategy where 60–65% is industry-typical." },
    { title: "Independent Investment Committee member provides perspective",
      detail: "The 6-person IC includes a former senior Prologis executive on retainer as an independent voting member. This is a meaningful structural improvement over typical industry practice and provides additional perspective on acquisition decisions." },
    { title: "Long-tenured service provider relationships and clean audit history",
      detail: "PwC has served as auditor since fund inception (15-year tenure). SS&C has served as administrator since 2010 (15-year tenure). No restatements, material weaknesses, or significant deficiencies in audit history. Quarterly third-party appraisal by Cushman with rotating CBRE secondary." },
    { title: "Distributed employee ownership with 5-year deferred carry vesting",
      detail: "82% of Havencrest is owned by 23 senior-level professionals. Carry vests over five years across all carry-eligible staff. This combination creates strong long-term incentive alignment between investment professionals and LPs." },
  ],
};

// ── Collection / source documents ─────────────────────────────────────────────

export const HAVENCREST_COLLECTION_DOCS: Array<{ name: string; type: string; filename: string }> = [
  { name: "Havencrest Industrial Trust V — ODD Report (April 2026)", type: "ODD Report",            filename: "sample_re_havencrest_trust.pdf" },
  { name: "Form ADV — March 2026",                                   type: "Regulatory Filing",     filename: "havencrest_form_adv.pdf" },
  { name: "Limited Partnership Agreement — Trust V",                 type: "Fund Document",         filename: "havencrest_lpa.pdf" },
  { name: "Private Placement Memorandum — Trust V",                  type: "Fund Document",         filename: "havencrest_ppm.pdf" },
  { name: "Due Diligence Questionnaire (2026)",                      type: "Fund Document",         filename: "havencrest_ddq_2026.pdf" },
  { name: "Valuation Policy (January 2026)",                         type: "Operations Document",   filename: "havencrest_valuation_policy.pdf" },
  { name: "Compliance Manual (January 2026)",                        type: "Compliance Document",   filename: "havencrest_compliance_manual.pdf" },
  { name: "Audited Financial Statements FY2024",                     type: "Financial Document",    filename: "havencrest_audited_fs_fy2024.pdf" },
];
