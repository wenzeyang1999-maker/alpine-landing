"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { CallPrepViewer } from "@/components/engine-stubs";
import { PlaceholderTab } from "./PlaceholderTab";

export function CallPrepContent({ reviewId }: { reviewId: string }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "";
    fetch(`${apiBase}/api/reviews/${reviewId}/output/content?report_type=callprep`, { credentials: "include" })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((d) => {
        if (d?.content) {
          setData(typeof d.content === "string" ? JSON.parse(d.content) : d.content);
        } else if (d?.call_objectives || d?.topic_sections) {
          setData(d);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [reviewId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-2 border-alpine-violet border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (error || !data) return <PlaceholderTab label="Manager Call Prep" detail={error || "No call prep data available."} />;
  return <CallPrepViewer data={data} reviewId={reviewId} />;
}
