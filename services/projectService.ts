import { projectTags, type Project } from "@/data/projects"
import {
  getAllProjects,
  getProjectRecordBySlug,
  getProjectSlugs as getProjectSlugsFromRepo,
} from "@/repositories/projectRepository"

export type WorkPageData = {
  activeTag: string
  projects: Project[]
  counts: Record<string, number>
  tags: string[]
}

export function getWorkPageData(tag?: string): WorkPageData {
  const allProjects = getAllProjects()
  const activeTag = tag && projectTags.includes(tag) ? tag : "All"
  const projects =
    activeTag === "All"
      ? allProjects
      : allProjects.filter((project) => project.tags.includes(activeTag))

  const counts: Record<string, number> = { All: allProjects.length }
  for (const tagName of projectTags.filter((value) => value !== "All")) {
    counts[tagName] = allProjects.filter((project) =>
      project.tags.includes(tagName)
    ).length
  }

  return { activeTag, projects, counts, tags: projectTags }
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

export function getProjectRecord(slug: string) {
  return getProjectRecordBySlug(slug)
}

export function getProjectSlugs() {
  return getProjectSlugsFromRepo()
}

