"use client";

import { ReviewProvider, ReportPageContent } from "@/components/engine-stubs";
import DemoReportViewer from "@/components/shell/DemoReportViewer";

export function ReportWithMemo({ alpineReviewId, brReviewId, finalReportPending, isTrellis, topicRatingOverrides, onRatingChange, slug }: { alpineReviewId: string | null; brReviewId?: string; finalReportPending?: boolean; isTrellis?: boolean; topicRatingOverrides?: Record<number, string>; onRatingChange?: (topicNumber: number, rating: string) => void; slug?: string }) {
  return alpineReviewId ? (
    <ReviewProvider reviewId={alpineReviewId}>
      <ReportPageContent reviewId={alpineReviewId} />
    </ReviewProvider>
  ) : (
    <DemoReportViewer alpineReviewId={alpineReviewId} finalReportPending={finalReportPending} isTrellis={isTrellis} topicRatingOverrides={topicRatingOverrides} onRatingChange={onRatingChange} slug={slug} />
  );
}
