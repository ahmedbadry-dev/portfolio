"use client"

import { useRouter } from "next/navigation"
import { cn } from "@/lib/cn"
import { Magnetic } from "@/components/shared/Magnetic"
import { motion } from "framer-motion"
import { fadeInUp, motionDuration, motionEase } from "@/lib/motion"

interface Props {
  activeTag: string
  counts: Record<string, number>
  filters: string[]
}

export function WorkFilters({ activeTag, counts, filters }: Props) {
  const router = useRouter()

  const handleClick = (tag: string) => {
    const nextUrl = tag === "All" ? "/work" : `/work?tag=${encodeURIComponent(tag)}`

    router.push(nextUrl, { scroll: false })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <motion.nav
      initial={fadeInUp.initial}
      animate={fadeInUp.animate}
      transition={{ duration: motionDuration.slow, ease: motionEase.standard }}
      className="sticky top-20 z-40 rounded-2xl border border-border/40 bg-background/70 px-4 py-3 backdrop-blur-xl"
    >
      <div className="relative flex flex-wrap gap-4 items-center justify-center md:justify-start">
        {filters.map((tag) => {
          const isActive = activeTag === tag

          return (
            <Magnetic key={tag} strength={35}>
              <button
                onClick={() => handleClick(tag)}
                className="relative px-5 py-2 text-sm transition-colors duration-300"
              >
                <span
                  className={cn(
                    "relative z-10",
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {tag}
                  <span className="ml-2 text-xs opacity-60">{counts[tag] ?? 0}</span>
                </span>

                {isActive && (
                  <motion.div
                    layoutId="active-underline"
                    className="absolute left-0 bottom-0 h-px w-full bg-primary"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}
              </button>
            </Magnetic>
          )
        })}
      </div>
    </motion.nav>
  )
}
