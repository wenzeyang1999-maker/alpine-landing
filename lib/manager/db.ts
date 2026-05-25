/**
 * Supabase client scoped to the `manager` schema.
 * Node runtime ONLY — uses service_role key.
 * Never import from middleware or Edge routes.
 *
 * No generated types: results are cast to explicit interfaces in callers.
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let _base: SupabaseClient | null = null;

function base(): SupabaseClient {
  if (_base) return _base;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }
  _base = createClient(url, key, { auth: { persistSession: false } });
  return _base;
}

/**
 * Returns a query builder scoped to the `manager` Postgres schema.
 * Cast to `SupabaseClient` so callers can use `.from()` etc without fighting
 * the generic type system (we don't have generated types for this schema).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function managerDb(): any {
  return (base() as unknown as { schema: (s: string) => unknown }).schema("manager");
}
