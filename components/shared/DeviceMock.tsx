import { cn } from "@/lib/cn"

interface DeviceMockProps {
  className?: string
}

export default function DeviceMock({ className }: DeviceMockProps) {
  return (
    <div
      className={cn(
        "relative mx-auto w-full max-w-[520px]",
        className
      )}
    >
      {/* Mac Top Bar */}
      <div className="rounded-t-2xl bg-border/40 px-4 py-3 flex items-center gap-2">
        <span className="h-3 w-3 rounded-full bg-red-500/70" />
        <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
        <span className="h-3 w-3 rounded-full bg-green-500/70" />
      </div>

      {/* Screen */}
      <div className="relative aspect-[16/10] rounded-b-2xl border border-border/50 bg-muted/30 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
      </div>

      {/* Base */}
      <div className="mx-auto mt-3 h-2 w-2/3 rounded-full bg-border/50 blur-sm" />
    </div>
  )
}
