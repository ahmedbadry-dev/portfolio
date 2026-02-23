"use client"

import { useMemo } from "react"
import {
    Atom,
    Braces,
    Code2,
    Database,
    FileCode2,
    Paintbrush,
    Server,
    type LucideIcon,
} from "lucide-react"
import LogoLoop, { type LogoItem } from "@/components/LogoLoop"

type BitsLogoLoopProps = {
    stack: string[]
}

const stackIconMap: Record<string, LucideIcon> = {
    "next.js": Server,
    nextjs: Server,
    next: Server,
    react: Atom,
    "react.js": Atom,
    typescript: Code2,
    ts: Code2,
    convex: Database,
    tailwindcss: Paintbrush,
    tailwind: Paintbrush,
    "tailwind css": Paintbrush,
    mdx: FileCode2,
}

function normalizeStackName(value: string) {
    return value.trim().toLowerCase()
}

export function BitsLogoLoop({ stack }: BitsLogoLoopProps) {
    const logos = useMemo<LogoItem[]>(() => {
        const uniqueStack = Array.from(new Set(stack.map((item) => item.trim()).filter(Boolean)))

        return uniqueStack.map((item) => {
            const normalized = normalizeStackName(item)
            const Icon = stackIconMap[normalized]

            return {
                node: (
                    <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/60 px-3 py-1 text-sm text-foreground/90 transition-all duration-300 group-hover/item:border-primary/70 group-hover/item:bg-primary/12 group-hover/item:text-primary group-hover/item:shadow-[0_0_16px_hsl(var(--primary)/0.35)]">
                        {Icon ? <Icon aria-hidden className="size-4" /> : <Braces aria-hidden className="size-4" />}
                        <span>{item}</span>
                    </span>
                ),
                title: item,
                ariaLabel: `Stack item ${item}`,
            }
        })
    }, [stack])

    if (logos.length === 0) {
        return null
    }

    return (
        <div className="relative h-20 overflow-hidden">
            <LogoLoop
                logos={logos}
                speed={52}
                direction="left"
                logoHeight={50}
                gap={30}
                hoverSpeed={0}
                scaleOnHover
                fadeOut
                ariaLabel="Project stack technologies"
            />
        </div>
    )
}
