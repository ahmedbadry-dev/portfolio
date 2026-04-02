"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { z } from "zod"
import { Edit, ExternalLink, Github, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { PROJECT_STATUS_VALUES, PROJECT_TYPE_VALUES } from "@/lib/projects/schema"
import {
  canonicalProjectDocumentSchema,
  canonicalProjectInputSchema,
  type CanonicalProjectInputValidated,
} from "@/lib/projects/validation"
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

type ProjectFormState = {
  slug: string
  title: string
  shortDescription: string
  type: (typeof PROJECT_TYPE_VALUES)[number]
  status: (typeof PROJECT_STATUS_VALUES)[number]
  featured: boolean
  published: boolean
  sortOrder: string
  tags: string
  stack: string
  liveDemo: string
  github: string
  mdxSlug: string
  architectureRendering: string
  architectureData: string
  architectureDomain: string
  architecturePerformance: string
  highlights: string
  complexity: string
  security: string
  lessons: string
  desktopScreens: string
  mobileScreens: string
  selectedWorkMain: string
  selectedWorkAside: string
  seoTitle: string
  seoDescription: string
  lighthouse: string
  ttfb: string
}

function toValidationMessage(error: z.ZodError): string {
  const first = error.issues[0]
  if (!first) return "Validation failed."
  const path = first.path.join(".")
  return path ? `${path}: ${first.message}` : first.message
}

function parseList(value: string): string[] {
  return value
    .split(/[\n,]/g)
    .map((item) => item.trim())
    .filter(Boolean)
}

function toOptionalNumber(value: string): number | undefined {
  const trimmed = value.trim()
  if (!trimmed) return undefined
  const parsed = Number(trimmed)
  return Number.isFinite(parsed) ? parsed : undefined
}

function createEmptyForm(sortOrder: number): ProjectFormState {
  return {
    slug: "",
    title: "",
    shortDescription: "",
    type: "frontend",
    status: "production",
    featured: false,
    published: true,
    sortOrder: String(sortOrder),
    tags: "",
    stack: "",
    liveDemo: "",
    github: "",
    mdxSlug: "",
    architectureRendering: "",
    architectureData: "",
    architectureDomain: "",
    architecturePerformance: "",
    highlights: "",
    complexity: "",
    security: "",
    lessons: "",
    desktopScreens: "",
    mobileScreens: "",
    selectedWorkMain: "",
    selectedWorkAside: "",
    seoTitle: "",
    seoDescription: "",
    lighthouse: "",
    ttfb: "",
  }
}

function projectToForm(project: AdminProject): ProjectFormState {
  return {
    slug: project.slug,
    title: project.title,
    shortDescription: project.shortDescription,
    type: project.type,
    status: project.status,
    featured: project.featured,
    published: project.published,
    sortOrder: String(project.sortOrder),
    tags: project.tags.join(", "),
    stack: project.stack.join(", "),
    liveDemo: project.links.liveDemo ?? "",
    github: project.links.github ?? "",
    mdxSlug: project.caseStudy.mdxSlug ?? "",
    architectureRendering: project.details.architecture.rendering,
    architectureData: project.details.architecture.data,
    architectureDomain: project.details.architecture.domain,
    architecturePerformance: project.details.architecture.performance,
    highlights: project.details.highlights.join(", "),
    complexity: project.details.complexity.join(", "),
    security: project.details.security.join(", "),
    lessons: project.details.lessons.join(", "),
    desktopScreens: project.screenshots.desktop.join(", "),
    mobileScreens: project.screenshots.mobile.join(", "),
    selectedWorkMain: project.screenshots.selectedWorkMain ?? "",
    selectedWorkAside: project.screenshots.selectedWorkAside ?? "",
    seoTitle: project.seo.title ?? "",
    seoDescription: project.seo.description ?? "",
    lighthouse:
      typeof project.metrics.lighthouse === "number"
        ? String(project.metrics.lighthouse)
        : "",
    ttfb:
      typeof project.metrics.ttfb === "number" ? String(project.metrics.ttfb) : "",
  }
}

function toCanonicalInput(
  form: ProjectFormState,
  options?: {
    existingSections?: AdminProject["caseStudy"]["sections"]
  }
): CanonicalProjectInputValidated {
  const parsedSortOrder = Number.parseInt(form.sortOrder.trim() || "0", 10)

  const payload = {
    slug: form.slug.trim(),
    title: form.title.trim(),
    shortDescription: form.shortDescription.trim(),
    type: form.type,
    status: form.status,
    featured: form.featured,
    published: form.published,
    sortOrder: Number.isFinite(parsedSortOrder) ? parsedSortOrder : 0,
    tags: parseList(form.tags),
    stack: parseList(form.stack),
    seo: {
      title: form.seoTitle.trim() || undefined,
      description: form.seoDescription.trim() || undefined,
    },
    details: {
      highlights: parseList(form.highlights),
      architecture: {
        rendering: form.architectureRendering.trim(),
        data: form.architectureData.trim(),
        domain: form.architectureDomain.trim(),
        performance: form.architecturePerformance.trim(),
      },
      complexity: parseList(form.complexity),
      security: parseList(form.security),
      lessons: parseList(form.lessons),
    },
    metrics: {
      lighthouse: toOptionalNumber(form.lighthouse),
      ttfb: toOptionalNumber(form.ttfb),
    },
    screenshots: {
      desktop: parseList(form.desktopScreens),
      mobile: parseList(form.mobileScreens),
      selectedWorkMain: form.selectedWorkMain.trim() || undefined,
      selectedWorkAside: form.selectedWorkAside.trim() || undefined,
    },
    links: {
      liveDemo: form.liveDemo.trim() || undefined,
      github: form.github.trim() || undefined,
    },
    caseStudy: {
      mdxSlug: form.mdxSlug.trim() || undefined,
      sections: options?.existingSections,
    },
  }

  return canonicalProjectInputSchema.parse(payload)
}

function ProjectFormDialog({
  open,
  onOpenChange,
  form,
  onFieldChange,
  onSubmit,
  isSubmitting,
  mode,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  form: ProjectFormState
  onFieldChange: <K extends keyof ProjectFormState>(
    key: K,
    value: ProjectFormState[K]
  ) => void
  onSubmit: () => Promise<void>
  isSubmitting: boolean
  mode: "create" | "edit"
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Add Project" : "Edit Project"}</DialogTitle>
          <DialogDescription>
            Project payloads are validated against the canonical schema before submit.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Slug" value={form.slug} onChange={(value) => onFieldChange("slug", value)} />
          <Field label="Title" value={form.title} onChange={(value) => onFieldChange("title", value)} />
        </div>
        <FieldArea
          label="Short Description"
          value={form.shortDescription}
          onChange={(value) => onFieldChange("shortDescription", value)}
        />

        <div className="grid gap-4 md:grid-cols-4">
          <div className="space-y-2">
            <Label>Type</Label>
            <select
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
              value={form.type}
              onChange={(event) =>
                onFieldChange("type", event.target.value as ProjectFormState["type"])
              }
            >
              {PROJECT_TYPE_VALUES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <select
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
              value={form.status}
              onChange={(event) =>
                onFieldChange("status", event.target.value as ProjectFormState["status"])
              }
            >
              {PROJECT_STATUS_VALUES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <Field
            label="Sort Order"
            value={form.sortOrder}
            onChange={(value) => onFieldChange("sortOrder", value)}
          />
          <div className="space-y-2">
            <Label>Flags</Label>
            <div className="flex h-9 items-center gap-4 rounded-md border border-input px-3 text-sm">
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(event) => onFieldChange("featured", event.target.checked)}
                />
                Featured
              </label>
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(event) => onFieldChange("published", event.target.checked)}
                />
                Published
              </label>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FieldArea label="Tags" value={form.tags} onChange={(value) => onFieldChange("tags", value)} />
          <FieldArea label="Stack" value={form.stack} onChange={(value) => onFieldChange("stack", value)} />
          <Field label="Live Demo URL" value={form.liveDemo} onChange={(value) => onFieldChange("liveDemo", value)} />
          <Field label="GitHub URL" value={form.github} onChange={(value) => onFieldChange("github", value)} />
          <Field label="MDX Slug" value={form.mdxSlug} onChange={(value) => onFieldChange("mdxSlug", value)} />
          <Field label="SEO Title" value={form.seoTitle} onChange={(value) => onFieldChange("seoTitle", value)} />
          <Field label="SEO Description" value={form.seoDescription} onChange={(value) => onFieldChange("seoDescription", value)} />
          <Field label="Lighthouse" value={form.lighthouse} onChange={(value) => onFieldChange("lighthouse", value)} />
          <Field label="TTFB (ms)" value={form.ttfb} onChange={(value) => onFieldChange("ttfb", value)} />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FieldArea label="Architecture Rendering" value={form.architectureRendering} onChange={(value) => onFieldChange("architectureRendering", value)} />
          <FieldArea label="Architecture Data" value={form.architectureData} onChange={(value) => onFieldChange("architectureData", value)} />
          <FieldArea label="Architecture Domain" value={form.architectureDomain} onChange={(value) => onFieldChange("architectureDomain", value)} />
          <FieldArea label="Architecture Performance" value={form.architecturePerformance} onChange={(value) => onFieldChange("architecturePerformance", value)} />
          <FieldArea label="Highlights" value={form.highlights} onChange={(value) => onFieldChange("highlights", value)} />
          <FieldArea label="Complexity" value={form.complexity} onChange={(value) => onFieldChange("complexity", value)} />
          <FieldArea label="Security" value={form.security} onChange={(value) => onFieldChange("security", value)} />
          <FieldArea label="Lessons" value={form.lessons} onChange={(value) => onFieldChange("lessons", value)} />
          <FieldArea label="Desktop Screens" value={form.desktopScreens} onChange={(value) => onFieldChange("desktopScreens", value)} />
          <FieldArea label="Mobile Screens" value={form.mobileScreens} onChange={(value) => onFieldChange("mobileScreens", value)} />
          <Field label="Selected Work Main" value={form.selectedWorkMain} onChange={(value) => onFieldChange("selectedWorkMain", value)} />
          <Field label="Selected Work Aside" value={form.selectedWorkAside} onChange={(value) => onFieldChange("selectedWorkAside", value)} />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={() => void onSubmit()} disabled={isSubmitting}>
            {isSubmitting ? (mode === "create" ? "Creating..." : "Saving...") : mode === "create" ? "Create Project" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input value={value} onChange={(event) => onChange(event.target.value)} />
    </div>
  )
}

function FieldArea({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Textarea rows={2} value={value} onChange={(event) => onChange(event.target.value)} />
    </div>
  )
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
    },
    []
  )

  const openCreate = useCallback(() => {
    const nextSort = projects.reduce((max, item) => Math.max(max, item.sortOrder), 0) + 1
    setEditingProject(null)
    setForm(createEmptyForm(nextSort))
    setIsFormOpen(true)
  }, [projects])

  const openEdit = useCallback((project: AdminProject) => {
    setEditingProject(project)
    setForm(projectToForm(project))
    setIsFormOpen(true)
  }, [])

  const submitForm = useCallback(async () => {
    setIsSaving(true)
    setFeedback(null)
    let payload: CanonicalProjectInputValidated
    try {
      payload = toCanonicalInput(form, {
        existingSections: editingProject?.caseStudy.sections,
      })
    } catch (error) {
      const message =
        error instanceof z.ZodError ? toValidationMessage(error) : "Validation failed."
      setFeedback({ type: "error", message })
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
        onOpenChange={setIsFormOpen}
        form={form}
        onFieldChange={updateForm}
        onSubmit={submitForm}
        isSubmitting={isSaving}
        mode={editingProject ? "edit" : "create"}
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
