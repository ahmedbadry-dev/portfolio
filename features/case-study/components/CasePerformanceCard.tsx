import { Glass } from "@/components/shared/Glass"
import { MetricBadge } from "@/components/shared/MetricBadge"

interface CasePerformanceCardProps {
  lighthouse?: number
  ttfb?: number
  imageCount?: number
}

export function CasePerformanceCard({
  lighthouse,
  ttfb,
  imageCount,
}: CasePerformanceCardProps) {
  return (
    <Glass className="rounded-3xl p-6 md:p-8">
      <div className="space-y-6">
        <h2 className="text-xl font-semibold tracking-tight">Performance</h2>

        <div className="grid gap-3">
          {typeof lighthouse === "number" ? (
            <MetricBadge label="Lighthouse" value={lighthouse} />
          ) : null}
          {typeof ttfb === "number" ? (
            <MetricBadge label="TTFB" value={`${ttfb}ms`} />
          ) : null}
          {typeof imageCount === "number" ? (
            <MetricBadge label="Screens" value={imageCount} />
          ) : null}
        </div>
      </div>
    </Glass>
  )
}

