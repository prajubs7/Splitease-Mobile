# SplitEase Mobile — Project Context

React Native CLI (bare, not Expo) + TypeScript client for the SplitEase Spring Boot API in the sibling folder `C:/Java/splitease` (`../splitease`; see `../splitease/context.md` for the backend).

- **App name:** SplitEaseMobile (`C:/Java/splitease-mobile`)
- **Stack:** React Native 0.87, React 19, TypeScript (strict)
- **Planned libs:** React Navigation (native-stack + bottom-tabs), TanStack Query, axios, react-hook-form + zod, react-native-keychain (token storage), react-native-safe-area-context, react-native-screens, react-native-config (env)
- **Dev machine:** Windows 11, Node 22, JDK 17, Android SDK at `%LOCALAPPDATA%\Android\Sdk`. iOS cannot be built on Windows, so target Android.

---

## Running

```
# terminal 1 (backend)
docker compose up -d                       # from repo root, Postgres
# run Spring Boot with SPRING_PROFILES_ACTIVE=dev

# terminal 2 (mobile)
cd C:/Java/splitease-mobile
npx react-native start
npx react-native run-android               # emulator or USB device
```

API base URL by environment:

| Where the app runs | URL |
|--------------------|-----|
| Android emulator | `http://10.0.2.2:8080` |
| Physical phone (same Wi-Fi) | `http://<PC LAN IP>:8080` (allow port 8080 in Windows Firewall) |
| USB device | `adb reverse tcp:8080 tcp:8080`, then `http://localhost:8080` |

Android blocks cleartext HTTP by default. Dev builds need `android:usesCleartextTraffic="true"` in a **debug-only** manifest (`android/app/src/debug/AndroidManifest.xml`), never in main.

---

## Backend API contract

Base: `${API_URL}`. All `/api/v1/**` require `Authorization: Bearer <accessToken>`. All IDs are UUID strings. Errors are RFC 7807 `ProblemDetail` (`status`, `title`, `detail`; 400 adds field errors). A missing or bad token gives **401**; a non-member gets **404** (not 403); a non-owner adding a member gets **403**.

| Method | Path | Body | Response |
|--------|------|------|----------|
| GET | `/api/v1/health` | — | health |
| POST | `/api/public/auth/register` | `{email, password(min 8), fullName(max 100)}` | 201 `UserResponse {id, email, fullName, createdAt}` |
| POST | `/api/public/auth/login` | `{email, password}` | `{accessToken, tokenType, expiresIn}` |
| GET | `/api/v1/users/me` | — | `UserResponse` |
| POST | `/api/v1/groups` | `{name}` | `GroupResponse` |
| GET | `/api/v1/groups?page=0&size=20` | — | `Page<GroupResponse>` |
| GET | `/api/v1/groups/{groupId}` | — | `GroupResponse` |
| GET | `/api/v1/groups/{groupId}/members` | — | `MemberResponse[]` |
| POST | `/api/v1/groups/{groupId}/members` | `{email}` (owner only) | `MemberResponse` |
| POST | `/api/v1/groups/{groupId}/expenses` | `CreateExpenseRequest` | `ExpenseResponse` |
| GET | `/api/v1/groups/{groupId}/expenses?page&size` | — | `Page<ExpenseSummaryResponse>` |
| GET | `/api/v1/groups/{groupId}/expenses/{expenseId}` | — | `ExpenseResponse` |
| GET | `/api/v1/groups/{groupId}/balances` | — | `GroupBalancesResponse` (net balances + simplified transfers) |
| POST | `/api/v1/groups/{groupId}/settlements` | `{fromUserId, toUserId, amount}` | `SettlementResponse` |
| GET | `/api/v1/groups/{groupId}/settlements?page&size` | — | `Page<SettlementResponse>` |

`CreateExpenseRequest`:
```
{ amount: "100.00", description, paidBy: uuid, splitType: "EQUAL" | "EXACT",
  participantIds?: uuid[]        // EQUAL
  exactShares?: {userId, amount}[] // EXACT, must sum exactly to amount }
```

The exact field names of the response DTOs live in `../splitease/src/main/java/com/splitease/splitease/dto/`. Read them and mirror them in `src/api/types.ts`; do not guess.

---

## Design rules

1. **Money is never a JS `number` for arithmetic.** Keep amounts as strings at the API boundary and do math in integer cents via `src/lib/money.ts` (the backend uses `BigDecimal`, `NUMERIC(12,2)`). EQUAL splits give leftover cents to the first participants, same as the backend.
2. **Server is the source of truth.** The client validates only to give fast feedback (same rules as the backend DTOs) and always handles the server's 400/404/403/409.
3. **One axios instance** (`src/api/client.ts`): attaches the Bearer token, normalizes `ProblemDetail` into `ApiError`, and on 401 clears the session.
4. **Server state lives in TanStack Query**, not in Redux or context. Context holds only auth. After a mutation, invalidate the affected keys (an expense invalidates that group's `expenses` and `balances`).
5. **Query keys are centralized** in `src/api/keys.ts`, e.g. `['groups']`, `['groups', id, 'expenses']`, `['groups', id, 'balances']`.
6. **Token in Keychain** (react-native-keychain), never AsyncStorage. No refresh token exists yet; on expiry the user logs in again.
7. **Feature folders** keep a feature's api, hooks, screens and components together. Shared UI goes in `src/components`.
8. **Strict TypeScript**, no `any`; zod schemas validate forms.

---

## Folder structure (target)

```
splitease-mobile/
  src/
    api/          client.ts, types.ts, keys.ts, errors.ts
    lib/          money.ts, env.ts, format.ts
    navigation/   RootNavigator.tsx, AuthStack.tsx, AppTabs.tsx, types.ts
    hooks/
      useAuth.ts,
      useGroups.ts,
      useExpences.ts,
      useBalances.ts,
    services/
      auth.ts,
      group.ts,
      expenses.ts,
      balances.ts,
    features/
      auth/      
      groups/     
      expenses/  
      balances/   
    screens/
      auth/
        LoginScreen.tsx, 
        RegisterScreen.tsx
      groups/
        GroupsScreen.tsx,  MembersTab.tsx
        GroupDetailScreen.tsx,
      expences/
        ExpensesTab.tsx, 
        AddExpenseScreen.tsx,
        ExpenseDetailScreen.tsx
      balances/
        BalancesTab.tsx, SettleUpScreen.tsx
    store/
      AuthProvider.tsx, 
    components/   Button, TextField, Screen, ErrorState, EmptyState, Loading
    theme/        colors.ts, spacing.ts
  App.tsx
```

---

## Milestones (status)

| # | Milestone | Status |
|---|-----------|--------|
| 0 | Backend curl verification | Pending |
| 1 | RN CLI project scaffolded | Done (`init` ran; not yet launched on a device) |
| 2 | Tooling, deps, folders, path alias | Pending |
| 3 | API client, env, health check | Pending |
| 4 | Types and money helpers | Pending |
| 5 | Navigation and auth flow | Pending |
| 6 | Groups and members | Pending |
| 7 | Expenses | Pending |
| 8 | Balances and settle up | Pending |
| 9 | Polish and error handling | Pending |
| 10 | Tests (kept local, not pushed) | Pending |
| 11 | Release build | Pending |

Prompts for each milestone are in `PROMPTS.md`. Update this table as you finish each one.

---

## Known backend gaps

- No refresh token, so the session ends when the JWT expires.
- No edit or delete for expenses or groups.
- Members are added by exact email; there is no user search.
