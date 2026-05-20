import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Server-only client — uses service_role key, never exposed to the browser.
// Lazy-init via Proxy so a missing env var at module load does NOT crash every
// route that imports this file. The error surfaces at first actual use, where
// it can be caught by route-level try/catch (e.g. non-blocking persistence).

let _client: SupabaseClient | null = null;

function init(): SupabaseClient {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment");
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    if (!_client) _client = init();
    return (_client as unknown as Record<string | symbol, unknown>)[prop];
  },
});
