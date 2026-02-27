"use client"

import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = (resolvedTheme ?? "dark") === "dark"

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className="relative rounded-xl border-border/50 bg-card/70"
      aria-label={mounted ? `Switch to ${isDark ? "light" : "dark"} mode` : "Toggle theme"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {mounted && isDark ? (
        <Moon className="size-[1.1rem]" />
      ) : (
        <Sun className="size-[1.1rem]" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
