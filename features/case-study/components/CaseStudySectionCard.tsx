import { Children, Fragment, type ReactNode } from "react"
import type { LucideIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StaggerContainer, StaggerItem } from "@/features/animations/motion/Stagger"

type CaseStudySectionCardProps = {
  id: string
  title: string
  subtitle: string
  chips?: string[]
  icon: LucideIcon
  children: ReactNode
}

export function CaseStudySectionCard({
  id,
  title,
  subtitle,
  chips = [],
  icon: Icon,
  children,
}: CaseStudySectionCardProps) {
  return (
    <section id={id}>
      <Card className="min-w-0 overflow-hidden border-border/70 bg-card/45 shadow-none">
        <CardHeader className="space-y-4 px-4 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-start gap-3">
              <div className="mt-0.5 rounded-md border border-border/70 p-2">
                <Icon className="size-4 text-muted-foreground" />
              </div>
              <div className="min-w-0 space-y-1">
                <CardTitle className="text-lg tracking-tight">{title}</CardTitle>
                <p className="break-words text-sm text-muted-foreground">{subtitle}</p>
              </div>
            </div>
          </div>
          {chips.length > 0 ? (
            <div className="flex min-w-0 flex-wrap gap-2">
              {chips.map((chip) => (
                <span
                  key={chip}
                  className="max-w-full break-words rounded-full border border-border/60 px-2.5 py-1 text-xs text-muted-foreground"
                >
                  {chip}
                </span>
              ))}
            </div>
          ) : null}
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <StaggerContainer className="space-y-6">
            {Children.toArray(children).map((child, index) => (
              <StaggerItem key={index}>
                <Fragment>{child}</Fragment>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </CardContent>
      </Card>
    </section>
  )
}
