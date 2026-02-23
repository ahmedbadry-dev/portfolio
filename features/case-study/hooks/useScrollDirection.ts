"use client"

import { useEffect, useRef, useState } from "react"

type ScrollDirection = "up" | "down"
const SCROLL_DELTA_THRESHOLD = 2
const SCROLLED_THRESHOLD = 12

export function useScrollDirection() {
  const [direction, setDirection] = useState<ScrollDirection>("down")
  const [hasScrolled, setHasScrolled] = useState(false)
  const previousYRef = useRef(0)
  const directionRef = useRef<ScrollDirection>("down")
  const hasScrolledRef = useRef(false)
  const rafIdRef = useRef<number | null>(null)
  const tickingRef = useRef(false)

  useEffect(() => {
    previousYRef.current = window.scrollY
    hasScrolledRef.current = window.scrollY > SCROLLED_THRESHOLD

    const onScroll = () => {
      if (tickingRef.current) return

      tickingRef.current = true
      rafIdRef.current = requestAnimationFrame(() => {
        const currentY = window.scrollY
        const delta = currentY - previousYRef.current

        if (Math.abs(delta) > SCROLL_DELTA_THRESHOLD) {
          const nextDirection: ScrollDirection = delta > 0 ? "down" : "up"
          if (nextDirection !== directionRef.current) {
            directionRef.current = nextDirection
            setDirection(nextDirection)
          }
          previousYRef.current = currentY
        }

        const nextHasScrolled = currentY > SCROLLED_THRESHOLD
        if (nextHasScrolled !== hasScrolledRef.current) {
          hasScrolledRef.current = nextHasScrolled
          setHasScrolled(nextHasScrolled)
        }

        tickingRef.current = false
      })
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current)
      }
    }
  }, [])

  return { direction, hasScrolled }
}
