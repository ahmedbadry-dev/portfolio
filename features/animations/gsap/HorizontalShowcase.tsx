"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

interface Props {
  children: React.ReactNode
}

export default function HorizontalShowcase({ children }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const totalWidth = el.scrollWidth - window.innerWidth

    gsap.to(el, {
      x: -totalWidth,
      ease: "none",
      scrollTrigger: {
        trigger: el,
        start: "top top",
        end: () => `+=${totalWidth}`,
        scrub: true,
        pin: true,
        anticipatePin: 1,
      },
    })

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="flex gap-20 w-max"
    >
      {children}
    </div>
  )
}
