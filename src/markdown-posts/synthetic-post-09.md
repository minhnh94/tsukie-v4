---
title: Shipping a Desktop App with Tauri After Fighting Electron
tags: dev
date: 2025-05-02
ready: true
thumbnail: https://placehold.co/600x400/1e293b/38bdf8?text=Dev+Post
slug: shipping-a-desktop-app-with-tauri-after-fighting-electron
summary: I rewrote my Electron app in Tauri and cut the binary size from 180MB to 8MB. This is a real-world comparison of the two frameworks.
readCount: 267
---

## The Electron Problem

Electron apps ship an entire Chromium browser and Node.js runtime. Your users download 150-200MB to run what is essentially a web page.

That felt wrong to me. I wanted a native app that felt fast, not a web app pretending to be native.

Enter Tauri: a Rust-based framework that uses the system's native webview instead of bundling Chromium.

```toml
# tauri.conf.json size comparison
# Electron hello world: ~180MB
# Tauri hello world: ~3MB

[build]
beforeBuildCommand = "npm run build"
beforeDevCommand = "npm run dev"
```

The catch: you need to learn enough Rust to write the backend logic. For simple apps, that is minimal. For complex system integrations, the learning curve is real.
