"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Project } from "@/data/projects"
import { WorkShowcaseCard } from "@/features/work/components/WorkShowcaseCard"
import { fadeInUp, motionDuration, motionEase } from "@/lib/motion"

interface Props {
  activeTag: string
  projects: Project[]
}

export function WorkResults({ activeTag, projects }: Props) {
  const [index, setIndex] = useState(0)

  if (projects.length === 0) {
    return (
      <motion.div
        key={activeTag}
        initial={fadeInUp.initial}
        animate={fadeInUp.animate}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: motionDuration.base, ease: motionEase.standard }}
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
      initial={fadeInUp.initial}
      animate={fadeInUp.animate}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: motionDuration.base, ease: motionEase.standard }}
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
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: motionDuration.base, ease: motionEase.standard }}
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

