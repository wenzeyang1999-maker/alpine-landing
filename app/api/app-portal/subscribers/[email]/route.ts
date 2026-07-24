import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { newsletterSubscribers } from "@/lib/db/schema";
import { getAppAdminEmail } from "@/lib/app-portal/auth-session";
import { logAudit } from "@/lib/app-portal/audit-log";
import { newToken, buildConfirmUrl, sendConfirmEmail } from "@/lib/newsletter-confirm";

const ALLOWED_ACTIONS = new Set(["confirm", "unsubscribe", "reactivate", "resend_confirmation"]);

export async function PATCH(req: NextRequest, { params }: { params: { email: string } }) {
  const adminEmail = await getAppAdminEmail(req);
  if (!adminEmail) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  try {
    const subscriberEmail = decodeURIComponent(params.email).trim().toLowerCase();
    const { action } = (await req.json()) as { action?: string };

    if (!action || !ALLOWED_ACTIONS.has(action)) {
      return NextResponse.json(
        { error: "Invalid action. Allowed: confirm, unsubscribe, reactivate, resend_confirmation." },
        { status: 400 },
      );
    }

    // Resend the double-opt-in confirmation email to a still-pending subscriber.
    if (action === "resend_confirmation") {
      const [sub] = await db
        .select({
          email: newsletterSubscribers.email,
          fullName: newsletterSubscribers.fullName,
          confirmToken: newsletterSubscribers.confirmToken,
          confirmedAt: newsletterSubscribers.confirmedAt,
          unsubscribedAt: newsletterSubscribers.unsubscribedAt,
        })
        .from(newsletterSubscribers)
        .where(eq(newsletterSubscribers.email, subscriberEmail))
        .limit(1);

      if (!sub) return NextResponse.json({ error: "Subscriber not found." }, { status: 404 });
      if (sub.confirmedAt) return NextResponse.json({ error: "Already confirmed." }, { status: 400 });
      if (sub.unsubscribedAt) return NextResponse.json({ error: "Unsubscribed; reactivate first." }, { status: 400 });

      // Reuse the existing token if present, else mint a fresh one, and reset the clock.
      const token = sub.confirmToken ?? newToken();
      await db
        .update(newsletterSubscribers)
        .set({ confirmToken: token, confirmTokenSentAt: new Date().toISOString() })
        .where(eq(newsletterSubscribers.email, subscriberEmail));

      const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? "alpinedd.com";
      const proto = req.headers.get("x-forwarded-proto") ?? "https";
      await sendConfirmEmail(subscriberEmail, buildConfirmUrl(`${proto}://${host}`, token), sub.fullName);

      await logAudit({ actor: adminEmail, action: "subscriber.resend_confirmation", target: subscriberEmail });
      return NextResponse.json({ ok: true, resent: true });
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
