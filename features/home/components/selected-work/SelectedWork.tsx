"use client"

import { Container } from "@/components/layout/Container"
import CardSwap, { Card as SwapCard } from "@/components/CardSwap"
import { useMemo } from "react"
import { projects } from "@/data/projects"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowUpRight } from "lucide-react"
import { WorkCardImg } from "./WorkCardImg"
import { useSelectedWorkController } from "./useSelectedWorkController"


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
          {/* <PremiumWorkCard
            title={project.title}
            description={project.description}
            stack={project.tags}
            lighthouse={project.lighthouse}
            ttfb={project.ttfb}
          /> */}
          <WorkCardImg>
            <div className="grid grid-cols-3 gap-2 h-full ">
              <div className="bg-amber-400 rounded-r-md"></div>
              <div className="flex flex-col gap-2">
                <div className="bg-red-300 h-1/2 rounded-md"></div>
                <div className="bg-red-700 h-1/2 rounded-md"></div>
              </div>
              <div className="bg-gray-700 rounded-l-md"></div>
            </div>
          </WorkCardImg>
        </SwapCard>
      )),
    [visibleProjects]
  )


  return (
    <section className="relative overflow-hidden py-32">
      <Container>
        <div className="grid min-h-[640px] gap-8 rounded-3xl border border-border/50 bg-background/40 p-6 md:p-8 lg:grid-cols-5">
          <div className="flex flex-col justify-between lg:col-span-2">
            <div key={activeProject?.slug} className="space-y-4 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-1 motion-safe:duration-300">
              <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Selected Work</p>
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                {activeProject?.title}
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                {activeProject?.description || "Performance-focused product experience with strong UX and delivery quality."}
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
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Lighthouse</p>
                  <p className="text-lg font-semibold">{activeProject?.lighthouse}</p>
                </div>
                <div className="rounded-xl border border-border/50 bg-background/60 p-3">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">TTFB</p>
                  <p className="text-lg font-semibold">{activeProject?.ttfb}ms</p>
                </div>
              </div>

              <div className="pt-4">
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
            className="relative min-h-[520px] cursor-pointer overflow-visible rounded-2xl bg-gradient-to-br from-muted/40 via-background to-muted/20 transition-shadow duration-300 hover:shadow-[0_0_35px_rgba(124,59,237,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 lg:col-span-3"
          >
            <CardSwap
              width="92%"
              height={460}
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
