import Link from "next/link";
import { BG, BG_CARD, INK, MUTED, BORDER, VIOLET } from "@/lib/app-portal/constants";
import OnboardForm from "@/components/app-portal/admin/OnboardForm";

export const metadata = {
  title: "Alpine Admin — Onboard customer",
  robots: { index: false, follow: false },
};

export default function OnboardPage() {
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
          <span className="font-body text-sm" style={{ color: INK }}>Onboard customer</span>
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
          Onboard a new customer
        </h1>
        <p className="font-body mt-2 mb-8" style={{ color: MUTED, fontSize: 14 }}>
          Generate a private portal token and email the customer an invite link. The link looks like <span className="font-mono">app.alpinedd.com/portal/&lt;token&gt;</span>.
        </p>

        <OnboardForm />
      </section>
    </main>
  );
}
