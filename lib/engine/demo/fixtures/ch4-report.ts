/**
 * Stage-2 (PR2) curated output: the AI-drafted Chapter 4 write-up for the demo funds,
 * in the Trellis house style, plus the prefilled call-guide answer set that feeds it.
 *
 * For the demo (offline, no API) these are hand-authored to the quality bar of the real
 * sample reports, the same way the curated extraction fixtures are. With an API key the
 * same pieces are produced at runtime by ch4-generate.ts: factual spine (from grounded
 * answers) + fired flags (from the deterministic flag predicates) + analyst synthesis.
 *
 * Every answer is tagged `filing` (grounded, with a citation) or `manager_call` (a
 * reasonable analyst fill the demo shows as editable, "from the manager call").
 */

export type AnswerSource = "filing" | "manager_call";

export type Ch4Field = {
 id: string; // framework question id where one exists
 subsection: string; // report-facing sub-section
 question: string; // short label
 answer: string; // the value used to write the narrative
 source: AnswerSource; // filing (cited) vs manager_call (editable)
 quote?: string; // verbatim source quote when source === "filing"
};

export type Ch4Report = {
 ticker: string;
 name: string;
 rating: "GREEN" | "YELLOW" | "RED";
 ratingLabel: string; // "Accept" / "Watch List" / "Reject"
 flagsFired: string[]; // ids from ch4-flag-library
 fields: Ch4Field[];
 /** The AI-drafted Chapter 4 narrative (markdown, 8-section Trellis skeleton). */
 narrative: string;
};

const F = (id: string, subsection: string, question: string, answer: string, quote: string): Ch4Field =>
 ({ id, subsection, question, answer, source: "filing", quote });
const M = (id: string, subsection: string, question: string, answer: string): Ch4Field =>
 ({ id, subsection, question, answer, source: "manager_call" });

// ─── ARCC ─────────────────────────────────────────────────────────────────────
const arccFields: Ch4Field[] = [
 F("04.06.26", "Legal Structure", "Corporate form / fund type", "Closed-end, externally managed, non-diversified BDC (Maryland corporation)", "specialty finance company that is a closed-end, non-diversified management investment company"),
 F("04.06.25", "Legal Structure", "Fund domicile", "Maryland", "Maryland corporation"),
 F("04.06.27", "Legal Structure", "Incorporation / commencement", "Founded April 16, 2004; IPO October 2004", "founded on April 16, 2004, were initially funded on June 23, 2004"),
 F("04.06.30", "Legal Structure", "Fund structure (managed / listed)", "Externally managed; NASDAQ-listed (ARCC)", "Our common stock is traded on The NASDAQ"),
 F("04.06.32", "Legal Structure", "Subsidiaries / SPVs", "Consolidated CLO/SPV financing subsidiaries (e.g. Ares Direct Lending CLO 1 LLC)", "consolidated subsidiary, Ares Direct Lending CLO 1 LLC"),
 M("04.06.29", "Legal Structure", "Master-feeder?", "No master-feeder structure, single listed corporation"),
 F("04.09.45", "AUM", "Total assets / AUM", "$31.2 billion total assets", "$31.2 billion of total assets"),
 M("04.09.46", "AUM", "NAV per share / performance", "NAV per share and YTD total return to be confirmed against the most recent fact sheet"),
 M("04.10.54", "Service Providers", "Administrator", "Administrative services provided by an affiliate of the adviser (Ares Operations); no direct employees"),
 F("04.10.54b", "Service Providers", "Externally managed / no employees", "Externally managed; no employees", "do not currently have any employees and do not expect to have any employees"),
 M("05.02", "Service Providers", "Auditor", "KPMG LLP (independent registered public accounting firm)"),
 M("05.03", "Service Providers", "Custodian", "Third-party custodian / collateral agent for portfolio loans (to be confirmed)"),
 M("01.20", "Corporate Governance", "Board of directors", "Board of directors with a majority of independent directors, as required under the 1940 Act"),
 M("04.11.55", "Terms", "Share classes / interests", "Single class of common stock"),
 M("04.11.61", "Terms", "Voting rights", "One vote per share"),
 M("04.14", "Terms", "Liquidity / redemptions", "Listed, perpetual vehicle, no investor redemption right; liquidity via secondary market sale on NASDAQ"),
 F("04.18.116", "Fees and Expenses", "Base management fee", "1.5% of total assets", "annual rate of 1.5% based on the average value of our total assets"),
 M("04.18.117", "Fees and Expenses", "Incentive fee", "Two-part incentive fee: an income-based fee and a capital-gains-based fee, each at 20%"),
 F("04.19.126", "Fees and Expenses", "Hurdle / preferred return", "1.75% per quarter (7.0% annualized) hurdle on the income-based fee, with a catch-up", "hurdle rate of 1.75%"),
 F("04.18.118", "Fees and Expenses", "Incentive-fee crystallization", "Quarterly, in arrears", "payable quarterly in arrears"),
 F("04.20.159", "Fees and Expenses", "Expense ratio", "13.76% of net assets (gross of fee waivers; inclusive of interest expense and incentive fees)", "Total annual expenses 13.76"),
 M("04.20.136", "Fees and Expenses", "Expense pass-throughs", "Operating expenses borne by the Company under the administration agreement; research/data and travel allocation policy to be confirmed"),
 M("04.20.157", "Fees and Expenses", "Management fee offset / waivers", "Historical voluntary fee waivers; offset of other fees to be confirmed"),
 M("06.02", "Investment Strategy", "Strategy", "Direct origination of senior secured loans to U.S. middle-market companies"),
];

const arccNarrative = `#### Legal Structure

Ares Capital Corporation (the "Company") is a specialty finance company organized as a Maryland corporation. The Company was founded on April 16, 2004, was initially funded on June 23, 2004, and completed its initial public offering in October 2004. The Company has elected to be regulated as a business development company ("BDC") under the Investment Company Act of 1940 (the "1940 Act") and operates as a closed-end, externally managed, non-diversified management investment company. The Company's common stock is traded on The NASDAQ Global Select Market under the symbol "ARCC".

In contrast to the commingled limited partnership and offshore corporate structures more commonly encountered in our operational due diligence reviews, the Company is a publicly listed, registered investment company. Investors access the strategy by acquiring shares in the secondary market rather than through a subscription and redemption mechanism, and benefit from the disclosure, governance and shareholder protections afforded by the 1940 Act and the listing exchange. In our opinion, the registered, exchange-listed BDC structure is a comparatively investor-friendly vehicle from an operational standpoint.

The Company conducts a portion of its financing activities through consolidated subsidiaries, including special purpose vehicles such as Ares Direct Lending CLO 1 LLC, which facilitate the Company's secured borrowings. Such structures are customary for BDCs that employ leverage, and we note that they are consolidated within the Company's audited financial statements. While the use of multiple financing subsidiaries introduces a degree of structural and accounting complexity, we are satisfied that these vehicles fall within the same audit and administrative oversight as the Company itself.

#### Assets under Management - Fund Level

As at the most recent fiscal year end, the Company reported total assets of approximately $31.2 billion, ranking it among the largest BDCs in the market. We note that the Company's scale supports a well-resourced operating platform and broad access to debt financing, and mitigates the financial-viability concerns that can arise for smaller vehicles. The Company's net asset value per share and year-to-date total return should be confirmed against the most recent publicly filed fact sheet during the analyst call.

#### Service Providers

The Company is externally managed and represented that it does not have any employees; administrative services are provided by an affiliate of the investment adviser pursuant to an administration agreement. We note that the use of an adviser-affiliated administrator is standard practice for externally managed BDCs, although it does not provide the same degree of independence as a third-party administrator, and we would expect the allocation of costs under the administration agreement to be reviewed on the call. KPMG LLP is engaged as the Company's independent registered public accounting firm; we did not identify any indication of an auditor that also provides services to the management company. The identity of the custodian and collateral agent for the Company's loan portfolio should be confirmed during diligence.

#### Corporate Governance

As a registered investment company, the Company maintains a board of directors, a majority of whose members are required to be independent of the adviser under the 1940 Act. This is a meaningful point of differentiation from the limited partnership and trust structures more typically reviewed, which generally lack any independent board and vest governance solely in the general partner or manager. We regard the presence of an independent-majority board, together with the oversight obligations imposed by the 1940 Act, as a positive feature of the structure that supports independent governance over related-party arrangements, leverage and valuation.

#### Terms

The Company has a single class of common stock, with one vote per share. As a listed, perpetual vehicle, the Company does not offer investors a redemption right; liquidity is achieved through sale of shares in the secondary market on NASDAQ. Accordingly, the redemption-related provisions that feature prominently in our review of open-ended funds (lock-ups, notice periods, gating, audit holdbacks, side pockets and liquidating-trust mechanisms) are not applicable to the Company. We view the exchange-listed liquidity profile favorably relative to the negotiated, periodic liquidity terms of commingled private vehicles, while noting that secondary-market liquidity is a function of trading volume and the prevailing premium or discount to net asset value.

#### Fees and Expenses

The Company pays a base management fee at an annual rate of 1.5% based on the average value of its total assets (excluding cash). This is within the customary range for externally managed BDCs. The incentive fee comprises two components, an income-based fee and a capital-gains-based fee, each charged at 20%, consistent with the 2 and 20 de facto market standard and not exceeding the 20% level above which we would flag an incentive allocation as onerous. The income-based fee is subject to a hurdle rate of 1.75% per quarter (7.0% annualized) with a catch-up, and is payable quarterly in arrears. We note that the quarterly crystallization of the income-based fee is standard for the BDC structure and is calculated by reference to net investment income rather than total return; investors should remain aware that an income-based incentive fee can be earned in a period notwithstanding negative total return arising from unrealized depreciation, although the capital-gains fee is assessed on a cumulative, net-realized basis.

The Company's total annual expenses were reported at 13.76% of net assets. We highlight that this figure is materially elevated relative to a traditional fund expense ratio because, in line with BDC disclosure conventions, it is calculated gross and includes interest expense on the Company's borrowings and the incentive fee, both of which are a function of the leveraged credit strategy rather than indicative of administrative inefficiency. The Company's expense-allocation practices, including the treatment of research, data and travel costs and the existence of any management fee offset or voluntary fee waivers, should be confirmed during the analyst call.

#### Investment Strategy

The Company pursues a direct lending strategy, originating senior secured loans primarily to U.S. middle-market companies. A fuller assessment of the investment process, portfolio liquidity and leverage is set out in the relevant chapters of this report.

#### Fund Summary

The Company presents as a large, externally managed, exchange-listed BDC with a structure that is, in several respects, more investor-friendly than the commingled private vehicles more commonly subject to our review: an independent-majority board and 1940 Act oversight, exchange-listed liquidity in place of negotiated redemption terms, and a market-standard fee schedule (a 1.5% base management fee and a 20% incentive fee subject to a 7.0% annualized hurdle with catch-up). The principal structural feature warranting attention is the use of consolidated financing subsidiaries, which is customary for a leveraged BDC and is captured within the Company's consolidated audit. A number of items (the administrator cost allocation, custodian arrangements, and expense and fee-waiver policies) were not fully determinable from public filings and have been noted for confirmation on the analyst call. Subject to that confirmation, no material issues were identified at the structural, terms or alignment level, which supports our Green rating for Fund.`;

// ─── BXSL ─────────────────────────────────────────────────────────────────────
const bxslFields: Ch4Field[] = [
 F("04.06.26", "Legal Structure", "Corporate form / fund type", "Closed-end BDC", "closed-end management investment company that has elected to be regulated as a business development company"),
 F("04.06.25", "Legal Structure", "Fund domicile", "Delaware (statutory trust)", "Delaware statutory trust"),
 F("04.06.27", "Legal Structure", "Incorporation / commencement", "Formed March 26, 2018", "formed on March 26, 2018"),
 F("04.06.30", "Legal Structure", "Fund structure (managed / listed)", "Externally managed; NYSE-listed (BXSL)", "traded on the NYSE under the symbol"),
 F("04.06.32", "Legal Structure", "Subsidiaries / SPVs", "Wholly-owned consolidated financing subsidiary (formed 2019)", "wholly-owned and consolidated subsidiary that was formed in 2019"),
 M("04.09.45b", "AUM", "Total assets / AUM", "Multi-billion-dollar portfolio (confirm latest figure)"),
 F("04.10.54", "Service Providers", "Externally managed / no employees", "Externally managed; no employees", "do not currently have any employees"),
 M("01.20", "Corporate Governance", "Board of trustees", "Board of trustees with a majority of independent trustees (1940 Act)"),
 M("04.14", "Terms", "Liquidity", "Listed, perpetual vehicle, liquidity via NYSE secondary market"),
 F("04.18.116", "Fees and Expenses", "Base management fee", "1.0% of gross assets", "annual rate of 1.0% of the average value of our gross assets"),
 F("04.18.117", "Fees and Expenses", "Incentive fee", "17.5%", "incentive fee of 17.5%"),
 F("04.18.118", "Fees and Expenses", "Incentive-fee crystallization", "Quarterly, in arrears", "payable quarterly in arrears"),
 M("04.19.126", "Fees and Expenses", "Hurdle", "Income-based fee hurdle to be confirmed on the call"),
 M("06.02", "Investment Strategy", "Strategy", "Direct origination of senior secured (first lien) loans to U.S. companies"),
];

const bxslNarrative = `#### Legal Structure

Blackstone Secured Lending Fund (the "Fund") is a Delaware statutory trust that has elected to be regulated as a business development company under the Investment Company Act of 1940. The Fund was formed on March 26, 2018, is externally managed, and its common shares are traded on the New York Stock Exchange under the symbol "BXSL". As with other listed BDCs reviewed by Alpine, investors access the strategy through the secondary market rather than a subscription and redemption mechanism, and benefit from 1940 Act and exchange-level protections.

The Fund conducts certain financing activities through a wholly-owned and consolidated subsidiary formed in 2019. The use of a consolidated financing subsidiary is customary for a leveraged BDC and is captured within the Fund's audited financial statements; we did not identify structural complexity beyond that typical of the vehicle type.

#### Assets under Management - Fund Level

The Fund operates a multi-billion-dollar senior secured lending portfolio; the most recent total assets and net asset value per share should be confirmed against the latest filing. The Fund benefits from the scale and financing access of the Blackstone Credit & Insurance platform.

#### Service Providers

The Fund is externally managed and represented that it does not have any employees. The identity and independence of the administrator, auditor and custodian should be confirmed on the analyst call; we did not identify any auditor independence concern from the public filings.

#### Corporate Governance

As a registered investment company, the Fund maintains a board of trustees with a majority of independent trustees, as required under the 1940 Act. We regard the independent-majority board and 1940 Act oversight as a positive governance feature relative to the limited partnership structures more typically reviewed, which generally lack independent board oversight.

#### Terms

The Fund is a listed, perpetual vehicle and does not offer an investor redemption right; liquidity is achieved through secondary-market sale on the NYSE. The redemption, gating, side-pocket and holdback provisions assessed for open-ended funds are not applicable. We view the exchange-listed liquidity profile favorably, subject to the usual observation that secondary-market liquidity depends on trading volume and the prevailing premium or discount to net asset value.

#### Fees and Expenses

The Fund pays a base management fee at an annual rate of 1.0% of the average value of its gross assets, below the 1.5% level charged by a number of peer BDCs, and an incentive fee of 17.5%, which is below the 20% level we flag as above market. The incentive fee is payable quarterly in arrears. The income-based fee hurdle and any fee-waiver or expense-cap arrangements should be confirmed on the analyst call. Overall, the Fund's fee schedule sits at the more competitive end of the BDC range.

#### Investment Strategy

The Fund pursues a direct lending strategy focused on first lien senior secured loans to U.S. companies; the investment process and leverage are addressed in the relevant chapters.

#### Fund Summary

The Fund presents as an externally managed, NYSE-listed BDC with a below-peer 1.0% management fee, a below-market 17.5% incentive rate, an independent-majority board and 1940 Act oversight, and exchange-listed liquidity. The only notable structural feature is the consolidated financing subsidiary, which is customary for the vehicle type and captured in the consolidated audit. Service-provider identities, the income-based fee hurdle and expense-allocation practices were not fully determinable from public filings and are noted for confirmation on the analyst call. Subject to that confirmation, no material issues were identified, supporting our Green rating for Fund.`;

// ─── OBDC ─────────────────────────────────────────────────────────────────────
const obdcFields: Ch4Field[] = [
 F("04.06.26", "Legal Structure", "Corporate form / fund type", "BDC regulated under the 1940 Act (Maryland corporation)", "elected to be regulated as a business development company"),
 F("04.06.25", "Legal Structure", "Fund domicile", "Maryland", "Maryland corporation"),
 F("04.06.27", "Legal Structure", "Incorporation / commencement", "Formed October 15, 2015 (Maryland)", "formed on October 15, 2015, as a corporation under the laws of the State of Maryland"),
 F("04.06.30", "Legal Structure", "Fund structure (managed / listed)", "Externally managed; NYSE-listed (OBDC)", "listed on the NYSE under the symbol"),
 F("04.06.32", "Legal Structure", "Subsidiaries / SPVs", "Wholly-owned subsidiaries (incl. merger sub)", "wholly-owned subsidiary of the Company"),
 F("04.09.45", "AUM", "Total assets / AUM", "$17.19 billion total assets (as at December 31, 2025)", "$17.19 billion in total assets"),
 F("04.10.54", "Service Providers", "Externally managed / no employees", "Externally managed; no employees", "do not currently have any employees"),
 M("01.20", "Corporate Governance", "Board of directors", "Board of directors with a majority of independent directors (1940 Act)"),
 M("04.14", "Terms", "Liquidity", "Listed, perpetual vehicle, liquidity via NYSE secondary market"),
 F("04.18.116", "Fees and Expenses", "Base management fee", "1.5% of gross assets", "1.5% of our average gross assets"),
 F("04.18.117", "Fees and Expenses", "Incentive fee", "17.5%", "incentive fee of 17.5%"),
 F("04.18.118", "Fees and Expenses", "Incentive-fee crystallization", "Quarterly, in arrears", "payable quarterly in arrears"),
 F("04.20.159", "Fees and Expenses", "Expense ratio", "13.3% of net assets (gross; incl. interest & incentive fees)", "Total Annual Expenses 13.3"),
 M("06.02", "Investment Strategy", "Strategy", "Direct lending to U.S. upper-middle-market companies"),
];

const obdcNarrative = `#### Legal Structure

Blue Owl Capital Corporation (the "Company") is a Maryland corporation, formed on October 15, 2015, that has elected to be regulated as a business development company under the Investment Company Act of 1940. The Company is externally managed and its common stock is listed and traded on the New York Stock Exchange under the symbol "OBDC". Investors access the strategy through the secondary market, and benefit from the disclosure and governance protections of the 1940 Act and the listing exchange.

The Company holds certain assets through wholly-owned subsidiaries, including a merger subsidiary used in connection with corporate activity. Such consolidated subsidiaries are customary for a BDC and are captured within the Company's audited financial statements.

#### Assets under Management - Fund Level

As at December 31, 2025, the Company reported total assets of approximately $17.19 billion, ranking it among the larger BDCs in the market. The Company's net asset value per share should be confirmed against the most recent publicly filed fact sheet during the analyst call. The Company benefits from the scale of the Blue Owl direct lending platform.

#### Service Providers

The Company is externally managed and represented that it does not have any employees. The identity and independence of the administrator, auditor and custodian should be confirmed on the analyst call.

#### Corporate Governance

As a registered investment company, the Company maintains a board of directors with a majority of independent directors, as required under the 1940 Act. We regard the independent-majority board and 1940 Act oversight as a positive governance feature relative to the limited partnership structures more typically reviewed.

#### Terms

The Company is a listed, perpetual vehicle and does not offer an investor redemption right; liquidity is achieved through secondary-market sale on the NYSE. The redemption, gating, side-pocket and holdback provisions assessed for open-ended funds are not applicable. We view the exchange-listed liquidity profile favorably, subject to the usual dependence of secondary-market liquidity on trading volume and any premium or discount to net asset value.

#### Fees and Expenses

The Company pays a base management fee at an annual rate of 1.5% of its average gross assets and an incentive fee of 17.5%, which is below the 20% level we flag as above market; the incentive fee is payable quarterly in arrears. The Company's total annual expenses were reported at 13.3% of net assets, elevated relative to a traditional expense ratio because, consistent with BDC disclosure conventions, the figure is calculated gross and includes interest expense and incentive fees attributable to the leveraged credit strategy. The income-based fee hurdle and any fee-waiver arrangements should be confirmed on the analyst call.

#### Investment Strategy

The Company pursues a direct lending strategy focused on U.S. upper-middle-market companies; the investment process and leverage are addressed in the relevant chapters.

#### Fund Summary

The Company presents as an externally managed, NYSE-listed BDC with a market-standard 1.5% management fee, a below-market 17.5% incentive rate, an independent-majority board and 1940 Act oversight, and exchange-listed liquidity in place of negotiated redemption terms. The notable structural feature is the use of consolidated subsidiaries, customary for the vehicle type and captured in the consolidated audit. Service-provider identities, the income-based fee hurdle and expense-allocation practices were not fully determinable from public filings and are noted for confirmation on the analyst call. Subject to that confirmation, no material issues were identified, supporting our Green rating for Fund.`;

export const CH4_REPORTS: Record<string, Ch4Report> = {
 ARCC: { ticker: "ARCC", name: "Ares Capital Corporation", rating: "GREEN", ratingLabel: "Accept", flagsFired: ["subsidiaries"], fields: arccFields, narrative: arccNarrative },
 BXSL: { ticker: "BXSL", name: "Blackstone Secured Lending Fund", rating: "GREEN", ratingLabel: "Accept", flagsFired: ["subsidiaries"], fields: bxslFields, narrative: bxslNarrative },
 OBDC: { ticker: "OBDC", name: "Blue Owl Capital Corporation", rating: "GREEN", ratingLabel: "Accept", flagsFired: ["subsidiaries"], fields: obdcFields, narrative: obdcNarrative },
};

export function getCh4Report(ticker: string): Ch4Report | null {
 return CH4_REPORTS[ticker.toUpperCase()] ?? null;
}
