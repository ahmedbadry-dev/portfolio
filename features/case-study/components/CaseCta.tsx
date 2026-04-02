import Link from "next/link"

export function CaseCta() {
  return (
    <section className="rounded-2xl border border-primary/20 bg-primary/5 p-6 text-center md:p-8">
      <p className="mx-auto max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
        Need similar architecture guidance for your product? Let&apos;s discuss constraints and delivery.
      </p>
      <div className="mt-4">
        <Link
          href="/contact"
          className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Start a Conversation
        </Link>
      </div>
    </section>
  )
}
