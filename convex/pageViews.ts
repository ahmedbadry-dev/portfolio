import { mutation, query } from "./_generated/server"
import { v } from "convex/values"
const ROUTE_TYPES = ["home", "work", "project"] as const
const DEFAULT_COOLDOWN_SECONDS = 60

function getCooldownMs(): number {
  const raw = process.env.ANALYTICS_VIEW_COOLDOWN_SECONDS?.trim()
  if (!raw) return DEFAULT_COOLDOWN_SECONDS * 1000

  const parsed = Number.parseInt(raw, 10)
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return DEFAULT_COOLDOWN_SECONDS * 1000
  }

  return parsed * 1000
}

function requireAnalyticsAdminKey(adminKey: string): void {
  const expected = process.env.CONVEX_ADMIN_MUTATION_KEY
  if (!expected) {
    throw new Error("CONVEX_ADMIN_MUTATION_KEY is not configured.")
  }
  if (adminKey !== expected) {
    throw new Error("Unauthorized analytics operation.")
  }
}

function normalizeSlug(slug: string): string {
  return slug
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function normalizeVisitorId(visitorId: string): string {
  return visitorId.trim()
}

function normalizeRouteKey(routeType: (typeof ROUTE_TYPES)[number], slug?: string): string {
  if (routeType === "project") {
    const normalizedSlug = normalizeSlug(slug ?? "")
    if (!normalizedSlug) {
      throw new Error("Project slug is required for project analytics.")
    }
    return `project:${normalizedSlug}`
  }

  return routeType
}

function normalizePath(routeType: (typeof ROUTE_TYPES)[number], slug?: string): string {
  if (routeType === "home") return "/"
  if (routeType === "work") return "/work"
  if (routeType === "project") {
    const normalizedSlug = normalizeSlug(slug ?? "")
    if (!normalizedSlug) {
      throw new Error("Project slug is required for project analytics.")
    }
    return `/projects/${normalizedSlug}`
  }

  throw new Error("Unsupported analytics route type.")
}

function inferRouteFromPath(path?: string): {
  routeType: (typeof ROUTE_TYPES)[number]
  slug?: string
} | null {
  if (!path) return null

  const normalizedPath = path.trim()
  if (!normalizedPath) return null
  if (normalizedPath === "/") {
    return { routeType: "home" }
  }
  if (normalizedPath === "/work") {
    return { routeType: "work" }
  }
  if (normalizedPath.startsWith("/projects/")) {
    const slug = normalizeSlug(normalizedPath.replace("/projects/", ""))
    if (!slug) return null
    return { routeType: "project", slug }
  }

  return null
}

export const record = mutation({
  args: {
    adminKey: v.string(),
    routeType: v.union(v.literal("home"), v.literal("work"), v.literal("project")),
    slug: v.optional(v.string()),
    visitorId: v.string(),
    userAgent: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    requireAnalyticsAdminKey(args.adminKey)

    const routeKey = normalizeRouteKey(args.routeType, args.slug)
    const path = normalizePath(args.routeType, args.slug)
    const visitorId = normalizeVisitorId(args.visitorId)
    if (!visitorId) {
      throw new Error("Visitor id is required.")
    }

    const now = Date.now()
    const cooldownMs = getCooldownMs()
    const windowStart = now - cooldownMs
    const recentByVisitor = await ctx.db
      .query("pageViews")
      .withIndex("by_visitor_route_visited", (q) =>
        q
          .eq("visitorId", visitorId)
          .eq("routeKey", routeKey)
          .gte("visitedAt", windowStart)
      )
      .collect()

    if (recentByVisitor.length > 0) {
      const latestVisitedAt = recentByVisitor.reduce(
        (latest, entry) => (entry.visitedAt > latest ? entry.visitedAt : latest),
        0
      )
      return {
        counted: false,
        deduped: true,
        visitedAt: latestVisitedAt,
        path,
      }
    }

    await ctx.db.insert("pageViews", {
      path,
      visitedAt: now,
      routeType: args.routeType,
      routeKey,
      visitorId,
      ...(args.routeType === "project" && args.slug
        ? { slug: normalizeSlug(args.slug) }
        : {}),
      ...(args.userAgent ? { userAgent: args.userAgent.slice(0, 256) } : {}),
    })

    return {
      counted: true,
      deduped: false,
      visitedAt: now,
      path,
    }
  },
})

export const summary = query({
  args: {
    adminKey: v.string(),
  },
  handler: async (ctx, args) => {
    requireAnalyticsAdminKey(args.adminKey)

    // Full table scan: acceptable at personal portfolio scale (hundreds to low thousands of rows).
    // At higher volume, consider aggregating counts per route into a separate summary document
    // updated incrementally on each record mutation, avoiding the scan entirely.
    const all = await ctx.db.query("pageViews").collect()
    let totalViews = 0
    let homeViews = 0
    let workViews = 0
    let projectViews = 0
    let lastViewedAt: number | null = null
    const uniqueVisitors = new Set<string>()
    const byProject = new Map<string, number>()

    for (const view of all) {
      const inferred = inferRouteFromPath(view.path)
      const routeType = view.routeType ?? inferred?.routeType
      if (!routeType || !ROUTE_TYPES.includes(routeType)) {
        continue
      }

      totalViews += 1
      if (routeType === "home") homeViews += 1
      if (routeType === "work") workViews += 1
      if (routeType === "project") {
        projectViews += 1
        const slug = normalizeSlug(
          typeof view.slug === "string" ? view.slug : inferred?.slug ?? ""
        )
        if (slug) {
          byProject.set(slug, (byProject.get(slug) ?? 0) + 1)
        }
      }

      if (typeof view.visitorId === "string" && view.visitorId.trim()) {
        uniqueVisitors.add(view.visitorId.trim())
      }

      if (
        typeof view.visitedAt === "number" &&
        (lastViewedAt === null || view.visitedAt > lastViewedAt)
      ) {
        lastViewedAt = view.visitedAt
      }
    }

    return {
      totals: {
        totalViews,
        uniqueVisitors: uniqueVisitors.size,
        homeViews,
        workViews,
        projectViews,
      },
      topProjects: [...byProject.entries()]
        .map(([slug, views]) => ({ slug, views }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 10),
      lastViewedAt,
    }
  },
})
