"use client"

import { startTransition, useCallback, useMemo, useState } from "react"
import type { Project } from "@/data/projects"

type ShowcaseProject = Project & {
  lighthouse: number
  ttfb: number
}

function hasShowcaseMetrics(project: Project): project is ShowcaseProject {
  return typeof project.lighthouse === "number" && typeof project.ttfb === "number"
}

export function useSelectedWorkController(projects: Project[]) {
  const featuredProjects = useMemo(
    () => projects.filter(hasShowcaseMetrics).slice(0, 3).reverse(),
    [projects]
  )
  const [activeCardIndex, setActiveCardIndex] = useState(0)

  const activeProject = featuredProjects[activeCardIndex] ?? featuredProjects[0]

  const handleActiveCardChange = useCallback((nextIndex: number) => {
    startTransition(() => {
      setActiveCardIndex((prev) => (prev === nextIndex ? prev : nextIndex))
    })
  }, [])

  return { featuredProjects, activeProject, handleActiveCardChange }
}

