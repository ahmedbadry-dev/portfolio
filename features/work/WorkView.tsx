import { Container } from "@/components/layout/Container"
import { WorkFilters } from "@/features/work/components/WorkFilters"
import { WorkResults } from "@/features/work/components/WorkResults"
import type { Project } from "@/data/projects"

type WorkViewProps = {
  activeTag: string
  projects: Project[]
  tags: string[]
}

export function WorkView({ activeTag, projects, tags }: WorkViewProps) {
  return (
    <section className="pb-20 pt-6 md:pb-32 md:pt-8">
      <Container>
        <WorkFilters activeTag={activeTag} filters={tags} />

        <div className="mb-6 mt-8 space-y-2 md:mb-10 md:mt-16 md:space-y-4">
          <h1 className="text-3xl font-medium tracking-tight md:text-4xl">
            Selected Work
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
            Swipe projects, open the live demo, and review implementation details.
          </p>
        </div>

        <WorkResults key={activeTag} activeTag={activeTag} projects={projects} />
      </Container>
    </section>
  )
}

