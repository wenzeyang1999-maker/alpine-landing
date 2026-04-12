import type { Metadata } from "next";
import SubpageLayout from "@/components/SubpageLayout";
import { INK, MUTED, VIOLET } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy | Alpine Due Diligence",
};

export default function PrivacyPage() {
  return (
    <SubpageLayout>
      <main className="flex-1 mx-auto max-w-3xl px-6 py-16 w-full">
        <h1 className="font-heading font-emphasis text-3xl" style={{ color: INK }}>Privacy Policy</h1>
        <p className="mt-2 text-sm font-mono" style={{ color: MUTED }}>Last updated: February 15, 2026</p>

        <div className="mt-10 space-y-8 text-base leading-relaxed" style={{ color: INK }}>
          <section>
            <h2 className="font-heading font-emphasis text-lg" style={{ color: INK }}>1. Introduction</h2>
            <p className="mt-3">
              Alpine Due Diligence Inc. (&ldquo;Alpine,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) is committed to protecting the privacy and security of your information. This Privacy Policy describes how we collect, use, store, and disclose information when you use the Alpine Operational Due Diligence Platform (&ldquo;Platform&rdquo;).
            </p>
          </section>

          <section>
            <h2 className="font-heading font-emphasis text-lg" style={{ color: INK }}>2. Information We Collect</h2>
            <p className="mt-3"><strong>Account Information:</strong> When you register, we collect your name, email address, organization name, and password (stored as a bcrypt hash).</p>
            <p className="mt-3"><strong>Uploaded Documents:</strong> You may upload fund documents (DDQs, Form ADVs, financial statements, compliance manuals) for analysis. These documents are classified as CONFIDENTIAL by default.</p>
            <p className="mt-3"><strong>Generated Content:</strong> The Platform generates gap analyses, verification results, and ODD reports based on your uploaded documents.</p>
            <p className="mt-3"><strong>Usage Data:</strong> We log actions (login, document upload, analysis requests, report generation) for audit and security purposes. We never log raw document content, passwords, or personally identifiable text from your documents.</p>
          </section>

          <section>
            <h2 className="font-heading font-emphasis text-lg" style={{ color: INK }}>3. How We Use Your Information</h2>
            <p className="mt-3">We use your information to:</p>
            <ul className="mt-2 space-y-1.5 list-disc pl-5">
              <li>Provide, maintain, and improve the Platform</li>
              <li>Generate ODD analyses and reports based on your documents</li>
              <li>Verify SEC EDGAR registration and public filing data</li>
              <li>Maintain audit logs for compliance and security</li>
              <li>Communicate with you about your account and the Platform</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading font-emphasis text-lg" style={{ color: INK }}>4. AI Processing &mdash; Zero Data Retention</h2>
            <p className="mt-3">
              Alpine uses Anthropic&apos;s commercial API under a Data Processing Agreement (DPA) with a Zero Data Retention (ZDR) addendum. Your document content is <strong>never used to train, fine-tune, or modify any AI model</strong>. This is a contractual prohibition, not an opt-out. Document content sent to the API for analysis is not stored by Anthropic after processing.
            </p>
          </section>

          <section>
            <h2 className="font-heading font-emphasis text-lg" style={{ color: INK }}>5. Data Sharing</h2>
            <p className="mt-3">
              We do not sell, rent, or share your data with third parties for marketing purposes. The only third-party processor is Anthropic (for AI analysis), operating under the terms described in Section 4.
            </p>
          </section>

          <section>
            <h2 className="font-heading font-emphasis text-lg" style={{ color: INK }}>6. Data Retention</h2>
            <ul className="mt-3 space-y-1.5 list-disc pl-5">
              <li><strong>Uploaded documents:</strong> Deleted after analysis + 90 days</li>
              <li><strong>Reports:</strong> Retained for the duration of your engagement</li>
              <li><strong>Audit logs:</strong> Retained for a minimum of 1 year</li>
              <li><strong>Anonymized benchmarks:</strong> Retained indefinitely (no client-identifiable data)</li>
              <li>You may request full deletion of your data within 30 days by contacting us</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading font-emphasis text-lg" style={{ color: INK }}>7. Benchmarking</h2>
            <p className="mt-3">
              Alpine uses aggregated, anonymized patterns from completed reviews to improve analytical frameworks. No client-identifiable data is included. You may opt out of benchmarking by contacting us.
            </p>
          </section>

          <section>
            <h2 className="font-heading font-emphasis text-lg" style={{ color: INK }}>8. Security</h2>
            <p className="mt-3">
              We implement enterprise-grade security measures including TLS 1.3 encryption in transit, AES-256 encryption at rest, bcrypt password hashing, JWT-based authentication, and comprehensive audit logging. See our Security Overview for details.
            </p>
          </section>

          <section>
            <h2 className="font-heading font-emphasis text-lg" style={{ color: INK }}>9. Your Rights</h2>
            <p className="mt-3">You have the right to:</p>
            <ul className="mt-2 space-y-1.5 list-disc pl-5">
              <li>Access your personal data and uploaded documents</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data (within 30 days)</li>
              <li>Opt out of anonymized benchmarking</li>
              <li>Export your reports and analysis data</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading font-emphasis text-lg" style={{ color: INK }}>10. Contact</h2>
            <p className="mt-3">
              For privacy inquiries, data requests, or to exercise your rights, contact us at{" "}
              <a href="mailto:azhang@alpinedd.com" className="hover:underline" style={{ color: VIOLET }}>azhang@alpinedd.com</a>.
            </p>
          </section>
        </div>
      </main>
    </SubpageLayout>
  );
}
