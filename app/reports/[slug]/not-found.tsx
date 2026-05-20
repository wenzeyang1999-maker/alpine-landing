import Link from "next/link";
import SubpageLayout from "@/components/SubpageLayout";
import { INK, MUTED, BORDER, BG_CARD } from "@/lib/constants";

export default function ReportNotFound() {
  return (
    <SubpageLayout>
      <main className="flex-1 w-full flex items-center justify-center px-6 py-20">
        <div
          className="w-full max-w-md rounded-panel border p-8 text-center"
          style={{ background: BG_CARD, borderColor: BORDER }}
        >
          <h1 className="font-heading font-emphasis text-xl" style={{ color: INK }}>
            Report not available
          </h1>
          <p className="font-body text-sm mt-2 leading-relaxed" style={{ color: MUTED }}>
            This report doesn&apos;t exist or hasn&apos;t been shared with your
            account. If you believe this is an error, contact your Alpine analyst.
          </p>
          <Link
            href="/reports"
            className="inline-block mt-5 px-5 py-2.5 rounded-btn text-white font-body font-emphasis text-sm"
            style={{ background: INK }}
          >
            Back to your reports
          </Link>
        </div>
      </main>
    </SubpageLayout>
  );
}
