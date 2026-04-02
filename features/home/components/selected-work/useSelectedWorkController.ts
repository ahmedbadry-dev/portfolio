'use client'

import { startTransition, useCallback, useMemo, useState } from 'react'
import type { Project } from '@/data/projects'

export function useSelectedWorkController(projects: Project[]) {
  const featuredProjects = useMemo(() => projects, [projects])
  const [activeCardIndex, setActiveCardIndex] = useState(0)
  const safeActiveCardIndex =
    activeCardIndex >= 0 && activeCardIndex < featuredProjects.length
      ? activeCardIndex
      : 0

  const activeProject = featuredProjects[safeActiveCardIndex] ?? featuredProjects[0]

  const handleActiveCardChange = useCallback((nextIndex: number) => {
    if (nextIndex < 0 || nextIndex >= featuredProjects.length) {
      return
    }

    startTransition(() => {
      setActiveCardIndex((prev) => (prev === nextIndex ? prev : nextIndex))
    })
  }, [featuredProjects.length])

  return { featuredProjects, activeProject, handleActiveCardChange }
}
