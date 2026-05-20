/**
 * Single source of truth for the Alpine-branded email wrapper (app-portal fork).
 * Mirrors lib/email-template.ts so each isolated module can evolve independently.
 */

export interface WrapOptions {
  footer?: string;
  brandSubtitle?: string;
}

const DEFAULT_FOOTER = `
  <p style="margin:0;font-size:12px;color:#64748B;text-align:center;">
    Alpine Due Diligence Inc. &middot;
    <a href="https://alpinedd.com" style="color:#7B2CBF;text-decoration:none;">alpinedd.com</a>
  </p>
  <p style="margin:6px 0 0 0;font-size:11px;color:#94a3b8;text-align:center;">
    Your data is encrypted and never used for AI training.
  </p>
`;

export function wrapEmail(body: string, opts: WrapOptions = {}): string {
  const subtitle = opts.brandSubtitle ?? "Due Diligence";
  const footer = opts.footer ?? DEFAULT_FOOTER;
  return `
  <div style="background-color:#f1f0eb;padding:32px 0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
    <div style="max-width:560px;margin:0 auto;">
      <div style="background-color:#ffffff;padding:24px 32px;border-radius:12px 12px 0 0;text-align:center;border-bottom:1px solid #e8e6e1;">
        <table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;margin:0 auto;">
          <tr>
            <td style="vertical-align:middle;padding-right:12px;">
              <img src="https://alpinedd.com/logo.png" alt="Alpine" style="height:36px;width:auto;display:block;" />
            </td>
            <td style="vertical-align:middle;text-align:left;">
              <div style="font-size:17px;font-weight:700;color:#1a1a2e;letter-spacing:-0.02em;line-height:1.1;">ALPINE</div>
              <div style="font-size:9px;font-weight:600;color:#64748B;letter-spacing:0.12em;text-transform:uppercase;">${subtitle}</div>
            </td>
          </tr>
        </table>
      </div>
      <div style="background-color:#ffffff;padding:36px 32px 32px 32px;">
        ${body}
      </div>
      <div style="background-color:#f8f7f4;padding:20px 32px;border-radius:0 0 12px 12px;border-top:1px solid #e8e6e1;">
        ${footer}
      </div>
    </div>
  </div>`;
}

export function escapeBody(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br/>");
}
