import type { MetadataRoute } from "next"
import { getProjectSlugs } from "@/data/projects"
import { absoluteUrl } from "@/lib/seo"

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["/", "/about", "/work", "/contact"]
  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((pathname) => ({
    url: absoluteUrl(pathname),
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: pathname === "/" ? 1 : 0.8,
  }))

  const projectEntries: MetadataRoute.Sitemap = getProjectSlugs().map((slug) => ({
    url: absoluteUrl(`/projects/${slug}`),
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }))

  return [...staticEntries, ...projectEntries]
}
