import {
  getProjectBySlug as getProjectRecordBySlugFromData,
  getProjectSlugs as getProjectSlugsFromData,
  projects as projectListItems,
  type Project,
  type ProjectRecord,
} from "@/data/projects"

export function getAllProjects(): Project[] {
  return projectListItems
}

export function getProjectRecordBySlug(slug: string): ProjectRecord | null {
  return getProjectRecordBySlugFromData(slug)
}

export function getProjectSlugs(): string[] {
  return getProjectSlugsFromData()
}

