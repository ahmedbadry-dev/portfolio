"use client"

import { useEffect, useRef } from "react"

export function GlobalBackground() {
    const lightRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleMove = (e: MouseEvent) => {
            if (!lightRef.current) return
            lightRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
        }

        window.addEventListener("mousemove", handleMove)
        return () => window.removeEventListener("mousemove", handleMove)
    }, [])

    return (
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">

            {/* Base gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background" />

            {/* Animated Mesh Top Right */}
            <svg
                className="absolute -top-40 -right-40 w-[800px] opacity-40 animate-driftSlow"
                viewBox="0 0 800 800"
            >
                <defs>
                    <radialGradient id="mesh1" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="oklch(var(--primary))" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="transparent" />
                    </radialGradient>
                </defs>
                <path
                    fill="url(#mesh1)"
                    d="M421,49Q503,98,579,153Q654,207,686,293Q718,379,668,450Q618,521,563,590Q508,658,418,705Q328,752,250,697Q172,642,105,583Q38,524,29,441Q20,358,57,280Q94,202,157,152Q220,102,305,64Q390,26,421,49Z"
                />
            </svg>

            {/* Animated Mesh Bottom Left */}
            <svg
                className="absolute -bottom-40 -left-40 w-[900px] opacity-30 animate-driftReverse"
                viewBox="0 0 800 800"
            >
                <defs>
                    <radialGradient id="mesh2" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="oklch(var(--primary))" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="transparent" />
                    </radialGradient>
                </defs>
                <path
                    fill="url(#mesh2)"
                    d="M395,60Q470,120,550,170Q630,220,670,300Q710,380,660,450Q610,520,540,580Q470,640,390,680Q310,720,240,670Q170,620,110,560Q50,500,45,420Q40,340,75,260Q110,180,180,120Q250,60,320,40Q390,20,395,60Z"
                />
            </svg>

            {/* Mouse Reactive Light */}
            <div
                ref={lightRef}
                className="absolute h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[120px] opacity-60 transition-transform duration-75"
            />

            {/* Noise Overlay */}
            <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay pointer-events-none bg-[url('/noise.png')]" />

        </div>
    )
}
