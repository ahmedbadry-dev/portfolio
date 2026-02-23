export type ProjectMeta = {
  slug: string
  title: string
  type: "fullstack" | "frontend" | "system"
  tags: string[]
  stack: string[]
  status: "production" | "in-progress"
}

export type ProjectDetails = {
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

export type ProjectMetrics = {
  lighthouse?: number
  ttfb?: number
}

type ProjectSeo = {
  title: string
  description: string
}

export type ProjectRecord = {
  meta: ProjectMeta
  shortDescription: string
  seo: ProjectSeo
  details: ProjectDetails
  metrics?: ProjectMetrics
  screenshots: string[]
  imageCount?: number
}

export type Project = {
  slug: string
  title: string
  description: string
  tags: string[]
  stack: string[]
  type: ProjectMeta["type"]
  status: ProjectMeta["status"]
  lighthouse?: number
  ttfb?: number
  imageCount?: number
  screenshots?: string[]
}

const projectRecords: ProjectRecord[] = [
  {
    meta: {
      slug: "habit-tracker",
      title: "Habit Tracker",
      type: "fullstack",
      tags: ["Next.js", "Fullstack", "Performance"],
      stack: ["Next.js", "TypeScript", "Convex", "TailwindCSS"],
      status: "production",
    },
    shortDescription:
      "Habit tracking system focused on low-latency interactions and predictable UX.",
    seo: {
      title: "Habit Tracker Case Study",
      description:
        "Server-first habit tracking platform with measurable rendering and latency improvements.",
    },
    details: {
      highlights: [
        "Server-first route strategy with controlled client islands",
        "Static-first content model for predictable delivery",
        "Strict feature boundaries to reduce regression risk",
      ],
      architecture: {
        rendering: "App Router server components with selective client hydration",
        data: "Static metadata layer + MDX narrative source",
        domain: "Habit planning, activity tracking, and consistency workflows",
        performance: "Reduced hydration and improved route interaction latency",
      },
      complexity: [
        "UI/State coordination across filter-heavy screens",
        "Balancing interactive UX with server-first rendering",
      ],
      security: [
        "Server action boundaries for form inputs",
        "Strict data ownership between route and feature layers",
      ],
      lessons: [
        "Architectural clarity removes performance bottlenecks early",
        "Explicit boundaries simplify long-term iteration",
      ],
    },
    metrics: {
      lighthouse: 96,
      ttfb: 120,
    },
    imageCount: 8,
    screenshots: ["/window.svg", "/next.svg", "/globe.svg", "/file.svg"],
  },
  {
    meta: {
      slug: "ecommerce",
      title: "E-Commerce Platform",
      type: "fullstack",
      tags: ["Next.js", "Fullstack"],
      stack: ["Next.js", "TypeScript", "React", "TailwindCSS"],
      status: "production",
    },
    shortDescription:
      "Commerce experience built for speed, conversion, and resilient architecture.",
    seo: {
      title: "E-Commerce Platform Case Study",
      description:
        "High-performance e-commerce frontend architecture with static-first and server-first decisions.",
    },
    details: {
      highlights: [
        "Separation of metadata and narrative content",
        "Reusable feature modules for listing and case-study flows",
        "Predictable rendering strategy across public routes",
      ],
      architecture: {
        rendering: "Server components for routes, client components for interaction islands",
        data: "Normalized static data model with MDX-backed narratives",
        domain: "Catalog discovery and conversion-oriented browsing flows",
        performance: "Lean client bundles with explicit hydration boundaries",
      },
      complexity: [
        "Maintaining visual richness with minimal runtime cost",
        "Consistent routing and data contracts across feature modules",
      ],
      security: [
        "No direct client trust for sensitive flows",
        "Server-side boundaries for data handling",
      ],
      lessons: [
        "UI quality and performance can coexist with clear architecture",
        "Structured metadata enables faster iteration",
      ],
    },
    metrics: {
      lighthouse: 94,
      ttfb: 140,
    },
    imageCount: 12,
    screenshots: ["/globe.svg", "/window.svg", "/file.svg", "/next.svg"],
  },
  {
    meta: {
      slug: "product-feedback",
      title: "Product Feedback",
      type: "system",
      tags: ["Next.js"],
      stack: ["Next.js", "TypeScript", "MDX"],
      status: "in-progress",
    },
    shortDescription:
      "Feedback management product with clear moderation flow and scalable component architecture.",
    seo: {
      title: "Product Feedback Case Study",
      description:
        "System-focused case study covering architecture boundaries and static-first content strategy.",
    },
    details: {
      highlights: [
        "Structured moderation surface with predictable UI states",
        "Feature-driven folder boundaries and route contracts",
        "Reusable metadata + MDX narrative separation",
      ],
      architecture: {
        rendering: "Static generation for case pages with route-level server rendering",
        data: "Normalized project schema for UI and SEO metadata",
        domain: "Feedback triage, prioritization, and decision visibility",
        performance: "Controlled transitions and low-overhead component composition",
      },
      complexity: [
        "Keeping architecture extensible while preserving simplicity",
        "Balancing documentation depth with UI clarity",
      ],
      security: [
        "Clear trust boundaries between route and interactive layers",
        "Predictable data ownership by feature module",
      ],
      lessons: [
        "Normalized schemas reduce feature-coupling over time",
        "Small, explicit contracts improve maintainability",
      ],
    },
    metrics: {
      lighthouse: 94,
      ttfb: 140,
    },
    imageCount: 12,
    screenshots: ["/file.svg", "/window.svg", "/next.svg", "/globe.svg"],
  },
]

function toProjectListItem(project: ProjectRecord): Project {
  return {
    slug: project.meta.slug,
    title: project.meta.title,
    description: project.shortDescription,
    tags: project.meta.tags,
    stack: project.meta.stack,
    type: project.meta.type,
    status: project.meta.status,
    lighthouse: project.metrics?.lighthouse,
    ttfb: project.metrics?.ttfb,
    imageCount: project.imageCount,
    screenshots: project.screenshots,
  }
}

export const projects: Project[] = projectRecords.map(toProjectListItem)

export const projectTags = [
  "All",
  ...Array.from(new Set(projectRecords.flatMap((project) => project.meta.tags))),
]

export function getProjectBySlug(slug: string): ProjectRecord | null {
  return projectRecords.find((project) => project.meta.slug === slug) ?? null
}

export function getProjectSlugs(): string[] {
  return projectRecords.map((project) => project.meta.slug)
}

export function getProjectListItemBySlug(slug: string): Project | null {
  const project = getProjectBySlug(slug)
  return project ? toProjectListItem(project) : null
}

