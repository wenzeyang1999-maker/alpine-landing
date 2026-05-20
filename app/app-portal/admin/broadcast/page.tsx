import Link from "next/link";
import { BG, BG_CARD, INK, MUTED, BORDER, VIOLET } from "@/lib/app-portal/constants";
import BroadcastForm from "@/components/app-portal/admin/BroadcastForm";

export const metadata = {
  title: "Alpine Admin — Broadcast",
  robots: { index: false, follow: false },
};

export default function BroadcastPage() {
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
          <span className="font-body text-sm" style={{ color: INK }}>Broadcast email</span>
        </div>
        <span
          className="font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 rounded"
          style={{ background: "#EDE3F8", color: VIOLET }}
        >
          action
        </span>
      </header>

      <section className="px-6 py-10 max-w-3xl mx-auto w-full">
        <h1 className="font-heading font-bold tracking-tight" style={{ fontSize: 28, lineHeight: 1.1 }}>
          Broadcast email
        </h1>
        <p className="font-body mt-2 mb-8" style={{ color: MUTED, fontSize: 14 }}>
          Send a one-off email to subscribers, registered users, or a custom list. Use <b>Preview audience</b> first to confirm the recipient count.
        </p>

        <BroadcastForm />
      </section>
    </main>
  );
}
