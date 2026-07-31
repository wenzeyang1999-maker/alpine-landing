"use client";

import { useState } from "react";
import SubpageLayout from "@/components/SubpageLayout";
import { BG_CARD, INK, MUTED, SUBTLE, BORDER, VIOLET } from "@/lib/constants";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // The endpoint always returns ok (anti-enumeration), so we show the same
      // confirmation regardless of whether the address has an account.
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      setSent(true);
    } catch {
      // Even on a network error, avoid leaking anything; show the neutral state.
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SubpageLayout>
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div
              className="inline-block text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
              style={{ background: VIOLET, color: "#fff", letterSpacing: "0.12em" }}
            >
              Alpine Account
            </div>
            <h1 className="font-heading font-emphasis text-2xl md:text-[1.75rem] leading-snug" style={{ color: INK }}>
              Reset your password
            </h1>
            <p className="mt-3 text-sm font-body leading-relaxed" style={{ color: MUTED }}>
              Enter your account email and we will send you a link to choose a new password.
            </p>
          </div>

          {sent ? (
            <div
              className="rounded-panel border p-6 text-center shadow-sm"
              style={{ background: BG_CARD, borderColor: BORDER }}
            >
              <p className="font-body text-sm" style={{ color: INK }}>
                If an account exists for <strong>{email.trim() || "that address"}</strong>, a password reset link is
                on its way. The link expires in 24 hours.
              </p>
              <p className="font-body text-sm mt-4" style={{ color: MUTED }}>
                Do not see it? Check your spam folder, or contact{" "}
                <a href="mailto:support@alpinedd.com" className="underline" style={{ color: VIOLET }}>
                  support@alpinedd.com
                </a>
                .
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="space-y-4 rounded-panel border p-6 shadow-sm"
              style={{ background: BG_CARD, borderColor: BORDER }}
            >
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-mono font-semibold uppercase tracking-wider mb-1.5"
                  style={{ color: SUBTLE }}
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@alpinedd.com"
                  className="field-input"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 px-6 py-3.5 rounded-btn text-white font-body font-emphasis text-sm hover:opacity-90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed min-h-[48px]"
                style={{ background: INK }}
              >
                {loading ? "Sending…" : "Send reset link"}
              </button>
            </form>
          )}

          <p className="mt-5 text-center text-sm font-mono" style={{ color: MUTED }}>
            <a
              href="https://app.alpinedd.com/demo-login"
              className="underline hover:opacity-80 transition-opacity"
              style={{ color: MUTED }}
            >
              ← Back to sign in
            </a>
          </p>
        </div>
      </div>
    </SubpageLayout>
  );
}
