"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import type { AdminAnalyticsSummary } from "@/features/admin/types"

type AdminAnalyticsResponse = {
  success?: boolean
  analytics?: AdminAnalyticsSummary
  message?: string
}

function formatLastViewedAt(timestamp: number | null): string {
  if (!timestamp) return "No data yet"
  return new Date(timestamp).toLocaleString()
}

export function AnalyticsPanel() {
  const [analytics, setAnalytics] = useState<AdminAnalyticsSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAnalytics = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/admin/analytics", {
        method: "GET",
        credentials: "same-origin",
        cache: "no-store",
      })

      const payload = (await response.json()) as AdminAnalyticsResponse
      if (!response.ok || !payload.success || !payload.analytics) {
        throw new Error(payload.message || "Failed to load analytics.")
      }

      setAnalytics(payload.analytics)
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Failed to load analytics."
      setError(message)
      setAnalytics(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchAnalytics()
  }, [fetchAnalytics])

  const statCards = useMemo(() => {
    if (!analytics) return []
    return [
      { label: "Total Views", value: analytics.totals.totalViews },
      { label: "Unique Visitors", value: analytics.totals.uniqueVisitors },
      { label: "Home Views", value: analytics.totals.homeViews },
      { label: "Work Views", value: analytics.totals.workViews },
      { label: "Project Views", value: analytics.totals.projectViews },
    ]
  }, [analytics])

  if (isLoading) {
    return (
      <div className="rounded-xl border border-border/60 bg-card/40 p-6 text-sm text-muted-foreground">
        Loading analytics...
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-3 rounded-xl border border-destructive/30 bg-destructive/10 p-6 text-sm text-destructive">
        <p>{error}</p>
        <button
          type="button"
          onClick={() => void fetchAnalytics()}
          className="rounded-md border border-destructive/50 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-destructive/20"
        >
          Retry
        </button>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="rounded-xl border border-border/60 bg-card/40 p-6 text-sm text-muted-foreground">
        No analytics data available.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="space-y-1 rounded-xl border border-border/60 bg-card/40 p-4"
          >
            <p className="text-2xl font-bold tabular-nums">{card.value}</p>
            <p className="text-xs text-muted-foreground">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border/60 bg-card/40 p-4">
        <p className="text-sm font-medium">Top Project Views</p>
        {analytics.topProjects.length === 0 ? (
          <p className="mt-2 text-xs text-muted-foreground">
            No project views recorded yet.
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {analytics.topProjects.map((item) => (
              <li
                key={item.slug}
                className="flex items-center justify-between gap-3 text-sm"
              >
                <span className="truncate text-muted-foreground">{item.slug}</span>
                <span className="font-medium tabular-nums">{item.views}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        Last tracked view: {formatLastViewedAt(analytics.lastViewedAt)}
      </p>
    </div>
  )
}
