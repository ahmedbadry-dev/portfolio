import { MetricBadge } from "@/components/shared/MetricBadge"
import type { ComponentPropsWithoutRef } from "react"
import { Dot } from "lucide-react"

export const mdxComponents = {
  h1: (props: ComponentPropsWithoutRef<"h1">) => (
    <h1 className="mb-6 text-3xl font-medium tracking-tight md:text-4xl" {...props} />
  ),

  h2: (props: ComponentPropsWithoutRef<"h2">) => (
    <h2 className="text-xl font-semibold mt-10 mb-4 tracking-tight" {...props} />
  ),

  h3: (props: ComponentPropsWithoutRef<"h3">) => (
    <h3 className="text-base font-medium mt-6 mb-2 tracking-tight" {...props} />
  ),

  p: (props: ComponentPropsWithoutRef<"p">) => (
    <p className="text-muted-foreground leading-relaxed mb-4" {...props} />
  ),

  ul: (props: ComponentPropsWithoutRef<"ul">) => (
    <ul className="space-y-2 my-4" {...props} />
  ),

  li: (props: ComponentPropsWithoutRef<"li">) => (
    <li className="flex items-start gap-2 text-muted-foreground leading-relaxed">
      <Dot className="mt-1 size-4 shrink-0 text-muted-foreground" />
      <span {...props} />
    </li>
  ),

  hr: () => <div className="my-8 h-px w-full bg-border" />,

  MetricBadge,
}

export function getCaseStudyMdxComponents() {
  return mdxComponents
}
