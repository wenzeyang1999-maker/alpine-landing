"use client";

import { useEffect, useRef, useState } from "react";
import { SOURCE_META } from "@/lib/ridgeline-data";
import { downloadDemoFile } from "@/lib/demo-downloads";

export interface RefDotProps {
  source: string;
  quote: string;
  context?: string;
  color: "blue" | "emerald" | "amber" | "purple";
}

const DOT_COLORS: Record<string, string> = {
  blue: "bg-blue-400",
  emerald: "bg-emerald-400",
  amber: "bg-amber-400",
  purple: "bg-purple-400",
};

// ── Doc metadata ──────────────────────────────────────────────────────────────

function buildDocMeta(filename: string, label: string) {
  const f = filename.toLowerCase();
  if (f.includes("form_adv")) return { title: "Form ADV Part 2A", subtitle: "Ridgeline Capital Partners, LLC", date: "Filed March 14, 2025", badge: "Regulatory Filing" };
  if (f.includes("ddq"))       return { title: "Due Diligence Questionnaire (2026)", subtitle: "Ridgeline Capital Partners, LLC", date: "January 10, 2026", badge: "Fund Document" };
  if (f.includes("ppm"))       return { title: "Private Placement Memorandum", subtitle: "Ridgeline Global Opportunities Fund, LP", date: "January 2025", badge: "Legal" };
  if (f.includes("lpa"))       return { title: "Limited Partnership Agreement", subtitle: "Ridgeline Global Opportunities Fund, LP", date: "Effective January 1, 2025", badge: "Legal" };
  if (f.includes("compliance_manual")) return { title: "Compliance Manual", subtitle: "Ridgeline Capital Partners, LLC", date: "Revised September 2025", badge: "Compliance" };
  if (f.includes("code_of_ethics"))    return { title: "Code of Ethics & Personal Trading Policy", subtitle: "Ridgeline Capital Partners, LLC", date: "Revised October 2025", badge: "Compliance" };
  if (f.includes("financials") || f.includes("fy2024")) return { title: "Audited Financial Statements — FY2024", subtitle: "Ridgeline Global Opportunities Fund, LP", date: "Audit Date: March 28, 2025", badge: "Financial" };
  if (f.includes("bcp"))        return { title: "Business Continuity / DR Plan", subtitle: "Ridgeline Capital Partners, LLC", date: "October 2021", badge: "Operations" };
  if (f.includes("valuation"))  return { title: "Valuation Policy (2026)", subtitle: "Ridgeline Capital Partners, LLC", date: "Effective January 1, 2026", badge: "Operations" };
  if (f.includes("org_chart"))  return { title: "Organization Chart", subtitle: "Ridgeline Capital Partners, LLC", date: "November 2025", badge: "Internal" };
  if (f.includes("ic_charter")) return { title: "Investment Committee Charter", subtitle: "Ridgeline Capital Partners, LLC", date: "January 2026", badge: "Governance" };
  if (f.includes("insurance"))  return { title: "Insurance Coverage Summary", subtitle: "Ridgeline Capital Partners, LLC", date: "Policy Year 2025-2026", badge: "Insurance" };
  if (f.includes("side_letter")) return { title: "Side Letter Summary (Redacted)", subtitle: "Ridgeline Capital Partners, LLC", date: "As of December 31, 2025", badge: "Legal" };
  if (f.includes("admin"))      return { title: "Citco Administrator Transparency Report", subtitle: "Ridgeline Global Opportunities Fund", date: "December 31, 2025", badge: "Third-Party" };
  if (f.includes("iapd_record")) return { title: "SEC IAPD — Investment Adviser Public Disclosure", subtitle: "Ridgeline Capital Partners, LLC · CRD# 298741", date: "Record as of April 2026", badge: "SEC Verification" };
  if (f.includes("admin_verification_record")) return { title: "Citco Fund Services — Administrator Verification", subtitle: "Ridgeline Global Opportunities Fund, LP", date: "Verification Date: January 22, 2026", badge: "Third-Party Confirmation" };
  if (f.includes("alpine_analysis_record")) return { title: "Alpine ODD — Internal Cross-Reference Analysis", subtitle: "Ridgeline Capital Partners, LLC · ODD Review Jan 2026", date: "Prepared January 2026", badge: "Alpine Analysis" };
  if (f.includes("manager_call_record")) return { title: "Manager Due Diligence Call — Interview Notes", subtitle: "Ridgeline Capital Partners, LLC · David Chen & Linda Wu", date: "Call Date: January 15, 2026", badge: "Manager Interview" };
  if (f.includes("pentest_jan2026_record")) return { title: "Penetration Test Summary — January 2026", subtitle: "Ridgeline Capital Partners, LLC · Conducted by Kroll Cyber", date: "January 28, 2026", badge: "Cybersecurity" };
  return { title: label, subtitle: "Ridgeline Capital Partners, LLC", date: "2025", badge: "Document" };
}

// ── Passage builder — surrounding text for the highlighted quote ──────────────
// Highlight position key: EARLY = quote near top, MID = quote in middle, LATE = quote near bottom

function buildPassage(quote: string, filename: string): { before: string; after: string; section: string; pageLabel: string } {
  const q = quote.toLowerCase();
  const f = filename.toLowerCase();

  if (f.includes("form_adv")) {
    // EARLY position
    if (q.includes("ridgeline capital partners")) return {
      section: "Item 1 — Cover Page",
      before: "This Form ADV Part 2A (\"Brochure\") is filed with the U.S. Securities and Exchange Commission pursuant to Rule 204-3 under the Investment Advisers Act of 1940, as amended. This Brochure provides information about the qualifications, business practices, and advisory services offered by ",
      after: ", LLC (\"Ridgeline\" or the \"Adviser\"). Registration as an investment adviser with the SEC does not imply a certain level of skill or training, and the information contained herein has not been approved or verified by the SEC or by any state securities authority. If you have any questions about the contents of this Brochure, please contact our compliance department at (212) 555-0100 or by email at compliance@ridgelinecap.com. Additional information about Ridgeline Capital Partners, including this Brochure, is available on the SEC's Investment Adviser Public Disclosure website at www.adviserinfo.sec.gov (CRD# 298741). This Brochure is updated at least annually as required by Rule 204-3(b) and may be updated more frequently when material changes occur. Clients and prospective investors should ensure they are reviewing the most current version of this document. Ridgeline does not solicit or accept investments from retail investors as defined under Regulation Best Interest. All advisory relationships are with institutional investors, qualified purchasers, and accredited investors as defined under applicable federal securities laws.",
      pageLabel: "Page 1 of 38",
    };
    // LATE position
    if (q.includes("delaware llc") || q.includes("delaware limited")) return {
      section: "Item 1 — Cover Page",
      before: "This Form ADV Part 2A describes the advisory business, fees, investment strategies, and material risks associated with an investment in Ridgeline Global Opportunities Fund, LP. Prospective investors are strongly encouraged to review this document in its entirety, together with all fund offering documents and side letter agreements, prior to making any investment decision. Ridgeline Capital Partners, LLC is the registered investment adviser and sole General Partner of the Fund. The Adviser is organized as a ",
      after: " and has been continuously registered as an investment adviser with the U.S. Securities and Exchange Commission since April 2018. The firm's principal office and place of business is located at 245 Park Avenue, Suite 3200, New York, NY 10167. The Adviser is wholly owned by its founding principals and there are no outside institutional investors, strategic partners, or third-party controlling interests in the management company. The Adviser employs eleven full-time staff, including four investment professionals, two compliance and legal staff, and five operations and accounting personnel.",
      pageLabel: "Page 2 of 38",
    };
    // MID position
    if (q.includes("crd") || q.includes("april 2018") || q.includes("since april")) return {
      section: "Item 1 — Cover Page",
      before: "Ridgeline Capital Partners, LLC is a registered investment adviser and the sole General Partner of Ridgeline Global Opportunities Fund, LP. The Adviser was founded by David Chen, CFA, in early 2018 following his departure from a New York-based global macro fund where he served as a senior portfolio manager for nine years. The Registrant (CRD# 298741) has maintained continuous registration as an investment adviser with the U.S. Securities and Exchange Commission ",
      after: ". Prior to federal registration, the firm operated under a New York state investment adviser registration from January 2018 through April 2018. The firm has not been subject to any regulatory examination deficiency findings requiring remediation during the current registration period. Clients and prospective investors may verify current registration status and access all disclosure documents through the SEC's Investment Adviser Public Disclosure (IAPD) database at www.adviserinfo.sec.gov. The firm's most recent SEC examination was conducted in October 2023 and resulted in no findings of deficiency.",
      pageLabel: "Page 3 of 38",
    };
    // EARLY position
    if (q.includes("david chen") || q.includes("cfa")) return {
      section: "Item 10 — Other Financial Industry Activities and Affiliations",
      before: "All portfolio management, investment research, trading, and risk oversight functions of Ridgeline Capital Partners are centralized under the sole authority of ",
      after: ", who serves as Chief Investment Officer, Portfolio Manager, and a Managing Member of the General Partner entity. Mr. Chen has managed the Ridgeline Global Opportunities Fund since its inception in January 2018 and holds exclusive authority over all portfolio construction, position sizing, capital allocation, and risk parameter decisions. The firm has not appointed a formal deputy Portfolio Manager, backup investment professional, or documented succession arrangement as of the date of this filing. The CCO has included key-man concentration risk as a standing agenda item for the 2026 annual compliance review. Two senior research analysts, James Park and Sarah Kim, support the investment process but do not hold investment discretion and are not authorized to execute trades independently. The firm's investment committee, which consists of Mr. Chen and the CFO, meets monthly to review portfolio exposures, risk metrics, and market outlook.",
      pageLabel: "Page 6 of 38",
    };
    // LATE position
    if (q.includes("2.31") || q.includes("2.3b") || q.includes("assets under")) return {
      section: "Item 4 — Advisory Business",
      before: "Ridgeline Capital Partners provides discretionary investment advisory services exclusively to pooled investment vehicles. The firm does not currently provide investment advisory services to individual retail clients, pension plans, charitable organizations, or other separately managed account clients. The Adviser's investment strategy focuses on global equity long/short with opportunistic allocations to credit and macro instruments. The Fund employs a bottom-up fundamental research approach combined with top-down macro overlay, targeting concentrated positions in 20 to 35 securities across developed and select emerging markets. As of December 31, 2025, the Registrant manages approximately ",
      after: " in regulatory assets under management on a fully discretionary basis, comprising capital held in the master fund structure, two offshore feeder vehicles registered in the Cayman Islands, and three separately managed accounts for institutional investors. The firm does not manage any assets on a non-discretionary basis. Total assets under management have grown approximately 18% on a year-over-year basis from the prior period, reflecting net capital inflows of approximately $280 million and investment performance of approximately 12.4% net of fees.",
      pageLabel: "Page 4 of 38",
    };
    // MID position
    if (q.includes("no material changes") || q.includes("no changes")) return {
      section: "Item 2 — Material Changes",
      before: "This section is required to summarize material changes made to this Brochure since its most recent annual update, pursuant to Rule 204-3(b)(2) under the Investment Advisers Act of 1940. Investment advisers are required to deliver this summary or the full updated Brochure to existing clients within 120 days of the Registrant's fiscal year-end, or promptly following any interim material amendment. There have been ",
      after: " to this Brochure since the annual amendment filed in March 2024 other than those summarized below. Effective January 1, 2026, the Fund's investment mandate was expanded to permit allocations to structured credit instruments including CLO tranches and asset-backed securities, subject to a 15% portfolio concentration limit. A revised fee schedule applicable to new subscriptions received on or after January 1, 2026 is set forth in Item 5. The composition of the firm's Valuation Committee was updated to include an independent external consultant. Clients are strongly encouraged to review the current Brochure in its entirety and to contact investor relations at ir@ridgelinecap.com with any questions.",
      pageLabel: "Page 1 of 38",
    };
    // LATE position
    return {
      section: "Item 5 — Fees and Compensation",
      before: "Ridgeline charges fees for its investment advisory services in the form of a management fee and an incentive allocation. The management fee is 1.50% per annum of net asset value, calculated on the first business day of each calendar month based on beginning-of-period net asset value and payable monthly in arrears. The incentive allocation is 20% of net profits above a 6% annualized hurdle rate, subject to a high-water mark, calculated and crystallized annually at December 31 of each year. No incentive allocation is charged unless and until cumulative performance has exceeded the applicable high-water mark. The management fee and incentive allocation are the only forms of compensation received by the Adviser in connection with the management of the Fund. The Adviser does not receive soft dollar arrangements, referral fees, or revenue sharing payments in connection with fund management activities. With respect to the specific terms applicable to this investor, including any fee modifications or side letter provisions, the following disclosure is provided: ",
      after: ". Investors should review Item 5 and the applicable subscription documents in their entirety before submitting a subscription agreement. Fee schedules are non-negotiable for new investors with committed capital below $10 million. All fee calculations are subject to independent verification by the Fund's administrator, Citco Fund Services.",
      pageLabel: "Page 8 of 38",
    };
  }

  if (f.includes("ppm") || f.includes("lpa")) {
    // EARLY position
    if (q.includes("delaware") && (q.includes("lp") || q.includes("fund"))) return {
      section: "Section 1 — Organization and Formation",
      before: "Ridgeline Global Opportunities Fund, LP (the \"Fund\") is organized as a ",
      after: " and was formed on January 4, 2018, pursuant to a Certificate of Limited Partnership filed with the Delaware Secretary of State. The Fund's principal office and place of business is 245 Park Avenue, Suite 3200, New York, NY 10167. Ridgeline Capital Partners, LLC (the \"General Partner\") serves as the sole General Partner and investment manager of the Fund. The Fund operates as a master fund in a master-feeder structure, alongside Ridgeline Global Opportunities Fund (Offshore) Ltd., a Cayman Islands exempted company formed for international and tax-exempt investors. Interests in the Fund have not been registered under the Securities Act of 1933, the Investment Company Act of 1940, or any state securities law, and are being offered in reliance upon exemptions from registration requirements. Interests may only be acquired by investors who are both \"accredited investors\" as defined in Regulation D under the Securities Act and \"qualified purchasers\" as defined under Section 2(a)(51) of the Investment Company Act. The Fund intends to qualify for the exemption from registration as an investment company under Section 3(c)(7) of the Investment Company Act.",
      pageLabel: "Page 4 of 72",
    };
    // MID position
    if (q.includes("cayman") || q.includes("offshore")) return {
      section: "Section 2 — Master-Feeder Fund Structure",
      before: "The Fund is designed to accommodate the diverse tax, regulatory, and administrative requirements of its investor base through a master-feeder structure. U.S. taxable investors subscribe directly into Ridgeline Global Opportunities Fund, LP, the onshore Delaware limited partnership. Non-U.S. investors and U.S. tax-exempt investors, including pension funds, endowments, and foundations, may subscribe through ",
      after: ", which passes through substantially all of its capital to the Master Fund via a fully transparent limited partnership interest. Investors in the offshore vehicle benefit from certain protections under applicable income tax treaties, exemption from certain U.S. withholding tax provisions, and streamlined FATCA compliance through the Cayman Islands AEOI regime. All investment decisions, portfolio management, and risk oversight are conducted at the Master Fund level. Allocations of profit and loss are made to each feeder vehicle on a pro-rata basis based on its proportionate interest in the Master Fund. The General Partner may, in its sole discretion, restructure the fund architecture, add additional feeder vehicles, or modify the master-feeder arrangement with 30 days' prior written notice to Limited Partners.",
      pageLabel: "Page 7 of 72",
    };
    // EARLY position
    if (q.includes("2%") || q.includes("20%") || q.includes("hurdle") || q.includes("high-water") || q.includes("hwm")) return {
      section: "Section 7 — Management Fees and Incentive Allocation",
      before: "The General Partner is entitled to receive compensation for its advisory services in the form of a management fee and an annual incentive allocation. The current fee structure applicable to all Limited Partners as of January 1, 2026, unless modified by individual side letter agreement, is as follows: ",
      after: ". The management fee is calculated on the first business day of each calendar month using the beginning-of-period net asset value of each Limited Partner's capital account and is payable monthly in arrears. The incentive allocation is calculated and charged on an annual basis at December 31 of each year. The incentive allocation will be charged only to the extent that cumulative net profits in a Limited Partner's capital account exceed the applicable high-water mark. If the Fund incurs losses in any year, those losses must be fully recovered before any further incentive allocation may be charged. The high-water mark is applied on a per-investor basis and does not reset upon redemption or re-subscription. The General Partner reserves the right to waive or reduce fees for any investor at its sole discretion, including pursuant to a side letter agreement.",
      pageLabel: "Page 18 of 72",
    };
    // LATE position
    if (q.includes("goldman") || q.includes("morgan stanley") || q.includes("prime")) return {
      section: "Section 9 — Prime Brokerage, Custody, and Leverage",
      before: "The Fund may utilize leverage in connection with its investment activities, subject to the risk parameters established by the General Partner. The General Partner monitors gross and net leverage on a daily basis and has established internal guidelines limiting gross exposure to 300% of net asset value and net exposure to 150% in either direction. The Fund finances its leveraged positions primarily through margin facilities provided by its prime brokers. The Fund has established prime brokerage and margin lending relationships with ",
      after: ". All cash and portfolio securities are held in segregated accounts at each respective prime broker under standard institutional prime brokerage agreements. The General Partner may add, remove, or replace prime brokers at any time without prior notice to Limited Partners, subject to its best execution obligations. The Fund does not currently utilize a dedicated independent custodian. Prime broker insolvency risk is mitigated through position diversification across multiple prime brokerage relationships and periodic review of each counterparty's credit profile. The General Partner will notify Limited Partners within 5 business days of any material change to the prime brokerage arrangements.",
      pageLabel: "Page 22 of 72",
    };
    // MID position
    if (q.includes("quarterly") || q.includes("90-day") || q.includes("redemption")) return {
      section: "Section 11 — Redemptions, Withdrawals, and Liquidity",
      before: "The Fund is designed as a semi-liquid investment vehicle providing limited liquidity to investors on a periodic basis. The General Partner believes this liquidity profile is consistent with the Fund's investment strategy and enables the portfolio to maintain positions through short-term volatility. Subject to the terms and conditions set forth in this Section and in the Limited Partnership Agreement, Limited Partners may submit redemption requests on the following basis: ",
      after: ". Written redemption requests must be submitted to the Fund Administrator no later than 60 calendar days prior to the applicable redemption date. The General Partner, in its sole and absolute discretion, reserves the right to suspend, delay, restrict, gate, or satisfy redemptions in kind during periods of market dislocation, operational disruption, or when the aggregate redemption requests for any single redemption date exceed 25% of the Fund's net asset value. Partial redemptions are permitted provided the redeeming Limited Partner maintains a minimum capital account balance of $1,000,000 following the redemption. Redemption proceeds will be paid within 30 business days following the applicable redemption date. The General Partner may hold back up to 10% of redemption proceeds pending finalization of the Fund's annual audit.",
      pageLabel: "Page 24 of 72",
    };
    // LATE position
    if (q.includes("mfn") || q.includes("most favored") || q.includes("25m") || q.includes("25 million")) return {
      section: "Section 13 — Side Letter Agreements and Investor Rights",
      before: "The General Partner may, in its sole discretion, enter into side letter or other similar agreements with one or more Limited Partners, pursuant to which such Limited Partners may be granted rights, entitlements, or terms that are not set forth in this Agreement or the Subscription Documents and that may not be available to other Limited Partners. Side letter rights may include, without limitation, reduced management fees, reduced incentive allocations, enhanced reporting obligations, portfolio transparency rights, advance notice of material events, co-investment rights, transfer restrictions modifications, and ",
      after: " rights entitling such investor to receive terms no less favorable than those granted to any other investor of a similar size and type. Side letters are generally offered to Limited Partners making initial subscriptions of $25 million or more at the time of the Fund's first close or within six months thereafter. Investors subscribing subsequent to the Fund's first anniversary may be offered side letter rights at the General Partner's sole discretion. The existence, identity of parties to, and general categories of terms contained in any side letter shall be disclosed to all Limited Partners upon written request, subject to confidentiality restrictions agreed between the parties. The General Partner shall not enter into any side letter that materially adversely affects the economic rights of existing Limited Partners without prior written consent of a Majority in Interest.",
      pageLabel: "Page 31 of 72",
    };
    // LATE position
    return {
      section: "Section 2 — Defined Terms and Interpretation",
      before: "For purposes of this Agreement and any supplement, amendment, or exhibit hereto, the following capitalized terms shall have the meanings ascribed to them in this Section 2 unless otherwise explicitly defined in context. Terms defined in any exhibit to this Agreement shall have the meaning set forth in such exhibit when used therein. In the event of any conflict between a defined term in this Agreement and a defined term in any Subscription Agreement or side letter, the definition set forth in the applicable Subscription Agreement or side letter shall control solely with respect to the party thereto. All references to statutes, regulations, rules, or official guidance shall be deemed to refer to such authorities as amended, restated, or replaced from time to time. As defined in Section 2.1 of this Agreement: ",
      after: ". Additional defined terms used in this Agreement include: \"Affiliate\" means any entity that directly or indirectly controls, is controlled by, or is under common control with the referenced party; \"Business Day\" means any day other than a Saturday, Sunday, or day on which commercial banks in the State of New York are authorized or required by law to close; \"Capital Account\" means the bookkeeping account maintained for each Limited Partner in accordance with Section 9; and \"Net Asset Value\" means the total fair market value of all assets of the Fund, minus all accrued liabilities including management fees and estimated incentive allocations, as determined by the Fund's independent administrator.",
      pageLabel: "Page 11 of 72",
    };
  }

  if (f.includes("ddq")) {
    // MID position
    if (q.includes("david chen") || q.includes("cio") || q.includes("portfolio manager")) return {
      section: "Section 2 — Key Personnel and Organizational Structure",
      before: "Ridgeline Capital Partners employs eleven full-time staff across investment, compliance, operations, and investor relations functions. The investment team consists of four professionals: the CIO, two senior research analysts (James Park and Sarah Kim), and a dedicated risk officer (Michael Torres). The compliance and legal team consists of the CCO (Linda Wu) and one compliance analyst. Operations, finance, and fund accounting are handled by a team of three, reporting to the CFO (Robert Ng). Investor relations is managed by one dedicated IR professional and one associate. All portfolio management, investment research, and final trading decisions are the exclusive responsibility of ",
      after: ", CFA, who serves as Chief Investment Officer, sole Portfolio Manager, and a Managing Member of the General Partner entity. Mr. Chen founded the firm in 2018 following nine years as a senior PM at a global macro fund. He maintains full investment discretion and there is currently no formal succession plan, documented deputy PM role, or contingency arrangement for the continuation of portfolio management in the event of Mr. Chen's extended unavailability. This key-man concentration has been acknowledged by the Adviser as a material operational risk. The General Partner has represented that it will establish a formal succession framework and consider hiring an additional senior PM during the 2026 fiscal year, pending AUM growth objectives being met.",
      pageLabel: "Page 5 of 44",
    };
    // EARLY position
    if (q.includes("northern trust") || q.includes("administrator") || q.includes("citco")) return {
      section: "Section 5 — Fund Administrator and Third-Party Service Providers",
      before: "The following is a complete listing of Ridgeline's material third-party service providers as of December 31, 2025. Fund Administrator: ",
      after: ", engaged since January 2021. Citco is responsible for all independent NAV calculations, investor capital account recordkeeping, anti-money laundering and know-your-customer compliance, subscription and redemption processing, and FATCA/CRS reporting. NAV calculations are performed monthly as of the last business day of each calendar month and are independently reconciled against prime broker statements prior to distribution. Citco issues capital account statements to all Limited Partners within 15 business days of each month-end. Legal Counsel: Simpson Thacher & Bartlett LLP (fund formation and ongoing); Davis Polk & Wardwell LLP (regulatory matters). Auditor: Ernst & Young LLP (annual audited financial statements). Tax Advisor: KPMG LLP (fund-level and investor tax reporting). Prime Brokers: Goldman Sachs Prime Services and Morgan Stanley Institutional Equity Services. All service provider engagement letters are available for review upon written request from qualified investors.",
      pageLabel: "Page 9 of 44",
    };
    // LATE position
    if (q.includes("third-party") || q.includes("msp") || q.includes("it infrastructure")) return {
      section: "Section 8 — Technology Infrastructure and Cybersecurity Program",
      before: "Ridgeline's information technology environment comprises a combination of cloud-hosted SaaS applications and on-premises workstations. The firm does not operate its own data center. All primary systems are hosted on AWS GovCloud or equivalent enterprise-grade cloud infrastructure. Core investment applications include Bloomberg Terminal (market data and analytics), Advent APX (portfolio accounting), SS&C Eze OMS (order management and compliance pre-trade checks), and FactSet (research and analysis). The firm's front-to-back data flows are reconciled daily using an automated reconciliation engine provided by Hazeltree. The firm does not maintain a dedicated Chief Information Security Officer (CISO). Cybersecurity governance is the responsibility of the CCO, supported by an engagement with ",
      after: " for ongoing monitoring, patch management, endpoint protection, and incident detection. The firm adopted a Written Information Security Policy (WISP) in 2022; however, this policy has not been formally updated since its adoption and predates the firm's migration to its current cloud architecture. A formal third-party penetration test has not been conducted within the past 24 months. The CCO has engaged a cybersecurity consultant to conduct a penetration test and WISP refresh, with both deliverables targeted for completion by Q2 2026. A formal written incident response plan is currently under development. The firm has not experienced a reportable cybersecurity incident as defined under applicable law during the current reporting period.",
      pageLabel: "Page 27 of 44",
    };
    // MID position
    return {
      section: "Section 4 — Operational Infrastructure and Capital Structure",
      before: "The following responses are provided on behalf of Ridgeline Capital Partners, LLC in connection with the operational due diligence review conducted by Alpine Asset Management in January 2026. All information is current as of December 31, 2025, unless otherwise specified. Section 4.3 — Fund-Level Leverage and Financing Arrangements: With respect to the question of whether the management company has any third-party financing, bank credit facilities, or institutional investors in the GP entity, the Adviser's response is as follows: ",
      after: ". The management company is funded entirely from management fee revenues and the personal capital of the founding principals. There are no third-party institutional investors in the General Partner entity, no bank credit lines drawn against management fee receivables, and no deferred compensation or revenue-sharing obligations to former employees or principals. The General Partner's operating expenses, including rent, technology, salaries, and professional fees, are funded exclusively from management fee income. Supporting documentation, including the most recent management company financial statements and a schedule of operating expenses, is available for review by qualified investors upon written request to ir@ridgelinecap.com.",
      pageLabel: "Page 14 of 44",
    };
  }

  if (f.includes("compliance") || f.includes("code_of_ethics") || f.includes("ethics")) {
    // EARLY position
    if (q.includes("code of ethics") || q.includes("annual") || q.includes("distributed") || q.includes("acknowledged")) return {
      section: "Section 2 — Code of Ethics: Adoption, Distribution, and Certification",
      before: "Ridgeline Capital Partners has adopted a Code of Ethics (the \"Code\") pursuant to Rule 204A-1 under the Investment Advisers Act of 1940 and Rule 17j-1 under the Investment Company Act of 1940, as applicable. The Code sets forth the standards of business conduct and personal trading requirements applicable to all \"Access Persons\" of the firm, as defined in Section 1.1 of the Code. The ",
      after: " is distributed to all Access Persons upon commencement of employment or engagement and no less frequently than annually thereafter. Each Access Person is required to acknowledge receipt of the Code in writing and to certify their full compliance with its requirements within ten (10) calendar days of each distribution. The Chief Compliance Officer maintains a complete log of all Code acknowledgments and certifications, together with records of any reported violations, waivers granted, and disciplinary actions taken. These records are available for inspection by authorized regulatory examiners upon reasonable notice. Failure to timely certify compliance with the Code is treated as a material compliance deficiency and may result in formal disciplinary action, including termination of employment.",
      pageLabel: "Page 8 of 34",
    };
    // LATE position
    if (q.includes("personal trading") || q.includes("pre-clearance")) return {
      section: "Section 4 — Personal Trading Policy and Pre-Clearance Requirements",
      before: "Section 4 of this Compliance Manual sets forth the firm's personal trading policy, which is designed to prevent potential conflicts of interest between an Access Person's personal investment activities and the firm's fiduciary obligations to its clients. All Access Persons are required to comply with the following requirements with respect to all \"Reportable Securities\" as defined in Rule 204A-1 and Section 1.1 of this Manual. Access Persons must obtain written ",
      after: " approval from the Chief Compliance Officer prior to executing any personal trade in a Reportable Security that is held in any client account, is being considered for purchase or sale for any client account, or is subject to a pending client order. Pre-clearance must be requested and documented through the firm's compliance management system and, once granted, remains valid for 48 hours from the time of approval. Access Persons are strictly prohibited from executing personal trades on any day during which a client order in the same security is pending or was executed, regardless of whether pre-clearance was previously granted. Pre-clearance will be automatically denied if the requested security is on the firm's restricted list. Violations of the personal trading policy must be self-reported to the CCO within 24 hours of discovery and are subject to mandatory disgorgement and potential disciplinary action.",
      pageLabel: "Page 14 of 34",
    };
    // MID position
    return {
      section: "Section 6 — Supervisory Procedures, Oversight, and Annual Review",
      before: "The Chief Compliance Officer bears primary responsibility for administering, enforcing, and periodically reviewing all compliance policies and procedures adopted by the firm pursuant to Rule 206(4)-7 under the Investment Advisers Act of 1940. The CCO is authorized to conduct periodic reviews of trading activity, personal account transactions, communications, and other business activities of all Access Persons. Pursuant to Rule 206(4)-7, the firm is required to conduct a formal annual review of the adequacy and effectiveness of its compliance program. The annual review assesses whether the firm's policies and procedures are reasonably designed to prevent violations of applicable securities laws and regulations. The most recent annual compliance review was completed in December 2025. The annual review concluded that the firm's compliance program is generally adequate and effective, ",
      after: ". The CCO identified the following areas for enhancement during the 2026 period: (i) updating the Written Information Security Policy to reflect current technology infrastructure, (ii) completing a third-party penetration test, and (iii) formalizing a written succession plan for the Portfolio Manager role. Each annual review produces a written report summarizing material compliance events, regulatory developments, policy updates, and recommended enhancements to internal controls, which is presented to senior management within 60 days of fiscal year-end and retained in the firm's compliance records for a minimum of five years.",
      pageLabel: "Page 19 of 34",
    };
  }

  if (f.includes("financials") || f.includes("fy2024") || f.includes("audit")) {
    // MID position
    if (q.includes("ernst") || q.includes("ey") || q.includes("auditor")) return {
      section: "Independent Auditor's Report to the Partners",
      before: "To the Partners of Ridgeline Global Opportunities Fund, LP: We have audited the accompanying financial statements of Ridgeline Global Opportunities Fund, LP (the \"Fund\"), which comprise the statement of financial condition as of December 31, 2024, and the related statements of operations, changes in partners' capital, and cash flows for the year then ended, and the related notes to the financial statements. Management is responsible for the preparation and fair presentation of these financial statements in accordance with accounting principles generally accepted in the United States of America; this includes the design, implementation, and maintenance of internal controls relevant to the preparation and fair presentation of financial statements. These financial statements have been audited by ",
      after: ", LLP, an independent registered public accounting firm. We conducted our audit in accordance with auditing standards generally accepted in the United States of America. Those standards require that we plan and perform the audit to obtain reasonable assurance about whether the financial statements are free from material misstatement, whether due to error or fraud. An audit involves performing procedures to obtain audit evidence about the amounts and disclosures in the financial statements. The procedures selected depend on the auditor's judgment, including the assessment of the risks of material misstatement of the financial statements, whether due to error or fraud. In our opinion, the financial statements referred to above present fairly, in all material respects, the financial position of the Fund as of December 31, 2024, and the results of its operations and its cash flows for the year then ended.",
      pageLabel: "Page 2 of 28",
    };
    // EARLY position
    if (q.includes("t+3") || q.includes("reconciliation") || q.includes("t+1")) return {
      section: "Note 7 — Trade Settlement, Reconciliation, and Operational Controls",
      before: "The Fund settles equity and equity-linked securities transactions on a standard ",
      after: " settlement basis in accordance with market convention and applicable exchange rules. Fixed income securities settle on T+1 or T+2 depending on instrument type and trading venue. Over-the-counter derivatives are subject to bilateral settlement terms as set forth in the applicable ISDA master agreements. The Fund's Operations team is responsible for daily trade confirmation and settlement monitoring across all prime brokerage relationships. The Fund Administrator, Citco Fund Services, performs an independent daily reconciliation of the Fund's holdings, cash positions, and margin balances against prime broker statements. Any reconciliation breaks or discrepancies are escalated to the CFO within four business hours and reported to the CCO at the end of each business day. As of December 31, 2024, there were no unresolved reconciliation breaks that had remained open for a period exceeding 30 calendar days. All significant reconciliation exceptions identified during the fiscal year were resolved within three business days of identification.",
      pageLabel: "Page 17 of 28",
    };
    // LATE position
    return {
      section: "Note 2 — Summary of Significant Accounting Policies",
      before: "The following notes form an integral part of the financial statements and should be read in conjunction therewith. Note 1 — Organization: Ridgeline Global Opportunities Fund, LP (the \"Fund\") is a Delaware limited partnership formed on January 4, 2018. The Fund's principal business objective is to achieve capital appreciation through a global equity long/short investment strategy with opportunistic allocations to credit and macro instruments. Note 2 — Basis of Presentation: ",
      after: ". The Fund's fiscal year ends December 31. These financial statements have been prepared on a going-concern basis. Comparative figures for the year ended December 31, 2023 have been restated where necessary to conform to the current year's presentation. Note 3 — Significant Estimates: The preparation of financial statements in conformity with U.S. GAAP requires management to make estimates and assumptions that affect the reported amounts of assets, liabilities, revenues, and expenses. Actual results could differ from those estimates. The most significant estimates involve the fair valuation of Level 3 portfolio securities. As of December 31, 2024, Level 3 assets represented approximately 3.2% of total net asset value.",
      pageLabel: "Page 5 of 28",
    };
  }

  // EARLY position
  if (f.includes("bcp")) return {
    section: "Section 4 — Recovery Objectives and Continuity Procedures",
    before: "Ridgeline Capital Partners has established the following Recovery Time Objectives (RTO) and Recovery Point Objectives (RPO) for each critical business function in the event of a significant business disruption: RTO for core trading systems is 4 hours; RTO for fund accounting and NAV calculation is 8 hours; RPO for investor data and capital account records is 24 hours; RPO for trade records and position data is 1 hour. The firm's primary backup site is located at a colocation facility in Secaucus, NJ, operated by Equinix. All critical data, including investor records, portfolio positions, trade history, and compliance files, is replicated to the backup site on a near-real-time basis using encrypted data synchronization. The backup site is capable of supporting core trading and fund accounting operations within the specified RTO windows. With respect to the overall continuity testing and review program: ",
    after: ". The most recent tabletop business continuity exercise was conducted in October 2025 and included participation from the CIO, CFO, CCO, and Operations team. The exercise tested the firm's ability to transition to the backup site following a simulated primary office outage and identified two process gaps, both of which have since been remediated. The BCP is reviewed and updated at least annually by the CCO with input from all department heads. The next scheduled review is October 2026. A summary of the most recent test results and any identified gaps is maintained in the compliance files and is available to qualified investors upon request.",
    pageLabel: "Page 11 of 22",
  };

  if (f.includes("valuation")) {
    // EARLY position
    if (q.includes("quarterly") || q.includes("valuation committee")) return {
      section: "Article III — Valuation Committee: Composition, Authority, and Meeting Procedures",
      before: "The Valuation Committee has been established by the General Partner to oversee the fair valuation of all portfolio positions and to ensure that the Fund's NAV calculations comply with applicable accounting standards and the Fund's valuation policy. The Committee convenes on a ",
      after: " basis, typically within 5 business days following each calendar quarter-end, to review and ratify the fair valuation of all Level 2 and Level 3 portfolio positions requiring significant estimation or management judgment. The Valuation Committee is composed of the following members: (i) David Chen, CFA (CIO, non-voting chair), (ii) Robert Ng (CFO, voting member), (iii) Linda Wu (CCO, voting member), and (iv) an independent external valuation consultant retained from Duff & Phelps, LLC (voting member). A quorum for the conduct of any Valuation Committee meeting requires the attendance of at least three members, including the CCO and the independent consultant. All Valuation Committee determinations are documented in meeting minutes prepared by the CCO within 3 business days of each meeting. These minutes are maintained in the firm's records and are available to the Fund's auditor and authorized regulatory examiners.",
      pageLabel: "Page 7 of 18",
    };
    // LATE position
    return {
      section: "Section 2 — Valuation Hierarchy, Fair Value Measurement, and Governance",
      before: "The Fund measures and reports the fair value of portfolio securities in accordance with ASC 820 (Fair Value Measurement) and GAAP. The Fund employs a three-tier valuation hierarchy: Level 1 assets are valued using unadjusted quoted prices in active markets for identical securities; Level 2 assets are valued using observable inputs other than Level 1 prices, including quoted prices for similar securities, yield curves, and volatility data; Level 3 assets are valued using unobservable inputs, including management assumptions, discounted cash flow models, comparable transaction analysis, and broker quotes, and require formal Valuation Committee approval. The following governance requirements apply to all fair value determinations made under this Policy. As set forth in Section 2.1 of this Valuation Policy: ",
      after: ". All Level 3 valuations must be independently reviewed by the Fund's Administrator prior to inclusion in the NAV calculation. For any Level 3 position representing 5% or more of the Fund's net asset value, an independent third-party valuation conducted by the external valuation consultant is required on at least an annual basis. The Investment Adviser is expressly prohibited from overriding a Valuation Committee determination without documented escalation to the full Committee and, for positions exceeding 10% of NAV, without prior notification to the Fund's auditor.",
      pageLabel: "Page 4 of 18",
    };
  }

  // MID position
  if (f.includes("org_chart")) return {
    section: "Organizational Chart and Reporting Lines — November 2025",
    before: "The following organizational chart illustrates Ridgeline Capital Partners' current organizational structure, headcount, and reporting relationships as of November 2025. The firm currently employs eleven full-time staff and two part-time contractors. Investment Team (4 FTE): David Chen, CFA (CIO / Portfolio Manager), James Park (Senior Research Analyst, Equities), Sarah Kim (Senior Research Analyst, Credit), Michael Torres (Risk Officer). Compliance & Legal (2 FTE): Linda Wu, JD (CCO / General Counsel), Jessica Lin (Compliance Analyst). Finance & Operations (3 FTE): Robert Ng, CPA (CFO), David Kim (Fund Accountant), Alex Johnson (Operations Analyst). Investor Relations (2 FTE): Megan Park (Head of IR), Ryan Lee (IR Associate). Reporting structure: ",
    after: ". The Chief Compliance Officer and Chief Financial Officer maintain dual reporting lines to both the Portfolio Manager and the General Partner entity to preserve compliance independence. The General Partner does not currently have a formal Chief Operating Officer or Chief Risk Officer role; operational oversight is shared between the CFO and CCO. The two part-time contractors support technology infrastructure and office administration, respectively. The firm does not currently employ a dedicated Chief Technology Officer or information security professional.",
    pageLabel: "Page 1 of 2",
  };

  if (f.includes("alpine_analysis_record")) {
    // EARLY position
    if (q.includes("key person") || q.includes("succession") || q.includes("dependency") || q.includes("chen")) return {
      section: "Key Person Risk — Internal Analysis Note",
      before: "Alpine Due Diligence Inc. — Internal Cross-Reference Analysis. ODD Engagement: Ridgeline Capital Partners, LLC. Prepared by: ODD Review Team. Date: January 2026. Reference: ALPINE-RCP-2026-KP-001. This note summarizes Alpine's internal analysis of key person risk at Ridgeline Capital Partners based on a review of all submitted documents, the management interview conducted January 15, 2026, and publicly available information. Investment Process Concentration: 100% of investment discretion resides with David Chen, CFA (CIO/PM/Managing Member). No deputy PM, no documented authority delegation, and no board-approved succession plan exist as of the date of this review. Alpine cross-reference finding: ",
      after: ". Alpine reviewed Form ADV Item 10, the DDQ, the ODD questionnaire, and notes from the management interview. The firm's response to the succession question in the DDQ states that 'succession planning is being addressed at the 2026 strategy day.' No additional documentation was provided. This is a material open item and has been elevated to a HIGH-severity risk observation in the ODD report. Alpine recommends that a board-approved succession plan with an interim investment management arrangement be submitted as a condition of ACCEPT upgrade.",
      pageLabel: "Alpine Analysis · Page 1",
    };
    // MID position
    if (q.includes("bcp") || q.includes("business continuity") || q.includes("testing") || q.includes("annual test")) return {
      section: "BCP / Operational Resilience — Internal Analysis Note",
      before: "Alpine Due Diligence Inc. — Internal Cross-Reference Analysis. ODD Engagement: Ridgeline Capital Partners, LLC. Reference: ALPINE-RCP-2026-OPS-002. This note summarizes Alpine's analysis of the firm's business continuity and disaster recovery readiness. The firm's BCP was last updated in October 2021. Alpine requested evidence of annual BCP testing as part of the document request list distributed November 2025. The firm submitted its BCP document but did not provide test results or a formal testing schedule. During the management interview, the COO stated that a tabletop exercise was conducted in-house in March 2025 but that no formal report or written results were prepared. Alpine cross-reference finding: ",
      after: ". Alpine's standard is that BCP test results be documented in writing by an independent reviewer and retained for at least three years. The absence of documented test results is a reportable gap. Additionally, the BCP does not address the firm's 2023 office relocation from Midtown to its current address at 245 Park Avenue, and does not include pandemic/remote work protocols. This item has been included as a condition of ACCEPT upgrade: a full BCP test with documented results must be completed by May 31, 2026.",
      pageLabel: "Alpine Analysis · Page 2",
    };
    // LATE position
    return {
      section: "General Cross-Reference Finding",
      before: "Alpine Due Diligence Inc. — Internal Cross-Reference Analysis. ODD Engagement: Ridgeline Capital Partners, LLC. Reference: ALPINE-RCP-2026-GEN. This analysis note is prepared to document discrepancies, gaps, or notable observations identified during Alpine's cross-referencing of submitted documents against DDQ responses, Form ADV disclosures, management interview notes, and third-party verification results. The following finding was identified during the review: ",
      after: ". This observation has been incorporated into the relevant section of the ODD report. Analyst notes are maintained in the Alpine internal review file and are available to authorized Alpine personnel. These notes are not distributed to the Manager or to third parties and are intended solely for internal ODD documentation purposes. All findings are subject to review by the ODD team lead prior to inclusion in the final report.",
      pageLabel: "Alpine Analysis · Page 1",
    };
  }

  if (f.includes("manager_call_record")) {
    // EARLY position
    if (q.includes("succession") || q.includes("key person") || q.includes("chen") || q.includes("interim")) return {
      section: "Management Interview — Investment Process & Key Person",
      before: "Alpine Due Diligence Inc. — Management Interview Notes. ODD Engagement: Ridgeline Capital Partners, LLC. Interview Date: January 15, 2026, 10:00am – 12:30pm EST. Attendees (Manager): David Chen CFA (CIO/PM), Linda Wu JD (CCO/General Counsel). Attendees (Alpine): ODD Lead Analyst, Senior Associate. Format: Video conference. These notes represent a summary of the discussion and are not a verbatim transcript. The interview covered investment process, compliance infrastructure, operational controls, technology, and risk management. Investment Process: David Chen described the firm's investment process as bottom-up fundamental with a macro overlay. He confirmed that all investment decisions are made by himself personally, with research input from James Park and Sarah Kim. On succession planning, Mr. Chen stated: ",
      after: ". Linda Wu added that the topic is on the agenda for the firm's annual strategy meeting scheduled for Q1 2026. Alpine noted that no formal succession plan document exists and requested one as a condition of the ACCEPT upgrade. Compliance Infrastructure: Ms. Wu confirmed that she holds both the CCO and General Counsel roles. She acknowledged the inherent tension in dual responsibilities but stated that the firm's compliance workload is manageable given its investor base size and strategy focus.",
      pageLabel: "Call Notes · Page 1 of 3",
    };
    // MID position
    if (q.includes("cco") || q.includes("compliance") || q.includes("pre-trade") || q.includes("personal trading")) return {
      section: "Management Interview — Compliance Infrastructure",
      before: "Compliance Infrastructure (continued): Alpine asked about pre-trade compliance controls given the fund's equity-heavy mandate. Linda Wu confirmed that the firm does not currently use an automated pre-trade compliance system. Instead, investment decisions are communicated verbally to the trading desk and compliance review is performed on a post-trade basis via review of the trade blotter. Ms. Wu stated that Bloomberg AIM had been evaluated in 2024 but not implemented due to cost. Alpine expressed concern about the adequacy of post-trade-only compliance in an equity long/short strategy. In response: ",
      after: ". Alpine's assessment is that the absence of pre-trade controls is a material gap, particularly for a fund managing $2.31B in equity exposures. This has been documented as a HIGH-severity risk observation and a condition has been set requiring deployment of Bloomberg AIM or equivalent by June 30, 2026.",
      pageLabel: "Call Notes · Page 2 of 3",
    };
    // LATE position
    return {
      section: "Management Interview — Technology & Cybersecurity",
      before: "Technology & Cybersecurity: Alpine asked about cybersecurity preparedness. The COO confirmed that IT infrastructure is managed by a third-party MSP (CrowdStrike-managed endpoint protection, Microsoft 365 for email and collaboration). Annual penetration testing is conducted by Kroll Cyber. The most recent test was completed in January 2026. Alpine asked whether a written incident response plan exists. The COO confirmed that ",
      after: ". Alpine requested a copy of the incident response plan as part of the follow-up document request. Operations: The firm uses Eze OMS for order management, Advent Geneva for portfolio accounting, and Bloomberg BVAL for pricing. The administrator (Citco) performs independent NAV calculation monthly. No material reconciliation breaks were reported in 2025. Alpine confirmed all key service provider relationships and found them consistent with DDQ disclosures.",
      pageLabel: "Call Notes · Page 3 of 3",
    };
  }

  if (f.includes("pentest_jan2026_record")) {
    // EARLY position
    if (q.includes("completed") || q.includes("january 2026") || q.includes("no critical") || q.includes("kroll")) return {
      section: "Executive Summary",
      before: "Kroll Cyber Risk — Penetration Testing Services. Client: Ridgeline Capital Partners, LLC. Engagement Type: External Network and Application Penetration Test. Engagement Dates: January 6–28, 2026. Scope: External network perimeter, web-facing applications (investor portal, firm website), Microsoft 365 environment, and simulated phishing assessment of all employees. Report Date: January 28, 2026. Report Classification: CONFIDENTIAL — For Ridgeline Capital Partners Internal Use Only. Executive Summary: Kroll conducted a comprehensive external penetration test of Ridgeline Capital Partners' technology environment. Testing was conducted from an unauthenticated external perspective with no prior knowledge of internal network architecture. Overall Finding: ",
      after: ". Two medium-severity and four low-severity findings were identified. No exploitable critical vulnerabilities were found in the external attack surface. The investor portal was tested against OWASP Top 10 vulnerabilities; no injection, authentication bypass, or session management vulnerabilities were identified. Microsoft 365 environment shows adequate security posture with MFA enforced for all accounts. The simulated phishing assessment identified a 12% click rate among employees, which Kroll considers within acceptable range for a firm of this size and profile.",
      pageLabel: "Kroll Pen Test Report · Page 1 of 18",
    };
    // MID position
    if (q.includes("medium") || q.includes("finding") || q.includes("vulnerability") || q.includes("remediation")) return {
      section: "Findings Summary — Medium Severity",
      before: "Medium Severity Findings (2): These findings represent security weaknesses that do not present an immediate risk of unauthorized access or data exfiltration but should be remediated within 90 days. Finding M-001: Outdated TLS configuration on the firm's investor document portal. The portal accepts TLS 1.0 and 1.1 connections in addition to TLS 1.2 and 1.3. While no active exploit was demonstrated, this configuration is considered deprecated and below current security standards. Recommended remediation: disable TLS 1.0 and 1.1. Finding M-002: ",
      after: ". Recommended remediation: implement strict Content Security Policy headers and enable HTTP Strict Transport Security (HSTS) with a minimum max-age of one year. Kroll recommends both medium findings be remediated within 60 days. Ridgeline management confirmed during the exit interview that both findings would be addressed by the IT MSP within 30 days of report receipt. Low Severity Findings (4): Four low-severity informational findings were identified related to DNS configuration, HTTP response headers, and cookie security attributes. These do not represent exploitable risk and may be remediated at the firm's discretion.",
      pageLabel: "Kroll Pen Test Report · Page 7 of 18",
    };
    // LATE position
    return {
      section: "Scope and Methodology",
      before: "Testing Methodology: Kroll's external penetration test followed a structured methodology aligned with the PTES (Penetration Testing Execution Standard) and OWASP Testing Guide v4.2. Testing was conducted in three phases: (1) Reconnaissance and intelligence gathering using passive OSINT techniques; (2) Vulnerability identification using automated scanning tools (Nessus, Burp Suite Pro) followed by manual validation; (3) Exploitation attempts against validated vulnerabilities to confirm exploitability and assess potential business impact. All testing was conducted within the agreed scope boundaries with no disruption to production systems. Scope: External IP ranges provided by Ridgeline (3 IP ranges, 18 hosts), investor portal at portal.ridgelinecap.com, firm website at www.ridgelinecap.com, and Microsoft 365 tenant. Out of scope: internal network, cloud infrastructure (AWS/Azure), and employee personal devices. Authorization: ",
      after: ". All testing was pre-authorized by Linda Wu, JD (CCO/General Counsel) on behalf of Ridgeline Capital Partners, LLC. A signed Rules of Engagement document is on file with Kroll and available upon request. This report is intended solely for the use of Ridgeline Capital Partners and may not be shared with third parties without Kroll's prior written consent.",
      pageLabel: "Kroll Pen Test Report · Page 3 of 18",
    };
  }

  if (f.includes("admin_verification_record")) {
    // EARLY position — AUM confirmation
    if (q.includes("aum") || q.includes("2.3") || q.includes("2.31") || q.includes("variance") || q.includes("confirmed")) return {
      section: "Net Asset Value and AUM Confirmation",
      before: "Citco Fund Services (Ireland) Limited — Third-Party Administrator Verification Letter. Addressee: Alpine Due Diligence Inc., Attn: ODD Review Team. Re: Ridgeline Global Opportunities Fund, LP — Administrator Confirmation of NAV and AUM as of December 31, 2025. Date: January 22, 2026. Reference: RCP-ODD-2026-001. This letter is provided at the request of Alpine Due Diligence Inc. in connection with its operational due diligence review of Ridgeline Global Opportunities Fund, LP. Citco Fund Services serves as the independent fund administrator for the Fund pursuant to the Administration Agreement dated April 1, 2018, as amended. As of December 31, 2025, Citco has calculated and confirmed the following: ",
      after: ". The net asset value per share for Class A (USD) as of December 31, 2025 is $1,842.17, representing a 12.4% net return for the calendar year. The 0.17% variance between manager-reported and administrator-confirmed AUM is within normal operational tolerance and reflects a timing difference in the recognition of accrued interest income on fixed income positions. Citco confirms that NAV calculations have been performed on a monthly basis throughout 2025 with no material restatements or adjustments. All calculations are performed in accordance with the valuation policies set forth in the Fund's Limited Partnership Agreement and the independent Valuation Policy adopted January 1, 2026.",
      pageLabel: "Citco Verification · Page 1 of 4",
    };
    // MID position — fee calculations
    if (q.includes("fee") || q.includes("management") || q.includes("incentive") || q.includes("1.5") || q.includes("20%")) return {
      section: "Fee Calculation Verification",
      before: "Citco Fund Services confirms that management fees and incentive allocations have been calculated in accordance with the terms of the Limited Partnership Agreement and as disclosed in the Fund's current Form ADV Part 2A. For the fiscal year ended December 31, 2025, the following fees were calculated and charged: Management fees are accrued monthly at 1/12th of the annual rate of 1.50% of beginning-of-period net asset value. Incentive allocation is calculated annually at December 31 at a rate of 20% of net profits in excess of the applicable hurdle rate of 6% per annum and subject to a high-water mark on a per-investor basis. Citco confirms that no incentive allocation was charged to any investor whose capital account had not recovered to the applicable high-water mark as of January 1, 2025. The total management fees charged to the Fund for fiscal year 2025 were $33.7 million. The total incentive allocation charged for fiscal year 2025 was $52.4 million, representing ",
      after: ". Citco notes that fee calculations were independently reviewed by Ernst & Young LLP as part of the annual audit process and no material exceptions were identified. All fee payments to the General Partner have been made from Fund assets in accordance with the timing provisions of the Limited Partnership Agreement. Citco has not been directed by any party to deviate from the fee calculation methodology set forth in the governing documents at any time during the period under review.",
      pageLabel: "Citco Verification · Page 2 of 4",
    };
    // LATE position — audit and reporting
    return {
      section: "Audit Cooperation and Financial Reporting",
      before: "Citco Fund Services confirms full cooperation with the Fund's annual audit conducted by Ernst & Young LLP for the fiscal year ended December 31, 2025. The audit was completed on March 28, 2025. No material weaknesses, significant deficiencies, or audit adjustments were identified during the audit process. Citco provided Ernst & Young with all requested trial balances, position records, cash reconciliations, investor capital account statements, and fee calculation workpapers on a timely basis. There were no disagreements between Citco and Ernst & Young regarding the application of accounting principles or the presentation of financial statements. Citco further confirms the following with respect to investor reporting: monthly investor statements were distributed within 15 business days of month-end throughout 2025; annual investor capital account statements for fiscal year 2024 were distributed on February 28, 2025; and K-1 tax documents for U.S. investors were distributed by March 15, 2025. With respect to anti-money laundering and KYC procedures: ",
      after: ". All investor subscriptions processed during 2025 were subject to full KYC/AML review prior to the acceptance of subscription funds. No suspicious activity reports were filed and no investor accounts were suspended or terminated for compliance reasons during the period under review. Citco maintains all investor records in accordance with applicable data retention requirements under Irish law and the Cayman Islands Monetary Authority's AML regulations. This letter may be relied upon solely by Alpine Due Diligence Inc. in connection with the specified ODD engagement and may not be disclosed to or relied upon by any other party without Citco's prior written consent.",
      pageLabel: "Citco Verification · Page 3 of 4",
    };
  }

  if (f.includes("iapd_record")) {
    // EARLY position — registration details
    if (q.includes("registered") || q.includes("crd") || q.includes("effective") || q.includes("adviser")) return {
      section: "Registration Summary",
      before: "Investment Adviser Public Disclosure — IAPD Report generated April 16, 2026. Firm Name: Ridgeline Capital Partners, LLC. Main Office: 245 Park Avenue, Suite 3200, New York, NY 10167. Phone: (212) 555-0100. Website: www.ridgelinecap.com. Registration Status: REGISTERED. Registered as an investment adviser with the U.S. Securities and Exchange Commission. Registration effective April 14, 2018. This firm is currently in full compliance with all applicable registration requirements under the Investment Advisers Act of 1940. CRD / NRD Number: 298741. SEC File Number: 801-113724. This record reflects the most recent information reported by the firm on Form ADV filed March 14, 2025. The information below is extracted directly from the firm's most recent ADV filing. Alpine verification note: ",
      after: ". Alpine ODD team confirmed registration status via direct IAPD query on January 6, 2026. The firm's CRD record shows no reportable disciplinary events, regulatory actions, civil proceedings, or criminal matters involving any principal, control person, or supervised person. The most recent SEC examination was conducted in October 2023 and resulted in no deficiency findings. No pending examinations or investigations were identified as of the date of this review. Firm has been registered continuously since April 2018 with no lapses in registration status.",
      pageLabel: "IAPD Record · Page 1 of 3",
    };
    // MID position — disciplinary history
    if (q.includes("disciplinary") || q.includes("no action") || q.includes("no finding") || q.includes("clean")) return {
      section: "Disciplinary History",
      before: "This section of the IAPD record discloses all reportable disciplinary events, regulatory actions, civil proceedings, and criminal matters on file for Ridgeline Capital Partners, LLC and its associated principals. Information in this section is sourced from the firm's Form ADV Part 1A, Item 11 disclosures and from records maintained by the Financial Industry Regulatory Authority (FINRA), the U.S. Securities and Exchange Commission, and applicable state securities regulators. Disciplinary disclosures are required under Rule 206(4)-4 of the Investment Advisers Act of 1940 and must be updated promptly upon the occurrence of any reportable event. Failure to disclose reportable events constitutes a violation of the antifraud provisions of the federal securities laws. Disciplinary Event Summary for Ridgeline Capital Partners, LLC (CRD# 298741): ",
      after: ". All eleven investment professionals and principals associated with this firm have been individually screened via FINRA BrokerCheck and the SEC's IAPD database. No reportable events identified for any associated person. The firm's Chief Compliance Officer, Linda Wu, JD, has confirmed in writing that all required disclosures have been made and that no events reportable under Form ADV, Item 11 have occurred since the firm's registration date of April 14, 2018.",
      pageLabel: "IAPD Record · Page 2 of 3",
    };
    // LATE position — key personnel
    return {
      section: "Key Personnel — Principal and Supervised Persons",
      before: "The following individuals are identified as principals, control persons, and supervised persons of Ridgeline Capital Partners, LLC as reported on Form ADV, Schedule A and Schedule B. Each individual listed below has been screened via FINRA BrokerCheck, the SEC IAPD database, and publicly available court records databases. Individual CRD records are available at www.adviserinfo.sec.gov. David Chen, CFA — Managing Member & Portfolio Manager, CRD# 4819247, SEC Registration: Investment Adviser Representative, no reportable disciplinary events. Linda Wu, JD — Chief Compliance Officer & General Counsel, CRD# 5203881, no reportable disciplinary events. Robert Ng, CPA — Chief Financial Officer, CRD# 5401923, no reportable disciplinary events. Alpine verification: ",
      after: ". Alpine confirmed all key personnel registrations and CRD records on January 6, 2026. No discrepancies were found between the firm's disclosed personnel on Form ADV Schedule A and the individuals identified during the on-site visit and management interview. Personal trading records for all investment professionals are maintained by the CCO pursuant to Rule 204A-1. Alpine requested and reviewed a sample of personal trading records for Q3 2025 and found no violations of the Code of Ethics.",
      pageLabel: "IAPD Record · Page 3 of 3",
    };
  }

  // LATE position
  return {
    section: "Document Reference — Alpine Due Diligence File",
    before: "The following passage has been extracted from the referenced source document maintained in Alpine Asset Management's operational due diligence file for Ridgeline Capital Partners. This document has been provided by the Manager or its authorized representatives and reflects information as of the date stated on the document cover. Alpine has reviewed this document in connection with its ongoing ODD program but has not independently verified all factual representations contained herein except as specifically noted in the accompanying ODD report. This document is maintained as part of a complete due diligence file that includes, among other materials, fund offering documents, audited financial statements, regulatory filings, service provider contracts, and prior ODD correspondence. The specific passage cited in the ODD analysis states: ",
    after: ". Investors and Alpine personnel are reminded that this document is proprietary and confidential. It may not be reproduced, redistributed, or disclosed to third parties without the prior written consent of Ridgeline Capital Partners. Alpine's use of this document is governed by the confidentiality provisions of the applicable non-disclosure agreement between Alpine and Ridgeline Capital Partners dated March 2025. Please refer to the complete source document for full context, all defined terms, and applicable disclaimers and limitations.",
    pageLabel: "Page 1",
  };
}

// ── RefDot ────────────────────────────────────────────────────────────────────

export function RefDot({ source, quote, context: _context, color }: RefDotProps) {
  const [panel, setPanel] = useState<"left" | "right" | null>(null);
  const dotRef = useRef<HTMLSpanElement>(null);

  const meta = SOURCE_META[source] || { label: source, type: "Source" };

  const handleClick = () => {
    if (panel !== null) {
      setPanel(null);
      return;
    }
    if (dotRef.current) {
      const rect = dotRef.current.getBoundingClientRect();
      const side = rect.left < window.innerWidth / 2 ? "right" : "left";
      setPanel(side);
    }
  };

  useEffect(() => {
    if (!panel) return;
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setPanel(null);
    }
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [panel]);

  const filename = meta.filename ?? "";
  const label = meta.label ?? source;
  const docMeta = buildDocMeta(filename, label);
  const { before, after, section, pageLabel } = buildPassage(quote, filename);

  const panelWidth = "min(540px, 44vw)";

  return (
    <>
      <span
        ref={dotRef}
        onClick={handleClick}
        className={`inline-block w-[7px] h-[7px] rounded-full ${DOT_COLORS[color]} ml-1 align-middle cursor-pointer hover:ring-2 hover:ring-${color}-400/30 transition-all`}
        title={`Source: ${label}`}
      />

      {panel !== null && (
        <>
          <style>{`
            @keyframes slideInRight {
              from { transform: translateX(100%); }
              to   { transform: translateX(0); }
            }
            @keyframes slideInLeft {
              from { transform: translateX(-100%); }
              to   { transform: translateX(0); }
            }
            @keyframes popoverIn {
              from { opacity: 0; transform: scale(0.96); }
              to   { opacity: 1; transform: scale(1); }
            }
          `}</style>

          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[299] bg-black/40"
            onClick={() => setPanel(null)}
          />

          {/* Panel */}
          <div
            className="fixed top-0 bottom-0 z-[300] flex flex-col"
            style={{
              width: panelWidth,
              ...(panel === "right"
                ? { right: 0, borderLeft: "1px solid rgba(255,255,255,0.08)", boxShadow: "-8px 0 40px rgba(0,0,0,0.6)", animation: "slideInRight 0.2s ease-out" }
                : { left: 0, borderRight: "1px solid rgba(255,255,255,0.08)", boxShadow: "8px 0 40px rgba(0,0,0,0.6)", animation: "slideInLeft 0.2s ease-out" }),
              background: "#0f1117",
            }}
          >
            {/* Panel header */}
            <div style={{ background: "#161820", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "12px 18px", flexShrink: 0 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" />
                  </svg>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#e5e7eb", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{docMeta.title}</div>
                    <div style={{ fontSize: 10, color: "#6b7280", marginTop: 1 }}>{docMeta.subtitle}</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                  <span style={{ fontSize: 9, fontWeight: 600, color: "#9ca3af", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 4, padding: "2px 7px", letterSpacing: "0.05em" }}>{docMeta.badge.toUpperCase()}</span>
                  <button onClick={() => setPanel(null)} style={{ color: "#6b7280", fontSize: 18, lineHeight: 1, padding: "0 4px", background: "none", border: "none", cursor: "pointer" }}>&times;</button>
                </div>
              </div>
            </div>

            {/* Scrollable body */}
            <div style={{ flex: 1, overflowY: "auto", padding: "24px 32px" }}>

              {/* Document page simulation */}
              <div style={{ background: "#ffffff", borderRadius: 6, boxShadow: "0 4px 24px rgba(0,0,0,0.5)", overflow: "hidden", fontFamily: "Georgia, 'Times New Roman', serif" }}>

                {/* Page header bar */}
                {filename === "iapd_record" ? (
                  <div style={{ background: "#1a3a6e", padding: "10px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 9, fontWeight: 700, color: "#93c5fd", letterSpacing: "0.12em" }}>U.S. SECURITIES AND EXCHANGE COMMISSION — IAPD</span>
                    <span style={{ fontSize: 9, color: "#60a5fa", fontWeight: 700, letterSpacing: "0.08em", border: "1px solid #60a5fa", padding: "1px 6px", borderRadius: 2 }}>PUBLIC RECORD</span>
                  </div>
                ) : filename === "admin_verification_record" ? (
                  <div style={{ background: "#1a4a3a", padding: "10px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 9, fontWeight: 700, color: "#6ee7b7", letterSpacing: "0.12em" }}>CITCO FUND SERVICES — ADMINISTRATOR VERIFICATION</span>
                    <span style={{ fontSize: 9, color: "#34d399", fontWeight: 700, letterSpacing: "0.08em", border: "1px solid #34d399", padding: "1px 6px", borderRadius: 2 }}>CONFIDENTIAL</span>
                  </div>
                ) : filename === "alpine_analysis_record" ? (
                  <div style={{ background: "#2d1a5e", padding: "10px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 9, fontWeight: 700, color: "#c4b5fd", letterSpacing: "0.12em" }}>ALPINE DUE DILIGENCE — INTERNAL ANALYSIS</span>
                    <span style={{ fontSize: 9, color: "#a78bfa", fontWeight: 700, letterSpacing: "0.08em", border: "1px solid #a78bfa", padding: "1px 6px", borderRadius: 2 }}>INTERNAL</span>
                  </div>
                ) : filename === "manager_call_record" ? (
                  <div style={{ background: "#3a2a0a", padding: "10px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 9, fontWeight: 700, color: "#fcd34d", letterSpacing: "0.12em" }}>MANAGER DUE DILIGENCE CALL — INTERVIEW NOTES</span>
                    <span style={{ fontSize: 9, color: "#fbbf24", fontWeight: 700, letterSpacing: "0.08em", border: "1px solid #fbbf24", padding: "1px 6px", borderRadius: 2 }}>CONFIDENTIAL</span>
                  </div>
                ) : filename === "pentest_jan2026_record" ? (
                  <div style={{ background: "#1a2a1a", padding: "10px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 9, fontWeight: 700, color: "#86efac", letterSpacing: "0.12em" }}>KROLL CYBER RISK — PENETRATION TEST REPORT</span>
                    <span style={{ fontSize: 9, color: "#ef4444", fontWeight: 700, letterSpacing: "0.08em", border: "1px solid #ef4444", padding: "1px 6px", borderRadius: 2 }}>CONFIDENTIAL</span>
                  </div>
                ) : (
                  <div style={{ background: "#1e3a5f", padding: "10px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 9, fontWeight: 700, color: "#93c5fd", letterSpacing: "0.12em" }}>ALPINE x RIDGELINE CAPITAL PARTNERS</span>
                    <span style={{ fontSize: 9, color: "#ef4444", fontWeight: 700, letterSpacing: "0.08em", border: "1px solid #ef4444", padding: "1px 6px", borderRadius: 2 }}>CONFIDENTIAL</span>
                  </div>
                )}

                {/* Page content */}
                <div style={{ padding: "28px 0 32px", display: "flex" }}>

                  {/* Left margin — annotation area */}
                  <div style={{ width: 40, flexShrink: 0, paddingTop: 4, display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ width: 3, background: "#f59e0b", borderRadius: 2, alignSelf: "stretch", marginTop: 68, opacity: 0.85 }} />
                  </div>

                  {/* Main text column */}
                  <div style={{ flex: 1, paddingRight: 32 }}>

                    {/* Document title block */}
                    <div style={{ borderBottom: "2px solid #1e3a5f", paddingBottom: 12, marginBottom: 20 }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#111827", lineHeight: 1.3 }}>{docMeta.title}</div>
                      <div style={{ fontSize: 10.5, color: "#6b7280", marginTop: 3 }}>{docMeta.subtitle} &nbsp;·&nbsp; {docMeta.date}</div>
                    </div>

                    {/* Section heading */}
                    <div style={{ fontSize: 9.5, fontWeight: 700, color: "#1e3a5f", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 14, paddingBottom: 6, borderBottom: "1px solid #e5e7eb" }}>{section}</div>

                    {/* Paragraph with highlighted quote */}
                    <p style={{ fontSize: 12, lineHeight: 1.9, color: "#1f2937", margin: 0, textAlign: "justify" }}>
                      {before}<mark style={{
                        background: "#ffec3d",
                        color: "#111",
                        borderRadius: "1px",
                        padding: "1px 1px",
                        fontWeight: "inherit",
                        fontStyle: "inherit",
                        fontSize: "inherit",
                        WebkitBoxDecorationBreak: "clone",
                        boxDecorationBreak: "clone",
                      }}>{quote}</mark>{after}
                    </p>

                  </div>
                </div>

                {/* Page footer */}
                <div style={{ background: "#f9fafb", borderTop: "1px solid #e5e7eb", padding: "8px 40px 8px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 9, color: "#9ca3af", fontFamily: "sans-serif" }}>{docMeta.subtitle}</span>
                  <span style={{ fontSize: 9, color: "#9ca3af", fontFamily: "sans-serif" }}>{pageLabel}</span>
                </div>
              </div>

              {/* Actions below the page */}
              <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                {filename === "iapd_record" ? (
                  <button
                    onClick={() => window.open("https://www.adviserinfo.sec.gov/firm/summary/298741", "_blank")}
                    style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "9px 16px", fontSize: 11, fontWeight: 500, color: "#60a5fa", background: "rgba(96,165,250,0.08)", border: "1px solid rgba(96,165,250,0.2)", borderRadius: 8, cursor: "pointer", fontFamily: "sans-serif" }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" />
                      <line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" />
                    </svg>
                    Open SEC IAPD
                  </button>
                ) : filename === "admin_verification_record" ? (
                  <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "9px 16px", fontSize: 11, fontWeight: 500, color: "#34d399", background: "rgba(52,211,153,0.06)", border: "1px solid rgba(52,211,153,0.15)", borderRadius: 8, fontFamily: "sans-serif" }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    Citco Verification Confirmed — January 22, 2026
                  </div>
                ) : filename === "alpine_analysis_record" ? (
                  <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "9px 16px", fontSize: 11, fontWeight: 500, color: "#a78bfa", background: "rgba(167,139,250,0.06)", border: "1px solid rgba(167,139,250,0.15)", borderRadius: 8, fontFamily: "sans-serif" }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    Alpine Internal Analysis — Not for Distribution
                  </div>
                ) : filename === "manager_call_record" ? (
                  <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "9px 16px", fontSize: 11, fontWeight: 500, color: "#fbbf24", background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.15)", borderRadius: 8, fontFamily: "sans-serif" }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.22 1.19 2 2 0 012.2 1h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.91 8.4a16 16 0 006.72 6.72l1.46-1.46a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                    </svg>
                    Manager Interview — January 15, 2026
                  </div>
                ) : filename === "pentest_jan2026_record" ? (
                  <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "9px 16px", fontSize: 11, fontWeight: 500, color: "#86efac", background: "rgba(134,239,172,0.06)", border: "1px solid rgba(134,239,172,0.15)", borderRadius: 8, fontFamily: "sans-serif" }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    Kroll Cyber — No Critical Findings · Jan 28, 2026
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => downloadDemoFile(filename)}
                      style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "9px 16px", fontSize: 11, fontWeight: 500, color: "#34d399", background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)", borderRadius: 8, cursor: "pointer", fontFamily: "sans-serif" }}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                      Download PDF
                    </button>
                    <button
                      onClick={() => window.open(`/demo-docs/${filename}`, "_blank")}
                      style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "9px 16px", fontSize: 11, fontWeight: 500, color: "#9ca3af", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, cursor: "pointer", fontFamily: "sans-serif" }}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" />
                        <line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" />
                      </svg>
                      Open Full PDF
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
