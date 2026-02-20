# Testing Patterns

**Analysis Date:** 2026-02-18

## Test Framework

**Runner:**
- Not detected - No test runner configured
- No `jest.config.js`, `vitest.config.js`, or similar files present
- No test commands in `package.json`

**Assertion Library:**
- Not applicable (no testing framework installed)

**Run Commands:**
```bash
npm run lint              # Run Next.js linting
npm run dev              # Development mode
npm run build            # Build for production
npm run start            # Start production server
```

## Test File Organization

**Location:**
- No test files found in codebase
- Glob search for `*.test.*` and `*.spec.*` returned no results

**Naming:**
- Not applicable (no tests present)

**Structure:**
- Not applicable (no tests present)

## Test Structure

**Suite Organization:**
- Not applicable (no testing framework configured)

**Patterns:**
- Not applicable (no tests present)

## Mocking

**Framework:**
- Not used (no testing framework)

**Patterns:**
- Not applicable

**What to Mock:**
- Not established

**What NOT to Mock:**
- Not established

## Fixtures and Factories

**Test Data:**
- Not used (no tests present)

**Location:**
- Not applicable

## Coverage

**Requirements:**
- None enforced - No coverage tracking configured

**View Coverage:**
- Not applicable

## Test Types

**Unit Tests:**
- Not implemented

**Integration Tests:**
- Not implemented

**E2E Tests:**
- Not implemented

## Manual Testing Approach

**Current Approach:**
The codebase relies on manual testing rather than automated tests:

- **Development workflow:** `npm run dev` for local testing
- **Linting:** `npm run lint` provides code quality checks (Next.js built-in linting)
- **Production validation:** `npm run build` catches build-time errors

**Key Areas Without Test Coverage:**
- `lib/contentFetcher.js`: Complex Notion API integration with multiple query functions
  - `getPagesFromDB()`: Database queries with filtering
  - `getPagesForSidebar()`: Pagination and sorting logic
  - `getPageIdBySlug()`: Page lookup by slug
  - `getSuggestedArticlesForPage()`: Related article suggestions
  - `convertPagePropertiesToConsumable()`: Data transformation from Notion API

- `app/en/[tag]/[post]/page.jsx`: Dynamic route generation and data fetching
  - `generateStaticParams()`: Static generation configuration
  - `getPostContent()`: Async data fetching and composition
  - Error handling with `throw new Error()`

- `partials/`: React components with state management
  - `SideNavigation.jsx`: State handling with `useState`, navigation logic
  - `WidgetPosts.jsx`: Async data fetching in `useEffect`, API calls
  - `ArticlesList.jsx`: State management and filtering logic

- `utils/Transition.jsx`: Complex animation logic with React Context

## Recommended Testing Strategy (If Added)

**Tool Selection:**
- Consider Vitest for fast unit testing (modern alternative to Jest)
- Consider Playwright for E2E testing of Next.js application
- Keep test dependencies minimal given small team context

**High Priority Areas to Test:**
1. Data fetcher functions in `lib/contentFetcher.js` - Notion API interactions
2. Component state management - `useState` in interactive components
3. Error boundaries - `error.jsx` and error throwing in pages
4. Static generation - `generateStaticParams()` correctness

**Testing Approach for This Codebase:**
```javascript
// Example pattern (if tests were added):
// Tests would import functions and mock Notion API client
import { getPagesFromDB, convertPagePropertiesToConsumable } from "@/lib/contentFetcher"

// Mock notion client in beforeEach
// Test query building, error handling, data transformation
```

## Current Quality Assurance

**What IS Tested:**
- Syntax and build errors: `npm run build`
- Code quality: `npm run lint` (Next.js built-in rules)
- Runtime behavior: Manual testing via `npm run dev`

**What IS NOT Tested:**
- Unit logic
- Integration between components
- API error scenarios
- Edge cases in data fetching
- Component rendering variations
- Navigation flows

---

*Testing analysis: 2026-02-18*
