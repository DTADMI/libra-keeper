import { ImageResponse } from "next/og";

/**
 * Site-wide Open Graph image.
 *
 * Why: without this file Next declares no `og:image`, so a pasted link shows a
 * bare URL with no thumbnail in WhatsApp, Signal, Telegram, Discord, Slack,
 * LinkedIn or X. Next wires this file convention to `og:image` and
 * `twitter:image` on every page automatically.
 */
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "libra keeper - libra keeper";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0b0b12",
          backgroundImage: "radial-gradient(circle at 18% 16%, #2a1b4d 0%, #0b0b12 60%)",
          padding: "72px",
          color: "#f7f7fb",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 26, letterSpacing: 4, color: "#b9a6ff" }}>
          LIBRA KEEPER
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "flex", fontSize: 72, fontWeight: 700, lineHeight: 1.1 }}>
            libra keeper
          </div>
          <div style={{ display: "flex", fontSize: 30, color: "#b9b9c7" }}>Analyse, outils et projets ouverts.</div>
        </div>
        <div style={{ display: "flex", fontSize: 24, color: "#b9a6ff" }}>librakeeper.ca</div>
      </div>
    ),
    size,
  );
}
