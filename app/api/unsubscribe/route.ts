import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { supabase } from "@/lib/supabase";

const resend = new Resend(process.env.RESEND_API_KEY);
const RESEND_AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;

function redirectTo(req: NextRequest, path: string): NextResponse {
  const host =
    req.headers.get("x-forwarded-host") ??
    req.headers.get("host") ??
    "alpinedd.com";
  const proto = req.headers.get("x-forwarded-proto") ?? "https";
  return NextResponse.redirect(`${proto}://${host}${path}`, { status: 302 });
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token") ?? "";

  if (!token) {
    return redirectTo(req, "/subscribe/confirmed?error=invalid");
  }

  try {
    const { data: row, error } = await supabase
      .from("newsletter_subscribers")
      .select("email, resend_contact_id")
      .eq("unsubscribe_token", token)
      .maybeSingle();

    if (error) {
      console.error("Unsubscribe lookup error:", error);
      return redirectTo(req, "/subscribe/confirmed?error=invalid");
    }

    if (!row) {
      return redirectTo(req, "/subscribe/confirmed?error=invalid");
    }

    const { error: upErr } = await supabase
      .from("newsletter_subscribers")
      .update({ unsubscribed_at: new Date().toISOString() })
      .eq("email", row.email);

    if (upErr) {
      console.error("Unsubscribe update error:", upErr);
      return redirectTo(req, "/subscribe/confirmed?error=invalid");
    }

    // Best-effort: mark unsubscribed in Resend Audience.
    if (RESEND_AUDIENCE_ID) {
      try {
        const { error: rErr } = await resend.contacts.update({
          email: row.email,
          unsubscribed: true,
          audienceId: RESEND_AUDIENCE_ID,
        });
        if (rErr) {
          console.error("Unsubscribe Resend sync error:", rErr);
        }
      } catch (e) {
        console.error("Unsubscribe Resend sync exception:", e);
      }
    }

    return redirectTo(req, "/subscribe/confirmed?unsubscribed=1");
  } catch (err) {
    console.error("Unsubscribe handler error:", err);
    return redirectTo(req, "/subscribe/confirmed?error=invalid");
  }
}
