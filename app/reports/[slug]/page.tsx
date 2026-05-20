import { notFound, redirect } from "next/navigation";
import SubpageLayout from "@/components/SubpageLayout";
import InvestorReportReader from "@/components/investor/InvestorReportReader";
import { getCurrentInvestor, canAccessReport } from "@/lib/investor/access";
import { getReportEntry } from "@/lib/investor/report-registry";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Report — Alpine Investor Portal",
  robots: { index: false, follow: false },
};

export default async function ReportReaderPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  const investor = await getCurrentInvestor();
  if (!investor) {
    redirect(`/login?redirect=/reports/${encodeURIComponent(slug)}`);
  }

  // IDOR guard — unknown, unpublished, and unassigned slugs all 404 alike so
  // the response never reveals whether a report exists.
  if (!getReportEntry(slug)) notFound();
  if (!(await canAccessReport(investor.id, slug))) notFound();

  return (
    <SubpageLayout>
      <InvestorReportReader slug={slug} />
    </SubpageLayout>
  );
}
