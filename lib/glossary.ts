/**
 * ODD Glossary — the single source of truth for the Learning Center glossary page
 * and (later) inline tooltips in the report viewer.
 *
 * Each term has a definition (`meaning`) and a diligence-context note (`context`,
 * "why it matters"). `related` ids interlink terms; `aliases` are extra surface
 * forms the inline matcher may link (e.g. "MFA" for the 2FA/MFA entry).
 *
 * Anchor ids are stable (used in URLs like /learning-center#aifmd) — do not rename.
 */

export type GlossaryGroup = "investment-terms" | "capital-commitment";

export interface GlossaryTerm {
  /** Stable anchor slug, e.g. "aifmd". Used in URLs and cross-links. */
  id: string;
  /** Display term, e.g. "AIFMD". */
  term: string;
  /** Expanded form, e.g. "Alternative Investment Fund Managers Directive". */
  expansion?: string;
  group: GlossaryGroup;
  /** Short label chip, e.g. "Regulator", "Fund Economics". */
  category: string;
  /** The definition. */
  meaning: string;
  /** Why it matters in diligence. */
  context: string;
  /** ids of related terms (curated). */
  related?: string[];
  /** Extra surface forms the inline matcher may link (beyond `term`). */
  aliases?: string[];
}

export const GLOSSARY: GlossaryTerm[] = [
  // ── Investment Terms (acronyms, regulators, frameworks) ──────────────────────
  {
    id: "aif", term: "AIF", expansion: "Alternative Investment Fund",
    group: "investment-terms", category: "Fund Structure",
    meaning: "A collective investment vehicle that raises capital from investors and invests according to a defined investment policy, commonly used in private funds, hedge funds, private equity, real assets, and other alternative strategies.",
    context: "Important when reviewing the fund's legal structure, regulatory classification, investor eligibility, and whether the manager is operating under the correct framework for the jurisdictions where the fund is offered.",
    related: ["aifmd", "aifm", "ppm", "lpa"],
  },
  {
    id: "aifmd", term: "AIFMD", expansion: "Alternative Investment Fund Managers Directive",
    group: "investment-terms", category: "Regulator",
    meaning: "The European regulatory framework governing managers of alternative investment funds, especially where funds are managed or marketed in the EU.",
    context: "Matters when a manager has European investors, markets into Europe, or uses European fund structures. Review should consider authorization status, reporting obligations, disclosure requirements, depositary arrangements, and ongoing compliance controls.",
    related: ["aif", "aifm"],
  },
  {
    id: "aifm", term: "AIFM", expansion: "Alternative Investment Fund Manager",
    group: "investment-terms", category: "Manager",
    meaning: "The entity responsible for managing one or more alternative investment funds under the AIFMD framework.",
    context: "Identifying the AIFM clarifies who is legally responsible for portfolio management, risk management, regulatory reporting, and operational oversight — especially where a fund uses delegates, advisers, or cross-border management arrangements.",
    related: ["aifmd", "aif"],
  },
  {
    id: "aml", term: "AML", expansion: "Anti Money Laundering",
    group: "investment-terms", category: "Compliance",
    meaning: "The policies and controls designed to prevent criminal proceeds from entering the financial system through investor subscriptions, transfers, or other fund activity.",
    context: "AML review focuses on investor onboarding, beneficial ownership checks, sanctions screening, source of funds review, ongoing monitoring, and escalation procedures for suspicious activity.",
    related: ["kyc", "ofac", "fatf"],
  },
  {
    id: "aum", term: "AUM", expansion: "Assets Under Management",
    group: "investment-terms", category: "Firm Scale",
    meaning: "The total value of assets managed by an investment manager on behalf of clients, funds, or accounts.",
    context: "Often used to describe the manager's scale, but reviewers should confirm how it is calculated, whether it includes committed or invested capital, and whether it is consistent across marketing materials, regulatory filings, and investor reports.",
    related: ["raum", "assets-under-administration", "nav"],
  },
  {
    id: "bcp", term: "BCP", expansion: "Business Continuity Plan",
    group: "investment-terms", category: "Technology",
    meaning: "A documented plan for maintaining or restoring operations after a disruptive event such as a cyber incident, system outage, office closure, natural disaster, or service provider failure.",
    context: "BCP review considers whether the manager can continue key functions such as trading, cash movement, investor reporting, valuation, compliance monitoring, and communication during a disruption.",
    related: ["nist", "mfa"],
  },
  {
    id: "cco", term: "CCO", expansion: "Chief Compliance Officer",
    group: "investment-terms", category: "Manager",
    meaning: "The senior person responsible for overseeing the firm's compliance program, regulatory obligations, internal policies, and ethical conduct.",
    context: "The CCO's authority, independence, experience, staffing support, and access to senior management are central to assessing whether compliance is embedded in the firm or treated as a formality.",
    related: ["cio", "ic"],
  },
  {
    id: "cftc", term: "CFTC", expansion: "Commodity Futures Trading Commission",
    group: "investment-terms", category: "Regulator",
    meaning: "The U.S. regulator overseeing derivatives markets, including futures, swaps, and certain commodity related investment activities.",
    context: "Relevance depends on whether the manager trades futures, swaps, commodities, or operates vehicles that may require registration as a commodity pool operator or commodity trading advisor.",
    related: ["cpo", "cta", "nfa", "fcm"],
  },
  {
    id: "cio", term: "CIO", expansion: "Chief Investment Officer",
    group: "investment-terms", category: "Manager",
    meaning: "The senior person responsible for investment strategy, portfolio construction, investment risk, and often final investment oversight.",
    context: "In diligence, the CIO role helps reviewers understand decision making authority, key person risk, investment governance, and how investment judgment is balanced against risk, compliance, and operations.",
    related: ["ic", "cco"],
  },
  {
    id: "cpo", term: "CPO", expansion: "Commodity Pool Operator",
    group: "investment-terms", category: "Regulator",
    meaning: "An entity that operates or solicits capital for a pooled vehicle trading commodity interests, usually subject to CFTC and NFA oversight.",
    context: "CPO status matters when reviewing regulatory registration, exemption claims, investor disclosures, reporting requirements, and whether the manager's derivatives activity is properly supervised.",
    related: ["cftc", "nfa", "cta"],
  },
  {
    id: "cta", term: "CTA", expansion: "Commodity Trading Advisor",
    group: "investment-terms", category: "Regulator",
    meaning: "An entity that provides advice on futures, options, swaps, or other commodity interests, usually subject to CFTC and NFA oversight.",
    context: "CTA review is relevant when a manager provides trading advice in derivatives markets. Reviewers should assess registration status, exemption basis, disclosure documents, trading authority, and compliance monitoring.",
    related: ["cftc", "nfa", "cpo"],
  },
  {
    id: "do-eo", term: "D&O / E&O", expansion: "Directors and Officers + Errors and Omissions insurance",
    group: "investment-terms", category: "Insurance",
    meaning: "Insurance coverage designed to protect the firm, directors, officers, and professionals against certain claims involving management decisions, negligence, errors, or alleged misconduct.",
    context: "Insurance review helps assess whether the manager has appropriate protection for operational, governance, and professional liability risks. Reviewers usually consider coverage limits, exclusions, insured entities, renewal status, and claims history.",
    aliases: ["D&O", "E&O"],
  },
  {
    id: "ddq", term: "DDQ", expansion: "Due Diligence Questionnaire",
    group: "investment-terms", category: "Process",
    meaning: "A structured questionnaire completed by a manager to provide information on operations, compliance, governance, service providers, valuation, technology, and fund terms.",
    context: "The DDQ is often the starting point for diligence, but it should not be treated as sufficient by itself. Reviewers should compare responses against policies, agreements, filings, reports, and interview answers.",
    related: ["odd", "ppm", "lpa"],
  },
  {
    id: "fatca", term: "FATCA", expansion: "Foreign Account Tax Compliance Act",
    group: "investment-terms", category: "Tax",
    meaning: "A U.S. tax reporting framework requiring foreign financial institutions to identify and report certain information about U.S. account holders.",
    context: "FATCA review focuses on investor tax documentation, entity classification, GIIN registration where applicable, administrator processes, and whether tax reporting obligations are clearly assigned.",
    related: ["giin", "fatf"],
  },
  {
    id: "fatf", term: "FATF", expansion: "Financial Action Task Force",
    group: "investment-terms", category: "Compliance",
    meaning: "An international body that sets standards for combating money laundering, terrorist financing, and related financial crime risks.",
    context: "FATF is relevant when reviewing AML standards, country risk, sanctions exposure, investor onboarding controls, and whether a manager's policies reflect recognized international expectations.",
    related: ["aml", "ofac", "kyc"],
  },
  {
    id: "fcm", term: "FCM", expansion: "Futures Commission Merchant",
    group: "investment-terms", category: "Counterparty",
    meaning: "A registered firm that accepts orders for futures or options on futures and may hold margin or collateral for clients.",
    context: "FCM review matters when a fund trades futures or cleared derivatives. Reviewers should consider counterparty selection, account control, margin process, reconciliation, collateral movement, and segregation of assets.",
    related: ["cftc", "pb", "isda"],
  },
  {
    id: "finra", term: "FINRA", expansion: "Financial Industry Regulatory Authority",
    group: "investment-terms", category: "Regulator",
    meaning: "A U.S. self regulatory organization overseeing broker dealers and registered representatives.",
    context: "FINRA relevance usually arises where a manager has broker dealer relationships, affiliated distribution activity, placement agent arrangements, or registered representatives involved in fundraising or securities activity.",
    related: ["sec"],
  },
  {
    id: "giin", term: "GIIN", expansion: "Global Intermediary Identification Number",
    group: "investment-terms", category: "Tax",
    meaning: "A unique identification number issued to financial institutions registered under FATCA.",
    context: "GIIN status can help confirm whether an entity is properly registered for FATCA purposes. Reviewers may use it when checking tax compliance, investor onboarding, and administrator reporting processes.",
    related: ["fatca"],
  },
  {
    id: "ic", term: "IC", expansion: "Investment Committee",
    group: "investment-terms", category: "Governance",
    meaning: "A formal body responsible for reviewing and approving investment decisions, portfolio actions, or other investment related matters.",
    context: "IC review helps assess whether investment decisions are documented, appropriately challenged, consistently approved, and supported by clear authority thresholds and conflict controls.",
    related: ["cio", "cco"],
  },
  {
    id: "isda", term: "ISDA", expansion: "International Swaps and Derivatives Association",
    group: "investment-terms", category: "Counterparty",
    meaning: "The organization known for standard derivatives documentation, including the ISDA Master Agreement used between counterparties.",
    context: "ISDA documentation is important when a fund trades over the counter derivatives. Reviewers should consider counterparty terms, collateral arrangements, termination events, netting rights, and operational responsibility for monitoring exposures.",
    related: ["pb", "fcm"],
  },
  {
    id: "kyc", term: "KYC", expansion: "Know Your Customer",
    group: "investment-terms", category: "Compliance",
    meaning: "The process of verifying investor identity, ownership, control persons, source of funds, and risk profile as part of AML compliance.",
    context: "KYC review focuses on whether investor onboarding is complete, risk based, documented, periodically refreshed, and properly escalated when higher risk indicators are identified.",
    related: ["aml", "ofac", "fatf"],
  },
  {
    id: "lpa", term: "LPA", expansion: "Limited Partnership Agreement",
    group: "investment-terms", category: "Fund Documents",
    meaning: "The main governing agreement between the general partner and limited partners, setting out economics, governance rights, restrictions, reporting, transfers, and fund operation terms.",
    context: "A core diligence document because it defines what the manager is legally permitted and required to do. Reviewers compare the LPA against actual practices, investor reporting, fee calculations, and side letter terms.",
    related: ["lpac", "ppm", "mfn", "ddq"],
  },
  {
    id: "lpac", term: "LPAC", expansion: "Limited Partner Advisory Committee",
    group: "investment-terms", category: "Governance",
    meaning: "A committee of investor representatives that may review conflicts, valuation matters, fee issues, extensions, or other matters requiring investor oversight.",
    context: "LPAC review focuses on whether the committee has meaningful authority, receives sufficient information, records decisions properly, and operates independently from manager influence.",
    related: ["lpa"],
  },
  {
    id: "lti", term: "LTI", expansion: "Long Term Incentive",
    group: "investment-terms", category: "People",
    meaning: "A deferred compensation or retention arrangement for employees, often tied to vesting, firm performance, fund performance, or continued employment.",
    context: "LTI arrangements are relevant to team stability, succession planning, retention risk, and alignment. Reviewers may consider whether incentives support long term conduct rather than short term risk taking.",
  },
  {
    id: "mfn", term: "MFN", expansion: "Most Favored Nation",
    group: "investment-terms", category: "Fund Terms",
    meaning: "A side letter right allowing an investor to receive certain favorable terms granted to other investors in the same fund.",
    context: "MFN review is important because preferential rights can create complexity and unequal treatment among investors. Reviewers should assess the MFN election process, exclusions, disclosure, and administrator tracking.",
    related: ["lpa", "sunset-provision"],
  },
  {
    id: "mnpi", term: "MNPI", expansion: "Material Non Public Information",
    group: "investment-terms", category: "Compliance",
    meaning: "Information that is not publicly available and could reasonably affect the price of a security if disclosed.",
    context: "MNPI controls are central where a manager uses expert networks, private company information, public securities research, activist strategies, or issuer access. Reviewers should assess restricted lists, wall crossing procedures, personal trading controls, training, and surveillance.",
    related: ["alternative-data"],
  },
  {
    id: "nav", term: "NAV", expansion: "Net Asset Value",
    group: "investment-terms", category: "Valuation",
    meaning: "The value of a fund's assets minus liabilities, often used to calculate investor balances, subscriptions, redemptions, fees, and performance.",
    context: "NAV review focuses on valuation methodology, administrator role, pricing sources, expense accruals, fee calculations, review controls, and whether NAV is produced independently and consistently.",
    related: ["aum", "raum", "sma"],
  },
  {
    id: "nfa", term: "NFA", expansion: "National Futures Association",
    group: "investment-terms", category: "Regulator",
    meaning: "The U.S. self regulatory organization for the futures and derivatives industry, overseeing CPOs, CTAs, and related registrants.",
    context: "NFA relevance depends on the manager's derivatives activity and registration status. Reviewers may consider filings, examinations, disciplinary history, disclosure documents, and compliance testing.",
    related: ["cftc", "cpo", "cta"],
  },
  {
    id: "nist", term: "NIST", expansion: "National Institute of Standards and Technology",
    group: "investment-terms", category: "Technology",
    meaning: "A U.S. standards body known for cybersecurity frameworks commonly used to benchmark information security programs.",
    context: "NIST is relevant when assessing whether a manager's cybersecurity program is structured, documented, and aligned with recognized practices across access control, incident response, vendor risk, monitoring, and recovery.",
    related: ["bcp", "mfa"],
  },
  {
    id: "odd", term: "ODD", expansion: "Operational Due Diligence",
    group: "investment-terms", category: "Process",
    meaning: "A structured review of an investment manager's non investment operations, including governance, compliance, valuation, fund administration, technology, service providers, cash controls, and risk management.",
    context: "ODD helps investors assess whether operational weaknesses could create financial loss, reporting errors, fraud risk, regulatory exposure, or governance concerns separate from investment performance.",
    related: ["ddq"],
  },
  {
    id: "ofac", term: "OFAC", expansion: "Office of Foreign Assets Control",
    group: "investment-terms", category: "Compliance",
    meaning: "A U.S. Treasury agency responsible for administering and enforcing economic and trade sanctions.",
    context: "OFAC screening is relevant to AML and sanctions compliance. Reviewers consider whether investors, counterparties, vendors, and relevant transactions are screened against sanctions lists and escalated appropriately.",
    related: ["aml", "kyc", "fatf"],
  },
  {
    id: "oms", term: "OMS", expansion: "Order Management System",
    group: "investment-terms", category: "Technology",
    meaning: "A technology platform used to create, route, manage, and track trade orders.",
    context: "OMS review helps assess trade workflow, allocation controls, pre trade checks, approval rules, integration with portfolio systems, and the reliability of the manager's trading infrastructure.",
    related: ["pb"],
  },
  {
    id: "pb", term: "PB", expansion: "Prime Broker",
    group: "investment-terms", category: "Counterparty",
    meaning: "A financial institution providing services such as custody, financing, securities lending, trade execution, margin, and reporting, commonly used by hedge funds.",
    context: "Prime broker review focuses on counterparty risk, asset custody, financing terms, margin process, collateral movement, reporting, and whether the manager has appropriate oversight of broker relationships.",
    related: ["isda", "fcm", "oms"],
  },
  {
    id: "ppm", term: "PPM", expansion: "Private Placement Memorandum",
    group: "investment-terms", category: "Fund Documents",
    meaning: "The main offering document for a private fund, describing strategy, risks, fees, conflicts, liquidity terms, and legal structure for prospective investors.",
    context: "The PPM is central because it sets investor expectations and legal disclosures. Reviewers compare the PPM against the LPA, subscription documents, DDQ responses, side letters, and actual operating practices.",
    related: ["lpa", "ddq"],
  },
  {
    id: "raum", term: "RAUM", expansion: "Regulatory Assets Under Management",
    group: "investment-terms", category: "Firm Scale",
    meaning: "The asset figure reported for regulatory purposes, especially on Form ADV, and calculated under regulatory instructions rather than purely commercial presentation.",
    context: "RAUM may differ from marketed AUM. Reviewers should understand the calculation basis, compare it with Form ADV and investor materials, and identify whether differences are reasonable and clearly explained.",
    related: ["aum", "sec"],
  },
  {
    id: "sec", term: "SEC", expansion: "Securities and Exchange Commission",
    group: "investment-terms", category: "Regulator",
    meaning: "The U.S. federal agency regulating investment advisers, securities markets, broker dealers, and public disclosure.",
    context: "SEC relevance arises when the manager is registered, exempt reporting, marketing to U.S. investors, or subject to U.S. securities rules. Reviewers may check Form ADV, examination history, disciplinary disclosures, custody rules, marketing rules, and compliance program design.",
    related: ["raum", "finra"],
  },
  {
    id: "sma", term: "SMA", expansion: "Separately Managed Account",
    group: "investment-terms", category: "Fund Structure",
    meaning: "A portfolio managed for a single client under customized guidelines, often separate from pooled fund vehicles.",
    context: "SMA review matters because customized terms can create allocation, conflict, fee, reporting, and operational complexity. Reviewers should assess how the manager ensures fairness between SMAs and commingled funds.",
    related: ["nav"],
  },
  {
    id: "ssae-isae", term: "SSAE 16 / ISAE 3402", expansion: "Service organization control report standards",
    group: "investment-terms", category: "Service Providers",
    meaning: "Standards used for service organization control reports, commonly associated with SOC 1 reports covering internal controls at service providers such as administrators, custodians, and prime brokers.",
    context: "These reports help reviewers understand the control environment of key service providers. Review should consider report scope, testing period, exceptions, complementary user entity controls, and whether the report covers the actual services used by the fund.",
    related: ["soc-1"],
    aliases: ["SSAE 16", "ISAE 3402"],
  },
  {
    id: "soc-1", term: "SOC 1", expansion: "Service Organization Control report (financial reporting)",
    group: "investment-terms", category: "Service Providers",
    meaning: "A service organization control report focused on controls relevant to financial reporting, often reviewed for fund administrators, custodians, and other outsourced providers.",
    context: "SOC 1 review helps assess whether a service provider's controls around accounting, transaction processing, access, reconciliation, and reporting are independently tested. Exceptions and user control responsibilities should be reviewed carefully.",
    related: ["ssae-isae"],
  },
  {
    id: "mfa", term: "2FA / MFA", expansion: "Two Factor / Multi Factor Authentication",
    group: "investment-terms", category: "Technology",
    meaning: "A security process requiring users to verify identity through more than one method before accessing systems, accounts, or data.",
    context: "MFA is a basic but important cybersecurity control, especially for remote access, email, administrator portals, banking platforms, cloud systems, and privileged accounts. Reviewers should confirm that it is enforced rather than optional.",
    related: ["nist", "bcp"],
    aliases: ["2FA", "MFA"],
  },

  // ── Capital Commitment Terms (plain-language concepts) ───────────────────────
  {
    id: "capital-commitment", term: "Capital Commitment",
    group: "capital-commitment", category: "Fund Economics",
    meaning: "The amount of capital an investor has legally agreed to contribute to a fund, usually set out in the subscription agreement or limited partnership agreement. It is commonly referenced when discussing fund size, LP obligations, capital calls, and investor concentration.",
    context: "In diligence, capital commitments help show the reliability of the fund's capital base and whether the manager has proper controls to track commitments, issue capital calls, and reconcile investor contributions.",
    related: ["uncommitted-capital", "dry-powder"],
  },
  {
    id: "uncommitted-capital", term: "Uncommitted Capital",
    group: "capital-commitment", category: "Fund Economics",
    meaning: "Capital that has not yet been legally committed by investors or formally allocated to a fund, vehicle, or strategy. It may appear in fundraising discussions, soft commitment updates, pipeline planning, or future deployment assumptions.",
    context: "Matters because managers may sometimes present expected or informal capital as if it were already available. Diligence should distinguish actual committed capital from fundraising targets or verbal indications.",
    related: ["capital-commitment", "dry-powder"],
  },
  {
    id: "dry-powder", term: "Dry Powder",
    group: "capital-commitment", category: "Fund Economics",
    meaning: "Capital that has already been committed by investors but has not yet been invested. It is often used when discussing remaining investable capital, deployment pace, capital calls, and the investment pipeline.",
    context: "Dry powder helps assess whether the manager has sufficient opportunities, staffing, systems, and controls to deploy capital responsibly without creating operational strain or investment discipline issues.",
    related: ["capital-commitment", "uncommitted-capital"],
  },
  {
    id: "alternative-data", term: "Alternative Data",
    group: "capital-commitment", category: "Technology",
    meaning: "Non traditional data used to support investment research or decision making, such as web traffic, transaction records, satellite data, pricing data, supply chain information, or social media signals.",
    context: "Alternative data can strengthen investment analysis, but it also raises questions around data rights, licensing, privacy, cybersecurity, compliance review, vendor oversight, and how the data is incorporated into the investment process.",
    related: ["mnpi"],
  },
  {
    id: "sunset-provision", term: "Sunset Provision",
    group: "capital-commitment", category: "Fund Terms",
    meaning: "A clause that causes a right, obligation, fee term, restriction, or governance protection to expire after a specific date, period, or event. It often appears in side letters, fee arrangements, key person terms, governance rights, or special investor protections.",
    context: "Important because protections that appear strong at launch may weaken or disappear over time. Diligence should identify what expires, when it expires, and what practical effect that has on investors.",
    related: ["mfn", "lpa"],
  },
  {
    id: "european-waterfall", term: "European Waterfall",
    group: "capital-commitment", category: "Fund Economics",
    meaning: "A fund distribution model where investors generally receive contributed capital and preferred return before the manager receives carried interest. It is commonly discussed in relation to carried interest, preferred return, distributions, and fund economics.",
    context: "Generally more investor protective because carry is paid after broader fund performance is achieved. Diligence should confirm that the waterfall is clearly documented, consistently calculated, and properly reviewed.",
    related: ["american-waterfall"],
  },
  {
    id: "american-waterfall", term: "American Waterfall",
    group: "capital-commitment", category: "Fund Economics",
    meaning: "A fund distribution model where the manager may receive carried interest on individual realized investments before the entire fund has returned capital to investors. It is often seen in deal by deal carry structures.",
    context: "Can create a higher risk of early or excess carry payments. Diligence should focus on clawback provisions, escrow arrangements, calculation controls, and reporting transparency.",
    related: ["european-waterfall"],
  },
  {
    id: "gross-return", term: "Gross Return",
    group: "capital-commitment", category: "Performance",
    meaning: "Investment performance before deducting management fees, fund expenses, carried interest, taxes, and other costs borne by investors. It is often used in track records, marketing materials, and performance attribution.",
    context: "Gross return can help show the performance of the investment strategy, but it does not reflect the actual investor experience. Diligence should compare gross and net returns to understand the impact of the fund's full cost structure.",
    related: ["net-return", "cherry-picking"],
  },
  {
    id: "net-return", term: "Net Return",
    group: "capital-commitment", category: "Performance",
    meaning: "Investment performance after deducting fees, expenses, carried interest, and other applicable costs. It is usually the more relevant measure when assessing what investors actually receive.",
    context: "Net return should be reviewed for calculation consistency, supporting records, treatment of fees and expenses, and fair presentation across investor reports and marketing materials.",
    related: ["gross-return"],
  },
  {
    id: "assets-under-administration", term: "Assets under Administration",
    group: "capital-commitment", category: "Service Providers",
    meaning: "Assets for which a third party administrator provides operational services, such as fund accounting, NAV calculation, investor recordkeeping, capital activity processing, and reporting support.",
    context: "AUA helps indicate the scale and experience of an administrator, but it should not be confused with assets managed by an investment manager. Diligence should consider whether the administrator's experience is relevant to the fund's structure and complexity.",
    related: ["aum", "nav"],
    aliases: ["AUA"],
  },
  {
    id: "cherry-picking", term: "Cherry Picking",
    group: "capital-commitment", category: "Conduct Risk",
    meaning: "The selective presentation of favorable information while excluding weaker or less convenient results. It may appear in track records, sample investments, reference calls, case studies, portfolio examples, or marketing materials.",
    context: "A key diligence concern because it can make performance, operations, or manager quality appear stronger than the full evidence supports. Reviewers should look for complete, balanced, and consistently prepared information.",
    related: ["gross-return"],
  },
  {
    id: "secondaries", term: "Secondaries",
    group: "capital-commitment", category: "Transactions",
    meaning: "Transactions involving the purchase or sale of existing fund interests, investor commitments, or private market assets rather than new primary commitments. This may include LP interest transfers, GP led transactions, continuation vehicles, or portfolio liquidity solutions.",
    context: "Secondaries require careful review of valuation, transfer approvals, conflicts of interest, information rights, pricing methodology, and the process used to determine fairness to investors.",
    related: ["lpa"],
  },
  {
    id: "chaperone-anonymously", term: "Chaperone Anonymously",
    group: "capital-commitment", category: "Process",
    meaning: "A controlled communication process where a third party facilitates interaction while keeping one party's identity confidential. In diligence, this may relate to anonymous reference checks, protected investor feedback, or confidential information gathering.",
    context: "The key issue is whether anonymity protects participants without weakening verification quality. Reviewers should understand what information is anonymized, who controls the process, and whether the result can still be relied on.",
    related: ["ddq"],
  },
  {
    id: "signature-card", term: "Signature Card",
    group: "capital-commitment", category: "Cash Controls",
    meaning: "A bank record that identifies individuals authorized to sign, approve, or give instructions on a bank account. It is commonly reviewed in connection with cash controls, payment authority, and treasury procedures.",
    context: "Signature cards help verify whether bank authority matches the manager's internal approval policy. Diligence should check whether authorized signatories are current, properly approved, and consistent with segregation of duties.",
  },
];

/**
 * Terms eligible for inline auto-linking inside prose. Excludes genuinely
 * ambiguous very-short tokens (IC, PB) that read as initials/abbreviations mid
 * sentence — those still appear as curated `related` chips, which are explicit.
 * Acronyms are matched case-sensitively, so SEC/NAV/AUM are safe to include.
 */
const INLINE_EXCLUDE = new Set<string>(["ic", "pb"]);

export const INLINE_LINKABLE_IDS: Set<string> = new Set(
  GLOSSARY.map((t) => t.id).filter((id) => !INLINE_EXCLUDE.has(id)),
);

/** Lookup map, id → term. */
export const GLOSSARY_BY_ID: Record<string, GlossaryTerm> = Object.fromEntries(
  GLOSSARY.map((t) => [t.id, t]),
);

export const GROUP_LABELS: Record<GlossaryGroup, string> = {
  "investment-terms": "Investment Terms",
  "capital-commitment": "Capital & Commercial",
};
