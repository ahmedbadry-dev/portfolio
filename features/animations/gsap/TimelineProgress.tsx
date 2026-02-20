"use client"

import { useEffect } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export default function TimelineProgress() {
    useEffect(() => {
        const line = document.getElementById("progress-line")
        const dot = document.getElementById("progress-dot")

        if (!line || !dot) return

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: line,
                start: "top center",
                end: "bottom center",
                scrub: true,
            },
        })

        tl.to(line, {
            height: "100%",
            ease: "none",
        })

        tl.to(
            dot,
            {
                y: line.parentElement?.scrollHeight,
                ease: "none",
            },
            0
        )
    }, [])

    return null
}
