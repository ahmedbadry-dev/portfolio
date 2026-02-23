"use client"

import { motion, useReducedMotion, type Variants } from "framer-motion"
import { cn } from "@/lib/cn"
import { motionDuration, motionEase, revealDistance, staggerDelay } from "@/lib/motion"

interface ContainerProps {
  children: React.ReactNode
  className?: string
  once?: boolean
}

interface ItemProps {
  children: React.ReactNode
  className?: string
}

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: staggerDelay,
    },
  },
}

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: revealDistance,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: motionDuration.reveal,
      ease: motionEase.standard,
    },
  },
}

export function StaggerContainer({
  children,
  className,
  once = true,
}: ContainerProps) {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-60px" }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({
  children,
  className,
}: ItemProps) {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div variants={itemVariants} className={cn(className)}>
      {children}
    </motion.div>
  )
}
