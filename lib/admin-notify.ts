import { Resend } from "resend";
import { supabase } from "@/lib/supabase";

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = "azhang@alpinedd.com";
const FROM_EMAIL = "Alpine Due Diligence <notifications@alpinedd.com>";

interface NotifyPayload {
  event: "signup" | "subscribe";
  email: string;
  name?: string;
  organization?: string;
  source?: string;
}

async function fetchLists() {
  const [subRes, userRes] = await Promise.all([
    supabase
      .from("newsletter_subscribers")
      .select("email, source, confirmed_at, created_at")
      .is("unsubscribed_at", null)
      .order("created_at", { ascending: false }),
    supabase
      .from("users")
      .select("email, full_name, organization, created_at")
      .order("created_at", { ascending: false }),
  ]);
  return {
    subscribers: subRes.data ?? [],
    users: userRes.data ?? [],
  };
}

function fmt(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

function tableRows<T extends Record<string, unknown>>(
  rows: T[],
  cols: { label: string; key: keyof T }[]
): string {
  if (rows.length === 0) return `<tr><td colspan="${cols.length}" style="padding:10px 14px;color:#94a3b8;font-size:13px;">None yet</td></tr>`;
  return rows.map((row, i) =>
    `<tr${i % 2 === 0 ? "" : ' style="background:#f8f7f4;"'}>
      ${cols.map(({ key }) => `<td style="padding:8px 14px;font-size:13px;color:#1a1a2e;border-bottom:1px solid #f1f5f9;">${(row[key] as string) ?? "—"}</td>`).join("")}
    </tr>`
  ).join("");
}

type Lists = Awaited<ReturnType<typeof fetchLists>>;

function buildHtml(payload: NotifyPayload, subscribers: Lists["subscribers"], users: Lists["users"]): string {
  const isSignup = payload.event === "signup";
  const eventLabel = isSignup ? "New Account Signup" : "New Newsletter Subscriber";
  const timestamp = new Date().toLocaleString("en-US", {
    timeZone: "America/Toronto", dateStyle: "medium", timeStyle: "short",
  });

  const detailRows = [
    { label: "Event",   value: eventLabel },
    { label: "Email",   value: `<a href="mailto:${payload.email}" style="color:#7c3aed;text-decoration:none;">${payload.email}</a>` },
    ...(payload.name         ? [{ label: "Name",         value: payload.name }]         : []),
    ...(payload.organization ? [{ label: "Organization", value: payload.organization }] : []),
    ...(payload.source       ? [{ label: "Source",       value: payload.source }]       : []),
    { label: "Time", value: timestamp },
  ];

  const detailTable = detailRows.map(({ label, value }, i) =>
    `<tr${i % 2 === 0 ? "" : ' style="background:#f8f7f4;"'}>
      <td style="padding:9px 14px;font-weight:600;color:#64748b;font-size:13px;white-space:nowrap;width:130px;">${label}</td>
      <td style="padding:9px 14px;font-size:13px;color:#1a1a2e;">${value}</td>
    </tr>`
  ).join("");

  const subRows = tableRows(
    subscribers.map(s => ({
      email: s.email,
      source: s.source,
      confirmed: s.confirmed_at ? "✓ Confirmed" : "Pending",
      joined: fmt(s.created_at),
    })),
    [
      { label: "Email",     key: "email" },
      { label: "Source",    key: "source" },
      { label: "Status",    key: "confirmed" },
      { label: "Joined",    key: "joined" },
    ]
  );

  const userRows = tableRows(
    users.map(u => ({
      name:  u.full_name ?? "—",
      email: u.email,
      org:   u.organization ?? "—",
      joined: fmt(u.created_at),
    })),
    [
      { label: "Name",   key: "name" },
      { label: "Email",  key: "email" },
      { label: "Org",    key: "org" },
      { label: "Joined", key: "joined" },
    ]
  );

  const thStyle = `style="padding:8px 14px;font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.06em;text-align:left;background:#f8f7f4;border-bottom:2px solid #e2e8f0;"`;

  return `
<div style="background:#f1f0eb;padding:32px 0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <div style="max-width:640px;margin:0 auto;">

    <!-- Header -->
    <div style="background:#1a1a2e;padding:20px 28px;border-radius:12px 12px 0 0;">
      <table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
        <tr>
          <td style="vertical-align:middle;padding-right:14px;">
            <img src="https://alpinedd.com/logo.png" alt="Alpine" style="height:36px;width:auto;display:block;" />
          </td>
          <td style="vertical-align:middle;">
            <div style="font-size:15px;font-weight:700;color:#f5f0e8;">Alpine Due Diligence</div>
            <div style="font-size:10px;color:#f5f0e8;opacity:0.5;letter-spacing:0.1em;text-transform:uppercase;margin-top:2px;">Admin Notification</div>
          </td>
        </tr>
      </table>
    </div>

    <!-- Body -->
    <div style="background:#fff;padding:28px 32px;">
      <h2 style="margin:0 0 4px;font-size:20px;font-weight:700;color:#0f172a;">${eventLabel}</h2>
      <p style="margin:0 0 20px;font-size:13px;color:#64748b;">${timestamp}</p>

      <!-- Event detail -->
      <div style="border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;margin-bottom:28px;">
        <table style="border-collapse:collapse;width:100%;">${detailTable}</table>
      </div>

      <!-- Subscriber list -->
      <h3 style="margin:0 0 10px;font-size:14px;font-weight:700;color:#0f172a;">
        Newsletter Subscribers
        <span style="font-weight:400;color:#64748b;font-size:13px;margin-left:6px;">(${subscribers.length} total)</span>
      </h3>
      <div style="border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;margin-bottom:24px;">
        <table style="border-collapse:collapse;width:100%;">
          <thead><tr>
            <th ${thStyle}>Email</th>
            <th ${thStyle}>Source</th>
            <th ${thStyle}>Status</th>
            <th ${thStyle}>Joined</th>
          </tr></thead>
          <tbody>${subRows}</tbody>
        </table>
      </div>

      <!-- Registered users -->
      <h3 style="margin:0 0 10px;font-size:14px;font-weight:700;color:#0f172a;">
        Registered Users
        <span style="font-weight:400;color:#64748b;font-size:13px;margin-left:6px;">(${users.length} total)</span>
      </h3>
      <div style="border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;">
        <table style="border-collapse:collapse;width:100%;">
          <thead><tr>
            <th ${thStyle}>Name</th>
            <th ${thStyle}>Email</th>
            <th ${thStyle}>Org</th>
            <th ${thStyle}>Joined</th>
          </tr></thead>
          <tbody>${userRows}</tbody>
        </table>
      </div>
    </div>

    <!-- Footer -->
    <div style="background:#f8f7f4;padding:16px 32px;border-radius:0 0 12px 12px;border-top:1px solid #e8e6e1;font-size:11px;color:#94a3b8;text-align:center;">
      Alpine Due Diligence Inc. · <a href="https://alpinedd.com" style="color:#7c3aed;text-decoration:none;">alpinedd.com</a>
    </div>

  </div>
</div>`;
}

export async function notifyAdminNewMember(payload: NotifyPayload): Promise<void> {
  try {
    const { subscribers, users } = await fetchLists();
    const subject = payload.event === "signup"
      ? `New Signup — ${payload.name ?? payload.email}${payload.organization ? `, ${payload.organization}` : ""}`
      : `New Subscriber — ${payload.email}`;

    await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject,
      html: buildHtml(payload, subscribers, users),
    });
  } catch (err) {
    console.error("[admin-notify] failed:", err);
  }
}
