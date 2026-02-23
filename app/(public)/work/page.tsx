import { WorkContainer } from "@/features/work/WorkContainer"
import { getWorkPageData } from "@/services/projectService"

interface WorkPageProps {
  searchParams: Promise<{ tag?: string }>
}

export default async function WorkPage({ searchParams }: WorkPageProps) {
  const { tag } = await searchParams
  const data = getWorkPageData(tag)

  return <WorkContainer {...data} />
}

