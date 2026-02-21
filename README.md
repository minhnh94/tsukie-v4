This is the code behind **tsukie.com**.

Current stack: **Astro + Cloudflare**
Previous life: **Next.js + Vercel + Notion CMS**
Theme was from Cruip.

Repos:

* Next.js era (v3): [https://github.com/minhnh94/tsukie-v3](https://github.com/minhnh94/tsukie-v3)
* Astro era (v4): [https://github.com/minhnh94/tsukie-v4](https://github.com/minhnh94/tsukie-v4)
* Gatsby (v2)
* Hexo (v1)

---

### Why so many rewrites?

Because every time the stack started owning me instead of the other way around.

#### v1 — Hexo

Felt “simple” until it wasn’t.
Template hacking. Data plumbing gymnastics.
Three years deep and I was fighting the tool more than writing. Dead end.

#### v2 — Gatsby

React + GraphQL sounded cool.
Until GraphQL became the main character in a blog that just needed… posts.
Convention soup. Steep learning curve.
Yes, I shipped. No, the codebase was not okay.

#### v3 — Next.js (Vercel era)

This one felt right.
Minimal APIs. Total control.
Deploying on Vercel was stupid easy.
I cut multi-language. Focused on English. Shipped fast.
For a while, this was peak.

But then…

The ecosystem started getting heavier.
More opinions. More layers. More magic.
Next.js + Vercel + edge + adapters + config drift.

It worked — but it wasn’t simple anymore.

---

### v4 — Astro + Cloudflare (current)

I moved off Next.js.

Astro fits my use case better: content-first, mostly static, minimal JS.
No overengineering. No “framework brain.”

And the big win:
I unified everything under Cloudflare.

Hosting. CDN. Workers. Edge. DNS.
One platform. Fewer moving parts.
Lower mental overhead.

I want to write. Not babysit infra.

---

The blog is finally where I want it:

* Fast
* Minimal
* Maintainable
* Boring (in a good way)

Now the focus is writing.

Too many devs love building blogs more than writing on them.
I’ve been that guy. Done with that arc.

If you’re into owning your stack without drowning in it, feel free to peek at the repos.