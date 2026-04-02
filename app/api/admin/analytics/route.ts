import { NextResponse } from "next/server"
import { requireAdminRequest } from "@/lib/admin/auth"
import { getAnalyticsSummaryFromConvex } from "@/lib/analytics/convex"

export async function GET(request: Request) {
  const auth = await requireAdminRequest(request)
  if (!auth.ok) {
    return auth.response
  }

  try {
    const analytics = await getAnalyticsSummaryFromConvex()
    return NextResponse.json({ success: true, analytics })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load analytics summary."
    return NextResponse.json({ success: false, message }, { status: 500 })
  }
}

