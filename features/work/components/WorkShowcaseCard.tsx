import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
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
    <Glass className="rounded-3xl p-6 md:p-8 lg:p-10">
      <div className="grid gap-8 lg:grid-cols-[1fr_1.5fr] lg:gap-10">
        <div className="flex min-w-0 flex-col justify-between gap-8">
          <div className="space-y-5">
            <h3 className="text-2xl font-semibold tracking-tight md:text-3xl">
              {title}
            </h3>
            <p className="text-muted-foreground leading-relaxed">{description}</p>
            <TagPills tags={tags} />
          </div>

          <div className="space-y-5">
            {metrics.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {metrics.map((metric) => (
                  <MetricBadge
                    key={metric.label}
                    label={metric.label}
                    value={metric.value}
                  />
                ))}
              </div>
            ) : null}

            <Button asChild>
              <Link href={`/projects/${slug}`}>
                View Case Study
                <ArrowUpRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="w-full">
          <div className="md:hidden">
            <Carousel opts={{ align: "start", loop: true }} className="w-full">
              <CarouselContent>
                {(previewImages.length > 0
                  ? previewImages
                  : Array.from({ length: 3 }).map(() => null)
                ).map((img, index) => {
                  const seed = `${slug}-mobile-${index}`
                  return (
                    <CarouselItem key={seed}>
                      <div className="relative h-[420px] overflow-hidden rounded-2xl border border-border/40 bg-muted/20">
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
              <CarouselPrevious className="left-3 top-1/2 -translate-y-1/2" />
              <CarouselNext className="right-3 top-1/2 -translate-y-1/2" />
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
                  initial={{ opacity: 0, x: from.x, y: from.y, filter: "blur(8px)" }}
                  animate={{ opacity: 1, x: 0, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.55, ease: "easeOut", delay: index * 0.08 }}
                  whileHover={{ scale: 0.98 }}
                  className="relative overflow-hidden rounded-2xl border border-border/40 bg-muted/20"
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
