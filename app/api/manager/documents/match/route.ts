import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getCurrentManager } from "@/lib/manager/access";

const BUCKET = "manager-docs";
const STOP_WORDS = new Set([
  "a","an","the","and","or","but","in","on","at","to","for","of","with",
  "by","from","is","are","was","were","be","been","being","have","has","had",
  "do","does","did","will","would","shall","should","may","might","can","could",
  "not","no","nor","so","yet","both","either","neither","whether","if","then",
  "that","this","these","those","it","its","we","our","they","their","i","my",
  "you","your","he","his","she","her","as","about","which","who","what","when",
  "where","how","all","any","each","every","other","such","same","than","too",
  "very","just","also","more","most","some","any","into","through","during",
  "before","after","above","below","between","out","off","over","under","again",
]);

function db() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));
}

function scorePassage(passage: string, queryTokens: string[]): number {
  if (queryTokens.length === 0) return 0;
  const passageTokens = new Set(tokenize(passage));
  let hits = 0;
  for (const t of queryTokens) {
    if (passageTokens.has(t)) hits++;
  }
  return hits / queryTokens.length;
}

function extractBestPassage(
  text: string,
  queryTokens: string[],
  windowChars = 500,
): { passage: string; before: string; after: string; score: number } | null {
  if (!text || queryTokens.length === 0) return null;

  const step = Math.floor(windowChars / 2);
  let bestScore = 0;
  let bestStart = 0;

  for (let i = 0; i < text.length; i += step) {
    const slice = text.slice(i, i + windowChars);
    const score = scorePassage(slice, queryTokens);
    if (score > bestScore) {
      bestScore = score;
      bestStart = i;
    }
  }

  if (bestScore === 0) return null;

  const raw = text.slice(bestStart, bestStart + windowChars);
  const passage = trimToSentences(raw);

  // Get surrounding context (~300 chars before and after)
  const ctxStart = Math.max(0, bestStart - 300);
  const ctxEnd = Math.min(text.length, bestStart + windowChars + 300);
  const beforeRaw = text.slice(ctxStart, bestStart);
  const afterRaw = text.slice(bestStart + windowChars, ctxEnd);

  const before = trimContextEnd(beforeRaw);
  const after = trimContextStart(afterRaw);

  return { passage, before, after, score: bestScore };
}

function trimToSentences(text: string): string {
  const start = text.search(/[A-Z]/);
  const end = text.lastIndexOf(".") + 1;
  if (start >= 0 && end > start) return text.slice(start, end).trim();
  return text.trim();
}

function trimContextEnd(text: string): string {
  const i = text.lastIndexOf(". ");
  return i >= 0 ? text.slice(i + 2).trim() : text.trim();
}

function trimContextStart(text: string): string {
  const i = text.indexOf(". ");
  return i >= 0 ? text.slice(i + 2).trim() : text.trim();
}

async function extractPdfText(storagePath: string): Promise<string | null> {
  try {
    const { data, error } = await db().storage.from(BUCKET).download(storagePath);
    if (error || !data) return null;

    const arrayBuffer = await data.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Dynamically import pdf-parse (Node runtime only)
    const pdfParse = (await import("pdf-parse")).default;
    const result = await pdfParse(buffer);
    return result.text ?? null;
  } catch {
    return null;
  }
}

export interface MatchResult {
  documentId: string;
  filename: string;
  passage: string;
  before: string;
  after: string;
  score: number;
  url?: string | null;
}

export async function POST(req: NextRequest) {
  const user = await getCurrentManager();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { questionText, answerText } = await req.json();
  if (!answerText && !questionText) {
    return NextResponse.json({ matches: [] });
  }

  const queryText = `${questionText ?? ""} ${answerText ?? ""}`;
  const queryTokens = tokenize(queryText);
  if (queryTokens.length === 0) return NextResponse.json({ matches: [] });

  // Load all uploaded docs for this user (scoped by email for now)
  const { data: docs, error } = await db()
    .from("manager_uploads")
    .select("id, filename, storage_path, text_content, text_extracted_at")
    .eq("user_email", user.email);

  if (error || !docs?.length) return NextResponse.json({ matches: [] });

  const client = db();
  const matches: MatchResult[] = [];

  for (const doc of docs) {
    if (!doc.filename.toLowerCase().endsWith(".pdf")) continue;

    let text: string | null = doc.text_content;

    if (!text) {
      text = await extractPdfText(doc.storage_path);
      if (text) {
        await client
          .from("manager_uploads")
          .update({ text_content: text, text_extracted_at: new Date().toISOString() })
          .eq("id", doc.id);
      }
    }

    if (!text) continue;

    const best = extractBestPassage(text, queryTokens);
    if (!best || best.score < 0.15) continue;

    // Get a signed URL so the user can open the PDF
    const { data: signed } = await db().storage
      .from(BUCKET)
      .createSignedUrl(doc.storage_path, 3600);

    matches.push({
      documentId: doc.id,
      filename: doc.filename,
      passage: best.passage,
      before: best.before,
      after: best.after,
      score: best.score,
      url: signed?.signedUrl ?? null,
    });
  }

  matches.sort((a, b) => b.score - a.score);

  return NextResponse.json({ matches: matches.slice(0, 3) });
}
