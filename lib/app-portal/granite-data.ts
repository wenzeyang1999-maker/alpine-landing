/**
 * Granite VII Credit Partners, L.P. — static demo data for the Investor Portal report reader.
 *
 * ODD review of Granite VII Credit Partners, L.P. (Senior Direct Lending — Middle-Market)
 * Manager: Granite Capital Management, LLC
 * Overall rating: GREEN (12 flags, 0 RED chapters, 2 YELLOW chapters)
 */

import type { TopicInfo, TopicDataGroup } from "./ridgeline-data";

export type { TopicInfo, TopicDataGroup };

// ── 8-Topic ODD assessment data (Granite VII) ─────────────────────────────────

export const GRANITE_TOPIC_DATA: Record<number, TopicInfo> = {
  1: {
    name: "Manager, Ownership & Governance", rating: "GREEN",
    summary: "Institutional Manager founded in 2009 with seventh consecutive direct-lending vintage. 47 FTEs across investment, credit risk, capital markets, and operations. Five-person Executive Committee with established succession protocol. GP commits 3% in cash. Deep bench of senior credit professionals.",
    findings: `### Management Company and Affiliates

Granite Capital Management, LLC ("Granite" or the "Manager") was founded in 2009 by Stephen Halloway (Chief Executive Officer) and Margaret Liu (Chief Investment Officer), both formerly senior credit professionals at GE Capital. Granite is headquartered in New York with secondary offices in Charlotte and Chicago, and operates as a fully institutional middle-market direct lender. The firm has raised seven consecutive funds in the Granite VII Credit Partners series since 2010, with consistent vintage-over-vintage growth in both fund size and platform headcount.

### Assets under Management

Granite reported firmwide AUM of $4.21 billion as of December 31, 2025 (excluding $1.83 billion in uncalled capital), spread across the Granite Credit Partners series, two managed account vehicles, and one CLO. Granite VII is currently raising toward a $1.5 billion target with a $1.8 billion hard cap, having held a $940 million first close in December 2025.

### Ownership & Succession

The firm is majority owned by employees (78%), with the remaining 22% held by Alpine Pension Investors, a passive minority investor that acquired its stake in 2018 and has no voting rights or operational involvement. Ownership is broadly distributed across 17 partner-level employees. Granite maintains a formal written succession plan filed with its regulator, identifying Margaret Liu as immediate successor to Stephen Halloway in the event of his departure, with Daniel Ortiz (Head of Originations) as the designated CIO successor. Key person life insurance of $25 million is in place on each of the four Executive Committee members.

### Human Resources

Granite employs 47 full-time professionals: 22 investment professionals (originations, underwriting, portfolio management), 9 credit risk and workout specialists, 4 capital markets and structuring, 8 operations and finance, and 4 compliance and legal. Investment professionals have an average of 14 years of credit experience. Recent senior hires include Daniel Ortiz (Head of Originations, joined 2023 from Antares Capital), Priya Walsh (Head of Credit Risk, joined 2024 from Golub Capital), and Wei Chen (Chief Compliance Officer, joined 2025 from Sixth Street).

Background checks are conducted by an external vendor (HireRight) on initial hire, with refresh checks every three years for partner-level employees. All employees are subject to deferred carried interest vesting over five years.

### Chapter Summary

The chapter is rated GREEN. Granite's governance infrastructure is well-developed for a firm of its scale: formal succession planning, distributed ownership, deferred compensation aligning long-term incentives, and adequate insurance coverage all support a positive rating.`,
    docCategories: ["Governance"], riskObsIds: ["GO-001"],
    verificationCategory: "governance",
    dataPoints: [
      { group: "Management Company", items: [
        { label: "Manager Name", value: "Granite Capital Management, LLC", source: "Form ADV" },
        { label: "Date of Formation", value: "March 14, 2009", source: "Delaware Register" },
        { label: "Primary Location", value: "New York, NY (HQ); Charlotte, NC; Chicago, IL", source: "Form ADV" },
        { label: "Total Headcount", value: "47 FTEs (22 investment, 9 risk/workout, 4 capital markets, 8 ops, 4 compliance/legal)", source: "DDQ" },
        { label: "AUM (Net Assets, 12/31/2025)", value: "$4.21 billion", source: "Form ADV" },
        { label: "Uncalled Capital", value: "$1.83 billion", source: "DDQ" },
      ]},
      { group: "Senior Leadership", items: [
        { label: "Chief Executive Officer", value: "Stephen Halloway — co-founder; former Managing Director, GE Capital", source: "DDQ" },
        { label: "Chief Investment Officer", value: "Margaret Liu — co-founder; former Senior Director, GE Capital", source: "DDQ" },
        { label: "Head of Originations", value: "Daniel Ortiz — joined 2023 from Antares Capital", source: "DDQ" },
        { label: "Head of Credit Risk", value: "Priya Walsh — joined 2024 from Golub Capital", source: "DDQ" },
        { label: "Chief Compliance Officer", value: "Wei Chen — joined 2025 from Sixth Street", source: "DDQ" },
      ]},
      { group: "Governance & Ownership", items: [
        { label: "Ownership", value: "Employees 78%, Alpine Pension Investors (passive minority) 22%", source: "Form ADV" },
        { label: "GP Commitment (Fund VII)", value: "3.0% in cash ($45M at hard cap)", flag: "green", source: "LPA" },
        { label: "Succession Plan", value: "Formal written plan filed with regulator", flag: "green", source: "DDQ" },
        { label: "Key Person Insurance", value: "$25M on each of four Executive Committee members", flag: "green", source: "DDQ" },
        { label: "Deferred Compensation", value: "5-year carried interest vesting", flag: "green", source: "DDQ" },
        { label: "Background Checks", value: "External (HireRight) — initial + 3-yr refresh for partners", flag: "green", source: "DDQ" },
      ]},
      { group: "Fund Series Track Record", items: [
        { label: "Granite I (2010)", value: "$150M — fully realized; 14.2% gross IRR", source: "DDQ" },
        { label: "Granite II–IV (2012–2016)", value: "$1.6B aggregate — fully invested; 11.8–13.4% gross IRR range", source: "DDQ" },
        { label: "Granite V (2019)", value: "$1.1B — fully invested; 12.1% gross IRR (interim)", source: "DDQ" },
        { label: "Granite VI (2022)", value: "$1.3B — 87% deployed; 11.4% gross IRR (interim)", source: "DDQ" },
        { label: "Granite VII (current)", value: "$1.5B target / $1.8B hard cap; $940M first close (12/2025)", source: "DDQ" },
      ]},
    ],
  },
  2: {
    name: "Legal, Regulatory & Compliance", rating: "GREEN",
    summary: "SEC-registered investment adviser since 2012. Dedicated compliance team of 4 led by Wei Chen (CCO). Annual mock-exam by external counsel (Schulte Roth). Comprehensive code of ethics with pre-clearance for personal trading. No regulatory actions or material litigation.",
    findings: `### Regulatory Status

Granite Capital Management, LLC is a U.S. Securities and Exchange Commission ("SEC") registered investment adviser (IARD/CRD 152384), having registered in 2012 as the firm's AUM crossed the $100 million RIA threshold. Granite is also a member of the Loan Syndications and Trading Association ("LSTA") and the Alternative Credit Council ("ACC").

### Compliance Program

The compliance program is led by Wei Chen, who joined Granite as Chief Compliance Officer in March 2025, bringing nine years of credit-side compliance experience from Sixth Street and Owl Rock. Wei reports directly to the Executive Committee and has no investment responsibilities, ensuring full independence. The compliance team comprises four full-time professionals dedicated exclusively to regulatory compliance, code of ethics enforcement, and policy oversight.

Granite engages Schulte Roth & Zabel LLP as outside compliance counsel and performs an annual mock SEC exam each fall. The most recent mock exam (November 2025) identified two minor process recommendations — both implemented prior to year-end. The firm's compliance manual is reviewed and updated annually, with the most recent revision dated January 15, 2026.

### Code of Ethics & Personal Trading

The Code of Ethics requires pre-clearance for all personal securities transactions other than open-end mutual funds, government securities, and certain ETFs. Brokerage statements are collected directly from custodians by the compliance team (no employee self-reporting). A 30-day minimum holding period is enforced for all preclearable securities, and employees are prohibited from trading securities held in client portfolios. Annual attestations are completed by all employees.

### Regulatory History & Litigation

The firm has had no SEC examinations result in deficiency letters or enforcement actions. Granite has not been a party to any material litigation in its 15-year history. No material customer complaints have been filed against the firm or its principals.

### Chapter Summary

The chapter is rated GREEN. The compliance program is well-resourced, independent, and externally tested annually. The lack of regulatory or litigation history further supports a clean rating.`,
    docCategories: ["Compliance"], riskObsIds: [],
    verificationCategory: "compliance",
    dataPoints: [
      { group: "Regulatory Status", items: [
        { label: "SEC Registration", value: "Registered Investment Adviser since 2012 (IARD/CRD 152384)", flag: "green", source: "SEC_EDGAR" },
        { label: "Form ADV Last Filing", value: "Annual amendment filed March 30, 2026", source: "Form ADV" },
        { label: "Industry Memberships", value: "LSTA, Alternative Credit Council", source: "DDQ" },
      ]},
      { group: "Compliance Team", items: [
        { label: "Chief Compliance Officer", value: "Wei Chen — dedicated, no investment role; 9 yrs credit compliance experience", flag: "green", source: "DDQ" },
        { label: "Compliance Headcount", value: "4 dedicated FTEs", flag: "green", source: "DDQ" },
        { label: "Outside Compliance Counsel", value: "Schulte Roth & Zabel LLP", source: "DDQ" },
        { label: "Annual Mock SEC Exam", value: "Conducted each fall; most recent November 2025", flag: "green", source: "DDQ" },
      ]},
      { group: "Personal Trading Controls", items: [
        { label: "Pre-Clearance", value: "Required for all preclearable securities", flag: "green", source: "Code of Ethics" },
        { label: "Brokerage Statements", value: "Collected directly from custodians", flag: "green", source: "DDQ" },
        { label: "Minimum Holding Period", value: "30 days", flag: "green", source: "Code of Ethics" },
        { label: "Annual Attestation", value: "Required of all employees", flag: "green", source: "DDQ" },
      ]},
      { group: "Regulatory History", items: [
        { label: "SEC Examinations", value: "None resulting in deficiency letters or enforcement", flag: "green", source: "SEC_EDGAR" },
        { label: "Material Litigation", value: "None in firm's 15-year history", flag: "green", source: "DDQ" },
        { label: "Customer Complaints", value: "None material on record", flag: "green", source: "Form ADV" },
      ]},
    ],
  },
  3: {
    name: "Technology, Cybersecurity & Business Resilience", rating: "GREEN",
    summary: "Microsoft 365 + cloud-native infrastructure. SOC 2 Type II annual audit. Mandiant penetration testing. KnowBe4 phishing simulations. Comprehensive WISP, IRP, and BCP. Annual tabletop exercise. Endpoint DLP via CrowdStrike Falcon. Zero security incidents in past 5 years.",
    findings: `### Infrastructure

Granite operates on a fully cloud-based infrastructure stack centered on Microsoft 365 (Exchange, SharePoint, OneDrive, Teams) for collaboration and email, with Microsoft Defender for endpoint security and CrowdStrike Falcon for advanced threat detection and data loss prevention. Core business systems include Black Mountain (deal pipeline and portfolio management), Allvue (loan administration and accounting), and Salesforce (CRM and investor relations). All systems use single sign-on through Microsoft Entra ID with mandatory multi-factor authentication for all employees, contractors, and third-party vendors.

### Cybersecurity Program

The cybersecurity program is overseen by the Director of Information Technology, Robert Sokolov, reporting to the Chief Operating Officer. Granite has commissioned annual SOC 2 Type II audits since 2019; the most recent audit (period ending December 31, 2025) was conducted by Schneider Downs and resulted in an unqualified opinion. Granite engages Mandiant to perform annual external penetration testing of its cloud infrastructure and identifies findings tracked through remediation. The 2025 test identified three medium-severity findings, all of which were remediated within 45 days.

KnowBe4 administers monthly simulated phishing campaigns; the rolling 12-month click rate is 1.4%, below the financial services benchmark of 3.2%. All employees complete mandatory annual cybersecurity training and quarterly refresher modules.

### Resilience

Granite maintains a Written Information Security Program (WISP), Incident Response Plan (IRP), and Business Continuity Plan (BCP), all reviewed annually by Mandiant. The firm conducts an annual tabletop exercise simulating both a cyber incident and a physical disruption to its New York headquarters; the most recent exercise was conducted in October 2025.

Granite has not experienced any material cybersecurity incidents, data breaches, or business disruptions in the past five years. The firm carries cyber liability insurance with a $25 million per-occurrence and $25 million aggregate limit.

### Chapter Summary

The chapter is rated GREEN. The technology and resilience program is institutional-grade with strong controls, regular external testing, and a clean five-year incident history.`,
    docCategories: ["Technology"], riskObsIds: [],
    verificationCategory: "cybersecurity",
    dataPoints: [
      { group: "Infrastructure", items: [
        { label: "Productivity Platform", value: "Microsoft 365 (Exchange, SharePoint, OneDrive, Teams)", source: "DDQ" },
        { label: "Endpoint Protection", value: "Microsoft Defender + CrowdStrike Falcon (advanced threat + DLP)", flag: "green", source: "DDQ" },
        { label: "Core Investment Systems", value: "Black Mountain (deal pipeline), Allvue (loan admin), Salesforce (CRM)", source: "DDQ" },
        { label: "Identity & Access", value: "Microsoft Entra ID single sign-on + mandatory MFA for all users", flag: "green", source: "DDQ" },
      ]},
      { group: "Cybersecurity Program", items: [
        { label: "SOC 2 Type II", value: "Annual audit since 2019; FY2025 unqualified (Schneider Downs)", flag: "green", source: "SOC 2 Report" },
        { label: "External Penetration Testing", value: "Annual via Mandiant; 2025 test — 3 medium findings, all remediated within 45 days", flag: "green", source: "DDQ" },
        { label: "Phishing Simulation", value: "Monthly via KnowBe4; rolling 12-mo click rate 1.4% (vs. 3.2% industry benchmark)", flag: "green", source: "DDQ" },
        { label: "Annual Cyber Training", value: "Mandatory; quarterly refresher modules", flag: "green", source: "DDQ" },
      ]},
      { group: "Resilience & Insurance", items: [
        { label: "WISP / IRP / BCP", value: "Maintained, reviewed annually by Mandiant", flag: "green", source: "WISP" },
        { label: "Annual Tabletop Exercise", value: "October 2025 — combined cyber + physical scenario", flag: "green", source: "DDQ" },
        { label: "Incidents in Past 5 Years", value: "None", flag: "green", source: "DDQ" },
        { label: "Cyber Liability Insurance", value: "$25M per occurrence / $25M aggregate", flag: "green", source: "Insurance Cert" },
      ]},
    ],
  },
  4: {
    name: "Fund Structure, Terms & Investor Alignment", rating: "GREEN",
    summary: "Delaware LP structure. 1.5% management fee on invested capital (industry standard). 15% carry over 7% preferred return with 50/50 catch-up. 8-year term + two 1-yr extensions. Standard most-favored-nation provisions. Reasonable side letter scope. GP 3% cash commitment.",
    findings: `### Fund Structure

Granite VII Credit Partners, L.P. is structured as a Delaware limited partnership with a parallel Cayman feeder for non-US and US tax-exempt investors. The fund is investing across senior secured first-lien and unitranche loans to U.S. middle-market sponsor-backed companies (EBITDA $20M–$150M). Maximum single-borrower concentration is contractually limited to 5% of total commitments.

### Fees & Carried Interest

The management fee is 1.50% per annum charged on invested capital during the investment period (years 1–4) and on net asset value thereafter (years 5–10) — a structure that aligns the fee burden with deployed capital rather than commitments, generally favorable to LPs.

Carried interest is 15% over a 7% preferred return, with a 50/50 catch-up. Carry is calculated on a whole-of-fund basis (not deal-by-deal), which protects LPs from clawback risk in the event of late-fund underperformance. A clawback provision applies through the end of the fund term, with the GP's clawback obligation backed by an escrow of 20% of distributed carry.

### Term & Investment Period

The fund has an 8-year term, comprising a 4-year investment period and a 4-year harvesting period, with up to two one-year extensions subject to LPAC approval. This is consistent with peer funds in the senior direct lending strategy.

### GP Commitment

The General Partner has committed 3% of total commitments in cash, equating to $45 million at the $1.5 billion target. The commitment is funded pari passu with LPs and is not subject to any fee offset or cashless mechanism.

### LP Protections

Standard institutional protections include: a most-favored-nation provision granted to commitments over $50 million, an LP advisory committee (LPAC) with 7 seats, a "for cause" GP removal threshold of 66 2/3% LP vote, a "no-fault" GP removal threshold of 75% LP vote, and a key person clause triggered if Stephen Halloway, Margaret Liu, or Daniel Ortiz cease to dedicate substantially all of their business time to Granite. The LPA is reviewed by ILPA-aligned external counsel.

### Chapter Summary

The chapter is rated GREEN. Fund terms are well-aligned with institutional LP standards, the GP commitment is funded in cash, and LP protections include both for-cause and no-fault GP removal rights.`,
    docCategories: ["Fund Structure"], riskObsIds: [],
    verificationCategory: "fund_structure",
    dataPoints: [
      { group: "Fund Structure", items: [
        { label: "Fund Vehicle", value: "Granite VII Credit Partners, L.P. (Delaware LP)", source: "LPA" },
        { label: "Parallel Feeder", value: "Granite VII Credit Partners (Cayman), Ltd.", source: "LPA" },
        { label: "Strategy", value: "Senior secured first-lien and unitranche middle-market direct lending", source: "PPM" },
        { label: "Borrower EBITDA Range", value: "$20M–$150M", source: "PPM" },
        { label: "Single-Borrower Concentration Cap", value: "5% of total commitments", flag: "green", source: "LPA" },
      ]},
      { group: "Fees & Carry", items: [
        { label: "Management Fee", value: "1.50% on invested capital (years 1–4), on NAV thereafter", flag: "green", source: "LPA" },
        { label: "Carried Interest", value: "15% over 7% preferred return; 50/50 catch-up", flag: "green", source: "LPA" },
        { label: "Carry Calculation", value: "Whole-of-fund (not deal-by-deal)", flag: "green", source: "LPA" },
        { label: "Clawback", value: "Through end of fund term; 20% escrow of distributed carry", flag: "green", source: "LPA" },
      ]},
      { group: "Term & Period", items: [
        { label: "Total Term", value: "8 years + up to 2 one-year extensions (LPAC approval required)", source: "LPA" },
        { label: "Investment Period", value: "4 years", source: "LPA" },
        { label: "Harvesting Period", value: "4 years", source: "LPA" },
      ]},
      { group: "GP Commitment & LP Protections", items: [
        { label: "GP Commitment", value: "3.0% in cash (~$45M at $1.5B target); funded pari passu, no fee offset", flag: "green", source: "LPA" },
        { label: "Most-Favored-Nation", value: "Available to commitments ≥ $50M", source: "LPA" },
        { label: "GP Removal — For Cause", value: "66⅔% LP vote threshold", flag: "green", source: "LPA" },
        { label: "GP Removal — No Fault", value: "75% LP vote threshold", flag: "green", source: "LPA" },
        { label: "Key Person Clause", value: "Triggered if Halloway, Liu, or Ortiz cease substantially full-time involvement", flag: "green", source: "LPA" },
      ]},
    ],
  },
  5: {
    name: "Service Providers, Delegation & Oversight", rating: "GREEN",
    summary: "Top-tier service providers: SS&C as administrator, PwC as auditor, JPMorgan as prime/agent bank, Schulte Roth as fund counsel. Long-standing relationships. Annual SOC 1 reviews of administrator. Dedicated oversight by Head of Fund Operations.",
    findings: `### Administrator

State Street Alternative Investment Services has served as Granite's fund administrator since 2014. State Street provides full middle- and back-office services including books and records, NAV calculation, investor capital activity, AML/KYC, regulatory reporting (Form PF), and FATCA/CRS compliance. SS&C transitioned this account to State Street's platform in 2018 following the SS&C acquisition. The administrator provides monthly NAV and quarterly capital statements to investors. Granite's Head of Fund Operations, Caroline McKenzie, conducts an annual on-site visit to State Street's Boston operations center and reviews their SOC 1 Type II report each year.

### Auditor

PricewaterhouseCoopers LLP has served as Granite's fund auditor since the firm's inception in 2010. PwC issues an unqualified audit opinion within 90 days of fiscal year-end annually. The audit fee for FY2024 was $385,000. No restatements, material weaknesses, or significant deficiencies have been reported across the firm's 15-year audit history.

### Prime / Agent Bank

JPMorgan Chase, N.A. serves as Granite's principal banking relationship, including agent bank for the fund's $400 million subscription credit facility (NAV facility, advance rate 30%) and primary deposit relationship. All loan payments, capital calls, and distributions flow through JPMorgan accounts. Granite uses a dual-approval wire process requiring sign-off from both the Head of Operations and a member of the Executive Committee.

### Legal Counsel

Schulte Roth & Zabel LLP serves as primary fund counsel and outside compliance counsel. Kirkland & Ellis serves as transaction counsel for new loan originations. Both are recognized institutional credit fund practices.

### Chapter Summary

The chapter is rated GREEN. Service providers are top-tier with long-standing relationships, robust internal oversight, and clean third-party verification history.`,
    docCategories: ["Service Providers"], riskObsIds: [],
    verificationCategory: "service_providers",
    dataPoints: [
      { group: "Service Providers", items: [
        { label: "Administrator", value: "State Street Alternative Investment Services (since 2014; via SS&C platform)", flag: "green", source: "Admin Agreement" },
        { label: "Auditor", value: "PricewaterhouseCoopers LLP (since 2010)", flag: "green", source: "Audit Letter" },
        { label: "Prime / Agent Bank", value: "JPMorgan Chase, N.A. (incl. $400M NAV facility, 30% advance rate)", flag: "green", source: "DDQ" },
        { label: "Fund Counsel", value: "Schulte Roth & Zabel LLP", source: "DDQ" },
        { label: "Transaction Counsel", value: "Kirkland & Ellis LLP", source: "DDQ" },
      ]},
      { group: "Administrator Oversight", items: [
        { label: "Annual On-Site Visit", value: "Conducted by Head of Fund Operations (Caroline McKenzie) each spring", flag: "green", source: "DDQ" },
        { label: "SOC 1 Type II Review", value: "Annual review of State Street's SOC 1 report by Granite operations team", flag: "green", source: "DDQ" },
        { label: "NAV Frequency", value: "Monthly NAV statements to investors; quarterly capital statements", source: "DDQ" },
      ]},
      { group: "Audit History", items: [
        { label: "Audit Tenure", value: "15 years (PwC since fund inception in 2010)", source: "Audit Letter" },
        { label: "Annual Audit Fee (FY2024)", value: "$385,000", source: "DDQ" },
        { label: "Restatements / Material Weaknesses", value: "None across 15-year history", flag: "green", source: "Audit Letter" },
      ]},
    ],
  },
  6: {
    name: "Investment Operations & Portfolio Controls", rating: "YELLOW",
    summary: "Disciplined investment committee with formal 4-of-5 supermajority approval. Robust deal pipeline tracking via Black Mountain. Allvue loan accounting. NAV facility at 30% advance rate is moderate but warrants monitoring. Single-name concentration limit (5%) tested at 4.2% top exposure. Portfolio monitoring of borrower covenants formalized.",
    findings: `### Investment Committee & Approval

The Investment Committee comprises five voting members: Stephen Halloway (CEO), Margaret Liu (CIO), Daniel Ortiz (Head of Originations), Priya Walsh (Head of Credit Risk), and Robert Yates (Head of Portfolio Management). New investments require approval from at least four of five voting members — a supermajority threshold that prevents any individual from forcing through a deal. Priya Walsh, as Head of Credit Risk, has explicit veto authority over all new investments. The committee meets weekly with ad-hoc sessions for time-sensitive opportunities.

### Origination & Underwriting Process

Granite's origination team sources deals primarily from established sponsor relationships (estimated 80% of pipeline) and selective sell-side advisor channels (20%). The firm maintains active dialogue with approximately 240 middle-market private equity sponsors and has lent to repeat sponsors across multiple vintages (current cumulative deals with the top 10 sponsors exceeds 65 transactions since 2010).

Underwriting follows a structured 4-stage process: initial screening, preliminary diligence and IC pre-read, full due diligence with third-party reports (legal, accounting QofE, environmental, insurance), and final IC vote. Average time from screening to close is 8–10 weeks. Granite mandates third-party Quality of Earnings reports for all new originations.

### Portfolio Concentration & NAV Facility

The fund's single-borrower concentration cap is 5.0% of total commitments. As of December 31, 2025, the largest single exposure (Atlas Industrial Holdings) is at 4.2% of commitments, near but below the cap. The top 10 borrowers represent 28.4% of invested capital — a moderately diversified portfolio.

Granite VII utilizes a $400 million subscription/NAV credit facility with JPMorgan at a 30% advance rate (against NAV). Outstanding borrowings as of December 31, 2025 are $185 million, representing 13.4% of NAV — within the conservative band Alpine expects from senior direct lending vehicles. Use of leverage is monitored by the LPAC quarterly.

### Borrower Monitoring & Workout

Each loan is assigned to a portfolio manager who maintains monthly contact with the borrower's management and quarterly contact with the sponsor. Covenants are tracked in Black Mountain with automated alerts for thresholds approaching default. Granite maintains a dedicated workout team of 4 professionals led by Sarah Henderson (joined 2020 from CarVal), who handle credits placed on watch list or default. Historical default rate across all vintages: 1.3% of invested capital (vs. industry benchmark of 1.8% per Cliffwater Direct Lending Index).

### Chapter Summary

The chapter is rated YELLOW solely due to the use of the NAV facility, which while moderate in size, magnifies LP returns and adds modest tail risk in a credit downturn. The chapter would otherwise be rated GREEN: investment governance, portfolio controls, and workout capability are all institutional-grade. Alpine recommends investors monitor leverage utilization quarterly and reaffirm the LPAC's understanding of the NAV facility terms.`,
    docCategories: ["Investment Ops"], riskObsIds: ["GO-002", "GO-003"],
    verificationCategory: "investment_ops",
    dataPoints: [
      { group: "Investment Committee", items: [
        { label: "Voting Members", value: "5 (Halloway CEO, Liu CIO, Ortiz, Walsh, Yates)", source: "DDQ" },
        { label: "Approval Threshold", value: "4 of 5 supermajority required", flag: "green", source: "DDQ" },
        { label: "Credit Risk Veto", value: "Priya Walsh (Head of Credit Risk) holds explicit veto on all new investments", flag: "green", source: "DDQ" },
        { label: "Meeting Cadence", value: "Weekly + ad-hoc", source: "DDQ" },
      ]},
      { group: "Origination & Underwriting", items: [
        { label: "Sponsor Network", value: "~240 active sponsor relationships", source: "DDQ" },
        { label: "Repeat-Sponsor Concentration", value: "65+ cumulative deals across top-10 sponsors since 2010", source: "DDQ" },
        { label: "Third-Party QofE", value: "Mandatory for all new originations", flag: "green", source: "DDQ" },
        { label: "Average Time to Close", value: "8–10 weeks (screening to close)", source: "DDQ" },
      ]},
      { group: "Portfolio Concentration", items: [
        { label: "Single-Borrower Cap", value: "5.0% of total commitments", source: "LPA" },
        { label: "Largest Exposure", value: "Atlas Industrial Holdings — 4.2% (near cap)", flag: "yellow", source: "DDQ" },
        { label: "Top-10 Borrowers", value: "28.4% of invested capital", source: "DDQ" },
      ]},
      { group: "NAV Facility & Leverage", items: [
        { label: "Subscription/NAV Facility", value: "$400M with JPMorgan; 30% advance rate", flag: "yellow", source: "DDQ" },
        { label: "Outstanding Borrowings (12/31/2025)", value: "$185M = 13.4% of NAV", flag: "yellow", source: "DDQ" },
        { label: "LPAC Oversight", value: "Quarterly review of leverage utilization", flag: "green", source: "LPA" },
      ]},
      { group: "Workout & Default History", items: [
        { label: "Workout Team", value: "4 dedicated professionals; led by Sarah Henderson (former CarVal)", flag: "green", source: "DDQ" },
        { label: "Cumulative Default Rate", value: "1.3% of invested capital (vs. 1.8% Cliffwater benchmark)", flag: "green", source: "DDQ" },
        { label: "Covenant Tracking", value: "Black Mountain — automated alerts on threshold approach", flag: "green", source: "DDQ" },
      ]},
    ],
  },
  7: {
    name: "Valuation, Asset Existence & Investor Reporting", rating: "YELLOW",
    summary: "Quarterly valuations follow ASC 820 fair-value framework. Independent third-party valuation by Houlihan Lokey on all positions semi-annually + 100% on stressed credits quarterly. Valuation Committee chaired by Margaret Liu with majority non-investment composition. Modest concern: Granite serves as valuation agent on its own loans, with Houlihan providing review rather than independent marking.",
    findings: `### Valuation Process

Granite values its loan portfolio quarterly using ASC 820 fair-value framework. The valuation process is led internally by the Valuation Committee, chaired by Margaret Liu (CIO) and consisting of five members: Margaret Liu, Caroline McKenzie (Head of Fund Operations), Wei Chen (CCO), Robert Yates (Head of Portfolio Management), and one rotating external member from Granite's LPAC. Non-investment professionals hold a 3-of-5 majority on the Valuation Committee.

For each quarterly valuation, the Valuation Committee considers (1) borrower performance metrics (EBITDA, leverage ratios, fixed charge coverage), (2) industry comparables and market spreads, (3) any stressed-credit factors, and (4) the third-party valuation review. Marks are approved by the full committee with majority vote required.

### Third-Party Valuation Review

Houlihan Lokey Valuation Advisors performs an independent valuation review semi-annually on 100% of the portfolio. Additionally, any loan placed on the firm's internal watch list (credits with leverage approaching covenant thresholds, deteriorating performance, or amendment requests) is subject to quarterly Houlihan review. The Houlihan engagement is structured as an independent review (with their own valuation conclusions) rather than a pure consistency check.

Alpine notes that Granite serves as the valuation agent of record on its own positions, with Houlihan providing a review function. This is consistent with industry practice for direct lending funds, but Alpine would prefer a structure where Houlihan or another independent agent serves as the primary valuation agent of record. This is the primary driver of the YELLOW rating for this chapter.

### Asset Existence & Investor Reporting

Loan existence is verified by the administrator (State Street) through direct confirmation of agent-bank loan balances each quarter. Granite produces quarterly capital account statements within 45 days of quarter-end and audited annual financials within 90 days of fiscal year-end. Investor reports include portfolio-level metrics, top-borrower exposures, leverage attribution, and watch-list disclosure.

### Waterfall & Carry Calculation

Carry waterfall is calculated by Granite operations using an Excel-based model, reviewed by State Street, and approved by Wei Chen (CCO). Alpine notes that while the State Street review provides comfort, an automated waterfall system (e.g., Allvue's carry module) would be preferable to spreadsheet-based calculation given the inherent complexity of multi-class waterfall.

### Chapter Summary

The chapter is rated YELLOW due to (1) Granite serving as the primary valuation agent of record with Houlihan in a review capacity, and (2) Excel-based carry waterfall calculation. Both are common industry practices but represent enhancement opportunities. Alpine recommends investors monitor the valuation policy at each annual review and seek movement toward a primary independent agent structure.`,
    docCategories: ["Valuation"], riskObsIds: ["GO-004", "GO-005"],
    verificationCategory: "valuation",
    dataPoints: [
      { group: "Valuation Process", items: [
        { label: "Framework", value: "Quarterly valuations under ASC 820 fair-value", source: "Valuation Policy" },
        { label: "Valuation Committee Composition", value: "5 members; non-investment majority (3 of 5)", flag: "green", source: "Valuation Policy" },
        { label: "Approval Threshold", value: "Majority vote of Valuation Committee", source: "Valuation Policy" },
        { label: "Valuation Agent of Record", value: "Granite Capital Management, LLC (in-house) — YELLOW concern", flag: "yellow", source: "Valuation Policy" },
      ]},
      { group: "Third-Party Review", items: [
        { label: "Independent Reviewer", value: "Houlihan Lokey Valuation Advisors", flag: "green", source: "DDQ" },
        { label: "Review Frequency", value: "Semi-annual on 100% of portfolio; quarterly on watch-list credits", flag: "green", source: "DDQ" },
        { label: "Engagement Type", value: "Independent review (with own valuation conclusions) — not pure consistency check", flag: "green", source: "DDQ" },
      ]},
      { group: "Investor Reporting", items: [
        { label: "Quarterly Capital Account Statements", value: "Delivered within 45 days of quarter-end", flag: "green", source: "DDQ" },
        { label: "Audited Financial Statements", value: "Delivered within 90 days of fiscal year-end", flag: "green", source: "DDQ" },
        { label: "Watch-List Disclosure", value: "Reported quarterly with credit-specific commentary", flag: "green", source: "DDQ" },
      ]},
      { group: "Asset Existence & Waterfall", items: [
        { label: "Loan Existence Verification", value: "Quarterly agent-bank confirmations through State Street", flag: "green", source: "Admin Letter" },
        { label: "Carry Waterfall Calculation", value: "Excel-based by Granite ops; reviewed by State Street + CCO", flag: "yellow", source: "DDQ" },
      ]},
    ],
  },
  8: {
    name: "Manager Transparency & LP Communications", rating: "GREEN",
    summary: "Cooperative diligence posture with prompt, thorough responses to questions. Quarterly investor letters with detailed portfolio commentary. Annual investor day. Standing LPAC quorum >90% across past 3 years. Transparent disclosure of watch-list credits with named borrower commentary. No material LP complaints.",
    findings: `### Diligence Engagement

Granite's response to Alpine's due diligence inquiries was prompt, thorough, and accompanied by all requested supporting documentation. The team made available all five members of the Executive Committee for direct interviews and provided unfettered access to the firm's data room. The Manager voluntarily disclosed all known regulatory, litigation, and operational matters, including the 2025 SOC 2 audit findings (closed prior to year-end) and the three medium-severity items from the Mandiant penetration test (all remediated).

### Investor Communications Cadence

Granite produces quarterly investor letters within 45 days of each quarter-end. The letters include portfolio-level performance metrics, top-10 borrower exposures with named borrower commentary, watch-list credit disclosure, leverage attribution, capital activity, and a market outlook. Each letter is approximately 18–22 pages and is signed by Margaret Liu (CIO).

The firm hosts an annual investor day each May in New York, attended by approximately 75% of LPs by capital. The agenda typically includes market positioning, deep-dive sessions on selected portfolio companies, and a Q&A with the full Investment Committee. The 2025 investor day included presentations from three portfolio company management teams.

### LPAC

The Limited Partner Advisory Committee comprises seven seats, with members rotating across funds and selected to ensure geographic and investor-type diversity. LPAC meetings are held semi-annually in person, plus ad-hoc by video conference. Standing LPAC quorum across the past three years has been over 90%. The LPAC reviews quarterly valuation summaries, leverage utilization, watch-list credits, and any conflicts requiring LPAC consent.

### Side Letters & MFN

Side letter scope is reasonably contained: most side letters address regulatory disclosures, ERISA/UBTI exclusions, fee step-downs for large commitments, and most-favored-nation rights for $50M+ commitments. The MFN process is administered by State Street with all eligible LPs notified of new side letter terms in compliance with the LPA.

### Chapter Summary

The chapter is rated GREEN. Granite's transparency posture is institutional-grade with thorough quarterly reporting, robust LPAC engagement, and proactive disclosure during diligence. No material LP complaints have been raised.`,
    docCategories: ["Transparency"], riskObsIds: [],
    verificationCategory: "transparency",
    dataPoints: [
      { group: "Diligence Engagement", items: [
        { label: "Document Availability", value: "Full data room access; all requested materials provided", flag: "green", source: "DDQ" },
        { label: "Executive Access", value: "All 5 Executive Committee members made available for interviews", flag: "green", source: "DDQ" },
        { label: "Voluntary Disclosures", value: "Self-disclosed SOC 2 findings, pen-test items — all remediated", flag: "green", source: "DDQ" },
      ]},
      { group: "Investor Reporting Cadence", items: [
        { label: "Quarterly Letter", value: "Delivered within 45 days; 18–22 pages with named-borrower commentary", flag: "green", source: "Q4 2025 Letter" },
        { label: "Annual Investor Day", value: "Each May in NYC; ~75% LP attendance by capital", flag: "green", source: "DDQ" },
        { label: "Watch-List Disclosure", value: "Named credit-specific commentary in quarterly letter", flag: "green", source: "Q4 2025 Letter" },
      ]},
      { group: "LPAC", items: [
        { label: "Composition", value: "7 seats — geographic and investor-type diversity", source: "LPA" },
        { label: "Meeting Cadence", value: "Semi-annual in person + ad-hoc video", source: "LPA" },
        { label: "Standing Quorum (3 yrs)", value: ">90%", flag: "green", source: "DDQ" },
        { label: "LPAC Scope", value: "Valuation, leverage, watch list, conflicts", source: "LPA" },
      ]},
    ],
  },
};

// ── Source metadata for the document panel ────────────────────────────────────

export const GRANITE_SOURCE_META: Record<string, { label: string; type: string; filename?: string; size?: string }> = {
  "sample_credit_granite_vii.pdf": { label: "Granite VII Credit Partners — ODD Report (April 2026)", type: "ODD Report", filename: "sample_credit_granite_vii.pdf", size: "1.1 MB" },
  "DDQ": { label: "Due Diligence Questionnaire (2026)", type: "Fund Document", filename: "granite_ddq_2026.pdf" },
  "Form ADV": { label: "Form ADV — March 30, 2026", type: "Regulatory Filing" },
  "LPA": { label: "Limited Partnership Agreement — Fund VII", type: "Fund Document" },
  "PPM": { label: "Private Placement Memorandum — Fund VII", type: "Fund Document" },
  "Valuation Policy": { label: "Valuation Policy (revised January 2026)", type: "Operations Document" },
  "Code of Ethics": { label: "Code of Ethics (revised January 2026)", type: "Compliance Document" },
  "WISP": { label: "Written Information Security Program (2026)", type: "Compliance Document" },
  "SOC 2 Report": { label: "SOC 2 Type II Report — FY2025 (Schneider Downs)", type: "Third-Party Audit" },
  "Admin Agreement": { label: "Administration Agreement — State Street", type: "Service Provider Agreement" },
  "Admin Letter": { label: "State Street — Verification Confirmation", type: "Third-Party Confirmation" },
  "Audit Letter": { label: "PwC — Audit Confirmation", type: "Third-Party Confirmation" },
  "Insurance Cert": { label: "Cyber Liability Insurance Certificate", type: "Insurance" },
  "Q4 2025 Letter": { label: "Q4 2025 Investor Letter", type: "Investor Communication" },
  "SEC_EDGAR": { label: "SEC EDGAR — IARD Registered Adviser Search", type: "SEC Verification" },
  "Delaware Register": { label: "Delaware Division of Corporations — Direct Check", type: "SEC Verification" },
};

// ── Mock fund-level data ──────────────────────────────────────────────────────

export const GRANITE_MOCK = {
  fund: {
    name: "Granite VII Credit Partners, L.P.",
    manager: "Granite Capital Management, LLC",
    strategy: "Senior Direct Lending — Middle-Market",
    aum: "$4.21B firmwide (excl. $1.83B uncalled)",
    overall_rating: "GREEN",
    odd_score: 84,
    odd_percentile: "82nd",
    domicile: "Delaware LP (Cayman feeder)",
    fund_nav: "$940M first close (12/2025); pre-deployment",
    recommendation_summary: "recommends an <b>accept</b> rating. Granite operates an institutional-grade direct-lending platform with a deep team, distributed ownership, well-tested controls, and a clean 15-year regulatory and litigation history. Two YELLOW chapters (Investment Ops, Valuation) reflect industry-normal use of a moderate NAV facility and an in-house valuation agent with strong third-party review.",
    conditions_summary: "Post-close monitoring: quarterly review of NAV facility utilization and Valuation Committee composition; reaffirm LPAC understanding of leverage limits at each annual review.",
  },
  risk_observations: [
    { id: "GO-001", severity: "LOW", topic: "Manager, Ownership & Governance", title: "Background-check refresh cadence applies only to partners",
      detail: "Granite refreshes background checks every three years for partner-level employees; non-partner staff are checked only on initial hire. Alpine notes this is in line with industry practice but recommends extending refresh to all carry-eligible employees over time.",
      remediation: "Consider extending 3-year background check refresh to all carry-eligible employees by end of 2027." },
    { id: "GO-002", severity: "MEDIUM", topic: "Investment Operations & Portfolio Controls", title: "Largest single-borrower exposure approaching contractual cap",
      detail: "As of December 31, 2025, the largest single exposure (Atlas Industrial Holdings) is at 4.2% of commitments against a 5.0% contractual cap. While not yet a breach, the proximity warrants monitoring.",
      remediation: "Investors should monitor quarterly disclosure of single-name exposures; LPAC should formally affirm understanding of the cap at each annual review." },
    { id: "GO-003", severity: "MEDIUM", topic: "Investment Operations & Portfolio Controls", title: "NAV facility utilization at 13.4% of NAV",
      detail: "Granite VII has drawn $185M of its $400M NAV facility with JPMorgan, representing 13.4% of NAV. While well within the conservative band Alpine expects from senior direct lending vehicles, NAV facility use magnifies LP returns and introduces modest tail risk in a credit downturn.",
      remediation: "Monitor utilization quarterly. Confirm LPAC quarterly review of leverage attribution." },
    { id: "GO-004", severity: "MEDIUM", topic: "Valuation, Asset Existence & Investor Reporting", title: "Granite serves as primary valuation agent of record",
      detail: "Granite serves as valuation agent of record on its own positions, with Houlihan Lokey providing semi-annual independent review (quarterly on watch-list credits). Alpine would prefer a structure where Houlihan serves as primary agent of record rather than reviewer.",
      remediation: "Encourage migration toward primary independent valuation agent structure over future vintages." },
    { id: "GO-005", severity: "LOW", topic: "Valuation, Asset Existence & Investor Reporting", title: "Carry waterfall maintained in Excel",
      detail: "Carry waterfall calculation is performed by Granite operations using Excel, reviewed by State Street, and approved by the CCO. An automated waterfall system would reduce model risk.",
      remediation: "Implement Allvue or equivalent automated carry waterfall module by end of 2027." },
    { id: "GO-006", severity: "LOW", topic: "Legal, Regulatory & Compliance", title: "Compliance refresh modules quarterly cadence is robust",
      detail: "Granite mandates quarterly cyber refresher modules in addition to annual compliance training. While this is a strength rather than a deficiency, Alpine encourages continued investment in this area.",
      remediation: "N/A — observation only." },
  ],
  strengths: [
    { title: "Distributed employee ownership and 5-year deferred carry vesting align long-term incentives",
      detail: "78% of Granite is owned by 17 partner-level employees, with the remaining 22% held by a passive minority investor. Carried interest vests over five years across all carry-eligible staff. This combination creates strong long-term incentive alignment between investment professionals and LPs." },
    { title: "Institutional-grade compliance infrastructure with external testing",
      detail: "Dedicated 4-person compliance team led by a CCO with 9 years of credit-side experience. Annual mock SEC exam by Schulte Roth & Zabel. Brokerage statements collected directly from custodians. No SEC deficiency letters or enforcement actions in 15-year history." },
    { title: "Robust workout capability with sub-benchmark default rate",
      detail: "Dedicated 4-person workout team led by a former CarVal executive. Cumulative default rate of 1.3% across all vintages compares favorably to the 1.8% Cliffwater Direct Lending Index benchmark." },
    { title: "Transparent investor reporting with named-borrower watch-list commentary",
      detail: "Quarterly investor letters (18–22 pages) include named-borrower commentary on top-10 exposures and watch-list credits. Annual investor day attended by 75%+ of LPs by capital with deep-dive sessions and IC Q&A." },
  ],
};

// ── Collection / source documents (used by getReferencedDocs) ────────────────

export const GRANITE_COLLECTION_DOCS: Array<{ name: string; type: string; filename: string }> = [
  { name: "Granite VII — ODD Report (April 2026)",          type: "ODD Report",            filename: "sample_credit_granite_vii.pdf" },
  { name: "Form ADV — March 30, 2026",                       type: "Regulatory Filing",     filename: "granite_form_adv.pdf" },
  { name: "Limited Partnership Agreement — Fund VII",        type: "Fund Document",         filename: "granite_lpa.pdf" },
  { name: "Private Placement Memorandum — Fund VII",         type: "Fund Document",         filename: "granite_ppm.pdf" },
  { name: "Due Diligence Questionnaire (2026)",              type: "Fund Document",         filename: "granite_ddq_2026.pdf" },
  { name: "Valuation Policy (revised January 2026)",         type: "Operations Document",   filename: "granite_valuation_policy.pdf" },
  { name: "Compliance Manual (revised January 2026)",        type: "Compliance Document",   filename: "granite_compliance_manual.pdf" },
  { name: "Audited Financial Statements FY2024",             type: "Financial Document",    filename: "granite_audited_fs_fy2024.pdf" },
];
