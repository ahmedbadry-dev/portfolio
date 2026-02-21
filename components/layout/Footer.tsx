"use client"

import { useState } from "react"
import Link from "next/link"
import { Container } from "./Container"
import { Magnetic } from "@/components/shared/Magnetic"
import { Github, Linkedin, Mail } from "lucide-react"

export function Footer() {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  return (
    <footer
      className="relative mt-20 bg-background/60 backdrop-blur-xl overflow-hidden"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        setPosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        })
      }}
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
            600px circle at ${position.x}px ${position.y}px,
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
                  href="https://github.com/yourusername"
                  target="_blank"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Github size={18} className="footer-icon" />
                </a>
              </Magnetic>

              <Magnetic strength={30}>
                <a
                  href="https://linkedin.com/in/yourusername"
                  target="_blank"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Linkedin size={18} className="footer-icon" />
                </a>
              </Magnetic>

              <Magnetic strength={30}>
                <a
                  href="mailto:your@email.com"
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