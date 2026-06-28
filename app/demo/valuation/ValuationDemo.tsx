"use client";
/**
 * The Chapter-4 demo workspace, in three sections (DD1 + the 3-section ask):
 *   1) Source documents  — the SEC filings the engine ingested
 *   2) Prefilled call guide — every answer tagged filing (grounded, cited) or manager-call
 *      (a reasonable analyst fill, editable in place)
 *   3) AI-drafted Chapter 4 — the house-style narrative + rating + fired flags
 *
 * Curated funds load instantly from the committed fixtures (offline-proof). Editing a
 * manager-call answer updates it in place; with the live engine that edit re-drafts §3.
 *
 * Bring-your-own (BYO) runs the live engine in parallel: resolve a ticker / paste a sec.gov
 * URL / upload a filing, stream the extraction row-by-row into the call guide, optionally
 * ask the model to suggest fills, then draft Chapter 4 from the grounded answers + sign-offs.
 * The curated path is untouched by BYO.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CH4_FLAGS } from "@/lib/engine/ch4-flag-library";
import { scrubDashes } from "@/lib/engine/house-style";
import type { ChapterAnswer } from "@/lib/engine/demo/extract-llm";
import CitationPanel, { CitationCtx } from "./CitationPanel";
import { BG, BG_CARD, INK, SECONDARY, MUTED, VIOLET, BORDER } from "@/lib/constants";

const GREEN_T = "#047857", GREEN_BG = "#F0FAF6";
const AMBER_T = "#B45309", AMBER_BG = "#FEF8E7";
const SLATE_T = "#475569", SLATE_BG = "#F1F5F9";
const VIOLET_BG = "#F5F1FC";
const FLAG_TITLE = new Map(CH4_FLAGS.map((f) => [f.id, { title: f.title, severity: f.severity }]));
const CURATED = [
  { ticker: "ARCC", short: "Ares Capital (ARCC)" },
  { ticker: "BXSL", short: "Blackstone (BXSL)" },
  { ticker: "OBDC", short: "Blue Owl (OBDC)" },
];
const SUGGESTED_TICKERS = ["ARCC", "BXSL", "OBDC", "FSK", "GBDC", "HTGC"];

type Field = { id: string; subsection: string; question: string; answer: string; source: "filing" | "manager_call"; quote?: string };
type Report = { rating: "GREEN" | "YELLOW" | "RED"; ratingLabel: string; flagsFired: string[]; fields: Field[]; narrative: string };
type Data = { fund: { ticker: string; name: string }; sourceLabel: string; sourceUrl: string; profile: { strategy: string; scopes: string[] }; extraction: Record<string, { status: string }>; report: Report | null; curated: boolean; liveEnabled: boolean };

type InputMode = "ticker" | "url" | "upload";
type SourceKind = "url" | "upload";
type AnswerCtx = { text: string; quote: string };
type ByoProfile = { strategy: string; scopes: string[] };
type ResolveResult = { url: string; name: string; cik: string; form: string; filingDate: string };

// Run-state of the BYO live pipeline.
type ByoPhase = "idle" | "resolving" | "streaming" | "ready" | "drafting" | "error";

export default function ValuationDemo() {
  const [data, setData] = useState<Data | null>(null);
  const [tab, setTab] = useState(1);
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [openCite, setOpenCite] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [contexts, setContexts] = useState<Record<string, CitationCtx>>({});

  // ── BYO state (parallel to curated; never mutates `data`) ──
  const [mode, setMode] = useState<"curated" | "byo">("curated");
  const [inputMode, setInputMode] = useState<InputMode>("ticker");
  const [tickerInput, setTickerInput] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [byoPhase, setByoPhase] = useState<ByoPhase>("idle");
  const [byoError, setByoError] = useState("");
  const [resolveNote, setResolveNote] = useState("");
  const [byoProfile, setByoProfile] = useState<ByoProfile | null>(null);
  const [byoSourceLabel, setByoSourceLabel] = useState("");
  const [byoSourceUrl, setByoSourceUrl] = useState("");
  const [byoSourceKind, setByoSourceKind] = useState<SourceKind>("url");
  const [byoName, setByoName] = useState("");
  const [answerableIds, setAnswerableIds] = useState<string[]>([]);
  const [byoAnswers, setByoAnswers] = useState<Record<string, ChapterAnswer>>({});
  const [byoContexts, setByoContexts] = useState<Record<string, AnswerCtx>>({});
  const [byoSigs, setByoSigs] = useState<Record<string, string>>({});
  const [suggestById, setSuggestById] = useState<Record<string, string>>({});
  const [suggesting, setSuggesting] = useState(false);
  const [byoReport, setByoReport] = useState<Report | null>(null);
  const uploadObjUrl = useRef<string | null>(null);

  const fund = data?.fund;
  const liveEnabled = !!data?.liveEnabled;

  // id → question label map, seeded from the curated fields (covers the answerable Ch4 ids).
  const labelById = useMemo(() => {
    const m: Record<string, string> = {};
    for (const f of data?.report?.fields ?? []) m[f.id] = f.question;
    return m;
  }, [data]);

  const openCitation = useCallback(async (f: Field) => {
    if (openCite === f.id) { setOpenCite(null); return; }
    setOpenCite(f.id);
    if (!contexts[f.id] && fund && f.quote) {
      try {
        const res = await fetch(`/api/demo/valuation/context?ticker=${encodeURIComponent(fund.ticker)}&q=${encodeURIComponent(f.quote)}`);
        if (res.ok) { const j = await res.json(); setContexts((p) => ({ ...p, [f.id]: j })); }
      } catch { /* fall back to the quote alone */ }
    }
  }, [openCite, contexts, fund]);

  const load = useCallback(async (ticker: string) => {
    setLoading(true); setError(""); setEdits({}); setOpenCite(null); setContexts({});
    setMode("curated"); resetByo();
    try {
      const res = await fetch(`/api/demo/valuation/curated?ticker=${encodeURIComponent(ticker)}`);
      if (!res.ok) throw new Error("Could not load fund.");
      setData(await res.json());
    } catch (e) { setError(e instanceof Error ? e.message : "Load failed."); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { load("ARCC"); }, [load]);

  function resetByo() {
    setByoPhase("idle"); setByoError(""); setResolveNote("");
    setByoProfile(null); setByoSourceLabel(""); setByoSourceUrl(""); setByoName("");
    setAnswerableIds([]); setByoAnswers({}); setByoContexts({}); setByoSigs({});
    setSuggestById({}); setSuggesting(false); setByoReport(null);
    if (uploadObjUrl.current) { URL.revokeObjectURL(uploadObjUrl.current); uploadObjUrl.current = null; }
  }

  // ── Stream the NDJSON extract response, filling rows in place. ──
  const runExtract = useCallback(async (init: { url?: string; file?: File }) => {
    setMode("byo"); setTab(2);
    setByoPhase("streaming"); setByoError("");
    setByoAnswers({}); setByoContexts({}); setByoSigs({}); setSuggestById({});
    setByoReport(null); setAnswerableIds([]); setEdits({});
    try {
      let res: Response;
      if (init.file) {
        const form = new FormData();
        form.append("file", init.file);
        res = await fetch("/api/demo/valuation/extract", { method: "POST", body: form });
      } else {
        res = await fetch("/api/demo/valuation/extract", {
          method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url: init.url }),
        });
      }
      if (!res.body) throw new Error("No response stream.");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        let nl = buf.indexOf("\n");
        while (nl >= 0) {
          const line = buf.slice(0, nl).trim();
          buf = buf.slice(nl + 1);
          if (line) handleEvent(JSON.parse(line));
          nl = buf.indexOf("\n");
        }
      }
      const tail = buf.trim();
      if (tail) handleEvent(JSON.parse(tail));
    } catch (e) {
      setByoError(e instanceof Error ? e.message : "Live analysis failed.");
      setByoPhase("error");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleEvent(ev: Record<string, unknown>) {
    const type = ev.type;
    if (type === "init") {
      const prof = ev.profile as { strategy: string; scopes: string[] } | undefined;
      if (prof) setByoProfile({ strategy: prof.strategy, scopes: Array.isArray(prof.scopes) ? prof.scopes : [] });
      setByoSourceLabel(String(ev.sourceLabel ?? ""));
      setByoSourceKind((ev.sourceKind as SourceKind) ?? "url");
      setByoSourceUrl(typeof ev.sourceUrl === "string" ? ev.sourceUrl : "");
      setAnswerableIds(Array.isArray(ev.answerableIds) ? (ev.answerableIds as string[]) : []);
    } else if (type === "answer") {
      const id = String(ev.id);
      const answer = ev.answer as ChapterAnswer;
      const ctx = ev.context as AnswerCtx | null;
      setByoAnswers((p) => ({ ...p, [id]: answer }));
      if (ctx) setByoContexts((p) => ({ ...p, [id]: ctx }));
    } else if (type === "done") {
      const sigs = (ev.sigs && typeof ev.sigs === "object" ? ev.sigs : {}) as Record<string, string>;
      setByoSigs(sigs);
      setByoPhase("ready");
    } else if (type === "error") {
      setByoError(String(ev.message ?? "Live analysis failed."));
      setByoPhase("error");
    }
  }

  // ── Input submit handlers ──
  const submitTicker = useCallback(async () => {
    const t = tickerInput.trim();
    if (!t || byoPhase === "resolving" || byoPhase === "streaming") return;
    resetByo();
    setMode("byo"); setByoPhase("resolving"); setByoError(""); setResolveNote("");
    try {
      const res = await fetch("/api/demo/valuation/resolve", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ticker: t }),
      });
      const j = await res.json();
      if (!res.ok) { setByoError(String(j.error ?? "Could not resolve that ticker.")); setByoPhase("error"); return; }
      const r = j as ResolveResult;
      setByoName(r.name || t.toUpperCase());
      setResolveNote(`Found: ${r.name} · ${r.form} · filed ${r.filingDate}`);
      await runExtract({ url: r.url });
    } catch (e) {
      setByoError(e instanceof Error ? e.message : "Could not resolve that ticker."); setByoPhase("error");
    }
  }, [tickerInput, byoPhase, runExtract]);

  const submitUrl = useCallback(async () => {
    const u = urlInput.trim();
    if (!u || byoPhase === "streaming") return;
    resetByo();
    setByoName(u);
    await runExtract({ url: u });
  }, [urlInput, byoPhase, runExtract]);

  const submitUpload = useCallback(async () => {
    if (!uploadFile || byoPhase === "streaming") return;
    resetByo();
    // keep the File for client-side re-download (contract #6)
    if (uploadObjUrl.current) URL.revokeObjectURL(uploadObjUrl.current);
    uploadObjUrl.current = URL.createObjectURL(uploadFile);
    setByoName(uploadFile.name);
    await runExtract({ file: uploadFile });
  }, [uploadFile, byoPhase, runExtract]);

  // ── Suggest fills for the ungrounded answerable + routed questions. ──
  const runSuggest = useCallback(async () => {
    if (!byoProfile || suggesting) return;
    setSuggesting(true);
    try {
      const ids = Object.keys(byoAnswers);
      const questions: { id: string; prompt: string }[] = [];
      for (let i = 0; i < ids.length; i++) {
        const id = ids[i];
        const a = byoAnswers[id];
        if (a && a.status !== "answered") questions.push({ id, prompt: a.label || labelById[id] || id });
      }
      if (questions.length === 0) { setSuggesting(false); return; }
      const res = await fetch("/api/demo/valuation/suggest", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile: byoProfile, questions }),
      });
      const j = await res.json();
      const sugg = (j && typeof j.suggestions === "object" ? j.suggestions : {}) as Record<string, string>;
      setSuggestById((p) => ({ ...p, ...sugg }));
    } catch { /* no suggestions on failure */ }
    finally { setSuggesting(false); }
  }, [byoProfile, byoAnswers, suggesting, labelById]);

  // ── Draft Chapter 4 from grounded answers + sign-offs. ──
  const runGenerate = useCallback(async () => {
    if (!byoProfile || byoPhase === "drafting") return;
    setByoPhase("drafting"); setByoError("");
    try {
      const answers: Record<string, ChapterAnswer> = {};
      const ids = Object.keys(byoAnswers);
      for (let i = 0; i < ids.length; i++) {
        const a = byoAnswers[ids[i]];
        if (a && a.status === "answered") answers[ids[i]] = a;
      }
      // edits = every accepted suggestion + human-typed answer (slate-confirmed-or-typed).
      const editsOut: Record<string, string> = { ...suggestById, ...edits };
      const res = await fetch("/api/demo/valuation/generate", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile: byoProfile, answers, sigs: byoSigs, edits: editsOut, name: byoName }),
      });
      if (!res.ok) { const j = await res.json().catch(() => ({})); throw new Error(j.error || "Draft failed."); }
      const report = (await res.json()) as Report;
      setByoReport(report);
      setByoPhase("ready");
      setTab(3);
    } catch (e) {
      setByoError(e instanceof Error ? e.message : "Draft failed."); setByoPhase("error");
    }
  }, [byoProfile, byoPhase, byoAnswers, byoSigs, suggestById, edits, byoName]);

  // ── Download source (contract #6) ──
  const downloadSource = useCallback(() => {
    if (mode === "curated" && fund) {
      window.open(`/api/demo/valuation/filing?ticker=${encodeURIComponent(fund.ticker)}&download=1`, "_blank");
    } else if (byoSourceKind === "upload" && uploadObjUrl.current) {
      const a = document.createElement("a");
      a.href = uploadObjUrl.current; a.download = byoName || "uploaded-filing"; a.click();
    } else if (byoSourceUrl) {
      window.open(byoSourceUrl, "_blank");
    }
  }, [mode, fund, byoSourceKind, byoSourceUrl, byoName]);

  // Open a BYO grounded citation (passage mode — built from the streamed inline context).
  const openByoCitation = useCallback((id: string) => {
    setOpenCite(openCite === id ? null : id);
  }, [openCite]);

  const report = data?.report ?? null;
  const groundedCount = data ? Object.values(data.extraction).filter((a) => a.status === "answered").length : 0;

  const fieldsBySub = useMemo(() => {
    const m = new Map<string, Field[]>();
    for (const f of report?.fields ?? []) { (m.get(f.subsection) ?? m.set(f.subsection, []).get(f.subsection)!).push(f); }
    return Array.from(m.entries());
  }, [report]);

  // BYO live progress (n of m answerable answered).
  const byoAnsweredCount = useMemo(() => {
    let n = 0;
    for (let i = 0; i < answerableIds.length; i++) {
      const a = byoAnswers[answerableIds[i]];
      if (a && a.status === "answered") n++;
    }
    return n;
  }, [answerableIds, byoAnswers]);
  const byoResolvedCount = useMemo(() => {
    let n = 0;
    for (let i = 0; i < answerableIds.length; i++) if (byoAnswers[answerableIds[i]]) n++;
    return n;
  }, [answerableIds, byoAnswers]);

  // Build the active citation context (curated full-doc OR BYO passage).
  const activeCitation: CitationCtx | null = useMemo(() => {
    if (!openCite) return null;
    if (mode === "curated") {
      const c = contexts[openCite];
      if (!c) return null;
      return { ...c, section: report?.fields.find((x) => x.id === openCite)?.subsection ?? "" };
    }
    const a = byoAnswers[openCite];
    const ctx = byoContexts[openCite];
    if (!a || !ctx) return null;
    return {
      context: ctx.text,
      quote: ctx.quote,
      section: a.subsection,
      ticker: "", // empty => CitationPanel renders the inline passage, not the iframe
      sourceLabel: byoSourceLabel,
      sourceUrl: byoSourceUrl || "",
      filingDate: "",
      docType: byoSourceKind === "upload" ? "Uploaded filing" : "Form 10-K",
      name: byoName,
    };
  }, [openCite, mode, contexts, report, byoAnswers, byoContexts, byoSourceLabel, byoSourceUrl, byoSourceKind, byoName]);

  const inputBusy = byoPhase === "resolving" || byoPhase === "streaming";

  return (
    <main style={{ minHeight: "100vh", background: BG, color: INK }}>
      <style>{`.tab{cursor:pointer;padding:8px 14px;font-size:13px;border-bottom:2px solid transparent;color:${MUTED}}
        .tab.active{color:${INK};border-bottom-color:${VIOLET};font-weight:500}
        .nar h4{font-size:13px;font-weight:500;color:${VIOLET};text-transform:uppercase;letter-spacing:.4px;margin:18px 0 6px}
        .nar p{font-size:13.5px;line-height:1.62;color:${SECONDARY};margin:0 0 10px}
        @keyframes shimmer{0%{background-position:-200px 0}100%{background-position:calc(200px + 100%) 0}}
        .skel{height:14px;border-radius:5px;background:#EEF0F3;background-image:linear-gradient(90deg,#EEF0F3 0px,#F7F8F9 80px,#EEF0F3 160px);background-size:200px 100%;animation:shimmer 1.2s linear infinite}`}</style>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: BG_CARD, borderBottom: `1px solid ${BORDER}`, padding: "10px 16px" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: VIOLET }} />
          <span style={{ fontWeight: 500, fontSize: 13 }}>Alpine ODD</span>
          <span style={{ fontSize: 12, color: MUTED }}>· Chapter 4 demo</span>
        </span>
        <span style={{ fontSize: 12, color: SECONDARY }}>{mode === "byo" ? byoName : fund?.name}</span>
        <span style={{ fontSize: 11, color: MUTED }}>Public SEC filings only</span>
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "14px 16px 48px" }}>

        {/* ── BYO input: segmented control + curated examples ── */}
        <div style={{ background: BG_CARD, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "12px 14px", marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
            <span style={{ fontSize: 12.5, fontWeight: 500, color: INK }}>Analyze a fund</span>
            {/* segmented control */}
            <div role="tablist" aria-label="Input source" style={{ display: "inline-flex", border: `1px solid ${BORDER}`, borderRadius: 7, overflow: "hidden", opacity: liveEnabled ? 1 : 0.5 }}>
              {(["ticker", "url", "upload"] as InputMode[]).map((m, i) => (
                <button key={m} role="tab" aria-selected={inputMode === m} disabled={!liveEnabled}
                  onClick={() => liveEnabled && setInputMode(m)}
                  style={{ fontSize: 12, padding: "5px 12px", border: "none", borderLeft: i === 0 ? "none" : `1px solid ${BORDER}`, cursor: liveEnabled ? "pointer" : "not-allowed", background: inputMode === m ? VIOLET_BG : "#fff", color: inputMode === m ? VIOLET : SECONDARY, textTransform: "capitalize", fontWeight: inputMode === m ? 500 : 400 }}>
                  {m}
                </button>
              ))}
            </div>
          </div>

          {!liveEnabled ? (
            <p style={{ fontSize: 12, color: MUTED, margin: "10px 0 0" }}>Live analysis runs on the server. Explore the three example funds below.</p>
          ) : (
            <div style={{ marginTop: 10 }}>
              {inputMode === "ticker" && (
                <div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <input value={tickerInput} onChange={(e) => setTickerInput(e.target.value.toUpperCase())}
                      onKeyDown={(e) => { if (e.key === "Enter") submitTicker(); }}
                      placeholder="Stock ticker, e.g. ARCC" aria-label="Stock ticker" disabled={inputBusy}
                      style={{ flex: 1, minWidth: 180, fontSize: 13, padding: "8px 10px", border: `1px solid ${BORDER}`, borderRadius: 6, color: INK, background: "#fff" }} />
                    <button onClick={submitTicker} disabled={inputBusy || !tickerInput.trim()}
                      style={{ fontSize: 12.5, padding: "8px 16px", borderRadius: 6, border: "none", cursor: inputBusy || !tickerInput.trim() ? "default" : "pointer", background: VIOLET, color: "#fff", opacity: inputBusy || !tickerInput.trim() ? 0.5 : 1 }}>
                      {byoPhase === "resolving" ? "Resolving…" : "Analyze"}
                    </button>
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center", marginTop: 8 }}>
                    <span style={{ fontSize: 11, color: MUTED }}>Try:</span>
                    {SUGGESTED_TICKERS.map((t) => (
                      <button key={t} onClick={() => setTickerInput(t)} disabled={inputBusy}
                        style={{ fontSize: 11, padding: "3px 9px", borderRadius: 5, border: `1px solid ${BORDER}`, cursor: inputBusy ? "default" : "pointer", background: "#fff", color: SECONDARY }}>{t}</button>
                    ))}
                    <a href="https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany" target="_blank" rel="noreferrer" style={{ fontSize: 11, color: VIOLET, marginLeft: 4 }}>all tickers ↗</a>
                  </div>
                </div>
              )}

              {inputMode === "url" && (
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <input value={urlInput} onChange={(e) => setUrlInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") submitUrl(); }}
                    placeholder="https://www.sec.gov/Archives/edgar/data/…" aria-label="SEC EDGAR document URL" disabled={inputBusy}
                    style={{ flex: 1, minWidth: 220, fontSize: 13, padding: "8px 10px", border: `1px solid ${BORDER}`, borderRadius: 6, color: INK, background: "#fff" }} />
                  <button onClick={submitUrl} disabled={inputBusy || !urlInput.trim()}
                    style={{ fontSize: 12.5, padding: "8px 16px", borderRadius: 6, border: "none", cursor: inputBusy || !urlInput.trim() ? "default" : "pointer", background: VIOLET, color: "#fff", opacity: inputBusy || !urlInput.trim() ? 0.5 : 1 }}>
                    Analyze
                  </button>
                </div>
              )}

              {inputMode === "upload" && (
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                  <input type="file" accept=".pdf,.htm,.html" disabled={inputBusy}
                    onChange={(e) => setUploadFile(e.target.files && e.target.files[0] ? e.target.files[0] : null)}
                    aria-label="Upload a filing"
                    style={{ flex: 1, minWidth: 220, fontSize: 12.5, color: SECONDARY }} />
                  <button onClick={submitUpload} disabled={inputBusy || !uploadFile}
                    style={{ fontSize: 12.5, padding: "8px 16px", borderRadius: 6, border: "none", cursor: inputBusy || !uploadFile ? "default" : "pointer", background: VIOLET, color: "#fff", opacity: inputBusy || !uploadFile ? 0.5 : 1 }}>
                    Analyze
                  </button>
                </div>
              )}

              {resolveNote && <p style={{ fontSize: 12, color: GREEN_T, margin: "8px 0 0" }}>{resolveNote}</p>}
              {byoError && <p role="alert" style={{ fontSize: 12.5, color: AMBER_T, background: AMBER_BG, borderRadius: 6, padding: "7px 10px", margin: "8px 0 0" }}>{byoError}</p>}
            </div>
          )}

          {/* curated "ready examples" row */}
          <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${BORDER}` }}>
            <div style={{ fontSize: 11, color: MUTED, marginBottom: 6 }}>Ready examples (instant, offline):</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {CURATED.map((c) => (
                <button key={c.ticker} onClick={() => load(c.ticker)}
                  style={{ fontSize: 12, padding: "6px 12px", borderRadius: 6, cursor: "pointer", border: `1px solid ${mode === "curated" && fund?.ticker === c.ticker ? VIOLET : BORDER}`, background: mode === "curated" && fund?.ticker === c.ticker ? VIOLET_BG : "#fff", color: mode === "curated" && fund?.ticker === c.ticker ? VIOLET : SECONDARY }}>{c.short}</button>
              ))}
            </div>
          </div>
        </div>

        {error && <div role="alert" style={{ fontSize: 13, color: AMBER_T, background: AMBER_BG, borderRadius: 8, padding: "8px 12px", marginBottom: 14 }}>{error}</div>}
        {loading && <p style={{ fontSize: 13, color: MUTED }}>Loading…</p>}

        {(data || mode === "byo") && (
          <>
            <div role="tablist" style={{ display: "flex", gap: 4, borderBottom: `1px solid ${BORDER}`, marginBottom: 16 }}>
              <span role="tab" aria-selected={tab === 1} className={`tab ${tab === 1 ? "active" : ""}`} onClick={() => setTab(1)}>1 · Source documents</span>
              <span role="tab" aria-selected={tab === 2} className={`tab ${tab === 2 ? "active" : ""}`} onClick={() => setTab(2)}>2 · Prefilled call guide</span>
              <span role="tab" aria-selected={tab === 3} className={`tab ${tab === 3 ? "active" : ""}`} onClick={() => setTab(3)}>3 · AI-drafted Chapter 4</span>
            </div>

            {/* ── 1 · SOURCE DOCUMENTS ── */}
            {tab === 1 && mode === "curated" && data && (
              <div>
                <div style={{ background: BG_CARD, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "14px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 14, fontWeight: 500 }}>{data.sourceLabel}</span>
                    <span style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      <button onClick={downloadSource} style={{ fontSize: 12, color: VIOLET, background: "transparent", border: "none", cursor: "pointer", padding: 0 }}>↓ Download source</button>
                      <a href={data.sourceUrl} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: VIOLET }}>View on SEC EDGAR ↗</a>
                    </span>
                  </div>
                  <div style={{ fontSize: 12.5, color: SECONDARY, marginTop: 8, lineHeight: 1.55 }}>
                    The engine ingested the fund&rsquo;s public SEC filing(s), normalized the text, and extracted answers to the Chapter&nbsp;4 call guide. Every machine answer is grounded in a verbatim quote that a deterministic gate checks against the source — ungrounded answers are withheld.
                  </div>
                  <div style={{ display: "flex", gap: 18, marginTop: 12, flexWrap: "wrap" }}>
                    <Stat label="Grounded from filing" value={`${groundedCount}`} />
                    <Stat label="Detected profile" value={`${data.profile.strategy} · ${data.profile.scopes.join(", ")}`} />
                  </div>
                </div>
                <p style={{ fontSize: 11.5, color: MUTED, marginTop: 10 }}>For the demo, bring-your-own analysis is limited to public SEC filings; documents are processed by our AI sub-processor under zero-retention terms.</p>
              </div>
            )}

            {/* ── 1 · SOURCE DOCUMENTS (BYO) ── */}
            {tab === 1 && mode === "byo" && (
              <div>
                <div style={{ background: BG_CARD, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "14px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 14, fontWeight: 500 }}>{byoSourceLabel || byoName || "Your filing"}</span>
                    <span style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      {(byoSourceUrl || (byoSourceKind === "upload" && uploadObjUrl.current)) && (
                        <button onClick={downloadSource} style={{ fontSize: 12, color: VIOLET, background: "transparent", border: "none", cursor: "pointer", padding: 0 }}>↓ Download source</button>
                      )}
                      {byoSourceUrl && <a href={byoSourceUrl} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: VIOLET }}>View on SEC EDGAR ↗</a>}
                    </span>
                  </div>
                  <div style={{ fontSize: 12.5, color: SECONDARY, marginTop: 8, lineHeight: 1.55 }}>
                    The live engine ingested your filing, normalized the text, and is extracting answers to the Chapter&nbsp;4 call guide. Every machine answer is grounded in a verbatim quote that a deterministic gate checks against the source; ungrounded answers route to the manager call.
                  </div>
                  {byoProfile && (
                    <div style={{ display: "flex", gap: 18, marginTop: 12, flexWrap: "wrap" }}>
                      <Stat label="Grounded so far" value={`${byoAnsweredCount}`} />
                      <Stat label="Detected profile" value={`${byoProfile.strategy}${byoProfile.scopes.length ? ` · ${byoProfile.scopes.join(", ")}` : ""}`} />
                    </div>
                  )}
                  {byoError && <p role="alert" style={{ fontSize: 12.5, color: AMBER_T, background: AMBER_BG, borderRadius: 6, padding: "7px 10px", marginTop: 12 }}>{byoError}</p>}
                </div>
                <p style={{ fontSize: 11.5, color: MUTED, marginTop: 10 }}>For the demo, bring-your-own analysis is limited to public SEC filings; documents are processed by our AI sub-processor under zero-retention terms.</p>
              </div>
            )}

            {/* ── 2 · PREFILLED CALL GUIDE (curated) ── */}
            {tab === 2 && mode === "curated" && report && (
              <div>
                <p style={{ fontSize: 12.5, color: SECONDARY, margin: "0 0 12px" }}>
                  Chapter 4 answers, prefilled. <span style={{ color: GREEN_T }}>Green</span> = grounded in the filing (click the dot to see the exact source sentence). <span style={{ color: AMBER_T }}>Amber</span> = a reasonable fill the analyst confirms on the manager call, editable here.
                </p>
                {fieldsBySub.map(([sub, fields]) => (
                  <section key={sub} style={{ marginBottom: 14 }}>
                    <h3 style={{ fontSize: 11, fontWeight: 500, color: VIOLET, textTransform: "uppercase", letterSpacing: "0.4px", margin: "0 0 6px" }}>{sub}</h3>
                    {fields.map((f) => (
                      <div key={f.id} style={{ padding: "7px 0", borderBottom: `1px solid #F3F4F6` }}>
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                          <span style={{ fontSize: 12.5, color: INK, flex: 1 }}>{f.question}</span>
                          {f.source === "filing" ? (
                            <button onClick={() => openCitation(f)} aria-expanded={openCite === f.id} aria-label="Show the source sentence" style={{ flexShrink: 0, display: "inline-flex", alignItems: "center", gap: 6, background: "transparent", border: "none", cursor: "pointer", padding: 0, maxWidth: 300, textAlign: "right" }}>
                              <span style={{ fontSize: 11.5, fontFamily: "var(--font-mono, monospace)", color: GREEN_T, background: GREEN_BG, padding: "2px 8px", borderRadius: 6 }}>{f.answer}</span>
                              <span style={{ width: 7, height: 7, borderRadius: "50%", background: VIOLET, flexShrink: 0 }} />
                            </button>
                          ) : (
                            <span style={{ flexShrink: 0, display: "inline-flex", flexDirection: "column", alignItems: "stretch", gap: 3, width: 340 }}>
                              <textarea value={edits[f.id] ?? f.answer} onChange={(e) => setEdits((p) => ({ ...p, [f.id]: e.target.value }))} aria-label={f.question}
                                rows={Math.max(2, Math.ceil((edits[f.id] ?? f.answer).length / 46))}
                                style={{ width: "100%", fontSize: 12, lineHeight: 1.45, padding: "6px 9px", border: `1px solid ${BORDER}`, borderRadius: 6, color: AMBER_T, background: AMBER_BG, boxSizing: "border-box", resize: "vertical", fontFamily: "inherit" }} />
                              <span style={{ fontSize: 9.5, color: MUTED, textAlign: "right" }}>from manager call · editable</span>
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </section>
                ))}
              </div>
            )}

            {/* ── 2 · PREFILLED CALL GUIDE (BYO live stream) ── */}
            {tab === 2 && mode === "byo" && (
              <div>
                <p style={{ fontSize: 12.5, color: SECONDARY, margin: "0 0 10px" }}>
                  <span style={{ color: GREEN_T }}>Green</span> = grounded in the filing (click the dot for the exact passage). <span style={{ color: AMBER_T }}>Amber</span> = routed to the manager call, editable. <span style={{ color: SLATE_T }}>Slate</span> = AI-suggested, confirm on call.
                </p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
                  <span style={{ fontSize: 12, color: MUTED }}>
                    {byoPhase === "streaming" ? `Extracting… ${byoAnsweredCount} of ${answerableIds.length} answered` : `${byoAnsweredCount} of ${answerableIds.length} grounded from the filing`}
                    {byoPhase === "streaming" && answerableIds.length > 0 ? ` · ${byoResolvedCount}/${answerableIds.length} processed` : ""}
                  </span>
                  <span style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button onClick={runSuggest} disabled={byoPhase !== "ready" || suggesting}
                      style={{ fontSize: 12, padding: "6px 12px", borderRadius: 6, border: `1px solid ${BORDER}`, cursor: byoPhase !== "ready" || suggesting ? "default" : "pointer", background: "#fff", color: SECONDARY, opacity: byoPhase !== "ready" || suggesting ? 0.5 : 1 }}>
                      {suggesting ? "Suggesting…" : "Suggest answers"}
                    </button>
                    <button onClick={runGenerate} disabled={byoPhase !== "ready" && byoPhase !== "drafting"}
                      style={{ fontSize: 12, padding: "6px 12px", borderRadius: 6, border: "none", cursor: byoPhase === "ready" ? "pointer" : "default", background: VIOLET, color: "#fff", opacity: byoPhase === "ready" || byoPhase === "drafting" ? 1 : 0.5 }}>
                      {byoPhase === "drafting" ? "Drafting Chapter 4…" : "Generate Chapter 4 draft"}
                    </button>
                  </span>
                </div>

                {answerableIds.length === 0 && byoPhase === "streaming" && (
                  <p style={{ fontSize: 12.5, color: MUTED }}>Detecting the fund profile and call-guide scope…</p>
                )}

                {answerableIds.map((id) => {
                  const a = byoAnswers[id];
                  const grounded = a && a.status === "answered";
                  const suggestion = suggestById[id];
                  const isEdited = edits[id] !== undefined;
                  const label = (a && a.label) || labelById[id] || id;
                  return (
                    <div key={id} style={{ padding: "8px 0", borderBottom: `1px solid #F3F4F6` }}>
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                        <span style={{ fontSize: 12.5, color: INK, flex: 1 }}>{label}</span>
                        {!a ? (
                          // pending → shimmering skeleton
                          <span style={{ flexShrink: 0, width: 300 }}><span className="skel" style={{ display: "block", width: "100%" }} /></span>
                        ) : grounded ? (
                          // GREEN grounded chip + violet citation dot
                          <button onClick={() => openByoCitation(id)} aria-expanded={openCite === id} aria-label="Show the source passage" style={{ flexShrink: 0, display: "inline-flex", alignItems: "center", gap: 6, background: "transparent", border: "none", cursor: byoContexts[id] ? "pointer" : "default", padding: 0, maxWidth: 320, textAlign: "right" }}>
                            <span style={{ fontSize: 11.5, fontFamily: "var(--font-mono, monospace)", color: GREEN_T, background: GREEN_BG, padding: "2px 8px", borderRadius: 6 }}>{a.value}</span>
                            {byoContexts[id] && <span style={{ width: 7, height: 7, borderRadius: "50%", background: VIOLET, flexShrink: 0 }} />}
                          </button>
                        ) : suggestion !== undefined && !isEdited ? (
                          // SLATE — AI-suggested, not yet edited
                          <span style={{ flexShrink: 0, display: "inline-flex", flexDirection: "column", alignItems: "stretch", gap: 3, width: 340 }}>
                            <span style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                              <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: ".5px", color: SLATE_T, background: SLATE_BG, border: `1px solid #CBD5E1`, borderRadius: 4, padding: "1px 5px" }}>AI</span>
                            </span>
                            <textarea value={suggestion} onChange={(e) => setEdits((p) => ({ ...p, [id]: e.target.value }))} aria-label={label}
                              rows={Math.max(2, Math.ceil(suggestion.length / 46))}
                              style={{ width: "100%", fontSize: 12, lineHeight: 1.45, padding: "6px 9px", border: `1px dashed #CBD5E1`, borderRadius: 6, color: SLATE_T, background: SLATE_BG, boxSizing: "border-box", resize: "vertical", fontFamily: "inherit" }} />
                            <span style={{ fontSize: 9.5, color: MUTED, textAlign: "right" }}>AI-suggested · confirm on call</span>
                          </span>
                        ) : (
                          // AMBER — routed to manager call OR human-edited (sign-off)
                          <span style={{ flexShrink: 0, display: "inline-flex", flexDirection: "column", alignItems: "stretch", gap: 3, width: 340 }}>
                            <textarea value={edits[id] ?? suggestion ?? a.value ?? ""} onChange={(e) => setEdits((p) => ({ ...p, [id]: e.target.value }))} aria-label={label}
                              rows={Math.max(2, Math.ceil((edits[id] ?? suggestion ?? a.value ?? "").length / 46))}
                              style={{ width: "100%", fontSize: 12, lineHeight: 1.45, padding: "6px 9px", border: `1px solid ${BORDER}`, borderRadius: 6, color: AMBER_T, background: AMBER_BG, boxSizing: "border-box", resize: "vertical", fontFamily: "inherit" }} />
                            <span style={{ fontSize: 9.5, color: MUTED, textAlign: "right" }}>{isEdited ? "analyst sign-off · editable" : "routed to manager call · editable"}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ── 3 · AI-DRAFTED CHAPTER 4 ── */}
            {tab === 3 && (() => {
              const r = mode === "byo" ? byoReport : report;
              if (mode === "byo" && !r) {
                return (
                  <p style={{ fontSize: 13, color: MUTED }}>
                    {byoPhase === "drafting" ? "Drafting Chapter 4…" : "Run the analysis, then select Generate Chapter 4 draft in the call guide."}
                  </p>
                );
              }
              if (!r) return null;
              return (
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 12, fontWeight: 500, color: GREEN_T, background: GREEN_BG, padding: "4px 12px", borderRadius: 6 }}>{r.rating} · {r.ratingLabel}</span>
                    {r.flagsFired.map((id) => {
                      const f = FLAG_TITLE.get(id);
                      return <span key={id} style={{ fontSize: 11, color: AMBER_T, background: AMBER_BG, padding: "3px 9px", borderRadius: 6 }}>flag: {f?.title ?? id}</span>;
                    })}
                    <span style={{ fontSize: 11, color: MUTED, marginLeft: "auto" }}>Drafted from the prefilled call guide · house style</span>
                  </div>
                  <article className="nar" style={{ background: BG_CARD, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "16px 20px" }}
                    dangerouslySetInnerHTML={{ __html: renderNarrative(r.narrative) }} />
                  <p style={{ fontSize: 11, color: MUTED, marginTop: 10 }}>Draft for analyst review. Editing a manager-call answer in §2 re-drafts the affected passages when run against the live engine.</p>
                </div>
              );
            })()}
          </>
        )}
      </div>

      <CitationPanel
        open={!!openCite}
        ctx={activeCitation}
        onClose={() => setOpenCite(null)}
      />
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return <div><div style={{ fontSize: 10.5, color: MUTED }}>{label}</div><div style={{ fontSize: 14, fontWeight: 500, fontFamily: "var(--font-mono, monospace)", marginTop: 2 }}>{value}</div></div>;
}

/** Minimal narrative renderer: #### → h4, blank-line-separated blocks → <p>. Escapes HTML. */
function renderNarrative(mdIn: string): string {
  const md = scrubDashes(mdIn); // hard house-style rule: no em/en dashes in output
  const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return md.split(/\n\n+/).map((block) => {
    const b = block.trim();
    if (b.startsWith("#### ")) return `<h4>${esc(b.slice(5))}</h4>`;
    return `<p>${esc(b)}</p>`;
  }).join("");
}
