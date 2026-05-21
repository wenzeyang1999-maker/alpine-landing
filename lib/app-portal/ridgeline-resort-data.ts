/**
 * Ridgeline Resort Holdings III, L.P. — static demo data for the Investor Portal report reader.
 *
 * ODD review of Ridgeline Resort Holdings III, L.P. (Opportunistic Hospitality Real Estate)
 * Manager: Ridgeline Resort Capital, LLC
 *
 * NOTE: this is a distinct firm from the existing "Ridgeline Capital Partners, LLC"
 * (Global Long/Short Equity) — same surname coincidence, different manager.
 *
 * Overall rating: YELLOW (26 flags, 0 RED chapters, 4 YELLOW chapters)
 */

import type { TopicInfo, TopicDataGroup } from "./ridgeline-data";

export type { TopicInfo, TopicDataGroup };

// ── 8-Topic ODD assessment data (Ridgeline Resort Holdings III) ──────────────

export const RIDGELINE_RESORT_TOPIC_DATA: Record<number, TopicInfo> = {
  1: {
    name: "Manager, Ownership & Governance", rating: "YELLOW",
    summary: "Mid-sized hospitality RE platform founded 2015. Third fund. 22 FTEs concentrated in acquisitions, asset management, and revenue management. Two-founder ownership (60/40). Single managing partner (Jonathan Reid) drives final acquisition decisions. No formal succession plan. GP commits 2% in cash.",
    findings: `### Management Company and Affiliates

Ridgeline Resort Capital, LLC ("Ridgeline Resort" or the "Manager") was founded in 2015 by Jonathan Reid (Managing Partner, CIO) and Catherine Walsh (Co-Founder, COO), both previously senior hospitality investment professionals at Starwood Capital Group. Ridgeline Resort is headquartered in Miami with a regional office in Phoenix and a satellite presence in Denver for ski-resort exposure. The firm focuses on opportunistic hospitality real estate: luxury and upper-upscale resorts, boutique urban hotels in primary travel destinations, and selective ski-resort acquisitions.

### Strategy & Fund Series

Ridgeline Resort employs a value-add to opportunistic hospitality strategy: acquiring underperforming or rebrand-candidate assets, repositioning operations through brand affiliation changes, capex renovation programs, and revenue management optimization, then exiting to strategic operators or institutional capital after 4–6 years of stabilization.

The firm has raised three funds: Ridgeline Resort I (2016, $185M, fully realized), Ridgeline Resort II (2020, $385M, ~58% realized), and Ridgeline Resort III (current, $750M target / $850M hard cap, $470M raised through December 2025).

### Assets under Management

Ridgeline Resort reported firmwide net assets of $720 million as of December 31, 2025, plus $310M in uncalled capital. The firm has acquired 24 hospitality assets across the three vintages, comprising 8,400 keys.

### Ownership & Succession

Jonathan Reid owns 60% of Ridgeline Resort; Catherine Walsh owns 40%. The two founders have known each other for 18 years, having worked together at Starwood. Alpine notes the binary ownership structure presents concentrated decision-making — no third senior partner exists to provide independent perspective in a dispute. No formal written succession plan exists. Key person life insurance of $10 million is in place on Jonathan only — Catherine is not covered.

### Human Resources

Ridgeline Resort employs 22 full-time professionals: 8 acquisitions, 6 asset management, 3 revenue management (specialized RM team — a strength for hospitality), 3 operations and finance, 1 compliance, and 1 administrative. Investment professionals average 10 years of hospitality experience.

Recent departures: Marcus Davenport (Senior Asset Manager) departed in July 2025 to join Hyatt Capital. Background checks are performed by HireRight on initial hire only; no refresh cadence.

### Chapter Summary

The chapter is rated YELLOW due to: (1) two-founder ownership without a third senior partner; (2) no formal written succession plan; (3) key person insurance limited to Jonathan only; (4) one senior asset manager departure in 2025; and (5) initial-only background check cadence.`,
    docCategories: ["Governance"], riskObsIds: ["RO-001", "RO-002"],
    verificationCategory: "governance",
    dataPoints: [
      { group: "Management Company", items: [
        { label: "Manager Name", value: "Ridgeline Resort Capital, LLC", source: "Form ADV" },
        { label: "Date of Formation", value: "January 17, 2015", source: "Delaware Register" },
        { label: "Primary Location", value: "Miami, FL (HQ); Phoenix, AZ (regional); Denver, CO (satellite)", source: "Form ADV" },
        { label: "Total Headcount", value: "22 FTEs (8 acquisitions, 6 asset mgmt, 3 revenue mgmt, 3 ops, 1 compliance, 1 admin)", source: "DDQ" },
        { label: "AUM (Net Assets, 12/31/2025)", value: "$720 million", source: "Form ADV" },
        { label: "Uncalled Capital", value: "$310 million", source: "DDQ" },
        { label: "Total Properties / Keys", value: "24 properties / 8,400 keys across three vintages", source: "DDQ" },
      ]},
      { group: "Founders & Senior Team", items: [
        { label: "Managing Partner / CIO", value: "Jonathan Reid — 60% owner; former Director, Starwood Capital", flag: "yellow", source: "Form ADV" },
        { label: "Co-Founder / COO", value: "Catherine Walsh — 40% owner; former Senior VP Asset Mgmt, Starwood Capital", source: "Form ADV" },
        { label: "Head of Acquisitions", value: "Ryan Thompson — joined 2017; former Director, Brookfield Hotels", source: "DDQ" },
        { label: "Head of Revenue Management", value: "Anita Krishnan — joined 2019; former Marriott corporate RM", flag: "green", source: "DDQ" },
        { label: "Chief Financial Officer", value: "David Park — joined 2018; CPA; former Hersha Hospitality", source: "DDQ" },
      ]},
      { group: "Governance & Ownership", items: [
        { label: "Ownership", value: "Reid 60%, Walsh 40%", flag: "yellow", source: "Form ADV" },
        { label: "GP Commitment (Fund III)", value: "2.0% in cash (~$17M at $850M hard cap); pari passu", flag: "green", source: "LPA" },
        { label: "Succession Plan", value: "Not formalized in writing", flag: "yellow", source: "DDQ" },
        { label: "Key Person Insurance", value: "$10M on Jonathan Reid only — Catherine Walsh not covered", flag: "yellow", source: "DDQ" },
        { label: "Background Checks", value: "External (HireRight) on initial hire; no refresh cadence", flag: "yellow", source: "DDQ" },
      ]},
      { group: "Recent Turnover", items: [
        { label: "Marcus Davenport", value: "Senior Asset Manager — departed July 2025 to Hyatt Capital", flag: "yellow", source: "DDQ" },
      ]},
      { group: "Fund Series Track Record", items: [
        { label: "Ridgeline Resort I (2016)", value: "$185M — fully realized; 16.8% gross IRR / 1.81x MOIC", source: "DDQ" },
        { label: "Ridgeline Resort II (2020)", value: "$385M — ~58% realized; 13.4% gross IRR (interim — affected by COVID hold period)", flag: "yellow", source: "DDQ" },
        { label: "Ridgeline Resort III (current)", value: "$750M target / $850M hard cap; $470M raised through 12/2025", source: "DDQ" },
      ]},
    ],
  },
  2: {
    name: "Legal, Regulatory & Compliance", rating: "YELLOW",
    summary: "SEC ERA status — planned RIA transition Q4 2026. Single in-house compliance professional (Susan Mitchell). Engaged Cipperman Compliance Services as outside consultant. Personal trading policy adequate. No regulatory actions; one settled wage-and-hour claim at a JV II property (against operator, not Ridgeline directly).",
    findings: `### Regulatory Status

Ridgeline Resort Capital, LLC is a U.S. Securities and Exchange Commission ("SEC") Exempt Reporting Adviser ("ERA") under Section 203(m) of the Investment Advisers Act, filed since 2017. Current AUM ($720M) exceeds the threshold for full RIA registration; the Manager indicated transition to full RIA registration is planned for Q4 2026.

### Compliance Program

Susan Mitchell serves as Chief Compliance Officer, dedicated to compliance with no investment role. She joined Ridgeline Resort in 2020 from Cipperman Compliance Services where she had been an analyst. While Susan is dedicated to compliance (a strength relative to the COO/CCO combos common at this manager size), she is the sole in-house compliance professional, which limits bandwidth.

Ridgeline Resort engages Cipperman Compliance Services as outside compliance consultant since inception. Cipperman performs an annual compliance review and supports Susan with regulatory filings, code of ethics enforcement, policy updates, and the planned RIA transition. The compliance manual is dated September 2024 — a 2026 revision is in progress to support the RIA transition.

### Code of Ethics & Personal Trading

The Code of Ethics requires pre-clearance for all securities transactions other than open-end mutual funds and US Treasuries. Brokerage statements are submitted quarterly by employees through Cipperman's portal (not custodian-direct collection). 30-day minimum holding period applies. Annual attestations are completed.

### Litigation & Regulatory History

Ridgeline Resort has had no SEC examinations or regulatory actions. The firm has not been a party to any material litigation. Alpine notes that one Ridgeline II property (a 280-key resort in Arizona) was subject to a wage-and-hour class action by housekeeping staff — the action named the third-party hotel operator (not Ridgeline) and was settled in 2024 for an undisclosed amount. The settlement was paid by the operator's insurance and did not impact fund returns.

### Chapter Summary

The chapter is rated YELLOW due to: (1) pending RIA transition planned for Q4 2026; (2) single in-house compliance FTE limiting bandwidth as AUM scales; (3) employee self-reported brokerage statements rather than custodian-direct; and (4) compliance manual currency (last revision 2024, refresh in progress).`,
    docCategories: ["Compliance"], riskObsIds: ["RO-003", "RO-004"],
    verificationCategory: "compliance",
    dataPoints: [
      { group: "Regulatory Status", items: [
        { label: "SEC Status", value: "Exempt Reporting Adviser (ERA) — full RIA transition planned Q4 2026", flag: "yellow", source: "SEC_EDGAR" },
        { label: "Form ADV Last Filing", value: "ERA annual filing March 2026", source: "Form ADV" },
      ]},
      { group: "Compliance Team", items: [
        { label: "Chief Compliance Officer", value: "Susan Mitchell — dedicated, no investment role; joined 2020 from Cipperman", flag: "green", source: "DDQ" },
        { label: "Compliance Headcount", value: "1 in-house FTE (sole)", flag: "yellow", source: "DDQ" },
        { label: "Outside Compliance Consultant", value: "Cipperman Compliance Services (since inception 2015)", flag: "green", source: "DDQ" },
        { label: "Annual Compliance Review", value: "Performed by Cipperman; most recent December 2025", flag: "green", source: "DDQ" },
        { label: "Compliance Manual Currency", value: "Dated September 2024; 2026 revision in progress for RIA transition", flag: "yellow", source: "DDQ" },
      ]},
      { group: "Personal Trading Controls", items: [
        { label: "Pre-Clearance", value: "All preclearable securities", flag: "green", source: "Code of Ethics" },
        { label: "Brokerage Statements", value: "Quarterly employee self-reporting via Cipperman portal", flag: "yellow", source: "DDQ" },
        { label: "Minimum Holding Period", value: "30 days", flag: "green", source: "Code of Ethics" },
      ]},
      { group: "Litigation & Regulatory History", items: [
        { label: "SEC Examinations", value: "None", flag: "green", source: "SEC_EDGAR" },
        { label: "Direct Litigation Against Ridgeline Resort", value: "None material", flag: "green", source: "DDQ" },
        { label: "Indirect Exposure", value: "JV II Arizona resort wage-and-hour class action (against operator) — settled 2024 by operator insurance", flag: "yellow", source: "DDQ" },
      ]},
    ],
  },
  3: {
    name: "Technology, Cybersecurity & Business Resilience", rating: "YELLOW",
    summary: "Microsoft 365 + Yardi + STR Hospitality benchmarking. Vantage Tech as outsourced IT since 2022. No SOC 2 audit. First external penetration test conducted 2024. KnowBe4 phishing. Basic BCP — last tabletop in 2023. Cyber insurance $7.5M (modest for AUM).",
    findings: `### Infrastructure

Ridgeline Resort operates on Microsoft 365 productivity stack supplemented by Yardi Voyager for property accounting and asset management, STR (Smith Travel Research) and HotStats for hospitality benchmarking, and Salesforce for CRM and investor relations. Single sign-on through Microsoft Entra ID with mandatory MFA. Microsoft Defender provides endpoint protection without DLP.

### Cybersecurity Program

Vantage Tech LLC has served as Ridgeline Resort's outsourced IT and cybersecurity provider since 2022. Vantage provides patch management, endpoint monitoring, identity management, and incident response support.

Ridgeline Resort has not commissioned a SOC 2 audit. First external penetration testing was performed by Bishop Fox in September 2024 (4 medium findings, all remediated). Annual recurrence is planned but a second cycle has not yet been completed. KnowBe4 phishing simulations run quarterly through Vantage; rolling 4-quarter click rate is 5.2%, above the 3.2% financial services benchmark.

### Resilience

Ridgeline Resort maintains a Written Information Security Program (WISP), Incident Response Plan (IRP), and Business Continuity Plan (BCP). The most recent tabletop exercise was conducted in May 2023 — Alpine notes more than 30 months have elapsed without retest, which is longer than institutional best practice.

The firm has not experienced any material cybersecurity incidents in the past five years.

### Insurance

Cyber liability insurance limit is $7.5 million per occurrence / $7.5 million aggregate — modest for the firm's $720M AUM (institutional benchmarks typically $10M+ at this AUM scale, with higher coverage warranted for hospitality given guest payment card data exposure).

### Chapter Summary

The chapter is rated YELLOW due to: (1) no SOC 2 audit; (2) annual pen test cadence not yet evidenced (only one test in 2024); (3) phishing click rate above industry benchmark; (4) BCP tabletop not performed since 2023; and (5) cyber insurance below benchmark for AUM and hospitality data risk profile.`,
    docCategories: ["Technology"], riskObsIds: ["RO-005", "RO-006"],
    verificationCategory: "cybersecurity",
    dataPoints: [
      { group: "Infrastructure", items: [
        { label: "Productivity Platform", value: "Microsoft 365", source: "DDQ" },
        { label: "Property / Asset Systems", value: "Yardi Voyager + STR + HotStats", source: "DDQ" },
        { label: "Identity & Access", value: "Microsoft Entra ID SSO + mandatory MFA", flag: "green", source: "DDQ" },
        { label: "Endpoint Protection", value: "Microsoft Defender (no DLP)", flag: "yellow", source: "DDQ" },
      ]},
      { group: "Cybersecurity Program", items: [
        { label: "Outsourced IT/Cyber", value: "Vantage Tech LLC (since 2022)", flag: "green", source: "DDQ" },
        { label: "SOC 2 Audit", value: "Not commissioned", flag: "yellow", source: "DDQ" },
        { label: "External Penetration Testing", value: "First test September 2024 (Bishop Fox) — annual cadence planned, not yet evidenced", flag: "yellow", source: "DDQ" },
        { label: "Phishing Click Rate", value: "5.2% (rolling 4 quarters; vs. 3.2% industry benchmark)", flag: "yellow", source: "DDQ" },
      ]},
      { group: "Resilience & Insurance", items: [
        { label: "WISP / IRP / BCP", value: "Maintained; last reviewed mid-2024", flag: "yellow", source: "WISP" },
        { label: "Last Tabletop Exercise", value: "May 2023 — > 30 months without retest", flag: "yellow", source: "DDQ" },
        { label: "Cyber Liability Insurance", value: "$7.5M per occurrence / $7.5M aggregate (modest for AUM + hospitality data risk)", flag: "yellow", source: "Insurance Cert" },
      ]},
    ],
  },
  4: {
    name: "Fund Structure, Terms & Investor Alignment", rating: "GREEN",
    summary: "Delaware LP + Cayman feeder. 1.50% management fee on commitments. 20% carry over 8% preferred return with 50/50 catch-up. 7-year term + two 1-yr extensions. Deal-by-deal carry with European clawback. Strong LP protections. GP 2% cash commitment.",
    findings: `### Fund Structure

Ridgeline Resort Holdings III, L.P. is structured as a Delaware limited partnership with a Cayman feeder for non-US and US tax-exempt investors. The fund invests across hospitality real estate acquisitions in the U.S. — luxury and upper-upscale resorts, boutique urban hotels, and selective ski-resort assets. Maximum single-property concentration is 12% of total commitments (higher than typical multifamily funds reflecting hospitality's per-asset capital intensity); maximum single-market concentration is 30%.

### Fees & Carried Interest

The management fee is 1.50% per annum on total commitments during the 4-year investment period, stepping to 1.25% on NAV thereafter. Carried interest is 20% over an 8% preferred return with a 50/50 catch-up. Carry is calculated on a deal-by-deal basis with a European-style full clawback at fund-end — Alpine notes that the European clawback substantially mitigates the deal-by-deal exposure to early-distribution risk.

### Term & Investment Period

The fund has a 7-year term (4-year investment + 3-year harvest) with up to two one-year extensions subject to LPAC approval. The 7-year base term is shorter than core RE strategies (10 years typical) reflecting the value-add to opportunistic positioning and 4–6 year typical hold per asset.

### GP Commitment

The General Partner has committed 2% of total commitments in cash, equating to approximately $17M at $850M hard cap.

### LP Protections

LP protections include: most-favored-nation rights for commitments over $25 million; a 7-seat LPAC; for-cause GP removal at 50% LP vote; no-fault GP removal at 75% LP vote; and a key person clause triggered if Jonathan Reid OR Catherine Walsh ceases substantially full-time involvement.

### Chapter Summary

The chapter is rated GREEN. Fund terms are reasonably aligned with institutional LP standards in opportunistic hospitality. Deal-by-deal carry is offset by European-style clawback. GP commitment is cash-funded.`,
    docCategories: ["Fund Structure"], riskObsIds: [],
    verificationCategory: "fund_structure",
    dataPoints: [
      { group: "Fund Structure", items: [
        { label: "Fund Vehicle", value: "Ridgeline Resort Holdings III, L.P. (Delaware LP)", source: "LPA" },
        { label: "Parallel Feeder", value: "Ridgeline Resort Holdings III (Cayman), Ltd.", source: "LPA" },
        { label: "Strategy", value: "Opportunistic hospitality — luxury/upper-upscale resorts, boutique urban hotels, ski resorts", source: "PPM" },
        { label: "Single-Property Concentration Cap", value: "12% of total commitments", source: "LPA" },
        { label: "Single-Market Concentration Cap", value: "30% of total commitments", source: "LPA" },
      ]},
      { group: "Fees & Carry", items: [
        { label: "Management Fee", value: "1.50% on commitments (yrs 1–4), 1.25% on NAV thereafter", flag: "green", source: "LPA" },
        { label: "Carried Interest", value: "20% over 8% preferred return; 50/50 catch-up", source: "LPA" },
        { label: "Carry Calculation", value: "Deal-by-deal", flag: "yellow", source: "LPA" },
        { label: "Clawback", value: "European-style full clawback at fund-end", flag: "green", source: "LPA" },
      ]},
      { group: "Term & GP Commitment", items: [
        { label: "Total Term", value: "7 years (4 investment + 3 harvest) + 2 one-year extensions", source: "LPA" },
        { label: "GP Commitment", value: "2.0% in cash (~$17M at $850M hard cap); pari passu", flag: "green", source: "LPA" },
      ]},
      { group: "LP Protections", items: [
        { label: "Most-Favored-Nation", value: "Available to commitments ≥ $25M", source: "LPA" },
        { label: "LPAC Seats", value: "7", source: "LPA" },
        { label: "GP Removal — For Cause", value: "50% LP vote", flag: "green", source: "LPA" },
        { label: "GP Removal — No Fault", value: "75% LP vote", flag: "green", source: "LPA" },
        { label: "Key Person Clause", value: "Triggered if Reid OR Walsh ceases substantially full-time involvement", flag: "green", source: "LPA" },
      ]},
    ],
  },
  5: {
    name: "Service Providers, Delegation & Oversight", rating: "GREEN",
    summary: "Solid service providers: SS&C as administrator, KPMG as auditor, Wells Fargo as primary bank, Goodwin Procter as fund counsel. Third-party hotel operators (Marriott, Hyatt, Hilton brand affiliates) provide property management. Detailed operator diligence process. Asset-level mortgage debt from hotel-specialist lenders.",
    findings: `### Administrator

SS&C ALPS Alternative Fund Services has served as Ridgeline Resort's fund administrator since 2018 (initially engaged for Ridgeline Resort II). SS&C provides full middle- and back-office services including NAV calculation, investor capital activity, AML/KYC, and FATCA/CRS compliance. David Park (CFO) reviews SS&C's annual SOC 1 Type II report.

### Auditor

KPMG LLP audits the fund and has served as auditor since 2018. KPMG's annual opinion is delivered within 100 days of fiscal year-end. Audit fee for FY2024 was $245,000.

### Primary Banking

Wells Fargo, N.A. serves as primary banking relationship at the fund level. Property-level mortgage debt is sourced from hotel-specialist lenders including JPMorgan, Wells Fargo, Bank of America, and selective insurance company lenders. Property-level bank accounts are held at regional banks selected by hotel operators.

### Hotel Operators (Material to Strategy)

The most critical "service provider" relationships in opportunistic hospitality are the hotel operating affiliates that handle day-to-day property management. Ridgeline Resort's properties are operated primarily under management agreements with Marriott International (8 properties), Hyatt Hotels (5 properties), and Hilton Worldwide (4 properties), with select independent operators including Two Roads Hospitality and Auberge Resorts at boutique luxury positions. Each management agreement is negotiated property-by-property with detailed performance metrics and termination rights.

Ridgeline Resort maintains a written Hotel Operator Diligence Policy requiring: financial review, operator track record analysis at comparable properties, on-site visits to operator headquarters and existing managed properties, review of operator management systems, and reference checks across hotel ownership groups.

### Legal Counsel

Goodwin Procter LLP serves as primary fund counsel. Hunton Andrews Kurth serves as hospitality transaction counsel.

### Chapter Summary

The chapter is rated GREEN. Service providers are institutional-quality and the Hotel Operator Diligence framework is appropriate for the strategy.`,
    docCategories: ["Service Providers"], riskObsIds: [],
    verificationCategory: "service_providers",
    dataPoints: [
      { group: "Service Providers", items: [
        { label: "Administrator", value: "SS&C ALPS Alternative Fund Services (since 2018)", flag: "green", source: "Admin Agreement" },
        { label: "Auditor", value: "KPMG LLP (since 2018)", flag: "green", source: "Audit Letter" },
        { label: "Primary Bank", value: "Wells Fargo, N.A.", source: "DDQ" },
        { label: "Fund Counsel", value: "Goodwin Procter LLP", source: "DDQ" },
        { label: "Hospitality Transaction Counsel", value: "Hunton Andrews Kurth", source: "DDQ" },
      ]},
      { group: "Hotel Operators", items: [
        { label: "Marriott International", value: "8 properties under management agreement", flag: "green", source: "DDQ" },
        { label: "Hyatt Hotels", value: "5 properties under management agreement", flag: "green", source: "DDQ" },
        { label: "Hilton Worldwide", value: "4 properties under management agreement", flag: "green", source: "DDQ" },
        { label: "Independent Operators", value: "Two Roads Hospitality, Auberge Resorts (luxury boutique)", source: "DDQ" },
        { label: "Operator Diligence Policy", value: "Written; financial review + on-site visits + reference checks required", flag: "green", source: "DDQ" },
      ]},
      { group: "Audit", items: [
        { label: "Audit Fee (FY2024)", value: "$245,000", source: "DDQ" },
        { label: "Audit History", value: "No restatements or material weaknesses since 2018", flag: "green", source: "Audit Letter" },
      ]},
    ],
  },
  6: {
    name: "Investment Operations & Portfolio Controls", rating: "YELLOW",
    summary: "4-person Investment Committee with majority approval. Hospitality-specific underwriting (RevPAR sensitivity, market supply analysis). Asset-level non-recourse mortgage debt at 55–65% LTV. Largest single property (4 Seasons Aspen) at 11.4% of commitments — near 12% cap. Cyclical sector exposure inherent. Strong revenue management team a differentiator.",
    findings: `### Investment Committee & Approval

The Investment Committee comprises four voting members: Jonathan Reid (Managing Partner / CIO), Catherine Walsh (COO), Ryan Thompson (Head of Acquisitions), and David Park (CFO). Approval requires majority (3 of 4) consent. Alpine notes that with a 4-person committee and 60/40 founder ownership, the effective approval dynamic concentrates around the two founders.

### Acquisition Diligence

Ridgeline Resort's hospitality acquisition process is materially different from multifamily or industrial RE diligence and includes:
- Hospitality-specific market analysis (STR competitive set, RevPAR trends, demand drivers)
- New supply pipeline analysis within the property's competitive set
- Operator track record analysis at comparable properties
- Phase I environmental site assessment (Phase II as flagged)
- Property condition assessment with hospitality-specific FF&E review
- Third-party hotel appraisal (Cushman & Wakefield Hospitality)
- Renovation budget validation by independent construction estimator

### Hospitality Underwriting Dynamics

RevPAR (Revenue Per Available Room) sensitivity is the primary underwriting variable in hospitality. Ridgeline Resort's underwriting model stress-tests RevPAR ±15% from base case to assess downside scenarios. The strategy's COVID-period exposure (Ridgeline Resort II had 7 properties operating through 2020–2021) provides empirical validation of stress assumptions — Ridgeline II's NOI recovery profile is documented in the data room.

### Concentration

As of December 31, 2025, the largest single property (Four Seasons Aspen, ski resort) represents 11.4% of fund commitments against the 12% LPA cap. Top 3 properties combined represent 31% of fund NAV. Geographic concentration: Sun Belt resort markets (Florida, Arizona, Texas) represent 42% of fund NAV; mountain/ski resorts represent 28%.

### Leverage

Asset-level non-recourse mortgage debt is sourced from hotel-specialist lenders at 55–65% LTV per asset. Aggregate fund-level leverage (across deployed capital) is 61% LTV. Floating-rate exposure on bridge debt during renovation periods introduces interest rate risk.

### Revenue Management Team

Ridgeline Resort employs a dedicated 3-person revenue management team led by Anita Krishnan (former Marriott corporate RM). The team works directly with property-level operators to optimize pricing, distribution mix, and ancillary revenue. Alpine views this dedicated capability as a meaningful differentiator from peer hospitality managers that rely entirely on operators for RM.

### Chapter Summary

The chapter is rated YELLOW due to: (1) cyclical sector exposure inherent in hospitality real estate; (2) Four Seasons Aspen concentration at 11.4% near the 12% cap; (3) top-3 property concentration at 31% of NAV; (4) floating-rate bridge debt exposure during renovation periods. The chapter is partially offset by the dedicated revenue management team and structured operator-level diligence.`,
    docCategories: ["Investment Ops"], riskObsIds: ["RO-007", "RO-008", "RO-009"],
    verificationCategory: "investment_ops",
    dataPoints: [
      { group: "Investment Committee", items: [
        { label: "Voting Members", value: "4 (Reid Managing Partner, Walsh, Thompson, Park)", source: "DDQ" },
        { label: "Approval Threshold", value: "Majority (3 of 4)", flag: "yellow", source: "DDQ" },
        { label: "Meeting Cadence", value: "Weekly + ad-hoc", source: "DDQ" },
      ]},
      { group: "Acquisition Diligence", items: [
        { label: "Hospitality-Specific Market Analysis", value: "STR competitive set + RevPAR trends + supply pipeline", flag: "green", source: "DDQ" },
        { label: "Third-Party Appraisal", value: "Cushman & Wakefield Hospitality", flag: "green", source: "DDQ" },
        { label: "Renovation Budget Validation", value: "Independent construction estimator engaged for all renovations", flag: "green", source: "DDQ" },
        { label: "RevPAR Stress Testing", value: "±15% from base case in underwriting model", flag: "green", source: "DDQ" },
      ]},
      { group: "Concentration", items: [
        { label: "Single-Property Cap", value: "12% of total commitments", source: "LPA" },
        { label: "Largest Property (Four Seasons Aspen)", value: "11.4% of commitments (near cap)", flag: "yellow", source: "DDQ" },
        { label: "Top 3 Properties", value: "31% of fund NAV", flag: "yellow", source: "DDQ" },
        { label: "Sun Belt Resort Concentration", value: "42% of fund NAV (FL, AZ, TX)", flag: "yellow", source: "DDQ" },
        { label: "Mountain/Ski Concentration", value: "28% of fund NAV", source: "DDQ" },
      ]},
      { group: "Leverage", items: [
        { label: "LTV Range", value: "55–65% per asset; aggregate fund LTV 61% (12/31/2025)", flag: "yellow", source: "DDQ" },
        { label: "Lender Mix", value: "Hotel-specialist lenders (JPM, Wells, BoA, insurance cos)", source: "DDQ" },
        { label: "Floating-Rate Exposure", value: "Bridge debt during renovation periods (typically 18–24 months)", flag: "yellow", source: "DDQ" },
      ]},
      { group: "Revenue Management", items: [
        { label: "Dedicated RM Team", value: "3 professionals led by Anita Krishnan (former Marriott corporate RM)", flag: "green", source: "DDQ" },
        { label: "RM Engagement", value: "Direct integration with property-level operators on pricing + distribution + ancillary revenue", flag: "green", source: "DDQ" },
      ]},
    ],
  },
  7: {
    name: "Valuation, Asset Existence & Investor Reporting", rating: "YELLOW",
    summary: "Quarterly internal valuations + annual third-party appraisal by Cushman & Wakefield Hospitality. Valuation Committee 2 non-investment of 5. Strong RevPAR-driven DCF model. Concern: annual independent appraisal cadence on cyclical hospitality strategy where semi-annual cadence is more appropriate. Investor reports timely.",
    findings: `### Valuation Process

Ridgeline Resort values its hospitality portfolio quarterly under ASC 820 fair-value framework. Each property is valued using three approaches: (1) DCF with hospitality-specific assumptions (RevPAR growth, occupancy trends, ancillary revenue, operating expense margins); (2) sales comparable approach using recent hospitality transaction data; and (3) replacement cost. The DCF approach typically receives 65–75% weighting in hospitality (higher than industrial or multifamily given cash flow sensitivity).

### Valuation Committee

The Valuation Committee comprises five members: David Park (CFO, Chair), Anita Krishnan (Head of RM), Catherine Walsh (COO), Susan Mitchell (CCO), and one rotating SS&C senior representative. Non-investment members hold 2 of 5 seats (CFO/Chair + SS&C); Susan Mitchell as CCO is independent of investment functions. Alpine prefers 3+ non-investment members.

### Third-Party Appraisal

Cushman & Wakefield Hospitality provides independent annual appraisals on all properties. Alpine notes that for a cyclical hospitality strategy with rapidly changing RevPAR trends, semi-annual or quarterly appraisals would provide stronger independent oversight, particularly through market cycle transitions. Annual cadence is acceptable for stabilized post-renovation assets but limits oversight during the value-add hold period.

### Asset Existence

Property existence and ownership is verified by SS&C through annual review of title insurance policies and deeds. KPMG verifies property existence as part of the annual audit.

### Investor Reporting

Quarterly investor reports are delivered within 60 days of quarter-end and include: portfolio-level NAV summary, property-level RevPAR and NOI commentary, brand/operator updates, capex spend tracking, debt summary, and market outlook. Audited annual financials are delivered within 100 days of fiscal year-end.

### Waterfall

Carry waterfall is calculated by SS&C through their proprietary system, reviewed by David Park (CFO).

### Chapter Summary

The chapter is rated YELLOW due to: (1) annual rather than semi-annual third-party appraisal cadence on a cyclical strategy; (2) Valuation Committee composition with 2-of-5 non-investment members (below preferred 3+); (3) Ridgeline Resort serving as primary valuation agent of record with C&W providing annual independent review.`,
    docCategories: ["Valuation"], riskObsIds: ["RO-010"],
    verificationCategory: "valuation",
    dataPoints: [
      { group: "Valuation Process", items: [
        { label: "Framework", value: "Quarterly ASC 820 fair-value; DCF / sales comp / replacement cost", source: "Valuation Policy" },
        { label: "DCF Weighting", value: "65–75% (RevPAR-driven cash flow sensitivity)", source: "Valuation Policy" },
        { label: "Valuation Committee Composition", value: "5 members; 2 non-investment (CFO/Chair, SS&C); CCO also independent", flag: "yellow", source: "Valuation Policy" },
        { label: "Valuation Agent of Record", value: "Ridgeline Resort Capital (in-house)", flag: "yellow", source: "Valuation Policy" },
      ]},
      { group: "Third-Party Review", items: [
        { label: "Independent Appraiser", value: "Cushman & Wakefield Hospitality", flag: "green", source: "DDQ" },
        { label: "Appraisal Cadence", value: "Annual — semi-annual not yet adopted on cyclical strategy", flag: "yellow", source: "DDQ" },
      ]},
      { group: "Investor Reporting", items: [
        { label: "Quarterly Reports", value: "Within 60 days; property-level RevPAR + NOI commentary", flag: "green", source: "DDQ" },
        { label: "Audited Financial Statements", value: "Within 100 days of fiscal year-end", flag: "green", source: "DDQ" },
      ]},
      { group: "Asset Existence & Waterfall", items: [
        { label: "Property Existence Verification", value: "SS&C annual title/deed review + KPMG annual audit", flag: "green", source: "DDQ" },
        { label: "Waterfall Calculation", value: "SS&C proprietary system; reviewed by CFO", flag: "green", source: "DDQ" },
      ]},
    ],
  },
  8: {
    name: "Manager Transparency & LP Communications", rating: "GREEN",
    summary: "Cooperative diligence posture. Proactively disclosed Arizona resort wage-and-hour matter and COVID-period Ridgeline II hold experience. Quarterly investor letters with property-level RevPAR/NOI commentary. Annual investor day in Miami with optional property tour. LPAC quorum strong. No material LP complaints.",
    findings: `### Diligence Engagement

Ridgeline Resort's response to Alpine's diligence requests was prompt and thorough. The Manager voluntarily disclosed both the Arizona JV II wage-and-hour matter (settled 2024 against the operator) and the full COVID-period Ridgeline II hold experience and NOI recovery profile. Both founders were made available for direct interviews, plus the operator diligence team and CFO.

### Investor Communications

Ridgeline Resort produces quarterly investor letters within 60 days of each quarter-end. Letters are approximately 18–22 pages and include: portfolio-level NAV summary, property-level RevPAR and NOI commentary, brand/operator updates, renovation progress tracking, market outlook, and capital activity. Letters are signed by Jonathan Reid and Catherine Walsh jointly.

The firm hosts an annual investor day each March in Miami attended by approximately 65% of LPs by capital. The agenda includes market positioning, deep-dive on selected property repositioning case studies, optional property tour of a Florida resort, and Q&A with founders and the revenue management team. The revenue management team's presentation at investor day is notable as a differentiated touchpoint relative to peer hospitality managers.

### LPAC

The LPAC has 7 seats. Meetings are held twice annually in person plus ad-hoc by video. Standing LPAC quorum across the past three years has been 89%.

### Side Letters

Side letter scope is reasonable: regulatory disclosures, ERISA/UBTI exclusions, fee step-downs above $25M, MFN rights.

### Chapter Summary

The chapter is rated GREEN. Ridgeline Resort's transparency posture is constructive with proactive disclosure of both litigation and COVID-period operating data. Reporting cadence is institutional and the revenue management team's investor day presentation is a differentiated feature.`,
    docCategories: ["Transparency"], riskObsIds: [],
    verificationCategory: "transparency",
    dataPoints: [
      { group: "Diligence Engagement", items: [
        { label: "Document Availability", value: "Full data room access including COVID-period operating data", flag: "green", source: "DDQ" },
        { label: "Voluntary Disclosures", value: "Arizona resort wage-and-hour settlement + full COVID-era Ridgeline II hold data", flag: "green", source: "DDQ" },
      ]},
      { group: "Investor Reporting", items: [
        { label: "Quarterly Letter", value: "Within 60 days; 18–22 pages with property RevPAR/NOI", flag: "green", source: "Q4 2025 Letter" },
        { label: "Annual Investor Day", value: "Each March in Miami; ~65% LP attendance; optional property tour", flag: "green", source: "DDQ" },
        { label: "Revenue Management Team Presentation", value: "Featured at annual investor day — differentiated touchpoint", flag: "green", source: "DDQ" },
      ]},
      { group: "LPAC", items: [
        { label: "Composition", value: "7 seats", source: "LPA" },
        { label: "Meeting Cadence", value: "Twice annually in person + ad-hoc video", source: "LPA" },
        { label: "Standing Quorum (3 yrs)", value: "89%", flag: "green", source: "DDQ" },
      ]},
    ],
  },
};

// ── Source metadata ───────────────────────────────────────────────────────────

export const RIDGELINE_RESORT_SOURCE_META: Record<string, { label: string; type: string; filename?: string; size?: string }> = {
  "sample_re_ridgeline_iii.pdf": { label: "Ridgeline Resort III — ODD Report (April 2026)", type: "ODD Report", filename: "sample_re_ridgeline_iii.pdf", size: "1.2 MB" },
  "DDQ": { label: "Due Diligence Questionnaire (2026)", type: "Fund Document", filename: "ridgeline_resort_ddq_2026.pdf" },
  "Form ADV": { label: "Form ADV (ERA) — March 2026", type: "Regulatory Filing" },
  "LPA": { label: "Limited Partnership Agreement — Fund III", type: "Fund Document" },
  "PPM": { label: "Private Placement Memorandum — Fund III", type: "Fund Document" },
  "Valuation Policy": { label: "Valuation Policy (Sep 2024)", type: "Operations Document" },
  "Code of Ethics": { label: "Code of Ethics (Sep 2024)", type: "Compliance Document" },
  "WISP": { label: "Written Information Security Program (2024)", type: "Compliance Document" },
  "Admin Agreement": { label: "Administration Agreement — SS&C ALPS", type: "Service Provider Agreement" },
  "Audit Letter": { label: "KPMG — Audit Confirmation", type: "Third-Party Confirmation" },
  "Insurance Cert": { label: "Cyber Liability Insurance Certificate", type: "Insurance" },
  "Q4 2025 Letter": { label: "Q4 2025 Investor Letter", type: "Investor Communication" },
  "SEC_EDGAR": { label: "SEC EDGAR — ERA Filing Search", type: "SEC Verification" },
  "Delaware Register": { label: "Delaware Division of Corporations — Direct Check", type: "SEC Verification" },
};

// ── Mock fund-level data ──────────────────────────────────────────────────────

export const RIDGELINE_RESORT_MOCK = {
  fund: {
    name: "Ridgeline Resort Holdings III, L.P.",
    manager: "Ridgeline Resort Capital, LLC",
    strategy: "Opportunistic Hospitality Real Estate",
    aum: "$720M firmwide (excl. $310M uncalled)",
    overall_rating: "YELLOW",
    odd_score: 65,
    odd_percentile: "42nd",
    domicile: "Delaware LP (Cayman feeder)",
    fund_nav: "$470M raised; ~22% deployed",
    recommendation_summary: "recommends a <b>watchlist</b> rating. Ridgeline Resort has produced strong realized returns in its first vintage and operated through COVID-period stress in its second vintage with documented recovery. Four YELLOW chapters reflect emerging-manager governance characteristics combined with cyclical sector exposure inherent in hospitality real estate.",
    conditions_summary: "Post-close monitoring: track RIA transition Q4 2026; monitor Four Seasons Aspen concentration and Sun Belt resort exposure; require LPAC update on hospitality market cycle indicators.",
  },
  risk_observations: [
    { id: "RO-001", severity: "MEDIUM", topic: "Manager, Ownership & Governance", title: "Two-founder ownership without third senior partner",
      detail: "Jonathan Reid (60%) and Catherine Walsh (40%) own all firm equity. No third senior partner exists to provide independent perspective in a founder dispute or to serve as governance counterbalance.",
      remediation: "Consider equity grants to senior team members (Thompson, Krishnan, Park) over time to broaden senior partner base." },
    { id: "RO-002", severity: "MEDIUM", topic: "Manager, Ownership & Governance", title: "Key person insurance limited to single founder",
      detail: "Key person life insurance is in place at $10M on Jonathan Reid only. Catherine Walsh is not covered. Either founder's loss would materially affect the firm.",
      remediation: "Extend key person insurance to Catherine Walsh at equivalent limit." },
    { id: "RO-003", severity: "MEDIUM", topic: "Legal, Regulatory & Compliance", title: "Pending RIA transition Q4 2026",
      detail: "Ridgeline Resort is currently SEC ERA status with $720M AUM exceeding the RIA threshold. Transition to full RIA registration is planned for Q4 2026 but not yet completed.",
      remediation: "Confirm RIA transition completion by Q4 2026 as planned; verify compliance program scaled for RIA requirements." },
    { id: "RO-004", severity: "LOW", topic: "Legal, Regulatory & Compliance", title: "Indirect litigation exposure — Arizona resort wage-and-hour",
      detail: "A Ridgeline Resort II 280-key Arizona property was subject to a wage-and-hour class action by housekeeping staff. The action named the third-party hotel operator (not Ridgeline) and was settled in 2024 for an undisclosed amount, paid by the operator's insurance.",
      remediation: "Monitor for similar matters at other operator-managed properties; reaffirm operator vetting includes employment compliance standards." },
    { id: "RO-005", severity: "MEDIUM", topic: "Technology, Cybersecurity & Business Resilience", title: "No SOC 2 audit; pen test cadence not yet annual",
      detail: "Ridgeline Resort has not commissioned a SOC 2 Type II audit. The first external penetration test was performed in September 2024; annual cadence is planned but not yet evidenced by a second cycle.",
      remediation: "Commission SOC 2 Type II audit by end of 2026; complete second annual penetration test in 2026." },
    { id: "RO-006", severity: "MEDIUM", topic: "Technology, Cybersecurity & Business Resilience", title: "Cyber liability insurance below benchmark for hospitality risk profile",
      detail: "Cyber liability insurance limit is $7.5M per occurrence / $7.5M aggregate. Institutional benchmarks for managers at $720M AUM typically range $10M+, with higher coverage warranted for hospitality exposure given guest payment card data risk.",
      remediation: "Increase cyber liability limit to at least $15M by next renewal given hospitality-specific data risk profile." },
    { id: "RO-007", severity: "MEDIUM", topic: "Investment Operations & Portfolio Controls", title: "Inherent cyclical exposure in hospitality real estate",
      detail: "Hospitality real estate is materially more cyclical than other commercial real estate sectors. RevPAR sensitivity to economic cycle, travel pattern changes, and pandemic-type events creates revenue volatility. Ridgeline Resort II's COVID-period experience demonstrated this risk; while NOI recovered, the hold period was extended.",
      remediation: "Ensure investors understand cyclical sector exposure; monitor leading indicators (forward bookings, group business, transient demand) quarterly." },
    { id: "RO-008", severity: "MEDIUM", topic: "Investment Operations & Portfolio Controls", title: "Single-property concentration near contractual cap",
      detail: "Four Seasons Aspen (ski resort) represents 11.4% of fund commitments against a 12% LPA cap. Ski resort exposure additionally carries seasonal concentration risk.",
      remediation: "Monitor Aspen exposure quarterly; LPAC reaffirmation of cap and ski-resort exposure at each annual review." },
    { id: "RO-009", severity: "MEDIUM", topic: "Investment Operations & Portfolio Controls", title: "Floating-rate bridge debt exposure during renovations",
      detail: "Ridgeline Resort's value-add renovation strategy uses floating-rate bridge debt during the 18–24 month renovation period before refinancing to fixed-rate term loans. This introduces interest rate exposure during the renovation phase.",
      remediation: "Monitor bridge debt utilization; consider interest rate hedging on extended renovation periods." },
    { id: "RO-010", severity: "MEDIUM", topic: "Valuation, Asset Existence & Investor Reporting", title: "Annual third-party appraisal cadence on cyclical strategy",
      detail: "Cushman & Wakefield Hospitality provides annual independent appraisals. For a cyclical hospitality strategy with rapidly changing RevPAR trends, semi-annual appraisals would provide stronger oversight, particularly during market cycle transitions.",
      remediation: "Move to semi-annual third-party appraisals for properties in active renovation or near cycle inflection points." },
  ],
  strengths: [
    { title: "Dedicated revenue management team — differentiated capability for hospitality",
      detail: "Ridgeline Resort employs a 3-person revenue management team led by Anita Krishnan (former Marriott corporate RM). The team works directly with property-level operators to optimize pricing, distribution mix, and ancillary revenue. This dedicated capability is differentiated from peer hospitality managers that rely entirely on operators for revenue management." },
    { title: "Strong realized track record in Ridgeline Resort I and documented COVID resilience in Ridgeline Resort II",
      detail: "Ridgeline Resort I delivered a 16.8% gross IRR and 1.81x MOIC across 8 fully realized investments. Ridgeline Resort II operated 7 properties through 2020–2021 COVID-period stress with full documented NOI recovery profile available in the data room — a meaningful empirical validation of underwriting stress assumptions." },
    { title: "Top-tier hotel operator relationships",
      detail: "Properties operated under management agreements with Marriott International (8), Hyatt Hotels (5), and Hilton Worldwide (4), plus boutique luxury operators (Two Roads, Auberge Resorts). Each agreement is negotiated property-by-property with detailed performance metrics and termination rights." },
    { title: "Proactive diligence transparency including COVID-period operating data",
      detail: "Manager voluntarily disclosed both the Arizona resort wage-and-hour matter and the full COVID-period Ridgeline Resort II hold experience and NOI recovery profile. Proactive transparency on COVID-period data is particularly constructive given the strategy's cyclical sector exposure." },
  ],
};

// ── Collection / source documents ─────────────────────────────────────────────

export const RIDGELINE_RESORT_COLLECTION_DOCS: Array<{ name: string; type: string; filename: string }> = [
  { name: "Ridgeline Resort III — ODD Report (April 2026)",      type: "ODD Report",            filename: "sample_re_ridgeline_iii.pdf" },
  { name: "Form ADV (ERA) — March 2026",                          type: "Regulatory Filing",     filename: "ridgeline_resort_form_adv.pdf" },
  { name: "Limited Partnership Agreement — Fund III",             type: "Fund Document",         filename: "ridgeline_resort_lpa.pdf" },
  { name: "Private Placement Memorandum — Fund III",              type: "Fund Document",         filename: "ridgeline_resort_ppm.pdf" },
  { name: "Due Diligence Questionnaire (2026)",                   type: "Fund Document",         filename: "ridgeline_resort_ddq_2026.pdf" },
  { name: "Valuation Policy (September 2024)",                    type: "Operations Document",   filename: "ridgeline_resort_valuation_policy.pdf" },
  { name: "Compliance Manual (September 2024)",                   type: "Compliance Document",   filename: "ridgeline_resort_compliance_manual.pdf" },
  { name: "Audited Financial Statements FY2024",                  type: "Financial Document",    filename: "ridgeline_resort_audited_fs_fy2024.pdf" },
];
