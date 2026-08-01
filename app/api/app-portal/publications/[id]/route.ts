import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { publications } from "@/lib/db/schema";
import { getAppAdminEmail } from "@/lib/app-portal/auth-session";
import { logAudit } from "@/lib/app-portal/audit-log";
import { removeObject } from "@/lib/storage";

export const runtime = "nodejs";

// ── PATCH: toggle visibility (show/hide from the public list) ──
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const adminEmail = await getAppAdminEmail(req);
  if (!adminEmail) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  try {
    const { is_visible } = (await req.json()) as { is_visible?: boolean };
    if (typeof is_visible !== "boolean") {
      return NextResponse.json({ error: "is_visible (boolean) required." }, { status: 400 });
    }
    const [row] = await db
      .update(publications)
      .set({ isVisible: is_visible })
      .where(eq(publications.id, params.id))
      .returning({ id: publications.id, href: publications.href });
    if (!row) return NextResponse.json({ error: "Not found." }, { status: 404 });

    await logAudit({ actor: adminEmail, action: "publication.visibility", target: row.href, meta: { is_visible } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

// ── DELETE: remove the row (and its uploaded PDF, if any) ──
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const adminEmail = await getAppAdminEmail(req);
  if (!adminEmail) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  try {
    const [row] = await db
      .delete(publications)
      .where(eq(publications.id, params.id))
      .returning({ href: publications.href, pdfPath: publications.pdfPath });
    if (!row) return NextResponse.json({ error: "Not found." }, { status: 404 });

    if (row.pdfPath) {
      try { await removeObject("demo-docs", row.pdfPath); } catch { /* best effort */ }
    }

    await logAudit({ actor: adminEmail, action: "publication.delete", target: row.href });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
