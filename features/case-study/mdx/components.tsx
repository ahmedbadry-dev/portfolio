import { MetricBadge } from "@/components/shared/MetricBadge"

export const mdxComponents = {
  h1: (props: any) => (
    <h1 className="text-4xl font-medium tracking-tight mb-6" {...props} />
  ),

  h2: (props: any) => (
    <h2 className="text-2xl font-medium mt-16 mb-4" {...props} />
  ),

  p: (props: any) => (
    <p className="text-muted-foreground leading-relaxed mb-6" {...props} />
  ),

  MetricBadge,
}