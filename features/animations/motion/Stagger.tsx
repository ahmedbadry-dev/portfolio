"use client"

import { motion, useReducedMotion, type Variants } from "framer-motion"
import { cn } from "@/lib/cn"

interface ContainerProps {
    children: React.ReactNode
    className?: string
}

interface ItemProps {
    children: React.ReactNode
    className?: string
}

/* ----------------------------- */
/* Variants */
/* ----------------------------- */

const containerVariants: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.12,
            delayChildren: 0.1,
        },
    },
}

const itemVariants: Variants = {
    hidden: {
        opacity: 0,
        y: 20,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.7,
            ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
        },
    },
}

/* ----------------------------- */
/* Components */
/* ----------------------------- */

export function StaggerContainer({
    children,
    className,
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
            viewport={{ once: true, margin: "-50px" }}
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
        <motion.div
            variants={itemVariants}
            className={cn(className)}
        >
            {children}
        </motion.div>
    )
}
