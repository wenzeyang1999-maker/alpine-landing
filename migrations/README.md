# Migrations

Run these in order from the Supabase SQL editor. They are idempotent — safe to re-run if you're not sure whether they were applied.

| # | File | Adds |
|---|---|---|
| 001 | `001_early_access_requests.sql` | `early_access_requests` table — persists `/early-access` form submissions for the admin Requests view. |
| 002 | `002_customers.sql` | `customers` table — first-class record of every onboarded customer/fund, with plan/status fields and an `updated_at` trigger. |
| 003 | `003_app_admins.sql` | `app_admins` table — DB-tracked admin allowlist + seed of the 3 founding admins. |

## How to run

1. Open the Supabase project dashboard
2. SQL Editor → **New query**
3. Paste the file's contents → **Run**
4. Repeat for each file in order

All tables enable RLS with **no policies**, so only requests using the `service_role` key (server-side code, never the browser) can read/write them.

## What the app does once these exist

| Code path | Behavior |
|---|---|
| `/api/early-access` + `/api/form/early-access` | After running 001, both routes will also INSERT a row into `early_access_requests`. If the table doesn't exist, the INSERT silently fails and emails still go out — non-blocking. |
| `/api/app-portal/onboard` | After running 002, will also INSERT a `customers` row when an admin onboards a customer. |
| `/admin` page | After 001/002/003, three new sections appear: Requests, Customers, Admins. |
| `middleware.ts` allowlist | **Unchanged** — still uses the hardcoded set in code. The DB table is for tracking and UI, not runtime enforcement. To add a real admin, run an INSERT here AND update the hardcoded list in `middleware.ts` + `lib/auth-session.ts` + `lib/app-portal/auth-session.ts`. |

## Rollback

```sql
drop table if exists public.early_access_requests cascade;
drop table if exists public.customers cascade;
drop function if exists public.customers_set_updated_at cascade;
drop table if exists public.app_admins cascade;
```
