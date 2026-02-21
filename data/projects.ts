export type Project = {
  slug: string
  title: string
  description: string
  tags: string[]
  lighthouse?: number
  ttfb?: number
}

export const projects: Project[] = [
  {
    slug: "habit-tracker",
    title: "Habit Tracker",
    description:
      "Habit tracking system focused on low-latency interactions and predictable UX.",
    tags: ["Next.js", "Fullstack", "Performance"],
    lighthouse: 96,
    ttfb: 120,
  },
  {
    slug: "ecommerce",
    title: "E-Commerce Platform",
    description:
      "Commerce experience built for speed, conversion, and resilient architecture.",
    tags: ["Next.js", "Fullstack"],
    lighthouse: 94,
    ttfb: 140,
  },
  {
    slug: "product-feedback",
    title: "Product Feedback",
    description: "",
    tags: ["Next.js"],
  },
]

export const projectTags = [
  "All",
  ...Array.from(new Set(projects.flatMap((project) => project.tags))),
]

export function getProjectBySlug(slug: string): Project | null {
  return projects.find((project) => project.slug === slug) ?? null
}

export function getProjectSlugs(): string[] {
  return projects.map((project) => project.slug)
}

