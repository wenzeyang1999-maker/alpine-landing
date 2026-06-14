import Link from "next/link";
import { headers } from "next/headers";
import { BG, BG_CARD, INK, MUTED, BORDER, VIOLET } from "@/lib/app-portal/constants";
import { desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { appAdmins } from "@/lib/db/schema";
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

  let rows: AdminRow[] = [];
  let tableMissing = false;
  try {
    const data = await db
      .select({ email: appAdmins.email, addedAt: appAdmins.addedAt, addedBy: appAdmins.addedBy, note: appAdmins.note })
      .from(appAdmins)
      .orderBy(desc(appAdmins.addedAt));
    rows = data.map((r) => ({ email: r.email, added_at: r.addedAt, added_by: r.addedBy, note: r.note }));
  } catch (e) {
    const err = e as { code?: string; message?: string };
    tableMissing = err.code === "42P01" || !!err.message?.includes("does not exist");
  }
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
            Table <code>app_admins</code> not found in the database. Apply the latest schema (see <code>lib/db</code>) to enable this page.
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
