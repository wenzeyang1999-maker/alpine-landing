"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SubpageLayout from "@/components/SubpageLayout";
import { BG_CARD, INK, MUTED, SUBTLE, BORDER, VIOLET } from "@/lib/constants";

const SESSION_KEY = "alpine_demo_user";

export default function DemoLoginPage() {
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
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok || !data.demo_access) {
        setError("Access restricted. Contact Alpine to request demo access.");
        return;
      }

      localStorage.setItem(SESSION_KEY, JSON.stringify({ ...data.user, demo_access: true }));
      router.push("/portfolio2");
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
              Alpine ODD Demo
            </div>
            <h1
              className="font-heading font-emphasis text-2xl md:text-[1.75rem] leading-snug"
              style={{ color: INK }}
            >
              Analyst Portal
            </h1>
            <p className="mt-3 text-sm font-body leading-relaxed" style={{ color: MUTED }}>
              Restricted access. Sign in with your Alpine-issued credentials.
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
                placeholder="name@alpinedd.com"
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

          <p className="mt-5 text-center text-sm font-mono" style={{ color: MUTED }}>
            Not a demo user?{" "}
            <Link
              href="/early-access"
              className="underline hover:opacity-80 transition-opacity"
              style={{ color: VIOLET }}
            >
              Request early access
            </Link>
          </p>
        </div>
      </div>
    </SubpageLayout>
  );
}
