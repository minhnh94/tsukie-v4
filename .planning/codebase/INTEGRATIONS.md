# External Integrations

**Analysis Date:** 2026-02-18

## APIs & External Services

**Content Management:**
- Notion - CMS for blog articles and content storage
  - SDK/Client: `@notionhq/client` 2.2.3
  - Auth: `NOTION_API_KEY` environment variable
  - Database ID: `NOTION_DATABASE_ID` environment variable
  - Usage: `lib/contentFetcher.js` - Queries Notion database for articles, tags, and metadata

**Email & Communication:**
- Sendinblue (Brevo) - Email marketing and transactional email service
  - SDK/Client: Not directly imported in analyzed files
  - Auth: `YOUR_SENDINBLUE_API_KEY` environment variable
  - Status: Configured in `.env.example` but implementation details not found in explored files

**Analytics & Monitoring:**
- Vercel Web Analytics - Client-side analytics and performance monitoring
  - SDK/Client: `@vercel/analytics/react` 0.1.11
  - Integration: `app/body-container.jsx` - `<Analytics />` component
  - Configuration: Self-service integration
  - Features: Page views, performance metrics

- Plausible Analytics - Self-hosted privacy-focused analytics
  - SDK/Client: `next-plausible` 3.12.4
  - Custom Domain: `https://plausible.tsukie.com` (self-hosted)
  - Configuration in `next.config.js`: Uses `withPlausibleProxy()` wrapper
  - Configuration in `app/body-container.jsx`: Domain `tsukie.com`, outbound link tracking enabled, tagged events enabled
  - Features: Page tracking, outbound link tracking, custom tagged events

## Data Storage

**Primary Database:**
- Notion - Content database
  - Connection: API key authentication via `NOTION_API_KEY`
  - Client: `@notionhq/client` (official Notion JavaScript SDK)
  - ORM/Query Layer: Direct API calls in `lib/contentFetcher.js`
  - Content Model: Database with properties for articles (name, thumbnail, ready, tags, slug, summary, date, readCount)

**File Storage:**
- External URLs - Images hosted externally
  - Imgur (`i.imgur.com`) - Secondary image hosting
  - Own domain (`tsukie.com`) - Primary image hosting
  - Configuration: Image domains whitelisted in `next.config.js`

**Caching:**
- HTTP caching via `Cache-Control` headers
  - Implementation: `app/api/suggestions/route.js` uses `Cache-Control: public, max-age=86400, s-maxage=86400` for 24-hour caching
  - Strategy: Server-side caching for sidebar suggestions API endpoint

## Authentication & Identity

**Auth Provider:**
- Custom/None - No user authentication system detected
- Public read-only access to all content

## Monitoring & Observability

**Error Tracking:**
- Not detected - No explicit error tracking service configured

**Logs:**
- Console logging (implicit via React/Next.js defaults)
- Vercel platform logs for production deployments

## CI/CD & Deployment

**Hosting:**
- Vercel - Primary deployment platform
  - Optimized for Next.js
  - Integrates with `@vercel/analytics` for web vitals
  - Environment variables managed through Vercel dashboard

**CI Pipeline:**
- Not detected in analyzed files - Likely handled through Vercel's automatic deployments

## Environment Configuration

**Required env vars:**
- `NOTION_API_KEY` - Notion API authentication token for database access
- `NOTION_DATABASE_ID` - Notion database ID containing article content
- `YOUR_SENDINBLUE_API_KEY` - Sendinblue API key for email services

**Secrets location:**
- `.env.example` - Template file showing required variables
- `.env` (not committed) - Local development environment file
- Vercel dashboard - Production environment variables

## API Endpoints

**Internal API Routes:**
- `GET /api/suggestions` - Fetch sidebar article suggestions
  - Query params: `chronologically` (boolean) - Sort by date (true) or read count (false)
  - Response: JSON array of article objects
  - Caching: 24-hour server-side cache
  - Implementation: `app/api/suggestions/route.js`

## Webhooks & Callbacks

**Incoming:**
- Not detected - No webhook receivers configured

**Outgoing:**
- Notion API calls - Content fetching (not webhooks, but polling)
  - Queries on-demand for articles, tags, and metadata
  - No event-driven webhooks detected

---

*Integration audit: 2026-02-18*
