"use client";

import { useState } from "react";
import { MUTED } from "@/lib/app-portal/constants";

export default function LogoutButton({
  label = "Sign out",
  variant = "link",
}: {
  label?: string;
  variant?: "link" | "button";
}) {
  const [pending, setPending] = useState(false);

  async function signOut() {
    setPending(true);
    try {
      await fetch("/api/app-portal/auth/logout", { method: "POST" });
    } catch {
      // ignore — we still want to bounce
    }
    // Best-effort: also clear the legacy localStorage demo session if present
    try {
      localStorage.removeItem("alpine_demo_user");
    } catch {
      // ignore
    }
    // Hard-nav so middleware sees the cleared cookie and the user lands on /demo-login
    window.location.href = "/demo-login";
  }

  if (variant === "button") {
    return (
      <button
        type="button"
        onClick={signOut}
        disabled={pending}
        className="font-body text-sm px-3 py-1.5 rounded-md disabled:opacity-50"
        style={{ color: "#fff", background: "#0F0F10" }}
      >
        {pending ? "Signing out…" : label}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={signOut}
      disabled={pending}
      className="font-body text-sm disabled:opacity-50"
      style={{ color: MUTED, background: "transparent", border: "none", padding: 0, cursor: "pointer" }}
    >
      {pending ? "Signing out…" : label}
    </button>
  );
}
