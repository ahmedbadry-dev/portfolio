"use client"

import { Container } from "@/components/layout/Container"
import CardSwap, { Card as SwapCard } from "@/components/CardSwap"
import { useEffect, useMemo, useState } from "react"
import { projects } from "@/data/projects"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowUpRight } from "lucide-react"
import { WorkCardImg } from "@/features/home/components/selected-work/WorkCardImg"
import { useSelectedWorkController } from "@/features/home/components/selected-work/useSelectedWorkController"
import Image from "next/image"

function ShowcaseImage({
  src,
  alt,
  className,
  sizes,
}: {
  src?: string
  alt: string
  className?: string
  sizes: string
}) {
  const [hasError, setHasError] = useState(false)

  if (hasError || !src) {
    return <div className="h-full w-full bg-muted/40" aria-hidden />
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className={className}
      sizes={sizes}
      onError={() => {
        setHasError(true)
      }}
    />
  )
}

export function SelectedWork() {
  const router = useRouter()
  const [isMobile, setIsMobile] = useState(false)
  const { featuredProjects, activeProject, handleActiveCardChange } =
    useSelectedWorkController(projects)
  const visibleProjects = featuredProjects
  const activeProjectHref = activeProject ? `/projects/${activeProject.slug}` : "/projects"
  const hasLighthouse = typeof activeProject?.lighthouse === "number"
  const hasTtfb = typeof activeProject?.ttfb === "number"
  const hasPerformanceMetrics = hasLighthouse || hasTtfb

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)")
    const updateIsMobile = () => {
      setIsMobile(mediaQuery.matches)
    }

    updateIsMobile()
    mediaQuery.addEventListener("change", updateIsMobile)

    return () => {
      mediaQuery.removeEventListener("change", updateIsMobile)
    }
  }, [])

  const swapCards = useMemo(
    () =>
      visibleProjects.map((project) => {
        const mainImage = project.screenshots?.selectedWork.main
        const asideImage = project.screenshots?.selectedWork.aside

        return (
          <SwapCard
            key={project.slug}
            className="overflow-hidden bg-card/95 p-0 shadow-2xl"
          >
            <WorkCardImg>
              <div className="h-full md:grid md:grid-cols-3 md:gap-2">
                <div className="relative h-full overflow-hidden rounded-xl md:col-span-2">
                  <ShowcaseImage
                    src={mainImage}
                    alt={`${project.title} main screenshot`}
                    className="object-cover"
                    sizes="(min-width: 768px) 66vw, 100vw"
                  />
                </div>
                <div className="hidden md:block">
                  <div className="relative h-full overflow-hidden rounded-l-md">
                    <ShowcaseImage
                      src={asideImage}
                      alt={`${project.title} aside screenshot`}
                      className="rounded-l-md object-cover"
                      sizes="(min-width: 768px) 22vw, 0px"
                    />
                  </div>
                </div>
              </div>
            </WorkCardImg>
          </SwapCard>
        )
      }),
    [visibleProjects]
  )


  return (
    <section className="relative mt-12 overflow-hidden py-20 sm:mt-8 md:mt-0 md:py-32">
      <Container>
        <div className="grid gap-10 rounded-3xl border border-border/50 bg-background/40 p-4 sm:gap-12 sm:p-5 md:gap-20 md:p-8 lg:min-h-[40rem] lg:grid-cols-5 lg:gap-8">
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
            className="relative order-1 z-0 mt-2 min-h-[17rem] cursor-pointer overflow-visible rounded-2xl bg-linear-to-br from-muted/40 via-background to-muted/20 transition-shadow duration-300 hover:shadow-[0_0_35px_rgba(124,59,237,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 sm:mt-0 sm:min-h-[22rem] md:min-h-[28rem] lg:order-2 lg:col-span-3 lg:min-h-[32rem]"
          >
            <CardSwap
              width={isMobile ? "min(100%, 22rem)" : "min(100%, 52rem)"}
              height={isMobile ? "min(62vw, 16rem)" : "min(72vw, 28rem)"}
              position={isMobile ? "center" : "center-right"}
              cardDistance={isMobile ? 18 : 36}
              verticalDistance={isMobile ? 22 : 40}
              dropOffset={isMobile ? 90 : 220}
              delay={3200}
              pauseOnHover
              easing="elastic"
              onActiveCardChange={handleActiveCardChange}
            >
              {swapCards}
            </CardSwap>
          </div>

          <div className="relative order-2 z-10 flex flex-col lg:order-1 lg:col-span-2">
            <div
              className="flex h-full min-h-[20rem] flex-col motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-1 motion-safe:duration-300 sm:min-h-[22rem] lg:min-h-0"
            >
              <div className="flex-1">
                <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
                  Selected Work
                </p>

                <h2 className="mt-4 min-h-[3.75rem] text-2xl font-semibold tracking-tight md:min-h-[5rem] md:text-4xl">
                  {activeProject?.title}
                </h2>

                <p className="mt-4 min-h-[4.5rem] text-sm leading-relaxed text-muted-foreground md:min-h-[6rem] md:text-base">
                  {activeProject?.description ||
                    "Performance-focused product experience with strong UX and delivery quality."}
                </p>

                <div className="mt-6 flex min-h-[4rem] flex-wrap content-start gap-2">
                  {activeProject?.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-border/60 bg-background/80 px-3 py-1 text-xs text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-4 min-h-[5.5rem]">
                  {hasPerformanceMetrics ? (
                    <div
                      className={`grid gap-3 text-sm ${hasLighthouse && hasTtfb ? "grid-cols-2" : "grid-cols-1"
                        }`}
                    >
                    {hasLighthouse ? (
                      <div className="rounded-xl border border-border/50 bg-background/60 p-3">
                        <p className="text-xs uppercase tracking-wider text-muted-foreground">
                          Lighthouse
                        </p>
                        <p className="text-lg font-semibold">{activeProject.lighthouse}</p>
                      </div>
                    ) : null}

                    {hasTtfb ? (
                      <div className="rounded-xl border border-border/50 bg-background/60 p-3">
                        <p className="text-xs uppercase tracking-wider text-muted-foreground">
                          TTFB
                        </p>
                        <p className="text-lg font-semibold">{activeProject.ttfb}ms</p>
                      </div>
                    ) : null}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="mt-6">
                <Button asChild className="w-full sm:w-auto">
                  <Link href={activeProjectHref}>
                    View Case Study
                    <ArrowUpRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
