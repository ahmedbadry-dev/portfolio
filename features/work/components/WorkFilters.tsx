"use client"

import { useRouter } from "next/navigation"
import { cn } from "@/lib/cn"
import { Magnetic } from "@/components/shared/Magnetic"
import { motion } from "framer-motion"

const filters = ["All", "Next.js", "Fullstack", "Performance"]

interface Props {
  activeTag: string
  counts: Record<string, number>
}

export function WorkFilters({ activeTag, counts }: Props) {
  const router = useRouter()

  const handleClick = (tag: string) => {
    const nextUrl = tag === "All" ? "/work" : `/work?tag=${encodeURIComponent(tag)}`

    router.push(nextUrl, { scroll: false })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="relative flex flex-wrap gap-6 items-center">
      {filters.map((tag) => {
        const isActive = activeTag === tag

        return (
          <Magnetic key={tag} strength={35}>
            <button
              onClick={() => handleClick(tag)}
              className="relative px-6 py-2 text-sm transition-colors duration-300"
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
  )
}
