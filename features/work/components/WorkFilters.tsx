"use client"

import { useRouter } from "next/navigation"
import { cn } from "@/lib/cn"
import { Magnetic } from "@/components/shared/Magnetic"
import { motion } from "framer-motion"
import { fadeInUp, motionDuration, motionEase } from "@/lib/motion"

interface Props {
  activeTag: string
  filters: string[]
}

export function WorkFilters({ activeTag, filters }: Props) {
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
      className="sticky top-16 z-40 rounded-2xl border border-border/40 bg-background/75 px-3 py-2 shadow-sm backdrop-blur-xl md:top-20 md:px-4 md:py-3"
    >
      <div className="overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <div className="relative flex w-max min-w-full items-center gap-2 md:w-auto md:flex-wrap md:gap-3">
        {filters.map((tag) => {
          const isActive = activeTag === tag

          return (
            <Magnetic key={tag} className="shrink-0" strength={35}>
              <button
                onClick={() => handleClick(tag)}
                className="relative rounded-full border border-border/50 bg-background/50 px-4 py-2 text-sm transition-colors duration-300 md:px-5"
              >
                <span
                  className={cn(
                    "relative z-10 font-medium",
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {tag}
                </span>

                {isActive && (
                  <motion.div
                    layoutId="active-filter-pill"
                    className="absolute inset-0 rounded-full border border-primary/30 bg-primary/10"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}
              </button>
            </Magnetic>
          )
        })}
        </div>
      </div>
    </motion.nav>
  )
}
