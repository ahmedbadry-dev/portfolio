"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { cn } from "@/lib/cn"
import { navLinks } from "@/data/navigation"
import WLogo from "@/public/logo/white-logo.png"

export function Navbar() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    if (!isMenuOpen) return
    const frameId = window.requestAnimationFrame(() => {
      setIsMenuOpen(false)
    })
    return () => window.cancelAnimationFrame(frameId)
  }, [isMenuOpen, pathname])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight transition hover:opacity-80"
        >
          <Image src={WLogo} alt="website logo" width={60} height={60} />
        </Link>

        <nav className="hidden items-center gap-10 md:flex">
          {navLinks.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(link.href))

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "group relative text-sm text-muted-foreground transition-colors duration-300",
                  "hover:text-foreground"
                )}
              >
                {link.label}
                <span
                  className={cn(
                    "absolute -bottom-2 left-0 h-0.5 w-full origin-left scale-x-0 bg-primary transition-transform duration-300",
                    "group-hover:scale-x-100",
                    isActive && "scale-x-100"
                  )}
                />
              </Link>
            )
          })}
        </nav>

        <button
          type="button"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="relative z-[60] inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border/50 bg-card/70 text-foreground transition-colors md:hidden"
        >
          <span className="sr-only">Toggle navigation menu</span>
          <span className="relative h-4 w-5">
            <span
              className={cn(
                "absolute left-0 top-0 h-0.5 w-5 origin-center rounded-full bg-current transition-[top,transform] duration-300",
                isMenuOpen && "top-[7px] rotate-45"
              )}
            />
            <span
              className={cn(
                "absolute left-0 top-[7px] h-0.5 w-5 rounded-full bg-current transition-opacity duration-300",
                isMenuOpen && "opacity-0"
              )}
            />
            <span
              className={cn(
                "absolute left-0 top-[14px] h-0.5 w-5 origin-center rounded-full bg-current transition-[top,transform] duration-300",
                isMenuOpen && "top-[7px] -rotate-45"
              )}
            />
          </span>
        </button>

        <AnimatePresence>
          {isMenuOpen ? (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm md:hidden"
                onClick={() => setIsMenuOpen(false)}
              />
              <motion.nav
                initial={{ opacity: 0, y: -12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.985 }}
                transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                className="absolute left-6 right-6 top-[5.2rem] z-50 rounded-2xl border border-border/50 bg-card/95 p-3 shadow-2xl md:hidden"
              >
                <div className="flex flex-col gap-1">
                  {navLinks.map((link) => {
                    const isActive =
                      pathname === link.href ||
                      (link.href !== "/" && pathname.startsWith(link.href))

                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsMenuOpen(false)}
                        className={cn(
                          "rounded-xl px-4 py-3 text-sm transition-colors duration-200",
                          isActive
                            ? "bg-primary/15 text-foreground"
                            : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                        )}
                      >
                        {link.label}
                      </Link>
                    )
                  })}
                </div>
              </motion.nav>
            </>
          ) : null}
        </AnimatePresence>
      </div>
    </header>
  )
}
