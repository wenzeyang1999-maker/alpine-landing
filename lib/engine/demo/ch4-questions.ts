/**
 * Chapter 4 — Fund Structure, Terms & Alignment: the demo extraction bank.
 *
 * This is the SEPARATE demo bank (D5): the ~12 Ch4 questions a fund's prospectus + 10-K
 * can actually answer, each carrying the retrieval terms + extraction instruction the
 * Stage-1 extractor needs. `frameworkId` maps every entry back to the canonical
 * call-guide question in framework-full.ts; a bidirectional test guards against drift.
 *
 * Leverage / asset-coverage is intentionally absent — in the call guide that lives in
 * Chapter 6 (Lines of Credit), not Chapter 4, so it has no honest Ch4 home.
 */
import { DemoQuestion } from "./questions";

export const CH4_QUESTIONS: DemoQuestion[] = [
  {
    id: "04.06.25", frameworkId: "04.06.25", chapterNum: 4,
    subsection: "Legal Structure", label: "Fund domicile",
    ask: "Where is the fund incorporated or organized (its domicile / place of formation)? Extract the statement.",
    retrievalTerms: ["incorporated in", "organized under the laws", "Maryland", "Delaware", "reincorporated"],
    docPref: "prospectus", filingAnswerable: true,
  },
  {
    id: "04.06.26", frameworkId: "04.06.26", chapterNum: 4,
    subsection: "Legal Structure", label: "Corporate form / fund type",
    ask: "What is the fund's legal/corporate form and investment-company type (e.g. Maryland corporation; closed-end, externally managed, non-diversified BDC)? Extract the statement.",
    retrievalTerms: ["business development company", "closed-end", "externally managed", "non-diversified", "Maryland corporation", "Investment Company Act of 1940"],
    docPref: "tenk", filingAnswerable: true,
  },
  {
    id: "04.06.30", frameworkId: "04.06.30", chapterNum: 4,
    subsection: "Fund Structure", label: "Fund structure (managed / listed)",
    ask: "How is the fund structured and managed (externally managed by an adviser; exchange-listed)? Extract the structural description.",
    retrievalTerms: ["externally managed", "we are managed by", "our investment adviser", "listed on", "trades on", "common stock is traded"],
    docPref: "tenk", filingAnswerable: true,
  },
  {
    id: "04.06.27", frameworkId: "04.06.27", chapterNum: 4,
    subsection: "Legal Structure", label: "Incorporation / commencement",
    ask: "When was the fund incorporated/formed and when did it commence operations (IPO)? Extract the dates.",
    retrievalTerms: ["founded on", "formed on", "organized on", "incorporated on", "commenced operations", "initial public offering", "were initially funded"],
    docPref: "tenk", filingAnswerable: true,
  },
  {
    id: "04.06.32", frameworkId: "04.06.32", chapterNum: 4,
    subsection: "Legal Structure", label: "Subsidiaries / SPVs",
    ask: "Does the fund have subsidiaries or trading affiliates (SPVs, CLOs)? Extract the statement naming one; abstain if none disclosed.",
    retrievalTerms: ["wholly-owned subsidiary", "consolidated subsidiary", "wholly-owned and consolidated", "CLO", "special purpose"],
    docPref: "tenk", filingAnswerable: true,
  },
  {
    id: "04.09.45", frameworkId: "04.09.45", chapterNum: 4,
    subsection: "AUM & Concentration", label: "Total assets / AUM",
    ask: "What are the fund's total assets / AUM as of the most recent balance-sheet date? Extract the figure.",
    retrievalTerms: ["total assets of", "billion of total assets", "billion in total assets", "total assets were"],
    docPref: "tenk", filingAnswerable: true,
  },
  {
    id: "04.10.54", frameworkId: "04.10.54", chapterNum: 4,
    subsection: "Administrator", label: "Externally managed / no employees",
    ask: "Is the fund externally managed with services provided by the adviser/administrator (e.g. no direct employees)? Extract the statement.",
    retrievalTerms: ["do not currently have any employees", "do not have any employees", "externally managed", "administration agreement", "our administrator"],
    docPref: "tenk", filingAnswerable: true,
  },
  {
    id: "04.18.118", frameworkId: "04.18.118", chapterNum: 4,
    subsection: "Management & Incentive Fee", label: "Incentive-fee crystallization",
    ask: "How often is the incentive fee determined/paid (crystallization period — quarterly, annual)? Extract the statement.",
    retrievalTerms: ["payable quarterly in arrears", "determined and paid quarterly", "calculated quarterly", "quarterly in arrears"],
    docPref: "prospectus", filingAnswerable: true,
  },
  {
    id: "04.11.55", frameworkId: "04.11.55", chapterNum: 4,
    subsection: "Share Classes", label: "Share classes / interests",
    ask: "What classes of shares or interests does the fund have outstanding (e.g. a single class of common stock, or multiple classes)? Extract the description; abstain if a single class.",
    retrievalTerms: ["shares of our common stock", "single class", "common stock, par value", "classes of", "no par value"],
    docPref: "prospectus", filingAnswerable: true,
  },
  {
    id: "04.04.15", frameworkId: "04.04.15", chapterNum: 4,
    subsection: "Insider Investment & Alignment", label: "Insider / adviser alignment",
    ask: "Do the adviser, officers, or directors hold or invest in the fund's shares alongside investors (skin in the game)? Extract the statement; abstain if not disclosed in this filing.",
    retrievalTerms: ["our officers and directors", "beneficially own", "purchased shares", "members of our management", "investment in our", "ownership of our common stock"],
    docPref: "tenk", filingAnswerable: true,
  },
  {
    id: "04.18.116", frameworkId: "04.18.116", chapterNum: 4,
    subsection: "Management & Incentive Fee", label: "Base management fee",
    ask: "What is the contractual base management fee rate and the asset base it is charged on (total assets, gross assets, net assets)? Extract the CONTRACTUAL rate — NOT the expense-ratio table figure.",
    retrievalTerms: ["base management fee", "management fee is", "annual rate of", "of our total assets", "of our gross assets", "of our average"],
    docPref: "prospectus", filingAnswerable: true,
  },
  {
    id: "04.18.117", frameworkId: "04.18.117", chapterNum: 4,
    subsection: "Management & Incentive Fee", label: "Incentive fee",
    ask: "What is the incentive fee — the rate on income and/or capital gains? Extract the headline rate; do NOT confuse the catch-up '100%' with the incentive rate.",
    retrievalTerms: ["incentive fee", "pre-incentive fee net investment income", "capital gains incentive fee", "17.5%", "20%", "calculated at a rate of"],
    docPref: "prospectus", filingAnswerable: true,
  },
  {
    id: "04.19.126", frameworkId: "04.19.126", chapterNum: 4,
    subsection: "Management & Incentive Fee", label: "Hurdle / preferred return",
    ask: "Is there a hurdle (preferred return) before the incentive fee, and at what rate? Extract the hurdle rate.",
    retrievalTerms: ["hurdle rate", "preferred return", "per quarter", "annualized", "hurdle"],
    docPref: "prospectus", filingAnswerable: true,
  },
  {
    id: "04.20.147", frameworkId: "04.20.147", chapterNum: 4,
    subsection: "Other Fees & Expenses", label: "Expense cap / waiver",
    ask: "Is there an expense cap, fee waiver, or expense-support/reimbursement arrangement? Extract the statement; abstain if none is disclosed.",
    retrievalTerms: ["expense limitation", "expense cap", "waive", "reimburse", "expense support"],
    docPref: "prospectus", filingAnswerable: true,
  },
  {
    id: "04.20.157", frameworkId: "04.20.157", chapterNum: 4,
    subsection: "Other Fees & Expenses", label: "Management fee offset",
    ask: "Does the fund have a management-fee offset, or does the adviser waive/credit other fees against the management fee? Extract the statement; abstain if not disclosed.",
    retrievalTerms: ["management fee offset", "voluntarily waive", "waive a portion", "credit", "other fees", "fee waiver agreement"],
    docPref: "prospectus", filingAnswerable: true,
  },
  {
    id: "04.20.159", frameworkId: "04.20.159", chapterNum: 4,
    subsection: "Other Fees & Expenses", label: "Expense ratio",
    ask: "What is the fund's total annual expenses as a percentage of net assets (the expense ratio)? Extract the figure from the fees-and-expenses table.",
    retrievalTerms: ["total annual expenses", "as a percentage of net assets", "other expenses", "Total annual expenses", "operating expenses"],
    docPref: "prospectus", filingAnswerable: true,
  },
  {
    id: "04.17.114", frameworkId: "04.17.114", chapterNum: 4,
    subsection: "Side Letters", label: "Side letters / preferential terms",
    ask: "Has the fund entered side letters granting preferential fees, liquidity, or transparency (MFN)? Registered funds rarely disclose these — abstain (route to the analyst call / DDQ) if not stated.",
    retrievalTerms: ["side letter", "most favored nation", "preferential", "MFN"],
    docPref: "prospectus", filingAnswerable: false,
  },
];
