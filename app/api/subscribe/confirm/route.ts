import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { supabase } from "@/lib/supabase";

const resend = new Resend(process.env.RESEND_API_KEY);
const RESEND_AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;

const TOKEN_TTL_DAYS = 7;
const TOKEN_TTL_MS = TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000;

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
      .select("email, confirm_token_sent_at")
      .eq("confirm_token", token)
      .maybeSingle();

    if (error) {
      console.error("Subscribe confirm lookup error:", error);
      return redirectTo(req, "/subscribe/confirmed?error=invalid");
    }

    if (!row) {
      return redirectTo(req, "/subscribe/confirmed?error=invalid");
    }

    // Check token age (≤ 7 days)
    const sentAt = row.confirm_token_sent_at
      ? new Date(row.confirm_token_sent_at).getTime()
      : 0;
    if (!sentAt || Date.now() - sentAt > TOKEN_TTL_MS) {
      return redirectTo(req, "/subscribe/confirmed?error=invalid");
    }

    // Confirm: set confirmed_at, clear token (one-time use), clear unsubscribed_at.
    const { error: upErr } = await supabase
      .from("newsletter_subscribers")
      .update({
        confirmed_at: new Date().toISOString(),
        confirm_token: null,
        unsubscribed_at: null,
      })
      .eq("email", row.email);

    if (upErr) {
      console.error("Subscribe confirm update error:", upErr);
      return redirectTo(req, "/subscribe/confirmed?error=invalid");
    }

    // Best-effort Resend Audience sync.
    if (RESEND_AUDIENCE_ID) {
      try {
        const { data, error: rErr } = await resend.contacts.create({
          email: row.email,
          unsubscribed: false,
          audienceId: RESEND_AUDIENCE_ID,
        });
        if (rErr) {
          console.error("Subscribe confirm Resend sync error:", rErr);
        } else if (data?.id) {
          await supabase
            .from("newsletter_subscribers")
            .update({
              resend_contact_id: data.id,
              resend_synced_at: new Date().toISOString(),
            })
            .eq("email", row.email);
        }
      } catch (e) {
        console.error("Subscribe confirm Resend sync exception:", e);
      }
    }

    return redirectTo(req, "/subscribe/confirmed");
  } catch (err) {
    console.error("Subscribe confirm handler error:", err);
    return redirectTo(req, "/subscribe/confirmed?error=invalid");
  }
}
