import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Container } from "@/components/layout/Container"
import { AboutDeepDiveTabs } from "@/features/about/components/AboutDeepDiveTabs"
import Reveal from "@/features/animations/motion/Reveal"
import type { AboutPageData } from "@/services/aboutService"
import me from '@/public/me/me-8.png'

type AboutViewProps = {
  data: AboutPageData
}

function AboutPhotoFrame() {
  return (
    <div className="relative aspect-square w-full">
      <div className="absolute inset-0 rounded-[2rem] border border-border/50 bg-linear-to-br from-background/85 via-card/90 to-muted/55 shadow-[0_20px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:shadow-[0_24px_80px_rgba(0,0,0,0.38)]" />
      <div className="absolute inset-[10px] rounded-[1.6rem] border border-white/35 bg-background/18 dark:border-white/10 dark:bg-white/4" />
      <div className="relative h-full w-full overflow-hidden rounded-[1.7rem] p-[10px]">
        <div className="relative h-full w-full overflow-hidden rounded-[1.35rem] bg-muted/30">
          <Image
            src={me}
            alt="Portrait photo"
            width={480}
            height={480}
            sizes="(min-width: 768px) 33vw, 100vw"
            className="h-full w-full object-cover"
            priority
          />
        </div>
      </div>
    </div>
  )
}

export function AboutView({ data }: AboutViewProps) {
  const {
    aboutHero,
    architectureDives,
    corePillars,
    engineeringPhilosophy,
    realSystemsBuilt,
  } = data

  return (
    <div className="py-16 md:py-24 lg:py-32">
      <Container className="relative">
        <div className="relative mx-auto max-w-5xl space-y-16 md:space-y-24 lg:space-y-32">
          <section id="hero" className="relative isolate space-y-6 md:space-y-8">
            <div className="grid items-center gap-8 md:grid-cols-[1.5fr_1fr] md:gap-10">
              <Reveal className="order-2 space-y-5 md:order-1" delay={0.04}>
                <h1 className="max-w-3xl text-3xl font-medium tracking-tight sm:text-4xl md:text-5xl md:leading-[1.05]">
                  {aboutHero.title}
                </h1>
                <div className="h-px w-14 bg-border" />
                <p className="max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
                  {aboutHero.description}
                </p>
                <div className="grid grid-cols-1 gap-3 pt-1 sm:flex sm:flex-wrap sm:items-center">
                  <Button asChild className="w-full sm:w-auto">
                    <Link href="/work">View Work</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full sm:w-auto">
                    <a
                      href="/cv/cv.pdf"
                      download="cv.pdf"
                    >
                      Download Resume
                    </a>
                  </Button>
                </div>
              </Reveal>

              <Reveal className="order-1 md:order-2" delay={0.1}>
                <AboutPhotoFrame />
              </Reveal>
            </div>

            <div className="h-px w-full bg-border" />
          </section>

          <section id="philosophy" className="space-y-8 md:space-y-12">
            <Reveal>
              <h2 className="text-2xl font-semibold tracking-tight">
                Engineering Philosophy
              </h2>
            </Reveal>
            <div className="space-y-8 md:space-y-12">
              {engineeringPhilosophy.map((item, index) => (
                <Reveal key={item.number} delay={index * 0.05}>
                  <article className="grid gap-4 pb-8 md:grid-cols-[120px_1fr] md:gap-5 md:pb-10">
                    <p className="text-4xl font-semibold tracking-tight text-foreground/15 md:text-5xl">
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
                </Reveal>
              ))}
            </div>
          </section>
        </div>
      </Container>

      <section id="pillars" className="py-16 md:py-24 lg:py-32">
        <Container>
          <div className="mx-auto max-w-[1200px] space-y-10">
            <Reveal>
              <h2 className="text-2xl font-semibold tracking-tight">
                Core Engineering Pillars
              </h2>
            </Reveal>

            <div className="grid gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
              {corePillars.map((pillar, index) => (
                <Reveal key={pillar.title} delay={index * 0.05}>
                  <Card className="border-border/90 bg-card/50 shadow-none">
                    <CardHeader>
                      <CardTitle>{pillar.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        {pillar.points.map((point) => (
                          <li key={point} className="flex items-start gap-2">
                            <span className="mt-2 h-1 w-1 rounded-full bg-muted-foreground/65" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </Reveal>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <Container>
        <div className="mx-auto max-w-[900px] space-y-16 md:space-y-24 lg:space-y-32">
          <section id="deep-dive" className="space-y-8">
            <Reveal>
              <h2 className="text-2xl font-semibold tracking-tight">
                Architecture Deep Dive
              </h2>
            </Reveal>
            <Reveal delay={0.05}>
              <p className="max-w-2xl leading-relaxed text-muted-foreground">
                Representative architecture decisions across systems where
                rendering strategy, boundaries, and maintainability were primary
                constraints.
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <AboutDeepDiveTabs items={architectureDives} />
            </Reveal>
          </section>

          <section id="systems" className="space-y-8">
            <Reveal>
              <h2 className="text-2xl font-semibold tracking-tight">
                Real Systems Built
              </h2>
            </Reveal>
            <div className="divide-y divide-border border-y border-border">
              {realSystemsBuilt.map((system, index) => (
                <Reveal key={system.title} delay={index * 0.05}>
                  <article className="py-5">
                    <h3 className="text-[15px] font-semibold tracking-tight">
                      {system.title}
                    </h3>
                    <p className="mt-1 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                      {system.summary}
                    </p>
                  </article>
                </Reveal>
              ))}
            </div>
          </section>

          <section id="cta" className="pt-4 text-center md:pt-8">
            <Reveal>
              <p className="mx-auto max-w-2xl text-lg font-medium leading-relaxed tracking-tight md:text-2xl">
                If you&apos;re building a serious product and value structure over
                surface - let&apos;s collaborate.
              </p>
            </Reveal>
            <Reveal delay={0.06}>
              <div className="mt-8">
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <Link href="/contact">Start a Conversation</Link>
                </Button>
              </div>
            </Reveal>
          </section>
        </div>
      </Container>
    </div>
  )
}


