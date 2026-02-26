"use client"

import { Button } from "@/components/ui/button"
import { Container } from "@/components/layout/Container"

type AboutErrorProps = {
  error: Error
  reset: () => void
}

export default function Error({ error, reset }: AboutErrorProps) {
  return (
    <section className="py-16 md:py-24 lg:py-32">
      <Container>
        <div className="mx-auto max-w-2xl rounded-2xl border border-border/60 bg-card/40 p-6 text-center sm:p-8">
          <h1 className="text-2xl font-semibold tracking-tight">About page is unavailable</h1>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            {error.message || "Something went wrong while loading this section."}
          </p>
          <Button className="mt-6" onClick={reset}>
            Try again
          </Button>
        </div>
      </Container>
    </section>
  )
}
