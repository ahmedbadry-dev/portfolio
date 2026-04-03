"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { z } from "zod"
import { Edit, ExternalLink, Github, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { canonicalProjectDocumentSchema } from "@/lib/projects/validation"
import { toValidationMessage } from "@/lib/utils/validation"
import {
  createEmptyForm,
  ProjectFormDialog,
  type ProjectFormState,
  projectToForm,
  toCanonicalInput,
} from "@/features/admin/components/ProjectFormDialog"
import type { AdminProject } from "@/features/admin/types"

type ProjectsTableProps = {
  onProjectsCountChange?: (count: number) => void
}

type ProjectsApiResponse = {
  success?: boolean
  projects?: unknown
  message?: string
}

type MutationApiResponse = {
  success?: boolean
  message?: string
}

function toFieldErrors(error: z.ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {}

  for (const issue of error.issues) {
    const key = issue.path.join(".") || "_form"
    if (!fieldErrors[key]) {
      fieldErrors[key] = issue.message
    }
  }

  return fieldErrors
}

export function ProjectsTable({ onProjectsCountChange }: ProjectsTableProps) {
  const [projects, setProjects] = useState<AdminProject[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<AdminProject | null>(null)
  const [deleteProject, setDeleteProject] = useState<AdminProject | null>(null)
  const [deleteConfirmSlug, setDeleteConfirmSlug] = useState("")
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [form, setForm] = useState<ProjectFormState>(() => createEmptyForm(0))

  const sortedProjects = useMemo(
    () =>
      [...projects].sort((a, b) =>
        a.sortOrder === b.sortOrder ? b.updatedAt - a.updatedAt : a.sortOrder - b.sortOrder
      ),
    [projects]
  )

  const refreshProjects = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/projects", {
        method: "GET",
        credentials: "same-origin",
        cache: "no-store",
      })
      const payload = (await response.json()) as ProjectsApiResponse
      if (!response.ok || !payload.success) {
        throw new Error(payload.message || "Failed to load projects.")
      }

      const parsed = z.array(canonicalProjectDocumentSchema).safeParse(payload.projects)
      if (!parsed.success) {
        throw new Error(toValidationMessage(parsed.error))
      }

      setProjects(parsed.data)
      onProjectsCountChange?.(parsed.data.length)
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load projects."
      setFeedback({ type: "error", message })
      setProjects([])
      onProjectsCountChange?.(0)
    } finally {
      setIsLoading(false)
    }
  }, [onProjectsCountChange])

  useEffect(() => {
    void refreshProjects()
  }, [refreshProjects])

  const updateForm = useCallback(
    <K extends keyof ProjectFormState>(key: K, value: ProjectFormState[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }))
      setFieldErrors({})
    },
    []
  )

  const openCreate = useCallback(() => {
    const nextSort = projects.reduce((max, item) => Math.max(max, item.sortOrder), 0) + 1
    setEditingProject(null)
    setFieldErrors({})
    setForm(createEmptyForm(nextSort))
    setIsFormOpen(true)
  }, [projects])

  const openEdit = useCallback((project: AdminProject) => {
    setEditingProject(project)
    setFieldErrors({})
    setForm(projectToForm(project))
    setIsFormOpen(true)
  }, [])

  const handleFormOpenChange = useCallback((open: boolean) => {
    setIsFormOpen(open)
    if (!open) {
      setFieldErrors({})
    }
  }, [])

  const submitForm = useCallback(async () => {
    setIsSaving(true)
    setFeedback(null)
    setFieldErrors({})

    const sections = editingProject?.caseStudy.sections
    let payload: ReturnType<typeof toCanonicalInput>

    try {
      payload = toCanonicalInput(form, {
        existingSections: sections,
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        setFieldErrors(toFieldErrors(error))
      } else {
        setFeedback({ type: "error", message: "Validation failed." })
      }
      setIsSaving(false)
      return
    }

    try {
      const response = await fetch(
        editingProject ? `/api/admin/projects/${editingProject._id}` : "/api/admin/projects",
        {
          method: editingProject ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          body: JSON.stringify({ project: payload }),
        }
      )
      const result = (await response.json()) as MutationApiResponse
      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            (editingProject ? "Failed to update project." : "Failed to create project.")
        )
      }

      setIsFormOpen(false)
      setEditingProject(null)
      setFieldErrors({})
      setFeedback({
        type: "success",
        message: editingProject ? "Project updated successfully." : "Project created successfully.",
      })
      await refreshProjects()
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to save project."
      setFeedback({ type: "error", message })
    } finally {
      setIsSaving(false)
    }
  }, [editingProject, form, refreshProjects])

  const deleteCurrentProject = useCallback(async () => {
    if (!deleteProject) return
    setIsDeleting(true)
    setFeedback(null)
    try {
      const response = await fetch(`/api/admin/projects/${deleteProject._id}`, {
        method: "DELETE",
        credentials: "same-origin",
      })
      const result = (await response.json()) as MutationApiResponse
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to delete project.")
      }
      setDeleteProject(null)
      setDeleteConfirmSlug("")
      setFeedback({ type: "success", message: "Project deleted successfully." })
      await refreshProjects()
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete project."
      setFeedback({ type: "error", message })
    } finally {
      setIsDeleting(false)
    }
  }, [deleteProject, refreshProjects])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">CRUD actions use protected admin APIs only.</p>
        <Button size="sm" onClick={openCreate}>
          <Plus className="size-4" />
          Add Project
        </Button>
      </div>

      {feedback ? (
        <div
          className={[
            "rounded-md border px-3 py-2 text-sm",
            feedback.type === "error"
              ? "border-destructive/30 bg-destructive/10 text-destructive"
              : "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
          ].join(" ")}
        >
          {feedback.message}
        </div>
      ) : null}

      {isLoading ? (
        <div className="rounded-xl border border-border/60 bg-card/40 p-8 text-center text-sm text-muted-foreground">
          Loading projects...
        </div>
      ) : sortedProjects.length === 0 ? (
        <div className="rounded-xl border border-border/60 bg-card/40 p-8 text-center text-sm text-muted-foreground">
          No projects yet.
        </div>
      ) : (
        <div className="space-y-3">
          {sortedProjects.map((project) => (
            <div
              key={project._id}
              className="flex flex-col gap-4 rounded-xl border border-border/60 bg-card/40 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium">{project.title}</span>
                  <span className="rounded-full border border-border/50 px-2 py-0.5 text-[10px] uppercase text-muted-foreground">
                    {project.status}
                  </span>
                  <span className="rounded-full border border-border/50 px-2 py-0.5 text-[10px] uppercase text-muted-foreground">
                    {project.type}
                  </span>
                </div>
                <p className="max-w-md truncate text-xs text-muted-foreground">{project.shortDescription}</p>
              </div>

              <div className="flex shrink-0 gap-2 overflow-x-auto">
                <Button asChild size="sm" variant="outline">
                  <Link href={`/projects/${project.slug}`}>Case Study</Link>
                </Button>
                <Button asChild size="sm" variant="outline" disabled={!project.links.liveDemo}>
                  <a href={project.links.liveDemo?.trim() || "#"} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="size-3.5" />
                    <span className="sr-only">Live demo</span>
                  </a>
                </Button>
                <Button asChild size="sm" variant="outline" disabled={!project.links.github}>
                  <a href={project.links.github?.trim() || "#"} target="_blank" rel="noopener noreferrer">
                    <Github className="size-3.5" />
                    <span className="sr-only">GitHub</span>
                  </a>
                </Button>
                <Button size="sm" variant="outline" onClick={() => openEdit(project)}>
                  <Edit className="size-3.5" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-destructive/30 text-destructive hover:bg-destructive/10"
                  onClick={() => {
                    setDeleteProject(project)
                    setDeleteConfirmSlug("")
                  }}
                >
                  <Trash2 className="size-3.5" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ProjectFormDialog
        open={isFormOpen}
        onOpenChange={handleFormOpenChange}
        form={form}
        onFieldChange={updateForm}
        onSubmit={submitForm}
        isSubmitting={isSaving}
        mode={editingProject ? "edit" : "create"}
        fieldErrors={fieldErrors}
      />

      <Dialog open={Boolean(deleteProject)} onOpenChange={(open) => !open && setDeleteProject(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              Type <strong>{deleteProject?.slug}</strong> to confirm permanent deletion.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label>Confirm slug</Label>
            <Input value={deleteConfirmSlug} onChange={(event) => setDeleteConfirmSlug(event.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteProject(null)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={
                isDeleting ||
                !deleteProject ||
                deleteConfirmSlug.trim() !== deleteProject.slug
              }
              onClick={() => void deleteCurrentProject()}
            >
              {isDeleting ? "Deleting..." : "Delete Project"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
