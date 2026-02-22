"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Magnetic } from "@/components/shared/Magnetic"

export default function NotFound() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

            {/* Cinematic gradient base */}
            <div className="pointer-events-none absolute inset-0 -z-20 bg-gradient-to-br from-background via-background to-primary/10" />

            {/* Parallax glow layers */}
            <motion.div
                animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
                transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
                className="pointer-events-none absolute -top-40 right-[-200px] h-[700px] w-[700px] rounded-full bg-primary/20 blur-[200px]"
            />

            <motion.div
                animate={{ x: [0, -50, 0], y: [0, 40, 0] }}
                transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
                className="pointer-events-none absolute bottom-[-200px] left-[-200px] h-[700px] w-[700px] rounded-full bg-primary/10 blur-[200px]"
            />

            {/* Grain overlay */}
            <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.05] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            <motion.div
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="text-center space-y-12 px-6"
            >

                {/* Cinematic 404 */}
                <div className="relative inline-block">
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="text-[130px] md:text-[180px] font-semibold tracking-tight 
                       bg-gradient-to-b from-foreground to-foreground/40 
                       bg-clip-text text-transparent"
                    >
                        404
                    </motion.h1>

                    {/* Light sweep */}
                    <motion.div
                        animate={{ x: ["-120%", "120%"] }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                        className="absolute inset-0 bg-gradient-to-r 
                       from-transparent via-white/30 to-transparent 
                       blur-xl opacity-30"
                    />
                </div>

                {/* Animated separator */}
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "140px" }}
                    transition={{ duration: 1.2, delay: 0.5 }}
                    className="mx-auto h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent"
                />

                {/* Description */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed"
                >
                    The page you’re looking for doesn’t exist.
                    Maybe it was never meant to.
                </motion.p>

                {/* CTA */}
                <Magnetic strength={40}>
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center rounded-full px-12 py-4 text-lg font-medium transition-all duration-300 bg-primary text-primary-foreground hover:shadow-[0_0_50px_rgba(124,59,237,0.6)]"
                    >
                        Return to Reality
                    </Link>
                </Magnetic>

            </motion.div>
        </section>
    )
}