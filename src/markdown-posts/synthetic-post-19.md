---
title: Building a CLI Tool That People Actually Use
tags: dev
date: 2025-10-12
ready: true
thumbnail: https://placehold.co/600x400/1e293b/38bdf8?text=Dev+Post
slug: building-a-cli-tool-that-people-actually-use
summary: Most developer tools are abandoned because they have poor discoverability, confusing flags, and unhelpful error messages. Here is how I built a CLI that strangers use and recommend.
readCount: 189
---

## The Three Laws of Useful CLIs

After maintaining a CLI tool with 2,000 GitHub stars, I have distilled what makes people keep using a tool versus abandoning it after 10 minutes.

**Law 1: Defaults should be right 90% of the time**

```bash
# Bad — requires flags for basic use case
mytool --input file.json --output result.json --format json --verbose false

# Good — sensible defaults, flags for edge cases
mytool file.json
```

**Law 2: Error messages must tell you what to do next**

```bash
# Bad
Error: invalid configuration

# Good
Error: missing required field 'apiKey' in config.json
Run 'mytool init' to create a default configuration file.
```

**Law 3: The help text must be a tutorial, not a reference manual**

Include a concrete example in the help output. People learn by example, not by reading option descriptions.
