import { cn } from "@/lib/cn"

interface GlassProps {
    children: React.ReactNode
    className?: string
}

export function Glass({ children, className }: GlassProps) {
    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-3xl",
                "bg-white/4",
                "backdrop-blur-2xl",
                "border border-white/15",
                "shadow-[0_10px_40px_rgba(0,0,0,0.4)]",
                className
            )}
        >
            {/* Inner Light Gradient */}
            <div className="pointer-events-none absolute inset-0 rounded-2xl bg-linear-to-br from-white/10 via-transparent to-transparent opacity-60" />

            {children}
        </div>
    )
}
