import Link from "next/link";
import { supabase } from "@/lib/app-portal/supabase";
import { VIOLET } from "@/lib/app-portal/constants";
import { Section, Table, Empty, Muted, fmtRelative, fmtBytes } from "@/components/app-portal/admin/shared";

interface PortalDoc {
  id: string;
  token: string;
  filename: string;
  file_size: number | null;
  uploaded_at: string;
}

const INBOX_LIMIT = 20;

export default async function DocumentInboxSection() {
  const { data, error } = await supabase
    .from("portal_documents")
    .select("id, token, filename, file_size, uploaded_at")
    .order("uploaded_at", { ascending: false })
    .limit(INBOX_LIMIT);

  const docs: PortalDoc[] = (data ?? []) as PortalDoc[];

  return (
    <Section
      id="inbox"
      title="Document Inbox"
      count={docs.length}
      error={error?.message ?? null}
      hint={`most recent ${INBOX_LIMIT} uploads across all portals`}
    >
      {docs.length === 0 ? (
        <Empty>No documents uploaded yet.</Empty>
      ) : (
        <Table
          headers={["Filename", "Portal", "Size", "Uploaded", "Open"]}
          rows={docs.map((d) => [
            <span key="f" className="font-body text-[13px]">{d.filename}</span>,
            <Link key="t" href={`/portal/${d.token}`} className="font-mono text-[12px]" style={{ color: VIOLET }}>
              {d.token}
            </Link>,
            <Muted key="s">{fmtBytes(d.file_size ?? 0)}</Muted>,
            <Muted key="u">{fmtRelative(d.uploaded_at)}</Muted>,
            <Link
              key="l"
              href={`/portal/${d.token}`}
              className="font-mono text-[12px]"
              style={{ color: VIOLET }}
            >
              portal →
            </Link>,
          ])}
        />
      )}
    </Section>
  );
}
