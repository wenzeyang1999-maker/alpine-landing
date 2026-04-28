"use client";

import Link from "next/link";
import SubpageLayout from "@/components/SubpageLayout";
import { INK, MUTED, SUBTLE, BORDER, GREEN } from "@/lib/constants";

export default function ThankYouPage() {
  return (
    <SubpageLayout>
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6"
            style={{ background: `${GREEN}1A` }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <h1 className="font-heading font-emphasis text-2xl md:text-3xl mb-4" style={{ color: INK }}>
            You&apos;re in
          </h1>

          <p className="text-sm font-body leading-relaxed max-w-sm mx-auto mb-3" style={{ color: MUTED }}>
            Thanks for signing up. Your Alpine account is active.
          </p>

          <p className="text-sm font-body leading-relaxed max-w-sm mx-auto" style={{ color: MUTED }}>
            Your white paper access is being prepared. Our team will reach out shortly with next steps.
          </p>

          <div className="mt-10 pt-8" style={{ borderTop: `1px solid ${BORDER}` }}>
            <Link
              href="/"
              className="text-xs font-mono underline"
              style={{ color: SUBTLE }}
            >
              Back to alpinedd.com
            </Link>
          </div>
        </div>
      </div>
    </SubpageLayout>
  );
}
