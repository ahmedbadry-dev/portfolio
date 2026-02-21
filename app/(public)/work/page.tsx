import { WorkFilters } from "@/features/work/components/WorkFilters"
import { getProjects } from "@/features/work/server/getProjects"
import { Container } from "@/components/layout/Container"
import { WorkResults } from "@/features/work/components/WorkResults"

interface WorkPageProps {
  searchParams: { tag?: string }
}

export default async function WorkPage({ searchParams }: WorkPageProps) {
  const activeTag = searchParams.tag || "All"
  const { projects, counts } = await getProjects(activeTag)

  return (
    <section className="py-32">
      <Container>

        <div className="mb-16 space-y-4">
          <h1 className="text-4xl font-medium tracking-tight">
            Selected Work
          </h1>
        </div>

        <WorkFilters activeTag={activeTag} counts={counts} />

        <div className="mt-20">
          <WorkResults
            activeTag={activeTag}
            projects={projects}
          />
        </div>

      </Container>
    </section>
  )
}