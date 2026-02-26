"use client"

import { Container } from "@/components/layout/Container"
import { Glass } from "@/components/shared/Glass"
import { Magnetic } from "@/components/shared/Magnetic"
import { motion } from "framer-motion"
import { engineeringPrinciples } from "@/data/home"

export function EngineeringPrinciples() {
  return (
    <section className="relative py-20 md:py-32 lg:py-40">
      <Container>
        <div className="mx-auto mb-12 max-w-2xl space-y-4 text-center md:mb-16 md:space-y-6 lg:mb-24">
          <h2 className="text-3xl font-medium tracking-tight md:text-4xl">
            Engineering Principles
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            I don&apos;t build interfaces randomly. I follow a clear engineering
            philosophy that prioritizes structure, performance, and intentional
            design.
          </p>
        </div>

        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-10">
          {engineeringPrinciples.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: index * 0.15 }}
              viewport={{ once: true }}
            >
              <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.3 }}>
                <Magnetic strength={30}>
                  <Glass className="rounded-3xl border border-border/40 p-6 backdrop-blur-2xl transition-[border-color,box-shadow] duration-300 sm:p-8 lg:p-10 hover:shadow-[0_0_40px_rgba(124,59,237,0.15)]">
                    <div className="space-y-4 sm:space-y-6">
                      <h3 className="text-lg font-medium tracking-tight sm:text-xl">
                        {item.title}
                      </h3>

                      <p className="text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </Glass>
                </Magnetic>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}
