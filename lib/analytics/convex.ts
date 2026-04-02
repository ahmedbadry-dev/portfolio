import { anyApi } from "convex/server"
import {
  getConvexAdminMutationKey,
  getConvexServerClient,
} from "@/lib/convex/serverClient"

export const ANALYTICS_ROUTE_TYPES = ["home", "work", "project"] as const
export type AnalyticsRouteType = (typeof ANALYTICS_ROUTE_TYPES)[number]

export type RecordPageViewArgs = {
  routeType: AnalyticsRouteType
  slug?: string
  visitorId: string
  userAgent?: string
}

type RecordPageViewResult = {
  counted: boolean
  deduped: boolean
  visitedAt?: number
  path?: string
}

export async function recordPageViewInConvex(
  args: RecordPageViewArgs
): Promise<RecordPageViewResult> {
  const client = getConvexServerClient()
  return client.mutation(anyApi.pageViews.record, {
    adminKey: getConvexAdminMutationKey(),
    routeType: args.routeType,
    ...(args.slug ? { slug: args.slug } : {}),
    visitorId: args.visitorId,
    ...(args.userAgent ? { userAgent: args.userAgent } : {}),
  })
}

export async function getAnalyticsSummaryFromConvex() {
  const client = getConvexServerClient()
  return client.query(anyApi.pageViews.summary, {
    adminKey: getConvexAdminMutationKey(),
  })
}

