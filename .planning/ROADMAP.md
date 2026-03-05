# Roadmap: Tsukie Blog Notion-to-Markdown Migration

## Overview

This migration replaces the Notion API content pipeline with local markdown file reading. Phase 1 rewrites the data access layer to read from local files. Phase 2 verifies all pages, endpoints, and widgets work correctly with the new source. Phase 3 removes Notion dependencies and configures the git submodule.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Content Source Migration** - Rewrite contentFetcher.js to read and parse local markdown files (completed 2026-03-05)
- [ ] **Phase 2: Data Access Verification** - All pages, endpoints, and widgets serve correct data from local source
- [x] **Phase 3: Cleanup and Submodule** - Remove Notion dependencies and configure git submodule (completed 2026-03-05)

## Phase Details

### Phase 1: Content Source Migration
**Goal**: Blog reads all content from local markdown files instead of Notion API
**Depends on**: Nothing (first phase)
**Requirements**: SRC-01, SRC-02, SRC-03, CLN-03
**Success Criteria** (what must be TRUE):
  1. contentFetcher.js reads .md files from src/markdown-posts/ and returns post data in the same shape as before
  2. Frontmatter fields (tags, date, ready, thumbnail, slug, summary, readCount) are correctly parsed from each post
  3. Posts with `ready: Yes` are included; posts without it are excluded
  4. The site builds successfully with `astro build` using the new content source
**Plans:** 1/1 plans complete

Plans:
- [ ] 01-01-PLAN.md -- Install gray-matter, fix sample post, rewrite contentFetcher.js for local markdown

### Phase 2: Data Access Verification
**Goal**: Every page and endpoint on the site works identically with local markdown data
**Depends on**: Phase 1
**Requirements**: DATA-01, DATA-02, DATA-03, DATA-04, DATA-05, DATA-06
**Success Criteria** (what must be TRUE):
  1. Landing page shows paginated posts (10 per page) sorted by date descending
  2. Clicking a tag filters posts to only that tag on the landing page
  3. Individual post pages load at /en/{tag}/{slug} with full rendered content
  4. Sidebar shows top 3 posts by readCount and top 3 by date
  5. API endpoints at /api/posts/{tag}/{page}.json return valid JSON for client-side pagination and RSS feed generates from local posts
**Plans:** 2 plans

Plans:
- [ ] 02-01-PLAN.md -- Generate 25 synthetic test posts and fix known bugs (rawDate, RSS, JSON-LD, ArticlesIsland URL)
- [ ] 02-02-PLAN.md -- Build, verify all DATA requirements against dist output, human spot-check, delete synthetic posts

### Phase 3: Cleanup and Submodule
**Goal**: All Notion code and dependencies are removed; content directory is a proper git submodule
**Depends on**: Phase 2
**Requirements**: CLN-01, CLN-02, SRC-04
**Success Criteria** (what must be TRUE):
  1. @notionhq/client and notion-to-md are not in package.json or node_modules
  2. NOTION_API_KEY and NOTION_DATABASE_ID are not referenced anywhere in the codebase
  3. src/markdown-posts/ is configured as a git submodule pointing to a separate GitHub repo
  4. The site builds and deploys successfully with zero Notion-related code or configuration
**Plans:** 2/2 plans complete

Plans:
- [ ] 03-01-PLAN.md -- Remove Notion packages, env vars, dead code; update README
- [ ] 03-02-PLAN.md -- Push posts to tsukie-posts remote, convert directory to git submodule

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Content Source Migration | 1/1 | Complete   | 2026-03-05 |
| 2. Data Access Verification | 0/2 | Not started | - |
| 3. Cleanup and Submodule | 2/2 | Complete   | 2026-03-05 |
