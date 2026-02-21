import { MetricBadge } from "@/components/shared/MetricBadge"
import type { ComponentPropsWithoutRef } from "react"

export const mdxComponents = {
  h1: (props: ComponentPropsWithoutRef<"h1">) => (
    <h1 className="text-4xl font-medium tracking-tight mb-6" {...props} />
  ),

  h2: (props: ComponentPropsWithoutRef<"h2">) => (
    <h2 className="text-2xl font-medium mt-16 mb-4" {...props} />
  ),

  p: (props: ComponentPropsWithoutRef<"p">) => (
    <p className="text-muted-foreground leading-relaxed mb-6" {...props} />
  ),

  MetricBadge,
}

export function getCaseStudyMdxComponents() {
  return mdxComponents
}
