import type { Metadata } from "next"
import { Suspense } from "react"
import { WorkPageSkeleton } from "@/components/layout/RouteSkeletons"
import { PageViewTracker } from "@/features/analytics/components/PageViewTracker"
import { WorkContainer } from "@/features/work/WorkContainer"
import { buildPageMetadata } from "@/lib/seo"
import { getWorkPageDataForPublicRead } from "@/services/projectService"

interface WorkPageProps {
  searchParams: Promise<{ tag?: string }>
}

export function generateMetadata(): Metadata {
  return buildPageMetadata({
    title: "Work",
    description:
      "Case-study portfolio covering production systems, frontend architecture decisions, and measurable performance outcomes.",
    pathname: "/work",
  })
}

export default async function WorkPage({ searchParams }: WorkPageProps) {
  const { tag } = await searchParams
  const data = await getWorkPageDataForPublicRead(tag)

  return (
    <>
      <PageViewTracker routeType="work" />
      <Suspense fallback={<WorkPageSkeleton />}>
        <WorkContainer {...data} />
      </Suspense>
    </>
  )
}

