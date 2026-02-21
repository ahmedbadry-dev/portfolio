import { cn } from "@/lib/cn"

type MetricBadgeProps = {
  label: string
  value: string | number
  className?: string
}

export function MetricBadge({ label, value, className }: MetricBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-border/50 bg-card/40 px-3 py-1.5 text-sm",
        className
      )}
    >
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </span>
  )
}
