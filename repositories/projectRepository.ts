import { ConvexHttpClient } from "convex/browser"
import { anyApi } from "convex/server"
import {
  getProjectBySlug as getProjectRecordBySlugFromData,
  getProjectSlugs as getProjectSlugsFromData,
  projects as projectListItems,
  type Project,
  type ProjectRecord,
} from "@/data/projects"
import {
  localRecordToCanonicalProjectInput,
  canonicalToLegacyProjectListItem,
  canonicalToLegacyProjectRecord,
} from "@/lib/projects/adapters"
import type { CanonicalProject } from "@/lib/projects/schema"

type ProjectsReadSource = "local" | "convex" | "auto"
type ConvexProjectsReadResult =
  | { ok: true; projects: CanonicalProject[] }
  | { ok: false }
type ConvexProjectReadResult =
  | { ok: true; project: CanonicalProject | null }
  | { ok: false }

/**
 * MIGRATION DEBT: This ordering is a holdover from before Convex migration.
 * When Convex `featured` + `sortOrder` fields are fully validated as the
 * source of truth for home page ordering, remove this constant and update
 * compareFeaturedForHome to sort purely by sortOrder then updatedAt.
 * Do NOT remove until that validation is complete.
 */
const LEGACY_FEATURED_SLUG_ORDER = [
  "habit-tracker",
  "product-feedback",
  "splitter",
] as const

function getProjectsReadSource(): ProjectsReadSource {
  const raw = process.env.PROJECTS_READ_SOURCE?.trim().toLowerCase()
  // "auto" and "convex" intentionally behave identically in this implementation.
  // "auto" is reserved for future differentiation (e.g., feature-flag-controlled
  // switching between read sources). Do not collapse them without a migration plan.
  if (raw === "local" || raw === "convex" || raw === "auto") {
    return raw
  }
  return "local"
}

function getConvexReadUrl(): string {
  return (
    process.env.CONVEX_URL?.trim() ||
    process.env.NEXT_PUBLIC_CONVEX_URL?.trim() ||
    ""
  )
}

function isCanonicalProject(value: unknown): value is CanonicalProject {
  if (!value || typeof value !== "object") {
    return false
  }

  const record = value as Record<string, unknown>
  return (
    typeof record.slug === "string" &&
    typeof record.title === "string" &&
    typeof record.shortDescription === "string" &&
    typeof record.type === "string" &&
    typeof record.status === "string" &&
    Array.isArray(record.tags) &&
    Array.isArray(record.stack) &&
    typeof record.featured === "boolean" &&
    typeof record.published === "boolean" &&
    typeof record.sortOrder === "number" &&
    typeof record.createdAt === "number" &&
    typeof record.updatedAt === "number"
  )
}

async function fetchCanonicalProjectsFromConvex(): Promise<ConvexProjectsReadResult> {
  const convexUrl = getConvexReadUrl()
  if (!convexUrl) {
    return { ok: false }
  }

  try {
    const client = new ConvexHttpClient(convexUrl)
    const result = await client.query(anyApi.projects.listPublic, {})
    if (!Array.isArray(result)) {
      console.error(
        "[projectRepository] Convex projects list read returned invalid shape, falling back to local data."
      )
      return { ok: false }
    }

    const projects = result.filter(isCanonicalProject)
    if (result.length > 0 && projects.length === 0) {
      console.error(
        "[projectRepository] Convex projects list read returned non-canonical project data, falling back to local data."
      )
      return { ok: false }
    }

    return { ok: true, projects }
  } catch (error) {
    console.error(
      "[projectRepository] Convex projects list read failed, falling back to local data:",
      error
    )
    return { ok: false }
  }
}

function compareBySortOrderThenUpdatedAt(
  a: Pick<CanonicalProject, "sortOrder" | "updatedAt">,
  b: Pick<CanonicalProject, "sortOrder" | "updatedAt">
): number {
  if (a.sortOrder !== b.sortOrder) {
    return a.sortOrder - b.sortOrder
  }
  return b.updatedAt - a.updatedAt
}

function compareFeaturedForHome(
  a: Pick<CanonicalProject, "slug" | "sortOrder" | "updatedAt">,
  b: Pick<CanonicalProject, "slug" | "sortOrder" | "updatedAt">
): number {
  // Backwards-compatibility sort: preserves legacy featured slug order until
  // Convex `featured` + `sortOrder` is fully validated as the sole source of truth.
  const aRank = LEGACY_FEATURED_SLUG_ORDER.indexOf(
    a.slug as (typeof LEGACY_FEATURED_SLUG_ORDER)[number]
  )
  const bRank = LEGACY_FEATURED_SLUG_ORDER.indexOf(
    b.slug as (typeof LEGACY_FEATURED_SLUG_ORDER)[number]
  )

  const normalizedARank = aRank === -1 ? Number.MAX_SAFE_INTEGER : aRank
  const normalizedBRank = bRank === -1 ? Number.MAX_SAFE_INTEGER : bRank

  if (normalizedARank !== normalizedBRank) {
    return normalizedARank - normalizedBRank
  }

  return compareBySortOrderThenUpdatedAt(a, b)
}

function getCanonicalProjectsFromLocalData(): CanonicalProject[] {
  const featuredSlugs = [...LEGACY_FEATURED_SLUG_ORDER]

  return getProjectSlugsFromData()
    .map((slug, index) => {
      const record = getProjectRecordBySlugFromData(slug)
      if (!record) {
        return null
      }

      const normalized = localRecordToCanonicalProjectInput(record, {
        featuredSlugs,
        sortOrder: index,
      })

      return {
        ...normalized,
        createdAt: 0,
        updatedAt: 0,
      } satisfies CanonicalProject
    })
    .filter((project): project is CanonicalProject => Boolean(project))
}

function getCanonicalProjectBySlugFromLocalData(
  slug: string
): CanonicalProject | null {
  const normalizedSlug = slug.trim().toLowerCase()
  if (!normalizedSlug) {
    return null
  }

  return (
    getCanonicalProjectsFromLocalData().find(
      (project) => project.slug === normalizedSlug
    ) ?? null
  )
}

async function fetchCanonicalProjectBySlugFromConvex(
  slug: string
): Promise<ConvexProjectReadResult> {
  const convexUrl = getConvexReadUrl()
  if (!convexUrl) {
    return { ok: false }
  }

  const normalizedSlug = slug.trim().toLowerCase()
  if (!normalizedSlug) {
    return { ok: true, project: null }
  }

  try {
    const client = new ConvexHttpClient(convexUrl)
    const result = await client.query(anyApi.projects.getBySlug, {
      slug: normalizedSlug,
    })
    if (!result) {
      return { ok: true, project: null }
    }
    if (!isCanonicalProject(result)) {
      console.error(
        "[projectRepository] Convex project read returned non-canonical data for slug:",
        slug,
        "— falling back to local data."
      )
      return { ok: false }
    }
    return { ok: true, project: result }
  } catch (error) {
    console.error(
      "[projectRepository] Convex project read failed for slug:",
      slug,
      "— falling back to local data:",
      error
    )
    return { ok: false }
  }
}

export function getAllProjects(): Project[] {
  return projectListItems
}

export function getProjectRecordBySlug(slug: string): ProjectRecord | null {
  return getProjectRecordBySlugFromData(slug)
}

export function getProjectSlugs(): string[] {
  return getProjectSlugsFromData()
}

export async function getCanonicalProjectsForPublicRead(): Promise<
  CanonicalProject[]
> {
  const source = getProjectsReadSource()
  if (source === "local") {
    return getCanonicalProjectsFromLocalData()
  }

  // Explicit safety fallback: keep local reads active until Convex public reads
  // are fully validated in production.
  const convexRead = await fetchCanonicalProjectsFromConvex()
  if (!convexRead.ok) {
    return getCanonicalProjectsFromLocalData()
  }

  return [...convexRead.projects].sort(compareBySortOrderThenUpdatedAt)
}

export async function getCanonicalProjectBySlugForPublicRead(
  slug: string
): Promise<CanonicalProject | null> {
  const source = getProjectsReadSource()
  if (source === "local") {
    return getCanonicalProjectBySlugFromLocalData(slug)
  }

  // Explicit safety fallback: keep local reads active until Convex public reads
  // are fully validated in production.
  const convexRead = await fetchCanonicalProjectBySlugFromConvex(slug)
  if (!convexRead.ok) {
    return getCanonicalProjectBySlugFromLocalData(slug)
  }

  const canonical = convexRead.project
  if (!canonical) {
    return null
  }

  if (!canonical.published) {
    return null
  }

  return canonical
}

export async function getAllProjectsForPublicRead(): Promise<Project[]> {
  const canonical = await getCanonicalProjectsForPublicRead()
  return canonical.map(canonicalToLegacyProjectListItem)
}

export async function getProjectRecordBySlugForPublicRead(
  slug: string
): Promise<ProjectRecord | null> {
  const canonical = await getCanonicalProjectBySlugForPublicRead(slug)
  if (!canonical) {
    return null
  }

  return canonicalToLegacyProjectRecord(canonical)
}

export async function getProjectSlugsForPublicRead(): Promise<string[]> {
  const projects = await getCanonicalProjectsForPublicRead()
  const slugs = projects
    .map((project) => project.slug.trim())
    .filter((slug) => slug.length > 0)

  return [...new Set(slugs)]
}

export async function getFeaturedProjectsForPublicRead(
  limit = 3
): Promise<Project[]> {
  const canonical = await getCanonicalProjectsForPublicRead()

  const featured = canonical
    .filter((project) => project.published && project.featured)
    .sort(compareFeaturedForHome)

  if (featured.length > 0) {
    return featured.slice(0, limit).map(canonicalToLegacyProjectListItem)
  }

  const performanceFallback = canonical
    .filter(
      (project) =>
        typeof project.metrics.lighthouse === "number" &&
        typeof project.metrics.ttfb === "number"
    )
    .sort(compareBySortOrderThenUpdatedAt)
    .slice(0, limit)
    .map(canonicalToLegacyProjectListItem)

  return performanceFallback
}

