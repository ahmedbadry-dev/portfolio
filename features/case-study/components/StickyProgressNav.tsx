"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/cn"
import { motionDuration, motionEase } from "@/lib/motion"
import { useScrollDirection } from "@/features/case-study/hooks/useScrollDirection"
import { useSectionObserver } from "@/features/case-study/hooks/useSectionObserver"

type StickyProgressItem = {
  id: string
  label: string
}

type StickyProgressNavProps = {
  items: StickyProgressItem[]
}

export function StickyProgressNav({ items }: StickyProgressNavProps) {
  const ids = useMemo(() => items.map((item) => item.id), [items])
  const activeId = useSectionObserver(ids)
  const { direction, hasScrolled } = useScrollDirection()

  return (
    <aside className="sticky top-24 hidden h-fit lg:block">
      <motion.nav
        aria-label="Case study progress"
        animate={{
          y: direction === "down" ? 2 : 0,
          opacity: hasScrolled ? 1 : 0.92,
        }}
        transition={{ duration: motionDuration.base, ease: motionEase.standard }}
        className={cn(
          "rounded-lg border px-4 py-3 transition-colors duration-300",
          hasScrolled
            ? "border-border/70 bg-background/85 backdrop-blur-sm"
            : "border-border/45 bg-background/70"
        )}
        style={{ width: 220 }}
      >
        <div className="relative pl-4">
          <div className="absolute left-0 top-1 bottom-1 w-px bg-border/70" />
          <ul className="space-y-2">
            {items.map((item) => {
              const isActive = item.id === activeId

              return (
                <li key={item.id} className="relative">
                  {isActive ? (
                    <motion.span
                      layoutId="case-progress-indicator"
                      aria-hidden
                      className="absolute -left-[7px] top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-primary"
                      transition={{
                        duration: motionDuration.base,
                        ease: motionEase.standard,
                      }}
                    />
                  ) : null}
                  <a
                    href={`#${item.id}`}
                    aria-current={isActive ? "location" : undefined}
                    className={cn(
                      "inline-block origin-left rounded-sm px-1.5 py-0.5 text-xs transition-all duration-300",
                      isActive
                        ? "scale-[1.03] bg-primary/10 text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {item.label}
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
      </motion.nav>
    </aside>
  )
}
