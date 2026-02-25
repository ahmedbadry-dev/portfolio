import { getCaseStudyPageData } from "@/services/caseStudyService"
import type { ProjectScreenshots } from "@/data/projects"

export type CaseStudy = {
  slug: string
  title: string
  shortDescription: string
  tags: string[]
  stack: string[]
  type: "fullstack" | "frontend" | "system" | "SPA"
  status: "production" | "in-progress"
  seo: {
    title: string
    description: string
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
  lighthouse?: number
  ttfb?: number
  imageCount?: number
  screenshots: ProjectScreenshots
  source: string
}

export async function getCaseBySlug(slug: string): Promise<CaseStudy | null> {
  const data = getCaseStudyPageData(slug)
  if (!data) {
    return null
  }
  const { project, source } = data

  return {
    slug: project.meta.slug,
    title: project.meta.title,
    shortDescription: project.shortDescription,
    tags: project.meta.tags,
    stack: project.meta.stack,
    type: project.meta.type,
    status: project.meta.status,
    seo: project.seo,
    details: project.details,
    lighthouse: project.metrics?.lighthouse,
    ttfb: project.metrics?.ttfb,
    imageCount: project.imageCount,
    screenshots: project.screenshots,
    source,
  }
}
