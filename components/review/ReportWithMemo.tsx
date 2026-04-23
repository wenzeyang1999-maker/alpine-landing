"use client";

import { ReviewProvider, ReportPageContent } from "@/components/engine-stubs";
import DemoReportViewer from "@/components/shell/DemoReportViewer";

export function ReportWithMemo({ alpineReviewId, brReviewId, finalReportPending }: { alpineReviewId: string | null; brReviewId?: string; finalReportPending?: boolean }) {
  return alpineReviewId ? (
    <ReviewProvider reviewId={alpineReviewId}>
      <ReportPageContent reviewId={alpineReviewId} />
    </ReviewProvider>
  ) : (
    <DemoReportViewer alpineReviewId={alpineReviewId} finalReportPending={finalReportPending} />
  );
}
