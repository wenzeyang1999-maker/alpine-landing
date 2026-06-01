import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getCurrentManager } from "@/lib/manager/access";

function db() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

export async function GET() {
  const user = await getCurrentManager();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!user.firm_id) return NextResponse.json({ responses: {} });

  const { data, error } = await db()
    .from("manager_responses")
    .select("question_id, chapter_num, answer_text, answer_choice, answer_multi, uploaded_filename, review_status, source_document_id, source_quote, updated_at")
    .eq("firm_id", user.firm_id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Fetch document names for any referenced docs
  const docIds = Array.from(new Set((data ?? []).map((r) => r.source_document_id).filter(Boolean)));
  const docMap: Record<string, string> = {};
  if (docIds.length > 0) {
    const { data: docs } = await db()
      .from("manager_uploads")
      .select("id, filename")
      .in("id", docIds);
    for (const d of (docs ?? [])) docMap[d.id] = d.filename;
  }

  const responses: Record<string, unknown> = {};
  for (const row of (data ?? [])) {
    responses[row.question_id] = {
      questionId: row.question_id,
      chapterNum: row.chapter_num,
      answerText: row.answer_text ?? undefined,
      answerChoice: row.answer_choice ?? undefined,
      answerMulti: row.answer_multi ?? undefined,
      uploadedFilename: row.uploaded_filename ?? undefined,
      reviewStatus: row.review_status ?? undefined,
      sourceDocumentId: row.source_document_id ?? undefined,
      sourceDocumentName: row.source_document_id ? (docMap[row.source_document_id] ?? undefined) : undefined,
      sourceQuote: row.source_quote ?? undefined,
      updatedAt: row.updated_at,
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

  const client = db();

  // Fetch current value to detect actual changes
  const { data: current } = await client
    .from("manager_responses")
    .select("answer_text, answer_choice, answer_multi, uploaded_filename")
    .eq("firm_id", user.firm_id)
    .eq("question_id", questionId)
    .maybeSingle() as {
      data: {
        answer_text: string | null;
        answer_choice: string | null;
        answer_multi: string[] | null;
        uploaded_filename: string | null;
      } | null
    };

  const newText = answerText ?? null;
  const newChoice = answerChoice ?? null;
  const newMulti = answerMulti ?? null;
  const newFile = uploadedFilename ?? null;

  const hasChanged = !current ||
    current.answer_text !== newText ||
    current.answer_choice !== newChoice ||
    JSON.stringify(current.answer_multi) !== JSON.stringify(newMulti) ||
    current.uploaded_filename !== newFile;

  const { error } = await client
    .from("manager_responses")
    .upsert(
      {
        firm_id: user.firm_id,
        question_id: questionId,
        chapter_num: chapterNum,
        answer_text: newText,
        answer_choice: newChoice,
        answer_multi: newMulti,
        uploaded_filename: newFile,
        source_document_id: sourceDocumentId ?? null,
        source_quote: sourceQuote ?? null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "firm_id,question_id" }
    );

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Write history only when value actually changed
  if (hasChanged) {
    await client.from("manager_response_history").insert({
      firm_id: user.firm_id,
      question_id: questionId,
      chapter_num: chapterNum,
      answer_text: newText,
      answer_choice: newChoice,
      answer_multi: newMulti,
      uploaded_filename: newFile,
      changed_by_email: user.email,
      changed_by_name: user.full_name ?? null,
    });
  }

  return NextResponse.json({ ok: true });
}
