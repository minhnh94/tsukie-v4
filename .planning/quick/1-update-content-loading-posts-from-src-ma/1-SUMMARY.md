---
phase: quick-1
plan: 1
subsystem: content
tags: [markdown, file-system, astro, contentFetcher]

requires:
  - phase: 03-cleanup-and-submodule
    provides: "src/markdown/ directory with about.md, privacy-policy.md, endless-defense-description.md and posts/ submodule"

provides:
  - "POSTS_DIR correctly points to src/markdown/posts"
  - "getStaticPageContent(filename) exported from contentFetcher.js for synchronous local file reads"
  - "about.astro, privacy-policy.astro, endless-defense.astro load content from local markdown files"

affects: []

tech-stack:
  added: []
  patterns:
    - "getStaticPageContent(filename): synchronous fs.readFileSync wrapper for static page markdown files in src/markdown/"

key-files:
  created: []
  modified:
    - src/lib/contentFetcher.js
    - src/pages/about.astro
    - src/pages/privacy-policy.astro
    - src/pages/projects/endless-defense.astro

key-decisions:
  - "getStaticPageContent is synchronous — Astro SSG build-time file reads do not require async"
  - "STATIC_PAGES_DIR is a separate constant from POSTS_DIR, both using process.cwd() for Astro SSG compatibility"

patterns-established:
  - "Static page content: getStaticPageContent('filename.md') — no UUID, no await"
  - "Blog posts: POSTS_DIR + gray-matter parse via loadAllPosts()"

requirements-completed: []

duration: 5min
completed: 2026-03-06
---

# Quick Task 1: Update Content Loading to src/markdown Summary

**POSTS_DIR fixed to src/markdown/posts and three static pages migrated from Notion UUID lookups to synchronous local file reads via new getStaticPageContent helper**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-03-06T01:20:00Z
- **Completed:** 2026-03-06T01:25:00Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments
- Fixed POSTS_DIR to point at `src/markdown/posts` (was `src/markdown-posts`, the old submodule path)
- Added `getStaticPageContent(filename)` synchronous helper to contentFetcher.js reading from `src/markdown/`
- Updated about.astro, privacy-policy.astro, and endless-defense.astro to use the new helper (removed Notion UUIDs and `await`)
- Build passes: 32 pages built without errors

## Task Commits

Each task was committed atomically:

1. **Task 1: Fix POSTS_DIR and add getStaticPageContent to contentFetcher.js** - `c27decc` (feat)
2. **Task 2: Update about.astro, privacy-policy.astro, and endless-defense.astro to use getStaticPageContent** - `520e74a` (feat)

## Files Created/Modified
- `src/lib/contentFetcher.js` - POSTS_DIR path corrected; STATIC_PAGES_DIR constant and getStaticPageContent export added
- `src/pages/about.astro` - Import and call site updated to getStaticPageContent('about.md')
- `src/pages/privacy-policy.astro` - Import and call site updated to getStaticPageContent('privacy-policy.md')
- `src/pages/projects/endless-defense.astro` - Import and call site updated to getStaticPageContent('endless-defense-description.md')

## Decisions Made
- `getStaticPageContent` is synchronous — Astro SSG build-time file reads do not require async, and this matches the plan's specification
- `STATIC_PAGES_DIR` is a separate constant at the module level (not inside the function) for clarity

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Content loading is fully file-based; no Notion API dependencies remain in any page
- Build is clean and all 32 pages generate successfully
- Ready for Cloudflare Pages deployment (pending GitHub App access to tsukie-posts repo, per prior decision)

---
*Phase: quick-1*
*Completed: 2026-03-06*
