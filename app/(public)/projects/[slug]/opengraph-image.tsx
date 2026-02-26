import { ImageResponse } from "next/og"
import { getProjectBySlug } from "@/data/projects"

export const runtime = "nodejs"
export const alt = "Project case study preview"
export const contentType = "image/png"
export const size = {
  width: 1200,
  height: 630,
}

type ProjectOgImageProps = {
  params: Promise<{
    slug: string
  }>
}

function getMetricLine(
  metrics?: {
    lighthouse?: number
    ttfb?: number
  }
): string | null {
  if (!metrics) {
    return null
  }

  const metricsText: string[] = []

  if (typeof metrics.lighthouse === "number") {
    metricsText.push(`Lighthouse ${metrics.lighthouse}`)
  }
  if (typeof metrics.ttfb === "number") {
    metricsText.push(`TTFB ${metrics.ttfb}ms`)
  }

  return metricsText.length > 0 ? metricsText.join(" | ") : null
}

export default async function ProjectOgImage({ params }: ProjectOgImageProps) {
  const { slug } = await params
  const project = getProjectBySlug(slug)

  if (!project) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background:
              "radial-gradient(circle at 20% 20%, #202330 0%, #0c0f18 55%, #090b12 100%)",
            color: "#f9fafb",
            fontSize: 58,
            fontWeight: 700,
            letterSpacing: "-0.02em",
          }}
        >
          AB.dev Case Study
        </div>
      ),
      size
    )
  }

  const metricLine = getMetricLine(project.metrics)
  const tags = project.meta.tags.slice(0, 3)

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background:
            "linear-gradient(155deg, #06080f 0%, #0b0f1a 48%, #111827 100%)",
          color: "#f8fafc",
          fontFamily:
            "ui-sans-serif, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.1,
            backgroundImage:
              "linear-gradient(to right, #60a5fa 1px, transparent 1px), linear-gradient(to bottom, #60a5fa 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: -160,
            right: -140,
            width: 520,
            height: 520,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(56, 189, 248, 0.28) 0%, rgba(56, 189, 248, 0) 70%)",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            padding: "64px 72px",
            zIndex: 1,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                fontSize: 27,
                color: "#cbd5e1",
                fontWeight: 600,
              }}
            >
              <span
                style={{
                  fontSize: 20,
                  padding: "8px 14px",
                  borderRadius: 999,
                  background: "rgba(148, 163, 184, 0.2)",
                  color: "#e2e8f0",
                }}
              >
                AB.dev
              </span>
              <span>{project.meta.type.toUpperCase()} Case Study</span>
            </div>
            <div
              style={{
                fontSize: 72,
                lineHeight: 1.02,
                letterSpacing: "-0.03em",
                fontWeight: 800,
                maxWidth: 980,
              }}
            >
              {project.meta.title}
            </div>
            <div
              style={{
                fontSize: 30,
                color: "#d1d5db",
                maxWidth: 980,
              }}
            >
              {project.shortDescription}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 18,
            }}
          >
            {metricLine ? (
              <div
                style={{
                  fontSize: 24,
                  color: "#7dd3fc",
                  fontWeight: 600,
                }}
              >
                {metricLine}
              </div>
            ) : null}
            <div style={{ display: "flex", gap: 10 }}>
              {tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontSize: 21,
                    color: "#e2e8f0",
                    background: "rgba(148, 163, 184, 0.22)",
                    border: "1px solid rgba(148, 163, 184, 0.3)",
                    borderRadius: 999,
                    padding: "8px 14px",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
    size
  )
}
