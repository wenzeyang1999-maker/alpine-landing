import Link from "next/link";
import { redirect } from "next/navigation";
import SubpageLayout from "@/components/SubpageLayout";
import InvestorLogoutButton from "@/components/investor/InvestorLogoutButton";
import { getCurrentInvestor, getVisibleReports } from "@/lib/investor/access";
import type { ReportRegistryEntry, ReportRating } from "@/lib/investor/report-registry";
import { INK, MUTED, SUBTLE, BORDER, BG_CARD, GREEN, AMBER } from "@/lib/constants";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Your Reports — Alpine Investor Portal",
  robots: { index: false, follow: false },
};

const RATING_COLOR: Record<ReportRating, string> = {
  GREEN: GREEN,
  YELLOW: AMBER,
  RED: "#EF4444",
};

const RATING_LABEL: Record<ReportRating, string> = {
  GREEN: "Accept",
  YELLOW: "Watchlist",
  RED: "Flag",
};

function ReportCard({ report }: { report: ReportRegistryEntry }) {
  const color = RATING_COLOR[report.rating];
  return (
    <Link
      href={`/reports/${report.slug}`}
      className="block rounded-panel border p-5 transition-shadow hover:shadow-md focus:shadow-md"
      style={{ background: BG_CARD, borderColor: BORDER }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p
            className="font-mono text-[10px] uppercase tracking-widest mb-1.5"
            style={{ color: SUBTLE }}
          >
            Operational Due Diligence
          </p>
          <h2
            className="font-heading font-emphasis text-lg leading-snug truncate"
            style={{ color: INK }}
          >
            {report.fundName}
          </h2>
          <p className="font-body text-sm mt-0.5" style={{ color: MUTED }}>
            {report.manager}
          </p>
        </div>
        <div
          className="shrink-0 flex flex-col items-center justify-center rounded-card px-3 py-2"
          style={{ background: `${color}1A`, border: `1px solid ${color}55` }}
        >
          <span
            className="font-heading font-emphasis text-xl leading-none tabular-nums"
            style={{ color }}
          >
            {report.oddScore}
          </span>
          <span className="font-mono text-[9px] mt-0.5" style={{ color: SUBTLE }}>
            ODD / 100
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between mt-4">
        <span
          className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-wide"
          style={{ color }}
        >
          <span
            className="inline-block w-2 h-2 rounded-full"
            style={{ background: color }}
            aria-hidden
          />
          {RATING_LABEL[report.rating]}
        </span>
        <span className="font-body text-[13px] font-emphasis" style={{ color: INK }}>
          Open report →
        </span>
      </div>
    </Link>
  );
}

function EmptyState() {
  return (
    <div
      className="rounded-panel border p-8 text-center"
      style={{ background: BG_CARD, borderColor: BORDER }}
    >
      <h2 className="font-heading font-emphasis text-lg" style={{ color: INK }}>
        Your report is being prepared
      </h2>
      <p
        className="font-body text-sm mt-2 leading-relaxed max-w-md mx-auto"
        style={{ color: MUTED }}
      >
        Your Alpine analyst will publish your operational due diligence report
        here as soon as it&apos;s ready. We&apos;ll have it waiting for you the
        next time you sign in.
      </p>
      <p className="font-body text-sm mt-3" style={{ color: SUBTLE }}>
        Questions in the meantime? Reach your analyst at{" "}
        <a href="mailto:support@alpinedd.com" className="underline">
          support@alpinedd.com
        </a>
        .
      </p>
    </div>
  );
}

function ErrorState() {
  return (
    <div
      className="rounded-panel border p-8 text-center"
      style={{ background: BG_CARD, borderColor: BORDER }}
    >
      <h2 className="font-heading font-emphasis text-lg" style={{ color: INK }}>
        Couldn&apos;t load your reports
      </h2>
      <p className="font-body text-sm mt-2" style={{ color: MUTED }}>
        Something went wrong on our end. Please try again.
      </p>
      <Link
        href="/reports"
        className="inline-block mt-4 px-5 py-2.5 rounded-btn text-white font-body font-emphasis text-sm"
        style={{ background: INK }}
      >
        Try again
      </Link>
    </div>
  );
}

export default async function ReportsHomePage() {
  const investor = await getCurrentInvestor();
  if (!investor) redirect("/login?redirect=/reports");

  let reports: ReportRegistryEntry[] = [];
  let loadError = false;
  try {
    reports = await getVisibleReports(investor.id);
  } catch (err) {
    console.error("[reports] failed to load visible reports:", err);
    loadError = true;
  }

  const greetingName = investor.full_name?.trim() || investor.organization?.trim() || null;

  return (
    <SubpageLayout>
      <main id="main-content" className="flex-1 w-full">
        <div className="mx-auto max-w-3xl px-6 py-12">
          <div className="flex items-start justify-between gap-4 mb-8">
            <div>
              <h1
                className="font-heading font-emphasis text-2xl md:text-[1.75rem] leading-tight"
                style={{ color: INK }}
              >
                Your reports
              </h1>
              <p className="font-body text-sm mt-2" style={{ color: MUTED }}>
                {greetingName
                  ? `Signed in as ${greetingName}.`
                  : `Signed in as ${investor.email}.`}{" "}
                {reports.length > 0
                  ? "Select a report to read the full review."
                  : ""}
              </p>
            </div>
            <InvestorLogoutButton />
          </div>

          {loadError ? (
            <ErrorState />
          ) : reports.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {reports.map((report) => (
                <ReportCard key={report.slug} report={report} />
              ))}
            </div>
          )}
        </div>
      </main>
    </SubpageLayout>
  );
}
