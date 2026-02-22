"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Project } from "@/data/projects"
import { WorkShowcaseCard } from "@/features/work/components/WorkShowcaseCard"

interface Props {
  activeTag: string
  projects: Project[]
}

export function WorkResults({ activeTag, projects }: Props) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    setIndex(0)
  }, [activeTag, projects.length])

  if (projects.length === 0) {
    return (
      <motion.div
        key={activeTag}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.35 }}
        className="mt-12 rounded-3xl border border-border/40 bg-card/40 p-16 text-center backdrop-blur-xl"
      >
        <p className="text-lg text-muted-foreground">
          No projects under this category yet.
        </p>
      </motion.div>
    )
  }

  const safeIndex = index % projects.length
  const activeProject = projects[safeIndex]

  const showPrev = () => {
    setIndex((prev) => (prev - 1 + projects.length) % projects.length)
  }

  const showNext = () => {
    setIndex((prev) => (prev + 1) % projects.length)
  }

  return (
    <motion.div
      key={activeTag}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.35 }}
      className="mt-12 space-y-8"
    >
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          {safeIndex + 1} / {projects.length}
        </p>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="icon-sm"
            variant="secondary"
            aria-label="Previous project"
            onClick={showPrev}
          >
            <ChevronLeft className="size-4" />
          </Button>

          <Button
            type="button"
            size="icon-sm"
            variant="secondary"
            aria-label="Next project"
            onClick={showNext}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${activeTag}-${activeProject.slug}`}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <WorkShowcaseCard
            slug={activeProject.slug}
            title={activeProject.title}
            description={activeProject.description}
            tags={activeProject.tags}
            lighthouse={activeProject.lighthouse}
            ttfb={activeProject.ttfb}
            imageCount={activeProject.imageCount}
          />
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}

