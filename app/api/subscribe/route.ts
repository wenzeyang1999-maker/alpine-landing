import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { supabase } from "@/lib/supabase";

const resend = new Resend(process.env.RESEND_API_KEY);
const RESEND_AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;

// Basic email shape check — server-side validation, not a deliverability promise.
function isValidEmail(email: string): boolean {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  try {
    const { email, source } = await req.json();

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ detail: "A valid email is required." }, { status: 400 });
    }

    const normalized = email.toLowerCase().trim();
    const subSource = typeof source === "string" && source.length < 32 ? source : "landing";

    // 1) Source of truth: Supabase. Idempotent — re-subscribe just bumps source.
    const { error: upsertErr } = await supabase
      .from("newsletter_subscribers")
      .upsert(
        { email: normalized, source: subSource, unsubscribed_at: null },
        { onConflict: "email" }
      );

    if (upsertErr) {
      console.error("Subscribe Supabase error:", upsertErr);
      return NextResponse.json({ detail: "Could not save subscription." }, { status: 500 });
    }

    // 2) Best-effort sync to Resend Audience. Never block on this.
    if (RESEND_AUDIENCE_ID) {
      try {
        const { data, error } = await resend.contacts.create({
          email: normalized,
          unsubscribed: false,
          audienceId: RESEND_AUDIENCE_ID,
        });
        if (error) {
          console.error("Resend sync error:", error);
        } else if (data?.id) {
          await supabase
            .from("newsletter_subscribers")
            .update({ resend_contact_id: data.id, resend_synced_at: new Date().toISOString() })
            .eq("email", normalized);
        }
      } catch (e) {
        console.error("Resend sync exception:", e);
      }
    }

    return NextResponse.json({ status: "ok", message: "You're on the list." });
  } catch (err) {
    console.error("Subscribe handler error:", err);
    return NextResponse.json({ detail: "Something went wrong. Please try again." }, { status: 500 });
  }
}
