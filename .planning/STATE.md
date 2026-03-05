---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: planning
stopped_at: "Completed quick-3: check and remove unused dependencies"
last_updated: "2026-03-05T16:41:03.263Z"
last_activity: "2026-03-06 - Completed quick task 2: migrate blog post rendering to Astro content collections (getCollection/render), replacing fs/gray-matter/unified pipeline"
progress:
  total_phases: 3
  completed_phases: 3
  total_plans: 5
  completed_plans: 5
  percent: 0
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-05)

**Core value:** Blog content is read from local markdown files with zero external API dependencies at build time.
**Current focus:** Phase 1: Content Source Migration

## Current Position

Phase: 1 of 3 (Content Source Migration)
Plan: 0 of ? in current phase
Status: Ready to plan
Last activity: 2026-03-05 - Completed quick task 4: fix figcaption not smaller and centered like production

Progress: [░░░░░░░░░░] 0%

## Performance Metrics

**Velocity:**
- Total plans completed: 0
- Average duration: -
- Total execution time: 0 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| - | - | - | - |

**Recent Trend:**
- Last 5 plans: -
- Trend: -

*Updated after each plan completion*
| Phase 01-content-source-migration P01 | 4 | 2 tasks | 4 files |
| Phase 02-data-access-verification P01 | 15 | 2 tasks | 38 files |
| Phase 02-data-access-verification P02 | 5 | 3 tasks | 25 files |
| Phase 03-cleanup-and-submodule P01 | 134 | 2 tasks | 5 files |
| Phase 03-cleanup-and-submodule P02 | 15 | 2 tasks | 2 files |

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- Roadmap: 3 phases (coarse granularity) -- content source first, verification second, cleanup last
- [Phase 01-content-source-migration]: Use process.cwd() for POSTS_DIR in contentFetcher.js — import.meta.url resolves to dist/chunks/ in Astro SSG builds
- [Phase 01-content-source-migration]: id field in ConsumablePost maps to slug (was Notion UUID) — slug is stable unique identifier for local files
- [Phase 02-data-access-verification]: rawDate field added to convertToConsumable as dayjs().toISOString() — preserves ISO format for RSS/JSON-LD while keeping display date field for UI
- [Phase 02-data-access-verification]: YAML string values containing colons must be double-quoted — bare colons are invalid YAML mapping syntax
- [Phase 02-data-access-verification]: Delete all synthetic posts after verification passes — real posts come from submodule repo in Phase 3
- [Phase 03-cleanup-and-submodule]: Keep .replace(/<p>undefined<\/p>/g, '') in markdownRenderer.js as harmless defensive code even without notion-to-md
- [Phase 03-cleanup-and-submodule]: README updated surgically (one line + one paragraph) to preserve personal writing voice
- [Phase 03-cleanup-and-submodule]: src/markdown-posts converted from tracked directory to git submodule — content lives independently in tsukie-posts.git
- [Phase 03-cleanup-and-submodule]: Cloudflare Pages requires manual GitHub app access grant to tsukie-posts repo before deployment will succeed
- [quick-2]: renderPostById() returns { Content, headings } via Astro render() — replaces entire unified/remark/rehype pipeline for blog posts
- [quick-2]: getStaticPageContent() is async and uses slug without .md extension — Astro glob loader sets entry.id to filename stem
- [quick-2]: Static pages still use markdownRenderer.js + ParagraphFromCms — unified pipeline kept for these three pages only
- [quick-3]: highlight.js removed as direct dep — it is a transitive dep of rehype-highlight which manages its own version; unified/remark/rehype group kept intact for static pages

### Pending Todos

None yet.

### Blockers/Concerns

None yet.

### Quick Tasks Completed

| # | Description | Date | Commit | Directory |
|---|-------------|------|--------|-----------|
| 1 | update content loading: posts from src/markdown/posts, about from about.md, endless-defense from endless-defense-description.md, privacy-policy from privacy-policy.md | 2026-03-05 | 87254f0 | [1-update-content-loading-posts-from-src-ma](./quick/1-update-content-loading-posts-from-src-ma/) |
| 2 | migrate to Astro 5 content collections: getCollection/render replaces fs/gray-matter/unified pipeline; content.config.ts + contentFetcher.ts rewrite | 2026-03-06 | e22dafe | [2-you-re-loading-md-content-frontmatter-in](./quick/2-you-re-loading-md-content-frontmatter-in/) |
| 3 | remove unused deps: gray-matter, reading-time, highlight.js (12 packages total) — no longer needed after quick-2 Astro content collections migration | 2026-03-06 | 9fd3371 | [3-check-and-remove-unused-unneeded-depende](./quick/3-check-and-remove-unused-unneeded-depende/) |
| 4 | fix figcaption not smaller and centered like production | 2026-03-05 | 8f04986 | [4-fix-figcaption-not-smaller-and-centered-](./quick/4-fix-figcaption-not-smaller-and-centered-/) |

## Session Continuity

Last session: 2026-03-05T16:41:03.260Z
Stopped at: Completed quick-3: check and remove unused dependencies
Resume file: None
