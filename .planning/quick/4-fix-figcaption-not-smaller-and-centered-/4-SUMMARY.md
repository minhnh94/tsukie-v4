# Quick Task 4: fix figcaption not smaller and centered like production

**Date:** 2026-03-05
**Status:** Complete
**Commit:** 8f04986

## What was done

Added `rehype-figure` to Astro's markdown pipeline in `astro.config.mjs`.

## Root cause

The old site used a custom `markdownRenderer.js` with a unified/remark/rehype pipeline that included `rehype-figure`. This plugin converts markdown images (`![alt](url)`) wrapped in `<p>` tags into proper `<figure class="rehype-figure"><img><figcaption>alt</figcaption></figure>` HTML.

The new Astro content collection pipeline (`astro:content` + `render()`) had no rehype plugins configured, so images rendered as plain `<img>` without any `<figcaption>`. The figcaption CSS in `tailwind.config.js` was correct but never applied.

## Fix

```js
// astro.config.mjs
import rehypeFigure from 'rehype-figure';

export default defineConfig({
  markdown: {
    rehypePlugins: [rehypeFigure],
  },
  ...
});
```

The `rehype-figure` package was already present in `package.json` from the old codebase.
