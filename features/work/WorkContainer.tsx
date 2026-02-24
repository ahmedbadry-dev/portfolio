import type { Project } from "@/data/projects"
import { WorkView } from "@/features/work/WorkView"

type WorkContainerProps = {
  activeTag: string
  projects: Project[]
  tags: string[]
}

export function WorkContainer({ activeTag, projects, tags }: WorkContainerProps) {
  return <WorkView activeTag={activeTag} projects={projects} tags={tags} />
}

