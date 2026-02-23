"use client"

import { useMemo, useState } from "react"
import { BadgeInfo, Boxes, Database, Gauge, ShieldCheck } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/cn"
import type { ProjectRecord } from "@/data/projects"
import Reveal from "@/features/animations/motion/Reveal"

type ArchitectureVisualProps = {
  project: ProjectRecord
}

export function ArchitectureVisual({ project }: ArchitectureVisualProps) {
  const nodes = useMemo(
    () => [
      {
        id: "frontend",
        title: "Frontend",
        subtitle: "Next.js App Router",
        description: project.details.architecture.rendering,
        icon: Boxes,
      },
      {
        id: "data",
        title: "Data / Reactivity",
        subtitle: "Structured Data Layer",
        description: project.details.architecture.data,
        icon: Database,
      },
      {
        id: "domain",
        title: "Backend / Domain",
        subtitle: "Domain Boundaries",
        description: project.details.architecture.domain,
        icon: BadgeInfo,
      },
      {
        id: "performance",
        title: "Performance",
        subtitle: "Runtime Discipline",
        description: project.details.architecture.performance,
        icon: Gauge,
      },
      {
        id: "security",
        title: "Auth / Security",
        subtitle: "Trust Boundaries",
        description: project.details.security[0] ?? "Ownership and validation checks.",
        icon: ShieldCheck,
      },
    ],
    [project.details.architecture, project.details.security]
  )

  const [activeNode, setActiveNode] = useState(nodes[0]?.id ?? "")

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {nodes.map((node, index) => {
          const isActive = node.id === activeNode
          const Icon = node.icon
          return (
            <Reveal key={node.id} delay={index * 0.05}>
              <Card
                className={cn(
                  "relative border-border/70 bg-card/50 shadow-none transition-colors",
                  isActive && "border-border"
                )}
              >
                <CardHeader className="space-y-2 pb-4">
                  <div className="flex items-center gap-2">
                    <Icon className="size-4 text-muted-foreground" />
                    <CardTitle className="text-base tracking-tight">{node.title}</CardTitle>
                  </div>
                  <p className="text-xs text-muted-foreground">{node.subtitle}</p>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button
                    type="button"
                    size="sm"
                    variant={isActive ? "secondary" : "outline"}
                    onClick={() => setActiveNode(node.id)}
                  >
                    {isActive ? "Expanded" : "Expand"}
                  </Button>
                </CardContent>
                {index < nodes.length - 1 ? (
                  <div className="pointer-events-none absolute -right-2 top-1/2 hidden h-px w-4 -translate-y-1/2 bg-border xl:block" />
                ) : null}
              </Card>
            </Reveal>
          )
        })}
      </div>

      <Card className="border-border/70 bg-card/50 shadow-none">
        <CardHeader>
          <CardTitle className="text-base tracking-tight">Node Explanation</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {nodes.find((node) => node.id === activeNode)?.description}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

