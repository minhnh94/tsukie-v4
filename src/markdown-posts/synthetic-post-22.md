---
title: The Real Reason Your API is Slow
tags: tech
date: 2025-11-30
ready: true
thumbnail: https://placehold.co/600x400/1e293b/38bdf8?text=Tech+Post
slug: the-real-reason-your-api-is-slow
summary: After profiling dozens of slow APIs, the culprit is almost never the framework or language. It is almost always N+1 queries, missing indexes, or serializing too much data.
readCount: 421
---

## The N+1 Problem

The N+1 problem is when you make one query to get a list of records, then make one additional query per record to get related data. The result: 101 database queries instead of 2.

```javascript
// N+1 problem — 1 query for posts + N queries for authors
const posts = await db.posts.findAll();
for (const post of posts) {
  post.author = await db.users.findById(post.authorId); // N queries
}

// Fixed — 2 queries total with a JOIN or includes
const posts = await db.posts.findAll({
  include: [{ model: db.users, as: 'author' }]
});
```

The fix is almost always an eager load (JOIN) or a second batched query. Most ORMs support this natively.

Before reaching for caching, Redis, or horizontal scaling, profile your queries. You will almost certainly find an N+1 hiding somewhere.
