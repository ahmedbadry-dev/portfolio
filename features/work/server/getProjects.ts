import { projectTags, projects } from "@/data/projects"

export type Project = (typeof projects)[number]

export async function getProjects(tag: string) {
  const activeTag = projectTags.includes(tag) ? tag : "All"
  const filtered =
    activeTag === "All"
      ? projects
      : projects.filter((project) => project.tags.includes(activeTag))

  const counts: Record<string, number> = {
    All: projects.length,
  }

  for (const tagName of projectTags.filter((value) => value !== "All")) {
    counts[tagName] = projects.filter((project) =>
      project.tags.includes(tagName)
    ).length
  }

  return { projects: filtered, counts, tags: projectTags }
}
