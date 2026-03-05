---
plan: 1
type: execute
wave: 1
depends_on: []
files_modified:
  - src/lib/contentFetcher.js
  - src/pages/about.astro
  - src/pages/privacy-policy.astro
  - src/pages/projects/endless-defense.astro
autonomous: true
requirements: []

must_haves:
  truths:
    - "Posts are loaded from src/markdown/posts/ (not src/markdown-posts/)"
    - "about.astro renders content from src/markdown/about.md"
    - "privacy-policy.astro renders content from src/markdown/privacy-policy.md"
    - "endless-defense.astro renders content from src/markdown/endless-defense-description.md"
  artifacts:
    - path: "src/lib/contentFetcher.js"
      provides: "POSTS_DIR points to src/markdown/posts, exports getStaticPageContent(filename)"
    - path: "src/pages/about.astro"
      provides: "Calls getStaticPageContent('about.md')"
    - path: "src/pages/privacy-policy.astro"
      provides: "Calls getStaticPageContent('privacy-policy.md')"
    - path: "src/pages/projects/endless-defense.astro"
      provides: "Calls getStaticPageContent('endless-defense-description.md')"
  key_links:
    - from: "src/pages/about.astro"
      to: "src/markdown/about.md"
      via: "getStaticPageContent('about.md') in contentFetcher.js"
    - from: "src/lib/contentFetcher.js"
      to: "src/markdown/posts/"
      via: "POSTS_DIR = path.join(process.cwd(), 'src/markdown/posts')"
---

<objective>
Update content loading so blog posts are read from `src/markdown/posts/` and static pages (about, privacy-policy, endless-defense) read their content from dedicated markdown files in `src/markdown/` — replacing the previous Notion UUID-based lookups.

Purpose: The codebase still points POSTS_DIR at the old `src/markdown-posts` submodule path and uses Notion UUIDs to identify static page content. Both are broken after the Phase 3 migration.
Output: `contentFetcher.js` with corrected POSTS_DIR and a new `getStaticPageContent` helper; three page files updated to use file-based loading.
</objective>

<execution_context>
@/Users/minhnh/.claude/get-shit-done/workflows/execute-plan.md
@/Users/minhnh/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
</context>

<tasks>

<task type="auto">
  <name>Task 1: Fix POSTS_DIR and add getStaticPageContent to contentFetcher.js</name>
  <files>src/lib/contentFetcher.js</files>
  <action>
    Make two changes to `src/lib/contentFetcher.js`:

    1. Change line 6 from:
       `const POSTS_DIR = path.join(process.cwd(), 'src/markdown-posts');`
       to:
       `const POSTS_DIR = path.join(process.cwd(), 'src/markdown/posts');`

    2. Add a new exported function after the existing `getPageContentAsMarkdownById` export (at the end of the file):

    ```js
    const STATIC_PAGES_DIR = path.join(process.cwd(), 'src/markdown');

    export const getStaticPageContent = (filename) => {
      const filePath = path.join(STATIC_PAGES_DIR, filename);
      return fs.readFileSync(filePath, 'utf8');
    };
    ```

    This function reads plain markdown files (no frontmatter) directly by filename. It is synchronous because Astro SSG build-time reads do not require async.
  </action>
  <verify>
    <automated>node -e "import('./src/lib/contentFetcher.js').then(m => { console.log(typeof m.getStaticPageContent); console.log(typeof m.getPagesFromDB); })"</automated>
  </verify>
  <done>POSTS_DIR references src/markdown/posts and getStaticPageContent is exported from contentFetcher.js</done>
</task>

<task type="auto">
  <name>Task 2: Update about.astro, privacy-policy.astro, and endless-defense.astro to use getStaticPageContent</name>
  <files>src/pages/about.astro, src/pages/privacy-policy.astro, src/pages/projects/endless-defense.astro</files>
  <action>
    In each of the three pages, make two edits:

    **src/pages/about.astro**
    - Change import line from: `import { getPageContentAsMarkdownById } from '@/lib/contentFetcher.js';`
      to: `import { getStaticPageContent } from '@/lib/contentFetcher.js';`
    - Change content fetch line from: `const content = await getPageContentAsMarkdownById('8df3801c8eab41b880457de0af11cccd');`
      to: `const content = getStaticPageContent('about.md');`

    **src/pages/privacy-policy.astro**
    - Change import line from: `import { getPageContentAsMarkdownById } from '@/lib/contentFetcher.js';`
      to: `import { getStaticPageContent } from '@/lib/contentFetcher.js';`
    - Change content fetch line from: `const content = await getPageContentAsMarkdownById('85cc3bc73db54b74bd4a804a61705fc4');`
      to: `const content = getStaticPageContent('privacy-policy.md');`

    **src/pages/projects/endless-defense.astro**
    - Change import line from: `import { getPageContentAsMarkdownById } from '@/lib/contentFetcher.js';`
      to: `import { getStaticPageContent } from '@/lib/contentFetcher.js';`
    - Change content fetch line from: `const content = await getPageContentAsMarkdownById('ced24c15f6f542adb8d4ab3b21c93040');`
      to: `const content = getStaticPageContent('endless-defense-description.md');`

    Note: `getStaticPageContent` is synchronous — remove the `await` keyword from all three call sites.
  </action>
  <verify>
    <automated>npm run build 2>&1 | tail -20</automated>
  </verify>
  <done>Build succeeds without errors. All three pages compile without referencing Notion UUIDs.</done>
</task>

</tasks>

<verification>
After both tasks:
- `npm run build` completes without errors
- `src/lib/contentFetcher.js` has POSTS_DIR pointing to `src/markdown/posts`
- `getStaticPageContent` is exported and reads from `src/markdown/`
- No page files reference Notion UUID strings
</verification>

<success_criteria>
`npm run build` succeeds. The about, privacy-policy, and endless-defense pages render content sourced from local markdown files in `src/markdown/`.
</success_criteria>

<output>
No SUMMARY.md required for quick plans.
</output>
