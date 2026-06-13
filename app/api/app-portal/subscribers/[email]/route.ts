import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { newsletterSubscribers } from "@/lib/db/schema";
import { getAppAdminEmail } from "@/lib/app-portal/auth-session";
import { logAudit } from "@/lib/app-portal/audit-log";

const ALLOWED_ACTIONS = new Set(["confirm", "unsubscribe", "reactivate"]);

export async function PATCH(req: NextRequest, { params }: { params: { email: string } }) {
  const adminEmail = await getAppAdminEmail(req);
  if (!adminEmail) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  try {
    const subscriberEmail = decodeURIComponent(params.email).trim().toLowerCase();
    const { action } = (await req.json()) as { action?: string };

    if (!action || !ALLOWED_ACTIONS.has(action)) {
      return NextResponse.json(
        { error: "Invalid action. Allowed: confirm, unsubscribe, reactivate." },
        { status: 400 },
      );
    }

    const now = new Date().toISOString();
    const update: Record<string, unknown> = {};
    if (action === "confirm")    { update.confirmedAt = now; update.unsubscribedAt = null; }
    if (action === "unsubscribe"){ update.unsubscribedAt = now; }
    if (action === "reactivate") { update.unsubscribedAt = null; }

    await db.update(newsletterSubscribers).set(update).where(eq(newsletterSubscribers.email, subscriberEmail));

    await logAudit({
      actor: adminEmail,
      action: `subscriber.${action}`,
      target: subscriberEmail,
    });

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update subscriber";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
