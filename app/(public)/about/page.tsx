import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Container } from "@/components/layout/Container"
import {
  aboutHero,
  architectureDives,
  corePillars,
  disciplineNarrative,
  engineeringPhilosophy,
  realSystemsBuilt,
} from "@/data/about"
import { AboutDeepDiveTabs } from "@/features/about/components/AboutDeepDiveTabs"

export default function AboutPage() {
  return (
    <div className="py-32">
      <Container>
        <div className="mx-auto max-w-[900px] space-y-32">
          <section className="space-y-8 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-1 motion-safe:duration-300">
            <div className="max-w-3xl space-y-5">
              <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
                {aboutHero.title}
              </h1>
              <p className="text-lg leading-relaxed text-muted-foreground">
                {aboutHero.description}
              </p>
            </div>

            <div className="h-px w-full bg-border" />

            <div className="flex flex-wrap items-center gap-3">
              <Button asChild>
                <Link href="/work">View Work</Link>
              </Button>
              <Button asChild variant="outline">
                <a href="/resume.pdf" target="_blank" rel="noreferrer">
                  Download Resume
                </a>
              </Button>
            </div>
          </section>

          <section className="space-y-12">
            <h2 className="text-2xl font-semibold tracking-tight">
              Engineering Philosophy
            </h2>
            <div className="space-y-10">
              {engineeringPhilosophy.map((item) => (
                <article
                  key={item.number}
                  className="grid gap-4 border-b border-border pb-8 md:grid-cols-[100px_1fr] motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-1 motion-safe:duration-300"
                >
                  <p className="text-4xl font-semibold text-foreground/20">
                    {item.number}
                  </p>
                  <div className="space-y-2">
                    <h3 className="text-xl font-medium tracking-tight">
                      {item.title}
                    </h3>
                    <p className="leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </Container>

      <section className="py-32">
        <Container>
          <div className="mx-auto max-w-[1200px] space-y-10">
            <h2 className="text-2xl font-semibold tracking-tight">
              Core Engineering Pillars
            </h2>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {corePillars.map((pillar) => (
                <Card key={pillar.title} className="border-border/90 bg-card/50 shadow-none">
                  <CardHeader>
                    <CardTitle>{pillar.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {pillar.points.map((point) => (
                        <li key={point}>- {point}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <Container>
        <div className="mx-auto max-w-[900px] space-y-32">
          <section className="space-y-8">
            <h2 className="text-2xl font-semibold tracking-tight">
              Architecture Deep Dive
            </h2>
            <AboutDeepDiveTabs items={architectureDives} />
          </section>

          <section className="space-y-8">
            <h2 className="text-2xl font-semibold tracking-tight">
              Real Systems Built
            </h2>
            <div className="divide-y divide-border border-y border-border">
              {realSystemsBuilt.map((system) => (
                <article key={system.title} className="py-5">
                  <h3 className="text-base font-medium">{system.title}</h3>
                  <p className="mt-1 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                    {system.summary}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section className="space-y-5">
            <h2 className="text-2xl font-semibold tracking-tight">
              Discipline & Mindset
            </h2>
            <p className="max-w-[680px] leading-relaxed text-muted-foreground">
              {disciplineNarrative}
            </p>
          </section>

          <section className="pt-8 text-center">
            <p className="mx-auto max-w-2xl text-xl font-medium leading-relaxed tracking-tight md:text-2xl">
              If you&apos;re building a serious product and value structure over
              surface - let&apos;s collaborate.
            </p>
            <div className="mt-8">
              <Button asChild size="lg">
                <Link href="/contact">Start a Conversation</Link>
              </Button>
            </div>
          </section>
        </div>
      </Container>
    </div>
  )
}

