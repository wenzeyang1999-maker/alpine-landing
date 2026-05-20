"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SubpageLayout from "@/components/SubpageLayout";
import { BG_CARD, INK, MUTED, SUBTLE, BORDER, VIOLET } from "@/lib/constants";

export default function InvestorLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/investor/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error || "Invalid email or password.");
        return;
      }

      // Honor a ?redirect= target set by the middleware gate; default to /reports.
      const params = new URLSearchParams(window.location.search);
      const target = params.get("redirect");
      router.push(target && target.startsWith("/reports") ? target : "/reports");
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
              Investor Portal
            </div>
            <h1
              className="font-heading font-emphasis text-2xl md:text-[1.75rem] leading-snug"
              style={{ color: INK }}
            >
              Sign in to your ODD report
            </h1>
            <p className="mt-3 text-sm font-body leading-relaxed" style={{ color: MUTED }}>
              Access the operational due diligence review Alpine prepared for you.
            </p>
          </div>

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
                placeholder="you@yourfirm.com"
                className="field-input"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-mono font-semibold uppercase tracking-wider mb-1.5"
                style={{ color: SUBTLE }}
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
              {loading ? "Verifying…" : "Sign In"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm font-body leading-relaxed" style={{ color: MUTED }}>
            Access is granted by Alpine support. If you need credentials
            or have trouble signing in, contact{" "}
            <a
              href="mailto:support@alpinedd.com"
              className="underline hover:opacity-80 transition-opacity"
              style={{ color: VIOLET }}
            >
              support@alpinedd.com
            </a>
            .
          </p>
        </div>
      </div>
    </SubpageLayout>
  );
}
