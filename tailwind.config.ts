import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Alpine landing typography: strong heading + readable body + audit-style mono
      fontFamily: {
        sans: ["var(--font-alpine-body)", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "system-ui", "sans-serif"],
        heading: ["var(--font-alpine-heading)", "var(--font-alpine-body)", "sans-serif"],
        body: ["var(--font-alpine-body)", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "system-ui", "sans-serif"],
        mono: ["var(--font-alpine-mono)", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      // Linear's letter-spacing scale (negative at display sizes)
      letterSpacing: {
        "display":  "-0.066em",  // 48px → -1.056px
        "h1":       "-0.022em",  // 32px → -0.704px
        "h2":       "-0.012em",  // 24px → -0.288px
        "h3":       "-0.012em",  // 20px → -0.24px
        "body":     "-0.009em",  // 18px → -0.165px
      },
      // Linear's font weights (400 / 510≈medium / 590≈semibold)
      fontWeight: {
        light:    "300",
        normal:   "400",
        ui:       "500",   // closest to 510
        emphasis: "600",   // closest to 590
      },
      colors: {
        alpine: {
          violet:       "#7B2CBF",
          "violet-hover": "#9333EA",
          green:        "#10B981",
          amber:        "#F59E0B",
          ink:          "#0F0F10",
          secondary:    "#3A3A4A",
          muted:        "#6B7280",
          subtle:       "#9CA3AF",
          bg:           "#F7F8F8",
          "bg-alt":     "#F3F4F5",
          card:         "#FFFFFF",
          border:       "#E5E7EB",
          "border-subtle": "#F3F4F6",
        },
      },
      // Linear's 8px base spacing rhythm
      spacing: {
        "4.5": "1.125rem",  // 18px
        "13":  "3.25rem",   // 52px
        "18":  "4.5rem",    // 72px
        "22":  "5.5rem",    // 88px
      },
      borderRadius: {
        "micro":  "2px",
        "btn":    "6px",
        "card":   "8px",
        "panel":  "12px",
        "large":  "22px",
      },
    },
  },
  plugins: [],
};

export default config;
