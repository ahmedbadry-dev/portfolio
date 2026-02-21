import { getProjectBySlug } from "@/data/projects"
import { getMDXBySlug } from "@/features/case-study/mdx/mdx"

export type CaseStudy = {
  slug: string
  title: string
  description: string
  tags: string[]
  lighthouse?: number
  ttfb?: number
  source: string
}

export async function getCaseBySlug(slug: string): Promise<CaseStudy | null> {
  const project = getProjectBySlug(slug)
  const source = getMDXBySlug(slug)

  if (!project || !source) {
    return null
  }

  return {
    ...project,
    source,
  }
}
