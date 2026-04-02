"use client"

import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"

export function AdminLogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    await fetch("/api/admin/auth/logout", {
      method: "POST",
      credentials: "same-origin",
    })
    router.replace("/admin/login")
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
    >
      <LogOut className="size-3.5" />
      Logout
    </button>
  )
}
