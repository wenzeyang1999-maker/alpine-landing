import { NextResponse } from "next/server";
import { getCurrentManager } from "@/lib/manager/access";

export async function GET() {
  const user = await getCurrentManager();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({
    id: user.id,
    email: user.email,
    full_name: user.full_name,
    role: user.role,
    is_verified: user.is_verified,
    firm_id: user.firm_id,
    firm_name: user.firm_name,
  });
}
