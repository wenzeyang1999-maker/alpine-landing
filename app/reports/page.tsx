import { redirect } from "next/navigation";
import SubpageLayout from "@/components/SubpageLayout";
import InvestorPortfolioOverview, {
  type EnrichedReport,
} from "@/components/investor/InvestorPortfolioOverview";
import Link from "next/link";
import { getCurrentInvestor, getVisibleReports } from "@/lib/investor/access";
import type { ReportRegistryEntry } from "@/lib/investor/report-registry";
import { getReportContent } from "@/lib/investor/report-content";
import { INK, MUTED, SUBTLE, BORDER, BG_CARD } from "@/lib/constants";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Your Reports — Alpine Investor Portal",
  robots: { index: false, follow: false },
};

/** Parse an AUM string like "$4.21B firmwide (excl. $1.83B uncalled)" → millions. */
function parseAumMillions(s: string | undefined): number {
  if (!s) return 0;
  const m = s.match(/\$\s*([\d.]+)\s*([BMK])/i);
  if (!m) return 0;
  const num = parseFloat(m[1]);
  if (!Number.isFinite(num)) return 0;
  const unit = m[2].toUpperCase();
  if (unit === "B") return num * 1000;
  if (unit === "M") return num;
  if (unit === "K") return num / 1000;
  return 0;
}

function enrichReport(entry: ReportRegistryEntry): EnrichedReport {
  const content = getReportContent(entry.slug);
  const aumDisplay = content?.mock?.fund?.aum as string | undefined;
  const aumMillions = parseAumMillions(aumDisplay);

  const topicRatings: Record<number, "GREEN" | "YELLOW" | "RED"> = {};
  const td = content?.topicData ?? {};
  for (const k of Object.keys(td)) {
    const n = Number(k);
    if (!Number.isInteger(n)) continue;
    const r = (td[n]?.rating || "").toUpperCase();
    if (r === "GREEN" || r === "YELLOW" || r === "RED") {
      topicRatings[n] = r;
    }
  }
  return { entry, aumMillions, aumDisplay, topicRatings };
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

  if (loadError) {
    return (
      <SubpageLayout>
        <main className="flex-1 w-full">
          <div className="mx-auto max-w-3xl px-6 py-12">
            <ErrorState />
          </div>
        </main>
      </SubpageLayout>
    );
  }

  if (reports.length === 0) {
    return (
      <SubpageLayout>
        <main className="flex-1 w-full">
          <div className="mx-auto max-w-3xl px-6 py-12">
            <EmptyState />
          </div>
        </main>
      </SubpageLayout>
    );
  }

  const enriched = reports.map(enrichReport);
  const greetingName =
    investor.full_name?.trim() || investor.organization?.trim() || null;

  return (
    <SubpageLayout>
      <InvestorPortfolioOverview
        reports={enriched}
        greetingName={greetingName}
        greetingEmail={investor.email}
      />
    </SubpageLayout>
  );
}
