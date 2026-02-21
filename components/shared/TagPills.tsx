import { cn } from "@/lib/cn"

type TagPillsProps = {
  tags: string[]
  className?: string
  tagClassName?: string
}

export function TagPills({ tags, className, tagClassName }: TagPillsProps) {
  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      {tags.map((tag) => (
        <span
          key={tag}
          className={cn(
            "rounded-full border border-border/50 px-4 py-1 text-sm text-muted-foreground",
            tagClassName
          )}
        >
          {tag}
        </span>
      ))}
    </div>
  )
}
