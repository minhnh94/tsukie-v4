---
phase: 03-cleanup-and-submodule
plan: 01
subsystem: infra
tags: [package-json, npm, notion, cleanup, readme, env]

# Dependency graph
requires:
  - phase: 02-data-access-verification
    provides: Verified local markdown pipeline working end-to-end
provides:
  - Clean package.json without @notionhq/client or notion-to-md
  - .env.example with only Sentry env vars
  - markdownRenderer.js with notion-to-md comment removed
  - README.md describing local markdown + git submodule architecture
affects: []

# Tech tracking
tech-stack:
  added: []
  patterns: []

key-files:
  created: []
  modified:
    - package.json
    - package-lock.json
    - .env.example
    - src/lib/markdownRenderer.js
    - README.md

key-decisions:
  - "Keep .replace(/<p>undefined<\\/p>/g, '') in markdownRenderer.js as harmless defensive code even without notion-to-md"
  - "README updated in-place (single line change + one paragraph added) to preserve personal writing style"

patterns-established: []

requirements-completed:
  - CLN-01
  - CLN-02

# Metrics
duration: 2min
completed: 2026-03-05
---

# Phase 3 Plan 01: Notion Cleanup Summary

**Removed @notionhq/client and notion-to-md packages, purged all Notion env vars and dead comments, and updated README to describe the local markdown + git submodule architecture.**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-05T15:59:53Z
- **Completed:** 2026-03-05T16:01:20Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments
- npm uninstall removed @notionhq/client and notion-to-md from package.json and lockfile (13 packages pruned)
- .env.example reduced from 8 lines to 5 Sentry-only vars (NOTION_API_KEY, NOTION_DATABASE_ID, SENDINBLUE removed)
- markdownRenderer.js notion-to-md comment removed; defensive .replace() kept
- README updated: "Notion CMS" removed from previous stack, git submodule architecture paragraph added
- Build verified: 32 pages built successfully with zero Notion references remaining in code

## Task Commits

Each task was committed atomically:

1. **Task 1: Remove Notion packages, clean env vars, remove dead comment** - `fb1a83b` (chore)
2. **Task 2: Update README and verify build** - `0ebf239` (feat)

**Plan metadata:** (pending final commit)

## Files Created/Modified
- `package.json` - @notionhq/client and notion-to-md removed from dependencies
- `package-lock.json` - Lockfile updated by npm uninstall (13 packages removed)
- `.env.example` - Only 5 Sentry env vars remain
- `src/lib/markdownRenderer.js` - Notion-to-md comment removed (lines 38-39 deleted)
- `README.md` - Previous stack updated, submodule architecture paragraph added

## Decisions Made
- Kept the `.replace(/<p>undefined<\/p>/g, '')` in markdownRenderer.js as harmless defensive code even without notion-to-md — removing it would be unnecessary churn with no benefit
- Made surgical README edits (one line change + one paragraph) rather than rewriting to preserve the author's personal writing voice

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All Notion dead code eliminated; codebase now accurately represents local markdown architecture
- Ready for git submodule setup (03-02 if it exists) or Phase 3 is complete

## Self-Check: PASSED

- package.json: FOUND (no notionhq, no notion-to-md)
- .env.example: FOUND (5 Sentry-only lines)
- src/lib/markdownRenderer.js: FOUND (no notion comment)
- README.md: FOUND (git submodule architecture mentioned)
- 03-01-SUMMARY.md: FOUND
- Commit fb1a83b: FOUND
- Commit 0ebf239: FOUND

---
*Phase: 03-cleanup-and-submodule*
*Completed: 2026-03-05*
