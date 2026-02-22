export const aboutHero = {
  title: "Engineering Structured, Performance-Driven Web Systems",
  description:
    "I design scalable frontend architectures with server-first thinking, controlled rendering, and measurable performance decisions.",
}

export const engineeringPhilosophy = [
  {
    number: "01",
    title: "Architecture Before Implementation",
    description:
      "I define boundaries, rendering strategy, and data flow before writing components to keep systems predictable and maintainable.",
  },
  {
    number: "02",
    title: "Performance Is a Product Feature",
    description:
      "Latency, hydration cost, and runtime weight are treated as first-class product constraints from day one.",
  },
  {
    number: "03",
    title: "Decision Logs Over Assumptions",
    description:
      "I optimize for clarity in tradeoffs so teams can evolve confidently without rewriting foundational layers.",
  },
]

export const corePillars = [
  {
    title: "Frontend Architecture",
    points: [
      "Next.js App Router",
      "Server / Client boundary control",
      "Feature-based structuring",
      "Static-first architecture",
    ],
  },
  {
    title: "Delivery Discipline",
    points: [
      "Strict typing at boundaries",
      "Small, reversible refactors",
      "Testable module seams",
      "Low-regression releases",
    ],
  },
  {
    title: "Performance Engineering",
    points: [
      "Measured bundle decisions",
      "Minimal hydration strategy",
      "Render path optimization",
      "Web vitals accountability",
    ],
  },
]

export const architectureDives = [
  {
    id: "habit-tracker",
    label: "Habit Tracker",
    problem:
      "UI responsiveness degraded as interactive features increased across daily workflows.",
    decision:
      "Adopted server-first rendering with focused client islands for high-interaction controls.",
    impact:
      "Reduced unnecessary hydration while keeping interactions fast under realistic usage.",
  },
  {
    id: "portfolio-refactor",
    label: "Portfolio Refactor",
    problem:
      "Data and UI logic were coupled, making iteration risky and slowing implementation quality.",
    decision:
      "Separated static data, MDX content, and feature-level server modules with strict boundaries.",
    impact:
      "Improved maintainability and enabled predictable route-level rendering behavior.",
  },
  {
    id: "animation-system",
    label: "Animation System",
    problem:
      "Motion patterns were fragmented and difficult to reason about across components.",
    decision:
      "Isolated animation logic into dedicated feature modules with constrained usage points.",
    impact:
      "Preserved visual quality while reducing client overhead and integration complexity.",
  },
]

export const realSystemsBuilt = [
  {
    title: "Habit Tracker",
    summary: "Real-time system with indexed query strategy and predictable data updates.",
  },
  {
    title: "Medical AI Platform",
    summary: "Role-based system with AI MRI integration and controlled workflow access.",
  },
  {
    title: "Portfolio System",
    summary: "Static-first refactor with strict data/UI separation and server-first routing.",
  },
]

export const disciplineNarrative =
  "I optimize for long-term system integrity. That means explicit boundaries, clear rendering contracts, and implementation decisions that scale with product complexity. The goal is not visual noise or temporary velocity. The goal is sustainable engineering quality under real constraints."

