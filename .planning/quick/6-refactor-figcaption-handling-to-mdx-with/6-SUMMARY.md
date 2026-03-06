---
phase: quick-6
plan: 1
subsystem: content
tags: [mdx, figcaption, image-component, refactor]
dependency_graph:
  requires: []
  provides: [ImageFigure.astro, MDX post conversion]
  affects: [astro.config.mjs, src/content.config.ts, src/markdown/posts]
tech_stack:
  added: ["@astrojs/mdx"]
  patterns: [MDX components, Astro component branching]
key_files:
  created:
    - src/components/ImageFigure.astro
    - src/markdown/posts/*.mdx (13 files)
  modified:
    - astro.config.mjs
    - src/content.config.ts
  deleted:
    - src/lib/remarkRemoveFigcaptionDuplicate.js
    - src/markdown/posts/*.md (13 files)
decisions:
  - key: ImageFigure uses plain img for string src
    why: Remote URLs (https://i.imgur.com/...) cannot use astro:assets Image component without domain configuration
  - key: Escaped HTML entities in MDX captions for quotes
    why: JSX attribute values require proper escaping of special characters like double quotes
  - key: Escaped &lt;your unit test case&gt; in unit test post
    why: MDX strict parsing treats < > in prose as JSX tags; required HTML entity escaping
metrics:
  duration_minutes: 13
  completed_date: "2026-03-06"
  tasks_completed: 2
  files_changed: 21
---

# Phase quick-6 Plan 1: Refactor Figcaption Handling to MDX with ImageFigure Summary

**One-liner:** Replace two-plugin remark/rehype figcaption pipeline with explicit ImageFigure.astro component used directly in 13 MDX posts, eliminating rehype-figure and remarkRemoveFigcaptionDuplicate.

## What Was Built

### Task 1: Infrastructure setup
- Installed `@astrojs/mdx` package
- Created `src/components/ImageFigure.astro` — renders `<figure>/<figcaption>` for images with captions; uses plain `<img>` for string src (remote URLs), `astro:assets Image` only for ImageMetadata objects
- Updated `astro.config.mjs`: added `mdx()` to integrations, removed `rehypePlugins: [rehypeFigure]` and `remarkPlugins: [remarkRemoveFigcaptionDuplicate]`
- Updated `src/content.config.ts`: glob pattern changed from `**/*.md` to `**/*.{md,mdx}`
- Deleted `src/lib/remarkRemoveFigcaptionDuplicate.js`

### Task 2: Post conversion
Converted all 13 posts with captioned images from `.md` to `.mdx`:
- Added `import ImageFigure from '@/components/ImageFigure.astro'` after frontmatter
- Replaced `![caption](url)` with `<ImageFigure src="url" alt="caption" caption="caption" />`
- Replaced `![](url)` (empty alt) with `<img src="url" alt="" loading="lazy" decoding="async" />`
- Removed duplicate caption paragraphs that followed captioned images
- Deleted all 13 original `.md` files
- Build passes with no errors

### Posts without captions
All other `.md` posts remain unchanged and render normally.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] MDX strict parsing: `<your unit test case>` in prose**
- **Found during:** Task 2 verification (astro build)
- **Issue:** `debug-laravel-unit-test-in-docker-with-xdebug-and-phpstorm.mdx` line 72 had `<your unit test case>` in paragraph text — MDX parser treated it as an unclosed JSX tag
- **Fix:** Replaced with `&lt;your unit test case&gt;` HTML entities
- **Files modified:** `src/markdown/posts/debug-laravel-unit-test-in-docker-with-xdebug-and-phpstorm.mdx`

## Commits

| Hash | Message |
|------|---------|
| c7d9b1b | feat(quick-6): install MDX, create ImageFigure component, update config and content schema |
| 347da5c | feat(quick-6): convert 13 captioned posts from .md to .mdx with ImageFigure component |

## Self-Check: PASSED

- [x] `src/components/ImageFigure.astro` exists
- [x] `astro.config.mjs` has `mdx()`, no `rehypePlugins` or `remarkPlugins`
- [x] `src/content.config.ts` has `{md,mdx}` glob
- [x] `src/lib/remarkRemoveFigcaptionDuplicate.js` deleted
- [x] All 13 `.mdx` files created in `src/markdown/posts/`
- [x] All 13 original `.md` files deleted
- [x] `astro build` completes successfully (32 pages built)

## Awaiting Human Verification

Task 3 (checkpoint:human-verify) — run `npm run dev` and visually verify:
1. Visit http://localhost:4321/en/personal/falling-in-love-with-boox-palma-2 — images with captions should render `<figure class="image-figure">` with `<figcaption class="image-figcaption">`
2. Confirm no duplicate caption text below images
3. Visit a post without captions — images render as plain `<img>` without figcaption
4. Check figcaption styling matches production (smaller, centered — per quick-4)
