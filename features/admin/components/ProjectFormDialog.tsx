"use client"

import { PROJECT_STATUS_VALUES, PROJECT_TYPE_VALUES } from "@/lib/projects/schema"
import {
  canonicalProjectInputSchema,
  type CanonicalProjectInputValidated,
} from "@/lib/projects/validation"
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
import type { AdminProject } from "@/features/admin/types"

export type ProjectFormState = {
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

function parseList(value: string): string[] {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean)
}

function toOptionalNumber(value: string): number | undefined {
  const trimmed = value.trim()
  if (!trimmed) return undefined
  const parsed = Number(trimmed)
  return Number.isFinite(parsed) ? parsed : undefined
}

export function createEmptyForm(sortOrder: number): ProjectFormState {
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

export function projectToForm(project: AdminProject): ProjectFormState {
  return {
    slug: project.slug,
    title: project.title,
    shortDescription: project.shortDescription,
    type: project.type,
    status: project.status,
    featured: project.featured,
    published: project.published,
    sortOrder: String(project.sortOrder),
    tags: project.tags.join("\n"),
    stack: project.stack.join("\n"),
    liveDemo: project.links.liveDemo ?? "",
    github: project.links.github ?? "",
    mdxSlug: project.caseStudy.mdxSlug ?? "",
    architectureRendering: project.details.architecture.rendering,
    architectureData: project.details.architecture.data,
    architectureDomain: project.details.architecture.domain,
    architecturePerformance: project.details.architecture.performance,
    highlights: project.details.highlights.join("\n"),
    complexity: project.details.complexity.join("\n"),
    security: project.details.security.join("\n"),
    lessons: project.details.lessons.join("\n"),
    desktopScreens: project.screenshots.desktop.join("\n"),
    mobileScreens: project.screenshots.mobile.join("\n"),
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

export function toCanonicalInput(
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

type ProjectFormDialogProps = {
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
  fieldErrors: Record<string, string>
}

export function ProjectFormDialog({
  open,
  onOpenChange,
  form,
  onFieldChange,
  onSubmit,
  isSubmitting,
  mode,
  fieldErrors,
}: ProjectFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] w-[95vw] max-w-[95vw] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden border-primary/30 sm:max-w-6xl">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Add Project" : "Edit Project"}</DialogTitle>
          <DialogDescription>
            Project payloads are validated against the canonical schema before submit.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 md:grid-cols-2">
          <Field
            label="Slug"
            fieldKey="slug"
            value={form.slug}
            onChange={(value) => onFieldChange("slug", value)}
            fieldErrors={fieldErrors}
          />
          <Field
            label="Title"
            fieldKey="title"
            value={form.title}
            onChange={(value) => onFieldChange("title", value)}
            fieldErrors={fieldErrors}
          />
        </div>
        <FieldArea
          label="Short Description"
          fieldKey="shortDescription"
          value={form.shortDescription}
          onChange={(value) => onFieldChange("shortDescription", value)}
          fieldErrors={fieldErrors}
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
            {fieldErrors.type ? (
              <p className="text-destructive text-xs">{fieldErrors.type}</p>
            ) : null}
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
            {fieldErrors.status ? (
              <p className="text-destructive text-xs">{fieldErrors.status}</p>
            ) : null}
          </div>
          <Field
            label="Sort Order"
            fieldKey="sortOrder"
            value={form.sortOrder}
            onChange={(value) => onFieldChange("sortOrder", value)}
            fieldErrors={fieldErrors}
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
          <FieldArea
            label="Tags"
            fieldKey="tags"
            value={form.tags}
            onChange={(value) => onFieldChange("tags", value)}
            fieldErrors={fieldErrors}
          />
          <FieldArea
            label="Stack"
            fieldKey="stack"
            value={form.stack}
            onChange={(value) => onFieldChange("stack", value)}
            fieldErrors={fieldErrors}
          />
          <Field
            label="Live Demo URL"
            fieldKey="links.liveDemo"
            value={form.liveDemo}
            onChange={(value) => onFieldChange("liveDemo", value)}
            fieldErrors={fieldErrors}
          />
          <Field
            label="GitHub URL"
            fieldKey="links.github"
            value={form.github}
            onChange={(value) => onFieldChange("github", value)}
            fieldErrors={fieldErrors}
          />
          <Field
            label="MDX Slug"
            fieldKey="caseStudy.mdxSlug"
            value={form.mdxSlug}
            onChange={(value) => onFieldChange("mdxSlug", value)}
            fieldErrors={fieldErrors}
          />
          <Field
            label="SEO Title"
            fieldKey="seo.title"
            value={form.seoTitle}
            onChange={(value) => onFieldChange("seoTitle", value)}
            fieldErrors={fieldErrors}
          />
          <Field
            label="SEO Description"
            fieldKey="seo.description"
            value={form.seoDescription}
            onChange={(value) => onFieldChange("seoDescription", value)}
            fieldErrors={fieldErrors}
          />
          <Field
            label="Lighthouse"
            fieldKey="metrics.lighthouse"
            value={form.lighthouse}
            onChange={(value) => onFieldChange("lighthouse", value)}
            fieldErrors={fieldErrors}
          />
          <Field
            label="TTFB (ms)"
            fieldKey="metrics.ttfb"
            value={form.ttfb}
            onChange={(value) => onFieldChange("ttfb", value)}
            fieldErrors={fieldErrors}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FieldArea
            label="Architecture Rendering"
            fieldKey="details.architecture.rendering"
            value={form.architectureRendering}
            onChange={(value) => onFieldChange("architectureRendering", value)}
            fieldErrors={fieldErrors}
          />
          <FieldArea
            label="Architecture Data"
            fieldKey="details.architecture.data"
            value={form.architectureData}
            onChange={(value) => onFieldChange("architectureData", value)}
            fieldErrors={fieldErrors}
          />
          <FieldArea
            label="Architecture Domain"
            fieldKey="details.architecture.domain"
            value={form.architectureDomain}
            onChange={(value) => onFieldChange("architectureDomain", value)}
            fieldErrors={fieldErrors}
          />
          <FieldArea
            label="Architecture Performance"
            fieldKey="details.architecture.performance"
            value={form.architecturePerformance}
            onChange={(value) => onFieldChange("architecturePerformance", value)}
            fieldErrors={fieldErrors}
          />
          <FieldArea
            label="Highlights"
            fieldKey="details.highlights"
            value={form.highlights}
            onChange={(value) => onFieldChange("highlights", value)}
            fieldErrors={fieldErrors}
          />
          <FieldArea
            label="Complexity"
            fieldKey="details.complexity"
            value={form.complexity}
            onChange={(value) => onFieldChange("complexity", value)}
            fieldErrors={fieldErrors}
          />
          <FieldArea
            label="Security"
            fieldKey="details.security"
            value={form.security}
            onChange={(value) => onFieldChange("security", value)}
            fieldErrors={fieldErrors}
          />
          <FieldArea
            label="Lessons"
            fieldKey="details.lessons"
            value={form.lessons}
            onChange={(value) => onFieldChange("lessons", value)}
            fieldErrors={fieldErrors}
          />
          <FieldArea
            label="Desktop Screens"
            fieldKey="screenshots.desktop"
            value={form.desktopScreens}
            onChange={(value) => onFieldChange("desktopScreens", value)}
            fieldErrors={fieldErrors}
          />
          <FieldArea
            label="Mobile Screens"
            fieldKey="screenshots.mobile"
            value={form.mobileScreens}
            onChange={(value) => onFieldChange("mobileScreens", value)}
            fieldErrors={fieldErrors}
          />
          <Field
            label="Selected Work Main"
            fieldKey="screenshots.selectedWorkMain"
            value={form.selectedWorkMain}
            onChange={(value) => onFieldChange("selectedWorkMain", value)}
            fieldErrors={fieldErrors}
          />
          <Field
            label="Selected Work Aside"
            fieldKey="screenshots.selectedWorkAside"
            value={form.selectedWorkAside}
            onChange={(value) => onFieldChange("selectedWorkAside", value)}
            fieldErrors={fieldErrors}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={() => void onSubmit()} disabled={isSubmitting}>
            {isSubmitting
              ? mode === "create"
                ? "Creating..."
                : "Saving..."
              : mode === "create"
                ? "Create Project"
                : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function Field({
  label,
  fieldKey,
  value,
  onChange,
  fieldErrors,
}: {
  label: string
  fieldKey: string
  value: string
  onChange: (value: string) => void
  fieldErrors: Record<string, string>
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input value={value} onChange={(event) => onChange(event.target.value)} />
      {fieldErrors[fieldKey] ? (
        <p className="text-destructive text-xs">{fieldErrors[fieldKey]}</p>
      ) : null}
    </div>
  )
}

function FieldArea({
  label,
  fieldKey,
  value,
  onChange,
  fieldErrors,
}: {
  label: string
  fieldKey: string
  value: string
  onChange: (value: string) => void
  fieldErrors: Record<string, string>
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Textarea rows={2} value={value} onChange={(event) => onChange(event.target.value)} />
      {fieldErrors[fieldKey] ? (
        <p className="text-destructive text-xs">{fieldErrors[fieldKey]}</p>
      ) : null}
    </div>
  )
}
