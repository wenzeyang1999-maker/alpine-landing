/**
 * Chapter 4 FLAG LIBRARY, the standardized risk paragraphs that recur verbatim across
 * Alpine's hand-written ODD reports (extracted + deduped from all 16 Trellis-styled
 * reports). This is the core asset for Stage-2 (PR2) generation: a Ch4 narrative is a
 * factual spine + the subset of these flags whose `trigger` is met + the analyst overlay.
 *
 * Each flag carries:
 * - `callGuideQ`, the call-guide question whose answer fires it (or null if derived)
 * - `homeChapter`, the chapter the flag's TOPIC really belongs to; several "Ch4" flags
 * are governance (Ch1) or service-provider (Ch5) topics the report folds
 * into the Chapter-4 narrative (see the crosswalk note at the bottom)
 * - `severity`, typical RAG contribution (material → "red", notable → "amber",
 * monitor → "watch")
 * - `text`, the verbatim standardized paragraph, reused as-is in generation
 *
 * Trigger evaluation is deterministic from the call-guide answers; the model only writes
 * the surrounding factual sentences and the synthesis, never the flag text itself.
 */

export type Ch4Flag = {
 id: string;
 title: string;
 trigger: string;
 callGuideQ: string | null;
 homeChapter: number;
 severity: "red" | "amber" | "watch";
 appliesTo?: string;
 text: string;
};

export const CH4_FLAGS: Ch4Flag[] = [
 // ── Structure & governance ────────────────────────────────────────────────
 {
 id: "no-board-fund", title: "No board at the Fund level.", trigger: "Fund is an LP/trust with no board of directors", callGuideQ: "04.06.26", homeChapter: 1, severity: "amber",
 text: "No board at the Fund level. Corporate governance is a key element of the control environment for commingled, pooled fund vehicles. Certain fund structures (notably limited partnerships and certain types of trusts) may, however, not have a board of directors. In such circumstances, investors should recognize that key corporate structuring and ongoing matters of corporate operations are typically controlled by the Manager, potentially eliminating the opportunity for meaningful, independent corporate governance.",
 },
 {
 id: "no-board-master", title: "No board at the underlying Master Fund level.", trigger: "Feeder has a board but the master fund (a partnership) does not", callGuideQ: "04.06.30", homeChapter: 1, severity: "amber",
 text: "No board at the underlying Master Fund level. Corporate governance is a key element of the control environment for commingled, pooled fund vehicles. Alpine specifically highlights situations where a feeder fund is structured as a corporation and has a board, but the underlying master fund (where assets are held and trading takes place) is structured as a partnership or otherwise does not have a board structure. While governance risk may be partly mitigated if the master fund has an advisory board or similar structure, investors should consider governance structures at the master fund level in detail, particularly when an advisory board is not in place.",
 },
 {
 id: "no-lpac", title: "Fund does not have an LPAC / Advisory Board.", trigger: "PE/LP structure with no LPAC or advisory board", callGuideQ: "04.06.26", homeChapter: 1, severity: "amber", appliesTo: "closed-ended / PE",
 text: "Fund does not have an LPAC / Advisory Board. Private equity funds are typically structured as limited partnerships (LP); as an LP is not a corporation, it does not have a board of directors, significantly impacting the ability for independent corporate governance practices to be adopted at the fund level. As one mitigant, it is usual for a private equity vehicle to establish a Limited Partners Advisory Committee, or LPAC, which typically holds various rights with respect to disclosure and approval of transactions which give rise to a potential conflict of interest. Alpine flags instances where a private equity structure does not have an LPAC or Advisory Board: this arrangement is unusual and can result in materially reduced governance standards.",
 },
 {
 id: "director-fees-high", title: "Fees paid per individual director are higher than $20,000.", trigger: "Per-director fees > $20,000", callGuideQ: null, homeChapter: 1, severity: "watch",
 text: "Fees paid per individual director are higher than $20,000. Alpine considers the fees paid to fund directors to be correlated to the calibre of board candidates and the depth and scope of board activities. High fees can be indicative that the directors engage in active, meaningful board oversight, but also increase the risk of monetary \"capture\" of the director, especially if the director serves on multiple funds sponsored by the same management company, and aggregate fees are, in turn, unduly high. To track this item, Alpine flags situations where fees paid to the director are higher than $20,000.",
 },
 {
 id: "segregated-cell", title: "Fund is part of a segregated cell / umbrella or similar structure.", trigger: "Umbrella / segregated-cell / series structure", callGuideQ: "04.08.40", homeChapter: 4, severity: "amber",
 text: "Fund is part of a segregated cell / umbrella or similar structure. An “umbrella” fund is a corporate organization where multiple, separate investment portfolios (distinct pools of capital following different strategies) form part of a single corporate entity. Structures used can include “umbrella” trusts, segregated or protected cell companies, and series limited liability companies. Segregated cell companies may create an operational risk if a cell becomes insolvent and the creditors of that cell attempt to claim assets of other, solvent cells to repay amounts owing. However, investors may face a risk of “cross class liability”: the offering documents of protected cell companies typically state that courts in other jurisdictions may not respect ring fencing provisions.",
 },
 {
 id: "subsidiaries", title: "Fund has subsidiaries and / or underlying trading affiliates.", trigger: "Fund/master invests through SPVs, blockers, or trading subsidiaries", callGuideQ: "04.06.32", homeChapter: 4, severity: "amber",
 text: "Fund has subsidiaries and / or underlying trading affiliates. A typical hedge fund structure has one or more feeders and a master fund. In some instances, however, a fund or master fund may, in turn, invest in other fund vehicles. Such funds may be created for tax reasons (a tax “blocker”) or to ring fence a particular strategy or type of investment. Such structures can be wholly owned by the fund in question, or partly owned by the fund, with capital also allocated by the manager’s other portfolios and / or by direct, external investors. Investors should gather information as to the nature of underlying subsidiaries and trading affiliates. We highlight accounting risks when funds have large numbers of trading subsidiaries, and the risk that not all such subsidiaries may be subject to direct administrator oversight. Investors may also wish to focus on potential dual layers of fees.",
 },

 // ── Launch, AUM & viability ───────────────────────────────────────────────
 {
 id: "pre-launch", title: "Fund has not yet commenced operations (pre-launch).", trigger: "Fund has not commenced operations", callGuideQ: "04.01.04", homeChapter: 4, severity: "amber", appliesTo: "pre-launch",
 text: "Fund has not yet commenced operations (pre-launch). A fund which has yet to commence operations increases operational risk across a number of areas. Risks will be impacted by whether the firm as a whole has yet to commence operations, or whether the Fund is a new product to be launched by an existing asset management organization. If the Fund is to mirror existing strategies (similar instruments to be traded and similar trading volumes), using identical service providers, operational risk may be largely mitigated. Adoption of new service providers and / or new strategies and instruments traded may, however, introduce new operational risks. Investors should evaluate whether a manager has proactively planned for any new control or procedural elements which may be introduced by new products and strategies, prior to launch.",
 },
 {
 id: "short-history", title: "Fund has a short operating history.", trigger: "Track record under ~3 years", callGuideQ: "04.06.28", homeChapter: 4, severity: "watch",
 text: "Fund has a short operating history. A fund with a short operating history displays elevated operational risk. If the product fails to gain assets under management over a reasonable time period, there is a risk that the Manager may elect to close the fund. Dependent on strategy, a fund trading \"new\" instruments and / or using new systems may display an increased risk of operational failure around trade execution, trade capture, allocation and valuation issues. Service providers engaged with respect to the fund may also still be in a \"teething\" stage as they become familiar with the portfolio, again increasing the risk of operational error.",
 },
 {
 id: "aum-below-100m", title: "Fund AUM is below $100 million.", trigger: "Fund-level AUM < $100m", callGuideQ: "04.09.45", homeChapter: 4, severity: "watch",
 text: "Fund AUM is below $100 million. A fund with assets under management below $100 million may not be financially viable for the asset manager, particularly if the strategy creates specific demands on the manager's operational infrastructure. We do note, however, that the Manager's willingness and ability to maintain funds in operation will depend on their own product mix, client base and overall business model.",
 },
 {
 id: "master-aum-below-100m", title: "Master Fund AUM is below $100 million.", trigger: "Master-fund AUM < $100m", callGuideQ: "04.09.43", homeChapter: 4, severity: "watch",
 text: "Master Fund AUM is below $100 million. A master fund with assets under management of $100 million may not be financially viable for the asset manager, particularly if the strategy creates specific demands on the manager's operational infrastructure. Failure to attract capital to a specific feeder fund may also result in a disproportionate allocation of capital across the master-feeder structure, and could lead to the termination of that vehicle.",
 },
 {
 id: "aum-up-25", title: "Fund AUM has increased (minimum 25% over the past twelve months).", trigger: "Fund AUM growth ≥ 25% over trailing 12 months", callGuideQ: "04.09.44", homeChapter: 4, severity: "watch",
 text: "Fund AUM has increased (minimum 25% over the past twelve months). Increases in assets under management demonstrate the success of the fund in terms of investment performance and the manager's capital raising activities. We do note, however, that rapid growth in AUM can create operational and organizational stress, particularly if AUM growth is accompanied by the introduction of new instruments, trading strategies and / or materially higher trading volume within the fund. Larger fund AUM may also place stress on external service providers (or provide an opportunity to \"upgrade\" service providers to larger, more capable vendors).",
 },
 {
 id: "investor-concentration", title: "Material investor concentration / Fund level.", trigger: "Largest investor > 25% and/or top-five > 50% of net assets", callGuideQ: "04.09.47", homeChapter: 4, severity: "amber",
 text: "Material investor concentration / Fund level. Operational diligence considers whether an individual fund entity is subject to significant investor concentration. Potential risks include a material proportion of fund capital being sourced from a single investor, a small group of investors, or a larger group of investors who are all advised by the same investment consultant. Risks arise when the investor(s) hold sufficient capital to trigger a redemption gate; when a redemption by the investor(s) could lead to a forced sale of more liquid securities or otherwise negatively impact portfolio composition; when a redemption could reduce fund size such that the expense ratio would increase materially for remaining investors; or when a redemption could call the entire financial viability of the fund into question. Alpine flags investor concentration at the Fund level when the largest and / or top five investor relationships represent more than 25% and 50%, respectively, of overall net assets.",
 },
 {
 id: "below-hwm", title: "Fund is currently below its High Water Mark (“HWM”).", trigger: "Fund NAV below prior peak (no incentive fee until recovered)", callGuideQ: "04.09.46", homeChapter: 4, severity: "watch",
 text: "Fund is currently below its High Water Mark (“HWM”). Hedge funds with an incentive fee structure typically include a “high water mark” provision, meaning that an incentive fee is charged only if the fund increases in value. A fund that enters a drawdown will typically not earn an incentive fee until performance has recovered to regain the prior peak net asset value. Under such circumstances, unless performance improves, the management company will be unable to earn an incentive fee in the current financial period. A period with reduced revenues may impact staff retention (smaller bonus pool) and, in some circumstances, broader firm financial viability.",
 },
 {
 id: "insider-below-1m", title: "Insider capital within fund / master fund is less than $1 million.", trigger: "Insider/GP investment at the fund level < $1m", callGuideQ: "04.04.15", homeChapter: 4, severity: "amber",
 text: "Insider capital within fund / master fund is less than $1 million. Alignment of interest is a material due diligence issue for many asset owners. Insider investment at the fund level (as distinct from the firm) ensures that key investment decision makers / portfolio managers have material financial exposure to the specific fund entity under consideration, reducing the risk of excessive risk taking. This risk factor also identifies situations where there is significant insider investment at the firm level, but internal assets in the fund itself are not significant. Investors should consider the rationale for such allocations, especially when insider capital does not appear to be allocated on a pro rata basis across the firm's products.",
 },

 // ── Service providers (Ch5 topics folded into the Ch4 narrative) ──────────
 {
 id: "multiple-admins", title: "The firm utilizes multiple administrators across its product line.", trigger: "More than one administrator used across the firm's products", callGuideQ: null, homeChapter: 5, severity: "amber",
 text: "The firm utilizes multiple administrators across its product line. Alpine flags situations in which a manager does not engage a single administration firm across its entire product complex. For larger investment managers with a large product range, such arrangements can be beneficial to provide \"competition\" as to service levels and fees. In general, however, usage of multiple administration service providers will increase operational complexity, as the manager's procedures and systems will have to accommodate interaction with various service providers. The rationale for such arrangements should be discussed with each asset manager.",
 },
 {
 id: "self-administered", title: "Fund is self-administered.", trigger: "No independent third-party administrator appointed", callGuideQ: null, homeChapter: 5, severity: "red",
 text: "Fund is self-administered. Post Madoff, it is now virtually mandatory to appoint a capable, full service administrator in the hedge fund industry. We do recognize, however, that the appointment of third party administrators in other asset classes, notably private equity and long only, remains less common. In the hedge fund industry, failure to appoint an administrator is usually an issue only with a small group of long standing managers, typically closed to new capital, who argue that administrators are insufficiently skilled to add value to their businesses. We strongly disagree with this position, and highlight self-administration as a material operational risk.",
 },
 {
 id: "admin-not-recognized", title: "Fund has not appointed an industry recognized administrator.", trigger: "Administrator is not a top-tier / globally recognized firm", callGuideQ: null, homeChapter: 5, severity: "amber",
 text: "Fund has not appointed an industry recognized administrator. Given ongoing consolidation in the fund administration industry, the significant majority of funds have concentrated their administration servicing within a group of 20 global administration service providers. We agree that, for small funds \"top tier\" firms may have prohibitive fee structures, and that in certain specialized strategies smaller, specialized firms may offer unique and valuable industry expertise. As a general matter, however, larger administrators can be expected to provide a greater degree of systems and personnel resources. We also highlight potentially elevated risk if the administrator is a private rather than public company.",
 },
 {
 id: "admin-affiliate-counterparty", title: "An affiliate of the administrator is a financial counterparty to the Fund.", trigger: "Administrator's affiliate also serves as custodian/bank/PB/ISDA counterparty", callGuideQ: null, homeChapter: 5, severity: "amber",
 text: "An affiliate of the administrator is a financial counterparty to the Fund. In some instances, the administrator will be affiliated with a financial counterparty to the fund (e.g. custodian, bank, prime broker, executing broker or ISDA counterparty). Usage of affiliates can create economies of scale and potentially reduced back office burdens. However, use of affiliated parties can also reduce independence and create potential conflicts of interest: investors should consider whether related administrators and counterparties are truly the best vendor for the fund in terms of service capability, arms length independence, and cost.",
 },
 {
 id: "no-transparency-report", title: "Administrator investor transparency report is not available.", trigger: "Administrator does not produce an investor transparency report", callGuideQ: null, homeChapter: 5, severity: "watch",
 text: "Administrator investor transparency report is not available. Alpine strongly prefers for the administration company to make available a \"transparency report\", which provides an independent record of fund assets and typically provides independent information as to reconciliation procedures, counterparty exposures, valuation procedures and Level 1 / 2 / 3 valuation profile.",
 },
 {
 id: "auditor-conflict", title: "Fund auditor also provides audit / non audit services to the management company.", trigger: "Same audit firm engaged by the fund and the management company", callGuideQ: null, homeChapter: 5, severity: "amber",
 text: "Fund auditor also provides audit / non audit services to the management company. Alpine identifies instances where an investment adviser retains the same appointed auditor as the Fund for the provision of corporate accounting or other advisory services such as tax, cyber, or internal control audits. These arrangements create the appearance of a conflict of interest over the independence of the service provider since the audit firm generates additional revenue from the provision of these ancillary services to the investment adviser.",
 },

 // ── Liquidity / redemptions / share classes ───────────────────────────────
 {
 id: "classes-diff-liquidity", title: "Share classes within the Fund have different liquidity terms.", trigger: "Multiple share classes with differing liquidity terms", callGuideQ: "04.11.60", homeChapter: 4, severity: "amber",
 text: "Share classes within the Fund have different liquidity terms. Certain funds may offer multiple share classes. Classes may offer access to a portfolio in multiple currencies, or may have differences as to fees and liquidity terms. Situations in which certain classes have more liberal redemption terms can raise material operational risks, as investors in such classes will be able to retrieve their capital more rapidly than other allocators. Such investors may have a material advantage, and their redemption requests may also be satisfied by liquidation of more liquid underlying portfolio assets, changing the portfolio composition for remaining investors.",
 },
 {
 id: "redemption-onerous", title: "Redemption frequency more onerous than quarterly with 30 days' notice.", trigger: "Redemptions less frequent than quarterly / notice > 30 days", callGuideQ: "04.14.84", homeChapter: 4, severity: "watch", appliesTo: "open-ended",
 text: "Redemption frequency more onerous than quarterly with 30 days' notice. Alpine highlights funds with redemption opportunities less frequent than quarterly with 30 days notice as falling into the \"less liquid\" segment of the industry. More restrictive liquidity may be entirely justified by lower liquidity strategies and underlying portfolio assets; however, investors should always monitor the overall liquidity profile of their portfolios.",
 },
 {
 id: "notice-over-60", title: "Redemption notice period higher than 60 days.", trigger: "Redemption notice period > 60 days", callGuideQ: "04.14.84", homeChapter: 4, severity: "watch", appliesTo: "open-ended",
 text: "Redemption notice period higher than 60 days. A redemption notice period in excess of 60 days falls into a more restrictive segment of the alternative asset industry. Such provisions may be justified if underlying portfolio assets require a lengthy period to sell in an orderly manner; however, they can be inflexible for investors, and such funds may be subject to \"precautionary\" redemption requests given their lengthy notice requirements, which can be counterproductive to fund performance.",
 },
 {
 id: "redemption-fee", title: "Fund charges a redemption fee.", trigger: "Offering docs permit a redemption fee/penalty", callGuideQ: "04.14.86", homeChapter: 4, severity: "watch",
 text: "Fund charges a redemption fee. Fund offering memorandums may allow the directors (or general partner) to charge a redemption fee. The magnitude of any redemption fee, and whether the fee is retained by the fund or the management company, should be evaluated by investors. Redemption fees may be a valid tool, particularly when portfolio assets have a wide bid / ask spread: however, the fee should be broadly in line with the typical spread incurred to sell portfolio assets to raise cash.",
 },
 {
 id: "gating", title: "Fund has a gating provision.", trigger: "Redemption gate exists", callGuideQ: "04.14.89", homeChapter: 4, severity: "amber", appliesTo: "open-ended",
 text: "Fund has a gating provision. Gating provisions provide flexibility to complete an orderly disposition of portfolio assets in the event a fund receives redemption requests exceeding a pre-determined gating threshold. Diligence should consider whether there is a misalignment between the gating threshold and the liquidity of the underlying portfolio, whether the gating provision is calculated at the master fund level and can be triggered even if one underlying feeder has not individually exceeded the threshold, whether a single investor can trigger the gate, whether redemptions are processed in the order received rather than pro-rata, and whether the gate includes a sunset clause.",
 },
 {
 id: "gate-no-sunset", title: "No sunset provision on redemption gate (redemptions can take more than 12 months).", trigger: "Redemption gate has no sunset provision", callGuideQ: "04.14.93", homeChapter: 4, severity: "amber", appliesTo: "open-ended",
 text: "No sunset provision on redemption gate (redemptions can take more than 12 months). Alpine highlights situations under which there is no \"sunset\" provision to the gating provision (a typical sunset provision provides, for example, that a quarterly gate may be applied for no more than 12 months, ensuring that investors will receive a return of capital within a one year period). Absent a sunset provision, a gate can, in theory, be applied indefinitely on a gradually reducing net asset balance.",
 },
 {
 id: "holdback-over-5", title: "Audit holdback greater than 5%.", trigger: "Redemption audit holdback > 5%", callGuideQ: "04.14.97", homeChapter: 4, severity: "amber",
 text: "Audit holdback greater than 5%. A \"holdback\" is a provision where an investor redeeming assets does not receive a 100% payment, on the grounds that final payment will only be made once the net asset value has been validated through the annual GAAP audit process. Alpine highlights situations in which the holdback exceeds 5% of redemption proceeds: in our view, levels in excess of 5% are unjustified, as this suggests that the Manager believes it is plausible for the fund to have a NAV error in excess of 5%. In such situations, internal controls would clearly be critically deficient.",
 },
 {
 id: "liquidating-trust", title: "Fund may satisfy redemption requests through creation of a liquidating trust or similar mechanism.", trigger: "Offering docs permit meeting redemptions via a liquidating trust/SPV", callGuideQ: "04.14.100", homeChapter: 4, severity: "red",
 text: "Fund may satisfy redemption requests through creation of a liquidating trust or similar mechanism. Alpine highlights when a fund may meet redemption payments by transferring assets into a liquidating trust or similar special purpose vehicle. While this provision is now common in “modern” prospectus language, we consider this structure to be materially negative for investors. A liquidating trust represents, in essence, an involuntary redemption in kind where the ongoing liquidation of the assets remains under the control of the manager. Issues such as whether assets are selected pro rata, whether there is a time limit on the trust's lifespan, and whether the manager can continue to earn fees should be considered by investors' legal counsel.",
 },
 {
 id: "no-key-person", title: "Fund does not have a key person provision.", trigger: "No key person provision in fund terms", callGuideQ: "04.14.79", homeChapter: 4, severity: "amber",
 text: "Fund does not have a key person provision. Investors are generally provided accelerated redemption rights upon the occurrence of a key person event (the resignation, withdrawal or incapacity of a key portfolio manager or other key business executive). The absence of a key person provision is a source of operational risk, especially when the Manager is dependent on a majority owner / key portfolio manager. However, the absence is mitigated for funds with liquid underlying portfolios and frequent redemption opportunities. Diligence should confirm whether all redemption restrictions are lifted upon imposition of a key person provision.",
 },

 // ── Side pockets ──────────────────────────────────────────────────────────
 {
 id: "side-pocket", title: "Fund has a side pocket provision.", trigger: "Offering docs permit side pockets", callGuideQ: "04.16.109", homeChapter: 4, severity: "amber",
 text: "Fund has a side pocket provision. A \"side pocket\" provision allows a fund manager to designate specific portfolio assets as illiquid. Once transferred into a side pocket, investors cannot redeem from this asset, which must be held until eventual liquidation. Post 2008, many investors believe side pocket provisions are unjustified in an open ended fund. Equally, side pockets may be appropriate where a fund's strategy includes a subset of illiquid assets. Investors may wish to consider whether side pockets are only used on purchase of an asset, or whether a position which was previously \"liquid\" can be subsequently transferred. Frequency of usage, whether side pockets are approved by fund directors, and whether the manager crystallizes an incentive fee on appreciation of side-pocketed assets should also be discussed.",
 },
 {
 id: "side-pocket-no-optout", title: "Side pocket provision does not include opt out clause.", trigger: "Side pockets permitted with mandatory participation (no opt-out)", callGuideQ: "04.16.113", homeChapter: 4, severity: "amber",
 text: "Side pocket provision does not include opt out clause. Side pocket provisions provide for illiquid assets to be transferred into non redeemable share classes / share structures. Certain investors may wish to opt out from side pocket provisions to ensure that no potentially illiquid assets are included within their holdings. Alpine flags situations where side pockets are permitted, but investor participation is mandatory with no opt out provision.",
 },
 {
 id: "side-pocket-no-cap", title: "Absence of a cap on proportion of fund capital that can be allocated to side pockets.", trigger: "No cap on % of portfolio allocable to side pockets", callGuideQ: "04.16.112", homeChapter: 4, severity: "amber",
 text: "Absence of a cap on proportion of fund capital that can be allocated to side pockets. Alpine flags situations where there is no limit on the percentage of portfolio assets which may be placed or subsequently transferred into side pockets. In such circumstances, potentially 100% of the portfolio could be allocated to illiquid, irredeemable assets.",
 },
 {
 id: "private-over-5-no-sp", title: "Fund holds private investments exceeding 5% of NAV that are not side pocketed.", trigger: "> 5% of NAV in private/illiquid investments not side-pocketed", callGuideQ: null, homeChapter: 6, severity: "amber",
 text: "Fund holds private investments exceeding 5% of NAV that are not side pocketed. Alpine flags situations where more than 5% of a portfolio is held in private, illiquid securities with no use of \"side pocket\" structures. In these cases, investors subscribe and redeem at their pro rata share of illiquid private investments, despite no ready market or price transparency, and the manager will typically crystallize a performance fee on any \"paper profit\" appreciation in the recorded value of such investments.",
 },

 // ── Fees & carry ──────────────────────────────────────────────────────────
 {
 id: "mgmt-fee-over-2", title: "Management fee exceeds 2%.", trigger: "Management fee > 2%", callGuideQ: "04.18.116", homeChapter: 4, severity: "amber",
 text: "Management fee exceeds 2%. The “2 and 20” fee structure is the de facto standard across the alternative asset space. A Manager charging a management fee in excess of 2% may be reflective of a long-standing organization that is no longer accepting external capital. Management fees should cover the cost of operation of the manager's business and not be a substantial source of profit. We hence strongly highlight funds with fees in excess of the 2% standard.",
 },
 {
 id: "incentive-over-20", title: "Incentive fee exceeds 20%.", trigger: "Incentive fee / carry > 20%", callGuideQ: "04.18.117", homeChapter: 4, severity: "amber",
 text: "Incentive fee exceeds 20%. The “2 and 20” fee structure is the de facto standard across the alternative asset space. A Manager charging a more onerous incentive allocation may be reflective of a long-standing organization that is no longer accepting external capital: in such cases, the Manager may be reluctant to change and, over time, fall behind evolving industry best practices.",
 },
 {
 id: "modified-hwm", title: "Modified high water mark arrangement.", trigger: "High-water mark modified (e.g. 50% fee during drawdown recovery)", callGuideQ: "04.18.119", homeChapter: 4, severity: "amber",
 text: "Modified high water mark arrangement. A modified high water mark arrangement can include a number of mechanisms. Most common is a structure whereby a 50% incentive fee is paid even during the period of a drawdown recovery (when the fund is below its high water mark), until 200% of the drawdown has been recovered. As a general comment, Alpine opposes modified high water mark structures: these arrangements further erode the rationale and alignment of interests suggested by the incentive fee. Under a modified HWM, the manager \"wins\" and receives an incentive payment even when they have lost money.",
 },
 {
 id: "incentive-intra-year", title: "Incentive fee crystallizes intra-year.", trigger: "Performance fee crystallized intra-year (e.g. monthly)", callGuideQ: "04.18.118", homeChapter: 4, severity: "watch",
 text: "Incentive fee crystallizes intra-year. The incentive fee paid to the Manager is generally crystallized on an annual basis as a matter of industry standard practice. However, certain alternative asset strategies (notably CTA funds) do adopt intra-year crystallization cycles. Under this more aggressive fee calculation model, the Manager could potentially receive a higher incentive allocation as compared to the amount that would have been charged on a calendar year basis.",
 },
 {
 id: "american-waterfall", title: "Fund has American distribution waterfall.", trigger: "Deal-by-deal (American) carry waterfall", callGuideQ: "04.19.128", homeChapter: 4, severity: "amber", appliesTo: "closed-ended / PE",
 text: "Fund has American distribution waterfall. Alpine highlights distribution waterfall structures that accrue carried interest on a deal-by-deal basis (“American”) rather than at the aggregate fund level, further to a return of capital contributions (“European”). An American style distribution waterfall is beneficial to the General Partner and may result in excess carried interest distributions. Under such circumstances, investors should ensure that escrow accounts and / or adequate claw back mechanisms are in place to ensure Limited Partners are fully repaid.",
 },
 {
 id: "no-preferred-return", title: "Carried interest is not subject to a preferred return.", trigger: "Carry waterfall with no preferred return / hurdle", callGuideQ: "04.19.126", homeChapter: 4, severity: "amber", appliesTo: "closed-ended / PE",
 text: "Carried interest is not subject to a preferred return. Alpine identifies instances whereby the carried interest waterfall structure of a fund does not include a preferred minimum return (i.e. hurdle rate) required to be achieved before a carry is permitted. A preferred return is an industry standard feature in the private equity market, and is generally set at 8%. Best practice dictates that the preferred return should be calculated from the day capital is contributed to the point of distribution.",
 },
 {
 id: "no-clawback", title: "Fund does not have a clawback provision.", trigger: "No clawback on carried interest", callGuideQ: "04.15.106", homeChapter: 4, severity: "amber", appliesTo: "closed-ended / PE",
 text: "Fund does not have a clawback provision. A clawback provision ensures that carried interest paid upon incremental realization of investments can be repaid / rebated should the final investments prove unprofitable. A fund which does not have a clawback provision is, in the first instance, unusual: this provision also means that fees paid by investors may be unduly high as they will only take account of earlier, profitable investments even if later realizations prove to be loss making.",
 },
 {
 id: "no-fault-divorce", title: "Fund does not have a no-fault divorce provision.", trigger: "No GP removal-without-cause mechanism", callGuideQ: null, homeChapter: 4, severity: "watch", appliesTo: "closed-ended / PE",
 text: "Fund does not have a no-fault divorce provision. Alpine highlights private equity closed end fund structures without a “no-fault divorce” mechanism allowing limited partners to remove or replace the general partner in circumstances where the General Partner has not breached terms of the Limited Partnership Agreement. Terms of investment should reflect the longer-term nature of the partnership and provide the limited partner with flexibility to adapt to changing circumstances.",
 },
 {
 id: "no-mgmt-fee-offset", title: "Fund does not have a management fee offset provision.", trigger: "No management fee offset for ancillary income", callGuideQ: "04.20.157", homeChapter: 4, severity: "amber",
 text: "Fund does not have a management fee offset provision. A management fee offset provision ensures that ancillary income received by the management company (directorship fees, break up fees, advisory fees and similar income) is offset against the management fee. Alpine flags instances where there is no offset provision of any nature: in this model, any ancillary income is retained 100% by the management company, providing the manager with potentially material additional profit.",
 },

 // ── Expense pass-throughs ─────────────────────────────────────────────────
 {
 id: "exp-research-data", title: "Investment research and data expenses are charged to the Fund (data feeds, consultants, publications etc.).", trigger: "Research/data expenses charged to the fund", callGuideQ: "04.20.136", homeChapter: 4, severity: "amber",
 text: "Investment research and data expenses are charged to the Fund (data feeds, consultants, publications etc.). Alpine highlights situations where additional expenses such as research and technology costs (e.g data feeds, research publications, and similar resources) are charged as fund expenses and consequently paid by investors. Recharge of such expenses increases the effective management fee rate, as these costs relate directly to the management and execution of the fund strategy.",
 },
 {
 id: "exp-research-travel", title: "Research related travel expenses are charged to Fund.", trigger: "Research-related travel expenses charged to the fund", callGuideQ: "04.20.137", homeChapter: 4, severity: "amber",
 text: "Research related travel expenses are charged to Fund. As a general position, Alpine believes that the management fee should cover the investment management costs of the strategy. Some management companies do, however, charge “research related travel expenses” as a separate expense. In some instances travel may be expensive and unavoidable; however, investors may wish to evaluate the nature of research related travel, a large manager who can clearly “afford” travel expenses from their management fees may simply be looking to divert internal costs to the investors’ P&L. Other issues, such as use of private aircraft and travel budgets / expense controls, should also be considered.",
 },
 {
 id: "exp-systems", title: "System expenses are charged to Fund.", trigger: "Systems/technology expenses charged to the fund", callGuideQ: "04.20.139", homeChapter: 4, severity: "amber",
 text: "System expenses are charged to Fund. Systems expenses can include external software tools, internally developed software, hardware, and potentially the salary costs of in house technology staff. Certain technology intensive strategies may justify additional systems costs (in which case the true fee burden of the strategy may exceed “2 and 20”). Investors may wish to discuss whether there is a budget for such costs and what gatekeeper controls a manager has put in place. Allocation of expenses between funds and transparency provided to the administrator around recharged costs should also be considered.",
 },
 {
 id: "exp-marketing", title: "Marketing expenses are charged to Fund.", trigger: "Marketing/fundraising expenses charged to the fund", callGuideQ: "04.20.142", homeChapter: 4, severity: "amber",
 text: "Marketing expenses are charged to Fund. It is relatively unusual for marketing expenses to be charged to a hedge fund, although the practice is more common in the private equity industry during fund raising. Marketing costs can include travel to meet investors, conference costs, and promotional materials. As a general comment, Alpine believes that the majority of such costs should be considered a “cost of doing business” for the management company, and should not be recharged to investors.",
 },
 {
 id: "exp-overhead", title: "Management company overhead costs are charged to Fund.", trigger: "Management-company overhead (salaries, rent, IT) charged to the fund", callGuideQ: "04.20.142", homeChapter: 4, severity: "amber",
 text: "Management company overhead costs are charged to Fund. Certain funds elect to charge a range of overhead expenses, notably including employee base salaries, bonuses, rent and other office expenses, marketing costs, IT costs, recruitment fees and other ancillary expenses. When charged in addition to a fixed management fee, such arrangements can result in a potentially extremely high fee burden which may be unacceptable to many asset owners.",
 },
 {
 id: "exp-compliance", title: "Compliance consulting costs are charged to Fund.", trigger: "Compliance consulting costs charged to the fund", callGuideQ: "04.20.140", homeChapter: 4, severity: "amber",
 text: "Compliance consulting costs are charged to Fund. Certain funds elect to charge expenses associated with compliance consultant(s) retained to support the broader firm's compliance program. Alpine believes that such costs should be considered part of management company overhead, and should not be recharged to investors.",
 },

 // ── Side letters & affiliated allocations ─────────────────────────────────
 {
 id: "side-letter-fees", title: "Side letter arrangement(s) provides preferential fees.", trigger: "Side letters granting reduced/preferential fees", callGuideQ: "04.17.114", homeChapter: 4, severity: "watch",
 text: "Side letter arrangement(s) provides preferential fees. Side letters are agreements between the investment manager / fund and individual investors, amending the “standard” terms of the fund prospectus. It is relatively common for large investors to negotiate reduced fee arrangements. Investors may wish to know whether such arrangements are in place (and may wish to negotiate similar arrangements if investing in similar size and on similar terms).",
 },
 {
 id: "side-letter-transparency", title: "Side letter arrangement(s) provides enhanced transparency of positions and trading strategy.", trigger: "Side letters granting enhanced portfolio transparency", callGuideQ: "04.17.114", homeChapter: 4, severity: "watch",
 text: "Side letter arrangement(s) provides enhanced transparency of positions and trading strategy. Alpine highlights instances where certain investors are provided enhanced transparency via separately negotiated side letter arrangements. These arrangements can create the appearance of a conflict of interest if the level of added transparency is deemed to provide the investor(s) with an advantage over others. Investors are encouraged to negotiate side letter(s) with similar terms directly with the Fund, as required.",
 },
 {
 id: "affiliated-allocation", title: "The Fund has an allocation to affiliated fund(s).", trigger: "Portfolio holds an allocation to an affiliated fund", callGuideQ: "04.21.163", homeChapter: 4, severity: "amber", appliesTo: "FoF / affiliated",
 text: "The Fund has an allocation to affiliated fund(s). Such allocations can raise a number of issues, including the potential to pay a double layer of fees; potential liquidity mismatch issues if the affiliated fund(s) have unfavorable liquidity provisions; and transparency issues (the main fund's financial statements will report the external allocation on a \"line item\" basis).",
 },
];

/**
 * Report-section → call-guide crosswalk. The Trellis house style writes Chapter 4 under a
 * FIXED 8-heading skeleton (identical across all 16 reports). Each written sub-section is
 * fed by call-guide questions, several from OTHER chapters (the report's "Chapter 4" is
 * broader than the call-guide's Chapter 4). Stage-2 generation pulls answers per this map.
 */
export const CH4_SECTION_CROSSWALK: { section: string; feeds: string; questionRefs: string[] }[] = [
 { section: "Legal Structure", feeds: "Ch4.06 + Ch4.07/08", questionRefs: ["04.06.24", "04.06.25", "04.06.26", "04.06.27", "04.06.28", "04.06.29", "04.06.30", "04.06.31", "04.06.32", "04.06.33", "04.08.38", "04.08.40", "04.08.41"] },
 { section: "Assets under Management - Fund Level", feeds: "Ch4.09", questionRefs: ["04.09.43", "04.09.44", "04.09.45", "04.09.46", "04.09.47", "04.09.49", "04.04.13", "04.04.14", "04.04.15"] },
 { section: "Service Providers", feeds: "Ch5 (admin/auditor), folded in", questionRefs: ["04.10.54", "05.01.*", "05.02.*"] },
 { section: "Corporate Governance", feeds: "Ch1 (board/LPAC), folded in", questionRefs: ["01.20.*", "01.21.*", "04.06.26"] },
 { section: "Terms", feeds: "Ch4.11, 17 (classes, redemptions, side pockets, side letters)", questionRefs: ["04.11.55", "04.11.60", "04.11.61", "04.12.*", "04.13.*", "04.14.79", "04.14.84", "04.14.89", "04.14.96", "04.14.100", "04.15.106", "04.16.109", "04.16.112", "04.16.113", "04.17.114", "04.17.115"] },
 { section: "Fees and Expenses", feeds: "Ch4.18, 20 (fees, waterfall, expenses)", questionRefs: ["04.18.116", "04.18.117", "04.18.118", "04.18.119", "04.19.123", "04.19.126", "04.19.127", "04.19.128", "04.19.134", "04.20.136", "04.20.137", "04.20.139", "04.20.140", "04.20.142", "04.20.157", "04.20.159"] },
 { section: "Investment Strategy", feeds: "Ch6 + Ch4.01/21/22, folded in", questionRefs: ["04.01.01", "04.21.163", "04.22.164", "06.02.*", "06.03.*"] },
 { section: "Fund Summary", feeds: "analyst synthesis + RAG rating", questionRefs: [] },
];
