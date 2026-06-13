import Link from "next/link";
import { desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { portalDocuments } from "@/lib/db/schema";
import { VIOLET } from "@/lib/app-portal/constants";
import { Section, Table, Empty, Muted, fmtDate, fmtBytes } from "@/components/app-portal/admin/shared";

interface PortalDoc {
  token: string;
  filename: string;
  file_size: number | null;
  uploaded_at: string;
}

interface PortalGroup {
  token: string;
  docCount: number;
  totalBytes: number;
  lastUploadAt: string;
}

export default async function PortalsSection() {
  let docs: PortalDoc[] = [];
  let errorMessage: string | null = null;
  try {
    const data = await db
      .select({
        token: portalDocuments.token,
        filename: portalDocuments.filename,
        file_size: portalDocuments.fileSize,
        uploaded_at: portalDocuments.uploadedAt,
      })
      .from(portalDocuments)
      .orderBy(desc(portalDocuments.uploadedAt));
    docs = data as PortalDoc[];
  } catch (e) {
    errorMessage = (e as Error).message;
  }

  const portalMap = new Map<string, PortalGroup>();
  for (const d of docs) {
    const g = portalMap.get(d.token) ?? {
      token: d.token,
      docCount: 0,
      totalBytes: 0,
      lastUploadAt: d.uploaded_at,
    };
    g.docCount += 1;
    g.totalBytes += d.file_size ?? 0;
    if (new Date(d.uploaded_at) > new Date(g.lastUploadAt)) g.lastUploadAt = d.uploaded_at;
    portalMap.set(d.token, g);
  }

  const portals = Array.from(portalMap.values()).sort(
    (a, b) => new Date(b.lastUploadAt).getTime() - new Date(a.lastUploadAt).getTime(),
  );

  return (
    <Section id="portals" title="Portals" count={portals.length} error={errorMessage}>
      {portals.length === 0 ? (
        <Empty>No portal uploads yet. Create a token-based portal to onboard a customer.</Empty>
      ) : (
        <Table
          headers={["Token", "Documents", "Total size", "Last upload", "Open"]}
          rows={portals.map((p) => [
            <span key="t" className="font-mono text-[13px]">{p.token}</span>,
            p.docCount,
            <Muted key="s">{fmtBytes(p.totalBytes)}</Muted>,
            <Muted key="u">{fmtDate(p.lastUploadAt)}</Muted>,
            <span key="l" className="flex gap-3 font-mono text-[12px]">
              <Link href={`/admin/${p.token}`} style={{ color: VIOLET }}>admin →</Link>
            </span>,
          ])}
        />
      )}
    </Section>
  );
}
