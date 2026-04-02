import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import {
  ANALYTICS_ROUTE_TYPES,
  type AnalyticsRouteType,
  recordPageViewInConvex,
} from "@/lib/analytics/convex"

const ANALYTICS_VISITOR_COOKIE = "ab_vid"
const ANALYTICS_VISITOR_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 180
const BOT_USER_AGENT_PATTERN =
  /(bot|crawler|spider|crawling|facebookexternalhit|discordbot|slackbot|whatsapp|telegrambot|preview)/i

const payloadSchema = z
  .object({
    routeType: z.enum(ANALYTICS_ROUTE_TYPES),
    slug: z.string().trim().optional(),
  })
  .superRefine((value, ctx) => {
    if (value.routeType === "project") {
      const slug = value.slug?.trim() ?? ""
      if (!slug) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["slug"],
          message: "Project slug is required for project route analytics.",
        })
      }
    }
  })

function getOrCreateVisitorId(existingValue?: string): {
  visitorId: string
  generated: boolean
} {
  const normalized = existingValue?.trim()
  if (normalized && /^[a-zA-Z0-9_-]{12,80}$/.test(normalized)) {
    return { visitorId: normalized, generated: false }
  }

  return {
    visitorId: crypto.randomUUID().replace(/-/g, ""),
    generated: true,
  }
}

function toTrimmedUserAgent(request: NextRequest): string | undefined {
  const userAgent = request.headers.get("user-agent")?.trim()
  if (!userAgent) return undefined
  return userAgent.slice(0, 256)
}

function isLikelyBot(userAgent?: string): boolean {
  if (!userAgent) return false
  return BOT_USER_AGENT_PATTERN.test(userAgent)
}

function toPath(routeType: AnalyticsRouteType, slug?: string): string {
  if (routeType === "home") return "/"
  if (routeType === "work") return "/work"
  return `/projects/${slug}`
}

export async function POST(request: NextRequest) {
  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid JSON payload." },
      { status: 400 }
    )
  }

  const parsedPayload = payloadSchema.safeParse(payload)
  if (!parsedPayload.success) {
    const first = parsedPayload.error.issues[0]
    return NextResponse.json(
      {
        success: false,
        message: first?.message ?? "Invalid analytics payload.",
      },
      { status: 400 }
    )
  }

  const visitor = getOrCreateVisitorId(
    request.cookies.get(ANALYTICS_VISITOR_COOKIE)?.value
  )
  const userAgent = toTrimmedUserAgent(request)

  if (isLikelyBot(userAgent)) {
    const response = NextResponse.json({
      success: true,
      counted: false,
      deduped: false,
      reason: "bot",
    })

    if (visitor.generated) {
      response.cookies.set({
        name: ANALYTICS_VISITOR_COOKIE,
        value: visitor.visitorId,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: ANALYTICS_VISITOR_COOKIE_MAX_AGE_SECONDS,
      })
    }

    return response
  }

  try {
    const result = await recordPageViewInConvex({
      routeType: parsedPayload.data.routeType,
      ...(parsedPayload.data.routeType === "project" && parsedPayload.data.slug
        ? { slug: parsedPayload.data.slug.trim() }
        : {}),
      visitorId: visitor.visitorId,
      userAgent,
    })

    const response = NextResponse.json({
      success: true,
      counted: result.counted,
      deduped: result.deduped,
      path: toPath(parsedPayload.data.routeType, parsedPayload.data.slug?.trim()),
    })

    if (visitor.generated) {
      response.cookies.set({
        name: ANALYTICS_VISITOR_COOKIE,
        value: visitor.visitorId,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: ANALYTICS_VISITOR_COOKIE_MAX_AGE_SECONDS,
      })
    }

    return response
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to record analytics view."
    return NextResponse.json({ success: false, message }, { status: 500 })
  }
}

