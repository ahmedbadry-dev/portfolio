"use client"

import { useCallback, useState } from "react"

type UseWorkControllerOptions = {
  projectsLength: number
}

export function useWorkController({ projectsLength }: UseWorkControllerOptions) {
  const [index, setIndex] = useState(0)

  const showPrev = useCallback(() => {
    setIndex((prev) => (prev - 1 + projectsLength) % projectsLength)
  }, [projectsLength])

  const showNext = useCallback(() => {
    setIndex((prev) => (prev + 1) % projectsLength)
  }, [projectsLength])

  return { index, showPrev, showNext }
}

