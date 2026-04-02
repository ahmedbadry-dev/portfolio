const SECTION_NAMES = ["Problem", "Solution", "Impact"] as const

export function CaseSections() {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {SECTION_NAMES.map((section) => (
        <article key={section} className="rounded-xl border border-border/60 bg-card/40 p-4">
          <h3 className="text-sm font-semibold tracking-tight">{section}</h3>
          <p className="mt-1 text-sm text-muted-foreground">Content is documented in the dedicated case-study module.</p>
        </article>
      ))}
    </div>
  )
}
