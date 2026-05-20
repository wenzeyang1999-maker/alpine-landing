"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import SubpageLayout from "@/components/app-portal/SubpageLayout";
import { BG_CARD, INK, MUTED, SUBTLE, BORDER, VIOLET } from "@/lib/app-portal/constants";
import { isAppAdmin } from "@/lib/app-allowlist";

const SESSION_KEY = "alpine_demo_user";

function safeRedirect(raw: string | null): string {
  if (!raw) return "/";
  if (!raw.startsWith("/") || raw.startsWith("//")) return "/";
  return raw;
}

function LoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const redirectTo = safeRedirect(params.get("redirect"));
  const initialError = params.get("error") === "forbidden"
    ? "This email is not authorized for the app workspace."
    : "";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(initialError);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setError(initialError);
  }, [initialError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const normalized = email.trim().toLowerCase();
    if (!isAppAdmin(normalized)) {
      setError("This email is not authorized for the app workspace.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/app-portal/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalized, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Invalid email or password.");
        return;
      }

      localStorage.setItem(SESSION_KEY, JSON.stringify({ ...data.user, demo_access: !!data.demo_access }));
      router.push(redirectTo);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div
            className="inline-block text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
            style={{ background: VIOLET, color: "#fff", letterSpacing: "0.12em" }}
          >
            Alpine App
          </div>
          <h1
            className="font-heading font-emphasis text-2xl md:text-[1.75rem] leading-snug"
            style={{ color: INK }}
          >
            Internal Sign In
          </h1>
          <p className="mt-3 text-sm font-body leading-relaxed" style={{ color: MUTED }}>
            Alpine team only. This workspace is not for clients or demo users.
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
          <Link
            href="https://alpinedd.com"
            className="underline hover:opacity-80 transition-opacity"
            style={{ color: MUTED }}
          >
            ← Back to alpinedd.com
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function DemoLoginPage() {
  return (
    <SubpageLayout>
      <Suspense>
        <LoginInner />
      </Suspense>
    </SubpageLayout>
  );
}
