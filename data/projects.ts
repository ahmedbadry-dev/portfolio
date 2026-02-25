export type ProjectMeta = {
  slug: string
  title: string
  type: "fullstack" | "frontend" | "system" | "SPA"
  tags: string[]
  stack: string[]
  status: "production" | "in-progress" | "Completed"
}

export type ProjectDetails = {
  highlights: string[]
  architecture: {
    rendering: string
    data: string
    domain: string
    performance: string
  }
  complexity: string[]
  security: string[]
  lessons: string[]
}

export type ProjectMetrics = {
  lighthouse?: number
  ttfb?: number
}

export type ProjectScreenshots = {
  desktop: string[]
  mobile: string[]
}

type ProjectSeo = {
  title: string
  description: string
}

export type ProjectRecord = {
  meta: ProjectMeta
  shortDescription: string
  seo: ProjectSeo
  details: ProjectDetails
  metrics?: ProjectMetrics
  screenshots: ProjectScreenshots
  imageCount?: number
}

export type Project = {
  slug: string
  title: string
  description: string
  tags: string[]
  stack: string[]
  type: ProjectMeta["type"]
  status: ProjectMeta["status"]
  lighthouse?: number
  ttfb?: number
  imageCount?: number
  screenshots?: ProjectScreenshots
}

const projectRecords: ProjectRecord[] = [
  {
    meta: {
      slug: "habit-tracker",
      title: "Habit Tracker",
      type: "fullstack",
      tags: ["Next.js", "Fullstack", "TypeScript"],
      stack: [
        "Next.js 16",
        "TypeScript",
        "Convex",
        "Better Auth",
        "Tailwind CSS v4",
      ],
      status: "production",
    },
    shortDescription:
      "Real-time habit tracking platform with server-side streak computation and optimistic UI.",
    seo: {
      title: "Habit Tracker Case Study",
      description:
        "Server-authoritative habit tracking system with realtime UX and scalable data modeling.",
    },
    details: {
      highlights: [
        "Hybrid server/client rendering with auth-aware preloading",
        "Server-authoritative streak and completion logic",
        "Realtime updates with optimistic interactions",
      ],
      architecture: {
        rendering: "App Router with selective client components and Suspense boundaries",
        data: "Convex schema using userId, habitId, and dateKey-based query patterns",
        domain:
          "Daily and weekly habits supporting both boolean and numeric completion models",
        performance: "Bounded history reads with optimistic mutations and lightweight animation",
      },
      complexity: [
        "Weekly completion derived from date-window aggregation",
        "Accurate longest/current streak calculation across modes",
      ],
      security: [
        "Ownership checks on all mutations",
        "Validator-first input constraints in forms and Convex functions",
      ],
      lessons: [
        "Schema design should follow query patterns rather than UI shape",
        "Optimistic UX is safest when business rules stay server-side",
      ],
    },
    metrics: {
      lighthouse: 90,
      ttfb: 120,
    },
    imageCount: 12,
    screenshots: {
      desktop: [
        "/screenshots/habit-tracker/crs-1.png",
        "/screenshots/habit-tracker/crs-2.png",
        "/screenshots/habit-tracker/crs-3.png",
        "/screenshots/habit-tracker/crs-4.png",
        "/screenshots/habit-tracker/crs-5.png",
        "/screenshots/habit-tracker/crs-6.png",
        "/screenshots/habit-tracker/crs-7.png",
      ],
      mobile: [
        "/screenshots/habit-tracker/mobile/mob-1.png",
        "/screenshots/habit-tracker/mobile/mob-2.png",
        "/screenshots/habit-tracker/mobile/mob-3.png",
        "/screenshots/habit-tracker/mobile/mob-4.png",
        "/screenshots/habit-tracker/mobile/mob-5.png",
      ],
    },
  },
  {
    meta: {
      slug: "splitter",
      title: "Splitter",
      type: "frontend",
      tags: ["TypeScript", "Architecture", "Algorithm"],
      stack: [
        "TypeScript (Strict Mode)",
        "Vite 7",
        "Tailwind CSS v4",
        "Vanilla DOM APIs",
      ],
      status: "production",
    },
    shortDescription:
      "Client-side expense settlement engine with deterministic, float-safe debt simplification.",
    seo: {
      title: "Splitter Case Study",
      description:
        "Expense splitting system using layered architecture and a two-pointer settlement algorithm.",
    },
    details: {
      highlights: [
        "Service-layer settlement engine with sorted two-pointer resolution",
        "Map-based indexing for O(1) identity checks and lookups",
        "Float tolerance safeguards for deterministic financial output",
      ],
      architecture: {
        rendering: "Client-side DOM rendering on a static HTML shell",
        data: "In-memory entities with runtime validation at model boundaries",
        domain:
          "Expense tracking, net-balance computation, and settlement simplification",
        performance:
          "DocumentFragment batching and small O(n) passes per settlement run",
      },
      complexity: [
        "Settlement minimization with sorted creditor/debtor pointers",
        "Preventing precision residue in repeated calculations",
      ],
      security: [
        "Input trimming and duplicate identity prevention",
        "Defensive DOM resolution and UI-level error containment",
      ],
      lessons: [
        "Financial logic needs explicit numeric tolerance design",
        "Layered boundaries improve reliability even in small apps",
      ],
    },
    imageCount: 6,
    screenshots: {
      desktop: [
        "/screenshots/splitter/crs-1.png",
        "/screenshots/splitter/crs-2.png",
      ],
      mobile: [
        "/screenshots/splitter/mobile/mob-1.png",
        "/screenshots/splitter/mobile/mob-2.png",
        "/screenshots/splitter/mobile/mob-3.png",
        "/screenshots/splitter/mobile/mob-4.png",
      ],
    },
  },
  {
    meta: {
      slug: "product-feedback",
      title: "Product Feedback",
      type: "frontend",
      tags: ["React", "Redux", "SPA"],
      stack: [
        "React 19",
        "Redux Toolkit",
        "React Router DOM 7",
        "Tailwind CSS v4",
        "Vite 7",
      ],
      status: "production",
    },
    shortDescription:
      "SPA feedback lifecycle system with reducer-driven consistency across suggestions and comments.",
    seo: {
      title: "Product Feedback Case Study",
      description:
        "Redux-powered feedback board with route-driven UX flows and deterministic state transitions.",
    },
    details: {
      highlights: [
        "Centralized reducer logic for cross-entity consistency",
        "Route-driven modal UX for add/edit lifecycle",
        "Single-pass roadmap aggregation and memoized derivations",
      ],
      architecture: {
        rendering: "Client-side SPA with nested routing",
        data: "Denormalized local state with keyed comment lookup by suggestionId",
        domain: "Suggestion, comment, and voting lifecycle management",
        performance: "useMemo/useCallback optimization on derived and handler-heavy flows",
      },
      complexity: [
        "Maintaining relational consistency without backend authority",
        "Keeping route state and entity updates synchronized",
      ],
      security: [
        "Required field and length validation for user input",
        "Route guarding and destructive-action confirmation",
      ],
      lessons: [
        "Denormalized state can speed reads but raises consistency overhead",
        "Route-driven interaction can replace global UI state cleanly",
      ],
    },
    imageCount: 9,
    screenshots: {
      desktop: [
        "/screenshots/prodact-feadback/crs-1.png",
        "/screenshots/prodact-feadback/crs-2.png",
        "/screenshots/prodact-feadback/crs-3.png",
        "/screenshots/prodact-feadback/crs-4.png",
      ],
      mobile: [
        "/screenshots/prodact-feadback/mobile/mob-1.png",
        "/screenshots/prodact-feadback/mobile/mob-2.png",
        "/screenshots/prodact-feadback/mobile/mob-3.png",
        "/screenshots/prodact-feadback/mobile/mob-4.png",
        "/screenshots/prodact-feadback/mobile/mob-5.png",
      ],
    },
  },
  {
    meta: {
      slug: "assembly-endgame",
      title: "Assembly Endgame",
      type: "frontend",
      tags: ["React", "TypeScript", "Game"],
      stack: ["React 19", "TypeScript", "Tailwind CSS v4", "Vite 7"],
      status: "production",
    },
    shortDescription:
      "Hangman-style browser game with deterministic state transitions and synchronized visual feedback.",
    seo: {
      title: "Assembly Endgame Case Study",
      description:
        "React + TypeScript word game with custom-hook state modeling and win/loss flow control.",
    },
    details: {
      highlights: [
        "Custom hook encapsulating complete game rules and transitions",
        "Input lock and duplicate-guess guards for deterministic gameplay",
        "Life overlay synchronization with terminal-state logic",
      ],
      architecture: {
        rendering: "Client-side UI with component-driven game board and keyboard",
        data: "Static word and keyboard datasets with one in-memory game state",
        domain: "Guess validation, lives management, and terminal-state derivation",
        performance: "Single state object updates and conditional celebration rendering",
      },
      complexity: [
        "Maintaining deterministic transitions under repeated inputs",
        "Synchronizing visual life indicators with gameplay outcomes",
      ],
      security: [
        "Duplicate guess prevention and terminal-state input locking",
        "Controlled input surface with disabled interactions",
      ],
      lessons: [
        "Domain logic is clearer when isolated in a dedicated hook",
        "Derived state reduces bug-prone flag synchronization",
      ],
    },
    imageCount: 7,
    screenshots: {
      desktop: [
        "/screenshots/assembly-endgame/crs-1.png",
        "/screenshots/assembly-endgame/crs-2.png",
        "/screenshots/assembly-endgame/crs-3.png",
        "/screenshots/assembly-endgame/crs-4.png",
      ],
      mobile: [
        "/screenshots/assembly-endgame/mobile/mob-1.png",
        "/screenshots/assembly-endgame/mobile/mob-2.png",
        "/screenshots/assembly-endgame/mobile/mob-3.png",
      ],
    },
  },
  {
    meta: {
      slug: "tenzies",
      title: "Tenzies",
      type: "frontend",
      tags: ["React", "TypeScript", "Game"],
      stack: ["React 19", "TypeScript (Strict)", "Tailwind CSS v4", "Vite 7"],
      status: "production",
    },
    shortDescription:
      "Interactive dice game with selective reroll logic and strict value-lock rules.",
    seo: {
      title: "Tenzies Case Study",
      description:
        "React dice game focused on deterministic rule enforcement and immutable state updates.",
    },
    details: {
      highlights: [
        "Selective reroll preserving locked dice across turns",
        "First-lock value enforcement for subsequent selections",
        "Win-state derivation using immutable array transformations",
      ],
      architecture: {
        rendering: "Client-side React composition with small presentational modules",
        data: "Fixed-size dice array seeded locally and updated immutably",
        domain: "Lock-and-roll game rules with replay lifecycle support",
        performance: "Small O(n) operations with functional updates preventing stale reads",
      },
      complexity: [
        "Enforcing value-match constraints after first user lock",
        "Keeping replay reset and win derivation fully deterministic",
      ],
      security: [
        "Semantic button-driven interactions only",
        "Stable ID-based rendering and typed props",
      ],
      lessons: [
        "Functional updates make transition logic safer",
        "Simple data modeling can still support strict domain rules",
      ],
    },
    imageCount: 6,
    screenshots: {
      desktop: [
        "/screenshots/tenzies/crs-1.png",
        "/screenshots/tenzies/crs-2.png",
        "/screenshots/tenzies/crs-3.png",
      ],
      mobile: [
        "/screenshots/tenzies/mobile/mob-1.png",
        "/screenshots/tenzies/mobile/mob-2.png",
        "/screenshots/tenzies/mobile/mob-3.png",
      ],
    },
  },
]

function toProjectListItem(project: ProjectRecord): Project {
  return {
    slug: project.meta.slug,
    title: project.meta.title,
    description: project.shortDescription,
    tags: project.meta.tags,
    stack: project.meta.stack,
    type: project.meta.type,
    status: project.meta.status,
    lighthouse: project.metrics?.lighthouse,
    ttfb: project.metrics?.ttfb,
    imageCount: project.imageCount,
    screenshots: project.screenshots,
  }
}

export const projects: Project[] = projectRecords.map(toProjectListItem)

export const projectTags = [
  "All",
  "React",
  "Next.js",
  "Fullstack",
  "TypeScript",
  "Redux",
  "SPA",
  "Game",
]

export function getProjectBySlug(slug: string): ProjectRecord | null {
  return projectRecords.find((project) => project.meta.slug === slug) ?? null
}

export function getProjectSlugs(): string[] {
  return projectRecords.map((project) => project.meta.slug)
}

export function getProjectListItemBySlug(slug: string): Project | null {
  const project = getProjectBySlug(slug)
  return project ? toProjectListItem(project) : null
}
