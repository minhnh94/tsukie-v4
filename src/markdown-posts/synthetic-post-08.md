---
title: Reading More Books Changed How I Write Code
tags: life
date: 2025-04-17
ready: true
thumbnail: https://placehold.co/600x400/1e293b/38bdf8?text=Life+Post
slug: reading-more-books-changed-how-i-write-code
summary: "I started reading 30 books a year and discovered that great writing and great code share the same principles: clarity, restraint, and respect for the reader."
readCount: 78
---

## The Hemingway Principle

Hemingway was famous for writing short, declarative sentences. No unnecessary words, no fluff, no showing off.

The best code I have ever read has the same quality. Functions do one thing. Variable names are honest. Comments explain _why_, not _what_.

```python
# Bad — verbose, unclear intent
def get_data_and_process_it_for_the_frontend(raw_input_data):
    result = []
    for item in raw_input_data:
        if item is not None:
            result.append(transform(item))
    return result

# Good — Hemingway code
def transform_all(items):
    return [transform(item) for item in items if item is not None]
```

Reading great books trains your eye for prose quality. That eye transfers directly to code review.
