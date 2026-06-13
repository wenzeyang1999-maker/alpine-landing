import { NextResponse } from "next/server";
import { and, eq, sql } from "drizzle-orm";
import { readFile } from "fs/promises";
import { join } from "path";
import { db } from "@/lib/db";
import { managerUploads, managerResponses } from "@/lib/db/schema";
import { ensureContainer, uploadObject } from "@/lib/storage";
import { getCurrentManager } from "@/lib/manager/access";

const BUCKET = "manager-docs";
const PDF_FILENAME = "Purpose Specialty Lending Trust Offering Memorandum 2021-05-16.pdf";
const PDF_LOCAL_PATH = join(process.cwd(), "docs/purposeinvest", PDF_FILENAME);

// 14 unique answers sourced from the Offering Memorandum (2021-05-16)
const SEED_ANSWERS: Array<{
  question_id: string;
  chapter_num: number;
  answer_text: string;
  source_quote: string;
}> = [
  // ── Chapter 1 — 1.1 Ownership Structure ──────────────────────
  {
    question_id: "01-legal-name",       // Q1
    chapter_num: 1,
    answer_text: "Purpose Investments Inc.",
    source_quote:
      'Purpose Investments Inc. ("Purpose"), a corporation incorporated under the laws of the Province of Ontario on August 28, 2012, is the manager and portfolio manager of the Trust.',
  },
  {
    question_id: "01-affiliates",       // Q2
    chapter_num: 1,
    answer_text:
      "Manager and affiliates not restricted from providing similar services to other funds; will act fairly and equitably in allocating investment opportunities between the Trust and other clients. Related entities include Purpose LP, Purpose GP, Purpose Investments Inc.",
    source_quote:
      "The services of the Manager and its affiliates are not exclusive to the Trust and nothing in the Management Agreement prevents the Manager or any of its affiliates from providing similar services to other investment funds and clients. The Manager therefore will have conflicts of interest in allocating investment opportunities, management time, services and functions among the Trust and such other persons for which it provides services. However, the Manager will undertake to act in a fair and equitable manner as between the Trust and its other clients.",
  },
  {
    question_id: "01-primary-office",   // Q14
    chapter_num: 1,
    answer_text: "130 Adelaide Street West, Suite 1700, Toronto, Ontario, M5H 3P5",
    source_quote:
      "The address, phone number, email address and website of Purpose is 130 Adelaide Street West, Suite 1700, Toronto, Ontario, M5H 3P5, 1-877-789-1517, info@purposeinvest.com and www.purposeinvest.com.",
  },

  {
    question_id: "01-founded",          // Q3
    chapter_num: 1,
    answer_text:
      "Purpose Investments Inc. incorporated under the laws of Province of Ontario on August 28, 2012, formed by Som Seif following sale of Claymore Investments to BlackRock in March 2012. Fund inception date: January 10, 2019.",
    source_quote:
      'Purpose Investments Inc. ("Purpose"), a corporation incorporated under the laws of the Province of Ontario on August 28, 2012, is the manager and portfolio manager of the Trust. Som Seif is the Founder and Chief Executive Officer of Purpose, which he formed following the sale of Claymore Investments, Inc. ("Claymore") to BlackRock, Inc. ("BlackRock") in March 2012.',
  },

  // ── Chapter 1 — 1.3 Governance & Board Oversight ─────────────
  {
    question_id: "01-board-members",    // Q112
    chapter_num: 1,
    answer_text:
      "Som Seif (CEO & Chairman of Board of Directors); Jeff Bouganim (CFO & Director); Jeffrey Mitelman (Director)",
    source_quote:
      "SOM SEIF — Chief Executive Officer, Chairman of the Board of Directors & Director. JEFF BOUGANIM — Chief Financial Officer and Director. JEFFREY MITELMAN — Director; President and Secretary of Thinking Capital Financial Corporation.",
  },

  // ── Chapter 2 — 2.2 Compliance Program ───────────────────────
  {
    question_id: "02-key-personnel",    // Q154
    chapter_num: 2,
    answer_text:
      "Rashay Jethalal: RBC Enterprise Strategy, CIBC World Markets, McKinsey & Company. Jeff Bouganim: CFO at OSFI-regulated MIC, Schedule I Chartered Bank, IIROC dealer. Caitlin Gossage: CCO background disclosed in OM.",
    source_quote:
      "Rashay Jethalal: Managing Director in Royal Bank of Canada's Enterprise Strategy team; Managing Director and Head of Global Banks at CIBC World Markets; management consultant at McKinsey & Company. Jeff Bouganim: Chief Financial Officer at an OSFI regulated deposit taking mortgage investment corporation; CFO of a Schedule I Chartered Bank; CFO of an IIROC Securities Dealer. Caitlin Gossage: Chief Compliance Officer of BMO Global Asset Management (Canada); lawyer and associate at Osler Hoskin & Harcourt.",
  },
  {
    question_id: "02-cco-name",         // Q172
    chapter_num: 2,
    answer_text:
      "Jeffrey Mitelman — Chief Compliance Officer & Senior Legal Counsel, based in Montréal, QC",
    source_quote:
      "JEFFREY MITELMAN, Montréal, Québec — Director; President and Secretary of Thinking Capital Financial Corporation. CAITLIN GOSSAGE, Toronto, Ontario — Chief Compliance Officer and Senior Legal Counsel of Purpose.",
  },

  // ── Chapter 4 — 4.1 Legal Structure & Domicile ───────────────
  {
    question_id: "04-fund-name",        // Q405
    chapter_num: 4,
    answer_text: "Purpose Specialty Lending Trust",
    source_quote:
      "Purpose Specialty Lending Trust (the \"Trust\") is a trust formed and organized under the laws of the Province of Ontario pursuant to a declaration of trust dated July 12, 2018.",
  },

  // ── Chapter 4 — 4.2 Key Economic Terms ───────────────────────
  {
    question_id: "04-cross-class-liabilities", // Q423
    chapter_num: 4,
    answer_text:
      "Yes — \"a creditor of the Trust may seek to satisfy its claims from the assets of the Trust as a whole, even though its claims relate only to a particular Class or Series of Units\"",
    source_quote:
      "Except in respect of Class I Units, the Management Fees determined with respect to a particular Class or Series of Units are charged against the Net Asset Value of that Class or Series. However, all other expenses of the Trust generally are allocated among all Classes or Series of Units, and a creditor of the Trust may seek to satisfy its claims from the assets of the Trust as a whole, even though its claims relate only to a particular Class or Series of Units.",
  },
  {
    question_id: "04-fees",             // Q497
    chapter_num: 4,
    answer_text:
      "Series A-1: ~1.65% p.a.; Series F-1: ~0.65% p.a.; Class I Units: negotiated, up to ~0.65% p.a.",
    source_quote:
      "Management fees payable monthly in arrears in respect of Class 1 Units (Series A-1) at a rate equal to 1/12 of 1.65% (approximately 1.65% per annum) ... in respect of Class 1 Units (Series F-1) at a rate equal to 1/12 of 0.65% (approximately 0.65% per annum). Holders of Class I Units pay a negotiated management fee directly to the Manager ... of up to 1/12 of 0.65% (approximately 0.65% per annum) of the Net Asset Value of the Class I Units.",
  },

  // ── Chapter 5 — 5.3 Auditor ───────────────────────────────────
  {
    question_id: "05-auditor",          // Q563
    chapter_num: 5,
    answer_text: "Ernst & Young LLP, Toronto, Ontario",
    source_quote:
      "The auditors of the Trust are Ernst & Young LLP located in Toronto, Ontario. Ernst & Young LLP is independent of the Trust in accordance with the Rules of Professional Conduct of the Institute of Chartered Accountants of Ontario.",
  },

  // ── Chapter 6 — 6.1 Investment Process & Approval ────────────
  {
    question_id: "06-external-allocation", // Q628
    chapter_num: 6,
    answer_text:
      "Yes — Trust invests in Portfolio Funds managed by Manager and its affiliates; Manager undertakes fair and equitable allocation between the Trust and other clients.",
    source_quote:
      "The Trust seeks to gain exposure to these sectors by allocating the Trust's assets to investment vehicles, including private funds, registered funds or other products (the \"Portfolio Funds\") managed by third party managers or Purpose Investments Inc. The Manager therefore will have conflicts of interest in allocating investment opportunities, management time, services and functions among the Trust and such other persons for which it provides services. However, the Manager will undertake to act in a fair and equitable manner as between the Trust and its other clients.",
  },

  // ── Chapter 7 — 7.1 NAV Calculation Process ──────────────────
  {
    question_id: "07-financial-distribution", // Q930
    chapter_num: 7,
    answer_text:
      "Manager — delivered to Unitholders within 90 days of Trust's year-end",
    source_quote:
      "The Trust will prepare annual audited financial statements and interim financial reports for the Trust. The Trust will deliver to Unitholders audited annual financial statements within 90 days of the Trust's year-end and unaudited semi-annual financial statements within 60 days of the end of each period.",
  },

  // ── Chapter 7 — 7.2 Valuation Policy ─────────────────────────
  {
    question_id: "07-valuation-providers",    // Q581
    chapter_num: 7,
    answer_text:
      "Yes — CIBC Mellon Global Securities Services Company retained by Manager for valuation services; also engages accounting, legal, tax, and auditing providers.",
    source_quote:
      "The Manager has retained CIBC Mellon Global Securities Services Company, from its principal offices in Toronto, Ontario, to carry out the valuation services for the Trust.",
  },
  {
    question_id: "07-valuation-members",      // Q844
    chapter_num: 7,
    answer_text:
      "Som Seif (CEO & Chairman); Rashay Jethalal (CEO); Jeff Bouganim (President); Caitlin Gossage (CFO & Director); Jeffrey Mitelman (CCO & Senior Legal Counsel)",
    source_quote:
      "SOM SEIF — Chief Executive Officer, Chairman of the Board of Directors & Director. RASHAY JETHALAL — President. JEFF BOUGANIM — Chief Financial Officer and Director. CAITLIN GOSSAGE — Chief Compliance Officer and Senior Legal Counsel. JEFFREY MITELMAN — Director.",
  },
];

async function seedDocument(userEmail: string): Promise<string | null> {
  // Return existing doc id if already uploaded for this user
  const [existing] = await db
    .select({ id: managerUploads.id })
    .from(managerUploads)
    .where(and(eq(managerUploads.userEmail, userEmail), eq(managerUploads.filename, PDF_FILENAME)))
    .limit(1);

  if (existing) return existing.id;

  const pdfBuffer = await readFile(PDF_LOCAL_PATH);
  const safeName = PDF_FILENAME.replace(/[^a-zA-Z0-9._-]/g, "_");
  const storagePath = `${userEmail}/${Date.now()}-${safeName}`;

  await ensureContainer(BUCKET);

  try {
    await uploadObject(BUCKET, storagePath, pdfBuffer, "application/pdf", { upsert: false });
  } catch {
    return null;
  }

  const [doc] = await db
    .insert(managerUploads)
    .values({
      userEmail,
      filename: PDF_FILENAME,
      storagePath,
      fileSize: pdfBuffer.byteLength,
    })
    .returning({ id: managerUploads.id });

  return doc?.id ?? null;
}

export async function POST() {
  const user = await getCurrentManager();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!user.firm_id) return NextResponse.json({ error: "No firm_id" }, { status: 400 });

  // Clear all existing responses for this firm
  try {
    await db.delete(managerResponses).where(eq(managerResponses.firmId, user.firm_id));
  } catch (deleteErr) {
    return NextResponse.json({ error: (deleteErr as Error).message }, { status: 500 });
  }

  // Upload the source document (best-effort)
  let docId: string | null = null;
  try {
    docId = await seedDocument(user.email);
  } catch {
    // PDF may not be present in production deployment; continue without source link
  }

  // Seed all answers with source references
  const rows = SEED_ANSWERS.map((a) => ({
    firmId: user.firm_id,
    questionId: a.question_id,
    chapterNum: a.chapter_num,
    answerText: a.answer_text,
    answerChoice: null,
    answerMulti: null,
    uploadedFilename: null,
    sourceDocumentId: docId,
    sourceQuote: a.source_quote,
    updatedAt: new Date().toISOString(),
  }));

  try {
    await db
      .insert(managerResponses)
      .values(rows)
      .onConflictDoUpdate({
        target: [managerResponses.firmId, managerResponses.questionId],
        set: {
          chapterNum: sql`excluded.chapter_num`,
          answerText: sql`excluded.answer_text`,
          answerChoice: sql`excluded.answer_choice`,
          answerMulti: sql`excluded.answer_multi`,
          uploadedFilename: sql`excluded.uploaded_filename`,
          sourceDocumentId: sql`excluded.source_document_id`,
          sourceQuote: sql`excluded.source_quote`,
          updatedAt: sql`excluded.updated_at`,
        },
      });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, seeded: rows.length, docId });
}
