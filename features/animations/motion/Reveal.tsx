"use client"

import { motion, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/cn"

interface RevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
  y?: number
}

export default function Reveal({
  children,
  className,
  delay = 0,
  y = 20,
}: RevealProps) {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}
