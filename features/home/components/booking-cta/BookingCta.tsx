"use client"

import { Container } from "@/components/layout/Container"
import { Magnetic } from "@/components/shared/Magnetic"
import ShinyText from "@/components/ShinyText"
import { motion } from "framer-motion"
import Link from "next/link"

export function BookingCta() {
  return (
    <section className="relative py-40 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-background via-background to-primary/10" />

      <Container>
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl text-center space-y-10"
        >
          <ShinyText
            className=" text-4xl md:text-5xl font-medium tracking-tight leading-tight"
            text="Let's Build Something Structured & Scalable."
            speed={2}
            delay={0}
            color="color-mix(in oklab, var(--color-foreground ) 70%, transparent)"
            shineColor="color-mix(in oklab, var(--color-foreground ) 100%, transparent)"
            spread={120}
            direction="left"
            yoyo={false}
            pauseOnHover={false}
            disabled={false}
          />

          <p className="text-muted-foreground text-lg leading-relaxed">
            If you&apos;re building a serious product and care about
            performance, architecture, and intentional UX, let&apos;s collaborate.
          </p>

          <Magnetic strength={25}>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full px-10 py-4 text-lg font-medium transition-all duration-300 bg-primary text-primary-foreground hover:shadow-[0_0_40px_rgba(124,59,237,0.45)]"
            >
              Start a Conversation
            </Link>
          </Magnetic>
        </motion.div>
      </Container>
    </section>
  )
}

