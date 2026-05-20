import { supabase } from "@/lib/app-portal/supabase";
import { GREEN } from "@/lib/app-portal/constants";
import { Section, Table, Empty, Muted, Badge, fmtDate } from "@/components/app-portal/admin/shared";
import SubscriberRowActions from "@/components/app-portal/admin/SubscriberRowActions";
import ExportCsvLink from "@/components/app-portal/admin/ExportCsvLink";

interface SubRow {
  email: string;
  source: string | null;
  confirmed_at: string | null;
  created_at: string;
  unsubscribed_at: string | null;
}

type SubStatus = "active" | "pending" | "unsubscribed";

function deriveStatus(s: SubRow): SubStatus {
  if (s.unsubscribed_at) return "unsubscribed";
  if (s.confirmed_at) return "active";
  return "pending";
}

export default async function SubscribersSection() {
  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .select("email, source, confirmed_at, created_at, unsubscribed_at")
    .order("created_at", { ascending: false });

  const subs: SubRow[] = (data ?? []) as SubRow[];
  const active = subs.filter((s) => !s.unsubscribed_at);

  return (
    <Section id="subscribers" title="Subscribers" count={active.length} error={error?.message ?? null} hint={<ExportCsvLink table="subscribers" />}>
      {subs.length === 0 ? (
        <Empty>No subscribers yet.</Empty>
      ) : (
        <Table
          headers={["Email", "Source", "Status", "Subscribed", "Action"]}
          rows={subs.map((s) => {
            const status = deriveStatus(s);
            return [
              <span key="e" className="font-mono text-[13px]">{s.email}</span>,
              s.source ?? <Muted>—</Muted>,
              status === "unsubscribed" ? (
                <Badge color="#94a3b8" bg="#F1F5F9">Unsubscribed</Badge>
              ) : status === "active" ? (
                <Badge color={GREEN} bg="#ECFDF5">Active</Badge>
              ) : (
                <Badge color="#B45309" bg="#FEF3C7">Pending</Badge>
              ),
              <Muted key="d">{fmtDate(s.created_at)}</Muted>,
              <SubscriberRowActions key="a" email={s.email} status={status} />,
            ];
          })}
        />
      )}
    </Section>
  );
}
