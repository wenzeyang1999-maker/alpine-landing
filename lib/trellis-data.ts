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
    summary: "Dual co-founder ownership (50/50 Mehta / Sharma). Strong VC pedigree. 7 FTEs — single operations professional functions as executive assistant, not back office. Significant turnover in last 18 months (3 departures). No formal succession plan. GP commits 1% pari passu. YELLOW: absence of internal back office partially mitigated by fractional CFO (Summer 2026) and planned Head of Finance (2027).",
    findings: `### Management Company and Affiliates

Trellis Capital Management, LLC ("Trellis", the "Manager") is a pre-seed stage venture capital firm headquartered in San Francisco. Trellis was founded in 2018 by Arjun Mehta (Co-Founder, Managing Partner) and Priya Sharma (Co-Founder, Managing Partner). Prior to founding the firm, Arjun was a principal at Founder Collective, a Boston area seed-stage venture firm, while Priya was a partner at Foundation Capital, a venture firm based in Silicon Valley.

Trellis has deployed capital across four funds: Fund I (2018, $47 million, fully deployed), Fund II (2021, $78 million, fully deployed), Fund III (2024, $150 million, 64% deployed / reserved), and Fund IV (2026, ~$125 million initial close, pre-deployment).

### Assets under Management

Trellis reported net assets of $280.3 million as of December 31, 2025, plus $113.7 million in uncalled capital out of $274 million in total commitments to the firm's first three funds. The firm also manages several co-investment special purpose vehicles ("SPVs") with total assets of $24.7 million as of the same date.

### Insider Investment

GP commitments to Funds I-III were 1% of total commitments (~$2.8 million), contributed in cash and invested pari passu with LP commitments, free of management fees.

### Ownership & Succession

Arjun Mehta and Priya Sharma each own 50% of the firm (confirmed via Form ADV Schedules A & B). No formal succession plan exists, though the Managing Partners could assume each other's responsibilities in a key person event. The key person provision (per Fund IV's LPA) would only be automatically triggered if both Managing Partners fail to provide sufficient time and attention. Key person life insurance is not maintained.

### Human Resources

With a total headcount of seven full-time employees — six investment professionals and Sarah Collins (Head of Operations) — Trellis is a small organization with resultant limitations to segregation of duties. Sarah's responsibilities focus on running business operations and acting as an executive assistant for the Managing Partners, rather than serving as a back office resource for the funds. The investment team consists of Arjun Mehta and Priya Sharma (Co-Founders, Managing Partners), Kevin Chen (Principal, joined Q2 2025), Rachel Winters (Associate), Ryan Mitchell (Analyst), and Vikram Nair (Chief Product Officer, departure planned Summer 2026).

The firm has recently retained Raj Patel as fractional CFO (former CFO of Atomic, a Miami-based venture studio). Raj will focus on overseeing Apex, though he will not dedicate substantial time until Summer 2026. A full-time Head of Finance is planned for 2027. James Crawford, an independent attorney and former partner at Hartwell & Sterling, is retained on an ad hoc basis for deal-related legal matters.

### Staff Turnover

Regarding staff turnover: Omar Hassan (Associate) departed in August 2025 to pursue personal business endeavors, while Emily Brooks (Head of Operations) departed in December 2024 to move into an investment-focused role. Both departures were amicable. Sarah Collins was hired in July 2025 to replace Emily. Sanjay Gupta, a part-time venture partner, departed near end of 2024 to start his own venture firm.

Kevin Chen joined as a principal in Q2 2025. Vikram Nair, who began as a part-time venture partner in early 2024, was brought on full-time as Chief Product Officer but is planning to leave this summer to start his own company. A talent recruiter has been hired to identify replacement candidates.

### Background Checks

Employee background checks have been completed by the Managing Partners on an internal basis. The firm has not engaged a third-party background check provider, though a search for one is currently underway based on investor feedback. Staff are compensated with a base salary and discretionary bonus, and all investment staff participate in carried interest vesting over four years.

### YELLOW Rating Rationale

The YELLOW rating reflects two primary deficiencies: (1) the sole operations professional (Sarah Collins) functions as an executive assistant rather than a back office resource, leaving no internal oversight of the Administrator's accounting work; and (2) significant recent staff turnover relative to team size. These are partially mitigated by the planned engagement of fractional CFO Raj Patel (Summer 2026) who will focus on Apex oversight, and the targeted full-time Head of Finance hire in 2027.`,
    docCategories: ["Governance"], riskObsIds: ["TO-001", "TO-002", "TO-003", "TO-003b"],
    verificationCategory: "governance",
    dataPoints: [
      { group: "Management Company", items: [
        { label: "Manager Name", value: "Trellis Capital Management, LLC", source: "Form ADV" },
        { label: "Date of Formation", value: "August 19, 2018", source: "Delaware Register" },
        { label: "Primary Location", value: "San Francisco, CA", source: "Form ADV" },
        { label: "Total Headcount", value: "7 FTEs (6 investment, 1 operations)", source: "DDQ" },
        { label: "AUM (Net Assets, 12/31/2025)", value: "$280.3 million", source: "Form ADV" },
        { label: "Uncalled Capital", value: "$113.7 million", source: "DDQ" },
        { label: "Co-Investment SPVs (12/31/2025)", value: "$24.7 million", source: "DDQ" },
      ]},
      { group: "Investment Team", items: [
        { label: "Co-Founder / Managing Partner", value: "Arjun Mehta — Founder Collective, Foundation Capital background", source: "Form ADV" },
        { label: "Co-Founder / Managing Partner", value: "Priya Sharma — responsible for compliance (investment professional)", flag: "red", source: "Form ADV" },
        { label: "Principal", value: "Kevin Chen — joined Q2 2025", source: "DDQ" },
        { label: "Associate", value: "Rachel Winters", source: "DDQ" },
        { label: "Analyst", value: "Ryan Mitchell", source: "DDQ" },
        { label: "Chief Portfolio Officer", value: "Vikram Nair — departure planned Summer 2026", flag: "yellow", source: "DDQ" },
        { label: "Head of Operations", value: "Sarah Collins — executive assistant focus, not back office", flag: "yellow", source: "DDQ" },
      ]},
      { group: "Advisors & Extended Team", items: [
        { label: "Fractional CFO", value: "Raj Patel — former CFO of Atomic (Miami-based venture studio); expected Summer 2026; will focus on Apex oversight", flag: "yellow", source: "DDQ" },
        { label: "Independent Deal Counsel", value: "James Crawford — former partner, Hartwell & Sterling; engaged ad hoc per transaction", source: "DDQ" },
      ]},
      { group: "Recent Staff Turnover", items: [
        { label: "Omar Hassan", value: "Departed August 2025", flag: "yellow", source: "DDQ" },
        { label: "Emily Brooks", value: "Departed December 2024 — replaced by Sarah Collins (joined July 2025)", flag: "yellow", source: "DDQ" },
        { label: "Sanjay Gupta", value: "Departed late 2024", flag: "yellow", source: "DDQ" },
        { label: "Vikram Nair (pending)", value: "Chief Portfolio Officer — departure planned Summer 2026", flag: "yellow", source: "DDQ" },
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
    findings: `### Regulatory Oversight

The firm is exempt from registration with the SEC under the venture capital adviser exemption and has filed as an Exempt Reporting Adviser ("ERA") since March 9, 2019. Although not subject to the same regulatory requirements imposed on registered advisers, ERAs are required to complete certain sections of the Form ADV, implement written MNPI policies, and are subject to anti-fraud and "pay-to-play" provisions.

### Compliance Infrastructure and Policies

Priya Sharma (Co-Founder, Managing Partner) is responsible for compliance oversight in addition to her investment responsibilities. Alpine is strongly opposed to an investment professional holding this responsibility and would prefer to see it reside with a non-investment professional such as Sarah Collins (Head of Operations). This is a required action before close.

Compliance consultant usage has been limited to engaging Summit Advisory for annual Form ADV preparation. A broader compliance consultant engagement would strengthen the firm's compliance program. The firm maintains a compliance binder with the required ERA policies (pay-to-play, insider trading, AML). However, there is no initial attestation or annual recertification of compliance policies required from staff, and no annual compliance training program has been implemented.

### Personal Trading

Although the firm has an insider trading policy, the firm does not have a written personal trading policy as this is not a requirement of SEC ERAs. While concerns in this area are limited considering the scope of the firm's investment activities, Alpine would prefer to see a baseline policy in place, in line with broader industry best practices.

### Trade Errors

Due to the nature of the firm's investment activities, trade errors are not anticipated.

### Soft Dollars

The firm does not utilize soft dollars.

### Expert Networks

The firm does not utilize expert networks.

### Anti-Money Laundering / Know Your Customer

The Manager represented that investor AML verifications are completed by Apex Fund Services.

### Claims, Actions, and Conflicts

The firm represented that neither the management company, its affiliates, nor any employees have been subject to any action, claim, investigation, or litigation in the past ten years. Professional liability insurance provides up to $1 million in coverage. The firm's Managing Partners serve on boards of portfolio companies, with any directors' fees waived.

### RED Rating Rationale

Red rating based on the cumulative weight of compliance deficiencies: (1) investment professional responsible for compliance oversight, (2) no compliance attestation or recertification process for staff, (3) no annual compliance training program implemented, and (4) limited compliance consultant engagement. While the firm's policies meet ERA minimum requirements, the overall compliance environment falls below institutional standards.`,
    docCategories: ["Regulatory", "Compliance"], riskObsIds: ["TO-004", "TO-006", "TO-007", "TO-008", "TO-008b"],
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
      { group: "Personal Trading, Soft Dollars & Expert Networks", items: [
        { label: "Personal Trading Policy", value: "Not written (ERA not required, but best practice)", flag: "yellow", source: "DDQ" },
        { label: "Trade Errors", value: "Not anticipated — given nature of investment activities", source: "DDQ" },
        { label: "Soft Dollars", value: "Not utilized", flag: "green", source: "DDQ" },
        { label: "Expert Networks", value: "Not utilized", flag: "green", source: "DDQ" },
      ]},
      { group: "AML / KYC", items: [
        { label: "Investor AML Verifications", value: "Completed by Apex Fund Services on behalf of Manager", flag: "green", source: "DDQ" },
      ]},
      { group: "Claims, Actions & Conflicts", items: [
        { label: "Litigation / Claims (10 years)", value: "None — management company, affiliates, and employees clean", flag: "green", source: "DDQ" },
        { label: "Professional Liability Insurance", value: "Up to $1M coverage", source: "DDQ" },
        { label: "Board Fees Policy", value: "Directors' fees waived — Managing Partners serve on portfolio company boards", flag: "green", source: "DDQ" },
      ]},
    ],
  },
  3: {
    name: "Technology, Cybersecurity & Business Resilience", rating: "RED",
    summary: "RED: Substantially underdeveloped cybersecurity environment. No formal cybersecurity policy, incident response plan, or third-party framework (NIST/ISO). No penetration testing. No DLP on endpoints. No written BCP. Cybersecurity vendor search underway — targeted by end of 2026.",
    findings: `### IT Overview

There is no single individual in charge of IT and the firm has not appointed a technology or cybersecurity consultant. Sarah Collins (Head of Operations) is leading a search for a third-party cybersecurity vendor to conduct a formal audit, vulnerability test, and implement a training program by end of 2026. The firm relies on cloud-based applications with no onsite infrastructure beyond internet connection.

### Cybersecurity Controls

The firm has not created a formal cybersecurity policy or incident response plan. No third-party cybersecurity framework (e.g. NIST, ISO/IEC 27000) has been adopted. No employee cybersecurity awareness training or phishing campaign has been implemented. The firm has not implemented endpoint data loss prevention, and staff maintain access to removable media (USB), personal email, and personal cloud storage on company-issued endpoints. Penetration testing has not been completed.

Controls in place: baseline network security (firewall, anti-virus), user access controls on a need-to-know and least-privilege basis, password-protected accounts (though periodic password changes are not enforced), and MFA on key business applications.

### Business Continuity

The firm does not have a written business continuity plan. Staff maintain the ability to work remotely. The firm should prepare a BCP covering service provider contingency, staff protection during a crisis, and stakeholder communications.

### RED Rating Rationale

Red rating. The cybersecurity environment is underdeveloped across multiple dimensions: no formal cybersecurity policy, no employee awareness training, no incident response plan, no endpoint DLP, no penetration testing, and no written BCP. The planned cybersecurity vendor engagement is a positive step, but the Red rating stands until formal policies and testing are implemented.`,
    docCategories: ["Technology"], riskObsIds: ["TO-005", "TO-009", "TO-010", "TO-011", "TO-011b", "TO-011c"],
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
        { label: "Password Policy", value: "Password-protected accounts — periodic changes not enforced", flag: "yellow", source: "DDQ" },
        { label: "Endpoint DLP", value: "None — removable media (USB), personal email, personal cloud accessible", flag: "red", source: "DDQ" },
        { label: "Penetration Testing", value: "Not completed", flag: "red", source: "DDQ" },
        { label: "Phishing / Awareness Training", value: "None implemented", flag: "red", source: "DDQ" },
      ]},
      { group: "Policies & Plans", items: [
        { label: "Cybersecurity Policy", value: "None documented", flag: "red", source: "DDQ" },
        { label: "Incident Response Plan", value: "None documented", flag: "red", source: "DDQ" },
        { label: "Business Continuity Plan", value: "None written — should cover service provider contingency, staff protection, stakeholder communications", flag: "red", source: "DDQ" },
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

Trellis Capital IV, L.P. is a Delaware limited partnership formed March 28, 2026, confirmed against the Delaware Division of Corporations register. Trellis Capital GP IV, LLC (Delaware LLC) serves as the Fund's general partner. Both entities confirmed.

### Key Terms

Interests are offered in US Dollars with a minimum commitment of $1 million. The GP commitment is 1.01% of aggregate commitments, contributed in cash and invested pari passu with LPs. The Fund held its first closing on April 1, 2026 with approximately $125 million in commitments against a hard cap of $200 million; final closing is expected within the next 1–2 months.

The Fund's term is 10 years from initial closing, subject to two one-year extensions at the GP's sole discretion, with any further extensions requiring LPAC consent (if formed) or a majority-in-interest of LPs. The commitment period is 5 years. Recycling of distributions is permitted up to 120% of aggregate commitments. The key person provision triggers if both Managing Partners fail to devote sufficient business time and attention to the Fund simultaneously. The Fund does not contain a no-fault divorce provision permitting LP removal of the GP absent a "cause" event, though a no-fault dissolution provision exists. Standard clawback mechanics protect LPs against excess carried interest distributions.

### Fee Structure

The management fee is 2.5% per annum on aggregate commitments through the fifth anniversary of commencement, stepping down to 1.5% per annum thereafter. The 2.5% rate is above the 2% standard observed in broader private markets, but is typical of pre-seed venture where smaller fund sizes require a higher fee load to sustain the investment team and infrastructure. A 100% management fee offset applies to any directors', consulting, monitoring, transaction, or break-up fees received from portfolio companies — the Manager represented that such fees are not received in practice.

Distributions follow an American (deal-by-deal) waterfall: return of capital to LPs first, then 20% carried interest to the GP and 80% to LPs. There is no preferred return hurdle, which is uncommon in private equity but typical in pre-seed venture capital where meaningful hurdles would rarely trigger. The clawback provision serves as the principal backstop against over-distribution of carry.

Organizational expenses are capped at $350,000 — reasonable for a fund of this size. The Fund III expense ratio for FYE December 31, 2025 was 12.23% on audited financial statements; investors should monitor the Fund IV expense ratio once audited accounts become available.

### Corporate Governance

The LPA contains an LPAC provision, but the Manager stated an LPAC will only be formed if requested by multiple larger investors. LPACs have not been established for any prior funds. Alpine would welcome the formation of an LPAC.

### Investment Strategy

Pre-seed technology at $1–3M per investment, targeting 40–50 companies via equity, SAFEs, KISS, warrants, and convertible equity. Concentration limits: 10% single company, 5% passive, 10% non-U.S./Canada. Up to 10% in digital assets permitted (not utilized to date).

### GREEN Rating Rationale

Green rating. Terms are consistent with VC market norms. The 2.5% management fee, American waterfall, and absence of a preferred return are flagged but common in the pre-seed VC space.`,
    docCategories: ["Legal"], riskObsIds: ["TO-012"],
    dataPoints: [
      { group: "Fund Details", items: [
        { label: "Fund Name", value: "Trellis Capital IV, L.P.", source: "LPA" },
        { label: "Domicile", value: "Delaware LP (formed March 28, 2026)", source: "Delaware Register" },
        { label: "General Partner", value: "Trellis Capital GP IV, LLC (Delaware LLC)", source: "LPA" },
        { label: "First Closing", value: "April 1, 2026 (~$125M in commitments)", source: "DDQ" },
        { label: "Final Closing (Expected)", value: "Within 1–2 months of April 1, 2026", source: "DDQ" },
        { label: "Target Raise", value: "$175 million", source: "DDQ" },
        { label: "Hard Cap", value: "$200 million", source: "LPA" },
        { label: "Min. Commitment", value: "$1 million", source: "LPA" },
      ]},
      { group: "Fee Structure", items: [
        { label: "Management Fee (Commitment Period)", value: "2.5% on commitments — above 2% private markets standard; typical for pre-seed VC", flag: "yellow", source: "LPA" },
        { label: "Management Fee (Post-Commitment)", value: "1.5% on invested capital", source: "LPA" },
        { label: "Management Fee Offset", value: "100% offset on directors'/consulting/monitoring/transaction/break-up fees (not received in practice)", flag: "green", source: "LPA" },
        { label: "Carried Interest", value: "20% — American (deal-by-deal) waterfall", source: "LPA" },
        { label: "Preferred Return", value: "None — uncommon in PE but typical in pre-seed VC", source: "LPA" },
        { label: "Org. Expenses Cap", value: "$350,000 (reasonable for fund size)", flag: "green", source: "LPA" },
        { label: "Fund III Expense Ratio (FYE 12/31/2025)", value: "12.23% (audited) — monitor Fund IV ratio once available", flag: "yellow", source: "Fund III Financials" },
        { label: "Recycling", value: "Up to 120% of aggregate commitments", source: "LPA" },
      ]},
      { group: "Investor Protections", items: [
        { label: "Fund Term", value: "10 years from initial closing + 2 one-year extensions (GP discretion); further extensions require LPAC consent or LP majority", source: "LPA" },
        { label: "Commitment Period", value: "5 years", source: "LPA" },
        { label: "Key Person Provision", value: "Triggers if both Managing Partners fail to devote sufficient time — not triggered by single MP absence", flag: "yellow", source: "LPA" },
        { label: "No-Fault Divorce", value: "Not present — GP removal requires 'cause'; no-fault dissolution provision only", flag: "yellow", source: "LPA" },
        { label: "Clawback", value: "Yes — per-LP basis; principal backstop against excess carry distributions", flag: "green", source: "LPA" },
        { label: "LPAC", value: "Provision exists; formed only if requested by multiple larger LPs — no LPAC in any prior fund", flag: "yellow", source: "LPA" },
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
    findings: `### Service Provider Overview

| Provider | Function | Entity | Status | Tenure |
|---|---|---|---|---|
| Administrator | Fund accounting, reporting, cash mgmt, AML/KYC | Apex Fund Services, LLC | Expected | Since Fund I |
| Auditor | Annual audit (U.S. GAAP) | Baker, Thompson & Co. LLP | Expected | Since Fund I |
| Corporate Banker | Banking, cash custody | Pacific Commerce Bank (JP Morgan) | Continuation | Since Fund II |
| Legal Counsel | Fund formation | Morrison Cole Ashworth & Partners | Engaged | Current |
| Compliance | Annual Form ADV | Summit Advisory | Engaged (narrow) | Historical |

### Administrator — Apex Fund Services

Apex Fund Services, LLC has been engaged since Fund I. Apex uses Xero for accounting and FundPanel for LP management and reporting. Apex is notably more "hands-on" with respect to valuation than typical PE/VC administrators — proactively updating the Schedule of Investments for known events and providing valuation guidance. Engagement letter for Fund IV is expected before the first capital call. Alpine confirmed Apex's expected engagement via conference call on April 3, 2026.

### Auditor — Baker Thompson & Co. LLP

Baker, Thompson & Co. LLP is a well-known and highly-regarded auditor of VC funds in the Bay Area. Not a Big 4 or next-tier firm, but deeply experienced in the VC space. Baker Thompson also audits the prior funds and certain co-invest SPVs. Engagement expected before the first year-end audit.

### Corporate Banker — Pacific Commerce / JP Morgan

Pacific Commerce Bank collapsed in Q2 2025 and was acquired by JP Morgan. A transition plan is underway — the firm will allow its accounts to transfer when JP Morgan implements the migration. No service disruption to date. Note: Fund I utilizes Silicon Valley Bank (First Citizens Bank). Apex confirmed via the April 3, 2026 conference call that Pacific Commerce remains the operative bank account; the Fund IV account should be confirmed as fully operational under JP Morgan before the first capital call.

### Legal & Compliance

Morrison Cole Ashworth & Partners serves as fund formation counsel, continuing from prior funds. James Crawford (independent attorney, former partner at Hartwell & Sterling) acts as ad hoc deal counsel on a per-transaction basis. Summit Advisory is engaged for annual Form ADV preparation only — a narrower scope than recommended for a firm of this size.

### GREEN Rating Rationale

Green rating. The continuation of established provider relationships from prior funds provides comfort. Engagement letters are expected before the first capital call (administrator) and first year-end audit (auditor). The Pacific Commerce to JP Morgan banking transition should be monitored.`,
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
    findings: `### Portfolio Management Systems

The firm uses a custom-built Retool dashboard ("People Flow") for tracking the deal pipeline and open opportunities, and an Excel dashboard for tracking key financial metrics across certain portfolio companies. The Manager expects the Fund will invest in roughly 40–50 companies.

### Investment Decision Process

All new investments require approval from both Arjun Mehta and Priya Sharma. Deal sourcing breakdown for Fund III: Founder (32%), Angel/Advisor/Scout (26%), Alpha/Founders in Residence (26%), VC referral (10%), Outbound (6%). "Alpha" refers to the firm's pre-seed program to which founders can apply.

### Investment Allocation

The firm does not have a formal written investment allocation policy separate from LPA disclosures. In practice, Fund III will be fully deployed before investing from Fund IV. Co-investments via SPVs are only offered when excess capacity exists. Alpine recommends implementing a formal allocation policy should the firm launch a new strategy or family of funds.

### Cash Tracking & Accounting

The firm does not track individual cash transactions or aggregate cash balances, relying solely on Apex to maintain and reconcile the accounting books and records using Xero. There has been no back office oversight of the Administrator's accounting work to date, though this is expected to improve with the fractional CFO (Summer 2026) and planned Head of Finance (2027).

Apex maintains formal books using Xero: daily cash posting via direct feed from Pacific Commerce, at least weekly reconciliation (more frequent near capital call dates), monthly "soft close," and quarterly "full close" producing balance sheet, schedule of investments, income statement, and statement of changes in partners' capital.

### Cash Controls

All cash movements from Pacific Commerce are effected using the bank's online banking platform, requiring one of two authorized Apex individuals to initiate wires and one Managing Partner to release. Apex completes a verification callback for new payment instructions or changes to existing instructions. Pacific Commerce also occasionally completes callbacks per its own internal policies. Operating expenses are paid via Bill.com, requiring Apex to initiate and a Managing Partner to approve. Both Managing Partners must sign on the opening of new bank accounts.

### YELLOW Rating Rationale

Yellow rating based on: (1) no internal accounting records or cash tracking by the Manager, (2) no back office oversight of the Administrator's accounting work, and (3) Excel-based portfolio management tools. Cash controls are appropriate with dual-authorization and verification callbacks.`,
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
    findings: `### Valuation Controls

As with most closed-ended VC structures, (i) the Fund is a finite-life capital commitment vehicle with no capital transactions based on valuations, and (ii) the General Partner receives carried interest only upon a realization event. These characteristics significantly reduce valuation sensitivity and the incentive for intra-period price manipulation.

The firm has an undated valuation policy. The firm values portfolio companies at cost and marks investments up/down based on the price of a subsequent financing round with a significant new investor. If the financing round includes substantially the same investor group, the firm only marks up if fair value can be demonstrated. The Manager stated it has never marked up based on a portfolio company's performance, but does regularly mark down based on performance or macroeconomic factors.

The firm does not have a formal valuation committee. In practice, valuations are approved by the Managing Partners. On a quarterly basis, Apex prepares the Schedule of Investments, updating for known events, and provides it to the Managing Partners for adjustments and final approval. Apex noted it provides guidance on industry best practices but that valuations are ultimately the Manager's responsibility. Valuations are subject to external oversight only through the annual audit by Baker Thompson.

### Asset Existence & Verification

The Fund's investments are evidenced by private agreements maintained electronically. Share certificates for certain portfolio companies are issued via Carta. Multiple parties are involved in each transaction:

| Verification Layer | Description |
|---|---|
| Investment documentation | Apex receives all docs and wire instructions from Manager |
| Carta certificates | Apex obtains share certificates directly from Carta platform |
| Wire verification | Apex independently verifies wire details with portfolio companies before initiating |
| Audit confirmations | Baker Thompson issues confirmations to ~50% of portfolio companies annually |

### Investor Reporting

Apex will prepare and issue quarterly investor reporting within 45 business days of quarter-end via FundPanel LP Portal. Audited financial statements will be issued annually within 120 days of year-end under U.S. GAAP. The Manager approves all reporting before issuance.

Investor capital account balances are maintained by Apex using FundPanel. Distribution waterfalls are calculated using Excel, then input into FundPanel which generates per-LP distribution amounts. The Manager does not maintain internal records of investor capital account balances or waterfall calculations.

The Manager and Administrator represented that prior funds have never had an investor reporting error. The Fund's first financial reporting period is expected to end on December 31, 2026; Alpine recommends investors review the audited accounts when available.

### YELLOW Rating Rationale

Yellow rating based on: (1) no formal valuation committee, (2) front office exclusively controls pricing, (3) distribution waterfalls maintained in Excel, and (4) no internal investor-level accounting records. These concerns are partially mitigated by the closed-ended structure, carry-on-realization model, and Apex's proactive involvement in the valuation process. Alpine recommends formation of a valuation committee and incorporation of the CFO/Head of Finance into the valuation process.`,
    docCategories: ["Compliance", "Financial"], riskObsIds: ["TO-014", "TO-015"],
    dataPoints: [
      { group: "Valuation Process", items: [
        { label: "Valuation Committee", value: "None — front office (Managing Partners) exclusively", flag: "red", source: "DDQ" },
        { label: "Valuation Policy", value: "Exists (April 2026)", flag: "yellow", source: "Valuation Policy" },
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
    findings: `### Diligence Process Cooperation

The Manager was responsive and forthcoming throughout the due diligence process, providing requested documents promptly and making staff available for follow-up questions. There were no instances of evasion, delayed responses, or attempts to restrict the scope of Alpine's review.

### Administrator Cooperation

Apex was cooperative and provided independent confirmation of key operational arrangements via conference call on April 3, 2026. Apex independently verified service provider engagements, described its operational procedures in detail, and confirmed cash control and wire authorization processes without prompting from the Manager.

### Disclosure Quality

The Manager proactively disclosed areas of operational weakness, including the current lack of back office resources, the underdeveloped cybersecurity environment, and the timeline for planned improvements. This level of candor is constructive and indicates a willingness to address operational gaps.

### GREEN Rating Rationale

Green rating. No issues were noted concerning transparency. The Manager and Administrator were cooperative, responsive, and forthcoming. The Manager's proactive disclosure of operational weaknesses supports a constructive approach to remediation.`,
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
  "trellis_form_adv.pdf": { label: "Form ADV (ERA) — March 2026", type: "Regulatory Filing", filename: "Trellis-Capital-Management-Form-ADV-ERA-2026.pdf", size: "890 KB" },
  "trellis_lpa.pdf": { label: "Limited Partnership Agreement — Fund IV", type: "Fund Document", filename: "Trellis-Capital-IV-LPA.pdf", size: "2.8 MB" },
  "trellis_ppm.pdf": { label: "Private Placement Memorandum — Fund IV", type: "Fund Document", filename: "Trellis-Capital-IV-PPM.pdf", size: "920 KB" },
  "trellis_valuation_policy.pdf": { label: "Valuation Policy", type: "Operations Document", filename: "Trellis-Capital-Valuation-Policy.pdf", size: "280 KB" },
  "SEC_EDGAR": { label: "SEC EDGAR — IARD (ERA Register)", type: "SEC Verification", size: undefined },
  "ALPINE_ANALYSIS": { label: "Alpine Cross-Reference Analysis", type: "Alpine Analysis", size: undefined },
  "MANAGER_CALL": { label: "Manager Due Diligence Call", type: "Manager Interview", size: undefined },
  "ADMIN_VERIFICATION": { label: "Apex Fund Services Verification Call (Apr 3, 2026)", type: "Third-Party Confirmation", size: undefined },
  "DDQ": { label: "Due Diligence Questionnaire (2026)", type: "Fund Document", filename: "sample_vc_fund_iv_alt.pdf", size: "3.2 MB" },
  "Form ADV": { label: "Form ADV (ERA) — March 22, 2026", type: "Regulatory Filing", filename: "Trellis-Capital-Management-Form-ADV-ERA-2026.pdf", size: "890 KB" },
  "LPA": { label: "Limited Partnership Agreement — Fund IV", type: "Fund Document", filename: "Trellis-Capital-IV-LPA.pdf", size: "2.8 MB" },
  "PPM": { label: "Private Placement Memorandum — Fund IV", type: "Fund Document", filename: "Trellis-Capital-IV-PPM.pdf", size: "920 KB" },
  "Valuation Policy": { label: "Valuation Policy", type: "Operations Document", filename: "Trellis-Capital-Valuation-Policy.pdf", size: "280 KB" },
  "Subscription Agreement": { label: "Subscription Agreement Template — Fund IV", type: "Legal Document", filename: "trellis_subscription_agreement.pdf", size: "34 KB" },
  "trellis_subscription_agreement.pdf": { label: "Subscription Agreement Template — Fund IV", type: "Legal Document", filename: "trellis_subscription_agreement.pdf", size: "34 KB" },
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
    { id: "TO-003b", severity: "MEDIUM", topic: "Manager, Ownership & Governance", title: "Significant staff turnover — 3 departures in 18 months; CPO exit planned", detail: "Three staff members have departed since late 2024: Omar Hassan (August 2025), Emily Brooks (December 2024 — replaced by Sarah Collins, July 2025), and Sanjay Gupta (late 2024). Chief Portfolio Officer Vikram Nair's departure is additionally planned for Summer 2026. Four departures in approximately 18 months represents a high rate of turnover for a 7-person firm.", remediation: "Monitor retention of remaining investment staff. Confirm Vikram Nair transition plan and whether CPO responsibilities will be covered internally or via a new hire. Request written retention plan for key professionals." },
    { id: "TO-004", severity: "HIGH", topic: "Legal, Regulatory & Compliance", title: "Investment professional responsible for compliance oversight — REQUIRED BEFORE CLOSE", detail: "Priya Sharma (Co-Founder, Managing Partner) is responsible for compliance oversight in addition to investment responsibilities. Alpine requires this to be transferred to a non-investment professional.", remediation: "Transfer compliance oversight to Sarah Collins (Head of Operations) or engage a dedicated compliance professional. Required before close — investor side letter commitment recommended.", benchmark: { portfolio_pct: 64, portfolio_label: "of VC funds separate compliance from investment professionals", industry_pct: 72, industry_label: "industry benchmark (institutional LPs)", is_outlier: true } },
    { id: "TO-005", severity: "HIGH", topic: "Technology, Cybersecurity & Business Resilience", title: "Substantially underdeveloped cybersecurity environment — REQUIRED BEFORE CLOSE", detail: "No cybersecurity framework, no incident response plan, no penetration testing, no endpoint DLP, no written BCP. Cybersecurity vendor search in progress but no implementation to date.", remediation: "Engage cybersecurity vendor; implement formal policy, vulnerability testing, and training program by end of 2026. Require written commitment via side letter.", benchmark: { portfolio_pct: 45, portfolio_label: "of comparable VC funds have formal cybersecurity framework", industry_pct: 63, industry_label: "industry benchmark (institutional standards)", is_outlier: true } },
    { id: "TO-006", severity: "MEDIUM", topic: "Legal, Regulatory & Compliance", title: "No initial attestation with respect to compliance manual", detail: "Staff are not required to attest to having read or understood compliance policies upon joining the firm.", remediation: "Implement initial compliance attestation process for all new staff." },
    { id: "TO-007", severity: "MEDIUM", topic: "Legal, Regulatory & Compliance", title: "No annual compliance training program", detail: "No formal annual compliance training program has been implemented across the firm.", remediation: "Implement annual compliance training program. Basic online training platforms are available at low cost." },
    { id: "TO-008", severity: "LOW", topic: "Legal, Regulatory & Compliance", title: "Manager does not have a written personal trading policy", detail: "Not required for ERAs but considered best practice, particularly as the firm grows and investment professionals access material non-public information.", remediation: "Adopt a written personal trading policy as part of broader compliance manual enhancement." },
    { id: "TO-008b", severity: "MEDIUM", topic: "Legal, Regulatory & Compliance", title: "Compliance consultant engagement limited to Form ADV preparation only", detail: "Summit Advisory is engaged solely for annual Form ADV preparation. No broader compliance program oversight, policy review, staff training support, or periodic compliance testing is included in the engagement scope. A firm of this size managing institutional LP capital warrants a more comprehensive compliance consultant mandate.", remediation: "Expand compliance consultant engagement to include periodic compliance program review, staff training coordination, and policy update support. Consider engaging a dedicated compliance consultant with VC/ERA expertise beyond Form ADV filing." },
    { id: "TO-009", severity: "MEDIUM", topic: "Technology, Cybersecurity & Business Resilience", title: "No endpoint data loss prevention solution", detail: "Staff maintain access to removable media, personal email, and personal cloud storage on company-issued endpoints, creating risk of sensitive data exfiltration.", remediation: "Implement endpoint DLP as part of planned cybersecurity vendor engagement." },
    { id: "TO-010", severity: "MEDIUM", topic: "Technology, Cybersecurity & Business Resilience", title: "No formal incident response plan", detail: "No documented procedures for responding to a cybersecurity incident, data breach, or ransomware event.", remediation: "Develop written incident response plan as part of planned cybersecurity vendor engagement." },
    { id: "TO-011", severity: "MEDIUM", topic: "Technology, Cybersecurity & Business Resilience", title: "No network penetration testing completed", detail: "No independent penetration testing has been conducted to identify vulnerabilities in the firm's IT environment.", remediation: "Commission annual penetration test from qualified cybersecurity firm as part of planned vendor engagement." },
    { id: "TO-011b", severity: "MEDIUM", topic: "Technology, Cybersecurity & Business Resilience", title: "No written business continuity plan", detail: "The firm does not have a written business continuity plan. While staff can work remotely, there are no documented procedures covering service provider contingency, staff protection during a crisis, or stakeholder communications protocols.", remediation: "Prepare a written BCP as part of the planned cybersecurity vendor engagement. At minimum, document service provider contingency procedures, remote work protocols, and stakeholder communication steps." },
    { id: "TO-011c", severity: "MEDIUM", topic: "Technology, Cybersecurity & Business Resilience", title: "No employee cybersecurity awareness training or phishing simulations", detail: "No cybersecurity awareness training program or phishing simulation campaign has been implemented. Staff are not formally trained to identify social engineering, phishing, or data handling risks. This represents a material gap given that human error is the leading cause of cybersecurity incidents.", remediation: "Implement an annual cybersecurity awareness training program and phishing simulation as part of the planned cybersecurity vendor engagement by end of 2026." },
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
      { metric: "Governance & Organization", assessment: "Below peer average", fund: 55, peer_avg: 70, delta: -15 },
      { metric: "Regulatory Compliance", assessment: "Below peer average", fund: 30, peer_avg: 62, delta: -32 },
      { metric: "Technology & Cybersecurity", assessment: "Below peer average", fund: 20, peer_avg: 58, delta: -38 },
      { metric: "Fund Structure & Terms", assessment: "At peer average", fund: 80, peer_avg: 78, delta: 2 },
      { metric: "Service Provider Quality", assessment: "Above peer average", fund: 82, peer_avg: 72, delta: 10 },
      { metric: "Operational Controls", assessment: "Below peer average", fund: 55, peer_avg: 66, delta: -11 },
    ],
  },
};

// ── Document vault data ──────────────────────────────────────────────────────

export const TRELLIS_VAULT_DATA = {
  total_documents: 19,
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
    { id: "TDOC-000", name: "ILPA-DDQ (Trellis Capital IV, L.P. - April 2026)", category: "ODD Review", date: "2026-04-01", size_kb: 2800, pages: 22, status: "reviewed", tags: ["ILPA", "DDQ", "institutional"], uploaded_by: "Trellis Capital IR", risk_flags: [], filename: "Trellis-Capital-IV-ILPA-DDQ-2.0.pdf" },
    { id: "TDOC-001", name: "Form ADV Part 1 / ERA Filing (March 22, 2026)", category: "Regulatory", date: "2026-03-22", size_kb: 920, pages: 15, status: "reviewed", tags: ["regulatory", "ERA", "Form ADV"], uploaded_by: "Summit Advisory", risk_flags: ["TO-004"], filename: "Trellis-Capital-Management-Form-ADV-ERA-2026.pdf" },
    { id: "TDOC-002", name: "DDQ Responses (April 2026)", category: "ODD Review", date: "2026-04-01", size_kb: 3200, pages: 48, status: "reviewed", tags: ["DDQ", "operational"], uploaded_by: "Trellis Capital IR", risk_flags: ["TO-003", "TO-004", "TO-005"] },
    { id: "TDOC-003", name: "Limited Partnership Agreement — Fund IV", category: "Legal", date: "2026-03-28", size_kb: 4800, pages: 62, status: "reviewed", tags: ["LPA", "fund terms"], uploaded_by: "Morrison Cole Ashworth", risk_flags: [], filename: "Trellis-Capital-IV-LPA.pdf" },
    { id: "TDOC-004", name: "Private Placement Memorandum — Fund IV", category: "Legal", date: "2026-03-28", size_kb: 920, pages: 12, status: "reviewed", tags: ["PPM", "offering"], uploaded_by: "Morrison Cole Ashworth", risk_flags: [], filename: "Trellis-Capital-IV-PPM.pdf" },
    { id: "TDOC-005", name: "Subscription Agreement Template — Fund IV", category: "Legal", date: "2026-03-28", size_kb: 1800, pages: 22, status: "reviewed", tags: ["subscription", "legal"], uploaded_by: "Morrison Cole Ashworth", risk_flags: [], filename: "trellis_subscription_agreement.pdf" },
    { id: "TDOC-006", name: "Fund III Audited Financial Statements FY2024", category: "Financial", date: "2025-03-28", size_kb: 980, pages: 11, status: "reviewed", tags: ["audit", "financial"], uploaded_by: "Baker Thompson", risk_flags: [], filename: "Trellis-Capital-III-Audited-FS-FY2024.pdf" },
    { id: "TDOC-007", name: "Fund III Audited Financial Statements FY2023", category: "Financial", date: "2024-09-30", size_kb: 3800, pages: 9, status: "reviewed", tags: ["audit", "financial"], uploaded_by: "Baker Thompson", risk_flags: [], filename: "Trellis-Capital-III-Audited-FS-FY2023.pdf" },
    { id: "TDOC-008", name: "Valuation Policy", category: "Operations", date: "2026-04-01", size_kb: 280, pages: 10, status: "flagged", filename: "Trellis-Capital-Valuation-Policy.pdf", tags: ["valuation"], uploaded_by: "Trellis Capital IR", risk_flags: ["TO-014"] },
    { id: "TDOC-009", name: "Apex Fund Services — Service Description (Fund III)", category: "Operations", date: "2026-04-01", size_kb: 920, pages: 9, status: "reviewed", tags: ["administrator", "Apex"], uploaded_by: "Apex Fund Services", risk_flags: [], filename: "Trellis-Capital-Apex-Service-Description-Fund-III.pdf" },
    { id: "TDOC-010", name: "Compliance Binder (Summit Advisory, 2025)", category: "Compliance", date: "2025-12-01", size_kb: 1400, pages: 8, status: "reviewed", tags: ["compliance", "ERA"], uploaded_by: "Trellis Capital IR", risk_flags: ["TO-006", "TO-007"], filename: "Trellis-Capital-Compliance-Binder-2025.pdf" },
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
    {
      round_number: 2,
      status: "pending",
      generated_at: "2026-04-16",
      completed_at: null,
      questions: [
        {
          id: "tfu-q6", number: 1, priority: "important", topic_number: 1,
          sub_topic_ids: ["1.4"],
          question_text: "CPO Departure — Knowledge Transfer & Coverage Plan",
          sub_items: [
            { label: "Detailed timeline and plan for Vikram Nair's departure (Summer 2026), including handover of portfolio monitoring responsibilities", resolved: false, response_type: "text" },
            { label: "Confirmation of which team member(s) will assume portfolio oversight duties and whether any interim hire or consultant is planned", resolved: false, response_type: "text" },
            { label: "Documentation of any client/LP notifications planned in connection with this departure", resolved: false, response_type: "text" },
          ],
          status: "pending",
        },
        {
          id: "tfu-q7", number: 2, priority: "important", topic_number: 2,
          sub_topic_ids: ["2.2"],
          question_text: "Background Screening — Third-Party Provider Commitment",
          sub_items: [
            { label: "Confirmation of whether Trellis will engage an independent third-party background screening provider for all new hires going forward, and proposed timeline", resolved: false, response_type: "text" },
            { label: "Confirmation that retroactive background checks will be conducted on current staff via third-party provider before the end of 2026", resolved: false, response_type: "text" },
          ],
          status: "pending",
        },
        {
          id: "tfu-q8", number: 3, priority: "important", topic_number: 2,
          sub_topic_ids: ["2.3", "2.4"],
          question_text: "Compliance Attestation & Annual Training Program",
          sub_items: [
            { label: "Confirmation that Summit Advisory (referenced in Compliance Binder 2025) will implement an initial compliance attestation process for all current staff, with a target completion date", resolved: false, response_type: "text" },
            { label: "Confirmation of plan for annual compliance training program — format, frequency, and who is responsible for delivery and recordkeeping", resolved: false, response_type: "text" },
            { label: "Copy of any draft compliance attestation template or training schedule once available", resolved: false, response_type: "document" },
          ],
          status: "pending",
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

export const TRELLIS_COLLECTION_DOCS = TRELLIS_VAULT_DATA.documents
  .filter((doc) => doc.filename)
  .map((doc) => ({
    name: doc.name,
    type: doc.category,
    date: doc.date,
    source: "Manager Upload" as const,
    filename: doc.filename!,
  }));

