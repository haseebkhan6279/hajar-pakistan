import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { SITE } from "@/lib/seo";

export const runtime = "nodejs";
export const alt = `${SITE.name} — ${SITE.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const mark = await readFile(
    join(process.cwd(), "public/brand/hajar-mark.png")
  );
  const markSrc = `data:image/png;base64,${mark.toString("base64")}`;

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
          background: "#000000",
          color: "#ffffff",
          fontFamily: "Georgia, serif",
        }}
      >
        <img
          src={markSrc}
          width={168}
          height={168}
          alt=""
          style={{ borderRadius: 999 }}
        />
        <div
          style={{
            marginTop: 40,
            fontSize: 88,
            letterSpacing: 28,
            color: "#E8C96A",
          }}
        >
          HAJAR
        </div>
        <div
          style={{
            marginTop: 16,
            fontSize: 22,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: "rgba(232,201,106,0.72)",
          }}
        >
          by Nazish Ali
        </div>
        <div
          style={{
            marginTop: 28,
            width: 120,
            height: 1,
            background: "#C6982C",
          }}
        />
        <div
          style={{
            marginTop: 28,
            fontSize: 26,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.55)",
          }}
        >
          {SITE.tagline}
        </div>
      </div>
    ),
    size
  );
}
