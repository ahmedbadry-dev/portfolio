import type { Project } from "@/data/projects"
import { HomeView } from "@/features/home/HomeView"
import { getSelectedWorkProjectsForPublicRead } from "@/services/projectService"

type HomeContainerProps = {
  selectedProjects?: Project[]
}

export async function HomeContainer({ selectedProjects }: HomeContainerProps) {
  const resolvedSelectedProjects =
    selectedProjects ?? (await getSelectedWorkProjectsForPublicRead(3))

  return <HomeView selectedProjects={resolvedSelectedProjects} />
}

