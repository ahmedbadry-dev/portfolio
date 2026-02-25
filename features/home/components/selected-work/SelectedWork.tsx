"use client"

import { Container } from "@/components/layout/Container"
import CardSwap, { Card as SwapCard } from "@/components/CardSwap"
import { useMemo } from "react"
import { projects } from "@/data/projects"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowUpRight } from "lucide-react"
import { WorkCardImg } from "@/features/home/components/selected-work/WorkCardImg"
import { useSelectedWorkController } from "@/features/home/components/selected-work/useSelectedWorkController"

import m1 from '@/public/screenshots/habit-tracker/dark-pig-dash.png'
import m2 from '@/public/screenshots/habit-tracker/light-dash.png'
import m3 from '@/public/screenshots/habit-tracker/dark-habits-statistic.png'
import m4 from '@/public/screenshots/habit-tracker/dark-statistic.png'
import Image from "next/image"

export function SelectedWork() {
  const router = useRouter()
  const { featuredProjects, activeProject, handleActiveCardChange } =
    useSelectedWorkController(projects)
  const visibleProjects = featuredProjects
  const activeProjectHref = activeProject ? `/projects/${activeProject.slug}` : "/projects"

  const swapCards = useMemo(
    () =>
      visibleProjects.map((project) => (
        <SwapCard
          key={project.slug}
          className="overflow-hidden bg-card/95 p-0 shadow-2xl"
        >
          <WorkCardImg>
            <div className="h-full md:grid md:grid-cols-3 md:gap-2">
              <div className="h-full overflow-hidden rounded-xl md:col-span-2">
                <Image src={m1} alt="dark dashboard image" className="h-full w-full object-cover" />
              </div>
              <div className="hidden md:flex md:flex-col md:gap-2">
                <div className="h-1/3 overflow-hidden rounded-l-md">
                  <Image src={m3} alt="dark dashboard image" className="h-full w-full rounded-bl-md object-cover" />
                </div>
                <div className="h-1/3 overflow-hidden rounded-l-md">
                  <Image src={m2} alt="dark dashboard image" className="h-full w-full rounded-l-md object-cover" />
                </div>
                <div className="h-1/3 overflow-hidden rounded-l-md">
                  <Image src={m4} alt="dark dashboard image" className="h-full w-full rounded-tl-md object-cover" />
                </div>
              </div>
            </div>
          </WorkCardImg>
        </SwapCard>
      )),
    [visibleProjects]
  )


  return (
    <section className="relative overflow-hidden py-32">
      <Container>
        <div className="grid gap-20 rounded-3xl border border-border/50 bg-background/40 p-4 sm:p-5 md:p-8 lg:min-h-[40rem] lg:grid-cols-5 lg:gap-8">
          <div className="flex flex-col lg:col-span-2">
            <div
              className="flex h-full min-h-[29rem] flex-col motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-1 motion-safe:duration-300 lg:min-h-0"
            >
              <div className="flex-1 space-y-4">
                <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
                  Selected Work
                </p>

                <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                  {activeProject?.title}
                </h2>

                <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                  {activeProject?.description ||
                    "Performance-focused product experience with strong UX and delivery quality."}
                </p>

                <div className="flex flex-wrap gap-2 pt-3">
                  {activeProject?.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-border/60 bg-background/80 px-3 py-1 text-xs text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4 text-sm">
                  <div className="rounded-xl border border-border/50 bg-background/60 p-3">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">
                      Lighthouse
                    </p>
                    <p className="text-lg font-semibold">{activeProject?.lighthouse}</p>
                  </div>

                  <div className="rounded-xl border border-border/50 bg-background/60 p-3">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">
                      TTFB
                    </p>
                    <p className="text-lg font-semibold">{activeProject?.ttfb}ms</p>
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-6">
                <Button asChild>
                  <Link href={activeProjectHref}>
                    View Case Study
                    <ArrowUpRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          <div
            role="link"
            tabIndex={0}
            aria-label={`Open ${activeProject?.title} case study`}
            onClick={() => router.push(activeProjectHref)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault()
                router.push(activeProjectHref)
              }
            }}
            className="relative min-h-[21rem] cursor-pointer overflow-visible rounded-2xl bg-linear-to-br from-muted/40 via-background to-muted/20 transition-shadow duration-300 hover:shadow-[0_0_35px_rgba(124,59,237,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 sm:min-h-[24rem] md:min-h-[28rem] lg:col-span-3 lg:min-h-[32rem]"
          >
            <CardSwap
              width="min(100%, 52rem)"
              height="min(72vw, 28rem)"
              position="center-right"
              cardDistance={36}
              verticalDistance={40}
              dropOffset={220}
              delay={3200}
              pauseOnHover
              easing="elastic"
              onActiveCardChange={handleActiveCardChange}
            >
              {swapCards}
            </CardSwap>
          </div>
        </div>
      </Container>
    </section>
  )
}
