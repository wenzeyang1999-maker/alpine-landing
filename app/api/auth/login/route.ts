import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const DEMO_EMAIL = "demo@alpinedd.com";
const DEMO_PASSWORD = "demo123";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    // Demo shortcut — always gets demo access
    if (email.trim().toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD) {
      return NextResponse.json({
        user: { email: DEMO_EMAIL, full_name: "Demo User", role: "analyst" },
        demo_access: true,
      });
    }

    // Verify credentials against Supabase Auth
    const authRes = await fetch(`${process.env.SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
      },
      body: JSON.stringify({ email, password }),
    });

    if (!authRes.ok) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    // Enrich with users table data — include demo_access flag
    const { data: row } = await supabase
      .from("users")
      .select("full_name, role, demo_access")
      .eq("email", email.trim().toLowerCase())
      .single();

    return NextResponse.json({
      user: {
        email: email.trim().toLowerCase(),
        full_name: row?.full_name ?? email,
        role: row?.role ?? "analyst",
      },
      demo_access: row?.demo_access ?? false,
    });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
