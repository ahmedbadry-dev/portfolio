"use client"

import { useCallback, useEffect, useRef, type CSSProperties, type MouseEvent } from "react"
import Link from "next/link"
import { Container } from "./Container"
import { Magnetic } from "@/components/shared/Magnetic"
import { Github, Linkedin, Mail } from "lucide-react"

export function Footer() {
  const footerRef = useRef<HTMLElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const pointerRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [])

  const handleMouseMove = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      const rect = e.currentTarget.getBoundingClientRect()
      pointerRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }

      if (rafRef.current !== null) return
      rafRef.current = requestAnimationFrame(() => {
        if (footerRef.current) {
          footerRef.current.style.setProperty("--mx", `${pointerRef.current.x}px`)
          footerRef.current.style.setProperty("--my", `${pointerRef.current.y}px`)
        }
        rafRef.current = null
      })
    },
    []
  )

  return (
    <footer
      ref={footerRef}
      className="relative mt-20 bg-background/60 backdrop-blur-xl overflow-hidden"
      onMouseMove={handleMouseMove}
      style={
        {
          "--mx": "50%",
          "--my": "50%",
        } as CSSProperties
      }
    >
      {/* Moving Gradient Line */}
      <div className="absolute top-0 left-0 w-full h-px footer-gradient-line opacity-60" />

      {/* Glowing Separator */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-primary/40 blur-md opacity-60" />

      {/* Mouse Reactive Glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background: `radial-gradient(
            600px circle at var(--mx) var(--my),
            rgba(124, 59, 237, 0.15),
            transparent 60%
          )`,
        }}
      />

      <Container>
        <div className="grid gap-12 py-20 md:grid-cols-3">

          {/* Brand */}
          <div className="space-y-4">
            <div className="text-lg font-medium tracking-tight">
              AB.dev
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Building structured, scalable web products with performance
              and intentional design at the core.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-6">
            <div className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              Navigation
            </div>

            <div className="flex flex-col gap-4 text-sm">

              <Magnetic strength={40}>
                <Link href="/" className="link-shimmer">
                  Home
                </Link>
              </Magnetic>

              <Magnetic strength={40}>
                <Link href="/work" className="link-shimmer">
                  Work
                </Link>
              </Magnetic>

              <Magnetic strength={40}>
                <Link href="/contact" className="link-shimmer">
                  Contact
                </Link>
              </Magnetic>

            </div>
          </div>

          {/* Social */}
          <div className="space-y-6">
            <div className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              Connect
            </div>

            <div className="flex items-center gap-6">

              <Magnetic strength={30}>
                <a
                  href="https://github.com/ahmedbadry-dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Github size={18} className="footer-icon" />
                </a>
              </Magnetic>

              <Magnetic strength={30}>
                <a
                  href="https://www.linkedin.com/in/ahmedbadry-dev/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Linkedin size={18} className="footer-icon" />
                </a>
              </Magnetic>

              <Magnetic strength={30}>
                <a
                  href="mailto:ahmedbadry.dev@gmail.com"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Mail size={18} className="footer-icon" />
                </a>
              </Magnetic>

            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="border-t border-border/30 py-8 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Ahmed Badry. All rights reserved.
        </div>

      </Container>
    </footer>
  )
}
