import Link from "next/link";
import { BG, BG_CARD, INK, MUTED, BORDER, VIOLET } from "@/lib/app-portal/constants";
import LogoutButton from "@/components/app-portal/LogoutButton";
import AllocatorAdminPanel from "@/components/app-portal/admin/AllocatorAdminPanel";

export const metadata = {
  title: "Allocator Portal — Alpine Admin",
  description: "Publish ODD reports and manage allocator access.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function AllocatorPortalAdminPage() {
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
          <Link href="/" className="font-heading font-bold tracking-tight" style={{ fontSize: 18, color: INK }}>
            Alpine
          </Link>
          <span
            className="font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 rounded"
            style={{ background: "#EDE3F8", color: VIOLET }}
          >
            admin
          </span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href="/admin"
            className="font-body text-sm px-3 py-1.5 rounded-md"
            style={{ border: `1px solid ${BORDER}`, color: INK, background: BG_CARD }}
          >
            ← Admin
          </Link>
          <LogoutButton />
        </div>
      </header>

      <section className="px-6 py-10 max-w-7xl mx-auto w-full">
        <h1 className="font-heading font-bold tracking-tight" style={{ fontSize: 32, lineHeight: 1.1 }}>
          Allocator Portal
        </h1>
        <p className="font-body mt-2" style={{ color: MUTED, fontSize: 14 }}>
          Publish ODD reports to the allocator surface, create and assign
          allocator accounts, and review documents allocators have uploaded.
        </p>

        <AllocatorAdminPanel />
      </section>

      <footer
        className="px-6 py-6 font-body text-xs mt-auto"
        style={{ color: MUTED, borderTop: `1px solid ${BORDER}` }}
      >
        Alpine internal · allocator portal administration
      </footer>
    </main>
  );
}
