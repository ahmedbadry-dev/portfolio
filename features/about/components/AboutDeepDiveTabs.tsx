"use client"

import { useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/cn"
import { motionEase } from "@/lib/motion"

type DeepDive = {
  id: string
  label: string
  problem: string
  decision: string
  impact: string
}

type AboutDeepDiveTabsProps = {
  items: DeepDive[]
}

export function AboutDeepDiveTabs({ items }: AboutDeepDiveTabsProps) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "")
  const reduceMotion = useReducedMotion()
  const activeItem = items.find((item) => item.id === activeId) ?? items[0]

  if (!activeItem) {
    return null
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2 border-b border-border pb-3">
        {items.map((item) => {
          const isActive = item.id === activeItem.id

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveId(item.id)}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm transition-colors duration-200",
                isActive
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.label}
            </button>
          )
        })}
      </div>

      <div className="min-h-[280px]">
        <AnimatePresence mode="wait">
          <motion.dl
            key={activeItem.id}
            initial={reduceMotion ? false : { opacity: 0, y: 6 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
            transition={{ duration: 0.32, ease: motionEase.standard }}
            className="space-y-6"
          >
            <div>
              <dt className="text-sm uppercase tracking-wider text-muted-foreground">
                Problem
              </dt>
              <dd className="mt-2 leading-relaxed text-foreground">
                {activeItem.problem}
              </dd>
            </div>

            <div>
              <dt className="text-sm uppercase tracking-wider text-muted-foreground">
                Decision
              </dt>
              <dd className="mt-2 leading-relaxed text-foreground">
                {activeItem.decision}
              </dd>
            </div>

            <div>
              <dt className="text-sm uppercase tracking-wider text-muted-foreground">
                Why It Matters
              </dt>
              <dd className="mt-2 leading-relaxed text-foreground">
                {activeItem.impact}
              </dd>
            </div>
          </motion.dl>
        </AnimatePresence>
      </div>
    </div>
  )
}

