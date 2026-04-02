"use client"

import { Button } from "@/components/ui/button"
import type { AdminSubmission } from "@/features/admin/types"

type SubmissionsTableProps = {
  submissions: AdminSubmission[]
  onMarkRead: (id: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
  isUpdating: boolean
}

function formatDate(timestamp: number): string {
  const date = new Date(timestamp)
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function SubmissionsTable({
  submissions,
  onMarkRead,
  onDelete,
  isUpdating,
}: SubmissionsTableProps) {
  if (submissions.length === 0) {
    return (
      <div className="rounded-xl border border-border/60 bg-card/40 p-8 text-center text-sm text-muted-foreground">
        No contact submissions yet.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {submissions.map((submission) => (
        <div
          key={submission._id}
          className={[
            "space-y-2 rounded-xl border p-4 transition-colors",
            submission.read ? "border-border/40 bg-card/20" : "border-primary/20 bg-primary/5",
          ].join(" ")}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{submission.name}</span>
                {!submission.read && (
                  <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-primary">
                    New
                  </span>
                )}
              </div>
              <span className="text-xs text-muted-foreground">{submission.email}</span>
            </div>
            <span className="shrink-0 text-xs text-muted-foreground">
              {formatDate(submission.createdAt)}
            </span>
          </div>

          <p className="text-sm leading-relaxed text-muted-foreground">{submission.message}</p>

          <div className="flex gap-2 pt-1">
            {!submission.read && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onMarkRead(submission._id)}
                disabled={isUpdating}
              >
                Mark read
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              className="border-destructive/30 text-destructive hover:bg-destructive/10"
              onClick={() => onDelete(submission._id)}
              disabled={isUpdating}
            >
              Delete
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
