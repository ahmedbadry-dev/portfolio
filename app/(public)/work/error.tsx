"use client"

import { Button } from "@/components/ui/button"
import { Container } from "@/components/layout/Container"

type WorkErrorProps = {
  error: Error
  reset: () => void
}

export default function Error({ error, reset }: WorkErrorProps) {
  return (
    <section className="pb-20 pt-10 md:pb-32 md:pt-14">
      <Container>
        <div className="mx-auto max-w-2xl rounded-2xl border border-border/60 bg-card/40 p-6 text-center sm:p-8">
          <h1 className="text-2xl font-semibold tracking-tight">Work page failed to load</h1>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            {error.message || "Something went wrong while loading projects."}
          </p>
          <Button className="mt-6" onClick={reset}>
            Retry
          </Button>
        </div>
      </Container>
    </section>
  )
}
