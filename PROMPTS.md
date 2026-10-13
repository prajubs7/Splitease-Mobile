# Implementation prompts

Paste one at a time into Claude Code, opened in `C:/Java/splitease-mobile`. Read `context.md` first. After each step: run it, verify, commit on `feature/mobile-<step>`, then tick the milestone in `context.md`.

Good habit: end each prompt with "Then explain the 2-3 key decisions and why."

---

## 0. Backend check
> Read `../splitease/context.md` (backend repo at `C:/Java/splitease`). Start Postgres with `docker compose up -d` and run the backend with the `dev` profile. Using curl, walk register → login → `users/me` → create group → add member → create EQUAL expense → create EXACT expense → balances → settlement. Report any failures. Don't change code yet.

## 1. First launch
> Make sure `npx react-native doctor` passes for Android. Help me create/start an Android emulator, run `npx react-native run-android`, and confirm the default screen shows. Fix any Gradle, JDK or SDK problems. Don't add features yet.

## 2. Tooling and dependencies
> Following `context.md`, install: `@react-navigation/native`, `@react-navigation/native-stack`, `@react-navigation/bottom-tabs`, `react-native-screens`, `react-native-safe-area-context`, `@tanstack/react-query`, `axios`, `react-hook-form`, `zod`, `@hookform/resolvers`, `react-native-keychain`, `react-native-config`. Configure each one's Android setup. Add a `@/` path alias for `src/` in tsconfig and babel (`babel-plugin-module-resolver`). Create the folder structure from `context.md` with empty placeholder files where needed. Make sure `npx tsc --noEmit` and `npm run lint` pass and the app still launches.

## 3. API client and environment
> Create `.env` (git-ignored) and `.env.example` with `API_URL=http://10.0.2.2:8080`, read through `src/lib/env.ts`. Add the debug-only cleartext manifest from `context.md`. Create `src/api/client.ts` (axios instance, Bearer interceptor reading the token from a small `tokenStore`, a 401 handler hook) and `src/api/errors.ts` (`ApiError` built from `ProblemDetail`, including field errors). Show the `/api/v1/health` result on a temporary screen to prove the app reaches the backend on the emulator.

## 4. Types and money
> Read every record in `../splitease/src/main/java/com/splitease/splitease/dto/` and write matching TypeScript types in `src/api/types.ts`, plus a `Page<T>` type matching Spring's paged JSON (check a real response with curl). Write `src/lib/money.ts`: `toCents(str)`, `fromCents(n)`, `formatMoney(str)`, `splitEqual(totalCents, n)` (leftover cents to the first participants, same as the backend). Write unit tests for it, including 100.00 / 3.

## 5. Navigation and auth
> Implement React Navigation with an `AuthStack` (Login, Register) and an `AppTabs`/stack shown only when signed in. Build `AuthProvider` + `useAuth()`: keep the token in Keychain, restore the session at launch via `GET /users/me`, expose `login`, `register`, `logout`, and log out automatically on a 401. Build Login and Register screens with react-hook-form + zod using the backend's rules (email, password min 8, fullName max 100) and map server field errors onto the form. Show a splash while restoring the session.

## 6. Groups and members
> Add TanStack Query (`QueryClientProvider`, sane defaults). Implement `useGroups` (infinite query over the paged endpoint), `useCreateGroup`, `useGroup`, `useMembers`, `useAddMember`. Screens: Groups list (pull-to-refresh, empty state, FAB to create), Create Group modal, Group Detail with three tabs (Expenses, Balances, Members). Members tab lists members with roles and has an "add by email" form, showing readable messages for 403 (not owner) and 404 (no such user).

## 7. Expenses
> Build the Add Expense screen: amount, description, payer picker (group members), and an Equal/Exact toggle. Equal: participant checklist plus a live per-person preview from `splitEqual`. Exact: an amount input per participant with a live "remaining" indicator; disable submit until the shares sum exactly to the amount. Send a `CreateExpenseRequest`. Build the Expenses tab (paged list) and Expense Detail (shows splits). On success invalidate that group's `expenses` and `balances` queries.

## 8. Balances and settle up
> Build the Balances tab from `GET /groups/{id}/balances`: each member's net balance (green = is owed, red = owes) and the simplified "who pays whom" list. Each transfer has a "Settle up" action that opens a confirm sheet and POSTs a settlement. Add a settlements history list (paged). Invalidate balances and settlements after a settle.

## 9. Polish
> Add a shared `Button`, `TextField`, `Screen`, `EmptyState`, `ErrorState` and loading skeletons. Handle safe areas, keyboard avoiding in forms, dark mode, accessibility labels and a global error boundary. Show a toast or banner for mutation errors, with a distinct message for network/timeout failures. Use `FlatList` correctly (keyExtractor, no inline heavy renders).

## 10. Tests (keep local, don't push)
> Set up Jest + React Native Testing Library (the template already has Jest). Add tests for `money.ts`, the exact-split validator, the login form, and the axios error normalizer / 401 handling (mock with MSW or axios-mock-adapter). Per my saved preference, keep tests out of commits to the remote.

## 11. Release build
> Create a release keystore (not committed), configure `android/app/build.gradle` signing from `gradle.properties`/env, set the production `API_URL`, remove cleartext for release, and produce `./gradlew assembleRelease`. Explain how to install the APK and what's needed for a Play Store AAB (`bundleRelease`).

---

## Backend follow-ups (separate small prompts, when needed)
- Add a refresh-token flow, then use an axios refresh interceptor.
- Add edit/delete for expenses and groups.
- Add springdoc-openapi, then generate TS types from the OpenAPI spec instead of hand-writing `types.ts`.
