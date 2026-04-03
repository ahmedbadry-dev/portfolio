import type { MetadataRoute } from "next"
import { absoluteUrl } from "@/lib/seo"
import { getCanonicalProjectsForPublicRead } from "@/repositories/projectRepository"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ["/", "/about", "/work", "/contact"]
  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((pathname) => ({
    url: absoluteUrl(pathname),
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: pathname === "/" ? 1 : 0.8,
  }))

  const projects = await getCanonicalProjectsForPublicRead()
  const projectEntries: MetadataRoute.Sitemap = projects.map((project) => ({
    url: absoluteUrl(`/projects/${project.slug}`),
    lastModified:
      typeof project.updatedAt === "number" && project.updatedAt > 0
        ? new Date(project.updatedAt)
        : new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }))

  return [...staticEntries, ...projectEntries]
}
