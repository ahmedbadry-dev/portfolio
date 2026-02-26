"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"

const MAX_PROGRESS = 92

export function RouteProgress() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [visible, setVisible] = useState(false)
  const [progress, setProgress] = useState(0)
  const rafRef = useRef<number | null>(null)

  const stopLoop = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [])

  const startProgress = useCallback(() => {
    stopLoop()
    setVisible(true)
    setProgress((prev) => (prev > 10 ? prev : 12))

    const tick = () => {
      setProgress((prev) => {
        if (prev >= MAX_PROGRESS) return prev
        const remaining = MAX_PROGRESS - prev
        return prev + Math.max(remaining * 0.04, 0.25)
      })
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
  }, [stopLoop])

  const completeProgress = useCallback(() => {
    stopLoop()
    setProgress(100)
    const timeoutId = window.setTimeout(() => {
      setVisible(false)
      setProgress(0)
    }, 180)
    return timeoutId
  }, [stopLoop])

  useEffect(() => {
    if (!visible) return
    let timeoutId: number | null = null
    const frameId = requestAnimationFrame(() => {
      timeoutId = completeProgress()
    })
    return () => {
      cancelAnimationFrame(frameId)
      if (timeoutId !== null) clearTimeout(timeoutId)
    }
  }, [pathname, searchParams, visible, completeProgress])

  useEffect(() => {
    const onClickCapture = (event: MouseEvent) => {
      if (event.defaultPrevented) return
      if (!(event.target instanceof Element)) return

      const anchor = event.target.closest("a[href]") as HTMLAnchorElement | null
      if (!anchor) return
      if (
        anchor.target === "_blank" ||
        anchor.hasAttribute("download") ||
        anchor.getAttribute("rel")?.includes("external")
      ) {
        return
      }

      const href = anchor.getAttribute("href")
      if (!href || href.startsWith("#")) return

      const isInternalPath = href.startsWith("/")
      if (!isInternalPath) return
      startProgress()
    }

    document.addEventListener("click", onClickCapture, true)
    return () => {
      stopLoop()
      document.removeEventListener("click", onClickCapture, true)
    }
  }, [startProgress, stopLoop])

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[120] h-0.5"
      aria-hidden
    >
      <div
        className="h-full bg-primary transition-[transform,opacity] duration-200 ease-out"
        style={{
          opacity: visible ? 1 : 0,
          transform: `scaleX(${progress / 100})`,
          transformOrigin: "left center",
        }}
      />
    </div>
  )
}
