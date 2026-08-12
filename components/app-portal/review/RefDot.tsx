"use client";

import { useEffect, useRef, useState } from "react";
import { SOURCE_META } from "@/lib/app-portal/ridgeline-data";
import { AURORA_SOURCE_META } from "@/lib/app-portal/aurora-data";
import { TRELLIS_SOURCE_META } from "@/lib/app-portal/trellis-data";
import { GRANITE_SOURCE_META } from "@/lib/app-portal/granite-data";
import { CORDOVA_SOURCE_META } from "@/lib/app-portal/cordova-data";
import { BLACKPINE_SOURCE_META } from "@/lib/app-portal/blackpine-data";
import { HAVENCREST_SOURCE_META } from "@/lib/app-portal/havencrest-data";
import { RIDGELINE_RESORT_SOURCE_META } from "@/lib/app-portal/ridgeline-resort-data";
import { downloadDemoFile, getDemoFileUrl } from "@/lib/app-portal/demo-downloads";

export interface RefDotProps {
  source: string;
  quote: string;
  context?: string;
  color: "blue" | "emerald" | "amber" | "purple";
  slug?: string;
  /**
   * When set (length ≥ 1), this dot represents multiple sources and the popover
   * lets the reader switch between them. Produced by renderCitations when it
   * merges a run of directly-adjacent [[REF]] tokens. Overrides source/quote.
   */
  sources?: { source: string; quote: string }[];
  /**
   * "prose" = muted single-color dot for inline narrative citations.
   * "table" (default) = source-colored dot for the evidence table.
   */
  variant?: "prose" | "table";
}

// ── Aurora doc metadata ──────────────────────────────────────────────────────
function buildAuroraDocMeta(filename: string, label: string) {
  const f = filename.toLowerCase();
  if (f.includes("ilpa-ddq") || f.includes("ddq"))               return { title: "ILPA DDQ 2.0 — Aurora Capital Management",     subtitle: "Aurora Capital Management, LLC",   date: "April 8, 2026",     badge: "Fund Document" };
  if (f.includes("form-adv") || f.includes("form_adv") || f.includes("adv-era")) return { title: "Form ADV ERA — Annual Filing",   subtitle: "Aurora Capital Management, LLC",   date: "Filed March 26, 2026", badge: "Regulatory Filing" };
  if (f.includes("lpa"))                                          return { title: "Limited Partnership Agreement — Fund IV",     subtitle: "Aurora Ventures IV, L.P.",          date: "August 31, 2025",   badge: "Legal" };
  if (f.includes("ppm"))                                          return { title: "Private Placement Memorandum — Fund IV",     subtitle: "Aurora Ventures IV, L.P.",          date: "August 2025",       badge: "Legal" };
  if (f.includes("compliance-manual") || f.includes("compliance_manual")) return { title: "Compliance Manual + Code of Ethics", subtitle: "Aurora Capital Management, LLC",   date: "January 2026",      badge: "Compliance" };
  if (f.includes("valuation"))                                    return { title: "Valuation Policy",                           subtitle: "Aurora Capital Management, LLC",   date: "Effective 2026",    badge: "Operations" };
  if (f.includes("financials") || f.includes("fy2025"))           return { title: "Aurora Ventures III — Audited Financials FY2025", subtitle: "Aurora Ventures III, L.P.",   date: "Audited Q1 2026",  badge: "Financial" };
  if (f.includes("firm-overview") || f.includes("firm_overview")) return { title: "Aurora Capital Management — Firm Overview", subtitle: "Aurora Capital Management, LLC",   date: "April 2026",        badge: "Marketing" };
  if (f.includes("wisp"))                                         return { title: "Written Information Security Policy (WISP)", subtitle: "Aurora Capital Management, LLC",  date: "November 28, 2025", badge: "Technology" };
  if (f.includes("incident-response") || f.includes("incident_response")) return { title: "Incident Response Plan",            subtitle: "Aurora Capital Management, LLC",   date: "November 28, 2025", badge: "Technology" };
  if (f.includes("bcp"))                                          return { title: "Business Continuity Plan (BCP)",             subtitle: "Aurora Capital Management, LLC",   date: "November 27, 2025", badge: "Operations" };
  if (f.includes("admin-agreement") || f.includes("admin_agreement") || f.includes("meridian")) return { title: "Administration Agreement — Meridian Fund Services", subtitle: "Aurora Ventures IV, L.P.", date: "August 31, 2025", badge: "Operations" };
  if (f.includes("insightsphere"))                                return { title: "InsightSphere Expert Network Engagement",    subtitle: "Aurora Capital Management, LLC",   date: "2026",              badge: "Compliance" };
  if (f.includes("vantage-tech") || f.includes("vantage_tech"))   return { title: "Vantage Tech Partners — IT Services Engagement", subtitle: "Aurora Capital Management, LLC", date: "2026",          badge: "Technology" };
  if (f.includes("sample_vc_aurora") || f.includes("aurora_iv"))  return { title: "Aurora Ventures IV — ODD Report",            subtitle: "Aurora Capital Management, LLC",   date: "April 2026",        badge: "ODD Report" };
  return { title: label, subtitle: "Aurora Capital Management, LLC", date: "2026", badge: "Document" };
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

// ── Aurora passage builder ────────────────────────────────────────────────────
function buildAuroraPassage(quote: string, filename: string, sourceLabel: string): { before: string; after: string; section: string; pageLabel: string } {
  const f = filename.toLowerCase();
  const q = quote.toLowerCase();

  if (f.includes("form-adv") || f.includes("form_adv") || f.includes("adv-era")) {
    if (q.includes("aurora capital management")) return {
      section: "Item 1 — Identifying Information",
      before: "This Form ADV ERA filing is submitted by ",
      after: ", LLC (CRD# 312044, SEC File# 802-128945) pursuant to the Exempt Reporting Adviser regime under Section 203(m) of the Investment Advisers Act of 1940. The Adviser is a Delaware limited liability company with its principal place of business in Los Angeles, California, operating on a fully remote basis. The Adviser was formed on August 17, 2017 and commenced advisory activities in January 2020. Principal owners: Marcus Reeves (40%), Daniel Brenner (40%), Rebecca Stern (20%). This filing reflects information as of March 26, 2026.",
      pageLabel: "Page 1 of 15",
    };
    if (q.includes("aum") || q.includes("981") || q.includes("215") || q.includes("814")) return {
      section: "Item 5 — Information About Your Advisory Business",
      before: "As of December 31, 2025, the Adviser reports regulatory assets under management of ",
      after: " across all advised private fund vehicles, excluding $215.59M of uncalled capital commitments to Aurora Ventures IV, L.P. Prior year regulatory AUM (December 31, 2024): $814.59M. The Adviser does not manage separately managed accounts or wrap programs. All advisory activity is conducted on a discretionary basis for qualified clients as defined under Rule 205-3.",
      pageLabel: "Page 4 of 15",
    };
    if (q.includes("brenner") || q.includes("disciplinary") || q.includes("class action") || q.includes("mythic") || q.includes("lunarpay")) return {
      section: "Item 11 — Disclosure Information",
      before: "Disciplinary Disclosure (§11) — The Adviser reports the following matter regarding an associated person: ",
      after: ". Daniel Brenner, a Managing Member of the Adviser, was named as a defendant in a purported class action filed in December 2024 (related to Mythic Technologies and the LunarPay Crystal Tiger Society NFT promotion). The matter is ongoing. The Adviser represents that the claims are without merit and intends to defend vigorously. Priya Desai, a former Principal of the Adviser, is a co-defendant in the action and departed the Adviser in September 2025. There are no other reportable disciplinary, regulatory, or criminal matters at the firm or principal level.",
      pageLabel: "Page 9 of 15",
    };
    return {
      section: "Item 7.B — Private Fund Reporting",
      before: "The Adviser provides discretionary advisory services solely to private funds: Aurora Ventures III, L.P. (Delaware, formed 2021) and Aurora Ventures IV, L.P. (Delaware, formed August 31, 2025). The General Partner entity for Fund IV is Aurora Ventures IV GP, LLC. ",
      after: ". Fund administrator: Meridian Fund Services, LLC (engaged August 31, 2025). Independent auditor: Grant Baker LLP (expected). The Adviser does not engage an external third-party valuation agent; all portfolio valuations are prepared internally and accepted by the administrator without independent verification.",
      pageLabel: "Page 6 of 15",
    };
  }

  if (f.includes("ilpa-ddq") || f.includes("ddq")) {
    if (q.includes("kevin park") || q.includes("cco") || q.includes("compliance officer")) return {
      section: "§4.2 — Compliance Oversight Structure",
      before: "Compliance Oversight: The Adviser has designated ",
      after: " as acting Chief Compliance Officer in addition to his responsibilities as VP, Finance and Operations. The Adviser engaged Apex Compliance Advisors as an external compliance consultant in Q3 2025 to provide periodic policy review, mock examination support, and ad-hoc compliance advice. Aurora intends to appoint a dedicated CCO as firm AUM scales past $1.0 billion. The acting-CCO designation has been disclosed on Form ADV Part 1A and is monitored by Alpine as a YELLOW item pending a dedicated hire.",
      pageLabel: "Page 12 of 48",
    };
    if (q.includes("meridian") || q.includes("administrator") || q.includes("fund services")) return {
      section: "§5 — Service Providers",
      before: "Fund Administrator: ",
      after: " serves as administrator for Aurora Ventures IV, L.P. pursuant to the Administration Agreement dated August 31, 2025. Meridian uses LedgerCraft Enterprise and Polaris for fund accounting. Meridian performs investor capital account recordkeeping, subscription processing, and quarterly NAV statements. Meridian accepts manager-prepared valuations at quarter-end without independent verification. External valuation agent: not engaged. Independent auditor: Grant Baker LLP (FY2025 audit expected Q2 2026).",
      pageLabel: "Page 18 of 48",
    };
    return {
      section: "§2 — Firm Background and Team",
      before: "Aurora Capital Management, LLC is a Delaware limited liability company formed on August 17, 2017 and headquartered in Los Angeles, California on a fully remote basis. The Adviser's investment team consists of Marcus Reeves (Managing Partner), Daniel Brenner (Managing Partner), and Rebecca Stern (Partner). ",
      after: ". The firm's back office is supported by Kevin Park (VP, Finance and Operations, joined December 2023) and Elena Ruiz (Operating Partner, joined March 2025). The Adviser does not maintain a physical office; principals work remotely and meet quarterly for strategy retreats. Total headcount: 9 FTEs (6 investment, 3 back office / operations).",
      pageLabel: "Page 5 of 48",
    };
  }

  if (f.includes("lpa")) {
    return {
      section: "Article II — Management and Authority",
      before: "Aurora Ventures IV, L.P. is a Delaware limited partnership formed on August 31, 2025. The General Partner is Aurora Ventures IV GP, LLC, a Delaware limited liability company wholly owned by Aurora Capital Management, LLC. The Investment Adviser to the Partnership is Aurora Capital Management, LLC. ",
      after: ". GP Commitment: at least $9.0 million (approximately 3% of expected commitments), with up to one-half satisfied via fee offset rather than cash contribution. The Partnership's term is ten (10) years from the Initial Closing Date, subject to up to two one-year extensions at the General Partner's discretion with LP Advisory Committee consultation.",
      pageLabel: "Page 8 of 34",
    };
  }

  if (f.includes("ppm")) {
    return {
      section: "Section 4 — Management Fees and Carried Interest",
      before: "The General Partner is entitled to a Management Fee equal to 2.0% per annum during the Investment Period of aggregate commitments, stepping down to 2.0% of unreturned invested capital thereafter. Carried Interest is 20% of net profits subject to a European-style waterfall with an 8% preferred return and full GP catch-up. ",
      after: ". No prior carry has been crystallized at the Adviser. Fee offset: 100% of monitoring, transaction, and break-up fees received by the Adviser from portfolio companies are credited against Management Fees. Side letter rights may grant fee reductions or co-investment priority to LPs subscribing $25M or more at the Initial Closing.",
      pageLabel: "Page 14 of 28",
    };
  }

  if (f.includes("compliance-manual") || f.includes("compliance_manual")) {
    return {
      section: "§3 — Compliance Program Administration",
      before: "Aurora Capital Management, LLC has adopted this Compliance Manual pursuant to Rule 206(4)-7 under the Investment Advisers Act of 1940 (notwithstanding the Adviser's ERA status, the firm voluntarily maintains a written compliance program). The Adviser's compliance program is overseen by Kevin Park (acting CCO) with engagement support from Apex Compliance Advisors. ",
      after: ". Annual compliance review is scheduled for the fourth quarter of each calendar year. The most recent review was completed in November 2025. The Adviser maintains a Code of Ethics, personal trading policy, gifts and entertainment policy, political contribution policy, and insider trading policy in accordance with applicable federal securities laws.",
      pageLabel: "Page 6 of 20",
    };
  }

  if (f.includes("valuation")) {
    return {
      section: "Section 2 — Valuation Process and Governance",
      before: "Aurora Capital Management prepares quarterly fair-value estimates for all portfolio investments in accordance with ASC 820 and ILPA reporting guidelines. Each portfolio company is reviewed by the deal sponsor on the Aurora investment team, with valuation recommendations submitted to the Valuation Committee (Reeves, Brenner, Stern, Park). ",
      after: ". The Adviser does not engage a third-party valuation agent. Meridian Fund Services accepts manager-prepared valuations at quarter-end without independent verification procedures. Annual audit by Grant Baker LLP provides the primary external pricing check. Alpine has recommended engagement of an external valuation agent prior to the Fund IV final close.",
      pageLabel: "Page 3 of 7",
    };
  }

  if (f.includes("financials") || f.includes("fy2025")) {
    return {
      section: "Independent Auditor's Report",
      before: "To the Partners of Aurora Ventures III, L.P.: We have audited the accompanying financial statements of Aurora Ventures III, L.P., which comprise the statement of financial position as of December 31, 2024, and the related statements of operations, changes in partners' capital, and cash flows for the year then ended. ",
      after: ". The audit opinion was issued by Grant Baker LLP and is unqualified. The Adviser has represented to Alpine that Grant Baker LLP is expected to perform the FY2025 audit for Aurora Ventures III and the inaugural FY2025 audit for Aurora Ventures IV. The Fund IV audit engagement letter has not yet been signed as of April 2026.",
      pageLabel: "Page 2 of 62",
    };
  }

  if (f.includes("wisp") || f.includes("incident-response") || f.includes("incident_response") || f.includes("bcp")) {
    return {
      section: "Document Overview",
      before: "Aurora Capital Management, LLC adopted this policy effective November 2025 in response to follow-up requests during Alpine's operational due diligence review. ",
      after: ". The policy applies to all employees, contractors, and authorized vendors with access to Aurora information systems. IT services are provided by Vantage Tech Partners under an engagement letter executed January 2026. The Adviser has not yet completed an external penetration test; one is targeted for Q3 2026.",
      pageLabel: "Page 1",
    };
  }

  if (f.includes("admin-agreement") || f.includes("meridian")) {
    return {
      section: "Article 1 — Engagement of Administrator",
      before: "This Administration Agreement is entered into as of August 31, 2025 by and between Aurora Ventures IV, L.P. (the \"Fund\") and Meridian Fund Services, LLC (the \"Administrator\"). The Administrator agrees to provide fund accounting, investor recordkeeping, subscription processing, and quarterly NAV statement services to the Fund. ",
      after: ". The Administrator's scope expressly excludes independent valuation verification; quarterly NAV statements reflect manager-prepared portfolio valuations without independent re-pricing or third-party validation. Administration fees are calculated on a tiered basis based on Fund AUM, with a minimum monthly fee of $4,500.",
      pageLabel: "Page 2 of 11",
    };
  }

  // Generic fallback — Aurora-branded
  return {
    section: "Document Reference — Alpine Due Diligence File",
    before: `The following passage has been extracted from the referenced source (${sourceLabel}) maintained in Alpine Asset Management's operational due diligence file for Aurora Ventures IV, L.P. This document or record reflects information provided by Aurora Capital Management, LLC or obtained from independent registries and third-party verifications as of the date stated. Alpine has reviewed this material in connection with its ongoing ODD program but has not independently verified all factual representations contained herein except as specifically noted in the accompanying ODD report. The specific passage cited in the ODD analysis states: `,
    after: ". Investors and Alpine personnel are reminded that any manager-provided document is proprietary and confidential. It may not be reproduced, redistributed, or disclosed to third parties without the prior written consent of Aurora Capital Management, LLC. Alpine's use of this material is governed by the confidentiality provisions of the applicable non-disclosure agreement between Alpine and Aurora Capital Management dated March 2026. Please refer to the complete source document for full context, all defined terms, and applicable disclaimers and limitations.",
    pageLabel: "Page 1",
  };
}

// ── Trellis doc metadata ──────────────────────────────────────────────────────
function buildTrellisDocMeta(filename: string, label: string) {
  const f = filename.toLowerCase();
  const l = label.toLowerCase();
  if (l.includes("form adv") || f.includes("form-adv") || f.includes("form_adv")) return { title: "Form ADV (ERA) — Part 2A", subtitle: "Trellis Capital Management, LLC", date: "Filed March 22, 2026", badge: "Regulatory Filing" };
  if (l.includes("due diligence") || l.includes("ddq"))                          return { title: "Due Diligence Questionnaire (2026)", subtitle: "Trellis Capital Management, LLC", date: "March 2026", badge: "Fund Document" };
  if (l.includes("limited partnership") || f.includes("lpa"))                     return { title: "Limited Partnership Agreement — Fund IV", subtitle: "Trellis Capital IV, L.P.", date: "Effective March 28, 2026", badge: "Legal" };
  if (l.includes("private placement") || f.includes("ppm"))                       return { title: "Private Placement Memorandum — Fund IV", subtitle: "Trellis Capital IV, L.P.", date: "February 2026", badge: "Legal" };
  if (l.includes("valuation") || f.includes("valuation"))                         return { title: "Valuation Policy", subtitle: "Trellis Capital Management, LLC", date: "Effective 2026", badge: "Operations" };
  if (l.includes("subscription") || f.includes("subscription"))                   return { title: "Subscription Agreement Template — Fund IV", subtitle: "Trellis Capital IV, L.P.", date: "February 2026", badge: "Legal" };
  if (l.includes("delaware"))                                                     return { title: "Delaware Division of Corporations — Entity Verification", subtitle: "Trellis Capital IV, L.P. · Trellis Capital GP IV, LLC", date: "Verified April 2026", badge: "Public Record" };
  if (l.includes("iard") || l.includes("iapd") || l.includes("edgar") || l.includes("sec verification")) return { title: "SEC IAPD / IARD — Exempt Reporting Adviser", subtitle: "Trellis Capital Management, LLC", date: "ERA since March 9, 2019", badge: "SEC Verification" };
  if (l.includes("alpine"))                                                       return { title: "Alpine ODD — Internal Cross-Reference Analysis", subtitle: "Trellis Capital Management, LLC · ODD Review 2026", date: "Prepared April 2026", badge: "Alpine Analysis" };
  if (l.includes("apex"))                                                         return { title: "Apex Fund Services — Administrator Verification Call", subtitle: "Trellis Capital IV, L.P.", date: "Call Date: April 3, 2026", badge: "Third-Party Confirmation" };
  if (l.includes("manager"))                                                      return { title: "Manager Due Diligence — Response", subtitle: "Trellis Capital Management, LLC", date: "2026", badge: "Manager Interview" };
  return { title: label, subtitle: "Trellis Capital Management, LLC", date: "2026", badge: "Document" };
}

// ── Trellis passage builder ───────────────────────────────────────────────────
function buildTrellisPassage(quote: string, filename: string, sourceLabel: string): { before: string; after: string; section: string; pageLabel: string } {
  const f = filename.toLowerCase();
  const q = quote.toLowerCase();
  const l = sourceLabel.toLowerCase();

  // Form ADV (ERA)
  if (l.includes("form adv") || f.includes("form-adv") || f.includes("form_adv")) {
    if (q.includes("san francisco") || q.includes("primary location")) return {
      section: "Item 1 — Identifying Information",
      before: "Trellis Capital Management, LLC is a Delaware limited liability company with its principal place of business located in ",
      after: ". The firm is a pre-seed stage venture capital adviser founded in 2018 by Arjun Mehta and Priya Sharma, who each own 50% of the management company. The firm files as an Exempt Reporting Adviser in reliance on the venture capital adviser exemption under Section 203(l) of the Investment Advisers Act of 1940 and has filed in that capacity since March 9, 2019. The firm does not solicit retail investors; all investors are accredited investors and qualified purchasers investing through the firm's private fund vehicles.",
      pageLabel: "Page 1 of 14",
    };
    if (q.includes("trellis capital management")) return {
      section: "Item 1 — Identifying Information",
      before: "This Form ADV is filed by ",
      after: ", a Delaware limited liability company with its principal place of business in San Francisco, California. The firm is a pre-seed stage venture capital adviser founded in 2018 by Arjun Mehta and Priya Sharma, who each own 50% of the management company and file as an Exempt Reporting Adviser under the venture capital adviser exemption (Section 203(l) of the Investment Advisers Act of 1940) since March 9, 2019.",
      pageLabel: "Page 1 of 14",
    };
    if (q.includes("280") || q.includes("aum") || q.includes("net assets") || q.includes("113.7") || q.includes("24.7")) return {
      section: "Item 5 — Information About Your Advisory Business",
      before: "As of December 31, 2025, the Adviser reports net assets of ",
      after: " under management across its advised private fund vehicles, together with $113.7 million of uncalled capital commitments and co-investment special purpose vehicles holding an aggregate $24.7 million. All advisory activity is conducted on a discretionary basis. The Adviser does not manage separately managed accounts or wrap-fee programs.",
      pageLabel: "Page 4 of 14",
    };
    if (q.includes("priya") || q.includes("mehta") || q.includes("50%") || q.includes("ownership") || q.includes("compliance")) return {
      section: "Schedules A & B — Direct and Indirect Owners",
      before: "The Adviser is owned in equal parts by its two founding Managing Partners: ",
      after: ". Arjun Mehta (Co-Founder, Managing Partner) previously served as a principal at Founder Collective and was earlier associated with Foundation Capital. Priya Sharma (Co-Founder, Managing Partner) holds responsibility for the firm's compliance oversight in addition to her investment responsibilities. There are no outside institutional owners or third-party controlling interests in the management company.",
      pageLabel: "Page 7 of 14",
    };
    return {
      section: "Item 6 — Performance-Based Fees and Side-by-Side Management",
      before: "The Adviser receives a management fee and a performance-based carried interest allocation from the funds it advises. The management fee is 2.0% per annum and carried interest is 20% of net profits, distributed under an American-style (deal-by-deal) waterfall without a preferred return. With respect to the matters described in this Item: ",
      after: ". A management fee offset applies to any directors', monitoring, transaction, or break-up fees received from portfolio companies; the Adviser represents that such fees are not received in practice. The absence of a preferred return is uncommon in private equity but typical in pre-seed venture capital.",
      pageLabel: "Page 5 of 14",
    };
  }

  // DDQ
  if (l.includes("due diligence") || l.includes("ddq")) {
    if (q.includes("apex") || q.includes("administrator")) return {
      section: "Section 5 — Service Providers",
      before: "Fund Administrator: ",
      after: ". Apex Fund Services, LLC has been engaged since Fund I and uses Xero for fund accounting and FundPanel for LP management and reporting. Apex performs capital account recordkeeping, capital call and distribution processing, and periodic NAV statements. Independent auditor: Baker Thompson & Co, a recognized auditor of venture capital funds in the Bay Area, audits the prior funds and certain co-investment SPVs. Banking is transitioning from Pacific Commerce to JP Morgan for Fund IV. Legal counsel: Morrison Cole Ashworth.",
      pageLabel: "Page 18 of 44",
    };
    if (q.includes("sarah collins") || q.includes("operations") || q.includes("back office") || q.includes("headcount") || q.includes("fte") || q.includes("seven")) return {
      section: "Section 2 — Firm Background and Team",
      before: "The firm has a total headcount of seven full-time employees — six investment professionals and one operations professional. ",
      after: ". Sarah Collins (Head of Operations, joined July 2025) focuses on running business operations and supporting the Managing Partners as an executive assistant, rather than serving as a dedicated back office resource for the funds. The investment team consists of Arjun Mehta and Priya Sharma (Co-Founders, Managing Partners), Kevin Chen (Principal), Rachel Winters (Associate), Ryan Mitchell (Analyst), and Vikram Nair (Chief Portfolio Officer, departure planned Summer 2026). Raj Patel has been retained as fractional CFO and is expected to focus on Apex oversight beginning Summer 2026.",
      pageLabel: "Page 5 of 44",
    };
    if (q.includes("priya") || q.includes("compliance") || q.includes("summit") || q.includes("personal trading")) return {
      section: "Section 4 — Compliance and Regulatory",
      before: "The firm files as an Exempt Reporting Adviser and maintains a compliance binder containing the required ERA policies, including pay-to-play, insider trading, and anti-money laundering policies. With respect to compliance oversight and program administration: ",
      after: ". Priya Sharma (Co-Founder, Managing Partner) is responsible for compliance oversight in addition to her investment responsibilities. Compliance consultant usage has been limited to engaging Summit Advisory for annual Form ADV preparation. There is no initial attestation or annual recertification of compliance policies required from staff, no annual compliance training program, and no written personal trading policy.",
      pageLabel: "Page 12 of 44",
    };
    return {
      section: "Section 3 — Fund Terms and Structure",
      before: "Fund IV is being raised with an approximately $125 million initial close, a $175 million target, and a $200 million hard cap. The management fee is 2.0% and carried interest is 20% under an American-style waterfall with no preferred return. With respect to the specific terms applicable to this Fund: ",
      after: ". The General Partner commits approximately 1% of total commitments (approximately $2.77 million), contributed in cash and invested pari passu with Limited Partners, free of management fees. Carried interest vests over four years for all investment staff.",
      pageLabel: "Page 9 of 44",
    };
  }

  // LPA / PPM
  if (l.includes("limited partnership") || l.includes("private placement") || f.includes("lpa") || f.includes("ppm")) {
    if (q.includes("delaware") || q.includes("march 28") || q.includes("gp iv") || q.includes("general partner")) return {
      section: "Section 1 — Organization and Formation",
      before: "Trellis Capital IV, L.P. (the \"Fund\") is organized as a ",
      after: " and was formed on March 28, 2026 pursuant to a Certificate of Limited Partnership filed with the Delaware Secretary of State. Trellis Capital GP IV, LLC, a Delaware limited liability company, serves as the sole General Partner. Trellis Capital Management, LLC serves as the investment manager. Both entities have been confirmed against the Delaware Division of Corporations register.",
      pageLabel: "Page 4 of 62",
    };
    if (q.includes("key person") || q.includes("succession") || q.includes("managing partner")) return {
      section: "Section 12 — Key Person Provision",
      before: "The Fund's key person provision is intended to ensure the continued involvement of the firm's Managing Partners in the investment process. ",
      after: ". The key person event would be triggered only if both Arjun Mehta and Priya Sharma fail to devote sufficient time and attention to the Fund; the Managing Partners could assume each other's responsibilities in a single-principal event. No formal succession plan is documented and key person life insurance is not maintained.",
      pageLabel: "Page 31 of 62",
    };
    return {
      section: "Section 7 — Management Fee and Carried Interest",
      before: "The General Partner is entitled to a management fee of 2.0% per annum and a carried interest allocation of 20% of net profits. Distributions follow an American-style (deal-by-deal) waterfall without a preferred return or hurdle. With respect to the Fund's economic terms: ",
      after: ". A management fee offset applies to any directors', consulting, monitoring, transaction, or break-up fees received from portfolio companies, though the Manager represents that such fees are not received in practice. The American waterfall and absence of a preferred return are uncommon in private equity but typical in pre-seed venture capital, where meaningful hurdles would rarely trigger.",
      pageLabel: "Page 18 of 62",
    };
  }

  // Valuation Policy
  if (l.includes("valuation") || f.includes("valuation")) {
    return {
      section: "Section 2 — Valuation Process and Governance",
      before: "Trellis Capital Management prepares fair-value estimates for all portfolio investments in accordance with ASC 820 and applicable venture capital valuation guidelines. Early-stage positions are generally held at cost or the most recent priced financing round until a subsequent observable event. With respect to the firm's valuation process: ",
      after: ". The Manager does not engage a dedicated third-party valuation agent; the Administrator, Apex Fund Services, prepares the books and records, and the annual audit by Baker Thompson & Co provides the primary external pricing check. Alpine has noted the absence of independent valuation verification as an area for enhancement.",
      pageLabel: "Page 4 of 12",
    };
  }

  // Subscription Agreement
  if (l.includes("subscription") || f.includes("subscription")) {
    return {
      section: "Subscription Agreement — Investor Terms",
      before: "This Subscription Agreement sets forth the terms pursuant to which an investor commits capital to Trellis Capital IV, L.P. The investor represents that it is an accredited investor and qualified purchaser. With respect to the specific terms applicable to this investor: ",
      after: ". The General Partner may, in its discretion, enter into side letter arrangements with Limited Partners, including with respect to fees, co-investment priority, and reporting. Capital is drawn down over the Fund's investment period pursuant to capital call notices issued by the Administrator on behalf of the Manager.",
      pageLabel: "Page 2 of 22",
    };
  }

  // Delaware register
  if (l.includes("delaware")) {
    return {
      section: "Delaware Division of Corporations — Entity Verification",
      before: "Alpine performed a direct check against the Delaware Division of Corporations register to confirm the existence and good standing of the Fund and its General Partner entity. The register reflects the following: ",
      after: ". Trellis Capital IV, L.P. (Delaware limited partnership, formed March 28, 2026) and Trellis Capital GP IV, LLC (Delaware limited liability company) were both confirmed on the register. No discrepancies were identified between the entity names disclosed by the Manager and the registered entities.",
      pageLabel: "Delaware Register · Page 1",
    };
  }

  // IARD / IAPD / SEC
  if (l.includes("iard") || l.includes("iapd") || l.includes("edgar") || l.includes("sec")) {
    return {
      section: "SEC IAPD / IARD — Exempt Reporting Adviser Record",
      before: "Investment Adviser Public Disclosure record for Trellis Capital Management, LLC. The firm is reported as an Exempt Reporting Adviser relying on the venture capital adviser exemption under Section 203(l) of the Investment Advisers Act of 1940, and has filed in that capacity since March 9, 2019. The record reflects: ",
      after: ". The firm's record shows no reportable disciplinary events, regulatory actions, or criminal matters for the firm or its principals. Alpine confirmed ERA status via direct IAPD query during the ODD review. As an ERA, the firm is not subject to routine SEC examination but remains subject to the anti-fraud and pay-to-play provisions of the Advisers Act.",
      pageLabel: "IAPD Record · Page 1",
    };
  }

  // Apex verification call
  if (l.includes("apex")) {
    return {
      section: "Apex Fund Services — Administrator Verification Call",
      before: "Alpine conducted a verification call with Apex Fund Services, LLC on April 3, 2026, independent of the Manager, to corroborate the Fund's operational arrangements. Apex confirmed the following: ",
      after: ". Apex confirmed its engagement as administrator since Fund I, its use of Xero and FundPanel, and the key service provider relationships including Baker Thompson & Co (auditor) and the banking transition from Pacific Commerce to JP Morgan. Apex reported no investor reporting errors across the prior funds and described wire authorization and cash control procedures without prompting from the Manager.",
      pageLabel: "Apex Verification · Page 1",
    };
  }

  // Alpine internal analysis
  if (l.includes("alpine")) {
    return {
      section: "Alpine ODD — Internal Cross-Reference Analysis",
      before: "Alpine Due Diligence — Internal Cross-Reference Analysis. ODD Engagement: Trellis Capital Management, LLC. This note summarizes Alpine's analysis of the documents submitted, the management responses, and the third-party verifications obtained during the review. The following finding was identified: ",
      after: ". Two areas were elevated to higher-severity observations: (1) an investment professional (Priya Sharma, Co-Founder) holding compliance oversight, which Alpine has flagged as a required action before close; and (2) the absence of an internal back office resource, with the sole operations professional functioning as an executive assistant. These are partially mitigated by the planned fractional CFO engagement and Head of Finance hire.",
      pageLabel: "Alpine Analysis · Page 1",
    };
  }

  // Manager response / interview
  if (l.includes("manager")) {
    return {
      section: "Manager Due Diligence — Response",
      before: "The following response was provided by Trellis Capital Management in connection with Alpine's operational due diligence review: ",
      after: ". Alpine reviewed the response against the DDQ, Form ADV, and third-party verifications, and incorporated it into the relevant section of the ODD report. The Manager was responsive, granted full access during the review, and voluntarily disclosed back office and cybersecurity limitations.",
      pageLabel: "Manager Response · Page 1",
    };
  }

  // Generic Trellis fallback
  return {
    section: "Document Reference — Alpine Due Diligence File",
    before: `The following passage has been extracted from the referenced source (${sourceLabel}) maintained in Alpine's operational due diligence file for Trellis Capital IV, L.P. This material reflects information provided by Trellis Capital Management, LLC or obtained from independent registries and third-party verifications as of the date stated. Alpine has reviewed this material in connection with its ODD program but has not independently verified all factual representations except as specifically noted in the accompanying ODD report. The specific passage cited in the ODD analysis states: `,
    after: ". Investors and Alpine personnel are reminded that any manager-provided document is proprietary and confidential and may not be reproduced or disclosed to third parties without the prior written consent of Trellis Capital Management, LLC. Please refer to the complete source document for full context, all defined terms, and applicable disclaimers.",
    pageLabel: "Page 1",
  };
}

// ── Granite doc metadata ──────────────────────────────────────────────────────
function buildGraniteDocMeta(filename: string, label: string) {
  const f = filename.toLowerCase();
  const l = label.toLowerCase();
  if (l.includes("odd report") || f.includes("sample_credit_granite_vii"))                          return { title: "Granite VII Credit Partners — ODD Report", subtitle: "Granite Capital Management, LLC · ODD Review 2026", date: "April 2026", badge: "Alpine Analysis" };
  if (l.includes("form adv") || f.includes("form-adv") || f.includes("form_adv"))                    return { title: "Form ADV — Parts 1 & 2A", subtitle: "Granite Capital Management, LLC", date: "Filed March 30, 2026", badge: "Regulatory Filing" };
  if (l.includes("due diligence") || l.includes("ddq"))                                              return { title: "Due Diligence Questionnaire (2026)", subtitle: "Granite Capital Management, LLC", date: "2026", badge: "Fund Document" };
  if (l.includes("limited partnership") || f.includes("lpa") || f.includes("_lpa"))                  return { title: "Limited Partnership Agreement — Fund VII", subtitle: "Granite VII Credit Partners, L.P.", date: "Effective 2025", badge: "Legal" };
  if (l.includes("private placement") || f.includes("ppm"))                                          return { title: "Private Placement Memorandum — Fund VII", subtitle: "Granite VII Credit Partners, L.P.", date: "2025", badge: "Legal" };
  if (l.includes("valuation"))                                                                       return { title: "Valuation Policy", subtitle: "Granite Capital Management, LLC", date: "Revised January 2026", badge: "Operations" };
  if (l.includes("code of ethics"))                                                                  return { title: "Code of Ethics", subtitle: "Granite Capital Management, LLC", date: "Revised January 2026", badge: "Compliance" };
  if (l.includes("information security") || l.includes("wisp"))                                      return { title: "Written Information Security Program (2026)", subtitle: "Granite Capital Management, LLC", date: "2026", badge: "Compliance" };
  if (l.includes("soc 2") || f.includes("soc"))                                                      return { title: "SOC 2 Type II Report — FY2025", subtitle: "Granite Capital Management, LLC · Schneider Downs", date: "Period ending December 31, 2025", badge: "Third-Party Audit" };
  if (l.includes("administration agreement") || (l.includes("admin") && l.includes("agreement")))   return { title: "Administration Agreement — State Street", subtitle: "Granite VII Credit Partners, L.P.", date: "In effect since 2014", badge: "Operations" };
  if (l.includes("state street") || (l.includes("admin") && l.includes("confirmation")))            return { title: "State Street — Administrator Verification Confirmation", subtitle: "Granite VII Credit Partners, L.P.", date: "Confirmed April 2026", badge: "Third-Party Confirmation" };
  if (l.includes("pwc") || l.includes("audit"))                                                      return { title: "PwC — Audit Confirmation", subtitle: "Granite VII Credit Partners, L.P.", date: "FY2024 · Confirmed 2026", badge: "Third-Party Confirmation" };
  if (l.includes("insurance"))                                                                       return { title: "Cyber Liability Insurance Certificate", subtitle: "Granite Capital Management, LLC", date: "Policy Year 2026", badge: "Financial" };
  if (l.includes("investor letter") || l.includes("q4 2025"))                                        return { title: "Q4 2025 Investor Letter", subtitle: "Granite VII Credit Partners, L.P.", date: "Q4 2025", badge: "Investor Communication" };
  if (l.includes("edgar") || l.includes("iard") || l.includes("iapd") || l.includes("sec"))         return { title: "SEC EDGAR / IAPD — Registered Investment Adviser", subtitle: "Granite Capital Management, LLC", date: "Registered since 2012 (IARD/CRD 152384)", badge: "SEC Verification" };
  if (l.includes("delaware"))                                                                        return { title: "Delaware Division of Corporations — Entity Verification", subtitle: "Granite VII Credit Partners, L.P. · Granite Capital Management, LLC", date: "Verified April 2026", badge: "Public Record" };
  return { title: label, subtitle: "Granite Capital Management, LLC", date: "2026", badge: "Document" };
}

// ── Granite passage builder ───────────────────────────────────────────────────
function buildGranitePassage(quote: string, filename: string, sourceLabel: string): { before: string; after: string; section: string; pageLabel: string } {
  const f = filename.toLowerCase();
  const q = quote.toLowerCase();
  const l = sourceLabel.toLowerCase();

  // Form ADV (Registered Investment Adviser)
  if (l.includes("form adv") || f.includes("form-adv") || f.includes("form_adv")) {
    if (q.includes("new york") || q.includes("charlotte") || q.includes("chicago") || q.includes("primary location") || q.includes("hq")) return {
      section: "Item 1 — Identifying Information",
      before: "Granite Capital Management, LLC is a Delaware limited liability company with its principal place of business located in ",
      after: ". The firm is an institutional middle-market direct lender founded in 2009 by Stephen Halloway (Chief Executive Officer) and Margaret Liu (Chief Investment Officer), both formerly senior credit professionals at GE Capital. The firm is registered with the U.S. Securities and Exchange Commission as an investment adviser (IARD/CRD 152384), having registered in 2012 as firmwide assets crossed the $100 million threshold. All advisory activity is conducted on a discretionary basis for private fund vehicles whose investors are accredited investors and qualified purchasers.",
      pageLabel: "Page 1 of 18",
    };
    if (q.includes("granite capital management")) return {
      section: "Item 1 — Identifying Information",
      before: "This Form ADV is filed by ",
      after: ", a Delaware limited liability company with its principal place of business in New York, with secondary offices in Charlotte, North Carolina and Chicago, Illinois. The firm is an SEC-registered investment adviser (IARD/CRD 152384), registered since 2012, and serves as investment manager to the Granite VII Credit Partners series of senior direct lending funds.",
      pageLabel: "Page 1 of 18",
    };
    if (q.includes("4.21") || q.includes("aum") || q.includes("net assets") || q.includes("uncalled") || q.includes("1.83")) return {
      section: "Item 5 — Information About Your Advisory Business",
      before: "As of December 31, 2025, the Adviser reports regulatory assets under management of ",
      after: " across the Granite Credit Partners series, two managed account vehicles, and one CLO, together with $1.83 billion of uncalled capital commitments. All advisory activity is conducted on a discretionary basis. The Adviser does not manage wrap-fee programs and does not solicit retail investors.",
      pageLabel: "Page 4 of 18",
    };
    if (q.includes("78%") || q.includes("ownership") || q.includes("laurentide pension") || q.includes("employees")) return {
      section: "Schedules A & B — Direct and Indirect Owners",
      before: "The Adviser is majority owned by its employees, with ownership broadly distributed across 17 partner-level professionals. The reported ownership composition is: ",
      after: ". Laurentide Pension Partners holds its 22% interest as a passive minority investor acquired in 2018, with no voting rights or operational involvement in the management company. There are no other outside institutional owners or third-party controlling interests.",
      pageLabel: "Page 7 of 18",
    };
    if (q.includes("complaint") || q.includes("disciplinary") || q.includes("none") || q.includes("customer")) return {
      section: "Item 11 — Disclosure Information",
      before: "With respect to the disciplinary and customer-complaint history of the Adviser and its principals, the record reflects: ",
      after: ". The firm has had no SEC examinations result in deficiency letters or enforcement actions, and has not been a party to any material litigation in its 15-year history. No reportable disciplinary, regulatory, or criminal matters exist for the firm or its management persons.",
      pageLabel: "Page 11 of 18",
    };
    return {
      section: "Item 5 — Fees and Compensation",
      before: "The Adviser receives a management fee and a performance-based carried interest allocation from the funds it advises. For Granite VII the management fee is 1.50% per annum charged on invested capital during the investment period and on net asset value thereafter, and carried interest is 15% over a 7% preferred return with a 50/50 catch-up, calculated on a whole-of-fund basis. With respect to the matters described in this Item: ",
      after: ". The annual amendment to this Form ADV was filed March 30, 2026. The firm is a member of the Loan Syndications and Trading Association and the Alternative Credit Council.",
      pageLabel: "Page 5 of 18",
    };
  }

  // DDQ
  if (l.includes("due diligence") || l.includes("ddq")) {
    if (q.includes("state street") || q.includes("pwc") || q.includes("jpmorgan") || q.includes("administrator") || q.includes("auditor") || q.includes("agent bank")) return {
      section: "Section 5 — Service Providers",
      before: "Fund Administrator: ",
      after: ". State Street Alternative Investment Services has served as administrator since 2014 and provides books and records, NAV calculation, investor capital activity, AML/KYC, Form PF reporting, and FATCA/CRS compliance. Independent auditor: PricewaterhouseCoopers LLP, engaged since the firm's inception in 2010. Banking and agent-bank services, including the $400 million subscription credit facility, are provided by JPMorgan Chase, N.A. Fund counsel: Schulte Roth & Zabel LLP; transaction counsel: Kirkland & Ellis LLP.",
      pageLabel: "Page 22 of 58",
    };
    if (q.includes("47 fte") || q.includes("headcount") || q.includes("47 ") || q.includes("investment professional") || q.includes("ortiz") || q.includes("walsh") || q.includes("wei chen") || q.includes("halloway") || q.includes("liu")) return {
      section: "Section 2 — Firm Background and Team",
      before: "Granite employs a total headcount of ",
      after: ". Investment professionals have an average of 14 years of credit experience. The senior team includes Stephen Halloway (CEO) and Margaret Liu (CIO), both co-founders formerly of GE Capital, alongside Daniel Ortiz (Head of Originations, joined 2023 from Antares Capital), Priya Walsh (Head of Credit Risk, joined 2024 from Golub Capital), and Wei Chen (Chief Compliance Officer, joined 2025 from Sixth Street). All employees are subject to deferred carried interest vesting over five years.",
      pageLabel: "Page 5 of 58",
    };
    if (q.includes("succession") || q.includes("key person insurance") || q.includes("25m") || q.includes("background check") || q.includes("hireright") || q.includes("deferred")) return {
      section: "Section 2 — Governance and Succession",
      before: "Granite maintains a formal written succession plan filed with its regulator. With respect to the firm's governance, insurance, and personnel controls: ",
      after: ". The plan identifies Margaret Liu as immediate successor to Stephen Halloway, with Daniel Ortiz designated as CIO successor. Key person life insurance of $25 million is in place on each of the five Executive Committee members, and background checks are conducted by HireRight on initial hire with a three-year refresh for partner-level employees.",
      pageLabel: "Page 8 of 58",
    };
    if (q.includes("wei chen") || q.includes("compliance") || q.includes("schulte roth") || q.includes("mock") || q.includes("attestation") || q.includes("pre-clear")) return {
      section: "Section 4 — Compliance and Regulatory",
      before: "The compliance program is led by Wei Chen, who joined as Chief Compliance Officer in March 2025 and reports directly to the Executive Committee with no investment responsibilities. With respect to the firm's compliance program: ",
      after: ". The compliance team comprises four dedicated full-time professionals. Granite engages Schulte Roth & Zabel LLP as outside compliance counsel and performs an annual mock SEC exam each fall, the most recent of which was conducted in November 2025. Annual attestations are completed by all employees.",
      pageLabel: "Page 14 of 58",
    };
    if (q.includes("nav facility") || q.includes("subscription") || q.includes("$400m") || q.includes("400 ") || q.includes("19.7") || q.includes("$185m") || q.includes("leverage") || q.includes("advance rate")) return {
      section: "Section 7 — Investment Operations and Leverage",
      before: "Granite VII utilizes a subscription credit facility to bridge capital calls during deployment. The facility terms and current utilization are as follows: ",
      after: ". The facility is provided by JPMorgan Chase, N.A. and is secured by the uncalled capital commitments of the partnership. Outstanding borrowings as of December 31, 2025 represent 19.7% of committed capital, and use of leverage is reviewed by the LPAC quarterly. The LPA separately permits a NAV-based facility of up to 20% of NAV once the investment period matures; none is currently in place. Granite does not employ asset-level leverage beyond this facility.",
      pageLabel: "Page 31 of 58",
    };
    if (q.includes("default rate") || q.includes("workout") || q.includes("henderson") || q.includes("cliffwater") || q.includes("covenant") || q.includes("concentration") || q.includes("atlas") || q.includes("4.2")) return {
      section: "Section 6 — Portfolio Monitoring and Workout",
      before: "Granite maintains a dedicated workout team and tracks borrower covenants in Black Mountain with automated alerts. With respect to the firm's portfolio controls and credit performance: ",
      after: ". The workout team of four professionals is led by Sarah Henderson (joined 2020 from CarVal). The cumulative default rate across all vintages is 1.3% of invested capital, compared with the 1.8% Cliffwater Direct Lending Index benchmark. As of December 31, 2025, the largest single exposure (Atlas Industrial Holdings) sits at 4.2% of commitments against a 5.0% contractual cap.",
      pageLabel: "Page 27 of 58",
    };
    return {
      section: "Section 3 — Investment Committee and Process",
      before: "The Investment Committee comprises five voting members, and new investments require a supermajority approval. With respect to the Fund's investment governance: ",
      after: ". Priya Walsh, as Head of Credit Risk, holds explicit veto authority over all new investments. Underwriting follows a structured four-stage process culminating in a final IC vote, with mandatory third-party Quality of Earnings reports for all new originations. The committee meets weekly with ad-hoc sessions for time-sensitive opportunities.",
      pageLabel: "Page 17 of 58",
    };
  }

  // LPA / PPM
  if (l.includes("limited partnership") || l.includes("private placement") || f.includes("lpa") || f.includes("ppm")) {
    if (q.includes("delaware") || q.includes("cayman") || q.includes("feeder") || q.includes("vehicle") || q.includes("granite vii credit partners")) return {
      section: "Section 1 — Organization and Formation",
      before: "The Fund is organized as ",
      after: ", with a parallel Cayman feeder, Granite VII Credit Partners (Cayman), Ltd., for non-US and US tax-exempt investors. Granite Capital Management, LLC serves as the investment manager. The Fund invests across senior secured first-lien and unitranche loans to U.S. middle-market sponsor-backed companies with EBITDA of $20 million to $150 million.",
      pageLabel: "Page 4 of 74",
    };
    if (q.includes("strategy") || q.includes("first-lien") || q.includes("unitranche") || q.includes("ebitda") || q.includes("$20m") || q.includes("middle-market")) return {
      section: "Section 2 — Investment Strategy and Limitations",
      before: "The Fund pursues a senior direct lending strategy. The mandate and key portfolio limitations are as follows: ",
      after: ". Maximum single-borrower concentration is contractually limited to 5% of total commitments. The strategy targets U.S. middle-market sponsor-backed companies sourced primarily from established private equity sponsor relationships.",
      pageLabel: "Page 9 of 74",
    };
    if (q.includes("gp commitment") || q.includes("3.0%") || q.includes("$45m") || q.includes("pari passu") || q.includes("removal") || q.includes("66") || q.includes("75%") || q.includes("key person") || q.includes("mfn") || q.includes("most-favored") || q.includes("$50m")) return {
      section: "Section 12 — GP Commitment and LP Protections",
      before: "The Fund includes institutional LP protections alongside a meaningful General Partner commitment. With respect to the specific term cited: ",
      after: ". The GP commitment is funded pari passu with Limited Partners and is not subject to any fee offset or cashless mechanism. LP protections include a most-favored-nation provision for commitments of $50 million or more, a seven-seat LP advisory committee, a 66 2/3% for-cause GP removal threshold, a 75% no-fault removal threshold, and a key person clause triggered if Stephen Halloway, Margaret Liu, or Daniel Ortiz cease to dedicate substantially all of their business time to Granite.",
      pageLabel: "Page 41 of 74",
    };
    if (q.includes("8 year") || q.includes("term") || q.includes("investment period") || q.includes("harvest") || q.includes("extension")) return {
      section: "Section 9 — Term and Investment Period",
      before: "The Fund has an eight-year term, comprising a four-year investment period and a four-year harvesting period. With respect to the Fund's duration: ",
      after: ". Up to two one-year extensions are available subject to LPAC approval. This is consistent with peer funds in the senior direct lending strategy.",
      pageLabel: "Page 28 of 74",
    };
    return {
      section: "Section 7 — Management Fee and Carried Interest",
      before: "The Manager is entitled to a management fee of 1.50% per annum, charged on invested capital during the investment period and on net asset value thereafter, and the General Partner receives a carried interest allocation. With respect to the Fund's economic terms: ",
      after: ". Carried interest is 15% over a 7% preferred return with a 50/50 catch-up, calculated on a whole-of-fund basis rather than deal-by-deal, which protects LPs from clawback risk on late-fund underperformance. A clawback provision applies through the end of the fund term, backed by an escrow of 20% of distributed carry.",
      pageLabel: "Page 18 of 74",
    };
  }

  // Valuation Policy
  if (l.includes("valuation")) {
    if (q.includes("houlihan") || q.includes("third-party") || q.includes("review") || q.includes("semi-annual") || q.includes("watch")) return {
      section: "Section 3 — Third-Party Valuation Review",
      before: "Granite engages an independent valuation firm to review its marks. The scope of that engagement is as follows: ",
      after: ". Houlihan Lokey Valuation Advisors performs an independent valuation review semi-annually on 100% of the portfolio, with quarterly review of any credit placed on the firm's internal watch list. The engagement is structured as an independent review with Houlihan's own valuation conclusions rather than a pure consistency check. Granite serves as the valuation agent of record, which Alpine has flagged as an enhancement opportunity.",
      pageLabel: "Page 6 of 16",
    };
    if (q.includes("committee") || q.includes("non-investment") || q.includes("3 of 5") || q.includes("majority") || q.includes("agent of record") || q.includes("in-house")) return {
      section: "Section 2 — Valuation Committee and Governance",
      before: "The valuation process is governed by a Valuation Committee chaired by Margaret Liu (CIO). With respect to its composition and authority: ",
      after: ". The committee consists of five members — Margaret Liu, Caroline McKenzie (Head of Fund Operations), Wei Chen (CCO), Robert Yates (Head of Portfolio Management), and one rotating external LPAC member — such that non-investment professionals hold a three-of-five majority. Marks are approved by majority vote of the full committee.",
      pageLabel: "Page 4 of 16",
    };
    return {
      section: "Section 1 — Valuation Framework",
      before: "Granite values its loan portfolio quarterly using the ASC 820 fair-value framework. For each quarterly valuation, the Valuation Committee considers borrower performance metrics, industry comparables and market spreads, stressed-credit factors, and the third-party valuation review. With respect to the firm's valuation process: ",
      after: ". Loan existence is independently verified by the administrator, State Street, through direct confirmation of agent-bank loan balances each quarter. This policy was most recently revised in January 2026.",
      pageLabel: "Page 3 of 16",
    };
  }

  // Code of Ethics
  if (l.includes("code of ethics")) {
    return {
      section: "Code of Ethics — Personal Trading",
      before: "The Code of Ethics governs personal securities transactions by all employees of Granite Capital Management. With respect to the specific control cited: ",
      after: ". Pre-clearance is required for all personal securities transactions other than open-end mutual funds, government securities, and certain ETFs. Brokerage statements are collected directly from custodians by the compliance team rather than through employee self-reporting, a 30-day minimum holding period is enforced for all preclearable securities, and employees are prohibited from trading securities held in client portfolios. Annual attestations are completed by all employees.",
      pageLabel: "Page 7 of 24",
    };
  }

  // WISP / Information Security
  if (l.includes("information security") || l.includes("wisp")) {
    return {
      section: "Written Information Security Program — Controls and Resilience",
      before: "Granite maintains a Written Information Security Program (WISP), Incident Response Plan, and Business Continuity Plan, all reviewed annually by Mandiant. With respect to the firm's security and resilience controls: ",
      after: ". The program is overseen by the Director of Information Technology, Robert Sokolov, reporting to the Chief Operating Officer. All systems use single sign-on through Microsoft Entra ID with mandatory multi-factor authentication, endpoint protection via Microsoft Defender and CrowdStrike Falcon, and an annual tabletop exercise simulating both a cyber incident and a physical disruption to the New York headquarters. Granite has experienced no material cybersecurity incidents in the past five years.",
      pageLabel: "Page 5 of 20",
    };
  }

  // SOC 2 Type II Report
  if (l.includes("soc 2") || f.includes("soc")) {
    return {
      section: "SOC 2 Type II — Independent Service Auditor's Report",
      before: "Schneider Downs performed the SOC 2 Type II examination of Granite's controls for the period ending December 31, 2025. The report reflects the following: ",
      after: ". Granite has commissioned annual SOC 2 Type II audits since 2019, and the FY2025 examination resulted in an unqualified opinion. Granite separately engages Mandiant to perform annual external penetration testing; the 2025 test identified three medium-severity findings, all remediated within 45 days. Monthly phishing simulations via KnowBe4 yield a rolling 12-month click rate of 1.4%, below the 3.2% financial services benchmark.",
      pageLabel: "SOC 2 Report · Page 3",
    };
  }

  // Administration Agreement
  if (l.includes("administration agreement") || (l.includes("admin") && l.includes("agreement"))) {
    return {
      section: "Administration Agreement — Scope of Services",
      before: "This Administration Agreement sets forth the services provided by State Street Alternative Investment Services to the Fund. With respect to the scope of the engagement: ",
      after: ". State Street has served as administrator since 2014 and provides books and records, NAV calculation, investor capital activity, AML/KYC, Form PF regulatory reporting, and FATCA/CRS compliance, delivering monthly NAV and quarterly capital statements to investors. Granite's Head of Fund Operations, Caroline McKenzie, conducts an annual on-site visit to State Street's Boston operations center and reviews the SOC 1 Type II report each year.",
      pageLabel: "Page 2 of 34",
    };
  }

  // State Street verification confirmation
  if (l.includes("state street") || (l.includes("admin") && l.includes("confirmation"))) {
    return {
      section: "State Street — Administrator Verification Confirmation",
      before: "Alpine contacted State Street Alternative Investment Services directly, independent of the Manager, to corroborate the Fund's operational arrangements. State Street confirmed the following: ",
      after: ". State Street confirmed its engagement as administrator since 2014, its provision of monthly NAV and quarterly capital statements, and its quarterly agent-bank loan-balance confirmations supporting asset existence. State Street reported no investor reporting errors and described the dual-approval wire authorization process without prompting from the Manager.",
      pageLabel: "State Street Confirmation · Page 1",
    };
  }

  // PwC audit confirmation
  if (l.includes("pwc") || l.includes("audit")) {
    return {
      section: "PwC — Audit Confirmation",
      before: "Alpine contacted PricewaterhouseCoopers LLP directly to confirm its engagement and audit history with the Fund. PwC confirmed the following: ",
      after: ". PwC has served as Granite's fund auditor since the firm's inception in 2010, issues an unqualified audit opinion within 90 days of fiscal year-end annually, and reported no restatements, material weaknesses, or significant deficiencies across the firm's 15-year audit history. The audit fee for FY2024 was $385,000.",
      pageLabel: "PwC Confirmation · Page 1",
    };
  }

  // Cyber liability insurance
  if (l.includes("insurance")) {
    return {
      section: "Cyber Liability Insurance Certificate",
      before: "This certificate evidences the cyber liability coverage maintained by Granite Capital Management, LLC. The policy limits are as follows: ",
      after: ". The coverage applies to the firm's New York headquarters and secondary offices and is maintained alongside the firm's broader resilience program, including its WISP, Incident Response Plan, and Business Continuity Plan. Granite has experienced no material cybersecurity incidents or data breaches in the past five years.",
      pageLabel: "Insurance Certificate · Page 1",
    };
  }

  // Q4 2025 Investor Letter
  if (l.includes("investor letter") || l.includes("q4 2025")) {
    return {
      section: "Q4 2025 Investor Letter",
      before: "This quarterly investor letter for Granite VII Credit Partners, L.P., signed by Margaret Liu (CIO), was delivered within 45 days of quarter-end. The relevant disclosure states: ",
      after: ". Each letter runs approximately 18 to 22 pages and includes portfolio-level performance metrics, top-10 borrower exposures with named-borrower commentary, watch-list credit disclosure, leverage attribution, capital activity, and a market outlook. The firm also hosts an annual investor day each May in New York, attended by approximately 75% of LPs by capital.",
      pageLabel: "Q4 2025 Letter · Page 1",
    };
  }

  // SEC EDGAR / IAPD verification
  if (l.includes("edgar") || l.includes("iard") || l.includes("iapd") || l.includes("sec")) {
    return {
      section: "SEC EDGAR / IAPD — Registered Investment Adviser Record",
      before: "Investment Adviser Public Disclosure record for Granite Capital Management, LLC. The firm is a U.S. Securities and Exchange Commission registered investment adviser (IARD/CRD 152384), registered since 2012 as firmwide AUM crossed the $100 million threshold. The record reflects: ",
      after: ". The firm's record shows no SEC examinations resulting in deficiency letters or enforcement actions, and no reportable disciplinary, regulatory, or criminal matters for the firm or its principals. Alpine confirmed registered-adviser status via direct IAPD query during the ODD review. As a registered adviser, the firm is subject to routine SEC examination and the full compliance obligations of the Investment Advisers Act of 1940.",
      pageLabel: "IAPD Record · Page 1",
    };
  }

  // Delaware register
  if (l.includes("delaware")) {
    return {
      section: "Delaware Division of Corporations — Entity Verification",
      before: "Alpine performed a direct check against the Delaware Division of Corporations register to confirm the existence and good standing of the Manager and Fund entities. The register reflects the following: ",
      after: ". Granite Capital Management, LLC (formed March 14, 2009) and Granite VII Credit Partners, L.P. were both confirmed on the register. No discrepancies were identified between the entity names disclosed by the Manager and the registered entities.",
      pageLabel: "Delaware Register · Page 1",
    };
  }

  // Alpine ODD report / internal analysis
  if (l.includes("odd report") || l.includes("alpine") || f.includes("sample_credit_granite_vii")) {
    return {
      section: "Alpine ODD — Internal Cross-Reference Analysis",
      before: "Alpine Due Diligence — Operational Due Diligence Report. ODD Engagement: Granite Capital Management, LLC · Granite VII Credit Partners, L.P. This report summarizes Alpine's analysis of the documents submitted, the management responses, and the third-party verifications obtained during the review. The following finding was identified: ",
      after: ". The overall engagement is rated GREEN, with two YELLOW chapters (Investment Operations and Valuation) reflecting industry-normal use of a subscription credit facility and an in-house valuation agent of record supported by strong Houlihan Lokey third-party review. Alpine recommends an accept rating subject to post-close monitoring of leverage utilization and Valuation Committee composition.",
      pageLabel: "Alpine Analysis · Page 1",
    };
  }

  // Generic Granite fallback
  return {
    section: "Document Reference — Alpine Due Diligence File",
    before: `The following passage has been extracted from the referenced source (${sourceLabel}) maintained in Alpine's operational due diligence file for Granite VII Credit Partners, L.P. This material reflects information provided by Granite Capital Management, LLC or obtained from independent registries and third-party verifications as of the date stated. Alpine has reviewed this material in connection with its ODD program but has not independently verified all factual representations except as specifically noted in the accompanying ODD report. The specific passage cited in the ODD analysis states: `,
    after: ". Investors and Alpine personnel are reminded that any manager-provided document is proprietary and confidential and may not be reproduced or disclosed to third parties without the prior written consent of Granite Capital Management, LLC. Please refer to the complete source document for full context, all defined terms, and applicable disclaimers.",
    pageLabel: "Page 1",
  };
}
// ── Cordova doc metadata ──────────────────────────────────────────────────────
function buildCordovaDocMeta(filename: string, label: string) {
  const f = filename.toLowerCase();
  const l = label.toLowerCase();
  if (l.includes("odd report") || f.includes("sample_re_cordova_jv"))            return { title: "Cordova JV III — ODD Report", subtitle: "Cordova JV Real Estate Fund III, L.P. · Alpine ODD Review 2026", date: "Prepared April 2026", badge: "ODD Report" };
  if (l.includes("form adv") || f.includes("form-adv") || f.includes("form_adv")) return { title: "Form ADV (ERA) — Part 1 & 2A", subtitle: "Cordova Capital Partners, LLC", date: "ERA annual filing March 2026", badge: "Regulatory Filing" };
  if (l.includes("due diligence") || l.includes("ddq") || f.includes("ddq"))      return { title: "Due Diligence Questionnaire (2026)", subtitle: "Cordova Capital Partners, LLC", date: "2026", badge: "Fund Document" };
  if (l.includes("limited partnership") || f.includes("lpa") || f.includes("jv_agreement")) return { title: "Limited Partnership Agreement — Fund III", subtitle: "Cordova JV Real Estate Fund III, L.P.", date: "Effective 2024", badge: "Legal" };
  if (l.includes("private placement") || f.includes("ppm"))                       return { title: "Private Placement Memorandum — Fund III", subtitle: "Cordova JV Real Estate Fund III, L.P.", date: "2024", badge: "Legal" };
  if (l.includes("valuation"))                                                    return { title: "Valuation Policy", subtitle: "Cordova Capital Partners, LLC", date: "Effective October 2024", badge: "Operations" };
  if (l.includes("code of ethics"))                                               return { title: "Code of Ethics", subtitle: "Cordova Capital Partners, LLC", date: "Effective October 2024", badge: "Compliance" };
  if (l.includes("information security") || l.includes("wisp"))                   return { title: "Written Information Security Program (WISP)", subtitle: "Cordova Capital Partners, LLC", date: "Reviewed 2024", badge: "Compliance" };
  if (l.includes("administration agreement") || l.includes("ss&c") || l.includes("admin")) return { title: "Administration Agreement — SS&C ALPS", subtitle: "Cordova JV Real Estate Fund III, L.P.", date: "Effective 2018", badge: "Service Provider" };
  if (l.includes("audit") || l.includes("kpmg"))                                  return { title: "KPMG LLP — Audit Confirmation", subtitle: "Cordova JV Real Estate Fund III, L.P.", date: "FY2024 Audit", badge: "Third-Party Confirmation" };
  if (l.includes("insurance"))                                                    return { title: "Cyber Liability Insurance Certificate", subtitle: "Cordova Capital Partners, LLC", date: "2026 Policy Year", badge: "Insurance" };
  if (l.includes("investor letter") || f.includes("letter"))                      return { title: "Q4 2025 Investor Letter", subtitle: "Cordova JV Real Estate Fund III, L.P.", date: "Q4 2025", badge: "Investor Communication" };
  if (l.includes("edgar") || l.includes("sec"))                                   return { title: "SEC EDGAR — Exempt Reporting Adviser Filing", subtitle: "Cordova Capital Partners, LLC", date: "ERA since 2016", badge: "SEC Verification" };
  if (l.includes("texas") || l.includes("secretary of state") || l.includes("sos")) return { title: "Texas Secretary of State — Entity Registry", subtitle: "Cordova Capital Partners, LLC", date: "Verified 2026", badge: "Public Record" };
  return { title: label, subtitle: "Cordova Capital Partners, LLC", date: "2026", badge: "Document" };
}

// ── Cordova passage builder ───────────────────────────────────────────────────
function buildCordovaPassage(quote: string, filename: string, sourceLabel: string): { before: string; after: string; section: string; pageLabel: string } {
  const f = filename.toLowerCase();
  const l = sourceLabel.toLowerCase();
  const q = quote.toLowerCase();

  // Form ADV (ERA)
  if (l.includes("form adv") || f.includes("form-adv") || f.includes("form_adv")) {
    if (q.includes("dallas") || q.includes("phoenix") || q.includes("primary location")) return {
      section: "Item 1 — Identifying Information",
      before: "Cordova Capital Partners, LLC is a Texas limited liability company with its principal place of business located in ",
      after: ". The firm is a value-add multifamily real estate sponsor founded in 2014 by Carlos Mendoza, focused on joint-venture equity investments in Sun Belt markets (Texas, Arizona, North Carolina, Florida, and Tennessee). The firm files with the SEC as an Exempt Reporting Adviser in reliance on the private fund adviser exemption under Section 203(m) of the Investment Advisers Act of 1940 and has filed in that capacity since 2016. All investors are accredited investors and qualified purchasers investing through the firm's private fund vehicles.",
      pageLabel: "Page 1 of 16",
    };
    if (q.includes("cordova capital partners")) return {
      section: "Item 1 — Identifying Information",
      before: "This Form ADV is filed by ",
      after: ", a Texas limited liability company with its principal place of business in Dallas, Texas and a secondary office in Phoenix, Arizona. The firm is a value-add multifamily real estate sponsor founded in 2014 by Carlos Mendoza (Managing Principal and Chief Investment Officer) and files with the SEC as an Exempt Reporting Adviser under Section 203(m) of the Investment Advisers Act of 1940.",
      pageLabel: "Page 1 of 16",
    };
    if (q.includes("1.10 billion") || q.includes("aum") || q.includes("net assets") || q.includes("370")) return {
      section: "Item 5 — Information About Your Advisory Business",
      before: "As of December 31, 2025, the Adviser reports firmwide regulatory net assets of ",
      after: " under management across its advised private real estate fund vehicles, together with $370 million of uncalled capital commitments. The firm has acquired 47 multifamily properties totaling 14,200 units across three joint-venture fund vintages. All advisory activity is conducted on a discretionary basis. The Adviser does not manage separately managed accounts or wrap-fee programs.",
      pageLabel: "Page 4 of 16",
    };
    if (q.includes("mendoza") || q.includes("vance") || q.includes("park") || q.includes("60%") || q.includes("ownership") || q.includes("25%") || q.includes("15%")) return {
      section: "Schedules A & B — Direct and Indirect Owners",
      before: "The Adviser is owned by its three principals as follows: ",
      after: ". Carlos Mendoza (Managing Principal and Chief Investment Officer) was formerly Director of Acquisitions at TruAmerica Multifamily and earlier a Senior Associate at Lone Star Funds. Stephanie Vance (Co-Founder, Head of Asset Management) was formerly with Camden Property Trust. Daniel Park (Chief Financial Officer, joined 2017) was formerly with JLL Capital Markets and also serves as Chief Compliance Officer. There are no outside institutional owners or third-party controlling interests in the management company.",
      pageLabel: "Page 7 of 16",
    };
    return {
      section: "Item 5 — Fees and Compensation",
      before: "The Adviser receives a management fee and a carried interest allocation from the funds it advises. The management fee for Fund III is 1.50% per annum and carried interest is 20% of net profits over an 8% preferred return with a 50/50 catch-up, calculated on a deal-by-deal basis subject to a European-style full clawback at fund-end. With respect to the matters described in this Item: ",
      after: ". The General Partner commits 2.0% of total commitments in cash, invested pari passu with Limited Partners and free of any management fee offset. The firm intends to transition to full SEC registration as a Registered Investment Adviser in Q3 2026 as its assets under management scale beyond the private fund adviser exemption threshold.",
      pageLabel: "Page 5 of 16",
    };
  }

  // DDQ
  if (l.includes("due diligence") || l.includes("ddq") || f.includes("ddq")) {
    if (q.includes("ss&c") || q.includes("kpmg") || q.includes("wells fargo") || q.includes("goodwin") || q.includes("administrator") || q.includes("auditor")) return {
      section: "Section 5 — Service Providers",
      before: "Fund Administrator: ",
      after: ". SS&C ALPS Alternative Fund Services has been engaged since 2018 and provides NAV calculation, investor capital activity, AML/KYC, regulatory reporting, and FATCA/CRS compliance. Independent auditor: KPMG LLP, engaged since 2018, delivers its annual audit opinion within 100 days of fiscal year-end. Primary banking is held with Wells Fargo, N.A. at the fund level, with property-level SPV accounts held at regional banks. Legal counsel: Goodwin Procter LLP.",
      pageLabel: "Page 22 of 58",
    };
    if (q.includes("18 fte") || q.includes("headcount") || q.includes("acquisitions") || q.includes("asset management") || q.includes("operating partner")) return {
      section: "Section 2 — Firm Background and Team",
      before: "The firm has a total headcount of ",
      after: ". Cordova employs a joint-venture sponsor model: the firm partners with experienced regional operating partners — typically property management companies with deep local market expertise — to acquire and renovate underperforming Class B and C multifamily assets. Cordova provides equity capital, oversight, and strategic direction while operating partners handle day-to-day property management and on-site renovation execution. Cordova currently maintains active joint ventures with 6 operating partners across three fund vintages.",
      pageLabel: "Page 6 of 58",
    };
    if (q.includes("succession") || q.includes("key person insurance") || q.includes("background") || q.includes("$10m")) return {
      section: "Section 2 — Ownership, Succession and Governance",
      before: "With respect to ownership continuity and governance controls at the management company: ",
      after: ". Carlos Mendoza owns 60% of Cordova and holds both the Managing Principal and Chief Investment Officer roles; no formal written succession plan exists, and succession discussions have been informal among the three principals. Key person life insurance of $10 million is maintained on Carlos Mendoza only — Stephanie Vance and Daniel Park are not covered. Background checks on new hires are performed internally by the Managing Principal rather than by a third-party vendor, and no periodic refresh checks are performed.",
      pageLabel: "Page 9 of 58",
    };
    if (q.includes("daniel park") || q.includes("chief compliance") || q.includes("apex compliance") || q.includes("compliance manual") || q.includes("brokerage") || q.includes("holding period")) return {
      section: "Section 4 — Compliance and Regulatory",
      before: "The firm files as an Exempt Reporting Adviser and engaged Apex Compliance Advisors LLC as outside compliance consultant in Q1 2022. With respect to compliance oversight and program administration: ",
      after: ". Daniel Park serves as Chief Compliance Officer in addition to his Chief Financial Officer responsibilities, which Alpine has flagged as a segregation of duties concern ahead of the planned full RIA registration. Apex performs an annual compliance review (most recently November 2025) and supports regulatory filings and code of ethics enforcement. The current compliance manual is dated October 2024 with a 2026 revision in progress.",
      pageLabel: "Page 14 of 58",
    };
    if (q.includes("vantage") || q.includes("soc 2") || q.includes("penetration") || q.includes("phishing") || q.includes("4.8%") || q.includes("defender") || q.includes("microsoft")) return {
      section: "Section 6 — Technology and Cybersecurity",
      before: "Cordova operates on Microsoft 365 supplemented by Yardi Voyager for property accounting and Juniper Square for investor reporting, with single sign-on through Microsoft Entra ID and mandatory MFA. With respect to the firm's cybersecurity program: ",
      after: ". Cordova engaged Vantage Tech LLC in March 2023 as outsourced IT and cybersecurity provider; its service tier does not include data loss prevention or advanced threat detection. The firm has not commissioned a SOC 2 audit, and a first external penetration test was performed by Bishop Fox in November 2024 with all three medium-severity findings remediated within 60 days. The rolling four-quarter phishing click rate is 4.8%, above the 3.2% financial services benchmark.",
      pageLabel: "Page 26 of 58",
    };
    if (q.includes("ltv") || q.includes("bridge") || q.includes("agency") || q.includes("texas concentration") || q.includes("41%") || q.includes("dallas") || q.includes("houston") || q.includes("investment committee") || q.includes("2 of 3") || q.includes("quality of earnings")) return {
      section: "Section 7 — Investment Operations and Portfolio Controls",
      before: "The Investment Committee comprises three voting members (Carlos Mendoza, Stephanie Vance, and Daniel Park) with approval by majority consent. With respect to portfolio construction and financing: ",
      after: ". Each acquisition is financed with asset-level non-recourse debt at 60–70% loan-to-value, sourced from agency lenders (Fannie Mae, Freddie Mac) for stabilized assets and bridge lenders for value-add transitions, with bridge debt refinanced to agency debt upon stabilization (typically 18–30 months post-acquisition). As of December 31, 2025, aggregate fund-level leverage is 64% LTV and the portfolio shows 41% of NAV across the Dallas and Houston MSAs combined, within the LPA's 35% single-market cap measured at MSA level.",
      pageLabel: "Page 31 of 58",
    };
    if (q.includes("cushman") || q.includes("appraisal") || q.includes("juniper square") || q.includes("quarterly report") || q.includes("investor day") || q.includes("waterfall")) return {
      section: "Section 8 — Valuation and Investor Reporting",
      before: "Cordova values its multifamily portfolio quarterly under the ASC 820 fair-value framework using discounted cash flow, sales comparable, and replacement cost approaches. With respect to independent oversight and investor reporting: ",
      after: ". Cushman & Wakefield provides independent annual appraisals on all properties, with a semi-annual cadence under consideration for Fund III. Quarterly investor reports are delivered within 60 days of quarter-end through Juniper Square, and audited annual financials are delivered within 100 days of fiscal year-end. The carry waterfall is calculated by SS&C through its proprietary system and reviewed by Daniel Park.",
      pageLabel: "Page 38 of 58",
    };
    return {
      section: "Section 3 — Fund Terms and Track Record",
      before: "Cordova JV Real Estate Fund III, L.P. is being raised with a $750 million target and an $850 million hard cap, having raised $520 million through December 2025. With respect to the specific terms and track record applicable to this Fund: ",
      after: ". The firm has raised three joint-venture fund vintages: Cordova JV I (2016, $185 million, fully realized at 18.4% gross IRR / 1.92x MOIC), Cordova JV II (2019, $410 million, approximately 70% realized at 16.1% interim gross IRR), and the current Cordova JV III. The General Partner commits 2.0% of total commitments in cash (approximately $17 million at the hard cap), invested pari passu with Limited Partners and free of any fee offset.",
      pageLabel: "Page 11 of 58",
    };
  }

  // LPA / PPM
  if (l.includes("limited partnership") || l.includes("private placement") || f.includes("lpa") || f.includes("ppm") || f.includes("jv_agreement")) {
    if (q.includes("delaware") || q.includes("cayman") || q.includes("feeder") || q.includes("general partner") || q.includes("fund vehicle")) return {
      section: "Section 1 — Organization and Formation",
      before: "Cordova JV Real Estate Fund III, L.P. (the \"Fund\") is organized as a ",
      after: ", with a Cayman Islands feeder vehicle (Cordova JV III (Cayman), Ltd.) for non-US and US tax-exempt investors. The Fund invests across joint-venture equity positions in value-add multifamily acquisitions in Sun Belt markets. A single-asset concentration cap of 8% of total commitments and a single-market concentration cap of 35% of total commitments apply. Cordova Capital Partners, LLC serves as the investment manager and sponsor.",
      pageLabel: "Page 4 of 74",
    };
    if (q.includes("key person") || q.includes("removal") || q.includes("lpac") || q.includes("most-favored") || q.includes("mfn") || q.includes("$25m") || q.includes("75%") || q.includes("50% lp")) return {
      section: "Section 12 — Limited Partner Protections",
      before: "The Fund affords Limited Partners a suite of governance protections negotiated through ILPA-aligned outside counsel. With respect to LP rights and the key person provision: ",
      after: ". Most-favored-nation rights are available to commitments of $25 million or more; the LPAC has 7 seats; the General Partner may be removed for cause on a 50% LP vote and on a no-fault basis on a 75% LP vote; and the key person clause is triggered if Carlos Mendoza ceases to dedicate substantially all of his time to the Fund. The LPAC meets twice annually and reviews valuation summaries, leverage utilization, and concentration metrics.",
      pageLabel: "Page 33 of 74",
    };
    if (q.includes("8 year") || q.includes("8-year") || q.includes("term") || q.includes("investment period") || q.includes("extension")) return {
      section: "Section 9 — Term and Investment Period",
      before: "The Fund has a total term of ",
      after: " comprising a four-year investment period and a four-year harvesting period, with up to two one-year extensions subject to LPAC approval. This structure is consistent with peer joint-venture value-add multifamily funds. During the investment period the management fee is charged on invested capital; thereafter it is charged on net asset value excluding realized assets.",
      pageLabel: "Page 24 of 74",
    };
    return {
      section: "Section 7 — Management Fee, Carried Interest and GP Commitment",
      before: "The General Partner is entitled to a management fee of 1.50% per annum (on invested capital during the investment period and on net asset value excluding realized assets thereafter) and a carried interest allocation of 20% of net profits over an 8% preferred return with a 50/50 catch-up. With respect to the Fund's economic terms: ",
      after: ". Carried interest is calculated on a deal-by-deal basis subject to a European-style full clawback at fund-end, which substantially mitigates early-distribution exposure. The General Partner commits 2.0% of total commitments in cash (approximately $17 million at the $850 million hard cap), funded pari passu with Limited Partners and free of any management fee offset.",
      pageLabel: "Page 18 of 74",
    };
  }

  // Valuation Policy
  if (l.includes("valuation")) {
    return {
      section: "Section 2 — Valuation Process and Governance",
      before: "Cordova Capital Partners prepares fair-value estimates for all multifamily portfolio investments quarterly in accordance with the ASC 820 framework, applying discounted cash flow (weighted 60–70%), sales comparable, and replacement cost approaches. With respect to the firm's valuation process and governance: ",
      after: ". The Valuation Committee comprises five members — Stephanie Vance (Chair), Carlos Mendoza, Daniel Park, and two non-investment members drawn from Apex Compliance Advisors and SS&C — and approves valuations by majority vote. Cordova serves as the in-house valuation agent of record, with Cushman & Wakefield providing independent annual appraisals as the primary external pricing check. Alpine has noted the annual appraisal cadence and the 2-of-5 non-investment composition as areas for enhancement.",
      pageLabel: "Page 4 of 14",
    };
  }

  // Code of Ethics
  if (l.includes("code of ethics")) {
    return {
      section: "Code of Ethics — Personal Trading and Pre-Clearance",
      before: "Cordova Capital Partners maintains a Code of Ethics governing personal securities transactions by all employees. With respect to pre-clearance and personal trading controls: ",
      after: ". Pre-clearance is required only for securities on the firm's restricted list (currently empty, as the firm does not invest in public securities); quarterly personal trading reports are submitted by all employees through Apex's portal; and brokerage statements are collected via employee self-reporting rather than custodian-direct. There is no minimum holding period and no formal prohibition on trading securities held by the funds — gaps Alpine has recommended closing ahead of full RIA registration.",
      pageLabel: "Page 3 of 11",
    };
  }

  // WISP / Information Security
  if (l.includes("information security") || l.includes("wisp")) {
    return {
      section: "Written Information Security Program — Controls and Resilience",
      before: "Cordova Capital Partners maintains a Written Information Security Program (WISP) alongside an Incident Response Plan and a Business Continuity Plan, most recently reviewed in mid-2024. With respect to the firm's security and resilience controls: ",
      after: ". Infrastructure runs on Microsoft 365 with Microsoft Entra ID single sign-on and mandatory MFA, and Microsoft Defender provides endpoint protection without data loss prevention. Cordova has not yet conducted a formal tabletop exercise of the Business Continuity Plan — an exercise is planned for Q3 2026 — and cyber liability insurance is limited to $5 million per occurrence and $5 million aggregate, which Alpine views as modest for a manager of Cordova's $1.1 billion AUM scale.",
      pageLabel: "Page 2 of 9",
    };
  }

  // Administration Agreement — SS&C
  if (l.includes("administration agreement") || l.includes("ss&c") || l.includes("admin")) {
    return {
      section: "Administration Agreement — SS&C ALPS Alternative Fund Services",
      before: "This Administration Agreement engages SS&C ALPS Alternative Fund Services as fund administrator to Cordova JV Real Estate Fund III, L.P., continuing a relationship in place since 2018. Under the agreement, the Administrator provides the following services: ",
      after: ". The Administrator performs NAV calculation, investor capital activity processing, AML/KYC, regulatory reporting, FATCA/CRS compliance, and carry waterfall calculation through its proprietary system. Daniel Park (CFO) reviews the Administrator's annual SOC 1 Type II report and conducts an annual relationship-manager call. Alpine corroborated the engagement and scope of services directly with SS&C during the review.",
      pageLabel: "Page 1 of 6",
    };
  }

  // Audit Letter — KPMG
  if (l.includes("audit") || l.includes("kpmg")) {
    return {
      section: "KPMG LLP — Audit Confirmation",
      before: "Alpine obtained direct confirmation from KPMG LLP, independent auditor to Cordova JV Real Estate Fund III, L.P. since 2018, in connection with its operational due diligence review. KPMG confirmed the following: ",
      after: ". KPMG delivers its annual audit opinion within 100 days of fiscal year-end; the audit fee for FY2024 was $310,000; and no restatements, material weaknesses, or significant deficiencies have been reported across the engagement. KPMG replaced a regional firm that had audited Cordova JV I. Alpine confirmed the engagement and clean audit history directly with the auditor, independent of the Manager.",
      pageLabel: "Audit Confirmation · Page 1",
    };
  }

  // Insurance Certificate
  if (l.includes("insurance")) {
    return {
      section: "Cyber Liability Insurance Certificate",
      before: "This certificate evidences cyber liability insurance coverage maintained by Cordova Capital Partners, LLC. The policy provides the following limits of liability: ",
      after: ". The limit of $5 million per occurrence and $5 million aggregate is, in Alpine's view, modest relative to institutional benchmarks of $10 million to $25 million typical for managers at Cordova's $1.1 billion AUM scale. Alpine has recommended that the limit be increased to at least $10 million per occurrence by the next renewal.",
      pageLabel: "Insurance Certificate · Page 1",
    };
  }

  // Q4 2025 Investor Letter
  if (l.includes("investor letter") || f.includes("letter")) {
    return {
      section: "Q4 2025 Investor Letter",
      before: "This quarterly investor letter for Cordova JV Real Estate Fund III, L.P. was delivered within 60 days of quarter-end and signed by Carlos Mendoza (Chief Investment Officer). The letter, approximately 16–20 pages including asset-level NOI commentary on all properties, reports the following: ",
      after: ". The letter includes a portfolio-level NAV summary, asset-level NOI commentary, debt summary, capex spend tracking against business plan, and a market outlook. Cordova hosts an annual investor day each spring in Dallas, attended in 2025 by approximately 60% of LPs by capital and including property tours of three Cordova-owned Dallas-metro assets.",
      pageLabel: "Page 1 of 18",
    };
  }

  // SEC EDGAR / ERA filing
  if (l.includes("edgar") || l.includes("sec")) {
    return {
      section: "SEC EDGAR — Exempt Reporting Adviser Record",
      before: "SEC EDGAR record for Cordova Capital Partners, LLC. The firm is reported as an Exempt Reporting Adviser relying on the private fund adviser exemption under Section 203(m) of the Investment Advisers Act of 1940, and has filed in that capacity since 2016. The record reflects: ",
      after: ". The firm's record shows no SEC examinations, regulatory actions, or disciplinary matters for the firm or its principals. Alpine notes that Cordova's current AUM exceeds the $150 million private fund adviser threshold, and the Manager has indicated a transition to full Registered Investment Adviser status is planned for Q3 2026. Alpine confirmed ERA status via direct EDGAR query during the ODD review.",
      pageLabel: "EDGAR Record · Page 1",
    };
  }

  // Texas Secretary of State registry
  if (l.includes("texas") || l.includes("secretary of state") || l.includes("sos")) {
    return {
      section: "Texas Secretary of State — Entity Verification",
      before: "Alpine performed a direct check against the Texas Secretary of State registry to confirm the existence and good standing of the management company. The registry reflects the following: ",
      after: ". Cordova Capital Partners, LLC was confirmed as a Texas limited liability company formed June 11, 2014 and in good standing. No discrepancies were identified between the entity name disclosed by the Manager and the registered entity. Cordova is headquartered in Dallas, Texas with a secondary office in Phoenix, Arizona.",
      pageLabel: "Texas Registry · Page 1",
    };
  }

  // ODD Report (Alpine internal)
  if (l.includes("odd report") || f.includes("sample_re_cordova_jv")) {
    return {
      section: "Cordova JV III — Alpine ODD Report",
      before: "Alpine Due Diligence — Operational Due Diligence Report. ODD Engagement: Cordova Capital Partners, LLC (Cordova JV Real Estate Fund III, L.P.). This report summarizes Alpine's analysis of the documents submitted, the management responses, and the third-party verifications obtained during the review. The following finding was identified: ",
      after: ". The Fund received an overall YELLOW rating with a watchlist recommendation, reflecting emerging-manager governance characteristics across four YELLOW chapters — concentrated ownership in Carlos Mendoza, the combined CFO/CCO role, cybersecurity program maturity, and annual valuation cadence — partially mitigated by a strong realized Sun Belt multifamily track record and a robust operating partner diligence framework.",
      pageLabel: "ODD Report · Page 1",
    };
  }

  // Generic Cordova fallback
  return {
    section: "Document Reference — Alpine Due Diligence File",
    before: `The following passage has been extracted from the referenced source (${sourceLabel}) maintained in Alpine's operational due diligence file for Cordova JV Real Estate Fund III, L.P. This material reflects information provided by Cordova Capital Partners, LLC or obtained from independent registries and third-party verifications as of the date stated. Alpine has reviewed this material in connection with its ODD program but has not independently verified all factual representations except as specifically noted in the accompanying ODD report. The specific passage cited in the ODD analysis states: `,
    after: ". Investors and Alpine personnel are reminded that any manager-provided document is proprietary and confidential and may not be reproduced or disclosed to third parties without the prior written consent of Cordova Capital Partners, LLC. Please refer to the complete source document for full context, all defined terms, and applicable disclaimers.",
    pageLabel: "Page 1",
  };
}
// ── Blackpine doc metadata ────────────────────────────────────────────────────
function buildBlackpineDocMeta(filename: string, label: string) {
  const f = filename.toLowerCase();
  const l = label.toLowerCase();
  if (l.includes("odd report") || f.includes("sample_credit_blackpine_plus"))     return { title: "Operational Due Diligence Report — Blackpine Credit Plus IV", subtitle: "Blackpine Credit Plus IV, L.P. · Alpine ODD Review", date: "April 2026", badge: "Alpine Analysis" };
  if (l.includes("form adv") || f.includes("form-adv") || f.includes("form_adv"))  return { title: "Form ADV — Parts 1 & 2A", subtitle: "Blackpine Asset Management, LLC", date: "Filed March 2026", badge: "Regulatory Filing" };
  if (l.includes("due diligence") || l.includes("ddq"))                            return { title: "Due Diligence Questionnaire (2026)", subtitle: "Blackpine Asset Management, LLC", date: "2026", badge: "Fund Document" };
  if (l.includes("limited partnership") || f.includes("lpa"))                       return { title: "Limited Partnership Agreement — Fund IV", subtitle: "Blackpine Credit Plus IV, L.P.", date: "Effective 2025", badge: "Fund Document" };
  if (l.includes("private placement") || f.includes("ppm"))                         return { title: "Private Placement Memorandum — Fund IV", subtitle: "Blackpine Credit Plus IV, L.P.", date: "2025", badge: "Fund Document" };
  if (l.includes("valuation"))                                                      return { title: "Valuation Policy", subtitle: "Blackpine Asset Management, LLC", date: "Effective February 2026", badge: "Operations Document" };
  if (l.includes("code of ethics"))                                                 return { title: "Code of Ethics", subtitle: "Blackpine Asset Management, LLC", date: "Effective February 2026", badge: "Compliance Document" };
  if (l.includes("wisp") || l.includes("information security"))                     return { title: "Written Information Security Program (WISP)", subtitle: "Blackpine Asset Management, LLC", date: "2026", badge: "Compliance Document" };
  if (l.includes("admin") || l.includes("ss&c"))                                    return { title: "Administration Agreement — SS&C Technologies", subtitle: "Blackpine Credit Plus IV, L.P.", date: "Effective 2018", badge: "Service Provider Agreement" };
  if (l.includes("audit"))                                                          return { title: "Ernst & Young LLP — Audit Confirmation", subtitle: "Blackpine Credit Plus IV, L.P.", date: "FY2024", badge: "Third-Party Confirmation" };
  if (l.includes("sec examination") || l.includes("sec letter") || l.includes("closing letter")) return { title: "SEC Examination Closing Letter", subtitle: "Blackpine Asset Management, LLC", date: "Q3 2024", badge: "Regulatory Filing" };
  if (l.includes("insurance"))                                                      return { title: "Cyber Liability Insurance Certificate", subtitle: "Blackpine Asset Management, LLC", date: "2026", badge: "Insurance" };
  if (l.includes("investor letter") || l.includes("q4 2025"))                       return { title: "Q4 2025 Investor Letter", subtitle: "Blackpine Credit Plus IV, L.P.", date: "Q4 2025", badge: "Investor Communication" };
  if (l.includes("edgar") || l.includes("iard") || l.includes("iapd") || l.includes("sec verification") || l.includes("registered adviser")) return { title: "SEC EDGAR / IARD — Registered Adviser Record", subtitle: "Blackpine Asset Management, LLC", date: "Registered since 2019", badge: "SEC Verification" };
  if (l.includes("delaware"))                                                       return { title: "Delaware Division of Corporations — Entity Verification", subtitle: "Blackpine Credit Plus IV, L.P. · Blackpine Asset Management, LLC", date: "Verified April 2026", badge: "Public Record" };
  return { title: label, subtitle: "Blackpine Asset Management, LLC", date: "2026", badge: "Document" };
}

// ── Blackpine passage builder ─────────────────────────────────────────────────
function buildBlackpinePassage(quote: string, filename: string, sourceLabel: string): { before: string; after: string; section: string; pageLabel: string } {
  const f = filename.toLowerCase();
  const q = quote.toLowerCase();
  const l = sourceLabel.toLowerCase();

  // Form ADV
  if (l.includes("form adv") || f.includes("form-adv") || f.includes("form_adv")) {
    if (q.includes("new york") || q.includes("london") || q.includes("primary location")) return {
      section: "Item 1 — Identifying Information",
      before: "Blackpine Asset Management, LLC is a Delaware limited liability company with its principal place of business located in ",
      after: ". The firm was founded in 2017 by Martin Lin and focuses on opportunistic and stressed/distressed corporate credit, primarily in North American and European leveraged loan and high-yield markets. The firm is registered with the U.S. Securities and Exchange Commission as an investment adviser and maintains a small research outpost in London that is subject to UK FCA regulation. All advisory activity is conducted on a discretionary basis for private fund vehicles and separate accounts held by qualified institutional clients.",
      pageLabel: "Page 1 of 18",
    };
    if (q.includes("blackpine asset management")) return {
      section: "Item 1 — Identifying Information",
      before: "This Form ADV is filed by ",
      after: ", a Delaware limited liability company headquartered in New York with a research outpost in London. The firm was founded in 2017 by Martin Lin (Founder, Chief Investment Officer, and Portfolio Manager), formerly Co-Head of Special Situations at Goldwater Credit Partners and previously a Vice President in Apollo Global Management’s Distressed Credit group. The firm has been registered with the SEC as an investment adviser since 2019.",
      pageLabel: "Page 1 of 18",
    };
    if (q.includes("$850m") || q.includes("$1.025b") || q.includes("net assets") || q.includes("$175m") || q.includes("separate accounts") || q.includes("aum")) return {
      section: "Item 5 — Information About Your Advisory Business",
      before: "As of December 31, 2025, the Adviser reports regulatory assets under management reflecting net assets of ",
      after: " across its advised Blackpine Credit Plus fund vehicles and two institutional separate accounts, together with $215 million of uncalled capital commitments. All advisory activity is conducted on a discretionary basis. The Adviser files Form PF as a large hedge fund adviser and does not manage wrap-fee programs.",
      pageLabel: "Page 4 of 18",
    };
    if (q.includes("lin 72%") || q.includes("reyes 15%") || q.includes("foster 8%") || q.includes("ownership") || q.includes("reserved")) return {
      section: "Schedules A & B — Direct and Indirect Owners",
      before: "The Adviser’s equity is held as follows: ",
      after: ". Martin Lin (Founder, Chief Investment Officer, and Portfolio Manager) holds the controlling interest. Alexandra Reyes (Head of Research, joined 2018, former Director at Centerbridge) and Daniel Foster (Chief Operating Officer, joined 2019, former Anchorage Capital) hold minority interests, with the remaining 5% reserved for future grant. There are no outside institutional owners or third-party controlling interests in the management company.",
      pageLabel: "Page 7 of 18",
    };
    if (q.includes("martin lin")) return {
      section: "Schedules A & B — Direct and Indirect Owners",
      before: "The Adviser is controlled by its Founder and Chief Investment Officer, ",
      after: ", who owns 72% of the management company and serves as sole Portfolio Manager across the Blackpine Credit Plus series. Lin was formerly Co-Head of Special Situations at Goldwater Credit Partners and prior to that a Vice President in Apollo Global Management’s Distressed Credit group. Alexandra Reyes (Head of Research) and Daniel Foster (Chief Operating Officer) hold the remaining principal interests.",
      pageLabel: "Page 7 of 18",
    };
    return {
      section: "Item 7 — Financial Industry Affiliations and Private Funds",
      before: "The Adviser advises the Blackpine Credit Plus series of private funds, which pursue an opportunistic and stressed/distressed corporate credit strategy. With respect to the matters described in this Item: ",
      after: ". The Adviser receives a management fee and a carried interest allocation from the funds it advises. The funds are offered solely to accredited investors and qualified purchasers and are not registered under the Investment Company Act of 1940 in reliance on Sections 3(c)(7) thereof.",
      pageLabel: "Page 9 of 18",
    };
  }

  // DDQ
  if (l.includes("due diligence") || l.includes("ddq")) {
    if (q.includes("18 ftes") || q.includes("headcount") || q.includes("research/trading")) return {
      section: "Section 2 — Firm Background and Team",
      before: "The firm reports a total headcount of ",
      after: ". The investment team has averaged 11 years of credit experience. Senior personnel include Martin Lin (Founder, CIO, and sole Portfolio Manager), Alexandra Reyes (Head of Research), Daniel Foster (Chief Operating Officer), and Sarah Klein (Head of Capital Formation). Two senior analysts departed in 2025: Robert Chen left in March 2025 to launch his own credit fund, and David Marshall left in October 2025 to join a strategic.",
      pageLabel: "Page 5 of 48",
    };
    if (q.includes("martin lin — sole pm") || q.includes("unilateral") || q.includes("sole pm")) return {
      section: "Section 6 — Investment Process and Decision Authority",
      before: "Investment decision authority within the Blackpine Credit Plus series rests with a single individual: ",
      after: ". The 5-member Investment Committee (Lin, Reyes, Foster, plus two senior analysts) provides advisory input through formal IC presentations on each new position exceeding 2% of fund commitments, but the IC’s role is consultative rather than decisional. IC meetings are held weekly, recorded, and minuted for SEC examination purposes. Smaller positions may be initiated by Lin within written investment guidelines.",
      pageLabel: "Page 22 of 48",
    };
    if (q.includes("advisory only") || q.includes("ic ") || q.includes("investment committee") || q.includes("5 members") || q.includes("consultative")) return {
      section: "Section 6 — Investment Process and Decision Authority",
      before: "The Investment Committee structure is described as follows: ",
      after: ". The committee meets weekly and reviews all new positions exceeding 2% of fund commitments; however, final investment authority rests with Martin Lin alone. The IC process, Alexandra Reyes’ ability to challenge thesis, and the strategy’s relatively short holding periods (typically 18–30 months) partially mitigate the sole-PM structure.",
      pageLabel: "Page 22 of 48",
    };
    if (q.includes("daniel foster (coo) — combined") || q.includes("combined role") || q.includes("chief compliance")) return {
      section: "Section 4 — Compliance and Regulatory",
      before: "The firm’s Chief Compliance Officer role is staffed as follows: ",
      after: ". Daniel Foster serves as Chief Compliance Officer in addition to his operational responsibilities as Chief Operating Officer. The firm has engaged Apex Compliance Advisors LLC as outside compliance consultant since inception (2017), which performs an annual compliance review and supports regulatory filings, code of ethics enforcement, and policy updates. The compliance manual was last revised in February 2026. Alpine notes the combined COO/CCO role as a segregation of duties concern given the strategy’s illiquid valuation complexity.",
      pageLabel: "Page 14 of 48",
    };
    if (q.includes("succession") || q.includes("not formalized")) return {
      section: "Section 2 — Firm Background and Team",
      before: "With respect to succession planning, the firm’s response was: ",
      after: ". The LPA’s key person provision is triggered if Martin Lin ceases to dedicate substantially all of his time to Blackpine. Key person life insurance of $15 million is in place on Lin only. Alpine has flagged the concentration of ownership and decision authority in a single founder, combined with the absence of a written succession plan, as a required area for enhancement.",
      pageLabel: "Page 6 of 48",
    };
    if (q.includes("$15m") || q.includes("key person")) return {
      section: "Section 2 — Firm Background and Team",
      before: "Key person life insurance is maintained as follows: ",
      after: ". The key person provision under the LPA is triggered if Martin Lin ceases to dedicate substantially all of his time to Blackpine. No coverage is maintained on other senior principals, and no formal written succession plan currently exists.",
      pageLabel: "Page 6 of 48",
    };
    if (q.includes("robert chen") || q.includes("david marshall") || q.includes("departed")) return {
      section: "Section 2 — Firm Background and Team",
      before: "With respect to recent senior personnel turnover, the firm disclosed: ",
      after: ". Both departures were characterized as amicable. They nonetheless represent meaningful turnover within a small (8-person) research team over a nine-month period in 2025, and Alpine recommends monitoring research team stability through the next vintage.",
      pageLabel: "Page 7 of 48",
    };
    if (q.includes("ss&c") || q.includes("ernst") || q.includes("citi") || q.includes("houlihan") || q.includes("schulte") || q.includes("administrator") || q.includes("auditor")) return {
      section: "Section 5 — Service Providers",
      before: "The Fund’s service provider arrangements are as follows: ",
      after: ". SS&C Technologies has served as fund administrator across all four funds since inception in 2018, providing NAV calculation, investor capital activity, AML/KYC, and regulatory reporting. Ernst & Young LLP audits the fund (since inception); Citi Prime Finance serves as primary prime broker with a $150 million committed financing line; JPMorgan Chase serves as secondary prime/custodian; Schulte Roth & Zabel LLP serves as fund counsel with Akin Gump as restructuring counsel; and Houlihan Lokey Valuation Advisors serves as independent valuation agent on all Level 3 positions.",
      pageLabel: "Page 18 of 48",
    };
    if (q.includes("repo") || q.includes("$185m") || q.includes("30% of nav") || q.includes("22%") || q.includes("leverage")) return {
      section: "Section 7 — Leverage and Financing",
      before: "The Fund’s use of financing leverage is described as follows: ",
      after: ". Blackpine utilizes a $150 million committed repurchase facility with Citi as primary financing source, plus additional repo lines with two secondary banks. As of December 31, 2025, gross repo borrowings were $185 million (30% of NAV) and net leverage after offsetting cash positions was 22% of NAV. Moderate leverage is consistent with opportunistic credit strategies but introduces tail risk under credit market stress.",
      pageLabel: "Page 26 of 48",
    };
    if (q.includes("lmc holdings") || q.includes("7.4%") || q.includes("top 10") || q.includes("51%") || q.includes("concentration")) return {
      section: "Section 7 — Portfolio Concentration",
      before: "Portfolio concentration as of December 31, 2025 is reported as follows: ",
      after: ". The fund’s single-position concentration cap is 8.0% of total commitments. The largest single position (LMC Holdings 8.875% Senior Notes) stands at 7.4% of commitments, near the contractual cap; the top 10 positions represent 51% of NAV, reflecting a moderately concentrated book consistent with the opportunistic credit strategy.",
      pageLabel: "Page 27 of 48",
    };
    return {
      section: "Section 3 — Fund Terms and Structure",
      before: "Blackpine Credit Plus IV is being raised with a $400 million target, against which approximately $260 million had been raised through December 2025. The management fee is 1.75% on commitments during the investment period, stepping to 1.50% on NAV thereafter, with 20% carried interest over an 8% preferred return. With respect to the specific terms applicable to this Fund: ",
      after: ". The General Partner commits 2% of total commitments in cash (approximately $8 million at target), invested pari passu with Limited Partners. Carried interest is calculated on a whole-of-fund basis with a clawback backed by an escrow of 30% of distributed carry.",
      pageLabel: "Page 9 of 48",
    };
  }

  // LPA / PPM
  if (l.includes("limited partnership") || l.includes("private placement") || f.includes("lpa") || f.includes("ppm")) {
    if (q.includes("delaware lp") || q.includes("cayman") || q.includes("master-feeder") || q.includes("fund vehicle") || q.includes("parallel feeder")) return {
      section: "Section 1 — Organization and Formation",
      before: "The Fund is constituted as follows: ",
      after: ". Blackpine Credit Plus IV, L.P. is organized as a Delaware limited partnership, with a Cayman master-feeder structure (Blackpine Credit Plus IV (Cayman), Ltd.) accommodating non-US and US tax-exempt investors. Blackpine Asset Management, LLC serves as the investment manager. The Fund invests across stressed corporate credit, distressed debt, and selective rescue financings in North America and Europe.",
      pageLabel: "Page 4 of 88",
    };
    if (q.includes("1.75%") || q.includes("1.50%") || q.includes("management fee")) return {
      section: "Section 7 — Management Fee",
      before: "The Manager is entitled to a management fee, charged as follows: ",
      after: ". The fee is 1.75% per annum on total commitments during the investment period (years 1–3), stepping down to 1.50% on net asset value thereafter (years 4–8). No management fee offset arrangement applies to the GP commitment, which is invested pari passu with Limited Partners free of fee.",
      pageLabel: "Page 18 of 88",
    };
    if (q.includes("20% over 8%") || q.includes("preferred return") || q.includes("catch-up") || q.includes("carried interest") || q.includes("whole-of-fund") || q.includes("clawback") || q.includes("escrow")) return {
      section: "Section 8 — Carried Interest and Distributions",
      before: "Carried interest and the distribution waterfall are structured as follows: ",
      after: ". Carried interest is 20% of net profits over an 8% preferred return with a 50/50 catch-up, calculated on a whole-of-fund basis. A clawback provision applies through the end of the fund term, and the GP’s clawback obligation is backed by an escrow of 30% of distributed carry. Alpine views the whole-of-fund carry with material escrow as well-aligned with LP interests.",
      pageLabel: "Page 21 of 88",
    };
    if (q.includes("6 years") || q.includes("3 investment") || q.includes("harvest") || q.includes("extension") || q.includes("total term")) return {
      section: "Section 3 — Term of the Fund",
      before: "The Fund’s term is structured as follows: ",
      after: ". The Fund has a 6-year base term (3-year investment period plus 3-year harvest period) with up to two one-year extensions subject to LPAC approval. The shorter-than-typical base term reflects the strategy’s faster realization cycle relative to direct lending or real estate credit.",
      pageLabel: "Page 8 of 88",
    };
    if (q.includes("2.0% in cash") || q.includes("gp commitment") || q.includes("$8m") || q.includes("pari passu")) return {
      section: "Section 6 — General Partner Commitment",
      before: "The General Partner commitment is set as follows: ",
      after: ". The GP has committed 2% of total commitments in cash, equating to approximately $8 million at the $400 million target, invested pari passu with Limited Partners and free of management fees. Alpine views the cash GP commitment as a constructive alignment of interest.",
      pageLabel: "Page 16 of 88",
    };
    if (q.includes("key person") || q.includes("martin lin ceases") || q.includes("substantially full-time")) return {
      section: "Section 12 — Key Person Provision",
      before: "The Fund’s key person provision operates as follows: ",
      after: ". The provision is triggered if Martin Lin ceases substantially full-time involvement with Blackpine, upon which the investment period is suspended pending an LP vote. No formal written succession plan is documented; key person life insurance of $15 million is maintained on Lin only.",
      pageLabel: "Page 31 of 88",
    };
    if (q.includes("most-favored-nation") || q.includes("mfn") || q.includes("$25m") || q.includes("lpac seats") || q.includes("removal") || q.includes("lp vote")) return {
      section: "Section 11 — Limited Partner Protections",
      before: "The Fund affords Limited Partners the following governance protections: ",
      after: ". Most-favored-nation rights are extended for commitments of $25 million or greater; the LPAC comprises 5 seats; for-cause GP removal requires a 50% LP vote, and no-fault GP removal requires a 75% LP vote. A key person clause is triggered if Martin Lin ceases substantially full-time involvement.",
      pageLabel: "Page 28 of 88",
    };
    if (q.includes("8% of total commitments") || q.includes("concentration cap") || q.includes("single-position")) return {
      section: "Section 9 — Investment Guidelines and Limitations",
      before: "The Fund’s investment limitations include a single-position concentration ceiling, set as follows: ",
      after: ". The cap of 8% of total commitments applies on a cost basis at the time of investment. The Fund invests across stressed corporate credit, distressed debt, and selective rescue financings in North America and Europe, consistent with the opportunistic credit mandate described in the Private Placement Memorandum.",
      pageLabel: "Page 24 of 88",
    };
    return {
      section: "Section 2 — Investment Strategy and Objective",
      before: "The Fund pursues an opportunistic and stressed/distressed corporate credit strategy. With respect to the matters described in this section: ",
      after: ". The strategy spans stressed loans and bonds trading at discounts to par, true distressed (Chapter 11 / restructuring) positions, and selective rescue financings across North American and European leveraged loan and high-yield markets. Capital is drawn down over the Fund’s investment period pursuant to capital call notices issued by the Manager.",
      pageLabel: "Page 6 of 88",
    };
  }

  // Valuation Policy
  if (l.includes("valuation")) {
    if (q.includes("houlihan") || q.includes("agent of record") || q.includes("level 3") || q.includes("independently") || q.includes("market color")) return {
      section: "Section 3 — Independent Valuation of Illiquid Positions",
      before: "For illiquid positions, the firm relies on an independent valuation agent of record, as follows: ",
      after: ". Houlihan Lokey Valuation Advisors independently marks all Level 3 positions — distressed positions in restructuring, non-traded bank loans, and rescue financings — on a quarterly basis. Blackpine does not produce its own marks on Level 3 positions, providing only market color and trading observations. Level 3 positions represented approximately 25% of NAV as of December 31, 2025. Alpine regards the independent agent-of-record arrangement as a meaningful strength given the strategy’s valuation complexity.",
      pageLabel: "Page 5 of 16",
    };
    if (q.includes("level 1") || q.includes("level 2") || q.includes("mark-to-market") || q.includes("broker-quoted") || q.includes("bloomberg") || q.includes("median")) return {
      section: "Section 2 — Valuation Framework (ASC 820)",
      before: "Portfolio positions are classified into fair-value tiers under ASC 820 and marked as follows: ",
      after: ". Level 1 positions (approximately 35% of NAV) are publicly traded debt and equity securities marked daily via Bloomberg composite pricing. Level 2 positions (approximately 40% of NAV) are less-liquid loans and high-yield bonds marked using three broker quotes (Citi, JPMorgan, plus a rotating third) with the median price used. Level 3 positions (approximately 25% of NAV) are independently valued quarterly by Houlihan Lokey.",
      pageLabel: "Page 4 of 16",
    };
    if (q.includes("committee") || q.includes("non-investment") || q.includes("3 of 5") || q.includes("majority vote") || q.includes("composition")) return {
      section: "Section 4 — Valuation Committee Governance",
      before: "The Valuation Committee is constituted as follows: ",
      after: ". The committee comprises five members — Daniel Foster (COO/CCO, Chair), an Apex Compliance Advisors representative, an SS&C senior representative, Alexandra Reyes (Head of Research), and Martin Lin (CIO) — with non-investment members holding 3 of 5 seats. The committee meets quarterly to review Houlihan Lokey’s marks on Level 3 positions; Lin’s role is advisory and he cannot override Houlihan’s marks unilaterally.",
      pageLabel: "Page 7 of 16",
    };
    return {
      section: "Section 2 — Valuation Process and Governance",
      before: "Blackpine Asset Management prepares and reviews fair-value estimates for all portfolio investments in accordance with ASC 820 and the firm’s written Valuation Policy. With respect to the firm’s valuation process: ",
      after: ". The firm engages Houlihan Lokey Valuation Advisors as independent valuation agent of record on all Level 3 illiquid positions, marked quarterly, while liquid Level 1 and Level 2 positions are marked via Bloomberg composite pricing and broker quotes respectively. The Valuation Committee, with a non-investment majority, reviews all marks quarterly.",
      pageLabel: "Page 4 of 16",
    };
  }

  // Code of Ethics
  if (l.includes("code of ethics")) {
    if (q.includes("pre-clear") || q.includes("preclear") || q.includes("preclearable")) return {
      section: "Section 3 — Personal Securities Transactions",
      before: "All employees are subject to a pre-clearance requirement, which applies as follows: ",
      after: ". Pre-clearance is required for all securities transactions other than open-end mutual funds, US Treasuries, and certain ETFs. A 30-day minimum holding period applies to all preclearable securities, and brokerage statements are collected directly from custodians by Apex Compliance Advisors. Annual attestations are completed by all employees.",
      pageLabel: "Page 6 of 22",
    };
    if (q.includes("30 days") || q.includes("holding period")) return {
      section: "Section 3 — Personal Securities Transactions",
      before: "A minimum holding period applies to personal securities transactions, set at ",
      after: " for all preclearable securities. Pre-clearance is required for all securities transactions other than open-end mutual funds, US Treasuries, and certain ETFs. Brokerage statements are collected custodian-direct by Apex Compliance Advisors, and annual attestations are completed by all employees. Alpine assessed the firm’s personal trading controls as robust — meaningfully stronger than its compliance staffing alone would suggest, owing largely to Apex’s role.",
      pageLabel: "Page 6 of 22",
    };
    return {
      section: "Section 1 — Standards of Business Conduct",
      before: "The Code of Ethics establishes standards of business conduct applicable to all supervised persons. With respect to the matters described in this section: ",
      after: ". The Code requires pre-clearance for all preclearable securities, imposes a 30-day minimum holding period, mandates custodian-direct collection of brokerage statements via Apex Compliance Advisors, and requires annual attestations from all employees. The Code was last revised in February 2026.",
      pageLabel: "Page 2 of 22",
    };
  }

  // WISP / Information Security
  if (l.includes("wisp") || l.includes("information security")) {
    return {
      section: "Written Information Security Program — Overview",
      before: "Blackpine maintains a Written Information Security Program (WISP) together with an Incident Response Plan and Business Continuity Plan, reviewed annually. With respect to the firm’s information security and resilience controls: ",
      after: ". The firm operates a Microsoft 365 stack with Microsoft Entra ID single sign-on and mandatory MFA, CrowdStrike Falcon endpoint protection, and Smarsh communication archiving deployed firmwide in 2024. Vantage Tech LLC has served as outsourced IT and cybersecurity provider since 2020, and Mandiant has conducted annual penetration testing since 2023. The BCP is tested annually via tabletop exercise (most recent September 2025), and the firm has not experienced any material cybersecurity incidents. Cyber liability insurance is maintained at $10 million per occurrence and aggregate.",
      pageLabel: "Page 1 of 20",
    };
  }

  // Administration Agreement (SS&C)
  if (l.includes("admin") || l.includes("ss&c")) {
    return {
      section: "Administration Agreement — Scope of Services",
      before: "SS&C Technologies serves as fund administrator to Blackpine Credit Plus IV, L.P. and the broader Blackpine Credit Plus series since inception in 2018. Under the Administration Agreement, SS&C provides the following services: ",
      after: ". SS&C performs NAV calculation, investor capital activity processing, AML/KYC, FATCA/CRS, and regulatory reporting, and reconciles asset existence to Citi and JPMorgan prime broker statements monthly. Daniel Foster (COO) reviews SS&C’s annual SOC 1 Type II report and conducts quarterly relationship calls. Quarterly NAV statements are issued to investors.",
      pageLabel: "Page 3 of 30",
    };
  }

  // Audit Letter (EY)
  if (l.includes("audit")) {
    return {
      section: "Auditor Confirmation — Ernst & Young LLP",
      before: "Ernst & Young LLP has served as independent auditor to Blackpine Credit Plus IV, L.P. since inception in 2018. With respect to the audit engagement and history: ",
      after: ". EY delivers its annual audit opinion within 90 days of fiscal year-end; the audit fee for FY2024 was $295,000. No restatements, material weaknesses, or significant deficiencies have been reported across the firm’s history. Alpine confirmed the engagement directly with EY during the ODD review.",
      pageLabel: "Audit Confirmation · Page 1",
    };
  }

  // SEC Examination Closing Letter
  if (l.includes("sec examination") || l.includes("sec letter") || l.includes("closing letter")) {
    return {
      section: "SEC Examination — Closing Letter",
      before: "The most recent SEC examination of Blackpine Asset Management, LLC was conducted in Q1 2024. The closing letter reflects the following: ",
      after: ". The deficiency letter cited books-and-records retention deficiencies under Rule 204-2, specifically that certain email communications were not retained for the required periods. Blackpine remediated by deploying Smarsh email archiving firmwide and producing evidence of remediation; the SEC closed the matter in Q3 2024 without enforcement action. The firm has no other regulatory actions, customer complaints, or material litigation.",
      pageLabel: "SEC Letter · Page 1",
    };
  }

  // Insurance Certificate
  if (l.includes("insurance")) {
    return {
      section: "Cyber Liability Insurance Certificate",
      before: "The firm maintains cyber liability insurance evidenced by certificate, with limits as follows: ",
      after: ". The policy provides $10 million per occurrence and $10 million in the aggregate, which Alpine assessed as adequate for the firm’s size. Coverage supports the firm’s broader resilience posture alongside its WISP, Incident Response Plan, and Business Continuity Plan.",
      pageLabel: "Insurance Cert · Page 1",
    };
  }

  // Q4 2025 Investor Letter
  if (l.includes("investor letter") || l.includes("q4 2025")) {
    return {
      section: "Q4 2025 Investor Letter — Reporting and Communications",
      before: "Blackpine produces quarterly investor letters within 45 days of each quarter-end. The Q4 2025 letter reflects the firm’s standard reporting practice, described as follows: ",
      after: ". Letters run approximately 14–18 pages and include performance attribution by asset class, named-position commentary on the top 10 holdings, restructuring updates, leverage attribution, and a market outlook. Martin Lin personally writes the market commentary section and Alexandra Reyes writes the position-level updates. The firm also hosts an annual investor day each May in New York attended by approximately 70% of LPs by capital.",
      pageLabel: "Q4 2025 Letter · Page 1",
    };
  }

  // SEC EDGAR / IARD verification
  if (l.includes("edgar") || l.includes("iard") || l.includes("iapd") || l.includes("sec verification") || l.includes("registered adviser")) {
    return {
      section: "SEC EDGAR / IARD — Registered Adviser Record",
      before: "Investment Adviser Public Disclosure record for Blackpine Asset Management, LLC. The firm is reported as an SEC-registered investment adviser (IARD/CRD 304882), registered since 2019 as assets under management crossed the RIA threshold. The record reflects: ",
      after: ". The firm’s record shows no reportable disciplinary events beyond the Q1 2024 examination deficiency letter, which was remediated and closed without enforcement in Q3 2024. The firm is subject to a Form PF filing obligation as a large hedge fund adviser and to UK FCA regulation via its London research outpost. Alpine confirmed registration status via direct IARD query during the ODD review.",
      pageLabel: "IARD Record · Page 1",
    };
  }

  // Delaware register
  if (l.includes("delaware")) {
    return {
      section: "Delaware Division of Corporations — Entity Verification",
      before: "Alpine performed a direct check against the Delaware Division of Corporations register to confirm the existence and good standing of the Fund and its Manager. The register reflects the following: ",
      after: ". Blackpine Credit Plus IV, L.P. (Delaware limited partnership) and Blackpine Asset Management, LLC (Delaware limited liability company, formed September 8, 2017) were both confirmed on the register. No discrepancies were identified between the entity names disclosed by the Manager and the registered entities.",
      pageLabel: "Delaware Register · Page 1",
    };
  }

  // Alpine ODD Report
  if (l.includes("odd report") || f.includes("sample_credit_blackpine_plus")) {
    return {
      section: "Alpine ODD — Operational Due Diligence Report",
      before: "Alpine Due Diligence — Operational Due Diligence Report. ODD Engagement: Blackpine Credit Plus IV, L.P. (Manager: Blackpine Asset Management, LLC). This report summarizes Alpine’s analysis of the documents submitted, the management responses, and the third-party verifications obtained during the review. The following finding was identified: ",
      after: ". The overall engagement is rated YELLOW (watchlist), with a RED rating in Investment Operations driven by the sole portfolio manager structure (Martin Lin holds unilateral final investment authority), and YELLOW ratings in Governance, Compliance, and Technology. These are partially mitigated by an independent valuation agent of record (Houlihan Lokey), institutional-grade service providers, and a strong realized track record across three prior vintages.",
      pageLabel: "Alpine ODD Report · Page 1",
    };
  }

  // Generic Blackpine fallback
  return {
    section: "Document Reference — Alpine Due Diligence File",
    before: `The following passage has been extracted from the referenced source (${sourceLabel}) maintained in Alpine’s operational due diligence file for Blackpine Credit Plus IV, L.P. This material reflects information provided by Blackpine Asset Management, LLC or obtained from independent registries and third-party verifications as of the date stated. Alpine has reviewed this material in connection with its ODD program but has not independently verified all factual representations except as specifically noted in the accompanying ODD report. The specific passage cited in the ODD analysis states: `,
    after: ". Investors and Alpine personnel are reminded that any manager-provided document is proprietary and confidential and may not be reproduced or disclosed to third parties without the prior written consent of Blackpine Asset Management, LLC. Please refer to the complete source document for full context, all defined terms, and applicable disclaimers.",
    pageLabel: "Page 1",
  };
}
// ── Havencrest doc metadata ───────────────────────────────────────────────────
function buildHavencrestDocMeta(filename: string, label: string) {
  const f = filename.toLowerCase();
  const l = label.toLowerCase();
  if (l.includes("form adv") || f.includes("form-adv") || f.includes("form_adv") || f.includes("form_adv")) return { title: "Form ADV — Parts 1 & 2A", subtitle: "Havencrest Real Estate Advisors, LLC", date: "Filed March 28, 2026", badge: "Regulatory Filing" };
  if (l.includes("due diligence") || l.includes("ddq"))                          return { title: "Due Diligence Questionnaire (2026)", subtitle: "Havencrest Real Estate Advisors, LLC", date: "2026", badge: "Fund Document" };
  if (l.includes("limited partnership") || f.includes("lpa"))                     return { title: "Limited Partnership Agreement — Trust V", subtitle: "Havencrest Industrial Trust V, L.P.", date: "Effective 2026", badge: "Legal" };
  if (l.includes("private placement") || f.includes("ppm"))                       return { title: "Private Placement Memorandum — Trust V", subtitle: "Havencrest Industrial Trust V, L.P.", date: "2026", badge: "Legal" };
  if (l.includes("valuation") || f.includes("valuation"))                         return { title: "Valuation Policy", subtitle: "Havencrest Real Estate Advisors, LLC", date: "Effective January 2026", badge: "Operations" };
  if (l.includes("code of ethics") || f.includes("code") || f.includes("ethics")) return { title: "Code of Ethics", subtitle: "Havencrest Real Estate Advisors, LLC", date: "Effective January 2026", badge: "Compliance" };
  if (l.includes("information security") || l.includes("wisp") || f.includes("wisp")) return { title: "Written Information Security Program", subtitle: "Havencrest Real Estate Advisors, LLC", date: "2026", badge: "Compliance" };
  if (l.includes("soc 2") || l.includes("soc2") || f.includes("soc"))             return { title: "SOC 2 Type II Report — FY2025", subtitle: "Havencrest Real Estate Advisors, LLC · Examined by Schneider Downs", date: "FY2025", badge: "Third-Party Audit" };
  if (l.includes("administration agreement") || l.includes("admin"))              return { title: "Administration Agreement — SS&C Technologies", subtitle: "Havencrest Industrial Trust V, L.P.", date: "2026", badge: "Service Provider Agreement" };
  if (l.includes("audit") || f.includes("audit"))                                 return { title: "Audit Confirmation — PricewaterhouseCoopers LLP", subtitle: "Havencrest Industrial Trust V, L.P.", date: "FY2024", badge: "Third-Party Confirmation" };
  if (l.includes("insurance") || f.includes("insurance"))                         return { title: "Cyber Liability Insurance Certificate", subtitle: "Havencrest Real Estate Advisors, LLC", date: "2026", badge: "Insurance" };
  if (l.includes("investor letter") || l.includes("q4 2025") || f.includes("letter")) return { title: "Q4 2025 Investor Letter", subtitle: "Havencrest Industrial Trust V, L.P.", date: "Q4 2025", badge: "Investor Communication" };
  if (l.includes("edgar") || l.includes("iard") || l.includes("iapd") || l.includes("sec")) return { title: "SEC EDGAR / IARD — Registered Investment Adviser Record", subtitle: "Havencrest Real Estate Advisors, LLC", date: "RIA since 2014 (CRD 158263)", badge: "SEC Verification" };
  if (l.includes("delaware"))                                                     return { title: "Delaware Division of Corporations — Entity Verification", subtitle: "Havencrest Industrial Trust V, L.P. · Havencrest Real Estate Advisors, LLC", date: "Verified 2026", badge: "Public Record" };
  if (l.includes("odd report") || f.includes("sample_re_havencrest") || f.includes("havencrest_trust")) return { title: "Havencrest Industrial Trust V — ODD Report", subtitle: "Havencrest Real Estate Advisors, LLC · Alpine ODD Review", date: "April 2026", badge: "ODD Report" };
  return { title: label, subtitle: "Havencrest Real Estate Advisors, LLC", date: "2026", badge: "Document" };
}

// ── Havencrest passage builder ────────────────────────────────────────────────
function buildHavencrestPassage(quote: string, filename: string, sourceLabel: string): { before: string; after: string; section: string; pageLabel: string } {
  const f = filename.toLowerCase();
  const q = quote.toLowerCase();
  const l = sourceLabel.toLowerCase();

  // Form ADV
  if (l.includes("form adv") || f.includes("form-adv") || f.includes("form_adv")) {
    if (q.includes("chicago") || q.includes("primary location") || q.includes("regional")) return {
      section: "Item 1 — Identifying Information",
      before: "Havencrest Real Estate Advisors, LLC is a Delaware limited liability company with its principal place of business located in ",
      after: ". The firm is a Core+ industrial and logistics real estate manager founded in 2008 by Patricia Vega (Chief Executive Officer) and Mark Donovan (Chief Investment Officer), both formerly senior real estate professionals at Prologis. The firm is registered with the U.S. Securities and Exchange Commission as an investment adviser (IARD/CRD 158263) since 2014, structures its funds as REITs, and advises closed-end private fund vehicles whose investors are accredited investors and qualified purchasers.",
      pageLabel: "Page 1 of 18",
    };
    if (q.includes("havencrest real estate advisors")) return {
      section: "Item 1 — Identifying Information",
      before: "This Form ADV is filed by ",
      after: ", a Delaware limited liability company headquartered in Chicago, Illinois, with regional offices in Atlanta, Dallas, and Los Angeles. The firm is a Core+ industrial and logistics real estate manager founded in 2008 by Patricia Vega and Mark Donovan, and has been registered with the SEC as an investment adviser (IARD/CRD 158263) since 2014.",
      pageLabel: "Page 1 of 18",
    };
    if (q.includes("3.42") || q.includes("aum") || q.includes("net assets") || q.includes("785")) return {
      section: "Item 5 — Information About Your Advisory Business",
      before: "As of December 31, 2025, the Adviser reports firmwide regulatory net assets of ",
      after: " under management across its advised closed-end private fund vehicles, together with $785 million of uncalled capital commitments. All advisory activity is conducted on a discretionary basis. The Adviser does not manage separately managed accounts or wrap-fee programs and advises only private fund REIT vehicles investing in Core+ industrial real estate.",
      pageLabel: "Page 5 of 18",
    };
    if (q.includes("employees 82") || q.includes("greenhill") || q.includes("ownership") || q.includes("82%")) return {
      section: "Schedules A & B — Direct and Indirect Owners",
      before: "The Adviser is majority owned by its employees, with ownership distributed as follows: ",
      after: ". Employee ownership is held by 23 senior-level professionals (the four-member Executive Committee plus 19 partner-level employees). Greenhill Pension Trust holds a passive minority interest acquired in 2017 and exercises no control or management role. There are no other outside institutional owners or third-party controlling interests in the management company.",
      pageLabel: "Page 9 of 18",
    };
    if (q.includes("registered") || q.includes("ria") || q.includes("158263") || q.includes("examination") || q.includes("complaint") || q.includes("none")) return {
      section: "Item 11 — Disciplinary Information",
      before: "The Adviser has been registered with the U.S. Securities and Exchange Commission as an investment adviser (IARD/CRD 158263) since 2014. With respect to disciplinary and regulatory history: ",
      after: ". The firm reports no SEC examinations resulting in deficiency letters or enforcement actions, no material litigation in its 17-year history, and no material customer complaints on record. The firm structures its funds as REITs and maintains a dedicated REIT compliance function in addition to its core investment adviser compliance program.",
      pageLabel: "Page 12 of 18",
    };
    return {
      section: "Item 5 — Fees and Compensation",
      before: "The Adviser receives a management fee and a performance-based carried interest allocation from the funds it advises. The management fee is 1.25% per annum on total commitments during the four-year investment period, stepping to 1.00% on invested capital thereafter, and carried interest is 15% over a 7% preferred return with a 50/50 catch-up. With respect to the matters described in this Item: ",
      after: ". Carried interest is calculated on a whole-of-fund basis with a clawback through the end of the fund term, backed by a 25% escrow of distributed carry. The General Partner commits 3% of total commitments in cash, funded pari passu with Limited Partners and free of any fee offset.",
      pageLabel: "Page 6 of 18",
    };
  }

  // DDQ
  if (l.includes("due diligence") || l.includes("ddq")) {
    if (q.includes("ss&c") || q.includes("pwc") || q.includes("pricewaterhouse") || q.includes("administrator") || q.includes("auditor") || q.includes("goodwin") || q.includes("jpmorgan")) return {
      section: "Section 5 — Service Providers",
      before: "Fund Administrator: ",
      after: ". SS&C Technologies has served as administrator across all five funds since 2010 and provides NAV calculation, investor capital activity, AML/KYC, FATCA/CRS, and REIT testing support. The independent auditor is PricewaterhouseCoopers LLP, engaged since 2010 (a 15-year tenure), with no restatements or material weaknesses across the audit history. JPMorgan Chase, N.A. serves as primary bank at the fund and property-SPV level; fund counsel is Goodwin Procter LLP and REIT tax counsel is Sidley Austin LLP. Independent appraisals are provided quarterly by Cushman & Wakefield with semi-annual rotating secondary appraisals by CBRE.",
      pageLabel: "Page 22 of 58",
    };
    if (q.includes("42 fte") || q.includes("headcount") || q.includes("acquisitions") || q.includes("asset mgmt") || q.includes("42 ")) return {
      section: "Section 2 — Firm Background and Team",
      before: "The firm employs a total of ",
      after: " across acquisitions, asset management, capital markets, operations and finance, investor relations, and administration. Investment professionals average 13 years of industrial real estate experience. Senior leadership comprises Patricia Vega (CEO), Mark Donovan (CIO), Lauren Foster (Head of Acquisitions), Robert Kim (Head of Asset Management), and Sandra Chen (CFO). Background checks are conducted by HireRight on initial hire and refreshed every three years for partner-level employees.",
      pageLabel: "Page 5 of 58",
    };
    if (q.includes("amazon") || q.includes("fedex") || q.includes("walmart") || q.includes("top 3") || q.includes("top 10") || q.includes("noi") || q.includes("11.8") || q.includes("28%") || q.includes("51%") || q.includes("8.4") || q.includes("investment-grade")) return {
      section: "Section 6 — Portfolio and Tenant Concentration",
      before: "As of December 31, 2025, tenant concentration across the fund portfolio is reported as follows: ",
      after: ". The concentration is largely industry-inherent in the e-commerce-driven modern industrial logistics strategy and is mitigated through tenant-level credit underwriting for all leases over 100,000 SF, long-term lease durations (weighted-average remaining lease term of 8.4 years), a tenant credit skew under which 82% of NOI is from investment-grade rated tenants, and geographic diversification across primary logistics corridors. The single-tenant cap under the LPA is 12% of total commitments on an NOI basis.",
      pageLabel: "Page 31 of 58",
    };
    if (q.includes("maria santos") || q.includes("cco") || q.includes("compliance") || q.includes("schulte") || q.includes("mock") || q.includes("pre-clearance") || q.includes("attestation")) return {
      section: "Section 4 — Compliance and Regulatory",
      before: "The firm is an SEC-registered investment adviser and maintains a dedicated compliance program. With respect to compliance oversight and program administration: ",
      after: ". Maria Santos joined as Chief Compliance Officer in 2018 with 12 years of real estate fund compliance experience, reports directly to the Executive Committee, and holds no investment responsibilities. The compliance team comprises three full-time professionals plus a part-time REIT tax specialist. The firm engages Schulte Roth & Zabel LLP as outside compliance counsel and performs an annual mock SEC exam each fall, most recently in October 2025.",
      pageLabel: "Page 18 of 58",
    };
    if (q.includes("cushman") || q.includes("cbre") || q.includes("appraisal") || q.includes("valuation agent")) return {
      section: "Section 7 — Valuation and Reporting",
      before: "The fund values its industrial portfolio quarterly under the ASC 820 fair-value framework using an independent third-party appraiser. With respect to the appraisal arrangements: ",
      after: ". Cushman & Wakefield serves as the primary valuation agent of record (not merely a reviewer), providing quarterly appraisals on 100% of properties, and the Manager does not produce internal marks separate from the Cushman appraisals. CBRE provides semi-annual rotating secondary appraisals on approximately one-third of the portfolio each cycle to provide quality control.",
      pageLabel: "Page 38 of 58",
    };
    if (q.includes("succession") || q.includes("key person insurance") || q.includes("$20m on") || q.includes("vesting") || q.includes("carry vesting")) return {
      section: "Section 2 — Governance and Succession",
      before: "The firm maintains a formal written succession plan and incentive-alignment framework. With respect to governance protections: ",
      after: ". Mark Donovan is designated successor CEO and Lauren Foster (Head of Acquisitions) is designated successor CIO. Key person life insurance of $20 million is maintained on each of the five Executive Committee members. All carry-eligible employees are subject to a five-year carry vesting schedule, reinforcing long-term alignment between investment professionals and Limited Partners.",
      pageLabel: "Page 7 of 58",
    };
    return {
      section: "Section 3 — Fund Terms and Structure",
      before: "Havencrest Industrial Trust V is structured as a Delaware limited partnership investing through a Delaware REIT vehicle, with a Cayman feeder accommodating non-US and US tax-exempt investors. The management fee is 1.25% on commitments during the four-year investment period (stepping to 1.00% on invested capital thereafter) and carried interest is 15% over a 7% preferred return with a 50/50 catch-up. With respect to the specific terms applicable to this Fund: ",
      after: ". The General Partner commits 3% of total commitments in cash (approximately $45 million at the $1.5 billion hard cap), funded pari passu with Limited Partners and free of any fee offset. The fund imposes a conservative 55% loan-to-value cap at the fund level and a 10-year term (four-year investment period plus six-year harvest) with up to two one-year extensions subject to LPAC approval.",
      pageLabel: "Page 12 of 58",
    };
  }

  // LPA / PPM
  if (l.includes("limited partnership") || l.includes("private placement") || f.includes("lpa") || f.includes("ppm")) {
    if (q.includes("delaware") || q.includes("cayman") || q.includes("reit") || q.includes("feeder") || q.includes("delaware lp")) return {
      section: "Section 1 — Organization and Structure",
      before: "Havencrest Industrial Trust V, L.P. (the \"Fund\") is organized as a ",
      after: " and invests through a Delaware REIT vehicle that is intended to satisfy the requirements of IRC Sections 856 through 860. A Cayman feeder, Havencrest Industrial Trust V (Cayman), Ltd., accommodates non-US and US tax-exempt investors. The General Partner and the investment manager, Havencrest Real Estate Advisors, LLC, have both been confirmed against the Delaware Division of Corporations register.",
      pageLabel: "Page 4 of 72",
    };
    if (q.includes("key person") || q.includes("vega") || q.includes("donovan") || q.includes("foster") || q.includes("removal") || q.includes("lpac") || q.includes("most-favored") || q.includes("mfn")) return {
      section: "Section 12 — LP Protections and Key Person Provision",
      before: "The Fund includes a suite of Limited Partner protections together with a key person provision intended to ensure the continued involvement of the firm's senior leaders in the investment process. With respect to these protections: ",
      after: ". The key person clause is triggered if any two of Patricia Vega, Mark Donovan, or Lauren Foster cease to be substantially full-time involved with the Fund. Additional protections include most-favored-nation rights for commitments of $50 million or more, a nine-seat LP Advisory Committee with broad investor representation, for-cause GP removal on a 50% LP vote, and no-fault GP removal on a 75% LP vote.",
      pageLabel: "Page 38 of 72",
    };
    if (q.includes("ltv") || q.includes("55%") || q.includes("6%") || q.includes("25%") || q.includes("12%") || q.includes("concentration") || q.includes("cap")) return {
      section: "Section 9 — Investment Limitations and Leverage",
      before: "The Fund's investment program is subject to portfolio concentration and leverage limitations set out in the Agreement. With respect to these limitations: ",
      after: ". Maximum single-property concentration is 6% of total commitments, maximum single-market concentration is 25%, and maximum single-tenant concentration is 12% on an NOI basis. The Fund is subject to a 55% loan-to-value cap at the fund level — conservative for industrial real estate, where 60-65% is more typical — which the Manager has indicated is a deliberate choice to align with risk-conscious institutional Limited Partners.",
      pageLabel: "Page 26 of 72",
    };
    return {
      section: "Section 7 — Management Fee and Carried Interest",
      before: "The General Partner is entitled to a management fee of 1.25% per annum on total commitments during the four-year investment period, stepping to 1.00% on invested capital thereafter, and a carried interest allocation of 15% over a 7% preferred return with a 50/50 catch-up. With respect to the Fund's economic terms: ",
      after: ". Carried interest is calculated on a whole-of-fund basis with a clawback through the end of the fund term, backed by a 25% escrow of distributed carry. The General Partner commits 3% of total commitments in cash (approximately $45 million at the $1.5 billion hard cap), funded pari passu with Limited Partners and free of any management fee offset. The Fund has a 10-year base term (four-year investment plus six-year harvest) with up to two one-year extensions subject to LPAC approval.",
      pageLabel: "Page 19 of 72",
    };
  }

  // Valuation Policy
  if (l.includes("valuation") || f.includes("valuation")) {
    if (q.includes("committee") || q.includes("non-investment") || q.includes("4 non-investment") || q.includes("composition")) return {
      section: "Section 3 — Valuation Committee",
      before: "The Valuation Committee oversees the quarterly valuation process and approves marks. The Committee is composed as follows: ",
      after: ". Non-investment members hold four of the six seats (the CFO as Chair, the CCO, the SS&C senior representative, and the outside Cushman & Wakefield engagement leader), with Robert Kim (Head of Asset Management) and Mark Donovan (CIO) completing the Committee. The Committee meets quarterly to review the Cushman & Wakefield appraisals and approve the resulting marks.",
      pageLabel: "Page 6 of 14",
    };
    return {
      section: "Section 2 — Valuation Process and Governance",
      before: "Havencrest values its industrial portfolio quarterly under the ASC 820 fair-value framework. The valuation process is led by an independent third-party appraiser. With respect to the firm's valuation process: ",
      after: ". Cushman & Wakefield serves as the primary valuation agent of record, providing quarterly appraisals on 100% of properties, and Havencrest does not produce internal marks separate from the Cushman appraisals. CBRE provides semi-annual rotating secondary appraisals on approximately one-third of the portfolio each cycle as a quality-control check. Property existence and ownership are verified by SS&C through annual review of title insurance policies and deeds, and by PwC as part of the annual audit.",
      pageLabel: "Page 4 of 14",
    };
  }

  // Code of Ethics
  if (l.includes("code of ethics") || f.includes("ethics")) {
    return {
      section: "Code of Ethics — Personal Trading",
      before: "The Code of Ethics governs personal securities transactions by all employees of Havencrest Real Estate Advisors, LLC. With respect to the firm's personal trading controls: ",
      after: ". Pre-clearance is required for all personal securities transactions other than open-end mutual funds, government securities, and certain ETFs; brokerage statements are collected directly from custodians with no employee self-reporting; a 30-day minimum holding period applies; and annual attestations are completed by all employees. Given the firm's focus on private real estate, there is minimal overlap between employee personal trading and fund holdings, but the controls are nonetheless robust.",
      pageLabel: "Page 3 of 16",
    };
  }

  // WISP / Information Security
  if (l.includes("information security") || l.includes("wisp") || f.includes("wisp")) {
    return {
      section: "Written Information Security Program — Controls and Resilience",
      before: "Havencrest maintains a Written Information Security Program (WISP) together with an Incident Response Plan and Business Continuity Plan, all reviewed annually by Mandiant. With respect to the firm's information security and resilience controls: ",
      after: ". The firm operates a cloud-based Microsoft 365 stack with single sign-on through Microsoft Entra ID and mandatory MFA, CrowdStrike Falcon endpoint protection including DLP, annual SOC 2 Type II audits since 2018, annual Mandiant external penetration testing, and monthly KnowBe4 simulated phishing campaigns (rolling 12-month click rate of 1.7%). The firm has not experienced any material cybersecurity incidents, data breaches, or business disruptions in the past five years.",
      pageLabel: "Page 2 of 20",
    };
  }

  // SOC 2 Report
  if (l.includes("soc 2") || l.includes("soc2") || f.includes("soc")) {
    return {
      section: "SOC 2 Type II Report — FY2025",
      before: "This SOC 2 Type II report was prepared by Schneider Downs covering the fiscal year 2025 examination period for Havencrest Real Estate Advisors, LLC. With respect to the examination result: ",
      after: ". The report resulted in an unqualified opinion. Havencrest has commissioned annual SOC 2 Type II audits since 2018. Complementary external testing is provided by Mandiant, which conducts annual penetration testing; the 2025 test identified two low-severity findings, both remediated within 30 days. The firm maintains $20 million per occurrence / $20 million aggregate of cyber liability insurance.",
      pageLabel: "SOC 2 Report · Page 1",
    };
  }

  // Administration Agreement
  if (l.includes("administration agreement") || l.includes("admin")) {
    return {
      section: "Administration Agreement — Scope of Services",
      before: "This Administration Agreement sets out the services provided by SS&C Technologies to Havencrest Industrial Trust V, L.P. With respect to the administrator's engagement and scope: ",
      after: ". SS&C Technologies has served as administrator across all five Havencrest funds since 2010 and provides NAV calculation, investor capital activity processing, AML/KYC, FATCA/CRS, and REIT testing support. Sandra Chen (CFO) reviews SS&C's annual SOC 1 Type II report and conducts quarterly relationship calls. SS&C also calculates the carry waterfall through its proprietary system, reviewed by the CFO and approved by the CCO.",
      pageLabel: "Page 1 of 28",
    };
  }

  // Audit Letter / PwC
  if (l.includes("audit") || f.includes("audit")) {
    return {
      section: "PwC — Audit Confirmation",
      before: "PricewaterhouseCoopers LLP has provided the following confirmation in connection with its audit of Havencrest Industrial Trust V, L.P. and Alpine's operational due diligence review: ",
      after: ". PwC has served as Havencrest's auditor since 2010, a 15-year tenure, and delivers its annual opinion within 90 days of fiscal year-end. The audit fee for FY2024 was $580,000, and PwC also reviews REIT compliance under IRC Sections 856-860 as part of the annual audit. No restatements, material weaknesses, or significant deficiencies have been reported across the 15-year audit history.",
      pageLabel: "Audit Confirmation · Page 1",
    };
  }

  // Insurance Certificate
  if (l.includes("insurance") || f.includes("insurance")) {
    return {
      section: "Cyber Liability Insurance Certificate",
      before: "This certificate evidences the cyber liability insurance coverage maintained by Havencrest Real Estate Advisors, LLC. With respect to the coverage in force: ",
      after: ". The cyber liability limit is $20 million per occurrence / $20 million aggregate — institutional-grade for the firm's $3.4 billion AUM scale. The coverage supports the firm's broader resilience posture, which includes an annually reviewed WISP, IRP, and BCP, annual tabletop exercises simulating both cyber incidents and physical disruptions to the Chicago headquarters, and a clean five-year incident history.",
      pageLabel: "Insurance Certificate · Page 1",
    };
  }

  // Q4 2025 Investor Letter
  if (l.includes("investor letter") || l.includes("q4 2025") || f.includes("letter")) {
    return {
      section: "Q4 2025 Investor Letter",
      before: "This quarterly investor letter for Havencrest Industrial Trust V, L.P. was delivered within 45 days of quarter-end and signed by Patricia Vega (CEO) and Mark Donovan (CIO). With respect to the portfolio update communicated to Limited Partners: ",
      after: ". The letter runs approximately 22 to 28 pages and includes portfolio-level performance metrics, property-level commentary on the top 20 properties, new acquisitions and dispositions, tenant concentration metrics, leasing activity by region, and a market outlook. Havencrest hosts an annual investor day each May in Chicago, attended by approximately 78% of Limited Partners by capital, with property tours of two Chicago-area assets.",
      pageLabel: "Q4 2025 Letter · Page 1",
    };
  }

  // SEC EDGAR / IARD
  if (l.includes("edgar") || l.includes("iard") || l.includes("iapd") || l.includes("sec")) {
    return {
      section: "SEC EDGAR / IARD — Registered Investment Adviser Record",
      before: "Investment Adviser registration record for Havencrest Real Estate Advisors, LLC. The firm is registered with the U.S. Securities and Exchange Commission as an investment adviser (IARD/CRD 158263) since 2014. The record reflects: ",
      after: ". The firm's record shows no SEC examinations resulting in deficiency letters or enforcement actions, no material litigation in its 17-year history, and no material customer complaints on record. Alpine confirmed registration status via direct EDGAR/IARD query during the ODD review. The firm structures its funds as REITs and maintains a dedicated REIT compliance function in addition to its core investment adviser compliance program.",
      pageLabel: "IARD Record · Page 1",
    };
  }

  // Delaware register
  if (l.includes("delaware")) {
    return {
      section: "Delaware Division of Corporations — Entity Verification",
      before: "Alpine performed a direct check against the Delaware Division of Corporations register to confirm the existence and good standing of the Fund and its management entity. The register reflects the following: ",
      after: ". Havencrest Industrial Trust V, L.P. (Delaware limited partnership) and Havencrest Real Estate Advisors, LLC (Delaware limited liability company, formed April 22, 2008) were both confirmed on the register. No discrepancies were identified between the entity names disclosed by the Manager and the registered entities.",
      pageLabel: "Delaware Register · Page 1",
    };
  }

  // ODD Report
  if (l.includes("odd report") || f.includes("sample_re_havencrest") || f.includes("havencrest_trust")) {
    return {
      section: "Havencrest Industrial Trust V — ODD Report",
      before: "Alpine Due Diligence — Operational Due Diligence Report. ODD Engagement: Havencrest Real Estate Advisors, LLC. This report summarizes Alpine's analysis of the documents submitted, the management responses, and the third-party verifications obtained during the review. With respect to the matter cited: ",
      after: ". Alpine recommends an accept rating. The single YELLOW chapter (Investment Operations) reflects industry-inherent tenant concentration in the e-commerce-driven industrial strategy — with Amazon at 11.8% of NOI, near the 12% LPA cap — well-mitigated by tenant credit quality (82% investment-grade NOI) and lease duration (8.4-year weighted-average remaining lease term).",
      pageLabel: "ODD Report · Page 1",
    };
  }

  // Generic Havencrest fallback
  return {
    section: "Document Reference — Alpine Due Diligence File",
    before: `The following passage has been extracted from the referenced source (${sourceLabel}) maintained in Alpine's operational due diligence file for Havencrest Industrial Trust V, L.P. This material reflects information provided by Havencrest Real Estate Advisors, LLC or obtained from independent registries and third-party verifications as of the date stated. Alpine has reviewed this material in connection with its ODD program but has not independently verified all factual representations except as specifically noted in the accompanying ODD report. The specific passage cited in the ODD analysis states: `,
    after: ". Investors and Alpine personnel are reminded that any manager-provided document is proprietary and confidential and may not be reproduced or disclosed to third parties without the prior written consent of Havencrest Real Estate Advisors, LLC. Please refer to the complete source document for full context, all defined terms, and applicable disclaimers.",
    pageLabel: "Page 1",
  };
}
// ── Ridgeline Resort doc metadata ─────────────────────────────────────────────
function buildRidgelineResortDocMeta(filename: string, label: string) {
  const f = filename.toLowerCase();
  const l = label.toLowerCase();
  if (l.includes("form adv") || f.includes("form-adv") || f.includes("form_adv"))      return { title: "Form ADV (ERA) — Part 2A", subtitle: "Ridgeline Resort Capital, LLC", date: "Filed March 2026", badge: "Regulatory Filing" };
  if (l.includes("due diligence") || l.includes("ddq") || f.includes("ddq"))            return { title: "Due Diligence Questionnaire (2026)", subtitle: "Ridgeline Resort Capital, LLC", date: "2026", badge: "Fund Document" };
  if (l.includes("limited partnership") || f.includes("lpa"))                           return { title: "Limited Partnership Agreement — Fund III", subtitle: "Ridgeline Resort Holdings III, L.P.", date: "Effective 2025", badge: "Legal" };
  if (l.includes("private placement") || f.includes("ppm"))                             return { title: "Private Placement Memorandum — Fund III", subtitle: "Ridgeline Resort Holdings III, L.P.", date: "2025", badge: "Legal" };
  if (l.includes("valuation") || f.includes("valuation"))                               return { title: "Valuation Policy", subtitle: "Ridgeline Resort Capital, LLC", date: "Effective September 2024", badge: "Operations" };
  if (l.includes("code of ethics") || f.includes("code"))                               return { title: "Code of Ethics", subtitle: "Ridgeline Resort Capital, LLC", date: "Effective September 2024", badge: "Compliance" };
  if (l.includes("information security") || l.includes("wisp") || f.includes("wisp"))   return { title: "Written Information Security Program (WISP)", subtitle: "Ridgeline Resort Capital, LLC", date: "2024", badge: "Compliance" };
  if (l.includes("administration") || l.includes("admin") || f.includes("admin"))       return { title: "Administration Agreement — SS&C ALPS", subtitle: "Ridgeline Resort Holdings III, L.P.", date: "Engaged 2018", badge: "Service Provider Agreement" };
  if (l.includes("audit") || f.includes("audit"))                                       return { title: "KPMG LLP — Audit Confirmation", subtitle: "Ridgeline Resort Holdings III, L.P.", date: "FY2024", badge: "Third-Party Confirmation" };
  if (l.includes("insurance") || f.includes("insurance"))                               return { title: "Cyber Liability Insurance Certificate", subtitle: "Ridgeline Resort Capital, LLC", date: "2025–2026 Policy Year", badge: "Insurance" };
  if (l.includes("investor letter") || l.includes("q4 2025") || f.includes("letter"))   return { title: "Q4 2025 Investor Letter", subtitle: "Ridgeline Resort Holdings III, L.P.", date: "Q4 2025", badge: "Investor Communication" };
  if (l.includes("edgar") || l.includes("sec") || l.includes("iard") || l.includes("iapd")) return { title: "SEC EDGAR — Exempt Reporting Adviser Filing", subtitle: "Ridgeline Resort Capital, LLC", date: "ERA since 2017", badge: "SEC Verification" };
  if (l.includes("delaware"))                                                           return { title: "Delaware Division of Corporations — Entity Verification", subtitle: "Ridgeline Resort Holdings III, L.P. · Ridgeline Resort Capital, LLC", date: "Verified April 2026", badge: "Public Record" };
  if (l.includes("odd report") || l.includes("alpine") || f.includes("ridgeline_iii")) return { title: "Ridgeline Resort III — ODD Report (April 2026)", subtitle: "Ridgeline Resort Capital, LLC · Alpine ODD Review 2026", date: "Prepared April 2026", badge: "Alpine Analysis" };
  return { title: label, subtitle: "Ridgeline Resort Capital, LLC", date: "2026", badge: "Document" };
}

// ── Ridgeline Resort passage builder ──────────────────────────────────────────
function buildRidgelineResortPassage(quote: string, filename: string, sourceLabel: string): { before: string; after: string; section: string; pageLabel: string } {
  const f = filename.toLowerCase();
  const l = sourceLabel.toLowerCase();
  const q = quote.toLowerCase();

  // Form ADV (ERA)
  if (l.includes("form adv") || f.includes("form-adv") || f.includes("form_adv")) {
    if (q.includes("miami") || q.includes("primary location") || q.includes("phoenix") || q.includes("denver")) return {
      section: "Item 1 — Identifying Information",
      before: "Ridgeline Resort Capital, LLC is a Delaware limited liability company with its principal place of business and regional offices located in ",
      after: ". The firm is an opportunistic hospitality real estate adviser founded in 2015 by Jonathan Reid (Managing Partner, Chief Investment Officer) and Catherine Walsh (Co-Founder, Chief Operating Officer), both previously senior hospitality investment professionals at Starwood Capital Group. The firm files as an Exempt Reporting Adviser in reliance on the private fund adviser exemption under Section 203(m) of the Investment Advisers Act of 1940 and has filed in that capacity since 2017. All investors are accredited investors and qualified purchasers investing through the firm's private fund vehicles.",
      pageLabel: "Page 1 of 16",
    };
    if (q.includes("ridgeline resort capital")) return {
      section: "Item 1 — Identifying Information",
      before: "This Form ADV is filed by ",
      after: ", a Delaware limited liability company headquartered in Miami, Florida with a regional office in Phoenix, Arizona and a satellite presence in Denver, Colorado. The firm is an opportunistic hospitality real estate adviser founded in 2015 by Jonathan Reid and Catherine Walsh, both formerly of Starwood Capital Group, and files as an Exempt Reporting Adviser under Section 203(m) of the Investment Advisers Act of 1940. A transition to full Registered Investment Adviser status is planned for the fourth quarter of 2026.",
      pageLabel: "Page 1 of 16",
    };
    if (q.includes("720") || q.includes("aum") || q.includes("net assets") || q.includes("310")) return {
      section: "Item 5 — Information About Your Advisory Business",
      before: "As of December 31, 2025, the Adviser reports firmwide net assets of ",
      after: " under management across its advised private fund vehicles, together with $310 million of uncalled capital commitments. The firm has acquired 24 hospitality assets across three fund vintages, comprising approximately 8,400 keys. All advisory activity is conducted on a discretionary basis. The Adviser does not manage separately managed accounts or wrap-fee programs.",
      pageLabel: "Page 4 of 16",
    };
    if (q.includes("reid") || q.includes("walsh") || q.includes("60%") || q.includes("40%") || q.includes("ownership") || q.includes("starwood")) return {
      section: "Schedules A & B — Direct and Indirect Owners",
      before: "The Adviser is owned by its two founding principals: ",
      after: ". Jonathan Reid (Managing Partner, Chief Investment Officer) owns 60% and drives final acquisition decisions; Catherine Walsh (Co-Founder, Chief Operating Officer) owns 40%. Both founders previously held senior hospitality investment roles at Starwood Capital Group and have worked together for 18 years. There are no outside institutional owners or third-party controlling interests in the management company, and no third senior partner exists outside the two founders.",
      pageLabel: "Page 7 of 16",
    };
    return {
      section: "Item 6 — Performance-Based Fees and Side-by-Side Management",
      before: "The Adviser receives a management fee and a performance-based carried interest allocation from the funds it advises. The management fee is 1.50% per annum on commitments during the investment period and carried interest is 20% of net profits over an 8% preferred return with a 50/50 catch-up. With respect to the matters described in this Item: ",
      after: ". Carried interest is calculated on a deal-by-deal basis subject to a European-style full clawback at fund-end. The General Partner commits 2% of total commitments in cash, invested pari passu with Limited Partners. The Adviser does not currently advise registered investment companies or business development companies.",
      pageLabel: "Page 5 of 16",
    };
  }

  // DDQ
  if (l.includes("due diligence") || l.includes("ddq") || f.includes("ddq")) {
    if (q.includes("ss&c") || q.includes("kpmg") || q.includes("administrator") || q.includes("auditor") || q.includes("wells fargo") || q.includes("goodwin")) return {
      section: "Section 5 — Service Providers",
      before: "Fund Administrator: ",
      after: ". SS&C ALPS Alternative Fund Services has served as fund administrator since 2018, providing NAV calculation, investor capital activity, AML/KYC, and FATCA/CRS compliance. Independent auditor: KPMG LLP, engaged since 2018, delivers its annual opinion within 100 days of fiscal year-end. Primary banking is held at Wells Fargo, N.A. Fund counsel is Goodwin Procter LLP, with Hunton Andrews Kurth serving as hospitality transaction counsel.",
      pageLabel: "Page 22 of 48",
    };
    if (q.includes("marriott") || q.includes("hyatt") || q.includes("hilton") || q.includes("operator") || q.includes("auberge") || q.includes("two roads")) return {
      section: "Section 6 — Hotel Operators",
      before: "The fund's properties are operated under property-by-property management agreements with leading hospitality brands. Operator allocation is as follows: ",
      after: ". Independent operators including Two Roads Hospitality and Auberge Resorts handle select boutique luxury positions. Ridgeline Resort maintains a written Hotel Operator Diligence Policy requiring financial review, operator track record analysis at comparable properties, on-site visits to operator headquarters and managed properties, and reference checks across hotel ownership groups. Each management agreement carries detailed performance metrics and termination rights.",
      pageLabel: "Page 26 of 48",
    };
    if (q.includes("susan mitchell") || q.includes("cipperman") || q.includes("compliance") || q.includes("era") || q.includes("ria")) return {
      section: "Section 4 — Compliance and Regulatory",
      before: "The firm files as an Exempt Reporting Adviser under Section 203(m) of the Investment Advisers Act and is planning a transition to full RIA registration in the fourth quarter of 2026. With respect to compliance oversight and program administration: ",
      after: ". Susan Mitchell serves as Chief Compliance Officer, dedicated to compliance with no investment role, having joined in 2020 from Cipperman Compliance Services. She is the sole in-house compliance professional. Ridgeline Resort engages Cipperman Compliance Services as outside compliance consultant since inception, performing an annual compliance review and supporting the planned RIA transition. The compliance manual is dated September 2024 with a 2026 revision in progress.",
      pageLabel: "Page 14 of 48",
    };
    if (q.includes("22 fte") || q.includes("headcount") || q.includes("revenue management") || q.includes("krishnan") || q.includes("acquisitions") || q.includes("thompson") || q.includes("park")) return {
      section: "Section 2 — Firm Background and Team",
      before: "The firm employs a total of ",
      after: ". The team comprises 8 acquisitions professionals, 6 in asset management, a specialized 3-person revenue management team led by Anita Krishnan (former Marriott corporate revenue management), 3 in operations and finance, 1 compliance professional, and 1 administrative. Ryan Thompson (Head of Acquisitions, joined 2017) was formerly a Director at Brookfield Hotels and David Park (CFO, joined 2018) is a CPA formerly of Hersha Hospitality. Investment professionals average 10 years of hospitality experience.",
      pageLabel: "Page 5 of 48",
    };
    if (q.includes("davenport") || q.includes("departed") || q.includes("turnover") || q.includes("hireright") || q.includes("background")) return {
      section: "Section 2 — Firm Background and Team",
      before: "With respect to recent personnel changes and screening procedures: ",
      after: ". Marcus Davenport (Senior Asset Manager) departed in July 2025 to join Hyatt Capital. Background checks are performed externally by HireRight on initial hire only, with no refresh cadence currently in place. No other senior departures have occurred during the review period.",
      pageLabel: "Page 6 of 48",
    };
    if (q.includes("succession") || q.includes("key person insurance") || q.includes("$10m") || q.includes("life insurance")) return {
      section: "Section 2 — Governance and Succession",
      before: "With respect to governance continuity and key person protection: ",
      after: ". No formal written succession plan exists. Key person life insurance of $10 million is in place on Jonathan Reid only; Catherine Walsh is not covered. The two founders own all firm equity on a 60/40 basis, with no third senior partner to provide an independent governance counterbalance.",
      pageLabel: "Page 7 of 48",
    };
    if (q.includes("four seasons aspen") || q.includes("11.4") || q.includes("concentration") || q.includes("sun belt") || q.includes("ltv") || q.includes("revpar") || q.includes("ltv")) return {
      section: "Section 7 — Portfolio and Investment Operations",
      before: "With respect to portfolio concentration, leverage, and underwriting controls as of December 31, 2025: ",
      after: ". The largest single property, Four Seasons Aspen, represents 11.4% of fund commitments against the 12% LPA cap; the top three properties combined represent 31% of fund NAV. Asset-level non-recourse mortgage debt is sourced from hotel-specialist lenders at 55–65% LTV per asset (aggregate fund LTV of 61%). The underwriting model stress-tests RevPAR ±15% from base case, and a dedicated 3-person revenue management team works directly with property operators on pricing and distribution.",
      pageLabel: "Page 30 of 48",
    };
    if (q.includes("ridgeline resort i") || q.includes("ridgeline resort ii") || q.includes("ridgeline resort iii") || q.includes("irr") || q.includes("moic") || q.includes("track record") || q.includes("16.8") || q.includes("13.4")) return {
      section: "Section 3 — Track Record",
      before: "The firm has raised three funds across its history. With respect to realized and interim performance: ",
      after: ". Ridgeline Resort I (2016, $185M) is fully realized at a 16.8% gross IRR and 1.81x MOIC across 8 investments; Ridgeline Resort II (2020, $385M) is approximately 58% realized at a 13.4% interim gross IRR, affected by an extended COVID-period hold; and Ridgeline Resort III (current) targets $750M with an $850M hard cap and had raised $470M through December 2025.",
      pageLabel: "Page 9 of 48",
    };
    return {
      section: "Section 1 — Firm Overview",
      before: "Ridgeline Resort Capital, LLC pursues an opportunistic hospitality real estate strategy across luxury and upper-upscale resorts, boutique urban hotels in primary travel destinations, and selective ski-resort acquisitions. With respect to the matter described in this section: ",
      after: ". The firm acquires underperforming or rebrand-candidate assets, repositions operations through brand affiliation changes, capex renovation programs, and revenue management optimization, then exits to strategic operators or institutional capital after 4–6 years of stabilization. Ridgeline Resort is headquartered in Miami with regional offices in Phoenix and Denver.",
      pageLabel: "Page 3 of 48",
    };
  }

  // LPA / PPM
  if (l.includes("limited partnership") || l.includes("private placement") || f.includes("lpa") || f.includes("ppm")) {
    if (q.includes("delaware") || q.includes("cayman") || q.includes("feeder") || q.includes("general partner") || q.includes("holdings iii")) return {
      section: "Section 1 — Organization and Formation",
      before: "Ridgeline Resort Holdings III, L.P. (the \"Fund\") is organized as a ",
      after: " and is structured with a Cayman feeder, Ridgeline Resort Holdings III (Cayman), Ltd., for non-US and US tax-exempt investors. Ridgeline Resort Capital, LLC serves as the investment manager and General Partner of record. Both the Fund and the management entity have been confirmed against the Delaware Division of Corporations register.",
      pageLabel: "Page 4 of 68",
    };
    if (q.includes("strategy") || q.includes("opportunistic") || q.includes("resorts") || q.includes("boutique") || q.includes("ski")) return {
      section: "Section 2 — Investment Strategy and Objectives",
      before: "The Fund pursues an opportunistic hospitality real estate strategy, investing across ",
      after: ". The Manager acquires underperforming or rebrand-candidate hospitality assets, repositions them through brand affiliation changes, capex renovation programs, and revenue management optimization, and targets exits after 4–6 years of stabilization. Maximum single-property concentration is 12% of total commitments and maximum single-market concentration is 30%.",
      pageLabel: "Page 11 of 68",
    };
    if (q.includes("12%") || q.includes("30%") || q.includes("concentration cap") || q.includes("single-property") || q.includes("single-market")) return {
      section: "Section 5 — Investment Limitations",
      before: "The Fund's organizational documents impose the following diversification limits: ",
      after: ". The single-property cap of 12% is higher than typical multifamily funds, reflecting hospitality's per-asset capital intensity, while the single-market cap of 30% constrains geographic concentration. These limits may be exceeded only with LPAC approval.",
      pageLabel: "Page 16 of 68",
    };
    if (q.includes("key person") || q.includes("removal") || q.includes("mfn") || q.includes("most-favored") || q.includes("lpac") || q.includes("vote")) return {
      section: "Section 12 — LP Protections and Key Person Provision",
      before: "The Fund affords Limited Partners the following governance protections: ",
      after: ". Most-favored-nation rights are available to commitments of $25 million or more; the LPAC holds 7 seats; for-cause GP removal requires a 50% LP vote and no-fault removal a 75% LP vote. The key person clause is triggered if either Jonathan Reid OR Catherine Walsh ceases substantially full-time involvement in the Fund.",
      pageLabel: "Page 33 of 68",
    };
    if (q.includes("term") || q.includes("7 year") || q.includes("seven year") || q.includes("investment period") || q.includes("harvest") || q.includes("extension")) return {
      section: "Section 9 — Term and Investment Period",
      before: "The Fund's duration is structured as follows: ",
      after: ". This comprises a 4-year investment period and a 3-year harvest period, with up to two one-year extensions subject to LPAC approval. The 7-year base term is shorter than core real estate strategies, reflecting the value-add to opportunistic positioning and the typical 4–6 year hold per asset.",
      pageLabel: "Page 25 of 68",
    };
    if (q.includes("2.0%") || q.includes("2%") || q.includes("gp commit") || q.includes("$17m") || q.includes("pari passu")) return {
      section: "Section 8 — General Partner Commitment",
      before: "The General Partner has committed ",
      after: ", equating to approximately $17 million at the $850 million hard cap, contributed in cash and invested pari passu with Limited Partners. The GP commitment is funded in cash rather than through a management fee waiver, aligning the General Partner with Limited Partner economics.",
      pageLabel: "Page 22 of 68",
    };
    return {
      section: "Section 7 — Management Fee and Carried Interest",
      before: "The General Partner is entitled to a management fee of 1.50% per annum on total commitments during the 4-year investment period, stepping to 1.25% on NAV thereafter, and a carried interest allocation of 20% of net profits over an 8% preferred return with a 50/50 catch-up. With respect to the Fund's economic terms: ",
      after: ". Carried interest is calculated on a deal-by-deal basis subject to a European-style full clawback at fund-end, which substantially mitigates early-distribution risk. The General Partner commits 2% of total commitments in cash, invested pari passu with Limited Partners.",
      pageLabel: "Page 18 of 68",
    };
  }

  // Valuation Policy
  if (l.includes("valuation") || f.includes("valuation")) {
    if (q.includes("cushman") || q.includes("appraisal") || q.includes("independent") || q.includes("annual") || q.includes("semi-annual")) return {
      section: "Section 4 — Independent Third-Party Review",
      before: "Independent valuation oversight is provided as follows: ",
      after: ". Cushman & Wakefield Hospitality provides independent appraisals on all properties on an annual cadence. Alpine notes that for a cyclical hospitality strategy with rapidly changing RevPAR trends, semi-annual or quarterly appraisals would provide stronger independent oversight, particularly through market cycle transitions; annual cadence is acceptable for stabilized post-renovation assets but limits oversight during the value-add hold period.",
      pageLabel: "Page 6 of 14",
    };
    if (q.includes("committee") || q.includes("non-investment") || q.includes("agent of record") || q.includes("in-house")) return {
      section: "Section 3 — Valuation Governance",
      before: "Valuation governance is administered as follows: ",
      after: ". The Valuation Committee comprises five members — David Park (CFO, Chair), Anita Krishnan (Head of Revenue Management), Catherine Walsh (COO), Susan Mitchell (CCO), and one rotating SS&C senior representative — of whom 2 of 5 are non-investment. Ridgeline Resort serves as the valuation agent of record, with Cushman & Wakefield Hospitality providing an annual independent review. Alpine prefers 3 or more non-investment members.",
      pageLabel: "Page 4 of 14",
    };
    return {
      section: "Section 2 — Valuation Process and Methodology",
      before: "Ridgeline Resort Capital values its hospitality portfolio quarterly under the ASC 820 fair-value framework. Each property is valued using three approaches — DCF with hospitality-specific assumptions, sales comparable, and replacement cost. With respect to the firm's valuation process: ",
      after: ". The DCF approach typically receives 65–75% weighting in hospitality, higher than industrial or multifamily given cash flow sensitivity to RevPAR. Property existence and ownership is verified by SS&C through annual review of title insurance policies and deeds, and KPMG verifies property existence as part of the annual audit.",
      pageLabel: "Page 5 of 14",
    };
  }

  // Code of Ethics
  if (l.includes("code of ethics") || f.includes("code")) {
    return {
      section: "Code of Ethics — Personal Trading",
      before: "The Code of Ethics governs personal securities transactions of all supervised persons. With respect to the personal trading controls in effect: ",
      after: ". Pre-clearance is required for all securities transactions other than open-end mutual funds and US Treasuries, a 30-day minimum holding period applies, and annual attestations are completed. Brokerage statements are submitted quarterly by employees through Cipperman Compliance Services' portal rather than collected directly from custodians. The Code is dated September 2024 and is being refreshed in connection with the planned RIA transition.",
      pageLabel: "Page 3 of 18",
    };
  }

  // WISP / Information Security
  if (l.includes("information security") || l.includes("wisp") || f.includes("wisp")) {
    return {
      section: "Written Information Security Program — Controls and Resilience",
      before: "Ridgeline Resort Capital maintains a Written Information Security Program (WISP), Incident Response Plan (IRP), and Business Continuity Plan (BCP), supported by Vantage Tech LLC as outsourced IT and cybersecurity provider since 2022. With respect to the program controls and resilience posture: ",
      after: ". The firm operates on a Microsoft 365 stack with Microsoft Entra ID single sign-on and mandatory MFA, and Microsoft Defender for endpoint protection (without DLP). Ridgeline Resort has not commissioned a SOC 2 audit; the first external penetration test was performed by Bishop Fox in September 2024, and the most recent BCP tabletop exercise was conducted in May 2023. KnowBe4 phishing simulations run quarterly with a rolling click rate of 5.2%, above the 3.2% financial services benchmark.",
      pageLabel: "Page 4 of 20",
    };
  }

  // Administration Agreement (SS&C)
  if (l.includes("administration") || l.includes("admin") || f.includes("admin")) {
    return {
      section: "Administration Agreement — Scope of Services",
      before: "This Administration Agreement engages SS&C ALPS Alternative Fund Services as fund administrator to Ridgeline Resort Holdings III, L.P. With respect to the administrator and the scope of its engagement: ",
      after: ". SS&C ALPS has served as administrator since 2018 (initially engaged for Ridgeline Resort II) and provides full middle- and back-office services including NAV calculation, investor capital activity, AML/KYC, FATCA/CRS compliance, and carry waterfall computation through its proprietary system. David Park (CFO) reviews SS&C's annual SOC 1 Type II report. Property existence is verified by SS&C through annual review of title insurance policies and deeds.",
      pageLabel: "Page 2 of 26",
    };
  }

  // Audit Letter (KPMG)
  if (l.includes("audit") || f.includes("audit")) {
    return {
      section: "KPMG LLP — Audit Confirmation",
      before: "Alpine obtained confirmation directly from KPMG LLP regarding its audit engagement for Ridgeline Resort Holdings III, L.P. KPMG confirmed the following: ",
      after: ". KPMG has served as independent auditor since 2018 and delivers its annual opinion within 100 days of fiscal year-end. The audit fee for FY2024 was $245,000. KPMG confirmed no restatements or material weaknesses since the inception of its engagement, and verifies property existence as part of the annual audit procedures.",
      pageLabel: "Audit Confirmation · Page 1",
    };
  }

  // Insurance Certificate
  if (l.includes("insurance") || f.includes("insurance")) {
    return {
      section: "Cyber Liability Insurance Certificate",
      before: "The Certificate of Insurance evidences the firm's cyber liability coverage. With respect to the limits in force: ",
      after: ". The cyber liability limit is $7.5 million per occurrence and $7.5 million aggregate, which Alpine considers modest for the firm's $720 million AUM — institutional benchmarks at this scale typically range $10 million or more, with higher coverage warranted for hospitality given guest payment card data exposure. Alpine has recommended increasing the limit to at least $15 million at the next renewal.",
      pageLabel: "Insurance Certificate · Page 1",
    };
  }

  // Q4 2025 Investor Letter
  if (l.includes("investor letter") || l.includes("q4 2025") || f.includes("letter")) {
    return {
      section: "Q4 2025 Investor Letter",
      before: "The Q4 2025 Investor Letter, delivered within 60 days of quarter-end and signed jointly by Jonathan Reid and Catherine Walsh, reports on portfolio performance and capital activity. The letter states: ",
      after: ". The 18–22 page quarterly letter includes a portfolio-level NAV summary, property-level RevPAR and NOI commentary, brand and operator updates, renovation progress tracking, debt summary, and market outlook. Ridgeline Resort also hosts an annual investor day each March in Miami attended by approximately 65% of LPs by capital, featuring a differentiated presentation from the revenue management team.",
      pageLabel: "Q4 2025 Letter · Page 1",
    };
  }

  // SEC EDGAR / ERA verification
  if (l.includes("edgar") || l.includes("sec") || l.includes("iard") || l.includes("iapd")) {
    return {
      section: "SEC EDGAR — Exempt Reporting Adviser Record",
      before: "SEC EDGAR filing record for Ridgeline Resort Capital, LLC. The firm is reported as an Exempt Reporting Adviser relying on the private fund adviser exemption under Section 203(m) of the Investment Advisers Act of 1940, and has filed in that capacity since 2017. The record reflects: ",
      after: ". The firm's record shows no SEC examinations, regulatory actions, or disciplinary events for the firm or its principals. Current AUM of $720 million exceeds the threshold for ERA status, and the Manager has indicated a transition to full Registered Investment Adviser registration planned for the fourth quarter of 2026. Alpine confirmed ERA status via direct EDGAR query during the ODD review.",
      pageLabel: "EDGAR Record · Page 1",
    };
  }

  // Delaware register
  if (l.includes("delaware")) {
    return {
      section: "Delaware Division of Corporations — Entity Verification",
      before: "Alpine performed a direct check against the Delaware Division of Corporations register to confirm the existence and good standing of the Fund and its manager. The register reflects the following: ",
      after: ". Ridgeline Resort Holdings III, L.P. (Delaware limited partnership) and Ridgeline Resort Capital, LLC (Delaware limited liability company, formed January 17, 2015) were both confirmed on the register. No discrepancies were identified between the entity names disclosed by the Manager and the registered entities.",
      pageLabel: "Delaware Register · Page 1",
    };
  }

  // ODD Report / Alpine internal analysis
  if (l.includes("odd report") || l.includes("alpine") || f.includes("ridgeline_iii")) {
    return {
      section: "Ridgeline Resort III — ODD Report · Cross-Reference Analysis",
      before: "Alpine Due Diligence — Operational Due Diligence Report. ODD Engagement: Ridgeline Resort Capital, LLC · Ridgeline Resort Holdings III, L.P. This report summarizes Alpine's analysis of the documents submitted, the management responses, and the third-party verifications obtained during the review. The following finding was identified: ",
      after: ". The Fund received an overall YELLOW (watchlist) rating, with four YELLOW chapters reflecting emerging-manager governance characteristics combined with the cyclical sector exposure inherent in hospitality real estate. These are partially mitigated by a strong realized track record in Ridgeline Resort I, documented COVID-period resilience in Ridgeline Resort II, top-tier hotel operator relationships, and a differentiated dedicated revenue management team.",
      pageLabel: "ODD Report · Page 1",
    };
  }

  // Generic Ridgeline Resort fallback
  return {
    section: "Document Reference — Alpine Due Diligence File",
    before: `The following passage has been extracted from the referenced source (${sourceLabel}) maintained in Alpine's operational due diligence file for Ridgeline Resort Holdings III, L.P. This material reflects information provided by Ridgeline Resort Capital, LLC or obtained from independent registries and third-party verifications as of the date stated. Alpine has reviewed this material in connection with its ODD program but has not independently verified all factual representations except as specifically noted in the accompanying ODD report. The specific passage cited in the ODD analysis states: `,
    after: ". Investors and Alpine personnel are reminded that any manager-provided document is proprietary and confidential and may not be reproduced or disclosed to third parties without the prior written consent of Ridgeline Resort Capital, LLC. Please refer to the complete source document for full context, all defined terms, and applicable disclaimers.",
    pageLabel: "Page 1",
  };
}

// ── Fund source-preview dispatch ──────────────────────────────────────────────
type SourcePreviewProfile = {
  sourceMeta: Record<string, { label: string; type: string; filename?: string; size?: string }>;
  docMeta: (filename: string, label: string) => { title: string; subtitle: string; date: string; badge: string };
  passage: (quote: string, filename: string, sourceLabel: string) => { before: string; after: string; section: string; pageLabel: string };
  brand: string;
};

const FUND_SOURCE_PROFILES: Record<string, SourcePreviewProfile> = {
  "aurora-capital-iv":       { sourceMeta: AURORA_SOURCE_META,           docMeta: buildAuroraDocMeta,          passage: buildAuroraPassage,          brand: "ALPINE x AURORA CAPITAL MANAGEMENT" },
  "trellis-capital-iv":      { sourceMeta: TRELLIS_SOURCE_META,          docMeta: buildTrellisDocMeta,         passage: buildTrellisPassage,         brand: "ALPINE x TRELLIS CAPITAL MANAGEMENT" },
  "granite-vii-credit":      { sourceMeta: GRANITE_SOURCE_META,          docMeta: buildGraniteDocMeta,         passage: buildGranitePassage,         brand: "ALPINE x GRANITE CAPITAL MANAGEMENT" },
  "cordova-jv-iii":          { sourceMeta: CORDOVA_SOURCE_META,          docMeta: buildCordovaDocMeta,         passage: buildCordovaPassage,         brand: "ALPINE x CORDOVA CAPITAL PARTNERS" },
  "blackpine-credit-iv":     { sourceMeta: BLACKPINE_SOURCE_META,        docMeta: buildBlackpineDocMeta,       passage: buildBlackpinePassage,       brand: "ALPINE x BLACKPINE ASSET MANAGEMENT" },
  "havencrest-industrial-v": { sourceMeta: HAVENCREST_SOURCE_META,       docMeta: buildHavencrestDocMeta,      passage: buildHavencrestPassage,      brand: "ALPINE x HAVENCREST REAL ESTATE ADVISORS" },
  "ridgeline-resort-iii":    { sourceMeta: RIDGELINE_RESORT_SOURCE_META, docMeta: buildRidgelineResortDocMeta, passage: buildRidgelineResortPassage, brand: "ALPINE x RIDGELINE RESORT CAPITAL" },
};

// ── RefDot ────────────────────────────────────────────────────────────────────

export function RefDot({ source, quote, context: _context, color, slug, sources, variant = "table" }: RefDotProps) {
  const [panel, setPanel] = useState<"left" | "right" | null>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const dotRef = useRef<HTMLSpanElement>(null);

  const profile = slug ? FUND_SOURCE_PROFILES[slug] : undefined;
  const lookupMeta = (s: string) =>
    (profile ? profile.sourceMeta[s] : SOURCE_META[s]) || { label: s, type: "Source" };

  // A single dot may carry multiple (source, quote) pairs — renderCitations
  // merges directly-adjacent [[REF]] tokens into one marker. Normalize to a
  // list; the panel renders the active entry and (when >1) lets the reader switch.
  const sourceList = sources && sources.length > 0 ? sources : [{ source, quote }];
  const safeIdx = Math.min(activeIdx, sourceList.length - 1);
  const active = sourceList[safeIdx];
  const meta = lookupMeta(active.source);

  const handleClick = () => {
    if (panel !== null) {
      setPanel(null);
      return;
    }
    if (dotRef.current) {
      const rect = dotRef.current.getBoundingClientRect();
      const side = rect.left < window.innerWidth / 2 ? "right" : "left";
      setActiveIdx(0);
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
  const label = meta.label ?? active.source;
  const docMeta = profile ? profile.docMeta(filename, label) : buildDocMeta(filename, label);
  const { before, after, section, pageLabel } = profile
    ? profile.passage(active.quote, filename, label)
    : buildPassage(active.quote, filename);
  const ariaLabel =
    sourceList.length > 1
      ? `${sourceList.length} sources: ${sourceList.map((s) => lookupMeta(s.source).label).join("; ")}`
      : `Source: ${label}`;

  const panelWidth = "min(540px, 44vw)";

  return (
    <>
      <span
        ref={dotRef}
        role="button"
        tabIndex={0}
        aria-label={ariaLabel}
        aria-haspopup="dialog"
        aria-expanded={panel !== null}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleClick();
          }
        }}
        className={`citation-dot citation-dot--${variant}`}
        title={ariaLabel}
      >
        <span
          aria-hidden
          className={`citation-dot__pip ${variant === "prose" ? "" : DOT_COLORS[color]}`}
        />
      </span>

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

              {/* Multi-source switcher — only when this dot merged several citations */}
              {sourceList.length > 1 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }} role="tablist" aria-label="Sources for this sentence">
                  {sourceList.map((s, i) => {
                    const on = i === safeIdx;
                    return (
                      <button
                        key={i}
                        role="tab"
                        aria-selected={on}
                        onClick={() => setActiveIdx(i)}
                        style={{
                          fontSize: 10.5, fontWeight: 600, fontFamily: "sans-serif",
                          padding: "4px 10px", borderRadius: 999, cursor: "pointer",
                          color: on ? "#0f1117" : "#9ca3af",
                          background: on ? "#e5e7eb" : "rgba(255,255,255,0.05)",
                          border: `1px solid ${on ? "#e5e7eb" : "rgba(255,255,255,0.1)"}`,
                        }}
                      >
                        {lookupMeta(s.source).label}
                      </button>
                    );
                  })}
                </div>
              )}

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
                    <span style={{ fontSize: 9, fontWeight: 700, color: "#93c5fd", letterSpacing: "0.12em" }}>{profile ? profile.brand : "ALPINE x RIDGELINE CAPITAL PARTNERS"}</span>
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
                      }}>{active.quote}</mark>{after}
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
                ) : !filename ? (
                  <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "9px 16px", fontSize: 11, fontWeight: 500, color: "#9ca3af", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, fontFamily: "sans-serif" }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                    {docMeta.badge} — verification record (not a downloadable document)
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
                      onClick={() => { const u = getDemoFileUrl(filename); if (u) window.open(u, "_blank"); }}
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
