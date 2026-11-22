import { ImageResponse } from "next/og";

// The 1200x630 share card used by both opengraph-image.tsx files. Colours mirror DESIGN.md Conservatory (stage, text,
// accent, text-secondary) as raw values because ImageResponse cannot read Tailwind tokens. The default sans font is
// used on purpose: ImageResponse ships one font, so no weights are set and nothing is fetched at request time.
export const ogSize = { width: 1200, height: 630 };

type Card = { kicker?: string; title: string; subtitle?: string; line: string };

export function ogCard({ kicker, title, subtitle, line }: Card) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 96px",
          background: "#0A1410",
          color: "#E6F2EB",
          fontFamily: "sans-serif",
        }}
      >
        {kicker ? (
          <div style={{ fontSize: 28, color: "#B9F0D3", letterSpacing: "0.06em", marginBottom: 20 }}>{kicker}</div>
        ) : null}
        <div style={{ fontSize: 88, letterSpacing: "-0.02em" }}>{title}</div>
        {subtitle ? <div style={{ fontSize: 48, color: "#B9F0D3", marginTop: 16 }}>{subtitle}</div> : null}
        <div style={{ width: 160, height: 6, background: "#B9F0D3", margin: "40px 0" }} />
        <div style={{ fontSize: 32, color: "#AFC7B9", lineHeight: 1.35, maxWidth: 1008 }}>{line}</div>
      </div>
    ),
    { ...ogSize },
  );
}
