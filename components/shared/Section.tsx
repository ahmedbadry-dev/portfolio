import type { ReactNode } from "react"
import { cn } from "@/lib/cn"

type SectionProps = {
  children: ReactNode
  className?: string
}

export function Section({ children, className }: SectionProps) {
  return <section className={cn("relative", className)}>{children}</section>
}

