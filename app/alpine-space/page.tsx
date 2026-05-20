"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SubpageLayout from "@/components/SubpageLayout";
import { INK, MUTED, BORDER, VIOLET, BG_CARD, GREEN } from "@/lib/constants";
import { isAppAdmin } from "@/lib/app-allowlist";

const SESSION_KEY = "alpine_demo_user";

export default function AlpineSpacePage() {
  const router = useRouter();
  const [demoAccess, setDemoAccess] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [appHref, setAppHref] = useState("https://app.alpinedd.com");

  async function signOut() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // best-effort; continue clearing client state regardless
    }
    localStorage.removeItem(SESSION_KEY);
    router.push("/");
  }

  useEffect(() => {
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw) {
      try {
        const user = JSON.parse(raw);
        setLoggedIn(true);
        setDemoAccess(!!user.demo_access);
        setUserEmail(typeof user.email === "string" ? user.email.toLowerCase() : "");
      } catch {
        // session invalid, stay logged out
      }
    }
    if (typeof window !== "undefined") {
      const h = window.location.hostname;
      if (h === "localhost" || h === "127.0.0.1") {
        const port = window.location.port ? `:${window.location.port}` : "";
        setAppHref(`http://app.localhost${port}`);
      }
    }
  }, []);

  const showAppCard = isAppAdmin(userEmail);

  const cards = [
    {
      label: "White Paper",
      desc: "The LP Readiness Gap — Alpine × Acephalt",
      tag: "Research",
      tagColor: VIOLET,
      href: "/whitepaper",
      locked: false,
    },
    {
      label: "ODD Demo",
      desc: "Full Alpine analyst portal with live report viewer",
      tag: demoAccess ? "Access Granted" : "Restricted",
      tagColor: demoAccess ? GREEN : "#94a3b8",
      href: demoAccess ? "/portfolio2" : "/login",
      locked: !demoAccess,
    },
    ...(showAppCard
      ? [
          {
            label: "ODD app",
            desc: "Alpine app workspace at app.alpinedd.com",
            tag: "Beta",
            tagColor: VIOLET,
            href: appHref,
            locked: false,
          },
          {
            label: "ODD admin",
            desc: "Manage users, subscribers, and customer portals",
            tag: "Internal",
            tagColor: VIOLET,
            href: `${appHref}/admin`,
            locked: false,
          },
        ]
      : []),
  ];

  return (
    <SubpageLayout>
      <div className="flex-1 px-6 py-14 max-w-3xl mx-auto w-full">
        <div className="mb-10">
          <span
            className="inline-block text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
            style={{ background: VIOLET, color: "#fff" }}
          >
            Alpine Space
          </span>
          <h1
            className="font-heading font-emphasis text-2xl md:text-3xl leading-snug"
            style={{ color: INK }}
          >
            Your Alpine Portal
          </h1>
          <div className="mt-2 flex items-center justify-between">
            <p className="text-sm font-body" style={{ color: MUTED }}>
              Select a resource below.
            </p>
            {loggedIn && (
              <button
                onClick={signOut}
                className="text-[12px] font-body"
                style={{ color: MUTED, background: "none", border: "none", cursor: "pointer", padding: 0 }}
              >
                Sign out
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {cards.map((card) =>
            card.locked ? (
              <div
                key={card.label}
                className="rounded-panel border p-6 flex flex-col gap-3"
                style={{ background: BG_CARD, borderColor: BORDER }}
              >
                <span
                  className="self-start text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                  style={{ background: `${card.tagColor}18`, color: card.tagColor }}
                >
                  {card.tag}
                </span>
                <div>
                  <p className="font-heading font-emphasis text-lg" style={{ color: INK }}>
                    {card.label}
                  </p>
                  <p className="text-[13px] font-body mt-1" style={{ color: MUTED }}>
                    {card.desc}
                  </p>
                </div>
                <div className="mt-auto flex flex-col gap-1.5">
                  <Link
                    href="https://bookings.cloud.microsoft/book/AlpineDemo@alpinedd.com/?ismsaljsauthenabled=true"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[13px] font-mono transition-opacity hover:opacity-70"
                    style={{ color: VIOLET }}
                  >
                    Book a meeting →
                  </Link>
                  <Link
                    href="/early-access"
                    className="text-[13px] font-mono transition-opacity hover:opacity-70"
                    style={{ color: MUTED }}
                  >
                    Contact Alpine to request access →
                  </Link>
                </div>
              </div>
            ) : (
              <Link
                key={card.label}
                href={card.href}
                className="rounded-panel border p-6 flex flex-col gap-3 hover:shadow-md transition-shadow"
                style={{ background: BG_CARD, borderColor: BORDER }}
              >
                <span
                  className="self-start text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                  style={{ background: `${card.tagColor}18`, color: card.tagColor }}
                >
                  {card.tag}
                </span>
                <div>
                  <p className="font-heading font-emphasis text-lg" style={{ color: INK }}>
                    {card.label}
                  </p>
                  <p className="text-[13px] font-body mt-1" style={{ color: MUTED }}>
                    {card.desc}
                  </p>
                </div>
                <p className="text-[13px] font-mono mt-auto" style={{ color: VIOLET }}>
                  Open →
                </p>
              </Link>
            )
          )}
        </div>

        {!loggedIn && (
          <p className="mt-8 text-sm font-body text-center" style={{ color: MUTED }}>
            Already have an account?{" "}
            <Link href="/login?redirect=/alpine-space" className="underline" style={{ color: VIOLET }}>
              Sign in
            </Link>
          </p>
        )}
      </div>
    </SubpageLayout>
  );
}
