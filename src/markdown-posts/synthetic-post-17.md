---
title: Postgres Full-Text Search Is Good Enough
tags: tech
date: 2025-09-10
ready: true
thumbnail: https://placehold.co/600x400/1e293b/38bdf8?text=Tech+Post
slug: postgres-full-text-search-is-good-enough
summary: Before you add Elasticsearch to your stack, try Postgres full-text search. For most applications, it handles 90% of search requirements with zero additional infrastructure.
readCount: 298
---

## The Over-Engineering Instinct

When someone says "we need search," engineers immediately think Elasticsearch or Algolia. Both are excellent tools. Both are also significant operational overhead.

Postgres has built-in full-text search that most developers never discover.

```sql
-- Create a GIN index on your content column
CREATE INDEX posts_fts_idx ON posts
USING gin(to_tsvector('english', title || ' ' || body));

-- Query with ranking
SELECT id, title, ts_rank(
  to_tsvector('english', title || ' ' || body),
  plainto_tsquery('english', 'your search query')
) AS rank
FROM posts
WHERE to_tsvector('english', title || ' ' || body)
  @@ plainto_tsquery('english', 'your search query')
ORDER BY rank DESC;
```

For a blog, documentation site, or small SaaS with under 1 million records, this is all you need. Add Elasticsearch only when Postgres genuinely cannot keep up.
