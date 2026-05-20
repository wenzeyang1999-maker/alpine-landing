"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, Home } from "lucide-react";
import {
  BG, BG_CARD, INK, SECONDARY, MUTED, VIOLET, BORDER, LS_BODY,
} from "@/lib/constants";
import { CHAPTERS, ACT_COLOR } from "@/lib/manager/framework";

type FirmPreview = {
  name: string;
  contactEmail?: string;
};

export function WorkspaceShell({
  firm,
  children,
  rightPanel,
}: {
  firm: FirmPreview;
  children: React.ReactNode;
  rightPanel?: React.ReactNode;
}) {
  const pathname = usePathname();
  const activeChapter = (() => {
    const m = pathname.match(/\/workspace\/chapter\/(\d+)/);
    return m ? Number(m[1]) : null;
  })();
  const isOverview = pathname === "/workspace" || pathname === "/manager/workspace";

  return (
    <div style={{ background: BG, color: INK }} className="min-h-screen">
      {/* Top bar */}
      <header
        style={{ background: BG_CARD, borderBottom: `1px solid ${BORDER}` }}
        className="sticky top-0 z-10"
      >
        <div className="max-w-7xl mx-auto px-5 py-3 flex items-center justify-between gap-4">
          <Link href="/manager/workspace" className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/alpine-logo-dark.svg?v=5"
              alt="Alpine Due Diligence"
              style={{ height: 28, width: "auto" }}
            />
            <span
              className="font-mono text-[10px] uppercase pl-3"
              style={{
                color: MUTED, fontWeight: 700, letterSpacing: "0.1em",
                borderLeft: `1px solid ${BORDER}`,
              }}
            >
              For Managers
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <span
              className="font-body text-[13px]"
              style={{ color: SECONDARY, fontWeight: 500 }}
            >
              {firm.name}
            </span>
            {firm.contactEmail && (
              <span
                className="hidden sm:inline font-mono text-[11px]"
                style={{ color: MUTED, letterSpacing: "0.04em" }}
              >
                {firm.contactEmail}
              </span>
            )}
          </div>
        </div>
        {/* Sub-banner — confirms manager-side, links to alpinedd.com */}
        <div
          className="max-w-7xl mx-auto px-5 py-1.5 font-mono text-[10px] uppercase flex items-center justify-between"
          style={{ color: MUTED, letterSpacing: "0.08em" }}
        >
          <span>You&rsquo;re on manager.alpinedd.com — manager workspace</span>
          <Link
            href="https://alpinedd.com"
            className="hover:underline"
            style={{ color: MUTED }}
          >
            For allocators ↗
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-5 py-6 grid grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)_280px] gap-6">
        {/* Sidebar */}
        <aside className="hidden lg:block">
          <Link
            href="/manager/workspace"
            className={`flex items-center gap-2 px-3 py-2 rounded-btn font-body text-[13px] mb-3 ${
              isOverview ? "" : "hover:opacity-80 transition-opacity"
            }`}
            style={{
              background: isOverview ? `${VIOLET}10` : "transparent",
              color: isOverview ? VIOLET : SECONDARY,
              fontWeight: isOverview ? 600 : 500,
            }}
          >
            <Home size={14} />
            Overview
          </Link>
          <p
            className="font-mono text-[10px] uppercase mt-5 mb-2 px-3"
            style={{ color: MUTED, fontWeight: 700, letterSpacing: "0.1em" }}
          >
            Chapters
          </p>
          <nav className="flex flex-col gap-0.5">
            {CHAPTERS.map((ch) => {
              const isActive = activeChapter === ch.num;
              return (
                <Link
                  key={ch.num}
                  href={`/manager/workspace/chapter/${ch.num}`}
                  className="flex items-start gap-3 px-3 py-2 rounded-btn font-body text-[13px] hover:bg-black/[0.03] transition-colors"
                  style={{
                    background: isActive ? `${VIOLET}10` : "transparent",
                    color: isActive ? VIOLET : SECONDARY,
                    fontWeight: isActive ? 600 : 500,
                  }}
                >
                  <span
                    className="font-mono text-[11px] pt-0.5 shrink-0"
                    style={{
                      color: isActive ? VIOLET : ACT_COLOR[ch.act],
                      letterSpacing: "0.04em",
                      fontWeight: 700,
                    }}
                  >
                    {ch.numLabel}
                  </span>
                  <span className="leading-tight">{ch.title}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main column */}
        <main>
          {!isOverview && (
            <Link
              href="/manager/workspace"
              className="inline-flex items-center gap-1.5 mb-5 font-body text-[13px] hover:underline lg:hidden"
              style={{ color: MUTED, letterSpacing: LS_BODY }}
            >
              <ArrowLeft size={13} />
              Back to overview
            </Link>
          )}
          {children}
        </main>

        {/* Right panel */}
        <aside className="hidden lg:block">{rightPanel}</aside>
      </div>
    </div>
  );
}
