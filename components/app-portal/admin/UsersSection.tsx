import { supabase } from "@/lib/app-portal/supabase";
import { SUBTLE } from "@/lib/app-portal/constants";
import { Section, Table, Empty, Muted, fmtDate } from "@/components/app-portal/admin/shared";
import ExportCsvLink from "@/components/app-portal/admin/ExportCsvLink";

interface UserRow {
  id: string;
  email: string;
  full_name: string | null;
  organization: string | null;
  created_at: string;
}

export default async function UsersSection() {
  const { data, error } = await supabase
    .from("users")
    .select("id, email, full_name, organization, created_at")
    .order("created_at", { ascending: false });

  const users: UserRow[] = (data ?? []) as UserRow[];

  return (
    <Section id="users" title="Users" count={users.length} error={error?.message ?? null} hint={<ExportCsvLink table="users" />}>
      {users.length === 0 ? (
        <Empty>No registered users yet.</Empty>
      ) : (
        <Table
          headers={["Email", "Name", "Organization", "Joined"]}
          rows={users.map((u) => [
            <span key="e" className="font-mono text-[13px]">{u.email}</span>,
            u.full_name ?? <Muted>—</Muted>,
            u.organization ?? <Muted>—</Muted>,
            <Muted key="d">{fmtDate(u.created_at)}</Muted>,
          ])}
        />
      )}
      <p className="mt-3 text-[12px] font-body" style={{ color: SUBTLE }}>
        Add a <code style={{ background: "#F1F5F9", padding: "1px 4px", borderRadius: 3 }}>portal_token</code> column to <code style={{ background: "#F1F5F9", padding: "1px 4px", borderRadius: 3 }}>users</code> to let admin open a customer&apos;s workspace directly from this row.
      </p>
    </Section>
  );
}
