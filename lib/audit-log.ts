import { supabase } from "@/lib/supabase";

/**
 * Best-effort audit logger — failures never block the calling route.
 * Mirror of lib/app-portal/audit-log.ts; same audit_log table.
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
    console.warn("[audit-log] insert failed (non-blocking):", err);
  }
}
