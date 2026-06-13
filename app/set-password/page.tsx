"use client";

import { useEffect, useState } from "react";
import SubpageLayout from "@/components/SubpageLayout";
import { BG_CARD, INK, MUTED, SUBTLE, BORDER, VIOLET } from "@/lib/constants";

export default function SetPasswordPage() {
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setToken(params.get("token"));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/set-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error || "Could not set your password. The link may have expired.");
        return;
      }
      setDone(true);
      setTimeout(() => {
        window.location.href = "/login?reset=ok";
      }, 1500);
    } catch {
      setError("Something went wrong. Please try again.");
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
              Analyst Portal
            </div>
            <h1 className="font-heading font-emphasis text-2xl md:text-[1.75rem] leading-snug" style={{ color: INK }}>
              Set your password
            </h1>
            <p className="mt-3 text-sm font-body leading-relaxed" style={{ color: MUTED }}>
              Choose a password to finish setting up your Alpine account.
            </p>
          </div>

          {done ? (
            <div
              className="rounded-panel border p-6 text-center shadow-sm"
              style={{ background: BG_CARD, borderColor: BORDER }}
            >
              <p className="font-body text-sm" style={{ color: INK }}>
                Password set. Redirecting you to sign in…
              </p>
            </div>
          ) : token === null ? null : !token ? (
            <div
              className="rounded-panel border p-6 text-center shadow-sm"
              style={{ background: BG_CARD, borderColor: BORDER }}
            >
              <p className="font-body text-sm" style={{ color: INK }}>
                This link is missing its token. Please use the link from your email, or contact{" "}
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
                  htmlFor="password"
                  className="block text-xs font-mono font-semibold uppercase tracking-wider mb-1.5"
                  style={{ color: SUBTLE }}
                >
                  New password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="field-input"
                />
              </div>

              <div>
                <label
                  htmlFor="confirm"
                  className="block text-xs font-mono font-semibold uppercase tracking-wider mb-1.5"
                  style={{ color: SUBTLE }}
                >
                  Confirm password
                </label>
                <input
                  id="confirm"
                  type="password"
                  required
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="••••••••"
                  className="field-input"
                />
              </div>

              {error && (
                <p className="text-sm text-center" style={{ color: VIOLET }} aria-live="polite">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 px-6 py-3.5 rounded-btn text-white font-body font-emphasis text-sm hover:opacity-90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed min-h-[48px]"
                style={{ background: INK }}
              >
                {loading ? "Saving…" : "Set Password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </SubpageLayout>
  );
}
