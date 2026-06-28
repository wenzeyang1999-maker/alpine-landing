/**
 * Chapter 7 — Valuation, Asset Existence & Investor Reporting.
 * The FILING-ANSWERABLE question set for the Mercer demo: the valuation questions a
 * real fund prospectus + 10-K can answer with grounded evidence. Each carries
 * retrieval terms (to find candidate passages) and an extraction instruction (what
 * the LLM must pull, with a verbatim quote — or abstain). Questions the filing can't
 * answer (e.g. interim NAV process detail) abstain by design and route to the call/DDQ.
 *
 * IDs follow the framework (07.<subsection>.<n>); chapterNum is 7 throughout.
 */
import { DemoQuestion } from "./questions";

export const CH7_QUESTIONS: DemoQuestion[] = [
  {
    id: "07.02.policy",
    chapterNum: 7,
    subsection: "Valuation Policy",
    label: "Written valuation policy",
    ask: "Does the fund maintain a written valuation policy, and is fair value determined under a defined process? Extract the statement establishing the policy.",
    retrievalTerms: ["valuation policy", "valued at fair value", "valuation procedures", "determined in good faith"],
    docPref: "tenk",
    filingAnswerable: true,
  },
  {
    id: "07.01.governance",
    chapterNum: 7,
    subsection: "Valuation Governance",
    label: "Valuation governance (board / Rule 2a-5)",
    ask: "Who is responsible for determining fair value — the board of directors/trustees, or a designated valuation designee under Rule 2a-5? Extract the governance statement.",
    retrievalTerms: ["valuation designee", "Rule 2a-5", "board of directors", "board of trustees", "determined in good faith by"],
    docPref: "tenk",
    filingAnswerable: true,
  },
  {
    id: "07.03.committee",
    chapterNum: 7,
    subsection: "Valuation Committee",
    label: "Valuation committee",
    ask: "Is there a valuation committee, and what is its role/composition? Extract the statement; note if composition (independent vs investment professionals) is disclosed.",
    retrievalTerms: ["valuation committee", "pricing committee"],
    docPref: "tenk",
    filingAnswerable: true,
  },
  {
    id: "07.04.fairvalue-levels",
    chapterNum: 7,
    subsection: "Fair Value Hierarchy",
    label: "Fair value hierarchy (Level 1/2/3)",
    ask: "What is the fair-value hierarchy exposure, especially the proportion of the portfolio in Level 3 (unobservable) inputs? Extract the Level 3 figure/percentage if stated.",
    retrievalTerms: ["Level 3", "fair value hierarchy", "unobservable inputs", "Level 1", "Level 2"],
    docPref: "tenk",
    filingAnswerable: true,
  },
  {
    id: "07.08.private-fairvalue",
    chapterNum: 7,
    subsection: "Private Securities / Fair Valuation Techniques",
    label: "Independent valuation / third-party pricing",
    ask: "Does the fund engage an independent third-party valuation firm or pricing service for hard-to-value/private positions? Extract the statement; abstain if not disclosed.",
    retrievalTerms: ["independent valuation", "third-party valuation", "valuation firm", "pricing service", "independent pricing"],
    docPref: "tenk",
    filingAnswerable: true,
  },
  {
    id: "07.05.pricing-sources",
    chapterNum: 7,
    subsection: "Pricing Services and Feeds",
    label: "Pricing sources / feeds",
    ask: "What pricing sources or feeds are used (e.g. independent pricing services, broker quotes, models)? Extract the description.",
    retrievalTerms: ["pricing service", "broker quotes", "pricing vendors", "market quotations", "independent pricing"],
    docPref: "tenk",
    filingAnswerable: true,
  },
  {
    id: "07.12.nav-per-share",
    chapterNum: 7,
    subsection: "Net Asset Value",
    label: "NAV per share",
    ask: "What is the most recent reported net asset value (NAV) per share? Extract the figure with its date if shown.",
    retrievalTerms: ["net asset value per share", "NAV per share"],
    docPref: "tenk",
    filingAnswerable: true,
  },
  {
    id: "07.12.nav-frequency",
    chapterNum: 7,
    subsection: "Net Asset Value",
    label: "NAV calculation frequency",
    ask: "How frequently is NAV calculated/determined (e.g. daily, monthly, quarterly)? Extract the statement; abstain if not stated.",
    retrievalTerms: ["net asset value", "determine our net asset value", "calculate our net asset value", "quarterly", "monthly"],
    docPref: "tenk",
    filingAnswerable: true,
  },
  {
    id: "07.14.auditor",
    chapterNum: 7,
    subsection: "Audit and Audit Opinion",
    label: "Independent auditor",
    ask: "Who is the fund's independent registered public accounting firm (auditor)? Extract the firm name.",
    retrievalTerms: ["independent registered public accounting firm", "We have served as", "audited by"],
    docPref: "tenk",
    filingAnswerable: true,
  },
  {
    id: "07.14.audit-opinion",
    chapterNum: 7,
    subsection: "Audit and Audit Opinion",
    label: "Audit opinion / going concern",
    ask: "Is the audit opinion unqualified, and is there any going-concern or emphasis-of-matter paragraph? Extract the relevant statement; abstain if the opinion text is not present.",
    retrievalTerms: ["going concern", "emphasis of matter", "unqualified opinion", "in our opinion", "fairly, in all material respects"],
    docPref: "tenk",
    filingAnswerable: true,
  },
  {
    id: "07.09.price-overrides",
    chapterNum: 7,
    subsection: "Other Pricing Controls",
    label: "Independent price verification / overrides",
    ask: "Does the back office independently verify prices, and are there controls/thresholds over price overrides? This is often NOT in a filing — abstain (route to the analyst call) if not clearly stated.",
    retrievalTerms: ["independently verify", "price override", "back office", "verification of prices"],
    docPref: "tenk",
    filingAnswerable: false,
  },
];
