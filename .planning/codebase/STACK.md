# Technology Stack

**Analysis Date:** 2026-02-18

## Languages

**Primary:**
- JavaScript/JSX - React components and app logic
- Node.js JavaScript - API routes and server-side code

## Runtime

**Environment:**
- Node.js v24.10.0
- Next.js 14.1.0 (React framework with server-side rendering and API routes)

**Package Manager:**
- npm 11.6.0
- Lockfile: `package-lock.json` (present)

## Frameworks

**Core:**
- Next.js 14.1.0 - Full-stack React framework with App Router, API routes, and static generation
- React 18.2.0 - UI component library
- React DOM 18.2.0 - React DOM rendering

**Styling & UI:**
- Tailwind CSS 3.2.7 - Utility-first CSS framework
- @tailwindcss/forms 0.5.3 - Form component styling for Tailwind
- PostCSS 8.4.21 - CSS processing and transpilation
- Autoprefixer 10.4.13 - Automatic vendor prefixes for CSS

**Content & Markdown:**
- react-markdown 8.0.5 - Render Markdown as React components
- notion-to-md 2.5.5 - Convert Notion content to Markdown
- rehype-highlight 6.0.0 - Code syntax highlighting for Markdown
- rehype-raw 6.1.1 - Allow raw HTML in rehype/remark
- rehype-figure 1.0.1 - Parse figure elements in HTML/rehype

**Utilities & Libraries:**
- dayjs 1.11.7 - Date manipulation and formatting
- reading-time 1.5.0 - Calculate reading time for articles
- react-transition-group 4.4.5 - Manage React component animations
- @heroicons/react 2.0.16 - Hero Icons React components

**Theme & Appearance:**
- next-themes 0.2.1 - Dark/light mode theme switching

**Analytics & Monitoring:**
- @vercel/analytics 0.1.11 - Vercel Web Analytics integration
- next-plausible 3.12.4 - Plausible Analytics integration

**Special Purpose:**
- react-unity-webgl 9.5.0 - Embed Unity WebGL games in React

**Development Tools:**
- Prettier 3.6.2 - Code formatter
- postcss-import 15.1.0 - Import CSS files within other CSS files

## Configuration

**Environment:**
- Configuration via environment variables (see `.env.example`)
- Required env vars:
  - `NOTION_API_KEY` - Notion API authentication token
  - `NOTION_DATABASE_ID` - Notion database ID for content
  - `YOUR_SENDINBLUE_API_KEY` - Sendinblue API key (for email services)

**Build:**
- `next.config.js` - Next.js configuration with image domains and Plausible proxy
- `tailwind.config.js` - Tailwind CSS customization (fonts, typography, dark mode)
- `postcss.config.js` - PostCSS plugin pipeline (postcss-import, tailwindcss, autoprefixer)
- `jsconfig.json` - JavaScript compiler options with path alias `@/*` pointing to root

**Code Formatting:**
- `.prettierrc` - Empty configuration (uses Prettier defaults)
- `.prettierignore` - Files excluded from Prettier formatting

## Platform Requirements

**Development:**
- Node.js 24.10.0 or compatible
- npm 11.6.0 or compatible
- Modern browser with ES2020+ support

**Production:**
- Deployment on Vercel (optimized for Vercel's Next.js hosting)
- Can also run on any Node.js compatible platform

## Image Handling

**Image Domains:**
- `tsukie.com` - Own domain for images
- `i.imgur.com` - Imgur for externally hosted images

---

*Stack analysis: 2026-02-18*
