import { supabase } from "@/lib/app-portal/supabase";

/**
 * Best-effort audit logger — failures never block the calling route.
 *
 * Standard action names (free-form but try to stay in this vocabulary):
 *   auth.login, auth.logout, auth.login_blocked
 *   admin.add, admin.remove
 *   onboard.create
 *   broadcast.send, broadcast.dedupe
 *   request.status
 *   subscriber.confirm, subscriber.unsubscribe
 */
export async function logAudit(params: {
  actor: string;
  action: string;
  target?: string;
  meta?: Record<string, unknown>;
}): Promise<void> {
  try {
    await supabase.from("audit_log").insert({
      actor_email: params.actor,
      action: params.action,
      target: params.target ?? null,
      meta: params.meta ?? null,
    });
  } catch (err) {
    // Audit logging is observability, not a hard dependency. Swallow.
    console.warn("[audit-log] insert failed (non-blocking):", err);
  }
}
