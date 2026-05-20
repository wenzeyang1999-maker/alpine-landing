import type { Metadata } from "next";
import Link from "next/link";
import SubpageLayout from "@/components/SubpageLayout";
import { INK, MUTED, VIOLET } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Newsletter Terms & Conditions | Alpine Due Diligence",
};

export default function NewsletterTermsPage() {
  return (
    <SubpageLayout>
      <main className="flex-1 mx-auto max-w-3xl px-6 py-16 w-full">
        <h1 className="font-heading font-emphasis text-3xl" style={{ color: INK }}>
          Newsletter Terms &amp; Conditions
        </h1>
        <p className="mt-2 text-sm font-mono" style={{ color: MUTED }}>
          Last updated: May 19, 2026
        </p>

        <div className="mt-10 space-y-8 text-base leading-relaxed" style={{ color: INK }}>
          <section>
            <p>
              By subscribing to communications from Alpine Due Diligence Inc.
              (&ldquo;Alpine&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;), you agree to the
              terms below. These terms apply specifically to our newsletter, white-paper
              distribution, and related marketing communications. Our general{" "}
              <Link href="/terms" className="underline" style={{ color: VIOLET }}>
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline" style={{ color: VIOLET }}>
                Privacy Policy
              </Link>{" "}
              also apply.
            </p>
          </section>

          <section>
            <h2 className="font-heading font-emphasis text-lg" style={{ color: INK }}>
              1. Information We Collect
            </h2>
            <p className="mt-3">
              When you subscribe, we collect the name and email address you provide,
              together with the source of the subscription, a hashed record of your IP
              address, and your user-agent string. We retain a timestamp documenting your
              consent. If you confirm your subscription by clicking the link in the
              confirmation email, we additionally record the confirmation timestamp.
            </p>
          </section>

          <section>
            <h2 className="font-heading font-emphasis text-lg" style={{ color: INK }}>
              2. How We Use Your Information
            </h2>
            <p className="mt-3">
              We use the information you provide to send you our bi-weekly case analyses,
              white papers, product announcements, event invitations, and other content
              we believe will be of interest to operational due diligence and allocator
              professionals. We may personalize communications using the name and email
              you provide, and segment our list based on subscription source so that we
              can send relevant material.
            </p>
          </section>

          <section>
            <h2 className="font-heading font-emphasis text-lg" style={{ color: INK }}>
              3. Sharing With Our Partners
            </h2>
            <p className="mt-3">
              You acknowledge and agree that Alpine may share your subscriber
              information — including your name, email address, organization (if
              provided), and engagement signals (such as opens and clicks) — with Alpine&apos;s
              trusted business partners, co-authors, and content collaborators,
              including but not limited to Acephalt Inc. and other parties with whom
              Alpine co-produces research, hosts joint events, or runs joint marketing
              programs. Partners may use this information to contact you with material
              related to Alpine&apos;s offerings or joint initiatives. Partners are required
              to handle your information in a manner consistent with the principles set
              out in our Privacy Policy.
            </p>
            <p className="mt-3">
              We do not sell your information to unrelated third-party marketers.
            </p>
          </section>

          <section>
            <h2 className="font-heading font-emphasis text-lg" style={{ color: INK }}>
              4. Service Providers
            </h2>
            <p className="mt-3">
              We rely on third-party processors to operate the newsletter, including
              email-delivery providers (Resend), database hosting (Supabase), and
              analytics tools. These processors act on our instructions and have access
              to subscriber information only to the extent necessary to provide their
              services.
            </p>
          </section>

          <section>
            <h2 className="font-heading font-emphasis text-lg" style={{ color: INK }}>
              5. Unsubscribing &amp; Your Choices
            </h2>
            <p className="mt-3">
              You may unsubscribe at any time by using the unsubscribe link in any
              newsletter email or by contacting us at the address below. When you
              unsubscribe, we will stop sending you marketing emails, but we retain a
              suppression record (your email address and unsubscribe timestamp) so that
              we do not re-add you in error.
            </p>
            <p className="mt-3">
              You may also request that we delete your data entirely, in which case we
              will remove your subscriber record subject to any legal-retention
              obligations.
            </p>
          </section>

          <section>
            <h2 className="font-heading font-emphasis text-lg" style={{ color: INK }}>
              6. Data Retention
            </h2>
            <p className="mt-3">
              We retain subscriber information for as long as your subscription is
              active and for a reasonable period afterward to maintain audit and
              suppression records, after which it is deleted or anonymized.
            </p>
          </section>

          <section>
            <h2 className="font-heading font-emphasis text-lg" style={{ color: INK }}>
              7. Changes to These Terms
            </h2>
            <p className="mt-3">
              We may update these terms from time to time. Material changes will be
              communicated to subscribers by email. The &ldquo;Last updated&rdquo; date
              at the top of this page reflects the most recent revision.
            </p>
          </section>

          <section>
            <h2 className="font-heading font-emphasis text-lg" style={{ color: INK }}>
              8. Contact
            </h2>
            <p className="mt-3">
              Questions, unsubscribe requests, or data-deletion requests can be sent to{" "}
              <a
                href="mailto:azhang@alpinedd.com"
                className="underline"
                style={{ color: VIOLET }}
              >
                azhang@alpinedd.com
              </a>
              .
            </p>
          </section>
        </div>
      </main>
    </SubpageLayout>
  );
}
