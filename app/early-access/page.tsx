"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SubpageLayout from "@/components/SubpageLayout";
import { BG_CARD, INK, MUTED, SECONDARY, SUBTLE, GREEN, BORDER, VIOLET, LS_BODY } from "@/lib/constants";

const ROLES = [
  { value: "allocator", label: "Allocator", sub: "Limited partners, endowments, pensions, fund of funds, family offices" },
  { value: "manager",   label: "Asset manager", sub: "General partner, fund manager" },
  { value: "other",     label: "Service provider or other", sub: "" },
] as const;

type Role = typeof ROLES[number]["value"];

export default function EarlyAccessPage() {
  const pathname = usePathname();
  const newsletterSource = pathname?.startsWith("/demo") ? "demo" : "early-access";
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [org, setOrg] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<Role | "">("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [subscribeNewsletter, setSubscribeNewsletter] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/form/early-access`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: name,
          email,
          organization: org || undefined,
          phone: phone || undefined,
          role: role || undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.detail || "Something went wrong. Please try again.");
      }
      if (subscribeNewsletter) {
        // Fire-and-forget — never block the request flow on newsletter sync.
        fetch("/api/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            source: newsletterSource,
          }),
        }).catch(console.error);
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
                  Leave your details and we&apos;ll schedule a walkthrough of the platform tailored to your mandate.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 rounded-panel border p-6 shadow-sm" style={{ background: BG_CARD, borderColor: BORDER }}>

                {/* Role selector */}
                <div>
                  <label className="block text-xs font-mono font-semibold uppercase tracking-wider mb-2" style={{ color: SUBTLE }}>
                    I am a&hellip;
                  </label>
                  <div className="space-y-2">
                    {ROLES.map((r) => (
                      <label
                        key={r.value}
                        className="flex items-start gap-3 rounded-lg border px-3.5 py-2.5 cursor-pointer transition-colors"
                        style={{
                          borderColor: role === r.value ? INK : BORDER,
                          background: role === r.value ? `${INK}08` : "transparent",
                        }}
                      >
                        <input
                          type="radio"
                          name="role"
                          value={r.value}
                          checked={role === r.value}
                          onChange={() => setRole(r.value)}
                          className="mt-0.5 accent-black shrink-0"
                          required
                        />
                        <span>
                          <span className="block text-sm font-body font-medium" style={{ color: INK }}>{r.label}</span>
                          {r.sub && <span className="block text-xs font-body" style={{ color: MUTED }}>{r.sub}</span>}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

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
                    placeholder="name@firm.com"
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
                    placeholder="Acme Capital"
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

                <label className="flex items-start gap-2 mt-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={subscribeNewsletter}
                    onChange={(e) => setSubscribeNewsletter(e.target.checked)}
                    className="mt-1 cursor-pointer"
                  />
                  <span className="font-body text-[13px]" style={{ color: SECONDARY, letterSpacing: LS_BODY }}>
                    Email me Alpine&apos;s monthly ODD insights newsletter.
                  </span>
                </label>

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
                We typically respond within 1 business day.
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
                Thanks, {name}. Our team will review your request and reach out within 1 business day at <span style={{ color: INK }}>{email}</span>.
              </p>

              <div className="mt-5 mx-auto max-w-sm flex items-start gap-2.5 rounded-lg px-4 py-3 text-left" style={{ background: `${GREEN}12`, border: `1px solid ${GREEN}30` }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5">
                  <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
                <p className="text-xs font-body leading-relaxed" style={{ color: GREEN }}>
                  A confirmation email is on its way to <span className="font-semibold">{email}</span>. Check your inbox (and spam folder) shortly.
                </p>
              </div>

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
