export type Project = {
  slug: string
  title: string
  description: string
  tags: string[]
  lighthouse?: number
  ttfb?: number
  imageCount?: number
  screenshots?: string[]
}

export const projects: Project[] = [
  {
    slug: 'habit-tracker',
    title: 'Habit Tracker',
    description:
      'Habit tracking system focused on low-latency interactions and predictable UX.',
    tags: ['Next.js', 'Fullstack', 'Performance'],
    lighthouse: 96,
    ttfb: 120,
    imageCount: 8,
    screenshots: ['/window.svg', '/next.svg', '/globe.svg', '/file.svg'],
  },
  {
    slug: 'ecommerce',
    title: 'E-Commerce Platform',
    description:
      'Commerce experience built for speed, conversion, and resilient architecture.',
    tags: ['Next.js', 'Fullstack'],
    lighthouse: 94,
    ttfb: 140,
    imageCount: 12,
    screenshots: ['/globe.svg', '/window.svg', '/file.svg', '/next.svg'],
  },
  {
    slug: 'product-feedback',
    title: 'Product Feedback',
    description:
      'Feedback management product with clear moderation flow and scalable component architecture.',
    tags: ['Next.js'],
    lighthouse: 94,
    ttfb: 140,
    imageCount: 12,
    screenshots: ['/file.svg', '/window.svg', '/next.svg', '/globe.svg'],
  },
]

export const projectTags = [
  'All',
  ...Array.from(new Set(projects.flatMap((project) => project.tags))),
]

export function getProjectBySlug(slug: string): Project | null {
  return projects.find((project) => project.slug === slug) ?? null
}

export function getProjectSlugs(): string[] {
  return projects.map((project) => project.slug)
}
