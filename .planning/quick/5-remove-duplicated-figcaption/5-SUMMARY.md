---
phase: quick-5
plan: 01
subsystem: markdown-pipeline
tags: [rehype, figcaption, deduplication, image-captions]
dependency_graph:
  requires: [rehype-figure]
  provides: [rehypeRemoveFigcaptionDuplicate]
  affects: [astro.config.mjs, all blog posts with image captions]
tech_stack:
  added: []
  patterns: [rehype-plugin, unist-util-visit, ESM]
key_files:
  created:
    - src/lib/rehypeRemoveFigcaptionDuplicate.js
  modified:
    - astro.config.mjs
decisions:
  - "Plugin runs after rehype-figure so it sees the <figure> nodes it creates"
  - "Whitespace text nodes between figure and paragraph are skipped when finding next sibling"
  - "splice() used to remove the duplicate paragraph from parent.children array"
metrics:
  duration: "~5 minutes"
  completed: "2026-03-06"
  tasks_completed: 2
  files_changed: 2
---

# Phase quick-5 Plan 01: Remove Duplicated Figcaption Summary

**One-liner:** Rehype plugin that removes duplicate plain-text paragraphs after rehype-figure figures, keeping only the styled figcaption.

## What Was Built

A custom rehype plugin (`rehypeRemoveFigcaptionDuplicate`) that fixes a Notion export artifact where image captions appear twice — once as a styled `<figcaption>` (from rehype-figure) and once as a plain `<p>` paragraph below the image.

The plugin:
1. Visits all `<figure class="rehype-figure">` elements
2. Extracts the text content of the `<figcaption>` child
3. Finds the next meaningful sibling (skipping whitespace text nodes)
4. Removes the sibling `<p>` if its text matches the figcaption text exactly

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Create rehypeRemoveFigcaptionDuplicate plugin | 0203151 | src/lib/rehypeRemoveFigcaptionDuplicate.js |
| 2 | Register plugin in astro.config.mjs | 9e31f05 | astro.config.mjs |

## Verification Results

- Plugin correctly removes `<p>Caption text</p>` while preserving `<figcaption>Caption text</figcaption>`
- `npx astro build` completed successfully: 32 pages built
- Inspected `falling-in-love-with-boox-palma-2` built HTML: figcaptions appear once, no duplicate paragraphs

## Deviations from Plan

### Auto-fixed Issues

None.

### Notes

The plan's verify script used `(html.match(/Caption text/g) || []).length !== 1` which counts the `alt="Caption text"` attribute too, making it always return 2 even when the plugin works correctly. A more accurate check (`<p>Caption text</p>` count = 0 and `<figcaption>Caption text</figcaption>` count = 1) confirms the plugin is functioning correctly.

## Self-Check: PASSED

- src/lib/rehypeRemoveFigcaptionDuplicate.js: FOUND
- astro.config.mjs: FOUND
- commit 0203151 (plugin): FOUND
- commit 9e31f05 (config): FOUND
