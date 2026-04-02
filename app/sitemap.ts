import type { MetadataRoute } from "next"
import { absoluteUrl } from "@/lib/seo"
import { getProjectSlugsForPublicReadData } from "@/services/projectService"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ["/", "/about", "/work", "/contact"]
  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((pathname) => ({
    url: absoluteUrl(pathname),
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: pathname === "/" ? 1 : 0.8,
  }))

  const slugs = await getProjectSlugsForPublicReadData()
  const projectEntries: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: absoluteUrl(`/projects/${slug}`),
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }))

  return [...staticEntries, ...projectEntries]
}
