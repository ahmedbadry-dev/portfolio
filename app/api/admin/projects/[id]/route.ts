import { NextResponse } from "next/server"
import { requireAdminRequest } from "@/lib/admin/auth"
import { removeProjectInConvex, updateProjectInConvex } from "@/lib/admin/convex"
import { canonicalProjectInputSchema } from "@/lib/projects/validation"
import { toValidationMessage } from "@/lib/utils/validation"

type UpdateProjectPayload = {
  project?: unknown
}

type ProjectRouteParams = {
  params: Promise<{
    id: string
  }>
}

export async function PATCH(request: Request, { params }: ProjectRouteParams) {
  const auth = await requireAdminRequest(request)
  if (!auth.ok) {
    return auth.response
  }

  const { id } = await params
  if (!id?.trim()) {
    return NextResponse.json(
      { success: false, message: "Project id is required." },
      { status: 400 }
    )
  }

  let payload: UpdateProjectPayload
  try {
    payload = (await request.json()) as UpdateProjectPayload
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
    const updatedId = await updateProjectInConvex(id, projectResult.data)
    return NextResponse.json({ success: true, id: updatedId })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update project."
    return NextResponse.json({ success: false, message }, { status: 400 })
  }
}

export async function DELETE(request: Request, { params }: ProjectRouteParams) {
  const auth = await requireAdminRequest(request)
  if (!auth.ok) {
    return auth.response
  }

  const { id } = await params
  if (!id?.trim()) {
    return NextResponse.json(
      { success: false, message: "Project id is required." },
      { status: 400 }
    )
  }

  try {
    const removedId = await removeProjectInConvex(id)
    return NextResponse.json({ success: true, id: removedId })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete project."
    return NextResponse.json({ success: false, message }, { status: 400 })
  }
}
