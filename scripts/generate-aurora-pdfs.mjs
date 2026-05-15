/**
 * Generates all 14 Aurora Capital Management institutional PDFs
 * for the Aurora Ventures IV due diligence demo.
 *
 * Run: node scripts/generate-aurora-pdfs.mjs
 */

import PDFDocument from "pdfkit";
import { createWriteStream, mkdirSync } from "fs";
import { join } from "path";

const OUT_DIR = "./public/demo-docs/aurora";
mkdirSync(OUT_DIR, { recursive: true });

// ── Brand constants ───────────────────────────────────────────────────────────
const NAVY   = "#0f1f3d";
const TEAL   = "#1a6b8a";
const GRAY   = "#4a5568";
const LGRAY  = "#718096";
const DIVIDER = "#d1d5db";
const WHITE  = "#ffffff";
const PAGE_W = 612, PAGE_H = 792;
const ML = 60, MR = 60, MT = 60, BODY_W = PAGE_W - ML - MR;

// ── Aurora firm info ──────────────────────────────────────────────────────────
const FIRM = {
  name:    "Aurora Capital Management, LLC",
  fund:    "Aurora Ventures IV, L.P.",
  gp:      "Aurora Ventures IV GP, LLC",
  address: "Los Angeles, California (Fully Remote)",
  website: "www.auroracapitalmgmt.com",
  crd:     "ERA Filing — CRD No. 312044 | ERA Filing since January 14, 2020",
  target:  "$300,000,000",
  hardcap: "$350,000,000",
  mgmtFee: "2.00% on commitments (commitment period) / 1.50% on invested capital (post-commitment)",
  carry:   "20% — American (deal-by-deal) waterfall; no preferred return",
  gpCommit:"$9,000,000 (~3.0% of aggregate commitments); cashless mechanism (50% cash / 50% fee offset)",
  strategy:"Early-stage venture capital — Enterprise SaaS, AI & Intelligent Compute, Blockchain Infrastructure, Consumer Mobile; North America & Israel",
  investPeriod: "5 years from first closing",
  fundTerm:"10 years + two one-year GP extensions",
  firstClose: "Expected Q2 2026 (~$135,000,000 committed)",
  finalClose: "Expected end of 2026",
  admin:   "Meridian Fund Services, LLC",
  auditor: "Grant Baker LLP",
  counsel: "Kensington Law Group LLP",
  tax:     "Brennan Kincaid LLP",
  itVendor:"Vantage Tech Partners",
  experts: "InsightSphere Expert Network",
  principals: [
    { name: "Marcus Reeves",   title: "Co-Founder / General Partner", ownership: "40%" },
    { name: "Daniel Brenner",  title: "Co-Founder / General Partner", ownership: "40%" },
    { name: "Rebecca Stern",   title: "General Partner",              ownership: "20%" },
    { name: "Austin Knight",   title: "Principal",                    ownership: "—"   },
    { name: "Sofia Marchetti", title: "Senior Associate",             ownership: "—"   },
    { name: "Connor Lyle",     title: "Analyst",                      ownership: "—"   },
    { name: "Kevin Park",      title: "VP, Finance and Operations",   ownership: "—"   },
    { name: "Elena Ruiz",      title: "Operating Partner",            ownership: "—"   },
  ],
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function newDoc() {
  return new PDFDocument({ size: "LETTER", margins: { top: MT, bottom: 60, left: ML, right: MR }, autoFirstPage: false });
}

function addPage(doc) {
  doc.addPage();
}

/** Header bar on every page */
function pageHeader(doc, title) {
  const y = 0;
  doc.rect(0, y, PAGE_W, 44).fill(NAVY);
  doc.fontSize(10).fillColor(WHITE).font("Helvetica-Bold")
     .text("AURORA CAPITAL MANAGEMENT", ML, 14, { width: 300 });
  doc.fontSize(9).fillColor("#a0aec0").font("Helvetica")
     .text(title, ML, 28, { width: 450 });
  doc.fontSize(8).fillColor("#a0aec0")
     .text(FIRM.fund, PAGE_W - MR - 200, 18, { width: 200, align: "right" });
  return 56;
}

/** Footer */
function pageFooter(doc, pageNum, total, confidential = true) {
  const y = PAGE_H - 36;
  doc.moveTo(ML, y).lineTo(PAGE_W - MR, y).strokeColor(DIVIDER).lineWidth(0.5).stroke();
  if (confidential) {
    doc.fontSize(7).fillColor(LGRAY).font("Helvetica")
       .text("CONFIDENTIAL — For Institutional Investor Use Only. Not for Distribution.", ML, y + 6, { width: BODY_W, align: "left" });
  }
  doc.fontSize(7).fillColor(LGRAY)
     .text(`Page ${pageNum}${total ? ` of ${total}` : ""}`, 0, y + 6, { width: PAGE_W - MR, align: "right" });
}

/** Section heading */
function sectionHead(doc, text, y) {
  doc.fontSize(11).fillColor(NAVY).font("Helvetica-Bold").text(text, ML, y);
  const nextY = doc.y + 3;
  doc.moveTo(ML, nextY).lineTo(PAGE_W - MR, nextY).strokeColor(TEAL).lineWidth(1).stroke();
  return doc.y + 8;
}

/** Two-column key-value row */
function kvRow(doc, label, value, y, labelW = 180) {
  const rowH = 16;
  doc.fontSize(8.5).fillColor(GRAY).font("Helvetica-Bold").text(label, ML, y, { width: labelW });
  doc.fontSize(8.5).fillColor("#1a202c").font("Helvetica").text(value, ML + labelW, y, { width: BODY_W - labelW });
  return Math.max(doc.y, y + rowH);
}

/** Body paragraph */
function para(doc, text, y, opts = {}) {
  doc.fontSize(opts.size || 9).fillColor(opts.color || "#1a202c").font(opts.bold ? "Helvetica-Bold" : "Helvetica")
     .text(text, ML, y, { width: BODY_W, align: "justify", lineGap: 2, ...opts });
  return doc.y + 6;
}

/** Cover page */
function coverPage(doc, docTitle, docSubtitle, date, extraLines = []) {
  addPage(doc);
  // Top bar
  doc.rect(0, 0, PAGE_W, 140).fill(NAVY);
  doc.fontSize(22).fillColor(WHITE).font("Helvetica-Bold")
     .text("AURORA CAPITAL MANAGEMENT", ML, 30, { width: BODY_W });
  doc.fontSize(13).fillColor("#90cdf4").font("Helvetica")
     .text(FIRM.fund, ML, 62, { width: BODY_W });
  doc.fontSize(10).fillColor("#a0aec0")
     .text("STRICTLY CONFIDENTIAL", ML, 90, { width: BODY_W });

  // Document title block
  doc.rect(ML, 155, BODY_W, 2).fill(TEAL);
  doc.fontSize(18).fillColor(NAVY).font("Helvetica-Bold")
     .text(docTitle, ML, 168, { width: BODY_W });
  doc.fontSize(11).fillColor(TEAL).font("Helvetica")
     .text(docSubtitle, ML, doc.y + 4, { width: BODY_W });
  doc.rect(ML, doc.y + 6, BODY_W, 2).fill(TEAL);

  let y = doc.y + 24;
  extraLines.forEach(line => {
    doc.fontSize(9).fillColor(GRAY).font("Helvetica").text(line, ML, y, { width: BODY_W });
    y = doc.y + 2;
  });

  // Firm info box
  const boxY = Math.max(y + 16, 370);
  doc.rect(ML, boxY, BODY_W, 120).stroke(DIVIDER);
  doc.fontSize(8).fillColor(LGRAY).font("Helvetica-Bold")
     .text("ISSUING FIRM", ML + 16, boxY + 12);
  doc.fontSize(9).fillColor(NAVY).font("Helvetica-Bold")
     .text(FIRM.name, ML + 16, boxY + 26);
  doc.fontSize(8.5).fillColor(GRAY).font("Helvetica")
     .text(FIRM.address, ML + 16, boxY + 42)
     .text(FIRM.website, ML + 16, boxY + 56)
     .text(FIRM.crd, ML + 16, boxY + 70)
     .text(`Document Date: ${date}`, ML + 16, boxY + 86);

  // Confidentiality footer
  const confY = PAGE_H - 100;
  doc.rect(ML, confY, BODY_W, 60).fill("#f7fafc");
  doc.fontSize(7.5).fillColor(LGRAY).font("Helvetica")
     .text(
       "CONFIDENTIAL: This document and all attachments contain proprietary and confidential information of Aurora Capital Management, LLC. " +
       "Distribution is restricted to the intended recipient only. The information contained herein is accurate as of the date stated and is subject to change. " +
       "This document is intended for institutional investors and accredited investors only, and is not for retail distribution.",
       ML + 10, confY + 10, { width: BODY_W - 20, align: "left", lineGap: 2 }
     );
}

/** Save doc to file */
function save(doc, filename) {
  return new Promise((resolve, reject) => {
    const out = createWriteStream(join(OUT_DIR, filename));
    doc.pipe(out);
    doc.end();
    out.on("finish", () => { console.log(`  ✓ ${filename}`); resolve(); });
    out.on("error", reject);
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// 1. ILPA DDQ 2.0
// ══════════════════════════════════════════════════════════════════════════════
async function genDDQ() {
  const doc = newDoc();
  coverPage(doc, "ILPA Due Diligence Questionnaire 2.0",
    "Aurora Capital Management, LLC — Fund IV (2026)",
    "April 8, 2026",
    [
      "ILPA DDQ Version 2.0  |  Updated November 2021",
      "DDQ Completed by: Aurora Capital Management, LLC",
      "Responding to: [Recipient Institution / Investor Name]",
    ]
  );

  // Page 2 — Fund Identification
  addPage(doc);
  let y = pageHeader(doc, "ILPA DDQ 2.0 — Fund Identification");
  y = sectionHead(doc, "FUND IDENTIFICATION", y);
  const fundId = [
    ["Fund Name",                FIRM.fund],
    ["Investment Manager",       FIRM.name],
    ["General Partner",          FIRM.gp],
    ["Fund Domicile",            "Delaware Limited Partnership (formed August 31, 2025)"],
    ["Regulatory Status",        "Exempt Reporting Adviser (ERA) — Rule 203(l)-1 Venture Capital Exemption"],
    ["CRD / ERA Number",         "CRD 312044  |  ERA Filing since January 14, 2020"],
    ["Primary Office",           "Los Angeles, California (Fully Remote)"],
    ["IR Contact",               "Rebecca Stern, General Partner  |  rsterni@auroracapitalmgmt.com"],
    ["DDQ Completed by",         FIRM.name],
    ["Date of Completion",       "April 2026"],
    ["Responding to",            "[Recipient Institution / Investor Name]"],
  ];
  fundId.forEach(([k, v]) => { y = kvRow(doc, k, v, y + 2); });

  y += 14;
  y = sectionHead(doc, "FUND SUMMARY", y);
  const fundSum = [
    ["Target Fund Size",         FIRM.target],
    ["Hard Cap",                 FIRM.hardcap],
    ["First Close (Expected)",   FIRM.firstClose],
    ["Final Close (Expected)",   FIRM.finalClose],
    ["Investment Period",        FIRM.investPeriod],
    ["Fund Term",                FIRM.fundTerm],
    ["Management Fee",          FIRM.mgmtFee],
    ["Carried Interest",        FIRM.carry],
    ["GP Commitment",           FIRM.gpCommit],
    ["Strategy",                FIRM.strategy],
    ["Reporting Currency",       "U.S. Dollar (USD)"],
  ];
  fundSum.forEach(([k, v]) => { y = kvRow(doc, k, v, y + 2); });
  pageFooter(doc, 2);

  // Page 3 — Investment Strategy
  addPage(doc);
  y = pageHeader(doc, "ILPA DDQ 2.0 — Investment Strategy");
  y = sectionHead(doc, "SECTION 1 — INVESTMENT STRATEGY & PROCESS", y);
  y = para(doc, "1.1  Describe the fund's investment strategy, including target sectors, geographies, and stages.", y);
  y = para(doc, "Aurora Ventures IV, L.P. pursues an early-stage venture capital strategy focused on acquiring minority interests in technology companies across four primary verticals: Enterprise SaaS and Cloud Infrastructure, Artificial Intelligence and Intelligent Compute, Blockchain Infrastructure, and Consumer Mobile. The fund targets Seed through Series B financing rounds in companies headquartered in North America and Israel.", y + 4);
  y += 10;
  y = para(doc, "1.2  What is the fund's target portfolio construction?", y);
  y = para(doc, "Fund IV expects to make 20–25 initial investments across the target verticals, with initial check sizes ranging from $5M to $15M. The fund reserves approximately 50% of committed capital for follow-on investments in top-performing portfolio companies. Reserve ratio and portfolio construction parameters are reviewed at each Investment Committee meeting.", y + 4);
  y += 10;
  y = para(doc, "1.3  Describe the investment process from sourcing to close.", y);
  y = para(doc, "Aurora sources investments primarily through (i) proprietary network referrals from the founders' entertainment and media industry networks, (ii) co-investment referrals from Silverline Media and other strategic relationships, and (iii) accelerator and incubator partnerships. All investment decisions require unanimous approval of the Investment Committee, comprising Marcus Reeves, Daniel Brenner, and Rebecca Stern. Decisions are documented in investment memos reviewed by the full team prior to IC deliberation.", y + 4);
  pageFooter(doc, 3);

  // Page 4 — Team
  addPage(doc);
  y = pageHeader(doc, "ILPA DDQ 2.0 — Team & Organization");
  y = sectionHead(doc, "SECTION 2 — FIRM OVERVIEW & TEAM", y);
  y = para(doc, "2.1  Provide a summary organizational chart and brief biographies of key investment professionals.", y);
  y += 8;
  FIRM.principals.forEach(p => {
    doc.fontSize(9).fillColor(NAVY).font("Helvetica-Bold").text(`${p.name}  (${p.title})`, ML, y, { width: BODY_W });
    y = doc.y + 1;
    if (p.ownership !== "—") {
      doc.fontSize(8.5).fillColor(GRAY).font("Helvetica").text(`Ownership: ${p.ownership}`, ML + 12, y);
      y = doc.y + 2;
    }
    y += 4;
  });

  y += 6;
  y = sectionHead(doc, "SECTION 3 — ASSETS UNDER MANAGEMENT", y);
  const aumRows = [
    ["Aurora Ventures I, II, III",  "Flagship VC strategy; Funds I–II fully invested; Fund III active"],
    ["Aurora Ventures IV (current)","$135M raised; $300M target; final close expected end-2026"],
    ["Aurora AI Fund (2025)",       "$242M raised; AUM $304.66M as of 12/31/2025"],
    ["Aurora Chain Fund (2023)",    "$42M — blockchain infrastructure"],
    ["Silverline/Aurora JV",        "AUM $63.05M as of 12/31/2025"],
    ["Horizon Ventures (legacy)",   "AUM $120.56M as of 12/31/2025 — no new investments since 2016"],
    ["Co-Investment SPVs",          "$11.36M combined (three SPVs)"],
    ["Total Firm AUM",              "$981.54M (excl. $215.59M uncalled capital) as of 12/31/2025"],
  ];
  aumRows.forEach(([k, v]) => { y = kvRow(doc, k, v, y + 2); });
  pageFooter(doc, 4);

  // Page 5 — Compliance & Legal
  addPage(doc);
  y = pageHeader(doc, "ILPA DDQ 2.0 — Compliance, Legal & Operations");
  y = sectionHead(doc, "SECTION 4 — LEGAL, REGULATORY & COMPLIANCE", y);
  const compRows = [
    ["Regulatory Status",          "Exempt Reporting Adviser (ERA); Rule 203(l)-1 VC exemption"],
    ["Compliance Officer",         "Kevin Park (VP, Finance and Operations) — acting compliance officer"],
    ["Compliance Manual",          "Adopted January 2026; reviewed annually"],
    ["Code of Ethics",             "Adopted; all supervised persons certify annually"],
    ["AML / KYC",                  "Managed internally; Brennan Kincaid LLP provides legal support"],
    ["Expert Network Policy",      "InsightSphere Engagement Agreement in place; compliance pre-clearance required for all calls"],
    ["Regulatory Actions",         "None — no material SEC, FINRA, or state regulatory actions"],
    ["Litigation",                 "Daniel Brenner named as defendant in Mythic / LunarPay class action (status: pending; details in DDQ Attachment B)"],
    ["Priya Desai (former)",       "Named co-defendant in same Mythic / LunarPay class action; departed September 2025"],
  ];
  compRows.forEach(([k, v]) => { y = kvRow(doc, k, v, y + 2); });
  y += 14;
  y = sectionHead(doc, "SECTION 5 — OPERATIONS & SERVICE PROVIDERS", y);
  const opsRows = [
    ["Fund Administrator",         `${FIRM.admin} — engaged August 31, 2025`],
    ["Auditor (Fund IV)",          `${FIRM.auditor} — engagement letter being finalized`],
    ["Fund Counsel",               FIRM.counsel],
    ["Tax Advisor",                FIRM.tax],
    ["IT Infrastructure",          `${FIRM.itVendor} — managed IT services; EDR, SIEM, endpoint protection deployed`],
    ["Primary Banking",            "Silicon Valley Bank (SVB) — operating account held by GP"],
    ["Valuation Policy",           "Board-approved; quarterly valuation cycle; external agent planned before final close"],
    ["Business Continuity Plan",   "Adopted November 27, 2025; annual review cycle"],
    ["Cyber Insurance",            "$5M cybersecurity policy through CyberShield Partners"],
  ];
  opsRows.forEach(([k, v]) => { y = kvRow(doc, k, v, y + 2); });
  pageFooter(doc, 5);

  // Page 6 — ESG / Other
  addPage(doc);
  y = pageHeader(doc, "ILPA DDQ 2.0 — ESG & Reporting");
  y = sectionHead(doc, "SECTION 6 — ESG & RESPONSIBLE INVESTMENT", y);
  y = para(doc, "6.1  Does the firm have a formal ESG policy?", y);
  y = para(doc, "Aurora does not maintain a standalone ESG investment policy. Environmental, social, and governance considerations are assessed informally during investment diligence as part of the firm's standard evaluation framework. The Manager acknowledges increasing LP interest in ESG and is evaluating the adoption of a formal ESG policy for Fund IV and subsequent vintages.", y + 4);
  y += 10;
  y = sectionHead(doc, "SECTION 7 — REPORTING & INVESTOR COMMUNICATIONS", y);
  const repRows = [
    ["Quarterly Reports",          "Distributed within 60 days of quarter-end"],
    ["Annual Audited Financials",  "Distributed within 120 days of fiscal year-end"],
    ["Capital Call Notices",       "Minimum 10 business days prior to call date"],
    ["Distribution Notices",       "Distributed concurrently with distributions"],
    ["Investor Portal",            "Available via secure online platform — documents accessible to LPs"],
    ["ILPA Reporting Standards",   "Aurora endeavors to comply with ILPA Reporting Standards 3.0"],
    ["Advisory Committee",         "LPAC formed for Fund IV; quarterly meetings; composed of institutional LP representatives"],
  ];
  repRows.forEach(([k, v]) => { y = kvRow(doc, k, v, y + 2); });
  y += 14;
  y = para(doc, "The information contained in this DDQ has been prepared by Aurora Capital Management, LLC and is accurate as of April 2026. Aurora Capital Management, LLC reserves the right to update this information. Prospective investors are encouraged to contact Aurora directly with any questions or requests for clarification.", y, { color: LGRAY, size: 8 });
  pageFooter(doc, 6);

  return save(doc, "aurora-ilpa-ddq-2026.pdf");
}

// ══════════════════════════════════════════════════════════════════════════════
// 2. Form ADV ERA
// ══════════════════════════════════════════════════════════════════════════════
async function genFormADV() {
  const doc = newDoc();
  coverPage(doc, "Form ADV — Exempt Reporting Adviser",
    "Annual Amendment Filing — Aurora Capital Management, LLC",
    "March 26, 2026",
    [
      "Filed with: U.S. Securities and Exchange Commission (SEC)",
      "ERA Exemption: Rule 203(l)-1 — Venture Capital Fund Adviser",
      "Effective Date of Amendment: March 26, 2026",
    ]
  );

  addPage(doc);
  let y = pageHeader(doc, "Form ADV ERA — Item 1: Cover Page");
  y = sectionHead(doc, "ITEM 1 — IDENTIFYING INFORMATION", y);
  const item1 = [
    ["Legal Name",               FIRM.name],
    ["CRD Number",               "312044"],
    ["SEC File Number",          "801-117820"],
    ["Primary Business Address", "Los Angeles, California (Employees Remote)"],
    ["Phone Number",             "(310) 555-0192"],
    ["Website",                  FIRM.website],
    ["Form of Organization",     "Limited Liability Company"],
    ["State of Organization",    "Delaware"],
    ["Date of Formation",        "August 17, 2017"],
    ["Fiscal Year End",          "December 31"],
    ["Investment Adviser Type",  "Exempt Reporting Adviser (ERA)"],
    ["Regulatory Assets (Form ADV Part 1A)", "$981,540,000 (as of 12/31/2025)"],
  ];
  item1.forEach(([k, v]) => { y = kvRow(doc, k, v, y + 2); });
  pageFooter(doc, 2);

  addPage(doc);
  y = pageHeader(doc, "Form ADV ERA — Item 2: Exemption");
  y = sectionHead(doc, "ITEM 2 — EXEMPTION FROM REGISTRATION", y);
  y = para(doc, "Aurora Capital Management, LLC is relying on the exemption from registration as an investment adviser under Section 203(l) of the Investment Advisers Act of 1940 (the 'Advisers Act'). Under this exemption, Aurora acts solely as an investment adviser to one or more 'venture capital funds' as defined under Rule 203(l)-1 of the Advisers Act.", y + 4);
  y += 10;
  y = para(doc, "2A  — The following funds advised by Aurora Capital Management, LLC qualify as 'venture capital funds' under Rule 203(l)-1:", y);
  const vcFunds = [
    "Aurora Ventures I, LLC",
    "Aurora Ventures II, L.P.",
    "Aurora Ventures III, L.P.",
    "Aurora Ventures IV, L.P.",
    "Aurora Chain Fund, LP",
    "Aurora AI Fund, L.P.",
  ];
  vcFunds.forEach((f, i) => {
    y += 2;
    doc.fontSize(8.5).fillColor("#1a202c").font("Helvetica").text(`  ${i + 1}.  ${f}`, ML, y, { width: BODY_W });
    y = doc.y;
  });
  y += 14;
  y = sectionHead(doc, "ITEM 3 — OWNERSHIP & CONTROL (SCHEDULE A)", y);
  FIRM.principals.filter(p => p.ownership !== "—").forEach(p => {
    y = kvRow(doc, p.name, `${p.title} — ${p.ownership} equity interest`, y + 2);
  });
  pageFooter(doc, 3);

  addPage(doc);
  y = pageHeader(doc, "Form ADV ERA — Item 4: Clients & Business");
  y = sectionHead(doc, "ITEM 4 — CLIENTS & ADVISORY SERVICES", y);
  y = para(doc, "Aurora Capital Management, LLC provides investment advisory services exclusively to private venture capital funds and certain co-investment vehicles managed on behalf of institutional investors and high-net-worth individuals. Aurora does not manage separately managed accounts.", y + 4);
  y += 10;
  y = sectionHead(doc, "ITEM 5 — DISCIPLINARY INFORMATION", y);
  y = para(doc, "5A  — There are no legal or disciplinary events to be disclosed for Aurora Capital Management, LLC or its principal owners and management persons, except as noted below.", y + 4);
  y += 4;
  y = para(doc, "5B  — Daniel Brenner (Co-Founder / General Partner) and former Principal Priya Desai are named defendants in a purported class action lawsuit related to investments in Mythic Technologies, Inc. and LunarPay, Inc. The action is in early stages and Aurora believes the claims are without merit. Aurora is cooperating with its legal counsel to defend against the allegations. There has been no finding of liability.", y + 4);
  y += 10;
  y = sectionHead(doc, "ITEM 6 — OTHER FINANCIAL INDUSTRY ACTIVITIES", y);
  y = para(doc, "6A  — Marcus Reeves (Co-Founder / General Partner) is an actor and film producer. Daniel Brenner (Co-Founder / General Partner) is a talent manager. Both individuals maintain external business activities that have been reviewed by Aurora's compliance function and are deemed consistent with the firm's conflict-of-interest policies.", y + 4);
  y += 4;
  y = para(doc, "6B  — Marcus Reeves and Daniel Brenner are members of Horizon Ventures, LLC, a legacy investment entity that continues to hold portfolio positions but has made no new investments since 2016.", y + 4);
  pageFooter(doc, 4);

  addPage(doc);
  y = pageHeader(doc, "Form ADV ERA — Item 7: Compensation & Conflicts");
  y = sectionHead(doc, "ITEM 7 — COMPENSATION & FINANCIAL PLANNING", y);
  const compItems = [
    ["Management Fee",      FIRM.mgmtFee],
    ["Carried Interest",    FIRM.carry],
    ["Fund Expenses",       "Organizational costs (capped), legal, audit, tax, administration, D&O/E&O insurance, travel, and other fund-related costs charged to fund per LPA terms"],
    ["Management Fee Offset","100% offset of transaction, monitoring, and director fees received by GP or its affiliates"],
  ];
  compItems.forEach(([k, v]) => { y = kvRow(doc, k, v, y + 2); });
  y += 14;
  y = sectionHead(doc, "ITEM 8 — BALANCE SHEET (Not Required for ERA)", y);
  y = para(doc, "As an Exempt Reporting Adviser, Aurora Capital Management, LLC is not required to file a balance sheet with this Form ADV filing. Financial information is available to existing investors upon request.", y + 4);
  y += 10;
  y = para(doc, "I, Rebecca Stern, General Partner of Aurora Capital Management, LLC, certify that the information and statements contained in this Form ADV filing, including exhibits and any other information submitted, are true and correct, and that I am signing this Form ADV, and any amendments thereto, of my own free will.", y, { size: 8, color: LGRAY });
  y += 20;
  doc.fontSize(8.5).fillColor(NAVY).font("Helvetica-Bold").text("Rebecca Stern", ML, y);
  y = doc.y + 2;
  doc.fontSize(8.5).fillColor(GRAY).font("Helvetica").text("General Partner, Aurora Capital Management, LLC", ML, y);
  y = doc.y + 2;
  doc.fontSize(8.5).fillColor(GRAY).font("Helvetica").text("Date: March 26, 2026", ML, y);
  pageFooter(doc, 5);

  return save(doc, "aurora-form-adv-era-2026.pdf");
}

// ══════════════════════════════════════════════════════════════════════════════
// 3. LPA — Fund IV
// ══════════════════════════════════════════════════════════════════════════════
async function genLPA() {
  const doc = newDoc();
  coverPage(doc, "Amended and Restated Limited Partnership Agreement",
    `${FIRM.fund}`,
    "August 31, 2025",
    [
      "Aurora Ventures IV GP, LLC — General Partner",
      "As Amended and Restated: August 31, 2025",
      "Jurisdiction: Delaware",
    ]
  );

  addPage(doc);
  let y = pageHeader(doc, "LPA — Table of Contents");
  y = sectionHead(doc, "TABLE OF CONTENTS", y);
  const toc = [
    ["Article I",  "Definitions"],
    ["Article II", "Organization"],
    ["Article III","Capital Contributions & Commitments"],
    ["Article IV", "Management Fee & Carried Interest"],
    ["Article V",  "Allocations and Distributions"],
    ["Article VI", "Investment Restrictions"],
    ["Article VII","Key Person Provisions"],
    ["Article VIII","Transfer Restrictions"],
    ["Article IX", "Advisory Committee (LPAC)"],
    ["Article X",  "Dissolution and Liquidation"],
    ["Article XI", "Amendments"],
    ["Schedule A", "LP Commitment Schedule"],
    ["Schedule B", "Fee and Expense Schedule"],
    ["Exhibit 1",  "Side Letter Summary"],
  ];
  toc.forEach(([art, title]) => {
    doc.fontSize(9).fillColor(GRAY).font("Helvetica-Bold").text(art, ML, y, { width: 80 });
    doc.fontSize(9).fillColor("#1a202c").font("Helvetica").text(title, ML + 80, y, { width: BODY_W - 80 });
    y = doc.y + 2;
  });
  pageFooter(doc, 2);

  addPage(doc);
  y = pageHeader(doc, "LPA — Key Terms");
  y = sectionHead(doc, "ARTICLE III — CAPITAL CONTRIBUTIONS", y);
  const art3 = [
    ["Target Fund Size",     FIRM.target],
    ["Hard Cap",             FIRM.hardcap],
    ["First Close",          FIRM.firstClose],
    ["Final Close",          FIRM.finalClose],
    ["Minimum LP Commitment","$5,000,000 (subject to GP discretion to accept lesser amounts)"],
    ["Capital Call Notice",  "Minimum 10 Business Days prior notice"],
    ["GP Commitment",        FIRM.gpCommit],
    ["Commitment Period",    "5 years from First Close (subject to Key Person suspension)"],
  ];
  art3.forEach(([k, v]) => { y = kvRow(doc, k, v, y + 2); });
  y += 14;
  y = sectionHead(doc, "ARTICLE IV — FEES & CARRIED INTEREST", y);
  const art4 = [
    ["Management Fee",              FIRM.mgmtFee],
    ["Carried Interest",           FIRM.carry],
    ["Carry Distribution",         "Deal-by-deal (American waterfall); no preferred return or hurdle"],
    ["GP Clawback",                "Yes — subject to a post-dissolution clawback if GP receives excess carry"],
    ["Management Fee Offset",      "100% of transaction, monitoring, and board fees applied as offset"],
    ["Organizational Expenses",    "Capped at $750,000; excess borne by GP"],
    ["Operating Expenses",         "Fund bears customary fund operating and administrative expenses"],
  ];
  art4.forEach(([k, v]) => { y = kvRow(doc, k, v, y + 2); });
  pageFooter(doc, 3);

  addPage(doc);
  y = pageHeader(doc, "LPA — Key Person & LPAC");
  y = sectionHead(doc, "ARTICLE VII — KEY PERSON PROVISIONS", y);
  y = para(doc, "Section 7.1  Key Persons are defined as Marcus Reeves (Co-Founder / General Partner), Daniel Brenner (Co-Founder / General Partner), and Rebecca Stern (General Partner). If any two of the three Key Persons cease to devote substantially all of their business time to the affairs of the Partnership, the Investment Period shall be immediately suspended pending LP notification.", y + 4);
  y += 6;
  y = para(doc, "Section 7.2  Following suspension, Limited Partners holding a majority of Limited Partner Interests may vote to (i) reinstate the Investment Period upon appointment of a replacement satisfactory to a majority of Limited Partners, (ii) continue the suspension, or (iii) dissolve and liquidate the Partnership.", y + 4);
  y += 14;
  y = sectionHead(doc, "ARTICLE IX — LIMITED PARTNER ADVISORY COMMITTEE", y);
  y = para(doc, "Section 9.1  The Partnership shall maintain a Limited Partner Advisory Committee ('LPAC') composed of representatives of Limited Partners selected by the General Partner. The LPAC shall meet not less than once per quarter and shall have the authority to (i) approve conflicts of interest, (ii) review and approve valuation policies and methodologies, and (iii) receive reports on co-investment allocations.", y + 4);
  y += 6;
  y = para(doc, "Section 9.2  LPAC approval shall be required for material amendments to the Limited Partnership Agreement, affiliated transactions, and co-investment terms.", y + 4);
  pageFooter(doc, 4);

  return save(doc, "aurora-lpa-fund-iv.pdf");
}

// ══════════════════════════════════════════════════════════════════════════════
// 4. PPM — Fund IV
// ══════════════════════════════════════════════════════════════════════════════
async function genPPM() {
  const doc = newDoc();
  coverPage(doc, "Private Placement Memorandum",
    `${FIRM.fund} — Confidential Offering Memorandum`,
    "August 2025",
    [
      "This Memorandum is for informational purposes only and does not constitute an offer to sell or a solicitation of an offer to buy.",
      "Interests offered are exempt from registration under the Securities Act of 1933 (Regulation D, Rule 506(c)).",
    ]
  );

  addPage(doc);
  let y = pageHeader(doc, "PPM — Executive Summary");
  y = sectionHead(doc, "EXECUTIVE SUMMARY", y);
  y = para(doc, "Aurora Capital Management, LLC ('Aurora' or the 'Manager') is offering limited partnership interests in Aurora Ventures IV, L.P. ('Fund IV' or the 'Fund'), a Delaware limited partnership formed to invest in early-stage technology companies.", y + 4);
  y += 6;
  const summaryRows = [
    ["Strategy",             FIRM.strategy],
    ["Target Fund Size",     FIRM.target],
    ["Hard Cap",             FIRM.hardcap],
    ["Management Fee",       FIRM.mgmtFee],
    ["Carried Interest",     FIRM.carry],
    ["GP Commitment",        FIRM.gpCommit],
    ["Minimum Investment",   "$5,000,000"],
    ["Target Returns",       "3.0x–5.0x gross MOIC; 25–35% gross IRR (illustrative; not guaranteed)"],
    ["Investment Period",    FIRM.investPeriod],
    ["Fund Term",            FIRM.fundTerm],
    ["Eligible Investors",   "Qualified Purchasers and Accredited Investors"],
  ];
  summaryRows.forEach(([k, v]) => { y = kvRow(doc, k, v, y + 2); });
  pageFooter(doc, 2);

  addPage(doc);
  y = pageHeader(doc, "PPM — Investment Strategy");
  y = sectionHead(doc, "INVESTMENT STRATEGY", y);
  y = para(doc, "Fund IV will employ an early-stage venture capital strategy, targeting Seed through Series B investments in high-growth technology companies. Aurora focuses on four thematic verticals:", y + 4);
  const verticals = [
    "1.  Enterprise SaaS & Cloud Infrastructure — B2B software platforms and cloud-native infrastructure",
    "2.  Artificial Intelligence & Intelligent Compute — AI/ML foundational models, infrastructure, and applications",
    "3.  Blockchain Infrastructure — Decentralized protocols, Layer 2 scaling, and institutional crypto infrastructure",
    "4.  Consumer Mobile — High-retention consumer applications with demonstrable network effects",
  ];
  verticals.forEach(v => { y = para(doc, v, y + 4, { size: 8.5 }); });
  y += 10;
  y = sectionHead(doc, "TRACK RECORD SUMMARY", y);
  const trackRecord = [
    ["Aurora Ventures I (2017)",    "Single LP vehicle; Stockleaf (DPI 30x), SignalOne (DPI 28x)"],
    ["Aurora Ventures II (2019)",   "Fully invested; net MOIC 4.1x; net IRR 38.2% (as of 12/31/2025)"],
    ["Aurora Ventures III (2022)",  "Active; net MOIC 2.3x unrealized; net IRR 41.5% (as of 12/31/2025)"],
    ["Aurora AI Fund (2025)",       "AUM $304.66M; early-stage; performance data limited"],
  ];
  trackRecord.forEach(([k, v]) => { y = kvRow(doc, k, v, y + 2); });
  y += 14;
  y = para(doc, "Past performance is not necessarily indicative of future results. Track record figures are unaudited, as of December 31, 2025, and have not been independently verified. Net figures reflect actual management fees and carried interest charged; gross figures do not. Investors should not rely solely on track record data when making investment decisions.", y, { color: LGRAY, size: 8 });
  pageFooter(doc, 3);

  addPage(doc);
  y = pageHeader(doc, "PPM — Risk Factors");
  y = sectionHead(doc, "RISK FACTORS (SELECTED)", y);
  const risks = [
    ["Early-Stage Investment Risk",  "Investments in early-stage companies are speculative and illiquid. A significant portion of portfolio companies may fail."],
    ["Illiquidity",                  "Interests in the Fund are not transferable without GP consent. No secondary market exists."],
    ["Key Person Risk",              "The Fund is dependent on Marcus Reeves, Daniel Brenner, and Rebecca Stern. The loss of key persons may adversely affect returns."],
    ["Concentration Risk",           "The Fund's portfolio may be concentrated in a limited number of investments or sectors."],
    ["Valuation Risk",               "Portfolio company valuations are based on estimates and may not reflect realizable values."],
    ["Regulatory Risk",              "Aurora operates under an ERA exemption. Changes in applicable law or regulations may affect operations."],
    ["Reputational Risk",            "The founders' public profiles create headline and reputational risk that may adversely affect the firm."],
  ];
  risks.forEach(([k, v]) => { y = kvRow(doc, k, v, y + 3); });
  pageFooter(doc, 4);

  return save(doc, "aurora-ppm-fund-iv.pdf");
}

// ══════════════════════════════════════════════════════════════════════════════
// 5. Compliance Manual + Code of Ethics
// ══════════════════════════════════════════════════════════════════════════════
async function genComplianceManual() {
  const doc = newDoc();
  coverPage(doc, "Compliance Manual & Code of Ethics",
    "Aurora Capital Management, LLC — Effective January 2026",
    "January 1, 2026",
    [
      "Effective Date: January 1, 2026",
      "Annual Review Completed: January 2026",
      "Compliance Officer: Kevin Park, VP Finance and Operations",
    ]
  );

  addPage(doc);
  let y = pageHeader(doc, "Compliance Manual — Overview");
  y = sectionHead(doc, "1. PURPOSE AND SCOPE", y);
  y = para(doc, "This Compliance Manual (the 'Manual') establishes the compliance program and procedures of Aurora Capital Management, LLC ('Aurora'). Aurora operates as an Exempt Reporting Adviser (ERA) relying on the venture capital fund adviser exemption under Section 203(l) of the Investment Advisers Act of 1940 and Rule 203(l)-1 thereunder. The Manual applies to all supervised persons of Aurora, including all officers, directors, partners, employees, and consultants.", y + 4);
  y += 10;
  y = sectionHead(doc, "2. COMPLIANCE OFFICER", y);
  y = para(doc, "Kevin Park (VP, Finance and Operations) serves as Aurora's acting Chief Compliance Officer ('CCO'). The CCO is responsible for administering the compliance program, conducting annual reviews, maintaining records, and reporting compliance matters to the Management Committee. Aurora has acknowledged the need to engage a dedicated CCO as the firm's AUM scales.", y + 4);
  y += 10;
  y = sectionHead(doc, "3. CONFLICTS OF INTEREST", y);
  const conflicts = [
    ["Co-Investment Policy",      "Personal co-investments by principals are permitted with prior CCO approval; disclosed to LPAC on a quarterly basis"],
    ["Outside Business Interests","Marcus Reeves and Daniel Brenner maintain entertainment industry activities; reviewed and approved by Management Committee annually"],
    ["Related Party Transactions","Any transaction with an affiliated party requires LPAC approval prior to execution"],
    ["Gift Policy",               "Gifts exceeding $100 in value must be pre-approved by CCO and logged in the Gifts & Entertainment Register"],
  ];
  conflicts.forEach(([k, v]) => { y = kvRow(doc, k, v, y + 2); });
  pageFooter(doc, 2);

  addPage(doc);
  y = pageHeader(doc, "Compliance Manual — Code of Ethics");
  y = sectionHead(doc, "4. CODE OF ETHICS", y);
  y = para(doc, "All supervised persons of Aurora Capital Management, LLC are required to adhere to the following standards of professional conduct:", y + 4);
  const coeItems = [
    "4.1  Act with integrity, competence, diligence, and respect in all professional dealings.",
    "4.2  Prioritize the interests of fund investors above personal or firm interests in all investment activities.",
    "4.3  Pre-clear all personal securities transactions involving securities of public companies that Aurora has evaluated as potential investments.",
    "4.4  Report promptly any actual or potential conflict of interest to the CCO.",
    "4.5  Maintain the confidentiality of material non-public information ('MNPI') and avoid trading on the basis of MNPI.",
    "4.6  Comply with all applicable laws, rules, and regulations, including those administered by the SEC.",
    "4.7  Certify compliance with this Code of Ethics annually.",
  ];
  coeItems.forEach(item => { y = para(doc, item, y + 4, { size: 8.5 }); });
  y += 10;
  y = sectionHead(doc, "5. ANTI-MONEY LAUNDERING (AML)", y);
  y = para(doc, "Aurora maintains an AML program consistent with applicable requirements. Brennan Kincaid LLP provides AML/KYC support and assists in investor identity verification. Alpine has recommended that Aurora explore engaging Meridian Fund Services to perform AML/KYC verification for Fund IV investors.", y + 4);
  y += 10;
  y = sectionHead(doc, "6. EXPERT NETWORK POLICY", y);
  y = para(doc, "Aurora has engaged InsightSphere Expert Network under a written engagement agreement. All expert network calls must be pre-approved by the CCO. Supervised persons are prohibited from soliciting MNPI and must complete the CCO pre-call approval form. Call notes are maintained in the compliance recordkeeping system.", y + 4);
  pageFooter(doc, 3);

  return save(doc, "aurora-compliance-manual-2026.pdf");
}

// ══════════════════════════════════════════════════════════════════════════════
// 6. Valuation Policy
// ══════════════════════════════════════════════════════════════════════════════
async function genValuationPolicy() {
  const doc = newDoc();
  coverPage(doc, "Valuation Policy",
    "Aurora Capital Management, LLC",
    "January 2026",
    ["Effective Date: January 1, 2026", "Approved by: Investment Committee", "Next Review: January 2027"]
  );

  addPage(doc);
  let y = pageHeader(doc, "Valuation Policy");
  y = sectionHead(doc, "1. PURPOSE", y);
  y = para(doc, "This Valuation Policy establishes the framework and methodologies used by Aurora Capital Management, LLC to value portfolio company investments held across Aurora's fund vehicles. The Policy applies to all venture capital investments, including equity securities, convertible notes, SAFEs, and any other financial instruments held by Aurora's funds.", y + 4);
  y += 10;
  y = sectionHead(doc, "2. VALUATION COMMITTEE", y);
  y = para(doc, "The Valuation Committee is composed of Marcus Reeves, Daniel Brenner, and Rebecca Stern. Valuations are reviewed and approved on a quarterly basis. Alpine has noted that the Valuation Committee is comprised entirely of investment professionals and has recommended that Aurora reconstitute the Committee with at least a majority of non-investment professionals prior to final close.", y + 4);
  y += 10;
  y = sectionHead(doc, "3. VALUATION CYCLE", y);
  const cycle = [
    ["Frequency",            "Quarterly (Q1–Q4); Annual for audit purposes"],
    ["Reporting Date",       "March 31, June 30, September 30, December 31"],
    ["Distribution",         "Included in quarterly LP reports within 60 days of quarter-end"],
    ["External Review",      "External valuation agent engagement planned before Fund IV final close"],
    ["Auditor Involvement",  "Annual audited financial statements prepared by Grant Baker LLP"],
  ];
  cycle.forEach(([k, v]) => { y = kvRow(doc, k, v, y + 2); });
  y += 14;
  y = sectionHead(doc, "4. VALUATION METHODOLOGIES", y);
  const methods = [
    ["Recent Financing Round",   "Price of most recent arm's-length round; applicable for 12–18 months post-financing unless material events indicate otherwise"],
    ["Comparable Company",       "Public market comparables adjusted for illiquidity discount (typically 25–35% for early-stage)"],
    ["Option Pricing Model",     "Applied when capital structure complexity warrants; assumptions documented in quarterly workpapers"],
    ["Income / DCF",             "Used for later-stage or revenue-generating companies; limited application for seed/Series A"],
    ["Cost (NAV) Method",        "Applied when no reliable pricing signal is available; typically for seed investments within 6 months of initial investment"],
    ["Recovery Analysis",        "Applied when impairment indicators are present"],
  ];
  methods.forEach(([k, v]) => { y = kvRow(doc, k, v, y + 3); });
  pageFooter(doc, 2);

  addPage(doc);
  y = pageHeader(doc, "Valuation Policy — Governance");
  y = sectionHead(doc, "5. GOVERNANCE & CONTROLS", y);
  y = para(doc, "Investment professionals responsible for a portfolio company investment present supporting valuation analyses to the Valuation Committee. The Committee may request additional analysis or independent verification. All final valuations are approved by a majority of the Valuation Committee and documented in the quarterly valuation memo.", y + 4);
  y += 10;
  y = sectionHead(doc, "6. ILPA VALUATION PRINCIPLES ALIGNMENT", y);
  y = para(doc, "Aurora endeavors to comply with the ILPA Private Markets Valuation Principles (2022 edition) and the IPEV Valuation Guidelines. Any material deviations from these guidelines are disclosed to the LPAC.", y + 4);
  y += 10;
  y = sectionHead(doc, "7. RECORDKEEPING", y);
  y = para(doc, "Quarterly valuation workpapers, committee approvals, and supporting documentation are retained for a minimum of five years and are available for LPAC and investor review upon reasonable request.", y + 4);
  pageFooter(doc, 3);

  return save(doc, "aurora-valuation-policy.pdf");
}

// ══════════════════════════════════════════════════════════════════════════════
// 7. Audited Financial Statements FY2025
// ══════════════════════════════════════════════════════════════════════════════
async function genFinancials() {
  const doc = newDoc();
  coverPage(doc, "Audited Financial Statements — FY2025",
    "Aurora Ventures III, L.P.",
    "December 31, 2025",
    [
      "Independent Auditor: Grant Baker LLP, Certified Public Accountants",
      "Audit Opinion Date: March 15, 2026",
      "Reporting Period: January 1, 2025 — December 31, 2025",
    ]
  );

  addPage(doc);
  let y = pageHeader(doc, "Audited Financials FY2025 — Auditor's Report");
  y = sectionHead(doc, "INDEPENDENT AUDITOR'S REPORT", y);
  y = para(doc, "To the Partners of Aurora Ventures III, L.P.:", y + 4);
  y += 4;
  y = para(doc, "OPINION\nWe have audited the financial statements of Aurora Ventures III, L.P. (the 'Fund'), which comprise the statement of assets and liabilities as of December 31, 2025, the related statements of operations, changes in partners' capital, and cash flows for the year then ended, and the related notes to the financial statements.", y + 4);
  y += 6;
  y = para(doc, "In our opinion, the accompanying financial statements present fairly, in all material respects, the financial position of Aurora Ventures III, L.P. as of December 31, 2025, and the results of its operations and its cash flows for the year then ended in accordance with accounting principles generally accepted in the United States of America.", y + 4);
  y += 10;
  doc.fontSize(8.5).fillColor(NAVY).font("Helvetica-Bold").text("Grant Baker LLP", ML, y);
  y = doc.y + 2;
  doc.fontSize(8.5).fillColor(GRAY).font("Helvetica").text("Certified Public Accountants", ML, y);
  y = doc.y + 2;
  doc.fontSize(8.5).fillColor(GRAY).font("Helvetica").text("Los Angeles, California  |  March 15, 2026", ML, y);
  pageFooter(doc, 2);

  addPage(doc);
  y = pageHeader(doc, "Audited Financials FY2025 — Statement of Assets");
  y = sectionHead(doc, "STATEMENT OF ASSETS AND LIABILITIES — December 31, 2025", y);
  y = para(doc, "(in thousands, except unit data)  |  Aurora Ventures III, L.P.", y + 2, { size: 8, color: LGRAY });
  y += 4;
  const assets = [
    ["ASSETS", ""],
    ["Investments, at fair value (cost: $98,450)", "$274,312"],
    ["Cash and cash equivalents", "$4,218"],
    ["Receivables and other assets", "$612"],
    ["Total assets", "$279,142"],
    ["", ""],
    ["LIABILITIES", ""],
    ["Management fees payable", "$1,420"],
    ["Accrued expenses", "$384"],
    ["Total liabilities", "$1,804"],
    ["", ""],
    ["NET ASSETS", "$277,338"],
  ];
  assets.forEach(([k, v]) => {
    if (v === "" && k === "") { y += 4; return; }
    const bold = k.startsWith("Total") || k === "NET ASSETS" || k === "ASSETS" || k === "LIABILITIES";
    doc.fontSize(9).fillColor(bold ? NAVY : "#1a202c").font(bold ? "Helvetica-Bold" : "Helvetica")
       .text(k, ML, y, { width: BODY_W - 120 });
    doc.fontSize(9).fillColor(bold ? NAVY : "#1a202c").font(bold ? "Helvetica-Bold" : "Helvetica")
       .text(v, ML, y, { width: BODY_W, align: "right" });
    y = doc.y + 2;
  });
  pageFooter(doc, 3);

  addPage(doc);
  y = pageHeader(doc, "Audited Financials FY2025 — Notes");
  y = sectionHead(doc, "NOTES TO FINANCIAL STATEMENTS (Selected)", y);
  y = para(doc, "NOTE 1 — ORGANIZATION\nAurora Ventures III, L.P. (the 'Fund') is a Delaware limited partnership formed on June 15, 2022 to make venture capital investments in early-stage technology companies. The General Partner is Aurora Ventures III GP, LLC, a wholly owned subsidiary of Aurora Capital Management, LLC.", y + 4);
  y += 8;
  y = para(doc, "NOTE 2 — SIGNIFICANT ACCOUNTING POLICIES\nThe Fund's financial statements are prepared in accordance with U.S. GAAP. Investments are carried at fair value as determined by the Valuation Committee of Aurora Capital Management, LLC in accordance with the Fund's Valuation Policy and ASC 820. The Fund follows the investment company guidance in ASC 946.", y + 4);
  y += 8;
  y = para(doc, "NOTE 3 — FAIR VALUE MEASUREMENTS\nAs of December 31, 2025, investments classified by fair value hierarchy: Level 1 — $0; Level 2 — $14,200 (publicly traded, restricted lock-up); Level 3 — $260,112. Level 3 investments represent 94.8% of total investment fair value and consist of privately-held portfolio companies. Transfers between levels during the year were related to one portfolio company completing a public offering.", y + 4);
  pageFooter(doc, 4);

  return save(doc, "aurora-financials-fy2025.pdf");
}

// ══════════════════════════════════════════════════════════════════════════════
// 8. Firm Overview & Team Biographies
// ══════════════════════════════════════════════════════════════════════════════
async function genFirmOverview() {
  const doc = newDoc();
  coverPage(doc, "Firm Overview & Team Biographies",
    "Aurora Capital Management, LLC",
    "April 2026",
    ["Prepared for Institutional Investor Due Diligence", "April 2026"]
  );

  addPage(doc);
  let y = pageHeader(doc, "Firm Overview");
  y = sectionHead(doc, "FIRM OVERVIEW", y);
  y = para(doc, "Aurora Capital Management, LLC ('Aurora') is a Los Angeles-based venture capital firm founded in 2017 by Marcus Reeves and Daniel Brenner. Aurora manages approximately $981.54 million in assets (excluding $215.59 million in uncalled capital commitments) across multiple fund vehicles as of December 31, 2025.", y + 4);
  y += 6;
  y = para(doc, "Aurora focuses on four primary investment verticals: Enterprise SaaS and Cloud Infrastructure, Artificial Intelligence and Intelligent Compute, Blockchain Infrastructure, and Consumer Mobile. The firm's flagship Aurora Ventures strategy targets Seed-to-Series B investments, while thematic vehicles (the Aurora AI Fund and Aurora Chain Fund) address specific high-growth sub-sectors.", y + 4);
  y += 10;
  y = sectionHead(doc, "INVESTMENT PROFESSIONALS", y);
  FIRM.principals.filter(p => ["Co-Founder / General Partner", "General Partner", "Principal", "Senior Associate", "Analyst"].includes(p.title)).forEach(p => {
    y = kvRow(doc, p.name, p.title + (p.ownership !== "—" ? `  |  ${p.ownership} equity ownership` : ""), y + 4);
  });
  y += 10;
  y = sectionHead(doc, "OPERATIONS & ADMINISTRATION", y);
  FIRM.principals.filter(p => ["VP, Finance and Operations", "Operating Partner"].includes(p.title)).forEach(p => {
    y = kvRow(doc, p.name, p.title, y + 4);
  });
  pageFooter(doc, 2);

  addPage(doc);
  y = pageHeader(doc, "Team Biographies");
  y = sectionHead(doc, "PRINCIPAL BIOGRAPHIES", y);
  const bios = [
    {
      name: "Marcus Reeves — Co-Founder / General Partner",
      bio: "Marcus Reeves is a co-founder and General Partner of Aurora Capital Management. He leads sourcing and investment evaluation across the firm's consumer mobile and entertainment technology verticals. Alongside his investment career, Mr. Reeves is a prominent actor and film producer, maintaining an active presence in the entertainment industry. He holds a B.A. from the University of Southern California."
    },
    {
      name: "Daniel Brenner — Co-Founder / General Partner",
      bio: "Daniel Brenner is a co-founder and General Partner of Aurora Capital Management. He focuses on enterprise SaaS, AI infrastructure, and strategic partnership development. Mr. Brenner is also a talent manager representing internationally recognized entertainers. He holds a B.A. from UCLA."
    },
    {
      name: "Rebecca Stern — General Partner",
      bio: "Rebecca Stern joined Aurora in 2019 as General Partner and leads day-to-day management of the firm. She oversees fund operations, investor relations, and governance. Ms. Stern holds an M.B.A. from Stanford Graduate School of Business and a B.S. in Computer Science from MIT."
    },
    {
      name: "Austin Knight — Principal",
      bio: "Austin Knight joined Aurora in January 2023. He focuses on AI and enterprise software investments. Prior to Aurora, Mr. Knight was an Associate at a mid-market technology-focused buyout firm. He holds a B.S. in Computer Science from Carnegie Mellon University."
    },
    {
      name: "Elena Ruiz — Operating Partner",
      bio: "Elena Ruiz joined Aurora in March 2025 as Operating Partner focused on capital formation and investor relations. She also provides operational coverage for the finance and back-office function. Prior to Aurora, Ms. Ruiz held investor relations roles at a global alternative asset manager."
    },
  ];
  bios.forEach(b => {
    doc.fontSize(9).fillColor(NAVY).font("Helvetica-Bold").text(b.name, ML, y, { width: BODY_W });
    y = doc.y + 2;
    y = para(doc, b.bio, y, { size: 8.5 });
    y += 6;
  });
  pageFooter(doc, 3);

  return save(doc, "aurora-firm-overview.pdf");
}

// ══════════════════════════════════════════════════════════════════════════════
// 9. WISP
// ══════════════════════════════════════════════════════════════════════════════
async function genWISP() {
  const doc = newDoc();
  coverPage(doc, "Written Information Security Policy (WISP)",
    "Aurora Capital Management, LLC",
    "November 28, 2025",
    ["Effective Date: November 28, 2025", "Prepared with: Vantage Tech Partners", "Annual Review: November 2026"]
  );

  addPage(doc);
  let y = pageHeader(doc, "WISP — Overview & Scope");
  y = sectionHead(doc, "1. OVERVIEW AND SCOPE", y);
  y = para(doc, "This Written Information Security Policy ('WISP') establishes the information security program of Aurora Capital Management, LLC ('Aurora'). The WISP applies to all systems, data, and personnel of Aurora and is designed to protect the confidentiality, integrity, and availability of information assets, including non-public personal information ('NPI') and material non-public information ('MNPI').", y + 4);
  y += 10;
  y = sectionHead(doc, "2. INFORMATION SECURITY INFRASTRUCTURE", y);
  const infra = [
    ["Managed IT Provider",      "Vantage Tech Partners — managed detection and response (MDR), SIEM, endpoint security"],
    ["Endpoint Protection",      "EDR deployed on all company-managed devices; automatic threat response enabled"],
    ["SIEM / Log Management",    "Security Information and Event Management platform managed by Vantage Tech Partners; 12-month log retention"],
    ["Email Security",           "Cloud-based email security gateway; anti-phishing, DMARC, SPF/DKIM configured"],
    ["Multi-Factor Authentication","MFA enforced for all cloud applications, email, VPN, and privileged access systems"],
    ["VPN",                      "Corporate VPN required for access to firm systems from non-corporate networks"],
    ["Data Loss Prevention (DLP)","Endpoint DLP implementation planned for 2026"],
    ["Phishing Testing",         "Monthly phishing tests planned; implementation timeline confirmed with Vantage Tech Partners"],
  ];
  infra.forEach(([k, v]) => { y = kvRow(doc, k, v, y + 2); });
  pageFooter(doc, 2);

  addPage(doc);
  y = pageHeader(doc, "WISP — Data Classification & Access Control");
  y = sectionHead(doc, "3. DATA CLASSIFICATION", y);
  const dataClass = [
    ["Confidential",         "Fund financial data, investor NPI, MNPI, legal agreements, personnel records — access restricted to authorized personnel only"],
    ["Internal Use Only",    "Operational reports, meeting notes, internal communications — accessible to all employees; not for external distribution"],
    ["Public",               "Marketing materials, publicly filed documents — no access restrictions"],
  ];
  dataClass.forEach(([k, v]) => { y = kvRow(doc, k, v, y + 3); });
  y += 10;
  y = sectionHead(doc, "4. ACCESS CONTROL", y);
  y = para(doc, "Access to Aurora's systems is granted on a least-privilege basis. Access rights are reviewed semi-annually by the IT Administrator and the CCO. Terminated employees' access is revoked within one business day of departure. Privileged administrator accounts are subject to additional authentication controls.", y + 4);
  y += 10;
  y = sectionHead(doc, "5. INCIDENT RESPONSE", y);
  y = para(doc, "Aurora maintains a separate Incident Response Plan that governs the identification, containment, eradication, recovery, and post-incident review of cybersecurity incidents. The IRP is reviewed and tested annually in coordination with Vantage Tech Partners. Investors and regulators are notified of material incidents in accordance with applicable law and fund documents.", y + 4);
  pageFooter(doc, 3);

  return save(doc, "aurora-wisp-2025.pdf");
}

// ══════════════════════════════════════════════════════════════════════════════
// 10. Incident Response Plan
// ══════════════════════════════════════════════════════════════════════════════
async function genIRP() {
  const doc = newDoc();
  coverPage(doc, "Incident Response Plan (IRP)",
    "Aurora Capital Management, LLC",
    "November 28, 2025",
    ["Effective Date: November 28, 2025", "IT Partner: Vantage Tech Partners", "Annual Review: November 2026"]
  );

  addPage(doc);
  let y = pageHeader(doc, "Incident Response Plan");
  y = sectionHead(doc, "1. PURPOSE AND SCOPE", y);
  y = para(doc, "This Incident Response Plan ('IRP') establishes procedures for detecting, containing, and recovering from cybersecurity incidents affecting Aurora Capital Management, LLC ('Aurora'). The IRP is activated for any event that compromises, or has the potential to compromise, the confidentiality, integrity, or availability of Aurora's information systems or data.", y + 4);
  y += 10;
  y = sectionHead(doc, "2. INCIDENT RESPONSE TEAM", y);
  const irt = [
    ["Incident Response Coordinator", "Kevin Park, VP Finance and Operations"],
    ["Technical Lead",                "Vantage Tech Partners — Managed IT Services"],
    ["Legal Counsel",                 "Kensington Law Group LLP"],
    ["Communications Lead",           "Rebecca Stern, General Partner"],
  ];
  irt.forEach(([k, v]) => { y = kvRow(doc, k, v, y + 2); });
  y += 10;
  y = sectionHead(doc, "3. INCIDENT CLASSIFICATION", y);
  const classes = [
    ["P1 — Critical",    "Active breach; ransomware; unauthorized access to investor or MNPI data; regulatory notification likely required"],
    ["P2 — High",        "Suspected unauthorized access; phishing success; significant data exfiltration risk"],
    ["P3 — Medium",      "Unusual access patterns; policy violation; malware detected and contained"],
    ["P4 — Low",         "Attempted but blocked intrusion; policy near-miss; no data exposure"],
  ];
  classes.forEach(([k, v]) => { y = kvRow(doc, k, v, y + 3); });
  y += 10;
  y = sectionHead(doc, "4. RESPONSE PHASES", y);
  const phases = [
    ["1. Identification",   "Detect and confirm incident; assign severity classification; activate IRT"],
    ["2. Containment",      "Isolate affected systems; prevent spread; preserve evidence"],
    ["3. Eradication",      "Remove threat; patch vulnerabilities; restore clean system state"],
    ["4. Recovery",         "Restore systems; validate integrity; monitor for recurrence"],
    ["5. Post-Incident",    "Root cause analysis; lessons learned documentation; policy updates; LP/regulator notification if required"],
  ];
  phases.forEach(([k, v]) => { y = kvRow(doc, k, v, y + 2); });
  pageFooter(doc, 2);

  return save(doc, "aurora-incident-response-plan.pdf");
}

// ══════════════════════════════════════════════════════════════════════════════
// 11. Business Continuity Plan
// ══════════════════════════════════════════════════════════════════════════════
async function genBCP() {
  const doc = newDoc();
  coverPage(doc, "Business Continuity Plan (BCP)",
    "Aurora Capital Management, LLC",
    "November 27, 2025",
    ["Effective Date: November 27, 2025", "Annual Review: November 2026", "CCO Review: Kevin Park"]
  );

  addPage(doc);
  let y = pageHeader(doc, "Business Continuity Plan");
  y = sectionHead(doc, "1. BUSINESS CONTINUITY OBJECTIVES", y);
  y = para(doc, "This Business Continuity Plan ('BCP') establishes Aurora Capital Management's framework for maintaining critical business operations during and after a disruptive event. Given Aurora's fully remote operating model, the firm is structurally resilient to many physical disruptions; however, this BCP addresses system outages, key person unavailability, and third-party service disruptions.", y + 4);
  y += 10;
  y = sectionHead(doc, "2. CRITICAL BUSINESS FUNCTIONS", y);
  const cbf = [
    ["Investment Management",    "LP capital deployment, portfolio monitoring, IC decision-making — RTO: 4 hours"],
    ["Investor Reporting",       "LP capital account statements, quarterly reports — RTO: 48 hours"],
    ["Fund Administration",      "Delegated to Meridian Fund Services — backup processing per Meridian BCP"],
    ["Finance & Accounting",     "Kevin Park primary; Elena Ruiz backup — RTO: 24 hours"],
    ["IT Systems",               "Cloud-hosted; Vantage Tech Partners SLA — 99.9% uptime"],
    ["Communications",           "Primary: email/Slack; Backup: personal mobile; Tertiary: conference bridge"],
  ];
  cbf.forEach(([k, v]) => { y = kvRow(doc, k, v, y + 2); });
  y += 10;
  y = sectionHead(doc, "3. KEY PERSON CONTINGENCY", y);
  y = para(doc, "In the event that one or more Key Persons (Marcus Reeves, Daniel Brenner, or Rebecca Stern) is unavailable, the remaining General Partners will assume responsibility for critical investment management decisions. If two or more Key Persons are simultaneously unavailable for an extended period (>30 days), the LPA key person provisions will be triggered and LPs will be notified.", y + 4);
  y += 10;
  y = sectionHead(doc, "4. VENDOR DEPENDENCIES", y);
  const vendors = [
    ["Meridian Fund Services",   "Fund administration; maintains own BCP; daily data backup; 24-hour recovery SLA"],
    ["Vantage Tech Partners",    "IT managed services; redundant data centers; 4-hour incident response SLA"],
    ["Silicon Valley Bank",      "Primary banking; FDIC insured up to applicable limits"],
    ["Kensington Law Group",     "Outside counsel; multiple partners available as backup"],
  ];
  vendors.forEach(([k, v]) => { y = kvRow(doc, k, v, y + 2); });
  pageFooter(doc, 2);

  return save(doc, "aurora-bcp-2025.pdf");
}

// ══════════════════════════════════════════════════════════════════════════════
// 12. Administration Agreement — Meridian
// ══════════════════════════════════════════════════════════════════════════════
async function genAdminAgreement() {
  const doc = newDoc();
  coverPage(doc, "Fund Administration Agreement",
    "Aurora Capital Management, LLC & Meridian Fund Services, LLC",
    "August 31, 2025",
    [
      "Between: Aurora Capital Management, LLC (the 'Manager') and",
      "         Meridian Fund Services, LLC (the 'Administrator')",
      "Effective Date: August 31, 2025",
    ]
  );

  addPage(doc);
  let y = pageHeader(doc, "Administration Agreement — Services");
  y = sectionHead(doc, "1. SCOPE OF SERVICES", y);
  y = para(doc, "Meridian Fund Services, LLC ('Administrator') agrees to provide fund administration services to Aurora Ventures IV, L.P. ('Fund') and Aurora Capital Management, LLC ('Manager') including the services listed below. This Agreement is effective as of August 31, 2025.", y + 4);
  y += 8;
  const services = [
    ["NAV Calculation",                "Monthly and quarterly net asset value calculations; GAAP-compliant"],
    ["Capital Account Maintenance",   "LP capital account ledgers; capital call and distribution processing"],
    ["Investor Services",             "LP portal access; K-1 and tax statement preparation; investor inquiries"],
    ["Financial Statements",          "Preparation of quarterly financial reports; audit support for annual audited statements"],
    ["Transfer Agency",               "Maintenance of LP register; subscription and redemption processing"],
    ["Regulatory Reporting",          "Assistance with Form ADV data preparation and Schedule of Investments"],
    ["AML/KYC (Optional Module)",     "LP identity verification and screening against OFAC/PEP databases — subject to separate engagement"],
  ];
  services.forEach(([k, v]) => { y = kvRow(doc, k, v, y + 2); });
  y += 14;
  y = sectionHead(doc, "2. FEES", y);
  const fees = [
    ["Administration Fee",   "Basis points on NAV (tiered), as set forth in Schedule 1"],
    ["Investor Onboarding",  "Per-LP fee for new investor intake and KYC (if elected)"],
    ["Tax Services",         "Per-form fee for K-1 and Schedule K-3 preparation"],
    ["Minimum Annual Fee",   "As set forth in Schedule 1"],
  ];
  fees.forEach(([k, v]) => { y = kvRow(doc, k, v, y + 2); });
  pageFooter(doc, 2);

  addPage(doc);
  y = pageHeader(doc, "Administration Agreement — Terms");
  y = sectionHead(doc, "3. TERM AND TERMINATION", y);
  y = para(doc, "This Agreement shall remain in effect for an initial term of three (3) years commencing on the Effective Date, and shall renew automatically for successive one-year terms unless terminated by either party upon 90 days' written notice. Either party may terminate this Agreement immediately upon a material breach that remains uncured for 30 days after written notice.", y + 4);
  y += 10;
  y = sectionHead(doc, "4. CONFIDENTIALITY", y);
  y = para(doc, "The Administrator agrees to maintain the confidentiality of all non-public information of the Manager and the Fund and to use such information solely for the purposes of providing the services under this Agreement. The Administrator shall implement appropriate technical and organizational measures to protect such information.", y + 4);
  y += 10;
  y = sectionHead(doc, "5. LIMITATION OF LIABILITY", y);
  y = para(doc, "The Administrator's liability under this Agreement shall be limited to direct damages arising from its gross negligence, willful misconduct, or fraud. The Administrator shall not be liable for any indirect, consequential, or punitive damages arising from the provision of services.", y + 4);
  pageFooter(doc, 3);

  return save(doc, "aurora-admin-agreement-meridian.pdf");
}

// ══════════════════════════════════════════════════════════════════════════════
// 13. InsightSphere Expert Network Agreement
// ══════════════════════════════════════════════════════════════════════════════
async function genInsightSphere() {
  const doc = newDoc();
  coverPage(doc, "Expert Network Engagement Agreement",
    "Aurora Capital Management, LLC & InsightSphere Expert Network",
    "2026",
    [
      "Between: Aurora Capital Management, LLC ('Client')",
      "         and InsightSphere Expert Network, Inc. ('InsightSphere')",
      "Effective Date: January 15, 2026",
    ]
  );

  addPage(doc);
  let y = pageHeader(doc, "InsightSphere Agreement — Services & Compliance");
  y = sectionHead(doc, "1. SERVICES", y);
  y = para(doc, "InsightSphere Expert Network, Inc. ('InsightSphere') agrees to provide Aurora Capital Management, LLC ('Aurora') access to its network of industry experts and advisors for the purpose of conducting investment due diligence and sector research. Services include: (i) expert identification and scheduling; (ii) pre-call conflict screening; (iii) call facilitation; and (iv) transcript services.", y + 4);
  y += 10;
  y = sectionHead(doc, "2. COMPLIANCE AND MNPI CONTROLS", y);
  y = para(doc, "InsightSphere maintains a compliance program designed to prevent the disclosure or misuse of material non-public information ('MNPI'). Prior to each engagement, InsightSphere performs a conflict check to identify any expert whose engagement could result in a potential MNPI risk. Experts are required to certify that they will not disclose MNPI during any consultation.", y + 4);
  y += 6;
  const controls = [
    ["Expert Pre-Screening",      "Background check, conflict screening, and MNPI training certification required for all active experts"],
    ["Pre-Call Compliance Review","Aurora's CCO must pre-approve each expert engagement before scheduling"],
    ["Expert Agreements",         "All experts execute a confidentiality and compliance agreement prior to any consultation"],
    ["Call Documentation",        "All calls are recorded; transcripts provided to Aurora and retained for 7 years"],
    ["Prohibited Topics Protocol","InsightSphere interviewers are trained to identify and terminate calls involving potential MNPI"],
  ];
  controls.forEach(([k, v]) => { y = kvRow(doc, k, v, y + 2); });
  y += 10;
  y = sectionHead(doc, "3. FEES AND TERM", y);
  const fees = [
    ["Expert Network Fee",   "Per-hour fee for each expert consultation; billed monthly"],
    ["Annual Access Fee",    "Annual platform access fee for InsightSphere portal"],
    ["Initial Term",         "One (1) year from Effective Date; renewable annually"],
    ["Termination",          "30 days' written notice by either party"],
  ];
  fees.forEach(([k, v]) => { y = kvRow(doc, k, v, y + 2); });
  pageFooter(doc, 2);

  return save(doc, "aurora-insightsphere-agreement.pdf");
}

// ══════════════════════════════════════════════════════════════════════════════
// 14. Vantage Tech Partners IT Engagement Letter
// ══════════════════════════════════════════════════════════════════════════════
async function genVantage() {
  const doc = newDoc();
  coverPage(doc, "IT Services Engagement Letter",
    "Vantage Tech Partners & Aurora Capital Management, LLC",
    "2026",
    [
      "Engagement Between: Vantage Tech Partners ('VTP') and Aurora Capital Management, LLC",
      "Scope: Managed IT Services — Enterprise Security Package",
      "Engagement Date: January 2026",
    ]
  );

  addPage(doc);
  let y = pageHeader(doc, "Vantage Tech Engagement — Scope of Services");
  y = sectionHead(doc, "1. SCOPE OF MANAGED IT SERVICES", y);
  y = para(doc, "Vantage Tech Partners ('VTP') agrees to provide Aurora Capital Management, LLC ('Aurora') with managed IT services under the Enterprise Security Package as described herein. VTP will serve as Aurora's primary IT infrastructure partner, providing the services detailed in Section 2.", y + 4);
  y += 10;
  y = sectionHead(doc, "2. SERVICES INCLUDED", y);
  const services = [
    ["Endpoint Detection & Response (EDR)", "Deployment and management of EDR agents on all company devices; real-time threat detection and automated response"],
    ["Security Information & Event Mgmt (SIEM)", "Centralized log aggregation, correlation, and alerting; 12-month log retention; 24/7 SOC monitoring"],
    ["Email Security Gateway",          "Anti-phishing, anti-spam, DMARC/SPF/DKIM enforcement; inbound and outbound email scanning"],
    ["Vulnerability Management",         "Monthly vulnerability scans; quarterly penetration testing; remediation support"],
    ["Multi-Factor Authentication (MFA)","MFA configuration and management for all cloud applications"],
    ["VPN Infrastructure",              "Corporate VPN deployment and management; secure remote access for all employees"],
    ["Phishing Simulation Program",      "Monthly phishing tests; employee awareness training; reporting dashboard"],
    ["Endpoint DLP (Planned)",          "Data loss prevention implementation planned for H1 2026"],
    ["Incident Response Support",       "24/7 incident response support; 4-hour SLA for P1/P2 incidents"],
    ["Help Desk",                        "Business-hours help desk; next-business-day response for standard issues"],
  ];
  services.forEach(([k, v]) => { y = kvRow(doc, k, v, y + 2); });
  pageFooter(doc, 2);

  addPage(doc);
  y = pageHeader(doc, "Vantage Tech Engagement — Terms");
  y = sectionHead(doc, "3. SERVICE LEVEL AGREEMENTS", y);
  const slas = [
    ["System Uptime",            "99.9% monthly uptime for all managed cloud services"],
    ["P1 Incident Response",     "4-hour maximum response time; 24-hour resolution target"],
    ["P2 Incident Response",     "8-hour maximum response time; 48-hour resolution target"],
    ["Vulnerability Patching",   "Critical patches: 48 hours; High: 7 days; Medium: 30 days"],
    ["Quarterly Reporting",      "Security posture report delivered within 15 days of quarter-end"],
  ];
  slas.forEach(([k, v]) => { y = kvRow(doc, k, v, y + 2); });
  y += 14;
  y = sectionHead(doc, "4. FEES AND TERM", y);
  const fees = [
    ["Monthly Retainer",        "Per-seat monthly fee based on user count (billed monthly in arrears)"],
    ["Initial Term",            "One (1) year; renewable annually with 60-day notice"],
    ["Termination for Cause",   "Immediate upon material breach uncured for 30 days"],
    ["Data Return",             "All Aurora data returned within 30 days of termination; VTP data destruction certification provided"],
  ];
  fees.forEach(([k, v]) => { y = kvRow(doc, k, v, y + 2); });
  y += 14;
  y = para(doc, "This engagement letter, together with the Master Service Agreement and applicable Statements of Work, constitutes the entire agreement between Vantage Tech Partners and Aurora Capital Management, LLC with respect to the managed IT services described herein.", y, { color: LGRAY, size: 8 });
  pageFooter(doc, 3);

  return save(doc, "aurora-vantage-tech-engagement.pdf");
}

// ── Main ──────────────────────────────────────────────────────────────────────
console.log("Generating Aurora Capital Management PDFs...\n");
try {
  await genDDQ();
  await genFormADV();
  await genLPA();
  await genPPM();
  await genComplianceManual();
  await genValuationPolicy();
  await genFinancials();
  await genFirmOverview();
  await genWISP();
  await genIRP();
  await genBCP();
  await genAdminAgreement();
  await genInsightSphere();
  await genVantage();
  console.log("\nAll 14 PDFs generated successfully.");
} catch (e) {
  console.error("Error:", e.message);
  process.exit(1);
}
