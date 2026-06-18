/**
 * Long-form Assessment narrative + Scope/Verification content for the PDF
 * report, keyed by the registry `dataKey`. This is the same prose the web
 * report viewer renders; it lives here so the server-rendered PDF can pull it
 * without importing the client viewer. Funds without an entry fall back to the
 * structured rating-summary Assessment.
 */

export interface AssessmentNarrative {
  /** Two framing paragraphs (firm + fundraise context). */
  intro: string[];
  /** Observation paragraphs, in order, ending with the overall-rating rationale. */
  body: string[];
  /** Closing caveat, rendered as a highlighted note. */
  preLaunchNote?: string;
}

export interface VerificationRow {
  verification: string;
  result: string;
  evidence: string;
}

export interface ScopeVerification {
  scope: string;
  verification: VerificationRow[];
}

export interface OverviewContent {
  manager: string[];
  fund: string[];
  controls: string[];
  strengths: string[];
  risks: string[];
}

const TRELLIS_OVERVIEW: OverviewContent = {
  manager: [
    `Trellis Capital Management, LLC (“Trellis”, the “Manager”) is a pre-seed stage venture capital firm that had net assets of $280.3 million as of December 31, 2025, plus $113.7 million in uncalled capital. Trellis is headquartered in San Francisco and has seven staff.`,
  ],
  fund: [
    `Trellis Capital IV, L.P. (the “Fund”) is a Delaware limited partnership formed on March 28, 2026. The Fund is a pre-seed stage venture capital fund that will invest in technology companies under a closed-ended structure.`,
    `The Fund held its initial closing on April 1, 2026 with ~$125 million in commitments. The target raise is $175 million and there is a $200 million hard cap. The final closing is expected to be held in the next 1-2 months.`,
  ],
  controls: [
    `Apex Fund Services, LLC (“Apex”) is expected to be engaged to provide administration services to the Fund. The Fund’s auditor is expected to be Baker, Thompson & Co. LLP (“Baker Thompson”) and the Fund is expected to maintain a banking relationship with Pacific Commerce Bank (“Pacific Commerce”).`,
    `Trellis uses a custom-built Retool dashboard for tracking the deal pipeline and an Excel dashboard for tracking key financial metrics. Apex will maintain the official accounting books and records using Xero.`,
    `As a closed-ended fund, valuations will be produced quarterly for indicative purposes, with no capital transactions after the fundraising period. The General Partner will receive carried interest only upon a realization event.`,
  ],
  strengths: [
    `Apex is expected to be engaged to provide administration services to the Fund.`,
    `Appropriate cash controls with dual-authorization wire process.`,
    `Multi-party asset verification architecture involving administrator, auditor, and Carta.`,
  ],
  risks: [
    `Limited internal staffing resources with resultant segregation of duties concerns.`,
    `IT / cybersecurity environment is currently underdeveloped, including a lack of formal policy documents and training program.`,
    `Investment professional is responsible for compliance oversight. Compliance controls could be improved with respect to policy attestations, training, and consultant usage.`,
    `No back office oversight of the accounting work performed by the Administrator.`,
    `No current plans for the Fund to have an LPAC.`,
    `No formal valuation committee.`,
  ],
};

const TRELLIS_ASSESSMENT: AssessmentNarrative = {
  intro: [
    `Trellis Capital Management, LLC (“Trellis,” the “Manager”) is a pre-seed stage venture capital firm founded in 2018 by Arjun Mehta (Co-Founder, Managing Partner) and Priya Sharma (Co-Founder, Managing Partner). The Manager reported net assets of $280.3 million as of December 31, 2025, plus $113.7 million in uncalled capital out of $274 million in total commitments across its first three funds. In addition, the firm manages several co-investment special purpose vehicles with $24.7 million in aggregate assets as of the same date.`,
    `The Manager is currently raising Trellis Capital IV, L.P. (the “Fund”), which has a $175 million target and a $200 million hard cap. The initial closing was held on April 1, 2026, with approximately $125 million in commitments; the final closing is expected within 1–2 months. The Fund’s predecessor, Fund III, is a 2024 vintage that raised $150 million—a meaningful step-up from Fund II, a 2021 vintage that raised $78 million, and Fund I, a 2018 vintage that raised $47 million. Fund III was 64% deployed and reserved as of December 31, 2025; accordingly, the Manager does not anticipate commencing investment activity from the Fund until late 2026, when Fund III is expected to be substantially deployed.`,
  ],
  body: [
    `As our primary observation, we highlight that Trellis is a small organization, consisting of seven full-time staff, with resultant segregation of duties issues. The single non-investment professional is Sarah Collins (Head of Operations), whose responsibilities focus on running business operations and acting as an executive assistant for the Managing Partners, meaning that the funds operate without the oversight of an internal back office resource. From a practical standpoint, finance and accounting matters are handled by the third-party fund administrator, Apex, subject to oversight from the Managing Partners. Trellis has, however, recently retained the services of Raj Patel, an individual who provides fractional CFO / COO services to venture capital and private equity funds. The Manager communicated that Raj will focus on overseeing the work performed by Apex; however, we understand that he will not dedicate substantial time to the firm until Summer 2026. Raj is expected to serve in this capacity part-time until the hire of a full-time Head of Finance planned for 2027. Investors are recommended to monitor developments in this area.`,
    `Separately, we highlight that the firm’s IT and cybersecurity environment is substantially underdeveloped at present, with a lack of formal policy documents and employee training program. In partial mitigation, the Manager stated that the Head of Operations is currently leading a search for a third-party cybersecurity vendor that will be tasked with conducting a formal cybersecurity audit, vulnerability test, creating a formal cybersecurity policy, and implementing a cybersecurity training program (inclusive of a phishing campaign) by the end of 2026: investors are recommended to monitor developments in this area. We would also suggest the creation of a written BCP, which should include details on how the firm and critical service providers are prepared for unexpected events, provisions for loss / unavailability of any key service providers, procedures to protect staff during a crisis, and handling of communications with key stakeholders.`,
    `The firm is exempt from SEC registration under the venture capital adviser exemption and accordingly files as an Exempt Reporting Adviser (“ERA”). While the firm’s compliance policies and procedures are aligned with the regulatory requirements of its ERA status, we highlight that Priya Sharma (Co-Founder, Managing Partner) is responsible for compliance oversight in addition to his investment role. We are strongly opposed to an investment professional being responsible for compliance and would prefer to see this responsibility reside with a non-investment professional, such as the Head of Operations. We would also suggest the implementation of a process for staff to attest to the firm’s compliance policies upon hire and annually thereafter, as well as the implementation of an annual compliance training program. To assist in enhancing the compliance program and “culture” of compliance, the firm should consider engaging a reputable compliance consultant under a broader remit.`,
    `We also highlight that the firm does not track individual cash transactions and aggregate cash balances of the funds, and instead relies solely on Apex to maintain and reconcile accounting books and records. Moreover, we highlight that, to date, there has been no back office oversight of the Administrator’s accounting work, although this is expected to be remedied through the appointment of Raj Patel as a part-time CFO and the planned hire of a full-time Head of Finance next year.`,
    `Although the Fund’s LPA contains a provision indicating that the Fund shall have an investor advisory board (commonly known as an LPAC), the Manager stated that an LPAC will only be formed, in practice, if requested by multiple of the Fund’s larger investors. We note that LPACs have also not been established for the prior funds. We would welcome the creation of an LPAC, which would introduce a degree of independence to the Fund’s governance.`,
    `Our review identified that appropriate cash controls have been implemented, with all cash movements from Pacific Commerce effected using the bank’s online banking platform, which requires Apex to initiate wires and one of the firm’s Managing Partners to release.`,
    `From an asset existence perspective, multiple parties are involved in each transaction, meaning that any attempt to create a fictitious investment would require collusion amongst various employees and external parties. The Manager represented that as part of the annual audits, Baker Thompson issues audit confirmations to a sample of underlying portfolio companies (noted to be roughly half of the 140 portfolio companies for FY2025). On its side, Apex confirmed that it receives all investment documents and wire instructions from the firm, excluding share certificates issued via Carta which are obtained directly from the Carta platform. Apex does, however, independently verify wire details with portfolio companies prior to initiating wires.`,
    `The firm values its portfolio companies at cost and marks investments up / down based on the price of a subsequent financing round in which a significant new investor has participated. Looking forward, we would strongly prefer to see the incorporation of the part-time CFO and, once hired, the full-time Head of Finance in the valuation process in order to provide a degree of back office oversight.`,
    `We also highlight that the firm does not have a formal valuation committee, which would be the suitable forum for reviewing and approving quarterly valuations. As the firm grows, we would prefer for the committee to be represented by a majority of non-investment professionals.`,
    `Overall, based on the firm’s current lack of back office function, its cybersecurity environment, and an investment professional being responsible for compliance, we are providing a Yellow overall rating. We would be amenable to providing a Green rating once the back office and cybersecurity enhancements as described above are fully implemented later this year. Investors should monitor developments in this area and, considering the Fund’s final closing is expected to occur in the next 1-2 months, we would suggest that investors either (a) require the firm to commit to these enhancements in writing via a side letter or otherwise, or (b) push the firm to accelerate the timeline for these enhancements prior to investing.`,
  ],
  preLaunchNote: `Our assessment is based on the Manager’s assertions at the time of this review considering the Fund has not formally commenced operations and service providers for the Fund have not yet been formally engaged (though they remain consistent with the prior funds). Any changes in these areas might affect our rating.`,
};

const TRELLIS_SCOPE: ScopeVerification = {
  scope: `Alpine’s review included a conference call with Apex Fund Services (the Fund’s expected Administrator), a review of the Fund’s Limited Partnership Agreement and related offering documents, the Manager’s compliance binder and valuation policy, Fund III’s audited financial statements, and independent checks against public registers and regulatory databases.`,
  verification: [
    { verification: "Management Company Registration", result: "Confirmed", evidence: "Alpine direct check, Delaware Division of Corporations" },
    { verification: "Management Company Corporate Form", result: "Consistent", evidence: "Cross-referenced Form ADV dated March 22, 2026" },
    { verification: "Ownership Structure", result: "Consistent", evidence: "Form ADV Schedules A & B confirm Arjun Mehta and Priya Sharma each hold 50-75%" },
    { verification: "SEC ERA Status", result: "Confirmed", evidence: "Alpine direct check, IARD register" },
    { verification: "SEC Disciplinary History", result: "No actions", evidence: "Reviewed Form ADV Section 11 and DRP pages (filing dated March 22, 2026)" },
    { verification: "Fund Registration (Delaware)", result: "Confirmed", evidence: "Alpine direct check, Division of Corporations" },
    { verification: "General Partner Registration", result: "Confirmed", evidence: "Alpine confirmed Trellis Capital GP IV, LLC to Division of Corporations" },
    { verification: "Administrator Engagement", result: "Confirmed (expected)", evidence: "Apex confirmed via conference call, April 3, 2026" },
    { verification: "Auditor Engagement", result: "Confirmed (expected)", evidence: "Apex confirmed Baker Thompson expected as auditor" },
    { verification: "Corporate Banker Engagement", result: "Confirmed (expected)", evidence: "Apex confirmed Pacific Commerce expected as banker, April 3, 2026" },
  ],
};

// ── Aurora Ventures IV ──────────────────────────────────────────────────────
const AURORA_OVERVIEW: OverviewContent = {
  manager: [
    `Aurora Capital Management, LLC (“Aurora”) is an early-stage venture capital firm registered as an Exempt Reporting Adviser (CRD 312044). The firm reported regulatory AUM of $981.54M as of March 26, 2026 (excl. $215.59M uncalled). Headquartered in Los Angeles on a fully remote basis with 9 FTEs.`,
  ],
  fund: [
    `Aurora Ventures IV, L.P. is a Delaware LP formed August 31, 2025 with Aurora Ventures IV GP, LLC as General Partner. Target $250M / hard cap $250M. Strategy: pre-seed and seed with selective Series A across consumer, entertainment, and emerging technology sectors.`,
    `GP commitment is at least $9.0M (~3% of commitments), with approximately half satisfied via management fee offset. Fund term: 10 years with up to two one-year extensions.`,
  ],
  controls: [
    `Meridian Fund Services, LLC has been engaged as fund administrator per Admin Agreement dated August 31, 2025; Meridian uses LedgerCraft Enterprise and Polaris. Grant Baker LLP is expected as auditor (Fund IV engagement letter pending; FY2024 audit of Aurora Ventures III by Grant Baker, unqualified opinion). Legal counsel: Brennan Kincaid LLP. IT: Vantage Tech Partners. Compliance consultant: Apex Compliance Advisors.`,
    `All outbound wires require dual approval by Kevin Park (VP Finance) and Rebecca Stern (GP); Meridian initiates wires and verifies payment instructions via callback for new or changed beneficiaries.`,
    `Aurora has not engaged a third-party valuation agent; all portfolio valuations are prepared internally and Meridian accepts manager-prepared valuations at quarter-end without independent verification.`,
  ],
  strengths: [
    `Institutional service-provider infrastructure (Meridian admin; Grant Baker LLP expected auditor).`,
    `Dual-approval outbound wire process with Meridian initiation.`,
    `Strong prior-vintage performance, including 30x and 28x DPI on two Silverline / Aurora JV investments.`,
    `Proactive disclosure of operational limitations during diligence.`,
  ],
  risks: [
    `Principals’ significant external business interests (actor/film producer; entertainer talent manager) create elevated headline risk.`,
    `Daniel Brenner named defendant in ongoing Mythic / LunarPay class action (filed Dec 2024); SEC separately investigating Mythic re: NFT/crypto.`,
    `No dedicated CCO; Kevin Park (VP Finance) serves as acting CCO.`,
    `Expert network controls insufficient: no written policy, pre-clearance, blackout periods, MNPI script, or chaperoning.`,
    `No third-party valuation agent appointed; Meridian accepts manager pricing without verification.`,
    `GP commitment partially cashless (~$4.5M via fee offset).`,
    `No formal succession plan at business level; no key person insurance.`,
  ],
};

const AURORA_ASSESSMENT: AssessmentNarrative = {
  intro: [
    `Aurora Capital Management, LLC (“Aurora,” the “Manager”) is an early-stage venture capital firm founded August 17, 2017 and operating on a fully-remote basis from Los Angeles, California. The firm is owned by Marcus Reeves (40%), Daniel Brenner (40%), and Rebecca Stern (20%) and is registered as an Exempt Reporting Adviser with the SEC under the venture capital adviser exemption (CRD 312044). As of March 26, 2026, the Manager reported regulatory AUM of $981.54 million across all advised private fund vehicles (excluding $215.59 million of uncalled capital commitments to Aurora Ventures IV, L.P.), up from $814.59 million at the prior year. Total headcount is 9 FTEs (6 investment professionals, 3 back office / operations).`,
    `The Manager is currently raising Aurora Ventures IV, L.P. (the “Fund”), a Delaware limited partnership formed August 31, 2025 with a $250M target and $250M hard cap. The Fund’s General Partner is Aurora Ventures IV GP, LLC. GP commitment is at least $9.0M (~3% of target commitments), of which roughly half is satisfied via management fee offset rather than additional cash contribution. The Fund intends to invest at the pre-seed and seed stage with selective Series A participation across consumer, entertainment, and emerging technology sectors. The Fund’s predecessor, Aurora Ventures III, is a 2021 vintage that produced top-quartile performance including realized exits in fintech, consumer, AI infrastructure, and mobility. The Silverline / Aurora Joint Venture produced DPIs of 30x and 28x on two investments.`,
  ],
  body: [
    `As our primary observation, we highlight that principals’ significant external business interests create elevated headline risk that warrants close ongoing monitoring. Marcus Reeves is a prominent actor and film producer; Daniel Brenner is a talent manager for internationally recognized entertainers. Both are subject to elevated media scrutiny. This issue is compounded by Daniel Brenner being a named defendant in a purported class action filed December 2024 in the U.S. District Court for the Central District of California (Montgomery & Reed LLP, plaintiffs’ counsel) related to the Mythic Technologies / LunarPay “Crystal Tiger Society” NFT promotion. The SEC is separately investigating Mythic Studios regarding whether NFT/crypto offerings constituted unregistered securities. Former Aurora employee Priya Desai is a co-defendant and departed Aurora in September 2025. The matter is ongoing; the Manager represents that the claims are without merit and intends to defend vigorously. Investors are recommended to monitor legal and reputational developments closely.`,
    `Separately, we highlight that Aurora does not have a dedicated Chief Compliance Officer. Kevin Park (VP Finance and Operations) serves as acting CCO in addition to all back office, accounting, finance, and operations responsibilities. This creates segregation of duties concerns and limits compliance bandwidth as the firm scales. In partial mitigation, Aurora engaged Apex Compliance Advisors in Q3 2025 as external compliance consultant to formalize the compliance program and conducted annual compliance training in January 2026. We recommend hiring a dedicated CCO by 2027 as AUM and operational complexity scale beyond $1.0 billion.`,
    `With respect to expert networks, Aurora has contracted InsightSphere but has not adopted substantive controls. There is no written expert network policy, no pre-clearance requirement for calls, no blackout periods for experts at public companies, no MNPI script delivered at the onset of calls, and no compliance chaperoning of calls. We recommend implementation of all five controls before final close.`,
    `From a fund structure perspective, the Fund’s GP commitment is partially cashless — approximately $4.5M of the $9.0M target commitment is satisfied via management fee reduction rather than upfront cash contribution. This reduces “skin in the game” relative to a fully cash-funded commitment. We recommend monitoring of this in future vintages and encourage a fully cash-funded GP commitment as AUM scales.`,
    `On the technology and resilience front, the firm operates a fully cloud-based stack (Microsoft 365, AWS-hosted services, Vantage Tech Partners-managed endpoints), and adopted a Written Information Security Policy (WISP), Incident Response Plan, and Business Continuity Plan in late November 2025 in response to Alpine follow-up requests. Annual cybersecurity training was implemented in January 2026. We note that no endpoint data loss prevention (DLP) solution is deployed and no network penetration testing has been performed, and recommend endpoint DLP implementation and a cloud-focused penetration test by year-end 2026.`,
    `Service provider infrastructure is appropriate. Meridian Fund Services, LLC has been engaged as fund administrator pursuant to the Administration Agreement dated August 31, 2025; Meridian uses LedgerCraft Enterprise and Polaris for fund accounting and partnership capital. Aurora Ventures III FY2024 audited financials reviewed; opinion issued by Grant Baker LLP was unqualified, and Grant Baker is expected to perform Fund IV’s inaugural audit. Outbound wires require dual approval from Kevin Park (VP Finance) and Rebecca Stern (GP); Meridian initiates wires and requires original invoices and verification callbacks for new or changed payment instructions.`,
    `From a valuation perspective, Aurora has not engaged a third-party valuation agent. All portfolio valuations are prepared internally; Meridian accepts manager-prepared valuations at quarter-end without independent verification procedures, with annual audit providing the only external pricing check. Carried interest waterfall calculations are maintained in Excel. The valuation committee (Stern, Park, Knight, Ruiz) consists predominantly of investment professionals. We strongly recommend appointment of a third-party valuation agent before Fund IV final close and reconstitution of the valuation committee to include majority senior non-investment professionals.`,
    `Overall, based on the Manager’s institutional service provider infrastructure, dual-approval wire process, proactive disclosure of operational limitations during diligence, and strong prior-vintage performance — balanced against the headline risk profile of the principals, the ongoing Mythic/LunarPay matter, and the absence of an external valuation agent and dedicated CCO — we are providing an Accept overall rating with active post-close monitoring across the items identified above.`,
  ],
  preLaunchNote: `Our assessment is based on the Manager’s representations at the time of this review, including the in-progress engagement of Grant Baker LLP as Fund IV auditor and the planned implementation of expert network controls and endpoint DLP. Any material changes in these areas, or in the trajectory of the Mythic/LunarPay matter, may affect our rating.`,
};

const AURORA_SCOPE: ScopeVerification = {
  scope: `Alpine’s review included direct verification calls with Meridian Fund Services (administrator) and a review of the Fund’s Limited Partnership Agreement, Private Placement Memorandum, Form ADV ERA (March 26, 2026), DDQ, Compliance Manual, Valuation Policy, Aurora Ventures III FY2024 audited financials (Grant Baker LLP), Administration Agreement, WISP, Incident Response Plan, BCP, and independent checks against public registers and regulatory databases.`,
  verification: [
    { verification: "Management Company Registration", result: "Confirmed", evidence: "California SoS · Delaware Division of Corporations · Date of Formation August 17, 2017" },
    { verification: "SEC ERA Status", result: "Confirmed", evidence: "Alpine direct check, IARD / EDGAR — CRD 312044" },
    { verification: "Form ADV (ERA) — Annual Filing", result: "Verified", evidence: "Filed March 26, 2026; cross-referenced with DDQ" },
    { verification: "Principal Background Checks", result: "Verified", evidence: "FINRA BrokerCheck / IAPD — Reeves, Brenner, Stern" },
    { verification: "Daniel Brenner — Disciplinary Disclosure", result: "Flagged", evidence: "Form ADV §11 — Mythic/LunarPay class action, filed December 2024 (ongoing)" },
    { verification: "Ownership Structure", result: "Consistent", evidence: "Form ADV Schedules A/B — Reeves 40% · Brenner 40% · Stern 20%" },
    { verification: "AUM Verification", result: "Consistent", evidence: "Form ADV cross-reference: $981.54M (excl. $215.59M uncalled); prior year $814.59M" },
    { verification: "Fund Registration (Delaware)", result: "Confirmed", evidence: "Delaware Division of Corporations · Aurora Ventures IV, L.P. · August 31, 2025" },
    { verification: "General Partner Registration", result: "Confirmed", evidence: "Delaware Division of Corporations · Aurora Ventures IV GP, LLC" },
    { verification: "Administrator Engagement", result: "Confirmed", evidence: "Meridian Fund Services verification call · Dana Blackwell · April 9, 2026" },
    { verification: "Auditor Engagement (Fund IV)", result: "Pending", evidence: "Grant Baker LLP expected; engagement letter not yet signed (FY2024 Fund III audit complete, unqualified)" },
    { verification: "External Valuation Agent", result: "Not Appointed", evidence: "Monitoring item — required before Fund IV final close" },
    { verification: "Acting CCO Designation", result: "Flagged", evidence: "Kevin Park (VP Finance and Operations) — dedicated CCO hire recommended by 2027" },
  ],
};

const ASSESSMENT_BY_KEY: Record<string, AssessmentNarrative> = { trellis: TRELLIS_ASSESSMENT, aurora: AURORA_ASSESSMENT };
const SCOPE_BY_KEY: Record<string, ScopeVerification> = { trellis: TRELLIS_SCOPE, aurora: AURORA_SCOPE };
const OVERVIEW_BY_KEY: Record<string, OverviewContent> = { trellis: TRELLIS_OVERVIEW, aurora: AURORA_OVERVIEW };

export function getAssessmentNarrative(dataKey: string): AssessmentNarrative | null {
  return ASSESSMENT_BY_KEY[dataKey] || null;
}

export function getScopeVerification(dataKey: string): ScopeVerification | null {
  return SCOPE_BY_KEY[dataKey] || null;
}

export function getOverviewContent(dataKey: string): OverviewContent | null {
  return OVERVIEW_BY_KEY[dataKey] || null;
}
