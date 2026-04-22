"use client";

import { useState } from "react";

export function RequestAccessCTA() {
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");

  async function handleRequest() {
    setState("sending");
    try {
      const name = localStorage.getItem("alpine-demo-name") || "";
      const email = localStorage.getItem("alpine-demo-email") || "";
      const org = localStorage.getItem("alpine-demo-org") || "";
      await fetch(`${window.location.origin}/api/public/early-access`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name: name, email, organization: org || undefined }),
      });
      setState("sent");
    } catch {
      setState("sent");
    }
  }

  if (state === "sent") {
    return (
      <div className="px-3 py-2.5 rounded-lg bg-alpine-green/10 border border-alpine-green/20 text-center">
        <p className="text-[11px] font-heading font-semibold text-alpine-green">Request Sent</p>
        <p className="text-[10px] text-br-text-muted mt-0.5">We&apos;ll reach out within 24 hours.</p>
      </div>
    );
  }

  return (
    <button
      onClick={handleRequest}
      disabled={state === "sending"}
      className="w-full px-3 py-2.5 rounded-lg text-[12px] font-heading font-semibold text-white transition-all disabled:opacity-60"
      style={{ background: "linear-gradient(135deg, #7B2CBF 0%, #5B21B6 100%)" }}
    >
      {state === "sending" ? "Sending..." : "Request Early Access →"}
    </button>
  );
}
