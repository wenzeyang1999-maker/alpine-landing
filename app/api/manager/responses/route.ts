import { NextResponse } from "next/server";
import { eq, and, inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import { managerResponses, managerUploads, managerResponseHistory } from "@/lib/db/schema";
import { getCurrentManager } from "@/lib/manager/access";

export async function GET() {
  const user = await getCurrentManager();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!user.firm_id) return NextResponse.json({ responses: {} });

  const rows = await db
    .select({
      questionId: managerResponses.questionId,
      chapterNum: managerResponses.chapterNum,
      answerText: managerResponses.answerText,
      answerChoice: managerResponses.answerChoice,
      answerMulti: managerResponses.answerMulti,
      uploadedFilename: managerResponses.uploadedFilename,
      reviewStatus: managerResponses.reviewStatus,
      sourceDocumentId: managerResponses.sourceDocumentId,
      sourceQuote: managerResponses.sourceQuote,
      updatedAt: managerResponses.updatedAt,
    })
    .from(managerResponses)
    .where(eq(managerResponses.firmId, user.firm_id));

  // Fetch document names for any referenced docs
  const docIds = Array.from(
    new Set(rows.map((r) => r.sourceDocumentId).filter((v): v is string => Boolean(v)))
  );
  const docMap: Record<string, string> = {};
  if (docIds.length > 0) {
    const docs = await db
      .select({ id: managerUploads.id, filename: managerUploads.filename })
      .from(managerUploads)
      .where(inArray(managerUploads.id, docIds));
    for (const d of docs) docMap[d.id] = d.filename;
  }

  const responses: Record<string, unknown> = {};
  for (const row of rows) {
    responses[row.questionId] = {
      questionId: row.questionId,
      chapterNum: row.chapterNum,
      answerText: row.answerText ?? undefined,
      answerChoice: row.answerChoice ?? undefined,
      answerMulti: row.answerMulti ?? undefined,
      uploadedFilename: row.uploadedFilename ?? undefined,
      reviewStatus: row.reviewStatus ?? undefined,
      sourceDocumentId: row.sourceDocumentId ?? undefined,
      sourceDocumentName: row.sourceDocumentId ? (docMap[row.sourceDocumentId] ?? undefined) : undefined,
      sourceQuote: row.sourceQuote ?? undefined,
      updatedAt: row.updatedAt,
    };
  }

  return NextResponse.json({ responses });
}

export async function POST(req: Request) {
  const user = await getCurrentManager();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!user.firm_id) return NextResponse.json({ error: "No firm" }, { status: 400 });

  const { questionId, chapterNum, answerText, answerChoice, answerMulti, uploadedFilename, sourceDocumentId, sourceQuote } = await req.json();
  if (!questionId || !chapterNum) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  // Fetch current value to detect actual changes
  const [current] = await db
    .select({
      answerText: managerResponses.answerText,
      answerChoice: managerResponses.answerChoice,
      answerMulti: managerResponses.answerMulti,
      uploadedFilename: managerResponses.uploadedFilename,
    })
    .from(managerResponses)
    .where(and(eq(managerResponses.firmId, user.firm_id), eq(managerResponses.questionId, questionId)))
    .limit(1);

  const newText = answerText ?? null;
  const newChoice = answerChoice ?? null;
  const newMulti = answerMulti ?? null;
  const newFile = uploadedFilename ?? null;

  const hasChanged = !current ||
    current.answerText !== newText ||
    current.answerChoice !== newChoice ||
    JSON.stringify(current.answerMulti) !== JSON.stringify(newMulti) ||
    current.uploadedFilename !== newFile;

  try {
    await db
      .insert(managerResponses)
      .values({
        firmId: user.firm_id,
        questionId,
        chapterNum,
        answerText: newText,
        answerChoice: newChoice,
        answerMulti: newMulti,
        uploadedFilename: newFile,
        sourceDocumentId: sourceDocumentId ?? null,
        sourceQuote: sourceQuote ?? null,
        updatedAt: new Date().toISOString(),
      })
      .onConflictDoUpdate({
        target: [managerResponses.firmId, managerResponses.questionId],
        set: {
          chapterNum,
          answerText: newText,
          answerChoice: newChoice,
          answerMulti: newMulti,
          uploadedFilename: newFile,
          sourceDocumentId: sourceDocumentId ?? null,
          sourceQuote: sourceQuote ?? null,
          updatedAt: new Date().toISOString(),
        },
      });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }

  // Write history only when value actually changed
  if (hasChanged) {
    await db.insert(managerResponseHistory).values({
      firmId: user.firm_id,
      questionId,
      chapterNum,
      answerText: newText,
      answerChoice: newChoice,
      answerMulti: newMulti,
      uploadedFilename: newFile,
      changedByEmail: user.email,
      changedByName: user.full_name ?? null,
    });
  }

  return NextResponse.json({ ok: true });
}
