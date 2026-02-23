import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MetricBadge } from "@/components/shared/MetricBadge"
import { TagPills } from "@/components/shared/TagPills"
import type { ProjectRecord } from "@/data/projects"

type CaseStudyHeroProps = {
  project: ProjectRecord
}

export function CaseStudyHero({ project }: CaseStudyHeroProps) {
  return (
    <section id="summary" className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          {project.meta.title}
        </h1>
        <p className="max-w-3xl leading-relaxed text-muted-foreground">
          {project.shortDescription}
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-border/60 px-3 py-1 text-xs text-muted-foreground">
            {project.meta.type}
          </span>
          <span className="rounded-full border border-border/60 px-3 py-1 text-xs text-muted-foreground">
            {project.meta.status}
          </span>
        </div>
        <TagPills tags={project.meta.tags} />
        <TagPills tags={project.meta.stack} />
      </div>

      {project.metrics?.lighthouse || project.metrics?.ttfb ? (
        <div className="flex flex-wrap gap-2">
          {typeof project.metrics?.lighthouse === "number" ? (
            <MetricBadge label="Lighthouse" value={project.metrics.lighthouse} />
          ) : null}
          {typeof project.metrics?.ttfb === "number" ? (
            <MetricBadge label="TTFB" value={`${project.metrics.ttfb}ms`} />
          ) : null}
          {typeof project.imageCount === "number" ? (
            <MetricBadge label="Screens" value={project.imageCount} />
          ) : null}
        </div>
      ) : null}

      {project.details.highlights.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {project.details.highlights.map((highlight) => (
            <Card key={highlight} className="border-border/70 bg-card/50 shadow-none">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium tracking-tight">
                  Highlight
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {highlight}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}
    </section>
  )
}

