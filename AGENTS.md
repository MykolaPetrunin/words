# Instructions for AI Agents

## Agent Expertise

Act as an expert in:

- **Next.js 15** - App Router, Server Components (data fetching), Client Components (interaction), Server Actions, Middleware
- **React 19** - Latest hooks, Concurrent Features, Suspense patterns
- **Redux Toolkit** - RTK Query, typed slices, modern Redux patterns
- **PostgreSQL & Prisma** - Database design, migrations, queries, optimization
- **TypeScript** - Advanced typing, utility types, strict configuration

Always reference `package.json` for available dependencies and versions before suggesting solutions.

## Core Rules

**CRITICALLY IMPORTANT**: Maximum TypeScript typing required.

### Mandatory:

1. **Typing**
    - Never use `any`
    - Always define interfaces for objects
    - Use generic types where appropriate
    - Explicitly specify function return types
    - Type all function parameters
    - Use union types for limited values

2. **Redux**
    - Use only typed hooks: `useAppDispatch`, `useAppSelector`
    - All slices must have typed state
    - All actions must have typed payload (`PayloadAction<T>`)

3. **React**
    - Always type props through interfaces
    - Use `React.ReactNode` for children
    - Type event handlers
    - **useEffect Usage**: Use `useEffect` ONLY for side effects and third-party integrations (APIs, subscriptions, DOM manipulation). Avoid for state calculations that can be derived during render
    - **Forms**: React Hook Form + Zod validation, reset `isDirty` after save with `setInitialData(data); reset(data);`

4. **Code Quality**
    - **FORBIDDEN** to add comments in code
    - Code must be self-documenting through proper naming
    - Use TypeScript utility types (`Partial<T>`, `Pick<T>`, `Omit<T>`)

5. **File Optimization**
    - Keep this file concise and focused
    - Remove unnecessary examples or explanations
    - Focus only on essential coding rules

## Project Structure & File Organization

These structure rules apply only to `src/components/`. The directory `src/components/ui/` is excluded and may keep its current flat structure.

## Workflow Rules

- Do not modify ESLint, Prettier, or test configurations without explicit user permission
- **NEVER make commits without explicit user permission or request**
- Commit messages: when asked to commit, create a commit message with at most 10 words describing the change. Only in english
- Failure policy: if tests or the build fail, fix the errors; do not modify test, ESLint, or Prettier configuration files during this process

### App Paths Configuration

- All application routes must be defined in `src/lib/appPaths.ts` as a strictly typed readonly object `appPaths`
- Import and use `appPaths` instead of hardcoded strings in middleware, components, tests, and services

### Component Folder Structure (only for `src/components/`)

```
rootFolder/
├─ ComponentName.tsx
├─ configs.ts
├─ utils.ts
├─ types.ts
├─ components/
└─ hooks/
```

- Folder name: `camelCase`, identical to component name
- Main component file: `ComponentName.tsx` in `PascalCase`
- Subcomponents live in `components/` with their own `PascalCase` files
- Hooks live in `hooks/` with `useMyHook.ts`
- Use `.ts` for files without JSX and `.tsx` when JSX is present
- No `index.ts` files in `src/components/` except where Next.js routing requires special files elsewhere in the app

Notes:

- The folder structure requirement does not affect `src/components/ui/`.

## Database & Prisma

- Use snake_case for all database table and column names
- Do not use uppercase identifiers in the database
- Keep Prisma models in PascalCase and fields in camelCase; map to DB with `@@map` and `@map`
- Prefer plural table names (e.g., `users`)
- Avoid reserved words as table names

## Internationalization (i18n)

- All user-facing strings must come from the i18n system
- Use global `I18nProvider` in `app/layout.tsx`
- Use `useI18n()` hook to translate: `t('namespace.key')`
- Define translations by namespace files under `src/lib/i18n/namespaces/` and aggregate them in `src/lib/i18n/translations.ts`
- Prefer namespace-per-feature (e.g., `home`, `account`, `auth`, `common`) over one giant file or per-component files
- Define type-safe keys via the utility in `src/lib/i18n/types.ts`
- Never hardcode strings in components; add keys to translations instead
- Locale source of truth is Redux `currentUser.user.locale`; fallback from cookie in `layout.tsx`

## User Feedback

- Use `sonner` toast: `toast.success(t('key'))`, `toast.error(t('key'))`
- Generic error messages, no internal details exposed
- Always handle both success/error cases in async operations

## Imports Order

- Group imports: React/Next, external libs, internal `@/` (UI, hooks, lib/types), then relative
- Sort alphabetically within each group
