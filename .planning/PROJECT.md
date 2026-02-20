# Tsukie v3 — Cloudflare Deployment

## What This Is

Deploy the existing tsukie-v3 Astro blog to Cloudflare Pages with content refresh mechanisms that mimic Vercel's ISR behavior. The site is a content-driven personal blog powered by Notion as a headless CMS, already migrated from Next.js 14 to Astro 5 with static output.

## Core Value

New blog posts appear on the live site within minutes of ticking "ready" in Notion, with a 12-hour scheduled rebuild as a safety net for edits to existing content.

## Requirements

### Validated

- ✓ Astro 5 static site generation — existing
- ✓ Notion API integration for content fetching — existing
- ✓ Markdown rendering pipeline (remark/rehype) — existing
- ✓ Tag-based article filtering — existing
- ✓ Dark/light theme toggle — existing
- ✓ Sidebar navigation with collapse — existing
- ✓ Utterances comment system — existing
- ✓ Unity WebGL player embedding — existing
- ✓ Plausible analytics integration — existing
- ✓ Build-time widget post suggestions — existing

### Active

- [ ] Deploy to Cloudflare Pages
- [ ] Notion automation triggers Cloudflare Pages deploy hook on "ready" checkbox
- [ ] Scheduled 12-hour rebuild via Cloudflare cron trigger
- [ ] Environment variables (NOTION_API_KEY, NOTION_DATABASE_ID) configured on Cloudflare
- [ ] Site accessible on default .pages.dev domain

### Out of Scope

- Custom domain setup — will add later
- SSR/hybrid rendering — keeping fully static, rebuilds handle freshness
- Vercel deployment — this is a Cloudflare-only deployment
- Content preview/draft mode — not needed, "ready" checkbox is the publish gate

## Context

- Site is fully static Astro 5 with `@astrojs/tailwind` and `@astrojs/react`
- Only React island is `UnityPlayer.jsx` (uses `client:visible`)
- Content fetched from Notion at build time via `src/lib/contentFetcher.js`
- Notion database has a "ready" checkbox — only checked posts get published
- Notion's built-in automations can call webhook URLs (deploy hooks)
- Currently first deployment — not migrating from another host

## Constraints

- **Platform**: Cloudflare Pages — must work within Cloudflare's build system and limits
- **Build trigger**: Notion automations can only call simple webhook URLs (POST request)
- **Static output**: Astro configured for static output, no server adapter needed for basic deployment
- **Env vars**: NOTION_API_KEY and NOTION_DATABASE_ID must be set in Cloudflare dashboard

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Cloudflare Pages (not Workers Sites) | Pages has native git integration, deploy hooks, and cron triggers | — Pending |
| Scheduled rebuild every 12h | Safety net for content edits that don't trigger the webhook | — Pending |
| Notion automation for deploy hook | Existing workflow — tick "ready" checkbox triggers build | — Pending |
| Keep fully static | No need for SSR; rebuild-on-change + 12h cron covers freshness needs | — Pending |

---
*Last updated: 2026-02-20 after initialization*
