import {
  getCanonicalProjectForPublicRead,
  getProjectRecord,
  getProjectRecordForPublicRead,
  getProjectSlugs,
  getProjectSlugsForPublicReadData,
} from "@/services/projectService"
import type { CanonicalCaseStudySections } from "@/lib/projects/schema"
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
  source: string | null
  sections: CaseStudySections
  structuredSections?: CanonicalCaseStudySections
  progressItems: Array<{ id: string; label: string }>
}

const CASE_STUDY_PROGRESS_ITEMS: Array<{ id: string; label: string }> = [
  { id: "problem", label: "Problem" },
  { id: "approach", label: "Approach" },
  { id: "architecture", label: "Architecture" },
  { id: "deepArchitecture", label: "Deep Architecture" },
  { id: "performance", label: "Performance" },
  { id: "security", label: "Security" },
  { id: "lessons", label: "Lessons" },
  { id: "outcome", label: "Outcome" },
  { id: "cta", label: "CTA" },
]

function buildSectionsFromSource(source: string | null): CaseStudySections {
  if (!source) {
    return {
      problem: null,
      approach: null,
      architecture: null,
      deepArchitecture: null,
      performance: null,
      security: null,
      lessons: null,
      outcome: null,
    }
  }

  const parsedSections = parseMdxSections(source)
  return {
    problem: findMdxSection(parsedSections, "Problem"),
    approach: findMdxSection(parsedSections, "Overview"),
    architecture: findMdxSection(parsedSections, "Architecture Strategy"),
    deepArchitecture: findMdxSection(parsedSections, "Deep Architecture"),
    performance: findMdxSection(parsedSections, "Performance"),
    security: findMdxSection(parsedSections, "Security"),
    lessons: findMdxSection(parsedSections, "What I Learned"),
    outcome: findMdxSection(parsedSections, "Outcome"),
  }
}

export function getCaseStudyStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }))
}

export async function getCaseStudyStaticParamsForPublicRead() {
  const slugs = await getProjectSlugsForPublicReadData()
  return slugs.map((slug) => ({ slug }))
}

export function getCaseStudyPageData(slug: string): CaseStudyPageData | null {
  const project = getProjectRecord(slug)
  const source = getMDXBySlug(slug)

  if (!project) {
    return null
  }

  const sections = buildSectionsFromSource(source)

  return { project, source, sections, progressItems: CASE_STUDY_PROGRESS_ITEMS }
}

export async function getCaseStudyPageDataForPublicRead(
  slug: string
): Promise<CaseStudyPageData | null> {
  const project = await getProjectRecordForPublicRead(slug)
  const canonicalProject = await getCanonicalProjectForPublicRead(slug)

  if (!project) {
    return null
  }

  const mdxSlug = canonicalProject?.caseStudy.mdxSlug?.trim() || slug
  const source = getMDXBySlug(mdxSlug)
  const sections = buildSectionsFromSource(source)
  const structuredSections = canonicalProject?.caseStudy.sections

  return {
    project,
    source,
    sections,
    structuredSections,
    progressItems: CASE_STUDY_PROGRESS_ITEMS,
  }
}

