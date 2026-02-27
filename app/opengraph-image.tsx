import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "Ahmed Badry - Frontend Engineer"
export const contentType = "image/png"
export const size = {
  width: 1200,
  height: 630,
}

const palette = {
  base: "#0B0F1A",
  mid: "#111827",
  accent: "#38bdf8",
  text: "#f8fafc",
  muted: "rgba(248, 250, 252, 0.62)",
  grid: "rgba(148, 163, 184, 0.08)",
}

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          background: `linear-gradient(135deg, ${palette.base} 0%, #0d1320 45%, ${palette.mid} 100%)`,
          color: palette.text,
          fontFamily:
            "ui-sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            backgroundImage: [
              `linear-gradient(to right, ${palette.grid} 1px, transparent 1px)`,
              `linear-gradient(to bottom, ${palette.grid} 1px, transparent 1px)`,
            ].join(", "),
            backgroundSize: "64px 64px",
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background:
              "radial-gradient(circle at 20% 32%, rgba(56, 189, 248, 0.2) 0%, rgba(56, 189, 248, 0.08) 22%, rgba(56, 189, 248, 0) 56%)",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: -140,
            right: -80,
            width: 520,
            height: 520,
            display: "flex",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(59, 130, 246, 0.16) 0%, rgba(59, 130, 246, 0.08) 28%, rgba(59, 130, 246, 0) 72%)",
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            boxShadow: "inset 0 0 140px rgba(2, 6, 23, 0.42)",
          }}
        />

        <div
          style={{
            position: "absolute",
            right: 112,
            top: 102,
            bottom: 102,
            width: 1,
            display: "flex",
            background: "linear-gradient(to bottom, rgba(56, 189, 248, 0), rgba(56, 189, 248, 0.24), rgba(56, 189, 248, 0))",
          }}
        />

        <div
          style={{
            position: "absolute",
            right: 113,
            top: 176,
            width: 150,
            height: 150,
            display: "flex",
            borderTop: "1px solid rgba(56, 189, 248, 0.2)",
            borderRight: "1px solid rgba(56, 189, 248, 0.2)",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            height: "100%",
            display: "flex",
            padding: "104px",
          }}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
            }}
          >
            <div
              style={{
                maxWidth: 720,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  marginBottom: 56,
                  fontSize: 26,
                  lineHeight: 1,
                  fontWeight: 600,
                  letterSpacing: "-0.03em",
                  color: "rgba(248, 250, 252, 0.44)",
                }}
              >
                AB.dev
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    margin: 0,
                    fontSize: 106,
                    lineHeight: 0.92,
                    fontWeight: 800,
                    letterSpacing: "-0.04em",
                    color: palette.text,
                    textShadow: "0 8px 30px rgba(15, 23, 42, 0.28)",
                  }}
                >
                  Ahmed Badry
                </div>

                <div
                  style={{
                    display: "flex",
                    marginTop: 28,
                    fontSize: 34,
                    lineHeight: 1.1,
                    fontWeight: 600,
                    letterSpacing: "-0.02em",
                    color: palette.accent,
                    textShadow: "0 0 18px rgba(56, 189, 248, 0.18)",
                  }}
                >
                  Frontend Engineer
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  marginTop: 64,
                  width: 84,
                  height: 2,
                  background:
                    "linear-gradient(to right, rgba(56, 189, 248, 0.75), rgba(56, 189, 248, 0))",
                }}
              />

              <div
                style={{
                  display: "flex",
                  marginTop: 18,
                  fontSize: 18,
                  lineHeight: 1,
                  fontWeight: 500,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: palette.muted,
                }}
              >
                Precision in systems, polish in interface
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    size
  )
}
