import Link from "next/link";
import { BG, BG_CARD, INK, MUTED, BORDER, VIOLET } from "@/lib/app-portal/constants";
import FundDetailView from "@/components/app-portal/admin/FundDetailView";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Alpine Admin — Fund Detail",
  robots: { index: false, follow: false },
};

export default function FundDetailPage({ params }: { params: { slug: string } }) {
  const slug = decodeURIComponent(params.slug);

  return (
    <main
      id="main-content"
      style={{ background: BG, color: INK, minHeight: "100vh" }}
      className="flex flex-col"
    >
      <header
        style={{ borderBottom: `1px solid ${BORDER}`, background: BG_CARD }}
        className="px-6 py-4 flex items-center justify-between sticky top-0 z-10"
      >
        <div className="flex items-center gap-2">
          <Link href="/admin" className="font-body text-sm" style={{ color: MUTED }}>
            ← Admin
          </Link>
          <span style={{ color: MUTED }}>/</span>
          <span className="font-body text-sm" style={{ color: MUTED }}>Funds</span>
          <span style={{ color: MUTED }}>/</span>
          <span className="font-mono text-sm" style={{ color: INK }}>{slug}</span>
        </div>
        <div className="flex items-center gap-3">
          <span
            className="font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 rounded"
            style={{ background: "#EDE3F8", color: VIOLET }}
          >
            fund detail
          </span>
        </div>
      </header>

      <section className="px-6 py-10 max-w-7xl mx-auto w-full">
        <h1 className="font-heading font-bold tracking-tight" style={{ fontSize: 32, lineHeight: 1.1 }}>
          {slug}
        </h1>
        <p className="font-body mt-2" style={{ color: MUTED, fontSize: 14 }}>
          Per-fund review status and recent activity.
        </p>

        <FundDetailView slug={slug} />
      </section>
    </main>
  );
}
