"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SubpageLayout from "@/components/SubpageLayout";
import { INK, MUTED, BORDER, VIOLET, BG_CARD, GREEN } from "@/lib/constants";

const SESSION_KEY = "alpine_demo_user";

export default function AlpineSpacePage() {
  const router = useRouter();
  const [demoAccess, setDemoAccess] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  function signOut() {
    localStorage.removeItem(SESSION_KEY);
    router.push("/");
  }

  useEffect(() => {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return;
    try {
      const user = JSON.parse(raw);
      setLoggedIn(true);
      setDemoAccess(!!user.demo_access);
    } catch {
      // session invalid, stay logged out
    }
  }, []);

  const cards = [
    {
      label: "White Paper",
      desc: "The LP Readiness Gap — Alpine × Acephalt",
      tag: "Research",
      tagColor: VIOLET,
      href: loggedIn ? "/whitepaper" : "/login?redirect=/whitepaper",
      locked: false,
    },
    {
      label: "ODD Demo",
      desc: "Full Alpine analyst portal with live report viewer",
      tag: demoAccess ? "Access Granted" : "Restricted",
      tagColor: demoAccess ? GREEN : "#94a3b8",
      href: demoAccess ? "/portfolio2" : "/demo-login",
      locked: !demoAccess,
    },
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
              {loggedIn ? "Select a resource below." : "Sign in to access Alpine resources."}
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
