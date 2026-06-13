import { sql } from "drizzle-orm";
import { db } from "@/lib/db";

/**
 * Best-effort audit logger — failures never block the calling route.
 * Mirror of lib/app-portal/audit-log.ts; same public.audit_log table.
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
    console.warn("[audit-log] insert failed (non-blocking):", err);
  }
}
