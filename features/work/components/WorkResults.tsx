"use client"

import { AnimatePresence, motion } from "framer-motion"

interface Props {
    activeTag: string
    projects: {
        slug: string
        title: string
    }[]
}

export function WorkResults({ activeTag, projects }: Props) {
    return (
        <div className="mt-20">
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTag}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.35 }}
                    className="space-y-20"
                >
                    {projects.length === 0 ? (
                        <div className="rounded-3xl border border-border/40 bg-card/40 backdrop-blur-xl p-16 text-center">
                            <p className="text-muted-foreground text-lg">
                                No projects under this category yet.
                            </p>
                        </div>
                    ) : (
                        projects.map((project) => (
                            <div key={project.slug}>
                                {project.title}
                            </div>
                        ))
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    )
}