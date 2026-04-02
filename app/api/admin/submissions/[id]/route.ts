import { NextResponse } from "next/server"
import { requireAdminRequest } from "@/lib/admin/auth"
import {
  markSubmissionReadInConvex,
  removeSubmissionInConvex,
} from "@/lib/admin/convex"

type SubmissionRouteParams = {
  params: Promise<{
    id: string
  }>
}

export async function PATCH(request: Request, { params }: SubmissionRouteParams) {
  const auth = await requireAdminRequest(request)
  if (!auth.ok) {
    return auth.response
  }

  const { id } = await params
  try {
    const updatedId = await markSubmissionReadInConvex(id)
    return NextResponse.json({ success: true, id: updatedId ?? id })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update submission."
    return NextResponse.json({ success: false, message }, { status: 400 })
  }
}

export async function DELETE(request: Request, { params }: SubmissionRouteParams) {
  const auth = await requireAdminRequest(request)
  if (!auth.ok) {
    return auth.response
  }

  const { id } = await params
  try {
    const removedId = await removeSubmissionInConvex(id)
    return NextResponse.json({ success: true, id: removedId ?? id })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete submission."
    return NextResponse.json({ success: false, message }, { status: 400 })
  }
}
