# CODEX_SKILLS.md
# مهارات وأنماط هذا المشروع — مرجع تقني كامل

---

## 1. الـ Architecture Pattern

هذا المشروع يتبع **Feature-Driven Architecture** مع **Server-First Rendering**.

```
الـ Request Flow:
User Request
    ↓
app/(public)/[route]/page.tsx          ← Server Component — metadata + data fetch
    ↓
features/[name]/[Name]Container.tsx    ← Server Component — thin wrapper
    ↓
features/[name]/[Name]View.tsx         ← Server Component — layout shell
    ↓
features/[name]/components/            ← mix of Server + Client Components
```

### مثال من المشروع الحالي
```tsx
// app/(public)/about/page.tsx — Server Component
export default function AboutPage() {
  const data = getAboutPageData()
  return <AboutContainer data={data} />
}

// features/about/AboutView.tsx — Server Component (يستخدم Reveal بدون "use client")
export function AboutView({ data }: AboutViewProps) {
  return (
    <div>
      <Reveal delay={0.04}><h1>{data.aboutHero.title}</h1></Reveal>
    </div>
  )
}
// ملاحظة: Reveal هو client component في نفسه — الـ View تفضل Server
```

---

## 2. مكونات Layout المتاحة

### Container
```tsx
import { Container } from "@/components/layout/Container"
// max-w-7xl + horizontal padding (px-4 sm:px-6 lg:px-8)
// استخدمه في كل page-level section
```

### Reveal — scroll reveal animation
```tsx
import Reveal from "@/features/animations/motion/Reveal"

// Props:
// delay?: number    — ابدأ من 0.04, زوِّد بـ 0.05-0.06 لكل element
// y?: number        — default: 12
// fromScale?: number
// className?: string
// once?: boolean    — default: true

<Reveal delay={0.04}><h2>Title</h2></Reveal>
<Reveal delay={0.08}><p>Body</p></Reveal>
<Reveal delay={0.12} className="col-span-2"><LargeBlock /></Reveal>
```

### StaggerContainer + StaggerItem
```tsx
import { StaggerContainer, StaggerItem } from "@/features/animations/motion/Stagger"

<StaggerContainer className="grid gap-4 md:grid-cols-3">
  {items.map(item => (
    <StaggerItem key={item.id}><Card>{item.title}</Card></StaggerItem>
  ))}
</StaggerContainer>
```

---

## 3. الـ UI Components (shadcn — موجودة في components/ui/)

```
button.tsx       → Button variant="default|outline|secondary|ghost" size="default|sm|lg"
card.tsx         → Card, CardHeader, CardTitle, CardContent, CardFooter
carousel.tsx     → Embla carousel wrapper
dialog.tsx       → Dialog, DialogContent, DialogHeader
dropdown-menu.tsx
field.tsx        → Field, FieldLabel, FieldError, FieldGroup, FieldDescription
input-group.tsx  → InputGroup, InputGroupTextarea, InputGroupAddon, InputGroupText
input.tsx        → Input
label.tsx        → Label
separator.tsx    → Separator
sonner.tsx       → Toaster (للـ toasts)
textarea.tsx     → Textarea
```

### إضافة shadcn component جديد
```bash
npx shadcn add badge
npx shadcn add table
npx shadcn add tabs
```

---

## 4. الـ Data Layer

### Static Data — من `data/`
```ts
data/projects.ts     → ProjectRecord[] — FROZEN (لا تعدّل)
data/about.ts        → aboutHero, engineeringPhilosophy, corePillars, architectureDives, realSystemsBuilt
data/home.ts         → heroOrbitImages, howIThinkSteps, engineeringPrinciples
data/navigation.ts   → navLinks
```

### Service Layer Pattern
```ts
// services/myService.ts
import { myData } from "@/data/myData"

export function getMyPageData() {
  return myData
}

export type MyPageData = ReturnType<typeof getMyPageData>
```

---

## 5. أنماط الـ Convex

### Schema
```ts
// convex/schema.ts
import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  myTable: defineTable({
    name: v.string(),
    count: v.number(),
    active: v.boolean(),
    optional: v.optional(v.string()),
  })
  .index("by_name", ["name"])
  .index("by_created", ["count"]),
})
```

### Queries و Mutations
```ts
// convex/myTable.ts
import { query, mutation } from "./_generated/server"
import { v } from "convex/values"

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("myTable").withIndex("by_created").order("desc").take(50)
  },
})

export const create = mutation({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.insert("myTable", args)
  },
})

export const remove = mutation({
  args: { id: v.id("myTable") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id)
  },
})
```

### استخدام في Client Components
```tsx
"use client"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"

function MyComponent() {
  const items = useQuery(api.myTable.list) ?? []   // دايماً fallback لـ []
  const remove = useMutation(api.myTable.remove)

  if (items.length === 0) return <EmptyState />

  return items.map(item => (
    <div key={item._id}>
      {item.name}
      <button type="button" onClick={() => remove({ id: item._id })}>Delete</button>
    </div>
  ))
}
```

---

## 6. أنماط الـ Sections — Copy-Paste Ready

### Section Header
```tsx
<Reveal>
  <div className="space-y-1">
    <h2 className="text-2xl font-semibold tracking-tight">Section Title</h2>
    <p className="text-sm text-muted-foreground">Supporting description.</p>
  </div>
</Reveal>
```

### 3-Column Card Grid
```tsx
<div className="grid gap-4 md:grid-cols-3">
  {items.map((item, i) => (
    <Reveal key={item.id} delay={i * 0.06}>
      <div className="rounded-xl border border-border/60 bg-card/40 p-5 space-y-3 h-full">
        <h3 className="font-semibold tracking-tight text-sm">{item.title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
      </div>
    </Reveal>
  ))}
</div>
```

### 4-Column Step Cards
```tsx
<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
  {STEPS.map((step, i) => {
    const Icon = step.icon
    return (
      <Reveal key={step.id} delay={i * 0.06}>
        <div className="rounded-xl border border-border/60 bg-card/40 p-5 space-y-3 h-full">
          <div className="flex items-center justify-between">
            <div className="rounded-md border border-primary/20 bg-primary/10 p-2">
              <Icon className="size-4 text-primary" />
            </div>
            <span className="text-3xl font-bold text-foreground/8 select-none tabular-nums">
              {step.number}
            </span>
          </div>
          <h3 className="font-semibold tracking-tight">{step.title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
        </div>
      </Reveal>
    )
  })}
</div>
```

### CTA Block
```tsx
<Reveal delay={0.04}>
  <section className="rounded-2xl border border-primary/20 bg-primary/5 p-8 md:p-12 text-center space-y-5">
    <p className="text-lg font-medium md:text-xl tracking-tight max-w-xl mx-auto">
      Closing statement here.
    </p>
    <Button asChild size="lg">
      <Link href="/contact">Call to Action</Link>
    </Button>
  </section>
</Reveal>
```

### Numbered List (Philosophy / Principles)
```tsx
<div className="space-y-6">
  {items.map((item, i) => (
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
```

### Colored Highlight Cards (Problem/Solution/Impact)
```tsx
// amber = problem, primary/purple = solution, emerald = impact
<div className="rounded-xl border border-amber-400/15 bg-amber-400/5 p-6 space-y-3">
  <div className="flex items-center gap-2 text-amber-400">
    <AlertTriangle className="size-4" />
    <span className="text-sm font-medium uppercase tracking-wider">The Problem</span>
  </div>
  <ul className="space-y-2">
    {points.map(p => (
      <li key={p} className="flex items-start gap-2 text-sm text-muted-foreground">
        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-current opacity-50" />
        {p}
      </li>
    ))}
  </ul>
</div>
```

### Tabbed Section (Architecture Tabs)
```tsx
"use client"
import { useState } from "react"
import { cn } from "@/lib/cn"

const TABS = [
  { id: "frontend", label: "Frontend", icon: Layers },
  { id: "data",     label: "Data",     icon: Database },
  { id: "perf",     label: "Performance", icon: Gauge },
]

function TabbedSection() {
  const [active, setActive] = useState("frontend")

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 border-b border-border pb-3">
        {TABS.map(tab => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActive(tab.id)}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors border",
                active === tab.id
                  ? "bg-primary/15 text-primary border-primary/25"
                  : "text-muted-foreground hover:text-foreground border-transparent"
              )}
            >
              <Icon className="size-3.5" />
              {tab.label}
            </button>
          )
        })}
      </div>
      <div className="rounded-xl border border-border/60 bg-card/40 p-5">
        {/* active tab content */}
      </div>
    </div>
  )
}
```

---

## 7. الـ Background System

### GlobalBackground — fixed, app-wide
```tsx
// في app/layout.tsx — يُستخدم مرة واحدة فقط
// يحتوي على: dark base + radial purple glows + noise texture
// Server Component — لا "use client"
```

### PageBackground — page-scoped top glow
```tsx
import { PageBackground } from "@/components/layout/PageBackground"

// يُستخدم في About + CaseStudy pages فقط
export function AboutView() {
  return (
    <PageBackground>
      <div className="py-16 md:py-24">...</div>
    </PageBackground>
  )
}
```

---

## 8. الـ Motion Tokens

```ts
import { motionDuration, motionEase, revealDistance } from "@/lib/motion"

// motionDuration.fast   = 0.2   ← micro interactions
// motionDuration.base   = 0.3   ← standard transitions
// motionDuration.slow   = 0.4   ← heavier elements
// motionDuration.reveal = 0.48  ← scroll reveals
// motionEase.standard   = [0.22, 1, 0.36, 1]
// revealDistance        = 12    ← default y offset
```

---

## 9. الـ Image Patterns

```tsx
import Image from "next/image"

// Fixed dimensions
<Image src="/img.png" alt="Description" width={480} height={480} priority />

// Fill (relative container required)
<div className="relative aspect-square w-full">
  <Image
    src={src}
    alt="Description"
    fill
    sizes="(min-width: 768px) 33vw, 90vw"
    className="object-cover"
  />
</div>
```

---

## 10. الـ Link و Button

```tsx
// Internal navigation
<Button asChild><Link href="/contact">Contact</Link></Button>

// External link
<Button asChild variant="outline">
  <a href="https://..." target="_blank" rel="noopener noreferrer">
    <Github className="size-4" />GitHub
  </a>
</Button>

// File download
<Button asChild variant="outline">
  <a href="/cv/cv.pdf" download>Download Resume</a>
</Button>
```

---

## 11. الـ Icons

```tsx
import { ArrowRight, ExternalLink, Github, Zap, Layers, Database } from "lucide-react"

<Icon className="size-4" />      // 16px — standard
<Icon className="size-3.5" />    // 14px — داخل tabs/badges
<Icon className="size-5" />      // 20px — section headers

// ألوان:
<Icon className="size-4 text-primary" />
<Icon className="size-4 text-muted-foreground" />
<Icon className="size-4 text-emerald-400" />
<Icon className="size-4 text-amber-400" />
<Icon className="size-4 text-blue-400" />
```

---

## 12. الـ Spacing Reference

```
بين sections في الصفحة:    space-y-24 md:space-y-32
بين elements في section:   space-y-6 أو space-y-8
padding الصفحة:            py-16 md:py-24
padding للـ cards:          p-4 · p-5 · p-6
gap في الـ grids:           gap-4 (cards) · gap-6 (wider)
```

---

## 13. Admin Tab Navigation (searchParams pattern)

```tsx
"use client"
import { useSearchParams } from "next/navigation"

function AdminContent() {
  const searchParams = useSearchParams()
  const tab = searchParams.get("tab") ?? "submissions"

  return tab === "projects" ? <ProjectsTable /> : <SubmissionsTable />
}
```

---

## 14. Checklist قبل إتمام أي Task

- [ ] TypeScript compile بدون errors (`tsc --noEmit`)
- [ ] `"use client"` فقط في الـ components المحتاجة فعلاً
- [ ] كل imports بـ `@/` (لا relative paths)
- [ ] كل `<Image>` فيها `alt` + `sizes` (مع fill)
- [ ] كل external links فيها `rel="noopener noreferrer"`
- [ ] كل buttons فيها `type="button"` أو `type="submit"`
- [ ] لا packages جديدة اتثبتت
- [ ] لا ملفات محظورة اتلمست
- [ ] الـ Reveal delays مرتبة تصاعدياً (0.04 → 0.08 → 0.12...)
- [ ] Grid columns responsive (1 → 2 → 3/4)
