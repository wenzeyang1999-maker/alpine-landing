"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MUTED, BORDER, BG_CARD, INK } from "@/lib/constants";

export default function InvestorLogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await fetch("/api/investor/auth/logout", { method: "POST" });
    } catch {
      // Clearing the cookie is best-effort; navigate to /login regardless.
    }
    router.push("/login");
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="font-body text-[13px] px-3 py-1.5 rounded-btn transition-opacity hover:opacity-70 disabled:opacity-50 min-h-[36px]"
      style={{ border: `1px solid ${BORDER}`, color: INK, background: BG_CARD }}
    >
      {loading ? "Signing out…" : "Sign out"}
    </button>
  );
}
