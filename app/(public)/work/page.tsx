import type { Metadata } from "next"
import { Suspense } from "react"
import { WorkPageSkeleton } from "@/components/layout/RouteSkeletons"
import { WorkContainer } from "@/features/work/WorkContainer"
import { buildPageMetadata } from "@/lib/seo"
import { getWorkPageData } from "@/services/projectService"

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
  const data = getWorkPageData(tag)

  return (
    <Suspense fallback={<WorkPageSkeleton />}>
      <WorkContainer {...data} />
    </Suspense>
  )
}

