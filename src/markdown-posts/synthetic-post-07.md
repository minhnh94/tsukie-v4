---
title: Understanding the Event Loop Without Going Insane
tags: tech
date: 2025-04-03
ready: true
thumbnail: https://placehold.co/600x400/1e293b/38bdf8?text=Tech+Post
slug: understanding-the-event-loop-without-going-insane
summary: The JavaScript event loop is one of those concepts that seems simple until it is not. This is the explanation I wish I had when I was starting out.
readCount: 344
---

## The Single Thread Illusion

JavaScript is single-threaded. That means it can only do one thing at a time. So how does it handle thousands of concurrent operations?

The answer is the event loop: a mechanism for scheduling work across time.

```javascript
console.log('1 - synchronous');

setTimeout(() => console.log('3 - macro task'), 0);

Promise.resolve().then(() => console.log('2 - micro task'));

console.log('1.5 - also synchronous');

// Output:
// 1 - synchronous
// 1.5 - also synchronous
// 2 - micro task
// 3 - macro task
```

The call stack runs synchronous code first, then drains the microtask queue (Promises), then picks the next macro task (setTimeout, setInterval) from the task queue.

Understanding this ordering is essential for debugging async bugs.
