import { cn } from "@/lib/cn"
import { Button } from "@/components/ui/button"

interface WorkRowProps {
  title: string
  description: string
  stack: string[]
  metrics: {
    lighthouse: number
    ttfbMs: number
  }
  liveUrl?: string
  githubUrl?: string
}

export function WorkRow({
  title,
  description,
  stack,
  metrics,
  liveUrl,
  githubUrl,
}: WorkRowProps) {
  return (
    <div
      className={cn(
        "group relative grid gap-10 rounded-2xl border border-border/50 bg-card/40 p-10 backdrop-blur-xl",
        "transition-all duration-300 hover:-translate-y-1 hover:border-primary/40"
      )}
    >
      <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr_0.7fr] items-center">

        {/* Device Mock Placeholder */}
        <div className="relative h-[220px] w-full rounded-xl bg-muted/30 border border-border/40" />

        {/* Content */}
        <div className="space-y-5">
          <h3 className="text-2xl font-semibold tracking-tight">
            {title}
          </h3>

          <p className="text-muted-foreground leading-relaxed">
            {description}
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            {stack.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-border/40 px-4 py-1 text-sm text-muted-foreground"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Metrics + CTA */}
        <div className="flex flex-col items-start gap-6 lg:items-end">

          <div className="space-y-2 text-sm text-muted-foreground">
            <div>
              <span className="font-medium text-foreground">
                Lighthouse:
              </span>{" "}
              {metrics.lighthouse}
            </div>

            <div>
              <span className="font-medium text-foreground">
                TTFB:
              </span>{" "}
              {metrics.ttfbMs}ms
            </div>
          </div>

          <div className="flex gap-3">
            {liveUrl && (
              <Button size="sm" asChild>
                <a href={liveUrl} target="_blank">
                  Live
                </a>
              </Button>
            )}

            {githubUrl && (
              <Button size="sm" variant="secondary" asChild>
                <a href={githubUrl} target="_blank">
                  GitHub
                </a>
              </Button>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
