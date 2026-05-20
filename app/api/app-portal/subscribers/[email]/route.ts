import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/app-portal/supabase";
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
    if (action === "confirm")    { update.confirmed_at = now; update.unsubscribed_at = null; }
    if (action === "unsubscribe"){ update.unsubscribed_at = now; }
    if (action === "reactivate") { update.unsubscribed_at = null; }

    const { error } = await supabase
      .from("newsletter_subscribers")
      .update(update)
      .eq("email", subscriberEmail);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

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
