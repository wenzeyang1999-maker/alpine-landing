"use client";

import { useState } from "react";
import { Link2, Copy, Check } from "lucide-react";
import { BG_CARD, INK, SECONDARY, MUTED, VIOLET, BORDER, LS_BODY } from "@/lib/constants";

export default function InvitePanel() {
  const [link, setLink] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  async function generate() {
    setError("");
    setGenerating(true);
    try {
      const res = await fetch("/api/manager/invite/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not generate link.");
        return;
      }
      setLink(data.inviteUrl);
    } catch {
      setError("Network error.");
    } finally {
      setGenerating(false);
    }
  }

  async function copy() {
    if (!link) return;
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      className="rounded-panel p-4 flex flex-col gap-3"
      style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}
    >
      <p
        className="font-mono text-[10px] uppercase"
        style={{ color: MUTED, fontWeight: 700, letterSpacing: "0.1em" }}
      >
        Invite teammates
      </p>

      {!link ? (
        <>
          <p
            className="font-body text-[12px]"
            style={{ color: SECONDARY, lineHeight: 1.5, letterSpacing: LS_BODY }}
          >
            Generate a link your team can use to join this workspace. They set their own password on first use — bookmark the link to return any time.
          </p>
          {error && (
            <p className="font-body text-[12px]" style={{ color: "#dc2626" }}>{error}</p>
          )}
          <button
            type="button"
            disabled={generating}
            onClick={generate}
            className="rounded-btn px-3 py-2 font-body text-[12px] inline-flex items-center justify-center gap-1.5 mt-1 disabled:opacity-50 hover:opacity-90 transition-opacity"
            style={{ background: INK, color: "#fff", fontWeight: 600 }}
          >
            <Link2 size={12} />
            {generating ? "Generating…" : "Generate invite link"}
          </button>
        </>
      ) : (
        <>
          <div
            className="rounded-btn px-3 py-2 font-mono text-[11px] break-all"
            style={{ background: BG_CARD, border: `1px solid ${BORDER}`, color: SECONDARY, wordBreak: "break-all" }}
          >
            {link}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={copy}
              className="flex-1 rounded-btn px-3 py-2 font-body text-[12px] inline-flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity"
              style={{ background: INK, color: "#fff", fontWeight: 600 }}
            >
              {copied ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy link</>}
            </button>
            <button
              type="button"
              onClick={() => { setLink(null); setCopied(false); }}
              className="rounded-btn px-3 py-2 font-body text-[12px]"
              style={{ border: `1px solid ${BORDER}`, color: MUTED }}
            >
              New
            </button>
          </div>
          <p
            className="font-body text-[11px]"
            style={{ color: MUTED, lineHeight: 1.5 }}
          >
            Anyone with this link can join your workspace. Revoke from your account settings if needed.
          </p>
        </>
      )}
    </div>
  );
}
