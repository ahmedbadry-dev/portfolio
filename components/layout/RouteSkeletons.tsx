import { Container } from "@/components/layout/Container"

function SkeletonBlock({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-xl bg-muted/45 ${className}`} />
}

export function AboutPageSkeleton() {
  return (
    <section className="py-16 md:py-24 lg:py-32">
      <Container>
        <div className="mx-auto max-w-5xl space-y-16 md:space-y-24 lg:space-y-32">
          <div className="grid items-center gap-8 md:grid-cols-[1.5fr_1fr] md:gap-10">
            <div className="space-y-4">
              <SkeletonBlock className="h-12 w-3/4 md:h-14" />
              <SkeletonBlock className="h-5 w-full max-w-2xl" />
              <SkeletonBlock className="h-5 w-5/6 max-w-2xl" />
              <div className="flex flex-wrap gap-3 pt-2">
                <SkeletonBlock className="h-11 w-36 rounded-full" />
                <SkeletonBlock className="h-11 w-44 rounded-full" />
              </div>
            </div>
            <SkeletonBlock className="aspect-square w-full rounded-lg" />
          </div>
          <SkeletonBlock className="h-px w-full rounded-none" />
          <div className="space-y-6">
            <SkeletonBlock className="h-8 w-64" />
            <SkeletonBlock className="h-24 w-full" />
            <SkeletonBlock className="h-24 w-full" />
            <SkeletonBlock className="h-24 w-full" />
          </div>
        </div>
      </Container>
    </section>
  )
}

export function WorkPageSkeleton() {
  return (
    <section className="pb-20 pt-6 md:pb-32 md:pt-8">
      <Container>
        <SkeletonBlock className="h-16 w-full rounded-2xl" />
        <div className="mb-6 mt-8 space-y-3 md:mb-10 md:mt-16">
          <SkeletonBlock className="h-10 w-64" />
          <SkeletonBlock className="h-5 w-full max-w-xl" />
        </div>
        <SkeletonBlock className="h-[28rem] w-full rounded-3xl" />
      </Container>
    </section>
  )
}

export function ContactPageSkeleton() {
  return (
    <section className="py-16 md:py-24 lg:py-32">
      <Container>
        <div className="mx-auto mb-8 max-w-2xl space-y-4 text-center md:mb-12 lg:mb-16">
          <SkeletonBlock className="mx-auto h-12 w-80 max-w-full" />
          <SkeletonBlock className="mx-auto h-5 w-72 max-w-full" />
        </div>
        <div className="mx-auto max-w-xl space-y-4">
          <SkeletonBlock className="h-12 w-full" />
          <SkeletonBlock className="h-12 w-full" />
          <SkeletonBlock className="h-40 w-full" />
          <SkeletonBlock className="h-11 w-36 rounded-full" />
        </div>
      </Container>
    </section>
  )
}

export function CaseStudyPageSkeleton() {
  return (
    <article className="py-14 md:py-20 lg:py-24">
      <Container>
        <div className="space-y-8 md:space-y-10">
          <SkeletonBlock className="aspect-[16/10] w-full rounded-2xl sm:aspect-[16/8]" />
          <SkeletonBlock className="h-10 w-3/4" />
          <SkeletonBlock className="h-6 w-full max-w-3xl" />
          <div className="grid grid-cols-1 gap-2.5 sm:flex sm:flex-wrap">
            <SkeletonBlock className="h-10 w-32 rounded-full" />
            <SkeletonBlock className="h-10 w-28 rounded-full" />
          </div>
        </div>

        <div className="mt-8 grid gap-8 md:mt-12 md:gap-10 lg:grid-cols-[minmax(0,1fr)_220px]">
          <div className="space-y-6">
            <SkeletonBlock className="h-56 w-full rounded-xl" />
            <SkeletonBlock className="h-56 w-full rounded-xl" />
            <SkeletonBlock className="h-56 w-full rounded-xl" />
          </div>
          <div className="hidden lg:block">
            <SkeletonBlock className="h-80 w-full rounded-xl" />
          </div>
        </div>
      </Container>
    </article>
  )
}
