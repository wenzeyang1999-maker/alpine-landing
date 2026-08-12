import { NextRequest, NextResponse } from "next/server";
import { eq, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { managerUploads, portalDocuments } from "@/lib/db/schema";
import { downloadObject, signedUrl } from "@/lib/storage";
import { getCurrentManager } from "@/lib/manager/access";
import { portalTokenForManager } from "@/lib/manager/portal-link";

const BUCKET = "manager-docs";
const PORTAL_BUCKET = "portal-uploads";
// Portal docs have no text_content cache column (no migration yet), so text is
// extracted on the fly. Bound the work per request and keep a warm-instance
// cache so repeated source-dot clicks don't re-parse the same PDFs.
const MAX_PORTAL_DOCS = 6;
const portalTextCache = new Map<string, string | null>();
const PORTAL_TEXT_CACHE_MAX = 20;
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

async function extractPdfText(bucket: import("@/lib/storage").Container, storagePath: string): Promise<string | null> {
  try {
    const buffer = await downloadObject(bucket, storagePath);

    // Dynamically import pdf-parse (Node runtime only)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mod: any = await import("pdf-parse");
    const pdfParse = mod.default ?? mod;
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
  let docs: { id: string; filename: string; storage_path: string; text_content: string | null }[];
  try {
    docs = await db
      .select({
        id: managerUploads.id,
        filename: managerUploads.filename,
        storage_path: managerUploads.storagePath,
        text_content: managerUploads.textContent,
      })
      .from(managerUploads)
      .where(eq(managerUploads.userEmail, user.email));
  } catch {
    return NextResponse.json({ matches: [] });
  }
  if (!docs.length) return NextResponse.json({ matches: [] });

  const matches: MatchResult[] = [];

  for (const doc of docs) {
    if (!doc.filename.toLowerCase().endsWith(".pdf")) continue;

    let text: string | null = doc.text_content;

    if (!text) {
      text = await extractPdfText(BUCKET, doc.storage_path);
      if (text) {
        await db
          .update(managerUploads)
          .set({ textContent: text, textExtractedAt: new Date().toISOString() })
          .where(eq(managerUploads.id, doc.id));
      }
    }

    if (!text) continue;

    const best = extractBestPassage(text, queryTokens);
    if (!best || best.score < 0.15) continue;

    // Get a signed URL so the user can open the PDF
    let url: string | null = null;
    try {
      url = await signedUrl(BUCKET, doc.storage_path, 3600);
    } catch {
      url = null;
    }

    matches.push({
      documentId: doc.id,
      filename: doc.filename,
      passage: best.passage,
      before: best.before,
      after: best.after,
      score: best.score,
      url,
    });
  }

  // Documents received via the firm's secure upload portal participate in the
  // same passage search, so a PDF a manager dropped at /portal/<token> is
  // immediately citable evidence for any DDQ question.
  try {
    const token = await portalTokenForManager(user.firm_id, user.email);
    if (token) {
      const portalRows = await db
        .select({
          id: portalDocuments.id,
          filename: portalDocuments.filename,
          storagePath: portalDocuments.storagePath,
        })
        .from(portalDocuments)
        .where(eq(portalDocuments.token, token))
        .orderBy(desc(portalDocuments.uploadedAt))
        .limit(MAX_PORTAL_DOCS);

      for (const doc of portalRows) {
        if (!doc.storagePath || !doc.filename.toLowerCase().endsWith(".pdf")) continue;

        let text: string | null | undefined = portalTextCache.get(doc.storagePath);
        if (text === undefined) {
          text = await extractPdfText(PORTAL_BUCKET, doc.storagePath);
          if (portalTextCache.size >= PORTAL_TEXT_CACHE_MAX) {
            const oldest = portalTextCache.keys().next().value;
            if (oldest !== undefined) portalTextCache.delete(oldest);
          }
          portalTextCache.set(doc.storagePath, text);
        }
        if (!text) continue;

        const best = extractBestPassage(text, queryTokens);
        if (!best || best.score < 0.15) continue;

        let url: string | null = null;
        try {
          url = await signedUrl(PORTAL_BUCKET, doc.storagePath, 3600);
        } catch {
          url = null;
        }

        matches.push({
          documentId: doc.id,
          filename: doc.filename,
          passage: best.passage,
          before: best.before,
          after: best.after,
          score: best.score,
          url,
        });
      }
    }
  } catch {
    // Portal matching is additive; never fail the request over it.
  }

  matches.sort((a, b) => b.score - a.score);

  return NextResponse.json({ matches: matches.slice(0, 3) });
}
