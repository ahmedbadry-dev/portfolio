import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Cpu, Layout, Lightbulb, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/layout/Container"
import { AboutDeepDiveTabs } from "@/features/about/components/AboutDeepDiveTabs"
import Reveal from "@/features/animations/motion/Reveal"
import type { AboutPageData } from "@/services/aboutService"
import me from "@/public/me/me-8.png"

type AboutViewProps = {
  data: AboutPageData
}

const BUILD_STEPS = [
  {
    icon: Lightbulb,
    step: "01",
    title: "Understand",
    desc: "Map user flows and product goals before writing a single component.",
  },
  {
    icon: Layout,
    step: "02",
    title: "Architect",
    desc: "Define rendering strategy, server/client boundaries, and data contracts.",
  },
  {
    icon: Cpu,
    step: "03",
    title: "Build",
    desc: "Implement with strict types, small reversible PRs, and testable module seams.",
  },
  {
    icon: Zap,
    step: "04",
    title: "Optimize",
    desc: "Measure hydration cost, bundle weight, and web vitals before shipping.",
  },
] as const

function PhotoFrame() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-sm md:mx-0">
      <div className="absolute inset-0 rounded-[2rem] border border-border/50 bg-linear-to-br from-background/85 via-card/90 to-muted/55 backdrop-blur-xl" />
      <div className="absolute inset-[10px] rounded-[1.6rem] border border-white/10" />
      <div className="relative h-full w-full overflow-hidden rounded-[1.7rem] p-[10px]">
        <div className="relative h-full w-full overflow-hidden rounded-[1.35rem] bg-muted/30">
          <Image
            src={me}
            alt="Ahmed Badry"
            fill
            sizes="(min-width: 768px) 33vw, 90vw"
            className="object-cover"
            priority
          />
        </div>
      </div>
    </div>
  )
}

export function AboutView({ data }: AboutViewProps) {
  const { aboutHero, architectureDives, corePillars, engineeringPhilosophy, realSystemsBuilt } = data

  return (
    <div className="py-16 md:py-24">
      <Container>
        <div className="mx-auto max-w-5xl space-y-24 md:space-y-32">
          <section className="grid items-center gap-10 md:grid-cols-[1.5fr_1fr] md:gap-12">
            <Reveal className="space-y-6" delay={0.04}>
              <div className="space-y-3">
                <p className="text-xs font-medium uppercase tracking-widest text-primary/80">
                  Frontend Engineer
                </p>
                <h1 className="text-3xl font-bold leading-[1.08] tracking-tight sm:text-4xl md:text-5xl">
                  {aboutHero.title}
                </h1>
              </div>
              <p className="max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">
                {aboutHero.description}
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link href="/work">
                    View Work <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <a href="/cv/cv.pdf" download>
                    Download Resume
                  </a>
                </Button>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <PhotoFrame />
            </Reveal>
          </section>

          <section className="space-y-8">
            <Reveal delay={0.04}>
              <div className="space-y-1">
                <h2 className="text-2xl font-semibold tracking-tight">How I Build</h2>
                <p className="text-sm text-muted-foreground">
                  A repeatable process - from ambiguity to production-ready systems.
                </p>
              </div>
            </Reveal>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {BUILD_STEPS.map((step, i) => {
                const Icon = step.icon
                return (
                  <Reveal key={step.step} delay={0.04 + i * 0.06}>
                    <div className="relative h-full space-y-3 rounded-xl border border-border/60 bg-card/40 p-5">
                      <div className="flex items-center justify-between">
                        <div className="rounded-md border border-primary/20 bg-primary/10 p-2">
                          <Icon className="size-4 text-primary" />
                        </div>
                        <span className="select-none text-3xl font-bold tabular-nums text-foreground/10">
                          {step.step}
                        </span>
                      </div>
                      <h3 className="font-semibold tracking-tight">{step.title}</h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
                    </div>
                  </Reveal>
                )
              })}
            </div>
          </section>

          <section className="space-y-8">
            <Reveal delay={0.04}>
              <h2 className="text-2xl font-semibold tracking-tight">Engineering Principles</h2>
            </Reveal>
            <div className="space-y-6">
              {engineeringPhilosophy.map((item, i) => (
                <Reveal key={item.number} delay={0.04 + i * 0.05}>
                  <div className="grid items-start gap-4 border-b border-border/40 pb-6 last:border-0 last:pb-0 md:grid-cols-[80px_1fr] md:gap-6">
                    <span className="text-5xl font-bold leading-none tracking-tight tabular-nums text-foreground/10">
                      {item.number}
                    </span>
                    <div className="space-y-1.5">
                      <h3 className="font-semibold tracking-tight">{item.title}</h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>

          <section className="space-y-8">
            <Reveal delay={0.04}>
              <h2 className="text-2xl font-semibold tracking-tight">Core Engineering Pillars</h2>
            </Reveal>
            <div className="grid gap-4 md:grid-cols-3">
              {corePillars.map((pillar, i) => (
                <Reveal key={pillar.title} delay={0.04 + i * 0.05}>
                  <div className="h-full space-y-4 rounded-xl border border-border/60 bg-card/40 p-5">
                    <h3 className="text-sm font-semibold tracking-tight">{pillar.title}</h3>
                    <ul className="space-y-2">
                      {pillar.points.map((point) => (
                        <li key={point} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary/60" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>

          <section className="space-y-8">
            <Reveal delay={0.04}>
              <div className="space-y-1">
                <h2 className="text-2xl font-semibold tracking-tight">Architecture Deep Dive</h2>
                <p className="text-sm text-muted-foreground">
                  Real decisions across rendering strategy, boundaries, and maintainability.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.09}>
              <AboutDeepDiveTabs items={architectureDives} />
            </Reveal>
          </section>

          <section className="space-y-8">
            <Reveal delay={0.04}>
              <h2 className="text-2xl font-semibold tracking-tight">Real Systems Built</h2>
            </Reveal>
            <div className="grid gap-4 md:grid-cols-3">
              {realSystemsBuilt.map((system, i) => (
                <Reveal key={system.title} delay={0.04 + i * 0.05}>
                  <div className="h-full space-y-2 rounded-xl border border-border/60 bg-card/40 p-5">
                    <h3 className="text-[15px] font-semibold tracking-tight">{system.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{system.summary}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>

          <Reveal delay={0.04}>
            <section className="space-y-5 rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center md:p-12">
              <p className="mx-auto max-w-xl text-lg font-medium tracking-tight md:text-xl">
                If you&apos;re building a serious product and value structure over surface - let&apos;s
                collaborate.
              </p>
              <Button asChild size="lg">
                <Link href="/contact">Start a Conversation</Link>
              </Button>
            </section>
          </Reveal>
        </div>
      </Container>
    </div>
  )
}
