import { inArray, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { usersInManager, firmsInManager } from "@/lib/db/schema";
import { GREEN, VIOLET } from "@/lib/app-portal/constants";
import { Section, Table, Empty, Muted, Badge, fmtRelative, fmtDate } from "@/components/app-portal/admin/shared";
import ManagerVerifyButton from "@/components/app-portal/admin/ManagerVerifyButton";

type ManagerRow = {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  is_verified: boolean;
  verified_at: string | null;
  job_title: string | null;
  firm_id: string;
  created_at: string;
};

type FirmRow = { id: string; name: string };

export default async function ManagerPortalSection() {
  let rows: ManagerRow[] = [];
  let firms: Record<string, string> = {};
  let errorMsg: string | null = null;

  try {
    const usersRaw = await db
      .select({
        id: usersInManager.id,
        email: usersInManager.email,
        full_name: usersInManager.fullName,
        role: usersInManager.role,
        is_verified: usersInManager.isVerified,
        verified_at: usersInManager.verifiedAt,
        job_title: usersInManager.jobTitle,
        firm_id: usersInManager.firmId,
        created_at: usersInManager.createdAt,
      })
      .from(usersInManager)
      .orderBy(desc(usersInManager.createdAt))
      .limit(200);
    rows = usersRaw as ManagerRow[];

    if (rows.length > 0) {
      const firmIds = Array.from(new Set(rows.map((r) => r.firm_id)));
      const firmsRaw = (await db
        .select({ id: firmsInManager.id, name: firmsInManager.name })
        .from(firmsInManager)
        .where(inArray(firmsInManager.id, firmIds))) as FirmRow[];

      firms = Object.fromEntries(firmsRaw.map((f) => [f.id, f.name]));
    }
  } catch (err) {
    errorMsg = String(err);
  }

  const pending = rows.filter((r) => !r.is_verified);
  const verified = rows.filter((r) => r.is_verified);

  return (
    <Section
      id="manager-portals"
      title="Manager Portals"
      count={`${pending.length} pending · ${rows.length} total`}
      error={errorMsg}
    >
      <p className="font-body text-[13px] mb-4">
        <a href="/admin/portal-links" className="underline" style={{ color: "#7B2CBF" }}>
          Review portal links &rarr;
        </a>
        <span style={{ color: "#64748B" }}>
          {" "}approve which firms may read a customer&rsquo;s secure-portal documents
        </span>
      </p>
      {rows.length === 0 ? (
        <Empty>No manager accounts yet.</Empty>
      ) : (
        <>
          {/* Pending queue */}
          {pending.length > 0 && (
            <div className="mb-6">
              <p
                className="font-mono text-[11px] uppercase tracking-widest mb-2"
                style={{ color: "#B45309" }}
              >
                Pending verification ({pending.length})
              </p>
              <Table
                headers={["Name / Email", "Firm", "Role / Title", "Signed up", "Action"]}
                rows={pending.map((u) => [
                  <div key="n">
                    <div className="font-body text-[13px]">{u.full_name ?? <Muted>—</Muted>}</div>
                    <div className="font-mono text-[11px]" style={{ color: "#5B6470" }}>{u.email}</div>
                  </div>,
                  <span key="f" className="font-body text-[13px]">{firms[u.firm_id] ?? <Muted>—</Muted>}</span>,
                  <div key="r">
                    <Badge color="#B45309" bg="#FEF3C7">{u.role}</Badge>
                    {u.job_title && (
                      <div className="font-body text-[11px] mt-0.5" style={{ color: "#5B6470" }}>{u.job_title}</div>
                    )}
                  </div>,
                  <Muted key="d">{fmtRelative(u.created_at)}</Muted>,
                  <ManagerVerifyButton key="a" userId={u.id} email={u.email} />,
                ])}
              />
            </div>
          )}

          {/* Verified accounts */}
          {verified.length > 0 && (
            <div>
              <p
                className="font-mono text-[11px] uppercase tracking-widest mb-2"
                style={{ color: "#64748B" }}
              >
                Verified ({verified.length})
              </p>
              <Table
                headers={["Name / Email", "Firm", "Role", "Verified"]}
                rows={verified.map((u) => [
                  <div key="n">
                    <div className="font-body text-[13px]">{u.full_name ?? <Muted>—</Muted>}</div>
                    <div className="font-mono text-[11px]" style={{ color: "#5B6470" }}>{u.email}</div>
                  </div>,
                  <span key="f" className="font-body text-[13px]">{firms[u.firm_id] ?? <Muted>—</Muted>}</span>,
                  <Badge key="r" color={u.role === "owner" ? VIOLET : GREEN} bg={u.role === "owner" ? "#F5F1FC" : "#ECFDF5"}>
                    {u.role}
                  </Badge>,
                  <Muted key="d">{fmtDate(u.verified_at)}</Muted>,
                ])}
              />
            </div>
          )}
        </>
      )}
    </Section>
  );
}
