# CODEX_RULES.md
# قواعد إلزامية — اقرأها كاملة قبل أي سطر كود

---

## 🔴 القاعدة الأولى — الترتيب مقدس

نفّذ كل task بالترتيب المكتوب في الـ prompt بالظبط.
لا تبدأ task جديدة قبل ما تخلص اللي قبلها بالكامل وتتأكد إنها compile بدون errors.

---

## 🔴 القاعدة الثانية — الملفات المحظورة

### ❌ لا تلمس أي من هذه الملفات إطلاقاً

```
features/home/**                          ← الـ homepage محمية بالكامل
app/(public)/page.tsx                     ← home route
app/(public)/projects/**                  ← case study routing
features/case-study/**                    ← handled in separate prompt
data/projects.ts                          ← frozen types
services/**                               ← data contracts frozen
components/layout/Navbar.tsx              ← keep
components/layout/Footer.tsx              ← keep
features/about/components/AboutDeepDiveTabs.tsx  ← keep as-is
features/contact/**                       ← keep
components/shared/BitsLogoLoop.tsx        ← keep
components/shared/TagPills.tsx            ← keep
components/shared/MetricBadge.tsx         ← keep
```

---

## 🔴 القاعدة الثالثة — TypeScript Strict

هذا المشروع يعمل بـ `"strict": true` في `tsconfig.json`.

- لا `any` إطلاقاً — استخدم `unknown` أو define proper types
- لا `@ts-ignore` إطلاقاً
- كل prop لازم يكون typed
- كل function return type لازم يكون واضح لو مش obvious
- إذا ظهر TypeScript error — صلّحه في نفس الخطوة فوراً قبل ما تكمل

---

## 🔴 القاعدة الرابعة — Server vs Client Components

هذا النظام حساس جداً. اتبع القاعدة دي بدقة:

### Server Component (الأساس — بدون `"use client"`)
استخدمه لـ:
- صفحات `page.tsx`
- containers و views اللي بتـ fetch data أو بترسّل components
- أي component مش محتاج browser APIs أو state أو event handlers

### Client Component — فقط لما تحتاجه حقاً
ضع `"use client"` فقط لو:
- فيه `useState` / `useEffect` / `useRef`
- فيه event handlers (onClick, onChange...)
- بتستخدم browser APIs
- بتستخدم framer-motion animations interactively

### ❌ خطأ شائع — لا تحوّل views لـ client بسبب Reveal
```tsx
// ❌ غلط — لا تعمل كده
"use client"
import Reveal from "@/features/animations/motion/Reveal"
export function AboutView() { ... }

// ✅ صح — Reveal هو client component في نفسه
// الـ view تفضل server component وتستخدم Reveal عادي
import Reveal from "@/features/animations/motion/Reveal"
export function AboutView() {
  return <Reveal><div>content</div></Reveal>
}
```

---

## 🔴 القاعدة الخامسة — Import Paths

**دايماً** استخدم الـ path alias `@/` — لا relative imports أبداً.

```ts
// ✅ صح
import { cn } from "@/lib/cn"
import { Button } from "@/components/ui/button"
import Reveal from "@/features/animations/motion/Reveal"
import { Container } from "@/components/layout/Container"

// ❌ غلط
import { cn } from "../../lib/cn"
import { Button } from "../../../components/ui/button"
```

---

## 🔴 القاعدة السادسة — لا Packages جديدة

لا تثبّت أي package غير موجود في `package.json` الحالي.

**الـ packages المتاحة:**
```
next · react · react-dom
typescript
tailwindcss v4 (CSS-only config)
framer-motion (مستوردة كـ "motion" في package.json)
gsap · @gsap/react
@react-three/fiber · @react-three/drei · three · ogl
lucide-react
convex
resend
react-hook-form · @hookform/resolvers · zod
sonner
next-themes
embla-carousel-react
next-mdx-remote · @mdx-js/loader · @mdx-js/react · @next/mdx
class-variance-authority · clsx · tailwind-merge
radix-ui
shadcn (للـ components فقط عبر: npx shadcn add [component])
```

**إذا احتجت dependency جديدة** — اسأل أولاً ولا تثبّتها تلقائياً.

---

## 🔴 القاعدة السابعة — Tailwind v4 CSS-only

هذا المشروع يستخدم **Tailwind CSS v4** — لا يوجد `tailwind.config.ts`.
الـ tokens والـ CSS variables موجودة في `app/globals.css`.

```ts
// ❌ غلط — لا يوجد tailwind.config.ts
// لا تحاول تعديل أو استيراد tailwind config

// ✅ صح — استخدم الـ CSS variables الموجودة
// --background, --foreground, --primary, --card
// --muted, --muted-foreground, --border, --input, --ring
// --primary-foreground, --secondary, --accent, --destructive
```

---

## 🔴 القاعدة الثامنة — لا Tailwind Classes افتراضية مكسورة

في Tailwind v4، بعض الـ classes اتغيرت:

```css
/* ✅ صح في v4 */
bg-linear-to-br      /* بدل bg-gradient-to-br */
border-t-3           /* border thickness */

/* ✅ صح — استخدم oklch للألوان في inline styles */
style={{ background: "oklch(0.35 0.18 292 / 0.18)" }}

/* ✅ استخدم CSS variables */
bg-primary/10        /* primary مع opacity */
text-primary         
border-border/60
bg-card/40
bg-muted/30
```

---

## 🟡 قاعدة الـ Motion والـ Animation

### استخدم الـ tokens الموجودة — لا تخترع قيم جديدة
```ts
import { motionDuration, motionEase, revealDistance } from "@/lib/motion"

// motionDuration.fast   = 0.2
// motionDuration.base   = 0.3
// motionDuration.slow   = 0.4
// motionDuration.reveal = 0.48
// motionEase.standard   = [0.22, 1, 0.36, 1]
// revealDistance        = 12
```

### استخدم `Reveal` للـ scroll animations
```tsx
import Reveal from "@/features/animations/motion/Reveal"

// Props متاحة:
// delay?: number    ← ابدأ من 0, زوِّد بـ 0.05 أو 0.06 لكل element
// y?: number        ← default: 12 (revealDistance)
// fromScale?: number
// className?: string
// once?: boolean    ← default: true

<Reveal delay={0.04}>
  <YourComponent />
</Reveal>
```

### استخدم `StaggerContainer` + `StaggerItem` لـ lists
```tsx
import { StaggerContainer, StaggerItem } from "@/features/animations/motion/Stagger"
```

### ❌ لا تضيف animations ثقيلة أو مشتتة
- لا `whileHover` على كل شيء
- لا `AnimatePresence` إلا لو ضروري جداً
- لا loop animations إلا في الـ homepage components الموجودة

---

## 🟡 قاعدة الـ Styling

### الـ Design System — الألوان المتاحة
```
text-foreground         ← النص الأساسي
text-muted-foreground   ← النص الثانوي / descriptions
text-primary            ← اللون الأساسي (بنفسجي)
bg-background           ← الخلفية
bg-card/40              ← cards بشفافية
bg-primary/5..10..15    ← purple tint خفيف
border-border/60        ← حدود خفيفة
border-primary/20       ← حدود بـ primary color
```

### نمط الـ Cards في هذا المشروع
```tsx
// ✅ النمط الصح للـ cards
<div className="rounded-xl border border-border/60 bg-card/40 p-5 space-y-3">
  ...
</div>

// ✅ للـ CTA blocks
<div className="rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center">
  ...
</div>

// ✅ للـ highlighted sections
<div className="rounded-xl border border-amber-400/15 bg-amber-400/5 p-6">
  ...
</div>
```

### الـ cn() function
```tsx
import { cn } from "@/lib/cn"

// استخدمها دايماً لو فيه conditional classes
<div className={cn("base-classes", isActive && "active-class", className)}>
```

---

## 🟡 قاعدة الـ Component Structure

### نمط الملف الصح
```tsx
// 1. "use client" لو محتاج (وإلا متحطهاش)
// 2. React imports
// 3. Next.js imports (Link, Image)
// 4. Third-party (lucide, framer-motion)
// 5. Internal components
// 6. Internal lib/utils
// 7. Types
// 8. Constants (static data للـ component)
// 9. Sub-components (لو صغيرة ومتعلقة)
// 10. Main export function

"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/layout/Container"
import Reveal from "@/features/animations/motion/Reveal"
import { cn } from "@/lib/cn"
import type { MyProps } from "@/types/my-types"

const STATIC_DATA = [...] // static arrays/objects فوق الـ component

function SubComponent() { ... } // sub-components قبل الـ main export

export function MainComponent({ prop }: MyProps) {
  return (...)
}
```

---

## 🟡 قاعدة المحتوى والـ Accessibility

- كل `<img>` و `<Image>` لازم يكون فيها `alt` مناسب
- الـ decorative elements: `aria-hidden="true"`
- الـ interactive elements: `type="button"` على الـ buttons اللي مش submit
- استخدم semantic HTML: `<section>`, `<article>`, `<nav>`, `<aside>`, `<header>`
- الـ icons standalone: `aria-label` أو نص مخفي `<span className="sr-only">`

---

## 🟢 نمط الـ Convex (للـ Admin فقط)

```tsx
// في الـ client components اللي بتستخدم Convex:
"use client"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"

// Query
const data = useQuery(api.myTable.list) ?? []

// Mutation
const doSomething = useMutation(api.myTable.create)
await doSomething({ field: "value" })
```

---

## 🟢 Spacing والـ Section Rhythm

هذا المشروع يستخدم نظام spacing ثابت:

```
بين الـ sections داخل صفحة:    space-y-24 md:space-y-32
بين عناصر داخل section:        space-y-6 أو space-y-8
padding للصفحة:                py-16 md:py-24
padding للـ cards:              p-4 أو p-5 أو p-6
gap للـ grids:                  gap-4 (cards) · gap-6 (larger)
```

---

## 🟢 الـ Container

**دايماً** استخدم `Container` للـ page-level wrappers:

```tsx
import { Container } from "@/components/layout/Container"

// max-w-7xl — للصفحات العامة
<Container>...</Container>

// max-w-5xl — للصفحات المركّزة (About)
<Container>
  <div className="mx-auto max-w-5xl">...</div>
</Container>
```

---

## ✅ Checklist قبل ما تخلص أي task

- [ ] الـ TypeScript compile بدون errors؟
- [ ] استخدمت `@/` في كل الـ imports؟
- [ ] ما في `"use client"` إلا في الـ components اللي فعلاً محتاجها؟
- [ ] ما في packages جديدة اتثبتت؟
- [ ] ما لمست أي ملف من قائمة الـ forbidden files؟
- [ ] كل `<Image>` فيها `alt` و `sizes`؟
- [ ] الـ spacing بيتبع النظام الموجود؟
- [ ] الـ Reveal delays بتبدأ من 0.04 وبتزيد بـ 0.05-0.06؟
