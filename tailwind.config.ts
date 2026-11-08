import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    // DESIGN.md (ux-portfolio-2026-11-07) "Conservatory": the colour set is replaced, not extended. The site is dark
    // only, one hue (accent), and the v2 navy and lavender tokens are gone.
    colors: {
      transparent: "transparent",
      current: "currentColor",
      inherit: "inherit",
      stage: "#0A1410",
      bezel: "#122119",
      screen: "#06100B",
      line: "#1F3329",
      text: {
        DEFAULT: "#E6F2EB",
        secondary: "#AFC7B9",
      },
      muted: "#86A393",
      accent: {
        DEFAULT: "#B9F0D3",
        pressed: "#86D4AE",
      },
      "focus-ring": "#B9F0D3",
      "ring-glow": "#B9F0D333",
      scrim: "#0A1410F0",
      "shadow-sheet": "#00000073",
      "shadow-laptop": "#00000099",
      "shadow-tab": "#00000066",
    },
    // Two system stacks, no web font (DESIGN.md Typography).
    fontFamily: {
      sans: ['ui-sans-serif', 'system-ui', '-apple-system', '"Segoe UI"', 'Helvetica', 'Arial', 'sans-serif'],
      mono: ['ui-monospace', '"SF Mono"', 'Menlo', 'Consolas', 'monospace'],
    },
    // Layout-mode queries use em so a larger default font raises the gate (EXPERIENCE.md Responsive); same widths at 16px.
    screens: { sm: "40em", md: "48em", lg: "64em", xl: "80em", "2xl": "96em" },
    extend: {
      fontSize: {
        display: ["56px", { lineHeight: "1.08", letterSpacing: "-0.02em", fontWeight: "700" }],
        "display-mobile": ["36px", { lineHeight: "1.12", letterSpacing: "-0.02em", fontWeight: "700" }],
        heading: ["32px", { lineHeight: "1.2", fontWeight: "700" }],
        subheading: ["20px", { lineHeight: "1.3", fontWeight: "600" }],
        body: ["17px", { lineHeight: "1.65", fontWeight: "400" }],
        caption: ["14px", { lineHeight: "1.5", fontWeight: "400" }],
        eyebrow: ["12px", { lineHeight: "1.4", letterSpacing: "0.14em", fontWeight: "600" }],
        code: ["14px", { lineHeight: "1.6" }],
      },
      spacing: {
        unit: "4px",
        "margin-desktop": "64px",
        "margin-tablet": "40px",
        "margin-mobile": "20px",
        gutter: "48px",
        "tile-gap": "14px",
        "hud-strip": "32px",
        "hud-inset-x": "24px",
        "hud-inset-y": "18px",
        "sheet-tab-step": "36px",
        "sheet-tab-step-mobile": "32px",
        "toc-column": "368px",
        "hero-min-height": "720px",
        "chrome-min-height": "500px",
        "measure-hero-copy": "580px",
        "measure-copy": "520px",
        "measure-lede-case-study": "620px",
        "measure-content": "736px",
        "frame-max": "1140px",
        "sheet-body-padding-top": "44px",
        "sheet-body-padding-bottom": "64px",
        "section-gap": "72px",
        "section-gap-mobile": "32px",
        "target-min": "44px",
        "target-floor": "24px",
      },
      borderRadius: {
        sm: "3px",
        DEFAULT: "4px",
        md: "6px",
        lg: "12px",
        full: "9999px",
      },
    },
  },
  plugins: [],
} satisfies Config;

export default config;
