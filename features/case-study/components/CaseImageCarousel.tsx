"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"
import { cn } from "@/lib/cn"

interface CaseImageCarouselProps {
  title: string
  screenshots?: string[]
}

export function CaseImageCarousel({ title, screenshots }: CaseImageCarouselProps) {
  const slides = useMemo(
    () => (screenshots && screenshots.length > 0 ? screenshots : ["/window.svg"]),
    [screenshots]
  )
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length)
    }, 3800)

    return () => window.clearInterval(interval)
  }, [slides.length])

  return (
    <div>
      <div className="group relative overflow-hidden rounded-2xl">
        <div className="relative aspect-[16/8] w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${slides[activeIndex]}-${activeIndex}`}
              initial={{ opacity: 0, x: 26 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -26 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="absolute inset-0"
            >
              <Image
                src={slides[activeIndex]}
                alt={`${title} preview ${activeIndex + 1}`}
                fill
                className="object-cover"
                priority={activeIndex === 0}
              />
              <div className="absolute inset-0 bg-linear-to-t from-background/45 via-transparent to-transparent" />
            </motion.div>
          </AnimatePresence>

          <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-primary/40 blur-3xl" />
            <div className="absolute -bottom-16 -right-16 h-56 w-56 rounded-full bg-primary/40 blur-3xl" />
            <div className="absolute -bottom-20 left-1/2 h-48 w-72 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            aria-label={`Go to slide ${index + 1}`}
            onClick={() => setActiveIndex(index)}
            className={cn(
              "h-2.5 rounded-full transition-all duration-300",
              index === activeIndex
                ? "w-6 bg-primary"
                : "w-2.5 bg-foreground/25 hover:bg-foreground/45"
            )}
          />
        ))}
      </div>
    </div>
  )
}
