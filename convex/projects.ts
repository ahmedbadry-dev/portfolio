import { mutationGeneric, queryGeneric } from "convex/server"
import { v } from "convex/values"
import {
  getProjectBySlug as getLocalProjectBySlug,
  getProjectSlugs as getLocalProjectSlugs,
  type ProjectRecord,
} from "../data/projects"
import { localRecordToCanonicalProjectInput } from "../lib/projects/adapters"

const query = queryGeneric
const mutation = mutationGeneric
const FEATURED_SEED_SLUGS = ["habit-tracker", "product-feedback", "splitter"] as const

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

const projectInputValidator = v.object({
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
})

function toTrimmed(value: string): string {
  return value.trim()
}

function toUniqueStringList(values: string[]): string[] {
  const seen = new Set<string>()
  const result: string[] = []

  for (const value of values) {
    const normalized = toTrimmed(value)
    if (!normalized || seen.has(normalized)) continue
    seen.add(normalized)
    result.push(normalized)
  }

  return result
}

function toOptionalTrimmed(value?: string): string | undefined {
  if (typeof value !== "string") return undefined
  const normalized = toTrimmed(value)
  return normalized.length > 0 ? normalized : undefined
}

function normalizeProjectType(
  value: string
): "fullstack" | "frontend" | "system" | "spa" {
  const normalized = value.trim().toLowerCase()
  if (normalized === "spa") return "spa"
  if (normalized === "fullstack") return "fullstack"
  if (normalized === "frontend") return "frontend"
  if (normalized === "system") return "system"
  return "frontend"
}

function normalizeProjectStatus(
  value: string
): "production" | "in-progress" | "completed" {
  const normalized = value.trim().toLowerCase()
  if (normalized === "completed") return "completed"
  if (normalized === "in-progress") return "in-progress"
  if (normalized === "production") return "production"
  return "production"
}

function normalizeSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function isKebabCaseSlug(value: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)
}

function isHttpUrl(value: string): boolean {
  try {
    const parsed = new URL(value)
    return parsed.protocol === "http:" || parsed.protocol === "https:"
  } catch {
    return false
  }
}

function isAssetReference(value: string): boolean {
  return value.startsWith("/") || isHttpUrl(value)
}

function ensureOptionalHttpUrl(field: string, value?: string): void {
  if (!value) return
  if (!isHttpUrl(value)) {
    throw new Error(`${field} must be a valid http(s) URL.`)
  }
}

function ensureOptionalAssetReference(field: string, value?: string): void {
  if (!value) return
  if (!isAssetReference(value)) {
    throw new Error(
      `${field} must be an absolute path (/...) or a valid http(s) URL.`
    )
  }
}

function sanitizeAssetList(field: string, values: string[]): string[] {
  const normalized = toUniqueStringList(values)
  for (const value of normalized) {
    if (!isAssetReference(value)) {
      throw new Error(
        `${field} must contain absolute paths (/...) or valid http(s) URLs.`
      )
    }
  }
  return normalized
}

function clampLighthouse(value?: number): number | undefined {
  if (typeof value !== "number" || Number.isNaN(value)) return undefined
  return Math.min(100, Math.max(0, Math.round(value)))
}

function normalizeTtfb(value?: number): number | undefined {
  if (typeof value !== "number" || Number.isNaN(value)) return undefined
  return value < 0 ? 0 : Math.round(value)
}

function sanitizeSections(sections?: {
  problem?: string
  approach?: string
  architecture?: string
  deepArchitecture?: string
  performance?: string
  security?: string
  lessons?: string
  outcome?: string
}) {
  if (!sections) {
    return undefined
  }

  const sanitized = {
    problem: toOptionalTrimmed(sections.problem),
    approach: toOptionalTrimmed(sections.approach),
    architecture: toOptionalTrimmed(sections.architecture),
    deepArchitecture: toOptionalTrimmed(sections.deepArchitecture),
    performance: toOptionalTrimmed(sections.performance),
    security: toOptionalTrimmed(sections.security),
    lessons: toOptionalTrimmed(sections.lessons),
    outcome: toOptionalTrimmed(sections.outcome),
  }

  const hasAnySection = Object.values(sanitized).some(Boolean)
  return hasAnySection ? sanitized : undefined
}

function sanitizeProjectInput(input: {
  slug: string
  title: string
  shortDescription: string
  type: "fullstack" | "frontend" | "system" | "spa"
  status: "production" | "in-progress" | "completed"
  tags: string[]
  stack: string[]
  featured: boolean
  published: boolean
  sortOrder: number
  seo: {
    title?: string
    description?: string
  }
  details: {
    highlights: string[]
    architecture: {
      rendering: string
      data: string
      domain: string
      performance: string
    }
    complexity: string[]
    security: string[]
    lessons: string[]
  }
  metrics: {
    lighthouse?: number
    ttfb?: number
  }
  screenshots: {
    desktop: string[]
    mobile: string[]
    selectedWorkMain?: string
    selectedWorkAside?: string
  }
  links: {
    liveDemo?: string
    github?: string
  }
  caseStudy: {
    mdxSlug?: string
    sections?: {
      problem?: string
      approach?: string
      architecture?: string
      deepArchitecture?: string
      performance?: string
      security?: string
      lessons?: string
      outcome?: string
    }
  }
}) {
  const slug = normalizeSlug(input.slug)
  if (!slug) {
    throw new Error("Project slug is required.")
  }

  const title = toTrimmed(input.title)
  if (!title) {
    throw new Error("Project title is required.")
  }

  const shortDescription = toTrimmed(input.shortDescription)
  if (!shortDescription) {
    throw new Error("Project shortDescription is required.")
  }

  const detailsArchitecture = {
    rendering: toTrimmed(input.details.architecture.rendering),
    data: toTrimmed(input.details.architecture.data),
    domain: toTrimmed(input.details.architecture.domain),
    performance: toTrimmed(input.details.architecture.performance),
  }

  if (
    !detailsArchitecture.rendering ||
    !detailsArchitecture.data ||
    !detailsArchitecture.domain ||
    !detailsArchitecture.performance
  ) {
    throw new Error("Project architecture fields are required.")
  }

  const seoTitle = toOptionalTrimmed(input.seo.title)
  const seoDescription = toOptionalTrimmed(input.seo.description)
  const lighthouse = clampLighthouse(input.metrics.lighthouse)
  const ttfb = normalizeTtfb(input.metrics.ttfb)
  const selectedWorkMain = toOptionalTrimmed(input.screenshots.selectedWorkMain)
  const selectedWorkAside = toOptionalTrimmed(input.screenshots.selectedWorkAside)
  const liveDemo = toOptionalTrimmed(input.links.liveDemo)
  const github = toOptionalTrimmed(input.links.github)
  const mdxSlug = toOptionalTrimmed(input.caseStudy.mdxSlug) ?? slug
  const sections = sanitizeSections(input.caseStudy.sections)

  ensureOptionalHttpUrl("links.liveDemo", liveDemo)
  ensureOptionalHttpUrl("links.github", github)
  ensureOptionalAssetReference("screenshots.selectedWorkMain", selectedWorkMain)
  ensureOptionalAssetReference("screenshots.selectedWorkAside", selectedWorkAside)

  if (mdxSlug && !isKebabCaseSlug(mdxSlug)) {
    throw new Error("caseStudy.mdxSlug must be lowercase kebab-case.")
  }

  return {
    slug,
    title,
    shortDescription,
    type: normalizeProjectType(input.type),
    status: normalizeProjectStatus(input.status),
    tags: toUniqueStringList(input.tags),
    stack: toUniqueStringList(input.stack),
    featured: Boolean(input.featured),
    published: Boolean(input.published),
    sortOrder:
      Number.isFinite(input.sortOrder) && input.sortOrder >= 0
        ? Math.trunc(input.sortOrder)
        : 0,
    seo: {
      ...(seoTitle ? { title: seoTitle } : {}),
      ...(seoDescription ? { description: seoDescription } : {}),
    },
    details: {
      highlights: toUniqueStringList(input.details.highlights),
      architecture: detailsArchitecture,
      complexity: toUniqueStringList(input.details.complexity),
      security: toUniqueStringList(input.details.security),
      lessons: toUniqueStringList(input.details.lessons),
    },
    metrics: {
      ...(typeof lighthouse === "number" ? { lighthouse } : {}),
      ...(typeof ttfb === "number" ? { ttfb } : {}),
    },
    screenshots: {
      desktop: sanitizeAssetList("screenshots.desktop", input.screenshots.desktop),
      mobile: sanitizeAssetList("screenshots.mobile", input.screenshots.mobile),
      ...(selectedWorkMain ? { selectedWorkMain } : {}),
      ...(selectedWorkAside ? { selectedWorkAside } : {}),
    },
    links: {
      ...(liveDemo ? { liveDemo } : {}),
      ...(github ? { github } : {}),
    },
    caseStudy: {
      ...(mdxSlug ? { mdxSlug } : {}),
      ...(sections ? { sections } : {}),
    },
  }
}

function compareBySortOrderThenUpdatedAt<
  T extends { sortOrder: number; updatedAt: number }
>(a: T, b: T): number {
  if (a.sortOrder !== b.sortOrder) {
    return a.sortOrder - b.sortOrder
  }
  return b.updatedAt - a.updatedAt
}

function compareBySortOrderThenSlug<
  T extends { sortOrder: number; slug: string }
>(a: T, b: T): number {
  if (a.sortOrder !== b.sortOrder) {
    return a.sortOrder - b.sortOrder
  }
  return a.slug.localeCompare(b.slug)
}

function requireProjectAdminKey(adminKey: string): void {
  const expected = process.env.CONVEX_ADMIN_MUTATION_KEY
  if (!expected) {
    throw new Error("CONVEX_ADMIN_MUTATION_KEY is not configured.")
  }
  if (adminKey !== expected) {
    throw new Error("Unauthorized project mutation.")
  }
}

function getLocalProjectRecordsForSeed(): ProjectRecord[] {
  const records: ProjectRecord[] = []
  const slugs = getLocalProjectSlugs()

  for (const slug of slugs) {
    const record = getLocalProjectBySlug(slug)
    if (!record) continue
    records.push(record)
  }

  return records
}

export const listPublic = query({
  args: {},
  handler: async (ctx) => {
    const projects = await ctx.db
      .query("projects")
      .withIndex("by_published_sort", (q) => q.eq("published", true))
      .collect()

    return projects.sort(compareBySortOrderThenUpdatedAt)
  },
})

export const listAdmin = query({
  args: {},
  handler: async (ctx) => {
    const projects = await ctx.db.query("projects").collect()
    return projects.sort(compareBySortOrderThenUpdatedAt)
  },
})

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const normalizedSlug = normalizeSlug(args.slug)
    if (!normalizedSlug) return null

    return await ctx.db
      .query("projects")
      .withIndex("by_slug", (q) => q.eq("slug", normalizedSlug))
      .unique()
  },
})

export const getById = query({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id)
  },
})

export const create = mutation({
  args: {
    adminKey: v.string(),
    project: projectInputValidator,
  },
  handler: async (ctx, args) => {
    requireProjectAdminKey(args.adminKey)
    const normalized = sanitizeProjectInput(args.project)

    const existing = await ctx.db
      .query("projects")
      .withIndex("by_slug", (q) => q.eq("slug", normalized.slug))
      .unique()

    if (existing) {
      throw new Error(`Project slug "${normalized.slug}" already exists.`)
    }

    const now = Date.now()
    return await ctx.db.insert("projects", {
      ...normalized,
      createdAt: now,
      updatedAt: now,
    })
  },
})

export const update = mutation({
  args: {
    adminKey: v.string(),
    id: v.id("projects"),
    project: projectInputValidator,
  },
  handler: async (ctx, args) => {
    requireProjectAdminKey(args.adminKey)
    const current = await ctx.db.get(args.id)
    if (!current) {
      throw new Error("Project not found.")
    }

    const normalized = sanitizeProjectInput(args.project)
    const existingWithSlug = await ctx.db
      .query("projects")
      .withIndex("by_slug", (q) => q.eq("slug", normalized.slug))
      .unique()

    if (existingWithSlug && existingWithSlug._id !== args.id) {
      throw new Error(`Project slug "${normalized.slug}" is already in use.`)
    }

    const updatedAt = Date.now()
    await ctx.db.patch(args.id, {
      ...normalized,
      updatedAt,
    })
    return args.id
  },
})

export const remove = mutation({
  args: {
    adminKey: v.string(),
    id: v.id("projects"),
  },
  handler: async (ctx, args) => {
    requireProjectAdminKey(args.adminKey)
    const current = await ctx.db.get(args.id)
    if (!current) {
      return null
    }
    await ctx.db.delete(args.id)
    return args.id
  },
})

export const upsertBySlug = mutation({
  args: {
    adminKey: v.string(),
    project: projectInputValidator,
  },
  handler: async (ctx, args) => {
    requireProjectAdminKey(args.adminKey)
    const normalized = sanitizeProjectInput(args.project)
    const existing = await ctx.db
      .query("projects")
      .withIndex("by_slug", (q) => q.eq("slug", normalized.slug))
      .unique()

    const now = Date.now()
    if (!existing) {
      const insertedId = await ctx.db.insert("projects", {
        ...normalized,
        createdAt: now,
        updatedAt: now,
      })
      return { action: "inserted", id: insertedId }
    }

    await ctx.db.patch(existing._id, {
      ...normalized,
      updatedAt: now,
    })
    return { action: "updated", id: existing._id }
  },
})

export const seedBulk = mutation({
  args: {
    adminKey: v.string(),
    projects: v.array(projectInputValidator),
    mode: v.optional(v.union(v.literal("skip"), v.literal("overwrite"))),
  },
  handler: async (ctx, args) => {
    requireProjectAdminKey(args.adminKey)
    const mode = args.mode ?? "skip"

    let inserted = 0
    let updated = 0
    let skipped = 0

    const normalizedProjects = args.projects
      .map((project) => sanitizeProjectInput(project))
      .sort(compareBySortOrderThenSlug)

    for (const project of normalizedProjects) {
      const existing = await ctx.db
        .query("projects")
        .withIndex("by_slug", (q) => q.eq("slug", project.slug))
        .unique()

      if (!existing) {
        const now = Date.now()
        await ctx.db.insert("projects", {
          ...project,
          createdAt: now,
          updatedAt: now,
        })
        inserted += 1
        continue
      }

      if (mode === "skip") {
        skipped += 1
        continue
      }

      await ctx.db.patch(existing._id, {
        ...project,
        updatedAt: Date.now(),
      })
      updated += 1
    }

    return {
      inserted,
      updated,
      skipped,
      totalInput: normalizedProjects.length,
    }
  },
})

export const seedFromLocal = mutation({
  args: {
    adminKey: v.string(),
    mode: v.optional(v.union(v.literal("skip"), v.literal("overwrite"))),
  },
  handler: async (ctx, args) => {
    requireProjectAdminKey(args.adminKey)
    const mode = args.mode ?? "skip"
    const localRecords = getLocalProjectRecordsForSeed()

    let inserted = 0
    let updated = 0
    let skipped = 0

    const normalizedProjects = localRecords
      .map((record, index) =>
        sanitizeProjectInput(
          localRecordToCanonicalProjectInput(record, {
            featuredSlugs: [...FEATURED_SEED_SLUGS],
            sortOrder: index,
          })
        )
      )
      .sort(compareBySortOrderThenSlug)

    for (const project of normalizedProjects) {
      const existing = await ctx.db
        .query("projects")
        .withIndex("by_slug", (q) => q.eq("slug", project.slug))
        .unique()

      if (!existing) {
        const now = Date.now()
        await ctx.db.insert("projects", {
          ...project,
          createdAt: now,
          updatedAt: now,
        })
        inserted += 1
        continue
      }

      if (mode === "skip") {
        skipped += 1
        continue
      }

      await ctx.db.patch(existing._id, {
        ...project,
        updatedAt: Date.now(),
      })
      updated += 1
    }

    return {
      inserted,
      updated,
      skipped,
      totalInput: normalizedProjects.length,
      source: "local-project-records",
    }
  },
})
