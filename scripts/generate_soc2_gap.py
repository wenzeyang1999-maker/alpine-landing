#!/usr/bin/env python3
"""Generate Alpine SOC 2 Gap Analysis PDF"""

from fpdf import FPDF
from fpdf.enums import XPos, YPos
import os

OUT_PATH = os.path.join(os.path.dirname(__file__), "..", "public", "alpine_soc2_gap_analysis.pdf")

VIOLET = (123, 44, 191)
INK    = (26, 26, 46)
LIGHT  = (248, 247, 244)
BORDER = (220, 218, 212)
MUTED  = (100, 100, 120)
WHITE  = (255, 255, 255)
GREEN_FG = (20, 120, 60)
RED_FG   = (180, 30, 30)
AMBER_FG = (160, 100, 0)

class PDF(FPDF):
    def __init__(self):
        super().__init__()
        self.set_margins(22, 22, 22)
        self.set_auto_page_break(auto=True, margin=22)

    def header(self):
        if self.page_no() == 1:
            return
        self.set_font("Helvetica", "B", 7.5)
        self.set_text_color(*MUTED)
        self.set_xy(22, 5)
        self.cell(0, 5, "ALPINE  DUE DILIGENCE", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.set_draw_color(*BORDER)
        self.set_line_width(0.3)
        self.line(22, 13, 188, 13)
        self.set_text_color(*INK)
        self.set_xy(self.l_margin, 19)

    def footer(self):
        if self.page_no() == 1:
            return
        self.set_y(-13)
        self.set_draw_color(*BORDER)
        self.line(22, self.get_y(), 188, self.get_y())
        self.set_font("Helvetica", "", 7)
        self.set_text_color(*MUTED)
        self.set_x(22)
        self.cell(0, 6,
            f"SOC 2 Gap Analysis  |  Confidential  |  Alpine Due Diligence Inc.  |  April 27, 2026   |   Page {self.page_no()}",
            new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.set_text_color(*INK)

    def section_title(self, title):
        self.ln(4)
        self.set_font("Helvetica", "B", 13)
        self.set_text_color(*VIOLET)
        self.multi_cell(0, 7, title, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.set_draw_color(*VIOLET)
        self.set_line_width(0.4)
        self.line(22, self.get_y(), 188, self.get_y())
        self.ln(3)
        self.set_text_color(*INK)

    def sub_title(self, title):
        self.ln(3)
        self.set_font("Helvetica", "B", 10)
        self.set_text_color(*INK)
        self.multi_cell(0, 6, title, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.ln(1)

    def body(self, text):
        self.set_font("Helvetica", "", 9.5)
        self.set_text_color(*INK)
        self.multi_cell(0, 5.5, text, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.ln(2)

    def note(self, text):
        self.set_font("Helvetica", "I", 9)
        self.set_text_color(*MUTED)
        self.multi_cell(0, 5.5, text, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.ln(2)
        self.set_text_color(*INK)

    def bullet(self, items):
        self.set_font("Helvetica", "", 9.5)
        self.set_text_color(*INK)
        for item in items:
            self.set_x(26)
            self.cell(5, 5.5, chr(149), new_x=XPos.RIGHT, new_y=YPos.TOP)
            self.multi_cell(0, 5.5, item, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.ln(2)

    def numbered(self, items):
        self.set_font("Helvetica", "", 9.5)
        self.set_text_color(*INK)
        for i, item in enumerate(items, 1):
            self.set_x(26)
            self.cell(6, 5.5, f"{i}.", new_x=XPos.RIGHT, new_y=YPos.TOP)
            self.multi_cell(0, 5.5, item, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.ln(2)

    def table(self, headers, rows, col_widths=None):
        if col_widths is None:
            w = 166 / len(headers)
            col_widths = [w] * len(headers)
        self.set_fill_color(*INK)
        self.set_text_color(*WHITE)
        self.set_font("Helvetica", "B", 8)
        for i, h in enumerate(headers):
            self.cell(col_widths[i], 7, h, border=1, fill=True)
        self.ln()
        self.set_text_color(*INK)
        self.set_font("Helvetica", "", 8.5)
        for ri, row in enumerate(rows):
            fill = ri % 2 == 0
            self.set_fill_color(248, 247, 244) if fill else self.set_fill_color(255, 255, 255)
            for i, cell in enumerate(row):
                self.cell(col_widths[i], 6.5, str(cell), border=1, fill=True)
            self.ln()
        self.ln(3)

    def status_row(self, label, status, detail):
        """Inline row: label | colored status | detail"""
        colors = {
            "Done":        GREEN_FG,
            "Gap":         RED_FG,
            "Partial":     AMBER_FG,
            "Planned":     MUTED,
        }
        color = colors.get(status, INK)
        self.set_font("Helvetica", "", 9.5)
        self.set_text_color(*INK)
        self.set_x(22)
        self.cell(70, 6, label)
        self.set_font("Helvetica", "B", 9.5)
        self.set_text_color(*color)
        self.cell(18, 6, status)
        self.set_font("Helvetica", "", 9)
        self.set_text_color(*MUTED)
        self.multi_cell(0, 6, detail, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.set_text_color(*INK)


# ================================================================================
# BUILD PDF
# ================================================================================
pdf = PDF()

# ── COVER PAGE ──────────────────────────────────────────────────────────────────
pdf.add_page()
pdf.set_fill_color(*INK)
pdf.rect(0, 0, 210, 297, "F")

pdf.set_y(50)
pdf.set_font("Helvetica", "B", 11)
pdf.set_text_color(150, 130, 200)
pdf.cell(0, 8, "ALPINE  DUE DILIGENCE", align="C", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
pdf.ln(6)

pdf.set_draw_color(*VIOLET)
pdf.set_line_width(0.6)
pdf.line(55, pdf.get_y(), 155, pdf.get_y())
pdf.ln(8)

pdf.set_font("Helvetica", "B", 22)
pdf.set_text_color(*WHITE)
pdf.cell(0, 11, "SOC 2 Gap Analysis", align="C", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
pdf.set_font("Helvetica", "", 11)
pdf.set_text_color(180, 160, 220)
pdf.cell(0, 7, "Distance to SOC 2 Type I & Type II", align="C", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
pdf.ln(20)

fields = [
    ("ORGANIZATION",   "Alpine Due Diligence Inc."),
    ("PREPARED BY",    "Allen Zhang, Founder & CEO"),
    ("DATE",           "April 27, 2026"),
    ("BASED ON",       "Compliance Policy Manual v2.0 + Codebase Review"),
    ("TYPE I TARGET",  "Q3 2026"),
    ("TYPE II TARGET", "Q1 2027"),
    ("CLASSIFICATION", "Confidential"),
]
pdf.set_font("Helvetica", "", 9)
for label, value in fields:
    pdf.set_x(38)
    pdf.set_text_color(150, 130, 190)
    pdf.cell(52, 7, label)
    pdf.set_text_color(*WHITE)
    pdf.cell(0, 7, value, new_x=XPos.LMARGIN, new_y=YPos.NEXT)

pdf.set_y(272)
pdf.set_font("Helvetica", "", 7)
pdf.set_text_color(100, 90, 130)
pdf.cell(0, 5, "CONFIDENTIAL  |  ALPINE DUE DILIGENCE INC.  |  alpinedd.com", align="C",
         new_x=XPos.LMARGIN, new_y=YPos.NEXT)

# ── PAGE 2: OVERVIEW ────────────────────────────────────────────────────────────
pdf.add_page()
pdf.ln(4)
pdf.section_title("Overview")
pdf.body(
    "This document assesses Alpine Due Diligence Inc.'s current position relative to SOC 2 "
    "certification. It compares what is described in the Compliance Policy Manual v2.0 against "
    "the actual state of the product codebase and infrastructure, identifying gaps that must be "
    "closed before a SOC 2 audit can succeed.\n\n"
    "SOC 2 is structured around five Trust Services Criteria (TSC). The two most relevant to "
    "Alpine's current stage are Security (CC6-CC9) and Availability (A1). The audit has two stages:"
)
pdf.table(
    ["Stage", "Definition", "Alpine Target"],
    [
        ["Type I",  "Point-in-time: are controls suitably designed?",          "Q3 2026"],
        ["Type II", "6-12 month observation: are controls operating effectively?", "Q1 2027"],
    ],
    col_widths=[22, 108, 36]
)
pdf.note(
    "Type I requires that policies exist AND that the technical controls described in those "
    "policies are actually implemented. Type II additionally requires continuous evidence that "
    "those controls operated without exception over the observation window."
)

pdf.section_title("Summary Scorecard")
pdf.body("Current control status across the five Trust Services Criteria relevant to Alpine:")
pdf.table(
    ["Criteria", "Area", "Policy", "Code", "Status"],
    [
        ["CC1-CC3", "Control Environment & Risk Assessment", "Done", "N/A",     "Ready"],
        ["CC6",     "Logical Access Controls",               "Done", "Gap",     "Blocker"],
        ["CC7",     "System Operations & Audit Logging",     "Done", "Gap",     "Blocker"],
        ["CC8",     "Change Management",                     "Done", "Partial", "Minor Gap"],
        ["CC9",     "Risk Mitigation / Vendor Management",   "Done", "Done",    "Ready"],
        ["A1",      "Availability / BCP",                    "Done", "Partial", "Minor Gap"],
    ],
    col_widths=[20, 72, 20, 20, 34]
)
pdf.note(
    "Blockers must be resolved before a Type I audit can be scheduled. "
    "Minor Gaps should be closed during the audit preparation period."
)

# ── PAGE 3: WHAT IS ALREADY IN PLACE ────────────────────────────────────────────
pdf.add_page()
pdf.ln(4)
pdf.section_title("1. What Is Already in Place")
pdf.body(
    "The following controls are in place at both the policy documentation level and the "
    "technical/infrastructure level. These can be evidenced to an auditor without further work."
)

pdf.sub_title("Policy Documentation (All Complete)")
pdf.bullet([
    "Privacy Policy -- published at alpinedd.com/privacy",
    "Terms of Service -- published at alpinedd.com/terms",
    "Compliance Policy Manual v2.0 -- 14 appendices covering all key control areas",
    "Incident Response Plan (Appendix G) -- severity classification, response phases, contacts",
    "Change Management Policy (Appendix H) -- Git-based workflow matches actual practice",
    "Data Classification & Handling (Appendix E) -- three-tier classification scheme",
    "Data Retention & Disposal Schedule (Appendix F) -- with defined periods per data type",
    "Vendor Management Policy (Appendix J) -- approved vendor inventory with DPA status",
    "Business Continuity Plan (Appendix K) -- RTO 8 hours, RPO 24 hours, disruption scenarios",
    "Risk Assessment Register (Appendix M) -- 11 risks with likelihood, impact, and residual rating",
    "Data Processing Agreement template (Appendix L) -- ready for client execution",
    "Policy Acknowledgment Form template (Appendix N)",
])

pdf.sub_title("Infrastructure-Level Controls (Provided by Vendors)")
pdf.bullet([
    "TLS 1.3 encryption in transit -- Cloudflare and Supabase infrastructure layer",
    "AES-256 encryption at rest -- Supabase database encryption (AWS)",
    "DDoS protection -- Cloudflare",
    "Automated daily backups -- Supabase point-in-time recovery",
    "Anthropic Zero Data Retention (ZDR) -- document text not stored after API response",
    "Vendor DPAs executed -- Anthropic, Hetzner, Supabase, Resend, Cloudflare",
    "SOC 2 certified sub-processors -- Anthropic (Type II), Cloudflare (Type II), GitHub (Type II)",
    "ISO 27001 certified hosting -- Hetzner Online GmbH (EU)",
])

pdf.sub_title("Application-Level Controls (In Code)")
pdf.bullet([
    "Supabase service_role key used server-side only, never exposed to browser",
    "Slug guard middleware blocking access to restricted review slugs",
    "API routes return structured errors and log to server console",
    "Git version control for all code changes, with documented commit history",
])

# ── PAGE 4: CC6 GAP ─────────────────────────────────────────────────────────────
pdf.add_page()
pdf.ln(4)
pdf.section_title("2. Critical Gaps -- CC6: Logical Access Controls")
pdf.body(
    "CC6 is the largest gap and the primary blocker for SOC 2 Type I. It covers authentication, "
    "authorization, session management, and access logging. The compliance policy describes "
    "a complete access control framework, but the current codebase implements a demo-only "
    "authentication stub that satisfies none of these requirements."
)

pdf.sub_title("2.1 Authentication -- Demo Stub vs. Policy Requirements")
pdf.body(
    "The current login page (app/login/page.tsx) uses a hardcoded credential pair "
    "(demo@alpinedd.com / demo123) and stores the session as a plain string in localStorage. "
    "There is no call to any authentication backend."
)
pdf.table(
    ["Control", "Policy Says", "Code Does", "Gap"],
    [
        ["Password storage",  "bcrypt hashing, never plaintext", "Hardcoded string comparison", "Critical"],
        ["Session token",     "JWT with server-side expiry",     "localStorage string, no expiry", "Critical"],
        ["Session timeout",   "Auto-timeout after inactivity",   "Never expires",               "Critical"],
        ["Real user accounts","Per-user accounts with auth",     "Single shared demo account",  "Critical"],
    ],
    col_widths=[36, 52, 52, 26]
)

pdf.sub_title("2.2 Multi-Factor Authentication")
pdf.body(
    "Policy (Appendix D, Section 5) states: 'Multi-factor authentication (MFA) is required "
    "for all administrative access.' MFA has not been implemented at any level."
)
pdf.note("Supabase Auth includes built-in TOTP MFA -- this can be enabled without a custom implementation.")

pdf.sub_title("2.3 Account Lockout")
pdf.body(
    "Policy (Appendix C) states: 'Accounts locked after 5 consecutive failed login attempts.' "
    "The current login flow returns an error message on failure but performs no lockout, "
    "rate limiting, or failed-attempt tracking."
)

pdf.sub_title("2.4 Role-Based Access Control (RBAC)")
pdf.body(
    "Policy (Appendix C, D) describes granular role-based permissions. The current application "
    "has no role system. All users of the demo account have identical, unrestricted access to "
    "all data. There is no concept of user identity, role assignment, or permission enforcement "
    "in any API route."
)

pdf.sub_title("2.5 Fix: Migrate to Supabase Auth")
pdf.body(
    "All CC6 gaps can be resolved by replacing the demo login stub with Supabase Auth, "
    "which provides bcrypt password hashing, JWT sessions, MFA (TOTP), and user management "
    "out of the box. No third-party auth vendor is required."
)
pdf.table(
    ["Action", "Effort", "Closes"],
    [
        ["Replace login/page.tsx with Supabase Auth sign-in",     "2-3 days", "Auth + JWT session"],
        ["Enable Supabase TOTP MFA for admin accounts",           "1 day",    "MFA requirement"],
        ["Add rate limiting + lockout to login API route",        "1 day",    "Account lockout"],
        ["Implement role column in users table + API middleware",  "3-5 days", "RBAC"],
    ],
    col_widths=[86, 22, 58]
)

# ── PAGE 5: CC7 GAP ─────────────────────────────────────────────────────────────
pdf.add_page()
pdf.ln(4)
pdf.section_title("3. Critical Gaps -- CC7: System Operations & Audit Logging")
pdf.body(
    "CC7 covers the monitoring and logging of system activity. The policy commits to "
    "comprehensive audit logging and automated monitoring, neither of which exists in the code."
)

pdf.sub_title("3.1 Audit Logging")
pdf.body(
    "Policy (Appendix C) states: 'Every access event is logged with timestamp, user identity, "
    "IP, and action.' Policy (Appendix E) states audit logging is required for all access to "
    "Confidential data.\n\n"
    "Current state: None of the 14 API routes write to any audit log. There is no audit_events "
    "table in Supabase. Access to client reports, ratings, notes, and uploaded documents is "
    "completely unlogged."
)
pdf.table(
    ["Required Log Event", "API Route", "Currently Logged"],
    [
        ["Read report draft",          "/api/report-draft (GET)",       "No"],
        ["Write report draft",         "/api/report-draft (PUT)",       "No"],
        ["Read/write topic rating",    "/api/topic-rating",             "No"],
        ["Read/write notes",           "/api/notes",                    "No"],
        ["Read/write flags",           "/api/flag-draft",               "No"],
        ["Upload document",            "/api/portal/upload",            "No"],
        ["Access portal documents",    "/api/portal/documents",         "No"],
        ["All other data API routes",  "8 additional routes",           "No"],
    ],
    col_widths=[58, 62, 46]
)
pdf.note("Fix: Create audit_events table in Supabase and add a logging helper called from each route.")

pdf.sub_title("3.2 Monitoring & Alerting")
pdf.body(
    "Policy (Appendix K) references automated monitoring alerts for service disruptions. "
    "Policy (Appendix G) describes detection via 'automated monitoring' as Phase 1 of incident response.\n\n"
    "Current state: No monitoring system is in place. There is no error tracking, "
    "no uptime monitoring, and no alerting. Incidents would only be discovered manually "
    "or through client reports."
)
pdf.table(
    ["Monitoring Type", "Tool (recommended)", "Cost", "Priority"],
    [
        ["Error tracking",     "Sentry",         "Free tier available", "High"],
        ["Uptime monitoring",  "BetterUptime",   "Free tier available", "High"],
        ["Log aggregation",    "Logtail / Axiom","Free tier available", "Medium"],
    ],
    col_widths=[44, 44, 50, 28]
)

pdf.sub_title("3.3 Backup Restoration Testing")
pdf.body(
    "Policy (Appendix K, Risk Assessment) requires quarterly backup restoration testing "
    "with documented results. No test has been performed or recorded."
)
pdf.note("Fix: Perform one restoration test using Supabase point-in-time recovery. Document the result in a simple log.")

# ── PAGE 6: MINOR GAPS ──────────────────────────────────────────────────────────
pdf.add_page()
pdf.ln(4)
pdf.section_title("4. Minor Gaps -- CC8, BCP, and Process Controls")
pdf.body(
    "The following gaps do not block a Type I audit but should be closed during the "
    "audit preparation period to avoid findings or qualifications."
)

pdf.sub_title("4.1 Deployment Log (CC8 -- Change Management)")
pdf.body(
    "Policy (Appendix H) requires that all deployments are logged with date, time, commit hash, "
    "and a summary of changes. Git history satisfies the commit record requirement, but there "
    "is no log that explicitly links each production deployment to a timestamp and summary.\n\n"
    "Fix: Maintain a simple deployment log (Notion page or spreadsheet) with one row per deploy. "
    "Effort: 30 minutes to set up, ongoing discipline to maintain."
)

pdf.sub_title("4.2 Policy Acknowledgment Records (Appendix N)")
pdf.body(
    "Policy requires all personnel to sign the Acknowledgment Form and return it within "
    "5 business days of system access. Annual re-acknowledgment is required on each revision.\n\n"
    "Current state: The form template exists in Appendix N but no signed copies have been "
    "collected or recorded.\n\n"
    "Fix: Founder signs the form for themselves. Collect signed PDFs from all team members "
    "and store in a secure folder. For future hires, add this to the onboarding checklist."
)

pdf.sub_title("4.3 BCP Runbook Completeness (A1 -- Availability)")
pdf.body(
    "Policy (Appendix K, Section 3.4) acknowledges founder-unavailability risk and states that "
    "'all recovery procedures are documented in this manual to enable handoff' and that "
    "'infrastructure credentials are stored in an encrypted password manager accessible to "
    "a designated backup contact.'\n\n"
    "Current state: It is unclear whether a designated backup contact has been named and given "
    "access to the password manager. This is a medium-residual risk in the risk register.\n\n"
    "Fix: Name a backup contact explicitly. Verify they can access the password manager "
    "and run through the server recovery scenario in Appendix K, Section 3.1."
)

pdf.sub_title("4.4 Penetration Test")
pdf.body(
    "The compliance roadmap (Appendix C) lists an external penetration test as In Progress "
    "for Q3 2026. A pen test is not strictly required for SOC 2 Type I, but most auditors "
    "will ask whether one has been planned or performed.\n\n"
    "Recommended vendors for early-stage companies: Cobalt (starts ~$3,500), "
    "Synack, or an independent OSCP-certified tester.\n\n"
    "Completing a pen test before the audit strengthens the report significantly."
)

# ── PAGE 7: ACTION PLAN ─────────────────────────────────────────────────────────
pdf.add_page()
pdf.ln(4)
pdf.section_title("5. Prioritized Action Plan")

pdf.sub_title("Blockers -- Must complete before scheduling Type I audit")
pdf.table(
    ["#", "Action", "Effort", "Closes"],
    [
        ["1", "Replace demo auth with Supabase Auth (real login)",              "2-3 days", "CC6 Auth"],
        ["2", "Enable Supabase TOTP MFA for admin accounts",                   "1 day",    "CC6 MFA"],
        ["3", "Add login rate limiting + account lockout (5 attempts)",         "1 day",    "CC6 Lockout"],
        ["4", "Implement user roles + RBAC middleware on API routes",           "3-5 days", "CC6 RBAC"],
        ["5", "Create audit_events table in Supabase; add logging to all APIs","3-5 days", "CC7 Audit Log"],
        ["6", "Set up Sentry for error tracking",                               "0.5 days", "CC7 Monitoring"],
        ["7", "Set up BetterUptime for uptime monitoring",                      "0.5 days", "CC7 Availability"],
        ["8", "Select and engage SOC 2 audit firm",                             "2-4 weeks", "Audit readiness"],
    ],
    col_widths=[8, 96, 24, 38]
)

pdf.sub_title("Should Do -- Complete during audit preparation period")
pdf.table(
    ["#", "Action", "Effort", "Closes"],
    [
        ["9",  "Start deployment log (Notion / spreadsheet)",                   "0.5 days", "CC8 Change Mgmt"],
        ["10", "Collect signed Policy Acknowledgment Forms from all team",       "1 day",    "Appendix N"],
        ["11", "Name backup contact; verify password manager access",            "0.5 days", "BCP Key Person"],
        ["12", "Run one Supabase backup restoration test; document result",      "1 day",    "CC7 Backup Test"],
        ["13", "Schedule penetration test",                                      "1-2 weeks", "Security posture"],
    ],
    col_widths=[8, 96, 24, 38]
)

pdf.sub_title("Type II Only -- After audit, during 6-12 month observation period")
pdf.bullet([
    "Continuously collect audit log evidence (no exceptions in logging)",
    "Perform quarterly access reviews -- who has access to what, is it still needed",
    "Annual policy re-acknowledgment workflow for all team members",
    "Annual vendor review with documented findings",
    "Complete penetration test and remediate all critical/high findings",
    "Formalize backup restoration test cadence (quarterly recommended)",
])

# ── PAGE 8: TIMELINE ────────────────────────────────────────────────────────────
pdf.section_title("6. Timeline")
pdf.table(
    ["Phase", "Activities", "Target Date"],
    [
        ["Phase 1: Technical Controls",
         "Supabase Auth, MFA, lockout, RBAC, audit logging, monitoring",
         "Now - Q2 2026"],
        ["Phase 2: Process Controls",
         "Deployment log, acknowledgment forms, BCP runbook, pen test booking",
         "Q2 2026"],
        ["Phase 3: Auditor Engagement",
         "Select firm, complete readiness assessment, address findings",
         "Q2 - Q3 2026"],
        ["SOC 2 Type I Audit",
         "Point-in-time design assessment",
         "Q3 2026"],
        ["Type II Observation Begins",
         "6-12 months of evidence collection",
         "Q3 2026"],
        ["SOC 2 Type II Audit",
         "Operating effectiveness assessment over observation period",
         "Q1 2027"],
    ],
    col_widths=[44, 90, 32]
)

pdf.sub_title("Recommended Audit Firms (Small Company Friendly)")
pdf.table(
    ["Firm", "Notes", "Approx. Cost (Type I)"],
    [
        ["Johanson Group",  "Popular for early-stage SaaS; fast turnaround",    "$12,000 - $20,000"],
        ["Prescient",       "Startup-focused; combined readiness + audit",       "$10,000 - $18,000"],
        ["Schellman",       "Mid-market; strong reputation",                     "$20,000 - $35,000"],
        ["A-LIGN",          "Scalable; good for combined SOC 2 + ISO 27001",     "$15,000 - $25,000"],
    ],
    col_widths=[36, 82, 48]
)
pdf.note("Costs are estimates for SOC 2 Type I only. Type II typically adds 30-50% on top.")

pdf.section_title("7. Most Important First Step")
pdf.body(
    "Replace the demo authentication stub with real Supabase Auth.\n\n"
    "Every other technical control -- MFA, RBAC, audit logging, session management -- "
    "requires knowing who the user is. The current system has no concept of user identity. "
    "Until Supabase Auth is integrated, none of the CC6 controls can be evidenced, and "
    "audit logging cannot be attributed to a specific user.\n\n"
    "Estimated development effort: 1 week.\n"
    "Impact: closes the single largest blocker for SOC 2 Type I."
)

# ── SAVE ────────────────────────────────────────────────────────────────────────
os.makedirs(os.path.dirname(OUT_PATH), exist_ok=True)
pdf.output(OUT_PATH)
print(f"Generated: {OUT_PATH}")
