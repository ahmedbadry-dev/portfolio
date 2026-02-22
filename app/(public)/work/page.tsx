import { WorkFilters } from "@/features/work/components/WorkFilters"
import { getProjects } from "@/features/work/server/getProjects"
import { Container } from "@/components/layout/Container"
import { WorkResults } from "@/features/work/components/WorkResults"

interface WorkPageProps {
  searchParams: Promise<{ tag?: string }>
}

export default async function WorkPage({ searchParams }: WorkPageProps) {
  const { tag } = await searchParams
  const activeTag = tag || "All"
  const { projects, counts, tags } = await getProjects(activeTag)

  return (
    <section className="pt-8 pb-32">
      <Container>
        <WorkFilters activeTag={activeTag} counts={counts} filters={tags} />

        <div className="mb-10 mt-16 space-y-4">
          <h1 className="text-4xl font-medium tracking-tight">
            Selected Work
          </h1>
        </div>

        <WorkResults
          key={activeTag}
          activeTag={activeTag}
          projects={projects}
        />
      </Container>
    </section>
  )
}
