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
    <p className="mb-4 break-words leading-relaxed text-muted-foreground" {...props} />
  ),

  img: (props: ComponentPropsWithoutRef<"img">) => (
    // Keep MDX images fluid on small screens.
    // eslint-disable-next-line @next/next/no-img-element
    <img className="h-auto w-full max-w-full rounded-lg" loading="lazy" alt={props.alt ?? ""} {...props} />
  ),

  ul: (props: ComponentPropsWithoutRef<"ul">) => (
    <ul className="space-y-2 my-4" {...props} />
  ),

  li: (props: ComponentPropsWithoutRef<"li">) => (
    <li className="flex min-w-0 items-start gap-2 break-words text-muted-foreground leading-relaxed">
      <Dot className="mt-1 size-4 shrink-0 text-muted-foreground" />
      <span className="min-w-0" {...props} />
    </li>
  ),

  hr: () => <div className="my-8 h-px w-full bg-border" />,

  code: ({ className, ...props }: ComponentPropsWithoutRef<"code">) => {
    const isBlockCode = className?.includes("language-")

    if (isBlockCode) {
      return <code className="font-mono text-sm leading-relaxed" {...props} />
    }

    return (
      <code
        className="break-words rounded bg-muted px-1 py-0.5 font-mono text-[0.9em]"
        {...props}
      />
    )
  },

  pre: (props: ComponentPropsWithoutRef<"pre">) => (
    <div className="my-5 w-full overflow-x-auto rounded-xl border border-border/60 bg-muted/40 p-4">
      <pre className="w-max min-w-full font-mono text-sm leading-relaxed" {...props} />
    </div>
  ),

  table: (props: ComponentPropsWithoutRef<"table">) => (
    <div className="my-4 w-full overflow-x-auto">
      <table className="w-full min-w-[560px] border-collapse text-sm" {...props} />
    </div>
  ),

  MetricBadge,
}

export function getCaseStudyMdxComponents() {
  return mdxComponents
}
