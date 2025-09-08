# GitHub Ranking

## Project Overview

GitHub Ranking is a Next.js application that searches and displays GitHub's top repositories, users, and organizations. It uses the GitHub API with Octokit, Ant Design for UI components, SWR for data fetching, and Tailwind CSS for styling.

## Development Commands

**Setup:**

```bash
# Install dependencies
pnpm install

# Copy environment file and add GitHub token
cp .example.env .env
# Edit .env and add your NEXT_PUBLIC_GITHUB_ACCESS_TOKEN
```

**Development:**

```bash
# Start development server with Turbopack
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint
```

## Architecture Overview

### Core Structure

- **Next.js 15** with App Router and React 19
- **TypeScript** with strict configuration
- **Ant Design** for UI components with custom theming
- **SWR** for data fetching with aggressive caching (24 hours)
- **Tailwind CSS v4** for styling
- **Octokit** for GitHub API integration

### Key Architectural Patterns

**Data Flow:**

1. API layer (`src/api/`) handles all GitHub API calls via Octokit
2. Custom hooks (`src/hooks/use-github-api.ts`) wrap API calls with SWR caching
3. Components consume data through these hooks
4. Global language context provides programming languages to all components

**Caching Strategy:**

- SWR with 24-hour cache duration for most data
- No revalidation on focus, revalidates on reconnect
- Aggressive deduplication to minimize API calls

**Page Structure:**

- Root redirects to `/repositories`
- Three main views: repositories, users, organizations
- Each has filtering by language, topics/location, and pagination
- Shared table-based UI with responsive columns

### API Integration Details

**GitHub API Limits:**

- Minimum count filters (100) to ensure stable data
- Maximum 1000 results per search (GitHub API limit)
- Page size of 20 items
- Uses personal access tokens for authentication

**Search Patterns:**

- Repositories: `stars:>100` or `forks:>100` + optional language/topic filters
- Users/Organizations: `followers:>100` + optional language/location filters
- Topics: Featured topics or search-based topic discovery

### Component Architecture

**Layout Hierarchy:**

```
RootLayout (AntdRegistry + ConfigProvider + LanguageProvider)
├── Header (navigation)
├── Main Content (max-width container)
└── Footer
```

**Page Components:**

- Each main page (`repositories/`, `users/`, `organizations/`) follows the same pattern:
  - Filter controls in table title
  - Ant Design Table with pagination
  - Loading skeletons during data fetch
  - Error boundary with ErrorState component

**Shared Components:**

- `UserAvatar`: GitHub user avatar with fallbacks
- `ErrorState`: Generic error display
- Loading skeletons for each data type

### Environment Configuration

**Required Environment Variables:**

- `NEXT_PUBLIC_GITHUB_ACCESS_TOKEN`: GitHub personal access token

**Build Configuration:**

- Next.js with Turbopack for faster builds
- Image optimization for GitHub avatars
- TypeScript with path aliases (`@/*` → `./src/*`)

### Styling Approach

**Tailwind CSS v4:**

- Uses new `@import 'tailwindcss'` syntax
- Custom CSS properties for theming
- Responsive design with mobile-first approach
- Dark mode support through CSS media queries

**Ant Design Integration:**

- Custom font family inheritance
- Fira Code font for consistent monospace styling
- Custom theme tokens integrated with Tailwind

### Data Types and Constants

**Core Types** (`src/api/types.ts`):

- `Repo`: Repository with owner, stats, and metadata
- `User`: User/organization with profile data
- `Topic`: GitHub topics with display names

**Constants** (`src/constants/`):

- `PAGE_SIZE`: 20 items per page
- `MAX_DATA_COUNT`: 1000 (GitHub API limit)
- `USER_TYPE`: User vs organization classification

### Utilities

**Language Handling:**

- Fetches language list from GitHub Linguist YAML
- Groups popular languages separately in dropdowns
- Context provider makes languages globally available

**Data Formatting:**

- Number formatting (1000+ → "1k")
- Emoji conversion for GitHub-style text
- URL and avatar fallback handling

## Development Notes

When adding new features:

- Follow the established SWR + API hook pattern
- Use existing TypeScript types or extend them
- Maintain responsive design with Ant Design breakpoints
- Consider GitHub API rate limits and caching implications
- Test with different filter combinations

The codebase prioritizes performance through aggressive caching and minimal re-renders, while maintaining a consistent user experience across all ranking views.
