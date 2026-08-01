import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { publications } from "@/lib/db/schema";
import { getAppAdminEmail } from "@/lib/app-portal/auth-session";
import { logAudit } from "@/lib/app-portal/audit-log";
import { ensureContainer, uploadObject, publicUrl } from "@/lib/storage";

export const runtime = "nodejs";
export const maxDuration = 60;

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Build the "2026 Jul 30 · 9 AM" display label directly from datetime-local parts
// (no timezone math — the admin's entered wall-clock time is what we show).
function formatDateLabel(value: string): string {
  const [datePart, timePart = "09:00"] = value.split("T");
  const [y, m, d] = datePart.split("-").map((n) => parseInt(n, 10));
  const [hh, mm] = timePart.split(":").map((n) => parseInt(n, 10));
  const ampm = hh >= 12 ? "PM" : "AM";
  const h12 = hh % 12 === 0 ? 12 : hh % 12;
  const time = mm ? `${h12}:${String(mm).padStart(2, "0")}` : `${h12}`;
  return `${y} ${MONTHS[m - 1]} ${String(d).padStart(2, "0")} · ${time} ${ampm}`;
}

type Row = typeof publications.$inferSelect;
function toApi(r: Row) {
  return {
    id: r.id, category: r.category, title: r.title, description: r.description,
    href: r.href, cta: r.cta, date_label: r.dateLabel, is_external: r.isExternal,
    available: r.available, is_visible: r.isVisible, pdf_path: r.pdfPath,
    published_at: r.publishedAt, created_at: r.createdAt,
  };
}

// ── GET: list all publications for the admin table ──
export async function GET(req: NextRequest) {
  const adminEmail = await getAppAdminEmail(req);
  if (!adminEmail) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  try {
    const rows = await db.select().from(publications).orderBy(desc(publications.publishedAt));
    return NextResponse.json({ publications: rows.map(toApi) });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

// ── POST: upload a PDF + metadata → new publication row ──
export async function POST(req: NextRequest) {
  const adminEmail = await getAppAdminEmail(req);
  if (!adminEmail) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  try {
    const form = await req.formData();
    const file = form.get("file");
    const category = String(form.get("category") ?? "").trim();
    const title = String(form.get("title") ?? "").trim();
    const description = String(form.get("description") ?? "").trim();
    const publishedInput = String(form.get("published_at") ?? "").trim();
    const cta = String(form.get("cta") ?? "").trim() || "Read publication →";

    if (!category || !title || !description) {
      return NextResponse.json({ error: "Category, title, and description are required." }, { status: 400 });
    }
    if (!publishedInput) {
      return NextResponse.json({ error: "Publish date is required." }, { status: 400 });
    }
    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: "A PDF file is required." }, { status: 400 });
    }
    if (file.type && file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      return NextResponse.json({ error: "File must be a PDF." }, { status: 400 });
    }
    if (file.size > 25 * 1024 * 1024) {
      return NextResponse.json({ error: "PDF is larger than 25 MB." }, { status: 400 });
    }

    // Upload to the public demo-docs container under a publications/ prefix.
    const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").replace(/\.pdf$/i, "");
    const pdfPath = `publications/${randomUUID()}-${safe || "document"}.pdf`;
    const bytes = Buffer.from(await file.arrayBuffer());
    await ensureContainer("demo-docs");
    await uploadObject("demo-docs", pdfPath, bytes, "application/pdf", { upsert: true });
    const href = publicUrl("demo-docs", pdfPath);

    const dateLabel = formatDateLabel(publishedInput);
    const publishedAt = `${publishedInput.length === 16 ? `${publishedInput}:00` : publishedInput}`;

    const [row] = await db
      .insert(publications)
      .values({
        category, title, description, href, cta,
        dateLabel, isExternal: true, available: true, isVisible: true,
        pdfPath, publishedAt,
      })
      .returning();

    await logAudit({ actor: adminEmail, action: "publication.create", target: href, meta: { title, category } });
    return NextResponse.json({ publication: toApi(row) }, { status: 201 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to create publication";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
