import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowUpRight, ExternalLink, Github } from "lucide-react"
import { Glass } from "@/components/shared/Glass"
import { TagPills } from "@/components/shared/TagPills"
import { MetricBadge } from "@/components/shared/MetricBadge"
import { Button } from "@/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import type { ProjectScreenshots } from "@/data/projects"

interface WorkShowcaseCardProps {
  slug: string
  title: string
  description: string
  tags: string[]
  lighthouse?: number
  ttfb?: number
  imageCount?: number
  screenshots?: ProjectScreenshots
  links: {
    liveDemo: string
    gitHub: string
  }
}

export function WorkShowcaseCard({
  slug,
  title,
  description,
  tags,
  lighthouse,
  ttfb,
  imageCount,
  screenshots,
  links,
}: WorkShowcaseCardProps) {
  const metrics: Array<{ label: string; value: string | number }> = []

  if (typeof lighthouse === "number") {
    metrics.push({ label: "Lighthouse", value: lighthouse })
  }
  if (typeof ttfb === "number") {
    metrics.push({ label: "TTFB", value: `${ttfb}ms` })
  }
  if (typeof imageCount === "number") {
    metrics.push({ label: "Screens", value: imageCount })
  }

  const previewImages = (screenshots?.mobile?.length
    ? screenshots.mobile
    : screenshots?.desktop ?? []
  ).slice(0, 3)
  const liveDemoUrl = links.liveDemo.trim()
  const githubUrl = links.gitHub.trim()
  const directionOffsets = [
    { x: 0, y: -56 },
    { x: 0, y: 56 },
    { x: -56, y: 0 },
    { x: 56, y: 0 },
  ]
  const getDirectionBySeed = (seed: string) => {
    const hash = seed.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
    return directionOffsets[hash % directionOffsets.length]
  }

  return (
    <Glass className="rounded-3xl p-4 sm:p-5 md:p-8 lg:p-10">
      <div className="grid gap-8 lg:grid-cols-[1fr_1.5fr] lg:gap-10">
        <div className="order-2 flex min-w-0 flex-col justify-between gap-6 md:gap-8 lg:order-1">
          <div className="space-y-5">
            <h3 className="text-xl font-semibold tracking-tight sm:text-2xl md:text-3xl">
              {title}
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              {description}
            </p>
            <TagPills
              tags={tags}
              className="gap-2 md:gap-3"
              tagClassName="px-3 py-1 text-xs sm:text-sm"
            />
          </div>

          <div className="space-y-4 md:space-y-5">
            {metrics.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {metrics.map((metric) => (
                  <MetricBadge
                    key={metric.label}
                    label={metric.label}
                    value={metric.value}
                    className="text-xs sm:text-sm"
                  />
                ))}
              </div>
            ) : null}

            <div className="grid grid-cols-1 gap-2.5 sm:flex sm:flex-wrap sm:items-center">
              <Button asChild className="w-full justify-center sm:w-auto">
                <Link href={`/projects/${slug}`}>
                  View Case Study
                  <ArrowUpRight className="size-4" />
                </Link>
              </Button>

              <Button variant="secondary" asChild className="w-full justify-center sm:w-auto">
                <a
                  href={liveDemoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${title} live demo`}
                >
                  <ExternalLink className="size-4" />
                  Live Demo
                </a>
              </Button>

              <Button variant="outline" asChild className="w-full justify-center sm:w-auto">
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${title} GitHub repository`}
                >
                  <Github className="size-4" />
                  GitHub
                </a>
              </Button>
            </div>
          </div>
        </div>

        <div className="order-1 w-full lg:order-2">
          <div className="md:hidden">
            <Carousel opts={{ align: "start", loop: true }} className="w-full px-1">
              <CarouselContent>
                {(previewImages.length > 0
                  ? previewImages
                  : Array.from({ length: 3 }).map(() => null)
                ).map((img, index) => {
                  const seed = `${slug}-mobile-${index}`
                  return (
                    <CarouselItem key={seed}>
                      <div className="relative h-[360px] overflow-hidden rounded-2xl border border-border/40 bg-muted/20 sm:h-[420px]">
                        {img ? (
                          <div
                            className="absolute inset-0 bg-no-repeat bg-contain bg-center"
                            style={{ backgroundImage: `url(${img})` }}
                          />
                        ) : (
                          <>
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/25 via-transparent to-primary/10" />
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.22),transparent_55%)]" />
                          </>
                        )}
                      </div>
                    </CarouselItem>
                  )
                })}
              </CarouselContent>
              <CarouselPrevious className="left-3 top-1/2 -translate-y-1/2 border-border/70 bg-background/90 shadow-md" />
              <CarouselNext className="right-3 top-1/2 -translate-y-1/2 border-border/70 bg-background/90 shadow-md" />
            </Carousel>
          </div>

          <div className="hidden h-115 grid-cols-3 gap-3 md:grid md:gap-4">
            {(previewImages.length > 0
              ? previewImages
              : Array.from({ length: 3 }).map(() => null)
            ).map((img, index) => {
              const seed = `${slug}-${index}`
              const from = getDirectionBySeed(seed)

              return (
                <motion.div
                  key={seed}
                  initial={{ opacity: 0, x: from.x, y: from.y, scale: 0.985 }}
                  animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                  transition={{ duration: 0.55, ease: "easeOut", delay: index * 0.08 }}
                  whileHover={{ scale: 0.98 }}
                  className="relative overflow-hidden rounded-2xl border border-border/40 bg-muted/20 will-change-transform"
                >
                  {img ? (
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${img})` }}
                    />
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/25 via-transparent to-primary/10" />
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.22),transparent_55%)]" />
                    </>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </Glass>
  )
}
