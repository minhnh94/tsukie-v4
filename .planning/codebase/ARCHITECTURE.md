# Architecture

**Analysis Date:** 2026-02-18

## Pattern Overview

**Overall:** Server-Side Rendered Content Management System with Static Generation

This is a Next.js 14 application built as a content-driven blog platform. The architecture combines static generation for performance with client-side interactivity for UI features. Content is managed externally via Notion database and transformed at build-time.

**Key Characteristics:**
- Static Site Generation (SSG) with 12-hour revalidation for content pages
- Notion as headless CMS with markdown conversion
- Modular component architecture with layout composition
- Server Components for data fetching, Client Components for interactivity
- Utility-driven styling with Tailwind CSS

## Layers

**Presentation Layer (UI Components):**
- Purpose: Render user interface using React components with Tailwind CSS styling
- Location: `partials/` and `app/` directories
- Contains: React functional components for pages, layout sections, and widgets
- Depends on: Next.js framework, Tailwind CSS, React utility components
- Used by: Next.js router and page rendering system

**Page Layer (Routes):**
- Purpose: Define application routes and page composition using Next.js App Router
- Location: `app/` directory with nested route segments
- Contains: Page components, layouts, error boundaries, dynamic routes with `[tag]` and `[post]` segments
- Depends on: Presentation layer components, Content layer data fetchers
- Used by: Next.js routing engine

**Content Layer (Data Fetching):**
- Purpose: Fetch and transform content from Notion database, handle markdown conversion
- Location: `lib/contentFetcher.js`
- Contains: Notion API client initialization, database queries, property transformation, markdown conversion
- Depends on: Notion API, notion-to-md library, dayjs for date formatting
- Used by: Server components in pages and API routes

**API Layer:**
- Purpose: Provide server endpoints for client-side requests (suggestions, analytics)
- Location: `app/api/` directory
- Contains: Route handlers using Next.js 14 App Router API format
- Depends on: Content layer fetchers
- Used by: Client components and external services

**Utility Layer:**
- Purpose: Shared constants and helper components
- Location: `utils/` directory
- Contains: Constants like `TAG_LATEST`, transition components for animations
- Depends on: React, react-transition-group
- Used by: Components throughout the application

**Configuration Layer:**
- Purpose: Framework and build configuration
- Location: Root directory files
- Contains: Next.js config, Tailwind config, PostCSS config, path aliases in jsconfig.json
- Depends on: npm ecosystem, build tools
- Used by: Development and production build processes

## Data Flow

**Content Publishing Flow:**

1. Author writes content in Notion database with metadata (title, tags, date, thumbnail, ready checkbox)
2. Build-time or on-demand: `contentFetcher.js` queries Notion API
3. Database results filtered by `ready: true` checkbox
4. Page properties converted to consumable format with date sorting
5. Markdown content converted from Notion blocks to markdown string
6. Server components render with transformed data
7. Built pages cached with 12-hour revalidation period

**User Interaction Flow:**

1. User navigates to page via Next.js router
2. Server component in `app/*/page.jsx` fetches data via content fetcher
3. Layout renders composition: Screen > SideNavigation + MainContent + RightSidebar
4. Client components (ArticlesList, Header) handle filtering and theme switching with React state
5. Client components emit analytics events via Plausible or Vercel Analytics
6. API routes handle dynamic requests (suggestions, theme preferences)

**Tag-Based Filtering:**

1. Index page fetches all published pages from Notion
2. Frontend groups pages by tag and creates navigation
3. Client-side filter displays pages matching selected tag or all pages for "latest"
4. Dynamic routes to `[tag]/[post]` generate static params at build time

## Key Abstractions

**Page Abstraction:**
- Purpose: Represent content items from Notion with normalized properties
- Examples: Properties in `lib/contentFetcher.js` lines 178-193 define page shape
- Pattern: Data transformation converts Notion raw properties to consistent object structure
- Schema: `{ id, title, thumbnail, tag, slug, summary, date, readCount, ready }`

**Layout Composition:**
- Purpose: Build page layouts by composing specialized container components
- Examples: `partials/Screen.jsx`, `partials/MainContent.jsx`, `partials/SideNavigation.jsx`
- Pattern: Wrapper components accept children and apply spacing/sizing constraints
- Benefit: Reusable layout structure across multiple pages (home, article, about pages)

**Component Partitioning:**
- Purpose: Separate UI concerns and manage interactivity scopes
- Examples: `partials/` contains presentational components, `app/` contains page orchestrators
- Pattern: Client boundary (`'use client'`) marks interactivity, server components handle data
- Benefit: Optimizes code splitting and client-side JavaScript bundle

**Sidebar Widget Pattern:**
- Purpose: Encapsulate self-contained UI sections with independent state
- Examples: `WidgetNewsletter.jsx`, `WidgetSponsor.jsx`, `WidgetPosts.jsx`
- Pattern: Each widget manages its own data fetching and state
- Benefit: Flexible sidebar composition on different page layouts

## Entry Points

**Home Page:**
- Location: `app/page.jsx`
- Triggers: User navigates to `/`, initial app load
- Responsibilities: Fetch index page data, render hero section, articles list, projects, newsletter widget

**Dynamic Article Page:**
- Location: `app/en/[tag]/[post]/page.jsx`
- Triggers: User navigates to `/en/{tag}/{slug}`
- Responsibilities: Generate static params for all pages at build time, fetch page and markdown content, render article with metadata and comments

**Root Layout:**
- Location: `app/layout.jsx`
- Triggers: Every page load
- Responsibilities: Initialize global styles, set up provider context (theme, analytics), establish HTML structure

**Body Container:**
- Location: `app/body-container.jsx`
- Triggers: After root layout
- Responsibilities: Wrap application with Plausible analytics provider, theme provider (next-themes), Vercel analytics

**About Page:**
- Location: `app/about/page.jsx`
- Triggers: User navigates to `/about`
- Responsibilities: Display experience timeline and testimonials

**Subscribe Page:**
- Location: `app/subscribe/page.jsx`
- Triggers: User navigates to `/subscribe`
- Responsibilities: Render subscription form with email capture

**API Suggestions Endpoint:**
- Location: `app/api/suggestions/route.js`
- Triggers: Client-side GET request from WidgetPosts component
- Responsibilities: Return related article suggestions, apply caching headers

## Error Handling

**Strategy:** Next.js error boundaries with fallback UI

**Patterns:**
- Error boundary component at `app/error.jsx` catches runtime errors in page components
- 404 handling with `app/not-found.jsx` for missing routes and content
- Content not found: `getPageIdBySlug()` returns null, triggering error throw in page component
- Build-time errors: Missing Notion database or API key prevents successful build

## Cross-Cutting Concerns

**Logging:** No centralized logging framework detected. Development uses console methods commented in source code.

**Validation:** Content validation occurs at Notion database schema level (required fields, property types). Frontend assumes valid data from API.

**Authentication:**
- Notion API authentication via `NOTION_API_KEY` environment variable
- No user authentication layer - public read-only blog
- Analytics authenticated via domain configuration

**Analytics:**
- Plausible Analytics for privacy-focused tracking (self-hosted proxy at plausible.tsukie.com)
- Vercel Analytics for performance metrics
- Event tracking for outbound links enabled

**Theme Management:** Next-themes library provides dark/light mode toggle persistent to localStorage

**Image Optimization:** Next.js Image component configured for external domains (tsukie.com, i.imgur.com)

---

*Architecture analysis: 2026-02-18*
