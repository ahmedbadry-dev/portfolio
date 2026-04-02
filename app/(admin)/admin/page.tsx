"use client"

import { Suspense, useCallback, useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { z } from "zod"
import { AnalyticsPanel } from "@/features/admin/components/AnalyticsPanel"
import { ProjectsTable } from "@/features/admin/components/ProjectsTable"
import { SubmissionsTable } from "@/features/admin/components/SubmissionsTable"
import type { AdminSubmission } from "@/features/admin/types"
import { canonicalProjectDocumentSchema } from "@/lib/projects/validation"

type AdminSubmissionsResponse = {
  success?: boolean
  submissions?: AdminSubmission[]
  message?: string
}

type AdminProjectsResponse = {
  success?: boolean
  projects?: unknown
  message?: string
}

function StatsBar({
  submissions,
  loading,
  projectsCount,
  loadingProjects,
}: {
  submissions: AdminSubmission[]
  loading: boolean
  projectsCount: number | null
  loadingProjects: boolean
}) {
  const unread = submissions.filter((submission) => !submission.read).length

  return (
    <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
      {[
        { label: "Total Submissions", value: loading ? "..." : submissions.length },
        { label: "Unread", value: loading ? "..." : unread },
        {
          label: "Projects",
          value: loadingProjects ? "..." : projectsCount ?? "-",
        },
      ].map((stat) => (
        <div
          key={stat.label}
          className="space-y-1 rounded-xl border border-border/60 bg-card/40 p-4"
        >
          <p className="text-2xl font-bold tabular-nums">{stat.value}</p>
          <p className="text-xs text-muted-foreground">{stat.label}</p>
        </div>
      ))}
    </div>
  )
}

function AdminContent() {
  const searchParams = useSearchParams()
  const tab = searchParams.get("tab") ?? "submissions"
  const [submissions, setSubmissions] = useState<AdminSubmission[]>([])
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(true)
  const [isUpdatingSubmission, setIsUpdatingSubmission] = useState(false)
  const [projectsCount, setProjectsCount] = useState<number | null>(null)
  const [isLoadingProjectsCount, setIsLoadingProjectsCount] = useState(true)
  const [error, setError] = useState("")

  const sortedSubmissions = useMemo(
    () =>
      [...submissions].sort((a, b) => {
        if (a.read !== b.read) {
          return a.read ? 1 : -1
        }
        return b.createdAt - a.createdAt
      }),
    [submissions]
  )

  const fetchSubmissions = useCallback(async () => {
    setIsLoadingSubmissions(true)
    setError("")
    try {
      const response = await fetch("/api/admin/submissions", {
        method: "GET",
        credentials: "same-origin",
        cache: "no-store",
      })

      const payload = (await response.json()) as AdminSubmissionsResponse
      if (!response.ok || !payload.success) {
        throw new Error(payload.message || "Failed to load submissions.")
      }

      setSubmissions(Array.isArray(payload.submissions) ? payload.submissions : [])
    } catch (fetchError) {
      const message =
        fetchError instanceof Error
          ? fetchError.message
          : "Failed to load submissions."
      setError(message)
    } finally {
      setIsLoadingSubmissions(false)
    }
  }, [])

  const fetchProjectsCount = useCallback(async () => {
    setIsLoadingProjectsCount(true)
    try {
      const response = await fetch("/api/admin/projects", {
        method: "GET",
        credentials: "same-origin",
        cache: "no-store",
      })

      const payload = (await response.json()) as AdminProjectsResponse
      if (!response.ok || !payload.success) {
        throw new Error(payload.message || "Failed to load projects.")
      }

      const parsed = z
        .array(canonicalProjectDocumentSchema)
        .safeParse(payload.projects)
      if (!parsed.success) {
        throw new Error("Projects payload is invalid.")
      }

      setProjectsCount(parsed.data.length)
    } catch {
      setProjectsCount(null)
    } finally {
      setIsLoadingProjectsCount(false)
    }
  }, [])

  useEffect(() => {
    void fetchSubmissions()
  }, [fetchSubmissions])

  useEffect(() => {
    void fetchProjectsCount()
  }, [fetchProjectsCount])

  const handleMarkRead = useCallback(async (id: string) => {
    setIsUpdatingSubmission(true)
    try {
      const response = await fetch(`/api/admin/submissions/${id}`, {
        method: "PATCH",
        credentials: "same-origin",
      })
      const payload = (await response.json()) as {
        success?: boolean
        message?: string
      }
      if (!response.ok || !payload.success) {
        throw new Error(payload.message || "Failed to mark submission as read.")
      }

      setSubmissions((prev) =>
        prev.map((submission) =>
          submission._id === id ? { ...submission, read: true } : submission
        )
      )
    } catch (mutationError) {
      const message =
        mutationError instanceof Error
          ? mutationError.message
          : "Failed to mark submission as read."
      setError(message)
    } finally {
      setIsUpdatingSubmission(false)
    }
  }, [])

  const handleDelete = useCallback(async (id: string) => {
    setIsUpdatingSubmission(true)
    try {
      const response = await fetch(`/api/admin/submissions/${id}`, {
        method: "DELETE",
        credentials: "same-origin",
      })
      const payload = (await response.json()) as {
        success?: boolean
        message?: string
      }
      if (!response.ok || !payload.success) {
        throw new Error(payload.message || "Failed to delete submission.")
      }

      setSubmissions((prev) => prev.filter((submission) => submission._id !== id))
    } catch (mutationError) {
      const message =
        mutationError instanceof Error
          ? mutationError.message
          : "Failed to delete submission."
      setError(message)
    } finally {
      setIsUpdatingSubmission(false)
    }
  }, [])

  return (
    <div className="space-y-6">
      <StatsBar
        submissions={sortedSubmissions}
        loading={isLoadingSubmissions}
        projectsCount={projectsCount}
        loadingProjects={isLoadingProjectsCount}
      />

      {error ? (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <div>
        <h1 className="mb-6 text-xl font-semibold tracking-tight">
          {tab === "projects"
            ? "Projects"
            : tab === "analytics"
              ? "Visitor Analytics"
              : "Contact Submissions"}
        </h1>
        {tab === "projects" ? (
          <ProjectsTable onProjectsCountChange={(count) => setProjectsCount(count)} />
        ) : tab === "analytics" ? (
          <AnalyticsPanel />
        ) : (
          <SubmissionsTable
            submissions={sortedSubmissions}
            onMarkRead={handleMarkRead}
            onDelete={handleDelete}
            isUpdating={isUpdatingSubmission || isLoadingSubmissions}
          />
        )}
      </div>
    </div>
  )
}

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="text-sm text-muted-foreground">Loading...</div>}>
      <AdminContent />
    </Suspense>
  )
}
