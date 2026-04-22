"use client";

import { useState } from "react";
import type { DemoApi } from "@/lib/demo-api-factory";
import { ICMemoTab } from "./ICMemoTab";
import { MonitoringPlanTab } from "./MonitoringPlanTab";
import { PlaceholderTab } from "./PlaceholderTab";

export function DeliverablesSection({ brReviewId, api }: { brReviewId: string | null; api: DemoApi }) {
  const [activeTab, setActiveTab] = useState<"memo" | "monitoring">("memo");

  return (
    <div className="space-y-4">
      {/* Tab bar */}
      <div className="flex gap-[2px] bg-br-card rounded-lg p-[2px] w-fit">
        {[
          { id: "memo" as const, label: "IC Memo" },
          { id: "monitoring" as const, label: "Monitoring Plan" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`font-body text-[12px] font-medium px-3.5 py-1.5 rounded-md transition-colors ${
              activeTab === tab.id
                ? "bg-br-surface text-br-text-primary"
                : "text-br-text-muted hover:text-br-text-secondary"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === "memo" && brReviewId ? (
        <ICMemoTab reviewId={brReviewId} api={api} />
      ) : activeTab === "monitoring" && brReviewId ? (
        <MonitoringPlanTab reviewId={brReviewId} api={api} />
      ) : (
        <PlaceholderTab label={activeTab === "memo" ? "IC Memo" : "Monitoring Plan"} />
      )}
    </div>
  );
}
