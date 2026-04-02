import { z } from "zod"
import { PROJECT_STATUS_VALUES, PROJECT_TYPE_VALUES } from "@/lib/projects/schema"

const nonEmptyString = z.string().trim().min(1)
const kebabCaseSlug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

function isHttpUrl(value: string): boolean {
  try {
    const parsed = new URL(value)
    return parsed.protocol === "http:" || parsed.protocol === "https:"
  } catch {
    return false
  }
}

function isAssetReference(value: string): boolean {
  return value.startsWith("/") || isHttpUrl(value)
}

const optionalTrimmedString = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value && value.length > 0 ? value : undefined))

const optionalHttpUrl = optionalTrimmedString.refine(
  (value) => !value || isHttpUrl(value),
  {
    message: "Must be a valid http(s) URL.",
  }
)

const assetReferenceString = nonEmptyString.refine(
  (value) => isAssetReference(value),
  {
    message: "Must be an absolute path (/...) or a valid http(s) URL.",
  }
)

const optionalAssetReference = optionalTrimmedString.refine(
  (value) => !value || isAssetReference(value),
  {
    message: "Must be an absolute path (/...) or a valid http(s) URL.",
  }
)

const optionalKebabCaseSlug = optionalTrimmedString.refine(
  (value) => !value || kebabCaseSlug.test(value),
  {
    message: "Must be lowercase kebab-case.",
  }
)

const normalizedStringListSchema = z
  .array(z.string().trim())
  .transform((items) => {
    const seen = new Set<string>()
    const normalized: string[] = []

    for (const item of items) {
      if (!item || seen.has(item)) continue
      seen.add(item)
      normalized.push(item)
    }

    return normalized
  })

const normalizedAssetListSchema = z
  .array(assetReferenceString)
  .transform((items) => {
    const seen = new Set<string>()
    const normalized: string[] = []

    for (const item of items) {
      if (seen.has(item)) continue
      seen.add(item)
      normalized.push(item)
    }

    return normalized
  })

export const canonicalProjectInputSchema = z.object({
  slug: nonEmptyString.regex(kebabCaseSlug, "Slug must be lowercase kebab-case."),
  title: nonEmptyString,
  shortDescription: nonEmptyString,
  type: z.enum(PROJECT_TYPE_VALUES),
  status: z.enum(PROJECT_STATUS_VALUES),
  tags: normalizedStringListSchema,
  stack: normalizedStringListSchema,
  featured: z.boolean(),
  published: z.boolean(),
  sortOrder: z.number().int().min(0),
  seo: z.object({
    title: optionalTrimmedString.refine(
      (value) => !value || value.length <= 120,
      "Must be 120 characters or fewer."
    ),
    description: optionalTrimmedString.refine(
      (value) => !value || value.length <= 320,
      "Must be 320 characters or fewer."
    ),
  }),
  details: z.object({
    highlights: normalizedStringListSchema,
    architecture: z.object({
      rendering: nonEmptyString,
      data: nonEmptyString,
      domain: nonEmptyString,
      performance: nonEmptyString,
    }),
    complexity: normalizedStringListSchema,
    security: normalizedStringListSchema,
    lessons: normalizedStringListSchema,
  }),
  metrics: z.object({
    lighthouse: z.number().finite().min(0).max(100).optional(),
    ttfb: z.number().finite().min(0).optional(),
  }),
  screenshots: z.object({
    desktop: normalizedAssetListSchema,
    mobile: normalizedAssetListSchema,
    selectedWorkMain: optionalAssetReference,
    selectedWorkAside: optionalAssetReference,
  }),
  links: z.object({
    liveDemo: optionalHttpUrl,
    github: optionalHttpUrl,
  }),
  caseStudy: z.object({
    mdxSlug: optionalKebabCaseSlug,
    sections: z
      .object({
        problem: optionalTrimmedString,
        approach: optionalTrimmedString,
        architecture: optionalTrimmedString,
        deepArchitecture: optionalTrimmedString,
        performance: optionalTrimmedString,
        security: optionalTrimmedString,
        lessons: optionalTrimmedString,
        outcome: optionalTrimmedString,
      })
      .optional(),
  }),
})

export const canonicalProjectDocumentSchema = canonicalProjectInputSchema.extend({
  _id: z.string(),
  _creationTime: z.number(),
  createdAt: z.number(),
  updatedAt: z.number(),
})

export type CanonicalProjectInputValidated = z.infer<
  typeof canonicalProjectInputSchema
>
export type CanonicalProjectDocumentValidated = z.infer<
  typeof canonicalProjectDocumentSchema
>
