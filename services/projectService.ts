import { projectTags, type Project } from "@/data/projects"
import {
  getAllProjects,
  getAllProjectsForPublicRead,
  getCanonicalProjectBySlugForPublicRead,
  getFeaturedProjectsForPublicRead,
  getProjectRecordBySlug,
  getProjectRecordBySlugForPublicRead,
  getProjectSlugs as getProjectSlugsFromRepo,
  getProjectSlugsForPublicRead,
} from "@/repositories/projectRepository"
import type { CanonicalProject } from "@/lib/projects/schema"

export type WorkPageData = {
  activeTag: string
  projects: Project[]
  tags: string[]
}

function buildTagOptions(projects: Project[]): string[] {
  const staticTags = projectTags.filter((tag) => tag !== "All")
  const allProjectTags = new Set(
    projects.flatMap((project) => project.tags).map((tag) => tag.trim())
  )

  const orderedStaticTags = staticTags.filter((tag) => allProjectTags.has(tag))
  const dynamicTags = [...allProjectTags]
    .filter((tag) => tag.length > 0 && !orderedStaticTags.includes(tag))
    .sort((a, b) => a.localeCompare(b))

  return ["All", ...orderedStaticTags, ...dynamicTags]
}

export function getWorkPageData(tag?: string): WorkPageData {
  const allProjects = getAllProjects()
  const tags = buildTagOptions(allProjects)
  const activeTag = tag && tags.includes(tag) ? tag : "All"
  const projects =
    activeTag === "All"
      ? allProjects
      : allProjects.filter((project) => project.tags.includes(activeTag))

  return { activeTag, projects, tags }
}

export async function getWorkPageDataForPublicRead(
  tag?: string
): Promise<WorkPageData> {
  const allProjects = await getAllProjectsForPublicRead()
  const tags = buildTagOptions(allProjects)
  const activeTag = tag && tags.includes(tag) ? tag : "All"
  const projects =
    activeTag === "All"
      ? allProjects
      : allProjects.filter((project) => project.tags.includes(activeTag))

  return { activeTag, projects, tags }
}

export function getSelectedWorkProjects(limit = 3): Project[] {
  return getAllProjects()
    .filter(
      (project): project is Project & { lighthouse: number; ttfb: number } =>
        typeof project.lighthouse === "number" && typeof project.ttfb === "number"
    )
    .slice(0, limit)
    .reverse()
}

export async function getSelectedWorkProjectsForPublicRead(
  limit = 3
): Promise<Project[]> {
  return getFeaturedProjectsForPublicRead(limit)
}

export function getProjectRecord(slug: string) {
  return getProjectRecordBySlug(slug)
}

export async function getProjectRecordForPublicRead(slug: string) {
  return getProjectRecordBySlugForPublicRead(slug)
}

export async function getCanonicalProjectForPublicRead(
  slug: string
): Promise<CanonicalProject | null> {
  return getCanonicalProjectBySlugForPublicRead(slug)
}

export function getProjectSlugs() {
  return getProjectSlugsFromRepo()
}

export async function getProjectSlugsForPublicReadData() {
  return getProjectSlugsForPublicRead()
}

