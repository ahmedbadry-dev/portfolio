import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { Glass } from "@/components/shared/Glass"
import { TagPills } from "@/components/shared/TagPills"
import { MetricBadge } from "@/components/shared/MetricBadge"
import { Button } from "@/components/ui/button"

interface WorkShowcaseCardProps {
  slug: string
  title: string
  description: string
  tags: string[]
  lighthouse?: number
  ttfb?: number
  imageCount?: number
}

export function WorkShowcaseCard({
  slug,
  title,
  description,
  tags,
  lighthouse,
  ttfb,
  imageCount,
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

  return (
    <Glass className="rounded-3xl p-6 md:p-8 lg:p-10">
      <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:gap-10">
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

        <div className="grid grid-cols-2 gap-3 md:gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border/40 bg-muted/20"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/25 via-transparent to-primary/10" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.22),transparent_55%)]" />
              <div className="absolute bottom-3 left-3 rounded-full border border-border/50 bg-background/60 px-2.5 py-1 text-[11px] text-muted-foreground backdrop-blur">
                Preview {index + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Glass>
  )
}
