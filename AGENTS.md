# Repository Guidelines

## Agent Expertise
Specialise in Next.js 15 App Router, React 19 concurrency/Suspense, Redux Toolkit with RTK Query, Prisma/PostgreSQL, and advanced TypeScript. Check `package.json` before advising on tooling.

## Core Rules
- Typing: ban `any`; define interfaces; type every parameter/return; use generics and finite unions
- Redux: only `useAppDispatch`, `useAppSelector`, typed slice state, and `PayloadAction<T>`
- React: interface-based props with `React.ReactNode` children; typed handlers; derive render state; keep `useEffect` for side effects
- Forms: apply React Hook Form + Zod; after success run `setInitialData(data); reset(data);`
- Errors: call `clientLogger.error('Form submission failed', error, { email: data.email });` then `toast.error(t('auth.error'))`; successes use `toast.success`
- Quality: forbid code comments, prefer utility types (`Partial<T>`, `Pick<T>`, `Omit<T>`), never use `console`
- Loading: every route exposes `loading.tsx`; show skeleton while `loading || (user && !reduxUser)` sized like the final UI
- Keep implementations concise

## Structure & Paths
`src/app` holds routes. Component folders in `src/components` (except `src/components/ui`) are camelCase with `ComponentName.tsx`, `types.ts`, `configs.ts`, `utils.ts`, optional `components/` and `hooks/`, and no `index.ts`. Shared hooks live in `src/hooks`; store, `appPaths`, and i18n assets in `src/lib`; tests in `src/__tests__`; mocks in `__mocks__`. Declare routes once as readonly `appPaths` in `src/lib/appPaths.ts`.

## Commands
Dev `npm run dev`; production `npm run build` → `npm run start`. Quality: `npm run lint`, `lint:fix`, `format`, `format:check`, `type-check`. Tests: `npm run test`, `test:watch`, `test:coverage`, `test:coverage:check`. Prisma: `npm run db:migrate`, `db:migrate:deploy`, `db:seed`, `db:reset`, `db:studio`.

## Standards, i18n, Feedback
Do not change ESLint, Prettier, or test configs without approval. Order imports as React/Next, external, internal `@/`, then relative, alphabetised. Serve all copy through `useI18n`; keep feature namespaces in `src/lib/i18n/namespaces`, aggregate via `src/lib/i18n/translations.ts`, type keys in `src/lib/i18n/types.ts`. Locale comes from `currentUser.user.locale` with cookie fallback in `app/layout.tsx`. Use `sonner` toasts and avoid leaking internal details.

## Testing
Use Jest with Testing Library; favour accessible roles over `data-testid`; name specs `*.test.ts(x)`; enforce coverage with `npm run test:coverage:check`; place shared mocks in `__mocks__`.

## Workflow & Environment
Never commit without explicit approval; messages in English ≤10 words. Rebase on `main`, exclude generated artefacts, and fix failing tasks without touching lint/test configs. PRs must summarise changes, link issues, provide UI screenshots, list new env vars or migrations, and note executed tests. Prisma models remain PascalCase with camelCase fields mapped to snake_case PostgreSQL tables via `@map`/`@@map`; prefer plural, non-reserved names. Manage secrets in `.env` and mirror in `env.example`.
