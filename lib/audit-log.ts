import { sql } from "drizzle-orm";
import { db } from "@/lib/db";

/**
 * Best-effort audit logger — failures never block the calling route.
 * Mirror of lib/app-portal/audit-log.ts; same audit_log table.
 *
 * NOTE: the audit_log table is not part of the migrated schema (it was never
 * created in the source DB), so these inserts no-op via the catch below until
 * the table exists. Raw SQL keeps the table out of the Drizzle schema.
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
