import SubpageLayout from "@/components/SubpageLayout";
import { INK, MUTED, BORDER, BG_CARD } from "@/lib/constants";

function SkeletonCard() {
  return (
    <div
      className="rounded-panel border p-5"
      style={{ background: BG_CARD, borderColor: BORDER }}
      aria-hidden
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1 space-y-2">
          <div className="h-2.5 w-32 rounded animate-pulse" style={{ background: "#EDEFF1" }} />
          <div className="h-5 w-3/4 rounded animate-pulse" style={{ background: "#EDEFF1" }} />
          <div className="h-3.5 w-1/2 rounded animate-pulse" style={{ background: "#EDEFF1" }} />
        </div>
        <div className="h-14 w-14 rounded-card animate-pulse" style={{ background: "#EDEFF1" }} />
      </div>
      <div className="h-3 w-24 rounded animate-pulse mt-4" style={{ background: "#EDEFF1" }} />
    </div>
  );
}

export default function ReportsLoading() {
  return (
    <SubpageLayout>
      <main className="flex-1 w-full">
        <div className="mx-auto max-w-3xl px-6 py-12">
          <h1
            className="font-heading font-emphasis text-2xl md:text-[1.75rem] leading-tight"
            style={{ color: INK }}
          >
            Your reports
          </h1>
          <p className="font-body text-sm mt-2 mb-8" style={{ color: MUTED }}>
            Loading…
          </p>
          <div className="grid grid-cols-1 gap-4">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      </main>
    </SubpageLayout>
  );
}
