import { getMDXBySlug } from "@/features/case-study/mdx/mdx"
import { notFound } from "next/navigation"
import { MDXRemote } from "next-mdx-remote/rsc"
import { mdxComponents } from "@/features/case-study/mdx/components"

interface Props {
  params: Promise<{
    slug: string
  }>
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params

  const source = getMDXBySlug(slug)

  if (!source) {
    notFound()
  }

  return (
    <article className="max-w-3xl mx-auto py-32">
      <MDXRemote source={source} components={mdxComponents} />
    </article>
  )
}