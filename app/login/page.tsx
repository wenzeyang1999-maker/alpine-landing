"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SubpageLayout from "@/components/SubpageLayout";
import { BG_CARD, INK, MUTED, SUBTLE, BORDER, VIOLET } from "@/lib/constants";

const DEMO_EMAIL = "demo@alpinedd.com";
const DEMO_PASSWORD = "demo123";
const SESSION_KEY = "alpine_demo_user";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    await new Promise((r) => setTimeout(r, 400));

    if (email.trim().toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD) {
      localStorage.setItem(SESSION_KEY, JSON.stringify({ email: DEMO_EMAIL, name: "Demo User" }));
      router.push("/portfolio2");
    } else {
      setError("Invalid email or password.");
      setLoading(false);
    }
  };

  return (
    <SubpageLayout>
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="font-heading font-emphasis text-2xl md:text-3xl" style={{ color: INK }}>
              Sign in to Alpine
            </h1>
            <p className="mt-3 text-sm font-body leading-relaxed" style={{ color: MUTED }}>
              Enter your demo credentials to access the platform.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-4 rounded-panel border p-6 shadow-sm"
            style={{ background: BG_CARD, borderColor: BORDER }}
          >
            <div>
              <label htmlFor="email" className="block text-xs font-mono font-semibold uppercase tracking-wider mb-1.5" style={{ color: SUBTLE }}>
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="demo@alpinedd.com"
                className="field-input"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-mono font-semibold uppercase tracking-wider mb-1.5" style={{ color: SUBTLE }}>
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
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs font-mono" style={{ color: SUBTLE }}>
            Don&apos;t have access?{" "}
            <a href="/early-access" className="underline" style={{ color: INK }}>
              Request early access
            </a>
          </p>
        </div>
      </div>
    </SubpageLayout>
  );
}
