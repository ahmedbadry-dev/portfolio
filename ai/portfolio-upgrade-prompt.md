# Portfolio General Upgrade — Full Codex Execution Prompt

> **Stack:** Next.js 16 App Router · React 19 · TypeScript · Tailwind CSS v4 · Convex · Resend · shadcn/ui · Framer Motion  
> **Scope:** Code quality · About page redesign · Admin dashboard · Content rewrite · Performance  
> **DO NOT TOUCH:** Homepage structure · Case study page (handled separately) · All routing files  

---

## Critical Rules Before You Start

1. Read this entire file before writing a single line of code
2. Follow the execution order exactly
3. Only modify files listed in the **Expected File Changes** table
4. Fix TypeScript errors in the same step they appear — do not proceed with broken types
5. Do not install new packages unless explicitly listed in this prompt
6. The homepage (`features/home/**`) is frozen — improvements only to `data/home.ts` content

---

## Project Structure Reference

```
app/
  (public)/
    page.tsx                    ← HomeContainer (DO NOT TOUCH structure)
    about/page.tsx              ← AboutContainer → AboutView (REDESIGN)
    work/page.tsx               ← WorkContainer (minor content only)
    contact/page.tsx            ← ContactContainer (keep)
    projects/[slug]/page.tsx    ← CaseStudyContainer (separate prompt)
  (admin)/
    admin/
      page.tsx                  ← AdminPage (REBUILD — currently returns null)
      layout.tsx                ← AdminLayout (REBUILD)
  api/
    contact/route.ts            ← keep, update reply email signature only

features/
  home/                         ← FROZEN — no structural changes
    HomeView.tsx
    components/hero/HeroContent.tsx   ← content update only (text copy)
    components/testimonials/Testimonials.tsx  ← keep
    components/selected-work/SelectedWork.tsx ← keep
  about/
    AboutView.tsx               ← REDESIGN TARGET
    AboutContainer.tsx          ← keep
    components/
      AboutDeepDiveTabs.tsx     ← keep (already good interactive component)
  admin/
    components/
      ProjectsTable.tsx         ← REBUILD (currently returns null)
      SubmissionsTable.tsx      ← REBUILD (currently returns null)
  contact/
    components/ContactForm.tsx  ← keep

components/
  layout/
    GlobalBackground.tsx        ← UPDATE (from case study prompt — verify done)
    Container.tsx               ← keep
    Navbar.tsx                  ← keep
    Footer.tsx                  ← keep
  shared/
    MetricBadge.tsx             ← keep
    BitsLogoLoop.tsx            ← keep
    TagPills.tsx                ← keep

data/
  home.ts                       ← content update (hero copy only)
  about.ts                      ← content update (stronger copy)
  projects.ts                   ← keep (frozen types)

convex/
  schema.ts                     ← DEFINE (currently empty `{}`)
  contactSubmissions.ts         ← IMPLEMENT (currently empty export)
  projects.ts                   ← keep as static (do not migrate away from data/projects.ts)

lib/
  env.ts                        ← ADD CONVEX_URL

app/api/contact/route.ts        ← minor: fix email signature copy
```

---

## PHASE 1 — Content Rewrite (data files only, no component changes)

### 1A. Update `data/home.ts` — Hero copy

The current hero copy is weak and generic. Update **only** the text strings used in `HeroContent.tsx`.

In `HeroContent.tsx` the headline renders `"Ahmed Badry"` (keep name) and subtitle renders `"Frontend Specialist"` (change) with two supporting lines below it.

**Current weak copy:**
```
"Frontend Specialist"
"Building cutting-edge web experiences"  
"Elevating performance & design"
```

**New copy to use — edit the JSX strings in `features/home/components/hero/HeroContent.tsx`:**
```
Subtitle (replace "Specialist"):     "Engineer"
Supporting line 1:                   "Designing systems that scale — architecture-first, performance-default."
Supporting line 2:                   "Next.js · TypeScript · Fullstack"
```

> The `AnimatedHeadline` component renders `"Ahmed Badry"` — do NOT change the name or the animation logic. Only change the subtitle and description strings below it.

---

### 1B. Update `data/about.ts` — Full content rewrite

Replace **only the string values** — do not change the data shape, keys, or TypeScript types.

```ts
// data/about.ts — new content values

export const aboutHero = {
  title: "I Build Systems That Scale Before They Have To",
  description:
    "Frontend engineer focused on architecture decisions, rendering strategy, and measurable performance. I work at the intersection of product clarity and engineering discipline.",
}

export const engineeringPhilosophy = [
  {
    number: "01",
    title: "Architecture Before Implementation",
    description:
      "Boundaries, rendering mode, and data contracts come before any component. This keeps systems predictable when requirements shift.",
  },
  {
    number: "02",
    title: "Performance Is a Product Constraint",
    description:
      "TTFB, hydration cost, and bundle weight are first-class concerns — not optimizations added at the end. They shape decisions from day one.",
  },
  {
    number: "03",
    title: "Tradeoffs Over Assumptions",
    description:
      "Every architecture decision has a cost. I document the reasoning so teams can evolve systems confidently without rewriting foundational layers.",
  },
]

// corePillars and architectureDives — keep existing values, they are accurate
// realSystemsBuilt — keep existing values
```

### 1C. Update email signature in `app/api/contact/route.ts`

Find this line in `userHtml`:
```
"Ahmed Badry<br/>Frontend Specialist"
```
Replace with:
```
"Ahmed Badry<br/>Frontend Engineer"
```

---

## PHASE 2 — About Page Redesign

### File: `features/about/AboutView.tsx`

**Current problem:** Dense numbered list + bullet-point grid. Feels like a resume, not a portfolio.

**Target:** Engineering philosophy page with visual breathing room, clear scan flow, and real proof of work.

**New structure:**
```
1. Hero          — strong title + description + CTA buttons + photo
2. How I Build   — 4 compact horizontal step cards (static data)  
3. Principles    — existing engineeringPhilosophy data (01/02/03 layout)
4. Core Pillars  — existing corePillars (3 cards, compact)
5. Deep Dive     — keep AboutDeepDiveTabs (already good)
6. Systems Built — upgrade from list → 3 cards grid
7. CTA           — premium closing block
```

**Implementation — full rewrite of `features/about/AboutView.tsx`:**

```tsx
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
]

function PhotoFrame() {
  return (
    <div className="relative aspect-square w-full max-w-sm mx-auto md:mx-0">
      <div className="absolute inset-0 rounded-[2rem] border border-border/50 bg-gradient-to-br from-background/85 via-card/90 to-muted/55 backdrop-blur-xl" />
      <div className="absolute inset-[10px] rounded-[1.6rem] border border-white/10" />
      <div className="relative h-full w-full overflow-hidden rounded-[1.7rem] p-[10px]">
        <div className="relative h-full w-full overflow-hidden rounded-[1.35rem] bg-muted/30">
          <Image src={me} alt="Ahmed Badry" fill className="object-cover" priority />
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

          {/* 1 — Hero */}
          <section className="grid items-center gap-10 md:grid-cols-[1.5fr_1fr] md:gap-12">
            <Reveal className="space-y-6" delay={0.04}>
              <div className="space-y-3">
                <p className="text-xs font-medium uppercase tracking-widest text-primary/80">
                  Frontend Engineer
                </p>
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl leading-[1.08]">
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
                  <a href="/cv/cv.pdf" download>Download Resume</a>
                </Button>
              </div>
            </Reveal>
            <Reveal delay={0.10}>
              <PhotoFrame />
            </Reveal>
          </section>

          {/* 2 — How I Build */}
          <section className="space-y-8">
            <Reveal>
              <div className="space-y-1">
                <h2 className="text-2xl font-semibold tracking-tight">How I Build</h2>
                <p className="text-sm text-muted-foreground">
                  A repeatable process — from ambiguity to production-ready systems.
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
                        <span className="text-3xl font-bold text-foreground/8 select-none tabular-nums">
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

          {/* 3 — Engineering Principles (numbered) */}
          <section className="space-y-8">
            <Reveal>
              <h2 className="text-2xl font-semibold tracking-tight">Engineering Principles</h2>
            </Reveal>
            <div className="space-y-6">
              {engineeringPhilosophy.map((item, i) => (
                <Reveal key={item.number} delay={i * 0.05}>
                  <div className="grid gap-4 md:grid-cols-[80px_1fr] md:gap-6 items-start border-b border-border/40 pb-6 last:border-0 last:pb-0">
                    <span className="text-5xl font-bold tracking-tight text-foreground/10 leading-none tabular-nums">
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

          {/* 4 — Core Engineering Pillars */}
          <section className="space-y-8">
            <Reveal>
              <h2 className="text-2xl font-semibold tracking-tight">Core Engineering Pillars</h2>
            </Reveal>
            <div className="grid gap-4 md:grid-cols-3">
              {corePillars.map((pillar, i) => (
                <Reveal key={pillar.title} delay={i * 0.05}>
                  <div className="rounded-xl border border-border/60 bg-card/40 p-5 space-y-4 h-full">
                    <h3 className="font-semibold tracking-tight text-sm">{pillar.title}</h3>
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

          {/* 5 — Architecture Deep Dive (keep existing component) */}
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

          {/* 6 — Real Systems Built — upgrade from list to cards */}
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

          {/* 7 — CTA */}
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
  )
}
```

---

## PHASE 3 — Admin Dashboard (Build from null)

The admin section is currently completely empty (`return null` everywhere). Build a clean, functional admin dashboard.

**Technology choice:** Use Convex for data persistence (already in the project). Use existing shadcn/ui components only.

### 3A. Define Convex Schema — `convex/schema.ts`

```ts
import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  contactSubmissions: defineTable({
    name: v.string(),
    email: v.string(),
    message: v.string(),
    createdAt: v.number(),
    read: v.boolean(),
  }).index("by_created", ["createdAt"]),

  pageViews: defineTable({
    path: v.string(),
    visitedAt: v.number(),
    userAgent: v.optional(v.string()),
  }).index("by_path", ["path"]).index("by_visited", ["visitedAt"]),
})
```

### 3B. Implement Convex mutations/queries — `convex/contactSubmissions.ts`

```ts
import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("contactSubmissions")
      .withIndex("by_created")
      .order("desc")
      .take(100)
  },
})

export const create = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("contactSubmissions", {
      ...args,
      createdAt: Date.now(),
      read: false,
    })
  },
})

export const markRead = mutation({
  args: { id: v.id("contactSubmissions") },
  handler: async (ctx, { id }) => {
    await ctx.db.patch(id, { read: true })
  },
})

export const remove = mutation({
  args: { id: v.id("contactSubmissions") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id)
  },
})
```

### 3C. Implement page views — `convex/pageViews.ts` (new file)

```ts
import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

export const record = mutation({
  args: {
    path: v.string(),
    userAgent: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("pageViews", {
      ...args,
      visitedAt: Date.now(),
    })
  },
})

export const summary = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("pageViews").collect()
    const byPath: Record<string, number> = {}
    for (const view of all) {
      byPath[view.path] = (byPath[view.path] ?? 0) + 1
    }
    return {
      total: all.length,
      byPath: Object.entries(byPath)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10),
    }
  },
})
```

### 3D. Update `app/api/contact/route.ts` — also save to Convex

After sending the Resend emails successfully, also insert into Convex:

```ts
// Add at the top of route.ts:
import { ConvexHttpClient } from "convex/browser"
import { api } from "@/convex/_generated/api"

// After the resend.emails.send calls succeed, add:
const convexUrl = process.env.CONVEX_URL
if (convexUrl) {
  const convex = new ConvexHttpClient(convexUrl)
  await convex.mutation(api.contactSubmissions.create, {
    name,
    email,
    message,
  })
}
```

### 3E. Build `features/admin/components/SubmissionsTable.tsx`

```tsx
"use client"

import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"  // add to shadcn if missing: npx shadcn add badge
import { formatDistanceToNow } from "date-fns"  // already not installed — use manual format instead

function formatDate(ts: number) {
  const d = new Date(ts)
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })
}

export function SubmissionsTable() {
  const submissions = useQuery(api.contactSubmissions.list) ?? []
  const markRead = useMutation(api.contactSubmissions.markRead)
  const remove = useMutation(api.contactSubmissions.remove)

  if (submissions.length === 0) {
    return (
      <div className="rounded-xl border border-border/60 bg-card/40 p-8 text-center text-sm text-muted-foreground">
        No contact submissions yet.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {submissions.map((s) => (
        <div
          key={s._id}
          className={`rounded-xl border p-4 space-y-2 transition-colors ${
            s.read ? "border-border/40 bg-card/20" : "border-primary/20 bg-primary/5"
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{s.name}</span>
                {!s.read && (
                  <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-medium text-primary uppercase tracking-wider">
                    New
                  </span>
                )}
              </div>
              <span className="text-xs text-muted-foreground">{s.email}</span>
            </div>
            <span className="text-xs text-muted-foreground shrink-0">{formatDate(s.createdAt)}</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{s.message}</p>
          <div className="flex gap-2 pt-1">
            {!s.read && (
              <Button size="sm" variant="outline" onClick={() => markRead({ id: s._id })}>
                Mark read
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              className="text-destructive border-destructive/30 hover:bg-destructive/10"
              onClick={() => remove({ id: s._id })}
            >
              Delete
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
```

### 3F. Build `features/admin/components/ProjectsTable.tsx`

The projects come from `data/projects.ts` (static). This table shows them as read-only for now with links to their case studies and live demos.

```tsx
"use client"

import Link from "next/link"
import { ExternalLink, Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import { projects } from "@/data/projects"

export function ProjectsTable() {
  return (
    <div className="space-y-3">
      {projects.map((project) => (
        <div
          key={project.slug}
          className="rounded-xl border border-border/60 bg-card/40 p-4 flex items-center justify-between gap-4"
        >
          <div className="space-y-0.5 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium text-sm">{project.title}</span>
              <span className="rounded-full border border-border/50 px-2 py-0.5 text-[10px] text-muted-foreground uppercase">
                {project.status}
              </span>
              <span className="rounded-full border border-border/50 px-2 py-0.5 text-[10px] text-muted-foreground uppercase">
                {project.type}
              </span>
            </div>
            <p className="text-xs text-muted-foreground truncate max-w-md">{project.description}</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button asChild size="sm" variant="outline">
              <Link href={`/projects/${project.slug}`}>Case Study</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <a href={project.links.liveDemo.trim()} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="size-3.5" />
              </a>
            </Button>
            <Button asChild size="sm" variant="outline">
              <a href={project.links.gitHub.trim()} target="_blank" rel="noopener noreferrer">
                <Github className="size-3.5" />
              </a>
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
```

### 3G. Build Admin Layout — `app/(admin)/admin/layout.tsx`

```tsx
import type { ReactNode } from "react"
import Link from "next/link"
import { LayoutDashboard, Mail, FolderOpen, ArrowLeft } from "lucide-react"

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin?tab=submissions", label: "Submissions", icon: Mail },
  { href: "/admin?tab=projects", label: "Projects", icon: FolderOpen },
]

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border/60 bg-card/40 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 flex items-center justify-between h-14">
          <div className="flex items-center gap-6">
            <span className="font-semibold text-sm tracking-tight">AB.dev Admin</span>
            <nav className="flex items-center gap-1">
              {NAV.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                  >
                    <Icon className="size-3.5" />
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </div>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            Back to site
          </Link>
        </div>
      </div>
      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
        {children}
      </main>
    </div>
  )
}
```

### 3H. Build Admin Page — `app/(admin)/admin/page.tsx`

```tsx
"use client"

import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { ProjectsTable } from "@/features/admin/components/ProjectsTable"
import { SubmissionsTable } from "@/features/admin/components/SubmissionsTable"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"

function StatsBar() {
  const submissions = useQuery(api.contactSubmissions.list) ?? []
  const unread = submissions.filter((s) => !s.read).length

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 mb-8">
      {[
        { label: "Total Submissions", value: submissions.length },
        { label: "Unread", value: unread },
        { label: "Projects", value: 5 },
      ].map((stat) => (
        <div key={stat.label} className="rounded-xl border border-border/60 bg-card/40 p-4 space-y-1">
          <p className="text-2xl font-bold tabular-nums">{stat.value}</p>
          <p className="text-xs text-muted-foreground">{stat.label}</p>
        </div>
      ))}
    </div>
  )
}

function AdminContent() {
  const searchParams = useSearchParams()
  const tab = searchParams.get("tab") ?? "submissions"

  return (
    <div className="space-y-6">
      <Suspense>
        <StatsBar />
      </Suspense>

      <div>
        <h1 className="text-xl font-semibold tracking-tight mb-6">
          {tab === "projects" ? "Projects" : "Contact Submissions"}
        </h1>
        {tab === "projects" ? <ProjectsTable /> : <SubmissionsTable />}
      </div>
    </div>
  )
}

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="text-muted-foreground text-sm">Loading...</div>}>
      <AdminContent />
    </Suspense>
  )
}
```

---

## PHASE 4 — Code Quality Improvements

### 4A. Fix `lib/env.ts` — add CONVEX_URL validation

```ts
// lib/env.ts — replace existing
function requireEnv(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback
  if (!value && process.env.NODE_ENV === "production") {
    throw new Error(`Missing required environment variable: ${key}`)
  }
  return value ?? ""
}

export const env = {
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  CONVEX_URL: process.env.CONVEX_URL ?? "",
  RESEND_API_KEY: process.env.RESEND_API_KEY ?? "",
} as const
```

### 4B. Performance — reduce animation overhead in `HeroContent.tsx`

The current `AnimatedHeadline` animates **every individual character** with `delay: index * 0.05`. For the name "Ahmed Badry" (11 chars) this creates 11 separate motion elements staggered over 0.55s. This is fine. **Do NOT change the animation logic** — it's part of the homepage identity. Leave it as-is.

### 4C. Remove dead code

Check these files — if they still return `null`, add a comment explaining they are stubs, or implement them per this prompt:
- `features/case-study/components/CaseCta.tsx` — if still `return null`, add a real CTA or delete the file and remove its import
- `features/case-study/components/CaseHeader.tsx` — same as above
- `features/case-study/components/CaseSections.tsx` — same as above

If these files are imported somewhere, remove the import if the component does nothing. If they are NOT imported anywhere, delete them to keep the codebase clean.

---

## PHASE 5 — Performance Checks (no new deps)

### 5A. Verify `GlobalBackground.tsx` is a Server Component

If it contains `"use client"` and only for the `useEffect` mouse tracking — that mouse reactive light is a performance concern. Remove the mouse-tracking effect entirely and replace the `GlobalBackground` with a pure CSS static version (as specified in the case study prompt). The static gradient background is better for performance and looks just as premium.

If the GlobalBackground was already updated by the case study prompt, skip this step.

### 5B. Check `features/home/components/testimonials/Testimonials.tsx`

The `EngineeringPrinciples` component uses `whileHover={{ y: -6 }}` on every card AND the `Magnetic` component. This is fine on desktop but adds listener overhead. **Do not change** — it's part of the homepage identity. Just verify no console errors.

### 5C. Image optimization check

In `AboutView.tsx` the `PhotoFrame` component uses `<Image fill>` without `sizes`. Add:
```tsx
sizes="(min-width: 768px) 33vw, 90vw"
```

---

## PHASE 6 — Responsiveness Final Check

After all changes, verify these layouts work on mobile (< 640px), tablet (640–1024px), desktop (> 1024px):

### About page checklist:
- [ ] Hero: stacks vertically on mobile (photo below text)
- [ ] How I Build: 1 column mobile, 2 column tablet, 4 column desktop
- [ ] Principles: single column, large number left-aligned or stacked
- [ ] Core Pillars: 1 column mobile, 3 column desktop
- [ ] Systems Built: 1 column mobile, 3 column desktop
- [ ] CTA block: full width, centered

### Admin page checklist:
- [ ] Sticky header wraps correctly on small screens
- [ ] Stats bar: 2 columns on mobile
- [ ] Submission cards: stack readable on mobile
- [ ] Project table: horizontal scroll if needed on very small screens

---

## Expected File Changes Summary

| File | Action | Notes |
|------|--------|-------|
| `features/about/AboutView.tsx` | Full rewrite | New layout — 7 sections |
| `features/home/components/hero/HeroContent.tsx` | Text update only | Change subtitle + 2 description lines |
| `app/api/contact/route.ts` | Minor update | Fix email signature + add Convex insert |
| `data/about.ts` | Content update | Replace string values only — keep types |
| `convex/schema.ts` | Implement | Define contactSubmissions + pageViews tables |
| `convex/contactSubmissions.ts` | Implement | list / create / markRead / remove |
| `convex/pageViews.ts` | New file | record / summary |
| `features/admin/components/SubmissionsTable.tsx` | Implement | Full Convex-powered component |
| `features/admin/components/ProjectsTable.tsx` | Implement | Read-only project list |
| `app/(admin)/admin/layout.tsx` | Implement | Admin sidebar nav |
| `app/(admin)/admin/page.tsx` | Implement | Dashboard with tabs + stats |
| `lib/env.ts` | Minor update | Add CONVEX_URL |
| `components/layout/GlobalBackground.tsx` | Update (if not done) | Remove mouse tracking, pure CSS gradients |
| Dead stub files (`CaseCta`, `CaseHeader`, `CaseSections`) | Remove or implement | Only if not imported anywhere |

---

## Files That Must NOT Change

| File | Reason |
|------|--------|
| `features/home/HomeView.tsx` | Homepage frozen |
| `features/home/components/hero/Hero.tsx` | Homepage frozen |
| `features/home/components/selected-work/**` | Homepage frozen |
| `features/home/components/how-i-think/**` | Homepage frozen |
| `data/projects.ts` | Frozen types — used by case study |
| `features/case-study/**` | Handled in separate prompt |
| `services/**` | Data contracts frozen |
| `app/(public)/projects/**` | Case study routing frozen |
| `components/shared/BitsLogoLoop.tsx` | Stable, keep |
| `features/about/components/AboutDeepDiveTabs.tsx` | Keep — good interactive component |
| `features/contact/**` | Keep as-is |
| `components/layout/Navbar.tsx` | Keep |
| `components/layout/Footer.tsx` | Keep |

---

## Execution Order

```
1. data/about.ts               — content rewrite (pure strings, no risk)
2. features/home/.../HeroContent.tsx — text-only update (2 lines)
3. app/api/contact/route.ts    — fix signature copy
4. features/about/AboutView.tsx — full rewrite
5. convex/schema.ts            — define tables
6. convex/contactSubmissions.ts — implement queries/mutations
7. convex/pageViews.ts         — new file
8. features/admin/components/SubmissionsTable.tsx — implement
9. features/admin/components/ProjectsTable.tsx    — implement
10. app/(admin)/admin/layout.tsx — implement
11. app/(admin)/admin/page.tsx   — implement
12. lib/env.ts                   — add CONVEX_URL
13. components/layout/GlobalBackground.tsx — verify/update
14. Dead stubs cleanup           — CaseCta / CaseHeader / CaseSections
15. TypeScript check             — fix any errors before finishing
16. Responsive verification      — About page + Admin page
```

---

## Package Notes

**Do NOT install new packages.** All tools used are already in `package.json`:
- `convex` ✅
- `react-hook-form` ✅
- `zod` ✅
- `sonner` ✅
- `lucide-react` ✅
- `framer-motion` (via `motion`) ✅
- `next-themes` ✅

If `date-fns` is not in `package.json`, use the manual `formatDate` function provided above instead.

---

## Environment Variables Required

Make sure these exist in `.env.local`:
```
NEXT_PUBLIC_APP_URL=http://localhost:3000
CONVEX_URL=<your-convex-deployment-url>
RESEND_API_KEY=<your-resend-key>
```

The `CONVEX_URL` should already exist from the initial project setup. If not, run `npx convex dev` to get it.

---

*This prompt was written with complete knowledge of the codebase: all component implementations, data shapes, service layer, Convex schema (empty), admin scaffold (null stubs), and environment setup. Every import path, type reference, and component name reflects the actual project structure.*
