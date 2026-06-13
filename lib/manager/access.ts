import { cookies } from "next/headers";
import { sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { verifySession, MANAGER_SESSION } from "./auth-session";

export interface ManagerUser {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  is_verified: boolean;
  job_title: string | null;
  firm_id: string;
  firm_name: string | null;
}

type SessionRow = {
  id: string;
  email: string;
  password_hash: string | null;
  is_verified: boolean;
  firm_id: string;
  full_name: string | null;
  role: string;
  job_title: string | null;
  firm_name: string | null;
};

export async function getCurrentManager(): Promise<ManagerUser | null> {
  const jar = await cookies();
  const token = jar.get(MANAGER_SESSION.COOKIE_NAME)?.value;
  const email = await verifySession(token);
  if (!email) return null;

  let rows: SessionRow[];
  try {
    rows = (await db.execute(
      sql`SELECT * FROM get_manager_session(${email})`
    )) as unknown as SessionRow[];
  } catch {
    return null;
  }
  if (!rows || rows.length === 0) return null;

  const row = rows[0];
  if (!row) return null;

  return {
    id: row.id,
    email: row.email,
    full_name: row.full_name ?? null,
    role: row.role ?? "member",
    is_verified: row.is_verified ?? false,
    job_title: row.job_title ?? null,
    firm_id: row.firm_id,
    firm_name: row.firm_name ?? null,
  };
}

export async function requireManager(): Promise<ManagerUser> {
  const user = await getCurrentManager();
  if (!user) throw new Response("Unauthorized", { status: 401 });
  return user;
}
