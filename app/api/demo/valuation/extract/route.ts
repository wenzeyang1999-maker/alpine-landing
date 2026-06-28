/**
 * Live Ch4 extraction for a public SEC filing OR an uploaded PDF/HTML filing (T11, D2/D4/D7/D10, DD2).
 *
 * POST as either:
 *   - application/json { url }              → public sec.gov document (ingestFromUrl)
 *   - multipart/form-data { file }          → uploaded PDF/HTML filing (ingestFromUpload)
 *
 * Streams NDJSON so the UI fills the call guide row-by-row:
 *   {type:"init",   profile, sections, notApplicable, counts, sourceKind, sourceUrl?}
 *   {type:"answer", id, answer, context}    ← each grounded/abstained result + its inline context window (D4)
 *   {type:"done",   summary, sections, notApplicable, counts, sourceKind, sourceUrl?}
 *   {type:"error",  message}
 *
 * D4 is stateless: each answer carries its surrounding-sentence context INLINE so BYO citations
 * render the grounded passage + highlight without any server storage (survives restarts/replicas).
 * Extraction is LLM-driven; if ANTHROPIC_API_KEY is absent the stream emits a clean {type:"error"}.
 */
import { isGatedRequestOk } from "@/lib/engine/demo/gate";
import { signAnswer } from "@/lib/engine/demo/answer-sign";
import { ingestFromUrl, ingestFromUpload } from "@/lib/engine/demo/ingest";
import { inferProfile } from "@/lib/engine/demo/profile";
import { extractChapter, ChapterAnswer } from "@/lib/engine/demo/extract-llm";
import { CH4_QUESTIONS } from "@/lib/engine/demo/ch4-questions";
import { assembleCh4 } from "@/lib/engine/demo/callguide";
import { summarizeCh4 } from "@/lib/engine/demo/summary";
import { createAnthropicClient, MODELS } from "@/lib/engine/anthropic";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

const MAX_TEXT = 2_000_000; // cap a filing's normalized text (~2MB) to bound cost/latency
const MAX_UPLOAD = 25 * 1024 * 1024; // 25MB upload ceiling

type SourceKind = "url" | "upload";
type Ingested = { text: string; sourceLabel: string; sourceKind: SourceKind; sourceUrl?: string };

/**
 * The inline context window for an answer (D4): the surrounding sentences around the verbatim
 * quote in the normalized text, so the BYO citation panel can show + highlight the passage with
 * no server storage. Falls back to a character window if sentence boundaries aren't clean.
 */
function contextWindow(text: string, quote: string | null, win = 600): { text: string; quote: string } | null {
  if (!quote) return null;
  const i = text.indexOf(quote);
  if (i < 0) return null;
  let start = Math.max(0, i - Math.floor(win / 2));
  let end = Math.min(text.length, i + quote.length + Math.floor(win / 2));
  // snap to sentence boundaries where possible (don't cut mid-word at the edges)
  const before = text.lastIndexOf(". ", i);
  if (before >= 0 && before > start) start = before + 2;
  const after = text.indexOf(". ", i + quote.length);
  if (after >= 0 && after + 1 < end) end = after + 1;
  return { text: text.slice(start, end).trim(), quote };
}

export async function POST(req: Request) {
  if (!(await isGatedRequestOk(req))) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const contentType = req.headers.get("content-type") ?? "";

  // ── Resolve the source up front so malformed requests fail fast (not inside the stream). ──
  let ingestPlan: { kind: SourceKind; run: () => Promise<{ text: string; sourceLabel: string }>; sourceUrl?: string };

  if (contentType.includes("multipart/form-data")) {
    let form: FormData;
    try {
      form = await req.formData();
    } catch {
      return Response.json({ error: "Bad upload." }, { status: 400 });
    }
    const file = form.get("file");
    if (!(file instanceof File) || file.size === 0) {
      return Response.json({ error: "No file uploaded." }, { status: 400 });
    }
    if (file.size > MAX_UPLOAD) {
      return Response.json({ error: "File too large (25MB max)." }, { status: 400 });
    }
    const filename = file.name || "uploaded-filing";
    ingestPlan = {
      kind: "upload",
      run: async () => {
        const bytes = new Uint8Array(await file.arrayBuffer());
        return ingestFromUpload(bytes, filename);
      },
    };
  } else {
    let url = "";
    try {
      url = String(((await req.json()) as { url?: unknown }).url ?? "").trim();
    } catch {
      return Response.json({ error: "Bad request" }, { status: 400 });
    }
    if (!/^https?:\/\/(www\.|efts\.)?sec\.gov\//i.test(url)) {
      return Response.json({ error: "Public SEC EDGAR (sec.gov) document URLs only." }, { status: 400 });
    }
    ingestPlan = { kind: "url", run: () => ingestFromUrl(url), sourceUrl: url };
  }

  // ── No live extraction without a key (BYO requires it). Clean error, not a 500. ──
  if (!process.env.ANTHROPIC_API_KEY) {
    const enc = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(
          enc.encode(
            JSON.stringify({
              type: "error",
              message: "Live analysis is not configured on this server (no API key). Try the three curated funds for the full offline demo.",
            }) + "\n",
          ),
        );
        controller.close();
      },
    });
    return new Response(stream, {
      headers: { "Content-Type": "application/x-ndjson; charset=utf-8", "Cache-Control": "no-store" },
    });
  }

  const enc = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (obj: unknown) => controller.enqueue(enc.encode(JSON.stringify(obj) + "\n"));
      try {
        const raw = await ingestPlan.run();
        const ingested: Ingested = { ...raw, sourceKind: ingestPlan.kind, sourceUrl: ingestPlan.sourceUrl };
        const text = ingested.text.slice(0, MAX_TEXT);
        if (text.length < 2000) {
          send({ type: "error", message: "That document did not yield enough readable text." });
          controller.close();
          return;
        }

        const client = createAnthropicClient({ defaultModel: MODELS.extraction });

        // 1) detect profile (gated, provisional-aware)
        const inf = await inferProfile(client, text, ingested.sourceLabel, { model: MODELS.extraction });
        const profile = inf.profile;

        // 2) skeleton: applicable guide with nothing answered yet (filing rows start pending)
        const skeleton = assembleCh4({ profile });
        send({
          type: "init",
          sourceLabel: ingested.sourceLabel,
          sourceKind: ingested.sourceKind,
          sourceUrl: ingested.sourceUrl,
          profile: { strategy: profile.strategy, scopes: Array.from(profile.scopes), provisional: inf.provisional, evidence: inf.evidence },
          sections: skeleton.sections,
          notApplicable: skeleton.notApplicable,
          counts: skeleton.counts,
          answerableIds: CH4_QUESTIONS.filter((q) => q.filingAnswerable).map((q) => q.frameworkId),
        });

        // 3) stream each extracted answer (+ inline context window for BYO citations, D4)
        const byId: Record<string, ChapterAnswer> = {};
        await extractChapter(client, CH4_QUESTIONS, text, ingested.sourceLabel, {
          model: MODELS.extraction,
          concurrency: 4,
          onResult: (a) => {
            byId[a.questionId] = a;
            send({ type: "answer", id: a.questionId, answer: a, context: contextWindow(text, a.quote) });
          },
        });

        // 4) D5: sign each grounded answer so /generate can prove it was server-issued
        //    (the quote-gate survives the stateless client round-trip; forged answers fail).
        const sigs: Record<string, string> = {};
        const answeredIds = Object.keys(byId);
        for (let i = 0; i < answeredIds.length; i++) {
          const a = byId[answeredIds[i]];
          if (a && a.status === "answered") sigs[answeredIds[i]] = await signAnswer(a);
        }

        // 5) final assemble + summary (authoritative, reconciled to 164)
        const assembled = assembleCh4({ profile, extraction: byId });
        send({
          type: "done",
          summary: summarizeCh4(assembled, byId),
          sections: assembled.sections,
          notApplicable: assembled.notApplicable,
          counts: assembled.counts,
          sourceKind: ingested.sourceKind,
          sourceUrl: ingested.sourceUrl,
          sigs,
        });
      } catch (e) {
        send({ type: "error", message: e instanceof Error ? e.message : "Extraction failed." });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "application/x-ndjson; charset=utf-8", "Cache-Control": "no-store" },
  });
}
