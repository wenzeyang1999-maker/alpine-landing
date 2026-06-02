"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { GREEN, AMBER, VIOLET } from "@/lib/constants";
import FloatingSubscribe from "@/components/FloatingSubscribe";

const PDF_URL = "/the-carvana-case.pdf";

export default function CarvanaView() {
  const router = useRouter();
  const [zoom, setZoom] = useState(1);
  const changeZoom = (delta: number) =>
    setZoom((z) => Math.min(2, Math.max(0.5, Math.round((z + delta) * 10) / 10)));

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#ebebeb" }}>
      <style>{`
        @media (max-width: 768px) {
          [data-cs-zoom]          { display: none !important; }
          [data-cs-book]          { display: none !important; }
          [data-cs-back-label]    { display: none !important; }
          [data-cs-back-btn]      { padding: 6px 8px !important; }
          [data-cs-download-btn]  { padding: 6px 12px !important; font-size: 12px !important; }
          [data-cs-header-inner]  { padding: 0 12px !important; height: 56px !important; }
        }
      `}</style>

      {/* Header */}
      <header>
        {/* Summit gradient accent */}
        <div style={{ height: 2, background: `linear-gradient(90deg, ${GREEN}, ${AMBER}, ${VIOLET})` }} />
        <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb" }}>
          <div
            data-cs-header-inner
            style={{
              maxWidth: 900,
              margin: "0 auto",
              padding: "0 24px",
              height: 64,
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            {/* Back */}
            <button
              data-cs-back-btn
              type="button"
              onClick={() => router.back()}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "6px 14px", borderRadius: 6,
                border: "1px solid #e5e7eb", background: "#fff",
                fontSize: 13, fontWeight: 500, color: "#374151",
                cursor: "pointer", flexShrink: 0,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              <span data-cs-back-label>Back</span>
            </button>

            {/* Logo */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/alpine-logo-dark.svg?v=5" alt="Alpine Due Diligence" style={{ height: 36, width: "auto" }} />

            <div style={{ flex: 1 }} />

            {/* Book a Meeting */}
            <a
              data-cs-book
              href="https://calendly.com/alpinedd"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: "7px 16px", borderRadius: 6,
                border: "1px solid #e5e7eb", background: "#fff",
                fontSize: 13, fontWeight: 500, color: "#374151",
                cursor: "pointer", textDecoration: "none", flexShrink: 0,
              }}
            >
              Book a Meeting
            </a>

            {/* Download */}
            <a
              data-cs-download-btn
              href={PDF_URL}
              download="The Carvana Case — Alpine Due Diligence.pdf"
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "7px 16px", borderRadius: 6,
                background: "#0f0f10", color: "#fff",
                fontSize: 13, fontWeight: 600,
                cursor: "pointer", textDecoration: "none", flexShrink: 0,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download
            </a>

            {/* Zoom controls */}
            <div
              data-cs-zoom
              style={{
                display: "flex", alignItems: "center", gap: 4,
                padding: "4px 8px", borderRadius: 6,
                border: "1px solid #e5e7eb", background: "#fff",
              }}
            >
              <button type="button" onClick={() => changeZoom(-0.1)} style={{ width: 24, height: 24, border: "none", background: "none", cursor: "pointer", fontSize: 16, color: "#374151", display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
              <span style={{ fontSize: 12, fontWeight: 500, color: "#374151", minWidth: 36, textAlign: "center" }}>{Math.round(zoom * 100)}%</span>
              <button type="button" onClick={() => changeZoom(0.1)} style={{ width: 24, height: 24, border: "none", background: "none", cursor: "pointer", fontSize: 16, color: "#374151", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
            </div>
          </div>
        </div>
      </header>

      {/* PDF Viewer */}
      <div style={{ flex: 1, overflowY: "auto", padding: "32px 0" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
          <div
            style={{
              transformOrigin: "top center",
              transform: `scale(${zoom})`,
              transition: "transform 0.15s ease",
            }}
          >
            <object
              data={PDF_URL}
              type="application/pdf"
              style={{
                width: "100%",
                height: "calc(100vh - 120px)",
                minHeight: 800,
                border: "none",
                borderRadius: 8,
                boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
                display: "block",
              }}
            >
              {/* Fallback for browsers that don't support inline PDF */}
              <div style={{ background: "#fff", borderRadius: 8, padding: 48, textAlign: "center" }}>
                <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 16 }}>
                  Your browser doesn&apos;t support inline PDF viewing.
                </p>
                <a
                  href={PDF_URL}
                  download
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    padding: "10px 20px", borderRadius: 6,
                    background: "#0f0f10", color: "#fff",
                    fontSize: 13, fontWeight: 600, textDecoration: "none",
                  }}
                >
                  Download PDF
                </a>
              </div>
            </object>
          </div>
        </div>
      </div>

      <FloatingSubscribe source="carvana-case" heading="ODD case study, every other Tuesday." />
    </div>
  );
}
