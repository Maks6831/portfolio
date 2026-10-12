import { ImageResponse } from "next/og";
import { siteMeta } from "@/content/site";

export const alt = siteMeta.imageAlt;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Colours mirror DESIGN.md (background, accent, text-secondary). The default sans font is used on purpose:
// ImageResponse ships one font, so no weights are set and nothing is fetched at request time.
export default function OpengraphImage() {
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
          background: "#000319",
          color: "#FFFFFF",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 88, letterSpacing: "-0.02em" }}>
          {siteMeta.name}
        </div>
        <div style={{ fontSize: 48, color: "#CBACF9", marginTop: 16 }}>
          {siteMeta.role}
        </div>
        <div
          style={{ width: 160, height: 6, background: "#CBACF9", margin: "40px 0" }}
        />
        <div style={{ fontSize: 32, color: "#BEC1DD", lineHeight: 1.35, maxWidth: 1008 }}>
          {siteMeta.imageLine}
        </div>
      </div>
    ),
    { ...size },
  );
}
