"use client";

import { FileText, Loader2, X } from "lucide-react";
import { VIOLET, MUTED, INK, SECONDARY, BG_CARD, BORDER, LS_BODY } from "@/lib/constants";

export interface MatchResult {
  documentId: string;
  filename: string;
  passage: string;
  score: number;
  url?: string | null;
}

interface Props {
  questionPrompt: string;
  matches: MatchResult[];
  loading: boolean;
  queryTokens: string[];
  onPin: (match: MatchResult) => void;
  onClose: () => void;
}

function highlight(text: string, tokens: string[]): React.ReactNode {
  if (!tokens.length) return text;
  const pattern = new RegExp(`(${tokens.map(escapeRe).join("|")})`, "gi");
  const parts = text.split(pattern);
  return parts.map((part, i) =>
    pattern.test(part)
      ? <mark key={i} style={{ background: `${VIOLET}25`, color: VIOLET, borderRadius: 2, padding: "0 1px" }}>{part}</mark>
      : part
  );
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function shortName(filename: string): string {
  return filename.replace(/\.[^.]+$/, "").replace(/[_-]/g, " ");
}

export default function EvidencePanel({ questionPrompt, matches, loading, queryTokens, onPin, onClose }: Props) {
  return (
    <div
      className="flex flex-col h-full"
      style={{ background: BG_CARD, border: `1px solid ${BORDER}`, borderRadius: 12, overflow: "hidden" }}
    >
      {/* Header */}
      <div
        className="px-4 py-3 flex items-center justify-between shrink-0"
        style={{ borderBottom: `1px solid ${BORDER}` }}
      >
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: VIOLET }} />
          <span className="font-mono text-[10px] uppercase" style={{ color: MUTED, fontWeight: 700, letterSpacing: "0.1em" }}>
            Source Evidence
          </span>
        </div>
        <button type="button" onClick={onClose} className="p-0.5 rounded hover:opacity-60">
          <X size={13} style={{ color: MUTED }} />
        </button>
      </div>

      {/* Question context */}
      <div className="px-4 py-2.5 shrink-0" style={{ borderBottom: `1px solid ${BORDER}` }}>
        <p className="font-body text-[11.5px]" style={{ color: SECONDARY, lineHeight: 1.5, letterSpacing: LS_BODY }}>
          {questionPrompt.length > 100 ? questionPrompt.slice(0, 100) + "…" : questionPrompt}
        </p>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-4">
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 size={18} className="animate-spin" style={{ color: MUTED }} />
            <span className="font-body text-[12px] ml-2" style={{ color: MUTED }}>Searching documents…</span>
          </div>
        ) : matches.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-2">
            <FileText size={22} style={{ color: MUTED }} />
            <p className="font-body text-[12px] text-center" style={{ color: MUTED, lineHeight: 1.5 }}>
              No matching passages found.<br />Try filling in more of your answer.
            </p>
          </div>
        ) : (
          matches.map((m) => (
            <div
              key={m.documentId}
              className="rounded-panel p-3 flex flex-col gap-2"
              style={{ background: `${VIOLET}06`, border: `1px solid ${VIOLET}22` }}
            >
              {/* Doc name + score */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 min-w-0">
                  <FileText size={12} className="shrink-0" style={{ color: VIOLET }} />
                  <span
                    className="font-mono text-[10px] truncate"
                    style={{ color: VIOLET, fontWeight: 700, letterSpacing: "0.06em" }}
                    title={m.filename}
                  >
                    {shortName(m.filename)}
                  </span>
                </div>
                <span
                  className="font-mono text-[9px] px-1.5 py-0.5 rounded-full shrink-0 ml-2"
                  style={{
                    background: `${VIOLET}18`,
                    color: VIOLET,
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                  }}
                >
                  {Math.round(m.score * 100)}% match
                </span>
              </div>

              {/* Highlighted passage */}
              <p
                className="font-body text-[12px] leading-relaxed"
                style={{ color: INK, borderLeft: `2px solid ${VIOLET}55`, paddingLeft: 8 }}
              >
                {highlight(m.passage, queryTokens)}
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onPin(m)}
                  className="font-mono text-[10px] px-2.5 py-1 rounded-btn hover:opacity-80 transition-opacity"
                  style={{
                    background: `${VIOLET}15`,
                    color: VIOLET,
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    border: `1px solid ${VIOLET}30`,
                  }}
                >
                  ↑ Use as source
                </button>
                {m.url && (
                  <a
                    href={m.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[10px] px-2.5 py-1 rounded-btn hover:opacity-80 transition-opacity"
                    style={{
                      color: SECONDARY,
                      fontWeight: 600,
                      letterSpacing: "0.06em",
                      border: `1px solid ${BORDER}`,
                    }}
                  >
                    Open PDF ↗
                  </a>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
