import type { Project, ProjectRecord } from "../../data/projects"
import type {
  CanonicalProject,
  CanonicalProjectInput,
  CanonicalProjectStatus,
  CanonicalProjectType,
} from "./schema"

function toTrimmed(value: string): string {
  return value.trim()
}

function toOptionalTrimmed(value?: string): string | undefined {
  if (typeof value !== "string") {
    return undefined
  }
  const normalized = value.trim()
  return normalized.length > 0 ? normalized : undefined
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

function normalizeSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function normalizeProjectType(value: string): CanonicalProjectType {
  const normalized = value.trim().toLowerCase()
  if (normalized === "spa") return "spa"
  if (normalized === "fullstack") return "fullstack"
  if (normalized === "frontend") return "frontend"
  if (normalized === "system") return "system"
  return "frontend"
}

function normalizeProjectStatus(value: string): CanonicalProjectStatus {
  const normalized = value.trim().toLowerCase()
  if (normalized === "completed") return "completed"
  if (normalized === "in-progress") return "in-progress"
  if (normalized === "production") return "production"
  return "production"
}

function toLegacyProjectType(value: CanonicalProjectType): Project["type"] {
  if (value === "spa") return "SPA"
  if (value === "fullstack") return "fullstack"
  if (value === "frontend") return "frontend"
  return "system"
}

function toLegacyProjectStatus(value: CanonicalProjectStatus): Project["status"] {
  if (value === "completed") return "Completed"
  if (value === "in-progress") return "in-progress"
  return "production"
}

function toCanonicalMetrics(metrics: ProjectRecord["metrics"]) {
  return {
    lighthouse:
      typeof metrics?.lighthouse === "number" ? metrics.lighthouse : undefined,
    ttfb: typeof metrics?.ttfb === "number" ? metrics.ttfb : undefined,
  }
}

export function localRecordToCanonicalProjectInput(
  record: ProjectRecord,
  options?: {
    featuredSlugs?: string[]
    sortOrder?: number
  }
): CanonicalProjectInput {
  const featuredSlugs = options?.featuredSlugs ?? []
  const slug = normalizeSlug(record.meta.slug)

  return {
    slug,
    title: toTrimmed(record.meta.title),
    shortDescription: toTrimmed(record.shortDescription),
    type: normalizeProjectType(record.meta.type),
    status: normalizeProjectStatus(record.meta.status),
    tags: toUniqueStringList(record.meta.tags),
    stack: toUniqueStringList(record.meta.stack),
    featured: featuredSlugs.includes(slug),
    published: true,
    sortOrder: options?.sortOrder ?? 0,
    seo: {
      title: toOptionalTrimmed(record.seo.title),
      description: toOptionalTrimmed(record.seo.description),
    },
    details: {
      highlights: toUniqueStringList(record.details.highlights),
      architecture: {
        rendering: toTrimmed(record.details.architecture.rendering),
        data: toTrimmed(record.details.architecture.data),
        domain: toTrimmed(record.details.architecture.domain),
        performance: toTrimmed(record.details.architecture.performance),
      },
      complexity: toUniqueStringList(record.details.complexity),
      security: toUniqueStringList(record.details.security),
      lessons: toUniqueStringList(record.details.lessons),
    },
    metrics: toCanonicalMetrics(record.metrics),
    screenshots: {
      desktop: toUniqueStringList(record.screenshots.desktop),
      mobile: toUniqueStringList(record.screenshots.mobile),
      selectedWorkMain: toOptionalTrimmed(record.screenshots.selectedWork.main),
      selectedWorkAside: toOptionalTrimmed(record.screenshots.selectedWork.aside),
    },
    links: {
      liveDemo: toOptionalTrimmed(record.links.liveDemo),
      github: toOptionalTrimmed(record.links.gitHub),
    },
    caseStudy: {
      mdxSlug: slug,
    },
  }
}

export function canonicalToLegacyProjectRecord(project: CanonicalProject): ProjectRecord {
  return {
    meta: {
      slug: project.slug,
      title: project.title,
      type: toLegacyProjectType(project.type),
      tags: project.tags,
      stack: project.stack,
      status: toLegacyProjectStatus(project.status),
    },
    shortDescription: project.shortDescription,
    seo: {
      title: project.seo.title ?? project.title,
      description: project.seo.description ?? project.shortDescription,
    },
    details: {
      highlights: project.details.highlights,
      architecture: {
        rendering: project.details.architecture.rendering,
        data: project.details.architecture.data,
        domain: project.details.architecture.domain,
        performance: project.details.architecture.performance,
      },
      complexity: project.details.complexity,
      security: project.details.security,
      lessons: project.details.lessons,
    },
    metrics: {
      lighthouse: project.metrics.lighthouse,
      ttfb: project.metrics.ttfb,
    },
    screenshots: {
      desktop: project.screenshots.desktop,
      mobile: project.screenshots.mobile,
      selectedWork: {
        main: project.screenshots.selectedWorkMain ?? "",
        aside: project.screenshots.selectedWorkAside ?? "",
      },
    },
    links: {
      liveDemo: project.links.liveDemo ?? "",
      gitHub: project.links.github ?? "",
    },
    imageCount:
      project.screenshots.desktop.length + project.screenshots.mobile.length,
  }
}

export function canonicalToLegacyProjectListItem(project: CanonicalProject): Project {
  return {
    slug: project.slug,
    title: project.title,
    description: project.shortDescription,
    tags: project.tags,
    stack: project.stack,
    type: toLegacyProjectType(project.type),
    status: toLegacyProjectStatus(project.status),
    lighthouse: project.metrics.lighthouse,
    ttfb: project.metrics.ttfb,
    imageCount:
      project.screenshots.desktop.length + project.screenshots.mobile.length,
    screenshots: {
      desktop: project.screenshots.desktop,
      mobile: project.screenshots.mobile,
      selectedWork: {
        main: project.screenshots.selectedWorkMain ?? "",
        aside: project.screenshots.selectedWorkAside ?? "",
      },
    },
    links: {
      liveDemo: project.links.liveDemo ?? "",
      gitHub: project.links.github ?? "",
    },
  }
}
