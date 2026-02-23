import type { Project } from "@/data/projects"
import { WorkView } from "@/features/work/WorkView"

type WorkContainerProps = {
  activeTag: string
  projects: Project[]
  counts: Record<string, number>
  tags: string[]
}

export function WorkContainer(props: WorkContainerProps) {
  return <WorkView {...props} />
}

