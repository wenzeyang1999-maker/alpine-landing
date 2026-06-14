# Legacy Supabase artifacts (archived)

These files are from the pre-Azure era, when the app ran on Supabase. They are
**no longer the source of truth and are not used by the build or runtime** — kept
only for historical reference. Safe to delete once the Azure cutover is fully
complete and Hetzner is decommissioned.

The app now uses **Drizzle** against Azure Postgres. The live schema is defined in
`lib/db/schema.ts` (generated via `drizzle-kit pull` from the live DB), and future
migrations are managed by drizzle-kit (`lib/db/meta/`).

## Contents

- `supabase-migrations/` — the original 37 hand-written SQL migrations (was
  `supabase/migrations/`). Note these were **incomplete**: a few tables
  (`public.manager_responses`, `public.manager_uploads`) were created by hand in
  the Supabase dashboard and never written to a migration file. The authoritative
  schema was therefore captured by dumping the live DB, not by replaying these.
- `standalone-migrations/` — 4 standalone SQL migrations (was top-level
  `migrations/`): early_access_requests, customers, app_admins, audit_log.
- `scripts/` — Supabase-era helper scripts that imported `@supabase/supabase-js`
  (now uninstalled, so these no longer run): storage migration, seeders, uploaders.
  Superseded by `scripts/migrate-storage-files.mjs` (Azure Blob) and the Drizzle
  data layer.

## If you need to recreate the schema

Don't use these files. The current schema lives in `lib/db/schema.ts`. To rebuild
an empty DB, use `drizzle-kit` against `lib/db/`, or restore from a `pg_dump` of
the live Azure database.
