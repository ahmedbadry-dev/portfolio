"use client"

import { motion } from "framer-motion"
import { buttonVariants } from "@/components/ui/button"
import {
    StaggerContainer,
    StaggerItem,
} from "@/features/animations/motion/Stagger"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { ResumeActions } from "@/components/shared/ResumeActions"

function AnimatedHeadline({
    text,
    className,
}: {
    text: string
    className?: string
}) {
    const chars = Array.from(text)

    return (
        <motion.h1
            className={className}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px", amount: 0.1 }}
            aria-label={text}
        >
            {chars.map((char, index) => (
                <motion.span
                    key={`${char}-${index}`}
                    variants={{
                        hidden: { opacity: 0, y: 40 },
                        visible: {
                            opacity: 1,
                            y: 0,
                            transition: {
                                duration: 1.25,
                                ease: [0.22, 1, 0.36, 1],
                                delay: index * 0.05,
                            },
                        },
                    }}
                    className="inline-block will-change-transform"
                >
                    {char === " " ? "\u00A0" : char}
                </motion.span>
            ))}
        </motion.h1>
    )
}

export default function HeroContent() {
    return (
        <div className="space-y-6 text-center sm:space-y-8 lg:text-left">
            <StaggerContainer className="space-y-5 sm:space-y-6">

                <StaggerItem>
                    <AnimatedHeadline
                        text="Ahmed Badry"
                        className="text-3xl font-medium leading-[1.05] tracking-tight sm:text-4xl md:text-5xl lg:text-6xl"
                    />
                </StaggerItem>


                <StaggerItem>
                    <h2 className="flex flex-col items-center gap-3 text-lg font-medium text-muted-foreground md:flex-row md:justify-center sm:text-xl lg:items-start lg:text-3xl">
                        <span>Frontend</span>
                        <div className="relative inline-block px-5 py-3 sm:px-6 sm:py-4">
                            <span className="text-lg font-medium text-white sm:text-xl lg:text-3xl">
                                Specialist
                            </span>

                            {/* corners */}
                            <span className="absolute top-0 left-0 h-3 w-3 border-t-3 border-l-3 border-primary" />
                            <span className="absolute top-0 right-0 h-3 w-3 border-t-3 border-r-3 border-primary" />
                            <span className="absolute bottom-0 left-0 h-3 w-3 border-b-3 border-l-3 border-primary" />
                            <span className="absolute bottom-0 right-0 h-3 w-3 border-b-3 border-r-3 border-primary" />
                        </div>
                    </h2>
                </StaggerItem>

                <StaggerItem>
                    <div className="space-y-2 text-sm text-muted-foreground sm:space-y-3 sm:text-base lg:text-lg">
                        <p>Building cutting-edge web experiences</p>
                        <p>Elevating performance & design</p>
                    </div>
                </StaggerItem>

                <StaggerItem>
                    <div className="flex w-full flex-col items-stretch justify-center gap-3 pt-2 sm:flex-row sm:items-center sm:gap-4 lg:justify-start lg:gap-5 lg:pt-4">
                        <Link
                            href={'/work'}
                            className={cn(buttonVariants(), 'h-11 w-full px-6 text-sm shadow-md transition sm:w-auto sm:px-8 sm:text-base')}
                        >
                            View Work
                        </Link>

                        <ResumeActions />
                    </div>
                </StaggerItem>

            </StaggerContainer>
        </div>
    )
}
