"use client"

import { motion, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/cn"
import { motionDuration, motionEase, revealDistance } from "@/lib/motion"

interface RevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
  y?: number
  once?: boolean
  fromScale?: number
}

export default function Reveal({
  children,
  className,
  delay = 0,
  y = revealDistance,
  once = true,
  fromScale,
}: RevealProps) {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      initial={{ opacity: 0, y, scale: fromScale ?? 1 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once, margin: "-60px" }}
      transition={{
        duration: motionDuration.reveal,
        delay,
        ease: motionEase.standard,
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}
