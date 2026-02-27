"use client"

import { Container } from "@/components/layout/Container"
import { Magnetic } from "@/components/shared/Magnetic"
import ShinyText from "@/components/ShinyText"
import { motion } from "framer-motion"
import Link from "next/link"

export function BookingCta() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32 lg:py-40">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-background via-background to-primary/8" />

      <Container>
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative mx-auto max-w-4xl overflow-hidden rounded-[2rem] border border-border/50 bg-card/35 px-5 py-10 text-center shadow-[0_20px_80px_rgba(15,23,42,0.06)] backdrop-blur-xl sm:rounded-[2.5rem] sm:px-8 sm:py-12 md:space-y-10 md:px-12 md:py-16 dark:shadow-[0_24px_90px_rgba(0,0,0,0.28)]"
        >
          <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          <div className="pointer-events-none absolute inset-x-[18%] bottom-0 h-px bg-gradient-to-r from-transparent via-primary/35 to-transparent" />
          <div className="pointer-events-none absolute inset-[12px] rounded-[1.55rem] border border-white/30 dark:border-white/10 sm:rounded-[2rem]" />

          <div className="relative space-y-6 md:space-y-10">
          <ShinyText
            className="text-3xl font-medium leading-tight tracking-tight sm:text-4xl md:text-5xl"
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

          <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
            If you&apos;re building a serious product and care about
            performance, architecture, and intentional UX, let&apos;s collaborate.
          </p>

          <Magnetic strength={25}>
            <Link
              href="/contact"
              className="inline-flex w-full items-center justify-center rounded-full bg-primary px-8 py-3.5 text-base font-medium text-primary-foreground transition-[transform,box-shadow] duration-300 sm:w-auto sm:px-10 sm:py-4 sm:text-lg hover:shadow-[0_0_40px_rgba(124,59,237,0.45)]"
            >
              Start a Conversation
            </Link>
          </Magnetic>
          </div>
        </motion.div>
      </Container>
    </section>
  )
}

