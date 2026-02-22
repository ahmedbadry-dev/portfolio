"use client"

import { cn } from "@/lib/cn"
import CountUp from "@/components/CountUp"

type MetricBadgeProps = {
  label: string
  value: string | number
  className?: string
}

export function MetricBadge({ label, value, className }: MetricBadgeProps) {
  const isNumber = typeof value === "number"
  const parsed =
    typeof value === "string"
      ? value.trim().match(/^(-?\d+(?:\.\d+)?)(.*)$/)
      : null
  const hasNumericPrefix = Boolean(parsed)
  const numericPart = parsed ? Number(parsed[1]) : null
  const suffix = parsed ? parsed[2].trim() : ""

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-border/50 bg-card/40 px-3 py-1.5 text-sm",
        className
      )}
    >
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">
        {isNumber ? (
          <CountUp to={value} from={0} duration={1} separator="," startWhen />
        ) : hasNumericPrefix && numericPart !== null && Number.isFinite(numericPart) ? (
          <>
            <CountUp to={numericPart} from={0} duration={1} separator="," startWhen />
            {suffix ? <span>{suffix}</span> : null}
          </>
        ) : (
          value
        )}
      </span>
    </span>
  )
}
