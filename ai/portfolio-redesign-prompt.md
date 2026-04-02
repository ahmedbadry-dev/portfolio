# Portfolio Redesign — Full Codex Execution Prompt

> **Stack:** Next.js 16 App Router · React 19 · TypeScript · Tailwind CSS v4 · Framer Motion · shadcn/ui  
> **Target pages:** `features/case-study/` and `features/about/`  
> **Homepage:** Do NOT redesign — minor consistency tweaks only  

---

## Context: What exists right now

### Project architecture (do not change)
```
app/
  (public)/
    page.tsx               → HomeContainer → HomeView
    about/page.tsx         → AboutContainer → AboutView
    work/page.tsx          → WorkContainer → WorkView
    contact/page.tsx       → ContactContainer → ContactView
    projects/[slug]/page.tsx → CaseStudyContainer → CaseStudyView
features/
  home/
  about/
    AboutView.tsx          ← REDESIGN TARGET
    components/
      AboutDeepDiveTabs.tsx
  case-study/
    CaseStudyView.tsx      ← REDESIGN TARGET (HIGHEST PRIORITY)
    components/
      CaseStudyHero.tsx
      CaseStudySectionCard.tsx
      ArchitectureVisual.tsx
      CaseImageCarousel.tsx
      StickyProgressNav.tsx
      CaseCta.tsx
  animations/
    motion/Reveal.tsx
    motion/Stagger.tsx
components/
  layout/
    GlobalBackground.tsx   ← UPDATE
    Container.tsx
    Navbar.tsx
    Footer.tsx
  shared/
    MetricBadge.tsx
    TagPills.tsx
    BitsLogoLoop.tsx
  ui/
    button.tsx
    card.tsx
data/
  projects.ts              ← ProjectRecord type (do not change)
  about.ts                 ← about data (do not change)
services/
  caseStudyService.ts      ← CaseStudyPageData type (do not change)
  aboutService.ts
```

### Current problems to fix
1. **CaseStudyView** feels like long documentation — dense cards stacked vertically, no visual hierarchy
2. **AboutView** feels like a numbered list + bullet grid — no real story flow
3. **GlobalBackground** is flat/particles-based — needs premium layered gradient treatment

### Reference design (from the provided screenshot)
The target layout for the Case Study page looks like:
- **Hero zone** at top: large project title left, screenshot mockup right, 3 metric badges (120ms TTFB / -40% Load Time / Scalable SSR), primary CTA button
- **Quick Summary** section: 3 horizontal cards labeled "The Problem", "The Solution", "The Impact" — each with 3 bullet points
- **Building the Solution** section: tabbed (Frontend / Backend / Data), with a large screenshot left and tech stack items listed right with icons
- **Technical Architecture** section: tabbed cards (Structure First / Performance / Intentional UX), each with 2-3 bullet points
- **Real Systems Built** section: 3 project cards side by side (Habit Tracker / Medical Platform / Portfolio), each with subtitle + metric tag
- **Final CTA**: centered headline + purple button "Let's Work Together"

---

## PHASE 1 — Premium Background System

### File to update: `components/layout/GlobalBackground.tsx`

Replace the current implementation with a pure CSS layered gradient system.  
**No particles, no animated canvas, no heavy SVG animations.**

```tsx
// components/layout/GlobalBackground.tsx
// Server Component — no "use client" needed

export function GlobalBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Dark base */}
      <div className="absolute inset-0 bg-background" />

      {/* Top-right radial purple glow */}
      <div
        className="absolute -right-[20%] -top-[15%] h-[600px] w-[600px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, oklch(0.35 0.18 292 / 0.18) 0%, transparent 70%)",
        }}
      />

      {/* Center-left mid-page glow */}
      <div
        className="absolute -left-[10%] top-[35%] h-[500px] w-[500px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, oklch(0.30 0.15 292 / 0.12) 0%, transparent 70%)",
        }}
      />

      {/* Bottom-center soft glow */}
      <div
        className="absolute bottom-0 left-1/2 h-[400px] w-[800px] -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(ellipse, oklch(0.28 0.14 292 / 0.10) 0%, transparent 65%)",
        }}
      />

      {/* Subtle noise texture overlay — create /public/noise.png if it doesn't exist */}
      <div
        className="absolute inset-0 opacity-[0.028] mix-blend-overlay"
        style={{ backgroundImage: "url('/noise.png')" }}
      />

      {/* Very subtle vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 60%, oklch(0.10 0.01 262 / 0.35) 100%)",
        }}
      />
    </div>
  )
}
```

**Also create a reusable page-level background for the About and Case Study pages:**

```tsx
// components/layout/PageBackground.tsx
// Use this wrapper in AboutView and CaseStudyView only
// It adds a localized glow that reinforces the premium feel without touching the homepage

export function PageBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      {/* Page-scoped top glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[400px]"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -5%, oklch(0.38 0.20 292 / 0.14) 0%, transparent 70%)",
        }}
      />
      {children}
    </div>
  )
}
```

---

## PHASE 2 — Redesign `CaseStudyView.tsx` (HIGHEST PRIORITY)

### File: `features/case-study/CaseStudyView.tsx`

**Completely replace the current layout** with the following structure.  
Keep all existing imports that are still used. Remove the StickyProgressNav (it causes UX friction on mobile and adds complexity without matching the new design).  
Keep `CaseImageCarousel`, `Reveal`, `Container`, `Button`, `MDXRemote`, `mdxComponents`.

#### New page structure:

```
1. Hero Section          ← title + short desc + 3 metric badges + CTA buttons + screenshot
2. Quick Summary         ← 3 cards: Problem / Solution / Impact
3. Building the Solution ← tabbed: screenshots + tech highlights  
4. Technical Architecture ← tabbed cards: Frontend / Data / Backend / Performance / Security
5. Challenges & Learnings ← compact: challenge → decision → result
6. Outcome               ← short outcome paragraph or MDX
7. Final CTA             ← centered headline + button
```

#### Implementation:

```tsx
// features/case-study/CaseStudyView.tsx
"use client"

import Link from "next/link"
import { Suspense, useState } from "react"
import {
  AlertTriangle,
  BookOpen,
  Boxes,
  Database,
  ExternalLink,
  Gauge,
  Github,
  Layers,
  Rocket,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react"
import { MDXRemote } from "next-mdx-remote/rsc"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/layout/Container"
import { PageBackground } from "@/components/layout/PageBackground"
import { mdxComponents } from "@/features/case-study/mdx/components"
import { CaseImageCarousel } from "@/features/case-study/components/CaseImageCarousel"
import { MetricBadge } from "@/components/shared/MetricBadge"
import { TagPills } from "@/components/shared/TagPills"
import { BitsLogoLoop } from "@/components/shared/BitsLogoLoop"
import Reveal from "@/features/animations/motion/Reveal"
import { cn } from "@/lib/cn"
import type { CaseStudyPageData } from "@/services/caseStudyService"

type CaseStudyViewProps = CaseStudyPageData

// ─── Quick Summary Cards ───────────────────────────────────────────────────

function QuickSummaryCards({ project }: { project: CaseStudyViewProps["project"] }) {
  const cards = [
    {
      icon: AlertTriangle,
      label: "The Problem",
      color: "text-amber-400",
      bg: "bg-amber-400/8",
      border: "border-amber-400/20",
      points: project.details.complexity,
    },
    {
      icon: Rocket,
      label: "The Solution",
      color: "text-primary",
      bg: "bg-primary/8",
      border: "border-primary/20",
      points: project.details.highlights,
    },
    {
      icon: Sparkles,
      label: "The Impact",
      color: "text-emerald-400",
      bg: "bg-emerald-400/8",
      border: "border-emerald-400/20",
      points: project.details.lessons,
    },
  ]

  return (
    <section className="space-y-6">
      <Reveal>
        <h2 className="text-2xl font-semibold tracking-tight">Quick Summary</h2>
      </Reveal>
      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((card, i) => {
          const Icon = card.icon
          return (
            <Reveal key={card.label} delay={i * 0.06}>
              <div
                className={cn(
                  "rounded-xl border p-5 space-y-3",
                  card.bg,
                  card.border
                )}
              >
                <div className={cn("flex items-center gap-2 font-medium", card.color)}>
                  <Icon className="size-4" />
                  <span className="text-sm">{card.label}</span>
                </div>
                <ul className="space-y-2">
                  {card.points.slice(0, 3).map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-current opacity-50" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}

// ─── Architecture Tabs ─────────────────────────────────────────────────────

const ARCH_TABS = [
  { id: "frontend", label: "Frontend", icon: Layers },
  { id: "data", label: "Data / Reactivity", icon: Database },
  { id: "domain", label: "Backend / Domain", icon: Boxes },
  { id: "performance", label: "Performance", icon: Gauge },
  { id: "security", label: "Auth / Security", icon: ShieldCheck },
]

function ArchTabs({ project }: { project: CaseStudyViewProps["project"] }) {
  const [active, setActive] = useState("frontend")

  const contentMap: Record<string, { subtitle: string; points: string[] }> = {
    frontend: {
      subtitle: "Rendering & component strategy",
      points: [project.details.architecture.rendering, ...project.details.highlights.slice(0, 2)],
    },
    data: {
      subtitle: "Data layer & state management",
      points: [project.details.architecture.data, ...project.details.complexity.slice(0, 1)],
    },
    domain: {
      subtitle: "Domain model & business logic",
      points: [project.details.architecture.domain],
    },
    performance: {
      subtitle: "Runtime discipline & measured decisions",
      points: [project.details.architecture.performance],
    },
    security: {
      subtitle: "Trust boundaries & input validation",
      points: project.details.security,
    },
  }

  const current = contentMap[active]

  return (
    <div className="space-y-4">
      {/* Tab bar */}
      <div className="flex flex-wrap gap-2 border-b border-border pb-3">
        {ARCH_TABS.map((tab) => {
          const Icon = tab.icon
          const isActive = tab.id === active
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActive(tab.id)}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors",
                isActive
                  ? "bg-primary/15 text-primary border border-primary/25"
                  : "text-muted-foreground hover:text-foreground border border-transparent"
              )}
            >
              <Icon className="size-3.5" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Active panel */}
      <div className="rounded-xl border border-border/60 bg-card/40 p-5 space-y-3">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">
          {current.subtitle}
        </p>
        <ul className="space-y-2">
          {current.points.map((point) => (
            <li key={point} className="flex items-start gap-2 text-sm text-foreground/80">
              <Zap className="mt-0.5 size-3.5 shrink-0 text-primary/70" />
              {point}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

// ─── Main View ─────────────────────────────────────────────────────────────

export function CaseStudyView({ project, sections }: CaseStudyViewProps) {
  const liveDemoUrl = project.links.liveDemo.trim()
  const githubUrl = project.links.gitHub.trim()

  return (
    <PageBackground>
      <article className="py-14 md:py-20 lg:py-24">
        <Container className="space-y-20 md:space-y-28">

          {/* ── 1. Hero ─────────────────────────────────────────────────── */}
          <section className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16 lg:items-center">
            {/* Left: title + metrics + actions */}
            <div className="space-y-6">
              <Reveal>
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-widest text-primary/80 font-medium">
                    Case Study
                  </p>
                  <h1 className="text-4xl font-bold tracking-tight sm:text-5xl leading-[1.08]">
                    {project.meta.title}
                  </h1>
                </div>
              </Reveal>

              <Reveal delay={0.05}>
                <p className="text-base leading-relaxed text-muted-foreground max-w-md">
                  {project.shortDescription}
                </p>
              </Reveal>

              <Reveal delay={0.08}>
                <div className="flex flex-wrap gap-2">
                  {typeof project.metrics?.ttfb === "number" && (
                    <MetricBadge label="TTFB" value={`${project.metrics.ttfb}ms`} />
                  )}
                  {typeof project.metrics?.lighthouse === "number" && (
                    <MetricBadge label="Lighthouse" value={project.metrics.lighthouse} />
                  )}
                  {typeof project.imageCount === "number" && (
                    <MetricBadge label="Screens" value={project.imageCount} />
                  )}
                  <span className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-card/40 px-3 py-1.5 text-sm">
                    <Layers className="size-3.5 text-muted-foreground" />
                    <span className="text-muted-foreground">SSR Architecture</span>
                  </span>
                </div>
              </Reveal>

              <Reveal delay={0.1}>
                <TagPills tags={project.meta.tags} />
              </Reveal>

              <Reveal delay={0.12}>
                <div className="flex flex-wrap gap-3">
                  <Button asChild size="lg">
                    <a href={liveDemoUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="size-4" />
                      Visit Live Demo
                    </a>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <a href={githubUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="size-4" />
                      GitHub
                    </a>
                  </Button>
                </div>
              </Reveal>

              <Reveal delay={0.14}>
                <BitsLogoLoop stack={project.meta.stack} />
              </Reveal>
            </div>

            {/* Right: screenshot carousel */}
            <Reveal delay={0.06}>
              <Suspense
                fallback={
                  <div className="aspect-[16/10] w-full rounded-2xl bg-muted/30 animate-pulse" />
                }
              >
                <CaseImageCarousel
                  title={project.meta.title}
                  screenshots={project.screenshots}
                />
              </Suspense>
            </Reveal>
          </section>

          {/* ── 2. Quick Summary ────────────────────────────────────────── */}
          <QuickSummaryCards project={project} />

          {/* ── 3. Technical Architecture ───────────────────────────────── */}
          <section className="space-y-6">
            <Reveal>
              <div className="space-y-1">
                <h2 className="text-2xl font-semibold tracking-tight">
                  Technical Architecture
                </h2>
                <p className="text-sm text-muted-foreground">
                  System boundaries and layered decisions across rendering, data, and performance.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <ArchTabs project={project} />
            </Reveal>
          </section>

          {/* ── 4. Deep MDX Sections (Problem / Approach / Architecture) ── */}
          {(sections.problem?.source || sections.approach?.source || sections.architecture?.source) && (
            <section className="space-y-8">
              <Reveal>
                <h2 className="text-2xl font-semibold tracking-tight">Building the Solution</h2>
              </Reveal>

              <div className="space-y-6">
                {sections.problem?.source && (
                  <Reveal delay={0.04}>
                    <div className="rounded-xl border border-amber-400/15 bg-amber-400/5 p-6 space-y-3">
                      <div className="flex items-center gap-2 text-amber-400">
                        <AlertTriangle className="size-4" />
                        <span className="text-sm font-medium uppercase tracking-wider">Problem</span>
                      </div>
                      <div className="prose prose-sm prose-invert max-w-none">
                        <MDXRemote source={sections.problem.source} components={mdxComponents} />
                      </div>
                    </div>
                  </Reveal>
                )}

                {sections.approach?.source && (
                  <Reveal delay={0.07}>
                    <div className="rounded-xl border border-primary/15 bg-primary/5 p-6 space-y-3">
                      <div className="flex items-center gap-2 text-primary">
                        <Rocket className="size-4" />
                        <span className="text-sm font-medium uppercase tracking-wider">Approach</span>
                      </div>
                      <div className="prose prose-sm prose-invert max-w-none">
                        <MDXRemote source={sections.approach.source} components={mdxComponents} />
                      </div>
                    </div>
                  </Reveal>
                )}

                {sections.architecture?.source && (
                  <Reveal delay={0.10}>
                    <div className="rounded-xl border border-border/60 bg-card/30 p-6 space-y-3">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Boxes className="size-4" />
                        <span className="text-sm font-medium uppercase tracking-wider">Architecture Detail</span>
                      </div>
                      <div className="prose prose-sm prose-invert max-w-none">
                        <MDXRemote source={sections.architecture.source} components={mdxComponents} />
                      </div>
                    </div>
                  </Reveal>
                )}
              </div>
            </section>
          )}

          {/* ── 5. Performance & Security ───────────────────────────────── */}
          {(sections.performance?.source || sections.security?.source) && (
            <section className="space-y-6">
              <Reveal>
                <h2 className="text-2xl font-semibold tracking-tight">
                  Performance & Security
                </h2>
              </Reveal>
              <div className="grid gap-4 md:grid-cols-2">
                {sections.performance?.source && (
                  <Reveal delay={0.04}>
                    <div className="rounded-xl border border-border/60 bg-card/30 p-5 h-full space-y-3">
                      <div className="flex items-center gap-2 text-emerald-400">
                        <Gauge className="size-4" />
                        <span className="text-sm font-medium">Performance</span>
                      </div>
                      <div className="prose prose-sm prose-invert max-w-none">
                        <MDXRemote source={sections.performance.source} components={mdxComponents} />
                      </div>
                    </div>
                  </Reveal>
                )}
                {sections.security?.source && (
                  <Reveal delay={0.07}>
                    <div className="rounded-xl border border-border/60 bg-card/30 p-5 h-full space-y-3">
                      <div className="flex items-center gap-2 text-blue-400">
                        <ShieldCheck className="size-4" />
                        <span className="text-sm font-medium">Security</span>
                      </div>
                      <div className="prose prose-sm prose-invert max-w-none">
                        <MDXRemote source={sections.security.source} components={mdxComponents} />
                      </div>
                    </div>
                  </Reveal>
                )}
              </div>
            </section>
          )}

          {/* ── 6. Key Learnings ────────────────────────────────────────── */}
          {sections.lessons?.source && (
            <section className="space-y-6">
              <Reveal>
                <h2 className="text-2xl font-semibold tracking-tight">Key Learnings</h2>
              </Reveal>
              <Reveal delay={0.04}>
                <div className="rounded-xl border border-border/60 bg-card/30 p-6">
                  <div className="flex items-center gap-2 text-muted-foreground mb-4">
                    <BookOpen className="size-4" />
                    <span className="text-sm font-medium uppercase tracking-wider">Lessons</span>
                  </div>
                  <div className="prose prose-sm prose-invert max-w-none">
                    <MDXRemote source={sections.lessons.source} components={mdxComponents} />
                  </div>
                </div>
              </Reveal>
            </section>
          )}

          {/* ── 7. Outcome ──────────────────────────────────────────────── */}
          {sections.outcome?.source && (
            <section className="space-y-6">
              <Reveal>
                <h2 className="text-2xl font-semibold tracking-tight">Outcome</h2>
              </Reveal>
              <Reveal delay={0.04}>
                <div className="rounded-xl border border-emerald-400/15 bg-emerald-400/5 p-6">
                  <div className="flex items-center gap-2 text-emerald-400 mb-4">
                    <Sparkles className="size-4" />
                    <span className="text-sm font-medium uppercase tracking-wider">Results</span>
                  </div>
                  <div className="prose prose-sm prose-invert max-w-none">
                    <MDXRemote source={sections.outcome.source} components={mdxComponents} />
                  </div>
                </div>
              </Reveal>
            </section>
          )}

          {/* ── 8. Final CTA ────────────────────────────────────────────── */}
          <Reveal delay={0.04}>
            <section className="rounded-2xl border border-primary/20 bg-primary/5 p-8 md:p-12 text-center space-y-5">
              <p className="text-lg font-medium md:text-xl tracking-tight max-w-xl mx-auto">
                Want to build scalable systems like this?
              </p>
              <Button asChild size="lg">
                <Link href="/contact">Let&apos;s Work Together</Link>
              </Button>
            </section>
          </Reveal>

        </Container>
      </article>
    </PageBackground>
  )
}
```

---

## PHASE 3 — Redesign `AboutView.tsx`

### File: `features/about/AboutView.tsx`

Replace the current implementation with a new layout that follows this structure:

```
1. Hero            ← title + short desc + buttons + photo
2. How I Build     ← 4 compact steps: Understand → Architect → Build → Optimize
3. Core Principles ← 3 clean cards (existing corePillars data)
4. Architecture Deep Dive ← keep AboutDeepDiveTabs (already good)
5. Real Systems Built ← upgrade from list to 3 cards
6. CTA             ← stronger closing
```

```tsx
// features/about/AboutView.tsx
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Cpu, Layout, Lightbulb, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/layout/Container"
import { PageBackground } from "@/components/layout/PageBackground"
import { AboutDeepDiveTabs } from "@/features/about/components/AboutDeepDiveTabs"
import Reveal from "@/features/animations/motion/Reveal"
import type { AboutPageData } from "@/services/aboutService"
import me from "@/public/me/me-8.png"

type AboutViewProps = {
  data: AboutPageData
}

// Build process steps — static, not from data
const BUILD_STEPS = [
  {
    icon: Lightbulb,
    step: "01",
    title: "Understand",
    desc: "Map user flows and business goals before touching code.",
  },
  {
    icon: Layout,
    step: "02",
    title: "Architect",
    desc: "Define rendering strategy, boundaries, and data shape.",
  },
  {
    icon: Cpu,
    step: "03",
    title: "Build",
    desc: "Implement with strict types, small PRs, and testable seams.",
  },
  {
    icon: Zap,
    step: "04",
    title: "Optimize",
    desc: "Measure runtime weight, hydration cost, and web vitals.",
  },
]

export function AboutView({ data }: AboutViewProps) {
  const {
    aboutHero,
    architectureDives,
    corePillars,
    engineeringPhilosophy,
    realSystemsBuilt,
  } = data

  return (
    <PageBackground>
      <div className="py-16 md:py-24">
        <Container>
          <div className="mx-auto max-w-5xl space-y-24 md:space-y-32">

            {/* ── 1. Hero ──────────────────────────────────────────────── */}
            <section className="grid items-center gap-10 md:grid-cols-[1.5fr_1fr] md:gap-12">
              <Reveal className="space-y-6" delay={0.04}>
                <div className="space-y-4">
                  <p className="text-xs font-medium uppercase tracking-widest text-primary/80">
                    Frontend Engineer
                  </p>
                  <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl md:leading-[1.08]">
                    {aboutHero.title}
                  </h1>
                </div>
                <p className="max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">
                  {aboutHero.description}
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button asChild size="lg">
                    <Link href="/work">
                      View Work
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <a href="/cv/cv.pdf" download>
                      Download Resume
                    </a>
                  </Button>
                </div>
              </Reveal>

              <Reveal delay={0.10}>
                <div className="relative aspect-square w-full max-w-sm mx-auto md:mx-0">
                  <div className="absolute inset-0 rounded-[2rem] border border-border/50 bg-gradient-to-br from-background/85 via-card/90 to-muted/55 backdrop-blur-xl" />
                  <div className="absolute inset-[10px] rounded-[1.6rem] border border-white/10 bg-white/4" />
                  <div className="relative h-full w-full overflow-hidden rounded-[1.7rem] p-[10px]">
                    <div className="relative h-full w-full overflow-hidden rounded-[1.35rem] bg-muted/30">
                      <Image
                        src={me}
                        alt="Ahmed Badry"
                        fill
                        className="object-cover"
                        priority
                      />
                    </div>
                  </div>
                </div>
              </Reveal>
            </section>

            {/* ── 2. How I Build ───────────────────────────────────────── */}
            <section className="space-y-8">
              <Reveal>
                <div className="space-y-1">
                  <h2 className="text-2xl font-semibold tracking-tight">How I Build</h2>
                  <p className="text-sm text-muted-foreground">
                    A repeatable process from ambiguity to production.
                  </p>
                </div>
              </Reveal>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {BUILD_STEPS.map((step, i) => {
                  const Icon = step.icon
                  return (
                    <Reveal key={step.step} delay={i * 0.06}>
                      <div className="relative rounded-xl border border-border/60 bg-card/40 p-5 space-y-3 h-full">
                        <div className="flex items-center justify-between">
                          <div className="rounded-md border border-primary/20 bg-primary/10 p-2">
                            <Icon className="size-4 text-primary" />
                          </div>
                          <span className="text-3xl font-bold text-foreground/8 select-none">
                            {step.step}
                          </span>
                        </div>
                        <h3 className="font-semibold tracking-tight">{step.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                      </div>
                    </Reveal>
                  )
                })}
              </div>
            </section>

            {/* ── 3. Engineering Principles (from data) ────────────────── */}
            <section className="space-y-8">
              <Reveal>
                <h2 className="text-2xl font-semibold tracking-tight">Engineering Principles</h2>
              </Reveal>
              <div className="space-y-6">
                {engineeringPhilosophy.map((item, i) => (
                  <Reveal key={item.number} delay={i * 0.05}>
                    <div className="grid gap-4 md:grid-cols-[80px_1fr] md:gap-6 items-start">
                      <span className="text-5xl font-bold tracking-tight text-foreground/10 leading-none">
                        {item.number}
                      </span>
                      <div className="space-y-1.5">
                        <h3 className="font-semibold tracking-tight">{item.title}</h3>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </section>

            {/* ── 4. Core Engineering Pillars ──────────────────────────── */}
            <section className="space-y-8">
              <Reveal>
                <h2 className="text-2xl font-semibold tracking-tight">Core Engineering Pillars</h2>
              </Reveal>
              <div className="grid gap-4 md:grid-cols-3">
                {corePillars.map((pillar, i) => (
                  <Reveal key={pillar.title} delay={i * 0.05}>
                    <div className="rounded-xl border border-border/60 bg-card/40 p-5 space-y-4 h-full">
                      <h3 className="font-semibold tracking-tight">{pillar.title}</h3>
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

            {/* ── 5. Architecture Deep Dive ─────────────────────────────── */}
            <section className="space-y-8">
              <Reveal>
                <div className="space-y-1">
                  <h2 className="text-2xl font-semibold tracking-tight">Architecture Deep Dive</h2>
                  <p className="text-sm text-muted-foreground">
                    Real decisions across rendering strategy, boundaries, and maintainability.
                  </p>
                </div>
              </Reveal>
              <Reveal delay={0.05}>
                <AboutDeepDiveTabs items={architectureDives} />
              </Reveal>
            </section>

            {/* ── 6. Real Systems Built ─────────────────────────────────── */}
            <section className="space-y-8">
              <Reveal>
                <h2 className="text-2xl font-semibold tracking-tight">Real Systems Built</h2>
              </Reveal>
              <div className="grid gap-4 md:grid-cols-3">
                {realSystemsBuilt.map((system, i) => (
                  <Reveal key={system.title} delay={i * 0.05}>
                    <div className="rounded-xl border border-border/60 bg-card/40 p-5 space-y-2 h-full">
                      <h3 className="font-semibold tracking-tight text-[15px]">{system.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{system.summary}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </section>

            {/* ── 7. CTA ────────────────────────────────────────────────── */}
            <Reveal delay={0.04}>
              <section className="rounded-2xl border border-primary/20 bg-primary/5 p-8 md:p-12 text-center space-y-5">
                <p className="text-lg font-medium md:text-xl tracking-tight max-w-xl mx-auto">
                  If you&apos;re building a serious product and value structure over surface — let&apos;s collaborate.
                </p>
                <Button asChild size="lg">
                  <Link href="/contact">Start a Conversation</Link>
                </Button>
              </section>
            </Reveal>

          </div>
        </Container>
      </div>
    </PageBackground>
  )
}
```

---

## PHASE 4 — MetricBadge Enhancement

### File: `components/shared/MetricBadge.tsx`

Make the metric badges more visually prominent to match the reference (larger, more visible):

```tsx
// Add a `variant` prop: "default" | "hero"
// For hero variant: bigger text, tighter pill, more visible border

type MetricBadgeProps = {
  label: string
  value: string | number
  className?: string
  variant?: "default" | "hero"
}

// In the return JSX:
// if variant === "hero":
//   className: "inline-flex flex-col items-center gap-0.5 rounded-xl border border-border/60 bg-card/60 px-4 py-2.5 text-center"
//   value: "text-xl font-bold text-foreground"
//   label: "text-xs text-muted-foreground"
// else: keep existing styles
```

---

## PHASE 5 — TypeScript & Import Checks

After making all changes, verify these things compile cleanly:

1. `PageBackground` is imported in both `CaseStudyView.tsx` and `AboutView.tsx`
2. `CaseStudyView` no longer imports `StickyProgressNav` (removed from the new design)
3. `CaseStudyView` no longer imports `CaseStudySectionCard` or `ArchitectureVisual` (replaced)
4. `AboutView` no longer imports `Card`, `CardContent`, `CardHeader`, `CardTitle` from shadcn (now using raw divs with Tailwind)
5. The `progressItems` prop is still in `CaseStudyPageData` but the view doesn't need to use it — that's fine, just don't destructure it
6. All Lucide icons used are imported at the top of each file

---

## PHASE 6 — Homepage Safety Pass (Minimal)

### Files to check (do NOT redesign):
- `features/home/HomeView.tsx`
- `features/home/components/hero/Hero.tsx`

Only check that `GlobalBackground` is still imported and rendered in `app/layout.tsx`.  
The `GlobalBackground` update (Phase 1) automatically improves the homepage background without any structural change.

**Do not touch:**
- HeroContent, HeroImg
- SelectedWork
- HowIThink
- EngineeringPrinciples
- BookingCta
- Navbar, Footer

---

## Execution Order

```
1. Create components/layout/PageBackground.tsx
2. Update components/layout/GlobalBackground.tsx
3. Rewrite features/case-study/CaseStudyView.tsx
4. Rewrite features/about/AboutView.tsx
5. Update components/shared/MetricBadge.tsx (variant prop)
6. Verify TypeScript — fix any import errors
7. Verify app/layout.tsx still renders <GlobalBackground />
8. Do NOT touch homepage feature files
```

---

## Key Constraints

| Rule | Detail |
|------|--------|
| Do not change routing | All routes stay the same |
| Do not change data types | `ProjectRecord`, `AboutPageData`, `CaseStudyPageData` are frozen |
| Do not change MDX pipeline | `sections.problem.source` etc. still fed to `<MDXRemote />` |
| Do not redesign homepage | Only background system updates apply |
| No particles or canvas | Background uses CSS gradients only |
| No new dependencies | Use only what's already in `package.json` |
| Keep `CaseImageCarousel` | It's well-built and stays in the hero |
| Keep `AboutDeepDiveTabs` | Already a good interactive component |
| Keep `Reveal` + `BitsLogoLoop` + `TagPills` + `MetricBadge` | All reused |

---

## Expected File Changes Summary

| File | Action |
|------|--------|
| `components/layout/GlobalBackground.tsx` | Replace with CSS gradient system |
| `components/layout/PageBackground.tsx` | **New file** — page-scoped glow wrapper |
| `components/shared/MetricBadge.tsx` | Add `variant` prop for hero display |
| `features/case-study/CaseStudyView.tsx` | Full rewrite with new layout |
| `features/about/AboutView.tsx` | Full rewrite with new layout |

**Files that must NOT change:**
- `app/layout.tsx`
- `features/home/**`
- `data/projects.ts`, `data/about.ts`
- `services/**`
- `features/case-study/components/CaseImageCarousel.tsx`
- `features/about/components/AboutDeepDiveTabs.tsx`
- `components/shared/BitsLogoLoop.tsx`, `TagPills.tsx`
- All routing files

---

*This prompt was written with full knowledge of the existing codebase including component implementations, data types, service layer, and MDX pipeline. Every component reference and import path is accurate to the actual project structure.*
