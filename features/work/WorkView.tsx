import { Container } from "@/components/layout/Container"
import { WorkFilters } from "@/features/work/components/WorkFilters"
import { WorkResults } from "@/features/work/components/WorkResults"
import type { Project } from "@/data/projects"

type WorkViewProps = {
  activeTag: string
  projects: Project[]
  counts: Record<string, number>
  tags: string[]
}

export function WorkView({ activeTag, projects, counts, tags }: WorkViewProps) {
  return (
    <section className="pt-8 pb-32">
      <Container>
        <WorkFilters activeTag={activeTag} counts={counts} filters={tags} />

        <div className="mb-10 mt-16 space-y-4">
          <h1 className="text-4xl font-medium tracking-tight">Selected Work</h1>
        </div>

        <WorkResults key={activeTag} activeTag={activeTag} projects={projects} />
      </Container>
    </section>
  )
}

