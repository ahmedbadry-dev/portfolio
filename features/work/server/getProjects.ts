export type Project = {
  slug: string
  title: string
  tags: string[]
}

const mockProjects: Project[] = [
  {
    slug: "habit-tracker",
    title: "Habit Tracker",
    tags: ["Next.js", "Performance", "Fullstack"],
  },
  {
    slug: "ecommerce",
    title: "E-Commerce",
    tags: ["Next.js", "Fullstack"],
  },
]

const ALL_TAGS = ["All", "Next.js", "Fullstack", "Performance"]

export async function getProjects(tag: string) {
  const filtered =
    tag === "All"
      ? mockProjects
      : mockProjects.filter((p) => p.tags.includes(tag))

  const counts: Record<string, number> = {
    All: mockProjects.length,
  }

  for (const t of ALL_TAGS.filter((t) => t !== "All")) {
    counts[t] = mockProjects.filter((p) => p.tags.includes(t)).length
  }

  return { projects: filtered, counts }
}
