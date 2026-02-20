"use client"

import { Container } from "@/components/layout/Container"
import PremiumWorkCard from "@/features/work/components/PremiumWorkCard"
import { useState } from "react"
import { cn } from "@/lib/cn"
import { Glass } from "@/components/shared/Glass"

const filters = ["All", "Next.js", "Fullstack", "Performance"]

const projects = [
  {
    title: "Habit Tracker",
    description: "...",
    stack: ["Next.js", "Fullstack", "Performance"],
    lighthouse: 96,
    ttfb: 120,
  },
  {
    title: "E-Commerce Platform",
    description: "...",
    stack: ["Next.js", "Fullstack"],
    lighthouse: 94,
    ttfb: 140,
  },
]


export function SelectedWork() {
  const [active, setActive] = useState("All")
  const filtered =
    active === "All"
      ? projects
      : projects.filter((p) => p.stack.includes(active))


  return (
    <section className="relative py-40 overflow-hidden">
      <Container>

        {/* Header */}
        <div className="mb-16 space-y-4">
          <h2 className="text-4xl font-medium tracking-tight">
            Selected Work
          </h2>
        </div>

        {/* Filters */}
        <Glass className="mb-20 ">
          <div className="flex flex-wrap gap-4 bg-secondary/40 rounded-2xl justify-center p-2">
            {filters.map((item) => (

              <button
                key={item}
                onClick={() => setActive(item)}
                className={cn(
                  "relative rounded-full px-6 py-2 text-sm transition-all duration-300",
                  active === item
                    ? "bg-primary text-primary-foreground border border-primary shadow-[0_0_30px_rgba(124,59,237,0.35)] hover:shadow-[0_0_40px_rgba(124,59,237,0.55)]"
                    : "border border-border/50 bg-card/40 backdrop-blur-xl text-muted-foreground hover:border-primary/40 hover:bg-card/60"
                )}
              >
                {active === item && (
                  <span className="absolute inset-0 rounded-full bg-white/20 blur-md opacity-40 pointer-events-none" />
                )}

                <span className="relative z-10">{item}</span>
              </button>

            ))}
          </div>
        </Glass>
        {/* Cards */}


        <div className="space-y-10">

          {filtered.map((project, index) => (
            <PremiumWorkCard
              key={project.title}
              {...project}
              reverse={index % 2 !== 0}
            />
          ))}
        </div>



      </Container>
    </section>
  )
}
