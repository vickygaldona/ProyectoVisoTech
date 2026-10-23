import { ImageResponse } from "next/og";

export const alt = "VisoTech: webs visuales para negocios y eventos";
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
          background:
            "radial-gradient(circle at 20% 15%, #6b21a8 0%, #1e1b4b 40%, #000000 80%)",
          color: "#fafafa",
          padding: 80,
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 132,
            fontWeight: 700,
            letterSpacing: -3,
          }}
        >
          VisoTech
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 44,
            color: "#d4d4d8",
            textAlign: "center",
          }}
        >
          Webs visuales para negocios y eventos
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 56,
            fontSize: 30,
            color: "#67e8f9",
          }}
        >
          San Rafael, Mendoza
        </div>
      </div>
    ),
    { ...size },
  );
}
