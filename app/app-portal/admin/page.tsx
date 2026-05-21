import Link from "next/link";
import { BG, BG_CARD, INK, MUTED, BORDER, VIOLET } from "@/lib/app-portal/constants";
import LogoutButton from "@/components/app-portal/LogoutButton";
import SearchFilter from "@/components/app-portal/admin/SearchFilter";
import FundsPipelineSection from "@/components/app-portal/admin/FundsPipelineSection";
import StuckReviewsSection from "@/components/app-portal/admin/StuckReviewsSection";
import ActivityFeedSection from "@/components/app-portal/admin/ActivityFeedSection";
import DocumentInboxSection from "@/components/app-portal/admin/DocumentInboxSection";
import WatermarkLogSection from "@/components/app-portal/admin/WatermarkLogSection";
import RequestsSection from "@/components/app-portal/admin/RequestsSection";
import CustomersSection from "@/components/app-portal/admin/CustomersSection";
import PortalsSection from "@/components/app-portal/admin/PortalsSection";
import UsersSection from "@/components/app-portal/admin/UsersSection";
import SubscribersSection from "@/components/app-portal/admin/SubscribersSection";
import AuditLogSection from "@/components/app-portal/admin/AuditLogSection";

export const metadata = {
  title: "Alpine Admin",
  description: "Alpine Due Diligence — internal admin workspace.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

const TABS = [
  { href: "#funds",         label: "Funds" },
  { href: "#stuck-reviews", label: "Stuck" },
  { href: "#activity",      label: "Activity" },
  { href: "#inbox",         label: "Inbox" },
  { href: "#watermark",     label: "Watermark" },
  { href: "#requests",      label: "Requests" },
  { href: "#customers",     label: "Customers" },
  { href: "#portals",       label: "Portals" },
  { href: "#users",         label: "Users" },
  { href: "#subscribers",   label: "Subscribers" },
  { href: "#audit",         label: "Audit" },
];

export default function AdminHome() {
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
            href="/admin/onboard"
            className="font-body text-sm px-3 py-1.5 rounded-md"
            style={{ background: INK, color: "#fff" }}
          >
            + Onboard customer
          </Link>
          <Link
            href="/admin/broadcast"
            className="font-body text-sm px-3 py-1.5 rounded-md"
            style={{ border: `1px solid ${BORDER}`, color: INK, background: BG_CARD }}
          >
            Broadcast email
          </Link>
          <Link
            href="/admin/admins"
            className="font-body text-sm px-3 py-1.5 rounded-md"
            style={{ border: `1px solid ${BORDER}`, color: INK, background: BG_CARD }}
          >
            Manage admins
          </Link>
          <Link
            href="/admin/investor-portal"
            className="font-body text-sm px-3 py-1.5 rounded-md"
            style={{ border: `1px solid ${BORDER}`, color: INK, background: BG_CARD }}
          >
            Investor portal
          </Link>
          <Link href="/" className="font-body text-sm ml-2" style={{ color: MUTED }}>
            workspace ↗
          </Link>
          <LogoutButton />
        </div>
      </header>

      <section className="px-6 py-10 max-w-7xl mx-auto w-full">
        <h1 className="font-heading font-bold tracking-tight" style={{ fontSize: 32, lineHeight: 1.1 }}>
          Admin
        </h1>
        <p className="font-body mt-2" style={{ color: MUTED, fontSize: 14 }}>
          Internal Alpine workspace · live data from Supabase. Filter visible rows below.
        </p>

        <nav
          className="mt-8 flex flex-wrap gap-4 font-body text-sm"
          style={{ borderBottom: `1px solid ${BORDER}` }}
        >
          {TABS.map((t) => (
            <a key={t.href} href={t.href} className="pb-2" style={{ color: MUTED }}>
              {t.label}
            </a>
          ))}
        </nav>

        <SearchFilter>
          {/* Operational core */}
          <FundsPipelineSection />
          <StuckReviewsSection />
          <ActivityFeedSection />

          {/* Distribution audit */}
          <DocumentInboxSection />
          <WatermarkLogSection />

          {/* Lead + customer pipeline */}
          <RequestsSection />
          <CustomersSection />

          {/* Account-state */}
          <PortalsSection />
          <UsersSection />
          <SubscribersSection />

          {/* Compliance / audit trail */}
          <AuditLogSection />
        </SearchFilter>
      </section>

      <footer
        className="px-6 py-6 font-body text-xs mt-auto"
        style={{ color: MUTED, borderTop: `1px solid ${BORDER}` }}
      >
        Alpine internal · data via Supabase
      </footer>
    </main>
  );
}
