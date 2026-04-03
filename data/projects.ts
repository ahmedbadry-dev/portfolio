export type ProjectMeta = {
  slug: string
  title: string
  type: 'fullstack' | 'frontend' | 'system' | 'SPA'
  tags: string[]
  stack: string[]
  status: 'production' | 'in-progress' | 'Completed'
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
  selectedWork: {
    main: string
    aside: string
  }
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
  links: {
    liveDemo: string
    gitHub: string
  }
  imageCount?: number
}

export type Project = {
  slug: string
  title: string
  description: string
  tags: string[]
  stack: string[]
  type: ProjectMeta['type']
  status: ProjectMeta['status']
  lighthouse?: number
  ttfb?: number
  imageCount?: number
  screenshots?: ProjectScreenshots
  links: {
    liveDemo: string
    gitHub: string
  }
}

const projectRecords: ProjectRecord[] = [
  {
    meta: {
      slug: 'z-social-platform',
      title: 'Z-Social',
      type: 'fullstack',
      tags: [
        'Next.js',
        'Fullstack',
        'Realtime',
        'Social Graph',
        'TypeScript',
        'App Router',
      ],
      stack: [
        'Next.js 16',
        'TypeScript',
        'Convex',
        'Better Auth',
        'Tailwind CSS v4',
        'UploadThing',
        'Zustand',
        'Zod',
      ],
      status: 'production',
    },
    shortDescription:
      'Z-Social is a full-stack Next.js 16 + Convex social platform that implements authenticated real-time feed, messaging, notifications, follow-requests for private accounts, and search over posts/usernames.',
    seo: {
      title: 'Z-Social Case Study',
      description:
        'A technical case study of a Next.js 16 and Convex social network with real-time feed, messaging, notifications, and privacy-aware follow workflows.',
    },
    details: {
      highlights: [
        'Implemented a hybrid feed system that combines follow-based pagination with discovery injection from friends-of-friends and engagement-ranked strangers.',
        'Built real-time direct messaging with optimistic UI, image upload flow, cancel/retry handling, read-state updates, typing status, and online presence.',
        'Implemented privacy-aware social graph behavior with private accounts, follow requests (pending/accepted/rejected), and conditional profile/post visibility.',
      ],
      architecture: {
        rendering:
          'The app uses Next.js App Router with server-rendered route shells and metadata, then hydrates client feature modules that subscribe to live Convex queries.',
        data: 'Convex is used as the backend/data layer with typed schema tables, indexes/search indexes, and query/mutation functions consumed via `useQuery`, `useMutation`, and `usePaginatedQuery`.',
        domain:
          'Domain logic is organized in Convex modules (`posts`, `comments`, `follows`, `messages`, `notifications`, `users`) covering feed ranking, reactions, mentions, follow-requests, messaging, and profile/privacy rules.',
        performance:
          'The app preloads critical queries on the server (`preloadAuthQuery`), paginates heavy lists with infinite scroll, and defers non-critical UI (dialogs) through dynamic imports.',
      },
      complexity: [
        'Designing and implementing a multi-tier feed algorithm (follow feed + discovery candidates + social context labels + weighted trending score) while preserving paginated UX.',
        'Maintaining a reliable optimistic messaging pipeline for text/image messages with upload lifecycle, reconciliation against real-time query results, and cancel/retry behavior.',
      ],
      security: [
        'Access control is enforced both at routing and backend levels using `proxy.ts` cookie checks and Convex auth guards (`requireAuth`/`requireAuthUserId`) in mutations.',
        'Authorization checks are applied to sensitive mutations (e.g., editing/deleting posts, deleting notifications) and upload routes require authenticated middleware in UploadThing.',
      ],
      lessons: [
        'Optimistic interfaces must include reconciliation logic against authoritative real-time data to avoid duplicated or stale UI states.',
        'Privacy features require consistent cross-module enforcement; account privacy and online-status settings must be respected by profile visibility, follow flows, and presence queries.',
      ],
    },
    metrics: {
      lighthouse: 95,
      ttfb: 520,
    },
    imageCount: 7,
    screenshots: {
      desktop: [
        '/screenshots/z-social-platform/crs-1.png',
        '/screenshots/z-social-platform/crs-2.png',
        '/screenshots/z-social-platform/crs-3.png',
        '/screenshots/z-social-platform/crs-4.png',
        '/screenshots/z-social-platform/crs-5.png',
        '/screenshots/z-social-platform/crs-6.png',
        '/screenshots/z-social-platform/crs-7.png',
        '/screenshots/z-social-platform/crs-8.png',
        '/screenshots/z-social-platform/crs-9.png',
        '/screenshots/z-social-platform/crs-10.png',
      ],
      mobile: [
        '/screenshots/z-social-platform/mobile/m-explore.png',
        '/screenshots/z-social-platform/mobile/m-profile.png',
        '/screenshots/z-social-platform/mobile/m-feed.png',
      ],
      selectedWork: {
        main: '/screenshots/z-social-platform/selected-work/s-work.png',
        aside: '',
      },
    },
    links: {
      liveDemo: 'https://z-social-rouge.vercel.app',
      gitHub: 'https://github.com/ahmedbadry-dev/z-social',
    },
  },
  {
    meta: {
      slug: 'habit-tracker',
      title: 'Habit Tracker',
      type: 'fullstack',
      tags: ['Next.js', 'Fullstack', 'TypeScript'],
      stack: [
        'Next.js 16',
        'TypeScript',
        'Convex',
        'Better Auth',
        'Tailwind CSS v4',
      ],
      status: 'production',
    },
    shortDescription:
      'Real-time habit tracking platform with server-side streak computation and optimistic UI.',
    seo: {
      title: 'Habit Tracker Case Study',
      description:
        'Server-authoritative habit tracking system with realtime UX and scalable data modeling.',
    },
    details: {
      highlights: [
        'Hybrid server/client rendering with auth-aware preloading',
        'Server-authoritative streak and completion logic',
        'Realtime updates with optimistic interactions',
      ],
      architecture: {
        rendering:
          'App Router with selective client components and Suspense boundaries',
        data: 'Convex schema using userId, habitId, and dateKey-based query patterns',
        domain:
          'Daily and weekly habits supporting both boolean and numeric completion models',
        performance:
          'Bounded history reads with optimistic mutations and lightweight animation',
      },
      complexity: [
        'Weekly completion derived from date-window aggregation',
        'Accurate longest/current streak calculation across modes',
      ],
      security: [
        'Ownership checks on all mutations',
        'Validator-first input constraints in forms and Convex functions',
      ],
      lessons: [
        'Schema design should follow query patterns rather than UI shape',
        'Optimistic UX is safest when business rules stay server-side',
      ],
    },
    metrics: {
      lighthouse: 90,
      ttfb: 420,
    },
    imageCount: 12,
    screenshots: {
      desktop: [
        '/screenshots/habit-tracker/crs-1.png',
        '/screenshots/habit-tracker/crs-2.png',
        '/screenshots/habit-tracker/crs-3.png',
        '/screenshots/habit-tracker/crs-4.png',
        '/screenshots/habit-tracker/crs-5.png',
        '/screenshots/habit-tracker/crs-6.png',
        '/screenshots/habit-tracker/crs-7.png',
      ],
      mobile: [
        '/screenshots/habit-tracker/mobile/mob-1.png',
        '/screenshots/habit-tracker/mobile/mob-2.png',
        '/screenshots/habit-tracker/mobile/mob-3.png',
        '/screenshots/habit-tracker/mobile/mob-4.png',
        '/screenshots/habit-tracker/mobile/mob-5.png',
      ],
      selectedWork: {
        main: '/screenshots/habit-tracker/selected-work/Gemini_Generated_Image_3qali73qali73qal.png',
        aside: '/screenshots/habit-tracker/selected-work/as.png',
      },
    },
    links: {
      liveDemo: 'https://habit-tracker-ah.vercel.app',
      gitHub: 'https://github.com/ahmedbadry-dev/Habit-Tracker',
    },
  },
  {
    meta: {
      slug: 'splitter',
      title: 'Splitter',
      type: 'frontend',
      tags: ['TypeScript', 'Architecture', 'Algorithm'],
      stack: [
        'TypeScript (Strict Mode)',
        'Vite 7',
        'Tailwind CSS v4',
        'Vanilla DOM APIs',
      ],
      status: 'production',
    },
    shortDescription:
      'Client-side expense settlement engine with deterministic, float-safe debt simplification.',
    seo: {
      title: 'Splitter Case Study',
      description:
        'Expense splitting system using layered architecture and a two-pointer settlement algorithm.',
    },
    details: {
      highlights: [
        'Service-layer settlement engine with sorted two-pointer resolution',
        'Map-based indexing for O(1) identity checks and lookups',
        'Float tolerance safeguards for deterministic financial output',
      ],
      architecture: {
        rendering: 'Client-side DOM rendering on a static HTML shell',
        data: 'In-memory entities with runtime validation at model boundaries',
        domain:
          'Expense tracking, net-balance computation, and settlement simplification',
        performance:
          'DocumentFragment batching and small O(n) passes per settlement run',
      },
      complexity: [
        'Settlement minimization with sorted creditor/debtor pointers',
        'Preventing precision residue in repeated calculations',
      ],
      security: [
        'Input trimming and duplicate identity prevention',
        'Defensive DOM resolution and UI-level error containment',
      ],
      lessons: [
        'Financial logic needs explicit numeric tolerance design',
        'Layered boundaries improve reliability even in small apps',
      ],
    },
    imageCount: 6,
    screenshots: {
      desktop: [
        '/screenshots/splitter/crs-1.png',
        '/screenshots/splitter/crs-2.png',
      ],
      mobile: [
        '/screenshots/splitter/mobile/mob-1.png',
        '/screenshots/splitter/mobile/mob-2.png',
        '/screenshots/splitter/mobile/mob-3.png',
        '/screenshots/splitter/mobile/mob-4.png',
      ],
      selectedWork: {
        main: '/screenshots/splitter/selected-work/Gemini_Generated_Image_u55tuiu55tuiu55t.png',
        aside: '/screenshots/splitter/selected-work/as.png',
      },
    },
    links: {
      liveDemo: 'https://ahmedbadry-dev.github.io/Splitter-App',
      gitHub: 'https://github.com/ahmedbadry-dev/Splitter-App',
    },
  },
  {
    meta: {
      slug: 'product-feedback',
      title: 'Product Feedback',
      type: 'frontend',
      tags: ['React', 'Redux', 'SPA'],
      stack: [
        'React 19',
        'Redux Toolkit',
        'React Router DOM 7',
        'Tailwind CSS v4',
        'Vite 7',
      ],
      status: 'production',
    },
    shortDescription:
      'SPA feedback lifecycle system with reducer-driven consistency across suggestions and comments.',
    seo: {
      title: 'Product Feedback Case Study',
      description:
        'Redux-powered feedback board with route-driven UX flows and deterministic state transitions.',
    },
    details: {
      highlights: [
        'Centralized reducer logic for cross-entity consistency',
        'Route-driven modal UX for add/edit lifecycle',
        'Single-pass roadmap aggregation and memoized derivations',
      ],
      architecture: {
        rendering: 'Client-side SPA with nested routing',
        data: 'Denormalized local state with keyed comment lookup by suggestionId',
        domain: 'Suggestion, comment, and voting lifecycle management',
        performance:
          'useMemo/useCallback optimization on derived and handler-heavy flows',
      },
      complexity: [
        'Maintaining relational consistency without backend authority',
        'Keeping route state and entity updates synchronized',
      ],
      security: [
        'Required field and length validation for user input',
        'Route guarding and destructive-action confirmation',
      ],
      lessons: [
        'Denormalized state can speed reads but raises consistency overhead',
        'Route-driven interaction can replace global UI state cleanly',
      ],
    },
    imageCount: 9,
    screenshots: {
      desktop: [
        '/screenshots/product-feedback/crs-1.png',
        '/screenshots/product-feedback/crs-2.png',
        '/screenshots/product-feedback/crs-3.png',
        '/screenshots/product-feedback/crs-4.png',
      ],
      mobile: [
        '/screenshots/product-feedback/mobile/mob-1.png',
        '/screenshots/product-feedback/mobile/mob-2.png',
        '/screenshots/product-feedback/mobile/mob-3.png',
        '/screenshots/product-feedback/mobile/mob-4.png',
        '/screenshots/product-feedback/mobile/mob-5.png',
      ],
      selectedWork: {
        main: '/screenshots/product-feedback/selected-work/Gemini_Generated_Image_4qeuen4qeuen4qeu.png',
        aside: '/screenshots/product-feedback/selected-work/as.png',
      },
    },
    links: {
      liveDemo: ' https://ahmedbadry-dev.github.io/productFeedBack',
      gitHub: 'https://github.com/ahmedbadry-dev/productFeedBack',
    },
  },
  {
    meta: {
      slug: 'assembly-endgame',
      title: 'Assembly Endgame',
      type: 'frontend',
      tags: ['React', 'TypeScript', 'Game'],
      stack: ['React 19', 'TypeScript', 'Tailwind CSS v4', 'Vite 7'],
      status: 'production',
    },
    shortDescription:
      'Hangman-style browser game with deterministic state transitions and synchronized visual feedback.',
    seo: {
      title: 'Assembly Endgame Case Study',
      description:
        'React + TypeScript word game with custom-hook state modeling and win/loss flow control.',
    },
    details: {
      highlights: [
        'Custom hook encapsulating complete game rules and transitions',
        'Input lock and duplicate-guess guards for deterministic gameplay',
        'Life overlay synchronization with terminal-state logic',
      ],
      architecture: {
        rendering:
          'Client-side UI with component-driven game board and keyboard',
        data: 'Static word and keyboard datasets with one in-memory game state',
        domain:
          'Guess validation, lives management, and terminal-state derivation',
        performance:
          'Single state object updates and conditional celebration rendering',
      },
      complexity: [
        'Maintaining deterministic transitions under repeated inputs',
        'Synchronizing visual life indicators with gameplay outcomes',
      ],
      security: [
        'Duplicate guess prevention and terminal-state input locking',
        'Controlled input surface with disabled interactions',
      ],
      lessons: [
        'Domain logic is clearer when isolated in a dedicated hook',
        'Derived state reduces bug-prone flag synchronization',
      ],
    },
    imageCount: 7,
    screenshots: {
      desktop: [
        '/screenshots/assembly-endgame/crs-1.png',
        '/screenshots/assembly-endgame/crs-2.png',
        '/screenshots/assembly-endgame/crs-3.png',
        '/screenshots/assembly-endgame/crs-4.png',
      ],
      mobile: [
        '/screenshots/assembly-endgame/mobile/mob-1.png',
        '/screenshots/assembly-endgame/mobile/mob-2.png',
        '/screenshots/assembly-endgame/mobile/mob-3.png',
      ],
      selectedWork: {
        main: '',
        aside: '',
      },
    },
    links: {
      liveDemo: 'https://ahmedbadry-dev.github.io/assembly-endgame',
      gitHub: 'https://github.com/ahmedbadry-dev/assembly-endgame',
    },
  },
  {
    meta: {
      slug: 'tenzies',
      title: 'Tenzies',
      type: 'frontend',
      tags: ['React', 'TypeScript', 'Game'],
      stack: ['React 19', 'TypeScript (Strict)', 'Tailwind CSS v4', 'Vite 7'],
      status: 'production',
    },
    shortDescription:
      'Interactive dice game with selective reroll logic and strict value-lock rules.',
    seo: {
      title: 'Tenzies Case Study',
      description:
        'React dice game focused on deterministic rule enforcement and immutable state updates.',
    },
    details: {
      highlights: [
        'Selective reroll preserving locked dice across turns',
        'First-lock value enforcement for subsequent selections',
        'Win-state derivation using immutable array transformations',
      ],
      architecture: {
        rendering:
          'Client-side React composition with small presentational modules',
        data: 'Fixed-size dice array seeded locally and updated immutably',
        domain: 'Lock-and-roll game rules with replay lifecycle support',
        performance:
          'Small O(n) operations with functional updates preventing stale reads',
      },
      complexity: [
        'Enforcing value-match constraints after first user lock',
        'Keeping replay reset and win derivation fully deterministic',
      ],
      security: [
        'Semantic button-driven interactions only',
        'Stable ID-based rendering and typed props',
      ],
      lessons: [
        'Functional updates make transition logic safer',
        'Simple data modeling can still support strict domain rules',
      ],
    },
    imageCount: 6,
    screenshots: {
      desktop: [
        '/screenshots/tenzies/crs-1.png',
        '/screenshots/tenzies/crs-2.png',
        '/screenshots/tenzies/crs-3.png',
      ],
      mobile: [
        '/screenshots/tenzies/mobile/mob-1.png',
        '/screenshots/tenzies/mobile/mob-2.png',
        '/screenshots/tenzies/mobile/mob-3.png',
      ],
      selectedWork: {
        main: '',
        aside: '',
      },
    },
    links: {
      liveDemo: ' https://ahmedbadry-dev.github.io/Tenzies',
      gitHub: 'https://github.com/ahmedbadry-dev/Tenzies',
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
    links: project.links,
  }
}

export const projects: Project[] = projectRecords.map(toProjectListItem)

export const projectTags = [
  'All',
  'React',
  'Next.js',
  'Fullstack',
  'TypeScript',
  'Redux',
  'SPA',
  'Game',
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
