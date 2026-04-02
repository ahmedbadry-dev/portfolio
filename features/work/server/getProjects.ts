import { getWorkPageDataForPublicRead } from "@/services/projectService"

export async function getProjects(tag: string) {
  return getWorkPageDataForPublicRead(tag)
}
