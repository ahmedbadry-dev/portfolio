"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/cn"
import { navLinks } from "@/data/navigation"

export function Navbar() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">

        {/* Logo */}
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight hover:opacity-80 transition"
        >
          AB.dev
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-10">
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

        {/* CTA */}
        <div className="flex items-center gap-4">
          <Button

          >
            Book a Call
          </Button>
        </div>

      </div>
    </header>
  )
}
