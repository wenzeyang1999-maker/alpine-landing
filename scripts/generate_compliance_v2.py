#!/usr/bin/env python3
"""Generate Alpine Compliance Policy Manual v2.0"""

from fpdf import FPDF
from fpdf.enums import XPos, YPos
import os

OUT_PATH = os.path.join(os.path.dirname(__file__), "..", "public", "alpine_compliance_policy_manual_v2.pdf")

VIOLET = (123, 44, 191)
INK    = (26, 26, 46)
LIGHT  = (248, 247, 244)
BORDER = (220, 218, 212)
MUTED  = (100, 100, 120)
WHITE  = (255, 255, 255)
RED_BG = (255, 245, 245)
RED_FG = (180, 30, 30)
GREEN_BG = (240, 255, 245)
GREEN_FG = (20, 120, 60)

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
        # fpdf2 does NOT auto-reset cursor after header(); explicitly push content start down
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
            f"Compliance Policy Manual  |  Confidential  |  Alpine Due Diligence Inc.  |  Version 2.0   |   Page {self.page_no()}",
            new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.set_text_color(*INK)

    # ?? helpers ????????????????????????????????????????????????????????????????

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

    def bullet(self, items):
        self.set_font("Helvetica", "", 9.5)
        self.set_text_color(*INK)
        for item in items:
            self.set_x(26)
            self.cell(5, 5.5, chr(149), new_x=XPos.RIGHT, new_y=YPos.TOP)
            self.multi_cell(0, 5.5, item, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.ln(2)

    def note_box(self, text, color="blue"):
        self.set_font("Helvetica", "I", 9)
        self.set_text_color(*MUTED)
        self.multi_cell(0, 5.5, text, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.ln(2)
        self.set_text_color(*INK)

    def table(self, headers, rows, col_widths=None):
        if col_widths is None:
            w = 166 / len(headers)
            col_widths = [w] * len(headers)
        # Header row
        self.set_fill_color(*INK)
        self.set_text_color(*WHITE)
        self.set_font("Helvetica", "B", 8)
        for i, h in enumerate(headers):
            self.cell(col_widths[i], 7, h, border=1, fill=True)
        self.ln()
        # Body rows
        self.set_text_color(*INK)
        self.set_font("Helvetica", "", 8.5)
        for ri, row in enumerate(rows):
            fill = ri % 2 == 0
            self.set_fill_color(248, 247, 244) if fill else self.set_fill_color(255, 255, 255)
            for i, cell in enumerate(row):
                self.cell(col_widths[i], 6.5, str(cell), border=1, fill=True)
            self.ln()
        self.ln(3)

    def change_badge(self, text):
        """Inline italic note indicating a v2.0 change."""
        self.set_font("Helvetica", "I", 9)
        self.set_text_color(*MUTED)
        self.multi_cell(0, 5.5, f"[v2.0 Update: {text}]", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.ln(1)
        self.set_text_color(*INK)

# ?? BUILD PDF ??????????????????????????????????????????????????????????????????

pdf = PDF()

# ?? PAGE 1: Cover ??????????????????????????????????????????????????????????????
pdf.add_page()
pdf.set_fill_color(*INK)
pdf.rect(0, 0, 210, 297, "F")

pdf.set_font("Helvetica", "B", 28)
pdf.set_text_color(*WHITE)
pdf.set_y(55)
pdf.cell(0, 14, "ALPINE", align="C", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
pdf.set_font("Helvetica", "", 13)
pdf.set_text_color(180, 160, 220)
pdf.cell(0, 8, "DUE  DILIGENCE", align="C", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
pdf.ln(10)

pdf.set_draw_color(*VIOLET)
pdf.set_line_width(0.6)
pdf.line(60, pdf.get_y(), 150, pdf.get_y())
pdf.ln(8)

pdf.set_font("Helvetica", "B", 20)
pdf.set_text_color(*WHITE)
pdf.cell(0, 10, "Compliance Policy Manual", align="C", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
pdf.set_font("Helvetica", "", 11)
pdf.set_text_color(180, 160, 220)
pdf.cell(0, 7, "Version 2.0 - Revised Edition", align="C", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
pdf.ln(20)

# Meta table on cover
fields = [
    ("ORGANIZATION",    "Alpine Due Diligence Inc."),
    ("DOCUMENT TYPE",   "Consolidated Compliance Policies"),
    ("VERSION",         "2.0"),
    ("SUPERSEDES",      "Version 1.0 (February 15, 2026)"),
    ("EFFECTIVE DATE",  "April 27, 2026"),
    ("NEXT REVIEW",     "April 27, 2027"),
    ("OWNER",           "Allen Zhang, Founder & CEO"),
    ("CLASSIFICATION",  "Confidential"),
]
pdf.set_font("Helvetica", "", 9)
for label, value in fields:
    pdf.set_x(40)
    pdf.set_text_color(150, 130, 190)
    pdf.cell(52, 7, label)
    pdf.set_text_color(*WHITE)
    pdf.cell(0, 7, value, new_x=XPos.LMARGIN, new_y=YPos.NEXT)

pdf.set_y(270)
pdf.set_font("Helvetica", "", 7)
pdf.set_text_color(100, 90, 130)
pdf.cell(0, 5, "CONFIDENTIAL  |  ALPINE DUE DILIGENCE INC.  |  alpinedd.com", align="C",
         new_x=XPos.LMARGIN, new_y=YPos.NEXT)

# ?? PAGE 2: Introduction & Document Control ????????????????????????????????????
pdf.add_page()
pdf.ln(4)
pdf.section_title("Introduction")
pdf.body(
    "This Compliance Policy Manual is the single consolidated reference for all information security, privacy, and "
    "compliance policies governing Alpine Due Diligence Inc. (\"Alpine\"). It is designed to be provided to clients, auditors, "
    "and regulators as evidence of Alpine's formal security program.\n\n"
    "This manual encompasses all policies required for Alpine's compliance posture, including client-facing "
    "policies (Privacy Policy, Terms of Service, Security Overview), internal governance policies (Information Security, "
    "Data Classification, Incident Response, Change Management, Acceptable Use, Vendor Management, Business "
    "Continuity), and legal templates (Data Processing Agreement, Risk Assessment).\n\n"
    "All employees, contractors, and authorized users with access to Alpine systems are required to read this manual in "
    "its entirety and sign the Policy Acknowledgment Form (Appendix N). The signed form must be returned to "
    "azhang@alpinedd.com within 5 business days of receiving system access. Annual re-acknowledgment is required "
    "upon each revision of this manual."
)

pdf.change_badge("Version 2.0 revises infrastructure descriptions, vendor inventory, BCP RTO, and organizational roles.")

pdf.sub_title("Document Control")
pdf.table(
    ["Field", "Value"],
    [
        ["Version", "2.0"],
        ["Effective Date", "April 27, 2026"],
        ["Supersedes", "Version 1.0 - February 15, 2026"],
        ["Next Scheduled Review", "April 27, 2027"],
        ["Document Owner", "Allen Zhang, Founder & CEO"],
        ["Classification", "Confidential"],
        ["Distribution", "Authorized personnel, clients, and auditors"],
    ],
    col_widths=[60, 106]
)

pdf.sub_title("Summary of Changes from v1.0")
pdf.table(
    ["Section", "Change"],
    [
        ["Appendix A - Privacy Policy",       "Updated infrastructure: application server (Hetzner) vs. database (Supabase/AWS)"],
        ["Appendix C - Security Overview",    "Corrected infrastructure diagram; added Supabase and Cloudflare"],
        ["Appendix D - Info Security Policy", "Updated organizational roles to reflect current team structure"],
        ["Appendix J - Vendor Management",    "Added Supabase (database) and Resend (email) to approved vendor inventory"],
        ["Appendix K - Business Continuity",  "Revised RTO to reflect realistic solo-founder recovery capabilities; added escalation path"],
        ["Appendix M - Risk Assessment",      "Added Supabase data exposure risk; updated founder risk mitigations"],
    ],
    col_widths=[62, 104]
)

pdf.sub_title("Appendix Index")
pdf.table(
    ["Appendix", "Policy", "Category"],
    [
        ["A", "Privacy Policy",                 "Client-facing"],
        ["B", "Terms of Service",               "Client-facing"],
        ["C", "Security Overview",              "Client-facing"],
        ["D", "Information Security Policy",    "Internal"],
        ["E", "Data Classification & Handling", "Internal"],
        ["F", "Data Retention & Disposal",      "Internal"],
        ["G", "Incident Response Plan",         "Internal"],
        ["H", "Change Management Policy",       "Internal"],
        ["I", "Acceptable Use Policy",          "Internal"],
        ["J", "Vendor Management Policy",       "Internal"],
        ["K", "Business Continuity Plan",       "Internal"],
        ["L", "Data Processing Agreement",      "Legal"],
        ["M", "Risk Assessment",                "Legal"],
        ["N", "Policy Acknowledgment Form",     "Required"],
    ],
    col_widths=[22, 100, 44]
)

# ?? PAGE 3: Appendix A - Privacy Policy ???????????????????????????????????????
pdf.add_page()
pdf.ln(4)
pdf.section_title("Appendix A: Privacy Policy")
pdf.set_font("Helvetica", "I", 8.5)
pdf.set_text_color(*MUTED)
pdf.cell(0, 5, "Effective Date: April 27, 2026 | Last Updated: April 27, 2026 | Published at: alpinedd.com/privacy",
         new_x=XPos.LMARGIN, new_y=YPos.NEXT)
pdf.set_text_color(*INK)
pdf.ln(2)

pdf.sub_title("1. Introduction")
pdf.body(
    "Alpine Due Diligence Inc. (\"Alpine,\" \"we,\" \"our,\" or \"us\") operates an AI-powered operational due diligence analysis "
    "platform at alpinedd.com (the \"Service\"). This Privacy Policy describes how we collect, use, store, and protect "
    "information when you use our Service. We are committed to protecting the confidentiality and security of all "
    "information entrusted to us by our clients."
)

pdf.sub_title("2. Information We Collect")
pdf.body("2.1 Account Information\nName, email address, and organizational affiliation provided during account registration. Authentication credentials (passwords are stored using industry-standard bcrypt hashing; Alpine never stores plaintext passwords). Role and permission assignments configured by your organization.")
pdf.body("2.2 Uploaded Documents\nFund documents, DDQs, regulatory filings, and other materials uploaded by authorized users for analysis. All uploaded documents are treated as Confidential data.")
pdf.body("2.3 Generated Content\nAnalysis reports, risk assessments, and other outputs produced by the Service. User annotations, comments, and custom configurations applied to reports.")
pdf.body("2.4 Usage Logs\nTimestamps, IP addresses, and browser metadata associated with platform access. Feature usage patterns and performance telemetry (anonymized and aggregated).")

pdf.sub_title("3. How We Use Your Information")
pdf.bullet([
    "Analysis Only: Uploaded documents are processed solely to generate due diligence reports. Documents are never used for marketing or any unrelated purpose.",
    "Service Improvement: Anonymized, aggregated benchmarking data may be used to improve analytical frameworks. No client-identifiable data is included.",
    "Security & Compliance: Usage logs are retained to support audit trails, incident investigation, and regulatory compliance.",
])

pdf.sub_title("4. How We Store and Protect Your Data")
pdf.change_badge("Infrastructure updated: application server (Hetzner) and database (Supabase/AWS) are now separately described.")
pdf.body(
    "Alpine's infrastructure consists of two components:\n\n"
    "Application Server: The Alpine web application is hosted on a dedicated server provided by Hetzner Online GmbH "
    "(ISO 27001 certified), located in the European Union. The application server handles request routing, authentication, "
    "and report rendering.\n\n"
    "Database & Storage: Client data (report drafts, notes, uploaded documents, and related records) is stored in "
    "Supabase, a managed database service whose infrastructure runs on Amazon Web Services (AWS). Data is encrypted "
    "at rest (AES-256) and in transit (TLS 1.3) within Supabase infrastructure. A Data Processing Agreement (DPA) is "
    "in place with Supabase.\n\n"
    "All communications between your browser and Alpine servers use TLS 1.3. Role-based access control (RBAC) and "
    "JWT-based authentication protect all access. Every access event is logged."
)

pdf.sub_title("5. Data Retention")
pdf.table(
    ["Data Type", "Retention Period", "Disposal"],
    [
        ["Uploaded documents",   "Engagement + 90 days", "Secure overwrite"],
        ["Generated reports",    "Duration of engagement", "Deleted on request"],
        ["Audit logs",           "1 year minimum", "Archived, then deleted"],
        ["Account data",         "Account duration + 30 days", "Database deletion"],
        ["Anonymized benchmarks","Indefinite", "N/A (no PII)"],
        ["Backups",              "30 days rolling", "Encrypted overwrite"],
    ],
    col_widths=[52, 66, 48]
)

pdf.sub_title("6. Third-Party Data Processing")
pdf.body(
    "Alpine uses the Anthropic API (Claude) for AI-powered document analysis under a Data Processing Agreement (DPA) "
    "with Zero Data Retention (ZDR) - document text sent for analysis is not stored by Anthropic after the API response.\n\n"
    "Alpine uses Supabase for database and file storage. Processing is governed by a DPA executed with Supabase Inc.\n\n"
    "Alpine uses Resend for transactional email delivery. Email content in transit is subject to Resend's DPA.\n\n"
    "No other third parties receive or have access to client document content."
)

pdf.sub_title("7. Your Rights")
pdf.bullet([
    "Access: You may request a summary of the personal data we hold about you.",
    "Deletion: You may request deletion of your data at any time. Alpine will complete deletion within 30 business days and send a written confirmation.",
    "Portability: You may request export of your uploaded documents and generated reports.",
    "Opt-Out: You may opt out of anonymized benchmarking by contacting us.",
])

pdf.sub_title("8. Contact")
pdf.body("For privacy inquiries, data requests, or complaints:\nEmail: azhang@alpinedd.com\nAlpine Due Diligence Inc.")

# ?? PAGE 4: Appendix B - Terms of Service ?????????????????????????????????????
pdf.add_page()
pdf.ln(4)
pdf.section_title("Appendix B: Terms of Service")
pdf.set_font("Helvetica", "I", 8.5)
pdf.set_text_color(*MUTED)
pdf.cell(0, 5, "Effective Date: April 27, 2026 | Published at: alpinedd.com/terms",
         new_x=XPos.LMARGIN, new_y=YPos.NEXT)
pdf.set_text_color(*INK)
pdf.ln(2)

pdf.sub_title("1. Service Description")
pdf.body("Alpine Due Diligence Inc. (\"Alpine\") provides an AI-powered operational due diligence (ODD) analysis platform (the \"Service\"). The Service enables institutional investors and their advisors to upload fund documentation, perform automated gap analysis, generate structured ODD reports, and conduct independent verification checks.")

pdf.sub_title("2. Account Responsibilities")
pdf.bullet([
    "You are responsible for maintaining the confidentiality of your account credentials.",
    "You must not share login credentials with unauthorized individuals.",
    "You must use the Service only for authorized business purposes.",
    "You must notify Alpine immediately of any suspected unauthorized access to your account.",
])

pdf.sub_title("3. Data Ownership")
pdf.body("Client Data: You retain all ownership rights to documents you upload and any data you provide. Alpine acquires no ownership interest in client data.\n\nAlpine IP: Alpine retains ownership of its analytical frameworks, methodologies, scoring algorithms, software, and platform infrastructure.\n\nReport License: You receive a non-exclusive, non-transferable license to use reports generated by the Service for your internal business purposes.")

pdf.sub_title("4. Limitation of Liability")
pdf.body("THE SERVICE PROVIDES ANALYTICAL OUTPUTS TO SUPPORT YOUR DUE DILIGENCE PROCESSES. ALPINE DOES NOT PROVIDE INVESTMENT ADVICE, LEGAL ADVICE, TAX ADVICE, OR ACCOUNTING ADVICE.\n\nTo the maximum extent permitted by law, Alpine's total liability for any claims shall not exceed the fees paid by you to Alpine in the twelve (12) months preceding the claim.")

pdf.sub_title("5. Confidentiality")
pdf.body("Alpine treats all client data as confidential. We will not disclose client data to third parties except as necessary to provide the Service, as required by law, or with your written consent.")

pdf.sub_title("6. Termination")
pdf.body("Either party may terminate the Service agreement with 30 days' written notice. Upon termination, Alpine will delete all client data within 30 days, unless retention is required by law.")

pdf.sub_title("7. Disclaimer")
pdf.body("THE SERVICE IS PROVIDED \"AS IS\" AND \"AS AVAILABLE.\" ALPINE MAKES NO WARRANTIES, EXPRESS OR IMPLIED. Alpine does not guarantee the accuracy, completeness, or timeliness of any analysis output. Users should independently verify all findings before making investment decisions.")

pdf.sub_title("8. Governing Law")
pdf.body("These Terms shall be governed by and construed in accordance with applicable law. Any disputes shall be resolved through binding arbitration.")

# ?? PAGE 5: Appendix C - Security Overview ????????????????????????????????????
pdf.add_page()
pdf.ln(4)
pdf.section_title("Appendix C: Security Overview")
pdf.body("This document provides a high-level overview of Alpine's security architecture and controls.")
pdf.change_badge("Infrastructure architecture updated to reflect two-tier design: Hetzner app server + Supabase/AWS database.")

pdf.sub_title("Data Flow Architecture")
pdf.body(
    "All client data follows a controlled, auditable path through the Alpine platform:\n\n"
    "  Client Browser  ->  Alpine App Server (Hetzner, EU)  ->  Anthropic API (analysis)\n"
    "  Alpine App Server  ->  Supabase Database (AWS)  ->  Client Browser\n\n"
    "TLS 1.3 encryption protects data in transit at every stage. The Anthropic API processes document text "
    "transiently under Zero Data Retention (ZDR) terms. Supabase stores persistent data (drafts, notes, documents) "
    "under AES-256 encryption at rest."
)

pdf.sub_title("Infrastructure Components")
pdf.table(
    ["Component", "Provider", "Purpose", "Certification"],
    [
        ["Application Server", "Hetzner Online GmbH (EU)", "Web app, routing, auth", "ISO 27001"],
        ["Database & Storage",  "Supabase / AWS",           "Persistent client data", "SOC 2 Type II (AWS)"],
        ["AI Analysis",         "Anthropic API",            "Document analysis (transient)", "SOC 2 Type II"],
        ["CDN / DDoS",          "Cloudflare",               "Edge delivery, DDoS protection", "SOC 2 Type II"],
        ["Email Delivery",      "Resend",                   "Transactional email",    "SOC 2"],
    ],
    col_widths=[40, 42, 50, 34]
)

pdf.sub_title("Encryption Standards")
pdf.table(
    ["Layer", "Standard", "Details"],
    [
        ["In Transit",  "TLS 1.3",  "All API and browser connections"],
        ["At Rest",     "AES-256",  "Supabase database encryption + Hetzner disk encryption"],
        ["Backups",     "AES-256",  "Encrypted daily automated backups"],
        ["Passwords",   "bcrypt",   "Salted + hashed, never stored plaintext"],
    ],
    col_widths=[35, 35, 96]
)

pdf.sub_title("Access Controls")
pdf.bullet([
    "Role-Based Access Control (RBAC): Users are assigned roles with granular permissions.",
    "JWT Authentication: Stateless, cryptographically signed session tokens with expiry.",
    "Session Management: Automatic timeout after inactivity. Concurrent session limits.",
    "Account Lockout: Accounts locked after 5 consecutive failed login attempts.",
    "Audit Logging: Every access event logged with timestamp, user identity, IP, and action.",
])

pdf.sub_title("AI Data Handling")
pdf.bullet([
    "Alpine uses Anthropic's Commercial API, which explicitly prohibits training on customer data.",
    "A Data Processing Agreement (DPA) is in place with Anthropic.",
    "Zero Data Retention (ZDR) is enabled: API inputs and outputs are not stored by Anthropic.",
    "No client data is used for model training, fine-tuning, or any purpose beyond generating the requested analysis.",
])

pdf.sub_title("Compliance Roadmap")
pdf.table(
    ["Milestone", "Target Date", "Status"],
    [
        ["NIST CSF 2.0 Alignment",        "Q1 2026",  "Completed"],
        ["SOC 2 Type I Audit",            "Q3 2026",  "In Progress"],
        ["Penetration Test",              "Q3 2026",  "In Progress"],
        ["Supabase DPA Execution",        "Q2 2026",  "Completed"],
        ["SOC 2 Type II Audit",           "Q1 2027",  "Planned"],
    ],
    col_widths=[80, 40, 46]
)

# ?? PAGE 6: Appendix D - Information Security Policy ??????????????????????????
pdf.add_page()
pdf.ln(4)
pdf.section_title("Appendix D: Information Security Policy")
pdf.set_font("Helvetica", "I", 8.5)
pdf.set_text_color(*MUTED)
pdf.cell(0, 5, "Owner: Allen Zhang, Founder & CEO  |  Review Cycle: Annual",
         new_x=XPos.LMARGIN, new_y=YPos.NEXT)
pdf.set_text_color(*INK)
pdf.ln(2)
pdf.change_badge("Organizational roles updated to reflect current team structure beyond solo-founder stage.")

pdf.sub_title("1. Purpose")
pdf.body("This policy establishes the framework for protecting the confidentiality, integrity, and availability of all information assets owned, processed, or managed by Alpine Due Diligence Inc. It applies to all Alpine systems, data, personnel, and contractors.")

pdf.sub_title("2. Scope")
pdf.body("This policy applies to all Alpine information systems, networks, applications, data repositories, and cloud services, as well as all personnel, contractors, and third parties who access Alpine systems or data.")

pdf.sub_title("3. Roles and Responsibilities")
pdf.body("Alpine is in an early growth stage. The Founder currently holds primary security responsibilities, with plans to delegate as the team scales. All team members share responsibility for following this policy within their scope of access.")
pdf.table(
    ["Role", "Responsibility", "Current Holder"],
    [
        ["Security Lead",         "Overall security program ownership and incident response", "Allen Zhang (Founder & CEO)"],
        ["System Admin",          "Server hardening, patching, monitoring (Hetzner + Supabase)", "Allen Zhang (Founder & CEO)"],
        ["Data Owner",            "Data classification and access decisions", "Allen Zhang (Founder & CEO)"],
        ["CCO (future hire)",     "Compliance oversight, audit liaison, annual policy review", "TBD - hire planned"],
        ["Team Members",          "Comply with all policies; report incidents immediately", "All current team members"],
    ],
    col_widths=[38, 80, 48]
)
pdf.note_box(
    "Note: As Alpine scales beyond the founding stage, security responsibilities will be progressively delegated. "
    "Each team member is individually accountable for the data and systems they access. Compensating controls "
    "during the growth period include audit logging, documented self-review procedures, and annual policy "
    "re-acknowledgment.", "blue"
)

pdf.sub_title("4. Data Classification")
pdf.body("All Alpine data is classified into one of three categories. See Appendix E for full handling procedures.")
pdf.table(
    ["Classification", "Description", "Examples"],
    [
        ["Public",       "No sensitivity; freely shareable",              "Website, marketing, published policies"],
        ["Internal",     "Business-sensitive; internal only",             "Source code, architecture, strategy"],
        ["Confidential", "Highly sensitive; restricted access",           "Client docs, reports, user data, API keys"],
    ],
    col_widths=[32, 74, 60]
)

pdf.sub_title("5. Access Control Principles")
pdf.bullet([
    "Least Privilege: Users receive only the minimum permissions required for their role.",
    "Need-to-Know: Access to Confidential data is granted only when required for a specific business function.",
    "Separation of Duties: Where feasible, no single individual controls all aspects of a critical process.",
    "Authentication: All access requires strong authentication. Multi-factor authentication (MFA) is required for all administrative access.",
])

pdf.sub_title("6. Incident Management")
pdf.body("All security incidents must be reported, assessed, and resolved according to the Incident Response Plan (Appendix G). Affected clients will be notified within 72 hours of a confirmed data breach.")

pdf.sub_title("7. Policy Review")
pdf.body("This policy and all appendices will be reviewed at least annually, or sooner if triggered by a significant security incident, change in business operations, or regulatory update.")

# ?? PAGE 7: Appendix E ?????????????????????????????????????????????????????????
pdf.add_page()
pdf.ln(4)
pdf.section_title("Appendix E: Data Classification & Handling")

pdf.sub_title("1. Purpose")
pdf.body("This policy defines data classification levels and the specific handling, storage, transmission, and disposal requirements for each level.")

pdf.sub_title("2. Classification Levels")
pdf.body("2.1 Public - Information intended for public consumption. No confidentiality requirements. Examples: website content, published policies, marketing materials.\n\n2.2 Internal - Information intended for use within Alpine only. Disclosure could cause minor business impact. Examples: source code, architecture documentation, business strategy.\n\n2.3 Confidential - Highly sensitive information whose unauthorized disclosure could cause significant harm to Alpine or its clients. Examples: client-uploaded documents, generated ODD reports, user account data, API keys.")

pdf.sub_title("3. Handling Requirements")
pdf.table(
    ["Requirement",        "Public",        "Internal",         "Confidential"],
    [
        ["Encryption at Rest",  "Not required",  "Required",         "Required (AES-256)"],
        ["Encryption in Transit","Recommended",  "Required (TLS)",   "Required (TLS 1.3)"],
        ["Access Control",      "None",          "Auth required",    "RBAC + need-to-know"],
        ["Audit Logging",       "Not required",  "Recommended",      "Required (all access)"],
        ["Backup",              "Not required",  "Standard backup",  "Encrypted backup"],
        ["Disposal",            "Standard delete","Secure delete",   "Secure overwrite + log"],
    ],
    col_widths=[40, 36, 36, 54]
)

# ?? PAGE 8: Appendix F ?????????????????????????????????????????????????????????
pdf.section_title("Appendix F: Data Retention & Disposal")

pdf.sub_title("1. Retention Schedule")
pdf.table(
    ["Data Type", "Retention Period", "Disposal Method"],
    [
        ["Uploaded client documents",  "Engagement + 90 days",   "Secure deletion (overwrite)"],
        ["Generated reports",          "Duration of engagement", "Secure deletion on request"],
        ["Audit logs",                 "1 year minimum",         "Archived, then secure deletion"],
        ["User account data",          "Account + 30 days",      "Database deletion"],
        ["Anonymized benchmarks",      "Indefinite",             "N/A (no client-identifiable data)"],
        ["Backups",                    "30 days rolling",        "Encrypted overwrite"],
        ["Session tokens",             "24 hours",               "Automatic expiry + deletion"],
    ],
    col_widths=[55, 55, 56]
)

pdf.sub_title("2. Client Deletion Requests")
pdf.body("Clients may request deletion of their data at any time by contacting azhang@alpinedd.com. Alpine will:\n1. Acknowledge the request within 2 business days.\n2. Complete deletion from primary systems within 30 business days.\n3. Confirm deletion in writing to the requesting client.\n4. Backup copies will age out within the rolling 30-day backup window.")

# ?? PAGE 9: Appendix G - Incident Response ????????????????????????????????????
pdf.add_page()
pdf.ln(4)
pdf.section_title("Appendix G: Incident Response Plan")

pdf.sub_title("1. Severity Classification")
pdf.table(
    ["Severity",    "Description",                          "Response Time", "Example"],
    [
        ["P1 Critical", "Active breach of client data",         "Immediate",     "Unauthorized data exfiltration"],
        ["P2 High",     "System compromise, no data loss",      "< 4 hours",     "Server intrusion detected"],
        ["P3 Medium",   "Vulnerability found, unexploited",     "< 24 hours",    "Unpatched CVE on server"],
        ["P4 Low",      "Minor security event",                 "< 72 hours",    "Brute-force login attempts blocked"],
    ],
    col_widths=[26, 68, 28, 44]
)

pdf.sub_title("2. Response Phases")
pdf.bullet([
    "Phase 1 - Detection: Automated monitoring, user reports, external vendor alerts.",
    "Phase 2 - Assessment: Determine scope, classify severity, document initial findings.",
    "Phase 3 - Containment: Revoke compromised credentials; isolate affected systems; preserve evidence.",
    "Phase 4 - Eradication: Remove root cause; reset credentials; verify through log review.",
    "Phase 5 - Recovery: Restore from clean backups; verify integrity; implement additional monitoring.",
    "Phase 6 - Notification: Notify clients within 72 hours of confirmed breach; regulators as required by law.",
    "Phase 7 - Post-Incident Review: Root cause analysis within 5 business days; update controls and policies.",
])

pdf.sub_title("3. Emergency Contacts")
pdf.table(
    ["Contact",       "Role",                     "Method"],
    [
        ["Allen Zhang",     "Security Lead / Founder",   "Phone + Email"],
        ["Hetzner Support", "Infrastructure provider",   "Support portal + phone"],
        ["Supabase Support","Database provider",         "Support portal"],
        ["Anthropic Support","AI API provider",          "Support portal"],
    ],
    col_widths=[48, 70, 48]
)

# ?? PAGE 10: Appendix H - Change Management ???????????????????????????????????
pdf.section_title("Appendix H: Change Management Policy")

pdf.sub_title("1. Standard Changes")
pdf.bullet([
    "All code changes are committed through Git version control. No direct edits to production systems.",
    "Code review is required before merge. Self-review with documented summary is acceptable for solo work.",
    "Testing must be performed before deployment: manual smoke test of the critical user flow.",
    "Deployment: git pull on production server, restart affected services, execute smoke test, verify via monitoring.",
    "All deployments are logged with date, time, commit hash, and summary of changes.",
])

pdf.sub_title("2. Rollback Procedure")
pdf.bullet([
    "Identify the issue and the commit that introduced it.",
    "Execute git revert to reverse the problematic changes.",
    "Restart affected services and run smoke test.",
    "Document the rollback event, root cause, and follow-up actions.",
])

pdf.sub_title("3. Emergency Changes")
pdf.body("In the event of a critical vulnerability or production outage, the standard change process may be abbreviated, but all changes must still go through Git and be fully documented within 24 hours.")

# ?? PAGE 11: Appendix I - Acceptable Use ??????????????????????????????????????
pdf.add_page()
pdf.ln(4)
pdf.section_title("Appendix I: Acceptable Use Policy")

pdf.sub_title("1. Acceptable Use")
pdf.body("Alpine systems, applications, and data are to be used solely for authorized business purposes related to Alpine's operations and client engagements.")

pdf.sub_title("2. Prohibited Activities")
pdf.bullet([
    "Sharing account credentials with any other person, including colleagues.",
    "Downloading, copying, or transferring client data to personal devices or unauthorized storage.",
    "Accessing client data without a legitimate business justification.",
    "Attempting to bypass, disable, or circumvent any security control.",
    "Using Alpine systems for any illegal, fraudulent, or unauthorized purpose.",
    "Installing unauthorized software on Alpine infrastructure.",
    "Disclosing confidential information to unauthorized parties.",
])

pdf.sub_title("3. Reporting Obligations")
pdf.body("All users must report any suspected or actual security incident, policy violation, or unauthorized access immediately to the Security Lead (azhang@alpinedd.com). Failure to report known incidents is itself a policy violation.")

# ?? PAGE 12: Appendix J - Vendor Management ???????????????????????????????????
pdf.section_title("Appendix J: Vendor Management Policy")
pdf.change_badge("Supabase and Resend added to approved vendor inventory.")

pdf.sub_title("1. Vendor Evaluation Criteria")
pdf.bullet([
    "Security certifications (SOC 2, ISO 27001, or equivalent).",
    "Data processing agreement (DPA) availability and terms.",
    "Data residency and jurisdictional compliance.",
    "Incident notification and breach response commitments.",
    "Encryption and access control capabilities.",
    "Business continuity and disaster recovery provisions.",
])

pdf.sub_title("2. Approved Vendor Inventory")
pdf.table(
    ["Vendor",        "Service",               "Data Access",              "Certifications",    "DPA"],
    [
        ["Anthropic",     "AI API",                "Doc text (transient, ZDR)","SOC 2 Type II",    "Yes + ZDR"],
        ["Hetzner",       "App server hosting",    "Application layer only",   "ISO 27001",        "Yes"],
        ["Supabase",      "Database & storage",    "All persistent data (enc.)","SOC 2 (AWS)",     "Yes"],
        ["Resend",        "Transactional email",   "Email content in transit", "SOC 2",            "Yes"],
        ["Cloudflare",    "CDN / DDoS protection", "Request metadata only",    "SOC 2 Type II",    "Yes"],
        ["Let's Encrypt", "SSL certificates",      "None",                     "N/A",              "N/A"],
        ["GitHub",        "Code repository",       "Source code only",         "SOC 2 Type II",    "Yes"],
    ],
    col_widths=[25, 33, 42, 33, 15]
)

pdf.sub_title("3. Supabase - Additional Notes")
pdf.body(
    "Supabase serves as Alpine's primary database and file storage provider. All persistent client data - including "
    "report drafts, analysis notes, ratings, and uploaded documents - resides in Supabase. Supabase's infrastructure "
    "runs on Amazon Web Services (AWS). A Data Processing Agreement has been executed with Supabase Inc. "
    "Data is encrypted at rest (AES-256) and in transit (TLS 1.3) within Supabase infrastructure. "
    "Supabase is reviewed annually as part of the standard vendor review cycle."
)

pdf.sub_title("4. Ongoing Vendor Monitoring")
pdf.bullet([
    "All vendors are reviewed annually for continued compliance with Alpine's security requirements.",
    "Vendors must notify Alpine of any material changes to their security posture.",
    "Vendor certifications are reviewed upon renewal or when updated versions are issued.",
    "Any vendor security breach that may affect Alpine data triggers an immediate review.",
])

# ?? PAGE 13: Appendix K - Business Continuity ?????????????????????????????????
pdf.add_page()
pdf.ln(4)
pdf.section_title("Appendix K: Business Continuity Plan")
pdf.change_badge("RTO revised to reflect realistic recovery timeline; founder-unavailability section expanded.")

pdf.sub_title("1. Recovery Objectives")
pdf.table(
    ["Objective",              "Target",  "Description"],
    [
        ["RTO (Recovery Time)", "8 hours", "Maximum time to restore services under normal conditions"],
        ["RPO (Recovery Point)", "24 hours","Maximum acceptable data loss"],
    ],
    col_widths=[48, 24, 94]
)
pdf.note_box(
    "Note on RTO: An 8-hour RTO is achievable when the Security Lead is available and responsive. "
    "In a founder-unavailability scenario, recovery is dependent on documented runbooks and may extend "
    "beyond 8 hours. Alpine is actively documenting all recovery procedures to minimize this risk and "
    "will reassess RTO as the operational team grows.", "blue"
)

pdf.sub_title("2. Critical Systems Inventory")
pdf.table(
    ["System",           "Provider",   "Criticality", "Backup Strategy"],
    [
        ["Application Server","Hetzner",    "Critical",    "Daily encrypted backups"],
        ["Database",          "Supabase",   "Critical",    "Supabase automated backups (daily)"],
        ["Anthropic API",     "Anthropic",  "Critical",    "Graceful degradation message"],
        ["Code Repository",   "GitHub",     "High",        "Local mirrors + Git history"],
        ["DNS",               "Registrar",  "High",        "Document nameserver config"],
        ["SSL Certificates",  "Let's Encrypt","High",      "Auto-renewal + manual backup"],
    ],
    col_widths=[40, 34, 26, 66]
)

pdf.sub_title("3. Disruption Scenarios")
pdf.body(
    "3.1 Server Failure (Hetzner)\n"
    "1. Detect failure via monitoring alerts. 2. Provision a new Hetzner server instance. 3. Restore application "
    "from the most recent encrypted backup. 4. Point application to existing Supabase database (data is preserved "
    "independently). 5. Update DNS if IP changed. 6. Run smoke test. 7. Notify affected clients if outage > 8 hours."
)
pdf.body(
    "3.2 Database Failure (Supabase)\n"
    "1. Detect via API error responses or monitoring. 2. Contact Supabase support and assess scope. "
    "3. Restore from Supabase's automated point-in-time recovery if data loss has occurred. "
    "4. Display user-facing maintenance message during recovery."
)
pdf.body(
    "3.3 Anthropic API Outage\n"
    "1. Detect via API error responses. 2. Display: \"AI analysis temporarily unavailable. Document upload and "
    "report viewing remain functional.\" 3. Queue pending analysis requests for retry when available."
)
pdf.body(
    "3.4 Founder / Key Person Unavailable\n"
    "Alpine acknowledges that the Founder is currently the primary operational contact. Mitigations in place:\n"
    "- All recovery procedures documented in this manual to enable handoff.\n"
    "- Infrastructure credentials stored in encrypted password manager accessible to designated backup contact.\n"
    "- Supabase data is independently accessible and not dependent on Hetzner server availability.\n"
    "- Plan: address single-point-of-failure risk with operations hire as team grows."
)

pdf.sub_title("4. Communication Plan")
pdf.body("If a service disruption exceeds 8 hours, Alpine will notify all active clients via email with: (1) description of the issue, (2) estimated time to resolution, (3) any actions required by the client, and (4) a follow-up upon resolution.")

# ?? PAGE 14: Appendix L - DPA ?????????????????????????????????????????????????
pdf.add_page()
pdf.ln(4)
pdf.section_title("Appendix L: Data Processing Agreement")
pdf.set_font("Helvetica", "I", 8.5)
pdf.set_text_color(*MUTED)
pdf.cell(0, 5, "Template: To be executed between Alpine Due Diligence Inc. (\"Processor\") and each client (\"Controller\").",
         new_x=XPos.LMARGIN, new_y=YPos.NEXT)
pdf.set_text_color(*INK)
pdf.ln(2)

pdf.sub_title("1. Scope of Processing")
pdf.body("The Processor will process personal data and confidential business data solely for the purpose of providing the operational due diligence analysis services described in the Service Agreement. Processing activities include: document ingestion, AI-powered analysis, report generation, and secure storage during the engagement.")

pdf.sub_title("2. Categories of Data")
pdf.bullet([
    "Fund documentation (PPMs, DDQs, audited financials, organizational charts)",
    "Regulatory filing data (SEC registrations, ADV forms)",
    "Business correspondence related to fund operations",
    "Any personal data contained within the above documents",
])

pdf.sub_title("3. Sub-Processors")
pdf.table(
    ["Sub-Processor", "Purpose",             "Data Handled",             "Safeguards"],
    [
        ["Anthropic",     "AI analysis API",     "Document text (transient)", "DPA + ZDR + no training"],
        ["Hetzner",       "App server",          "Application layer",         "ISO 27001 + DPA"],
        ["Supabase",      "Database & storage",  "All persistent data (enc.)","DPA + AES-256"],
        ["Resend",        "Email delivery",      "Email content in transit",  "DPA"],
    ],
    col_widths=[30, 38, 50, 48]
)

pdf.sub_title("4. Security Obligations")
pdf.body("The Processor will implement and maintain the technical and organizational security measures described in Appendix C and Appendix D, including encryption at rest (AES-256) and in transit (TLS 1.3), role-based access controls, and audit logging.")

pdf.sub_title("5. Breach Notification")
pdf.body("In the event of a personal data breach, the Processor will notify the Controller within 72 hours of becoming aware of the breach, including: (a) nature of the breach, (b) categories and approximate number of records affected, (c) likely consequences, and (d) measures taken or proposed.")

pdf.sub_title("6. Data Deletion")
pdf.body("Upon termination of the Service Agreement, the Processor will delete all Controller data within 30 days and provide written confirmation.")

pdf.sub_title("7. Signatures")
pdf.body("Authorized Signatory: Alpine Due Diligence Inc. (Processor)\nDate: ____________________\n\nAuthorized Signatory: Client Organization (Controller)\nDate: ____________________")

# ?? PAGE 15: Appendix M - Risk Assessment ?????????????????????????????????????
pdf.add_page()
pdf.ln(4)
pdf.section_title("Appendix M: Risk Assessment")
pdf.change_badge("Supabase data exposure risk added; founder risk mitigations updated.")

pdf.sub_title("1. Risk Register")
pdf.table(
    ["Risk",                         "Likelihood", "Impact", "Controls",                          "Residual"],
    [
        ["Unauthorized data access",     "Medium",     "High",   "Auth + RBAC + audit + encryption",  "Low"],
        ["API data exposure",            "Low",        "High",   "Commercial Terms + DPA + ZDR",       "Very Low"],
        ["Server compromise (Hetzner)",  "Low",        "High",   "Firewall + SSH + fail2ban + enc.",   "Low"],
        ["Supabase data exposure",       "Low",        "High",   "Supabase DPA + AES-256 + RBAC",      "Low"],
        ["Backup failure / data loss",   "Low",        "Medium", "Daily enc. backups + quarterly test","Low"],
        ["Founder unavailable",          "Medium",     "High",   "BCP + documented procedures + team", "Medium"],
        ["Credential theft (phishing)",  "Medium",     "High",   "Strong passwords + lockout + MFA",   "Medium"],
        ["Supply chain (vendor breach)", "Low",        "High",   "Vendor DPAs + ZDR + annual review",  "Low"],
        ["Insider threat",               "Low",        "High",   "Audit logging + least privilege",    "Low"],
        ["Denial of service",            "Low",        "Medium", "Rate limiting + Cloudflare DDoS",    "Low"],
        ["Regulatory non-compliance",    "Low",        "Medium", "This policy manual + SOC 2 roadmap", "Low"],
    ],
    col_widths=[46, 22, 18, 56, 24]
)

pdf.sub_title("2. Risk Mitigation Priorities")
pdf.body(
    "High Priority (Address Immediately)\n"
    "- Founder / key person single point of failure: Mitigate by documenting all procedures, storing credentials "
    "securely in a shared password manager, and expanding the operational team.\n"
    "- Credential theft: Enforce multi-factor authentication (MFA) for all administrative access.\n\n"
    "Medium Priority (Address Within 90 Days)\n"
    "- Penetration testing: Engage an external security firm.\n"
    "- Formalize backup restoration testing with documented results.\n"
    "- Complete Supabase DPA review and confirm data residency region.\n\n"
    "Ongoing\n"
    "- Maintain all current controls as documented in this manual.\n"
    "- Review this risk assessment quarterly and update as the threat landscape evolves."
)

# ?? PAGE 16: Appendix N - Acknowledgment Form ?????????????????????????????????
pdf.add_page()
pdf.ln(4)
pdf.section_title("Appendix N: Policy Acknowledgment Form")
pdf.set_font("Helvetica", "B", 10)
pdf.set_text_color(180, 30, 30)
pdf.cell(0, 6, "REQUIRED: All Employees, Contractors & Authorized Users", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
pdf.set_text_color(*INK)
pdf.ln(2)
pdf.body("Each individual with access to Alpine systems must sign this form and return it to:\nazhang@alpinedd.com\nwithin 5 business days of receiving access.")

pdf.sub_title("Acknowledgment")
pdf.body(
    "By signing below, I acknowledge and confirm the following:\n\n"
    "1. I have received, read, and understood the Alpine Due Diligence Compliance Policy Manual (Version 2.0, "
    "dated April 27, 2026), including all appendices listed herein.\n\n"
    "2. I understand the policies, procedures, and standards described in this manual, including the Information "
    "Security Policy (Appendix D), Data Classification & Handling Policy (Appendix E), Incident Response Plan "
    "(Appendix G), Acceptable Use Policy (Appendix I), and all other referenced policies.\n\n"
    "3. I agree to comply with all policies contained in this manual in the performance of my duties.\n\n"
    "4. I understand that I must report any suspected or actual security incidents, policy violations, or "
    "unauthorized access immediately to the Security Lead at azhang@alpinedd.com.\n\n"
    "5. I understand that failure to comply with these policies may result in disciplinary action, including "
    "suspension or termination of system access, termination of employment or contract, and/or legal action.\n\n"
    "6. I understand that I will be required to re-acknowledge this manual annually or whenever a material "
    "revision is published."
)

pdf.sub_title("Signature")
for label in ["Full Name (Printed):", "Title / Role:", "Date:", "Signature:"]:
    pdf.set_font("Helvetica", "", 9.5)
    pdf.cell(0, 8, label, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.set_draw_color(*BORDER)
    pdf.line(22, pdf.get_y(), 188, pdf.get_y())
    pdf.ln(5)

pdf.ln(4)
pdf.sub_title("Submission Instructions")
pdf.bullet([
    "Print this page, sign and date it, then scan or photograph clearly.",
    "Email the signed copy to azhang@alpinedd.com with subject line: \"Policy Acknowledgment - [Your Full Name]\"",
    "Retain a personal copy for your records.",
])

# ?? Output ?????????????????????????????????????????????????????????????????????
pdf.output(OUT_PATH)
print(f"Generated: {OUT_PATH}")
