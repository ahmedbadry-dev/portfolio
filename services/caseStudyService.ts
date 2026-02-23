import { getProjectRecord, getProjectSlugs } from "@/services/projectService"
import {
  findMdxSection,
  getMDXBySlug,
  parseMdxSections,
  type ParsedMdxSection,
} from "@/features/case-study/mdx/mdx"

export type CaseStudySections = {
  problem: ParsedMdxSection | null
  approach: ParsedMdxSection | null
  architecture: ParsedMdxSection | null
  deepArchitecture: ParsedMdxSection | null
  performance: ParsedMdxSection | null
  security: ParsedMdxSection | null
  lessons: ParsedMdxSection | null
  outcome: ParsedMdxSection | null
}

export type CaseStudyPageData = {
  project: NonNullable<ReturnType<typeof getProjectRecord>>
  source: string
  sections: CaseStudySections
  progressItems: Array<{ id: string; label: string }>
}

export function getCaseStudyStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }))
}

export function getCaseStudyPageData(slug: string): CaseStudyPageData | null {
  const project = getProjectRecord(slug)
  const source = getMDXBySlug(slug)

  if (!project || !source) {
    return null
  }

  const parsedSections = parseMdxSections(source)
  const sections: CaseStudySections = {
    problem: findMdxSection(parsedSections, "Problem"),
    approach: findMdxSection(parsedSections, "Overview"),
    architecture: findMdxSection(parsedSections, "Architecture Strategy"),
    deepArchitecture: findMdxSection(parsedSections, "Deep Architecture"),
    performance: findMdxSection(parsedSections, "Performance"),
    security: findMdxSection(parsedSections, "Security"),
    lessons: findMdxSection(parsedSections, "What I Learned"),
    outcome: findMdxSection(parsedSections, "Outcome"),
  }

  const progressItems = [
    { id: "problem", label: "Problem" },
    { id: "approach", label: "Approach" },
    { id: "architecture", label: "Architecture" },
    { id: "performance", label: "Performance" },
    { id: "security", label: "Security" },
    { id: "lessons", label: "Lessons" },
    { id: "outcome", label: "Outcome" },
    { id: "cta", label: "CTA" },
  ]

  return { project, source, sections, progressItems }
}

