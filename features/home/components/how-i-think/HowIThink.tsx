"use client"

import { useEffect, useRef } from "react"
import { Container } from "@/components/layout/Container"
import { cn } from "@/lib/cn"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { howIThinkSteps } from "@/data/home"

gsap.registerPlugin(ScrollTrigger)

export function HowIThink() {
  const containerRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const trailRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    if (!containerRef.current) return

    const ctx = gsap.context(() => {
      const totalHeight = containerRef.current!.offsetHeight

      gsap.to(progressRef.current, {
        height: totalHeight,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top center",
          end: "bottom center",
          scrub: true,
        },
      })

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const velocity = Math.abs(self.getVelocity())
          const intensity = gsap.utils.clamp(0, 1, velocity / 2000)

          gsap.to(trailRef.current, {
            scale: 1 + intensity * 0.8,
            opacity: 0.5 + intensity * 0.5,
            duration: 0.2,
          })
        },
      })

      cardsRef.current.forEach((card) => {
        const path = card.parentElement?.querySelector(".branch-border")
        const glow = card.querySelector(".card-glow")

        if (path) {
          gsap.to(path, {
            strokeDashoffset: 0,
            duration: 1.9,
            ease: "power1.out",
            scrollTrigger: {
              trigger: card,
              start: "top center",
              toggleActions: "play none none reverse",
            },
          })
        }

        if (glow) {
          gsap.fromTo(
            glow,
            { opacity: 0 },
            {
              opacity: 0.6,
              scrollTrigger: {
                trigger: card,
                start: "top center+=100",
                toggleActions: "play none none reverse",
              },
            }
          )
        }

        gsap.to(card, {
          yPercent: -5,
          ease: "none",
          scrollTrigger: {
            trigger: card,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        })
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <section className="relative py-20 md:py-32 lg:py-40">
      <Container>
        <div className="mx-auto mb-12 max-w-2xl space-y-4 text-center md:mb-20 md:space-y-6 lg:mb-28">
          <h2 className="text-3xl font-medium tracking-tight md:text-4xl">How I Think</h2>
          <p className="text-muted-foreground leading-relaxed">
            I don&apos;t just build interfaces - I build structured, scalable
            products. Every decision is intentional.
          </p>
        </div>

        <div ref={containerRef} className="relative">
          <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-border/40 lg:block" />

          <div
            ref={progressRef}
            className="absolute left-1/2 top-0 hidden w-px -translate-x-1/2 bg-gradient-to-b from-primary via-purple-400 to-transparent lg:block"
            style={{ height: 0 }}
          />

          <div
            ref={trailRef}
            className="pointer-events-none absolute left-1/2 top-0 hidden h-14 w-14 -translate-x-1/2 rounded-full bg-primary/40 opacity-60 blur-3xl lg:block"
          />

          <div className="space-y-10 md:space-y-16 lg:space-y-32">
            {howIThinkSteps.map((step, index) => {
              const isLeft = index % 2 === 0

              return (
                <div
                  key={index}
                  className="relative grid grid-cols-1 items-center lg:grid-cols-2"
                >
                  <div
                    className={cn(
                      "relative",
                      isLeft ? "lg:pr-16" : "lg:order-2 lg:pl-16"
                    )}
                  >
                    <svg
                      className="pointer-events-none absolute inset-0 hidden h-full w-full text-border/70 lg:block dark:text-border/80"
                      viewBox="0 0 400 240"
                      preserveAspectRatio="none"
                    >
                      <path
                        d={
                          isLeft
                            ? `
                              M398 120
                              L332 120
                              Q314 120 304 108
                              L286 84
                              Q272 64 244 64
                              L62 64
                              Q34 64 34 92
                              L34 176
                              Q34 204 62 204
                              L274 204
                              Q300 204 312 184
                            `
                            : `
                              M2 120
                              L68 120
                              Q86 120 96 108
                              L114 84
                              Q128 64 156 64
                              L338 64
                              Q366 64 366 92
                              L366 176
                              Q366 204 338 204
                              L126 204
                              Q100 204 88 184
                            `
                        }
                        fill="none"
                        stroke="currentColor"
                        strokeOpacity="0.35"
                        strokeWidth="1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        className="branch-border"
                        d={
                          isLeft
                            ? `
                              M398 120
                              L332 120
                              Q314 120 304 108
                              L286 84
                              Q272 64 244 64
                              L62 64
                              Q34 64 34 92
                              L34 176
                              Q34 204 62 204
                              L274 204
                              Q300 204 312 184
                            `
                            : `
                              M2 120
                              L68 120
                              Q86 120 96 108
                              L114 84
                              Q128 64 156 64
                              L338 64
                              Q366 64 366 92
                              L366 176
                              Q366 204 338 204
                              L126 204
                              Q100 204 88 184
                            `
                        }
                        fill="none"
                        stroke="url(#branchGlowGradient)"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeDasharray="760"
                        strokeDashoffset="760"
                        style={{
                          filter: "drop-shadow(0 0 6px rgba(124,59,237,0.32)) drop-shadow(0 0 16px rgba(124,59,237,0.18))",
                        }}
                      />
                      <defs>
                        <linearGradient id="branchGlowGradient" x1="0%" y1="50%" x2="100%" y2="50%">
                          <stop offset="0%" stopColor="rgba(124,59,237,0.58)" />
                          <stop offset="45%" stopColor="rgba(124,59,237,0.95)" />
                          <stop offset="100%" stopColor="rgba(56,189,248,0.72)" />
                        </linearGradient>
                      </defs>
                    </svg>

                    <div
                      ref={(el) => {
                        if (el) cardsRef.current[index] = el
                      }}
                      className="relative rounded-2xl border border-border/50 bg-card/40 p-5 backdrop-blur-xl sm:p-6 lg:p-8"
                    >
                      <div className="card-glow pointer-events-none absolute inset-0 rounded-2xl bg-primary/18 opacity-0 blur-xl" />

                      <h3 className="relative z-10 mb-3 text-lg font-medium sm:text-xl">
                        {step.title}
                      </h3>

                      <p className="text-muted-foreground leading-relaxed relative z-10">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  <div className="hidden lg:block" />
                </div>
              )
            })}
          </div>
        </div>
      </Container>
    </section>
  )
}
