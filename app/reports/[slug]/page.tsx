import { notFound, redirect } from "next/navigation";
import SubpageLayout from "@/components/SubpageLayout";
import AllocatorReportReader from "@/components/allocator/AllocatorReportReader";
import { getCurrentAllocator, canAccessReport } from "@/lib/allocator/access";
import { getReportEntry } from "@/lib/allocator/report-registry";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Report — Alpine Allocator Portal",
  robots: { index: false, follow: false },
};

export default async function ReportReaderPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  const allocator = await getCurrentAllocator();
  if (!allocator) {
    redirect(`/login?redirect=/reports/${encodeURIComponent(slug)}`);
  }

  // IDOR guard — unknown, unpublished, and unassigned slugs all 404 alike so
  // the response never reveals whether a report exists.
  if (!getReportEntry(slug)) notFound();
  if (!(await canAccessReport(allocator.id, slug))) notFound();

  return (
    <SubpageLayout>
      <AllocatorReportReader slug={slug} />
    </SubpageLayout>
  );
}
