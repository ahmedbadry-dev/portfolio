import { ImageResponse } from "next/og"

export const runtime = "nodejs"
export const contentType = "image/png"
export const revalidate = false

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          position: "relative",
          overflow: "hidden",
          background:
            "linear-gradient(145deg, #070a12 0%, #0c1221 52%, #151f31 100%)",
          color: "#f8fafc",
          fontFamily:
            "ui-sans-serif, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.1,
            backgroundImage:
              "linear-gradient(to right, #38bdf8 1px, transparent 1px), linear-gradient(to bottom, #38bdf8 1px, transparent 1px)",
            backgroundSize: "52px 52px",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: -220,
            right: -160,
            width: 600,
            height: 600,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(56, 189, 248, 0.32) 0%, rgba(56, 189, 248, 0) 72%)",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            padding: "72px",
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 22,
            }}
          >
            <div
            style={{
                display: "flex",
                fontSize: 24,
                color: "#e2e8f0",
                border: "1px solid rgba(148, 163, 184, 0.35)",
                borderRadius: 999,
                padding: "9px 16px",
                background: "rgba(148, 163, 184, 0.2)",
              }}
            >
              AB.dev
            </div>
            <div
              style={{
                fontSize: 78,
                lineHeight: 1,
                letterSpacing: "-0.03em",
                fontWeight: 800,
                maxWidth: 980,
              }}
            >
              Ahmed Badry
            </div>
            <div
              style={{
                fontSize: 44,
                color: "#dbeafe",
                fontWeight: 600,
              }}
            >
              Frontend Engineer
            </div>
          </div>
          <div
            style={{
              fontSize: 28,
              color: "#cbd5e1",
              maxWidth: 980,
            }}
          >
            Building scalable Next.js and React systems with strong architecture,
            performance discipline, and polished UI.
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
