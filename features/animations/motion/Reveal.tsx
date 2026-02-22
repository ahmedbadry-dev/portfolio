"use client"

import { motion, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/cn"
import { motionEase } from "@/lib/motion"

interface RevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
  y?: number
  once?: boolean
}

export default function Reveal({
  children,
  className,
  delay = 0,
  y = 8,
  once = true,
}: RevealProps) {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-60px" }}
      transition={{
        duration: 0.46,
        delay,
        ease: motionEase.standard,
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}
