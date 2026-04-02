import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

const projectTypeValidator = v.union(
  v.literal("fullstack"),
  v.literal("frontend"),
  v.literal("system"),
  v.literal("spa")
)

const projectStatusValidator = v.union(
  v.literal("production"),
  v.literal("in-progress"),
  v.literal("completed")
)

const caseStudySectionsValidator = v.object({
  problem: v.optional(v.string()),
  approach: v.optional(v.string()),
  architecture: v.optional(v.string()),
  deepArchitecture: v.optional(v.string()),
  performance: v.optional(v.string()),
  security: v.optional(v.string()),
  lessons: v.optional(v.string()),
  outcome: v.optional(v.string()),
})

export default defineSchema({
  contactSubmissions: defineTable({
    name: v.string(),
    email: v.string(),
    message: v.string(),
    createdAt: v.number(),
    read: v.boolean(),
  }).index("by_created", ["createdAt"]),

  pageViews: defineTable({
    path: v.string(),
    visitedAt: v.number(),
    userAgent: v.optional(v.string()),
    routeType: v.optional(
      v.union(v.literal("home"), v.literal("work"), v.literal("project"))
    ),
    routeKey: v.optional(v.string()),
    slug: v.optional(v.string()),
    visitorId: v.optional(v.string()),
  })
    .index("by_path", ["path"])
    .index("by_visited", ["visitedAt"])
    .index("by_route_type_visited", ["routeType", "visitedAt"])
    .index("by_slug_visited", ["slug", "visitedAt"])
    .index("by_visitor_route_visited", ["visitorId", "routeKey", "visitedAt"]),

  projects: defineTable({
    slug: v.string(),
    title: v.string(),
    shortDescription: v.string(),
    type: projectTypeValidator,
    status: projectStatusValidator,
    tags: v.array(v.string()),
    stack: v.array(v.string()),
    featured: v.boolean(),
    published: v.boolean(),
    sortOrder: v.number(),
    seo: v.object({
      title: v.optional(v.string()),
      description: v.optional(v.string()),
    }),
    details: v.object({
      highlights: v.array(v.string()),
      architecture: v.object({
        rendering: v.string(),
        data: v.string(),
        domain: v.string(),
        performance: v.string(),
      }),
      complexity: v.array(v.string()),
      security: v.array(v.string()),
      lessons: v.array(v.string()),
    }),
    metrics: v.object({
      lighthouse: v.optional(v.number()),
      ttfb: v.optional(v.number()),
    }),
    screenshots: v.object({
      desktop: v.array(v.string()),
      mobile: v.array(v.string()),
      selectedWorkMain: v.optional(v.string()),
      selectedWorkAside: v.optional(v.string()),
    }),
    links: v.object({
      liveDemo: v.optional(v.string()),
      github: v.optional(v.string()),
    }),
    caseStudy: v.object({
      mdxSlug: v.optional(v.string()),
      sections: v.optional(caseStudySectionsValidator),
    }),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_published_sort", ["published", "sortOrder"])
    .index("by_featured_sort", ["featured", "sortOrder"])
    .index("by_updated", ["updatedAt"]),
})
