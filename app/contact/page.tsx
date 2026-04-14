import type { Metadata } from "next";
import Image from "next/image";
import SubpageLayout from "@/components/SubpageLayout";
import { INK, SECONDARY, MUTED, VIOLET } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact | Alpine Due Diligence",
};

export default function ContactPage() {
  return (
    <SubpageLayout>
      <main className="flex-1 mx-auto max-w-3xl px-6 py-16 w-full">
        <h1 className="font-heading font-emphasis text-3xl" style={{ color: INK }}>Contact</h1>
        <p className="mt-2 text-sm font-mono" style={{ color: MUTED }}>Alpine Due Diligence Inc. &middot; Ontario, Canada</p>

        <div className="mt-12 space-y-10" style={{ color: INK }}>
          <div className="flex items-center gap-6">
            <Image
              src="/allen-zhang-headshot.jpeg"
              alt="Allen Zhang"
              width={96}
              height={96}
              className="rounded-full object-cover"
              style={{ width: 96, height: 96 }}
            />
            <div>
              <p className="text-sm font-mono font-ui uppercase tracking-wider" style={{ color: MUTED }}>Founder &amp; CEO</p>
              <p className="mt-1 text-xl font-heading font-emphasis" style={{ color: INK }}>Allen Zhang</p>
            </div>
          </div>

          <p className="text-base font-body leading-relaxed" style={{ color: SECONDARY }}>
            Allen spent three years as a senior operational due diligence analyst, conducting ODD reviews across hedge funds, private equity, and real assets for institutional allocators globally. He founded Alpine to bring that methodology into software — replacing manual, weeks-long reviews with AI-powered analysis that institutional investors can run on their own terms.
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={MUTED} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              <a href="mailto:azhang@alpinedd.com" className="text-base font-body hover:underline" style={{ color: VIOLET }}>azhang@alpinedd.com</a>
            </div>

            <div className="flex items-start gap-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={MUTED} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <a href="tel:+15143574178" className="text-base font-body hover:underline" style={{ color: VIOLET }}>+1 (514) 357-4178</a>
            </div>

            <div className="flex items-start gap-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={MUTED} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect width="4" height="12" x="2" y="9" />
                <circle cx="4" cy="4" r="2" />
              </svg>
              <a href="https://www.linkedin.com/in/kaishen-allen-zhang/" target="_blank" rel="noopener noreferrer" className="text-base font-body hover:underline" style={{ color: VIOLET }}>linkedin.com/in/kaishen-allen-zhang</a>
            </div>
          </div>
        </div>
      </main>
    </SubpageLayout>
  );
}
