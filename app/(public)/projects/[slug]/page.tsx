import { getMDXBySlug } from "@/features/case-study/mdx/mdx"
import { notFound } from "next/navigation"
import { MDXRemote } from "next-mdx-remote/rsc"
import { mdxComponents } from "@/features/case-study/mdx/components"
import { getProjectBySlug, getProjectSlugs } from "@/data/projects"

interface Props {
  params: Promise<{
    slug: string
  }>
}

export function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }))
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params
  const project = getProjectBySlug(slug)

  const source = getMDXBySlug(slug)

  if (!project || !source) {
    notFound()
  }

  return (
    <article className="max-w-3xl mx-auto py-32">
      <div className="sr-only">{project.title}</div>
      <MDXRemote source={source} components={mdxComponents} />
    </article>
  )
}
