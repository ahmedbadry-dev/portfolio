import { getMDXBySlug } from "@/features/case-study/mdx/mdx"
import { notFound } from "next/navigation"
import { MDXRemote } from "next-mdx-remote/rsc"
import { mdxComponents } from "@/features/case-study/mdx/components"
import { getProjectBySlug, getProjectSlugs } from "@/data/projects"
import { Container } from "@/components/layout/Container"
import { TagPills } from "@/components/shared/TagPills"
import { CaseImageCarousel } from "@/features/case-study/components/CaseImageCarousel"
import { CasePerformanceCard } from "@/features/case-study/components/CasePerformanceCard"

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
    <article className="py-20 md:py-24">
      <Container>
        <CaseImageCarousel title={project.title} screenshots={project.screenshots} />

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:gap-10">
          <section className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
            <header className="space-y-4">
              <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                {project.title}
              </h1>
              <p className="text-muted-foreground leading-relaxed">
                {project.description}
              </p>
              <TagPills tags={project.tags} />
            </header>

            <div className="space-y-6">
              <MDXRemote source={source} components={mdxComponents} />
            </div>
          </section>

          <aside className="animate-in fade-in slide-in-from-bottom-1 duration-700 delay-150">
            <CasePerformanceCard
              lighthouse={project.lighthouse}
              ttfb={project.ttfb}
              imageCount={project.imageCount}
            />
          </aside>
        </div>
      </Container>
    </article>
  )
}
