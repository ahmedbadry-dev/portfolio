import { cn } from "@/lib/cn"

type HeadingProps = {
  title: string
  subtitle?: string
  className?: string
  subtitleClassName?: string
}

export function Heading({
  title,
  subtitle,
  className,
  subtitleClassName,
}: HeadingProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <h2 className="text-4xl font-medium tracking-tight">{title}</h2>
      {subtitle ? (
        <p className={cn("text-muted-foreground leading-relaxed", subtitleClassName)}>
          {subtitle}
        </p>
      ) : null}
    </div>
  )
}

