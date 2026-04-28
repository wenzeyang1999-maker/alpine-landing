"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SubpageLayout from "@/components/SubpageLayout";
import { BG_CARD, BG, INK, MUTED, SUBTLE, BORDER, VIOLET, GREEN } from "@/lib/constants";

type UserType = "asset_allocator" | "investment_manager" | "other" | "";

const USER_TYPES: { value: UserType; label: string; badge: string }[] = [
  { value: "asset_allocator",    label: "Asset Allocator",    badge: "Capital Deployment" },
  { value: "investment_manager", label: "Investment Manager", badge: "Self Assessment"    },
  { value: "other",              label: "Other",              badge: "Custom"             },
];

function aumLabel(type: UserType) {
  if (type === "asset_allocator") return "Expected Capital Commitment";
  if (type === "investment_manager") return "Assets Under Management";
  return "Assets Under Management / Capital Commitment";
}

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName]             = useState("");
  const [email, setEmail]                   = useState("");
  const [organization, setOrganization]     = useState("");
  const [userType, setUserType]             = useState<UserType>("");
  const [otherTitle, setOtherTitle]         = useState("");
  const [aum, setAum]                       = useState("");
  const [password, setPassword]             = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError]                   = useState("");
  const [loading, setLoading]               = useState(false);
  const [done, setDone]                     = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!userType) {
      setError("Please select your organization type.");
      return;
    }

    if (userType === "other" && !otherTitle.trim()) {
      setError("Please enter your job title.");
      return;
    }

    if ((userType === "asset_allocator" || userType === "investment_manager") && !aum.trim()) {
      setError(`${aumLabel(userType)} is required.`);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName,
          email: email.trim().toLowerCase(),
          password,
          organization,
          user_type: userType,
          job_title: userType === "other" ? otherTitle.trim() : undefined,
          aum: aum.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      setDone(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <SubpageLayout>
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md text-center">
            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6"
              style={{ background: `${GREEN}1A` }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h1 className="font-heading font-emphasis text-2xl" style={{ color: INK }}>
              Account created
            </h1>
            <p className="mt-3 text-sm font-body leading-relaxed max-w-sm mx-auto" style={{ color: MUTED }}>
              Your Alpine account is ready. Sign in to access the platform.
            </p>
            <div className="mt-8">
              <button
                onClick={() => router.push("/login")}
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-btn text-white font-body font-emphasis text-sm hover:opacity-90 transition-opacity"
                style={{ background: INK }}
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </SubpageLayout>
    );
  }

  return (
    <SubpageLayout>
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="font-heading font-emphasis text-2xl md:text-3xl" style={{ color: INK }}>
              Create your account
            </h1>
            <p className="mt-3 text-sm font-body leading-relaxed" style={{ color: MUTED }}>
              Start your Alpine due diligence workflow today.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-4 rounded-panel border p-6 shadow-sm"
            style={{ background: BG_CARD, borderColor: BORDER }}
          >
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-xs font-mono font-semibold uppercase tracking-wider mb-1.5" style={{ color: SUBTLE }}>
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                required
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Jane Smith"
                className="field-input"
              />
            </div>

            {/* Work Email */}
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

            {/* Company — required */}
            <div>
              <label htmlFor="organization" className="block text-xs font-mono font-semibold uppercase tracking-wider mb-1.5" style={{ color: SUBTLE }}>
                Company
              </label>
              <input
                id="organization"
                type="text"
                required
                autoComplete="organization"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="Acme Endowment"
                className="field-input"
              />
            </div>

            {/* Organization type */}
            <div>
              <span className="block text-xs font-mono font-semibold uppercase tracking-wider mb-2" style={{ color: SUBTLE }}>
                Organization Type
              </span>
              <div className="flex flex-col gap-2">
                {USER_TYPES.map(({ value, label, badge }) => {
                  const selected = userType === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setUserType(value)}
                      className="flex items-center justify-between w-full px-4 py-3 rounded-lg border text-left transition-all"
                      style={{
                        borderColor: selected ? INK : BORDER,
                        background: selected ? `${INK}08` : BG,
                        outline: selected ? `2px solid ${INK}` : "2px solid transparent",
                        outlineOffset: "-1px",
                      }}
                    >
                      <span className="text-sm font-body font-semibold" style={{ color: INK }}>
                        {label}
                      </span>
                      <span
                        className="text-[11px] font-mono px-2 py-0.5 rounded-full"
                        style={{
                          background: selected ? INK : BORDER,
                          color: selected ? "#fff" : SUBTLE,
                        }}
                      >
                        {badge}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* "Other" expands a job title input */}
              {userType === "other" && (
                <div className="mt-2">
                  <input
                    type="text"
                    required
                    value={otherTitle}
                    onChange={(e) => setOtherTitle(e.target.value)}
                    placeholder="Enter your job title or organization type"
                    className="field-input"
                    autoFocus
                  />
                </div>
              )}
            </div>

            {/* AUM — required for allocator/manager, optional for other */}
            <div>
              <label htmlFor="aum" className="block text-xs font-mono font-semibold uppercase tracking-wider mb-1.5" style={{ color: SUBTLE }}>
                {aumLabel(userType)}
                {userType === "other" && (
                  <span className="normal-case tracking-normal font-normal ml-1" style={{ color: SUBTLE }}>(optional)</span>
                )}
              </label>
              <input
                id="aum"
                type="text"
                required={userType === "asset_allocator" || userType === "investment_manager"}
                value={aum}
                onChange={(e) => setAum(e.target.value)}
                placeholder="e.g. $500M"
                className="field-input"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-xs font-mono font-semibold uppercase tracking-wider mb-1.5" style={{ color: SUBTLE }}>
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
                className="field-input"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-xs font-mono font-semibold uppercase tracking-wider mb-1.5" style={{ color: SUBTLE }}>
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              {loading ? "Creating account…" : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs font-mono" style={{ color: SUBTLE }}>
            Already have an account?{" "}
            <Link href="/login" className="underline" style={{ color: INK }}>
              Sign in
            </Link>
          </p>

          <p className="mt-3 text-center text-xs font-mono leading-relaxed" style={{ color: SUBTLE }}>
            By creating an account you agree to our{" "}
            <Link href="/terms" className="underline" style={{ color: SUBTLE }}>Terms</Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline" style={{ color: SUBTLE }}>Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </SubpageLayout>
  );
}
