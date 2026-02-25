'use client'

import { startTransition, useCallback, useMemo, useState } from 'react'
import type { Project } from '@/data/projects'

const FEATURED_SLUGS = [
  'habit-tracker',
  'product-feedback',
  'splitter',
] as const

export function useSelectedWorkController(projects: Project[]) {
  const featuredProjects = useMemo(() => {
    const projectsBySlug = new Map(
      projects.map((project) => [project.slug, project])
    )

    return FEATURED_SLUGS.map((slug) => projectsBySlug.get(slug)).filter(
      (project): project is Project => Boolean(project)
    )
  }, [projects])
  const [activeCardIndex, setActiveCardIndex] = useState(0)

  const activeProject = featuredProjects[activeCardIndex] ?? featuredProjects[0]

  const handleActiveCardChange = useCallback((nextIndex: number) => {
    startTransition(() => {
      setActiveCardIndex((prev) => (prev === nextIndex ? prev : nextIndex))
    })
  }, [])

  return { featuredProjects, activeProject, handleActiveCardChange }
}
