import Link from "next/link";
import { desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { portalDocuments } from "@/lib/db/schema";
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
  let docs: PortalDoc[] = [];
  let errorMessage: string | null = null;
  try {
    const data = await db
      .select({
        id: portalDocuments.id,
        token: portalDocuments.token,
        filename: portalDocuments.filename,
        file_size: portalDocuments.fileSize,
        uploaded_at: portalDocuments.uploadedAt,
      })
      .from(portalDocuments)
      .orderBy(desc(portalDocuments.uploadedAt))
      .limit(INBOX_LIMIT);
    docs = data as PortalDoc[];
  } catch (e) {
    errorMessage = (e as Error).message;
  }

  return (
    <Section
      id="inbox"
      title="Document Inbox"
      count={docs.length}
      error={errorMessage}
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
