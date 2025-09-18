# Instructions for AI Agents

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
- Commit messages: when asked to commit, create a commit message with at most 10 words describing the change. Only in english
- Failure policy: if tests or the build fail, fix the errors; do not modify test, ESLint, or Prettier configuration files during this process

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
