import { NextResponse } from "next/server"
import { z } from "zod"
import { requireAdminRequest } from "@/lib/admin/auth"
import {
  createProjectInConvex,
  listAdminProjectsFromConvex,
} from "@/lib/admin/convex"
import {
  canonicalProjectDocumentSchema,
  canonicalProjectInputSchema,
} from "@/lib/projects/validation"
import { toValidationMessage } from "@/lib/utils/validation"

type CreateProjectPayload = {
  project?: unknown
}

export async function GET(request: Request) {
  const auth = await requireAdminRequest(request)
  if (!auth.ok) {
    return auth.response
  }

  try {
    const rawProjects = await listAdminProjectsFromConvex()
    const parseResult = z.array(canonicalProjectDocumentSchema).safeParse(rawProjects)
    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: `Invalid projects response: ${toValidationMessage(parseResult.error)}`,
        },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, projects: parseResult.data })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load projects."
    return NextResponse.json({ success: false, message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const auth = await requireAdminRequest(request)
  if (!auth.ok) {
    return auth.response
  }

  let payload: CreateProjectPayload
  try {
    payload = (await request.json()) as CreateProjectPayload
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid JSON payload." },
      { status: 400 }
    )
  }

  if (!payload.project) {
    return NextResponse.json(
      { success: false, message: "Project payload is required." },
      { status: 400 }
    )
  }

  const projectResult = canonicalProjectInputSchema.safeParse(payload.project)
  if (!projectResult.success) {
    return NextResponse.json(
      { success: false, message: toValidationMessage(projectResult.error) },
      { status: 400 }
    )
  }

  try {
    const id = await createProjectInConvex(projectResult.data)
    return NextResponse.json({ success: true, id })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create project."
    return NextResponse.json({ success: false, message }, { status: 400 })
  }
}
