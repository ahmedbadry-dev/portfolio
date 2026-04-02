export const PROJECT_TYPE_VALUES = [
  "fullstack",
  "frontend",
  "system",
  "spa",
] as const

export const PROJECT_STATUS_VALUES = [
  "production",
  "in-progress",
  "completed",
] as const

export type CanonicalProjectType = (typeof PROJECT_TYPE_VALUES)[number]
export type CanonicalProjectStatus = (typeof PROJECT_STATUS_VALUES)[number]

export type CanonicalCaseStudySections = {
  problem?: string
  approach?: string
  architecture?: string
  deepArchitecture?: string
  performance?: string
  security?: string
  lessons?: string
  outcome?: string
}

export type CanonicalProject = {
  slug: string
  title: string
  shortDescription: string
  type: CanonicalProjectType
  status: CanonicalProjectStatus
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
    sections?: CanonicalCaseStudySections
  }
  createdAt: number
  updatedAt: number
}

export type CanonicalProjectInput = Omit<
  CanonicalProject,
  "createdAt" | "updatedAt"
>
