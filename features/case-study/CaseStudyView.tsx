import Link from "next/link"
import {
  AlertTriangle,
  BookOpen,
  Boxes,
  Gauge,
  Route,
  ShieldCheck,
  Sparkles,
} from "lucide-react"
import { MDXRemote } from "next-mdx-remote/rsc"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/layout/Container"
import { mdxComponents } from "@/features/case-study/mdx/components"
import { CaseImageCarousel } from "@/features/case-study/components/CaseImageCarousel"
import { CaseStudyHero } from "@/features/case-study/components/CaseStudyHero"
import { CaseStudySectionCard } from "@/features/case-study/components/CaseStudySectionCard"
import { ArchitectureVisual } from "@/features/case-study/components/ArchitectureVisual"
import { StickyProgressNav } from "@/features/case-study/components/StickyProgressNav"
import Reveal from "@/features/animations/motion/Reveal"
import type { CaseStudyPageData } from "@/services/caseStudyService"

type CaseStudyViewProps = CaseStudyPageData

export function CaseStudyView({ project, sections, progressItems }: CaseStudyViewProps) {
  return (
    <article className="py-20 md:py-24">
      <Container>
        <div className="space-y-10">
          <CaseImageCarousel
            title={project.meta.title}
            screenshots={project.screenshots}
          />

          <Reveal delay={0.06}>
            <CaseStudyHero project={project} />
          </Reveal>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_220px]">
          <div className="space-y-8">
            <Reveal>
              <CaseStudySectionCard
                id="problem"
                icon={AlertTriangle}
                title="Problem"
                subtitle="Constraints and product-level risks"
                chips={project.meta.tags.slice(0, 3)}
              >
                {sections.problem?.source ? (
                  <MDXRemote source={sections.problem.source} components={mdxComponents} />
                ) : (
                  <p className="leading-relaxed text-muted-foreground">
                    No problem statement was provided for this case study.
                  </p>
                )}
              </CaseStudySectionCard>
            </Reveal>

            <Reveal delay={0.05}>
              <CaseStudySectionCard
                id="approach"
                icon={Route}
                title="Approach"
                subtitle="Implementation direction and execution strategy"
                chips={project.meta.stack.slice(0, 3)}
              >
                {sections.approach?.source ? (
                  <MDXRemote source={sections.approach.source} components={mdxComponents} />
                ) : (
                  <ul className="space-y-2 text-muted-foreground">
                    {project.details.highlights.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
              </CaseStudySectionCard>
            </Reveal>

            <Reveal delay={0.1}>
              <CaseStudySectionCard
                id="architecture"
                icon={Boxes}
                title="Architecture"
                subtitle="System boundaries and layered decisions"
                chips={["rendering", "data", "domain"]}
              >
                <div className="space-y-6">
                  {sections.architecture?.source ? (
                    <MDXRemote source={sections.architecture.source} components={mdxComponents} />
                  ) : null}

                  <ArchitectureVisual project={project} />

                  {sections.deepArchitecture?.source ? (
                    <MDXRemote source={sections.deepArchitecture.source} components={mdxComponents} />
                  ) : null}
                </div>
              </CaseStudySectionCard>
            </Reveal>

            <Reveal delay={0.15}>
              <CaseStudySectionCard
                id="performance"
                icon={Gauge}
                title="Performance"
                subtitle="Measured runtime and rendering behavior"
                chips={[
                  typeof project.metrics?.lighthouse === "number"
                    ? `Lighthouse ${project.metrics.lighthouse}`
                    : "Lighthouse N/A",
                  typeof project.metrics?.ttfb === "number"
                    ? `TTFB ${project.metrics.ttfb}ms`
                    : "TTFB N/A",
                ]}
              >
                {sections.performance?.source ? (
                  <MDXRemote source={sections.performance.source} components={mdxComponents} />
                ) : (
                  <p className="leading-relaxed text-muted-foreground">
                    Performance notes are not available for this project.
                  </p>
                )}
              </CaseStudySectionCard>
            </Reveal>

            <Reveal delay={0.2}>
              <CaseStudySectionCard
                id="security"
                icon={ShieldCheck}
                title="Security"
                subtitle="Trust boundaries and protection model"
                chips={project.details.security.slice(0, 2)}
              >
                <div className="space-y-6">
                  {sections.security?.source ? (
                    <MDXRemote source={sections.security.source} components={mdxComponents} />
                  ) : null}

                  {project.details.security.length > 0 ? (
                    <ul className="space-y-2">
                      {project.details.security.map((item) => (
                        <li key={item} className="text-muted-foreground">
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </CaseStudySectionCard>
            </Reveal>

            <Reveal delay={0.25}>
              <CaseStudySectionCard
                id="lessons"
                icon={BookOpen}
                title="Lessons"
                subtitle="What improved engineering quality over time"
                chips={project.details.lessons.slice(0, 2)}
              >
                <div className="space-y-6">
                  {sections.lessons?.source ? (
                    <MDXRemote source={sections.lessons.source} components={mdxComponents} />
                  ) : null}

                  {project.details.lessons.length > 0 ? (
                    <ul className="space-y-2">
                      {project.details.lessons.map((item) => (
                        <li key={item} className="text-muted-foreground">
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </CaseStudySectionCard>
            </Reveal>

            <Reveal delay={0.3}>
              <CaseStudySectionCard
                id="outcome"
                icon={Sparkles}
                title="Outcome"
                subtitle="Resulting system quality and product impact"
                chips={[project.meta.status, project.meta.type]}
              >
                {sections.outcome?.source ? (
                  <MDXRemote source={sections.outcome.source} components={mdxComponents} />
                ) : (
                  <p className="leading-relaxed text-muted-foreground">
                    Outcome details are not available for this project.
                  </p>
                )}
              </CaseStudySectionCard>
            </Reveal>

            <Reveal delay={0.35} fromScale={0.98}>
              <section id="cta" className="rounded-xl border border-border/70 bg-card/45 p-8">
                <div className="space-y-4 text-center">
                  <p className="mx-auto max-w-2xl text-lg font-medium leading-relaxed tracking-tight">
                    Building a serious product with high engineering standards?
                    Let&apos;s architect it with clarity.
                  </p>
                  <Button
                    asChild
                    className="transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-sm"
                  >
                    <Link href="/contact">Start a Conversation</Link>
                  </Button>
                </div>
              </section>
            </Reveal>
          </div>

          <StickyProgressNav items={progressItems} />
        </div>
      </Container>
    </article>
  )
}
