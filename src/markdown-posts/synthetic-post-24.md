---
title: Why I Rewrote My Blog in Astro
tags: indie
date: 2026-01-15
ready: true
thumbnail: https://placehold.co/600x400/1e293b/38bdf8?text=Indie+Post
slug: why-i-rewrote-my-blog-in-astro
summary: I migrated my blog from Next.js to Astro and the result is a site that loads in 0.8 seconds, ships zero JavaScript by default, and is a joy to maintain.
readCount: 543
---

## The Next.js Overhead

My Next.js blog was slow. Not unusably slow, but a 2-3 second load time for what was essentially static content felt wrong.

The problem: Next.js ships a significant JavaScript runtime to handle client-side hydration, routing, and state management. For a blog, none of that is needed.

Astro's island architecture changes the equation.

```astro
---
// This component ships zero JavaScript to the client
const { title, content } = Astro.props;
---
<article>
  <h1>{title}</h1>
  <div set:html={content} />
</article>
```

The migration took a weekend. The results were immediate: Lighthouse score jumped from 71 to 98. Build time went from 45 seconds to 8 seconds.

[Learn more about Astro](https://astro.build)

Astro is now my default for any content-heavy site.
