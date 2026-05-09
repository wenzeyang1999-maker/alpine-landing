"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import SubpageLayout from "@/components/SubpageLayout";
import {
  INK,
  SECONDARY,
  MUTED,
  GREEN,
  AMBER,
  BORDER,
  LS_BODY,
} from "@/lib/constants";

type Variant = "confirmed" | "unsubscribed" | "invalid";

const COPY: Record<Variant, { title: string; body: string; color: string }> = {
  confirmed: {
    title: "Subscription confirmed.",
    body: "You'll receive Alpine's monthly ODD insights. First issue in your inbox within a week.",
    color: GREEN,
  },
  unsubscribed: {
    title: "Unsubscribed.",
    body: "Sorry to see you go. You can resubscribe anytime from the Alpine landing page.",
    color: MUTED,
  },
  invalid: {
    title: "Link expired or invalid.",
    body: "Try requesting a new confirmation email from the subscribe section.",
    color: AMBER,
  },
};

function CheckIcon({ color }: { color: string }) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function MinusIcon({ color }: { color: string }) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function AlertIcon({ color }: { color: string }) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function ConfirmedInner() {
  const params = useSearchParams();
  const error = params.get("error");
  const unsubscribed = params.get("unsubscribed");

  let variant: Variant = "confirmed";
  if (error === "invalid") variant = "invalid";
  else if (unsubscribed === "1") variant = "unsubscribed";

  const { title, body, color } = COPY[variant];
  const Icon =
    variant === "unsubscribed"
      ? MinusIcon
      : variant === "invalid"
      ? AlertIcon
      : CheckIcon;

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md text-center">
        <div
          className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6"
          style={{ background: `${color}1A` }}
        >
          <Icon color={color} />
        </div>
        <h1
          className="font-heading font-emphasis text-2xl"
          style={{ color: INK }}
        >
          {title}
        </h1>
        <p
          className="mt-3 text-sm font-body leading-relaxed max-w-sm mx-auto"
          style={{ color: SECONDARY, letterSpacing: LS_BODY }}
        >
          {body}
        </p>

        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-btn font-body text-sm transition-colors min-w-[160px]"
            style={{ color: INK, border: `1px solid ${BORDER}` }}
          >
            Back to Alpine →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SubscribeConfirmedPage() {
  return (
    <SubpageLayout>
      <Suspense fallback={<div className="flex-1" />}>
        <ConfirmedInner />
      </Suspense>
    </SubpageLayout>
  );
}
