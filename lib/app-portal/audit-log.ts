import { sql } from "drizzle-orm";
import { db } from "@/lib/db";

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
    await db.execute(sql`
      INSERT INTO audit_log (actor_email, action, target, meta)
      VALUES (${params.actor}, ${params.action}, ${params.target ?? null},
              ${params.meta ? JSON.stringify(params.meta) : null}::jsonb)
    `);
  } catch (err) {
    // Audit logging is observability, not a hard dependency. Swallow.
    console.warn("[audit-log] insert failed (non-blocking):", err);
  }
}
