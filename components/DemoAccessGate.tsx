"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

const SESSION_KEY = "alpine_demo_user";

type Status = "checking" | "allowed" | "denied";

/**
 * Client-side gate for demo-only pages on the marketing domain.
 *
 * Renders nothing until localStorage confirms a user with `demo_access: true`,
 * otherwise redirects to /login with the original path as the redirect.
 *
 * NOTE: this is a UX gate, not a security boundary. Anyone with API access
 * can still hit /api/* endpoints directly — Supabase RLS + per-API auth gates
 * are what actually protect data. This just stops casual URL-sharing leaks.
 */
export default function DemoAccessGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const path = usePathname();
  const [status, setStatus] = useState<Status>("checking");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) {
        const u = JSON.parse(raw);
        if (u?.demo_access === true) {
          setStatus("allowed");
          return;
        }
      }
    } catch {
      // fall through to denied
    }
    setStatus("denied");
    router.replace(`/login?redirect=${encodeURIComponent(path || "/")}`);
  }, [router, path]);

  if (status !== "allowed") return null;
  return <>{children}</>;
}
