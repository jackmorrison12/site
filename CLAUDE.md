# CLAUDE.md — Codebase Guide for AI Assistants

## Overview

This is **Jack Morrison's personal website** — a Next.js 15/16 App Router application deployed on Vercel. It serves as a portfolio, CV, and live data dashboard (music listening history, GitHub activity, tweets).

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | styled-components + CSS Modules + SCSS |
| Database | Vercel Postgres via Drizzle ORM |
| Auth | NextAuth v5 (GitHub provider) |
| Content | MDX files (via `next-mdx-remote` and `@next/mdx`) |
| State / Data | TanStack React Query v5 |
| PWA | `@ducanh2912/next-pwa` |
| Fonts | Next.js Google Fonts (Poppins) |
| Analytics | Google Analytics (`nextjs-google-analytics`) |
| Theme | `next-themes` + custom styled-components theme system |
| Validation | Zod |

## Directory Structure

```
/
├── app/                    # Next.js App Router pages and API routes
│   ├── api/                # API route handlers
│   │   ├── auth/           # NextAuth catch-all route
│   │   ├── checkArchives/  # Archive checker
│   │   └── updateLastFmData/ # Cron-style Last.fm data sync
│   ├── admin/              # Admin page (protected)
│   ├── archive/            # Previous site iterations page
│   ├── credits/            # Credits page (MDX)
│   ├── cv/                 # CV/résumé page with PDF export
│   ├── feed/               # Live feed (Last.fm, GitHub)
│   │   ├── github/         # GitHub activity timeline
│   │   └── lastfm/         # Music listening history & artist pages
│   ├── me/                 # About page with timeline and open-source
│   ├── not-found.tsx       # Custom 404 page
│   ├── projects/           # Projects list and [slug] detail pages
│   ├── tags/[slug]/        # Tag-filtered project views
│   ├── tools/              # Tools page (MDX)
│   ├── ~offline/           # PWA offline fallback page
│   ├── layout.tsx          # Root layout (fonts, metadata, providers)
│   ├── page.tsx            # Home page
│   └── providers.tsx       # Client providers tree
├── components/             # Reusable React components
│   ├── Layout/             # Header, Footer, Layout wrapper, TextWrapper
│   ├── Logos/              # SVG logo components (Bloomberg, GitHub, etc.)
│   ├── Projects/           # ProjectHeader, ProjectSummary
│   ├── icons/              # Icon components
│   └── shared/             # BackLink, MdxOverrides, Title
├── content/                # Static MDX content files
│   ├── about-me/           # Avatar, photos, and about-me data
│   ├── education/          # Education entries (billericay, imperial, whsb)
│   ├── jobs/               # Job entries (bloomberg, facebook, etc.)
│   └── projects/           # Project detail MDX files
├── content-access/         # Server-side functions to read content/ MDX files
│   ├── education/          # getEducation(), Education type
│   ├── jobs/               # getJobs(), Job type
│   ├── projects/           # getProjects(), getProject(), Project type
│   └── tags/               # getTags()
├── data-access/            # External API integrations
│   ├── github/             # GitHub Events API (getEvents, schemas, urls)
│   ├── lastfm/             # Last.fm API (getRecentTracks, getTopTracks, etc.)
│   └── twitter/            # Twitter API + database read/write
├── drizzle/                # Database layer
│   ├── db.ts               # Drizzle client (mocks gracefully if no POSTGRES_URL)
│   ├── schema.ts           # Table definitions: tweets, tracks, listens
│   ├── drizzle.config.ts   # Drizzle Kit config
│   └── envConfig.ts        # Loads .env via @next/env
├── utils/                  # Shared utilities
│   ├── analytics/          # GoogleAnalytics wrapper, ClientEvent
│   └── theme/              # Full theme system (see Theme System below)
├── auth.ts                 # NextAuth configuration
├── mdx-components.tsx      # MDX component overrides
├── next.config.js          # Next.js config (MDX, PWA, styled-components SWC)
├── postcss.config.js       # PostCSS config
└── tsconfig.json           # TypeScript config (strict, baseUrl=".")
```

## Development Commands

```bash
npm run dev          # Start development server (Next.js)
npm run build        # Production build
npm run start        # Start production server
npm run type-check   # Run tsc --noEmit (type checking only)
npm run lint         # ESLint with auto-fix
npm run pretty       # Prettier formatting for JS/JSX/JSON
```

There are **no tests** in this project. Validation is done via `type-check` and `lint`.

## Environment Variables

| Variable | Purpose |
|---|---|
| `POSTGRES_URL` | Vercel Postgres connection string (optional — app uses mock DB if absent) |
| `GITHUB_ID` | GitHub OAuth App client ID (NextAuth) |
| `GITHUB_SECRET` | GitHub OAuth App client secret (NextAuth) |
| `LASTFM_API_KEY` | Last.fm API key for music data |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics measurement ID |

The app degrades gracefully without `POSTGRES_URL` — `drizzle/db.ts` exports a mock DB object that returns empty arrays.

## Content Management (MDX)

Content lives in `content/` as `.mdx` files with YAML frontmatter. Access functions in `content-access/` parse these files server-side using `gray-matter` and `next-mdx-remote`.

**Adding a new project:**
1. Create `content/projects/<slug>.mdx` with required frontmatter fields (see `content-access/projects/projects.types.ts`)
2. The project appears automatically on `/projects` — no code changes needed

**Project frontmatter fields:**
```yaml
title: string
type: 'Uni Project' | 'Hackathon' | 'School Project' | 'Personal Project'
onHomepage: boolean
onCV: boolean
isFeatured: boolean
isHidden: boolean    # Set true to hide from listings
heroImg: string      # Path under /public
bannerImg: string
description: string
startDate: ISO date string
endDate: ISO date string
tags: string[]
sources: [{ name, url, iconImg }]
highlights: string[]
```

Same pattern applies for `content/jobs/` (Job type) and `content/education/` (Education type).

## Theme System

The theme system is a key architectural feature:

- **4 themes**: `light`, `dark`, `bluePink`, `greenOrange` — defined in `utils/theme/`
- **Theme switching**: `next-themes` + styled-components `ThemeProvider` working together
- **CSS classes**: Each theme maps to a CSS class (e.g., `dark-theme`, `blue-pink-theme`)
- **Theme type**: Defined in `utils/theme/theme.types.ts` — includes `colours`, `fontSizes`, `fontWeights`
- **Colour structure**: Uses a 12-step `ColourRange` scale (inspired by Radix UI colors)
- **Adding a new theme**: Create colour files in `utils/theme/dark/colours/` or `light/colours/`, build a theme object, and register it in `utils/theme/exportedThemes.ts`

When writing styled-components, access the theme via `${({ theme }) => theme.colours.primary[9]}` etc.

## Styling Conventions

- **styled-components** for component-level styling in React components
- **CSS Modules** (`.module.css` / `.module.scss`) for page-level scoped styles
- **Global styles** in `utils/styles/globalStyles.ts` (styled-components `createGlobalStyle`)
- Avoid inline styles; prefer theme tokens over hardcoded colour values
- SCSS files use `.module.scss` extension

## Component Conventions

- Components are co-located with associated files using the pattern:
  ```
  ComponentName/
  ├── ComponentName.tsx       # Main component
  ├── ComponentName.module.css/scss  # Styles
  ├── ComponentName.types.ts  # TypeScript types
  ├── ComponentName.hooks.ts  # Custom hooks
  └── ComponentName.data.ts   # Static data
  ```
- Shared/reusable components go in `components/shared/`
- Page-specific components live inside `app/<page>/`
- Logo SVG components live in `components/Logos/` and are barrel-exported via `components/Logos/index.ts`

## Data Access Layer

### External APIs (`data-access/`)
- All Last.fm API calls use `'server-only'` import to prevent client-side use
- Responses are validated with Zod schemas before being returned
- Uses Next.js `fetch` with `{ next: { revalidate: N } }` for ISR caching

### Database (`drizzle/`)
- **Tables**: `tweets` (cached Twitter/X posts), `tracks` (Last.fm track metadata), `listens` (listen events with timestamp)
- Migrations managed by Drizzle Kit: `npx drizzle-kit generate` / `npx drizzle-kit migrate`
- The mock DB in `drizzle/db.ts` ensures the app builds and runs without a real database

### Content (`content-access/`)
- All functions are server-only (filesystem reads)
- Returns typed objects matching the types in `*.types.ts` files

## Navigation / Pages

The header links (defined in `components/Layout/Header/Header.data.ts`) are:
- `/` — Home
- `/me` — About me (photos, stats, links)
- `/cv` — CV with PDF export
- `/projects` — Projects list

The Feed (`/feed`) is currently commented out in the header but the pages exist.

## Auth

NextAuth v5 with GitHub OAuth. Protected routes should use the `auth()` helper from `auth.ts`. The admin page at `/admin` is the primary protected route.

## PWA

The app is a PWA via `@ducanh2912/next-pwa`:
- Service worker is auto-generated into `public/`
- Offline fallback at `/~offline`
- `public/manifest.json` defines app metadata

## Code Quality

- **ESLint**: `@typescript-eslint/recommended` + `eslint:recommended` + `plugin:react/recommended` + `@next/next/recommended` + Prettier integration
- **Prettier**: Auto-formats on commit (via husky + lint-staged pre-commit hook)
- **TypeScript**: Strict mode enabled, `noEmit: true`, `baseUrl: "."`
- `@typescript-eslint/no-unused-vars` is set to `error` — remove unused imports/variables
- `react/react-in-jsx-scope` is off (React 17+ JSX transform)

## Key Patterns to Follow

1. **Server vs Client components**: Default to Server Components. Add `'use client'` only when needed (event handlers, hooks, browser APIs). Data-fetching files that should never run client-side use `'server-only'`.

2. **Imports**: Use absolute imports from the project root (e.g., `import { Title } from 'components/shared/Title'`). The `baseUrl: "."` in tsconfig enables this.

3. **Type safety**: All external API responses should be validated with Zod. Don't cast `as any` unless absolutely necessary.

4. **Content changes**: Modify MDX files in `content/` — don't hardcode content in page components.

5. **No test suite**: Changes should be validated by running `npm run type-check` and `npm run lint` before committing.
