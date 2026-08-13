import { NextResponse } from "next/server";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { customers, firmsInManager, portalLinks } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/api-guard";
import { getAppAdminEmail } from "@/lib/app-portal/auth-session";
import { logAudit } from "@/lib/app-portal/audit-log";

export const runtime = "nodejs";

// Admin review queue for firm <-> customer-portal associations.
// GET  -> pending and approved links, newest first.
// POST -> { id, action: "approve" | "revoke" }
//
// Approving grants a manager firm read access to that customer's secure-portal
// documents, so it is deliberately a human decision recorded with an actor.

export async function GET(req: Request) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  try {
    const rows = await db
      .select({
        id: portalLinks.id,
        status: portalLinks.status,
        suggestedBy: portalLinks.suggestedBy,
        approvedBy: portalLinks.approvedBy,
        approvedAt: portalLinks.approvedAt,
        createdAt: portalLinks.createdAt,
        firmName: firmsInManager.name,
        firmSlug: firmsInManager.slug,
        customerName: customers.name,
        customerEmail: customers.email,
        customerFund: customers.fundName,
        customerStatus: customers.status,
      })
      .from(portalLinks)
      .innerJoin(firmsInManager, eq(firmsInManager.id, portalLinks.firmId))
      .innerJoin(customers, eq(customers.id, portalLinks.customerId))
      .orderBy(desc(portalLinks.createdAt));

    return NextResponse.json({ links: rows });
  } catch (err) {
    console.error("[portal-links] list error:", err);
    return NextResponse.json({ error: "Could not load portal links." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const actor = await getAppAdminEmail(req);
  let id = "";
  let action = "";
  try {
    const body = (await req.json()) as { id?: string; action?: string };
    id = (body.id ?? "").trim();
    action = (body.action ?? "").trim();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (!id || (action !== "approve" && action !== "revoke")) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  try {
    const [link] = await db
      .select({ id: portalLinks.id, customerId: portalLinks.customerId })
      .from(portalLinks)
      .where(eq(portalLinks.id, id))
      .limit(1);
    if (!link) return NextResponse.json({ error: "Not found." }, { status: 404 });

    if (action === "approve") {
      // A customer's portal may be approved to only one firm at a time; the
      // partial unique index enforces it, so report the conflict clearly.
      const [conflict] = await db
        .select({ id: portalLinks.id })
        .from(portalLinks)
        .where(and(eq(portalLinks.customerId, link.customerId), eq(portalLinks.status, "approved")))
        .limit(1);
      if (conflict && conflict.id !== link.id) {
        return NextResponse.json(
          { error: "That customer's portal is already approved to another firm. Revoke it first." },
          { status: 409 },
        );
      }

      await db
        .update(portalLinks)
        .set({ status: "approved", approvedBy: actor ?? "unknown", approvedAt: new Date().toISOString() })
        .where(eq(portalLinks.id, id));
    } else {
      await db
        .update(portalLinks)
        .set({ status: "revoked", revokedBy: actor ?? "unknown", revokedAt: new Date().toISOString() })
        .where(eq(portalLinks.id, id));
    }

    await logAudit({ actor: actor ?? "unknown", action: `portal_link.${action}`, target: id });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[portal-links] update error:", err);
    return NextResponse.json({ error: "Could not update the link." }, { status: 500 });
  }
}
