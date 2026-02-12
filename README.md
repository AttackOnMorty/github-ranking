# GitHub Ranking

<img width="1203" height="754" alt="image" src="https://github.com/user-attachments/assets/e0245309-678c-4cfa-9d12-b15099ee0cac" />

## Project Overview

GitHub Ranking is a Next.js 16 web application that displays rankings of GitHub repositories, users, and organizations by stars, forks, and followers. Uses the GitHub Search API via Octokit.

## Development Commands

```bash
pnpm dev          # Start development server at localhost:3000
pnpm build        # Build for production
pnpm lint         # Run ESLint
pnpm start        # Start production server
```

## Environment Setup

Copy `.example.env` to `.env.local` and add a GitHub personal access token:

```
GITHUB_ACCESS_TOKEN="your_token"
```

## Architecture

### Data Flow

1. **Server Actions** (`api/index.ts`) - Octokit-based functions with `'use server'` directive call GitHub API
2. **SWR Hooks** (`hooks/use-github-api.ts`) - Client-side data fetching with 24-hour cache
3. **Pages** (`app/`) - Client components that consume hooks

### Key Directories

- `api/` - Server actions wrapping GitHub API calls (getTopReposAsync, getTopUsersAsync, etc.)
- `hooks/` - SWR hooks for all data fetching
- `context/` - LanguageProvider fetches and shares available programming languages globally
- `components/ui/` - shadcn/ui components (radix-lyra style, hugeicons icons)
- `app/repositories/_components/` - Repository page-specific components

### Important Patterns

- Organizations page (`app/organizations/`) reuses `UserTable` from users page with `USER_TYPE.ORGANIZATION`
- GitHub API limits search results to 1000 items max (`MAX_DATA_COUNT` in constants)
- Language list is fetched from GitHub Linguist's YAML file

### Path Aliases

Use `@/` for imports from project root (configured in tsconfig.json).
