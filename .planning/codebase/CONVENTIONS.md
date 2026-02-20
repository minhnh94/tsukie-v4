# Coding Conventions

**Analysis Date:** 2026-02-18

## Naming Patterns

**Files:**
- React components: PascalCase (e.g., `Header.jsx`, `ArticleItem.jsx`, `SideNavigation.jsx`)
- Lower-case hyphenated for regular files (e.g., `paragraph-from-cms.jsx`, `subscribe-form.jsx`)
- Utilities and libraries: camelCase (e.g., `contentFetcher.js`, `constants.js`)
- Next.js special files: lowercase or PascalCase as per framework (e.g., `page.jsx`, `layout.jsx`, `error.jsx`, `route.js`)

**Functions:**
- Component functions: PascalCase (e.g., `function Header()`, `function ArticleItem()`, `function SideNavigation()`)
- Utility functions: camelCase (e.g., `convertPagePropertiesToConsumable`, `separateByTags`, `getPostContent`)
- Arrow functions for utility exports: camelCase (e.g., `const PAGE_SIZE = 10`, `const convertPagePropertiesToConsumable = (id, pageProperties) => {}`)

**Variables:**
- Constants: UPPER_SNAKE_CASE for module-level constants (e.g., `PAGE_SIZE`, `TAG_LATEST`)
- Local variables: camelCase (e.g., `isCollapsed`, `selectedTag`, `suggestedPosts`)
- State variables: camelCase with semantic naming (e.g., `setIsCollapsed`, `setSelectedTag`)

**Types:**
- React component props: camelCase when destructured
- Object properties: camelCase (e.g., `pageProperties`, `readingStats`)

## Code Style

**Formatting:**
- Prettier (v3.6.2) for code formatting
- Config file: `.prettierrc` (minimal/empty config using defaults)
- Ignore file: `.prettierignore` (ignores `.next` and `node_modules`)

**Linting:**
- Next.js built-in linting via `next lint` command
- No separate ESLint configuration file found
- Uses Next.js default lint rules

**Language:**
- JSX/JavaScript (not TypeScript) throughout the codebase
- File extensions: `.jsx` for components, `.js` for utilities and config

## Import Organization

**Order:**
1. External framework imports (React, Next.js) at top
2. Third-party library imports
3. Internal component imports from `@/partials`
4. Internal utility imports from `@/lib`, `@/utils`
5. Relative imports only when necessary

**Examples:**
```jsx
import React from 'react'
import { useState } from 'react'
import Link from "next/link"
import { useTheme } from "next-themes"

import ArticleItem from '@/partials/ArticleItem'
import { TAG_LATEST } from "@/utils/constants"
import { getPagesForSidebar } from "@/lib/contentFetcher"
```

**Path Aliases:**
- Base alias: `@/*` maps to `./*` (project root)
- Used throughout for cleaner imports: `@/app`, `@/partials`, `@/lib`, `@/utils`, `@/styles`
- Configured in `jsconfig.json`

## Error Handling

**Patterns:**
- Throw errors in async functions: `throw new Error(\`Message: ${variable}\`)`
- Example: `throw new Error(\`Page not found: ${params.post}\`)` in `app/en/[tag]/[post]/page.jsx`
- No try-catch blocks observed in main codebase
- Next.js error boundaries: `app/error.jsx` provides fallback error UI component
- Error page rendered as component with user-friendly message

## Logging

**Framework:** `console.log()` and `console.error()` (native browser/Node console)

**Patterns:**
- Development logging in effects: `console.log('Fetching suggested posts...')` in `partials/WidgetPosts.jsx`
- Data logging for debugging: `console.log(suggestedPosts)` after fetch
- No structured logging or third-party logging libraries detected
- Comments indicate intentional debugging: `console.log` used to track fetch operations

## Comments

**When to Comment:**
- Inline comments for disabled/todo features: `{/* TODO: Disabled until I find a use for this */}`
- Section markers for HTML structure: `{/* Content */}`, `{/* Share buttons */}`, `{/* Post header */}`
- Tailwind/CSS notes: `{/* react_markdown class defined in typography.css */}`
- Functional explanations: `// 12 hours` for cache revalidation time

**JSDoc/TSDoc:**
- Not observed in codebase (JSDoc not used)
- Function comments limited to inline notes

## Function Design

**Size:**
- Small, focused functions typical
- Average component: 50-150 lines
- Helper functions extracted separately: `getPostContent()` is separate async helper

**Parameters:**
- Component props destructured for clarity: `function ArticleItem(props)` with destructuring in body
- Some props destructured directly: `function WidgetSponsor({ imageRotationClass, title, pjName, ... })`
- Function parameters: simple parameters or destructured objects

**Return Values:**
- Components return JSX elements
- Async functions return objects: `{ pages, hasMore, nextCursor }`
- No explicit type annotations (no TypeScript)

## Module Design

**Exports:**
- Default exports for page components: `export default function Page()`
- Default exports for components: `export default Header`
- Named exports for utilities: `export const getPagesFromDB = async (...)`
- Mix of default and named exports used contextually

**Barrel Files:**
- Not used
- Each file is self-contained import

## Component Structure

**Functional Components:**
- All components are functional (no class components)
- Server components by default (no `'use client'` = Server Component)
- Client components marked with `'use client'` directive at top: `Header.jsx`, `SideNavigation.jsx`, `ArticlesList.jsx`
- Hooks used in client components: `useState`, `useEffect`, `useRef`, `useContext`, `usePathname`, `useTheme`

**Props Pattern:**
- Some components accept full `props` object and access properties: `props.tag`, `props.slug`
- Others destructure props: `{ items, tags }`, `{ show, appear, ...rest }`

## Spacing and Formatting

**JSX:**
- Curly braces with spaces: `{ variable }` instead of `{variable}`
- Inline conditionals common: `{ selectedTag === tag ? ... : ... }`
- Arrow functions in JSX: `.map((item) => <Component ... />)`

**CSS Classes:**
- Tailwind CSS heavily used
- Class strings inline in JSX
- Template literals for conditional classes: `` className={`base-class ${condition ? 'active' : ''}`} ``
- Long class strings sometimes wrapped in template literals for readability

---

*Convention analysis: 2026-02-18*
