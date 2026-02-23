import { getWorkPageData } from "@/services/projectService"

export async function getProjects(tag: string) {
  return getWorkPageData(tag)
}
