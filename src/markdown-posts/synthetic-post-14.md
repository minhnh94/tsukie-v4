---
title: Writing a Compiler for Fun and Mild Profit
tags: dev
date: 2025-07-21
ready: true
thumbnail: https://placehold.co/600x400/1e293b/38bdf8?text=Dev+Post
slug: writing-a-compiler-for-fun-and-mild-profit
summary: I wrote a small domain-specific language and compiler over three weekends. It changed how I understand every programming language I use, and it was the most fun I had coding all year.
readCount: 34
---

## Why Build a Compiler

Compilers seem intimidating until you build one. Then they seem obvious.

Every compiler does the same four things: tokenize the input, parse tokens into an AST, analyze the AST for correctness, emit output.

```
Source code → [Lexer] → Tokens → [Parser] → AST → [Analyzer] → [Emitter] → Output
```

I built a tiny expression language that compiles to JavaScript. The whole thing fits in 400 lines.

```javascript
// My language
let x = 2 + 3 * 4
print(x)

// Compiled output
const x = 2 + (3 * 4);
console.log(x);
```

The experience fundamentally changed how I read error messages. Now I understand what "unexpected token" actually means at the implementation level.
