"use client";

import * as React from "react";
import { INK, SECONDARY, VIOLET, LS_BODY } from "@/lib/constants";

type SectionHeaderProps = {
  eyebrow: string;
  title: React.ReactNode;
  sub: string;
  eyebrowColor?: string;
  className?: string;
};

export default function SectionHeader({
  eyebrow,
  title,
  sub,
  eyebrowColor = VIOLET,
  className = "",
}: SectionHeaderProps) {
  return (
    <div className={`max-w-2xl mb-12 ${className}`.trim()}>
      <p
        className="font-mono text-[11px] uppercase mb-3"
        style={{ color: eyebrowColor, fontWeight: 700, letterSpacing: "0.1em" }}
      >
        {eyebrow}
      </p>
      <h2
        className="font-heading mb-4"
        style={{
          fontSize: "2rem",
          fontWeight: 700,
          lineHeight: 1.08,
          letterSpacing: "-0.038em",
          color: INK,
        }}
      >
        {title}
      </h2>
      <p
        className="font-body"
        style={{
          fontSize: "1.0625rem",
          lineHeight: 1.65,
          letterSpacing: LS_BODY,
          color: SECONDARY,
        }}
      >
        {sub}
      </p>
    </div>
  );
}
