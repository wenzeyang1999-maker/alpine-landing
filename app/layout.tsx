import type { Metadata } from "next";
import localFont from "next/font/local";
import "@/styles/globals.css";
import { BG, INK } from "@/lib/constants";

const alpineHeading = localFont({
  src: [
    { path: "../public/fonts/InstrumentSans-Regular.ttf", weight: "400", style: "normal" },
    { path: "../public/fonts/InstrumentSans-Bold.ttf", weight: "600", style: "normal" },
    { path: "../public/fonts/InstrumentSans-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-alpine-heading",
  display: "swap",
});

const alpineBody = localFont({
  src: [
    { path: "../public/fonts/InstrumentSans-Regular.ttf", weight: "400", style: "normal" },
    { path: "../public/fonts/InstrumentSans-Bold.ttf", weight: "500", style: "normal" },
    { path: "../public/fonts/InstrumentSans-Bold.ttf", weight: "600", style: "normal" },
    { path: "../public/fonts/InstrumentSans-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-alpine-body",
  display: "swap",
});

const alpineMono = localFont({
  src: [
    { path: "../public/fonts/IBMPlexMono-Regular.ttf", weight: "400", style: "normal" },
    { path: "../public/fonts/IBMPlexMono-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-alpine-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Alpine Due Diligence — AI-Powered ODD Platform",
  description: "Replace 40-hour manual operational due diligence with 45-minute AI assessments. Document upload, 12-topic gap analysis, SEC verification, and IC-ready report generation.",
  icons: { icon: "/alpine-icon.svg" },
  openGraph: {
    title: "Alpine Due Diligence — AI-Powered ODD Platform",
    description: "Self-service AI platform automating operational due diligence for institutional investors.",
    siteName: "Alpine Due Diligence",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Alpine Due Diligence — AI-Powered ODD Platform",
    description: "Replace 40-hour manual ODD with 45-minute AI assessments.",
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL("https://alpinedd.com"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${alpineHeading.variable} ${alpineBody.variable} ${alpineMono.variable}`}
    >
      <body style={{ backgroundColor: BG, color: INK }}>
        {children}
      </body>
    </html>
  );
}
