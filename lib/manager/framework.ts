// Alpine Manager Portal — DDQ framework definition
// Mirrors the 8-chapter structure used on the LP-side (Framework.tsx).
// Each question is intentionally concise; in production these come from a
// strategy-aware question generator. Sample questions here are representative
// of what a real DDQ would contain.

export type Act = "Manager" | "Fund" | "Controls";

export type QuestionKind =
  | "text" // single-line text input
  | "textarea" // multi-line text
  | "choice" // single-select radio
  | "multi_choice" // multi-select checkboxes
  | "upload"; // document upload

export type Question = {
  id: string;
  prompt: string;
  helper?: string;
  kind: QuestionKind;
  required?: boolean;
  choices?: string[];
  subtopic?: string;
};

export type Chapter = {
  num: number;
  numLabel: string; // "01" … "08"
  title: string;
  act: Act;
  description: string;
  questions: Question[];
};

export const FRAMEWORK_VERSION = "v1.2026.05";

export const CHAPTERS: Chapter[] = [
  {
    num: 1,
    numLabel: "01",
    title: "Manager, Ownership & Governance",
    act: "Manager",
    description:
      "Management company, AUM, insider investment, ownership & succession, human resources.",
    questions: [
      // 1.1 Ownership Structure
      { id: "01-legal-name", prompt: "What is the legal name of the management company?", kind: "text", required: true, subtopic: "1.1 Ownership Structure" },
      { id: "01-affiliates", prompt: "List all management company affiliates.", kind: "textarea", required: true, subtopic: "1.1 Ownership Structure" },
      { id: "01-founded", prompt: "Date of commencement of operations.", helper: "Provide dates for both the firm and any flagship funds.", kind: "text", required: true, subtopic: "1.1 Ownership Structure" },
      { id: "01-primary-office", prompt: "Primary office location.", kind: "text", required: true, subtopic: "1.1 Ownership Structure" },
      { id: "01-other-offices", prompt: "List all other office locations.", kind: "textarea", subtopic: "1.1 Ownership Structure" },
      { id: "01-aum-current", prompt: "Current AUM and AUM as of prior year-end.", helper: "Provide both figures and the as-of date.", kind: "textarea", required: true, subtopic: "1.1 Ownership Structure" },
      { id: "01-aum-growth-25", prompt: "Has AUM increased by more than 25% over the past year?", kind: "choice", choices: ["Yes", "No"], required: true, subtopic: "1.1 Ownership Structure" },
      { id: "01-ownership", prompt: "List all principals or entities holding > 5% ownership of the management company, with ownership %.", kind: "textarea", required: true, subtopic: "1.1 Ownership Structure" },
      { id: "01-publicly-traded", prompt: "Is the firm or its parent publicly traded? If previously listed, describe the privatization.", kind: "textarea", subtopic: "1.1 Ownership Structure" },
      { id: "01-investment-professionals", prompt: "Number of investment professionals.", kind: "text", required: true, subtopic: "1.1 Ownership Structure" },
      { id: "01-other-employees", prompt: "Number of other employees (non-investment).", kind: "text", subtopic: "1.1 Ownership Structure" },

      // 1.2 Key Persons & Succession
      { id: "01-back-office-professionals", prompt: "Number of back office professionals.", kind: "text", subtopic: "1.2 Key Persons & Succession" },
      { id: "01-total-headcount", prompt: "Total firm headcount.", kind: "text", required: true, subtopic: "1.2 Key Persons & Succession" },
      { id: "01-key-person-departures", prompt: "Have there been any significant senior personnel departures in the last 3 years? If yes, list names, roles, and circumstances.", kind: "textarea", required: true, subtopic: "1.2 Key Persons & Succession" },
      { id: "01-departures-amicable", prompt: "Were all departures amicable (no litigation or regulatory action)?", kind: "choice", choices: ["Yes", "No", "N/A — no departures"], subtopic: "1.2 Key Persons & Succession" },
      { id: "01-hiring-plans", prompt: "What are the firm's plans to add staff?", kind: "textarea", subtopic: "1.2 Key Persons & Succession" },
      { id: "01-deferred-comp", prompt: "Does the firm have a deferred compensation or long-term incentive program?", kind: "choice", choices: ["Yes", "No"], subtopic: "1.2 Key Persons & Succession" },
      { id: "01-vesting", prompt: "Describe the vesting schedule for deferred compensation.", kind: "text", subtopic: "1.2 Key Persons & Succession" },
      { id: "01-succession", prompt: "Describe the firm's succession plan if a founding partner becomes unavailable.", kind: "textarea", required: true, subtopic: "1.2 Key Persons & Succession" },

      // 1.3 Governance & Board Oversight
      { id: "01-audit-committee", prompt: "Does the firm have an internal audit committee?", kind: "choice", choices: ["Yes", "No"], required: true, subtopic: "1.3 Governance & Board Oversight" },
      { id: "01-audit-members", prompt: "List the audit committee members.", kind: "textarea", subtopic: "1.3 Governance & Board Oversight" },

      // 1.4 Conflicts of Interest
      { id: "01-insider-capital", prompt: "Total insider capital invested at the firm level (USD and % of firm AUM).", kind: "text", required: true, subtopic: "1.4 Conflicts of Interest" },
      { id: "01-org-chart", prompt: "Upload the current organizational chart.", helper: "PDF preferred. Should show reporting lines and ownership.", kind: "upload", subtopic: "1.4 Conflicts of Interest" },
    ],
  },
  {
    num: 2,
    numLabel: "02",
    title: "Legal, Regulatory & Compliance",
    act: "Manager",
    description:
      "Regulatory oversight, compliance infrastructure and policies, claims, actions, conflicts.",
    questions: [
      // 2.1 Regulatory Registration & Status
      { id: "02-regulators", prompt: "Which regulatory bodies oversee the firm, and what are the registration numbers/dates?", kind: "textarea", required: true, subtopic: "2.1 Regulatory Registration & Status" },
      { id: "02-examinations", prompt: "Has the firm been subject to regulatory examinations in the past 10 years? If yes, by which regulators?", kind: "textarea", subtopic: "2.1 Regulatory Registration & Status" },
      { id: "02-sanctions", prompt: "Has the firm received any regulatory fines, sanctions, or disciplinary actions in the past 10 years? Provide details.", kind: "textarea", required: true, subtopic: "2.1 Regulatory Registration & Status" },
      { id: "02-aifmd", prompt: "Is the firm subject to AIFMD? If yes, describe the authorization.", kind: "textarea", subtopic: "2.1 Regulatory Registration & Status" },

      // 2.2 Compliance Program
      { id: "02-cco-name", prompt: "Who is the Chief Compliance Officer, and how large is the compliance team?", kind: "text", required: true, subtopic: "2.2 Compliance Program" },
      { id: "02-cco", prompt: "Is there a dedicated Chief Compliance Officer?", kind: "choice", choices: ["Yes, dedicated CCO", "Shared / part-time CCO", "No dedicated CCO"], required: true, subtopic: "2.2 Compliance Program" },
      { id: "02-background-checks", prompt: "Are third-party background checks conducted on employees? Which provider(s)?", kind: "textarea", subtopic: "2.2 Compliance Program" },
      { id: "02-external-consultants", prompt: "Does the firm engage external compliance consultants? If yes, name them and describe their scope.", kind: "textarea", subtopic: "2.2 Compliance Program" },
      { id: "02-mock-audit", prompt: "When was the most recent mock compliance audit? Were there any material findings?", kind: "textarea", subtopic: "2.2 Compliance Program" },
      { id: "02-compliance-manual-date", prompt: "Does the firm have a written compliance manual? Provide the date of the current version.", kind: "text", required: true, subtopic: "2.2 Compliance Program" },
      { id: "02-manual-updated", prompt: "When was the compliance manual last updated? Were there any material changes?", kind: "text", subtopic: "2.2 Compliance Program" },
      { id: "02-training", prompt: "When was the most recent firm-wide compliance training? What topics were covered?", kind: "textarea", subtopic: "2.2 Compliance Program" },
      { id: "02-personal-trading", prompt: "What is the firm's personal trading policy for employees?", kind: "textarea", subtopic: "2.2 Compliance Program" },
      { id: "02-soft-dollars", prompt: "Does the firm engage in soft dollar or commission-sharing arrangements?", kind: "choice", choices: ["Yes", "No"], required: true, subtopic: "2.2 Compliance Program" },
      { id: "02-expert-networks", prompt: "Which expert networks does the firm use?", kind: "textarea", subtopic: "2.2 Compliance Program" },
      { id: "02-compliance-accomp", prompt: "What percentage of expert network calls are monitored by compliance personnel?", kind: "text", subtopic: "2.2 Compliance Program" },
      { id: "02-insurance", prompt: "Does the firm carry D&O and/or E&O insurance?", kind: "choice", choices: ["Yes", "No"], required: true, subtopic: "2.2 Compliance Program" },
      { id: "02-insurance-amount", prompt: "What is the total coverage amount?", kind: "text", subtopic: "2.2 Compliance Program" },
      { id: "02-restricted-list", prompt: "Approximately how many names are on the firm's restricted trading list?", kind: "text", subtopic: "2.2 Compliance Program" },
      { id: "02-compliance-manual", prompt: "Upload the current compliance manual.", kind: "upload", subtopic: "2.2 Compliance Program" },

      // 2.3 Affiliated Broker-Dealer
      { id: "02-affiliated-broker", prompt: "Does the firm use an affiliated broker-dealer? If yes, are fees charged at market rates, and how is this verified?", kind: "textarea", subtopic: "2.3 Affiliated Broker-Dealer" },
    ],
  },
  {
    num: 3,
    numLabel: "03",
    title: "Technology, Cybersecurity & Resilience",
    act: "Manager",
    description:
      "IT overview, cybersecurity controls, business continuity, incident response.",
    questions: [
      // 3.1 IT Infrastructure
      { id: "03-it-head",           prompt: "Who leads the IT function, and how large is the team?", kind: "text", required: true, subtopic: "3.1 IT Infrastructure" },
      { id: "03-it-team-size",      prompt: "Total number of IT professionals.", kind: "text", subtopic: "3.1 IT Infrastructure" },
      { id: "03-it-consultants",    prompt: "Does the firm use external IT consultants? If yes, which providers?", kind: "textarea", subtopic: "3.1 IT Infrastructure" },
      { id: "03-cloud-hosting",     prompt: "Describe the cloud and data center environment (providers, locations, architecture).", kind: "textarea", required: true, subtopic: "3.1 IT Infrastructure" },
      { id: "03-data-backup",       prompt: "Is data backed up in real time or near-real time?", kind: "choice", choices: ["Yes", "No"], required: true, subtopic: "3.1 IT Infrastructure" },
      { id: "03-core-systems",      prompt: "Which core systems are used for OMS and portfolio accounting?", kind: "textarea", required: true, subtopic: "3.1 IT Infrastructure" },

      // 3.2 Cybersecurity Program
      { id: "03-cyber-lead",        prompt: "Who is responsible for cybersecurity, and are external advisers engaged?", kind: "textarea", required: true, subtopic: "3.2 Cybersecurity Program" },
      { id: "03-cyber-policy",      prompt: "Does the firm have a written cybersecurity policy?", kind: "choice", choices: ["Yes", "No"], required: true, subtopic: "3.2 Cybersecurity Program" },
      { id: "03-security-frameworks", prompt: "Which security frameworks does the firm operate under?", kind: "multi_choice", choices: ["SOC 2 Type II", "ISO 27001", "NIST CSF", "None"], required: true, subtopic: "3.2 Cybersecurity Program" },
      { id: "03-security-training", prompt: "Does the firm conduct annual security awareness training? When was the most recent session?", kind: "textarea", subtopic: "3.2 Cybersecurity Program" },
      { id: "03-phishing-tests",    prompt: "Does the firm conduct phishing simulations? How frequently?", kind: "textarea", subtopic: "3.2 Cybersecurity Program" },
      { id: "03-pen-testing",       prompt: "Does the firm conduct penetration testing? How often, and when was the most recent test?", kind: "textarea", subtopic: "3.2 Cybersecurity Program" },
      { id: "03-password-policy",   prompt: "Describe the firm's password policy (complexity, reuse restrictions, sharing prohibition, reset frequency).", kind: "textarea", subtopic: "3.2 Cybersecurity Program" },
      { id: "03-incident-response", prompt: "Does the firm have a formal written incident response plan?", kind: "choice", choices: ["Yes", "No"], required: true, subtopic: "3.2 Cybersecurity Program" },
      { id: "03-security-incidents", prompt: "Have there been any security incidents in the past 12 months? Describe the most recent disclosed incident.", kind: "textarea", subtopic: "3.2 Cybersecurity Program" },

      // 3.3 Business Continuity & Disaster Recovery
      { id: "03-bcp-exists",        prompt: "Does the firm have a written Business Continuity Plan (BCP)?", kind: "choice", choices: ["Yes", "No"], required: true, subtopic: "3.3 Business Continuity & Disaster Recovery" },
      { id: "03-bcp-annual",        prompt: "Is the BCP reviewed and tested at least annually?", kind: "choice", choices: ["Yes", "No"], subtopic: "3.3 Business Continuity & Disaster Recovery" },
      { id: "03-bcp-test",          prompt: "When was the most recent BCP test? Were any issues identified?", kind: "textarea", subtopic: "3.3 Business Continuity & Disaster Recovery" },
      { id: "03-mfa",               prompt: "Is multi-factor authentication enforced for remote access (VPN/systems)?", kind: "choice", choices: ["Yes, all systems", "Some systems only", "No"], required: true, subtopic: "3.3 Business Continuity & Disaster Recovery" },
      { id: "03-bcp",               prompt: "Upload the current Business Continuity Plan.", kind: "upload", subtopic: "3.3 Business Continuity & Disaster Recovery" },
    ],
  },
  {
    num: 4,
    numLabel: "04",
    title: "Fund Structure, Terms & Alignment",
    act: "Fund",
    description:
      "Legal structure, key terms, fee structure, corporate governance, investment strategy.",
    questions: [
      // 4.1 Legal Structure & Domicile
      { id: "04-sma",                  prompt: "Does the firm advise any separately managed account (SMA) structures? If yes, what percentage of firm AUM do they represent?", kind: "textarea", subtopic: "4.1 Legal Structure & Domicile" },
      { id: "04-fund-name",            prompt: "Fund name(s).", kind: "text", required: true, subtopic: "4.1 Legal Structure & Domicile" },
      { id: "04-incorporation-date",   prompt: "Date of incorporation / formation.", kind: "text", required: true, subtopic: "4.1 Legal Structure & Domicile" },
      { id: "04-commencement-date",    prompt: "Date of commencement of operations.", kind: "text", required: true, subtopic: "4.1 Legal Structure & Domicile" },
      { id: "04-vehicle",              prompt: "Fund structure type and domicile.", helper: "e.g. parallel structure — Main Fund + Parallel Fund + Feeder.", kind: "textarea", required: true, subtopic: "4.1 Legal Structure & Domicile" },
      { id: "04-exchange-listing",     prompt: "Is the fund subject to a stock exchange listing?", kind: "choice", choices: ["Yes", "No"], subtopic: "4.1 Legal Structure & Domicile" },

      // 4.2 Key Economic Terms
      { id: "04-umbrella",             prompt: "Is the fund part of an umbrella structure?", kind: "choice", choices: ["Yes", "No"], subtopic: "4.2 Key Economic Terms" },
      { id: "04-segregated-cell",      prompt: "Is the fund a segregated cell company or similar structure?", kind: "choice", choices: ["Yes", "No"], subtopic: "4.2 Key Economic Terms" },
      { id: "04-fund-aum",             prompt: "Current AUM of the fund (with as-of date).", kind: "text", required: true, subtopic: "4.2 Key Economic Terms" },
      { id: "04-largest-investor-pct", prompt: "What percentage of fund capital is held by the largest external investor?", kind: "text", subtopic: "4.2 Key Economic Terms" },
      { id: "04-top5-investors-pct",   prompt: "What percentage of fund capital is held by the top 5 largest external investors?", kind: "text", subtopic: "4.2 Key Economic Terms" },
      { id: "04-key-person-clause",    prompt: "Is a key person clause included in the offering document?", kind: "choice", choices: ["Yes", "No"], subtopic: "4.2 Key Economic Terms" },
      { id: "04-redemption-gate",      prompt: "Is there a redemption gate or similar provision? If yes, describe the terms.", kind: "textarea", subtopic: "4.2 Key Economic Terms" },
      { id: "04-gate-imposed",         prompt: "Has the redemption gate ever been imposed?", kind: "choice", choices: ["Yes", "No", "N/A — no gate"], subtopic: "4.2 Key Economic Terms" },
      { id: "04-gate-structure",       prompt: "Does the gating provision have a stacked or level structure? Describe.", kind: "textarea", subtopic: "4.2 Key Economic Terms" },
      { id: "04-audit-holdback",       prompt: "Is the audit holdback greater than 5%? If yes, provide the holdback percentage.", kind: "textarea", subtopic: "4.2 Key Economic Terms" },
      { id: "04-fees",                 prompt: "Management fee and performance fee (with hurdle, if applicable).", kind: "textarea", required: true, subtopic: "4.2 Key Economic Terms" },
      { id: "04-expense-cap",          prompt: "Has the fund established an expense cap for items charged to the fund?", kind: "textarea", subtopic: "4.2 Key Economic Terms" },

      // 4.3 Side Letters & MFN
      { id: "04-side-letters",         prompt: "Has the fund entered into any side letter arrangements? If yes, summarize the key provisions.", kind: "textarea", subtopic: "4.3 Side Letters & MFN" },

      // 4.4 GP Commitment & Alignment
      { id: "04-gp-commit",            prompt: "Confirm the size of GP / insider investment at both fund and firm level.", kind: "textarea", required: true, subtopic: "4.4 GP Commitment & Alignment" },
      { id: "04-lpa",                  prompt: "Upload the current Limited Partnership Agreement (LPA).", kind: "upload", subtopic: "4.4 GP Commitment & Alignment" },
    ],
  },
  {
    num: 5,
    numLabel: "05",
    title: "Service Providers & Oversight",
    act: "Fund",
    description:
      "Administrator, auditor, banker, custodian, prime broker — engaged and verified.",
    questions: [
      // 5.1 Fund Administrator
      { id: "05-administrator",        prompt: "Identify the appointed administrator and describe their role.", kind: "textarea", required: true, subtopic: "5.1 Fund Administrator" },
      { id: "05-admin-all-products",   prompt: "Has the administrator been engaged to perform similar servicing for all firm products?", kind: "choice", choices: ["Yes", "No"], subtopic: "5.1 Fund Administrator" },
      { id: "05-admin-service-type",   prompt: "Does the administrator provide full-service administration or 'NAV Lite'? Describe the NAV preparation and validation process.", kind: "textarea", subtopic: "5.1 Fund Administrator" },
      { id: "05-admin-change",         prompt: "Is the manager considering any change in administrator?", kind: "choice", choices: ["Yes", "No", "No stated intention"], subtopic: "5.1 Fund Administrator" },
      { id: "05-admin-outsourced",     prompt: "Does the administrator provide outsourced middle/back office services? Describe scope.", kind: "textarea", subtopic: "5.1 Fund Administrator" },
      { id: "05-admin-secondary",      prompt: "Has the manager appointed a secondary administrator?", kind: "choice", choices: ["Yes", "No"], subtopic: "5.1 Fund Administrator" },

      // 5.2 Custodian / Prime Broker
      { id: "05-prime-broker",         prompt: "Identify all fund counterparties (custodian, prime broker, FCM, ISDA counterparty).", kind: "textarea", required: true, subtopic: "5.2 Custodian / Prime Broker" },
      { id: "05-counterparty-exposure", prompt: "Confirm counterparty exposure breakdown (% of portfolio by custodian vs. private agreements).", kind: "textarea", subtopic: "5.2 Custodian / Prime Broker" },
      { id: "05-sole-custodian",       prompt: "Does the fund have a sole custodial / FCM relationship?", kind: "choice", choices: ["Yes", "No"], subtopic: "5.2 Custodian / Prime Broker" },
      { id: "05-existence-testing",    prompt: "Does the administrator perform existence testing for non-custodied assets?", kind: "textarea", subtopic: "5.2 Custodian / Prime Broker" },
      { id: "05-auditor-portfolio-test", prompt: "Does the auditor test the whole portfolio for existence annually?", kind: "choice", choices: ["Yes", "No"], subtopic: "5.2 Custodian / Prime Broker" },
      { id: "05-audit-sample-or-all",  prompt: "Are all investments tested, or only a sample?", kind: "text", subtopic: "5.2 Custodian / Prime Broker" },

      // 5.3 Auditor
      { id: "05-auditor",              prompt: "Identify the appointed audit firm and describe any recent changes.", kind: "textarea", required: true, subtopic: "5.3 Auditor" },
      { id: "05-auditor-all-products", prompt: "Does the firm use the same audit firm across all fund products?", kind: "choice", choices: ["Yes", "No"], subtopic: "5.3 Auditor" },
      { id: "05-auditor-change",       prompt: "Is a change in audit firm anticipated?", kind: "choice", choices: ["Yes", "No"], subtopic: "5.3 Auditor" },
      { id: "05-auditor-mgmt-services", prompt: "Does the auditor also provide services to the management company?", kind: "choice", choices: ["Yes", "No"], subtopic: "5.3 Auditor" },
      { id: "05-auditor-other-services", prompt: "Does the auditor provide non-audit services (tax, cyber, consulting, etc.)? If yes, describe.", kind: "textarea", subtopic: "5.3 Auditor" },
      { id: "05-engagement-letters",   prompt: "Upload current engagement letters from administrator and auditor.", kind: "upload", subtopic: "5.3 Auditor" },
    ],
  },
  {
    num: 6,
    numLabel: "06",
    title: "Investment Operations & Portfolio Controls",
    act: "Controls",
    description:
      "Portfolio management systems, decision process, allocation, cash tracking and controls.",
    questions: [
      // 6.1 Investment Process & Approval
      { id: "06-strategy",              prompt: "Identify the fund's investment strategy.", kind: "textarea", required: true, subtopic: "6.1 Investment Process & Approval" },
      { id: "06-portfolio-size",        prompt: "How many line items / issuers are currently in the portfolio?", kind: "text", subtopic: "6.1 Investment Process & Approval" },
      { id: "06-holding-period",        prompt: "What is the average holding period of investments?", kind: "text", subtopic: "6.1 Investment Process & Approval" },
      { id: "06-pms",                   prompt: "Portfolio management and risk systems used.", kind: "textarea", required: true, subtopic: "6.1 Investment Process & Approval" },
      { id: "06-isda-counsel",          prompt: "Are ISDA negotiations handled internally or with external counsel?", kind: "textarea", subtopic: "6.1 Investment Process & Approval" },
      { id: "06-counterparty-committee", prompt: "Does the firm have a formal counterparty risk management committee?", kind: "textarea", subtopic: "6.1 Investment Process & Approval" },
      { id: "06-margin-sweep",          prompt: "Is excess margin swept outside margin accounts? How often are balances reviewed?", kind: "choice", choices: ["Yes, daily", "Yes, less frequently", "No"], subtopic: "6.1 Investment Process & Approval" },
      { id: "06-decision-process",      prompt: "Who authorizes deal execution? Describe the Investment Committee structure.", kind: "textarea", required: true, subtopic: "6.1 Investment Process & Approval" },
      { id: "06-ic-frequency",          prompt: "How often does the Investment Committee meet?", kind: "text", subtopic: "6.1 Investment Process & Approval" },
      { id: "06-investment-overlap",    prompt: "Is there investment overlap between the fund and other firm products? How are allocations determined?", kind: "textarea", subtopic: "6.1 Investment Process & Approval" },
      { id: "06-cross-transactions",    prompt: "Have cross-transactions between funds and accounts occurred in practice?", kind: "choice", choices: ["Yes", "No"], subtopic: "6.1 Investment Process & Approval" },

      // 6.2 Trade Execution & Allocation
      { id: "06-trade-error-costs",     prompt: "Are costs of trade errors charged to the management company or to the fund?", kind: "textarea", subtopic: "6.2 Trade Execution & Allocation" },
      { id: "06-trade-error-log",       prompt: "Does the firm maintain a formal trade error log?", kind: "choice", choices: ["Yes", "No"], subtopic: "6.2 Trade Execution & Allocation" },
      { id: "06-trading-errors",        prompt: "Have there been any material trading errors (over $10,000) in the past year?", kind: "textarea", subtopic: "6.2 Trade Execution & Allocation" },
      { id: "06-trading-volume",        prompt: "What is the approximate trading volume per day for the fund?", kind: "text", subtopic: "6.2 Trade Execution & Allocation" },
      { id: "06-trade-execution",       prompt: "Describe how trades are executed and settled (systems, confirmation, settlement process).", kind: "textarea", subtopic: "6.2 Trade Execution & Allocation" },

      // 6.3 Position & Risk Limits
      { id: "06-side-pockets",          prompt: "Does the fund hold any investments through side pockets?", kind: "choice", choices: ["Yes", "No"], subtopic: "6.3 Position & Risk Limits" },
      { id: "06-private-investments",   prompt: "Does the fund hold private investments that are not side-pocketed? If yes, what percentage of the portfolio?", kind: "textarea", subtopic: "6.3 Position & Risk Limits" },
      { id: "06-liquidity-profile",     prompt: "Describe the fund's liquidity profile as of the most recent quarter-end.", kind: "textarea", required: true, subtopic: "6.3 Position & Risk Limits" },

      // 6.4 Counterparty Risk Management
      { id: "06-cash-controls",         prompt: "Are all external asset transfers subject to a dual signature / dual-control policy? Describe the process.", kind: "textarea", required: true, subtopic: "6.4 Counterparty Risk Management" },
      { id: "06-dual-sig-account",      prompt: "Are dual signatures required to open an account in the name of the fund?", kind: "choice", choices: ["Yes", "No"], subtopic: "6.4 Counterparty Risk Management" },
      { id: "06-expense-reimbursement", prompt: "Are operating expenses initially paid by the management company and subsequently reimbursed by the fund?", kind: "choice", choices: ["Yes", "No"], subtopic: "6.4 Counterparty Risk Management" },
    ],
  },
  {
    num: 7,
    numLabel: "07",
    title: "Valuation, Asset Existence & Reporting",
    act: "Controls",
    description:
      "Valuation controls, asset existence verification, investor reporting, financial controls.",
    questions: [
      // 7.1 NAV Calculation Process
      { id: "07-isda-provisions",         prompt: "Confirm ISDA standard provisions re: bilateral collateral, NAV triggers, and cross-default.", kind: "textarea", subtopic: "7.1 NAV Calculation Process" },
      { id: "07-gl-system",               prompt: "Does the portfolio accounting system incorporate a general ledger?", kind: "choice", choices: ["Yes", "No"], subtopic: "7.1 NAV Calculation Process" },
      { id: "07-reconciliation",          prompt: "Does the firm perform internal reconciliation? Describe the process.", kind: "textarea", required: true, subtopic: "7.1 NAV Calculation Process" },
      { id: "07-reconciliation-responsible", prompt: "Who is responsible for performing portfolio reconciliation?", kind: "text", subtopic: "7.1 NAV Calculation Process" },
      { id: "07-reconciliation-frequency", prompt: "Frequency of reconciliation for cash transactions and balances.", kind: "text", subtopic: "7.1 NAV Calculation Process" },
      { id: "07-nav-responsible",         prompt: "Who is responsible for the estimated NAV calculation?", kind: "textarea", required: true, subtopic: "7.1 NAV Calculation Process" },
      { id: "07-nav-timeline",            prompt: "What is the business day timeline for issuance of the final NAV?", kind: "text", subtopic: "7.1 NAV Calculation Process" },
      { id: "07-nav-error",               prompt: "Has the NAV ever been issued in error?", kind: "choice", choices: ["Yes", "No"], subtopic: "7.1 NAV Calculation Process" },
      { id: "07-financial-distribution",  prompt: "Who is responsible for distributing audited financial statements to investors?", kind: "textarea", subtopic: "7.1 NAV Calculation Process" },
      { id: "07-reporting-errors",        prompt: "Have there been any errors with respect to investor reporting?", kind: "choice", choices: ["Yes", "No"], subtopic: "7.1 NAV Calculation Process" },

      // 7.2 Valuation Policy
      { id: "07-valuation-providers",     prompt: "Are other service providers involved in the valuation process?", kind: "textarea", subtopic: "7.2 Valuation Policy" },
      { id: "07-auditor-valuation",       prompt: "Does the auditor perform valuation procedures at year-end?", kind: "choice", choices: ["Yes", "No"], subtopic: "7.2 Valuation Policy" },
      { id: "07-auditor-access",          prompt: "Does the auditor have direct access to the valuation agent?", kind: "choice", choices: ["Yes", "No"], subtopic: "7.2 Valuation Policy" },
      { id: "07-pricing-challenges",      prompt: "Have auditors raised pricing challenges in prior periods?", kind: "choice", choices: ["Yes", "No"], subtopic: "7.2 Valuation Policy" },
      { id: "07-valuation-committee",     prompt: "Does the firm have a valuation committee?", kind: "choice", choices: ["Yes, independent (no investment team)", "Mixed (investment + non-investment)", "No formal committee"], required: true, subtopic: "7.2 Valuation Policy" },
      { id: "07-valuation-members",       prompt: "Who are the valuation committee members?", kind: "textarea", subtopic: "7.2 Valuation Policy" },
      { id: "07-valuation-independence",  prompt: "Are the majority of valuation committee members non-investment professionals?", kind: "textarea", subtopic: "7.2 Valuation Policy" },
      { id: "07-valuation-frequency",     prompt: "How regularly does the valuation committee meet?", kind: "text", subtopic: "7.2 Valuation Policy" },
      { id: "07-valuation-minutes",       prompt: "Are valuation committee meetings formally documented in minutes?", kind: "choice", choices: ["Yes", "No"], subtopic: "7.2 Valuation Policy" },
      { id: "07-private-pricing",         prompt: "How are private securities priced?", kind: "textarea", required: true, subtopic: "7.2 Valuation Policy" },
      { id: "07-year-end",                prompt: "What is the fund's reporting year-end?", kind: "text", subtopic: "7.2 Valuation Policy" },

      // 7.3 Independent Pricing
      { id: "07-pricing-sources",         prompt: "What proportion of the portfolio can be priced using recognized pricing feeds? List primary vendors.", kind: "textarea", required: true, subtopic: "7.3 Independent Pricing" },
      { id: "07-quote-methodology",       prompt: "How is a final price determined when multiple broker quotes are available?", kind: "textarea", subtopic: "7.3 Independent Pricing" },
      { id: "07-quote-monitoring",        prompt: "Is the source of each quote monitored to prevent cherry-picking?", kind: "choice", choices: ["Yes", "No"], subtopic: "7.3 Independent Pricing" },

      // 7.4 Financial Reporting & Audit
      { id: "07-audit-date",              prompt: "What is the most recent audit opinion date?", kind: "text", subtopic: "7.4 Financial Reporting & Audit" },
      { id: "07-accounting-framework",    prompt: "What accounting framework is used?", kind: "text", required: true, subtopic: "7.4 Financial Reporting & Audit" },
      { id: "07-audit-location",          prompt: "Where was the audit fieldwork completed?", kind: "text", subtopic: "7.4 Financial Reporting & Audit" },
      { id: "07-audit-qualified",         prompt: "Have any financial statements received an audit qualification?", kind: "choice", choices: ["Yes", "No"], required: true, subtopic: "7.4 Financial Reporting & Audit" },
      { id: "07-reporting-cadence",       prompt: "Describe the investor reporting cadence and how audited financials are distributed.", kind: "textarea", required: true, subtopic: "7.4 Financial Reporting & Audit" },
    ],
  },
  {
    num: 8,
    numLabel: "08",
    title: "Manager Transparency & LP Communications",
    act: "Controls",
    description:
      "Diligence cooperation, administrator cooperation, disclosure quality.",
    questions: [
      // 8.1 Periodic Reporting Cadence
      { id: "08-nav-reporting",     prompt: "Is an estimated NAV made available to investors? Describe the NAV reporting timeline and distribution process.", kind: "textarea", required: true, subtopic: "8.1 Periodic Reporting Cadence" },
      { id: "08-reporting-cadence", prompt: "What is the full investor reporting cadence (monthly, quarterly, annual)? Describe the contents of each report.", kind: "textarea", required: true, subtopic: "8.1 Periodic Reporting Cadence" },
      { id: "08-investor-portal",   prompt: "Is an investor portal used for document distribution? If yes, which platform?", kind: "text", subtopic: "8.1 Periodic Reporting Cadence" },

      // 8.2 Investor Communications & Diligence Cooperation
      { id: "08-disclosure-policy", prompt: "Describe the firm's LP disclosure policy for material events.", kind: "textarea", required: true, subtopic: "8.2 Investor Communications & Diligence Cooperation" },
      { id: "08-side-letters",      prompt: "Are any side letters in place? If yes, summarize key provisions and MFN treatment.", kind: "textarea", subtopic: "8.2 Investor Communications & Diligence Cooperation" },
      { id: "08-diligence-access",  prompt: "Does the firm provide access to systems, staff, and documentation during LP diligence reviews?", kind: "choice", choices: ["Yes, full access", "Partial access", "No"], subtopic: "8.2 Investor Communications & Diligence Cooperation" },

      // 8.3 Material Event Disclosure
      { id: "08-eu-marketing",      prompt: "Is the Fund marketed in the EU? Under which regime (AIFMD passport, private placement, or reverse solicitation)?", kind: "textarea", subtopic: "8.3 Material Event Disclosure" },
      { id: "08-aifmd-passport",    prompt: "Is the fund distributed via AIFMD passport, national private placement, or reverse solicitation?", kind: "textarea", subtopic: "8.3 Material Event Disclosure" },
      { id: "08-material-events",   prompt: "Describe any material events (litigation, regulatory action, key person changes, etc.) disclosed to investors in the past 24 months.", kind: "textarea", subtopic: "8.3 Material Event Disclosure" },
    ],
  },
];

export function totalQuestions(): number {
  return CHAPTERS.reduce((acc, c) => acc + c.questions.length, 0);
}

export function chapterByNum(num: number): Chapter | undefined {
  return CHAPTERS.find((c) => c.num === num);
}

export const ACT_COLOR: Record<Act, string> = {
  Manager: "#7B2CBF",
  Fund: "#10B981",
  Controls: "#F59E0B",
};
