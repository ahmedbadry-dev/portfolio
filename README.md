# AB.dev Portfolio

Personal portfolio built with Next.js App Router, React, TypeScript, Tailwind, and Convex.

## Current Runtime Architecture

### Public project reads
- Public pages read project data through `services/projectService.ts` and `repositories/projectRepository.ts`.
- Canonical source is Convex when available (`PROJECTS_READ_SOURCE=auto|convex`), with explicit local fallback.
- Local fallback remains active intentionally when Convex is unavailable or returns invalid project payloads.

### Admin project management
- Admin CRUD is exposed only through protected server routes:
  - `GET/POST /api/admin/projects`
  - `PATCH/DELETE /api/admin/projects/[id]`
- Client admin UI never calls Convex admin mutations directly.
- Server routes validate input with canonical schema, then call Convex with `CONVEX_ADMIN_MUTATION_KEY`.

### Admin protection model
- Admin pages and `/api/admin/*` are guarded by:
  - request proxy guard (`proxy.ts`)
  - route-level guard (`requireAdminRequest`)
- If admin auth env vars are missing, admin access fails closed.

### Case-study rendering compatibility
- Legacy MDX case studies are loaded from `content/projects/*.mdx`.
- Project detail supports `caseStudy.mdxSlug`.
- If MDX is missing, structured `caseStudy.sections` fallback is rendered safely as plain text.

### Visitor analytics
- Page views are tracked via `POST /api/analytics/view` only.
- Route types tracked: `home`, `work`, `project` (by slug).
- Dedupe strategy:
  - client session cooldown (lightweight suppression)
  - server-side cooldown by `visitorId + routeKey`
- Admin analytics summary is available through protected `GET /api/admin/analytics`.

## Environment Variables

Copy `.env.example` to `.env.local` and fill values.

### Required for full runtime verification
- `NEXT_PUBLIC_CONVEX_URL`
- `CONVEX_ADMIN_MUTATION_KEY`
- `ADMIN_PASSWORD_HASH`
- `ADMIN_SESSION_SECRET`
- `NEXT_PUBLIC_SITE_URL`

### Required for optional contact-email flow
- `RESEND_API_KEY`

### Optional / behavior controls
- `CONVEX_URL` (not required for admin/projects/analytics in current code because those paths can fall back to `NEXT_PUBLIC_CONVEX_URL`; still recommended. `app/api/contact` writes to Convex only when `CONVEX_URL` is set)
- `PROJECTS_READ_SOURCE` (`local` | `convex` | `auto`)
- `ANALYTICS_VIEW_COOLDOWN_SECONDS` (default 60)
- `NEXT_PUBLIC_TWITTER_HANDLE`

## How To Generate Admin Values

### `ADMIN_PASSWORD_HASH` (SHA-256 hex)
```bash
node -e "const c=require('crypto'); console.log(c.createHash('sha256').update('your-password-here').digest('hex'))"
```

### `ADMIN_SESSION_SECRET`
```bash
node -e "const c=require('crypto'); console.log(c.randomBytes(32).toString('hex'))"
```

## Development

```bash
npm install
npm run dev
```

## Verification Commands

```bash
npm run lint
npx tsc --noEmit
npm run build
```

## Notes About `NEXT_PUBLIC_SITE_URL`

- This value is used for canonical URLs, sitemap entries, and metadata absolute URLs.
- In production, missing `NEXT_PUBLIC_SITE_URL` (and missing `VERCEL_URL`) now throws to prevent invalid SEO output.
- In development, it falls back to `http://localhost:3000`.
