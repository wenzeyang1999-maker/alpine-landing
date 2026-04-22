"use client";

/**
 * Engine Stubs — placeholder components for the real Alpine ODD engine.
 * Replace these with real imports from the engine when it's integrated.
 */

import React from "react";

function EngineStubCard({ title, description }: { title: string; description?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] rounded-xl border border-br bg-br-card text-center p-8">
      <div className="w-12 h-12 rounded-full bg-alpine-violet/10 flex items-center justify-center mb-4">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-alpine-violet">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      </div>
      <h3 className="text-[14px] font-heading font-semibold text-br-text-primary mb-1">{title}</h3>
      <p className="text-[12px] text-br-text-muted max-w-xs">
        {description || "This section is powered by the Alpine ODD engine. Engine integration coming soon."}
      </p>
      <div className="mt-4 px-3 py-1 rounded-full bg-alpine-violet/10 text-alpine-violet text-[11px] font-mono tracking-wider">
        ENGINE · PENDING INTEGRATION
      </div>
    </div>
  );
}

// ReviewProvider stub
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ReviewProvider({ children }: { children: React.ReactNode; [key: string]: any }) {
  return <>{children}</>;
}

// Page content stubs — accept any props so TypeScript doesn't complain
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function SummaryPageContent(_props?: any) {
  return <EngineStubCard title="ODD Summary" description="Full AI-generated ODD summary with topic ratings, risk observations, and executive overview." />;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function UploadPageContent(_props?: any) {
  return <EngineStubCard title="Document Upload" description="Upload fund documents (Form ADV, DDQ, Compliance Manual, etc.) for AI analysis." />;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function AnalysisPageContent(_props?: any) {
  return <EngineStubCard title="Gap Analysis" description="12-topic parallel AI analysis: Governance, Compliance, Valuation, Trading, Technology, Operations, Risk, and more." />;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function VerificationPageContent(_props?: any) {
  return <EngineStubCard title="SEC Verification" description="Automated SEC IAPD lookup and Form ADV cross-verification against uploaded documents." />;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ReportPageContent(_props?: any) {
  return <EngineStubCard title="Report Generation" description="IC-ready ODD report generation via two-pass Claude AI review (Sonnet draft → Opus review)." />;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ReportViewer(_props?: any) {
  return <EngineStubCard title="ODD Report" description="Full ODD report with ACCEPT/WATCHLIST/FLAG ratings and numbered risk observations." />;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function CallPrepViewer(_props?: any) {
  return <EngineStubCard title="Call Preparation" description="AI-generated call prep guide with targeted questions based on identified gaps." />;
}
