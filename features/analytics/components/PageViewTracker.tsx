"use client"

import { useEffect, useMemo, useRef } from "react"

type AnalyticsRouteType = "home" | "work" | "project"

type PageViewTrackerProps = {
  routeType: AnalyticsRouteType
  slug?: string
}

const SESSION_STORAGE_PREFIX = "ab.analytics.lastView."
const CLIENT_COOLDOWN_MS = 60_000

function normalizeSlug(slug?: string): string | undefined {
  const normalized = slug
    ?.trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

  return normalized && normalized.length > 0 ? normalized : undefined
}

function toRouteKey(routeType: AnalyticsRouteType, slug?: string): string | null {
  if (routeType === "project") {
    const normalizedSlug = normalizeSlug(slug)
    if (!normalizedSlug) return null
    return `project:${normalizedSlug}`
  }

  return routeType
}

function canTrackByClientCooldown(routeKey: string): boolean {
  if (typeof window === "undefined") {
    return true
  }

  try {
    const storageKey = `${SESSION_STORAGE_PREFIX}${routeKey}`
    const now = Date.now()
    const previousRaw = window.sessionStorage.getItem(storageKey)
    const previous = previousRaw ? Number.parseInt(previousRaw, 10) : NaN

    if (Number.isFinite(previous) && now - previous < CLIENT_COOLDOWN_MS) {
      return false
    }

    window.sessionStorage.setItem(storageKey, String(now))
    return true
  } catch {
    return true
  }
}

export function PageViewTracker({ routeType, slug }: PageViewTrackerProps) {
  const hasTrackedRef = useRef(false)
  const normalizedSlug = useMemo(() => normalizeSlug(slug), [slug])

  useEffect(() => {
    if (hasTrackedRef.current) {
      return
    }

    const routeKey = toRouteKey(routeType, normalizedSlug)
    if (!routeKey) {
      return
    }

    if (!canTrackByClientCooldown(routeKey)) {
      hasTrackedRef.current = true
      return
    }

    hasTrackedRef.current = true

    void fetch("/api/analytics/view", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
      cache: "no-store",
      keepalive: true,
      body: JSON.stringify({
        routeType,
        ...(routeType === "project" && normalizedSlug
          ? { slug: normalizedSlug }
          : {}),
      }),
    }).catch(() => undefined)
  }, [routeType, normalizedSlug])

  return null
}
