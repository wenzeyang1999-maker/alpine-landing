"use client";

import { useRef, useEffect, useState } from "react";
import { downloadDemoFile, getDemoFileUrl } from "@/lib/app-portal/demo-downloads";
import { SOURCE_META } from "@/lib/app-portal/ridgeline-data";
import { AURORA_SOURCE_META } from "@/lib/app-portal/aurora-data";
import DataReportViewer, { RIDGELINE_DATA_REPORT } from "@/components/app-portal/shell/DataReportViewer";
import ExecutiveBriefViewer, { RIDGELINE_EXECUTIVE_BRIEF } from "@/components/app-portal/shell/ExecutiveBriefViewer";

/* eslint-disable @typescript-eslint/no-explicit-any */

// ── Inline color constants (no external dep) ─────────────────────────────────

const SOURCE_DOT_COLORS: Record<string, string> = {
  SEC_EDGAR:         "#34D399",
  ALPINE_ANALYSIS:   "#A78BFA",
  MANAGER_CALL:      "#FBBF24",
  ADMIN_VERIFICATION:"#A78BFA",
};
const PDF_DOT_COLOR = "#60A5FA";
function getDotColor(source: string): string {
  return SOURCE_DOT_COLORS[source] || (source.endsWith(".pdf") ? PDF_DOT_COLOR : PDF_DOT_COLOR);
}

const RATING_BADGE_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  GREEN:     { bg: "#10B98118", text: "#059669", dot: "#10B981" },
  YELLOW:    { bg: "#F59E0B18", text: "#D97706", dot: "#F59E0B" },
  RED:       { bg: "#EF444418", text: "#DC2626", dot: "#EF4444" },
  ACCEPT:    { bg: "#10B98118", text: "#059669", dot: "#10B981" },
  WATCHLIST: { bg: "#F59E0B18", text: "#D97706", dot: "#F59E0B" },
  FLAG:      { bg: "#EF444418", text: "#DC2626", dot: "#EF4444" },
};

// ── Static Aurora Ventures IV ODD Report (markdown) ─────────────────────────

const AURORA_REPORT_MD = `# Operational Due Diligence Review

**Aurora Capital Management, LLC**
Aurora Ventures IV, L.P. · Early-Stage Venture Capital · AUM $981.54M (excl. $215.59M uncalled)

Review Date: April 2026 · Report Date: April 30, 2026
Prepared by Alpine Due Diligence Inc.

*This report is intended solely for the use of the commissioning investor and should not be distributed without Alpine's prior written consent.*

---

## Overall Rating: ACCEPT

Score: 82 / 100 · 6 GREEN · 2 YELLOW · 0 RED

Aurora Capital Management, LLC has been assigned an **ACCEPT** rating following Alpine's operational due diligence review of Aurora Ventures IV, L.P. Core operational infrastructure is adequate with baseline controls across technology, cash management, and valuation. The firm engages institutional service providers (Meridian Fund Services as administrator; Grant Baker LLP expected as auditor) and has proactively formalized its compliance program with external consultant support from Apex Compliance Advisors. [[REF:DDQ:"Aurora engaged Apex Compliance Advisors in Q3 2025 to formalize the compliance program"]] Two chapters were rated YELLOW: Manager/Governance (principals' significant external business interests; no formal succession plan; partially cashless GP commitment) and Legal/Compliance (ongoing Mythic/LunarPay class action involving Daniel Brenner; no dedicated CCO; insufficient expert network controls).

**Post-Close Monitoring Items:**
1. Appoint external third-party valuation agent before Fund IV final close
2. Implement all five recommended expert network controls (written policy, pre-clearance, blackout periods, MNPI script, compliance chaperoning)
3. Formalize written succession plan at the management company level; consider key person insurance
4. Implement endpoint DLP and quarterly phishing testing by year-end 2026
5. Hire a dedicated CCO by 2027 as AUM and operational complexity scale

---

## Chapter 1: Manager, Ownership & Governance · Rating: YELLOW

Aurora Capital Management, LLC is a Delaware LLC formed August 17, 2017 [[REF:California SoS:"Date of Formation August 17, 2017"]] and operates as a fully remote firm headquartered in Los Angeles, CA. The firm is owned by Marcus Reeves (40%), Daniel Brenner (40%), and Rebecca Stern (20%). [[REF:Form ADV:"Schedule A/B ownership: Reeves 40%, Brenner 40%, Stern 20%"]] Total headcount is 9 FTEs (6 investment professionals, 3 back office / operations). [[REF:DDQ:"9 FTEs: 6 investment, 3 back office / operations"]]

Aurora Ventures IV, L.P. is a Delaware limited partnership formed August 31, 2025, with Aurora Ventures IV GP, LLC as the General Partner. [[REF:LPA:"Aurora Ventures IV, L.P. — Delaware LP formed August 31, 2025; GP: Aurora Ventures IV GP, LLC"]] GP commitment is at least $9.0M (~3% of target commitments) — half in cash, half satisfied via fee offset rather than additional cash contribution.

**Risk Observation AO-002 (HIGH):** Principals maintain significant external business interests creating elevated headline risk. Marcus Reeves is a prominent actor and film producer; Daniel Brenner is a talent manager for internationally recognized entertainers. Both are subject to elevated media scrutiny — including public criticism after supporting a convicted individual — and the issue is compounded by Brenner's ongoing NFT-related inquiry (see Chapter 2). [[REF:ALPINE_ANALYSIS:"Marcus Reeves and Daniel Brenner external profiles create elevated headline risk"]] Alpine recommends investors monitor media coverage closely and conduct periodic background checks.

**Risk Observation AO-001 (HIGH):** No formal succession plan exists at the business level. The LPA key person provision addresses the product level (any two of three GPs must cease time commitment to trigger) but does not address business-level continuity. No key person life insurance is in place. [[REF:LPA:"Key person provision triggers if any two of three GPs cease time commitment"]]

**Risk Observation AO-005 (MEDIUM):** Fund IV GP commitment is partially cashless — $4.5M of the $9.0M commitment is satisfied via management fee reduction rather than upfront cash contribution. This reduces "skin in the game" relative to a fully cash-funded commitment.

## Chapter 2: Legal, Regulatory & Compliance · Rating: YELLOW

Aurora Capital Management is registered as an Exempt Reporting Adviser (ERA) with the SEC under the venture capital adviser exemption (CRD 312044, SEC File 802-128945). [[REF:SEC_EDGAR:"Exempt Reporting Adviser since November 30, 2018, CRD 312044"]] Current Form ADV dated March 26, 2026 reviewed. Aurora has engaged Apex Compliance Advisors as external compliance consultant since Q3 2025 and conducted annual compliance training in January 2026.

**Risk Observation AO-003 (HIGH):** Daniel Brenner is a named defendant in a purported class action filed December 2024 in the U.S. District Court for the Central District of California (Montgomery & Reed LLP, plaintiffs' counsel) regarding the Mythic Technologies / LunarPay "Crystal Tiger Society" NFT promotion. The SEC is separately investigating Mythic Studios re: whether NFT/crypto offerings constituted unregistered securities. Former Aurora employee Priya Desai is a co-defendant and departed Aurora in September 2025. The matter is ongoing; Aurora represents the claims are without merit. [[REF:Form ADV:"Item 11 disclosure: Daniel Brenner — Mythic/LunarPay class action, filed December 2024, ongoing"]] Alpine recommends close monitoring of legal and reputational developments.

**Risk Observation AO-006 (MEDIUM):** No dedicated Chief Compliance Officer. Kevin Park (VP Finance and Operations) serves as acting CCO in addition to all back office, accounting, finance, and operations responsibilities. [[REF:DDQ:"Kevin Park serves as acting CCO in addition to VP Finance and Operations duties"]] This creates segregation of duties concerns and limits compliance bandwidth as the firm scales. Alpine recommends hiring a dedicated CCO by 2027.

**Risk Observation AO-007 (MEDIUM):** Expert network controls are insufficient. Aurora has contracted InsightSphere but has not adopted substantive controls: no written policy, no pre-clearance, no public-company blackout periods, no MNPI script at the onset of calls, and no compliance chaperoning. [[REF:ALPINE_ANALYSIS:"InsightSphere engagement lacks written policy, pre-clearance, blackout periods, MNPI script, and chaperoning"]]

**Risk Observation AO-008 (MEDIUM):** Personal trading policy gaps — pre-clearance is required only for securities on the restricted list (currently zero names); no minimum holding period; brokerage statements not independently collected by compliance.

**Risk Observation AO-009 (MEDIUM):** AML / KYC verification is performed by Aurora with assistance from Brennan Kincaid LLP (legal counsel) rather than by the Administrator. Alpine recommends transitioning AML/KYC to Meridian's investor services group for greater independence.

## Chapter 3: Technology, Cybersecurity & Business Resilience · Rating: GREEN

Aurora operates a fully cloud-based technology stack (Microsoft 365, AWS-hosted services, Vantage Tech Partners-managed endpoints). [[REF:DDQ:"Cloud-based infrastructure: Microsoft 365, AWS, Vantage Tech Partners managed endpoints"]] A Written Information Security Policy (WISP) and Incident Response Plan were adopted November 28, 2025 in response to Alpine's follow-up requests. Business Continuity Plan adopted November 27, 2025. Annual cybersecurity training implemented January 2026.

**Risk Observation AO-010 (MEDIUM):** No endpoint data loss prevention (DLP) solution deployed. USB/removable media use is discouraged in practice but not technically restricted. Alpine recommends endpoint DLP implementation by year-end 2026.

**Risk Observation AO-011 (LOW):** No network penetration testing has been performed. Aurora cites cloud-based infrastructure as the rationale. While reasonable for a fully cloud-based firm, an annual cloud-focused penetration test remains best practice.

## Chapter 4: Fund Structure, Terms & Investor Alignment · Rating: GREEN

Aurora Ventures IV, L.P. has a $250M target raise with $250M hard cap. [[REF:PPM:"Fund IV target: $250M; hard cap: $250M"]] Management fee is 2.0% on commitments during the investment period, stepping down 0.25% per year to a 1.25% floor on unreturned invested capital. Carried interest follows a European-style waterfall with tiered carry above 3x / 5x return thresholds (no preferred return). 100% of monitoring/transaction/break-up fees received by the Adviser are credited against management fees. Fund term is 10 years with up to two one-year extensions.

**Risk Observation AO-013b (LOW):** The Fund's banking documentation requires only a single signature to open a new bank account, although two individuals are involved in practice. Alpine recommends contractual requirement for two signatories.

## Chapter 5: Service Providers, Delegation & Oversight · Rating: GREEN

**Administrator:** Meridian Fund Services, LLC (engaged August 31, 2025 per Administration Agreement). [[REF:ADMIN_VERIFICATION:"Meridian Fund Services confirmed as fund administrator via verification call April 9, 2026"]] Meridian uses LedgerCraft Enterprise and Polaris for fund accounting and partnership capital. Engagement confirmed via direct verification call with Dana Blackwell (Senior Director, Fund Administration) on April 9, 2026.

**Auditor:** Grant Baker LLP (expected). Aurora Ventures III FY2024 audited financials reviewed; opinion issued by Grant Baker LLP was unqualified. [[REF:Fund III Financials:"Grant Baker LLP unqualified audit opinion FY2024"]] Fund IV audit engagement letter not yet signed as of April 2026 (monitoring item: signed prior to FY2026 audit).

**Legal Counsel:** Brennan Kincaid LLP (fund formation, regulatory, AML/KYC assistance).

**IT Services:** Vantage Tech Partners (engaged January 2026).

**Expert Network:** InsightSphere (Compliance controls deficient — see Chapter 2).

## Chapter 6: Investment Operations & Portfolio Controls · Rating: GREEN

Aurora's investment process is documented in the Compliance Manual and PPM. The Investment Committee consists of Marcus Reeves, Daniel Brenner, and Rebecca Stern. Operating Partner Elena Ruiz and Principal Austin Knight participate in non-voting capacity.

**Risk Observation AO-012 (MEDIUM):** IC approval threshold requires only one of three voting members to approve an investment. Alpine notes this is unusual; majority (2 of 3) or unanimous consent would be more typical. [[REF:DDQ:"IC voting: approval requires only one of three GPs (Reeves, Brenner, or Stern)"]] The single-veto right has not been exercised in practice. Alpine recommends amending to require at least majority consent.

**Risk Observation AO-013 (MEDIUM):** The Administrator does not have signing authority over the operating account used to process investor capital activity and pay non-investment expenses. Aurora controls all transfers. Alpine recommends transferring operating account control to Meridian to reduce the risk of inappropriate cash movements.

**Strength:** Dual-approval wire process. All outbound wires require approval and release by both Kevin Park (VP Finance) and Rebecca Stern (GP). Meridian initiates wires and requires original invoices to validate cash movements; verification callbacks are required for new or changed payment instructions.

## Chapter 7: Valuation, Asset Existence & Investor Reporting · Rating: GREEN

Aurora prepares quarterly fair-value estimates for portfolio investments in accordance with ASC 820 and ILPA reporting guidelines. The Valuation Committee currently consists of Rebecca Stern (GP), Kevin Park (VP Finance), Austin Knight (Principal), and Elena Ruiz (Operating Partner).

**Risk Observation AO-014 (MEDIUM):** No external valuation agent has been appointed. All valuations are prepared internally and subject only to external oversight annually via audit. [[REF:Valuation Policy:"All portfolio valuations prepared internally; no third-party valuation agent engaged"]] Alpine strongly recommends appointment of a third-party valuation agent before Fund IV final close.

**Risk Observation AO-015 (MEDIUM):** Valuation committee majority are investment professionals. Reconstitution to include majority senior non-investment professionals would mitigate the appearance of conflicts of interest.

**Risk Observation AO-016 (MEDIUM):** The Administrator (Meridian) accepts Aurora's pricing at each quarter-end without conducting any verification procedures. [[REF:Meridian Verification Call:"Meridian accepts Aurora's pricing at quarter-end without independent verification"]] All valuation oversight is deferred to the annual audit. Alpine recommends minimum verification procedures at the Administrator level for positions above a materiality threshold.

**Risk Observation AO-017 (LOW):** Carried interest waterfall calculation maintained in Excel. Meridian prepares the waterfall and Kevin Park approves it. Migration to a purpose-built waterfall system would reduce error risk.

**Risk Observation AO-018 (LOW):** Aurora does not maintain in-house investor-level accounting records, relying entirely on Meridian's Polaris system for partnership capital accounting. Parallel internal records would provide defense-in-depth.

## Chapter 8: Manager Transparency & LP Communications · Rating: GREEN

Aurora provides quarterly investor letters and annual audited financials via Meridian. K-1 tax documents distributed within statutory deadlines. ILPA-aligned quarterly reporting templates adopted. Aurora's management proactively disclosed all operational gaps — including CCO absence, the Mythic/LunarPay inquiry, phishing/penetration testing limitations, and the cashless GP commitment mechanism — without prompting during the diligence process. This candor is constructive and reflects well on management culture.

---

## Verification Summary

| Item | Status | Finding |
|------|--------|---------|
| SEC ERA Registration (IARD) | Verified | CRD 312044, no reportable items at firm level |
| Form ADV ERA — Annual Filing | Verified | Filed March 26, 2026; cross-referenced with DDQ |
| Daniel Brenner — Disciplinary Disclosure | Flagged | Mythic/LunarPay class action filed Dec 2024 — ongoing |
| Principal Background Checks (FINRA / IAPD) | Verified | Reeves, Brenner, Stern — no other reportable events |
| AUM Verification — Form ADV Cross-Reference | Verified | $981.54M reported (excl. $215.59M uncalled); prior year $814.59M |
| Administrator — Meridian Fund Services | Verified | Confirmed via direct call April 9, 2026 (Dana Blackwell) |
| External Valuation Agent | Not Appointed | Monitoring item — required before Fund IV final close |
| Acting CCO — Kevin Park | Flagged | Dual role with VP Finance/Operations — dedicated CCO recommended |
| Auditor — Grant Baker LLP | Pending | Fund IV engagement letter not yet signed |
| Delaware Registration — Aurora Ventures IV, L.P. | Verified | Delaware Division of Corporations · August 2025 |

---

## Outstanding Items

The following items are post-close monitoring commitments:

1. **External Valuation Agent** — Engagement letter required prior to Fund IV final close. Status: Pending.
2. **Expert Network Controls** — All five recommended controls (written policy, pre-clearance, blackout periods, MNPI script, chaperoning) to be implemented by Q3 2026. Status: Pending.
3. **Succession Plan** — Written succession plan at the management company level; consider key person insurance. Status: Pending.
4. **Endpoint DLP & Phishing Testing** — Endpoint DLP solution and quarterly simulated phishing program by year-end 2026. Status: Pending.
5. **Dedicated CCO Hire** — Targeted for 2027 as AUM and operational complexity scale. Status: Monitoring.
6. **Fund IV Audit Engagement** — Grant Baker LLP engagement letter to be executed prior to FY2026 audit. Status: Pending.

---

*Alpine Due Diligence Inc. · Confidential — For Institutional Use Only*
*Aurora Capital Management, LLC — Aurora Ventures IV, L.P. — ODD Report · April 2026*
`;

// ── Static Ridgeline ODD Report (markdown) ────────────────────────────────────

const RIDGELINE_REPORT_MD = `# Operational Due Diligence Review

**Ridgeline Capital Partners, LLC**
Ridgeline Global Opportunities Fund, LP · Global Long/Short Equity · AUM $2.31B

Review Date: January 2026 · Report Date: April 2, 2026
Prepared by Alpine Due Diligence Inc.

*This report is intended solely for the use of the commissioning investor and should not be distributed without Alpine's prior written consent.*

---

## Overall Rating: WATCHLIST

Score: 68 / 100 · 7 GREEN · 4 YELLOW · 1 RED

Ridgeline Capital Partners has been assigned a **WATCHLIST** rating following a comprehensive operational due diligence review conducted in January 2026. The firm demonstrates institutional-quality infrastructure across the majority of operational domains, including recognized service providers, a well-documented investment strategy, and clean regulatory and audit records. However, material deficiencies in the compliance program, combined with key person concentration and gaps in the valuation governance framework, warrant conditions before Alpine can assign an ACCEPT rating.

**Conditions for ACCEPT Upgrade:**
1. Hire a dedicated Chief Compliance Officer with independent reporting line (within 90 days)
2. Implement pre-clearance system for personal securities transactions (within 60 days)
3. Draft and adopt a formal written succession plan approved by the Fund Board (within 120 days)
4. Reconstitute the Valuation Committee to achieve majority independence (within 90 days)

---

## Act I — Structural Foundation

### Topic 01: Organization & Governance · Rating: YELLOW

Ridgeline Capital Partners was founded in 2008 by David Chen, who serves as CEO, CIO, and sole portfolio manager. [[REF:ridgeline_ddq_2026.pdf:"Founded in 2008 by David Chen who serves as CEO, CIO, and PM"]] The firm employs 34 full-time professionals across investment, operations, and investor relations. The organizational structure is flat, with Chen as the central decision-maker for investment and operational matters.

**Risk Observation RO-006:** No formal written succession plan exists for the founder/PM. The fund's continued operation is critically dependent on David Chen with no documented contingency.

**Risk Observation RO-007:** Key person concentration is acute. All investment decisions are made by David Chen with no designated backup PM or investment committee with voting authority.

### Topic 02: Regulatory & Compliance · Rating: RED

Ridgeline Capital Partners is registered as an investment adviser with the SEC (CRD #171432). [[REF:SEC_EDGAR:"Registered investment adviser, effective 2008, CRD #171432"]] Form ADV Part 2A was last amended in March 2025. No disciplinary actions, regulatory inquiries, or sanctions appear on the IAPD or BrokerCheck records for the firm or its key personnel.

**Risk Observation RO-057:** The firm has no dedicated Chief Compliance Officer. Compliance oversight is performed by COO Sarah Martinez as a secondary responsibility alongside operations, technology, and investor relations. There is no independent compliance reporting line. [[REF:ridgeline_compliance_manual.pdf:"Compliance oversight is the responsibility of the COO"]]

**Risk Observation RO-059:** No pre-clearance system for personal securities transactions exists. The firm relies on an honor-based quarterly attestation process with no automated enforcement or monitoring. This is material given the firm's trading in equities where conflicts of interest are most likely to arise.

**Risk Observation RO-061:** Expert network usage is not subject to compliance pre-approval or chaperoning protocols. The firm uses GLG and Gerson Lehrman Group without documented review procedures, creating risk of material non-public information exposure.

### Topic 03: Legal & Conflicts · Rating: GREEN

The fund is structured as a Delaware limited partnership with a Cayman feeder for international investors. [[REF:ridgeline_ppm.pdf:"Delaware LP structure with Cayman feeder fund"]] The LPA is comprehensive and addresses material conflict provisions including cross-trading, side pocket allocation, and fee netting. Side letter provisions are disclosed in the DDQ with no preferential liquidity terms granted.

No material litigation, arbitration, or regulatory proceedings involving the firm or its principals were identified during the review period.

### Topic 04: Technology & Cybersecurity · Rating: YELLOW

The firm operates on institutional-grade technology infrastructure including Eze OMS for order management, Advent Geneva for portfolio accounting, and Bloomberg BVAL for pricing. [[REF:ridgeline_ddq_2026.pdf:"Eze OMS for order management, Advent Geneva for portfolio accounting"]]

**Risk Observation RO-044:** The firm does not carry dedicated cybersecurity insurance. General E&O coverage does not address cyber-specific risks including ransomware, data breach notification costs, or regulatory response.

The most recent penetration test was conducted in January 2026 by an independent third party. [[REF:Pen_Test_Summary_Jan2026.pdf:"Penetration test completed January 2026"]] Results indicated no critical vulnerabilities. The BCP was last tested in December 2025 with satisfactory results. [[REF:BCP_Test_Results_Dec2025.pdf:"BCP test completed December 2025"]]

---

## Act II — Investment Operations

### Topic 05: Fund Terms & Structure · Rating: GREEN

Management fee of 1.5% and performance allocation of 20% with a 6% hurdle rate and high-water mark are standard for the strategy. [[REF:ridgeline_ppm.pdf:"Management fee 1.5%, performance allocation 20%, hurdle 6%, high-water mark"]] The fund offers quarterly redemptions with 90-day notice and a 3% redemption gate at the fund level. A 5% side pocket allocation cap applies to Level 3 assets.

Gate provisions are clearly disclosed in the offering documents. No gates or suspensions have been imposed in the fund's operating history.

### Topic 06: Service Providers · Rating: GREEN

**Prime Brokerage:** Goldman Sachs and Morgan Stanley serve as dual prime brokers. [[REF:ridgeline_ddq_2026.pdf:"Goldman Sachs and Morgan Stanley as prime brokers"]] Rehypothecation limits are set at 140% of net debit balances. Segregated custody accounts are maintained at both primes.

**Administrator:** Citco Fund Services (Cayman) performs independent NAV calculation, investor reporting, and transfer agency. [[REF:ridgeline_ddq_2026.pdf:"Citco Fund Services as fund administrator"]] NAV is calculated monthly with a 15-business-day turnaround, independently of the investment manager.

**Auditor:** Ernst & Young LLP issued clean, unqualified audit opinions for FY2023 and FY2024. [[REF:Audited_Financials_FY2024.pdf:"Ernst & Young unqualified audit opinion FY2024"]] No material weaknesses or significant deficiencies were noted.

**Legal:** Sidley Austin LLP serves as fund counsel. Offshore counsel: Maples and Calder.

### Topic 07: Investment Process · Rating: GREEN

The fund employs a fundamental long/short equity strategy targeting 100–150 long positions and 60–100 short positions across 10–15 countries. [[REF:ridgeline_ppm.pdf:"100-150 long positions, 60-100 short positions"]] Position sizing is rule-based with a maximum single-position limit of 5% of NAV at cost.

The investment process is well-documented with a formal IC Charter governing investment decisions. [[REF:IC_Charter_Jan2026.pdf:"Investment Committee Charter governing position approval"]] Research workflow, position sizing, and portfolio construction guidelines are codified in the Operations Manual.

### Topic 08: Trading & Execution · Rating: GREEN

Best execution is monitored through quarterly Transaction Cost Analysis (TCA) reports reviewed by the COO and IC. [[REF:ridgeline_ddq_2026.pdf:"Quarterly TCA reports reviewed by COO and IC"]] The firm has a formal order allocation policy governing block trades and IPO allocations.

T+1 reconciliation is performed daily by Citco against the firm's Advent Geneva records. Material breaks exceeding $100,000 are escalated to the COO within 24 hours.

---

## Act III — Controls & Transparency

### Topic 09: Valuation Controls · Rating: YELLOW

The fund's valuation policy designates equity securities as Level 1 (exchange-listed) or Level 2 (OTC). [[REF:ridgeline_valuation_policy.pdf:"Equity securities classified as Level 1 or Level 2"]] Level 3 assets are capped at 5% of NAV. The Valuation Committee meets quarterly and is responsible for Level 2 and Level 3 pricing determinations.

**Risk Observation RO-024:** The Valuation Committee currently consists of the COO and two portfolio analysts — all of whom are Ridgeline employees. No independent members sit on the committee, creating a structural conflict in asset pricing determinations.

### Topic 10: Financial Controls · Rating: GREEN

Operating accounts are segregated from investor assets. The firm maintains a minimum 6-month cash runway in an operating reserve. [[REF:Audited_Financials_FY2024.pdf:"Operating reserve maintained at 6-month minimum runway"]] Annual audited financial statements are delivered to investors within 60 days of fiscal year-end.

Internal controls include dual authorization for wire transfers exceeding $50,000 and monthly bank reconciliations reviewed by the CFO.

### Topic 11: Asset Verification · Rating: GREEN

Administrator AUM confirmation: Citco confirmed $2.306B as of December 31, 2025, against the manager-reported $2.31B. [[REF:ADMIN_VERIFICATION:"Citco confirmed AUM $2.306B vs manager-reported $2.31B (0.17% variance)"]] Variance of 0.17% is within acceptable range and attributable to timing of month-end accruals.

412 investor accounts verified. All subscription and redemption flows are independently processed by Citco with no manager involvement in cash movement.

### Topic 12: Reporting & Transparency · Rating: GREEN

Monthly investor letters are distributed within 15 business days of month-end. Annual audited financials are distributed within 60 days. [[REF:ridgeline_ddq_2026.pdf:"Monthly letters within 15 business days"]] The firm provides a quarterly attribution report and semi-annual risk report.

GIPS-compliant performance presentation has been maintained since fund inception. The GIPS composite has been verified by ACA Performance Services.

---

## Verification Summary

| Item | Status | Finding |
|------|--------|---------|
| SEC Registration (IAPD) | Verified | CRD #171432, no reportable items |
| Form ADV Part 2A | Verified | Current; no material changes from DDQ |
| FINRA BrokerCheck (key personnel) | Verified | Clean record for all principals |
| AUM Verification | Partial | $2.31B reported vs $2.306B admin-confirmed (0.17% variance) |
| Auditor Confirmation (EY) | Verified | Engagement confirmed; clean opinion FY2024 |
| CCO Identity & Registration | Failed | No dedicated CCO in IAPD. Compliance managed by PM. |

---

## Outstanding Items

The following items must be resolved prior to ACCEPT upgrade consideration:

1. **CCO Hire** — Dedicated CCO must be onboarded and registered with the SEC by April 30, 2026. Status: Pending.
2. **Pre-Trade Compliance** — Bloomberg AIM or equivalent pre-clearance system must be deployed and tested by June 30, 2026. Status: Pending.
3. **Succession Plan** — Board-approved succession plan for PM/founder must be submitted by March 31, 2026. Status: Pending.
4. **Valuation Committee** — At least one independent member must be added to the Valuation Committee by March 31, 2026. Status: Pending.

---

*Alpine Due Diligence Inc. · Confidential — For Institutional Use Only*
*Ridgeline Capital Partners, LLC — ODD Report · January 2026*
`;

// ── Markdown renderer ─────────────────────────────────────────────────────────

function ratingBadgeHtml(rating: string): string {
  const r = RATING_BADGE_COLORS[rating];
  if (!r) return rating;
  return `<span style="display:inline-flex;align-items:center;gap:5px;padding:2px 10px;border-radius:9999px;background:${r.bg};font-size:12px;font-weight:600;color:${r.text};letter-spacing:0.03em;vertical-align:middle;"><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${r.dot};"></span>${rating}</span>`;
}

function inlineFormat(str: string): string {
  let result = str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  // [[REF:source:"quote"]] → clickable colored dot
  result = result.replace(
    /\[\[REF:([^:]+?):"([^"]*?)"\]\]/g,
    (_match, source: string, quote: string) => {
      const color = getDotColor(source);
      const display = source.replace(/_/g, " ").replace(".pdf", "").replace(/\b\w/g, (c) => c.toUpperCase());
      const safeSource = source.replace(/"/g, "&quot;");
      const safeQuote = quote.replace(/"/g, "&quot;");
      return `<span data-ref-source="${safeSource}" data-ref-quote="${safeQuote}" title="Source: ${display}" style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${color};margin:0 3px;vertical-align:middle;cursor:pointer;transition:transform 0.1s,box-shadow 0.1s;" onmouseover="this.style.transform='scale(1.4)';this.style.boxShadow='0 0 0 3px ${color}33'" onmouseout="this.style.transform='scale(1)';this.style.boxShadow='none'"></span>`;
    },
  );

  // Rating badges
  result = result.replace(
    /(?:Overall\s+)?Rating:\s*(GREEN|YELLOW|RED|ACCEPT|WATCHLIST|FLAG)/g,
    (_match, rating) => {
      const prefix = _match.replace(rating, "").trim();
      return prefix ? `${prefix} ${ratingBadgeHtml(rating)}` : ratingBadgeHtml(rating);
    },
  );

  result = result.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  result = result.replace(/\*(.+?)\*/g, "<em>$1</em>");
  return result;
}

function renderMarkdown(md: string): string {
  const lines = md.split("\n");
  const html: string[] = [];
  let inList = false;
  let inTable = false;
  let tableRows: string[] = [];

  function flushTable() {
    if (!tableRows.length) return;
    const [header, _sep, ...body] = tableRows;
    const ths = (header || "").split("|").slice(1, -1).map((h) => `<th class="px-3 py-2 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">${h.trim()}</th>`).join("");
    const trs = body.map((row) => {
      const tds = row.split("|").slice(1, -1).map((d) => `<td class="px-3 py-2 text-sm text-slate-700">${inlineFormat(d.trim())}</td>`).join("");
      return `<tr class="border-b border-slate-100 last:border-0">${tds}</tr>`;
    }).join("");
    html.push(`<div class="overflow-auto my-4 rounded-lg border border-slate-200"><table class="w-full text-sm"><thead><tr class="bg-slate-50 border-b border-slate-200">${ths}</tr></thead><tbody>${trs}</tbody></table></div>`);
    tableRows = [];
    inTable = false;
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Table rows
    if (trimmed.startsWith("|")) {
      if (!inTable) inTable = true;
      tableRows.push(trimmed);
      continue;
    } else if (inTable) {
      flushTable();
    }

    if (!trimmed) {
      if (inList) { html.push("</ul>"); inList = false; }
      continue;
    }

    if (trimmed.startsWith("# ")) {
      html.push(`<h1 class="text-xl font-heading font-bold text-alpine-ink mt-1 mb-2">${inlineFormat(trimmed.slice(2))}</h1>`);
      continue;
    }
    if (trimmed.startsWith("## ")) {
      const text = trimmed.slice(3);
      const plain = text.replace(/\*\*(.+?)\*\*/g, "$1");
      const id = "toc-" + plain.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      html.push(`<h2 id="${id}" class="text-base font-heading font-bold text-alpine-ink mt-7 mb-2 scroll-mt-4 pt-4 border-t border-slate-100">${inlineFormat(text)}</h2>`);
      continue;
    }
    if (trimmed.startsWith("### ")) {
      html.push(`<h3 class="text-sm font-heading font-semibold text-alpine-ink mt-5 mb-1.5">${inlineFormat(trimmed.slice(4))}</h3>`);
      continue;
    }

    if (/^[-=]{3,}$/.test(trimmed)) {
      html.push('<hr class="border-slate-200 my-5" />');
      continue;
    }

    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      if (!inList) { html.push('<ul class="list-disc list-inside space-y-1 text-sm text-slate-700 my-2 ml-1">'); inList = true; }
      html.push(`<li>${inlineFormat(trimmed.slice(2))}</li>`);
      continue;
    }
    if (/^\d+\. /.test(trimmed)) {
      if (!inList) { html.push('<ol class="list-decimal list-inside space-y-1.5 text-sm text-slate-700 my-2 ml-1">'); inList = true; }
      html.push(`<li>${inlineFormat(trimmed.replace(/^\d+\. /, ""))}</li>`);
      continue;
    }

    if (inList) { html.push(inList ? "</ul>" : "</ol>"); inList = false; }
    html.push(`<p class="text-sm text-slate-700 leading-relaxed mb-1.5">${inlineFormat(trimmed)}</p>`);
  }
  if (inList) html.push("</ul>");
  if (inTable) flushTable();
  return html.join("\n");
}

// ── Source legend data ────────────────────────────────────────────────────────

const SOURCE_LEGEND = [
  { color: PDF_DOT_COLOR,                     label: "Fund Document" },
  { color: SOURCE_DOT_COLORS.SEC_EDGAR,        label: "SEC EDGAR" },
  { color: SOURCE_DOT_COLORS.ALPINE_ANALYSIS,  label: "Alpine Analysis" },
  { color: SOURCE_DOT_COLORS.ADMIN_VERIFICATION,label: "Admin Verification" },
];

// ── Extract ## headings for JUMP TO bar ──────────────────────────────────────

function extractHeadings(md: string): { text: string; id: string }[] {
  return md.split("\n")
    .filter((l) => l.startsWith("## "))
    .map((l) => {
      const raw = l.slice(3).trim();
      const text = raw.replace(/\*\*(.+?)\*\*/g, "$1");
      const id = "toc-" + text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      return { text: text.replace(/Rating:.*$/, "").trim(), id };
    });
}


function CallPrep() {
  const sections = [
    {
      label: "P1 — Critical",
      color: "red" as const,
      topic: "Compliance Program",
      riskTag: "RED RISK",
      categoryTag: "Compliance",
      questions: [
        "CCO hiring timeline — candidate profile and target hire date?",
        "Pre-clearance system implementation plan and budget?",
        "Expert network chaperoning policy — current controls?",
      ],
    },
    {
      label: "P1 — Critical",
      color: "red" as const,
      topic: "Governance & Succession",
      riskTag: "RED RISK",
      categoryTag: "Key Person",
      questions: [
        "Written succession plan — when will it be board-approved?",
        "Key person insurance — coverage amount and current status?",
        "Board composition changes planned for 2026?",
      ],
    },
    {
      label: "P2 — Important",
      color: "amber" as const,
      topic: "Valuation Committee",
      riskTag: "YELLOW RISK",
      categoryTag: "Valuation",
      questions: [
        "Timeline for adding independent members?",
        "Current mark dispute resolution process?",
        "Level 3 asset classification methodology?",
      ],
    },
    {
      label: "P2 — Important",
      color: "amber" as const,
      topic: "Technology & Cybersecurity",
      riskTag: "YELLOW RISK",
      categoryTag: "Cybersecurity",
      questions: [
        "Cybersecurity insurance coverage details?",
        "Penetration testing frequency and last test date?",
        "Incident response plan — last tabletop exercise?",
      ],
    },
  ];

  return (
    <div className="max-w-[960px]">
      <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <div className="pb-7 border-b border-slate-200">
          <p className="text-[10px] uppercase tracking-[5px] text-violet-600 font-heading font-semibold mb-2">Alpine Due Diligence</p>
          <h1 className="text-xl font-heading font-bold text-alpine-ink">Management Analyst Call</h1>
          <p className="mt-1 text-sm text-slate-500 font-heading">Ridgeline Capital Partners, LLC</p>
          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-slate-500">
            <span className="rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 font-heading font-semibold text-amber-700">
              6 risk observations
            </span>
            <span className="rounded-full border border-red-200 bg-red-50 px-4 py-1.5 font-heading font-semibold text-red-700">
              3 HIGH severity blockers
            </span>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 font-heading font-semibold text-slate-600">
              4 discussion modules
            </span>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-amber-200 bg-[linear-gradient(135deg,rgba(255,251,235,0.95),rgba(255,255,255,1))] p-5">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v6" />
                <path d="M12 22v-6" />
                <path d="M4.93 4.93l4.24 4.24" />
                <path d="M14.83 14.83l4.24 4.24" />
                <path d="M2 12h6" />
                <path d="M22 12h-6" />
                <path d="M4.93 19.07l4.24-4.24" />
                <path d="M14.83 9.17l4.24-4.24" />
              </svg>
            </div>
            <div>
              <h4 className="text-xs font-heading font-bold uppercase tracking-[0.18em] text-amber-700">Call Objective</h4>
              <p className="mt-1 text-sm leading-7 text-amber-950">
                Obtain management responses to 6 risk observations. Focus on remediation timelines for the 3 HIGH-severity findings preventing ACCEPT.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-7 space-y-4">
          {sections.map((s, i) => {
            const isCritical = s.color === "red";
            return (
              <section
                key={i}
                className="border-t border-slate-200 pt-5"
              >
                <div className="flex items-start justify-between gap-3 border-b border-slate-200 pb-3">
                  <div>
                    <p className={`text-[11px] font-heading font-bold uppercase tracking-[0.18em] ${isCritical ? "text-slate-700" : "text-slate-600"}`}>
                      {s.label}
                    </p>
                    <h3 className="mt-1 text-lg font-heading font-semibold text-alpine-ink">{s.topic}</h3>
                  </div>
                  <span
                    className="mt-0.5 inline-flex h-8 min-w-8 items-center justify-center rounded-full border border-slate-200 bg-white px-3 text-xs font-heading font-bold text-slate-500"
                  >
                    {s.questions.length}
                  </span>
                </div>

                <ol className="mt-4 space-y-3">
                  {s.questions.map((q, j) => (
                    <li key={j} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                      <span
                        className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-xs font-heading font-bold text-slate-600"
                      >
                        {j + 1}
                      </span>
                      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                        <p className="text-sm leading-6 text-slate-700">{q}</p>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-heading font-semibold ${
                            isCritical
                              ? "bg-red-50 text-red-700 ring-1 ring-inset ring-red-200"
                              : "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200"
                          }`}
                        >
                          {s.riskTag}
                        </span>
                        <span className="inline-flex items-center rounded-full bg-slate-50 px-2 py-0.5 text-[11px] font-heading font-semibold text-slate-600 ring-1 ring-inset ring-slate-200">
                          {s.categoryTag}
                        </span>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ICDeck() {
  const slides = [
    { n: 1,  t: "Cover & Fund Overview",    c: "Ridgeline Capital Partners, LLC — Global L/S Equity — AUM $2.31B — ODD Rating: WATCHLIST (68/100)" },
    { n: 2,  t: "Executive Summary",         c: "Fund overview, key findings, overall assessment. 4 conditions for ACCEPT upgrade." },
    { n: 3,  t: "Operational Strengths",     c: "Citco admin, EY audit, GS/MS prime brokerage. Clean audit history. Comprehensive reporting. Experienced team." },
    { n: 4,  t: "Critical Findings (RED)",   c: "3 HIGH: No dedicated CCO. No pre-trade compliance. Founder key person dependency." },
    { n: 5,  t: "Moderate Findings (YELLOW)","c": "3 MEDIUM: Valuation committee not independent. No succession plan. Cybersecurity insurance absent." },
    { n: 6,  t: "Topic Rating Summary",      c: "12-topic breakdown: 7 GREEN, 4 YELLOW, 1 RED across 3 Acts (Structural / Investment / Controls)." },
    { n: 7,  t: "Verification Results",      c: "SEC confirmed. Form ADV current. EY audit confirmed. AUM 0.17% variance (immaterial). CCO FAILED." },
    { n: 8,  t: "Conditions for ACCEPT",     c: "1) CCO hire (90d) · 2) Pre-trade system (60d) · 3) Succession plan (120d) · 4) Valuation committee (90d)" },
    { n: 9,  t: "Monitoring Plan",           c: "Annual full-scope review (Jan 2027). Quarterly ops calls. 6 trigger events with escalation procedures." },
    { n: 10, t: "Recommendation",            c: "WATCHLIST with path to ACCEPT. All gaps addressable within 60–120 days. Quarterly monitoring recommended." },
  ] as const;
  return (
    <div className="w-full">
      <div className="text-center pb-5 mb-5 border-b border-slate-200">
        <p className="text-[10px] uppercase tracking-[3px] text-violet-600 font-heading font-semibold mb-1">Alpine Due Diligence</p>
        <h1 className="text-xl font-heading font-bold text-alpine-ink">IC Presentation Deck</h1>
        <p className="text-slate-400 text-sm">10-slide outline for Investment Committee</p>
      </div>
      <div className="space-y-3">
        {slides.map((s) => (
          <div key={s.n} className="border border-slate-200 rounded-xl p-5 flex gap-4">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-violet-100 text-violet-700 text-xs font-heading font-bold shrink-0">{s.n}</span>
            <div><p className="font-heading font-semibold text-alpine-ink">{s.t}</p><p className="text-sm text-slate-600 mt-0.5">{s.c}</p></div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Final Report — paginated document reader ─────────────────────────────────

const AURORA_FINAL_REPORT_SECTIONS = [
  {
    id: "cover", group: null, title: "Cover Page",
    render: () => (
      <div style={{ background: "#ffffff", padding: "40px 48px 40px" }}>
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", color: "#7c3aed", textTransform: "uppercase" as const, marginBottom: 20 }}>Alpine Due Diligence Inc.</div>
        <div style={{ fontSize: 30, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em", lineHeight: 1.15 }}>ODD Report</div>
        <div style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", letterSpacing: "0.1em", marginTop: 6, marginBottom: 20 }}>CONFIDENTIAL</div>
        <div style={{ fontSize: 20, color: "#0f172a", fontWeight: 700, marginBottom: 4 }}>Aurora Ventures IV, L.P.</div>
        <div style={{ fontSize: 13, color: "#475569", marginBottom: 28 }}>Early-Stage Venture Capital | Delaware LP | Full Review</div>
        <div style={{ display: "flex", gap: 32, flexWrap: "wrap" as const, fontSize: 11, borderTop: "1px solid #f1f5f9", paddingTop: 20 }}>
          {[["Review Date", "April 2026"], ["Review Type", "Initial (Pre-Final-Close)"], ["Strategy", "Early-Stage VC"], ["Domicile", "Delaware LP"]].map(([label, val]) => (
            <div key={label}>
              <div style={{ fontSize: 9, color: "#94a3b8", letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: 3, fontWeight: 600 }}>{label}</div>
              <div style={{ color: "#334155", fontWeight: 600, fontSize: 12 }}>{val}</div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "toc", group: null, title: "Table of Contents",
    render: () => (
      <div>
        <SectionHeader title="Table of Contents" page="3" />
        <div style={{ fontFamily: "Georgia, serif" }}>
          {[
            { section: "—", title: "Overview", page: "4", rating: undefined },
            { section: "—", title: "Assessment", page: "5", rating: undefined },
            { section: "—", title: "Scope & Verification", page: "7", rating: undefined },
            { section: "—", title: "Alpine Ratings", page: "8", rating: undefined },
            { section: "—", title: "Alpine Flags", page: "9", rating: undefined },
            { section: "—", title: "Remediation & Monitoring", page: "11", rating: undefined },
            { section: "Ch 1", title: "Manager, Ownership & Governance", page: "13", rating: "YELLOW" },
            { section: "Ch 2", title: "Legal, Regulatory & Compliance", page: "16", rating: "YELLOW" },
            { section: "Ch 3", title: "Technology, Cybersecurity & Business Resilience", page: "19", rating: "GREEN" },
            { section: "Ch 4", title: "Fund Structure, Terms & Investor Alignment", page: "21", rating: "GREEN" },
            { section: "Ch 5", title: "Service Providers, Delegation & Oversight", page: "24", rating: "GREEN" },
            { section: "Ch 6", title: "Investment Operations & Portfolio Controls", page: "26", rating: "GREEN" },
            { section: "Ch 7", title: "Valuation, Asset Existence & Investor Reporting", page: "29", rating: "GREEN" },
            { section: "Ch 8", title: "Manager Transparency & LP Communications", page: "32", rating: "GREEN" },
            { section: "—", title: "Reference Data", page: "33", rating: undefined },
          ].map((item) => {
            const rc = item.rating === "GREEN" ? "#059669" : item.rating === "YELLOW" ? "#D97706" : item.rating === "RED" ? "#DC2626" : undefined;
            const rb = item.rating === "GREEN" ? "#d1fae5" : item.rating === "YELLOW" ? "#fef3c7" : item.rating === "RED" ? "#fee2e2" : undefined;
            return (
              <div key={item.section + item.title} style={{ marginBottom: 8, display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ fontSize: 10, fontWeight: 600, color: "#7c3aed", width: 32, flexShrink: 0 }}>{item.section}</span>
                <span style={{ flex: 1, fontSize: 13, color: "#1e293b" }}>{item.title}</span>
                {item.rating && <span style={{ fontSize: 9, fontWeight: 700, padding: "1px 6px", borderRadius: 3, background: rb, color: rc, flexShrink: 0 }}>{item.rating}</span>}
                <span style={{ fontSize: 11, color: "#94a3b8", flexShrink: 0, minWidth: 20, textAlign: "right" }}>{item.page}</span>
              </div>
            );
          })}
        </div>
      </div>
    ),
  },
  {
    id: "overview", group: null, title: "Overview & Assessment",
    render: () => (
      <div>
        <SectionHeader title="Overview" page="4" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 8 }}>Manager Overview</div>
            <BodyText>Aurora Capital Management, LLC (&quot;Aurora&quot;) is an early-stage venture capital firm registered as an Exempt Reporting Adviser (CRD 312044). The firm reported regulatory AUM of $981.54M as of March 26, 2026 (excl. $215.59M uncalled). Headquartered in Los Angeles on a fully remote basis with 9 FTEs.</BodyText>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 8, marginTop: 12 }}>Fund Overview</div>
            <BodyText>Aurora Ventures IV, L.P. is a Delaware LP formed August 31, 2025 with Aurora Ventures IV GP, LLC as General Partner. Target $250M / hard cap $250M. Strategy: pre-seed and seed with selective Series A across consumer, entertainment, and emerging technology sectors.</BodyText>
            <BodyText>GP commitment is at least $9.0M (~3% of commitments), with approximately half satisfied via management fee offset. Fund term: 10 years with up to two one-year extensions.</BodyText>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 8, marginTop: 12 }}>Controls Overview</div>
            <BodyText>Meridian Fund Services, LLC has been engaged as fund administrator per Admin Agreement dated August 31, 2025; Meridian uses LedgerCraft Enterprise and Polaris. Grant Baker LLP is expected as auditor (Fund IV engagement letter pending; FY2024 audit of Aurora Ventures III by Grant Baker, unqualified opinion). Legal counsel: Brennan Kincaid LLP. IT: Vantage Tech Partners. Compliance consultant: Apex Compliance Advisors.</BodyText>
            <BodyText>All outbound wires require dual approval by Kevin Park (VP Finance) and Rebecca Stern (GP); Meridian initiates wires and verifies payment instructions via callback for new or changed beneficiaries.</BodyText>
            <BodyText>Aurora has not engaged a third-party valuation agent; all portfolio valuations are prepared internally and Meridian accepts manager-prepared valuations at quarter-end without independent verification.</BodyText>
          </div>
          <div>
            <FindingBox type="strength" title="Strengths">
              <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.8, listStyleType: "disc", listStylePosition: "outside" }}>
                <li style={{ marginBottom: 4 }}>Institutional service-provider infrastructure (Meridian admin; Grant Baker LLP expected auditor).</li>
                <li style={{ marginBottom: 4 }}>Dual-approval outbound wire process with Meridian initiation.</li>
                <li style={{ marginBottom: 4 }}>Strong prior-vintage performance, including 30x and 28x DPI on two Silverline / Aurora JV investments.</li>
                <li style={{ marginBottom: 4 }}>Proactive disclosure of operational limitations during diligence.</li>
              </ul>
            </FindingBox>
            <FindingBox type="concern" title="Risks">
              <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.8, listStyleType: "disc", listStylePosition: "outside" }}>
                <li style={{ marginBottom: 4 }}>Principals&apos; significant external business interests (actor/film producer; entertainer talent manager) create elevated headline risk.</li>
                <li style={{ marginBottom: 4 }}>Daniel Brenner named defendant in ongoing Mythic / LunarPay class action (filed Dec 2024); SEC separately investigating Mythic re: NFT/crypto.</li>
                <li style={{ marginBottom: 4 }}>No dedicated CCO; Kevin Park (VP Finance) serves as acting CCO.</li>
                <li style={{ marginBottom: 4 }}>Expert network controls insufficient: no written policy, pre-clearance, blackout periods, MNPI script, or chaperoning.</li>
                <li style={{ marginBottom: 4 }}>No third-party valuation agent appointed; Meridian accepts manager pricing without verification.</li>
                <li style={{ marginBottom: 4 }}>GP commitment partially cashless (~$4.5M via fee offset).</li>
                <li style={{ marginBottom: 4 }}>No formal succession plan at business level; no key person insurance.</li>
              </ul>
            </FindingBox>
          </div>
        </div>

        <div style={{ borderTop: "2px solid #f1f5f9", paddingTop: 24, marginTop: 8 }}>
          <SectionHeader title="Assessment" page="5–6" />
          <BodyText>{AURORA_ASSESSMENT_INTRO1}</BodyText>
          <BodyText>{AURORA_ASSESSMENT_INTRO2}</BodyText>
          {AURORA_ASSESSMENT_NOTES.split("\n\n").map((para, i) => (
            <BodyText key={i}>{para}</BodyText>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "ratings", group: null, title: "Ratings & Flags",
    render: () => null,
  },
  {
    id: "verification", group: null, title: "Scope & Verification",
    render: () => (
      <div>
        <SectionHeader title="Scope & Verification" page="7" />
        <div style={{ fontSize: 10, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 8 }}>Scope of Review</div>
        <BodyText>
          Alpine&apos;s review included direct verification calls with Meridian Fund Services (administrator) and a review of the Fund&apos;s Limited Partnership Agreement, Private Placement Memorandum, Form ADV ERA (March 26, 2026), DDQ, Compliance Manual, Valuation Policy, Aurora Ventures III FY2024 audited financials (Grant Baker LLP), Administration Agreement, WISP, Incident Response Plan, BCP, and independent checks against public registers and regulatory databases.
        </BodyText>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 10, marginTop: 16 }}>Independent Verification Performed</div>
        <div style={{ overflowX: "auto" as const }}>
          <table style={{ width: "100%", borderCollapse: "collapse" as const, fontSize: 11 }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                {["Verification", "Result", "Evidence Basis"].map((h) => (
                  <th key={h} style={{ padding: "8px 12px", textAlign: "left" as const, fontSize: 9, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase" as const, letterSpacing: "0.1em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["Management Company Registration", "Confirmed", "California SoS · Delaware Division of Corporations · Date of Formation August 17, 2017"],
                ["SEC ERA Status", "Confirmed", "Alpine direct check, IARD / EDGAR — CRD 312044"],
                ["Form ADV (ERA) — Annual Filing", "Verified", "Filed March 26, 2026; cross-referenced with DDQ"],
                ["Principal Background Checks", "Verified", "FINRA BrokerCheck / IAPD — Reeves, Brenner, Stern"],
                ["Daniel Brenner — Disciplinary Disclosure", "Flagged", "Form ADV §11 — Mythic/LunarPay class action, filed December 2024 (ongoing)"],
                ["Ownership Structure", "Consistent", "Form ADV Schedules A/B — Reeves 40% · Brenner 40% · Stern 20%"],
                ["AUM Verification", "Consistent", "Form ADV cross-reference: $981.54M (excl. $215.59M uncalled); prior year $814.59M"],
                ["Fund Registration (Delaware)", "Confirmed", "Delaware Division of Corporations · Aurora Ventures IV, L.P. · August 31, 2025"],
                ["General Partner Registration", "Confirmed", "Delaware Division of Corporations · Aurora Ventures IV GP, LLC"],
                ["Administrator Engagement", "Confirmed", "Meridian Fund Services verification call · Dana Blackwell · April 9, 2026"],
                ["Auditor Engagement (Fund IV)", "Pending", "Grant Baker LLP expected; engagement letter not yet signed (FY2024 Fund III audit complete, unqualified)"],
                ["External Valuation Agent", "Not Appointed", "Monitoring item — required before Fund IV final close"],
                ["Acting CCO Designation", "Flagged", "Kevin Park (VP Finance and Operations) — dedicated CCO hire recommended by 2027"],
              ].map(([verification, result, evidence], i) => {
                const color = result === "Flagged" || result === "Not Appointed" || result === "Pending" ? "#D97706" : "#059669";
                return (
                  <tr key={verification as string} style={{ borderBottom: "1px solid #f1f5f9", background: i % 2 === 0 ? "#fff" : "#fafbfc" }}>
                    <td style={{ padding: "8px 12px", fontWeight: 500, color: "#1e293b" }}>{verification}</td>
                    <td style={{ padding: "8px 12px", color, fontWeight: 600, whiteSpace: "nowrap" as const }}>{result}</td>
                    <td style={{ padding: "8px 12px", color: "#64748b", fontSize: 10 }}>{evidence}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    ),
  },
  {
    id: "remediation", group: null, title: "Remediation & Monitoring",
    render: () => (
      <div>
        <SectionHeader title="Remediation & Monitoring" page="11–12" />
        <div style={{ fontSize: 10, fontWeight: 700, color: "#dc2626", textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 10 }}>Required Before Final Close</div>
        <div style={{ display: "flex", flexDirection: "column" as const, gap: 10, marginBottom: 24 }}>
          {[
            { n: 1, priority: "HIGH", target: "Before Fund IV final close", ia: "Require executed engagement letter as condition of close", text: "Appoint third-party valuation agent (e.g., Houlihan Lokey or Duff & Phelps) for quarterly portfolio valuation." },
            { n: 2, priority: "HIGH", target: "Before Fund IV final close", ia: "Require executed engagement letter as condition of close", text: "Execute Fund IV audit engagement letter with Grant Baker LLP." },
            { n: 3, priority: "HIGH", target: "Q3 2026", ia: "Require written commitment via side letter", text: "Implement all five recommended expert network controls (written policy, pre-clearance, blackout periods, MNPI script, compliance chaperoning)." },
          ].map(({ n, priority, target, ia, text }) => (
            <div key={n} style={{ padding: "14px 18px", borderRadius: 10, background: "#fff7f7", border: "1px solid #fca5a5" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <span style={{ width: 22, height: 22, borderRadius: "50%", background: "#dc2626", color: "#fff", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{n}</span>
                <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 4, background: "#fee2e2", color: "#dc2626" }}>{priority}</span>
                <span style={{ fontSize: 10, color: "#94a3b8", marginLeft: "auto" }}>Target: {target}</span>
              </div>
              <p style={{ fontSize: 12, lineHeight: 1.7, color: "#334155", marginLeft: 32, marginBottom: 4 }}>{text}</p>
              <div style={{ fontSize: 10, color: "#7c3aed", marginLeft: 32 }}>Investor action: {ia}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#D97706", textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 10 }}>Post-Close Monitoring</div>
        <div style={{ display: "flex", flexDirection: "column" as const, gap: 6 }}>
          {[
            { n: 4, priority: "MED", target: "2027", text: "Hire dedicated Chief Compliance Officer as AUM scales past $1B." },
            { n: 5, priority: "MED", target: "Year-End 2026", text: "Implement endpoint data loss prevention (DLP) solution." },
            { n: 6, priority: "MED", target: "Q3 2026", text: "Conduct cloud-focused penetration test and quarterly simulated phishing program." },
            { n: 7, priority: "MED", target: "2026", text: "Formalize written succession plan at management company level; consider key person insurance." },
            { n: 8, priority: "MED", target: "2026", text: "Reconstitute valuation committee with majority non-investment professionals." },
            { n: 9, priority: "MED", target: "Ongoing", text: "Monitor Mythic / LunarPay litigation and SEC investigation; conduct periodic background checks on principals." },
            { n: 10, priority: "LOW", target: "2027", text: "Amend IC voting threshold from one of three to majority (2 of 3) consent." },
            { n: 11, priority: "LOW", target: "Future vintages", text: "Encourage fully cash-funded GP commitment as AUM scales." },
          ].map(({ n, priority, target, text }) => (
            <div key={n} style={{ display: "flex", gap: 10, padding: "9px 12px", background: "#fffbf0", border: "1px solid #fde68a", borderRadius: 7 }}>
              <span style={{ fontSize: 9, fontWeight: 700, color: "#94a3b8", width: 16 }}>#{n}</span>
              <span style={{ flex: 1, fontSize: 11, color: "#334155" }}>{text}</span>
              <span style={{ fontSize: 9, fontWeight: 700, color: "#D97706", flexShrink: 0 }}>{priority}</span>
              <span style={{ fontSize: 9, color: "#94a3b8", flexShrink: 0 }}>{target}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "ch1", group: "Chapters", title: "Ch 1 — Manager & Governance",
    render: () => (
      <div>
        <SectionHeader title="Chapter 1 — Manager, Ownership & Governance" page="13–15" rating="YELLOW" />
        <div style={{ fontSize: 10, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 8 }}>Management Company</div>
        <BodyText>Aurora Capital Management, LLC is a Delaware LLC formed August 17, 2017 (confirmed via California SoS and Delaware Division of Corporations) and operates on a fully remote basis from Los Angeles, CA. Marcus Reeves (Managing Partner) and Daniel Brenner (Managing Partner) founded the firm; Rebecca Stern joined as Partner in 2020. Marcus is a prominent actor and film producer; Daniel is a talent manager for internationally recognized entertainers; Rebecca holds a Stanford MBA and previously led Global Strategy at a NYSE-listed firm.</BodyText>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 8 }}>Ownership Structure</div>
        <BodyText>Per Form ADV Schedules A/B: Marcus Reeves 40%, Daniel Brenner 40%, Rebecca Stern 20%. No external institutional ownership. The Adviser is not affiliated with any broker-dealer.</BodyText>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 8 }}>Assets Under Management</div>
        <BodyText>Regulatory AUM of $981.54M as of March 26, 2026, excluding $215.59M of uncalled Fund IV commitments. Prior year (Form ADV March 2025): $814.59M. AUM growth reflects performance and new vehicle launches across the firm&apos;s vintages.</BodyText>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 16 }}>
          {[
            ["Fund I", "2018", "Closed", "Realized exits in fintech/AI"],
            ["Fund II", "2020", "Closed", "Top-quartile vintage"],
            ["Fund III", "2021", "Closed", "Realized exits in consumer/mobility"],
            ["Fund IV", "2025", "Pre-final-close", "Target / hard cap: $250M"],
          ].map(([f, v, c, s]) => (
            <div key={f} style={{ padding: "10px 12px", background: "#f8fafc", borderRadius: 8, border: "1px solid #e2e8f0" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#7c3aed", marginBottom: 2 }}>{f}</div>
              <div style={{ fontSize: 11, color: "#334155" }}>{c}</div>
              <div style={{ fontSize: 9, color: "#64748b" }}>{v} vintage · {s}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 8 }}>Human Resources</div>
        <BodyText>Total headcount: 9 FTEs (6 investment, 3 back office / operations). Investment team: Marcus Reeves (Managing Partner), Daniel Brenner (Managing Partner), Rebecca Stern (Partner), Austin Knight (Principal), plus 2 Associates. Back office: Kevin Park (VP Finance & Operations, acting CCO; former Senior Manager at Meridian Fund Services; joined December 2023), Elena Ruiz (Operating Partner; former MD at Silver Oak Growth; decade-long tenure at Crownhold Financial; joined March 2025), and 1 Operations Analyst.</BodyText>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 8 }}>External Business Interests &amp; Headline Risk</div>
        <BodyText>Both Marcus Reeves and Daniel Brenner maintain significant external business interests. Marcus is subject to media scrutiny following public criticism over support of a convicted individual; Daniel has ongoing exposure to the Mythic / LunarPay matter (see Chapter 2). Aurora&apos;s Conflicts policy requires disclosure and CCO approval for external boards; principals serve on portfolio company boards.</BodyText>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 8 }}>Succession Planning</div>
        <BodyText>No formal succession plan exists at the management company level. The LPA key person provision addresses the product level: it triggers if any two of three Managing Partners cease to dedicate substantially all business time to the Fund. No key person life insurance is maintained.</BodyText>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 8 }}>GP Commitment</div>
        <BodyText>Fund IV GP commitment: at least $9.0M (~3% of target commitments). Approximately half ($4.5M) is funded in cash; the remainder is satisfied via management fee reduction. Alpine recommends a fully cash-funded GP commitment in future vintages as AUM scales.</BodyText>
        <div style={{ marginTop: 20, padding: "14px 18px", borderRadius: 8, background: "#fef3c7", border: "1px solid #fde68a" }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: "#D97706", textTransform: "uppercase" as const, letterSpacing: "0.1em", marginBottom: 6 }}>Chapter Summary — YELLOW</div>
          <div style={{ fontSize: 12, lineHeight: 1.7, color: "#334155" }}>Yellow rating driven by: (1) principals&apos; significant external business interests and elevated headline risk profile (HIGH severity); (2) absence of formal business-level succession plan and no key person insurance (HIGH severity); (3) partially cashless GP commitment reducing alignment with LPs (MEDIUM severity). Partially mitigated by experienced operating team (Stern, Park, Ruiz) supplementing generalist GP backgrounds, and strong prior-vintage performance.</div>
        </div>
      </div>
    ),
  },
  {
    id: "ch2", group: "Chapters", title: "Ch 2 — Legal, Regulatory & Compliance",
    render: () => (
      <div>
        <SectionHeader title="Chapter 2 — Legal, Regulatory & Compliance" page="16–18" rating="YELLOW" />
        <div style={{ fontSize: 10, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 8 }}>Regulatory Status</div>
        <BodyText>Aurora is registered with the SEC as an Exempt Reporting Adviser under the venture capital adviser exemption (CRD 312044, SEC File 802-128945, ERA effective November 30, 2018). Current Form ADV dated March 26, 2026 reviewed. The firm is not registered with any state securities regulator. Aurora is not affiliated with any broker-dealer.</BodyText>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 8 }}>Disciplinary Disclosure — Daniel Brenner (Mythic / LunarPay)</div>
        <BodyText>Daniel Brenner is a named defendant in a purported class action filed December 2024 in the U.S. District Court for the Central District of California (Montgomery &amp; Reed LLP, plaintiffs&apos; counsel) regarding the Mythic Technologies / LunarPay &quot;Crystal Tiger Society&quot; NFT promotion. The complaint alleges coordinated promotion of NFTs as unregistered securities. The SEC is separately investigating Mythic Studios regarding whether NFT/crypto offerings constituted unregistered securities. Former Aurora employee Priya Desai is a co-defendant and departed Aurora in September 2025. The matter is ongoing; the Manager represents that the claims are without merit and intends to defend vigorously. Alpine recommends close monitoring of legal and reputational developments and periodic background checks on principals.</BodyText>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 8 }}>Compliance Infrastructure</div>
        <BodyText>Aurora does not have a dedicated Chief Compliance Officer. Kevin Park (VP Finance and Operations) serves as acting CCO in addition to all back office, accounting, finance, and operations responsibilities. Aurora engaged Apex Compliance Advisors as external compliance consultant in Q3 2025; annual compliance training was implemented in January 2026. The firm maintains a written Compliance Manual and Code of Ethics with annual attestation. Alpine recommends hiring a dedicated CCO by 2027 as AUM and complexity scale.</BodyText>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 8 }}>Expert Networks</div>
        <BodyText>Aurora has contracted with InsightSphere but has not adopted substantive expert network controls. There is no written expert network policy, no pre-clearance requirement for calls, no public-company blackout periods, no MNPI script delivered at the onset of calls, and no compliance chaperoning. Alpine recommends implementation of all five controls before Fund IV final close.</BodyText>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 8 }}>Personal Trading &amp; AML/KYC</div>
        <BodyText>Pre-clearance is required only for securities on the restricted list, which currently contains zero names. No minimum holding period; brokerage statements not independently collected by compliance. AML/KYC verification is performed by Aurora with assistance from Brennan Kincaid LLP (legal counsel) rather than by Meridian. Alpine recommends expanding pre-clearance to all reportable securities, implementing a minimum holding period, requiring independent brokerage statement collection, and transitioning AML/KYC to Meridian&apos;s investor services group.</BodyText>
        <div style={{ marginTop: 20, padding: "14px 18px", borderRadius: 8, background: "#fef3c7", border: "1px solid #fde68a" }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: "#D97706", textTransform: "uppercase" as const, letterSpacing: "0.1em", marginBottom: 6 }}>Chapter Summary — YELLOW</div>
          <div style={{ fontSize: 12, lineHeight: 1.7, color: "#334155" }}>Yellow rating driven by: (1) ongoing Mythic / LunarPay class action and SEC investigation involving Daniel Brenner (HIGH severity); (2) absence of dedicated CCO with Kevin Park serving in dual role (MEDIUM severity); (3) insufficient expert network controls (MEDIUM severity); (4) personal trading and AML/KYC gaps (MEDIUM severity). Partially mitigated by external compliance consultant engagement (Apex), formal Compliance Manual and Code of Ethics, and annual training program.</div>
        </div>
      </div>
    ),
  },
  {
    id: "ch3", group: "Chapters", title: "Ch 3 — Technology & Cybersecurity",
    render: () => (
      <div>
        <SectionHeader title="Chapter 3 — Technology, Cybersecurity & Business Resilience" page="19–20" rating="GREEN" />
        <div style={{ fontSize: 10, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 8 }}>Infrastructure</div>
        <BodyText>Aurora operates a fully cloud-based technology stack with no onsite infrastructure beyond internet connectivity. Core systems: Microsoft 365 (email and collaboration), AWS-hosted services, Vantage Tech Partners-managed endpoints. The firm engaged Vantage Tech Partners as IT services provider in January 2026 covering endpoint management, identity, patch management, and email security.</BodyText>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 8 }}>Cybersecurity Policies</div>
        <BodyText>Written Information Security Policy (WISP) adopted November 28, 2025. Incident Response Plan adopted November 28, 2025. Both documents were prepared in response to Alpine&apos;s follow-up requests during diligence. MFA is enforced for all business applications. Annual cybersecurity training was implemented in January 2026 and includes phishing awareness modules. No endpoint DLP solution is deployed; USB and removable media use is discouraged in practice but not technically restricted. No network penetration testing has been performed (Aurora cites cloud-based infrastructure as the rationale).</BodyText>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 8 }}>Business Continuity</div>
        <BodyText>Business Continuity Plan adopted November 27, 2025. Plan addresses service provider contingency, staff protection during a crisis, and stakeholder communications. The firm&apos;s fully-remote operating model provides inherent geographic resilience. Quarterly tabletop testing is planned.</BodyText>
        <div style={{ marginTop: 20, padding: "14px 18px", borderRadius: 8, background: "#d1fae5", border: "1px solid #bbf7d0" }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: "#059669", textTransform: "uppercase" as const, letterSpacing: "0.1em", marginBottom: 6 }}>Chapter Summary — GREEN</div>
          <div style={{ fontSize: 12, lineHeight: 1.7, color: "#334155" }}>Green rating. Formal policies (WISP, IRP, BCP) adopted in late November 2025; annual training implemented; MFA enforced; cloud-only stack with managed IT services provider. Monitoring items: endpoint DLP implementation and cloud-focused penetration test by year-end 2026.</div>
        </div>
      </div>
    ),
  },
  {
    id: "ch4", group: "Chapters", title: "Ch 4 — Fund Structure & Terms",
    render: () => (
      <div>
        <SectionHeader title="Chapter 4 — Fund Structure, Terms & Investor Alignment" page="21–23" rating="GREEN" />
        <div style={{ fontSize: 10, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 8 }}>Legal Structure</div>
        <BodyText>Aurora Ventures IV, L.P. is a Delaware limited partnership formed August 31, 2025 (confirmed via Delaware Division of Corporations). Aurora Ventures IV GP, LLC, a Delaware LLC, serves as the Fund&apos;s General Partner. Aurora Capital Management, LLC serves as the Investment Adviser.</BodyText>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 8 }}>Key Terms</div>
        <BodyText>Target raise: $250M; hard cap: $250M. Minimum LP commitment: negotiated. GP commitment: at least $9.0M (~3%), with approximately half funded in cash and half satisfied via management fee offset. Fund term: 10 years from Initial Closing Date, subject to up to two one-year extensions at the General Partner&apos;s discretion with LP Advisory Committee consultation. Investment period: 5 years; recycling permitted up to 120% of commitments.</BodyText>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 8 }}>Fees &amp; Waterfall</div>
        <BodyText>Management fee: 2.0% per annum on commitments during the investment period, stepping down 0.25% per year to a 1.25% floor on unreturned invested capital thereafter. Carried interest: tiered, with thresholds at 3x and 5x return; European-style waterfall. No preferred return hurdle (consistent with VC market). 100% management fee offset on monitoring, transaction, and break-up fees received by the Adviser from portfolio companies.</BodyText>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 8 }}>Investment Strategy</div>
        <BodyText>Pre-seed and seed stage venture capital with selective Series A participation, across consumer, entertainment, AI infrastructure, and emerging technology sectors. The Fund leverages Aurora&apos;s network across entertainment industry founders and operators as a sourcing differentiator.</BodyText>
        <div style={{ marginTop: 20, padding: "14px 18px", borderRadius: 8, background: "#d1fae5", border: "1px solid #bbf7d0" }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: "#059669", textTransform: "uppercase" as const, letterSpacing: "0.1em", marginBottom: 6 }}>Chapter Summary — GREEN</div>
          <div style={{ fontSize: 12, lineHeight: 1.7, color: "#334155" }}>Green rating. Fund terms are consistent with VC market norms. 2.0% management fee with step-down is in line with peers. 100% fee offset and European waterfall favor LPs. Monitoring item (LOW): single-signatory bank account opening procedure; encourage two-signatory contractual requirement.</div>
        </div>
      </div>
    ),
  },
  {
    id: "ch5", group: "Chapters", title: "Ch 5 — Service Providers",
    render: () => (
      <div>
        <SectionHeader title="Chapter 5 — Service Providers, Delegation & Oversight" page="24–25" rating="GREEN" />
        <div style={{ overflowX: "auto" as const, marginBottom: 16 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" as const, fontSize: 11 }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                {["Provider", "Function", "Entity", "Status", "Tenure"].map((h) => (
                  <th key={h} style={{ padding: "8px 12px", textAlign: "left" as const, fontSize: 9, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase" as const, letterSpacing: "0.1em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["Meridian Fund Services, LLC", "Administrator", "Aurora Ventures IV, L.P.", "Engaged", "Per Admin Agreement Aug 31, 2025"],
                ["Grant Baker LLP", "Auditor (expected)", "Aurora Ventures IV, L.P.", "Pending", "Fund IV engagement letter not yet signed"],
                ["Brennan Kincaid LLP", "Legal Counsel", "Aurora Ventures IV, L.P.", "Engaged", "Ongoing"],
                ["Vantage Tech Partners", "IT Services", "Aurora Capital Management", "Engaged", "Engagement letter January 2026"],
                ["Apex Compliance Advisors", "Compliance Consultant", "Aurora Capital Management", "Engaged", "Since Q3 2025"],
                ["InsightSphere", "Expert Network", "Aurora Capital Management", "Engaged", "Controls deficient — see Ch 2"],
              ].map(([provider, fn, entity, status, tenure], i) => (
                <tr key={provider as string} style={{ borderBottom: "1px solid #f1f5f9", background: i % 2 === 0 ? "#fff" : "#fafbfc" }}>
                  <td style={{ padding: "8px 12px", fontWeight: 600, color: "#1e293b" }}>{provider}</td>
                  <td style={{ padding: "8px 12px", color: "#334155" }}>{fn}</td>
                  <td style={{ padding: "8px 12px", color: "#64748b", fontSize: 10 }}>{entity}</td>
                  <td style={{ padding: "8px 12px", color: status === "Pending" ? "#D97706" : "#059669", fontWeight: 600 }}>{status}</td>
                  <td style={{ padding: "8px 12px", color: "#64748b", fontSize: 10 }}>{tenure}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <BodyText>Meridian Fund Services was engaged pursuant to the Administration Agreement dated August 31, 2025. Verified via direct call with Dana Blackwell (Senior Director, Fund Administration) on April 9, 2026. Meridian uses LedgerCraft Enterprise and Polaris for fund accounting and partnership capital recordkeeping. Meridian initiates outbound wires and requires original invoices to validate cash movements; verification callbacks are required for new or changed payment instructions.</BodyText>
        <div style={{ marginTop: 20, padding: "14px 18px", borderRadius: 8, background: "#d1fae5", border: "1px solid #bbf7d0" }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: "#059669", textTransform: "uppercase" as const, letterSpacing: "0.1em", marginBottom: 6 }}>Chapter Summary — GREEN</div>
          <div style={{ fontSize: 12, lineHeight: 1.7, color: "#334155" }}>Green rating. Institutional service provider infrastructure with Meridian as administrator and Grant Baker LLP as expected auditor. Engagement verified directly with Meridian. Monitoring item: Grant Baker Fund IV engagement letter to be executed before FY2026 audit.</div>
        </div>
      </div>
    ),
  },
  {
    id: "ch6", group: "Chapters", title: "Ch 6 — Investment Operations",
    render: () => (
      <div>
        <SectionHeader title="Chapter 6 — Investment Operations & Portfolio Controls" page="26–28" rating="GREEN" />
        <div style={{ fontSize: 10, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 8 }}>Investment Committee</div>
        <BodyText>Aurora&apos;s Investment Committee consists of Marcus Reeves, Daniel Brenner, and Rebecca Stern (voting members). Elena Ruiz (Operating Partner) and Austin Knight (Principal) participate in a non-voting capacity. Investment Committee approval requires only one of three voting members. Alpine notes this threshold is unusual; majority (2 of 3) or unanimous consent would be more typical. The veto right has not been exercised in practice.</BodyText>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 8 }}>Cash Controls</div>
        <BodyText>All outbound wires require dual approval and release by Kevin Park (VP Finance) and Rebecca Stern (GP). Meridian initiates wires and requires original invoices to validate cash movements. Verification callbacks are required for new or changed payment instructions. Meridian does not have signing authority over the Fund&apos;s operating account used for investor capital activity and non-investment expenses; Aurora controls all transfers. Alpine recommends transferring operating account control to Meridian to strengthen segregation of duties.</BodyText>
        <div style={{ marginTop: 20, padding: "14px 18px", borderRadius: 8, background: "#d1fae5", border: "1px solid #bbf7d0" }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: "#059669", textTransform: "uppercase" as const, letterSpacing: "0.1em", marginBottom: 6 }}>Chapter Summary — GREEN</div>
          <div style={{ fontSize: 12, lineHeight: 1.7, color: "#334155" }}>Green rating. Strong dual-approval wire process with Administrator initiation and original-invoice validation. Monitoring items: (1) amend IC threshold from one of three to majority consent; (2) transfer operating account control to Meridian.</div>
        </div>
      </div>
    ),
  },
  {
    id: "ch7", group: "Chapters", title: "Ch 7 — Valuation & Reporting",
    render: () => (
      <div>
        <SectionHeader title="Chapter 7 — Valuation, Asset Existence & Investor Reporting" page="29–31" rating="GREEN" />
        <div style={{ fontSize: 10, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 8 }}>Valuation Policy &amp; Process</div>
        <BodyText>Aurora prepares quarterly fair-value estimates for portfolio investments in accordance with ASC 820 and ILPA reporting guidelines. The Valuation Committee consists of Rebecca Stern (GP), Kevin Park (VP Finance), Austin Knight (Principal), and Elena Ruiz (Operating Partner). The committee meets quarterly within 5 business days of quarter-end.</BodyText>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 8 }}>External Valuation Agent</div>
        <BodyText>Aurora has not appointed a third-party valuation agent. All portfolio valuations are prepared internally; Meridian accepts manager-prepared valuations at quarter-end without independent verification procedures. The annual audit (by Grant Baker LLP, expected) provides the only external pricing check. Alpine strongly recommends appointment of an external valuation agent before Fund IV final close.</BodyText>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 8 }}>Asset Existence Controls</div>
        <BodyText>Multi-party verification architecture involving Aurora, Meridian, the expected auditor, and Carta (cap table). For each portfolio investment, share certificates / convertible note documentation are obtained directly from Carta. Meridian receives all investment documents and wire instructions from Aurora and independently verifies wire details with portfolio companies prior to initiating wires.</BodyText>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 8 }}>Carry Calculation</div>
        <BodyText>Carried interest waterfall calculations are maintained by Meridian in Excel, approved by Kevin Park. Alpine recommends migration to a purpose-built waterfall system to reduce error risk as Fund IV scales.</BodyText>
        <div style={{ marginTop: 20, padding: "14px 18px", borderRadius: 8, background: "#d1fae5", border: "1px solid #bbf7d0" }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: "#059669", textTransform: "uppercase" as const, letterSpacing: "0.1em", marginBottom: 6 }}>Chapter Summary — GREEN</div>
          <div style={{ fontSize: 12, lineHeight: 1.7, color: "#334155" }}>Green rating. Multi-party asset existence architecture (Meridian, Carta, expected auditor) is appropriate. Required-before-close: appointment of third-party valuation agent. Monitoring items: reconstitute valuation committee with majority non-investment professionals; migrate waterfall from Excel.</div>
        </div>
      </div>
    ),
  },
  {
    id: "ch8", group: "Chapters", title: "Ch 8 — Manager Transparency",
    render: () => (
      <div>
        <SectionHeader title="Chapter 8 — Manager Transparency & LP Communications" page="32" rating="GREEN" />
        <BodyText>Aurora provides quarterly investor letters and annual audited financials via Meridian. K-1 tax documents are distributed within statutory deadlines. ILPA-aligned quarterly reporting templates have been adopted. Aurora&apos;s management proactively disclosed all operational gaps — including the absence of a dedicated CCO, the Mythic / LunarPay matter, the cashless GP commitment mechanism, and limitations in expert network controls — without prompting during the diligence process. This level of candor is constructive and reflects well on management culture.</BodyText>
        <div style={{ marginTop: 20, padding: "14px 18px", borderRadius: 8, background: "#d1fae5", border: "1px solid #bbf7d0" }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: "#059669", textTransform: "uppercase" as const, letterSpacing: "0.1em", marginBottom: 6 }}>Chapter Summary — GREEN</div>
          <div style={{ fontSize: 12, lineHeight: 1.7, color: "#334155" }}>Green rating. ILPA-aligned reporting, proactive disclosure of operational limitations, and constructive engagement throughout the diligence process.</div>
        </div>
      </div>
    ),
  },
  {
    id: "refdata", group: null, title: "Reference Data",
    render: () => null,
  },
] as const;

const FINAL_REPORT_SECTIONS = [
  {
    id: "cover", group: null, title: "Cover Page",
    render: () => (
      <div style={{ background: "#ffffff", padding: "40px 48px 40px" }}>
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", color: "#7c3aed", textTransform: "uppercase" as const, marginBottom: 20 }}>Alpine Due Diligence Inc.</div>
        <div style={{ fontSize: 30, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em", lineHeight: 1.15 }}>ODD Report</div>
        <div style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", letterSpacing: "0.1em", marginTop: 6, marginBottom: 20 }}>CONFIDENTIAL</div>
        <div style={{ fontSize: 20, color: "#0f172a", fontWeight: 700, marginBottom: 4 }}>Trellis Capital IV, L.P.</div>
        <div style={{ fontSize: 13, color: "#475569", marginBottom: 28 }}>Pre-seed Venture Capital | Delaware LP | Full Review</div>
        <div style={{ display: "flex", gap: 32, flexWrap: "wrap" as const, fontSize: 11, borderTop: "1px solid #f1f5f9", paddingTop: 20 }}>
          {[["Review Date", "April 2026"], ["Review Type", "Initial (Pre-Launch)"], ["Strategy", "Pre-seed Venture Capital"], ["Domicile", "Delaware LP"]].map(([label, val]) => (
            <div key={label}>
              <div style={{ fontSize: 9, color: "#94a3b8", letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: 3, fontWeight: 600 }}>{label}</div>
              <div style={{ color: "#334155", fontWeight: 600, fontSize: 12 }}>{val}</div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "toc", group: null, title: "Table of Contents",
    render: () => (
      <div>
        <SectionHeader title="Table of Contents" page="3" />
        <div style={{ fontFamily: "Georgia, serif" }}>
          {[
            { section: "—", title: "Overview", page: "4", rating: undefined },
            { section: "—", title: "Assessment", page: "5", rating: undefined },
            { section: "—", title: "Scope & Verification", page: "7", rating: undefined },
            { section: "—", title: "Alpine Ratings", page: "8", rating: undefined },
            { section: "—", title: "Alpine Flags", page: "9", rating: undefined },
            { section: "—", title: "Remediation & Monitoring", page: "11", rating: undefined },
            { section: "Ch 1", title: "Manager, Ownership & Governance", page: "13", rating: "YELLOW" },
            { section: "Ch 2", title: "Legal, Regulatory & Compliance", page: "16", rating: "RED" },
            { section: "Ch 3", title: "Technology, Cybersecurity & Business Resilience", page: "19", rating: "RED" },
            { section: "Ch 4", title: "Fund Structure, Terms & Investor Alignment", page: "21", rating: "GREEN" },
            { section: "Ch 5", title: "Service Providers, Delegation & Oversight", page: "24", rating: "GREEN" },
            { section: "Ch 6", title: "Investment Operations & Portfolio Controls", page: "26", rating: "YELLOW" },
            { section: "Ch 7", title: "Valuation, Asset Existence & Investor Reporting", page: "29", rating: "YELLOW" },
            { section: "Ch 8", title: "Manager Transparency & LP Communications", page: "32", rating: "GREEN" },
            { section: "—", title: "Reference Data", page: "33", rating: undefined },
          ].map((item) => {
            const rc = item.rating === "GREEN" ? "#059669" : item.rating === "YELLOW" ? "#D97706" : item.rating === "RED" ? "#DC2626" : undefined;
            const rb = item.rating === "GREEN" ? "#d1fae5" : item.rating === "YELLOW" ? "#fef3c7" : item.rating === "RED" ? "#fee2e2" : undefined;
            return (
              <div key={item.section + item.title} style={{ marginBottom: 8, display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ fontSize: 10, fontWeight: 600, color: "#7c3aed", width: 32, flexShrink: 0 }}>{item.section}</span>
                <span style={{ flex: 1, fontSize: 13, color: "#1e293b" }}>{item.title}</span>
                {item.rating && <span style={{ fontSize: 9, fontWeight: 700, padding: "1px 6px", borderRadius: 3, background: rb, color: rc, flexShrink: 0 }}>{item.rating}</span>}
                <span style={{ fontSize: 11, color: "#94a3b8", flexShrink: 0, minWidth: 20, textAlign: "right" }}>{item.page}</span>
              </div>
            );
          })}
        </div>
      </div>
    ),
  },
  {
    id: "overview", group: null, title: "Overview & Assessment",
    render: () => (
      <div>
        <SectionHeader title="Overview" page="4" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 8 }}>Manager Overview</div>
            <BodyText>Trellis Capital Management, LLC (&quot;Trellis&quot;, the &quot;Manager&quot;) is a pre-seed stage venture capital firm that had net assets of $280.3 million as of December 31, 2025, plus $113.7 million in uncalled capital. Trellis is headquartered in San Francisco and has seven staff.</BodyText>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 8, marginTop: 12 }}>Fund Overview</div>
            <BodyText>Trellis Capital IV, L.P. (the &quot;Fund&quot;) is a Delaware limited partnership formed on March 28, 2026. The Fund is a pre-seed stage venture capital fund that will invest in technology companies under a closed-ended structure.</BodyText>
            <BodyText>The Fund held its initial closing on April 1, 2026 with ~$125 million in commitments. The target raise is $175 million and there is a $200 million hard cap. The final closing is expected to be held in the next 1-2 months.</BodyText>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 8, marginTop: 12 }}>Controls Overview</div>
            <BodyText>Apex Fund Services, LLC (&quot;Apex&quot;) is expected to be engaged to provide administration services to the Fund. The Fund&apos;s auditor is expected to be Baker, Thompson &amp; Co. LLP (&quot;Baker Thompson&quot;) and the Fund is expected to maintain a banking relationship with Pacific Commerce Bank (&quot;Pacific Commerce&quot;).</BodyText>
            <BodyText>Trellis uses a custom-built Retool dashboard for tracking the deal pipeline and an Excel dashboard for tracking key financial metrics. Apex will maintain the official accounting books and records using Xero.</BodyText>
            <BodyText>As a closed-ended fund, valuations will be produced quarterly for indicative purposes, with no capital transactions after the fundraising period. The General Partner will receive carried interest only upon a realization event.</BodyText>
          </div>
          <div>
            <FindingBox type="strength" title="Strengths">
              <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.8, listStyleType: "disc", listStylePosition: "outside" }}>
                <li style={{ marginBottom: 4 }}>Apex is expected to be engaged to provide administration services to the Fund.</li>
                <li style={{ marginBottom: 4 }}>Appropriate cash controls with dual-authorization wire process.</li>
                <li style={{ marginBottom: 4 }}>Multi-party asset verification architecture involving administrator, auditor, and Carta.</li>
              </ul>
            </FindingBox>
            <FindingBox type="concern" title="Risks">
              <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.8, listStyleType: "disc", listStylePosition: "outside" }}>
                <li style={{ marginBottom: 4 }}>Limited internal staffing resources with resultant segregation of duties concerns.</li>
                <li style={{ marginBottom: 4 }}>IT / cybersecurity environment is currently underdeveloped, including a lack of formal policy documents and training program.</li>
                <li style={{ marginBottom: 4 }}>Investment professional is responsible for compliance oversight. Compliance controls could be improved with respect to policy attestations, training, and consultant usage.</li>
                <li style={{ marginBottom: 4 }}>No formal valuation committee.</li>
                <li style={{ marginBottom: 4 }}>No back office oversight of the accounting work performed by the Administrator.</li>
                <li style={{ marginBottom: 4 }}>No current plans for the Fund to have an LPAC.</li>
              </ul>
            </FindingBox>
          </div>
        </div>

        <div style={{ borderTop: "2px solid #f1f5f9", paddingTop: 24, marginTop: 8 }}>
          <SectionHeader title="Assessment" page="5–6" />
          <BodyText>
            Trellis is a pre-seed stage venture capital firm founded in 2018 by Arjun Mehta (Co-Founder, Managing Partner) and Priya Sharma (Co-Founder, Managing Partner). Trellis reported net assets of $280.3 million as of December 31, 2025, plus $113.7 million in uncalled capital out of $274 million in total commitments to the firm&apos;s first three funds. The firm also manages several co-investment SPVs with $24.7 million in total assets as of the same date.
          </BodyText>
          <BodyText>
            The firm is currently raising capital for the Fund, which has a $175 million target and a $200 million hard cap. The initial closing was held on April 1, 2026 with ~$125 million in commitments and the final closing is expected to be held in the next 1-2 months. The prior fund, Fund III, is a 2024 vintage that raised $150 million, representing a marked increase from Fund II, a 2021 vintage that raised $78 million. Fund I is a $47 million 2018 vintage. Fund III was 64% deployed / reserved as of December 31, 2025 and thus the Manager does not expect to begin investing from the Fund until late 2026 when it finishes investing from Fund III.
          </BodyText>
          <BodyText>
            As our primary observation, we highlight that Trellis is a small organization, consisting of seven full-time staff, with resultant segregation of duties issues. The single non-investment professional is Sarah Collins (Head of Operations), whose responsibilities focus on running business operations and acting as an executive assistant for the Managing Partners, meaning that the funds operate without the oversight of an internal back office resource. From a practical standpoint, finance and accounting matters are handled by the third-party fund administrator, Apex, subject to oversight from the Managing Partners. Trellis has, however, recently retained the services of Raj Patel, an individual who provides fractional CFO / COO services to venture capital and private equity funds. The Manager communicated that Raj will focus on overseeing the work performed by Apex; however, we understand that he will not dedicate substantial time to the firm until Summer 2026. Raj is expected to serve in this capacity part-time until the hire of a full-time Head of Finance planned for 2027. Investors are recommended to monitor developments in this area.
          </BodyText>
          <BodyText>
            Separately, we highlight that the firm&apos;s IT and cybersecurity environment is substantially underdeveloped at present, with a lack of formal policy documents and employee training program. In partial mitigation, the Manager stated that the Head of Operations is currently leading a search for a third-party cybersecurity vendor that will be tasked with conducting a formal cybersecurity audit, vulnerability test, creating a formal cybersecurity policy, and implementing a cybersecurity training program (inclusive of a phishing campaign) by the end of 2026: investors are recommended to monitor developments in this area. We would also suggest the creation of a written BCP, which should include details on how the firm and critical service providers are prepared for unexpected events, provisions for loss / unavailability of any key service providers, procedures to protect staff during a crisis, and handling of communications with key stakeholders.
          </BodyText>
          <BodyText>
            The firm is exempt from SEC registration under the venture capital adviser exemption and accordingly files as an Exempt Reporting Adviser (&quot;ERA&quot;). While the firm&apos;s compliance policies and procedures are aligned with the regulatory requirements of its ERA status, we highlight that Priya Sharma (Co-Founder, Managing Partner) is responsible for compliance oversight in addition to his investment role. We are strongly opposed to an investment professional being responsible for compliance and would prefer to see this responsibility reside with a non-investment professional, such as the Head of Operations. We would also suggest the implementation of a process for staff to attest to the firm&apos;s compliance policies upon hire and annually thereafter, as well as the implementation of an annual compliance training program. To assist in enhancing the compliance program and &quot;culture&quot; of compliance, the firm should consider engaging a reputable compliance consultant under a broader remit.
          </BodyText>
          <BodyText>
            We also highlight that the firm does not track individual cash transactions and aggregate cash balances of the funds, and instead relies solely on Apex to maintain and reconcile accounting books and records. Moreover, we highlight that, to date, there has been no back office oversight of the Administrator&apos;s accounting work, although this is expected to be remedied through the appointment of Raj Patel as a part-time CFO and the planned hire of a full-time Head of Finance next year.
          </BodyText>
          <BodyText>
            Although the Fund&apos;s LPA contains a provision indicating that the Fund shall have an investor advisory board (commonly known as an LPAC), the Manager stated that an LPAC will only be formed, in practice, if requested by multiple of the Fund&apos;s larger investors. We note that LPACs have also not been established for the prior funds. We would welcome the creation of an LPAC, which would introduce a degree of independence to the Fund&apos;s governance.
          </BodyText>
          <BodyText>
            Our review identified that appropriate cash controls have been implemented, with all cash movements from Pacific Commerce effected using the bank&apos;s online banking platform, which requires Apex to initiate wires and one of the firm&apos;s Managing Partners to release.
          </BodyText>
          <BodyText>
            From an asset existence perspective, multiple parties are involved in each transaction, meaning that any attempt to create a fictitious investment would require collusion amongst various employees and external parties. The Manager represented that as part of the annual audits, Baker Thompson issues audit confirmations to a sample of underlying portfolio companies (noted to be roughly half of the 140 portfolio companies for FY2025). On its side, Apex confirmed that it receives all investment documents and wire instructions from the firm, excluding share certificates issued via Carta which are obtained directly from the Carta platform. Apex does, however, independently verify wire details with portfolio companies prior to initiating wires.
          </BodyText>
          <BodyText>
            The firm values its portfolio companies at cost and marks investments up / down based on the price of a subsequent financing round in which a significant new investor has participated. Looking forward, we would strongly prefer to see the incorporation of the part-time CFO and, once hired, the full-time Head of Finance in the valuation process in order to provide a degree of back office oversight.
          </BodyText>
          <BodyText>
            We also highlight that the firm does not have a formal valuation committee, which would be the suitable forum for reviewing and approving quarterly valuations. As the firm grows, we would prefer for the committee to be represented by a majority of non-investment professionals.
          </BodyText>
          <BodyText>
            Overall, based on the firm&apos;s current lack of back office function, its cybersecurity environment, and an investment professional being responsible for compliance, we are providing a Yellow overall rating. We would be amenable to providing a Green rating once the back office and cybersecurity enhancements as described above are fully implemented later this year. Investors should monitor developments in this area and, considering the Fund&apos;s final closing is expected to occur in the next 1-2 months, we would suggest that investors either (a) require the firm to commit to these enhancements in writing via a side letter or otherwise, or (b) push the firm to accelerate the timeline for these enhancements prior to investing.
          </BodyText>
          <div style={{ padding: "12px 16px", background: "#fef9f0", border: "1px solid #fde68a", borderRadius: 8, fontSize: 11, color: "#92400e", lineHeight: 1.6 }}>
            <strong>Pre-Launch Note:</strong> Our assessment is based on the Manager&apos;s assertions at the time of this review considering the Fund has not formally commenced operations and service providers for the Fund have not yet been formally engaged (though they remain consistent with the prior funds). Any changes in these areas might affect our rating.
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "ratings", group: null, title: "Ratings & Flags",
    // Rendered via <RatingsAndFlagsSection flags={liveFlags} /> in FinalReport so the
    // flag list and per-chapter counts stay in sync with the Flag tab edits.
    render: () => null,
  },
  {
    id: "ch1", group: "Chapters", title: "Ch 1 — Manager & Governance",
    render: () => (
      <div>
        <SectionHeader title="Chapter 1 — Manager, Ownership & Governance" page="13–15" rating="YELLOW" />
        <div style={{ fontSize: 10, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 8 }}>Management Company and Affiliates</div>
        <BodyText>
          Trellis Capital Management, LLC (&quot;Trellis&quot;, the &quot;Manager&quot;) is a pre-seed stage venture capital firm headquartered in San Francisco. Trellis was founded in 2018 by Arjun Mehta (Co-Founder, Managing Partner) and Priya Sharma (Co-Founder, Managing Partner). Prior to founding the firm, Arjun was a principal at Founder Collective, a Boston area seed-stage venture firm, while Priya was a partner at Foundation Capital, a venture firm based in Silicon Valley.
        </BodyText>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 8 }}>Assets under Management</div>
        <BodyText>
          Trellis reported net assets of $280.3 million as of December 31, 2025, plus $113.7 million in uncalled capital out of $274 million in total commitments to the firm&apos;s first three funds. The firm also manages several co-investment special purpose vehicles (&quot;SPVs&quot;) with total assets of $24.7 million as of the same date.
        </BodyText>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 16 }}>
          {[
            ["Fund I", "2018", "$47 million", "Fully deployed"],
            ["Fund II", "2021", "$78 million", "Fully deployed"],
            ["Fund III", "2024", "$150 million", "64% deployed / reserved"],
            ["Fund IV", "2026", "~$125M (initial close)", "Pre-deployment"],
          ].map(([f, v, c, s]) => (
            <div key={f} style={{ padding: "10px 12px", background: "#f8fafc", borderRadius: 8, border: "1px solid #e2e8f0" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#7c3aed", marginBottom: 2 }}>{f}</div>
              <div style={{ fontSize: 11, color: "#334155" }}>{c}</div>
              <div style={{ fontSize: 9, color: "#64748b" }}>{v} vintage · {s}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 8 }}>Insider Investment</div>
        <BodyText>
          GP commitments to Funds I-III were 1% of total commitments (~$2.8 million), contributed in cash and invested pari passu with LP commitments, free of management fees.
        </BodyText>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 8 }}>Ownership &amp; Succession</div>
        <BodyText>
          Arjun Mehta and Priya Sharma each own 50% of the firm (confirmed via Form ADV Schedules A &amp; B). No formal succession plan, though the Managing Partners could assume each other&apos;s responsibilities in a key person event. The key person provision (per Fund IV&apos;s LPA) would only be automatically triggered if both Managing Partners fail to provide sufficient time and attention. Key person life insurance is not maintained.
        </BodyText>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 8 }}>Human Resources</div>
        <BodyText>
          With a total headcount of seven full-time employees, consisting of six investment professionals and Sarah Collins (Head of Operations), Trellis is a small organization with resultant limitations to segregation of duties. Sarah&apos;s responsibilities focus on running business operations and acting as an executive assistant for the Managing Partners, rather than serving as a back office resource for the funds.
        </BodyText>
        <div style={{ overflowX: "auto" as const, marginBottom: 16 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" as const, fontSize: 11 }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                {["Name", "Title", "Function"].map((h) => (
                  <th key={h} style={{ padding: "8px 12px", textAlign: "left" as const, fontSize: 9, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase" as const, letterSpacing: "0.1em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["Arjun Mehta", "Co-Founder, Managing Partner", "Investment"],
                ["Priya Sharma", "Co-Founder, Managing Partner", "Investment"],
                ["Kevin Chen", "Principal", "Investment (joined Q2 2025)"],
                ["Rachel Winters", "Associate", "Investment"],
                ["Ryan Mitchell", "Analyst", "Investment"],
                ["Vikram Nair", "Chief Product Officer", "Investment (departure planned Summer 2026)"],
                ["Sarah Collins", "Head of Operations", "Operations / EA (joined July 2025)"],
              ].map(([name, title, fn], i) => (
                <tr key={name} style={{ borderBottom: "1px solid #f1f5f9", background: i % 2 === 0 ? "#fff" : "#fafbfc" }}>
                  <td style={{ padding: "8px 12px", fontWeight: 600, color: "#1e293b" }}>{name}</td>
                  <td style={{ padding: "8px 12px", color: "#334155" }}>{title}</td>
                  <td style={{ padding: "8px 12px", color: "#64748b" }}>{fn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <BodyText>
          The firm has recently retained Raj Patel as fractional CFO (former CFO of Atomic, a Miami-based venture studio). Raj will focus on overseeing Apex, though he will not dedicate substantial time until Summer 2026. A full-time Head of Finance is planned for 2027. James Crawford, an independent attorney and former partner at Hartwell &amp; Sterling, is retained on an ad hoc basis for deal-related legal matters.
        </BodyText>
        <BodyText>
          Regarding staff turnover: Omar Hassan (Associate) departed in August 2025 to pursue personal business endeavors, while Emily Brooks (Head of Operations) departed in December 2024 to move into an investment-focused role. Both departures were amicable. Sarah Collins was hired in July 2025 to replace Emily.
        </BodyText>
        <BodyText>
          Sanjay Gupta, a part-time venture partner, departed near end of 2024 to start his own venture firm.
        </BodyText>
        <BodyText>
          Kevin Chen joined as a principal in Q2 2025. Vikram Nair, who began as a part-time venture partner in early 2024, was brought on full-time as Chief Product Officer but is planning to leave this summer to start his own company. A talent recruiter has been hired to identify replacement candidates.
        </BodyText>
        <BodyText>
          Employee background checks have been completed by the Managing Partners on an internal basis. The firm has not engaged a third-party background check provider, though a search for one is currently underway based on investor feedback. Staff are compensated with a base salary and discretionary bonus, and all investment staff participate in carried interest vesting over four years.
        </BodyText>
        <div style={{ marginTop: 20, padding: "14px 18px", borderRadius: 8, background: "#fef3c7", border: "1px solid #fde68a" }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: "#D97706", textTransform: "uppercase" as const, letterSpacing: "0.1em", marginBottom: 6 }}>Chapter Summary — YELLOW</div>
          <div style={{ fontSize: 12, lineHeight: 1.7, color: "#334155" }}>Yellow rating driven by: (1) seven full-time staff with a single operations professional whose role is primarily executive assistant rather than back office, and (2) the funds operating without internal back office oversight of the Administrator. Partially mitigated by the engagement of a fractional CFO and planned hire of a Head of Finance in 2027.</div>
        </div>
      </div>
    ),
  },
  {
    id: "ch2", group: "Chapters", title: "Ch 2 — Legal, Regulatory & Compliance",
    render: () => (
      <div>
        <SectionHeader title="Chapter 2 — Legal, Regulatory & Compliance" page="16–18" rating="RED" />
        <div style={{ fontSize: 10, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 8 }}>Regulatory Oversight</div>
        <BodyText>
          The firm is exempt from registration with the SEC under the venture capital adviser exemption and has filed as an Exempt Reporting Adviser (&quot;ERA&quot;) since March 9, 2019. Although not subject to the same regulatory requirements imposed on registered advisers, ERAs are required to complete certain sections of the Form ADV, implement written MNPI policies, and are subject to anti-fraud and &quot;pay-to-play&quot; provisions.
        </BodyText>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 8 }}>Compliance Infrastructure and Policies</div>
        <BodyText>
          Priya Sharma (Co-Founder, Managing Partner) is responsible for compliance oversight in addition to his investment responsibilities. We are strongly opposed to an investment professional holding this responsibility and would prefer to see it reside with a non-investment professional such as Sarah Collins (Head of Operations).
        </BodyText>
        <BodyText>
          Compliance consultant usage has been limited to engaging Summit Advisory for annual Form ADV preparation. A broader compliance consultant engagement would strengthen the firm&apos;s compliance program. The firm maintains a compliance binder with the required ERA policies (pay-to-play, insider trading, AML). However, there is no initial attestation or annual recertification of compliance policies required from staff, and no annual compliance training program has been implemented.
        </BodyText>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 8 }}>Personal Trading</div>
        <BodyText>
          Although the firm has an insider trading policy, the firm does not have a written personal trading policy as this is not a requirement of SEC ERAs. While concerns in this area are limited considering the scope of the firm&apos;s investment activities, we would prefer to see a baseline policy in place, in line with broader industry best practices.
        </BodyText>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 8 }}>Expert Networks</div>
        <BodyText>The firm does not utilize expert networks.</BodyText>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 8 }}>Anti-Money Laundering / Know Your Customer</div>
        <BodyText>The Manager represented that investor AML verifications are completed by Apex.</BodyText>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 8 }}>Trade Errors</div>
        <BodyText>Due to the nature of the firm&apos;s investment activities, trade errors are not anticipated.</BodyText>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 8 }}>Soft Dollars</div>
        <BodyText>The firm does not utilize soft dollars.</BodyText>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 8 }}>Claims, Actions, and Conflicts</div>
        <BodyText>
          The firm represented that neither the management company, its affiliates, nor any employees have been subject to any action, claim, investigation, or litigation in the past ten years. Professional liability insurance provides up to $1 million in coverage. The firm&apos;s Managing Partners serve on boards of portfolio companies, with any directors&apos; fees waived.
        </BodyText>
        <div style={{ marginTop: 20, padding: "14px 18px", borderRadius: 8, background: "#fee2e2", border: "1px solid #fca5a5" }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: "#DC2626", textTransform: "uppercase" as const, letterSpacing: "0.1em", marginBottom: 6 }}>Chapter Summary — RED</div>
          <div style={{ fontSize: 12, lineHeight: 1.7, color: "#334155" }}>Red rating based on the cumulative weight of compliance deficiencies: (1) investment professional responsible for compliance, (2) no compliance attestation or recertification process, (3) no annual compliance training program, and (4) limited compliance consultant engagement. While the firm&apos;s policies meet ERA minimum requirements, the compliance environment falls below institutional standards.</div>
        </div>
      </div>
    ),
  },
  {
    id: "ch3", group: "Chapters", title: "Ch 3 — Technology & Cybersecurity",
    render: () => (
      <div>
        <SectionHeader title="Chapter 3 — Technology, Cybersecurity & Business Resilience" page="19–20" rating="RED" />
        <div style={{ fontSize: 10, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 8 }}>IT Overview</div>
        <BodyText>
          There is no single individual in charge of IT and the firm has not appointed a technology or cybersecurity consultant. Sarah Collins (Head of Operations) is leading a search for a third-party cybersecurity vendor to conduct a formal audit, vulnerability test, and implement a training program by end of 2026. The firm relies on cloud-based applications with no onsite infrastructure beyond internet connection.
        </BodyText>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 8 }}>Cybersecurity Controls</div>
        <BodyText>
          The firm has not created a formal cybersecurity policy or incident response plan. No third-party cybersecurity framework (e.g. NIST, ISO/IEC 27000) has been adopted. No employee cybersecurity awareness training or phishing campaign has been implemented. The firm has not implemented endpoint data loss prevention, and staff maintain access to removable media (USB), personal email, and personal cloud storage on company-issued endpoints. Penetration testing has not been completed.
        </BodyText>
        <BodyText>
          Controls in place: Baseline network security (firewall, anti-virus), user access controls on a need-to-know and least-privilege basis, password-protected accounts (though periodic password changes are not enforced), and MFA on key business applications.
        </BodyText>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 8 }}>Business Continuity</div>
        <BodyText>
          The firm does not have a written business continuity plan. Staff maintain the ability to work remotely. The firm should prepare a BCP covering service provider contingency, staff protection during a crisis, and stakeholder communications.
        </BodyText>
        <div style={{ marginTop: 20, padding: "14px 18px", borderRadius: 8, background: "#fee2e2", border: "1px solid #fca5a5" }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: "#DC2626", textTransform: "uppercase" as const, letterSpacing: "0.1em", marginBottom: 6 }}>Chapter Summary — RED</div>
          <div style={{ fontSize: 12, lineHeight: 1.7, color: "#334155" }}>Red rating. The cybersecurity environment is underdeveloped across multiple dimensions: no policy, no training, no incident response plan, no endpoint DLP, no penetration testing, and no BCP. The planned cybersecurity vendor engagement is a positive step, but the Red rating stands until formal policies and testing are implemented.</div>
        </div>
      </div>
    ),
  },
  {
    id: "ch4", group: "Chapters", title: "Ch 4 — Fund Structure & Terms",
    render: () => (
      <div>
        <SectionHeader title="Chapter 4 — Fund Structure, Terms & Investor Alignment" page="21–23" rating="GREEN" />
        <div style={{ fontSize: 10, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 8 }}>Legal Structure</div>
        <BodyText>
          Trellis Capital IV, L.P. is a Delaware limited partnership formed on March 28, 2026. Trellis Capital GP IV, LLC, a Delaware LLC, serves as the Fund&apos;s general partner. Both entities confirmed against the Delaware Division of Corporations register.
        </BodyText>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 8 }}>Key Terms</div>
        <BodyText>
          Interests in the Fund are offered in US Dollars and the minimum commitment is $1 million. The GP commitment is 1.01% of aggregate commitments, contributed in cash and invested pari passu with limited partners. The Fund held its first closing on April 1, 2026 with approximately $125 million in commitments against a hard cap of $200 million, and the final closing is expected within the next 1-2 months.
        </BodyText>
        <BodyText>
          The Fund&apos;s term is 10 years from the initial closing, subject to two one-year extensions at the GP&apos;s sole discretion, with any further extensions requiring LPAC consent (if formed) or a majority-in-interest of LPs. The commitment period is 5 years, and recycling of distributions is permitted up to 120% of aggregate commitments. The key person provision triggers if both Managing Partners fail to devote sufficient business time and attention to the Fund. The Fund does not contain a no-fault divorce provision permitting LPs to remove or replace the GP absent a &quot;cause&quot; event, though a no-fault dissolution provision exists. The LPA includes standard clawback mechanics to protect LPs against excess carried interest distributions.
        </BodyText>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 8 }}>Fee Structure</div>
        <BodyText>
          The Fund&apos;s management fee is set at 2.5% per annum on aggregate commitments through the fifth anniversary of commencement, stepping down to 1.5% per annum on aggregate commitments thereafter. The 2.5% rate is above the 2% standard observed in broader private markets, but is typical of pre-seed venture where smaller fund sizes require a higher fee load to sustain the investment team and operating infrastructure. A 100% management fee offset captures any directors&apos;, consulting, monitoring, transaction, or break-up fees received from portfolio companies, although the Manager represented that such fees are not received in practice.
        </BodyText>
        <BodyText>
          Distributions follow an American (deal-by-deal) waterfall: return of capital to LPs first, then 20% carried interest to the GP and 80% to LPs. There is no preferred return hurdle, which is uncommon in private equity but typical in pre-seed venture capital where meaningful hurdles would rarely trigger given the asset class return profile. The clawback provision serves as the principal backstop against over-distribution of carry.
        </BodyText>
        <BodyText>
          Organizational expenses are capped at $350,000, which is reasonable for a fund of this size. The Manager expects ongoing Fund expenses to center on management fees, legal and professional fees (audit, tax, administration), and organizational costs. The Fund III expense ratio for FYE December 31, 2025 was 12.23% on audited financial statements; investors should monitor the Fund IV expense ratio once audited accounts become available.
        </BodyText>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 8 }}>Corporate Governance</div>
        <BodyText>
          The Fund&apos;s LPA contains an LPAC provision, but the Manager stated an LPAC will only be formed if requested by multiple larger investors. LPACs have not been established for prior funds. We would welcome the creation of an LPAC.
        </BodyText>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 8 }}>Investment Strategy</div>
        <BodyText>
          Pre-seed stage VC investing in technology at $1-3M per investment, targeting 40-50 companies. Instruments include equity, SAFEs, KISS, warrants, and convertible equity. Concentration limits per LPA: 10% single company, 5% passive, 10% non-U.S./Canada. LPA permits up to 10% in digital assets (not utilized to date).
        </BodyText>
        <div style={{ marginTop: 20, padding: "14px 18px", borderRadius: 8, background: "#d1fae5", border: "1px solid #bbf7d0" }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: "#059669", textTransform: "uppercase" as const, letterSpacing: "0.1em", marginBottom: 6 }}>Chapter Summary — GREEN</div>
          <div style={{ fontSize: 12, lineHeight: 1.7, color: "#334155" }}>Green rating. Terms consistent with VC market norms. The 2.5% management fee, American waterfall, and absence of a preferred return are flagged but common in the VC space.</div>
        </div>
      </div>
    ),
  },
  {
    id: "ch5", group: "Chapters", title: "Ch 5 — Service Providers",
    render: () => (
      <div>
        <SectionHeader title="Chapter 5 — Service Providers, Delegation & Oversight" page="24–25" rating="GREEN" />
        <div style={{ overflowX: "auto" as const, marginBottom: 16 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" as const, fontSize: 11 }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                {["Provider", "Function", "Entity", "Status", "Tenure"].map((h) => (
                  <th key={h} style={{ padding: "8px 12px", textAlign: "left" as const, fontSize: 9, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase" as const, letterSpacing: "0.1em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["Administrator", "Fund accounting, reporting, cash mgmt, AML/KYC", "Apex Fund Services, LLC", "Expected", "Since Fund I"],
                ["Auditor", "Annual audit (U.S. GAAP)", "Baker, Thompson & Co. LLP", "Expected", "Since Fund I"],
                ["Corporate Banker", "Banking, cash custody", "Pacific Commerce Bank (JP Morgan)", "Continuation", "Since Fund II"],
                ["Legal Counsel", "Fund formation", "Morrison Cole Ashworth & Partners", "Historical", "—"],
                ["Compliance", "Annual Form ADV", "Summit Advisory", "Engaged (narrow)", "Current"],
                ["Deal Counsel", "Deal-related legal matters", "James Crawford (independent, ad hoc)", "Engaged", "—"],
              ].map(([provider, fn, entity, status, tenure], i) => (
                <tr key={provider} style={{ borderBottom: "1px solid #f1f5f9", background: i % 2 === 0 ? "#fff" : "#fafbfc" }}>
                  <td style={{ padding: "8px 12px", fontWeight: 600, color: "#7c3aed", fontSize: 10 }}>{provider}</td>
                  <td style={{ padding: "8px 12px", color: "#64748b", fontSize: 10 }}>{fn}</td>
                  <td style={{ padding: "8px 12px", color: "#1e293b", fontWeight: 500 }}>{entity}</td>
                  <td style={{ padding: "8px 12px", color: "#334155" }}>{status}</td>
                  <td style={{ padding: "8px 12px", color: "#64748b" }}>{tenure}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <BodyText>
          <strong>Administrator:</strong> Apex has been engaged since Fund I. Uses Xero for accounting and FundPanel for LP management/reporting. Apex is notably more &quot;hands-on&quot; with respect to valuation than typical PE/VC administrators, proactively updating the Schedule of Investments for known events and providing valuation guidance. Engagement letter for Fund IV expected before the first capital call.
        </BodyText>
        <BodyText>
          <strong>Auditor:</strong> Baker Thompson is a well-known and highly-regarded auditor of VC funds in the Bay Area. Not a Big 4 or next-tier firm, but deeply experienced in the VC space. Also audits the prior funds and certain co-invest SPVs.
        </BodyText>
        <BodyText>
          <strong>Corporate Banker:</strong> Pacific Commerce collapsed in Q2 2025 and was acquired by JP Morgan. A transition plan is underway. The firm will allow its accounts to transfer when JP Morgan implements the migration. No service disruption to date. Fund I utilizes Silicon Valley Bank (First Citizens Bank).
        </BodyText>
        <div style={{ marginTop: 20, padding: "14px 18px", borderRadius: 8, background: "#d1fae5", border: "1px solid #bbf7d0" }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: "#059669", textTransform: "uppercase" as const, letterSpacing: "0.1em", marginBottom: 6 }}>Chapter Summary — GREEN</div>
          <div style={{ fontSize: 12, lineHeight: 1.7, color: "#334155" }}>Green rating. The continuation of established provider relationships from prior funds provides comfort. Engagement letters are expected before the first capital call (administrator) and first year-end audit (auditor). The Pacific Commerce to JP Morgan banking transition should be monitored.</div>
        </div>
      </div>
    ),
  },
  {
    id: "ch6", group: "Chapters", title: "Ch 6 — Investment Operations",
    render: () => (
      <div>
        <SectionHeader title="Chapter 6 — Investment Operations & Portfolio Controls" page="26–28" rating="YELLOW" />
        <div style={{ fontSize: 10, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 8 }}>Portfolio Management Systems</div>
        <BodyText>
          The firm uses a custom-built Retool dashboard (&quot;People Flow&quot;) for tracking the deal pipeline and open opportunities, and an Excel dashboard for tracking key financial metrics across certain portfolio companies. The Manager expects the Fund will invest in roughly 40-50 companies.
        </BodyText>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 8 }}>Investment Decision Process</div>
        <BodyText>
          All new investments require approval from both Arjun Mehta and Priya Sharma. The Manager provided the following breakdown of deal sourcing channels for Fund III: Founder (32%), Angel/Advisor/Scout (26%), Alpha/Founders in Residence (26%), VC referral (10%), Outbound (6%). &quot;Alpha&quot; refers to the firm&apos;s pre-seed program to which founders can apply.
        </BodyText>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 8 }}>Investment Allocation</div>
        <BodyText>
          The firm does not have a formal written investment allocation policy separate from LPA disclosures. In practice, Fund III will be fully deployed before investing from Fund IV. Co-investments via SPVs are only offered when excess capacity exists. We recommend implementing a formal allocation policy should the firm launch a new strategy or family of funds.
        </BodyText>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 8 }}>Cash Tracking &amp; Accounting</div>
        <BodyText>
          The firm does not track individual cash transactions or aggregate cash balances, relying solely on Apex to maintain and reconcile the accounting books and records using Xero. There has been no back office oversight of the Administrator&apos;s accounting work to date, though this is expected to improve with the fractional CFO and planned Head of Finance.
        </BodyText>
        <BodyText>
          Apex maintains formal books using Xero: daily cash posting via direct feed from Pacific Commerce, at least weekly reconciliation (more frequent near capital call dates), monthly &quot;soft close,&quot; and quarterly &quot;full close&quot; producing balance sheet, schedule of investments, income statement, and statement of changes in partners&apos; capital.
        </BodyText>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 8 }}>Cash Controls</div>
        <BodyText>
          All cash movements from Pacific Commerce are effected using the bank&apos;s online banking platform, requiring one of two authorized Apex individuals to initiate wires and one Managing Partner to release. Apex completes a verification callback for new payment instructions or changes to existing instructions. Pacific Commerce also occasionally completes callbacks per its own internal policies. Operating expenses are paid via Bill.com, requiring Apex to initiate and a Managing Partner to approve. Both Managing Partners must sign on the opening of new bank accounts.
        </BodyText>
        <div style={{ marginTop: 20, padding: "14px 18px", borderRadius: 8, background: "#fef3c7", border: "1px solid #fde68a" }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: "#D97706", textTransform: "uppercase" as const, letterSpacing: "0.1em", marginBottom: 6 }}>Chapter Summary — YELLOW</div>
          <div style={{ fontSize: 12, lineHeight: 1.7, color: "#334155" }}>Yellow rating based on: (1) no internal accounting records or cash tracking by the Manager, (2) no back office oversight of the Administrator&apos;s accounting work, and (3) Excel-based portfolio management. Cash controls are appropriate with dual-authorization and verification callbacks.</div>
        </div>
      </div>
    ),
  },
  {
    id: "ch7", group: "Chapters", title: "Ch 7 — Valuation & Reporting",
    render: () => (
      <div>
        <SectionHeader title="Chapter 7 — Valuation, Asset Existence & Investor Reporting" page="29–31" rating="YELLOW" />
        <div style={{ fontSize: 10, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 8 }}>Valuation Controls</div>
        <BodyText>
          As with most closed-ended VC structures, (i) the Fund is a finite-life capital commitment vehicle with no capital transactions based on valuations, and (ii) the General Partner receives carried interest only upon a realization event. These characteristics significantly reduce valuation sensitivity and the incentive for intra-period price manipulation.
        </BodyText>
        <BodyText>
          The firm has an undated valuation policy that was made available for review. The firm values portfolio companies at cost and marks investments up/down based on the price of a subsequent financing round with a significant new investor. If the financing round includes substantially the same investor group, the firm only marks up if fair value can be demonstrated. The Manager stated it has never marked up based on a portfolio company&apos;s performance but does regularly mark down based on performance or macroeconomic factors.
        </BodyText>
        <BodyText>
          The firm does not have a formal valuation committee. In practice, valuations are approved by the Managing Partners. As the firm grows, we would prefer a committee with non-investment representation. The firm does not utilize external valuation agents; valuations are subject to external oversight only through the annual audit by Baker Thompson.
        </BodyText>
        <BodyText>
          On a quarterly basis, Apex prepares the Schedule of Investments, updating valuations for known events. The SOI is provided to the Managing Partners for adjustments and final approval. Apex noted it provides guidance on industry best practices but stated that valuations are ultimately the Manager&apos;s responsibility.
        </BodyText>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 8 }}>Asset Existence &amp; Verification</div>
        <BodyText>
          The Fund&apos;s investments are evidenced by private agreements maintained electronically. Share certificates for certain portfolio companies are issued via Carta. Multiple parties are involved in each transaction:
        </BodyText>
        <div style={{ overflowX: "auto" as const, marginBottom: 16 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" as const, fontSize: 11 }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                {["Verification Layer", "Description"].map((h) => (
                  <th key={h} style={{ padding: "8px 12px", textAlign: "left" as const, fontSize: 9, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase" as const, letterSpacing: "0.1em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["Investment documentation", "Apex receives all docs and wire instructions from Manager"],
                ["Carta certificates", "Apex obtains share certificates directly from Carta platform"],
                ["Wire verification", "Apex independently verifies wire details with portfolio companies before initiating"],
                ["Audit confirmations", "Baker Thompson issues confirmations to ~50% of portfolio companies annually"],
              ].map(([layer, desc], i) => (
                <tr key={layer} style={{ borderBottom: "1px solid #f1f5f9", background: i % 2 === 0 ? "#fff" : "#fafbfc" }}>
                  <td style={{ padding: "8px 12px", fontWeight: 600, color: "#1e293b" }}>{layer}</td>
                  <td style={{ padding: "8px 12px", color: "#64748b" }}>{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 8 }}>Investor Reporting</div>
        <BodyText>
          Apex will prepare and issue quarterly investor reporting within 45 business days of quarter-end via its FundPanel LP Portal. Audited financial statements will be issued annually within 120 days of year-end, prepared under U.S. GAAP. The Manager approves all reporting before issuance.
        </BodyText>
        <BodyText>
          Investor capital account balances are maintained by Apex using FundPanel. Distribution waterfalls are calculated using Excel, then input into FundPanel which generates per-LP distribution amounts and ties out to the Excel calculation. The Manager does not maintain internal records of investor capital account balances or waterfall calculations.
        </BodyText>
        <BodyText>
          The Manager and Administrator represented that the prior funds have never had an investor reporting error.
        </BodyText>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 8 }}>Financial Reporting Controls</div>
        <BodyText>
          The Fund&apos;s first financial reporting period is expected to end on December 31, 2026. We recommend investors review the audited accounts when available. The accounts will be prepared under U.S. GAAP.
        </BodyText>
        <div style={{ marginTop: 20, padding: "14px 18px", borderRadius: 8, background: "#fef3c7", border: "1px solid #fde68a" }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: "#D97706", textTransform: "uppercase" as const, letterSpacing: "0.1em", marginBottom: 6 }}>Chapter Summary — YELLOW</div>
          <div style={{ fontSize: 12, lineHeight: 1.7, color: "#334155" }}>Yellow rating based on: (1) no formal valuation committee, (2) front office exclusively controls pricing, (3) distribution waterfalls maintained in Excel, and (4) no internal investor-level accounting records. These concerns are partially mitigated by the closed-ended structure, carry-on-realization model, and Apex&apos;s proactive involvement in the valuation process. We recommend formation of a valuation committee and incorporation of the CFO/Head of Finance into the valuation process.</div>
        </div>
      </div>
    ),
  },
  {
    id: "ch8", group: "Chapters", title: "Ch 8 — Manager Transparency",
    render: () => (
      <div>
        <SectionHeader title="Chapter 8 — Manager Transparency & LP Communications" page="32" rating="GREEN" />
        <div style={{ fontSize: 10, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 8 }}>Diligence Process Cooperation</div>
        <BodyText>
          The Manager was responsive and forthcoming throughout the due diligence process, providing requested documents promptly and making staff available for follow-up questions. There were no instances of evasion, delayed responses, or attempts to restrict the scope of Alpine&apos;s review.
        </BodyText>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 8 }}>Administrator Cooperation</div>
        <BodyText>
          Apex was cooperative and provided independent confirmation of key operational arrangements via conference call on April 3, 2026. Apex independently verified service provider engagements, described its operational procedures in detail, and confirmed cash control and wire authorization processes without prompting from the Manager.
        </BodyText>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 8 }}>Disclosure Quality</div>
        <BodyText>
          The Manager proactively disclosed areas of operational weakness, including the current lack of back office resources, the underdeveloped cybersecurity environment, and the timeline for planned improvements. This level of candor is constructive and indicates a willingness to address operational gaps.
        </BodyText>
        <div style={{ marginTop: 20, padding: "14px 18px", borderRadius: 8, background: "#d1fae5", border: "1px solid #bbf7d0" }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: "#059669", textTransform: "uppercase" as const, letterSpacing: "0.1em", marginBottom: 6 }}>Chapter Summary — GREEN</div>
          <div style={{ fontSize: 12, lineHeight: 1.7, color: "#334155" }}>Green rating. No issues were noted concerning transparency. The Manager and Administrator were cooperative, responsive, and forthcoming. The Manager&apos;s proactive disclosure of operational weaknesses supports a constructive approach to remediation.</div>
        </div>
      </div>
    ),
  },
  {
    id: "remediation", group: null, title: "Remediation & Monitoring",
    render: () => (
      <div>
        <SectionHeader title="Remediation & Monitoring" page="11–12" />
        <div style={{ fontSize: 10, fontWeight: 700, color: "#dc2626", textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 10 }}>Required Before Close</div>
        <div style={{ display: "flex", flexDirection: "column" as const, gap: 10, marginBottom: 24 }}>
          {[
            { n: 1, priority: "HIGH", target: "Pre-first capital call", action: "Investor Action", ia: "Confirm pre-investment", text: "Execute provider engagement letters for Fund IV (administrator, auditor, banker)." },
            { n: 2, priority: "HIGH", target: "TBD", action: "Investor Action", ia: "Require written commitment via side letter", text: "Transfer compliance oversight to non-investment professional." },
            { n: 3, priority: "HIGH", target: "End of 2026", action: "Investor Action", ia: "Require written commitment via side letter", text: "Engage cybersecurity vendor; implement policy, training, and testing." },
          ].map(({ n, priority, target, ia, text }) => (
            <div key={n} style={{ padding: "14px 18px", borderRadius: 10, background: "#fff7f7", border: "1px solid #fca5a5" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <span style={{ width: 22, height: 22, borderRadius: "50%", background: "#dc2626", color: "#fff", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{n}</span>
                <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 4, background: "#fee2e2", color: "#dc2626" }}>{priority}</span>
                <span style={{ fontSize: 10, color: "#94a3b8", marginLeft: "auto" }}>Target: {target}</span>
              </div>
              <p style={{ fontSize: 12, lineHeight: 1.7, color: "#334155", marginLeft: 32, marginBottom: 4 }}>{text}</p>
              <div style={{ fontSize: 10, color: "#7c3aed", marginLeft: 32 }}>Investor action: {ia}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#D97706", textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 10 }}>Post-Close Monitoring</div>
        <div style={{ display: "flex", flexDirection: "column" as const, gap: 6 }}>
          {[
            { n: 4, priority: "MED", target: "2027", text: "Hire full-time Head of Finance." },
            { n: 5, priority: "MED", target: "TBD", text: "Implement compliance attestation process and annual training program." },
            { n: 6, priority: "MED", target: "TBD", text: "Form valuation committee with non-investment professional representation." },
            { n: 7, priority: "MED", target: "TBD", text: "Implement internal investor-level accounting records." },
            { n: 8, priority: "MED", target: "TBD", text: "Prepare written business continuity plan." },
            { n: 9, priority: "LOW", target: "TBD", text: "Form LPAC / Advisory Board." },
            { n: 10, priority: "LOW", target: "TBD", text: "Monitor Pacific Commerce / JP Morgan banking transition." },
            { n: 11, priority: "LOW", target: "TBD", text: "Engage third-party background check provider." },
          ].map(({ n, priority, target, text }) => (
            <div key={n} style={{ display: "flex", gap: 10, padding: "9px 12px", background: "#fffbf0", border: "1px solid #fde68a", borderRadius: 7 }}>
              <span style={{ fontSize: 9, fontWeight: 700, color: "#94a3b8", width: 16 }}>#{n}</span>
              <span style={{ flex: 1, fontSize: 11, color: "#334155" }}>{text}</span>
              <span style={{ fontSize: 9, fontWeight: 700, color: "#D97706", flexShrink: 0 }}>{priority}</span>
              <span style={{ fontSize: 9, color: "#94a3b8", flexShrink: 0 }}>{target}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "verification", group: null, title: "Scope & Verification",
    render: () => (
      <div>
        <SectionHeader title="Scope & Verification" page="7" />
        <div style={{ fontSize: 10, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 8 }}>Scope of Review</div>
        <BodyText>
          Alpine&apos;s review included a conference call with Apex Fund Services (the Fund&apos;s expected Administrator), a review of the Fund&apos;s Limited Partnership Agreement and related offering documents, the Manager&apos;s compliance binder and valuation policy, Fund III&apos;s audited financial statements, and independent checks against public registers and regulatory databases.
        </BodyText>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 10, marginTop: 16 }}>Independent Verification Performed</div>
        <div style={{ overflowX: "auto" as const }}>
          <table style={{ width: "100%", borderCollapse: "collapse" as const, fontSize: 11 }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                {["Verification", "Result", "Evidence Basis"].map((h) => (
                  <th key={h} style={{ padding: "8px 12px", textAlign: "left" as const, fontSize: 9, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase" as const, letterSpacing: "0.1em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["Management Company Registration", "Confirmed", "Alpine direct check, Delaware Division of Corporations"],
                ["Management Company Corporate Form", "Consistent", "Cross-referenced Form ADV dated March 22, 2026"],
                ["Ownership Structure", "Consistent", "Form ADV Schedules A & B confirm Arjun Mehta and Priya Sharma each hold 50-75%"],
                ["SEC ERA Status", "Confirmed", "Alpine direct check, IARD register"],
                ["SEC Disciplinary History", "No actions", "Reviewed Form ADV Section 11 and DRP pages (filing dated March 22, 2026)"],
                ["Fund Registration (Delaware)", "Confirmed", "Alpine direct check, Division of Corporations"],
                ["General Partner Registration", "Confirmed", "Alpine confirmed Trellis Capital GP IV, LLC to Division of Corporations"],
                ["Administrator Engagement", "Confirmed (expected)", "Apex confirmed via conference call, April 3, 2026"],
                ["Auditor Engagement", "Confirmed (expected)", "Apex confirmed Baker Thompson expected as auditor"],
                ["Corporate Banker Engagement", "Confirmed (expected)", "Apex confirmed Pacific Commerce expected as banker, April 3, 2026"],
              ].map(([verification, result, evidence], i) => (
                <tr key={verification} style={{ borderBottom: "1px solid #f1f5f9", background: i % 2 === 0 ? "#fff" : "#fafbfc" }}>
                  <td style={{ padding: "8px 12px", fontWeight: 500, color: "#1e293b" }}>{verification}</td>
                  <td style={{ padding: "8px 12px", color: "#059669", fontWeight: 600, whiteSpace: "nowrap" as const }}>{result}</td>
                  <td style={{ padding: "8px 12px", color: "#64748b", fontSize: 10 }}>{evidence}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    ),
  },
  {
    id: "refdata", group: null, title: "Reference Data",
    // Rendered via <RefDataSection overrides={...} /> in FinalReport so values stay
    // in sync with edits made on the Data Report tab (TrellisReferenceData).
    render: () => null,
  },
] as const;

// Small shared sub-components used by sections
function SectionHeader({ title, page, rating, score }: { title: string; page: string; rating?: string; score?: number }) {
  const rc = rating === "GREEN" ? "#059669" : rating === "YELLOW" ? "#D97706" : rating === "RED" ? "#DC2626" : undefined;
  const rb = rating === "GREEN" ? "#d1fae5" : rating === "YELLOW" ? "#fef3c7" : rating === "RED" ? "#fee2e2" : undefined;
  return (
    <div style={{ paddingBottom: 16, marginBottom: 20, borderBottom: "2px solid #f1f5f9" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", letterSpacing: "-0.02em", margin: 0 }}>{title}</h2>
          <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 3 }}>Page {page}</div>
        </div>
        {rating && score !== undefined && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <span style={{ fontSize: 9, fontWeight: 700, padding: "3px 9px", borderRadius: 5, background: rb, color: rc }}>{rating}</span>
            <span style={{ fontSize: 18, fontWeight: 800, color: rc }}>{score}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function RatingBanner({ rating, score }: { rating: string; score: number }) {
  const color = rating === "ACCEPT" ? "#059669" : rating === "WATCHLIST" ? "#D97706" : "#DC2626";
  const bg = rating === "ACCEPT" ? "#d1fae5" : rating === "WATCHLIST" ? "#fef3c7" : "#fee2e2";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 20px", borderRadius: 10, background: bg, border: `1px solid ${color}40`, marginBottom: 20 }}>
      <div style={{ fontSize: 22, fontWeight: 800, color, letterSpacing: "-0.02em" }}>{rating}</div>
      <div style={{ width: 1, height: 32, background: `${color}30` }} />
      <div><div style={{ fontSize: 9, fontWeight: 600, color: `${color}aa`, textTransform: "uppercase" as const, letterSpacing: "0.1em" }}>ODD Score</div><div style={{ fontSize: 22, fontWeight: 800, color }}>{score} / 100</div></div>
      <div style={{ fontSize: 11, color, lineHeight: 1.5, flex: 1, paddingLeft: 8 }}>
        {rating === "WATCHLIST" ? "Meets most operational standards. Material gaps require remediation before ACCEPT upgrade." : rating === "ACCEPT" ? "Meets all operational standards. Approved for allocation." : "Material deficiencies identified. Allocation not recommended pending remediation."}
      </div>
    </div>
  );
}
function BodyText({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: 13, lineHeight: 1.85, color: "#1e293b", marginBottom: 14, fontFamily: "Georgia, serif" }}>{children}</p>;
}
function FindingBox({ type, title, children }: { type: "strength" | "concern"; title: string; children: React.ReactNode }) {
  const color = type === "strength" ? "#059669" : "#DC2626";
  const bg = type === "strength" ? "#f0fdf4" : "#fff7f7";
  const border = type === "strength" ? "#bbf7d0" : "#fecaca";
  return (
    <div style={{ padding: "14px 18px", borderRadius: 8, background: bg, border: `1px solid ${border}`, marginBottom: 14 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color, textTransform: "uppercase" as const, letterSpacing: "0.1em", marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 12, lineHeight: 1.7, color: "#334155" }}>{children}</div>
    </div>
  );
}

const FINAL_REPORT_RATINGS = [
  { ch: "1", title: "Manager, Ownership & Governance",                chapter: "Manager, Ownership & Governance",                 rating: "YELLOW" },
  { ch: "2", title: "Legal, Regulatory & Compliance",                 chapter: "Legal, Regulatory & Compliance",                  rating: "RED" },
  { ch: "3", title: "Technology, Cybersecurity & Business Resilience",chapter: "Technology, Cybersecurity & Business Resilience", rating: "RED" },
  { ch: "4", title: "Fund Structure, Terms & Investor Alignment",     chapter: "Fund Structure, Terms & Investor Alignment",      rating: "GREEN" },
  { ch: "5", title: "Service Providers, Delegation & Oversight",      chapter: "Service Providers, Delegation & Oversight",       rating: "GREEN" },
  { ch: "6", title: "Investment Operations & Portfolio Controls",     chapter: "Investment Operations & Portfolio Controls",      rating: "YELLOW" },
  { ch: "7", title: "Valuation, Asset Existence & Investor Reporting",chapter: "Valuation, Asset Existence & Investor Reporting", rating: "YELLOW" },
  { ch: "8", title: "Manager Transparency & LP Communications",       chapter: "Manager Transparency & LP Communications",        rating: "GREEN" },
];

function RatingsAndFlagsSection({ flags, ratingOverrides }: { flags: { text: string; chapter: string }[]; ratingOverrides?: Record<number, string> }) {
  const flagsByChapter = flags.reduce<Record<string, number>>((acc, f) => {
    acc[f.chapter] = (acc[f.chapter] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <SectionHeader title="Alpine Ratings" page="8" />
      <div style={{ marginBottom: 20 }}>
        {FINAL_REPORT_RATINGS.map(({ ch, title, chapter, rating: defaultRating }, i) => {
          const rating = (ratingOverrides?.[i + 1] ?? defaultRating).toUpperCase();
          const rc = rating === "GREEN" ? "#059669" : rating === "YELLOW" ? "#D97706" : "#DC2626";
          const rb = rating === "GREEN" ? "#d1fae5" : rating === "YELLOW" ? "#fef3c7" : "#fee2e2";
          const count = flagsByChapter[chapter] ?? 0;
          return (
            <div key={ch} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 6, marginBottom: 4, background: "#f8fafc", border: "1px solid #e2e8f0" }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", width: 20 }}>Ch{ch}</span>
              <span style={{ flex: 1, fontSize: 12, color: "#334155" }}>{title}</span>
              <span title={`${count} flag${count === 1 ? "" : "s"} in this chapter`} style={{ fontSize: 10, fontWeight: 600, color: count > 0 ? "#475569" : "#cbd5e1", background: count > 0 ? "#eef2ff" : "transparent", padding: "2px 7px", borderRadius: 4 }}>
                {count} flag{count === 1 ? "" : "s"}
              </span>
              <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 4, background: rb, color: rc }}>{rating}</span>
            </div>
          );
        })}
      </div>
      <div style={{ borderTop: "2px solid #f1f5f9", paddingTop: 20, marginTop: 4 }}>
        <SectionHeader title="Alpine Flags" page="9–10" />
      </div>
      {flags.length === 0 ? (
        <div style={{ padding: "16px 12px", fontSize: 12, color: "#94a3b8", textAlign: "center" as const, background: "#f8fafc", borderRadius: 6, border: "1px dashed #e2e8f0" }}>
          No flags identified.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column" as const, gap: 4 }}>
          {flags.map((flag, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", background: "#fff", border: "1px solid #f1f5f9", borderRadius: 5 }}>
              <span style={{ fontSize: 9, fontWeight: 700, color: "#94a3b8", width: 22, flexShrink: 0 }}>#{i + 1}</span>
              <span style={{ flex: 1, fontSize: 11, color: "#334155" }}>{flag.text}</span>
              <span style={{
                display: "inline-block",
                padding: "3px 10px",
                borderRadius: 5,
                fontSize: 10,
                fontWeight: 500,
                background: FLAG_CHAPTER_BG[flag.chapter] ?? "#f9fafb",
                color: FLAG_CHAPTER_COLOR[flag.chapter] ?? "#6b7280",
                flexShrink: 0,
                maxWidth: 200,
                textAlign: "right" as const,
                lineHeight: 1.4,
              }}>{flag.chapter}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function RefDataSection({ overrides }: { overrides: Record<string, string> }) {
  return (
    <div>
      <SectionHeader title="Reference Data" page="33–42" />
      <div style={{ display: "flex", flexDirection: "column" as const, gap: 20 }}>
        {TRELLIS_REF_SECTIONS.map((section, si) => (
          <div key={section.title}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#0f172a", borderBottom: "1px solid #e2e8f0", paddingBottom: 6, marginBottom: 10 }}>{section.title}</div>
            {section.groups.map((group, gi) => (
              <div key={group.heading} style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "#7c3aed", marginBottom: 6 }}>{group.heading}</div>
                <div style={{ display: "flex", flexDirection: "column" as const, gap: 2 }}>
                  {group.rows.map(([k, v], ri) => {
                    const override = overrides[`${si}.${gi}.${ri}`];
                    const value = override ?? v;
                    return (
                      <div key={ri} style={{ display: "flex", gap: 8, padding: "5px 8px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 4 }}>
                        <span style={{ fontSize: 10, color: "#94a3b8", width: "38%", flexShrink: 0 }}>{k}</span>
                        <span style={{ fontSize: 10, fontWeight: 600, color: "#1e293b" }}>{value}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Watermark Modal ───────────────────────────────────────────────────────────

function WatermarkModal({ onClose }: { onClose: () => void }) {
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [step, setStep] = useState<"form" | "processing" | "done" | "error">("form");
  const [emailSent, setEmailSent] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientName.trim()) return;
    setStep("processing");
    try {
      const pdfRes = await fetch("/demo-docs/trellis/sample_vc_fund_iv_alt.pdf");
      const pdfBlob = await pdfRes.blob();
      const file = new File([pdfBlob], "sample_vc_fund_iv_alt.pdf", { type: "application/pdf" });

      const fd = new FormData();
      fd.append("file", file);
      fd.append("recipientName", recipientName.trim());
      fd.append("distributedBy", "demo");
      if (recipientEmail.trim()) fd.append("recipientEmail", recipientEmail.trim());

      const res = await fetch("/api/app-portal/watermark", { method: "POST", body: fd });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error ?? "Server error");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Trellis_Capital_IV_${recipientName.trim().replace(/\s+/g, "_")}_CONFIDENTIAL.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setEmailSent(res.headers.get("X-Email-Sent") === "true");
      setStep("done");
    } catch (err) {
      setErrMsg(err instanceof Error ? err.message : "Failed to generate watermark");
      setStep("error");
    }
  };

  const isReady = !!recipientName.trim() && step !== "processing";

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.55)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ background: "#fff", borderRadius: 16, padding: "32px 32px", width: 440, maxWidth: "90vw", boxShadow: "0 20px 60px rgba(0,0,0,0.18)" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#7c3aed", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 4 }}>Final Report</div>
            <div style={{ fontSize: 17, fontWeight: 700, color: "#0f172a" }}>Send Watermarked Copy</div>
            <div style={{ fontSize: 12, color: "#64748b", marginTop: 3 }}>Watermark embedded across every page. Email delivery is optional.</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 4, marginTop: -4 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {step === "done" ? (
          <div style={{ textAlign: "center", padding: "16px 0" }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#f0fdf4", border: "1px solid #bbf7d0", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>Watermarked PDF Ready</div>
            <div style={{ fontSize: 12, color: "#64748b", marginBottom: emailSent ? 8 : 20 }}>File downloaded to your device.</div>
            {emailSent && (
              <div style={{ fontSize: 12, color: "#059669", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "8px 12px", marginBottom: 20 }}>
                Email sent to {recipientEmail} with the report attached.
              </div>
            )}
            <button onClick={onClose} style={{ padding: "10px 24px", fontSize: 13, fontWeight: 600, color: "#fff", background: "#7c3aed", border: "none", borderRadius: 8, cursor: "pointer" }}>Done</button>
          </div>
        ) : (
          <form onSubmit={handleGenerate} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 5 }}>Recipient Name *</label>
              <input
                type="text" required autoFocus value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="e.g. James Whitfield"
                disabled={step === "processing"}
                style={{ width: "100%", padding: "10px 12px", fontSize: 14, border: "1px solid #e2e8f0", borderRadius: 8, outline: "none", boxSizing: "border-box" }}
              />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 5 }}>
                Recipient Email
                <span style={{ fontSize: 10, fontWeight: 400, color: "#94a3b8", textTransform: "none", letterSpacing: 0, marginLeft: 6 }}>— leave blank to download only</span>
              </label>
              <input
                type="email" value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                placeholder="james@example.com"
                disabled={step === "processing"}
                style={{ width: "100%", padding: "10px 12px", fontSize: 14, border: "1px solid #e2e8f0", borderRadius: 8, outline: "none", boxSizing: "border-box" }}
              />
            </div>

            {recipientEmail.trim() && (
              <div style={{ fontSize: 12, color: "#64748b", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, padding: "10px 12px", lineHeight: 1.6 }}>
                <span style={{ fontWeight: 600, color: "#475569" }}>Email preview:</span> "Alpine ODD Report — Confidential Copy for {recipientName || "…"}" with PDF attached.
              </div>
            )}

            {step === "error" && (
              <div style={{ fontSize: 12, color: "#dc2626", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "8px 12px" }}>{errMsg}</div>
            )}

            <div style={{ display: "flex", gap: 10 }}>
              <button type="button" onClick={onClose} style={{ flex: 1, padding: "10px", fontSize: 13, fontWeight: 600, color: "#475569", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, cursor: "pointer" }}>Cancel</button>
              <button
                type="submit" disabled={!isReady}
                style={{ flex: 2, padding: "10px", fontSize: 13, fontWeight: 700, color: "#fff", background: isReady ? "#7c3aed" : "#94a3b8", border: "none", borderRadius: 8, cursor: isReady ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
              >
                {step === "processing" ? (
                  <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "wmSpin 1s linear infinite" }}><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>{recipientEmail.trim() ? "Generating & Sending…" : "Generating…"}</>
                ) : recipientEmail.trim() ? (
                  <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>Generate & Send Email</>
                ) : (
                  <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>Generate & Download</>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
      <style>{`@keyframes wmSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ── Final Report ──────────────────────────────────────────────────────────────

function FinalReport({ slug, topicRatingOverrides, onWatermark }: { slug?: string; topicRatingOverrides?: Record<number, string>; onWatermark: () => void }) {
  const isAuroraFR = slug === "aurora-capital-iv";
  const SECTIONS: readonly { id: string; group: string | null; title: string; render: () => React.ReactNode }[] =
    isAuroraFR ? (AURORA_FINAL_REPORT_SECTIONS as unknown as typeof FINAL_REPORT_SECTIONS) : FINAL_REPORT_SECTIONS;
  const reportFundName = isAuroraFR ? "Aurora Ventures IV, L.P." : "Trellis Capital IV, L.P.";

  const [activeSectionId, setActiveSectionId] = useState<string>(SECTIONS[0].id);
  const activeIdx = SECTIONS.findIndex((s) => s.id === activeSectionId);
  const activeSection = SECTIONS[activeIdx];

  const groups = Array.from(new Set(SECTIONS.map((s) => s.group)));

  // ── Live flags synced from Flag tab (/api/app-portal/flag-draft) ──
  const defaultFlags = (isAuroraFR ? AURORA_FLAGS : TRELLIS_FLAGS).map(({ text, chapter }) => ({ text, chapter }));
  const [liveFlags, setLiveFlags] = useState<{ text: string; chapter: string }[]>(defaultFlags);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/app-portal/flag-draft?slug=${encodeURIComponent(slug)}`)
      .then(r => r.json())
      .then(({ flags }) => {
        if (Array.isArray(flags) && flags.length > 0) {
          const sorted = [...flags].sort((a, b) => FLAG_CHAPTERS.indexOf(a.chapter) - FLAG_CHAPTERS.indexOf(b.chapter));
          setLiveFlags(sorted);
        }
      })
      .catch(() => {});
  }, [slug]);

  // ── Live chapter ratings synced from Rating tab (/api/app-portal/topic-rating) ──
  // Parent passes in-memory overrides via prop; we also fetch from DB so that
  // landing directly on Final Report (without visiting Rating first) still works.
  const [dbRatingOverrides, setDbRatingOverrides] = useState<Record<number, string>>({});
  useEffect(() => {
    if (!slug) return;
    fetch(`/api/app-portal/topic-rating?slug=${encodeURIComponent(slug)}`)
      .then(r => r.json())
      .then((data) => {
        const next: Record<number, string> = {};
        // Accept either { overrides: { "1": "GREEN", ... } } or an array of { topic_number, rating }
        const src = data?.overrides ?? data?.ratings ?? data;
        if (Array.isArray(src)) {
          for (const row of src) {
            if (row?.topic_number != null && row?.rating) next[Number(row.topic_number)] = String(row.rating).toUpperCase();
          }
        } else if (src && typeof src === "object") {
          for (const [k, v] of Object.entries(src)) {
            if (v) next[Number(k)] = String(v).toUpperCase();
          }
        }
        if (Object.keys(next).length > 0) setDbRatingOverrides(next);
      })
      .catch(() => {});
  }, [slug]);

  const mergedRatingOverrides: Record<number, string> = { ...dbRatingOverrides, ...(topicRatingOverrides ?? {}) };

  // ── Live reference-data overrides synced from Data Report tab ──
  const [refDataOverrides, setRefDataOverrides] = useState<Record<string, string>>({});
  useEffect(() => {
    if (!slug) return;
    fetch(`/api/app-portal/reference-data-draft?slug=${encodeURIComponent(slug)}`)
      .then(r => r.json())
      .then(({ values }) => {
        if (values && typeof values === "object") setRefDataOverrides(values);
      })
      .catch(() => {});
  }, [slug]);

  const handleDownload = () => {
    const d = new Date();
    const stamp = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
    const link = document.createElement("a");
    link.href = isAuroraFR ? "/demo-docs/aurora/sample_vc_aurora_iv.pdf" : "/demo-docs/trellis/sample_vc_fund_iv_alt.pdf";
    link.download = isAuroraFR
      ? `${stamp}-Aurora_Ventures_IV_ODD_Final_Report.pdf`
      : `${stamp}-Trellis_Capital_IV_ODD_Final_Report.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: "flex", gap: 0, minHeight: 600, background: "#f8fafc", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>

      {/* Sidebar — Table of Contents */}
      <div style={{ width: 220, flexShrink: 0, background: "#fff", borderRight: "1px solid #e2e8f0", overflowY: "auto", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "16px 16px 12px", borderBottom: "1px solid #f1f5f9" }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: "#7c3aed", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 2 }}>Final Report</div>
          <div style={{ fontSize: 11, color: "#64748b", marginBottom: 8 }}>{reportFundName}</div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "3px 8px", borderRadius: 999, background: "#ecfdf5", border: "1px solid #a7f3d0" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981" }} />
            <span style={{ fontSize: 10, fontWeight: 600, color: "#047857" }}>AI drafted Report ready</span>
          </div>
        </div>
        <div style={{ flex: 1, padding: "10px 0" }}>
          {groups.map((group) => {
            const groupSections = SECTIONS.filter((s) => s.group === group);
            return (
              <div key={group ?? "__ungrouped"}>
                {group && (
                  <div style={{ fontSize: 8, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.12em", padding: "8px 16px 4px" }}>{group}</div>
                )}
                {groupSections.map((s) => {
                  const isActive = s.id === activeSectionId;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setActiveSectionId(s.id)}
                      style={{ width: "100%", textAlign: "left", padding: "7px 16px 7px " + (group ? "24px" : "16px"), fontSize: 12, fontWeight: isActive ? 600 : 400, color: isActive ? "#7c3aed" : "#475569", background: isActive ? "#f5f3ff" : "transparent", borderLeft: isActive ? "2px solid #7c3aed" : "2px solid transparent", border: "none", cursor: "pointer", display: "block", lineHeight: 1.4 }}
                    >
                      {s.title}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
        <div style={{ padding: "12px 12px", borderTop: "1px solid #f1f5f9", display: "flex", flexDirection: "column", gap: 8 }}>
          <button
            onClick={handleDownload}
            style={{ width: "100%", padding: "8px 12px", fontSize: 11, fontWeight: 600, color: "#fff", background: "#7c3aed", border: "none", borderRadius: 8, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download PDF
          </button>
          <button
            onClick={onWatermark}
            style={{ width: "100%", padding: "8px 12px", fontSize: 11, fontWeight: 700, color: "#7c3aed", background: "#f5f3ff", border: "1.5px solid #7c3aed", borderRadius: 8, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Send Watermarked Copy
          </button>
        </div>
      </div>

      {/* Main content — single section view */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Content area */}
        <div style={{ flex: 1, overflowY: "auto", padding: "32px 40px" }}>
          {activeSection.id === "ratings" ? (
            <RatingsAndFlagsSection flags={liveFlags} ratingOverrides={mergedRatingOverrides} />
          ) : activeSection.id === "refdata" ? (
            <RefDataSection overrides={refDataOverrides} />
          ) : activeSection.render()}
        </div>

        {/* Bottom navigation */}
        <div style={{ borderTop: "1px solid #e2e8f0", background: "#fff", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <button
            onClick={() => activeIdx > 0 && setActiveSectionId(SECTIONS[activeIdx - 1].id)}
            disabled={activeIdx === 0}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", fontSize: 12, fontWeight: 500, color: activeIdx === 0 ? "#cbd5e1" : "#475569", background: "transparent", border: "1px solid " + (activeIdx === 0 ? "#f1f5f9" : "#e2e8f0"), borderRadius: 8, cursor: activeIdx === 0 ? "default" : "pointer" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
            Previous
          </button>
          <span style={{ fontSize: 11, color: "#94a3b8" }}>
            {activeIdx + 1} / {SECTIONS.length} sections
          </span>
          <button
            onClick={() => activeIdx < SECTIONS.length - 1 && setActiveSectionId(SECTIONS[activeIdx + 1].id)}
            disabled={activeIdx === SECTIONS.length - 1}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", fontSize: 12, fontWeight: 500, color: activeIdx === SECTIONS.length - 1 ? "#cbd5e1" : "#475569", background: "transparent", border: "1px solid " + (activeIdx === SECTIONS.length - 1 ? "#f1f5f9" : "#e2e8f0"), borderRadius: 8, cursor: activeIdx === SECTIONS.length - 1 ? "default" : "pointer" }}
          >
            Next
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

const TABS = ["AI Draft", "Overview", "Assessment", "Scope & Verification", "Rating", "Flag", "Remediation", "Data Report", "Final Report"] as const;

// ── Ref Popover ───────────────────────────────────────────────────────────────

interface RefPopoverState {
  source: string;
  quote: string;
  top: number;
  left: number;
}

function buildPassage(quote: string, filename: string): { before: string; after: string; section: string; pageLabel: string } {
  const q = quote.toLowerCase();
  const f = filename.toLowerCase();

  if (f.includes("form_adv")) {
    if (q.includes("ridgeline capital partners")) return {
      section: "Item 1 — Cover Page",
      before: "This Form ADV Part 2A (\"Brochure\") is filed with the U.S. Securities and Exchange Commission pursuant to Rule 204-3 under the Investment Advisers Act of 1940, as amended. This Brochure provides information about the qualifications, business practices, and advisory services offered by ",
      after: ", LLC (\"Ridgeline\" or the \"Adviser\"). Registration as an investment adviser with the SEC does not imply a certain level of skill or training, and the information contained herein has not been approved or verified by the SEC or by any state securities authority. If you have any questions about the contents of this Brochure, please contact our compliance department at (212) 555-0100 or by email at compliance@ridgelinecap.com. Additional information about Ridgeline Capital Partners, including this Brochure, is available on the SEC's Investment Adviser Public Disclosure website at www.adviserinfo.sec.gov (CRD# 298741). This Brochure is updated at least annually as required by Rule 204-3(b) and may be updated more frequently when material changes occur. Clients and prospective investors should ensure they are reviewing the most current version of this document. Ridgeline does not solicit or accept investments from retail investors as defined under Regulation Best Interest. All advisory relationships are with institutional investors, qualified purchasers, and accredited investors as defined under applicable federal securities laws.",
      pageLabel: "Page 1 of 38",
    };
    if (q.includes("delaware llc") || q.includes("delaware limited")) return {
      section: "Item 1 — Cover Page",
      before: "This Form ADV Part 2A describes the advisory business, fees, investment strategies, and material risks associated with an investment in Ridgeline Global Opportunities Fund, LP. Prospective investors are strongly encouraged to review this document in its entirety, together with all fund offering documents and side letter agreements, prior to making any investment decision. Ridgeline Capital Partners, LLC is the registered investment adviser and sole General Partner of the Fund. The Adviser is organized as a ",
      after: " and has been continuously registered as an investment adviser with the U.S. Securities and Exchange Commission since April 2018. The firm's principal office and place of business is located at 245 Park Avenue, Suite 3200, New York, NY 10167. The Adviser is wholly owned by its founding principals and there are no outside institutional investors, strategic partners, or third-party controlling interests in the management company. The Adviser employs eleven full-time staff, including four investment professionals, two compliance and legal staff, and five operations and accounting personnel.",
      pageLabel: "Page 2 of 38",
    };
    if (q.includes("crd") || q.includes("april 2018") || q.includes("since april")) return {
      section: "Item 1 — Cover Page",
      before: "Ridgeline Capital Partners, LLC is a registered investment adviser and the sole General Partner of Ridgeline Global Opportunities Fund, LP. The Adviser was founded by David Chen, CFA, in early 2018 following his departure from a New York-based global macro fund where he served as a senior portfolio manager for nine years. The Registrant (CRD# 298741) has maintained continuous registration as an investment adviser with the U.S. Securities and Exchange Commission ",
      after: ". Prior to federal registration, the firm operated under a New York state investment adviser registration from January 2018 through April 2018. The firm has not been subject to any regulatory examination deficiency findings requiring remediation during the current registration period. Clients and prospective investors may verify current registration status and access all disclosure documents through the SEC's Investment Adviser Public Disclosure (IAPD) database at www.adviserinfo.sec.gov. The firm's most recent SEC examination was conducted in October 2023 and resulted in no findings of deficiency.",
      pageLabel: "Page 3 of 38",
    };
    if (q.includes("david chen") || q.includes("cfa")) return {
      section: "Item 10 — Other Financial Industry Activities and Affiliations",
      before: "All portfolio management, investment research, trading, and risk oversight functions of Ridgeline Capital Partners are centralized under the sole authority of ",
      after: ", who serves as Chief Investment Officer, Portfolio Manager, and a Managing Member of the General Partner entity. Mr. Chen has managed the Ridgeline Global Opportunities Fund since its inception in January 2018 and holds exclusive authority over all portfolio construction, position sizing, capital allocation, and risk parameter decisions. The firm has not appointed a formal deputy Portfolio Manager, backup investment professional, or documented succession arrangement as of the date of this filing. The CCO has included key-man concentration risk as a standing agenda item for the 2026 annual compliance review. Two senior research analysts, James Park and Sarah Kim, support the investment process but do not hold investment discretion and are not authorized to execute trades independently. The firm's investment committee, which consists of Mr. Chen and the CFO, meets monthly to review portfolio exposures, risk metrics, and market outlook.",
      pageLabel: "Page 6 of 38",
    };
    if (q.includes("2.31") || q.includes("2.3b") || q.includes("assets under")) return {
      section: "Item 4 — Advisory Business",
      before: "Ridgeline Capital Partners provides discretionary investment advisory services exclusively to pooled investment vehicles. The firm does not currently provide investment advisory services to individual retail clients, pension plans, charitable organizations, or other separately managed account clients. The Adviser's investment strategy focuses on global equity long/short with opportunistic allocations to credit and macro instruments. The Fund employs a bottom-up fundamental research approach combined with top-down macro overlay, targeting concentrated positions in 20 to 35 securities across developed and select emerging markets. As of December 31, 2025, the Registrant manages approximately ",
      after: " in regulatory assets under management on a fully discretionary basis, comprising capital held in the master fund structure, two offshore feeder vehicles registered in the Cayman Islands, and three separately managed accounts for institutional investors. The firm does not manage any assets on a non-discretionary basis. Total assets under management have grown approximately 18% on a year-over-year basis from the prior period, reflecting net capital inflows of approximately $280 million and investment performance of approximately 12.4% net of fees.",
      pageLabel: "Page 4 of 38",
    };
    if (q.includes("no material changes") || q.includes("no changes")) return {
      section: "Item 2 — Material Changes",
      before: "This section is required to summarize material changes made to this Brochure since its most recent annual update, pursuant to Rule 204-3(b)(2) under the Investment Advisers Act of 1940. Investment advisers are required to deliver this summary or the full updated Brochure to existing clients within 120 days of the Registrant's fiscal year-end. There have been ",
      after: " to this Brochure since the annual amendment filed in March 2024 other than those summarized below. Effective January 1, 2026, the Fund's investment mandate was expanded to permit allocations to structured credit instruments including CLO tranches and asset-backed securities, subject to a 15% portfolio concentration limit. A revised fee schedule applicable to new subscriptions received on or after January 1, 2026 is set forth in Item 5. The composition of the firm's Valuation Committee was updated to include an independent external consultant. Clients are strongly encouraged to review the current Brochure in its entirety and to contact investor relations at ir@ridgelinecap.com with any questions.",
      pageLabel: "Page 1 of 38",
    };
    return {
      section: "Item 5 — Fees and Compensation",
      before: "Ridgeline charges fees for its investment advisory services in the form of a management fee and an incentive allocation. The management fee is 1.50% per annum of net asset value, calculated on the first business day of each calendar month based on beginning-of-period net asset value and payable monthly in arrears. The incentive allocation is 20% of net profits above a 6% annualized hurdle rate, subject to a high-water mark, calculated and crystallized annually at December 31 of each year. No incentive allocation is charged unless and until cumulative performance has exceeded the applicable high-water mark. The management fee and incentive allocation are the only forms of compensation received by the Adviser in connection with the management of the Fund. With respect to the specific terms applicable to this investor, including any fee modifications or side letter provisions, the following disclosure is provided: ",
      after: ". Investors should review Item 5 and the applicable subscription documents in their entirety before submitting a subscription agreement. Fee schedules are non-negotiable for new investors with committed capital below $10 million. All fee calculations are subject to independent verification by the Fund's administrator, Citco Fund Services.",
      pageLabel: "Page 8 of 38",
    };
  }

  if (f.includes("ppm") || f.includes("lpa")) {
    if (q.includes("delaware") && (q.includes("lp") || q.includes("fund"))) return {
      section: "Section 1 — Organization and Formation",
      before: "Ridgeline Global Opportunities Fund, LP (the \"Fund\") is organized as a ",
      after: " and was formed on January 4, 2018, pursuant to a Certificate of Limited Partnership filed with the Delaware Secretary of State. The Fund's principal office and place of business is 245 Park Avenue, Suite 3200, New York, NY 10167. Ridgeline Capital Partners, LLC (the \"General Partner\") serves as the sole General Partner and investment manager of the Fund. The Fund operates as a master fund in a master-feeder structure, alongside Ridgeline Global Opportunities Fund (Offshore) Ltd., a Cayman Islands exempted company formed for international and tax-exempt investors. Interests in the Fund have not been registered under the Securities Act of 1933, the Investment Company Act of 1940, or any state securities law, and are being offered in reliance upon exemptions from registration requirements. Interests may only be acquired by investors who are both accredited investors as defined in Regulation D and qualified purchasers as defined under Section 2(a)(51) of the Investment Company Act.",
      pageLabel: "Page 4 of 72",
    };
    if (q.includes("cayman") || q.includes("offshore")) return {
      section: "Section 2 — Master-Feeder Fund Structure",
      before: "The Fund is designed to accommodate the diverse tax, regulatory, and administrative requirements of its investor base through a master-feeder structure. U.S. taxable investors subscribe directly into Ridgeline Global Opportunities Fund, LP, the onshore Delaware limited partnership. Non-U.S. investors and U.S. tax-exempt investors, including pension funds, endowments, and foundations, may subscribe through ",
      after: ", which passes through substantially all of its capital to the Master Fund via a fully transparent limited partnership interest. Investors in the offshore vehicle benefit from certain protections under applicable income tax treaties, exemption from certain U.S. withholding tax provisions, and streamlined FATCA compliance through the Cayman Islands AEOI regime. All investment decisions, portfolio management, and risk oversight are conducted at the Master Fund level. Allocations of profit and loss are made to each feeder vehicle on a pro-rata basis based on its proportionate interest in the Master Fund. The General Partner may, in its sole discretion, restructure the fund architecture, add additional feeder vehicles, or modify the master-feeder arrangement with 30 days' prior written notice to Limited Partners.",
      pageLabel: "Page 7 of 72",
    };
    if (q.includes("2%") || q.includes("20%") || q.includes("hurdle") || q.includes("high-water") || q.includes("hwm")) return {
      section: "Section 7 — Management Fees and Incentive Allocation",
      before: "The General Partner is entitled to receive compensation for its advisory services in the form of a management fee and an annual incentive allocation. The current fee structure applicable to all Limited Partners as of January 1, 2026, unless modified by individual side letter agreement, is as follows: ",
      after: ". The management fee is calculated on the first business day of each calendar month using the beginning-of-period net asset value of each Limited Partner's capital account and is payable monthly in arrears. The incentive allocation is calculated and charged on an annual basis at December 31 of each year. The incentive allocation will be charged only to the extent that cumulative net profits in a Limited Partner's capital account exceed the applicable high-water mark. If the Fund incurs losses in any year, those losses must be fully recovered before any further incentive allocation may be charged. The high-water mark is applied on a per-investor basis and does not reset upon redemption or re-subscription.",
      pageLabel: "Page 18 of 72",
    };
    if (q.includes("goldman") || q.includes("morgan stanley") || q.includes("prime")) return {
      section: "Section 9 — Prime Brokerage, Custody, and Leverage",
      before: "The Fund may utilize leverage in connection with its investment activities, subject to the risk parameters established by the General Partner. The General Partner monitors gross and net leverage on a daily basis and has established internal guidelines limiting gross exposure to 300% of net asset value and net exposure to 150% in either direction. The Fund finances its leveraged positions primarily through margin facilities provided by its prime brokers. The Fund has established prime brokerage and margin lending relationships with ",
      after: ". All cash and portfolio securities are held in segregated accounts at each respective prime broker under standard institutional prime brokerage agreements. The General Partner may add, remove, or replace prime brokers at any time without prior notice to Limited Partners, subject to its best execution obligations. The Fund does not currently utilize a dedicated independent custodian. Prime broker insolvency risk is mitigated through position diversification across multiple prime brokerage relationships and periodic review of each counterparty's credit profile.",
      pageLabel: "Page 22 of 72",
    };
    if (q.includes("quarterly") || q.includes("90-day") || q.includes("redemption")) return {
      section: "Section 11 — Redemptions, Withdrawals, and Liquidity",
      before: "The Fund is designed as a semi-liquid investment vehicle providing limited liquidity to investors on a periodic basis. The General Partner believes this liquidity profile is consistent with the Fund's investment strategy and enables the portfolio to maintain positions through short-term volatility. Subject to the terms and conditions set forth in this Section and in the Limited Partnership Agreement, Limited Partners may submit redemption requests on the following basis: ",
      after: ". Written redemption requests must be submitted to the Fund Administrator no later than 60 calendar days prior to the applicable redemption date. The General Partner, in its sole and absolute discretion, reserves the right to suspend, delay, restrict, gate, or satisfy redemptions in kind during periods of market dislocation, operational disruption, or when the aggregate redemption requests for any single redemption date exceed 25% of the Fund's net asset value. Partial redemptions are permitted provided the redeeming Limited Partner maintains a minimum capital account balance of $1,000,000 following the redemption. Redemption proceeds will be paid within 30 business days following the applicable redemption date.",
      pageLabel: "Page 24 of 72",
    };
    if (q.includes("mfn") || q.includes("most favored") || q.includes("25m") || q.includes("25 million")) return {
      section: "Section 13 — Side Letter Agreements and Investor Rights",
      before: "The General Partner may, in its sole discretion, enter into side letter or other similar agreements with one or more Limited Partners, pursuant to which such Limited Partners may be granted rights, entitlements, or terms not set forth in this Agreement or the Subscription Documents. Side letter rights may include, without limitation, reduced management fees, reduced incentive allocations, enhanced reporting obligations, portfolio transparency rights, advance notice of material events, co-investment rights, and ",
      after: " rights entitling such investor to receive terms no less favorable than those granted to any other investor of a similar size and type. Side letters are generally offered to Limited Partners making initial subscriptions of $25 million or more. The existence, identity of parties to, and general categories of terms contained in any side letter shall be disclosed to all Limited Partners upon written request, subject to confidentiality restrictions agreed between the parties. The General Partner shall not enter into any side letter that materially adversely affects the economic rights of existing Limited Partners without prior written consent of a Majority in Interest.",
      pageLabel: "Page 31 of 72",
    };
    return {
      section: "Section 2 — Defined Terms and Interpretation",
      before: "For purposes of this Agreement and any supplement, amendment, or exhibit hereto, the following capitalized terms shall have the meanings ascribed to them in this Section 2 unless otherwise explicitly defined in context. In the event of any conflict between a defined term in this Agreement and a defined term in any Subscription Agreement or side letter, the definition set forth in the applicable Subscription Agreement or side letter shall control solely with respect to the party thereto. All references to statutes, regulations, rules, or official guidance shall be deemed to refer to such authorities as amended, restated, or replaced from time to time. As defined in Section 2.1 of this Agreement: ",
      after: ". Additional defined terms used in this Agreement include: \"Affiliate\" means any entity that directly or indirectly controls, is controlled by, or is under common control with the referenced party; \"Business Day\" means any day other than a Saturday, Sunday, or day on which commercial banks in the State of New York are authorized or required by law to close; \"Net Asset Value\" means the total fair market value of all assets of the Fund, minus all accrued liabilities including management fees and estimated incentive allocations, as determined by the Fund's independent administrator.",
      pageLabel: "Page 11 of 72",
    };
  }

  if (f.includes("ddq")) {
    if (q.includes("david chen") || q.includes("cio") || q.includes("portfolio manager") || q.includes("founded")) return {
      section: "Section 2 — Key Personnel and Organizational Structure",
      before: "Ridgeline Capital Partners employs eleven full-time staff across investment, compliance, operations, and investor relations functions. The investment team consists of four professionals: the CIO, two senior research analysts (James Park and Sarah Kim), and a dedicated risk officer (Michael Torres). The compliance and legal team consists of the CCO (Linda Wu) and one compliance analyst. Operations, finance, and fund accounting are handled by a team of three, reporting to the CFO (Robert Ng). Investor relations is managed by one dedicated IR professional and one associate. All portfolio management, investment research, and final trading decisions are the exclusive responsibility of ",
      after: ", CFA, who serves as Chief Investment Officer, sole Portfolio Manager, and a Managing Member of the General Partner entity. Mr. Chen founded the firm in 2018 following nine years as a senior PM at a global macro fund. He maintains full investment discretion and there is currently no formal succession plan, documented deputy PM role, or contingency arrangement for the continuation of portfolio management in the event of Mr. Chen's extended unavailability. This key-man concentration has been acknowledged by the Adviser as a material operational risk. The General Partner has represented that it will establish a formal succession framework and consider hiring an additional senior PM during the 2026 fiscal year, pending AUM growth objectives being met.",
      pageLabel: "Page 5 of 44",
    };
    if (q.includes("northern trust") || q.includes("administrator") || q.includes("citco")) return {
      section: "Section 5 — Fund Administrator and Third-Party Service Providers",
      before: "The following is a complete listing of Ridgeline's material third-party service providers as of December 31, 2025. Fund Administrator: ",
      after: ", engaged since January 2021. Citco is responsible for all independent NAV calculations, investor capital account recordkeeping, anti-money laundering and know-your-customer compliance, subscription and redemption processing, and FATCA/CRS reporting. NAV calculations are performed monthly as of the last business day of each calendar month and are independently reconciled against prime broker statements. Citco issues capital account statements to all Limited Partners within 15 business days of each month-end. Legal Counsel: Simpson Thacher & Bartlett LLP (fund formation and ongoing); Davis Polk & Wardwell LLP (regulatory matters). Auditor: Ernst & Young LLP. Tax Advisor: KPMG LLP. Prime Brokers: Goldman Sachs Prime Services and Morgan Stanley Institutional Equity Services.",
      pageLabel: "Page 9 of 44",
    };
    if (q.includes("third-party") || q.includes("msp") || q.includes("it infrastructure")) return {
      section: "Section 8 — Technology Infrastructure and Cybersecurity Program",
      before: "Ridgeline's information technology environment comprises a combination of cloud-hosted SaaS applications and on-premises workstations. Core investment applications include Bloomberg Terminal (market data and analytics), Advent APX (portfolio accounting), SS&C Eze OMS (order management and compliance pre-trade checks), and FactSet (research and analysis). The firm does not maintain a dedicated Chief Information Security Officer (CISO). Cybersecurity governance is the responsibility of the CCO, supported by an engagement with ",
      after: " for ongoing monitoring, patch management, endpoint protection, and incident detection. The firm adopted a Written Information Security Policy (WISP) in 2022; however, this policy has not been formally updated since its adoption and predates the firm's migration to its current cloud architecture. A formal third-party penetration test has not been conducted within the past 24 months. The CCO has engaged a cybersecurity consultant to conduct a penetration test and WISP refresh, with both deliverables targeted for completion by Q2 2026. A formal written incident response plan is currently under development. The firm has not experienced a reportable cybersecurity incident as defined under applicable law during the current reporting period.",
      pageLabel: "Page 27 of 44",
    };
    return {
      section: "Section 4 — Operational Infrastructure and Capital Structure",
      before: "The following responses are provided on behalf of Ridgeline Capital Partners, LLC in connection with the operational due diligence review conducted by Alpine Asset Management in January 2026. All information is current as of December 31, 2025, unless otherwise specified. Section 4.3 — Fund-Level Leverage and Financing Arrangements: With respect to the question of whether the management company has any third-party financing, bank credit facilities, or institutional investors in the GP entity, the Adviser's response is as follows: ",
      after: ". The management company is funded entirely from management fee revenues and the personal capital of the founding principals. There are no third-party institutional investors in the General Partner entity, no bank credit lines drawn against management fee receivables, and no deferred compensation or revenue-sharing obligations to former employees or principals. The General Partner's operating expenses, including rent, technology, salaries, and professional fees, are funded exclusively from management fee income. Supporting documentation, including the most recent management company financial statements, is available for review by qualified investors upon written request to ir@ridgelinecap.com.",
      pageLabel: "Page 14 of 44",
    };
  }

  if (f.includes("compliance") || f.includes("code_of_ethics") || f.includes("ethics")) {
    if (q.includes("code of ethics") || q.includes("annual") || q.includes("distributed") || q.includes("acknowledged")) return {
      section: "Section 2 — Code of Ethics: Adoption, Distribution, and Certification",
      before: "Ridgeline Capital Partners has adopted a Code of Ethics (the \"Code\") pursuant to Rule 204A-1 under the Investment Advisers Act of 1940 and Rule 17j-1 under the Investment Company Act of 1940, as applicable. The Code sets forth the standards of business conduct and personal trading requirements applicable to all \"Access Persons\" of the firm, as defined in Section 1.1 of the Code. The ",
      after: " is distributed to all Access Persons upon commencement of employment or engagement and no less frequently than annually thereafter. Each Access Person is required to acknowledge receipt of the Code in writing and to certify their full compliance with its requirements within ten (10) calendar days of each distribution. The Chief Compliance Officer maintains a complete log of all Code acknowledgments and certifications, together with records of any reported violations, waivers granted, and disciplinary actions taken. These records are available for inspection by authorized regulatory examiners upon reasonable notice. Failure to timely certify compliance with the Code is treated as a material compliance deficiency and may result in formal disciplinary action, including termination of employment.",
      pageLabel: "Page 8 of 34",
    };
    if (q.includes("personal trading") || q.includes("pre-clearance")) return {
      section: "Section 4 — Personal Trading Policy and Pre-Clearance Requirements",
      before: "Section 4 of this Compliance Manual sets forth the firm's personal trading policy, which is designed to prevent potential conflicts of interest between an Access Person's personal investment activities and the firm's fiduciary obligations to its clients. All Access Persons are required to comply with the following requirements with respect to all \"Reportable Securities\" as defined in Rule 204A-1 and Section 1.1 of this Manual. Access Persons must obtain written ",
      after: " approval from the Chief Compliance Officer prior to executing any personal trade in a Reportable Security that is held in any client account, is being considered for purchase or sale for any client account, or is subject to a pending client order. Pre-clearance must be requested and documented through the firm's compliance management system and, once granted, remains valid for 48 hours from the time of approval. Access Persons are strictly prohibited from executing personal trades on any day during which a client order in the same security is pending or was executed. Pre-clearance will be automatically denied if the requested security is on the firm's restricted list. Violations of the personal trading policy must be self-reported to the CCO within 24 hours of discovery and are subject to mandatory disgorgement and potential disciplinary action.",
      pageLabel: "Page 14 of 34",
    };
    return {
      section: "Section 6 — Supervisory Procedures, Oversight, and Annual Review",
      before: "The Chief Compliance Officer bears primary responsibility for administering, enforcing, and periodically reviewing all compliance policies and procedures adopted by the firm pursuant to Rule 206(4)-7 under the Investment Advisers Act of 1940. Pursuant to Rule 206(4)-7, the firm is required to conduct a formal annual review of the adequacy and effectiveness of its compliance program. The annual review assesses whether the firm's policies and procedures are reasonably designed to prevent violations of applicable securities laws and regulations. The most recent annual compliance review was completed in December 2025. The annual review concluded that the firm's compliance program is generally adequate and effective, ",
      after: ". The CCO identified the following areas for enhancement during the 2026 period: (i) updating the Written Information Security Policy to reflect current technology infrastructure, (ii) completing a third-party penetration test, and (iii) formalizing a written succession plan for the Portfolio Manager role. Each annual review produces a written report summarizing material compliance events, regulatory developments, policy updates, and recommended enhancements to internal controls, which is presented to senior management within 60 days of fiscal year-end and retained in the firm's compliance records for a minimum of five years.",
      pageLabel: "Page 19 of 34",
    };
  }

  if (f.includes("financials") || f.includes("fy2024") || f.includes("audit")) {
    if (q.includes("ernst") || q.includes("ey") || q.includes("auditor")) return {
      section: "Independent Auditor's Report to the Partners",
      before: "To the Partners of Ridgeline Global Opportunities Fund, LP: We have audited the accompanying financial statements of Ridgeline Global Opportunities Fund, LP (the \"Fund\"), which comprise the statement of financial condition as of December 31, 2024, and the related statements of operations, changes in partners' capital, and cash flows for the year then ended. Management is responsible for the preparation and fair presentation of these financial statements in accordance with accounting principles generally accepted in the United States of America. These financial statements have been audited by ",
      after: ", LLP, an independent registered public accounting firm. We conducted our audit in accordance with auditing standards generally accepted in the United States of America. Those standards require that we plan and perform the audit to obtain reasonable assurance about whether the financial statements are free from material misstatement, whether due to error or fraud. In our opinion, the financial statements referred to above present fairly, in all material respects, the financial position of the Fund as of December 31, 2024, and the results of its operations and its cash flows for the year then ended.",
      pageLabel: "Page 2 of 28",
    };
    if (q.includes("t+3") || q.includes("reconciliation") || q.includes("t+1")) return {
      section: "Note 7 — Trade Settlement, Reconciliation, and Operational Controls",
      before: "The Fund settles equity and equity-linked securities transactions on a standard ",
      after: " settlement basis in accordance with market convention and applicable exchange rules. Fixed income securities settle on T+1 or T+2 depending on instrument type and trading venue. The Fund Administrator, Citco Fund Services, performs an independent daily reconciliation of the Fund's holdings, cash positions, and margin balances against prime broker statements. Any reconciliation breaks or discrepancies are escalated to the CFO within four business hours and reported to the CCO at the end of each business day. As of December 31, 2024, there were no unresolved reconciliation breaks that had remained open for a period exceeding 30 calendar days. All significant reconciliation exceptions identified during the fiscal year were resolved within three business days of identification.",
      pageLabel: "Page 17 of 28",
    };
    return {
      section: "Note 2 — Summary of Significant Accounting Policies",
      before: "The following notes form an integral part of the financial statements and should be read in conjunction therewith. Note 1 — Organization: Ridgeline Global Opportunities Fund, LP (the \"Fund\") is a Delaware limited partnership formed on January 4, 2018. The Fund's principal business objective is to achieve capital appreciation through a global equity long/short investment strategy with opportunistic allocations to credit and macro instruments. Note 2 — Basis of Presentation: ",
      after: ". The Fund's fiscal year ends December 31. These financial statements have been prepared on a going-concern basis. Comparative figures for the year ended December 31, 2023 have been restated where necessary to conform to the current year's presentation. Note 3 — Significant Estimates: The preparation of financial statements in conformity with U.S. GAAP requires management to make estimates and assumptions that affect the reported amounts of assets, liabilities, revenues, and expenses. The most significant estimates involve the fair valuation of Level 3 portfolio securities. As of December 31, 2024, Level 3 assets represented approximately 3.2% of total net asset value.",
      pageLabel: "Page 5 of 28",
    };
  }

  if (f.includes("bcp")) return {
    section: "Section 4 — Recovery Objectives and Continuity Procedures",
    before: "Ridgeline Capital Partners has established the following Recovery Time Objectives (RTO) and Recovery Point Objectives (RPO) for each critical business function in the event of a significant business disruption: RTO for core trading systems is 4 hours; RTO for fund accounting and NAV calculation is 8 hours; RPO for investor data and capital account records is 24 hours; RPO for trade records and position data is 1 hour. The firm's primary backup site is located at a colocation facility in Secaucus, NJ. All critical data is replicated to the backup site on a near-real-time basis using encrypted data synchronization. With respect to the overall continuity testing and review program: ",
    after: ". The most recent tabletop business continuity exercise was conducted in October 2025 and included participation from the CIO, CFO, CCO, and Operations team. The exercise tested the firm's ability to transition to the backup site following a simulated primary office outage and identified two process gaps, both of which have since been remediated. The BCP is reviewed and updated at least annually by the CCO with input from all department heads.",
    pageLabel: "Page 11 of 22",
  };

  if (f.includes("valuation")) {
    if (q.includes("quarterly") || q.includes("valuation committee")) return {
      section: "Article III — Valuation Committee: Composition, Authority, and Meeting Procedures",
      before: "The Valuation Committee has been established by the General Partner to oversee the fair valuation of all portfolio positions and to ensure that the Fund's NAV calculations comply with applicable accounting standards and the Fund's valuation policy. The Committee convenes on a ",
      after: " basis, typically within 5 business days following each calendar quarter-end, to review and ratify the fair valuation of all Level 2 and Level 3 portfolio positions requiring significant estimation or management judgment. The Valuation Committee is composed of the following members: (i) David Chen, CFA (CIO, non-voting chair), (ii) Robert Ng (CFO, voting member), (iii) Linda Wu (CCO, voting member), and (iv) an independent external valuation consultant retained from Duff & Phelps, LLC (voting member). A quorum for the conduct of any Valuation Committee meeting requires the attendance of at least three members, including the CCO and the independent consultant. All Valuation Committee determinations are documented in meeting minutes prepared by the CCO within 3 business days of each meeting.",
      pageLabel: "Page 7 of 18",
    };
    return {
      section: "Section 2 — Valuation Hierarchy, Fair Value Measurement, and Governance",
      before: "The Fund measures and reports the fair value of portfolio securities in accordance with ASC 820 (Fair Value Measurement) and GAAP. The Fund employs a three-tier valuation hierarchy: Level 1 assets are valued using unadjusted quoted prices in active markets; Level 2 assets are valued using observable inputs other than Level 1 prices; Level 3 assets are valued using unobservable inputs and require formal Valuation Committee approval. The following governance requirements apply to all fair value determinations made under this Policy. As set forth in Section 2.1 of this Valuation Policy: ",
      after: ". All Level 3 valuations must be independently reviewed by the Fund's Administrator prior to inclusion in the NAV calculation. For any Level 3 position representing 5% or more of the Fund's net asset value, an independent third-party valuation conducted by the external valuation consultant is required on at least an annual basis. The Investment Adviser is expressly prohibited from overriding a Valuation Committee determination without documented escalation to the full Committee.",
      pageLabel: "Page 4 of 18",
    };
  }

  if (f.includes("org_chart")) return {
    section: "Organizational Chart and Reporting Lines — November 2025",
    before: "The following organizational chart illustrates Ridgeline Capital Partners' current organizational structure, headcount, and reporting relationships as of November 2025. The firm currently employs eleven full-time staff and two part-time contractors. Investment Team (4 FTE): David Chen, CFA (CIO / Portfolio Manager), James Park (Senior Research Analyst, Equities), Sarah Kim (Senior Research Analyst, Credit), Michael Torres (Risk Officer). Compliance & Legal (2 FTE): Linda Wu, JD (CCO / General Counsel), Jessica Lin (Compliance Analyst). Finance & Operations (3 FTE): Robert Ng, CPA (CFO), David Kim (Fund Accountant), Alex Johnson (Operations Analyst). Investor Relations (2 FTE): Megan Park (Head of IR), Ryan Lee (IR Associate). Reporting structure: ",
    after: ". The Chief Compliance Officer and Chief Financial Officer maintain dual reporting lines to both the Portfolio Manager and the General Partner entity to preserve compliance independence. The General Partner does not currently have a formal Chief Operating Officer or Chief Risk Officer role; operational oversight is shared between the CFO and CCO. The two part-time contractors support technology infrastructure and office administration, respectively.",
    pageLabel: "Page 1 of 2",
  };

  if (f.includes("iapd_record")) return {
    section: "Registration Summary",
    before: "Investment Adviser Public Disclosure — IAPD Report generated April 16, 2026. Firm Name: Ridgeline Capital Partners, LLC. Main Office: 245 Park Avenue, Suite 3200, New York, NY 10167. Registration Status: REGISTERED. Registered as an investment adviser with the U.S. Securities and Exchange Commission. Registration effective April 14, 2018. CRD / NRD Number: 298741. SEC File Number: 801-113724. This record reflects the most recent information reported by the firm on Form ADV filed March 14, 2025. Alpine ODD team confirmed registration status via direct IAPD query on January 6, 2026. Alpine verification note: ",
    after: ". The firm's CRD record shows no reportable disciplinary events, regulatory actions, civil proceedings, or criminal matters involving any principal, control person, or supervised person. The most recent SEC examination was conducted in October 2023 and resulted in no deficiency findings. Firm has been registered continuously since April 2018 with no lapses in registration status.",
    pageLabel: "IAPD Record · Page 1 of 3",
  };

  if (f.includes("admin_verification_record")) return {
    section: "Net Asset Value and AUM Confirmation",
    before: "Citco Fund Services (Ireland) Limited — Third-Party Administrator Verification Letter. Re: Ridgeline Global Opportunities Fund, LP — Administrator Confirmation of NAV and AUM as of December 31, 2025. Date: January 22, 2026. As of December 31, 2025, Citco has calculated and confirmed the following: ",
    after: ". The net asset value per share for Class A (USD) as of December 31, 2025 is $1,842.17, representing a 12.4% net return for the calendar year. All calculations are performed in accordance with the valuation policies set forth in the Fund's Limited Partnership Agreement. Citco confirms that NAV calculations have been performed on a monthly basis throughout 2025 with no material restatements.",
    pageLabel: "Citco Verification · Page 1 of 4",
  };

  if (f.includes("alpine_analysis_record")) return {
    section: "Alpine ODD — Cross-Reference Finding",
    before: "Alpine Due Diligence Inc. — Internal Cross-Reference Analysis. ODD Engagement: Ridgeline Capital Partners, LLC. Prepared by: ODD Review Team. Date: January 2026. This note summarizes Alpine's internal analysis based on a review of all submitted documents, the management interview conducted January 15, 2026, and publicly available information. Alpine cross-reference finding: ",
    after: ". This observation has been incorporated into the relevant section of the ODD report. All findings are subject to review by the ODD team lead prior to inclusion in the final report.",
    pageLabel: "Alpine Analysis · Page 1",
  };

  if (f.includes("manager_call_record")) return {
    section: "Management Interview Notes",
    before: "Alpine Due Diligence Inc. — Management Interview Notes. ODD Engagement: Ridgeline Capital Partners, LLC. Interview Date: January 15, 2026, 10:00am – 12:30pm EST. Attendees (Manager): David Chen CFA (CIO/PM), Linda Wu JD (CCO/General Counsel). Format: Video conference. These notes represent a summary of the discussion. ",
    after: ". Alpine noted the response and requested documentation as a follow-up item. Compliance Infrastructure: Ms. Wu confirmed the firm does not currently use an automated pre-trade compliance system. Alpine's assessment is that this is a material gap and has been documented as a HIGH-severity risk observation.",
    pageLabel: "Call Notes · Page 1 of 3",
  };

  if (f.includes("pentest_jan2026_record") || f.includes("pen_test") || f.includes("pentest")) return {
    section: "Executive Summary",
    before: "Kroll Cyber Risk — Penetration Testing Services. Client: Ridgeline Capital Partners, LLC. Engagement Type: External Network and Application Penetration Test. Engagement Dates: January 6–28, 2026. Scope: External network perimeter, web-facing applications, Microsoft 365 environment, and simulated phishing assessment. Report Date: January 28, 2026. Overall Finding: ",
    after: ". Two medium-severity and four low-severity findings were identified. No exploitable critical vulnerabilities were found in the external attack surface. The investor portal was tested against OWASP Top 10 vulnerabilities; no injection, authentication bypass, or session management vulnerabilities were identified. Microsoft 365 environment shows adequate security posture with MFA enforced for all accounts.",
    pageLabel: "Kroll Pen Test Report · Page 1 of 18",
  };

  return {
    section: "Document Reference — Alpine Due Diligence File",
    before: "The following passage has been extracted from the referenced source document maintained in Alpine Asset Management's operational due diligence file for Ridgeline Capital Partners. This document has been provided by the Manager or its authorized representatives and reflects information as of the date stated on the document cover. Alpine has reviewed this document in connection with its ongoing ODD program but has not independently verified all factual representations contained herein except as specifically noted in the accompanying ODD report. This document is maintained as part of a complete due diligence file that includes, among other materials, fund offering documents, audited financial statements, regulatory filings, service provider contracts, and prior ODD correspondence. The specific passage cited in the ODD analysis states: ",
    after: ". Investors and Alpine personnel are reminded that this document is proprietary and confidential. It may not be reproduced, redistributed, or disclosed to third parties without the prior written consent of Ridgeline Capital Partners. Please refer to the complete source document for full context, all defined terms, and applicable disclaimers and limitations.",
    pageLabel: "Page 1",
  };
}

function buildDocMeta(filename: string, label: string): { title: string; subtitle: string; date: string; badge: string } {
  const f = filename.toLowerCase();
  if (f.includes("form_adv")) return { title: "Form ADV Part 2A", subtitle: "Ridgeline Capital Partners, LLC", date: "Filed March 14, 2025", badge: "Regulatory" };
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
  if (f.includes("admin_verification_record")) return { title: "Citco Fund Services — Administrator Verification", subtitle: "Ridgeline Global Opportunities Fund, LP", date: "Verification Date: January 22, 2026", badge: "Third-Party" };
  if (f.includes("alpine_analysis_record")) return { title: "Alpine ODD — Internal Cross-Reference Analysis", subtitle: "Ridgeline Capital Partners, LLC · ODD Review Jan 2026", date: "Prepared January 2026", badge: "Alpine Analysis" };
  if (f.includes("manager_call_record")) return { title: "Manager Due Diligence Call — Interview Notes", subtitle: "Ridgeline Capital Partners, LLC · David Chen & Linda Wu", date: "Call Date: January 15, 2026", badge: "Manager Interview" };
  if (f.includes("pentest_jan2026_record") || f.includes("pen_test") || f.includes("pentest")) return { title: "Penetration Test Summary — January 2026", subtitle: "Ridgeline Capital Partners, LLC · Conducted by Kroll Cyber", date: "January 28, 2026", badge: "Cybersecurity" };
  return { title: label, subtitle: "Ridgeline Capital Partners, LLC", date: "2025", badge: "Document" };
}

function DocViewerPanel({ filename, quote, label, onClose }: {
  filename: string; quote: string; label: string; onClose: () => void;
}) {
  useEffect(() => {
    function handleEsc(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const docMeta = buildDocMeta(filename, label);
  const { before, after, section, pageLabel } = buildPassage(quote, filename);

  return (
    <>
      <div className="fixed inset-0 z-[299] bg-black/40" onClick={onClose} />
      <div
        className="fixed top-0 left-0 bottom-0 z-[300] flex flex-col"
        style={{ width: "min(680px, 54vw)", background: "#0f1117", borderRight: "1px solid rgba(255,255,255,0.08)", boxShadow: "8px 0 40px rgba(0,0,0,0.6)", animation: "slideInLeft 0.22s ease-out" }}
      >
        {/* Panel header */}
        <div style={{ background: "#161820", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "12px 18px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
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
            <button onClick={onClose} style={{ color: "#6b7280", fontSize: 18, lineHeight: 1, padding: "0 4px", background: "none", border: "none", cursor: "pointer" }}>&times;</button>
          </div>
        </div>

        {/* Scrollable body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 32px" }}>
          {/* Document page */}
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
            ) : (filename === "pentest_jan2026_record" || filename.includes("pen_test") || filename.includes("pentest")) ? (
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
              {/* Left margin stripe */}
              <div style={{ width: 40, flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ width: 3, background: "#f59e0b", borderRadius: 2, alignSelf: "stretch", marginTop: 68, opacity: 0.85 }} />
              </div>
              {/* Main text */}
              <div style={{ flex: 1, paddingRight: 32 }}>
                <div style={{ borderBottom: "2px solid #1e3a5f", paddingBottom: 12, marginBottom: 20 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#111827", lineHeight: 1.3 }}>{docMeta.title}</div>
                  <div style={{ fontSize: 10.5, color: "#6b7280", marginTop: 3 }}>{docMeta.subtitle} &nbsp;·&nbsp; {docMeta.date}</div>
                </div>
                <div style={{ fontSize: 9.5, fontWeight: 700, color: "#1e3a5f", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 14, paddingBottom: 6, borderBottom: "1px solid #e5e7eb" }}>{section}</div>
                <p style={{ fontSize: 12, lineHeight: 1.9, color: "#1f2937", margin: 0, textAlign: "justify" }}>
                  {before}<mark style={{ background: "#ffec3d", color: "#111", borderRadius: "1px", padding: "1px 1px", fontWeight: "inherit", fontStyle: "inherit", fontSize: "inherit", WebkitBoxDecorationBreak: "clone" as const, boxDecorationBreak: "clone" as const }}>{quote}</mark>{after}
                </p>
              </div>
            </div>
            {/* Page footer */}
            <div style={{ background: "#f9fafb", borderTop: "1px solid #e5e7eb", padding: "8px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 9, color: "#9ca3af", fontFamily: "sans-serif" }}>{docMeta.subtitle}</span>
              <span style={{ fontSize: 9, color: "#9ca3af", fontFamily: "sans-serif" }}>{pageLabel}</span>
            </div>
          </div>
          {/* Actions */}
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <button onClick={() => downloadDemoFile(filename)} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "9px 16px", fontSize: 11, fontWeight: 500, color: "#34d399", background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)", borderRadius: 8, cursor: "pointer", fontFamily: "sans-serif" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
              Download PDF
            </button>
            <button onClick={() => { const u = getDemoFileUrl(filename); if (u) window.open(u, "_blank"); }} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "9px 16px", fontSize: 11, fontWeight: 500, color: "#9ca3af", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, cursor: "pointer", fontFamily: "sans-serif" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" /><line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" /></svg>
              Open Full PDF
            </button>
          </div>
        </div>
      </div>
      <style>{`@keyframes slideInLeft { from { transform: translateX(-100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>
    </>
  );
}

function RefPopover({ info, onClose }: { info: RefPopoverState; onClose: () => void }) {
  const [docViewer, setDocViewer] = useState<{ filename: string; quote: string; label: string } | null>(null);
  const popRef = useRef<HTMLDivElement>(null);
  const meta = SOURCE_META[info.source] || { label: info.source.replace(/_/g, " ").replace(".pdf", "").replace(/\b\w/g, (c) => c.toUpperCase()), type: "Source" };
  const dotColor = SOURCE_DOT_COLORS[info.source] || (info.source.endsWith(".pdf") ? PDF_DOT_COLOR : PDF_DOT_COLOR);

  useEffect(() => {
    if (docViewer) return;
    function handleClick(e: MouseEvent) {
      if (popRef.current && !popRef.current.contains(e.target as Node)) onClose();
    }
    function handleEsc(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [onClose, docViewer]);

  if (docViewer) {
    return (
      <DocViewerPanel
        filename={docViewer.filename}
        quote={docViewer.quote}
        label={docViewer.label}
        onClose={() => { setDocViewer(null); onClose(); }}
      />
    );
  }

  return (
    <div
      ref={popRef}
      className="fixed z-[300] w-[380px] bg-br-card rounded-xl shadow-2xl border border-br overflow-hidden"
      style={{ top: info.top, left: info.left, animation: "popoverIn 0.15s ease-out" }}
    >
      <div className="px-4 py-2.5 bg-br-surface border-b border-br flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: dotColor }} />
          <div className="min-w-0">
            <span className="text-[11px] font-medium text-br-text-primary block truncate">{meta.label}</span>
            <span className="text-[9px] text-br-text-muted">{meta.type}</span>
          </div>
        </div>
        <button onClick={onClose} className="text-br-text-muted hover:text-br-text-primary text-sm px-1">&times;</button>
      </div>
      <div className="px-4 py-3">
        <p className="text-[10px] text-br-text-muted uppercase tracking-wider mb-1.5 font-medium">Exact Source Text</p>
        <div className="text-[11px] leading-relaxed text-br-text-secondary bg-amber-500/8 border-l-2 border-amber-400/40 pl-3 py-2 rounded-r">
          <span className="italic">&ldquo;{info.quote}&rdquo;</span>
        </div>
      </div>
      <div className="px-4 pb-3 flex gap-2">
        {meta.filename ? (
          <>
            <button
              onClick={() => setDocViewer({ filename: meta.filename!, quote: info.quote, label: meta.label })}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-[11px] font-medium text-br-text-primary bg-br-surface border border-br rounded-lg hover:bg-br-card-hover transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" />
                <line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" />
              </svg>
              View Document
            </button>
            <button
              onClick={() => { if (meta.filename) downloadDemoFile(meta.filename); }}
              className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg hover:bg-emerald-500/20 transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download {meta.size && <span className="text-br-text-muted ml-0.5">({meta.size})</span>}
            </button>
          </>
        ) : (
          <div className="text-[10px] text-br-text-muted italic">
            {info.source === "SEC_EDGAR" ? "Verified via SEC EDGAR IAPD — CRD# 298741" :
             info.source === "MANAGER_CALL" ? "Due diligence call conducted January 15, 2026" :
             info.source === "ADMIN_VERIFICATION" ? "Verification request sent January 22, 2026" :
             "Alpine internal cross-reference analysis"}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Trellis Reference Data ────────────────────────────────────────────────────

// Maps "label" → { source key for SOURCE_META, quote from source document }
const TRELLIS_ROW_META: Record<string, { source: string; quote: string }> = {
  // Manager, Ownership & Governance — Form ADV
  "Manager name":                       { source: "trellis_form_adv.pdf",   quote: "The registrant's legal name is Trellis Capital Management, LLC, organized as a Limited Liability Company under the laws of the State of Delaware." },
  "Date of formation":                  { source: "trellis_form_adv.pdf",   quote: "The registrant was formed on August 19, 2018, and commenced investment advisory operations in Q1 2019 upon the initial closing of Fund I." },
  "Legal structure":                    { source: "trellis_form_adv.pdf",   quote: "Trellis Capital Management, LLC is organized as a Limited Liability Company. The registrant is not publicly traded." },
  "Publicly traded":                    { source: "trellis_form_adv.pdf",   quote: "The registrant is not publicly traded and has no parent organization that is publicly traded." },
  "Primary location":                   { source: "trellis_form_adv.pdf",   quote: "The principal office and place of business is located at 535 Mission Street, Suite 1400, San Francisco, CA 94105." },
  "Co-Founder & Managing Partner":      { source: "trellis_form_adv.pdf",   quote: "Arjun Mehta (Co-Founder, Managing Partner) — previously a Principal at Founder Collective. Education: Software Engineering, University of Waterloo; MBA, Harvard Business School. Priya Sharma (Co-Founder, Managing Partner) — previously a Partner at Foundation Capital; founding Product Manager at Twitter." },
  "Total AUM (net assets)":             { source: "trellis_form_adv.pdf",   quote: "As of December 31, 2025, the registrant manages regulatory assets under management of approximately $280.3 million on a discretionary basis, plus $113.7 million in uncalled capital commitments." },
  "Uncalled capital":                   { source: "trellis_form_adv.pdf",   quote: "Total uncalled capital commitments across all funds managed by the registrant are approximately $113.7 million as of December 31, 2025." },
  "Capital held by largest investor":   { source: "Trellis-Capital-IV-ILPA-DDQ-2.0.pdf", quote: "The single largest investor accounts for approximately 20.00% of total commitments to Trellis Capital IV, L.P. as of the date of this questionnaire." },
  "Capital held by 5 largest investors":{ source: "Trellis-Capital-IV-ILPA-DDQ-2.0.pdf", quote: "The five largest investors collectively hold approximately 37.00% of total commitments to the Fund as of the date of this questionnaire." },
  "Internal investors":                 { source: "trellis_form_adv.pdf",   quote: "Arjun Mehta holds a 50.00% equity ownership interest in the registrant. Priya Sharma holds a 50.00% equity ownership interest in the registrant. No other persons hold a 5% or greater ownership interest." },
  "Controlling equity interest":        { source: "trellis_form_adv.pdf",   quote: "No single person holds a controlling equity interest in the registrant. Ownership is held equally between the two Managing Partners." },
  "Insider investment (committed)":     { source: "trellis_lpa.pdf",        quote: "The General Partner has committed $2.77 million to the Fund, representing approximately 1% of total commitments, consistent with the pari passu GP commitment structure set forth in Section 4.2 of the Agreement." },
  "Total headcount":                    { source: "Trellis-Capital-IV-ILPA-DDQ-2.0.pdf", quote: "As of the date of this questionnaire, the Firm employs 7 full-time professionals, comprising 6 investment professionals and 1 operations/administrative professional." },
  "Investment professionals":           { source: "Trellis-Capital-IV-ILPA-DDQ-2.0.pdf", quote: "The Firm employs 6 investment professionals, including the two Managing Partners, 1 Principal, 1 Associate, 1 Analyst, and 1 Chief Portfolio Officer (departure planned Summer 2026)." },
  "Back office professionals":          { source: "Trellis-Capital-IV-ILPA-DDQ-2.0.pdf", quote: "The Firm employs 1 non-investment professional: Sarah Collins (Head of Operations), whose responsibilities focus on business operations and executive support for the Managing Partners." },
  "Part-time / consultants":            { source: "Trellis-Capital-IV-ILPA-DDQ-2.0.pdf", quote: "The Firm has engaged Raj Patel as a part-time fractional CFO/COO, expected to commence substantive engagement in Summer 2026. James Crawford serves as independent deal counsel on an ad hoc per-transaction basis." },
  "Employees are related/married":      { source: "Trellis-Capital-IV-ILPA-DDQ-2.0.pdf", quote: "No employees of the Firm are related by family or marriage to one another." },
  // Legal, Regulatory & Compliance — Form ADV / SEC EDGAR / Compliance Binder
  "SEC registration":                   { source: "SEC_EDGAR",              quote: "Trellis Capital Management, LLC is registered as an Exempt Reporting Adviser (ERA) with the U.S. Securities and Exchange Commission under the venture capital fund adviser exemption pursuant to Rule 203(l)-1 of the Investment Advisers Act of 1940." },
  "Regulatory sanctions (past ten years)": { source: "SEC_EDGAR",          quote: "SEC EDGAR IAPD records reflect no regulatory sanctions, disciplinary events, or enforcement actions with respect to the registrant or any of its principals within the past ten years." },
  "Non-routine regulatory correspondence (past five years)": { source: "SEC_EDGAR", quote: "The registrant reports no non-routine correspondence with any regulatory authority during the past five years. The registrant has not been subject to an SEC examination during this period." },
  "Compliance officer":                 { source: "Trellis-Capital-Compliance-Binder-2025.pdf", quote: "Priya Sharma, Co-Founder and Managing Partner, has been designated as the Firm's Chief Compliance Officer. Ms. Sharma oversees compliance matters in addition to her investment responsibilities." },
  "Compliance consultant":              { source: "Trellis-Capital-Compliance-Binder-2025.pdf", quote: "Summit Advisory Partners has been engaged on a limited basis to assist with the preparation of the Firm's annual Form ADV amendment filing. No broader compliance consulting mandate is currently in place." },
  "Compliance manual":                  { source: "Trellis-Capital-Compliance-Binder-2025.pdf", quote: "The Firm maintains a Compliance Manual, last updated March 2025, which sets forth policies and procedures designed to comply with the Firm's obligations as an Exempt Reporting Adviser." },
  "Compliance officer outsourced":      { source: "Trellis-Capital-Compliance-Binder-2025.pdf", quote: "The Chief Compliance Officer function is not outsourced to a third party. Ms. Priya Sharma performs the CCO role internally as part of her responsibilities." },
  "SOC 1 / external controls report":   { source: "Trellis-Capital-Compliance-Binder-2025.pdf", quote: "The Firm has not obtained a SOC 1 or equivalent external controls assessment report as of the date of this binder." },
  "Initial attestation to compliance policies": { source: "Trellis-Capital-Compliance-Binder-2025.pdf", quote: "The Firm does not currently require new hires to attest to compliance policies upon hire. There is no formal onboarding compliance attestation process in place." },
  "Annual recertification":             { source: "Trellis-Capital-Compliance-Binder-2025.pdf", quote: "No annual compliance policy recertification or attestation program has been implemented to date. Staff are expected to be familiar with the Compliance Manual on an ongoing basis." },
  "Annual compliance training":         { source: "Trellis-Capital-Compliance-Binder-2025.pdf", quote: "The Firm has not implemented a formal annual compliance training program. Compliance matters are addressed on an ad hoc basis by the Chief Compliance Officer as needed." },
  "Written personal trading policy":    { source: "Trellis-Capital-Compliance-Binder-2025.pdf", quote: "The Firm's Compliance Manual contains a brief section on personal trading; however, a standalone written personal trading policy document has not been adopted." },
  // Technology — Alpine Analysis
  "Technology consultant":              { source: "ALPINE_ANALYSIS",        quote: "Alpine confirmed with Firm management that no dedicated IT consultant or managed service provider is currently engaged. IT matters are handled on an as-needed basis by the Head of Operations." },
  "IT infrastructure model":            { source: "ALPINE_ANALYSIS",        quote: "The Firm operates a fully cloud-based IT environment with no on-premise server infrastructure. Primary tools include Google Workspace, Slack, and a proprietary Retool-based deal pipeline dashboard." },
  "Dedicated IT personnel":             { source: "ALPINE_ANALYSIS",        quote: "The Firm does not employ dedicated IT personnel. Technology-related issues are managed by the Head of Operations with ad hoc external vendor support as required." },
  "Cybersecurity policy":               { source: "ALPINE_ANALYSIS",        quote: "Alpine confirmed with the Head of Operations that no formal written cybersecurity policy currently exists. The Firm is in the process of identifying a third-party cybersecurity vendor to develop a policy by end of 2026." },
  "Third-party cybersecurity framework":{ source: "ALPINE_ANALYSIS",        quote: "The Firm has not adopted a recognized third-party cybersecurity framework (e.g., NIST CSF, SOC 2, ISO 27001). This was confirmed through direct inquiry with the Head of Operations during the review." },
  "Annual cybersecurity training / phishing": { source: "ALPINE_ANALYSIS",  quote: "No annual cybersecurity training program or phishing simulation exercise has been implemented to date. The planned cybersecurity vendor engagement is expected to include an employee training component." },
  "Formal incident response plan":      { source: "ALPINE_ANALYSIS",        quote: "The Firm does not have a documented formal incident response plan as of the date of this review. Management acknowledged this gap and cited it as an area to be addressed through the planned cybersecurity vendor engagement." },
  "Endpoint data loss prevention":      { source: "ALPINE_ANALYSIS",        quote: "No endpoint data loss prevention (DLP) solution has been implemented. The Firm relies on cloud provider-native controls and manual procedures for data protection." },
  "Network penetration testing":        { source: "ALPINE_ANALYSIS",        quote: "The Firm has not conducted a formal network penetration test to date. The planned cybersecurity vendor engagement is expected to include a vulnerability assessment and penetration test." },
  "Baseline network security (firewall, anti-virus)": { source: "ALPINE_ANALYSIS", quote: "Baseline network security controls are in place, including endpoint anti-virus software and firewall protection enabled through the Firm's cloud-based infrastructure providers." },
  "Multi-factor authentication":        { source: "ALPINE_ANALYSIS",        quote: "Multi-factor authentication (MFA) has been implemented for key applications including Google Workspace and the Firm's banking platform. MFA has not been universally rolled out across all systems." },
  "Cybersecurity breach in past year":  { source: "ALPINE_ANALYSIS",        quote: "Management confirmed that the Firm has not experienced a material cybersecurity incident or data breach in the twelve months preceding this review." },
  "Business continuity plan":           { source: "ALPINE_ANALYSIS",        quote: "The Firm does not maintain a written Business Continuity Plan or Disaster Recovery Plan as of the date of this review." },
  "BCP enacted in past year":           { source: "ALPINE_ANALYSIS",        quote: "No BCP activation event or business continuity test exercise has been conducted in the past twelve months. The Firm has not formally tested its resilience to operational disruptions." },
  "Remote work capability":             { source: "ALPINE_ANALYSIS",        quote: "All Firm personnel are capable of performing their functions remotely, as the Firm's IT environment is fully cloud-based. Remote work was practiced during the COVID-19 pandemic without material operational disruption." },
  // Fund Structure — LPA / PPM
  "Domicile":                           { source: "trellis_lpa.pdf",        quote: "Trellis Capital IV, L.P. is organized as a limited partnership under the laws of the State of Delaware pursuant to the Delaware Revised Uniform Limited Partnership Act." },
  "Date of incorporation":              { source: "trellis_lpa.pdf",        quote: "The Partnership was formed on March 28, 2026, as evidenced by the Certificate of Limited Partnership filed with the Delaware Secretary of State." },
  "Commencement of operations":         { source: "trellis_ppm.pdf",        quote: "The Fund has not yet commenced investment operations as of the date of this Memorandum. The initial closing was held on April 1, 2026; investment activity is anticipated to commence in late 2026." },
  "Asset class":                        { source: "trellis_ppm.pdf",        quote: "The Fund will invest primarily in pre-seed stage technology companies in exchange for equity or equity-linked instruments. The Fund is classified as a venture capital fund for regulatory purposes." },
  "Structure":                          { source: "trellis_lpa.pdf",        quote: "The Fund is organized as a standalone Delaware limited partnership. There are no affiliated parallel funds or feeder vehicles in connection with this offering." },
  "General Partner":                    { source: "trellis_lpa.pdf",        quote: "Trellis Capital GP IV, LLC, a Delaware limited liability company, serves as the General Partner of the Partnership and is solely responsible for the management, operation, and investment activities of the Fund." },
  "Offering document date":             { source: "trellis_ppm.pdf",        quote: "This Private Placement Memorandum is dated January 1, 2026. Prospective investors should review carefully all updates and supplements hereto prior to making any investment decision." },
  "Board at fund level":                { source: "trellis_lpa.pdf",        quote: "The Partnership does not have a Board of Directors at the fund level. Management authority is vested exclusively in the General Partner pursuant to Section 5 of this Agreement." },
  "LPAC":                               { source: "trellis_lpa.pdf",        quote: "Section 9.4 of this Agreement provides for the establishment of a Limited Partner Advisory Committee; however, such committee shall only be constituted at the discretion of the General Partner if requested by multiple Limited Partners with significant commitments." },
  "Minimum commitment":                 { source: "trellis_lpa.pdf",        quote: "The minimum capital commitment for a Limited Partner is $1,000,000, subject to reduction at the discretion of the General Partner in its sole and absolute discretion." },
  "GP commitment":                      { source: "trellis_lpa.pdf",        quote: "The General Partner shall make a capital commitment to the Fund equal to at least 1.01% of total aggregate capital commitments, invested pari passu alongside Limited Partners in all Portfolio Investments." },
  "First closing":                      { source: "trellis_lpa.pdf",        quote: "The initial closing of the Partnership was held on April 1, 2026, with aggregate capital commitments of approximately $125 million from the initial group of Limited Partners." },
  // Service Providers — Apex Service Description
  "Fund administrator":                 { source: "Trellis-Capital-Apex-Service-Description-Fund-III.pdf", quote: "Apex Fund Services, LLC has been engaged as the Fund's third-party administrator, responsible for fund accounting, investor reporting, capital call and distribution calculations, and maintenance of the official books of record." },
  "Auditor":                            { source: "Trellis-Capital-Apex-Service-Description-Fund-III.pdf", quote: "Baker, Thompson & Co. LLP serves as the independent auditor to the Fund. The auditor conducts annual audits in accordance with U.S. GAAP and issues confirmations to a sample of portfolio companies." },
  "Fund legal counsel":                 { source: "trellis_lpa.pdf",        quote: "Hartwell & Sterling LLP serves as legal counsel to the Fund in connection with the formation, offering, and ongoing legal matters." },
  "Banking relationship":               { source: "Trellis-Capital-Apex-Service-Description-Fund-III.pdf", quote: "The Fund maintains its primary banking relationship with Pacific Commerce Bank. Apex administers cash movements through the bank's online wire initiation system, with release authorization required from a Managing Partner." },
  "Capital account system":             { source: "Trellis-Capital-Apex-Service-Description-Fund-III.pdf", quote: "Apex maintains the official accounting records and capital account statements for all Limited Partners of the Fund using the Xero accounting platform." },
  // Investment Operations — Alpine Analysis / DDQ
  "Portfolio management system":        { source: "ALPINE_ANALYSIS",        quote: "The Firm uses a proprietary Retool-based dashboard for deal pipeline management and an Excel workbook for financial metrics monitoring across portfolio companies." },
  "Internal accounting records":        { source: "ALPINE_ANALYSIS",        quote: "The Firm does not maintain internal investor-level accounting records or track individual cash balances. Apex is solely responsible for maintaining the books of record." },
  "Allocation policy":                  { source: "ALPINE_ANALYSIS",        quote: "The Firm does not maintain a formal written investment allocation policy separate from the disclosures contained in the LPA and PPM." },
  "Cash controls":                      { source: "Trellis-Capital-Apex-Service-Description-Fund-III.pdf", quote: "All wire transfers are initiated by Apex Fund Services through Pacific Commerce Bank's online banking platform and require independent release authorization from one of the Fund's Managing Partners prior to execution." },
  // Valuation — Valuation Policy
  "Valuation approach":                 { source: "Trellis-Capital-Valuation-Policy.pdf", quote: "Portfolio investments are initially valued at the cost of acquisition. The Firm marks investments up or down to reflect the price per share established in a subsequent financing round in which a significant new investor has participated at arm's length." },
  "Valuation frequency":                { source: "Trellis-Capital-Valuation-Policy.pdf", quote: "Valuations are prepared on a quarterly basis for the purpose of producing investor capital account statements. Valuations are reviewed and approved by the Managing Partners." },
  "Valuation committee":                { source: "Trellis-Capital-Valuation-Policy.pdf", quote: "The Firm has not established a formal valuation committee as of the date of this policy. Valuation approvals are made by the Managing Partners without independent committee oversight." },
  "Asset verification":                 { source: "Trellis-Capital-Apex-Service-Description-Fund-III.pdf", quote: "Portfolio company ownership is evidenced through share certificates maintained on the Carta capitalization table platform. Apex receives all investment documents and wire instructions from the Firm and independently verifies wire details with portfolio companies prior to initiating transfers." },
};

const TRELLIS_REF_SECTIONS = [
  {
    title: "1. Manager, Ownership & Governance",
    groups: [
      { heading: "Manager", rows: [
        ["Manager name", "Trellis Capital Management, LLC"],
        ["Date of formation", "August 19, 2018"],
        ["Legal structure", "Limited Liability Company"],
        ["Publicly traded", "No"],
        ["Primary location", "San Francisco, CA"],
      ]},
      { heading: "Principals", rows: [
        ["Co-Founder & Managing Partner", "Arjun Mehta — Previously Principal at Founder Collective; Software Engineering (Univ. of Waterloo), Harvard MBA"],
        ["Co-Founder & Managing Partner", "Priya Sharma — Previously Partner at Foundation Capital; founding PM at Twitter"],
      ]},
      { heading: "Assets Under Management (as of Dec 31, 2025)", rows: [
        ["Total AUM (net assets)", "$280.3 million"],
        ["Uncalled capital", "$113.7 million"],
        ["Capital held by largest investor", "20.00%"],
        ["Capital held by 5 largest investors", "37.00%"],
      ]},
      { heading: "Ownership & Insider Investment", rows: [
        ["Internal investors", "Arjun Mehta [50.00%], Priya Sharma [50.00%]"],
        ["Controlling equity interest", "No"],
        ["Insider investment (committed)", "$2.77 million (~1% of commitments)"],
      ]},
      { heading: "Human Resources", rows: [
        ["Total headcount", "7"],
        ["Investment professionals", "6"],
        ["Back office professionals", "1"],
        ["Part-time / consultants", "Raj Patel (fractional CFO); James Crawford (deal counsel)"],
        ["Employees are related/married", "No"],
      ]},
    ],
  },
  {
    title: "2. Legal, Regulatory & Compliance",
    groups: [
      { heading: "Regulatory Oversight", rows: [
        ["SEC registration", "Exempt Reporting Adviser"],
        ["Regulatory sanctions (past ten years)", "No"],
        ["Non-routine regulatory correspondence (past five years)", "No"],
      ]},
      { heading: "Compliance Infrastructure and Policies", rows: [
        ["Compliance officer", "Priya Sharma (Managing Partner)"],
        ["Compliance consultant", "Summit Advisory (Form ADV preparation only)"],
        ["Compliance manual", "Available for inspection"],
        ["Compliance officer outsourced", "No"],
        ["SOC 1 / external controls report", "No"],
        ["Initial attestation to compliance policies", "No"],
        ["Annual recertification", "No"],
        ["Annual compliance training", "No"],
        ["Written personal trading policy", "No"],
      ]},
    ],
  },
  {
    title: "3. Technology, Cybersecurity & Business Resilience",
    groups: [
      { heading: "Information Technology", rows: [
        ["Technology consultant", "None"],
        ["IT infrastructure model", "Cloud-based (no onsite infrastructure)"],
        ["Dedicated IT personnel", "None"],
      ]},
      { heading: "Cybersecurity Controls", rows: [
        ["Cybersecurity policy", "Does not exist"],
        ["Third-party cybersecurity framework", "Not adopted"],
        ["Annual cybersecurity training / phishing", "Not implemented"],
        ["Formal incident response plan", "Does not exist"],
        ["Endpoint data loss prevention", "Not implemented"],
        ["Network penetration testing", "Not completed"],
        ["Baseline network security (firewall, anti-virus)", "Implemented"],
        ["Multi-factor authentication", "Implemented (key applications)"],
        ["Cybersecurity breach in past year", "No"],
      ]},
      { heading: "Business Continuity", rows: [
        ["Business continuity plan", "Does not exist"],
        ["BCP enacted in past year", "No"],
        ["Remote work capability", "Yes"],
      ]},
    ],
  },
  {
    title: "4. Fund Structure, Terms & Investor Alignment",
    groups: [
      { heading: "Corporate Structure", rows: [
        ["Domicile", "Delaware"],
        ["Date of incorporation", "March 28, 2026"],
        ["Commencement of operations", "N/A (pre-launch)"],
        ["Asset class", "Venture Capital"],
        ["Structure", "Standalone Limited Partnership"],
        ["General Partner", "Trellis Capital GP IV, LLC"],
        ["Offering document date", "January 1, 2026"],
        ["Board at fund level", "Not Applicable"],
        ["LPAC", "No (LPA provision exists)"],
      ]},
      { heading: "Terms", rows: [
        ["Minimum commitment", "$1 million"],
        ["GP commitment", "1.01%"],
        ["First closing", "April 1, 2026"],
        ["Commitment period", "5 years"],
        ["Fund term", "10 years + 2-year extension"],
        ["Key person provision", "Yes"],
        ["No-fault divorce", "No"],
        ["Clawback", "Yes"],
        ["Recycling", "Yes (max 120%)"],
      ]},
      { heading: "Fee Structure", rows: [
        ["Management fee (commitment period)", "2.50%"],
        ["Management fee (post-commitment)", "1.50%"],
        ["Carried interest", "20.00%"],
        ["Preferred return", "None"],
        ["Distribution waterfall", "American (deal-by-deal)"],
        ["GP catch-up", "100%"],
      ]},
      { heading: "Investment Strategy", rows: [
        ["Strategy", "Venture Capital"],
        ["Sub-strategy", "Pre-seed Technology"],
        ["Regional focus", "Global (primarily U.S.)"],
        ["Target investment size", "$1–3 million"],
        ["Target portfolio size", "40–50 companies"],
        ["Single company limit", "10% of commitments (without LPAC)"],
        ["Passive investment limit", "5% of commitments"],
        ["Non-U.S./Canada limit", "10% of commitments"],
        ["Digital asset allowance", "Up to 10% (not utilized)"],
        ["Management fee offset", "Yes (100% of portco fees)"],
        ["Organizational costs cap", "$350,000"],
        ["Professional expenses provision", "Yes"],
        ["Deal counsel fees charged to fund", "Yes (de minimis per Apex)"],
      ]},
    ],
  },
  {
    title: "5. Service Providers, Delegation & Oversight",
    groups: [
      { heading: "Administrator", rows: [
        ["Administrator", "Apex Fund Services, LLC"],
        ["Accounting platform", "Xero"],
        ["LP management / reporting portal", "FundPanel"],
      ]},
      { heading: "Auditor", rows: [
        ["Auditor", "Baker, Thompson & Co. LLP"],
        ["Audit standard", "U.S. GAAP"],
      ]},
      { heading: "Counsel", rows: [
        ["Legal counsel", "Morrison Cole Ashworth & Partners"],
        ["Deal counsel", "James Crawford (independent, ad hoc)"],
      ]},
      { heading: "Other Providers", rows: [
        ["Corporate banker", "Pacific Commerce Bank"],
        ["Compliance consultant", "Summit Advisory (Form ADV only)"],
        ["Technology consultant", "None"],
        ["Background check provider", "None (search underway)"],
      ]},
    ],
  },
  {
    title: "6. Investment Operations & Portfolio Controls",
    groups: [
      { heading: "Portfolio Management", rows: [
        ["Portfolio management system", "Excel"],
        ["Deal management system", "Proprietary (Retool 'People Flow')"],
        ["Financial metrics tracking", "Excel dashboard"],
      ]},
      { heading: "Investment Process", rows: [
        ["Investment allocation policy", "No formal written policy"],
        ["Investment approval", "Both Managing Partners required"],
      ]},
      { heading: "Cash & Accounting", rows: [
        ["Accounting system", "Xero (maintained by Apex)"],
        ["Internal accounting system / general ledger", "No (relies on Apex/Xero)"],
        ["Shadow accounting system", "No"],
        ["Back office oversight of administrator", "No (expected with CFO/Head of Finance)"],
        ["Manager tracks individual cash transactions", "No"],
        ["Manager tracks aggregate cash balances", "No"],
      ]},
      { heading: "Asset Transfers", rows: [
        ["Financial institution(s)", "Pacific Commerce Bank"],
        ["Wire authorization", "Dual: Apex initiates, Managing Partner releases"],
        ["Verification callback (new instructions)", "Yes (Apex confirmed)"],
      ]},
    ],
  },
  {
    title: "7. Valuation, Asset Existence & Investor Reporting",
    groups: [
      { heading: "Valuation Controls", rows: [
        ["Valuation policy", "Received (April 2026)"],
        ["Valuation committee", "No"],
        ["External valuation agent", "No"],
        ["Valuation methodology", "Cost basis; mark up/down on subsequent financing rounds"],
        ["Valuation approvers", "Both Managing Partners"],
        ["Administrator role in valuation", "Prepares SOI, provides guidance, updates for known events"],
      ]},
      { heading: "Investor Reporting", rows: [
        ["Quarterly reporting timeline", "45 business days"],
        ["Annual audited financials timeline", "120 days"],
        ["Accounting standard", "U.S. GAAP"],
        ["Manager approves reporting before issuance", "Yes"],
        ["Investor reporting errors (historical)", "None"],
      ]},
      { heading: "Waterfall & Investor Records", rows: [
        ["Reporting portal", "FundPanel LP Portal"],
        ["Waterfall calculation method", "Excel"],
        ["Internal investor-level accounting records", "No"],
        ["Investor capital accounts maintained by", "Apex (FundPanel)"],
      ]},
    ],
  },
  {
    title: "8. Manager Transparency & LP Communications",
    groups: [
      { heading: "Diligence Cooperation", rows: [
        ["Manager cooperation during diligence", "Full cooperation"],
        ["Document provision", "Prompt, no delays"],
        ["Staff availability for follow-up", "Yes"],
        ["Evasion or scope restriction", "None"],
        ["Administrator cooperation", "Full cooperation (independent confirmation provided)"],
        ["Proactive disclosure of weaknesses", "Yes (back office, cybersecurity, compliance)"],
        ["Restrictions on review scope", "None"],
      ]},
    ],
  },
];

const AURORA_ROW_META: Record<string, { source: string; quote: string }> = {
  // Manager
  "Manager name":                       { source: "Form ADV",     quote: "The registrant's legal name is Aurora Capital Management, LLC, organized as a Limited Liability Company under the laws of the State of Delaware." },
  "Date of formation":                  { source: "California SoS", quote: "Date of Formation: August 17, 2017 — confirmed via California Secretary of State Registry and Delaware Division of Corporations." },
  "Legal structure":                    { source: "Form ADV",     quote: "Aurora Capital Management, LLC is organized as a Limited Liability Company. The registrant is not publicly traded." },
  "Publicly traded":                    { source: "Form ADV",     quote: "The registrant is not publicly traded and has no parent organization that is publicly traded." },
  "Primary location":                   { source: "Form ADV",     quote: "Los Angeles, CA — the registrant operates on a fully remote basis with no physical office. Principals work remotely and meet quarterly for strategy retreats." },
  // Principals
  "Managing Partner — Marcus Reeves":   { source: "Form ADV",     quote: "Marcus Reeves (Managing Partner) — 40% ownership. Prior to founding Aurora, Marcus pursued a career as an actor and film producer." },
  "Managing Partner — Daniel Brenner":  { source: "Form ADV",     quote: "Daniel Brenner (Managing Partner) — 40% ownership. Daniel is a talent manager for internationally recognized entertainers, in addition to his role at Aurora." },
  "Partner — Rebecca Stern":            { source: "Form ADV",     quote: "Rebecca Stern (Partner) — 20% ownership. Rebecca holds a Stanford MBA and previously led Global Strategy at a NYSE-listed firm." },
  // AUM
  "Total AUM (regulatory)":             { source: "Form ADV",     quote: "As of March 26, 2026, regulatory assets under management are $981.54 million, excluding $215.59 million of uncalled capital commitments to Aurora Ventures IV, L.P." },
  "Uncalled capital":                   { source: "Form ADV",     quote: "Total uncalled capital commitments are approximately $215.59 million as of the date of this filing, primarily attributable to Aurora Ventures IV, L.P." },
  "Prior year AUM":                     { source: "Form ADV",     quote: "Prior year regulatory AUM (March 2025 filing): $814.59 million." },
  // Ownership
  "Internal investors":                 { source: "Form ADV",     quote: "Marcus Reeves holds 40.00% equity ownership. Daniel Brenner holds 40.00%. Rebecca Stern holds 20.00%. No external institutional ownership." },
  "Controlling equity interest":        { source: "Form ADV",     quote: "No single person holds a controlling equity interest in the registrant. Ownership is held by the three Managing Members." },
  "GP commitment (Fund IV)":            { source: "LPA",          quote: "The General Partner shall make a capital commitment to the Fund of at least $9.0 million (approximately 3% of expected commitments), with up to one-half satisfied via fee offset rather than cash contribution." },
  // HR
  "Total headcount":                    { source: "DDQ",          quote: "Total headcount: 9 FTEs (6 investment professionals, 3 back office / operations)." },
  "Investment professionals":           { source: "DDQ",          quote: "6 investment professionals: Marcus Reeves (Managing Partner), Daniel Brenner (Managing Partner), Rebecca Stern (Partner), Austin Knight (Principal), plus 2 Associates." },
  "Back office professionals":          { source: "DDQ",          quote: "3 back office / operations professionals: Kevin Park (VP Finance and Operations, acting CCO), Elena Ruiz (Operating Partner), 1 Operations Analyst." },
  "Part-time / consultants":            { source: "DDQ",          quote: "Apex Compliance Advisors (compliance consultant, Q3 2025); Vantage Tech Partners (IT services, January 2026); Brennan Kincaid LLP (legal counsel)." },
  "Employees are related/married":      { source: "DDQ",          quote: "No employees of the Firm are related by family or marriage to one another." },
  // Regulatory
  "SEC registration":                   { source: "SEC_EDGAR",    quote: "Aurora Capital Management, LLC is registered as an Exempt Reporting Adviser (ERA) with the SEC under the venture capital adviser exemption (CRD 312044, SEC File 802-128945)." },
  "CRD number":                         { source: "IARD Register", quote: "CRD 312044. Confirmed via IAPD / IARD ERA Register direct check." },
  "Regulatory sanctions (past ten years)": { source: "SEC_EDGAR", quote: "No firm-level regulatory sanctions or enforcement actions identified within the past ten years. Daniel Brenner is subject to an ongoing class action (Mythic / LunarPay) disclosed on Form ADV §11." },
  "Disciplinary disclosure — Daniel Brenner": { source: "Form ADV", quote: "Item 11 disclosure: Daniel Brenner — Mythic Technologies / LunarPay Crystal Tiger Society class action, filed December 2024 in U.S. District Court for the Central District of California (Montgomery & Reed LLP, plaintiffs' counsel). Matter ongoing. SEC separately investigating Mythic re: NFT/crypto offerings." },
  // Compliance
  "Compliance officer (Acting CCO)":    { source: "DDQ",          quote: "Kevin Park (VP Finance and Operations) serves as acting Chief Compliance Officer in addition to all back office, accounting, finance, and operations responsibilities." },
  "Compliance consultant":              { source: "DDQ",          quote: "Apex Compliance Advisors engaged Q3 2025 as external compliance consultant; provides policy review, mock examination support, and ad-hoc compliance advice." },
  "Compliance manual":                  { source: "DDQ",          quote: "Compliance Manual + Code of Ethics adopted January 2026. Annual attestation required from all employees." },
  "Annual compliance training":         { source: "DDQ",          quote: "Annual compliance training implemented January 2026." },
  "Personal trading — pre-clearance":   { source: "DDQ",          quote: "Pre-clearance required only for securities on the restricted list (currently zero names). No minimum holding period; brokerage statements not independently collected by compliance." },
  "Expert network policy":              { source: "ALPINE_ANALYSIS", quote: "InsightSphere engagement lacks written policy, pre-clearance requirement, public-company blackout periods, MNPI script delivered at the onset of calls, and compliance chaperoning. Alpine recommends implementation of all five controls." },
  "AML / KYC verification":             { source: "DDQ",          quote: "AML/KYC verification performed by Aurora with assistance from Brennan Kincaid LLP (legal counsel) rather than by Meridian Fund Services." },
  // Technology
  "Technology consultant":              { source: "DDQ",          quote: "Vantage Tech Partners engaged as IT services provider per engagement letter dated January 2026; covers endpoint management, identity, patch management, and email security." },
  "IT infrastructure model":            { source: "DDQ",          quote: "Fully cloud-based stack: Microsoft 365 (email and collaboration), AWS-hosted services, Vantage Tech Partners-managed endpoints. No onsite infrastructure beyond internet connectivity." },
  "Cybersecurity policy (WISP)":        { source: "DDQ",          quote: "Written Information Security Policy (WISP) adopted November 28, 2025 in response to Alpine follow-up requests." },
  "Incident response plan":             { source: "DDQ",          quote: "Incident Response Plan adopted November 28, 2025." },
  "Annual cybersecurity training":      { source: "DDQ",          quote: "Annual cybersecurity training implemented January 2026; includes phishing-awareness modules." },
  "Endpoint data loss prevention":      { source: "ALPINE_ANALYSIS", quote: "No endpoint DLP solution deployed. USB and removable media use is discouraged in practice but not technically restricted." },
  "Network penetration testing":        { source: "ALPINE_ANALYSIS", quote: "No network penetration testing performed (Aurora cites cloud-based infrastructure as the rationale). Alpine recommends cloud-focused penetration test by year-end 2026." },
  "Multi-factor authentication":        { source: "DDQ",          quote: "Multi-factor authentication enforced for all business applications." },
  "Business continuity plan":           { source: "DDQ",          quote: "Business Continuity Plan adopted November 27, 2025; addresses service provider contingency, staff protection, and stakeholder communications." },
  "Remote work capability":             { source: "DDQ",          quote: "All personnel work fully remote; remote operations are the firm's default operating model." },
  // Fund structure
  "Domicile":                           { source: "LPA",          quote: "Aurora Ventures IV, L.P. is organized as a limited partnership under the laws of the State of Delaware pursuant to the Delaware Revised Uniform Limited Partnership Act." },
  "Date of incorporation":              { source: "LPA",          quote: "The Partnership was formed on August 31, 2025, as evidenced by the Certificate of Limited Partnership filed with the Delaware Secretary of State." },
  "General Partner":                    { source: "LPA",          quote: "Aurora Ventures IV GP, LLC, a Delaware limited liability company wholly owned by Aurora Capital Management, LLC, serves as the General Partner of the Partnership." },
  "Target / hard cap":                  { source: "PPM",          quote: "Target raise: $250 million; hard cap: $250 million." },
  "Fund term":                          { source: "LPA",          quote: "10 years from Initial Closing Date, subject to up to two one-year extensions at the General Partner's discretion." },
  "Investment period":                  { source: "LPA",          quote: "5 years from Initial Closing Date. Recycling of distributions permitted up to 120% of aggregate commitments." },
  "Management fee (commitment period)": { source: "PPM",          quote: "2.0% per annum on aggregate commitments during the investment period." },
  "Management fee (post-commitment)":   { source: "PPM",          quote: "Steps down 0.25% per year to a 1.25% floor on unreturned invested capital." },
  "Carried interest":                   { source: "PPM",          quote: "Tiered carry with thresholds at 3x and 5x return; European-style waterfall." },
  "Preferred return":                   { source: "PPM",          quote: "None — return thresholds (3x / 5x) function in place of a traditional preferred return hurdle." },
  "Fee offset":                         { source: "PPM",          quote: "100% of monitoring, transaction, and break-up fees received by the Adviser from portfolio companies are credited against management fees." },
  "Clawback":                           { source: "LPA",          quote: "GP clawback applies if cumulative carry distributions exceed amounts permitted by the waterfall on a fund-wide basis." },
  "LPAC":                               { source: "LPA",          quote: "LP Advisory Committee provided for under the LPA; consultation required for fund-term extensions and certain conflict matters." },
  // Service providers
  "Fund administrator":                 { source: "ADMIN_VERIFICATION", quote: "Meridian Fund Services, LLC engaged as administrator per the Administration Agreement dated August 31, 2025. Confirmed via direct call with Dana Blackwell (Senior Director) on April 9, 2026." },
  "Accounting platform":                { source: "ADMIN_VERIFICATION", quote: "Meridian uses LedgerCraft Enterprise and Polaris for fund accounting and partnership capital recordkeeping." },
  "Auditor (expected)":                 { source: "Fund III Financials", quote: "Grant Baker LLP issued an unqualified audit opinion on Aurora Ventures III FY2024 audited financial statements. Grant Baker is expected as Fund IV auditor; engagement letter not yet signed." },
  "Audit standard":                     { source: "Fund III Financials", quote: "U.S. GAAP." },
  "Fund legal counsel":                 { source: "LPA",          quote: "Brennan Kincaid LLP serves as legal counsel to the Fund." },
  "Compliance consultant ":             { source: "DDQ",          quote: "Apex Compliance Advisors — engaged Q3 2025." },
  "IT services":                        { source: "DDQ",          quote: "Vantage Tech Partners — engagement letter January 2026." },
  "Expert network":                     { source: "DDQ",          quote: "InsightSphere — controls deficient (see Compliance section)." },
  // Investment ops
  "Investment Committee voting":        { source: "DDQ",          quote: "IC consists of Marcus Reeves, Daniel Brenner, and Rebecca Stern. Approval requires only one of three voting members. Veto right not exercised in practice." },
  "Investment approval":                { source: "DDQ",          quote: "Approval requires one of three IC voting members per LPA / IC Charter; majority or unanimous consent not required." },
  "Portfolio management system":        { source: "ALPINE_ANALYSIS", quote: "Carta (cap table); Aurora uses internal deal pipeline tracking tools and supplemental financial dashboards." },
  "Cash controls":                      { source: "ADMIN_VERIFICATION", quote: "All outbound wires require dual approval by Kevin Park (VP Finance) and Rebecca Stern (GP). Meridian initiates wires and requires original invoices to validate cash movements. Verification callbacks are required for new or changed payment instructions." },
  "Operating account control":          { source: "ALPINE_ANALYSIS", quote: "Meridian does not have signing authority over the Fund's operating account used for investor capital activity and non-investment expenses. Aurora controls all transfers." },
  // Valuation
  "Valuation policy":                   { source: "Valuation Policy", quote: "Aurora prepares quarterly fair-value estimates in accordance with ASC 820 and ILPA reporting guidelines." },
  "Valuation committee":                { source: "Valuation Policy", quote: "Valuation Committee consists of Rebecca Stern (GP), Kevin Park (VP Finance), Austin Knight (Principal), Elena Ruiz (Operating Partner). Majority are investment professionals." },
  "External valuation agent":           { source: "Valuation Policy", quote: "No third-party valuation agent engaged. All portfolio valuations prepared internally; Meridian accepts manager-prepared valuations at quarter-end without independent verification." },
  "Administrator verification of valuations": { source: "Meridian Verification Call", quote: "Meridian accepts Aurora's pricing at each quarter-end without conducting any verification procedures." },
  "Annual audit":                       { source: "Fund III Financials", quote: "Annual audit by Grant Baker LLP (expected) provides the only external pricing check." },
  // Investor reporting
  "Quarterly reporting":                { source: "DDQ",          quote: "Quarterly investor letters and capital account statements distributed via Meridian." },
  "Annual audited financials":          { source: "DDQ",          quote: "Annual audited financial statements distributed within statutory deadlines via Meridian." },
  "K-1 distribution":                   { source: "DDQ",          quote: "K-1 tax documents distributed within statutory deadlines." },
  "Waterfall calculation":              { source: "ALPINE_ANALYSIS", quote: "Carried interest waterfall calculations maintained by Meridian in Excel, approved by Kevin Park." },
  "Investor-level accounting records":  { source: "ALPINE_ANALYSIS", quote: "Aurora does not maintain in-house investor-level accounting records; relies entirely on Meridian's Polaris system for partnership capital accounting." },
  // Transparency
  "Manager cooperation during diligence": { source: "ALPINE_ANALYSIS", quote: "Full cooperation; Aurora management proactively disclosed all operational gaps (CCO absence, Mythic/LunarPay matter, partially cashless GP commitment, expert network limitations) without prompting." },
  "Administrator cooperation":          { source: "ADMIN_VERIFICATION", quote: "Meridian provided full cooperation; verification call confirmed engagement and key operational parameters." },
  "Proactive disclosure of weaknesses": { source: "ALPINE_ANALYSIS", quote: "Yes — Aurora proactively disclosed acting-CCO status, Mythic/LunarPay matter, cashless GP commitment, expert network gaps, and absence of external valuation agent." },
};

const AURORA_REF_SECTIONS = [
  {
    title: "1. Manager, Ownership & Governance",
    groups: [
      { heading: "Manager", rows: [
        ["Manager name", "Aurora Capital Management, LLC"],
        ["Date of formation", "August 17, 2017"],
        ["Legal structure", "Limited Liability Company"],
        ["Publicly traded", "No"],
        ["Primary location", "Los Angeles, CA (fully remote)"],
      ]},
      { heading: "Principals", rows: [
        ["Managing Partner — Marcus Reeves", "Marcus Reeves (40%) — Actor / Film Producer"],
        ["Managing Partner — Daniel Brenner", "Daniel Brenner (40%) — Entertainment Talent Manager"],
        ["Partner — Rebecca Stern", "Rebecca Stern (20%) — Stanford MBA, ex-Global Strategy at NYSE-listed firm"],
      ]},
      { heading: "Assets Under Management (as of March 26, 2026)", rows: [
        ["Total AUM (regulatory)", "$981.54 million"],
        ["Uncalled capital", "$215.59 million"],
        ["Prior year AUM", "$814.59 million (March 2025)"],
      ]},
      { heading: "Ownership & GP Commitment", rows: [
        ["Internal investors", "Reeves 40%, Brenner 40%, Stern 20%"],
        ["Controlling equity interest", "No"],
        ["GP commitment (Fund IV)", "≥ $9.0M (~3%); ~half via fee offset"],
      ]},
      { heading: "Human Resources", rows: [
        ["Total headcount", "9 FTEs"],
        ["Investment professionals", "6"],
        ["Back office professionals", "3"],
        ["Part-time / consultants", "Apex Compliance Advisors; Vantage Tech Partners; Brennan Kincaid LLP"],
        ["Employees are related/married", "No"],
      ]},
    ],
  },
  {
    title: "2. Legal, Regulatory & Compliance",
    groups: [
      { heading: "Regulatory Oversight", rows: [
        ["SEC registration", "Exempt Reporting Adviser (ERA) — VC adviser exemption"],
        ["CRD number", "312044"],
        ["Regulatory sanctions (past ten years)", "No firm-level sanctions"],
        ["Disciplinary disclosure — Daniel Brenner", "Mythic / LunarPay class action — filed Dec 2024, ongoing"],
      ]},
      { heading: "Compliance Infrastructure", rows: [
        ["Compliance officer (Acting CCO)", "Kevin Park (VP Finance and Operations) — acting CCO"],
        ["Compliance consultant", "Apex Compliance Advisors (since Q3 2025)"],
        ["Compliance manual", "Compliance Manual + Code of Ethics (January 2026)"],
        ["Annual compliance training", "Implemented January 2026"],
        ["Personal trading — pre-clearance", "Restricted list only (currently 0 names); no minimum holding period"],
        ["Expert network policy", "InsightSphere engaged; controls insufficient (5 recommended)"],
        ["AML / KYC verification", "Performed by Aurora with Brennan Kincaid LLP assistance"],
      ]},
    ],
  },
  {
    title: "3. Technology, Cybersecurity & Business Resilience",
    groups: [
      { heading: "Information Technology", rows: [
        ["Technology consultant", "Vantage Tech Partners (engaged January 2026)"],
        ["IT infrastructure model", "Fully cloud-based (Microsoft 365, AWS)"],
      ]},
      { heading: "Cybersecurity Controls", rows: [
        ["Cybersecurity policy (WISP)", "Adopted November 28, 2025"],
        ["Incident response plan", "Adopted November 28, 2025"],
        ["Annual cybersecurity training", "Implemented January 2026"],
        ["Endpoint data loss prevention", "Not implemented"],
        ["Network penetration testing", "Not performed"],
        ["Multi-factor authentication", "Enforced (all business apps)"],
      ]},
      { heading: "Business Continuity", rows: [
        ["Business continuity plan", "Adopted November 27, 2025"],
        ["Remote work capability", "Yes (fully remote operating model)"],
      ]},
    ],
  },
  {
    title: "4. Fund Structure, Terms & Investor Alignment",
    groups: [
      { heading: "Corporate Structure", rows: [
        ["Domicile", "Delaware"],
        ["Date of incorporation", "August 31, 2025"],
        ["General Partner", "Aurora Ventures IV GP, LLC"],
        ["Target / hard cap", "$250M / $250M"],
        ["LPAC", "Yes (LPA provides for advisory committee)"],
      ]},
      { heading: "Terms", rows: [
        ["Fund term", "10 years + up to 2 × 1-year extensions"],
        ["Investment period", "5 years; recycling up to 120%"],
        ["Clawback", "Yes"],
      ]},
      { heading: "Fee Structure", rows: [
        ["Management fee (commitment period)", "2.0% on commitments"],
        ["Management fee (post-commitment)", "Step-down 0.25%/yr to 1.25% floor on unreturned invested capital"],
        ["Carried interest", "Tiered (3x / 5x thresholds)"],
        ["Preferred return", "None"],
        ["Fee offset", "100% of monitoring/transaction/break-up fees"],
      ]},
    ],
  },
  {
    title: "5. Service Providers, Delegation & Oversight",
    groups: [
      { heading: "Administrator", rows: [
        ["Fund administrator", "Meridian Fund Services, LLC"],
        ["Accounting platform", "LedgerCraft Enterprise / Polaris"],
      ]},
      { heading: "Auditor", rows: [
        ["Auditor (expected)", "Grant Baker LLP (Fund IV engagement letter pending)"],
        ["Audit standard", "U.S. GAAP"],
      ]},
      { heading: "Other Providers", rows: [
        ["Fund legal counsel", "Brennan Kincaid LLP"],
        ["Compliance consultant ", "Apex Compliance Advisors"],
        ["IT services", "Vantage Tech Partners"],
        ["Expert network", "InsightSphere (controls deficient — see Ch 2)"],
      ]},
    ],
  },
  {
    title: "6. Investment Operations & Portfolio Controls",
    groups: [
      { heading: "Investment Process", rows: [
        ["Investment Committee voting", "1 of 3 GPs (Reeves, Brenner, or Stern)"],
        ["Investment approval", "Single-GP approval threshold"],
        ["Portfolio management system", "Carta (cap table)"],
      ]},
      { heading: "Cash Controls", rows: [
        ["Cash controls", "Dual-approval wire process (Park + Stern); Meridian initiates"],
        ["Operating account control", "Aurora-controlled (Meridian no signing authority)"],
      ]},
    ],
  },
  {
    title: "7. Valuation, Asset Existence & Investor Reporting",
    groups: [
      { heading: "Valuation Controls", rows: [
        ["Valuation policy", "Quarterly fair-value (ASC 820 / ILPA)"],
        ["Valuation committee", "Stern, Park, Knight, Ruiz (investment-professional majority)"],
        ["External valuation agent", "No (Alpine recommends appointment before final close)"],
        ["Administrator verification of valuations", "None — Meridian accepts manager pricing"],
        ["Annual audit", "Grant Baker LLP (expected)"],
      ]},
      { heading: "Investor Reporting", rows: [
        ["Quarterly reporting", "Quarterly statements via Meridian"],
        ["Annual audited financials", "Within statutory deadlines"],
        ["K-1 distribution", "Within statutory deadlines"],
        ["Waterfall calculation", "Excel (Meridian-prepared, Park-approved)"],
        ["Investor-level accounting records", "Meridian Polaris (no internal parallel)"],
      ]},
    ],
  },
  {
    title: "8. Manager Transparency & LP Communications",
    groups: [
      { heading: "Diligence Cooperation", rows: [
        ["Manager cooperation during diligence", "Full cooperation"],
        ["Administrator cooperation", "Full cooperation (Meridian verification call April 9, 2026)"],
        ["Proactive disclosure of weaknesses", "Yes — CCO, Mythic/LunarPay, GP commitment, expert network, valuation"],
      ]},
    ],
  },
];

const AURORA_FLAGS = [
  { id: 1,  text: "Principals maintain significant external business interests creating elevated headline risk.",  chapter: "Manager, Ownership & Governance" },
  { id: 2,  text: "No formal succession plan at the business level; no key person insurance.",                       chapter: "Manager, Ownership & Governance" },
  { id: 3,  text: "GP commitment is partially cashless (~half via management fee offset).",                          chapter: "Manager, Ownership & Governance" },
  { id: 4,  text: "Daniel Brenner — ongoing Mythic / LunarPay class action (filed Dec 2024); SEC investigating Mythic re: NFTs.", chapter: "Legal, Regulatory & Compliance" },
  { id: 5,  text: "No dedicated Chief Compliance Officer; Kevin Park serves as acting CCO in addition to VP Finance and Operations duties.", chapter: "Legal, Regulatory & Compliance" },
  { id: 6,  text: "Expert network controls insufficient: no written policy, pre-clearance, blackout periods, MNPI script, or chaperoning.", chapter: "Legal, Regulatory & Compliance" },
  { id: 7,  text: "Personal trading policy gaps: pre-clearance only on (empty) restricted list; no minimum holding period; brokerage statements not independently collected.", chapter: "Legal, Regulatory & Compliance" },
  { id: 8,  text: "AML / KYC verification performed by Aurora with legal counsel assistance rather than by Administrator.", chapter: "Legal, Regulatory & Compliance" },
  { id: 9,  text: "No endpoint data loss prevention solution deployed.",                                              chapter: "Technology, Cybersecurity & Business Resilience" },
  { id: 10, text: "No network penetration testing performed.",                                                       chapter: "Technology, Cybersecurity & Business Resilience" },
  { id: 11, text: "Single-signatory required to open new Fund bank accounts (two-signatory requirement recommended).", chapter: "Fund Structure, Terms & Investor Alignment" },
  { id: 12, text: "Fund IV audit engagement letter with Grant Baker LLP not yet signed.",                            chapter: "Service Providers, Delegation & Oversight" },
  { id: 13, text: "Investment Committee approval requires only one of three voting members (typically majority/unanimous).", chapter: "Investment Operations & Portfolio Controls" },
  { id: 14, text: "Administrator does not have signing authority over the Fund's operating account.",                chapter: "Investment Operations & Portfolio Controls" },
  { id: 15, text: "No third-party valuation agent appointed.",                                                       chapter: "Valuation, Asset Existence & Investor Reporting" },
  { id: 16, text: "Valuation committee majority consists of investment professionals.",                              chapter: "Valuation, Asset Existence & Investor Reporting" },
  { id: 17, text: "Administrator accepts Manager pricing at quarter-end without independent verification procedures.", chapter: "Valuation, Asset Existence & Investor Reporting" },
  { id: 18, text: "Carried interest waterfall calculation maintained in Excel.",                                     chapter: "Valuation, Asset Existence & Investor Reporting" },
  { id: 19, text: "Manager does not maintain internal investor-level accounting records (relies entirely on Meridian Polaris).", chapter: "Valuation, Asset Existence & Investor Reporting" },
];

const TRELLIS_FLAGS = [
  { id: 1,  text: "No formal succession plan.",                                                          chapter: "Manager, Ownership & Governance" },
  { id: 2,  text: "Employee background checks completed internally, not by a third-party provider.",    chapter: "Manager, Ownership & Governance" },
  { id: 3,  text: "Limited internal resources: single back office / operations professional.",           chapter: "Manager, Ownership & Governance" },
  { id: 4,  text: "No initial attestation with respect to compliance manual.",                           chapter: "Legal, Regulatory & Compliance" },
  { id: 5,  text: "No annual recertification process with respect to compliance manual.",                chapter: "Legal, Regulatory & Compliance" },
  { id: 6,  text: "The firm has not implemented an annual compliance training program.",                  chapter: "Legal, Regulatory & Compliance" },
  { id: 7,  text: "Manager does not have a written personal trading policy.",                            chapter: "Legal, Regulatory & Compliance" },
  { id: 8,  text: "Principal(s) hold external directorship positions (portfolio company boards).",       chapter: "Legal, Regulatory & Compliance" },
  { id: 9,  text: "The firm has not adopted a third-party cybersecurity framework.",                     chapter: "Technology, Cybersecurity & Business Resilience" },
  { id: 10, text: "The firm has not implemented an annual cybersecurity training program.",              chapter: "Technology, Cybersecurity & Business Resilience" },
  { id: 11, text: "The firm has not developed a formal incident response plan.",                         chapter: "Technology, Cybersecurity & Business Resilience" },
  { id: 12, text: "The firm has not implemented an endpoint data loss prevention solution.",             chapter: "Technology, Cybersecurity & Business Resilience" },
  { id: 13, text: "The firm does not perform network penetration testing.",                              chapter: "Technology, Cybersecurity & Business Resilience" },
  { id: 14, text: "Fund does not have an LPAC / Advisory Board.",                                        chapter: "Fund Structure, Terms & Investor Alignment" },
  { id: 15, text: "Management company overhead costs (deal counsel) charged to Fund.",                   chapter: "Fund Structure, Terms & Investor Alignment" },
  { id: 16, text: "Manager utilizes Excel as portfolio management system.",                              chapter: "Investment Operations & Portfolio Controls" },
  { id: 17, text: "The Manager does not maintain internal accounting records or track cash balances.",   chapter: "Investment Operations & Portfolio Controls" },
  { id: 18, text: "No formal investment allocation policy (separate from LPA disclosures).",             chapter: "Investment Operations & Portfolio Controls" },
  { id: 19, text: "The Manager does not have a formal valuation committee.",                             chapter: "Valuation, Asset Existence & Investor Reporting" },
  { id: 20, text: "Front office investment professionals primarily responsible for valuation.",           chapter: "Valuation, Asset Existence & Investor Reporting" },
  { id: 21, text: "Carried interest waterfall calculation maintained on Excel.",                         chapter: "Valuation, Asset Existence & Investor Reporting" },
  { id: 22, text: "The Manager does not maintain internal investor-level accounting records.",           chapter: "Valuation, Asset Existence & Investor Reporting" },
];

const FLAG_CHAPTERS = [
  "Manager, Ownership & Governance",
  "Legal, Regulatory & Compliance",
  "Technology, Cybersecurity & Business Resilience",
  "Fund Structure, Terms & Investor Alignment",
  "Service Providers, Delegation & Oversight",
  "Investment Operations & Portfolio Controls",
  "Valuation, Asset Existence & Investor Reporting",
  "Manager Transparency & LP Communications",
];
const FLAG_CHAPTER_COLOR: Record<string, string> = {
  "Manager, Ownership & Governance":                "#6366f1",
  "Legal, Regulatory & Compliance":                 "#EF4444",
  "Technology, Cybersecurity & Business Resilience":"#F59E0B",
  "Fund Structure, Terms & Investor Alignment":     "#10B981",
  "Service Providers, Delegation & Oversight":      "#14b8a6",
  "Investment Operations & Portfolio Controls":      "#8b5cf6",
  "Valuation, Asset Existence & Investor Reporting": "#0ea5e9",
  "Manager Transparency & LP Communications":        "#6b7280",
};
const FLAG_CHAPTER_BG: Record<string, string> = {
  "Manager, Ownership & Governance":                "#eef2ff",
  "Legal, Regulatory & Compliance":                 "#fef2f2",
  "Technology, Cybersecurity & Business Resilience":"#fffbeb",
  "Fund Structure, Terms & Investor Alignment":     "#f0fdf4",
  "Service Providers, Delegation & Oversight":      "#f0fdfa",
  "Investment Operations & Portfolio Controls":      "#f5f3ff",
  "Valuation, Asset Existence & Investor Reporting": "#f0f9ff",
  "Manager Transparency & LP Communications":        "#f9fafb",
};

type FlagItem = { text: string; chapter: string };

function TrellisFlag({ slug }: { slug?: string }) {
  const isAuroraFlag = slug === "aurora-capital-iv";
  const flagFundName = isAuroraFlag ? "Aurora Ventures IV, L.P." : "Trellis Capital IV, L.P.";
  const flagManagerName = isAuroraFlag ? "Aurora Capital Management, LLC" : "Trellis Capital Management, LLC";
  const baseFlags = isAuroraFlag ? AURORA_FLAGS : TRELLIS_FLAGS;
  const [flags, setFlags] = useState<FlagItem[]>(
    baseFlags.map(({ text, chapter }) => ({ text, chapter }))
  );
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<FlagItem[]>([]);
  const [savedFlash, setSavedFlash] = useState(false);

  // Load from DB on mount
  useEffect(() => {
    if (!slug) return;
    fetch(`/api/app-portal/flag-draft?slug=${encodeURIComponent(slug)}`)
      .then(r => r.json())
      .then(({ flags: dbFlags }) => { if (Array.isArray(dbFlags) && dbFlags.length > 0) setFlags([...dbFlags].sort((a, b) => FLAG_CHAPTERS.indexOf(a.chapter) - FLAG_CHAPTERS.indexOf(b.chapter))); })
      .catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  function startEdit() {
    setDraft(flags.map(f => ({ ...f })));
    setEditing(true);
  }
  function handleCancel() { setEditing(false); }
  function sortByChapter(list: FlagItem[]) {
    return [...list].sort((a, b) => FLAG_CHAPTERS.indexOf(a.chapter) - FLAG_CHAPTERS.indexOf(b.chapter));
  }

  function handleSave() {
    const sorted = sortByChapter(draft);
    setFlags(sorted);
    setEditing(false);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 2000);
    if (slug) {
      fetch("/api/app-portal/flag-draft", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ review_slug: slug, flags: sorted }),
      }).catch(() => {});
    }
  }

  const setDraftItem = (i: number, key: keyof FlagItem, val: string) =>
    setDraft(prev => prev.map((f, idx) => idx === i ? { ...f, [key]: val } : f));
  const removeItem = (i: number) => setDraft(prev => prev.filter((_, idx) => idx !== i));
  const addItem = () => setDraft(prev => [...prev, { text: "", chapter: FLAG_CHAPTERS[0] }]);

  const displayFlags = editing ? draft : flags;

  return (
    <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: "36px 40px", fontFamily: "ui-sans-serif, -apple-system, sans-serif" }}>
      {/* Header */}
      <div style={{ marginBottom: 28, paddingBottom: 20, borderBottom: "2px solid #111827", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#9ca3af", marginBottom: 6 }}>Alpine Flags</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#111827", marginBottom: 2 }}>{flagFundName}</div>
          <div style={{ fontSize: 13, color: "#6b7280" }}>{flagManagerName} · {displayFlags.length} Flags Identified · April 2026</div>
        </div>
        <div className="flex items-center gap-2 shrink-0 pt-1">
          {editing ? (
            <>
              <button onClick={handleCancel} className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">Cancel</button>
              <button onClick={handleSave} className="px-5 py-2 text-sm font-semibold text-white bg-alpine-violet rounded-lg hover:bg-alpine-violet/90 transition-colors">
                {savedFlash ? "Saved ✓" : "Save"}
              </button>
            </>
          ) : (
            <button onClick={startEdit} className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              Edit Flags
            </button>
          )}
        </div>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
            <th style={{ textAlign: "left", padding: "8px 8px 8px 0", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#9ca3af", width: 36 }}>#</th>
            <th style={{ textAlign: "left", padding: "8px 12px", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#9ca3af" }}>Flag</th>
            <th style={{ textAlign: "left", padding: "8px 0 8px 12px", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#9ca3af", width: 220 }}>Chapter</th>
            {editing && <th style={{ width: 32 }} />}
          </tr>
        </thead>
        <tbody>
          {displayFlags.map((flag, i) => (
            <tr key={i} style={{ borderBottom: "1px solid #f3f4f6" }}>
              <td style={{ padding: "13px 8px 13px 0", fontSize: 12, color: "#9ca3af", fontWeight: 600, verticalAlign: "top" }}>{i + 1}</td>
              <td style={{ padding: editing ? "8px 12px" : "13px 12px", fontSize: 13, color: "#111827", lineHeight: 1.6, verticalAlign: "top" }}>
                {editing ? (
                  <textarea
                    value={flag.text}
                    rows={2}
                    onChange={e => setDraftItem(i, "text", e.target.value)}
                    className="w-full text-[13px] text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-alpine-violet/30 leading-relaxed"
                  />
                ) : flag.text}
              </td>
              <td style={{ padding: editing ? "8px 0 8px 12px" : "13px 0 13px 12px", verticalAlign: "top" }}>
                {editing ? (
                  <select
                    value={flag.chapter}
                    onChange={e => setDraftItem(i, "chapter", e.target.value)}
                    className="w-full text-[12px] text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-alpine-violet/30"
                  >
                    {FLAG_CHAPTERS.map(ch => <option key={ch} value={ch}>{ch}</option>)}
                  </select>
                ) : (
                  <span style={{
                    display: "inline-block", padding: "3px 10px", borderRadius: 5, fontSize: 11, fontWeight: 500,
                    background: FLAG_CHAPTER_BG[flag.chapter] ?? "#f9fafb",
                    color: FLAG_CHAPTER_COLOR[flag.chapter] ?? "#6b7280",
                    whiteSpace: "normal" as const, lineHeight: 1.5,
                  }}>
                    {flag.chapter}
                  </span>
                )}
              </td>
              {editing && (
                <td style={{ padding: "8px 0 8px 8px", verticalAlign: "top" }}>
                  <button onClick={() => removeItem(i)} className="text-slate-300 hover:text-red-400 text-lg leading-none mt-1">×</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {editing && (
        <button
          onClick={addItem}
          className="mt-4 flex items-center gap-1.5 text-[12px] font-medium text-alpine-violet hover:text-alpine-violet/80 transition-colors"
        >
          <span className="text-lg leading-none">+</span> Add Flag
        </button>
      )}
    </div>
  );
}

const REQUIRED_BEFORE_CLOSE = [
  { n: 1, issue: "Execute provider engagement letters for Fund IV", priority: "High", target: "Pre-first capital call", action: "Confirm pre-investment" },
  { n: 2, issue: "Transfer compliance oversight to non-investment professional", priority: "High", target: "TBD", action: "Require written commitment via side letter" },
  { n: 3, issue: "Engage cybersecurity vendor; implement policy, training, testing", priority: "High", target: "End of 2026", action: "Require written commitment via side letter" },
];

const POST_CLOSE_MONITORING = [
  { n: 4,  issue: "Hire full-time Head of Finance", priority: "Med", target: "2027", action: "Monitor progress" },
  { n: 5,  issue: "Implement compliance attestation and annual training", priority: "Med", target: "TBD", action: "Monitor progress" },
  { n: 6,  issue: "Form valuation committee with non-investment representation", priority: "Med", target: "TBD", action: "Monitor progress" },
  { n: 7,  issue: "Implement internal investor-level accounting records", priority: "Med", target: "TBD", action: "Monitor progress" },
  { n: 8,  issue: "Prepare written business continuity plan", priority: "Med", target: "TBD", action: "Monitor progress" },
  { n: 9,  issue: "Form LPAC", priority: "Low", target: "Conditional", action: "Request formation" },
  { n: 10, issue: "Monitor Pacific Commerce / JP Morgan banking transition", priority: "Low", target: "TBD", action: "Monitor" },
  { n: 11, issue: "Engage third-party background check provider", priority: "Low", target: "TBD", action: "Monitor" },
];

const AURORA_REQUIRED_BEFORE_CLOSE = [
  { n: 1, issue: "Appoint third-party valuation agent (e.g., Houlihan Lokey or Duff & Phelps)", priority: "High", target: "Before Fund IV final close", action: "Require executed engagement letter as condition of close" },
  { n: 2, issue: "Execute Fund IV audit engagement letter with Grant Baker LLP", priority: "High", target: "Before Fund IV final close", action: "Require executed engagement letter as condition of close" },
  { n: 3, issue: "Implement five expert network controls (written policy, pre-clearance, blackout periods, MNPI script, chaperoning)", priority: "High", target: "Q3 2026", action: "Require written commitment via side letter" },
];

const AURORA_POST_CLOSE_MONITORING = [
  { n: 4,  issue: "Hire dedicated Chief Compliance Officer as AUM scales past $1B", priority: "Med", target: "2027", action: "Monitor progress" },
  { n: 5,  issue: "Implement endpoint data loss prevention (DLP) solution", priority: "Med", target: "Year-End 2026", action: "Monitor progress" },
  { n: 6,  issue: "Conduct cloud-focused penetration test and quarterly simulated phishing", priority: "Med", target: "Q3 2026", action: "Monitor progress" },
  { n: 7,  issue: "Formalize written succession plan at management company level; consider key person insurance", priority: "Med", target: "2026", action: "Monitor progress" },
  { n: 8,  issue: "Reconstitute valuation committee with majority non-investment professionals", priority: "Med", target: "2026", action: "Monitor progress" },
  { n: 9,  issue: "Transfer operating account control to Meridian Fund Services", priority: "Med", target: "TBD", action: "Monitor progress" },
  { n: 10, issue: "Monitor Mythic / LunarPay litigation and SEC investigation involving Daniel Brenner", priority: "Med", target: "Ongoing", action: "Periodic background checks on principals" },
  { n: 11, issue: "Amend IC voting threshold from one-of-three to majority (2 of 3) consent", priority: "Low", target: "2027", action: "Request amendment" },
  { n: 12, issue: "Encourage fully cash-funded GP commitment in future vintages", priority: "Low", target: "Future vintages", action: "Monitor" },
  { n: 13, issue: "Transition AML/KYC verification to Meridian investor services group", priority: "Low", target: "TBD", action: "Monitor" },
  { n: 14, issue: "Migrate carried interest waterfall from Excel to purpose-built system", priority: "Low", target: "TBD", action: "Monitor" },
];

type RemItem = { issue: string; priority: string; target: string; action: string };

const PRIORITY_OPTIONS = ["High", "Med", "Low"] as const;
const priorityColor = (p: string) => p === "High" ? "#DC2626" : p === "Med" ? "#D97706" : "#64748b";
const priorityBg    = (p: string) => p === "High" ? "#fee2e2" : p === "Med" ? "#fef3c7" : "#f1f5f9";

function TrellisRemediation({ slug }: { slug?: string }) {
  const isAuroraRem = slug === "aurora-capital-iv";
  const remFundName = isAuroraRem ? "Aurora Ventures IV, L.P." : "Trellis Capital IV, L.P.";
  const remManagerName = isAuroraRem ? "Aurora Capital Management, LLC" : "Trellis Capital Management, LLC";
  const beforeSource = isAuroraRem ? AURORA_REQUIRED_BEFORE_CLOSE : REQUIRED_BEFORE_CLOSE;
  const postSource = isAuroraRem ? AURORA_POST_CLOSE_MONITORING : POST_CLOSE_MONITORING;
  const defaultBefore: RemItem[] = beforeSource.map(({ issue, priority, target, action }) => ({ issue, priority, target, action }));
  const defaultPost:   RemItem[] = postSource.map(({ issue, priority, target, action }) => ({ issue, priority, target, action }));

  const [beforeClose, setBeforeClose] = useState<RemItem[]>(defaultBefore);
  const [postClose,   setPostClose]   = useState<RemItem[]>(defaultPost);
  const [editing, setEditing] = useState(false);
  const [draftBefore, setDraftBefore] = useState<RemItem[]>([]);
  const [draftPost,   setDraftPost]   = useState<RemItem[]>([]);
  const [savedFlash, setSavedFlash] = useState(false);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/app-portal/remediation-draft?slug=${encodeURIComponent(slug)}`)
      .then(r => r.json())
      .then((data) => {
        if (!data) return;
        if (Array.isArray(data.before_close) && data.before_close.length > 0) setBeforeClose(data.before_close);
        if (Array.isArray(data.post_close)   && data.post_close.length > 0)   setPostClose(data.post_close);
      })
      .catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  function startEdit() {
    setDraftBefore(beforeClose.map(r => ({ ...r })));
    setDraftPost(postClose.map(r => ({ ...r })));
    setEditing(true);
  }
  function handleCancel() { setEditing(false); }
  function handleSave() {
    setBeforeClose(draftBefore);
    setPostClose(draftPost);
    setEditing(false);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 2000);
    if (slug) {
      fetch("/api/app-portal/remediation-draft", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ review_slug: slug, before_close: draftBefore, post_close: draftPost }),
      }).catch(() => {});
    }
  }

  const setItem = (setter: React.Dispatch<React.SetStateAction<RemItem[]>>, i: number, key: keyof RemItem, val: string) =>
    setter(prev => prev.map((r, idx) => idx === i ? { ...r, [key]: val } : r));
  const removeItem = (setter: React.Dispatch<React.SetStateAction<RemItem[]>>, i: number) =>
    setter(prev => prev.filter((_, idx) => idx !== i));
  const addItem = (setter: React.Dispatch<React.SetStateAction<RemItem[]>>, priority: string) =>
    setter(prev => [...prev, { issue: "", priority, target: "TBD", action: "" }]);

  const TableSection = ({
    title, rows, draft, setter, borderColor, defaultPriority,
  }: {
    title: string; rows: RemItem[]; draft: RemItem[];
    setter: React.Dispatch<React.SetStateAction<RemItem[]>>;
    borderColor: string; defaultPriority: string;
  }) => {
    const displayRows = editing ? draft : rows;
    let globalIdx = title === "Required Before Close" ? 0 : beforeClose.length;

    return (
      <div style={{ marginBottom: 36 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", borderBottom: `2px solid ${borderColor}`, paddingBottom: 8, marginBottom: 12 }}>{title}</div>
        <table style={{ width: "100%", borderCollapse: "collapse" as const }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
              {["#", "Issue", "Priority", "Target", "Investor Action", ...(editing ? [""] : [])].map((h, hi) => (
                <th key={hi} style={{ textAlign: "left" as const, padding: "6px 10px", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "#9ca3af", width: h === "#" ? 28 : h === "" ? 32 : undefined }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayRows.map((row, i) => {
              const n = (title === "Required Before Close" ? 0 : beforeClose.length) + i + 1;
              return (
                <tr key={i} style={{ borderBottom: "1px solid #f3f4f6", background: i % 2 === 0 ? "#fff" : "#fafbfc" }}>
                  <td style={{ padding: "12px 10px", fontSize: 11, color: "#94a3b8", fontWeight: 600, verticalAlign: "top" as const, width: 28 }}>{n}</td>
                  <td style={{ padding: editing ? "8px 10px" : "12px 10px", fontSize: 13, color: "#111827", lineHeight: 1.6, verticalAlign: "top" as const }}>
                    {editing ? (
                      <textarea value={row.issue} rows={2} onChange={e => setItem(setter, i, "issue", e.target.value)}
                        className="w-full text-[13px] text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 resize-none focus:outline-none focus:ring-2 focus:ring-alpine-violet/30 leading-relaxed" />
                    ) : row.issue}
                  </td>
                  <td style={{ padding: editing ? "8px 10px" : "12px 10px", verticalAlign: "top" as const, whiteSpace: "nowrap" as const }}>
                    {editing ? (
                      <select value={row.priority} onChange={e => setItem(setter, i, "priority", e.target.value)}
                        className="text-[12px] bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-alpine-violet/30">
                        {PRIORITY_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    ) : (
                      <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 600, background: priorityBg(row.priority), color: priorityColor(row.priority) }}>{row.priority}</span>
                    )}
                  </td>
                  <td style={{ padding: editing ? "8px 10px" : "12px 10px", fontSize: 12, color: "#334155", verticalAlign: "top" as const }}>
                    {editing ? (
                      <input value={row.target} onChange={e => setItem(setter, i, "target", e.target.value)}
                        className="w-full text-[12px] text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-alpine-violet/30" />
                    ) : row.target}
                  </td>
                  <td style={{ padding: editing ? "8px 10px" : "12px 10px", fontSize: 12, color: "#475569", verticalAlign: "top" as const }}>
                    {editing ? (
                      <input value={row.action} onChange={e => setItem(setter, i, "action", e.target.value)}
                        className="w-full text-[12px] text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-alpine-violet/30" />
                    ) : row.action}
                  </td>
                  {editing && (
                    <td style={{ padding: "8px 4px", verticalAlign: "top" as const }}>
                      <button onClick={() => removeItem(setter, i)} className="text-slate-300 hover:text-red-400 text-lg leading-none mt-1">×</button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
        {editing && (
          <button onClick={() => addItem(setter, defaultPriority)}
            className="mt-3 flex items-center gap-1.5 text-[12px] font-medium text-alpine-violet hover:text-alpine-violet/80 transition-colors">
            <span className="text-lg leading-none">+</span> Add Item
          </button>
        )}
      </div>
    );
  };

  return (
    <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: "36px 40px", fontFamily: "ui-sans-serif, -apple-system, sans-serif" }}>
      <div style={{ marginBottom: 28, paddingBottom: 20, borderBottom: "2px solid #111827", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase" as const, color: "#9ca3af", marginBottom: 6 }}>Remediation & Monitoring</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#111827", marginBottom: 2 }}>{remFundName}</div>
          <div style={{ fontSize: 13, color: "#6b7280" }}>{remManagerName} · April 2026</div>
        </div>
        <div className="flex items-center gap-2 shrink-0 pt-1">
          {editing ? (
            <>
              <button onClick={handleCancel} className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">Cancel</button>
              <button onClick={handleSave} className="px-5 py-2 text-sm font-semibold text-white bg-alpine-violet rounded-lg hover:bg-alpine-violet/90 transition-colors">
                {savedFlash ? "Saved ✓" : "Save"}
              </button>
            </>
          ) : (
            <button onClick={startEdit} className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              Edit
            </button>
          )}
        </div>
      </div>
      <TableSection title="Required Before Close" rows={beforeClose} draft={draftBefore} setter={setDraftBefore} borderColor="#DC2626" defaultPriority="High" />
      <TableSection title="Post-Close Monitoring" rows={postClose}   draft={draftPost}   setter={setDraftPost}   borderColor="#D97706" defaultPriority="Med" />
    </div>
  );
}

const TRELLIS_CHAPTER_RATINGS = [
  { chapter: "Manager, Ownership & Governance",                rating: "YELLOW" },
  { chapter: "Legal, Regulatory & Compliance",                 rating: "RED"    },
  { chapter: "Technology, Cybersecurity & Business Resilience",rating: "RED"    },
  { chapter: "Fund Structure, Terms & Investor Alignment",     rating: "GREEN"  },
  { chapter: "Service Providers, Delegation & Oversight",      rating: "GREEN"  },
  { chapter: "Investment Operations & Portfolio Controls",      rating: "YELLOW" },
  { chapter: "Valuation, Asset Existence & Investor Reporting",rating: "YELLOW" },
  { chapter: "Manager Transparency & LP Communications",       rating: "GREEN"  },
];

const AURORA_CHAPTER_RATINGS = [
  { chapter: "Manager, Ownership & Governance",                rating: "YELLOW" },
  { chapter: "Legal, Regulatory & Compliance",                 rating: "YELLOW" },
  { chapter: "Technology, Cybersecurity & Business Resilience",rating: "GREEN"  },
  { chapter: "Fund Structure, Terms & Investor Alignment",     rating: "GREEN"  },
  { chapter: "Service Providers, Delegation & Oversight",      rating: "GREEN"  },
  { chapter: "Investment Operations & Portfolio Controls",      rating: "GREEN"  },
  { chapter: "Valuation, Asset Existence & Investor Reporting",rating: "GREEN"  },
  { chapter: "Manager Transparency & LP Communications",       rating: "GREEN"  },
];

const RATING_DOT: Record<string, string> = { GREEN: "#10B981", YELLOW: "#F59E0B", RED: "#EF4444" };
const RATING_BG:  Record<string, string> = { GREEN: "#f0fdf4",  YELLOW: "#fffbeb",  RED: "#fef2f2"  };

function TrellisRating({ topicRatingOverrides, onRatingChange, slug }: { topicRatingOverrides?: Record<number, string>; onRatingChange?: (topicNumber: number, rating: string) => void; slug?: string }) {
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const isAurora = slug === "aurora-capital-iv";
  const baseRatings = isAurora ? AURORA_CHAPTER_RATINGS : TRELLIS_CHAPTER_RATINGS;
  const fundName = isAurora ? "Aurora Ventures IV, L.P." : "Trellis Capital IV, L.P.";
  const managerLine = isAurora ? "Aurora Capital Management, LLC · April 2026" : "Trellis Capital Management, LLC · April 2026";

  // topic_number is 1-indexed; ratings array is 0-indexed
  const rows = baseRatings.map((cr, i) => ({
    ...cr,
    rating: (topicRatingOverrides?.[i + 1] ?? cr.rating).toUpperCase(),
    topicNum: i + 1,
  }));
  const green  = rows.filter(r => r.rating === "GREEN").length;
  const yellow = rows.filter(r => r.rating === "YELLOW").length;
  const red    = rows.filter(r => r.rating === "RED").length;

  function handlePick(topicNum: number, newRating: string) {
    // propagate up to Review2Page
    onRatingChange?.(topicNum, newRating);
    // also persist to DB (same table as TopicPage edits)
    if (slug) {
      fetch("/api/app-portal/topic-rating", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ review_slug: slug, topic_number: topicNum, rating: newRating }),
      }).catch(() => {});
    }
    setEditingRow(null);
  }

  return (
    <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: "36px 40px", fontFamily: "ui-sans-serif, -apple-system, sans-serif" }}>
      <div style={{ marginBottom: 28, paddingBottom: 20, borderBottom: "2px solid #111827" }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#9ca3af", marginBottom: 6 }}>Chapter Ratings</div>
        <div style={{ fontSize: 22, fontWeight: 700, color: "#111827", marginBottom: 2 }}>{fundName}</div>
        <div style={{ fontSize: 13, color: "#6b7280" }}>{managerLine}</div>
      </div>
      <div style={{ display: "flex", gap: 12, marginBottom: 28 }}>
        {([["GREEN", green, "#10B981", "#f0fdf4"], ["YELLOW", yellow, "#F59E0B", "#fffbeb"], ["RED", red, "#EF4444", "#fef2f2"]] as const).map(([label, count, color, bgc]) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 8, background: bgc, border: `1px solid ${color}40` }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
            <span style={{ fontSize: 12, fontWeight: 700, color }}>{count}</span>
            <span style={{ fontSize: 12, color: "#6b7280" }}>{label.charAt(0) + label.slice(1).toLowerCase()}</span>
          </div>
        ))}
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
            <th style={{ textAlign: "left", padding: "8px 12px 8px 0", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#9ca3af" }}>Chapter</th>
            <th style={{ textAlign: "right", padding: "8px 0 8px 12px", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#9ca3af", width: 200 }}>Rating</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ chapter, rating, topicNum }, i) => (
            <tr key={i} style={{ borderBottom: "1px solid #f3f4f6" }}>
              <td style={{ padding: "14px 12px 14px 0", fontSize: 13, color: "#111827" }}>
                <span style={{ fontSize: 11, color: "#9ca3af", marginRight: 10 }}>{i + 1}</span>
                {chapter}
              </td>
              <td style={{ padding: "10px 0", textAlign: "right" }}>
                {editingRow === topicNum ? (
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                    {(["GREEN", "YELLOW", "RED"] as const).map((r) => (
                      <button
                        key={r}
                        onClick={() => handlePick(topicNum, r)}
                        style={{
                          display: "inline-flex", alignItems: "center", gap: 5,
                          padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 700,
                          background: r === rating ? RATING_BG[r] : "#f9fafb",
                          color: RATING_DOT[r],
                          border: `1.5px solid ${r === rating ? RATING_DOT[r] : "#e5e7eb"}`,
                          cursor: "pointer", letterSpacing: "0.06em",
                        }}
                      >
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: RATING_DOT[r], display: "inline-block" }} />
                        {r}
                      </button>
                    ))}
                    <button onClick={() => setEditingRow(null)} style={{ marginLeft: 4, fontSize: 12, color: "#9ca3af", background: "none", border: "none", cursor: "pointer" }}>✕</button>
                  </div>
                ) : (
                  <button
                    onClick={() => setEditingRow(topicNum)}
                    title="Click to change rating"
                    style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 6, fontSize: 11, fontWeight: 700, background: RATING_BG[rating] ?? "#f9fafb", color: RATING_DOT[rating] ?? "#9ca3af", letterSpacing: "0.06em", border: "none", cursor: "pointer" }}
                  >
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: RATING_DOT[rating] ?? "#9ca3af", display: "inline-block" }} />
                    {rating}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const AURORA_ASSESSMENT_INTRO1 = `Aurora Capital Management, LLC ("Aurora," the "Manager") is an early-stage venture capital firm founded August 17, 2017 and operating on a fully-remote basis from Los Angeles, California. The firm is owned by Marcus Reeves (40%), Daniel Brenner (40%), and Rebecca Stern (20%) and is registered as an Exempt Reporting Adviser with the SEC under the venture capital adviser exemption (CRD 312044). As of March 26, 2026, the Manager reported regulatory AUM of $981.54 million across all advised private fund vehicles (excluding $215.59 million of uncalled capital commitments to Aurora Ventures IV, L.P.), up from $814.59 million at the prior year. Total headcount is 9 FTEs (6 investment professionals, 3 back office / operations).`;

const AURORA_ASSESSMENT_INTRO2 = `The Manager is currently raising Aurora Ventures IV, L.P. (the "Fund"), a Delaware limited partnership formed August 31, 2025 with a $250M target and $250M hard cap. The Fund's General Partner is Aurora Ventures IV GP, LLC. GP commitment is at least $9.0M (~3% of target commitments), of which roughly half is satisfied via management fee offset rather than additional cash contribution. The Fund intends to invest at the pre-seed and seed stage with selective Series A participation across consumer, entertainment, and emerging technology sectors. The Fund's predecessor, Aurora Ventures III, is a 2021 vintage that produced top-quartile performance including realized exits in fintech, consumer, AI infrastructure, and mobility. The Silverline / Aurora Joint Venture produced DPIs of 30x and 28x on two investments.`;

const AURORA_ASSESSMENT_NOTES = `As our primary observation, we highlight that principals' significant external business interests create elevated headline risk that warrants close ongoing monitoring. Marcus Reeves is a prominent actor and film producer; Daniel Brenner is a talent manager for internationally recognized entertainers. Both are subject to elevated media scrutiny. This issue is compounded by Daniel Brenner being a named defendant in a purported class action filed December 2024 in the U.S. District Court for the Central District of California (Montgomery & Reed LLP, plaintiffs' counsel) related to the Mythic Technologies / LunarPay "Crystal Tiger Society" NFT promotion. The SEC is separately investigating Mythic Studios regarding whether NFT/crypto offerings constituted unregistered securities. Former Aurora employee Priya Desai is a co-defendant and departed Aurora in September 2025. The matter is ongoing; the Manager represents that the claims are without merit and intends to defend vigorously. Investors are recommended to monitor legal and reputational developments closely.

Separately, we highlight that Aurora does not have a dedicated Chief Compliance Officer. Kevin Park (VP Finance and Operations) serves as acting CCO in addition to all back office, accounting, finance, and operations responsibilities. This creates segregation of duties concerns and limits compliance bandwidth as the firm scales. In partial mitigation, Aurora engaged Apex Compliance Advisors in Q3 2025 as external compliance consultant to formalize the compliance program and conducted annual compliance training in January 2026. We recommend hiring a dedicated CCO by 2027 as AUM and operational complexity scale beyond $1.0 billion.

With respect to expert networks, Aurora has contracted InsightSphere but has not adopted substantive controls. There is no written expert network policy, no pre-clearance requirement for calls, no blackout periods for experts at public companies, no MNPI script delivered at the onset of calls, and no compliance chaperoning of calls. We recommend implementation of all five controls before final close.

From a fund structure perspective, the Fund's GP commitment is partially cashless — approximately $4.5M of the $9.0M target commitment is satisfied via management fee reduction rather than upfront cash contribution. This reduces "skin in the game" relative to a fully cash-funded commitment. We recommend monitoring of this in future vintages and encourage a fully cash-funded GP commitment as AUM scales.

On the technology and resilience front, the firm operates a fully cloud-based stack (Microsoft 365, AWS-hosted services, Vantage Tech Partners-managed endpoints), and adopted a Written Information Security Policy (WISP), Incident Response Plan, and Business Continuity Plan in late November 2025 in response to Alpine follow-up requests. Annual cybersecurity training was implemented in January 2026. We note that no endpoint data loss prevention (DLP) solution is deployed and no network penetration testing has been performed, and recommend endpoint DLP implementation and a cloud-focused penetration test by year-end 2026.

Service provider infrastructure is appropriate. Meridian Fund Services, LLC has been engaged as fund administrator pursuant to the Administration Agreement dated August 31, 2025; Meridian uses LedgerCraft Enterprise and Polaris for fund accounting and partnership capital. Aurora Ventures III FY2024 audited financials reviewed; opinion issued by Grant Baker LLP was unqualified, and Grant Baker is expected to perform Fund IV's inaugural audit. Outbound wires require dual approval from Kevin Park (VP Finance) and Rebecca Stern (GP); Meridian initiates wires and requires original invoices and verification callbacks for new or changed payment instructions.

From a valuation perspective, Aurora has not engaged a third-party valuation agent. All portfolio valuations are prepared internally; Meridian accepts manager-prepared valuations at quarter-end without independent verification procedures, with annual audit providing the only external pricing check. Carried interest waterfall calculations are maintained in Excel. The valuation committee (Stern, Park, Knight, Ruiz) consists predominantly of investment professionals. We strongly recommend appointment of a third-party valuation agent before Fund IV final close and reconstitution of the valuation committee to include majority senior non-investment professionals.

Overall, based on the Manager's institutional service provider infrastructure, dual-approval wire process, proactive disclosure of operational limitations during diligence, and strong prior-vintage performance — balanced against the headline risk profile of the principals, the ongoing Mythic/LunarPay matter, and the absence of an external valuation agent and dedicated CCO — we are providing an Accept overall rating with active post-close monitoring across the items identified above.

Pre-Launch Note: Our assessment is based on the Manager's representations at the time of this review, including the in-progress engagement of Grant Baker LLP as Fund IV auditor and the planned implementation of expert network controls and endpoint DLP. Any material changes in these areas, or in the trajectory of the Mythic/LunarPay matter, may affect our rating.`;

const ASSESSMENT_INTRO1_DEFAULT = `Trellis Capital Management, LLC ("Trellis," the "Manager") is a pre-seed stage venture capital firm founded in 2018 by Arjun Mehta (Co-Founder, Managing Partner) and Priya Sharma (Co-Founder, Managing Partner). The Manager reported net assets of $280.3 million as of December 31, 2025, plus $113.7 million in uncalled capital out of $274 million in total commitments across its first three funds. In addition, the firm manages several co-investment special purpose vehicles with $24.7 million in aggregate assets as of the same date.`;
const ASSESSMENT_INTRO2_DEFAULT = `The Manager is currently raising Trellis Capital IV, L.P. (the "Fund"), which has a $175 million target and a $200 million hard cap. The initial closing was held on April 1, 2026, with approximately $125 million in commitments; the final closing is expected within 1–2 months. The Fund's predecessor, Fund III, is a 2024 vintage that raised $150 million—a meaningful step-up from Fund II, a 2021 vintage that raised $78 million, and Fund I, a 2018 vintage that raised $47 million. Fund III was 64% deployed and reserved as of December 31, 2025; accordingly, the Manager does not anticipate commencing investment activity from the Fund until late 2026, when Fund III is expected to be substantially deployed.`;

const ASSESSMENT_NOTES_DEFAULT = `As our primary observation, we highlight that Trellis is a small organization, consisting of seven full-time staff, with resultant segregation of duties issues. The single non-investment professional is Sarah Collins (Head of Operations), whose responsibilities focus on running business operations and acting as an executive assistant for the Managing Partners, meaning that the funds operate without the oversight of an internal back office resource. From a practical standpoint, finance and accounting matters are handled by the third-party fund administrator, Apex, subject to oversight from the Managing Partners. Trellis has, however, recently retained the services of Raj Patel, an individual who provides fractional CFO / COO services to venture capital and private equity funds. The Manager communicated that Raj will focus on overseeing the work performed by Apex; however, we understand that he will not dedicate substantial time to the firm until Summer 2026. Raj is expected to serve in this capacity part-time until the hire of a full-time Head of Finance planned for 2027. Investors are recommended to monitor developments in this area.

Separately, we highlight that the firm's IT and cybersecurity environment is substantially underdeveloped at present, with a lack of formal policy documents and employee training program. In partial mitigation, the Manager stated that the Head of Operations is currently leading a search for a third-party cybersecurity vendor that will be tasked with conducting a formal cybersecurity audit, vulnerability test, creating a formal cybersecurity policy, and implementing a cybersecurity training program (inclusive of a phishing campaign) by the end of 2026: investors are recommended to monitor developments in this area. We would also suggest the creation of a written BCP, which should include details on how the firm and critical service providers are prepared for unexpected events, provisions for loss / unavailability of any key service providers, procedures to protect staff during a crisis, and handling of communications with key stakeholders.

The firm is exempt from SEC registration under the venture capital adviser exemption and accordingly files as an Exempt Reporting Adviser ("ERA"). While the firm's compliance policies and procedures are aligned with the regulatory requirements of its ERA status, we highlight that Priya Sharma (Co-Founder, Managing Partner) is responsible for compliance oversight in addition to his investment role. We are strongly opposed to an investment professional being responsible for compliance and would prefer to see this responsibility reside with a non-investment professional, such as the Head of Operations. We would also suggest the implementation of a process for staff to attest to the firm's compliance policies upon hire and annually thereafter, as well as the implementation of an annual compliance training program. To assist in enhancing the compliance program and "culture" of compliance, the firm should consider engaging a reputable compliance consultant under a broader remit.

We also highlight that the firm does not track individual cash transactions and aggregate cash balances of the funds, and instead relies solely on Apex to maintain and reconcile accounting books and records. Moreover, we highlight that, to date, there has been no back office oversight of the Administrator's accounting work, although this is expected to be remedied through the appointment of Raj Patel as a part-time CFO and the planned hire of a full-time Head of Finance next year.

Although the Fund's LPA contains a provision indicating that the Fund shall have an investor advisory board (commonly known as an LPAC), the Manager stated that an LPAC will only be formed, in practice, if requested by multiple of the Fund's larger investors. We note that LPACs have also not been established for the prior funds. We would welcome the creation of an LPAC, which would introduce a degree of independence to the Fund's governance.

Our review identified that appropriate cash controls have been implemented, with all cash movements from Pacific Commerce effected using the bank's online banking platform, which requires Apex to initiate wires and one of the firm's Managing Partners to release.

From an asset existence perspective, multiple parties are involved in each transaction, meaning that any attempt to create a fictitious investment would require collusion amongst various employees and external parties. The Manager represented that as part of the annual audits, Baker Thompson issues audit confirmations to a sample of underlying portfolio companies (noted to be roughly half of the 140 portfolio companies for FY2025). On its side, Apex confirmed that it receives all investment documents and wire instructions from the firm, excluding share certificates issued via Carta which are obtained directly from the Carta platform. Apex does, however, independently verify wire details with portfolio companies prior to initiating wires.

The firm values its portfolio companies at cost and marks investments up / down based on the price of a subsequent financing round in which a significant new investor has participated. Looking forward, we would strongly prefer to see the incorporation of the part-time CFO and, once hired, the full-time Head of Finance in the valuation process in order to provide a degree of back office oversight.

We also highlight that the firm does not have a formal valuation committee, which would be the suitable forum for reviewing and approving quarterly valuations. As the firm grows, we would prefer for the committee to be represented by a majority of non-investment professionals.

Overall, based on the firm's current lack of back office function, its cybersecurity environment, and an investment professional being responsible for compliance, we are providing a Yellow overall rating. We would be amenable to providing a Green rating once the back office and cybersecurity enhancements as described above are fully implemented later this year. Investors should monitor developments in this area and, considering the Fund's final closing is expected to occur in the next 1-2 months, we would suggest that investors either (a) require the firm to commit to these enhancements in writing via a side letter or otherwise, or (b) push the firm to accelerate the timeline for these enhancements prior to investing.

Pre-Launch Note: Our assessment is based on the Manager's assertions at the time of this review considering the Fund has not formally commenced operations and service providers for the Fund have not yet been formally engaged (though they remain consistent with the prior funds). Any changes in these areas might affect our rating.`;

function TrellisAssessment({ slug }: { slug?: string }) {
  const isAurora = slug === "aurora-capital-iv";
  const defaultIntro1 = isAurora ? AURORA_ASSESSMENT_INTRO1 : ASSESSMENT_INTRO1_DEFAULT;
  const defaultIntro2 = isAurora ? AURORA_ASSESSMENT_INTRO2 : ASSESSMENT_INTRO2_DEFAULT;
  const defaultNotes = isAurora ? AURORA_ASSESSMENT_NOTES : ASSESSMENT_NOTES_DEFAULT;
  const fundName = isAurora ? "Aurora Ventures IV, L.P." : "Trellis Capital IV, L.P.";
  const subLine = isAurora
    ? "Aurora Capital Management, LLC · Early-Stage Venture Capital · April 2026"
    : "Trellis Capital Management, LLC · Pre-seed Venture Capital · April 2026";

  const [intro1, setIntro1] = useState(defaultIntro1);
  const [intro2, setIntro2] = useState(defaultIntro2);
  const [notes, setNotes] = useState(defaultNotes);
  const [editing, setEditing] = useState(false);
  const [draftIntro1, setDraftIntro1] = useState(defaultIntro1);
  const [draftIntro2, setDraftIntro2] = useState(defaultIntro2);
  const [savedFlash, setSavedFlash] = useState(false);

  // Load from DB on mount
  useEffect(() => {
    if (!slug) return;
    fetch(`/api/app-portal/assessment-draft?slug=${encodeURIComponent(slug)}`)
      .then(r => r.json())
      .then((data) => {
        if (!data) return;
        if (data.intro1 != null) { setIntro1(data.intro1); setDraftIntro1(data.intro1); }
        if (data.intro2 != null) { setIntro2(data.intro2); setDraftIntro2(data.intro2); }
        if (data.notes != null) setNotes(data.notes);
      })
      .catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  function persist(i1: string, i2: string, n: string) {
    if (!slug) return;
    fetch("/api/app-portal/assessment-draft", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ review_slug: slug, intro1: i1, intro2: i2, notes: n }),
    }).catch(() => {});
  }

  function handleSaveIntro() {
    setIntro1(draftIntro1);
    setIntro2(draftIntro2);
    setEditing(false);
    persist(draftIntro1, draftIntro2, notes);
  }

  function handleCancelIntro() {
    setDraftIntro1(intro1);
    setDraftIntro2(intro2);
    setEditing(false);
  }

  function handleSaveNotes() {
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 2000);
    persist(intro1, intro2, notes);
  }

  const TA_STYLE: React.CSSProperties = {
    width: "100%", padding: "12px 14px", fontSize: 13, color: "#111827", lineHeight: 1.75,
    border: "1px solid #d1d5db", borderRadius: 8, resize: "vertical", outline: "none",
    fontFamily: "ui-sans-serif, -apple-system, sans-serif", background: "#f9fafb",
    boxSizing: "border-box", marginBottom: 12,
  };

  return (
    <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: "36px 40px", fontFamily: "ui-sans-serif, -apple-system, sans-serif" }}>
      {/* Header + edit button */}
      <div style={{ marginBottom: 28, paddingBottom: 20, borderBottom: "2px solid #111827", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#9ca3af", marginBottom: 6 }}>ODD Assessment</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#111827", marginBottom: 2 }}>{fundName}</div>
          <div style={{ fontSize: 13, color: "#6b7280" }}>{subLine}</div>
        </div>
        <div className="flex items-center gap-2 shrink-0 pt-1">
          {editing ? (
            <>
              <button onClick={handleCancelIntro} className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">Cancel</button>
              <button onClick={handleSaveIntro} className="px-5 py-2 text-sm font-semibold text-white bg-alpine-violet rounded-lg hover:bg-alpine-violet/90 transition-colors">Save</button>
            </>
          ) : (
            <button onClick={() => setEditing(true)} className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              Edit Assessment
            </button>
          )}
        </div>
      </div>

      {/* Intro paragraphs */}
      <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.8, marginBottom: 32 }}>
        {editing ? (
          <>
            <textarea value={draftIntro1} onChange={e => setDraftIntro1(e.target.value)} rows={5} style={TA_STYLE} />
            <textarea value={draftIntro2} onChange={e => setDraftIntro2(e.target.value)} rows={7} style={TA_STYLE} />
          </>
        ) : (
          <>
            <p style={{ marginBottom: 16 }}>{intro1}</p>
            <p style={{ marginBottom: 16 }}>{intro2}</p>
          </>
        )}
      </div>

      {/* Analyst notes — always editable */}
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: "#6b7280" }}>Analyst Notes</div>
          <button
            onClick={handleSaveNotes}
            style={{
              padding: "6px 16px", fontSize: 12, fontWeight: 600, borderRadius: 7, cursor: "pointer", transition: "all 0.15s",
              background: savedFlash ? "#10B981" : "#111827", color: "#fff", border: "none",
            }}
          >
            {savedFlash ? "Saved ✓" : "Save"}
          </button>
        </div>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Add analyst assessment notes here…"
          style={{ ...TA_STYLE, minHeight: 320 }}
          onFocus={e => { e.target.style.borderColor = "#6b7280"; e.target.style.background = "#fff"; }}
          onBlur={e => { e.target.style.borderColor = "#d1d5db"; e.target.style.background = "#f9fafb"; }}
        />
      </div>
    </div>
  );
}

type OverviewFields = {
  managerOverview: string;
  fundOverview: string;
  controlsOverview: string;
  footerNote: string;
  strengths: string[];
  risksRed: string[];
  risksAmber: string[];
};

const AURORA_OVERVIEW_DEFAULTS: OverviewFields = {
  managerOverview: `Aurora Capital Management, LLC ("Aurora," the "Manager") is an early-stage venture capital firm registered as an Exempt Reporting Adviser with the SEC (CRD 312044). The Manager reported regulatory AUM of $981.54 million as of March 26, 2026, excluding $215.59 million of uncalled capital commitments to Fund IV. The firm is owned by Marcus Reeves (40%), Daniel Brenner (40%), and Rebecca Stern (20%) and operates on a fully-remote basis from Los Angeles, CA with 9 FTEs (6 investment, 3 back office / operations).`,
  fundOverview: `Aurora Ventures IV, L.P. (the "Fund") is a Delaware limited partnership formed August 31, 2025 with Aurora Ventures IV GP, LLC as its General Partner. The Fund targets a $250M raise with a $250M hard cap and invests at the pre-seed and seed stage with selective Series A participation across consumer, entertainment, and emerging technology sectors. GP commitment is at least $9.0M (~3% of target commitments), with approximately half satisfied via management fee offset rather than additional cash contribution. Fund term is 10 years with up to two one-year extensions.`,
  controlsOverview: `Meridian Fund Services, LLC ("Meridian") has been engaged as fund administrator pursuant to the Administration Agreement dated August 31, 2025; Meridian uses LedgerCraft Enterprise and Polaris for fund accounting. Grant Baker LLP is expected as auditor (Fund IV engagement letter pending; FY2024 audit of Aurora Ventures III completed by Grant Baker, unqualified opinion). Legal counsel is Brennan Kincaid LLP. Aurora has engaged Apex Compliance Advisors as external compliance consultant (Q3 2025) and Vantage Tech Partners for IT services (January 2026). Outbound wires require dual approval from Kevin Park (VP Finance) and Rebecca Stern (GP).`,
  footerNote: `As a closed-ended fund, valuations are produced quarterly for indicative purposes only, with no capital transactions following the fundraising period. The General Partner receives carried interest solely upon a realization event. Aurora has not engaged a third-party valuation agent; all portfolio valuations are prepared internally and Meridian accepts manager-prepared valuations at quarter-end without independent verification.`,
  strengths: [
    "Institutional service-provider infrastructure with Meridian Fund Services as administrator and Grant Baker LLP as expected auditor.",
    "Dual-approval outbound wire process with Meridian initiation and original-invoice validation.",
    "Strong prior-vintage performance, including DPI of 30x and 28x on two investments in the Silverline / Aurora Joint Venture.",
    "Proactive disclosure of operational limitations during due diligence, including the Mythic / LunarPay matter, partially cashless GP commitment, and absence of dedicated CCO.",
  ],
  risksRed: [],
  risksAmber: [
    "Principals maintain significant external business interests (actor/film producer; entertainer talent management); elevated headline risk compounded by Daniel Brenner's ongoing Mythic / LunarPay class action.",
    "No dedicated Chief Compliance Officer — Kevin Park serves as acting CCO in addition to VP Finance and Operations duties.",
    "Expert network controls insufficient: no written policy, pre-clearance, blackout periods, MNPI script, or compliance chaperoning.",
    "No third-party valuation agent appointed; Meridian accepts manager-prepared valuations at quarter-end without independent verification.",
    "GP commitment is partially cashless — approximately half satisfied via management fee offset rather than cash contribution.",
    "No formal succession plan at the business level; no key person insurance.",
  ],
};

const OVERVIEW_DEFAULTS: OverviewFields = {
  managerOverview: `Trellis Capital Management, LLC ("Trellis," the "Manager") is a pre-seed stage venture capital firm with net assets of $280.3 million as of December 31, 2025, plus $113.7 million in uncalled capital. The firm is headquartered in San Francisco and operates with seven full-time staff.`,
  fundOverview: `Trellis Capital IV, L.P. (the "Fund") is a Delaware limited partnership formed on March 28, 2026, investing in pre-seed technology companies under a closed-ended structure. The Fund held its initial closing on April 1, 2026 with approximately $125 million in commitments. The target raise is $175 million with a $200 million hard cap; the final closing is expected within 1–2 months.`,
  controlsOverview: `Apex Fund Services, LLC ("Apex") has been engaged to provide administration services to the Fund. The Fund's auditor is Baker, Thompson & Co. LLP ("Baker Thompson"), and the Fund maintains a banking relationship with Pacific Commerce Bank. Trellis uses a proprietary Retool dashboard for deal pipeline tracking and an Excel dashboard for financial metrics monitoring. Apex maintains the official accounting books and records on the Xero platform.`,
  footerNote: `As a closed-ended fund, valuations are produced quarterly for indicative purposes only, with no capital transactions following the fundraising period. The General Partner receives carried interest solely upon a realization event.`,
  strengths: [
    "Apex Fund Services engaged as administrator, with an established track record across institutional venture capital mandates.",
    "Appropriate cash controls implemented via a dual-authorization wire process through Apex.",
    "Multi-party asset verification architecture involving the administrator, auditor, and Carta cap table platform.",
  ],
  risksRed: [
    "Limited internal staffing with resultant segregation of duties concerns across investment, compliance, and operations functions.",
    "IT and cybersecurity environment is currently underdeveloped, with an absence of formal policy documentation and a structured training program.",
  ],
  risksAmber: [
    "An investment professional serves as compliance officer. Compliance controls could be strengthened with respect to policy attestations, annual training, and expanded consultant usage.",
    "No back-office oversight of accounting work performed by the Administrator; mitigated by the planned engagement of a fractional CFO in Summer 2026.",
    "No current plans for the Fund to establish a Limited Partner Advisory Committee.",
    "No formal valuation committee; valuations are currently approved exclusively by the Managing Partners.",
  ],
};

function TrellisOverview({ fields, onSave, slug }: { fields: OverviewFields; onSave: (f: OverviewFields) => void; slug?: string }) {
  const isAuroraOverview = slug === "aurora-capital-iv";
  const overviewFundName = isAuroraOverview ? "Aurora Ventures IV, L.P." : "Trellis Capital IV, L.P.";
  const overviewSubLine = isAuroraOverview
    ? "Aurora Capital Management, LLC · Early-Stage Venture Capital · April 2026"
    : "Trellis Capital Management, LLC · Pre-seed Venture Capital · April 2026";
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<OverviewFields>(fields);

  // keep draft in sync if parent fields change (e.g. after DB load)
  useEffect(() => { if (!editing) setDraft(fields); }, [fields, editing]);

  const set = (key: keyof OverviewFields, val: string | string[]) =>
    setDraft((prev) => ({ ...prev, [key]: val }));

  const setListItem = (key: "strengths" | "risksRed" | "risksAmber", idx: number, val: string) =>
    setDraft((prev) => {
      const arr = [...prev[key]];
      arr[idx] = val;
      return { ...prev, [key]: arr };
    });

  const addItem = (key: "strengths" | "risksRed" | "risksAmber") =>
    setDraft((prev) => ({ ...prev, [key]: [...prev[key], ""] }));

  const removeItem = (key: "strengths" | "risksRed" | "risksAmber", idx: number) =>
    setDraft((prev) => ({ ...prev, [key]: prev[key].filter((_, i) => i !== idx) }));

  function handleSave() {
    onSave(draft);
    setEditing(false);
  }
  function handleCancel() {
    setDraft(fields);
    setEditing(false);
  }

  const SECTION_TITLE: React.CSSProperties = { fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: "#6b7280", borderBottom: "1px solid #e5e7eb", paddingBottom: 6, marginBottom: 12 };
  const BODY: React.CSSProperties = { fontSize: 13, color: "#374151", lineHeight: 1.75, marginBottom: 20 };
  const BULLET_ITEM = ({ children, color }: { children: React.ReactNode; color: string }) => (
    <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
      <div style={{ width: 6, height: 6, borderRadius: "50%", background: color, flexShrink: 0, marginTop: 6 }} />
      <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.7 }}>{children}</div>
    </div>
  );

  const TA = ({ value, onChange, rows = 4 }: { value: string; onChange: (v: string) => void; rows?: number }) => (
    <textarea
      value={value}
      rows={rows}
      onChange={(e) => onChange(e.target.value)}
      className="w-full text-[13px] text-slate-700 leading-relaxed bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-alpine-violet/30 mb-4"
    />
  );

  const BulletEditor = ({ listKey, color, label }: { listKey: "strengths" | "risksRed" | "risksAmber"; color: string; label: string }) => (
    <div style={{ marginBottom: 16 }}>
      <div className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color }}>{label}</div>
      {draft[listKey].map((item, i) => (
        <div key={i} className="flex gap-2 mb-2 items-start">
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: color, flexShrink: 0, marginTop: 10 }} />
          <textarea
            value={item}
            rows={2}
            onChange={(e) => setListItem(listKey, i, e.target.value)}
            className="flex-1 text-[13px] text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 resize-none focus:outline-none focus:ring-2 focus:ring-alpine-violet/30"
          />
          <button onClick={() => removeItem(listKey, i)} className="mt-1 text-slate-300 hover:text-red-400 text-lg leading-none">×</button>
        </div>
      ))}
      <button onClick={() => addItem(listKey)} className="text-[11px] text-slate-400 hover:text-alpine-violet mt-1">+ Add item</button>
    </div>
  );

  return (
    <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: "36px 40px", fontFamily: "ui-sans-serif, -apple-system, sans-serif" }}>
      {/* Header + edit toolbar */}
      <div style={{ marginBottom: 20, paddingBottom: 16, borderBottom: "2px solid #111827", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#9ca3af", marginBottom: 6 }}>ODD Overview</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#111827", marginBottom: 2 }}>{overviewFundName}</div>
          <div style={{ fontSize: 13, color: "#6b7280" }}>{overviewSubLine}</div>
        </div>
        <div className="flex items-center gap-2 shrink-0 pt-1">
          {editing ? (
            <>
              <button onClick={handleCancel} className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">Cancel</button>
              <button onClick={handleSave} className="px-5 py-2 text-sm font-semibold text-white bg-alpine-violet rounded-lg hover:bg-alpine-violet/90 transition-colors">Save</button>
            </>
          ) : (
            <button onClick={() => setEditing(true)} className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              Edit Overview
            </button>
          )}
        </div>
      </div>

      {/* Two-column body */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 40px" }}>
        {/* Left column */}
        <div>
          <div style={SECTION_TITLE}>Manager Overview</div>
          {editing ? <TA value={draft.managerOverview} onChange={(v) => set("managerOverview", v)} rows={5} /> : <p style={BODY}>{fields.managerOverview}</p>}

          <div style={SECTION_TITLE}>Fund Overview</div>
          {editing ? <TA value={draft.fundOverview} onChange={(v) => set("fundOverview", v)} rows={5} /> : <p style={BODY}>{fields.fundOverview}</p>}

          <div style={SECTION_TITLE}>Controls Overview</div>
          {editing ? <TA value={draft.controlsOverview} onChange={(v) => set("controlsOverview", v)} rows={6} /> : <p style={BODY}>{fields.controlsOverview}</p>}

          {editing ? (
            <TA value={draft.footerNote} onChange={(v) => set("footerNote", v)} rows={3} />
          ) : (
            <p style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.7, borderTop: "1px solid #f3f4f6", paddingTop: 14, marginTop: 4 }}>{fields.footerNote}</p>
          )}
        </div>

        {/* Right column */}
        <div>
          <div style={SECTION_TITLE}>Strengths</div>
          {editing ? (
            <BulletEditor listKey="strengths" color="#10B981" label="Strengths" />
          ) : (
            <div style={{ marginBottom: 28 }}>
              {fields.strengths.map((s, i) => <BULLET_ITEM key={i} color="#10B981">{s}</BULLET_ITEM>)}
            </div>
          )}

          <div style={SECTION_TITLE}>Risks</div>
          {editing ? (
            <>
              <BulletEditor listKey="risksRed" color="#EF4444" label="High Risk" />
              <BulletEditor listKey="risksAmber" color="#F59E0B" label="Medium Risk" />
            </>
          ) : (
            <div>
              {fields.risksRed.map((r, i) => <BULLET_ITEM key={i} color="#EF4444">{r}</BULLET_ITEM>)}
              {fields.risksAmber.map((r, i) => <BULLET_ITEM key={i} color="#F59E0B">{r}</BULLET_ITEM>)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const REF_SOURCES = [
  { label: "Fund Document",      color: "#60A5FA" },
  { label: "SEC EDGAR",          color: "#34D399" },
  { label: "Alpine Analysis",    color: "#A78BFA" },
  { label: "Admin Verification", color: "#FBBF24" },
] as const;

// Default source by section index
const SECTION_SRC_DEFAULT = [
  "Fund Document",      // 0 Manager, Ownership & Governance
  "SEC EDGAR",          // 1 Legal, Regulatory & Compliance
  "Alpine Analysis",    // 2 Technology, Cybersecurity
  "Fund Document",      // 3 Fund Structure, Terms
  "Admin Verification", // 4 Service Providers
  "Alpine Analysis",    // 5 Investment Operations
  "Alpine Analysis",    // 6 Valuation
  "Fund Document",      // 7 Manager Transparency
];

function TrellisReferenceData({ slug, onOpenDoc }: { slug?: string; onOpenDoc?: (filename: string, quote: string, label: string) => void }) {
  const isAuroraRef = slug === "aurora-capital-iv";
  const refFundName = isAuroraRef ? "Aurora Ventures IV, L.P." : "Trellis Capital IV, L.P.";
  const refSubLine = isAuroraRef
    ? "Aurora Capital Management, LLC · Early-Stage Venture Capital · April 2026"
    : "Trellis Capital Management, LLC · Pre-seed Venture Capital · April 2026";
  const REF_SECTIONS = isAuroraRef ? AURORA_REF_SECTIONS : TRELLIS_REF_SECTIONS;
  const ROW_META = isAuroraRef ? AURORA_ROW_META : TRELLIS_ROW_META;
  const STORAGE_KEY = `alpine-refdata-draft-${slug || "default"}`;
  const [overrides, setOverrides] = useState<Record<string, string>>(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); } catch { return {}; }
  });
  const [editMode, setEditMode] = useState(false);
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/app-portal/reference-data-draft?slug=${encodeURIComponent(slug)}`)
      .then(r => r.json())
      .then(({ values }) => {
        if (values && typeof values === "object") {
          setOverrides(values);
          try { localStorage.setItem(STORAGE_KEY, JSON.stringify(values)); } catch {}
        }
      })
      .catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  function rowKey(si: number, gi: number, ri: number) { return `${si}.${gi}.${ri}`; }

  function displayValue(si: number, gi: number, ri: number, fallback: string) {
    const k = rowKey(si, gi, ri);
    if (editMode && k in draft) return draft[k];
    return overrides[k] ?? fallback;
  }

  function startEdit() {
    setDraft({ ...overrides });
    setEditMode(true);
  }

  function cancelEdit() {
    setDraft({});
    setEditMode(false);
  }

  async function saveEdit() {
    setSaving(true);
    const next: Record<string, string> = {};
    for (const [k, v] of Object.entries(draft)) {
      if (v.trim().length > 0) next[k] = v;
    }
    setOverrides(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
    if (slug) {
      try {
        await fetch("/api/app-portal/reference-data-draft", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ review_slug: slug, values: next }),
        });
      } catch {}
    }
    setSaving(false);
    setEditMode(false);
    setDraft({});
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1800);
  }

  async function resetEdits() {
    if (!confirm("Reset all edits to original values?")) return;
    setOverrides({});
    setDraft({});
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    if (slug) {
      try { await fetch(`/api/app-portal/reference-data-draft?slug=${encodeURIComponent(slug)}`, { method: "DELETE" }); } catch {}
    }
    setEditMode(false);
  }

  function getRowMeta(label: string, si: number): { source: string; quote: string } {
    const direct = ROW_META[label];
    if (direct) return direct;
    if (isAuroraRef) {
      const fallbackSources = ["Form ADV","SEC_EDGAR","ALPINE_ANALYSIS","LPA","ADMIN_VERIFICATION","ALPINE_ANALYSIS","Valuation Policy","DDQ"];
      return { source: fallbackSources[si] ?? "Form ADV", quote: `Source data for "${label}" as confirmed during the Alpine due diligence review of Aurora Ventures IV, L.P.` };
    }
    return { source: ["trellis_form_adv.pdf","SEC_EDGAR","ALPINE_ANALYSIS","trellis_lpa.pdf","Trellis-Capital-Apex-Service-Description-Fund-III.pdf","ALPINE_ANALYSIS","Trellis-Capital-Valuation-Policy.pdf","trellis_ppm.pdf"][si] ?? "trellis_form_adv.pdf", quote: `Source data for "${label}" as confirmed during the Alpine due diligence review of Trellis Capital IV, L.P.` };
  }

  function dotColor(source: string): string {
    return SOURCE_DOT_COLORS[source] ?? "#60A5FA";
  }

  function lookupSourceMeta(source: string) {
    if (isAuroraRef) return AURORA_SOURCE_META[source] ?? SOURCE_META[source];
    return SOURCE_META[source];
  }

  function handleDotClick(label: string, si: number) {
    if (!onOpenDoc || editMode) return;
    const { source, quote } = getRowMeta(label, si);
    const meta = lookupSourceMeta(source);
    if (meta?.filename) {
      onOpenDoc(meta.filename, quote, meta.label);
    }
  }

  const hasOverrides = Object.keys(overrides).length > 0;

  return (
    <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: "32px 40px", fontFamily: "ui-sans-serif, -apple-system, sans-serif" }}>
      {/* Header */}
      <div style={{ marginBottom: 20, display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#9ca3af", marginBottom: 6 }}>Reference Data</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#111827", marginBottom: 2 }}>{refFundName}</div>
          <div style={{ fontSize: 13, color: "#6b7280" }}>{refSubLine}</div>
        </div>
        <div className="flex items-center gap-2 shrink-0 pt-1">
          {savedFlash && <span style={{ fontSize: 11, color: "#059669", fontWeight: 600 }}>Saved</span>}
          {!editMode ? (
            <>
              {hasOverrides && (
                <button onClick={resetEdits} className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">Reset</button>
              )}
              <button onClick={startEdit} className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                Edit
              </button>
            </>
          ) : (
            <>
              <button onClick={cancelEdit} disabled={saving} className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-60">Cancel</button>
              <button onClick={saveEdit} disabled={saving} className="px-5 py-2 text-sm font-semibold text-white bg-alpine-violet rounded-lg hover:bg-alpine-violet/90 transition-colors disabled:opacity-60">{saving ? "Saving…" : "Save"}</button>
            </>
          )}
        </div>
      </div>
      {/* Source legend */}
      <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "6px 20px", padding: "10px 0 18px", borderBottom: "1px solid #f3f4f6", marginBottom: 28 }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.12em" }}>Sources</span>
        <div style={{ width: 1, height: 12, background: "#e5e7eb" }} />
        {REF_SOURCES.map(s => (
          <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: s.color }} />
            <span style={{ fontSize: 11, color: "#6b7280" }}>{s.label}</span>
          </div>
        ))}
        <span style={{ fontSize: 11, color: "#9ca3af", marginLeft: 4 }}>· {editMode ? "Editing values — click Save to persist" : "Click dot to view source"}</span>
      </div>

      {REF_SECTIONS.map((section, si) => (
        <div key={section.title} style={{ marginBottom: 36 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#111827", borderBottom: "2px solid #111827", paddingBottom: 6, marginBottom: 16 }}>{section.title}</div>
          {section.groups.map((group, gi) => (
            <div key={group.heading} style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#6b7280", marginBottom: 8 }}>{group.heading}</div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <tbody>
                  {group.rows.map(([label, value], ri) => {
                    const { source } = getRowMeta(label, si);
                    const dc = dotColor(source);
                    const k = rowKey(si, gi, ri);
                    const current = displayValue(si, gi, ri, value);
                    const isEdited = !editMode && k in overrides && overrides[k] !== value;
                    const isLong = current.length > 60;
                    return (
                      <tr key={ri} style={{ borderBottom: "1px solid #f3f4f6" }}>
                        <td style={{ padding: "7px 12px 7px 0", width: "40%", fontSize: 12, color: "#6b7280", verticalAlign: "top" }}>{label}</td>
                        <td style={{ padding: "7px 0", fontSize: 12, color: "#111827", fontWeight: 500, verticalAlign: "top" }}>
                          <div style={{ display: "flex", alignItems: "flex-start", gap: 8, justifyContent: "space-between" }}>
                            {editMode ? (
                              isLong ? (
                                <textarea
                                  value={current}
                                  onChange={(e) => setDraft(d => ({ ...d, [k]: e.target.value }))}
                                  rows={Math.min(6, Math.max(2, Math.ceil(current.length / 80)))}
                                  style={{ flex: 1, fontSize: 12, fontFamily: "inherit", color: "#111827", padding: "4px 8px", border: "1px solid #d1d5db", borderRadius: 4, outline: "none", resize: "vertical", lineHeight: 1.5 }}
                                />
                              ) : (
                                <input
                                  value={current}
                                  onChange={(e) => setDraft(d => ({ ...d, [k]: e.target.value }))}
                                  style={{ flex: 1, fontSize: 12, fontFamily: "inherit", color: "#111827", padding: "4px 8px", border: "1px solid #d1d5db", borderRadius: 4, outline: "none" }}
                                />
                              )
                            ) : (
                              <span style={isEdited ? { background: "#fef9c3", padding: "1px 4px", borderRadius: 3 } : undefined} title={isEdited ? `Edited (original: ${value})` : undefined}>{current}</span>
                            )}
                            <button
                              onClick={() => handleDotClick(label, si)}
                              title={editMode ? "Disabled while editing" : `View source: ${lookupSourceMeta(source)?.label ?? source}`}
                              style={{ width: 10, height: 10, borderRadius: "50%", background: dc, border: "none", cursor: editMode ? "default" : "pointer", flexShrink: 0, marginTop: 8, outline: "none", opacity: editMode ? 0.4 : 1 }}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default function DemoReportViewer(_props: { alpineReviewId?: string | null; finalReportPending?: boolean; isTrellis?: boolean; topicRatingOverrides?: Record<number, string>; onRatingChange?: (topicNumber: number, rating: string) => void; slug?: string }) {
  const { finalReportPending, isTrellis, topicRatingOverrides, onRatingChange, slug } = _props;
  const DRAFT_STORAGE_KEY = `alpine-report-draft-${slug || "default"}`;

  const [activeTab, setActiveTab] = useState<typeof TABS[number]>("AI Draft");
  const [showWatermarkModal, setShowWatermarkModal] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentAreaRef = useRef<HTMLDivElement>(null);
  const [refPopover, setRefPopover] = useState<RefPopoverState | null>(null);
  const [docViewer, setDocViewer] = useState<{ filename: string; quote: string; label: string } | null>(null);

  const isAurora = slug === "aurora-capital-iv";
  const defaultReportMd = isAurora ? AURORA_REPORT_MD : RIDGELINE_REPORT_MD;
  const [draftContent, setDraftContent] = useState<string>(() => {
    try {
      const cached = localStorage.getItem(DRAFT_STORAGE_KEY);
      // Invalidate stale cache that doesn't match the active fund
      if (cached && isAurora && cached.includes("Ridgeline Capital Partners")) return defaultReportMd;
      if (cached && !isAurora && cached.includes("Aurora Capital Management")) return defaultReportMd;
      return cached || defaultReportMd;
    } catch { return defaultReportMd; }
  });
  const [draftMode, setDraftMode] = useState<"view" | "edit">("view");
  const [savedFlash, setSavedFlash] = useState(false);

  // Load draft from DB on mount; DB wins over localStorage
  useEffect(() => {
    if (!slug) return;
    fetch(`/api/app-portal/report-draft?slug=${encodeURIComponent(slug)}`)
      .then(r => r.json())
      .then(({ content }) => {
        if (content) {
          setDraftContent(content);
          try { localStorage.setItem(DRAFT_STORAGE_KEY, content); } catch {}
        }
      })
      .catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  function saveDraft() {
    // Save to DB
    if (slug) {
      fetch("/api/app-portal/report-draft", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ review_slug: slug, content: draftContent }),
      }).catch(() => {});
    }
    // Also cache locally
    try { localStorage.setItem(DRAFT_STORAGE_KEY, draftContent); } catch {}
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 2000);
    setDraftMode("view");
  }

  function resetDraft() {
    setDraftContent(defaultReportMd);
    // Remove from DB
    if (slug) {
      fetch(`/api/app-portal/report-draft?slug=${encodeURIComponent(slug)}`, { method: "DELETE" }).catch(() => {});
    }
    try { localStorage.removeItem(DRAFT_STORAGE_KEY); } catch {}
    setDraftMode("view");
  }

  // ── Overview fields state ──────────────────────────────────────────────────
  const overviewSeed = isAurora ? AURORA_OVERVIEW_DEFAULTS : OVERVIEW_DEFAULTS;
  const [overviewFields, setOverviewFields] = useState<OverviewFields>(overviewSeed);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/app-portal/overview-draft?slug=${encodeURIComponent(slug)}`)
      .then(r => r.json())
      .then(({ fields }) => { if (fields) setOverviewFields({ ...overviewSeed, ...fields }); })
      .catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  function saveOverview(f: OverviewFields) {
    setOverviewFields(f);
    if (slug) {
      fetch("/api/app-portal/overview-draft", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ review_slug: slug, fields: f }),
      }).catch(() => {});
    }
  }
  // ──────────────────────────────────────────────────────────────────────────

  const headings = extractHeadings(draftContent);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    function handleDotClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      const source = target.getAttribute("data-ref-source");
      const quote = target.getAttribute("data-ref-quote");
      if (!source || !quote) return;
      const rect = target.getBoundingClientRect();
      const popW = 380;
      let left = rect.left + rect.width / 2 - popW / 2;
      left = Math.max(12, Math.min(left, window.innerWidth - popW - 12));
      let top = rect.bottom + 8;
      if (top + 300 > window.innerHeight) top = rect.top - 308;
      setRefPopover({ source, quote, top, left });
    }
    container.addEventListener("click", handleDotClick);
    return () => container.removeEventListener("click", handleDotClick);
  }, [activeTab]);

  function scrollTo(id: string) {
    const el = containerRef.current?.querySelector(`#${id}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }


  const renderedHtml = renderMarkdown(draftContent);

  return (
    <div className="space-y-4 animate-fade-in">
      {/* ── Output tabs (no dark header — matches ReportPageContent) ── */}
      <div className="flex items-center gap-1 border-b border-slate-200">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors relative ${
              activeTab === tab ? "text-alpine-violet" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab}
            {(tab === "AI Draft" || tab === "Data Report") && (
              <span className="ml-1.5 inline-block w-1.5 h-1.5 rounded-full bg-alpine-green align-middle" />
            )}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-alpine-violet" />
            )}
          </button>
        ))}
      </div>

      {/* ── View sub-tabs + Print/Export ── */}
      {(() => {
        // AI Draft and Final Report still ship a pre-rendered demo PDF.
        // All other tabs export only what's currently rendered in the tab via window.print() of a cloned subtree.
        const STATIC_PDF_TABS: Record<string, { file: string; saveAs: string }> = {
          "AI Draft":     { file: "/demo-docs/ridgeline/ridgeline_ddq_2026.pdf",   saveAs: "Ridgeline_Full_ODD_Report.pdf" },
          "Final Report": { file: "/demo-docs/trellis/sample_vc_fund_iv_alt.pdf", saveAs: "Trellis_Capital_IV_ODD_Final_Report.pdf" },
        };
        const isDisabled = finalReportPending && activeTab === "Final Report";
        const staticDl = STATIC_PDF_TABS[activeTab];

        function dateStamp() {
          const d = new Date();
          return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
        }

        function exportCurrentTabAsPdf() {
          const el = contentAreaRef.current;
          if (!el) return;
          const stamp = dateStamp();
          const fund = isAurora ? "Aurora_Ventures_IV" : isTrellis ? "Trellis_Capital_IV" : "Ridgeline";
          const tabSafe = activeTab.replace(/[^A-Za-z0-9]+/g, "_").replace(/^_|_$/g, "");
          const title = `${stamp}-${fund}-${tabSafe}`;

          // Clone current document's stylesheets so Tailwind + inline styles render in the new window.
          const styleNodes = Array.from(document.querySelectorAll("style, link[rel='stylesheet']"))
            .map(n => n.outerHTML)
            .join("\n");

          const win = window.open("", "_blank");
          if (!win) return;
          win.document.open();
          win.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${title}</title>${styleNodes}<style>html,body{margin:0;background:#fff;color:#0f172a;}body{padding:24px;}@media print{body{padding:0;}.no-print{display:none!important;}}</style></head><body>${el.outerHTML}</body></html>`);
          win.document.close();
          // Give the new window a tick to layout/load styles, then print.
          const triggerPrint = () => { try { win.focus(); win.print(); } catch {} };
          if (win.document.readyState === "complete") setTimeout(triggerPrint, 250);
          else win.addEventListener("load", () => setTimeout(triggerPrint, 250));
        }

        function exportStaticPdf() {
          if (!staticDl) return;
          const a = document.createElement("a");
          a.href = staticDl.file;
          a.download = `${dateStamp()}-${staticDl.saveAs}`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }

        return (
          <div className="flex items-center justify-between">
            <div />
            <div className="flex items-center gap-3">
              <p className="text-xs text-slate-400">
                {activeTab === "AI Draft" ? "Comprehensive IC-ready report with all findings" :
                 activeTab === "Data Report" ? (isTrellis ? "Structured reference data across all 8 ODD chapters" : "Verification data, document inventory, and evidence") :
                 activeTab === "Overview" ? "Manager and fund overview with strengths and risks" :
                 activeTab === "Assessment" ? "Chapter-by-chapter ODD assessment" :
                 activeTab === "Scope & Verification" ? "Scope of review and independent verification performed" :
                 activeTab === "Rating" ? "Topic-level ratings and rationale" :
                 activeTab === "Flag" ? "Risk flags identified across all chapters" :
                 activeTab === "Remediation" ? "Required before close and post-close monitoring items" :
                 "Final deliverable report for investment committee"}
              </p>
              <button onClick={() => window.print()} className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">Print</button>
              {activeTab === "Final Report" && !finalReportPending && (
                <button
                  onClick={() => setShowWatermarkModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors text-[#7c3aed] bg-[#f5f3ff] border border-[#7c3aed] hover:bg-[#ede9fe] cursor-pointer"
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  Send Watermarked Copy
                </button>
              )}
              <button
                disabled={isDisabled}
                onClick={() => {
                  if (isDisabled) return;
                  if (staticDl) exportStaticPdf();
                  else exportCurrentTabAsPdf();
                }}
                title={isDisabled ? "Complete report generation to export" : `Export ${activeTab} as PDF`}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  isDisabled
                    ? "text-slate-400 bg-slate-100 border border-slate-200 cursor-not-allowed"
                    : "text-white bg-slate-800 hover:bg-slate-700 cursor-pointer"
                }`}
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Export PDF
              </button>
            </div>
          </div>
        );
      })()}

      {/* ── Content ── */}
      {activeTab === "AI Draft" ? (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {/* Sources legend — hidden in edit mode */}
          {draftMode === "view" && (
            <div className="flex items-center flex-wrap gap-x-5 gap-y-1.5 px-8 py-3 border-b border-slate-100">
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Sources</span>
              <div className="w-px h-3 bg-slate-200" />
              {SOURCE_LEGEND.map((item) => (
                <div key={item.label} className="flex items-center gap-1.5">
                  <span className="w-[7px] h-[7px] rounded-full shrink-0" style={{ background: item.color }} />
                  <span className="text-[11px] text-slate-500">{item.label}</span>
                </div>
              ))}
            </div>
          )}

          {/* Jump To bar — hidden in edit mode */}
          {draftMode === "view" && headings.length > 0 && (
            <div className="flex items-center gap-1 px-8 py-2 border-b border-slate-100 overflow-x-auto">
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider shrink-0 mr-1">Jump to</span>
              {headings.map((h) => (
                <button
                  key={h.id}
                  onClick={() => scrollTo(h.id)}
                  className="shrink-0 px-2 py-1 text-[11px] text-slate-500 hover:text-alpine-violet hover:bg-alpine-violet/10 rounded transition-colors whitespace-nowrap"
                >
                  {h.text}
                </button>
              ))}
            </div>
          )}

          {/* Edit / Save toolbar */}
          <div className="flex items-center justify-end gap-2 px-8 py-3 border-b border-slate-100">
            {draftMode === "edit" ? (
              <>
                <span className="text-[11px] text-slate-400 mr-auto flex items-center gap-1.5">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  Editing markdown — changes save locally
                </span>
                <button
                  onClick={resetDraft}
                  className="px-4 py-2 text-sm font-medium text-slate-500 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Reset
                </button>
                <button
                  onClick={() => setDraftMode("view")}
                  className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveDraft}
                  className="px-5 py-2 text-sm font-semibold text-white bg-alpine-violet rounded-lg hover:bg-alpine-violet/90 transition-colors"
                >
                  {savedFlash ? "Saved ✓" : "Save"}
                </button>
              </>
            ) : (
              <button
                onClick={() => setDraftMode("edit")}
                className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                Edit Report
              </button>
            )}
          </div>

          {/* Report content — view or edit */}
          {draftMode === "edit" ? (
            <div className="p-4">
              <textarea
                value={draftContent}
                onChange={(e) => setDraftContent(e.target.value)}
                className="w-full h-[calc(100vh-320px)] bg-slate-50 border border-slate-200 rounded-lg p-6 text-[12px] font-mono text-slate-700 resize-none focus:outline-none focus:ring-2 focus:ring-alpine-violet/30 leading-relaxed"
                spellCheck={false}
              />
            </div>
          ) : (
            <div
              ref={containerRef}
              className="px-10 pt-5 pb-8 max-h-[calc(100vh-320px)] overflow-y-auto scroll-smooth"
              data-report-content
              dangerouslySetInnerHTML={{ __html: renderedHtml }}
            />
          )}
        </div>
      ) : activeTab === "Overview" ? (
        <div ref={contentAreaRef}><TrellisOverview fields={overviewFields} onSave={saveOverview} slug={slug} /></div>
      ) : activeTab === "Assessment" ? (
        <div ref={contentAreaRef}><TrellisAssessment slug={slug} /></div>
      ) : activeTab === "Rating" ? (
        <div ref={contentAreaRef}><TrellisRating topicRatingOverrides={topicRatingOverrides} onRatingChange={onRatingChange} slug={slug} /></div>
      ) : activeTab === "Flag" ? (
        <div ref={contentAreaRef}><TrellisFlag slug={slug} /></div>
      ) : activeTab === "Remediation" ? (
        <div ref={contentAreaRef}><TrellisRemediation slug={slug} /></div>
      ) : activeTab === "Scope & Verification" ? (
        <div ref={contentAreaRef} style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 32px" }}>
          <div style={{ textAlign: "center", color: "#9ca3af", fontSize: 14 }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🚧</div>
            <div style={{ fontWeight: 600, color: "#6b7280", marginBottom: 4 }}>{activeTab}</div>
            <div>Content coming soon</div>
          </div>
        </div>
      ) : activeTab === "Data Report" ? (
        <div ref={contentAreaRef}>{isTrellis ? <TrellisReferenceData slug={slug} onOpenDoc={(filename, quote, label) => setDocViewer({ filename, quote, label })} /> : <DataReportViewer data={RIDGELINE_DATA_REPORT} />}</div>
      ) : finalReportPending ? (
        <div ref={contentAreaRef} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "64px 32px", gap: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.18)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
            </svg>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>Final Report Pending</div>
            <div style={{ fontSize: 13, color: "#64748b", maxWidth: 360, lineHeight: 1.6 }}>
              The final deliverable is being compiled. Complete the report generation step to unlock the IC-ready PDF.
            </div>
          </div>
          <div style={{ marginTop: 8, padding: "10px 20px", borderRadius: 8, background: "rgba(124,58,237,0.05)", border: "1px solid rgba(124,58,237,0.15)", fontSize: 12, color: "#7c3aed", fontWeight: 500 }}>
            Report generation in queue · ~3 min remaining
          </div>
        </div>
      ) : (
        <div ref={contentAreaRef}><FinalReport slug={slug} topicRatingOverrides={topicRatingOverrides} onWatermark={() => setShowWatermarkModal(true)} /></div>
      )}
      {refPopover && <RefPopover info={refPopover} onClose={() => setRefPopover(null)} />}
      {docViewer && <DocViewerPanel filename={docViewer.filename} quote={docViewer.quote} label={docViewer.label} onClose={() => setDocViewer(null)} />}
      {showWatermarkModal && <WatermarkModal onClose={() => setShowWatermarkModal(false)} />}
    </div>
  );
}
