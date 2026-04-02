import { NextResponse } from "next/server"
import { requireAdminRequest } from "@/lib/admin/auth"
import { listAdminSubmissionsFromConvex } from "@/lib/admin/convex"

export async function GET(request: Request) {
  const auth = await requireAdminRequest(request)
  if (!auth.ok) {
    return auth.response
  }

  try {
    const submissions = await listAdminSubmissionsFromConvex()
    return NextResponse.json({ success: true, submissions })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load submissions."
    return NextResponse.json({ success: false, message }, { status: 500 })
  }
}
