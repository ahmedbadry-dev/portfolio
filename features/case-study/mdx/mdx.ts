import fs from "fs"
import path from "path"

const root = process.cwd()

export function getCaseStudyMdxPath(slug: string): string {
  return path.join(root, "content", "projects", `${slug}.mdx`)
}

export function getMDXBySlug(slug: string) {
  const filePath = getCaseStudyMdxPath(slug)

  if (!fs.existsSync(filePath)) {
    return null
  }

  const source = fs.readFileSync(filePath, "utf-8")

  return source
}