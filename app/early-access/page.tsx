"use client";

import { useState } from "react";
import Link from "next/link";
import SubpageLayout from "@/components/SubpageLayout";
import { BG_CARD, INK, MUTED, SUBTLE, GREEN, BORDER, VIOLET } from "@/lib/constants";

const API_BASE_URL = process.env.NEXT_PUBLIC_ALPINE_API_BASE_URL ?? "https://alpinedd.com";

export default function EarlyAccessPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [org, setOrg] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE_URL}/api/public/early-access`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name: name, email, organization: org || undefined, phone: phone || undefined }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.detail || "Something went wrong. Please try again.");
      }
      setSubmitted(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SubpageLayout>
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {!submitted ? (
            <>
              <div className="text-center mb-8">
                <h1 className="font-heading font-emphasis text-2xl md:text-3xl" style={{ color: INK }}>
                  Request a Demo
                </h1>
                <p className="mt-3 text-sm font-body leading-relaxed" style={{ color: MUTED }}>
                  Leave your details and we&apos;ll schedule a walkthrough of the platform tailored to your portfolio.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 rounded-panel border p-6 shadow-sm" style={{ background: BG_CARD, borderColor: BORDER }}>
                <div>
                  <label htmlFor="name" className="block text-xs font-mono font-semibold uppercase tracking-wider mb-1.5" style={{ color: SUBTLE }}>
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Smith"
                    className="field-input"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-mono font-semibold uppercase tracking-wider mb-1.5" style={{ color: SUBTLE }}>
                    Work Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane@allocator.com"
                    className="field-input"
                  />
                </div>

                <div>
                  <label htmlFor="org" className="block text-xs font-mono font-semibold uppercase tracking-wider mb-1.5" style={{ color: SUBTLE }}>
                    Company
                  </label>
                  <input
                    id="org"
                    type="text"
                    required
                    autoComplete="organization"
                    value={org}
                    onChange={(e) => setOrg(e.target.value)}
                    placeholder="Acme Endowment"
                    className="field-input"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-xs font-mono font-semibold uppercase tracking-wider mb-1.5" style={{ color: SUBTLE }}>
                    Phone <span className="normal-case tracking-normal font-normal" style={{ color: SUBTLE }}>(optional)</span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="field-input"
                  />
                </div>

                {error && (
                  <p className="text-sm text-center" style={{ color: VIOLET }} aria-live="polite">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 px-6 py-3.5 rounded-btn text-white font-body font-emphasis text-sm hover:opacity-90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed min-h-[48px]"
                  style={{ background: INK }}
                >
                  {loading ? "Submitting..." : "Request a Demo"}
                </button>
              </form>

              <p className="mt-6 text-center text-xs font-mono" style={{ color: SUBTLE }}>
                We typically respond within 24 hours.
              </p>
            </>
          ) : (
            <div className="text-center">
              <div
                className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6"
                style={{ background: `${GREEN}1A` }}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h1 className="font-heading font-emphasis text-2xl" style={{ color: INK }}>
                We&apos;ll be in touch
              </h1>
              <p className="mt-3 text-sm font-body leading-relaxed max-w-sm mx-auto" style={{ color: MUTED }}>
                Our team will reach out to you at <span style={{ color: INK }}>{email}</span> within 24 hours.
              </p>

              <div className="mt-8">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-btn font-body font-ui text-sm transition-colors min-w-[140px]"
                  style={{ color: INK, border: `1px solid ${BORDER}` }}
                >
                  Back to Home
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </SubpageLayout>
  );
}
