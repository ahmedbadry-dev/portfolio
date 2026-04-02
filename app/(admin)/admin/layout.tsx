import type { ReactNode } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  BarChart3,
  FolderOpen,
  LayoutDashboard,
  Mail,
} from "lucide-react"
import { AdminLogoutButton } from "@/features/admin/components/AdminLogoutButton"

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin?tab=submissions", label: "Submissions", icon: Mail },
  { href: "/admin?tab=projects", label: "Projects", icon: FolderOpen },
  { href: "/admin?tab=analytics", label: "Analytics", icon: BarChart3 },
] as const

type AdminLayoutProps = {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 border-b border-border/60 bg-card/40 backdrop-blur-sm">
        <div className="mx-auto flex min-h-14 max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-2 sm:px-6">
          <div className="flex items-center gap-4 sm:gap-6">
            <span className="text-sm font-semibold tracking-tight">AB.dev Admin</span>
            <nav className="flex flex-wrap items-center gap-1">
              {NAV.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
                  >
                    <Icon className="size-3.5" />
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-3.5" />
              Back to site
            </Link>
            <AdminLogoutButton />
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  )
}
