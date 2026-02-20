# Codebase Structure

**Analysis Date:** 2026-02-18

## Directory Layout

```
tsukie-v3/
├── app/                           # Next.js App Router pages and layouts
│   ├── layout.jsx                 # Root layout with global styles and providers
│   ├── page.jsx                   # Home page (/)
│   ├── error.jsx                  # Error boundary for page errors
│   ├── not-found.jsx              # 404 page
│   ├── body-container.jsx         # Analytics and theme provider wrapper
│   ├── api/                       # API routes
│   │   └── suggestions/
│   │       └── route.js           # GET endpoint for article suggestions
│   ├── about/                     # About page route
│   │   └── page.jsx               # /about page
│   ├── subscribe/                 # Newsletter subscription route
│   │   ├── page.jsx               # /subscribe page
│   │   └── subscribe-form.jsx     # Form component
│   ├── projects/                  # Projects showcase routes
│   │   └── endless-defense/
│   │       ├── page.jsx           # Project landing page
│   │       └── unity-player.jsx   # WebGL Unity game player
│   ├── privacy-policy/            # Legal pages
│   │   └── page.jsx
│   ├── en/                        # Language-specific routes
│   │   └── [tag]/                 # Dynamic tag segments
│   │       └── [post]/            # Dynamic post/slug segments
│   │           ├── page.jsx       # Article page template
│   │           └── share-btn-row.jsx
│   └── apps/                      # External app landing pages
│       └── wallcal/               # WallCal app promotion
│           ├── page.jsx
│           ├── expert-calendar-addon/
│           ├── contact-us/
│           └── acknowledgements/
├── partials/                      # Reusable UI components
│   ├── Screen.jsx                 # Max-width container wrapper
│   ├── MainContent.jsx            # Main content area layout
│   ├── SideNavigation.jsx          # Left sidebar navigation (client)
│   ├── Header.jsx                 # Top header with theme toggle
│   ├── RightSidebar.jsx           # Right sidebar container
│   ├── MiddleArea.jsx             # Middle content container
│   ├── Footer.jsx                 # Page footer
│   ├── Hero.jsx                   # Homepage hero section
│   ├── ArticlesList.jsx           # Article list with tag filtering (client)
│   ├── ArticleItem.jsx            # Single article preview card
│   ├── Projects.jsx               # Projects showcase section
│   ├── WidgetNewsletter.jsx       # Newsletter signup widget
│   ├── WidgetSponsor.jsx          # Project promotion widget
│   ├── WidgetPosts.jsx            # Related articles sidebar widget
│   ├── WidgetBook.jsx             # Book recommendation widget
│   ├── PopularSubscribers.jsx     # Testimonials section
│   ├── Testimonials.jsx           # User testimonials display
│   ├── ExpTimeline.jsx            # Experience timeline component
│   ├── LoadingIndicator.jsx       # Loading spinner
│   ├── CustomLink.jsx             # Custom link component
│   ├── paragraph-from-cms.jsx     # Renders markdown content
│   ├── comment-section.jsx        # Comments area (if applicable)
│   └── Comments related (not visible in directory)
├── lib/                           # Core business logic
│   └── contentFetcher.js          # Notion API integration and data transformation
├── utils/                         # Shared utilities and constants
│   ├── constants.js               # Application-wide constants
│   └── Transition.jsx             # React Transition Group animations
├── styles/                        # Global and component-specific styles
│   ├── globals.css                # Global Tailwind CSS imports
│   └── additional-styles/         # Component-specific CSS files
├── public/                        # Static assets
│   ├── images/                    # Image assets (logo, screenshots)
│   ├── fonts/                     # Custom fonts
│   ├── endless-defense/           # WebGL game assets
│   │   ├── Build/
│   │   └── StreamingAssets/
│   └── [other static files]
├── .planning/                     # GSD planning documents
│   └── codebase/                  # Codebase analysis
├── .next/                         # Next.js build output (gitignored)
├── node_modules/                  # Dependencies (gitignored)
├── package.json                   # Project dependencies and scripts
├── package-lock.json              # Dependency lock file
├── next.config.js                 # Next.js configuration
├── jsconfig.json                  # JavaScript path aliases
├── tailwind.config.js             # Tailwind CSS configuration
├── postcss.config.js              # PostCSS configuration
└── .gitignore                     # Git ignore rules
```

## Directory Purposes

**`app/`:**
- Purpose: Next.js App Router definition - each directory = route, page.jsx = route handler
- Contains: Page components, layout templates, API routes, dynamic segments
- Key files: `layout.jsx` (root), `page.jsx` (routes), `[variable]/` (dynamic)

**`partials/`:**
- Purpose: Reusable React components shared across multiple pages
- Contains: Layout containers, widgets, content sections, presentational components
- Key files: `Screen.jsx`, `MainContent.jsx`, `SideNavigation.jsx` (layout foundation), `ArticlesList.jsx`, `WidgetNewsletter.jsx` (feature components)

**`lib/`:**
- Purpose: Core application logic and integrations, especially data fetching
- Contains: Notion API client, database queries, data transformation functions
- Key files: `contentFetcher.js` (handles all Notion database access)

**`utils/`:**
- Purpose: Shared utilities, constants, and helper components used throughout app
- Contains: Application-wide constants, animation components, helper functions
- Key files: `constants.js`, `Transition.jsx`

**`styles/`:**
- Purpose: CSS files and styling configuration
- Contains: Global CSS imports, component-specific stylesheets
- Key files: `globals.css` (Tailwind directives and resets), additional component styles

**`public/`:**
- Purpose: Static assets served directly by web server without processing
- Contains: Images, fonts, game build files, favicon
- Key files: `images/` (logo, screenshots), `fonts/` (custom typefaces), `endless-defense/` (Unity WebGL build)

## Key File Locations

**Entry Points:**
- `app/layout.jsx`: Root layout - initializes HTML, loads global styles, wraps with providers
- `app/page.jsx`: Home page at `/` - main entry point for most users
- `app/en/[tag]/[post]/page.jsx`: Article page template - rendered for each blog post
- `app/api/suggestions/route.js`: API endpoint for fetching related articles
- `app/body-container.jsx`: Client-side provider setup (analytics, theme)

**Configuration:**
- `next.config.js`: Next.js framework config with Plausible proxy and image domains
- `jsconfig.json`: Path alias `@/*` maps to root for import convenience
- `tailwind.config.js`: Tailwind theming, fonts (Inter, Aspekta), dark mode class strategy
- `postcss.config.js`: PostCSS processors for CSS transformation

**Core Logic:**
- `lib/contentFetcher.js`: All Notion database queries and content transformation
- `utils/constants.js`: Application constants like `TAG_LATEST`
- `app/page.jsx`: Data aggregation logic for homepage (separateByTags function)

**Testing:**
- No test files detected in codebase

## Naming Conventions

**Files:**
- Components: PascalCase (e.g., `SideNavigation.jsx`, `ArticlesList.jsx`)
- Utilities/Constants: camelCase (e.g., `contentFetcher.js`, `constants.js`)
- Styles: globals.css or component-specific names
- API Routes: `route.js` in feature directories (Next.js 14 convention)

**Directories:**
- Feature directories: lowercase plural (e.g., `partials/`, `utils/`, `styles/`)
- Route segments: lowercase with hyphens for multi-word routes (e.g., `privacy-policy/`, `endless-defense/`)
- Dynamic segments: Square brackets for variables (e.g., `[tag]/`, `[post]/`)

**Component Props:**
- camelCase for all prop names
- Boolean props often use verb prefixes: `isCollapsed`, `trackOutboundLinks`, `suppressHydrationWarning`
- Callback props use handler prefix: `onChange`, `onTagSelection`, `onClick`

**Variables & Functions:**
- camelCase throughout (e.g., `selectedTag`, `handleClick`, `filteredItems`)
- Functions that fetch data: `getPagesFromDB()`, `getPageIdBySlug()`, `getPageContentAsMarkdownById()`
- Functions that transform data: `convertPagePropertiesToConsumable()`, `separateByTags()`

## Where to Add New Code

**New Feature (Blog Enhancement):**
- Primary code: Create component in `partials/` if reusable, or add to relevant `app/*/page.jsx`
- Data fetching: Add function to `lib/contentFetcher.js` if querying Notion
- Tests: Create `*.test.js` or `*.spec.js` adjacent to implementation (pattern not yet established)
- Styling: Add Tailwind classes inline in component or create CSS file in `styles/additional-styles/`

**New Component/Module:**
- UI Component: `partials/{ComponentName}.jsx`
- Page/Route: `app/{route-name}/page.jsx`
- API Endpoint: `app/api/{feature-name}/route.js`
- Shared Utility: `utils/{utilityName}.js`

**Utilities & Helpers:**
- Shared constants: `utils/constants.js`
- Shared components: `utils/` (e.g., `Transition.jsx`)
- Data transformation: `lib/contentFetcher.js` or new `lib/{domain}.js` file

**Styling:**
- Global styles: Add to `styles/globals.css`
- Component-specific: Create CSS file in `styles/additional-styles/{ComponentName}.css` or use Tailwind classes
- Theme config: Update `tailwind.config.js` for new colors, fonts, or design tokens

## Special Directories

**`.next/`:**
- Purpose: Next.js build output and cache
- Generated: Yes (built during `npm run build`)
- Committed: No (in .gitignore) - ignored by version control

**`node_modules/`:**
- Purpose: Installed npm dependencies
- Generated: Yes (installed via `npm install`)
- Committed: No (in .gitignore) - dependencies locked in package-lock.json

**`.planning/`:**
- Purpose: GSD planning and codebase documentation
- Generated: Yes (populated by GSD commands)
- Committed: Yes (tracking planning decisions)
- Contents: `codebase/` contains analysis documents (ARCHITECTURE.md, STRUCTURE.md, etc.)

---

*Structure analysis: 2026-02-18*
