"use client"

import { Container } from "@/components/layout/Container"
import { Glass } from "@/components/shared/Glass"
import { Magnetic } from "@/components/shared/Magnetic"
import { motion } from "framer-motion"
import { engineeringPrinciples } from "@/data/home"

export function EngineeringPrinciples() {
  return (
    <section className="relative py-40">
      <Container>
        <div className="mx-auto max-w-2xl text-center space-y-6 mb-24">
          <h2 className="text-4xl font-medium tracking-tight">
            Engineering Principles
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            I don&apos;t build interfaces randomly. I follow a clear engineering
            philosophy that prioritizes structure, performance, and intentional
            design.
          </p>
        </div>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
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
                  <Glass className="p-10 rounded-3xl border border-border/40 backdrop-blur-2xl transition-all duration-300 hover:shadow-[0_0_40px_rgba(124,59,237,0.15)]">
                    <div className="space-y-6">
                      <h3 className="text-xl font-medium tracking-tight">
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
