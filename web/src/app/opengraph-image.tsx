import { ImageResponse } from "next/og";
import { SITE } from "@/lib/seo";

export const runtime = "edge";
export const alt = `${SITE.name} — ${SITE.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#12100C",
          color: "#ffffff",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            width: 150,
            height: 150,
            borderRadius: "50%",
            border: "2px solid #C6982C",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#E7CD8A",
            fontSize: 64,
          }}
        >
          هجر
        </div>
        <div
          style={{
            marginTop: 48,
            fontSize: 88,
            letterSpacing: 28,
            color: "#ffffff",
          }}
        >
          HAJAR
        </div>
        <div
          style={{
            marginTop: 20,
            width: 120,
            height: 2,
            background: "#C6982C",
          }}
        />
        <div
          style={{
            marginTop: 32,
            fontSize: 28,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.62)",
          }}
        >
          {SITE.tagline}
        </div>
      </div>
    ),
    size
  );
}
