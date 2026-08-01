// Publications data access. The list lives in the `publications` DB table and is
// consumed by the public /publications page and the admin "Announce" tool.
import { desc, eq, and } from "drizzle-orm";
import { db } from "@/lib/db";
import { publications } from "@/lib/db/schema";

export interface Publication {
  category: string;
  date: string;
  title: string;
  description: string;
  href: string;
  cta: string;
  available: boolean;
  external: boolean;
}

type Row = typeof publications.$inferSelect;

function toPublication(r: Row): Publication {
  return {
    category: r.category,
    date: r.dateLabel,
    title: r.title,
    description: r.description,
    href: r.href,
    cta: r.cta,
    available: r.available,
    external: r.isExternal,
  };
}

/** Visible publications, newest first — for the public /publications page + announce picker. */
export async function getPublications(): Promise<Publication[]> {
  const rows = await db
    .select()
    .from(publications)
    .where(eq(publications.isVisible, true))
    .orderBy(desc(publications.publishedAt));
  return rows.map(toPublication);
}

/** Look up a single visible publication by its href (used when sending an announcement). */
export async function getPublicationByHref(href: string): Promise<Publication | null> {
  const [row] = await db
    .select()
    .from(publications)
    .where(and(eq(publications.href, href), eq(publications.isVisible, true)))
    .limit(1);
  return row ? toPublication(row) : null;
}

/** Absolute URL for a publication (for emails / external links). */
export function publicationUrl(href: string): string {
  if (href.startsWith("http")) return href;
  return `https://alpinedd.com${href}`;
}
