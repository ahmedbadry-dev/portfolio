"use client"

import { useEffect, useMemo, useRef, useState } from "react"

type UseSectionObserverOptions = {
  rootMargin?: string
  threshold?: number | number[]
}

const DEFAULT_ROOT_MARGIN = "-20% 0px -55% 0px"
const DEFAULT_THRESHOLD = [0.2, 0.4, 0.6, 0.8]

export function useSectionObserver(
  ids: string[],
  options: UseSectionObserverOptions = {}
) {
  const [activeId, setActiveId] = useState(ids[0] ?? "")
  const activeIdRef = useRef(activeId)
  const idsKey = useMemo(() => ids.join("|"), [ids])
  const rootMargin = options.rootMargin ?? DEFAULT_ROOT_MARGIN
  const threshold = options.threshold ?? DEFAULT_THRESHOLD

  useEffect(() => {
    if (ids.length === 0) return
    activeIdRef.current = ids[0] ?? ""

    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((node): node is HTMLElement => node !== null)

    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        let nextId = ""
        let bestRatio = -1

        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          if (entry.intersectionRatio > bestRatio) {
            bestRatio = entry.intersectionRatio
            nextId = entry.target.id
          }
        }

        if (nextId && nextId !== activeIdRef.current) {
          activeIdRef.current = nextId
          setActiveId(nextId)
        }
      },
      {
        rootMargin,
        threshold,
      }
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [ids, idsKey, rootMargin, threshold])

  return activeId
}
