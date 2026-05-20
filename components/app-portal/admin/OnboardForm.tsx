"use client";

import { useState } from "react";
import { BG_CARD, INK, MUTED, SUBTLE, BORDER, VIOLET, GREEN } from "@/lib/app-portal/constants";

interface OnboardResult {
  token: string;
  portal_url: string;
}

export default function OnboardForm() {
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [fundName, setFundName] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<OnboardResult | null>(null);
  const [copied, setCopied] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/app-portal/onboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: customerName,
          customer_email: customerEmail,
          fund_name: fundName,
          token: token || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Onboarding failed");
        return;
      }
      setResult({ token: data.token, portal_url: data.portal_url });
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  function startOver() {
    setCustomerName("");
    setCustomerEmail("");
    setFundName("");
    setToken("");
    setResult(null);
    setError(null);
  }

  if (result) {
    return (
      <div className="rounded-lg p-6" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
        <div className="flex items-center gap-2 mb-3">
          <span
            className="font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full"
            style={{ background: "#ECFDF5", color: GREEN }}
          >
            Invite sent
          </span>
          <span className="font-body text-[13px]" style={{ color: MUTED }}>
            Customer has been emailed · azhang BCC&apos;d
          </span>
        </div>
        <h3 className="font-heading font-semibold" style={{ fontSize: 17, color: INK }}>
          Workspace ready
        </h3>
        <p className="font-body text-[13px] mt-1" style={{ color: MUTED }}>
          The customer will receive an invite email with the link below. Files they upload will appear in <b>Document Inbox</b> and <b>Portals</b>.
        </p>

        <div className="mt-4 grid gap-3">
          <Field label="Portal URL">
            <div className="flex items-center gap-2">
              <a
                href={result.portal_url}
                className="font-mono text-[13px] truncate"
                style={{ color: VIOLET }}
                target="_blank"
                rel="noreferrer"
              >
                {result.portal_url}
              </a>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(result.portal_url);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1500);
                }}
                className="font-mono text-[11px] uppercase tracking-widest px-2 py-1 rounded"
                style={{ background: "#F1F5F9", color: INK }}
              >
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </Field>
          <Field label="Token (slug)">
            <span className="font-mono text-[13px]" style={{ color: INK }}>{result.token}</span>
          </Field>
        </div>

        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={startOver}
            className="font-body text-sm px-4 py-2 rounded-md"
            style={{ background: INK, color: "#fff" }}
          >
            Onboard another customer
          </button>
          <a
            href={result.portal_url}
            target="_blank"
            rel="noreferrer"
            className="font-body text-sm px-4 py-2 rounded-md"
            style={{ border: `1px solid ${BORDER}`, color: INK, background: BG_CARD }}
          >
            Preview portal →
          </a>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-lg p-6 grid gap-4"
      style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}
    >
      <Field label="Customer name" required={false}>
        <input
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="Jane Doe"
          className="field-input"
        />
      </Field>
      <Field label="Customer email" required>
        <input
          type="email"
          value={customerEmail}
          onChange={(e) => setCustomerEmail(e.target.value)}
          placeholder="jane@example.com"
          required
          className="field-input"
        />
      </Field>
      <Field label="Fund name">
        <input
          type="text"
          value={fundName}
          onChange={(e) => setFundName(e.target.value)}
          placeholder="Ridgeline Capital Partners IV"
          className="field-input"
        />
      </Field>
      <Field label="Portal token (slug)" hint="leave blank to auto-derive from fund name">
        <input
          type="text"
          value={token}
          onChange={(e) => setToken(e.target.value.toLowerCase())}
          placeholder="ridgeline-iv (lowercase, hyphens)"
          pattern="[a-z0-9][a-z0-9-]{0,40}"
          className="field-input"
        />
      </Field>

      {error && (
        <p className="text-sm" style={{ color: "#B91C1C" }}>
          {error}
        </p>
      )}

      <div className="flex items-center justify-between mt-2">
        <p className="text-[12px] font-body" style={{ color: SUBTLE }}>
          Generates the portal URL and emails the customer an invite. A copy is BCC&apos;d to azhang.
        </p>
        <button
          type="submit"
          disabled={loading}
          className="font-body text-sm px-4 py-2 rounded-md disabled:opacity-50"
          style={{ background: INK, color: "#fff" }}
        >
          {loading ? "Sending…" : "Send invite"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
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
