"use client"

import { useEffect, useRef } from "react"
import { Container } from "@/components/layout/Container"
import { cn } from "@/lib/cn"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const steps = [
  {
    title: "Understand the Product",
    description:
      "Before writing code, I break down user flows and business goals to ensure every decision serves a purpose.",
  },
  {
    title: "Design the Architecture",
    description:
      "I structure components, data flow, and state management carefully to avoid over-engineering while keeping scalability in mind.",
  },
  {
    title: "Optimize for Performance",
    description:
      "From server-first rendering to bundle control and motion discipline — performance is never an afterthought.",
  },
]

export function HowIThink() {
  const containerRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const trailRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    if (!containerRef.current) return

    const ctx = gsap.context(() => {
      const totalHeight = containerRef.current!.offsetHeight

      // 🔹 Progress line draw
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

      // 🔹 Glow reacts to scroll speed
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

      // 🔹 Card animations
      cardsRef.current.forEach((card) => {
        const path = card.querySelector(".branch-border")
        const glow = card.querySelector(".card-glow")

        // Continuous branch + border draw
        gsap.to(path, {
          strokeDashoffset: 0,
          duration: 1.4,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top center",
            toggleActions: "play none none reverse",
          },
        })

        // Light spill
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

        // Slight parallax
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
    <section className="relative py-40">
      <Container>

        {/* Header */}
        <div className="mx-auto max-w-2xl text-center space-y-6 mb-28">
          <h2 className="text-4xl font-medium tracking-tight">
            How I Think
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            I don’t just build interfaces — I build structured, scalable
            products. Every decision is intentional.
          </p>
        </div>

        <div ref={containerRef} className="relative">

          {/* Base Line */}
          <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-border/40" />

          {/* Gradient Progress Line */}
          <div
            ref={progressRef}
            className="absolute left-1/2 top-0 w-px -translate-x-1/2 bg-gradient-to-b from-primary via-purple-400 to-transparent"
            style={{ height: 0 }}
          />

          {/* Glow Trail */}
          <div
            ref={trailRef}
            className="absolute left-1/2 top-0 -translate-x-1/2 h-14 w-14 rounded-full bg-primary/40 blur-3xl opacity-60 pointer-events-none"
          />

          <div className="space-y-32">

            {steps.map((step, index) => {
              const isLeft = index % 2 === 0

              return (
                <div
                  key={index}
                  className="relative grid grid-cols-1 lg:grid-cols-2 items-center"
                >

                  <div
                    className={cn(
                      "relative",
                      isLeft ? "lg:pr-16" : "lg:order-2 lg:pl-16"
                    )}
                  >

                    {/* Continuous SVG Path */}
                    <svg
                      className="absolute inset-0 w-full h-full pointer-events-none"
                      viewBox="0 0 400 200"
                      preserveAspectRatio="none"
                    >
                      <path
                        className="branch-border"
                        d={
                          isLeft
                            ? `
                              M200 0
                              L200 100
                              L20 100
                              L20 20
                              L380 20
                              L380 180
                              L20 180
                              L20 100
                            `
                            : `
                              M200 0
                              L200 100
                              L380 100
                              L380 20
                              L20 20
                              L20 180
                              L380 180
                              L380 100
                            `
                        }
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                        strokeDasharray="1200"
                        strokeDashoffset="1200"
                      />
                    </svg>

                    {/* Card */}
                    <div
                      ref={(el) => {
                        if (el) cardsRef.current[index] = el
                      }}
                      className="relative rounded-2xl p-8 bg-card/40 backdrop-blur-xl"
                    >
                      <div className="card-glow absolute inset-0 rounded-2xl bg-primary/20 blur-2xl opacity-0 pointer-events-none" />

                      <h3 className="text-xl font-medium mb-3 relative z-10">
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
