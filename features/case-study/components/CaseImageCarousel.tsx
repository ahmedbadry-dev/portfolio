"use client"

import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react"
import Image from "next/image"
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion"
import { cn } from "@/lib/cn"
import { motionDuration, motionEase } from "@/lib/motion"

interface CaseImageCarouselProps {
  title: string
  screenshots?: string[]
}

const AUTO_PLAY_INTERVAL_MS = 3800

const CarouselSlide = memo(function CarouselSlide({
  src,
  title,
  index,
  reducedMotion,
}: {
  src: string
  title: string
  index: number
  reducedMotion: boolean
}) {
  return (
    <motion.div
      key={`${src}-${index}`}
      initial={reducedMotion ? false : { opacity: 0, x: 26 }}
      animate={{ opacity: 1, x: 0 }}
      exit={reducedMotion ? { opacity: 0 } : { opacity: 0, x: -26 }}
      transition={{ duration: motionDuration.slow, ease: motionEase.standard }}
      className="absolute inset-0 will-change-transform"
      aria-live="off"
    >
      <Image
        src={src}
        alt={`${title} preview ${index + 1}`}
        fill
        className="object-cover"
        priority={index === 0}
      />
      <div className="absolute inset-0 bg-linear-to-t from-background/45 via-transparent to-transparent" />
    </motion.div>
  )
})

const CarouselDots = memo(function CarouselDots({
  slidesLength,
  activeIndex,
  onSelect,
}: {
  slidesLength: number
  activeIndex: number
  onSelect: (index: number) => void
}) {
  return (
    <div className="mt-4 flex justify-center gap-2">
      {Array.from({ length: slidesLength }).map((_, index) => {
        const isActive = index === activeIndex

        return (
          <button
            key={index}
            type="button"
            aria-label={`Go to slide ${index + 1}`}
            aria-current={isActive}
            aria-pressed={isActive}
            onClick={() => onSelect(index)}
            className={cn(
              "h-2.5 rounded-full transition-all duration-300",
              isActive
                ? "w-6 bg-primary"
                : "w-2.5 bg-foreground/25 hover:bg-foreground/45"
            )}
          />
        )
      })}
    </div>
  )
})

function CaseImageCarouselComponent({
  title,
  screenshots,
}: CaseImageCarouselProps) {
  console.count("Carousel render")
  const reduceMotion = Boolean(useReducedMotion())
  const rootRef = useRef<HTMLDivElement>(null)
  const slides = useMemo(
    () => (screenshots && screenshots.length > 0 ? screenshots : ["/window.svg"]),
    [screenshots]
  )
  const [activeIndex, setActiveIndex] = useState(0)
  const isPausedRef = useRef(false)

  const goToSlide = useCallback(
    (index: number) => {
      setActiveIndex((index + slides.length) % slides.length)
    },
    [slides.length]
  )

  const goToNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % slides.length)
  }, [slides.length])

  const goToPrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length)
  }, [slides.length])

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "ArrowRight") {
        event.preventDefault()
        goToNext()
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault()
        goToPrev()
      }
    },
    [goToNext, goToPrev]
  )

  useEffect(() => {
    if (slides.length <= 1 || reduceMotion) return

    const interval = window.setInterval(() => {
      if (isPausedRef.current || document.visibilityState !== "visible") {
        return
      }
      goToNext()
    }, AUTO_PLAY_INTERVAL_MS)

    return () => window.clearInterval(interval)
  }, [goToNext, reduceMotion, slides.length])
  const safeIndex = activeIndex % slides.length
  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: ["start end", "end start"],
  })
  const parallaxY = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    reduceMotion ? [0, 0, 0] : [10, 0, -10]
  )

  return (
    <div
      ref={rootRef}
      role="region"
      aria-roledescription="carousel"
      aria-label={`${title} screenshots`}
      onMouseEnter={() => {
        isPausedRef.current = true
      }}
      onMouseLeave={() => {
        isPausedRef.current = false
      }}
      onFocusCapture={() => {
        isPausedRef.current = true
      }}
      onBlurCapture={() => {
        isPausedRef.current = false
      }}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      className="outline-none"
    >
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: motionDuration.reveal, ease: motionEase.standard }}
        className="group relative isolate overflow-hidden rounded-2xl [contain:layout_paint_style]"
      >
        <motion.div className="relative aspect-[16/8] w-full" style={{ y: parallaxY }}>
          <AnimatePresence mode="wait">
            <CarouselSlide
              src={slides[safeIndex]}
              title={title}
              index={safeIndex}
              reducedMotion={reduceMotion}
            />
          </AnimatePresence>

          <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-primary/40 blur-3xl" />
            <div className="absolute -bottom-16 -right-16 h-56 w-56 rounded-full bg-primary/40 blur-3xl" />
            <div className="absolute -bottom-20 left-1/2 h-48 w-72 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
          </div>
        </motion.div>
      </motion.div>

      <p className="sr-only">
        Slide {safeIndex + 1} of {slides.length}
      </p>

      <CarouselDots
        slidesLength={slides.length}
        activeIndex={safeIndex}
        onSelect={goToSlide}
      />
    </div>
  )
}

export const CaseImageCarousel = memo(CaseImageCarouselComponent)
