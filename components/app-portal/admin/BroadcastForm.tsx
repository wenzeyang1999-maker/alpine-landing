"use client";

import { useState } from "react";
import { BG_CARD, INK, MUTED, SUBTLE, BORDER, VIOLET, GREEN } from "@/lib/app-portal/constants";

type Audience = "active_subscribers" | "all_users" | "custom";

interface SendResult {
  sent: number;
  failed: number;
  recipient_count: number;
}

interface DryRunResult {
  recipient_count: number;
  preview: string[];
}

const AUDIENCES: { value: Audience; label: string; hint: string }[] = [
  { value: "active_subscribers", label: "Active newsletter subscribers", hint: "confirmed + not unsubscribed" },
  { value: "all_users", label: "All registered users", hint: "everyone in the users table" },
  { value: "custom", label: "Custom list", hint: "comma-separated emails below" },
];

export default function BroadcastForm() {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [audience, setAudience] = useState<Audience>("active_subscribers");
  const [customEmails, setCustomEmails] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dryRun, setDryRun] = useState<DryRunResult | null>(null);
  const [result, setResult] = useState<SendResult | null>(null);

  function buildPayload(asDryRun: boolean) {
    return {
      subject,
      body,
      audience,
      custom_emails:
        audience === "custom"
          ? customEmails.split(/[\s,;]+/).map((e) => e.trim()).filter(Boolean)
          : undefined,
      dry_run: asDryRun,
      // Fresh per-click UUID — server dedupes identical keys arriving within 5 min
      // (defends against double-click + browser-retry on network blips).
      idempotency_key: asDryRun ? undefined : (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`),
    };
  }

  async function call(asDryRun: boolean) {
    setLoading(true);
    setError(null);
    if (asDryRun) setDryRun(null);
    if (!asDryRun) setResult(null);
    try {
      const res = await fetch("/api/app-portal/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload(asDryRun)),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Broadcast failed");
        return;
      }
      if (asDryRun) setDryRun({ recipient_count: data.recipient_count, preview: data.preview ?? [] });
      else setResult({ sent: data.sent, failed: data.failed, recipient_count: data.recipient_count });
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setSubject("");
    setBody("");
    setCustomEmails("");
    setDryRun(null);
    setResult(null);
    setError(null);
  }

  if (result) {
    return (
      <div className="rounded-lg p-6" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
        <span
          className="font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full inline-block mb-3"
          style={{ background: "#ECFDF5", color: GREEN }}
        >
          Broadcast complete
        </span>
        <div className="grid grid-cols-3 gap-3 mt-3">
          <Stat label="Sent" value={result.sent} />
          <Stat label="Failed" value={result.failed} tone={result.failed > 0 ? "warn" : "neutral"} />
          <Stat label="Recipients" value={result.recipient_count} />
        </div>
        <p className="font-body text-[13px] mt-4" style={{ color: MUTED }}>
          A summary has been emailed to azhang@alpinedd.com.
        </p>
        <div className="mt-5">
          <button
            type="button"
            onClick={reset}
            className="font-body text-sm px-4 py-2 rounded-md"
            style={{ background: INK, color: "#fff" }}
          >
            Send another broadcast
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        call(false);
      }}
      className="rounded-lg p-6 grid gap-4"
      style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}
    >
      <Field label="Subject" required>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
          maxLength={200}
          className="field-input"
          placeholder="Q2 ODD insights, what we're seeing across allocators"
        />
      </Field>

      <Field label="Body" required hint="plain text · line breaks preserved · links auto-render as text">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
          rows={10}
          className="field-input"
          placeholder={"Hi there,\n\nAlpine has shipped …"}
          style={{ fontFamily: "inherit", resize: "vertical" }}
        />
      </Field>

      <Field label="Audience" required>
        <div className="grid gap-2">
          {AUDIENCES.map((a) => (
            <label
              key={a.value}
              className="flex items-start gap-3 p-3 rounded-md cursor-pointer"
              style={{
                border: `1px solid ${audience === a.value ? INK : BORDER}`,
                background: audience === a.value ? "#F8FAFC" : BG_CARD,
              }}
            >
              <input
                type="radio"
                name="audience"
                value={a.value}
                checked={audience === a.value}
                onChange={() => setAudience(a.value)}
                className="mt-0.5"
              />
              <div>
                <div className="font-body text-[14px]" style={{ color: INK }}>{a.label}</div>
                <div className="font-body text-[12px]" style={{ color: MUTED }}>{a.hint}</div>
              </div>
            </label>
          ))}
        </div>
      </Field>

      {audience === "custom" && (
        <Field label="Custom recipient emails" hint="comma- or newline-separated">
          <textarea
            value={customEmails}
            onChange={(e) => setCustomEmails(e.target.value)}
            rows={4}
            className="field-input"
            placeholder="alice@example.com, bob@example.com"
            style={{ fontFamily: "inherit", resize: "vertical" }}
          />
        </Field>
      )}

      {dryRun && (
        <div
          className="rounded p-3 font-body text-[13px]"
          style={{ background: "#F5F1FC", color: VIOLET, border: "1px solid #E9DCFA" }}
        >
          Preview: <b>{dryRun.recipient_count}</b> recipient{dryRun.recipient_count === 1 ? "" : "s"}
          {dryRun.preview.length > 0 && (
            <> · sample: <span className="font-mono text-[12px]">{dryRun.preview.join(", ")}</span></>
          )}
        </div>
      )}

      {error && (
        <p className="text-sm" style={{ color: "#B91C1C" }}>
          {error}
        </p>
      )}

      <div className="flex items-center justify-between mt-2 gap-3">
        <p className="text-[12px] font-body" style={{ color: SUBTLE }}>
          Sent through Resend · summary BCC&apos;d to azhang.
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => call(true)}
            disabled={loading}
            className="font-body text-sm px-4 py-2 rounded-md disabled:opacity-50"
            style={{ border: `1px solid ${BORDER}`, background: BG_CARD, color: INK }}
          >
            {loading ? "…" : "Preview audience"}
          </button>
          <button
            type="submit"
            disabled={loading}
            className="font-body text-sm px-4 py-2 rounded-md disabled:opacity-50"
            style={{ background: INK, color: "#fff" }}
          >
            {loading ? "Sending…" : "Send broadcast"}
          </button>
        </div>
      </div>
    </form>
  );
}

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        className="block font-mono text-[10px] uppercase tracking-widest mb-1.5"
        style={{ color: SUBTLE }}
      >
        {label}
        {required && <span style={{ color: VIOLET }}> *</span>}
      </label>
      {children}
      {hint && (
        <div className="font-body text-[11px] mt-1" style={{ color: MUTED }}>
          {hint}
        </div>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone?: "warn" | "neutral";
}) {
  const color = tone === "warn" && value > 0 ? "#B91C1C" : INK;
  return (
    <div className="rounded p-3" style={{ background: "#F8FAFC", border: `1px solid ${BORDER}` }}>
      <div className="font-mono text-[10px] uppercase tracking-widest" style={{ color: SUBTLE }}>
        {label}
      </div>
      <div className="font-heading font-bold mt-1" style={{ fontSize: 22, color }}>
        {value}
      </div>
    </div>
  );
}
