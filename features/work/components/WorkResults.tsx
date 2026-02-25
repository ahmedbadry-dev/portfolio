"use client"

import { AnimatePresence, motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Project } from "@/data/projects"
import { WorkShowcaseCard } from "@/features/work/components/WorkShowcaseCard"
import { fadeInUp, motionDuration, motionEase } from "@/lib/motion"
import { useWorkController } from "@/features/work/useWorkController"

interface Props {
  activeTag: string
  projects: Project[]
}

export function WorkResults({ activeTag, projects }: Props) {
  const { index, showPrev, showNext } = useWorkController({
    projectsLength: Math.max(projects.length, 1),
  })

  if (projects.length === 0) {
    return (
      <motion.div
        key={activeTag}
        initial={fadeInUp.initial}
        animate={fadeInUp.animate}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: motionDuration.base, ease: motionEase.standard }}
        className="mt-8 rounded-3xl border border-border/40 bg-card/40 p-8 text-center backdrop-blur-xl md:mt-12 md:p-16"
      >
        <p className="text-base text-muted-foreground md:text-lg">
          No projects under this category yet.
        </p>
      </motion.div>
    )
  }

  const safeIndex = index % projects.length
  const activeProject = projects[safeIndex]

  return (
    <motion.div
      key={activeTag}
      initial={fadeInUp.initial}
      animate={fadeInUp.animate}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: motionDuration.base, ease: motionEase.standard }}
      className="mt-8 space-y-5 md:mt-12 md:space-y-8"
    >
      <div className="flex items-center justify-between gap-4 rounded-2xl border border-border/40 bg-card/30 p-2.5 md:border-none md:bg-transparent md:p-0">
        <p className="text-sm font-medium text-muted-foreground">
          {safeIndex + 1} / {projects.length}
        </p>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="icon"
            variant="secondary"
            aria-label="Previous project"
            className="h-9 w-9 md:h-8 md:w-8"
            onClick={showPrev}
          >
            <ChevronLeft className="size-4" />
          </Button>

          <Button
            type="button"
            size="icon"
            variant="secondary"
            aria-label="Next project"
            className="h-9 w-9 md:h-8 md:w-8"
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
            screenshots={activeProject.screenshots}
            links={activeProject.links}
          />
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}

