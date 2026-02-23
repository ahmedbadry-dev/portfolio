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

export type ParsedMdxSection = {
  title: string
  source: string
}

export function parseMdxSections(source: string): ParsedMdxSection[] {
  const lines = source.split(/\r?\n/)
  const sections: ParsedMdxSection[] = []

  let currentTitle = ""
  let currentLines: string[] = []
  let inFrontmatter = false
  let frontmatterPassed = false

  for (const line of lines) {
    if (!frontmatterPassed && line.trim() === "---") {
      inFrontmatter = !inFrontmatter
      if (!inFrontmatter) {
        frontmatterPassed = true
      }
      continue
    }

    if (inFrontmatter) {
      continue
    }

    if (line.startsWith("## ")) {
      if (currentTitle) {
        sections.push({
          title: currentTitle,
          source: currentLines.join("\n").trim(),
        })
      }
      currentTitle = line.replace(/^##\s+/, "").trim()
      currentLines = []
      continue
    }

    if (currentTitle) {
      currentLines.push(line)
    }
  }

  if (currentTitle) {
    sections.push({
      title: currentTitle,
      source: currentLines.join("\n").trim(),
    })
  }

  return sections
}

export function findMdxSection(
  sections: ParsedMdxSection[],
  titleIncludes: string
): ParsedMdxSection | null {
  const target = titleIncludes.toLowerCase()
  return (
    sections.find((section) => section.title.toLowerCase().includes(target)) ??
    null
  )
}
