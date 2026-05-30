import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getCurrentManager } from "@/lib/manager/access";

function db() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

const ANSWERS: Array<{
  question_id: string;
  chapter_num: number;
  answer_text?: string;
  answer_choice?: string;
  answer_multi?: string[];
}> = [
  // 1.1 Ownership Structure
  { question_id: "01-legal-name",                chapter_num: 1, answer_text: "Blackpine Capital Management, L.P." },
  { question_id: "01-affiliates",                chapter_num: 1, answer_text: "Meridian Asset Management Ltd.; Meridian Blackpine Wealth Solutions LLC; Blackpine (Beijing) Investment Management Co., Ltd.; Blackpine Capital (Australia) Pty Limited; Blackpine Capital (Hong Kong) Limited; Blackpine Capital (Seoul) Ltd.; Blackpine Capital Management (Dubai) Limited; Blackpine Capital Management (Europe) LLP; Blackpine Capital Management (International) Limited; Blackpine Capital Management (Lux) S.à r.l.; Blackpine Capital Management (UK) LLP; Blackpine Capital Management Pte Ltd.; Blackpine France S.A.S.; Blackpine Fund Advisors, LLC; Blackpine GmbH; Blackpine International Holdings, LLC; Blackpine Japan, Inc.; Blackpine Overseas Investment Fund Management (Shanghai) Co., Ltd.; BCM Investments, LLC" },
  { question_id: "01-founded",                   chapter_num: 1, answer_text: "Management company: April 7, 1995; Fund: March 1, 2022" },
  { question_id: "01-primary-office",            chapter_num: 1, answer_text: "Los Angeles, CA" },
  { question_id: "01-other-offices",             chapter_num: 1, answer_text: "Stamford (CT), London, Hong Kong, Singapore, Tokyo, Seoul, Sydney, Shanghai, Beijing, Dubai, Luxembourg, Amsterdam, Dublin, Mumbai, Stockholm" },
  { question_id: "01-aum-current",               chapter_num: 1, answer_text: "$183.17B (Sep 30, 2023) vs $163.23B (prior year-end). AUM one year ago: $163.23 billion." },
  { question_id: "01-aum-growth-25",             chapter_num: 1, answer_choice: "No" },
  { question_id: "01-ownership",                 chapter_num: 1, answer_text: "Meridian Corporation: 68% (held indirectly through Blackpine Capital Group, LLC (\"BCG\") and Atlas BCM Holdings LLC); Current and former Blackpine executives and employees: 32% (held through BCGH and BEP). No single party holds a controlling equity interest." },
  { question_id: "01-publicly-traded",           chapter_num: 1, answer_text: "Previously listed on NYSE (ticker: BPC, since April 12, 2012). Taken private on September 30, 2019 by Meridian Asset Management Ltd. (NYSE: MAM, TSX: MAM, ENX: MAMX). Currently indirectly publicly traded through Meridian." },
  { question_id: "01-investment-professionals",  chapter_num: 1, answer_text: "392" },
  { question_id: "01-other-employees",           chapter_num: 1, answer_text: "562" },

  // 1.2 Key Persons & Succession
  { question_id: "01-back-office-professionals", chapter_num: 1, answer_text: "294" },
  { question_id: "01-total-headcount",           chapter_num: 1, answer_text: "1,248" },
  { question_id: "01-key-person-departures",     chapter_num: 1, answer_text: "Yes — four senior departures in the last 3 years:\n(1) Jonathan Weatherly (CEO, ~10 years tenure) — departed Q1 2024; succeeded by Robert Langford and Arman Petrossian as Co-CEOs.\n(2) Devika Kapoor (MD, IT) — departed April 27, 2023; succeeded by Eric Tomaszewski.\n(3) Lawrence Rowland (MD, Head of Operations Data) — departed June 1, 2023; responsibilities assumed by Natalie Jensen and Chitra Hegde.\n(4) Tadashi Tsukamoto (MD, Marketing) — departed June 11, 2023; succeeded by Mark Chamberlain." },
  { question_id: "01-departures-amicable",       chapter_num: 1, answer_choice: "Yes" },
  { question_id: "01-hiring-plans",              chapter_num: 1, answer_text: "The firm hires opportunistically across its business as needs arise; no specific headcount targets disclosed." },
  { question_id: "01-deferred-comp",             chapter_num: 1, answer_choice: "Yes" },
  { question_id: "01-vesting",                   chapter_num: 1, answer_text: "25% per year over four years" },

  // 1.3 Governance & Board Oversight
  { question_id: "01-audit-committee",           chapter_num: 1, answer_choice: "Yes" },
  { question_id: "01-audit-members",             chapter_num: 1, answer_text: "Adrian Sheldon, Robert Langford, Pablo Uriarte" },

  // 1.4 Conflicts of Interest
  { question_id: "01-insider-capital",           chapter_num: 1, answer_text: "$13.5 billion (~7.4% of firm AUM, as of Sep 30, 2023)" },

  // 2.1 Regulatory Registration & Status
  { question_id: "02-regulators",               chapter_num: 2, answer_text: "SEC (registered investment adviser since 1995); CFTC/NFA (registered CPO/CTA since 2013); FINRA; Monetary Authority of Singapore (MAS); Australian Securities and Investments Commission (ASIC); Securities and Futures Commission (SFC, Hong Kong); Commission de Surveillance du Secteur Financier (CSSF, Luxembourg); Dubai Financial Services Authority (DFSA); Financial Conduct Authority (FCA, UK); Financial Services Agency (FSA, Japan); AIFMD (authorized as AIFM)." },
  { question_id: "02-examinations",             chapter_num: 2, answer_text: "Yes — the firm has been subject to regulatory examinations over the past 10 years by multiple regulators, including the SEC, DFSA, SFC, NFA, MAS, and FINRA." },
  { question_id: "02-sanctions",                chapter_num: 2, answer_text: "Yes — July 2018: SEC imposed a fine of $100,000 related to political contributions made by three employees totaling $2,050, in violation of the pay-to-play rule (Rule 206(4)-5 under the Investment Advisers Act of 1940). No other material regulatory sanctions in the past 10 years." },
  { question_id: "02-aifmd",                    chapter_num: 2, answer_text: "Yes — the firm is subject to AIFMD through its Luxembourg-based entity, Blackpine Capital Management (Lux.) S.à r.l., which is authorized as an Alternative Investment Fund Manager (AIFM) by the CSSF." },

  // 2.2 Compliance Program
  { question_id: "02-cco-name",                 chapter_num: 2, answer_text: "Ronan Villiers (CCO), supported by a team of 62 legal and compliance professionals." },
  { question_id: "02-cco",                      chapter_num: 2, answer_choice: "Yes, dedicated CCO" },
  { question_id: "02-background-checks",        chapter_num: 2, answer_text: "Yes — third-party background checks are conducted using ScreenCorp and Verity Verification Systems." },
  { question_id: "02-external-consultants",     chapter_num: 2, answer_text: "Yes — Apex Compliance Partners (mock audits) and Ironbridge Advisors (specialized compliance testing)." },
  { question_id: "02-mock-audit",               chapter_num: 2, answer_text: "August 2022, conducted by Apex Compliance Partners. No material findings identified." },
  { question_id: "02-compliance-manual-date",   chapter_num: 2, answer_text: "Compliance Manual dated January 2023; Code of Ethics dated February 2023." },
  { question_id: "02-manual-updated",           chapter_num: 2, answer_text: "2023 — no material changes from prior version." },
  { question_id: "02-training",                 chapter_num: 2, answer_text: "December 2023 — firm-wide training delivered via Workday online modules, covering the Code of Ethics and insider trading policies." },
  { question_id: "02-personal-trading",         chapter_num: 2, answer_text: "Yes — employees may trade in personal accounts subject to prior approval from the compliance team and a minimum 60-day holding period." },
  { question_id: "02-soft-dollars",             chapter_num: 2, answer_choice: "No" },
  { question_id: "02-expert-networks",          chapter_num: 2, answer_text: "InsightBridge, ConsultEdge, Cobalt Research Group, Axiom Insights." },
  { question_id: "02-compliance-accomp",        chapter_num: 2, answer_text: "Approximately 10% of expert network calls are monitored anonymously by compliance personnel." },
  { question_id: "02-insurance",                chapter_num: 2, answer_choice: "Yes" },
  { question_id: "02-insurance-amount",         chapter_num: 2, answer_text: "$220 million, including a Loss Mitigation Costs / Cost of Corrections rider." },
  { question_id: "02-restricted-list",          chapter_num: 2, answer_text: "Approximately 2,000 to 3,000 names." },

  // 2.3 Affiliated Broker-Dealer
  { question_id: "02-affiliated-broker",        chapter_num: 2, answer_text: "Yes — BCM Investments, LLC serves as an affiliated broker-dealer. Specific commission rates and independent market-rate verification mechanisms were not disclosed in available documents and require supplementation." },

  // 3.1 IT Infrastructure
  { question_id: "03-it-head",                 chapter_num: 3, answer_text: "Marshall Nobles (CIO), supported by a team of 69 IT professionals." },
  { question_id: "03-it-team-size",            chapter_num: 3, answer_text: "69" },
  { question_id: "03-it-consultants",          chapter_num: 3, answer_text: "Yes — Ascent IT Group Limited and Vikrant Technologies." },
  { question_id: "03-cloud-hosting",           chapter_num: 3, answer_text: "Primary data centers in Los Angeles (CA) and Stamford (CT), with regional nodes in London and Hong Kong. In 2023, backup systems were migrated to AWS. Faction cloud is used for additional redundancy." },
  { question_id: "03-data-backup",             chapter_num: 3, answer_choice: "Yes" },
  { question_id: "03-core-systems",            chapter_num: 3, answer_text: "Order Management System (OMS): Summit. Portfolio Accounting: SS&C Advent's Geneva." },

  // 3.2 Cybersecurity Program
  { question_id: "03-cyber-lead",              chapter_num: 3, answer_text: "Marshall Nobles (CIO). External cybersecurity advisers: Sentinel CyberShield and Cyberus Defense." },
  { question_id: "03-cyber-policy",            chapter_num: 3, answer_choice: "Yes" },
  { question_id: "03-security-frameworks",     chapter_num: 3, answer_multi: ["NIST CSF", "ISO 27001"] },
  { question_id: "03-security-training",       chapter_num: 3, answer_text: "Yes — annual security awareness training is conducted. Most recent session: October 2023, covering cybersecurity best practices." },
  { question_id: "03-phishing-tests",          chapter_num: 3, answer_text: "Yes — monthly phishing simulations are conducted for all employees." },
  { question_id: "03-pen-testing",             chapter_num: 3, answer_text: "Yes — annual penetration testing. Most recent: November 2023, conducted by Phalanx Security. No material findings." },
  { question_id: "03-password-policy",         chapter_num: 3, answer_text: "Password policy includes complexity requirements, prohibition on password reuse, and prohibition on password sharing. Annual mandatory password reset is enforced." },
  { question_id: "03-incident-response",       chapter_num: 3, answer_choice: "Yes" },
  { question_id: "03-security-incidents",      chapter_num: 3, answer_text: "Most recently disclosed incident: December 2019 — an employee email account was compromised; no impact to the network or file servers. No new security incidents recorded in the past 12 months." },

  // 3.3 Business Continuity & Disaster Recovery
  { question_id: "03-bcp-exists",              chapter_num: 3, answer_choice: "Yes" },
  { question_id: "03-bcp-annual",              chapter_num: 3, answer_choice: "Yes" },
  { question_id: "03-bcp-test",                chapter_num: 3, answer_text: "September 2023 — failover test conducted. No issues identified." },
  { question_id: "03-mfa",                     chapter_num: 3, answer_choice: "Yes, all systems" },

  // 4.1 Legal Structure & Domicile
  { question_id: "04-sma",                     chapter_num: 4, answer_text: "Yes — separately managed accounts (SMAs) represent approximately 34% of firm AUM (~$62 billion)." },
  { question_id: "04-fund-name",               chapter_num: 4, answer_text: "Blackpine Global Credit Plus Fund, L.P." },
  { question_id: "04-incorporation-date",      chapter_num: 4, answer_text: "December 15, 2021" },
  { question_id: "04-commencement-date",       chapter_num: 4, answer_text: "March 1, 2022" },
  { question_id: "04-vehicle",                 chapter_num: 4, answer_text: "Parallel structure — Main Fund + Parallel Fund (for non-U.S. investors) + Parallel Feeder. Secondary debt purchases are made jointly through Blackpine GCP Fund Cayman Holdings, L.P." },
  { question_id: "04-exchange-listing",        chapter_num: 4, answer_choice: "No" },

  // 4.2 Key Economic Terms
  { question_id: "04-umbrella",                chapter_num: 4, answer_choice: "No" },
  { question_id: "04-segregated-cell",         chapter_num: 4, answer_choice: "No" },
  { question_id: "04-fund-aum",                chapter_num: 4, answer_text: "$343 million (as of December 31, 2023)" },
  { question_id: "04-largest-investor-pct",    chapter_num: 4, answer_text: "15% (as of September 30, 2023)" },
  { question_id: "04-top5-investors-pct",      chapter_num: 4, answer_text: "34% (as of September 30, 2023)" },
  { question_id: "04-key-person-clause",       chapter_num: 4, answer_choice: "No" },
  { question_id: "04-redemption-gate",         chapter_num: 4, answer_text: "Yes — 25% investor-level gate. Quarterly redemptions with 90-day notice period." },
  { question_id: "04-gate-imposed",            chapter_num: 4, answer_choice: "No" },
  { question_id: "04-gate-structure",          chapter_num: 4, answer_text: "Stacked structure: Q1 — 25% of NAV; Q2 — 33% of remaining NAV; Q3 — 50% of remaining NAV; Q4 and beyond — remainder redeemed in full." },
  { question_id: "04-audit-holdback",          chapter_num: 4, answer_text: "Yes — 10% holdback applied on full redemptions." },
  { question_id: "04-fees",                    chapter_num: 4, answer_text: "Management fee (tiered): <$100M → 0.80% p.a.; $100–200M → 0.75% p.a.; $200–300M → 0.70% p.a.; ≥$300M → 0.65% p.a. Performance fee terms not disclosed in available documents." },
  { question_id: "04-expense-cap",             chapter_num: 4, answer_text: "Yes — organizational expenses capped at 0.15% of average NAV per annum, calculated monthly with an annual true-up." },

  // 4.3 Side Letters & MFN
  { question_id: "04-side-letters",            chapter_num: 4, answer_text: "Yes — side letters have been issued to certain investors. None contain provisions related to preferential liquidity, reduced fees, or enhanced transparency." },

  // 4.4 GP Commitment & Alignment
  { question_id: "04-gp-commit",               chapter_num: 4, answer_text: "Fund-level insider investment: $192 million. Firm-level insider investment: $13.5 billion (~7.4% of firm AUM, as of September 30, 2023)." },

  // 5.1 Fund Administrator
  { question_id: "05-administrator",           chapter_num: 5, answer_text: "Self-administered — all partnership accounting records are maintained in-house by Blackpine's back office team (8 full-time fund accounting professionals), supported by Lattice Fund Services (an affiliate of Stellar Corporate Services) for day-to-day reconciliations and preliminary NAV preparation." },
  { question_id: "05-admin-all-products",      chapter_num: 5, answer_choice: "No" },
  { question_id: "05-admin-service-type",      chapter_num: 5, answer_text: "Self-administered. Lattice Fund Services prepares a preliminary month-end NAV package, which is reviewed and approved by Blackpine's internal back office team. There is no independent external validation of the NAV." },
  { question_id: "05-admin-change",            chapter_num: 5, answer_choice: "No stated intention" },
  { question_id: "05-admin-outsourced",        chapter_num: 5, answer_text: "Partially — Lattice Fund Services is engaged for reconciliations and preliminary NAV preparation. Full accounting oversight is retained internally by Blackpine." },
  { question_id: "05-admin-secondary",         chapter_num: 5, answer_choice: "No" },

  // 5.2 Custodian / Prime Broker
  { question_id: "05-prime-broker",            chapter_num: 5, answer_text: "Custodian / Corporate Banker: Continental Trust Bank. ISDA counterparty: Harbor Commerce Bank and Trust Company. FCM: Keystone Securities." },
  { question_id: "05-counterparty-exposure",   chapter_num: 5, answer_text: "47% of the portfolio is custodied with Continental Trust Bank. 53% is evidenced by private agreements (purchase and sale agreements, legal contracts) and is not subject to traditional custody safekeeping." },
  { question_id: "05-sole-custodian",          chapter_num: 5, answer_choice: "Yes" },
  { question_id: "05-existence-testing",       chapter_num: 5, answer_text: "No — there is no independent administrator in place. Existence testing of the private portfolio is performed solely by the auditor, Whitfield Young LLP, at year-end." },
  { question_id: "05-auditor-portfolio-test",  chapter_num: 5, answer_choice: "Yes" },
  { question_id: "05-audit-sample-or-all",     chapter_num: 5, answer_text: "All investments (entire private portion of the portfolio)." },

  // 5.3 Auditor
  { question_id: "05-auditor",                 chapter_num: 5, answer_text: "Whitfield Young LLP; fieldwork completed in the Cayman Islands. Replaced Price Kingston Partners (PKP) effective March 24, 2016." },
  { question_id: "05-auditor-all-products",    chapter_num: 5, answer_choice: "Yes" },
  { question_id: "05-auditor-change",          chapter_num: 5, answer_choice: "No" },
  { question_id: "05-auditor-mgmt-services",   chapter_num: 5, answer_choice: "Yes" },
  { question_id: "05-auditor-other-services",  chapter_num: 5, answer_text: "Yes — Whitfield Young LLP also provides tax services to the management company. Note: this represents a potential conflict of interest, as the same firm both audits the fund and provides non-audit services to the adviser." },

  // 6.1 Investment Process & Approval
  { question_id: "06-strategy",               chapter_num: 6, answer_text: "Open-ended global credit vehicle investing in high yield bonds, senior loans, structured credit, emerging market debt, and convertibles — both public and private credit sectors." },
  { question_id: "06-portfolio-size",         chapter_num: 6, answer_text: "549 issuers (as of December 31, 2023)" },
  { question_id: "06-holding-period",         chapter_num: 6, answer_text: "3.14 years (12-month period ending December 31, 2023)" },
  { question_id: "06-pms",                    chapter_num: 6, answer_text: "OMS: Summit. Portfolio Accounting: SS&C Advent's Geneva." },
  { question_id: "06-isda-counsel",           chapter_num: 6, answer_text: "External counsel — Winston Sterling LLP handles ISDA negotiations." },
  { question_id: "06-counterparty-committee", chapter_num: 6, answer_text: "No formal committee. Counterparty risk is monitored on an ongoing basis by the compliance function and investment teams." },
  { question_id: "06-margin-sweep",           chapter_num: 6, answer_choice: "Yes, daily" },
  { question_id: "06-decision-process",       chapter_num: 6, answer_text: "Investment Committee (IC) — Bradley Kessler (CIO), Portfolio Managers, and professionals from Credit Research, Risk and Portfolio Analytics, and Product Management. IC meets twice per month." },
  { question_id: "06-ic-frequency",           chapter_num: 6, answer_text: "Twice per month" },
  { question_id: "06-investment-overlap",     chapter_num: 6, answer_text: "Yes — per the LPA, other Blackpine products may have priority over the Fund when investment overlap occurs. Allocations are determined on a pro-rata basis." },
  { question_id: "06-cross-transactions",     chapter_num: 6, answer_choice: "No" },

  // 6.2 Trade Execution & Allocation
  { question_id: "06-trade-error-costs",      chapter_num: 6, answer_text: "Charged to the management company — net losses from trade errors are absorbed by the Manager and not passed to client accounts." },
  { question_id: "06-trade-error-log",        chapter_num: 6, answer_choice: "Yes" },
  { question_id: "06-trading-errors",         chapter_num: 6, answer_text: "Yes — one Global Credit allocation error since 2022. The error was corrected with no financial impact to clients." },
  { question_id: "06-trading-volume",         chapter_num: 6, answer_text: "Average of 6 trades per day for the Fund; approximately 20,000 block trades annually across the firm." },
  { question_id: "06-trade-execution",        chapter_num: 6, answer_text: "Orders are authorized by portfolio managers and communicated to traders via Bloomberg; confirmed electronically via DTCC's CTM or Bloomberg messages; settled via SWIFT." },

  // 6.3 Position & Risk Limits
  { question_id: "06-side-pockets",           chapter_num: 6, answer_choice: "No" },
  { question_id: "06-private-investments",    chapter_num: 6, answer_text: "Yes — Level 3 assets represent approximately 27% of the portfolio and are not held in traditional custody." },
  { question_id: "06-liquidity-profile",      chapter_num: 6, answer_text: "As of December 31, 2023: 46% liquidatable within one week; 18% within two weeks; 3% within one month; 8% within one quarter; 25% beyond one quarter." },

  // 6.4 Counterparty Risk Management
  { question_id: "06-cash-controls",          chapter_num: 6, answer_text: "Yes in practice — two signatures are required via online treasury systems, with separate initiation, verification, and release steps. Note: Alpine was unable to independently verify the contractual basis; only an internal document was provided, not a bank signature card." },
  { question_id: "06-dual-sig-account",       chapter_num: 6, answer_choice: "Yes" },
  { question_id: "06-expense-reimbursement",  chapter_num: 6, answer_choice: "Yes" },

  // 7.1 NAV Calculation Process
  { question_id: "07-isda-provisions",        chapter_num: 7, answer_text: "Standard bilateral collateral and cross-default provisions are in place. No NAV decline triggers are included in ISDA agreements." },
  { question_id: "07-gl-system",              chapter_num: 7, answer_choice: "Yes" },
  { question_id: "07-reconciliation",         chapter_num: 7, answer_text: "Yes — Lattice Fund Services performs daily cash and position reconciliation with the custodian on behalf of Blackpine's back office. A formal reconciliation is performed monthly." },
  { question_id: "07-reconciliation-responsible", chapter_num: 7, answer_text: "Lattice Fund Services, supported by Blackpine's back office. Discrepancies are followed up with the custodian by either Lattice or Blackpine." },
  { question_id: "07-reconciliation-frequency", chapter_num: 7, answer_text: "Daily (cash and positions); monthly (formal reconciliation)" },
  { question_id: "07-nav-responsible",        chapter_num: 7, answer_text: "The Manager (self-administered) — no independent administrator. Lattice Fund Services prepares a preliminary NAV package, which is reviewed and approved by Blackpine's internal back office." },
  { question_id: "07-nav-timeline",           chapter_num: 7, answer_text: "Within 10 business days after month-end." },
  { question_id: "07-nav-error",              chapter_num: 7, answer_choice: "No" },
  { question_id: "07-financial-distribution", chapter_num: 7, answer_text: "The Manager distributes audited financial statements directly to investors — no third-party administrator is in place." },
  { question_id: "07-reporting-errors",       chapter_num: 7, answer_choice: "No" },

  // 7.2 Valuation Policy
  { question_id: "07-valuation-providers",    chapter_num: 7, answer_text: "Auditor (Whitfield Young LLP) performs existence and pricing validation at year-end. No external valuation agent is appointed directly for the Fund; valuation agent marks from other Blackpine products are used as a proxy for overlapping Level 3 holdings." },
  { question_id: "07-auditor-valuation",      chapter_num: 7, answer_choice: "Yes" },
  { question_id: "07-auditor-access",         chapter_num: 7, answer_choice: "Yes" },
  { question_id: "07-pricing-challenges",     chapter_num: 7, answer_choice: "No" },
  { question_id: "07-valuation-committee",    chapter_num: 7, answer_choice: "Mixed (investment + non-investment)" },
  { question_id: "07-valuation-members",      chapter_num: 7, answer_text: "Adrian Sheldon (Head of Valuation), Robert Langford (Global Co-PM), Pablo Uriarte (Global Co-PM). Note: two of three members are investment professionals — Alpine flags this as a conflict of interest concern." },
  { question_id: "07-valuation-independence", chapter_num: 7, answer_text: "No — two of three valuation committee members are investment professionals (Robert Langford and Pablo Uriarte are both Global Co-PMs). Alpine flags this as a conflict of interest concern." },
  { question_id: "07-valuation-frequency",    chapter_num: 7, answer_text: "Quarterly" },
  { question_id: "07-valuation-minutes",      chapter_num: 7, answer_choice: "No" },
  { question_id: "07-private-pricing",        chapter_num: 7, answer_text: "At fair market value using various methodologies (comparable company transactions, performance multiples, DCF). New acquisitions are held at cost for up to 6 months following acquisition (typically 1 month in practice)." },
  { question_id: "07-year-end",               chapter_num: 7, answer_text: "December 31" },

  // 7.3 Independent Pricing
  { question_id: "07-pricing-sources",        chapter_num: 7, answer_text: "Level 1 assets and 98.7% of Level 2 assets are priced using recognized vendors (ICE, IHS Markit, Refinitiv, PricingDirect, BVAL). Vendors cover 72% of Level 2 and 1.5% of Level 3 assets of the total portfolio." },
  { question_id: "07-quote-methodology",      chapter_num: 7, answer_text: "Average of midpoint marks. Typically two broker quotes are used when multiple quotes are available." },
  { question_id: "07-quote-monitoring",       chapter_num: 7, answer_choice: "Yes" },

  // 7.4 Financial Reporting & Audit
  { question_id: "07-audit-date",             chapter_num: 7, answer_text: "March 16, 2023 (for the period March 1, 2022 through December 31, 2022)" },
  { question_id: "07-accounting-framework",   chapter_num: 7, answer_text: "U.S. GAAP" },
  { question_id: "07-audit-location",         chapter_num: 7, answer_text: "Grand Cayman, Cayman Islands" },
  { question_id: "07-audit-qualified",        chapter_num: 7, answer_choice: "No" },
  { question_id: "07-reporting-cadence",      chapter_num: 7, answer_text: "The Manager distributes audited financial statements directly to investors on an annual basis. No third-party administrator is involved in the distribution process." },

  // 8.1 Periodic Reporting Cadence
  { question_id: "08-nav-reporting",          chapter_num: 8, answer_text: "The Manager issues a final monthly NAV within 10 business days after month-end and distributes investor statements directly. No separate estimated NAV is issued and no third-party administrator is involved in distribution." },

  // 8.3 Material Event Disclosure
  { question_id: "08-eu-marketing",           chapter_num: 8, answer_text: "Not explicitly disclosed. The Manager is authorized as an AIFM under AIFMD through Blackpine Capital Management (Lux.) S.à r.l., which provides EU marketing capability, but fund-specific marketing jurisdictions are not disclosed in available documents." },
  { question_id: "08-aifmd-passport",         chapter_num: 8, answer_text: "Not disclosed in available documents. The firm holds AIFM authorization via its Luxembourg entity, but the specific distribution regime used for this Fund (passport, national private placement, or reverse solicitation) has not been provided." },
];

export async function POST() {
  const user = await getCurrentManager();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!user.firm_id) return NextResponse.json({ error: "No firm_id" }, { status: 400 });

  const rows = ANSWERS.map((a) => ({
    firm_id: user.firm_id,
    question_id: a.question_id,
    chapter_num: a.chapter_num,
    answer_text: a.answer_text ?? null,
    answer_choice: a.answer_choice ?? null,
    answer_multi: a.answer_multi ?? null,
    uploaded_filename: null,
    updated_at: new Date().toISOString(),
  }));

  const { error } = await db()
    .from("manager_responses")
    .upsert(rows, { onConflict: "firm_id,question_id" });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, seeded: rows.length });
}
