import Link from "next/link";
import { headers } from "next/headers";
import { BG, BG_CARD, INK, MUTED, BORDER, VIOLET } from "@/lib/app-portal/constants";
import { supabase } from "@/lib/app-portal/supabase";
import { getAppAdminEmail, APP_ADMIN_ALLOWLIST } from "@/lib/app-portal/auth-session";
import AdminsManager from "@/components/app-portal/admin/AdminsManager";

export const metadata = {
  title: "Alpine Admin — Admins",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface AdminRow {
  email: string;
  added_at: string;
  added_by: string | null;
  note: string | null;
}

export default async function AdminsPage() {
  // Build a "fake" Request-like object so we can reuse getAppAdminEmail on the server side.
  // Server components don't expose the raw Request; we read cookies via the headers() helper.
  const hdr = headers();
  const fakeReq = new Request("http://internal/", { headers: { cookie: hdr.get("cookie") ?? "" } });
  const currentAdminEmail = await getAppAdminEmail(fakeReq);

  const { data, error } = await supabase
    .from("app_admins")
    .select("email, added_at, added_by, note")
    .order("added_at", { ascending: false });

  const tableMissing = !!error && (error.code === "42P01" || error.message?.includes("does not exist"));
  const rows: AdminRow[] = (data ?? []) as AdminRow[];
  const hardcoded = Array.from(APP_ADMIN_ALLOWLIST);

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
          <Link href="/admin" className="font-body text-sm" style={{ color: MUTED }}>← Admin</Link>
          <span style={{ color: MUTED }}>/</span>
          <span className="font-body text-sm" style={{ color: INK }}>Admins</span>
        </div>
        <span
          className="font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 rounded"
          style={{ background: "#EDE3F8", color: VIOLET }}
        >
          internal
        </span>
      </header>

      <section className="px-6 py-10 max-w-5xl mx-auto w-full">
        <h1 className="font-heading font-bold tracking-tight" style={{ fontSize: 28, lineHeight: 1.1 }}>
          App admins
        </h1>
        <p className="font-body mt-2 mb-8" style={{ color: MUTED, fontSize: 14 }}>
          DB-tracked record of who has admin access to app.alpinedd.com. The runtime auth gate is enforced by a hardcoded list in <code>middleware.ts</code> for Edge compatibility — the &ldquo;Runtime&rdquo; column shows whether each email is also in that list.
        </p>

        {tableMissing ? (
          <div
            className="rounded p-4 font-body text-[14px]"
            style={{ background: "#FEF3C7", color: "#92400E", border: "1px solid #FDE68A" }}
          >
            Table <code>app_admins</code> not found. Run <code>migrations/003_app_admins.sql</code> in Supabase to enable this page.
          </div>
        ) : (
          <AdminsManager
            admins={rows}
            currentAdminEmail={currentAdminEmail ?? ""}
            hardcodedAllowlist={hardcoded}
          />
        )}
      </section>
    </main>
  );
}
