/**
 * Trellis Capital IV, L.P. — static demo data for the Review page.
 *
 * ODD review of Trellis Capital IV, L.P. (Pre-seed Venture Capital)
 * Manager: Trellis Capital Management, LLC
 * Overall rating: YELLOW (22 flags, 2 RED chapters)
 */

import type { TopicInfo, TopicDataGroup } from "./ridgeline-data";

export type { TopicInfo, TopicDataGroup };

// ── 8-Topic ODD assessment data (Trellis Capital IV) ──────────────────────────

export const TRELLIS_TOPIC_DATA: Record<number, TopicInfo> = {
  1: {
    name: "Manager, Ownership & Governance", rating: "YELLOW",
    summary: "Dual co-founder ownership (50/50 Mehta / Sharma). Strong VC pedigree. Limited internal staffing — 7 FTEs, single operations professional (executive assistant focus). No formal succession plan. GP commitment of 1% invested pari passu.",
    findings: `### Management Company & Structure

Trellis Capital Management, LLC is a Delaware LLC founded August 19, 2018, by Arjun Mehta (Co-Founder, Managing Partner) and Priya Sharma (Co-Founder, Managing Partner). The firm is headquartered in San Francisco and had net assets of $280.3 million as of December 31, 2025, plus $113.7 million in uncalled capital out of $274 million in total commitments to its first three funds.

### Ownership

Arjun Mehta and Priya Sharma each hold 50–75% ownership per Form ADV Schedules A & B (confirmed via Alpine direct check of IARD register). The firm is fully self-funded; no third-party institutional investors hold an interest in the management company. GP commitment of approximately $2.77 million (~1% of aggregate commitments) is invested pari passu with LPs, aligning incentives.

### Fund History

Fund I (2018, $47M, fully deployed), Fund II (2021, $78M, fully deployed), Fund III (2024, $150M, 64% deployed). Fund IV targeting $175M with $200M hard cap, initial close April 1, 2026 (~$125M).

### Personnel & Staffing

Seven full-time staff: six investment professionals and one operations professional (Sarah Collins, Head of Operations). Sarah Collins' role is primarily executive assistant rather than back office, meaning the funds operate without an internal back office resource overseeing the Administrator. Fractional CFO Raj Patel expected to join Summer 2026.

### Succession & Key Person

No formal succession plan exists. The LPA key person provision is only triggered if both Managing Partners fail to provide sufficient time and attention simultaneously. Key person life insurance is not maintained. Background checks completed internally to date; third-party provider search underway.`,
    docCategories: ["Governance"], riskObsIds: ["TO-001", "TO-002", "TO-003"],
    verificationCategory: "governance",
    dataPoints: [
      { group: "Management Company", items: [
        { label: "Manager Name", value: "Trellis Capital Management, LLC", source: "Form ADV" },
        { label: "Date of Formation", value: "August 19, 2018", source: "Delaware Register" },
        { label: "Primary Location", value: "San Francisco, CA", source: "Form ADV" },
        { label: "Total Headcount", value: "7 (6 investment, 1 operations)", source: "DDQ" },
        { label: "AUM (Net Assets, 12/31/2025)", value: "$280.3 million", source: "Form ADV" },
        { label: "Uncalled Capital", value: "$113.7 million", source: "DDQ" },
      ]},
      { group: "Key Persons", items: [
        { label: "Co-Founder / Managing Partner", value: "Arjun Mehta (Founder Collective, Foundation Capital background)", source: "Form ADV" },
        { label: "Co-Founder / Managing Partner", value: "Priya Sharma (responsible for compliance — investment professional)", flag: "red", source: "Form ADV" },
        { label: "Head of Operations", value: "Sarah Collins (exec assistant focus, not back office)", flag: "yellow", source: "DDQ" },
        { label: "Fractional CFO", value: "Raj Patel (expected Summer 2026 — not yet active)", flag: "yellow", source: "DDQ" },
      ]},
      { group: "Governance & Ownership", items: [
        { label: "Ownership", value: "Arjun Mehta 50%, Priya Sharma 50% (Form ADV Schedule A/B)", source: "Form ADV" },
        { label: "GP Commitment", value: "~$2.77M (~1% of commitments), pari passu with LPs", flag: "green", source: "LPA" },
        { label: "Succession Plan", value: "None documented", flag: "red", source: "DDQ" },
        { label: "Key Person Insurance", value: "None maintained", flag: "red", source: "DDQ" },
        { label: "Background Checks", value: "Completed internally (third-party provider search underway)", flag: "yellow", source: "DDQ" },
      ]},
      { group: "Fund Track Record", items: [
        { label: "Fund I (2018)", value: "$47M — fully deployed", source: "DDQ" },
        { label: "Fund II (2021)", value: "$78M — fully deployed", source: "DDQ" },
        { label: "Fund III (2024)", value: "$150M — 64% deployed", source: "DDQ" },
        { label: "Fund IV (2026)", value: "~$125M initial close | $175M target | $200M hard cap", source: "DDQ" },
        { label: "Carried Interest Vesting", value: "4 years for all investment staff", flag: "green", source: "LPA" },
      ]},
    ],
  },
  2: {
    name: "Legal, Regulatory & Compliance", rating: "RED",
    summary: "RED: Investment professional (Priya Sharma, Co-Founder) holds compliance oversight — required action before close. No initial or annual compliance attestation from staff. No annual compliance training. No written personal trading policy. ERA-exempt from SEC registration. No disciplinary history.",
    findings: `### Registration & Regulatory Standing

The firm is exempt from registration with the SEC under the venture capital adviser exemption and has filed as an Exempt Reporting Adviser ("ERA") since March 9, 2019. Form ADV dated March 22, 2026 reviewed. No disciplinary actions, regulatory inquiries, or sanctions on Form ADV Section 11 or DRP pages. No BrokerCheck reportable events for either principal.

### Compliance Program — Material Deficiency

Priya Sharma (Co-Founder, Managing Partner) is responsible for compliance oversight in addition to full investment responsibilities. Alpine is strongly opposed to an investment professional holding compliance responsibilities and requires this be transferred to a non-investment professional (e.g., Sarah Collins, Head of Operations, or a dedicated hire). This is a required action before close.

### Compliance Infrastructure

No initial attestation or annual recertification of compliance policies required from staff. No annual compliance training program has been implemented. Compliance consultant engagement is limited to Summit Advisory for annual Form ADV preparation only. No written personal trading policy exists (not required for ERAs, but recommended). Required ERA policies (pay-to-play, insider trading, AML) are maintained, but the overall compliance posture falls below institutional standards.

### Positive Factors

No regulatory sanctions or disciplinary history. Directors' fees from portfolio company board seats are waived. Professional liability insurance provides up to $1 million in coverage. No use of expert networks or soft dollars, eliminating significant compliance risk areas.`,
    docCategories: ["Regulatory", "Compliance"], riskObsIds: ["TO-004", "TO-006", "TO-007", "TO-008"],
    verificationCategory: "regulatory",
    dataPoints: [
      { group: "Regulatory Status", items: [
        { label: "SEC Registration Status", value: "Exempt Reporting Adviser (ERA) — VC adviser exemption", source: "Form ADV" },
        { label: "ERA Filing Date", value: "March 9, 2019", source: "IARD Register" },
        { label: "Form ADV Date", value: "March 22, 2026 (reviewed)", source: "Form ADV" },
        { label: "Disciplinary History", value: "None — Form ADV Section 11 and DRP pages clean", source: "Form ADV" },
      ]},
      { group: "Compliance Oversight", items: [
        { label: "CCO / Compliance Lead", value: "Priya Sharma (Managing Partner) — investment professional", flag: "red", source: "DDQ" },
        { label: "Required Action", value: "Transfer compliance oversight to non-investment professional before close", flag: "red", source: "Alpine Analysis" },
        { label: "Compliance Consultant", value: "Summit Advisory — Form ADV preparation only (narrow scope)", flag: "yellow", source: "DDQ" },
        { label: "Expert Networks", value: "None used — no soft dollars", flag: "green", source: "DDQ" },
      ]},
      { group: "Compliance Infrastructure Gaps", items: [
        { label: "Staff Attestation (Initial)", value: "None required", flag: "red", source: "DDQ" },
        { label: "Annual Recertification", value: "None required", flag: "red", source: "DDQ" },
        { label: "Annual Training Program", value: "None implemented", flag: "red", source: "DDQ" },
        { label: "Personal Trading Policy", value: "Not written (ERA not required, but best practice)", flag: "yellow", source: "DDQ" },
        { label: "Pay-to-Play Policy", value: "Maintained (ERA required)", flag: "green", source: "DDQ" },
        { label: "Insider Trading Policy", value: "Maintained (ERA required)", flag: "green", source: "DDQ" },
        { label: "AML Policy", value: "Maintained (ERA required)", flag: "green", source: "DDQ" },
      ]},
      { group: "Insurance & Liability", items: [
        { label: "Professional Liability", value: "Up to $1M coverage", source: "DDQ" },
        { label: "Board Fees Policy", value: "Directors' fees waived — managing partners serve on portfolio boards", flag: "green", source: "DDQ" },
      ]},
    ],
  },
  3: {
    name: "Technology, Cybersecurity & Business Resilience", rating: "RED",
    summary: "RED: Substantially underdeveloped cybersecurity environment. No formal cybersecurity policy, incident response plan, or third-party framework (NIST/ISO). No penetration testing. No DLP on endpoints. No written BCP. Cybersecurity vendor search underway — targeted by end of 2026.",
    findings: `### IT Environment

There is no single individual in charge of IT and no appointed technology or cybersecurity consultant. Sarah Collins (Head of Operations) is leading a search for a third-party cybersecurity vendor. The firm relies on cloud-based applications with no onsite infrastructure beyond internet connection. No formal IT policy documentation exists.

### Cybersecurity — Material Deficiency

No formal cybersecurity policy or incident response plan has been documented. No third-party cybersecurity framework (NIST, ISO/IEC 27000) has been adopted. No employee cybersecurity awareness training or phishing simulation has been conducted. Endpoints lack formal data loss prevention — staff maintain access to removable media, personal email, and personal cloud storage on company-issued devices. No penetration testing has been completed. No written business continuity plan exists.

### Controls in Place

Baseline network security (firewall, anti-virus) is in place. User access controls are implemented on a need-to-know and least-privilege basis. MFA is implemented on key business applications. Staff retain the ability to work remotely.

### Planned Remediation

The Head of Operations is leading a search for a third-party cybersecurity vendor tasked with conducting a formal cybersecurity audit, vulnerability test, and implementing a training program by end of 2026. This is a positive step but the RED rating stands until formal policies and testing are implemented. Alpine recommends investors require the firm to commit to these enhancements via side letter or accelerate the timeline prior to investing.`,
    docCategories: ["Technology"], riskObsIds: ["TO-005", "TO-009", "TO-010", "TO-011"],
    verificationCategory: "technology",
    dataPoints: [
      { group: "IT Governance", items: [
        { label: "IT Owner", value: "No designated IT lead or CISO", flag: "red", source: "DDQ" },
        { label: "Cybersecurity Framework", value: "None adopted (no NIST, ISO/IEC 27000)", flag: "red", source: "DDQ" },
        { label: "Cybersecurity Consultant", value: "Search in progress (Head of Operations leading)", flag: "yellow", source: "DDQ" },
        { label: "Infrastructure", value: "Cloud-based applications only — no onsite servers", source: "DDQ" },
      ]},
      { group: "Security Controls", items: [
        { label: "Firewall / Anti-Virus", value: "In place (baseline)", flag: "green", source: "DDQ" },
        { label: "MFA", value: "Implemented on key business applications", flag: "green", source: "DDQ" },
        { label: "Access Controls", value: "Need-to-know / least-privilege basis", flag: "green", source: "DDQ" },
        { label: "Remote Work Capability", value: "Staff can work remotely", flag: "green", source: "DDQ" },
        { label: "Endpoint DLP", value: "None — removable media, personal email, personal cloud accessible", flag: "red", source: "DDQ" },
        { label: "Penetration Testing", value: "Not completed", flag: "red", source: "DDQ" },
        { label: "Phishing / Awareness Training", value: "None", flag: "red", source: "DDQ" },
      ]},
      { group: "Policies & Plans", items: [
        { label: "Cybersecurity Policy", value: "None documented", flag: "red", source: "DDQ" },
        { label: "Incident Response Plan", value: "None documented", flag: "red", source: "DDQ" },
        { label: "Business Continuity Plan", value: "None written", flag: "red", source: "DDQ" },
      ]},
      { group: "Planned Remediation", items: [
        { label: "Vendor Search", value: "Underway — formal audit, vulnerability test, training by end of 2026", flag: "yellow", source: "DDQ" },
        { label: "Investor Action Required", value: "Require written commitment via side letter", flag: "yellow", source: "Alpine Analysis" },
      ]},
    ],
  },
  4: {
    name: "Fund Structure, Terms & Investor Alignment", rating: "GREEN",
    summary: "GREEN: Delaware LP structure confirmed. Standard VC terms — 2.5%/1.5% management fee, 20% carry, American waterfall. No preferred return (market norm for VC). GP commits 1% pari passu. Key person provision, clawback, and recycling up to 120%. LPAC formation at GP discretion.",
    findings: `### Legal Structure

Trellis Capital IV, L.P. is a Delaware limited partnership formed March 28, 2026, confirmed against the Delaware Division of Corporations register. Trellis Capital GP IV, LLC (Delaware LLC) serves as General Partner. Both entities confirmed.

### Fee Terms

Management fee of 2.5% during the commitment period and 1.5% thereafter on invested capital — consistent with VC market norms at this fund size. Carried interest of 20% distributed via American waterfall. No preferred return, consistent with pre-seed VC practice. Recycling permitted up to 120% of aggregate commitments. Organizational expenses capped at $350,000.

### Investor Protections

Key person provision triggers a suspension of the commitment period if either Managing Partner ceases to devote at least 80% of their professional time to the fund (not an automatic trigger if both are available). Clawback mechanics apply on a per-LP basis. An LPAC provision exists but formation is at GP discretion absent LP requests.

### Investment Strategy

Pre-seed technology at $1–3M per investment, targeting 40–50 companies via equity, SAFEs, KISS, warrants, and convertible equity. Concentration limits: 10% single company, 5% passive, 10% non-U.S./Canada. Up to 10% in digital assets permitted (not utilized to date).`,
    docCategories: ["Legal"], riskObsIds: ["TO-012"],
    dataPoints: [
      { group: "Fund Details", items: [
        { label: "Fund Name", value: "Trellis Capital IV, L.P.", source: "LPA" },
        { label: "Domicile", value: "Delaware LP (formed March 28, 2026)", source: "Delaware Register" },
        { label: "General Partner", value: "Trellis Capital GP IV, LLC (Delaware LLC)", source: "LPA" },
        { label: "First Closing", value: "April 1, 2026 (~$125M in commitments)", source: "DDQ" },
        { label: "Target Raise", value: "$175 million", source: "DDQ" },
        { label: "Hard Cap", value: "$200 million", source: "LPA" },
        { label: "Min. Commitment", value: "$1 million", source: "LPA" },
      ]},
      { group: "Fee Structure", items: [
        { label: "Management Fee (Commitment Period)", value: "2.5% on commitments", source: "LPA" },
        { label: "Management Fee (Post-Commitment)", value: "1.5% on invested capital", source: "LPA" },
        { label: "Carried Interest", value: "20% — American waterfall", source: "LPA" },
        { label: "Preferred Return", value: "None (typical for pre-seed VC)", source: "LPA" },
        { label: "Org. Expenses Cap", value: "$350,000", source: "LPA" },
        { label: "Deal Counsel Costs", value: "Charged to Fund (de minimis per Apex)", source: "DDQ" },
        { label: "Recycling", value: "Up to 120% of aggregate commitments", source: "LPA" },
      ]},
      { group: "Investor Protections", items: [
        { label: "Fund Term", value: "10 years + 2 one-year extensions", source: "LPA" },
        { label: "Commitment Period", value: "5 years", source: "LPA" },
        { label: "Key Person Provision", value: "Suspension if either MP < 80% time; auto-trigger only if both unavailable", flag: "yellow", source: "LPA" },
        { label: "Clawback", value: "Yes — per-LP basis", flag: "green", source: "LPA" },
        { label: "LPAC", value: "Provision exists; formation at GP discretion absent LP request", flag: "yellow", source: "LPA" },
        { label: "GP Commitment", value: "1.01% (cash, pari passu)", flag: "green", source: "LPA" },
      ]},
      { group: "Investment Strategy", items: [
        { label: "Strategy", value: "Pre-seed venture capital — technology", source: "PPM" },
        { label: "Investment Size", value: "$1–3M per company", source: "PPM" },
        { label: "Target Portfolio", value: "40–50 companies", source: "PPM" },
        { label: "Instruments", value: "Equity, SAFEs, KISS, warrants, convertible equity", source: "PPM" },
        { label: "Concentration Limits", value: "10% single company / 5% passive / 10% non-US/Canada", source: "LPA" },
        { label: "Digital Assets", value: "Up to 10% permitted — not utilized to date", source: "LPA" },
      ]},
    ],
  },
  5: {
    name: "Service Providers, Delegation & Oversight", rating: "GREEN",
    summary: "GREEN: Continuation of established relationships from prior funds. Apex Fund Services (administrator), Baker Thompson & Co. (auditor), Pacific Commerce / JP Morgan (banker), Morrison Cole Ashworth (counsel). Engagement letters for Fund IV expected before first capital call. Banking transition from Pacific Commerce to JP Morgan should be monitored.",
    findings: `### Administrator — Apex Fund Services

Apex Fund Services, LLC is the expected administrator for Fund IV, continuing from prior funds. Apex uses Xero for accounting and FundPanel for LP reporting. Apex is notably hands-on with valuation guidance. Engagement letter for Fund IV is expected before the first capital call. Alpine confirmed Apex's expected engagement via conference call on April 3, 2026.

### Auditor — Baker Thompson & Co. LLP

Baker, Thompson & Co. LLP is a well-regarded VC auditor in the Bay Area with deep experience across VC fund structures. While not a Big 4 firm, the firm's expertise in VC is an appropriate fit for the fund's structure and investor base. Engagement expected before the first year-end audit.

### Corporate Banker — Pacific Commerce / JP Morgan

Pacific Commerce Bank collapsed in Q2 2025 and was acquired by JP Morgan. Accounts will transfer per JP Morgan migration timeline. No service disruption to date. This transition should be monitored; Apex confirmed via the conference call that Pacific Commerce remains the operative bank account.

### Legal & Compliance

Morrison Cole Ashworth & Partners serves as fund formation counsel, continuing from prior funds. Summit Advisory is engaged for annual Form ADV preparation only — narrower scope than recommended for a firm of this size.`,
    docCategories: ["Operations"], riskObsIds: [],
    verificationCategory: "administrator",
    dataPoints: [
      { group: "Core Service Providers", items: [
        { label: "Administrator", value: "Apex Fund Services, LLC (expected)", source: "DDQ" },
        { label: "Accounting Platform", value: "Xero (maintained by Apex)", source: "DDQ" },
        { label: "LP Portal", value: "FundPanel (Apex)", source: "DDQ" },
        { label: "Auditor", value: "Baker, Thompson & Co. LLP (expected)", source: "DDQ" },
        { label: "Corporate Banker", value: "Pacific Commerce Bank / JP Morgan (transitioning)", flag: "yellow", source: "DDQ" },
        { label: "Legal Counsel", value: "Morrison Cole Ashworth & Partners", source: "DDQ" },
        { label: "Compliance Consultant", value: "Summit Advisory (Form ADV only — narrow scope)", flag: "yellow", source: "DDQ" },
        { label: "Deal Counsel", value: "James Crawford (independent, ad hoc)", source: "DDQ" },
      ]},
      { group: "Administrator Verification", items: [
        { label: "Confirmation Method", value: "Conference call with Apex, April 3, 2026", source: "Apex Verification Call" },
        { label: "Fund IV Engagement Status", value: "Expected (engagement letter pre-close)", flag: "yellow", source: "Apex Verification Call" },
        { label: "Prior Fund Relationship", value: "Engaged since Fund I — long-standing relationship", flag: "green", source: "DDQ" },
        { label: "Cash Control Oversight", value: "Apex initiates/oversees all wire authorizations", flag: "green", source: "Apex Verification Call" },
        { label: "Carta Share Certificates", value: "Apex receives directly from portfolio companies", flag: "green", source: "Apex Verification Call" },
      ]},
      { group: "Banking Transition Monitor", items: [
        { label: "Current Bank", value: "Pacific Commerce Bank (collapsed Q2 2025, acquired by JP Morgan)", flag: "yellow", source: "DDQ" },
        { label: "Transition Status", value: "JP Morgan migration timeline — no disruption to date", source: "Apex Verification Call" },
        { label: "Action", value: "Monitor — confirm JP Morgan account operational before first capital call", flag: "yellow", source: "Alpine Analysis" },
      ]},
    ],
  },
  6: {
    name: "Investment Operations & Portfolio Controls", rating: "YELLOW",
    summary: "YELLOW: Manager does not maintain internal accounting records or track cash balances — relies entirely on Apex. No back office oversight of administrator. No formal written investment allocation policy. Cash controls via Bill.com are appropriate — dual authorization required for wires. Custom Retool deal pipeline tracking.",
    findings: `### Investment Operations

The firm uses a custom-built Retool dashboard ("People Flow") for tracking the deal pipeline and an Excel dashboard for tracking key financial metrics. All new investments require approval from both Arjun Mehta and Priya Sharma. Deal sourcing breakdown for Fund III: Founder (32%), Angel/Advisor/Scout (26%), Alpha/Founders in Residence (26%), VC referral (10%), Outbound (6%).

### Accounting & Back Office — Material Gap

The firm does not maintain internal accounting records or track individual cash transactions or aggregate cash balances, relying solely on Apex to maintain and reconcile the accounting books and records. There has been no back office oversight of the Administrator's accounting work to date. The engagement of fractional CFO Raj Patel (Summer 2026) is expected to partially address this through focused oversight of Apex. No formal written investment allocation policy exists beyond LPA disclosures.

### Cash Controls — Appropriate

All cash movements from Pacific Commerce require one of two authorized Apex individuals to initiate wires and one Managing Partner to release. Apex completes a verification callback for new payment instructions. Operating expenses paid via Bill.com require Apex to initiate and a Managing Partner to approve. Both Managing Partners must sign on the opening of new bank accounts.

### Apex Bookkeeping

Apex maintains formal books using Xero: daily cash posting via direct feed from Pacific Commerce, at least weekly reconciliation, monthly soft close, and quarterly full close producing balance sheet, schedule of investments, income statement, and statement of changes in partners' capital.`,
    docCategories: ["Operations"], riskObsIds: ["TO-013"],
    dataPoints: [
      { group: "Deal Pipeline & Tracking", items: [
        { label: "Pipeline System", value: "Retool dashboard ('People Flow') — custom built", source: "DDQ" },
        { label: "Financial Metrics", value: "Excel dashboard", source: "DDQ" },
        { label: "Investment Approval", value: "Both Managing Partners must approve all new investments", flag: "green", source: "DDQ" },
      ]},
      { group: "Accounting & Back Office", items: [
        { label: "Internal Accounting Records", value: "None — Manager does not maintain or track", flag: "red", source: "DDQ" },
        { label: "Back Office Oversight of Admin", value: "None to date — no verification of Apex's work", flag: "red", source: "DDQ" },
        { label: "Fractional CFO (Raj Patel)", value: "Expected Summer 2026 — will focus on Apex oversight", flag: "yellow", source: "DDQ" },
        { label: "Investment Allocation Policy", value: "None written — per LPA disclosures only", flag: "yellow", source: "DDQ" },
      ]},
      { group: "Cash Controls", items: [
        { label: "Wire Initiation", value: "Authorized Apex individual (one of two)", flag: "green", source: "Apex Verification Call" },
        { label: "Wire Release", value: "Managing Partner authorization required", flag: "green", source: "Apex Verification Call" },
        { label: "New Payment Instructions", value: "Apex completes verification callback before processing", flag: "green", source: "Apex Verification Call" },
        { label: "Operating Expenses", value: "Bill.com — Apex initiates, Managing Partner approves", flag: "green", source: "DDQ" },
        { label: "New Bank Accounts", value: "Both Managing Partners must sign", flag: "green", source: "DDQ" },
      ]},
      { group: "Apex Bookkeeping (Xero)", items: [
        { label: "Daily Cash Posting", value: "Direct feed from Pacific Commerce bank", source: "Apex Verification Call" },
        { label: "Reconciliation Frequency", value: "At least weekly", source: "Apex Verification Call" },
        { label: "Soft Close", value: "Monthly", source: "Apex Verification Call" },
        { label: "Full Close", value: "Quarterly — produces BS, SOI, IS, SOPC", source: "Apex Verification Call" },
      ]},
    ],
  },
  7: {
    name: "Valuation, Asset Existence & Investor Reporting", rating: "YELLOW",
    summary: "YELLOW: No formal valuation committee — front office exclusively controls pricing. Distribution waterfalls maintained in Excel. No internal investor-level accounting. Mitigated by low valuation sensitivity (finite-life VC, no NAV-based capital transactions), multi-party asset verification via Apex/Baker Thompson/Carta, and no prior reporting errors.",
    findings: `### Valuation Framework

As with most closed-ended VC structures, the Fund is a finite-life capital commitment vehicle with no capital transactions based on valuations, and the GP receives carried interest only upon a realization event. These structural characteristics significantly reduce valuation sensitivity and the incentive for intra-period price manipulation.

The firm values portfolio companies at cost and marks investments up/down based on the price of a subsequent financing round in which a significant new investor has participated. The firm has an undated valuation policy. In practice, valuations are approved by the Managing Partners. The firm does not have a formal valuation committee.

### Asset Existence — Robust

Multiple parties are involved in each transaction (requiring collusion to create fictitious investments). Baker Thompson issues audit confirmations to approximately 50% of portfolio companies annually. Apex receives all investment documents and wire instructions from the Manager. Share certificates via Carta are obtained directly by Apex, independently of the Manager. Apex independently verifies wire details with portfolio companies before initiating.

### Investor Reporting

Quarterly reports within 45 business days of quarter-end via FundPanel LP Portal. Audited financials within 120 days of year-end under U.S. GAAP. Baker Thompson is expected to audit Fund IV. The Manager and Administrator represented that prior funds have never had an investor reporting error.`,
    docCategories: ["Compliance", "Financial"], riskObsIds: ["TO-014", "TO-015"],
    dataPoints: [
      { group: "Valuation Process", items: [
        { label: "Valuation Committee", value: "None — front office (Managing Partners) exclusively", flag: "red", source: "DDQ" },
        { label: "Valuation Policy", value: "Exists but undated", flag: "yellow", source: "Valuation Policy" },
        { label: "Valuation Methodology", value: "Cost; step-up/down on significant subsequent financing round", source: "DDQ" },
        { label: "Distribution Waterfalls", value: "Maintained in Excel", flag: "yellow", source: "DDQ" },
        { label: "Internal LP Accounting", value: "None — no internal investor-level records", flag: "yellow", source: "DDQ" },
      ]},
      { group: "Valuation Sensitivity (Mitigants)", items: [
        { label: "NAV-Based Transactions", value: "None — capital commitment vehicle", flag: "green", source: "LPA" },
        { label: "Carry Trigger", value: "Realization events only — no intra-period carry", flag: "green", source: "LPA" },
        { label: "Price Manipulation Incentive", value: "Low given fund structure", flag: "green", source: "Alpine Analysis" },
      ]},
      { group: "Asset Existence", items: [
        { label: "Multi-Party Transaction Involvement", value: "Apex + Manager + Portfolio Company required for each transaction", flag: "green", source: "Apex Verification Call" },
        { label: "Audit Confirmations", value: "Baker Thompson confirms ~50% of portfolio companies annually", flag: "green", source: "DDQ" },
        { label: "Share Certificates (Carta)", value: "Apex obtains directly from portfolio companies — independent of Manager", flag: "green", source: "Apex Verification Call" },
        { label: "Wire Verification", value: "Apex independently verifies wire details with portfolio companies", flag: "green", source: "Apex Verification Call" },
      ]},
      { group: "Investor Reporting", items: [
        { label: "Quarterly Reports", value: "Within 45 business days — FundPanel LP Portal", source: "DDQ" },
        { label: "Audited Financials", value: "Within 120 days of year-end (U.S. GAAP)", source: "DDQ" },
        { label: "Auditor", value: "Baker, Thompson & Co. LLP (expected for Fund IV)", source: "DDQ" },
        { label: "Prior Reporting Errors", value: "None — Manager and Admin both confirmed", flag: "green", source: "Apex Verification Call" },
      ]},
    ],
  },
  8: {
    name: "Manager Transparency & LP Communications", rating: "GREEN",
    summary: "GREEN: Manager and administrator were fully cooperative throughout due diligence. Proactive disclosure of operational weaknesses. No instances of evasion or restricted scope. Apex independently confirmed all key operational arrangements. Prior funds have no reporting errors.",
    findings: `### Diligence Cooperation

The Manager was responsive and forthcoming throughout the due diligence process, providing requested documents promptly and making staff available for follow-up questions. There were no instances of evasion, delayed responses, or attempts to restrict the scope of Alpine's review.

### Administrator Independence

Apex Fund Services was cooperative and provided independent confirmation of key operational arrangements via conference call on April 3, 2026. Apex independently verified service provider engagements, described its operational procedures in detail, and confirmed cash control and wire authorization processes without prompting from the Manager. This level of independent corroboration is a meaningful positive signal.

### Proactive Disclosure

The Manager proactively disclosed areas of operational weakness, including the current lack of back office resources, the underdeveloped cybersecurity environment, and the timeline for planned improvements. This level of candor is constructive and indicates a willingness to address operational gaps, which informs Alpine's overall YELLOW rather than RED assessment.`,
    docCategories: [], riskObsIds: [],
    dataPoints: [
      { group: "Diligence Process", items: [
        { label: "Document Responsiveness", value: "Prompt — all requested documents provided", flag: "green", source: "Alpine Analysis" },
        { label: "Staff Availability", value: "Both Managing Partners available for follow-up", flag: "green", source: "Alpine Analysis" },
        { label: "Scope Restrictions", value: "None — full access granted", flag: "green", source: "Alpine Analysis" },
        { label: "Proactive Disclosures", value: "Voluntarily disclosed back office gaps and cybersecurity limitations", flag: "green", source: "Alpine Analysis" },
      ]},
      { group: "Administrator Corroboration", items: [
        { label: "Apex Verification Call", value: "April 3, 2026 — independent of Manager", source: "Apex Verification Call" },
        { label: "Service Provider Confirmation", value: "Apex independently confirmed all key operational arrangements", flag: "green", source: "Apex Verification Call" },
        { label: "Cash Control Description", value: "Apex described wire authorization procedures without Manager prompting", flag: "green", source: "Apex Verification Call" },
        { label: "Prior Fund Reporting", value: "No investor reporting errors across all prior funds", flag: "green", source: "Apex Verification Call" },
      ]},
    ],
  },
};

// ── Source metadata for RefDot citations ────────────────────────────────────

export const TRELLIS_SOURCE_META: Record<string, { label: string; type: string; filename?: string; size?: string }> = {
  "trellis_ddq_2026.pdf": { label: "Trellis Capital IV — Due Diligence Questionnaire", type: "Fund Document", filename: "sample_vc_fund_iv_alt.pdf", size: "3.2 MB" },
  "trellis_form_adv.pdf": { label: "Form ADV (ERA) — March 2026", type: "Regulatory Filing", filename: "sample_vc_fund_iv_alt.pdf", size: "890 KB" },
  "trellis_lpa.pdf": { label: "Limited Partnership Agreement — Fund IV", type: "Fund Document", filename: "sample_vc_fund_iv_alt.pdf", size: "2.8 MB" },
  "trellis_ppm.pdf": { label: "Private Placement Memorandum — Fund IV", type: "Fund Document", filename: "sample_vc_fund_iv_alt.pdf", size: "4.1 MB" },
  "trellis_valuation_policy.pdf": { label: "Valuation Policy (undated)", type: "Operations Document", filename: "sample_vc_fund_iv_alt.pdf", size: "180 KB" },
  "SEC_EDGAR": { label: "SEC EDGAR — IARD (ERA Register)", type: "SEC Verification", size: undefined },
  "ALPINE_ANALYSIS": { label: "Alpine Cross-Reference Analysis", type: "Alpine Analysis", size: undefined },
  "MANAGER_CALL": { label: "Manager Due Diligence Call", type: "Manager Interview", size: undefined },
  "ADMIN_VERIFICATION": { label: "Apex Fund Services Verification Call (Apr 3, 2026)", type: "Third-Party Confirmation", size: undefined },
  "DDQ": { label: "Due Diligence Questionnaire (2026)", type: "Fund Document", filename: "sample_vc_fund_iv_alt.pdf", size: "3.2 MB" },
  "Form ADV": { label: "Form ADV (ERA) — March 22, 2026", type: "Regulatory Filing", filename: "sample_vc_fund_iv_alt.pdf", size: "890 KB" },
  "LPA": { label: "Limited Partnership Agreement — Fund IV", type: "Fund Document", filename: "sample_vc_fund_iv_alt.pdf", size: "2.8 MB" },
  "PPM": { label: "Private Placement Memorandum — Fund IV", type: "Fund Document", filename: "sample_vc_fund_iv_alt.pdf", size: "4.1 MB" },
  "Valuation Policy": { label: "Valuation Policy (undated)", type: "Operations Document", filename: "sample_vc_fund_iv_alt.pdf", size: "180 KB" },
  "Delaware Register": { label: "Delaware Division of Corporations — Direct Check", type: "SEC Verification", size: undefined },
  "IARD Register": { label: "IAPD / IARD ERA Register", type: "SEC Verification", size: undefined },
  "Alpine Analysis": { label: "Alpine Cross-Reference Analysis", type: "Alpine Analysis", size: undefined },
  "Apex Verification Call": { label: "Apex Fund Services — Verification Call, April 3, 2026", type: "Third-Party Confirmation", size: undefined },
  "Manager Response": { label: "Manager Direct Response", type: "Follow-Up Response", size: undefined },
};

// ── Risk observations & strengths ────────────────────────────────────────────

export const TRELLIS_MOCK = {
  fund: {
    name: "Trellis Capital IV, L.P.",
    manager: "Trellis Capital Management, LLC",
    strategy: "Pre-seed Venture Capital",
    aum: "$280.3M + $113.7M uncalled",
  },
  risk_observations: [
    { id: "TO-001", severity: "HIGH", topic: "Manager, Ownership & Governance", title: "No formal succession plan", detail: "No documented succession plan exists. LPA key person provision only triggers if both Managing Partners are simultaneously unavailable. Key person life insurance not maintained.", remediation: "Document a formal succession plan identifying interim responsibility if either Managing Partner becomes unavailable. Consider key person insurance.", benchmark: { portfolio_pct: 72, portfolio_label: "of portfolio VC funds have documented succession plans", industry_pct: 68, industry_label: "industry benchmark (emerging managers)", is_outlier: false } },
    { id: "TO-002", severity: "MEDIUM", topic: "Manager, Ownership & Governance", title: "Background checks completed internally, not by third-party provider", detail: "Employee background checks are completed internally rather than by an independent third-party provider. This reduces the independence and rigor of the screening process.", remediation: "Engage a third-party background check provider for all investment professionals. Search underway.", benchmark: { portfolio_pct: 85, portfolio_label: "of portfolio funds use third-party background checks", industry_pct: 79, industry_label: "industry benchmark", is_outlier: true } },
    { id: "TO-003", severity: "MEDIUM", topic: "Manager, Ownership & Governance", title: "Limited internal resources: single back office / operations professional", detail: "Sarah Collins (Head of Operations) focuses on executive assistant responsibilities. The funds operate without internal back office oversight of the Administrator's accounting work.", remediation: "Hire a full-time Head of Finance or back office professional. Fractional CFO (Raj Patel) expected Summer 2026 as interim step.", benchmark: { portfolio_pct: 58, portfolio_label: "of comparable AUM VC managers have dedicated ops/finance staff", industry_pct: 71, industry_label: "industry benchmark (funds >$100M AUM)", is_outlier: true } },
    { id: "TO-004", severity: "HIGH", topic: "Legal, Regulatory & Compliance", title: "Investment professional responsible for compliance oversight — REQUIRED BEFORE CLOSE", detail: "Priya Sharma (Co-Founder, Managing Partner) is responsible for compliance oversight in addition to investment responsibilities. Alpine requires this to be transferred to a non-investment professional.", remediation: "Transfer compliance oversight to Sarah Collins (Head of Operations) or engage a dedicated compliance professional. Required before close — investor side letter commitment recommended.", benchmark: { portfolio_pct: 64, portfolio_label: "of VC funds separate compliance from investment professionals", industry_pct: 72, industry_label: "industry benchmark (institutional LPs)", is_outlier: true } },
    { id: "TO-005", severity: "HIGH", topic: "Technology, Cybersecurity & Business Resilience", title: "Substantially underdeveloped cybersecurity environment — REQUIRED BEFORE CLOSE", detail: "No cybersecurity framework, no incident response plan, no penetration testing, no endpoint DLP, no written BCP. Cybersecurity vendor search in progress but no implementation to date.", remediation: "Engage cybersecurity vendor; implement formal policy, vulnerability testing, and training program by end of 2026. Require written commitment via side letter.", benchmark: { portfolio_pct: 45, portfolio_label: "of comparable VC funds have formal cybersecurity framework", industry_pct: 63, industry_label: "industry benchmark (institutional standards)", is_outlier: true } },
    { id: "TO-006", severity: "MEDIUM", topic: "Legal, Regulatory & Compliance", title: "No initial attestation with respect to compliance manual", detail: "Staff are not required to attest to having read or understood compliance policies upon joining the firm.", remediation: "Implement initial compliance attestation process for all new staff." },
    { id: "TO-007", severity: "MEDIUM", topic: "Legal, Regulatory & Compliance", title: "No annual compliance training program", detail: "No formal annual compliance training program has been implemented across the firm.", remediation: "Implement annual compliance training program. Basic online training platforms are available at low cost." },
    { id: "TO-008", severity: "LOW", topic: "Legal, Regulatory & Compliance", title: "Manager does not have a written personal trading policy", detail: "Not required for ERAs but considered best practice, particularly as the firm grows and investment professionals access material non-public information.", remediation: "Adopt a written personal trading policy as part of broader compliance manual enhancement." },
    { id: "TO-009", severity: "MEDIUM", topic: "Technology, Cybersecurity & Business Resilience", title: "No endpoint data loss prevention solution", detail: "Staff maintain access to removable media, personal email, and personal cloud storage on company-issued endpoints, creating risk of sensitive data exfiltration.", remediation: "Implement endpoint DLP as part of planned cybersecurity vendor engagement." },
    { id: "TO-010", severity: "MEDIUM", topic: "Technology, Cybersecurity & Business Resilience", title: "No formal incident response plan", detail: "No documented procedures for responding to a cybersecurity incident, data breach, or ransomware event.", remediation: "Develop written incident response plan as part of planned cybersecurity vendor engagement." },
    { id: "TO-011", severity: "MEDIUM", topic: "Technology, Cybersecurity & Business Resilience", title: "No network penetration testing completed", detail: "No independent penetration testing has been conducted to identify vulnerabilities in the firm's IT environment.", remediation: "Commission annual penetration test from qualified cybersecurity firm as part of planned vendor engagement." },
    { id: "TO-012", severity: "LOW", topic: "Fund Structure, Terms & Investor Alignment", title: "Fund does not have an LPAC / Advisory Board", detail: "No Limited Partner Advisory Committee exists. LPAC formation is at GP discretion absent LP requests. At $125M+ initial close, an LPAC would be standard practice.", remediation: "Form an LPAC at the Fund IV initial close or upon a future closing. Low priority." },
    { id: "TO-013", severity: "MEDIUM", topic: "Investment Operations & Portfolio Controls", title: "Manager does not maintain internal accounting records or track cash balances", detail: "No internal accounting records — Manager relies entirely on Apex. No verification layer between Manager and Administrator for day-to-day accounting.", remediation: "Fractional CFO (Raj Patel) expected Summer 2026 should establish minimum internal recordkeeping. Target full-time Head of Finance by 2027." },
    { id: "TO-014", severity: "MEDIUM", topic: "Valuation, Asset Existence & Investor Reporting", title: "No formal valuation committee", detail: "Front office investment professionals (Managing Partners) are exclusively responsible for valuations. While fund structure reduces valuation sensitivity, formal governance would be best practice.", remediation: "Form a valuation committee with representation from Apex and/or an independent member when fund size warrants." },
    { id: "TO-015", severity: "LOW", topic: "Valuation, Asset Existence & Investor Reporting", title: "Front office investment professionals primarily responsible for valuation", detail: "No separation between investment and valuation decisions. Mitigated by the low incentive for manipulation in a finite-life VC structure.", remediation: "Include non-investment representation in valuation process as firm matures." },
  ],
  strengths: [
    { title: "Multi-party asset verification involving Apex, Baker Thompson, and Carta", detail: "Independent verification chain makes fictitious investment creation extremely difficult. Carta share certificates obtained directly by Apex without Manager involvement." },
    { title: "Appropriate cash controls with dual-authorization wire process", detail: "All wires require authorized Apex initiation plus Managing Partner release. Callback verification for new payment instructions. Bill.com for operating expenses with two-party approval." },
    { title: "Established provider relationships continued from prior funds", detail: "Apex (admin), Baker Thompson (audit), Morrison Cole Ashworth (counsel) all continuing from Fund I–III. Deep institutional knowledge of the Manager's operations." },
    { title: "Proactive disclosure of operational weaknesses", detail: "Manager voluntarily identified and disclosed all operational gaps without prompting. This level of transparency is uncommon and reflects well on management culture." },
    { title: "Strong investment track record across three prior funds", detail: "Funds I and II fully deployed. Fund III 64% deployed from 2024 vintage. Both Managing Partners have deep VC pedigrees (Founder Collective, Foundation Capital)." },
  ],
  fund_performance: {
    aum_history: [
      { date: "2018-12", aum: 47 }, { date: "2019-12", aum: 47 },
      { date: "2020-12", aum: 47 }, { date: "2021-12", aum: 125 },
      { date: "2022-12", aum: 125 }, { date: "2023-12", aum: 125 },
      { date: "2024-12", aum: 275 }, { date: "2025-12", aum: 280 },
    ],
    annual_returns: [],
    risk_metrics: {
      sharpe_ratio: 0, sortino_ratio: 0, max_drawdown: "N/A", max_drawdown_date: "N/A",
      volatility: "N/A", beta: "N/A", correlation_sp500: "N/A",
    },
    fees: { management_fee: "2.5% (commitment period) / 1.5% (post)", performance_fee: "20%", hurdle_rate: "None", high_water_mark: false, clawback: true },
    liquidity: { redemption_notice: "N/A (closed-end)", redemption_frequency: "N/A (closed-end)", lock_up: "N/A", gate: "N/A", side_pocket: "N/A" },
    fund_terms: { minimum_investment: "$1M", domicile: "Delaware LP", fiscal_year: "12/31", nav_frequency: "Quarterly", administrator: "Apex Fund Services, LLC (expected)", auditor: "Baker, Thompson & Co. LLP (expected)" },
  },
  investor_base: {
    total_investors: 0,
    investor_types: [
      { type: "Endowment / Foundation", count: 0, pct: 40 },
      { type: "Family Office", count: 0, pct: 30 },
      { type: "Fund of Funds", count: 0, pct: 20 },
      { type: "Other Institutional", count: 0, pct: 10 },
    ],
    geography: [
      { region: "North America", pct: 85 },
      { region: "Europe", pct: 10 },
      { region: "Asia-Pacific", pct: 5 },
    ],
    concentration: {
      top_investor_pct: 0, top_5_pct: 0, top_10_pct: 0,
      assessment: "Fund IV in initial close (April 2026). Investor concentration data not yet available.",
    },
    redemption_history: [],
  },
  peer_comparison: {
    peers: [
      { name: "Sequoia Capital (Scout Fund)", strategy: "Pre-seed VC", aum: "N/A", score: 88, odd_rating: "ACCEPT" },
      { name: "Initialized Capital", strategy: "Pre-seed VC", aum: "$770M", score: 74, odd_rating: "WATCHLIST" },
      { name: "Y Combinator Continuity", strategy: "Early-stage VC", aum: "$500M+", score: 79, odd_rating: "ACCEPT" },
    ],
    benchmark_comparison: [
      { metric: "Governance & Organization", assessment: "Below peer average", ridgeline: 55, peer_avg: 70, delta: -15 },
      { metric: "Regulatory Compliance", assessment: "Below peer average", ridgeline: 30, peer_avg: 62, delta: -32 },
      { metric: "Technology & Cybersecurity", assessment: "Below peer average", ridgeline: 20, peer_avg: 58, delta: -38 },
      { metric: "Fund Structure & Terms", assessment: "At peer average", ridgeline: 80, peer_avg: 78, delta: 2 },
      { metric: "Service Provider Quality", assessment: "Above peer average", ridgeline: 82, peer_avg: 72, delta: 10 },
      { metric: "Operational Controls", assessment: "Below peer average", ridgeline: 55, peer_avg: 66, delta: -11 },
    ],
  },
};

// ── Document vault data ──────────────────────────────────────────────────────

export const TRELLIS_VAULT_DATA = {
  total_documents: 10,
  total_size_mb: 28,
  categories: [
    { name: "Regulatory", count: 1, icon: "shield" },
    { name: "ODD Review", count: 1, icon: "search" },
    { name: "Legal", count: 3, icon: "scale" },
    { name: "Financial", count: 2, icon: "chart" },
    { name: "Operations", count: 2, icon: "settings" },
    { name: "Compliance", count: 1, icon: "check-circle" },
  ],
  recent_activity: [
    { action: "uploaded", document: "DDQ (April 2026)", user: "Trellis Capital IR", time: "18 days ago", category: "ODD Review" },
    { action: "uploaded", document: "Form ADV (March 22, 2026)", user: "Summit Advisory", time: "18 days ago", category: "Regulatory" },
    { action: "reviewed", document: "Limited Partnership Agreement — Fund IV", user: "Alpine Team", time: "16 days ago", category: "Legal" },
    { action: "uploaded", document: "Fund III Audited Financials FY2024", user: "Baker Thompson", time: "15 days ago", category: "Financial" },
    { action: "reviewed", document: "Valuation Policy", user: "Alpine Team", time: "14 days ago", category: "Operations" },
    { action: "reviewed", document: "Compliance Binder", user: "Alpine Team", time: "12 days ago", category: "Compliance" },
  ],
  documents: [
    { id: "TDOC-001", name: "Form ADV Part 1 / ERA Filing (March 22, 2026)", category: "Regulatory", date: "2026-03-22", size_kb: 920, pages: 14, status: "reviewed", tags: ["regulatory", "ERA", "Form ADV"], uploaded_by: "Summit Advisory", risk_flags: ["TO-004"] },
    { id: "TDOC-002", name: "DDQ Responses (April 2026)", category: "ODD Review", date: "2026-04-01", size_kb: 3200, pages: 48, status: "reviewed", tags: ["DDQ", "operational"], uploaded_by: "Trellis Capital IR", risk_flags: ["TO-003", "TO-004", "TO-005"] },
    { id: "TDOC-003", name: "Limited Partnership Agreement — Fund IV", category: "Legal", date: "2026-03-28", size_kb: 4800, pages: 62, status: "reviewed", tags: ["LPA", "fund terms"], uploaded_by: "Morrison Cole Ashworth", risk_flags: [] },
    { id: "TDOC-004", name: "Private Placement Memorandum — Fund IV", category: "Legal", date: "2026-03-28", size_kb: 5600, pages: 74, status: "reviewed", tags: ["PPM", "offering"], uploaded_by: "Morrison Cole Ashworth", risk_flags: [] },
    { id: "TDOC-005", name: "Subscription Agreement Template — Fund IV", category: "Legal", date: "2026-03-28", size_kb: 1800, pages: 22, status: "reviewed", tags: ["subscription", "legal"], uploaded_by: "Morrison Cole Ashworth", risk_flags: [] },
    { id: "TDOC-006", name: "Fund III Audited Financial Statements FY2024", category: "Financial", date: "2025-10-15", size_kb: 4200, pages: 38, status: "reviewed", tags: ["audit", "financial"], uploaded_by: "Baker Thompson", risk_flags: [] },
    { id: "TDOC-007", name: "Fund III Audited Financial Statements FY2023", category: "Financial", date: "2024-09-30", size_kb: 3800, pages: 34, status: "reviewed", tags: ["audit", "financial"], uploaded_by: "Baker Thompson", risk_flags: [] },
    { id: "TDOC-008", name: "Valuation Policy (undated)", category: "Operations", date: "2026-04-01", size_kb: 280, pages: 8, status: "flagged", tags: ["valuation"], uploaded_by: "Trellis Capital IR", risk_flags: ["TO-014"] },
    { id: "TDOC-009", name: "Apex Fund Services — Service Description (Fund III)", category: "Operations", date: "2026-04-01", size_kb: 920, pages: 14, status: "reviewed", tags: ["administrator", "Apex"], uploaded_by: "Apex Fund Services", risk_flags: [] },
    { id: "TDOC-010", name: "Compliance Binder (Summit Advisory, 2025)", category: "Compliance", date: "2025-12-01", size_kb: 1400, pages: 18, status: "reviewed", tags: ["compliance", "ERA"], uploaded_by: "Trellis Capital IR", risk_flags: ["TO-006", "TO-007"] },
  ],
  search_suggestions: ["Compliance oversight transfer", "Cybersecurity vendor timeline", "Succession plan", "Apex verification call", "Valuation committee formation", "LPAC formation"],
};

// ── Follow-Up mock data ──────────────────────────────────────────────────────

export const TRELLIS_FOLLOW_UP_MOCK = {
  rounds: [
    {
      round_number: 1,
      status: "complete",
      generated_at: "2026-04-07",
      completed_at: "2026-04-14",
      questions: [
        {
          id: "tfu-q1", number: 1, priority: "critical", topic_number: 2,
          sub_topic_ids: ["2.1"],
          question_text: "Compliance Oversight Transfer",
          sub_items: [
            { label: "Confirmation that compliance oversight will be transferred to a non-investment professional before close", resolved: true, resolved_by: "Manager Response", response_type: "text", response_text: "We agree to transfer day-to-day compliance oversight to Sarah Collins (Head of Operations) effective immediately. Priya Sharma will retain ultimate responsibility but Sarah will handle all compliance monitoring, attestations, and vendor interactions. We will document this in writing and confirm via side letter." },
            { label: "Timeline for side letter commitment on compliance transfer", resolved: true, resolved_by: "Manager Response", response_type: "text", response_text: "We will include a compliance oversight commitment in the side letter template for Fund IV LPs. Target: include in closing documents for initial close." },
          ],
          status: "answered",
        },
        {
          id: "tfu-q2", number: 2, priority: "critical", topic_number: 3,
          sub_topic_ids: ["3.1"],
          question_text: "Cybersecurity Vendor Engagement",
          sub_items: [
            { label: "Timeline and scope for cybersecurity vendor engagement", resolved: true, resolved_by: "Manager Response", response_type: "text", response_text: "Sarah Collins is in active conversations with two cybersecurity vendors (one Bay Area boutique, one national firm). We expect to execute an engagement agreement by end of May 2026. Scope will include: formal security audit, penetration test, written cybersecurity policy, incident response plan, and annual training program. Target completion: end of 2026 as stated." },
            { label: "Side letter commitment for cybersecurity remediation by end of 2026", resolved: true, resolved_by: "Manager Response", response_type: "text", response_text: "Agreed. We will include a commitment in the side letter to complete the cybersecurity vendor engagement and deliver a written cybersecurity policy, penetration test, and training program by December 31, 2026.", commitment: "Written cybersecurity policy + pentest + training by December 31, 2026" },
          ],
          status: "answered",
        },
        {
          id: "tfu-q3", number: 3, priority: "important", topic_number: 1,
          sub_topic_ids: ["1.3"],
          question_text: "Fractional CFO and Back Office Plan",
          sub_items: [
            { label: "Raj Patel start date and scope of engagement", resolved: true, resolved_by: "Manager Response", response_type: "text", response_text: "Raj Patel will begin dedicating meaningful time in June/July 2026. He will focus on: (1) reviewing and validating Apex's quarterly close packages, (2) implementing basic internal cash tracking, and (3) developing a plan for a full-time Head of Finance hire in 2027. Raj has deep experience with Apex's systems from prior roles." },
            { label: "Plan for full-time back office hire", resolved: true, resolved_by: "Manager Response", response_type: "text", response_text: "We are targeting a full-time Head of Finance hire in 2027 once Fund IV is fully operational and management fee revenue supports the hire. Board approved budget allocation for this role.", commitment: "Full-time Head of Finance hire targeted for 2027" },
          ],
          status: "answered",
        },
        {
          id: "tfu-q4", number: 4, priority: "important", topic_number: 5,
          sub_topic_ids: ["5.1"],
          question_text: "Service Provider Engagement Letters — Fund IV",
          sub_items: [
            { label: "Apex Fund Services engagement letter for Fund IV", resolved: true, resolved_by: "Manager Response", response_type: "text", response_text: "Apex engagement letter for Fund IV is in legal review. Expected execution before first capital call (targeted for May 2026)." },
            { label: "Baker Thompson engagement letter for Fund IV", resolved: true, resolved_by: "Manager Response", response_type: "text", response_text: "Baker Thompson engagement letter expected before first year-end audit. We have verbal agreement from the Baker Thompson partner who covers our prior funds." },
            { label: "JP Morgan account status — Pacific Commerce transition", resolved: true, resolved_by: "Manager Response", response_type: "text", response_text: "JP Morgan migration is progressing. We expect the Fund IV account to be fully operational under JP Morgan by the time the first capital call occurs. Apex is monitoring the transition." },
          ],
          status: "answered",
        },
        {
          id: "tfu-q5", number: 5, priority: "important", topic_number: 7,
          sub_topic_ids: ["7.1"],
          question_text: "Valuation Governance",
          sub_items: [
            { label: "Plan for formalizing valuation committee or adding non-investment representation", resolved: true, resolved_by: "Manager Response", response_type: "text", response_text: "We acknowledge this gap. Our plan is for Raj Patel (fractional CFO) to serve as the third party in valuation decisions starting Summer 2026, with the goal of formalizing this into a written valuation committee charter by year-end 2026. This would give us Managing Partner (Arjun), Operations (Sarah Collins), and Finance (Raj Patel) on the committee.", commitment: "Written valuation committee charter by end of 2026" },
            { label: "Updated valuation policy with date and escalation criteria", resolved: true, resolved_by: "Manager Response", response_type: "text", response_text: "We will have our counsel update the valuation policy to include an effective date and to reference the forthcoming valuation committee structure. Expected: May 2026.", commitment: "Updated valuation policy by May 2026" },
          ],
          status: "answered",
        },
      ],
    },
  ],
  monitoring_items: [
    { commitment: "Compliance oversight transfer to non-investment professional", expected: "Before close", source: "Round 1 Follow-Up", topic: "Legal, Regulatory & Compliance", status: "pending" },
    { commitment: "Written cybersecurity policy + penetration test + training program", expected: "December 31, 2026", source: "Round 1 Follow-Up", topic: "Technology & Cybersecurity", status: "pending" },
    { commitment: "Apex Fund Services engagement letter — Fund IV", expected: "Before first capital call (May 2026)", source: "Round 1 Follow-Up", topic: "Service Providers", status: "pending" },
    { commitment: "Raj Patel fractional CFO — active engagement", expected: "June/July 2026", source: "Round 1 Follow-Up", topic: "Investment Operations", status: "pending" },
    { commitment: "Full-time Head of Finance hire", expected: "2027", source: "Round 1 Follow-Up", topic: "Investment Operations", status: "pending" },
    { commitment: "Written valuation committee charter", expected: "End of 2026", source: "Round 1 Follow-Up", topic: "Valuation & Reporting", status: "pending" },
  ],
};

// ── Document collection ──────────────────────────────────────────────────────

export const TRELLIS_COLLECTION_DOCS = [
  { name: "Due Diligence Questionnaire (DDQ, April 2026)", type: "DDQ", date: "2026-04-01", source: "Manager Upload" },
  { name: "Form ADV Part 1 / ERA Filing (March 22, 2026)", type: "Regulatory", date: "2026-04-01", source: "Manager Upload" },
  { name: "Limited Partnership Agreement — Fund IV", type: "Legal", date: "2026-04-01", source: "Manager Upload" },
  { name: "Private Placement Memorandum — Fund IV", type: "Legal", date: "2026-04-01", source: "Manager Upload" },
  { name: "Subscription Agreement Template — Fund IV", type: "Legal", date: "2026-04-01", source: "Manager Upload" },
  { name: "Fund III Audited Financial Statements FY2024", type: "Financial", date: "2026-04-01", source: "Manager Upload" },
  { name: "Fund III Audited Financial Statements FY2023", type: "Financial", date: "2026-04-01", source: "Manager Upload" },
  { name: "Valuation Policy (undated)", type: "Operations", date: "2026-04-01", source: "Manager Upload" },
  { name: "Compliance Binder (Summit Advisory, 2025)", type: "Compliance", date: "2026-04-01", source: "Manager Upload" },
  { name: "Apex Fund Services — Service Description (Fund III)", type: "Operations", date: "2026-04-01", source: "Manager Upload" },
];
