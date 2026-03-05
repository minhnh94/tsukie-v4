---
num: 4
slug: fix-figcaption-not-smaller-and-centered-
description: fix figcaption not smaller and centered like production
date: 2026-03-05
---

## Quick Task 4: Fix figcaption not smaller and centered like production

### Root Cause

Production uses `rehype-figure` plugin (via old `markdownRenderer.js`) to convert markdown `![alt](url)` into `<figure class="rehype-figure"><img><figcaption>alt</figcaption></figure>`.

The new Astro content collection pipeline (`astro:content` + `render()`) does NOT have `rehype-figure` configured, so images render as plain `<img>` tags with sibling `<p>` text — no figcaption.

The `figcaption` CSS styles are already correct in `tailwind.config.js` (line 99) — just not being applied because no `<figcaption>` elements are generated.

### Fix

Add `rehype-figure` to Astro's markdown config in `astro.config.mjs`. The package is already in `package.json`.

### Tasks

#### Task 1: Add rehype-figure to astro.config.mjs

- **File:** `astro.config.mjs`
- **Action:** Import `rehype-figure` and add it to `markdown.rehypePlugins`
- **Verify:** Build/dev renders figcaptions correctly with small centered text
